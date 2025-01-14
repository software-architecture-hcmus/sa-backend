import { Repository } from "typeorm"
import { DatabaseService } from "../../../database/database.service"
import { DefaultGames } from "../../../database/entities/default_game.entity"
import { GameRooms } from "../../../database/entities/game_rooms.entity"
import { GameTurns } from "../../../database/entities/game_turns.entity"
import { Games } from "../../../database/entities/games.entity"
import { QuizAnswers } from "../../../database/entities/quiz_answers.entity"
import { QuizQuestions } from "../../../database/entities/quiz_questions.entity"
import { PlayerAnswers } from "../../../database/entities/player_answers.entity"
import { abortCooldown, cooldown, sleep } from "../utils/cooldown"
import { startRound } from "../utils/round"
import { CurrentQuestions } from "../../../database/entities/current_questions.entity"
class Manager {
  private readonly gameRepository: Repository<Games>;
  private readonly defaultGameRepository: Repository<DefaultGames>;
  private readonly quizAnswersRepository: Repository<QuizAnswers>;
  private readonly quizQuestionsRepository: Repository<QuizQuestions>;
  private readonly gameTurnsRepository: Repository<GameTurns>;
  private readonly gameRoomRepository: Repository<GameRooms>;
  private readonly playerAnswersRepository: Repository<PlayerAnswers>;
  private readonly currentQuestionRepository: Repository<CurrentQuestions>
  constructor() {
    this.gameRepository = DatabaseService.getInstance().getRepository(Games);
    this.defaultGameRepository = DatabaseService.getInstance().getRepository(DefaultGames);
    this.quizAnswersRepository = DatabaseService.getInstance().getRepository(QuizAnswers);
    this.quizQuestionsRepository = DatabaseService.getInstance().getRepository(QuizQuestions);
    this.gameTurnsRepository = DatabaseService.getInstance().getRepository(GameTurns);
    this.gameRoomRepository = DatabaseService.getInstance().getRepository(GameRooms);
    this.playerAnswersRepository = DatabaseService.getInstance().getRepository(PlayerAnswers);
    this.currentQuestionRepository = DatabaseService.getInstance().getRepository(CurrentQuestions)
  }

  async startGame(io, socket, id, playersS) {

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
    const currentQuestion = gameData?.rooms[0]?.current_questions;
    if (!currentQuestion || currentQuestion.length === 0) {
      gameData['currentQuestion'] = gameData.rooms[0].questions.find(question => question.position === 0);
    }
    else {
      gameData['currentQuestion'] = currentQuestion;
    }
    let currentQuestionEntity = await this.currentQuestionRepository.findOne({
      where: { game_room_id: gameData.rooms[0].id }
    });
    if (currentQuestionEntity) {
      // Cập nhật currentQuestion nếu đã tồn tại
      currentQuestionEntity.quiz_question = gameData['currentQuestion'];
    } else {
      // Tạo mới currentQuestion nếu chưa tồn tại
      currentQuestionEntity = new CurrentQuestions();
      currentQuestionEntity.game_room_id = gameData.rooms[0].id;
      currentQuestionEntity.quiz_question = gameData['currentQuestion'];
    }
    await this.currentQuestionRepository.save(currentQuestionEntity);

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
    const playersSockets = playersS.get(`players-${id}`);
    if(!playersSockets)
    {
      return
    }
    socket.emit("game:status", {
      name: "SHOW_START",
      data: {
        time: 3,
        subject: "Start game",
      },
    })
    
    for(const playersSocket of playersSockets)
      {
        io.to(playersSocket).emit("game:status", {
          name: "SHOW_START",
          data: {
            time: 3,
            subject: "Start game",
          },
        })
      }
    

    await sleep(3)
    socket.emit("game:startCooldown")
    for(const playersSocket of playersSockets)
      {
        io.to(playersSocket).emit("game:startCooldown")
      }

    await cooldown(3, io, id, playersSockets, socket )
    gameData.started = true;
    const gameRepo = await this.gameRepository.findOne({
      where: {
        id: id,
      },
    });
    
    if (gameRepo) {
      gameRepo.started = true;
      await this.gameRepository.save(gameRepo);
    }
    startRound(gameData, io, socket, id, playersSockets)
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

  async nextQuestion(id, io, socket, players) {
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
    if (!gameData || !gameData.started) {
      return
    }
    let currentQuestionEntity = await this.currentQuestionRepository.findOne({
      where: { game_room_id: gameData.rooms[0].id },
      relations:{
        quiz_question: true
      }
    }); 
    if (currentQuestionEntity && gameData.rooms[0].questions.length <= currentQuestionEntity.quiz_question.position + 1) {
      return
    }
    const playersSockets = players.get(`players-${id}`);
    let crQuestion: QuizQuestions | undefined;
    
    if (currentQuestionEntity) {
      crQuestion = gameData.rooms[0].questions.find(
        (question) => question.position === currentQuestionEntity.quiz_question.position + 1
    );
    } else {
      crQuestion = gameData.rooms[0].questions.find((question) => question.position === 0);
    }
    if (crQuestion) {
      gameData['currentQuestion'] = crQuestion;
      currentQuestionEntity = currentQuestionEntity || new CurrentQuestions();
      currentQuestionEntity.game_room_id = gameData.rooms[0].id;
      currentQuestionEntity.quiz_question = crQuestion;
    
      await this.currentQuestionRepository.save(currentQuestionEntity);
    } else {
      // Xử lý trường hợp không tìm thấy câu hỏi phù hợp
      console.error('No suitable question found');
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

    const playersS = gameData?.rooms[0]?.room_players;
    if(!playersS || playersS.length === 0)
    {
      gameData['players'] = [];
    }
    else
    {
      gameData['players'] = playersS;
    }
    startRound(gameData, io, socket, id, playersSockets)
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

  async showLoaderboard(io, socket, id, players) {
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
          current_questions: {
            quiz_question: true
          },
          room_players: true,
        },
        event: true,
        game_turn: true
      }
    })
    if (!gameData || !gameData.started) {
      return
    }
    const currentQuestion = gameData?.rooms[0]?.current_questions;
    const playersSockets = players.get(`players-${id}`);
    if (gameData?.rooms[0]?.questions?.length <= currentQuestion[0]?.quiz_question?.position + 1) {
      socket.emit("game:status", {
        name: "FINISH",
        data: {
          subject: gameData.name,
          top: gameData?.rooms[0]?.room_players?.slice(0, 3).sort((a, b) => b.score - a.score),
        },
      })
      if(playersSockets)
      {
        playersSockets.forEach(element => 
          {
            io.to(element).emit("game:status", {
              name: "FINISH",
              data: {
                subject: gameData.name,
                top: gameData?.rooms[0]?.room_players.sort((a, b) => b.score - a.score),
              },
            })
          })
      }
      return
    }

    socket.emit("game:status", {
      name: "SHOW_LEADERBOARD",
      data: {
        leaderboard: gameData?.rooms[0]?.room_players
          .sort((a, b) => b.score - a.score)
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
      },
      relations:{
        answer: true
      }
    })
  }
  async joinRoom(io, socket, id, manager)
  {
    const key = `manager-${id.id}`;
    const existingSockets = manager.get(key) || [];
    if (!existingSockets.includes(socket.id)) {
      manager.set(key, [...existingSockets, socket.id]);
  }
    socket.join(id);
  }
}

export default new Manager()
