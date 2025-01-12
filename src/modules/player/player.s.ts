import { Repository } from "typeorm";
import { DatabaseService } from "../../database/database.service";
import convertTimeToPoint from "../../lib/socket/utils/convertTimeToPoint";
import { abortCooldown } from "../../lib/socket/utils/cooldown";
import { inviteCodeValidator, usernameValidator } from "../../lib/socket/validator";
import { Games } from "../../database/entities/games.entity";
import { QuizAnswers } from "../../database/entities/quiz_answers.entity";
import { QuizQuestions } from "../../database/entities/quiz_questions.entity";
import { RoomPlayers } from "../../database/entities/room_players.entity";
import { PlayerAnswers } from "../../database/entities/player_answers.entity";
import { GameRooms } from '../../database/entities/game_rooms.entity';
import { GameResults } from "../../database/entities/game_results.entity";
import { CurrentQuestions } from "../../database/entities/current_questions.entity";
import { username } from '../../lib/joy/common';

export class Player {
  private readonly gamesRepository: Repository<Games>;
  private readonly quizAnswersRepository: Repository<QuizAnswers>;
  private readonly quizQuestionsRepository: Repository<QuizQuestions>;
  private readonly roomPlayersRepository: Repository<RoomPlayers>;
  private readonly playerAnswerRepository: Repository<PlayerAnswers>;
  private readonly gameRoomsRepository: Repository<GameRooms>;
  private readonly gameResultsRepository: Repository<GameResults>;
  private readonly currentQuestionsRepository: Repository<CurrentQuestions>;

  constructor() {
    this.gamesRepository = DatabaseService.getInstance().getRepository(Games);
    this.quizAnswersRepository = DatabaseService.getInstance().getRepository(QuizAnswers);
    this.quizQuestionsRepository = DatabaseService.getInstance().getRepository(QuizQuestions);
    this.roomPlayersRepository = DatabaseService.getInstance().getRepository(RoomPlayers);
    this.playerAnswerRepository = DatabaseService.getInstance().getRepository(PlayerAnswers);
    this.gameRoomsRepository = DatabaseService.getInstance().getRepository(GameRooms);
    this.gameResultsRepository = DatabaseService.getInstance().getRepository(GameResults);
    this.currentQuestionsRepository = DatabaseService.getInstance().getRepository(CurrentQuestions);
  }

  async join(io: any, socket: any, player: any, manager, players): Promise<void> {
    socket.join(player.gameID);
    try {
      await usernameValidator.validate(player.username);
    } catch (error) {
      socket.emit("game:errorMessage", error?.errors[0]);
      socket.leave(player.gameID);
      return;
    }
    const game = await this.gamesRepository.findOne({ where: { id: player.gameID } });
    if (!game) {
      socket.emit("game:errorMessage", "Game not found");
      socket.leave(player.gameID);
      return;
    }
    const gameRoom = await this.gameRoomsRepository.findOne({ where: { game_id: player.gameID } });
    if (!gameRoom) {
      socket.emit("game:errorMessage", "Room not found");
      socket.leave(player.gameID);
      return;
    }

    const roomPlayer = await this.roomPlayersRepository.findOne({ where: { game_room_id: gameRoom.id, customer_id: player.id } });
    if (roomPlayer) {
      socket.emit("game:errorMessage", "Username already exists");
      socket.leave(player.gameID);
      return;
    }

    if (game.started) {
      socket.emit("game:errorMessage", "Game already started");
      socket.leave(player.gameID);

      return;
    }

    console.log("New Player", player);
    const playerData = {
      username: player.username,
      room: player.gameID,
      id: socket.id,
      points: 0,
    };
    const key = `players-${player.gameID}`;
    const existingSockets = players.get(key) || [];
    
    if (!existingSockets.includes(socket.id)) {
        players.set(key, [...existingSockets, socket.id]);
    }

    const socketIDManager = manager.get(`manager-${player.gameID}`)
    if(socketIDManager)
    {
      for(const socketID of socketIDManager)
        {
          io.to(socketID).emit("manager:newPlayer", { ...playerData });
        }
    }
    await this.roomPlayersRepository.save({
      game_room_id: gameRoom.id,
      username: player.username || "Player",
      customer_id: player.id,
      points: 0,
    })
    socket.emit("game:successJoin",{ id: player.id });
  }

  async selectedAnswer(io: any, socket: any, data: any, manager:any): Promise<void> {
    const {answer, gameID, id} = data;
    const gameRooms = await this.gameRoomsRepository.findOne({ where: { game_id: gameID } });
    const roomPlayer = await this.roomPlayersRepository.find({ where: { game_room_id: gameRooms?.id} });
    const currentQuestions = await this.currentQuestionsRepository.findOne(
                                                                          { where: { game_room_id: gameRooms?.id },
                                                                            relations:{
                                                                              quiz_question: true
                                                                            } 
                                                                          });
    if (!roomPlayer || !gameRooms || !currentQuestions) {
      return;
    }
    const quizAnswers = await this.quizAnswersRepository.find({
      where: { question: { id: currentQuestions.quiz_question.id } },
      
    });

    const quizAnswer = quizAnswers[Number(answer)];
    
    const quizQuestionId = currentQuestions?.quiz_question.id;
    const quizQuestion = await this.quizQuestionsRepository.findOne({ where: { id: quizQuestionId }, relations:{
      solution: true
    } });
    let point = convertTimeToPoint(currentQuestions.updatedAt, quizQuestion?.time);
    if(quizAnswer?.id !== quizQuestion?.solution?.id){
      point = 0;
    }
    if(quizQuestion){
      await this.playerAnswerRepository.save({
        time: new Date().toISOString(),
        answer: quizAnswer,
        point:point,
        customer_id: id,
        game_room_id: gameRooms.id,
        questions: quizQuestion
      });
    }

    const answers = await this.playerAnswerRepository.find({ where: { game_room_id: gameRooms.id,
      questions:{
        id: quizQuestion?.id
      }
     } 
    });
    const lengthAnswer = answers?.length ?? 0;
    socket.emit("game:status", {
      name: "WAIT",
      data: { text: "Waiting for the players to answer" },
    });
    socket.to(gameRooms?.id).emit("game:playerAnswer", lengthAnswer);
    const socketIDManager = manager.get(`manager-${gameID}`)
    if(socketIDManager)
    {
      for(const socketID of socketIDManager)
        {
          io.to(socketID).emit("game:playerAnswer", lengthAnswer);
        }
    }
    if (lengthAnswer === roomPlayer.length) {
      abortCooldown();
    }
  }

  public  async saveRoomPlayer({ gameID, playerID, point }) {
    const roomPlayer = await this.roomPlayersRepository.findOne({
      where: {
        customer_id: playerID,
        game_room_id: gameID,
      },
    });
  
    if (roomPlayer) {
      roomPlayer.score = (roomPlayer.score || 0) + Number(point);
      return await this.roomPlayersRepository.save(roomPlayer);
    } else {
      throw new Error('Room player not found');
    }
  }

}

export default new Player;