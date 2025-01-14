import { Repository } from "typeorm";
import { DatabaseService } from "../../database/database.service";
import { Games } from "../../database/entities/games.entity";
import { DefaultGames } from "../../database/entities/default_game.entity";
import { QuizAnswers } from "../../database/entities/quiz_answers.entity";
import { QuizQuestions } from "../../database/entities/quiz_questions.entity";
import { GameTurns } from "../../database/entities/game_turns.entity";
import { GameRooms } from "../../database/entities/game_rooms.entity";
import { GameResults } from "../../database/entities/game_results.entity";
import { Voucher } from "../../database/entities/voucher.entity";
import { CustomerVoucher } from "../../database/entities/customer_vouchers.entity";
import { RequestTurn } from "../../database/entities/request_turns.entity";
import { TripleStatus } from "../../database/enums/triple-status.enum";
class GameService {
    private readonly gameRepository: Repository<Games>;
    private readonly defaultGameRepository: Repository<DefaultGames>;
    private readonly quizAnswersRepository: Repository<QuizAnswers>;
    private readonly quizQuestionsRepository: Repository<QuizQuestions>;
    private readonly gameTurnsRepository: Repository<GameTurns>;
    private readonly gameRoomRepository: Repository<GameRooms>;
    private readonly gameResultRepository: Repository<GameResults>;
    private readonly voucherCustomerRepository: Repository<CustomerVoucher>
    private readonly requestTurnRepository: Repository<RequestTurn>;

    constructor() {
        this.gameRepository = DatabaseService.getInstance().getRepository(Games);
        this.defaultGameRepository = DatabaseService.getInstance().getRepository(DefaultGames);
        this.quizAnswersRepository = DatabaseService.getInstance().getRepository(QuizAnswers);
        this.quizQuestionsRepository = DatabaseService.getInstance().getRepository(QuizQuestions);
        this.gameTurnsRepository = DatabaseService.getInstance().getRepository(GameTurns);
        this.gameRoomRepository = DatabaseService.getInstance().getRepository(GameRooms);
        this.gameResultRepository = DatabaseService.getInstance().getRepository(GameResults);
        this.voucherCustomerRepository = DatabaseService.getInstance().getRepository(CustomerVoucher)
        this.requestTurnRepository = DatabaseService.getInstance().getRepository(RequestTurn);
    }
    async getById(id: string) {
        return await this.gameRepository.findOne({
            where: { id },
            relations: {
                default_game: true,
                rooms: {
                    questions: {
                        answers: true,
                        solution: true
                    }
                },
                event: true,
                game_turn: true
            }
        });
    }

    async getAll({ branch_id }: { branch_id: string }) {
        return await this.gameRepository.find(
            {
                where: {
                    event: {
                        brand_id: branch_id
                    }
                }
            }
        );
    }

    async createGameQuiz(createGameData: any) {
        const type = createGameData.type;
        const defaultGame = await this.defaultGameRepository.findOne({ where: { game_type: { id: type } } });
        if (!defaultGame) {
            throw new Error("Game type not found");
        }
        const game = this.gameRepository.create({
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

        const gameRoom = this.gameRoomRepository.create({
            games: game,
        });
        await this.gameRoomRepository.save(gameRoom);

        const questions = createGameData.questions;
        for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];
            const question = this.quizQuestionsRepository.create({
                content: questionData.content,
                image: questionData.image && questionData.image.length > 0 ? questionData.image : "",
                cooldown: questionData.cooldown,
                time: questionData.time,
                games: gameRoom,
                position: i
            });
            await this.quizQuestionsRepository.save(question);

            const answers: QuizAnswers[] = [];
            for (const answerData of questionData.answers) {
                const answer = this.quizAnswersRepository.create(
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

    async createGameFlappyBird(createGameData: any,) {
        const type = createGameData.type;
        const defaultGame = await this.defaultGameRepository.findOne({ where: { game_type: { id: type } } });
        if (!defaultGame) {
            throw new Error("Game type not found");
        }
        const game = this.gameRepository.create({
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

    async getGameByEventId({ id }: { id: string }) {
        return await this.gameRepository.find({
            where: {
                event: {
                    id: id
                },
            },
            relations: {
                default_game: true
            }
        })
    }

    async getGameTurnCustomer({ id, customer_id }: { id: string, customer_id: string }) {
        const game = await this.gameRepository.findOne({
            where: {
                id: id
            },
            relations: {
                default_game: {
                    game_type: true
                }
            }
        })
        if (!game)
            return { turn: 0, maxScore: 0, voucher: null };
        let gameTurn = await this.gameTurnsRepository.findOne({
            where: {
                games: {
                    id: id
                },
                customer_id: customer_id
            }
        })
        if (!gameTurn) {
            const typeGame = game.default_game?.game_type?.id;
            if (typeGame === "FLAPPYBIRD") {
                gameTurn = new GameTurns()
                gameTurn.game_id = game.id;
                gameTurn.customer_id = customer_id;
                gameTurn.quantity = 10
                await this.gameTurnsRepository.save(gameTurn)
            }
            else if (typeGame === "QUIZ") {
                gameTurn = new GameTurns()
                gameTurn.game_id = game.id;
                gameTurn.customer_id = customer_id;
                gameTurn.quantity = 1
                await this.gameTurnsRepository.save(gameTurn)
            }
            else {
                return { turn: 0, maxScore: 0, voucher: null };
            }
        }
        const gameResult = await this.gameResultRepository.findOne({
            where: {
                customer_id: customer_id,
                game_room: {
                    games: {
                        id: id
                    }
                }
            }
        })
        if (!gameResult) {
            return { turn: gameTurn.quantity, maxScore: 0, voucher: null };
        }
        const customerVoucher = await this.voucherCustomerRepository.findOne({
            where: {
                customer_id: customer_id,
                game_result: {
                    id: gameResult.id
                }
            },
            relations: {
                voucher: true
            }
        })
        if (!customerVoucher || !customerVoucher.voucher) {
            return { turn: gameTurn.quantity, maxScore: gameResult.score, voucher: null };
        }
        return { turn: gameTurn.quantity, maxScore: gameResult.score, voucher: customerVoucher.voucher };

    }

    async updateGameTurnCustomer({ customer_id, gameID, turn }) {
        const game = await this.gameRepository.findOne({
            where: {
                id: gameID
            }
        })
        console.log(game);
        if (!game) {
            return false
        }
        const gameTurn = await this.gameTurnsRepository.findOne({
            where: {
                games: {
                    id: gameID
                },
                customer_id: customer_id
            }
        })
        console.log(gameTurn);
        if (!gameTurn || !Number(turn) || Number(turn) < 0) {
            return false
        }
        gameTurn.quantity = Number(turn)
        await this.gameTurnsRepository.save(gameTurn);
        return true;

    }
    async updateScoreGameOfCustomer({ customer_id, gameID, score }) {
        const gameRoom = await this.gameRoomRepository.findOne({
            where: {
                games: {
                    id: gameID
                }
            }
        })
        if (!gameRoom) {
            return false
        }
        let gameResult = await this.gameResultRepository.findOne({
            where: {
                customer_id: customer_id,
                game_room: {
                    id: gameRoom.id
                }
            }
        })
        if (!gameResult) {
            gameResult = new GameResults()
            gameResult.customer_id = customer_id;
            gameResult.game_room = gameRoom;
            gameResult.score = Number(score) ? Number(score) : 0
            await this.gameResultRepository.save(gameResult)
        }
        else {
            gameResult.score = Number(score) ? Number(score) : 0
            await this.gameResultRepository.save(gameResult)
        }
        return true;
    }

    async addGameTurn(sender_id, receiver_id, game) {
        const request_turn = this.requestTurnRepository.create({
            status: TripleStatus.PENDING,
            sender_id: sender_id,
            receiver_id: receiver_id,
            game: game,
        });

        await this.requestTurnRepository.save(request_turn);
        return request_turn;
    }
}

export default new GameService();