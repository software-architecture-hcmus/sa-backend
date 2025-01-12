import { Repository } from "typeorm";
import { DatabaseService } from "../../database/database.service";
import { Games } from "../../database/entities/games.entity";
import { DefaultGames } from "../../database/entities/default_game.entity";
import { QuizAnswers } from "../../database/entities/quiz_answers.entity";
import { QuizQuestions } from "../../database/entities/quiz_questions.entity";
import { GameTurns } from "../../database/entities/game_turns.entity";
import { GameRooms } from "../../database/entities/game_rooms.entity";

class GameService {
    private readonly gameRepository: Repository<Games>;
    private readonly defaultGameRepository: Repository<DefaultGames>;
    private readonly quizAnswersRepository: Repository<QuizAnswers>;
    private readonly quizQuestionsRepository: Repository<QuizQuestions>;
    private readonly gameTurnsRepository: Repository<GameTurns>;
    private readonly gameRoomRepository: Repository<GameRooms>;
    constructor() {
        this.gameRepository = DatabaseService.getInstance().getRepository(Games);
        this.defaultGameRepository = DatabaseService.getInstance().getRepository(DefaultGames);
        this.quizAnswersRepository = DatabaseService.getInstance().getRepository(QuizAnswers);
        this.quizQuestionsRepository = DatabaseService.getInstance().getRepository(QuizQuestions);
        this.gameTurnsRepository = DatabaseService.getInstance().getRepository(GameTurns);
        this.gameRoomRepository = DatabaseService.getInstance().getRepository(GameRooms);
    }
    async getById(id: string) {
        return await this.gameRepository.findOne({ where: { id },
            relations: {
                default_game: true,
                rooms: {
                    questions:{
                        answers: true
                    }
                },
                event: true,
                game_turn: true
            }
        });
    }

    async getAll() {
        return await this.gameRepository.find();
    }

    async createGameQuiz( createGameData: any) {
        const type = createGameData.type;
        const defaultGame = await this.defaultGameRepository.findOne({ where: { game_type: { id: type } } });
        if (!defaultGame) {
            throw new Error("Game type not found");
        }
        const game =  this.gameRepository.create({
            name: createGameData.name || defaultGame.name,
            image: createGameData.image || defaultGame.image,
            allow_voucher_exchange: createGameData.allow_voucher_exchange || defaultGame.allow_voucher_exchange,
            instruction: createGameData.instruction || defaultGame.instruction,
            status: createGameData.status || defaultGame.status,
            started: createGameData.started || false,
            default_game: defaultGame,
            event: createGameData.event,
        })
        await this.gameRepository.save(game);
        const gameTurn = this.gameTurnsRepository.create({
            quantity: 1,
            games: game,
            account_id: createGameData.brand_id,
        });
        await this.gameTurnsRepository.save(gameTurn);

        const gameRoom = this.gameRoomRepository.create({
            games: game,
        });
        await this.gameRoomRepository.save(gameRoom);

        const questions = createGameData.questions;
        for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];
            const question = this.quizQuestionsRepository.create({
                content: questionData.content,
                image: questionData.image,
                cooldown: questionData.cooldown,
                time: questionData.time,
                games: gameRoom,
                position: i
            });
            await this.quizQuestionsRepository.save(question);
    
            const answers : QuizAnswers[]  = [];
            for (const answerData of questionData.answers) {
                const answer =  this.quizAnswersRepository.create(
                    {
                        content: answerData.content,
                        question: question,
                    }
                );
                await this.quizAnswersRepository.save(answer);
                answers.push(answer);
            }
    
            question.answers = answers;
            question.solution = answers[questionData.solution];

            await this.quizQuestionsRepository.save(question);
        }
        return game;
    }

    async createGameFlappyBird( createGameData: any, ) {
        const type = createGameData.type;
        const defaultGame = await this.defaultGameRepository.findOne({ where: { game_type: { id: type } } });
        if (!defaultGame) {
            throw new Error("Game type not found");
        }
        const game =  this.gameRepository.create({
            name: createGameData.name || defaultGame.name,
            image: createGameData.image || defaultGame.image,
            allow_voucher_exchange: createGameData.allow_voucher_exchange || defaultGame.allow_voucher_exchange,
            instruction: createGameData.instruction || defaultGame.instruction,
            status: createGameData.status || defaultGame.status,
            started: createGameData.started || false,
            default_game: defaultGame,
            event: createGameData.event,
        })
        await this.gameRepository.save(game);

        const gameTurn = this.gameTurnsRepository.create({
            quantity: createGameData.play_count,
            games: game,
            account_id: createGameData.brand_id,
        });
        await this.gameTurnsRepository.save(gameTurn);

        const gameRoom = this.gameRoomRepository.create({
            games: game,
        });
        await this.gameRoomRepository.save(gameRoom);

        return game;
    }

    async saveResult() {
        
    }

    async createQuestion() {
       
    }

    async deleteQuestion() {
       
    }

    async updateQuestion() {
       
    }

    async getDefault() {    
        return await this.defaultGameRepository.find();
    }

    async updateDefault(id: string, data: any) {
        const defaultGame = await this.defaultGameRepository.findOne({ where: { id } });
        if (!defaultGame) {
            throw new Error("Default game not found");
        }
        Object.assign(defaultGame, {
            name: data.name,
            image: data.image,
            instruction: data.instruction,
            status: data.status,
            allow_voucher_exchange: data.allow_voucher_exchange,
            game_type: data.game_type,
        });
        return await this.defaultGameRepository.save(defaultGame);
    }
}

export default new GameService();