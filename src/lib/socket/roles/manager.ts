import { Repository } from "typeorm"
import { DatabaseService } from "../../../database/database.service"
import { DefaultGames } from "../../../database/entities/default_game.entity"
import { GameRooms } from "../../../database/entities/game_rooms.entity"
import { GameTurns } from "../../../database/entities/game_turns.entity"
import { Games } from "../../../database/entities/games.entity"
import { QuizAnswers } from "../../../database/entities/quiz_answers.entity"
import { QuizQuestions } from "../../../database/entities/quiz_questions.entity"
import { PlayerAnswers } from "../../../database/entities/player_answers.entity"
import { GAME_STATE_INIT } from "../config"
import { abortCooldown, cooldown, sleep } from "../utils/cooldown"
import deepClone from "../utils/deepClone"
import { startRound } from "../utils/round"

class Manager {
  private readonly gameRepository: Repository<Games>;
  private readonly defaultGameRepository: Repository<DefaultGames>;
  private readonly quizAnswersRepository: Repository<QuizAnswers>;
  private readonly quizQuestionsRepository: Repository<QuizQuestions>;
  private readonly gameTurnsRepository: Repository<GameTurns>;
  private readonly gameRoomRepository: Repository<GameRooms>;
  private readonly playerAnswersRepository: Repository<PlayerAnswers>;
  constructor() {
    this.gameRepository = DatabaseService.getInstance().getRepository(Games);
    this.defaultGameRepository = DatabaseService.getInstance().getRepository(DefaultGames);
    this.quizAnswersRepository = DatabaseService.getInstance().getRepository(QuizAnswers);
    this.quizQuestionsRepository = DatabaseService.getInstance().getRepository(QuizQuestions);
    this.gameTurnsRepository = DatabaseService.getInstance().getRepository(GameTurns);
    this.gameRoomRepository = DatabaseService.getInstance().getRepository(GameRooms);
    this.playerAnswersRepository = DatabaseService.getInstance().getRepository(PlayerAnswers);
  }

  async startGame(io, socket, id) {

    const gameData = await this.gameRepository.findOne({
      where: {
        id: id
      },
      relations: {
        default_game: true,
        rooms: {
          questions: {
            answers: true,
            solution: true
          },
          current_questions: true,
          room_players: true,
        },
        event: true,
        game_turn: true
      }
    })
    if (!gameData || gameData.started) {
      return;
    }
    socket.join(id);
    
    const currentQuestion = gameData?.rooms[0]?.current_questions;
    if (!currentQuestion || currentQuestion.length === 0) {
      gameData['currentQuestion'] = gameData.rooms[0].questions.find(question => question.position === 0);
    }
    else {
      gameData['currentQuestion'] = currentQuestion;
    }

    if (gameData && gameData.rooms && gameData.rooms.length > 0 
      && gameData.rooms[0].questions && gameData.rooms[0].questions.length > 0) 
    {
      const questions = gameData.rooms[0].questions;
      gameData['questions'] = questions;
    }
    else {
      gameData['questions'] = []
    }

    const players = gameData?.rooms[0]?.room_players;
    if(!players || players.length === 0)
    {
      gameData['players'] = [];
    }
    else
    {
      gameData['players'] = players;
    }

    delete gameData.rooms;
    io.to(id).emit("game:status", {
      name: "SHOW_START",
      data: {
        time: 3,
        subject: "Start game",
      },
    })

    await sleep(3)
    io.to(id).emit("game:startCooldown")

    await cooldown(3, io, id)
    gameData.started = true;
    // TODO: update started to database
    startRound(gameData, io, socket, id)
  };

  kickPlayer(game, io, socket, playerId) {
    if (game.manager !== socket.id) {
      return
    }

    const player = game.players.find((p) => p.id === playerId)
    game.players = game.players.filter((p) => p.id !== playerId)

    io.in(playerId).socketsLeave(game.room)
    io.to(player.id).emit("game:kick")
    io.to(game.manager).emit("manager:playerKicked", player.id)
  };

  nextQuestion(game, io, socket) {
    if (!game.started) {
      return
    }

    if (socket.id !== game.manager) {
      return
    }

    if (!game.questions[game.currentQuestion + 1]) {
      return
    }

    game.currentQuestion++
    startRound(game, io, socket, null)
  };

  abortQuiz(game, io, socket) {
    if (!game.started) {
      return
    }

    if (socket.id !== game.manager) {
      return
    }

    abortCooldown()
  };

  showLoaderboard(game, io, socket) {
    if (!game.questions[game.currentQuestion + 1]) {
      socket.emit("game:status", {
        name: "FINISH",
        data: {
          subject: game.subject,
          top: game.players.slice(0, 3).sort((a, b) => b.points - a.points),
        },
      })

      game = deepClone(GAME_STATE_INIT)
      return
    }

    socket.emit("game:status", {
      name: "SHOW_LEADERBOARD",
      data: {
        leaderboard: game.players
          .sort((a, b) => b.points - a.points)
          .slice(0, 5),
      },
    })
  }

  async getPlayerAnswer(question_id)
  {
    return await this.playerAnswersRepository.find({
      where: {
        questions :{
          id: question_id
        }
      }
    })
  }
}

export default new Manager()
