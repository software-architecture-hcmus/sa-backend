import { Repository } from "typeorm";
import { DatabaseService } from "../../database/database.service";
import { Voucher } from "../../database/entities/voucher.entity";
import { RoomPlayerRequest } from "../../lib/interfaces/player.interface";
import { RoomPlayers } from "../../database/entities/room_players.entity";
import { GameResults } from "../../database/entities/game_results.entity";
import { GameRooms } from "../../database/entities/game_rooms.entity";
import { Event } from "../../database/entities/event.entity";
import { CustomerVoucher } from "../../database/entities/customer_vouchers.entity";
import { VoucherCode } from "../../database/entities/voucher_codes.entity";
class VouchersService {

    private readonly voucherRepository: Repository<Voucher>
    private readonly roomPlayerRepository: Repository<RoomPlayers>
    private readonly gameResultsRepository: Repository<GameResults>
    private readonly gameRoomsRepository: Repository<GameRooms>
    private readonly eventRepository: Repository<Event>
    private readonly customerVoucherRepository: Repository<CustomerVoucher>
    private readonly voucherCodeRepository: Repository<VoucherCode>
    constructor()
    {
        this.voucherRepository = DatabaseService.getInstance().getRepository(Voucher)
        this.roomPlayerRepository = DatabaseService.getInstance().getRepository(RoomPlayers);
        this.gameResultsRepository = DatabaseService.getInstance().getRepository(GameResults);
        this.gameRoomsRepository=  DatabaseService.getInstance().getRepository(GameRooms);
        this.eventRepository= DatabaseService.getInstance().getRepository(Event);
        this.customerVoucherRepository = DatabaseService.getInstance().getRepository(CustomerVoucher);
        this.voucherCodeRepository = DatabaseService.getInstance().getRepository(VoucherCode);
    }
    async create(voucher: Voucher) {
        return await this.voucherRepository.save(voucher);
    }

    async createVoucherForQuizGame(roomPlayer: RoomPlayerRequest)
    {
        const currentRoomPlayer = await this.roomPlayerRepository.findOne({
            where:{
                customer_id: roomPlayer.customer_id,
                game_room_id: roomPlayer.game_room_id
            }
        })
        const gameRoom = await this.gameRoomsRepository.findOne({
            where:{
                id: roomPlayer.game_room_id
            }
        })
        if(!currentRoomPlayer || !gameRoom)
        {
            throw new Error("Do not Exist Room Player or Game Room")
        }
        const currentCustomerVoucher = await this.customerVoucherRepository.findOne({
            where:{
                customer_id: roomPlayer.customer_id,
                game_result:{
                    game_room:{
                        id: roomPlayer.game_room_id
                    }
                }
            },
            relations:{
                voucher: true
            }
        })
        if(currentCustomerVoucher)
        {
            return currentCustomerVoucher?.voucher;
        }
        let gameResult = await this.gameResultsRepository.findOne({
            where:{
                customer_id: roomPlayer.customer_id,
                game_room:{
                    id: roomPlayer.game_room_id
                }
            }
        })
        if(!gameResult)
        {
            gameResult = new GameResults()
            gameResult.customer_id = roomPlayer.customer_id;
            gameResult.game_room = gameRoom;
            gameResult.score = roomPlayer.score;
            await this.gameResultsRepository.save(gameResult);
        }
        const event = await this.eventRepository.findOne({
            where:{
                games:{
                    rooms:{
                        id: roomPlayer.game_room_id
                    }
                }
            }
        })
        let vouchers = await this.voucherRepository.find({
            where:{
                event:{
                    id: event?.id
                }
            }
        })
        vouchers = vouchers?.sort((a, b) => b.value - a.value)
        if(vouchers[Number(roomPlayer.position)])
        {
            const voucher = vouchers[roomPlayer.position]
            const customerVoucher = new CustomerVoucher()
            customerVoucher.customer_id = roomPlayer.customer_id;
            customerVoucher.game_result = gameResult;
            customerVoucher.voucher = voucher;
            await this.customerVoucherRepository.save(customerVoucher);
            return voucher;
        }
        return {}
    }
    
    async createVoucherCode(voucherCode: VoucherCode) {
        return await this.voucherCodeRepository.save(voucherCode);
    }
    async createVoucherForFlappyBird({customer_id, gameID, score})
    {
        const gameRoom = await this.gameRoomsRepository.findOne({
            where:{
                games:{
                    id: gameID
                }
            }
        })
        if(!gameRoom)
        {
            return null
        }
        const gameResult = await this.gameResultsRepository.findOne({
            where:{
                customer_id: customer_id,
                game_room:{
                    id: gameRoom.id
                }
            }
        })
        if(!gameResult)
        {
            return null
        }
        const event = await this.eventRepository.findOne({
            where:{
                games:{
                    id: gameID
                }
            }
        })
        let vouchers = await this.voucherRepository.find({
            where:{
                event:{
                    id: event?.id
                }
            }
        })
        if(!vouchers)
        {
            return null
        }
        vouchers = vouchers?.sort((a, b) => a.value - b.value);
        const closestVoucher = vouchers
            ?.filter(v => v.value <= Number(score))
            .reduce<Voucher | undefined>((closest, current) => {
                if (!closest) return current;
                return Math.abs(current.value - Number(score)) < Math.abs(closest.value - Number(score))
                ? current
                : closest;
            }, undefined);
        if(closestVoucher)
        {
            const customerVoucher = new CustomerVoucher()
            customerVoucher.customer_id = customer_id;
            customerVoucher.game_result = gameResult;
            customerVoucher.voucher = closestVoucher;
            await this.customerVoucherRepository.save(customerVoucher);
            return closestVoucher
        }
        return null
    }
}

export default new VouchersService();
