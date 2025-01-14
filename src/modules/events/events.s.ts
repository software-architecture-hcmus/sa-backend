import { DatabaseService } from "../../database/database.service";
import { Event } from "../../database/entities/event.entity";
import { Voucher } from "../../database/entities/voucher.entity";
import AzureStorageService from "../../shared/azure/azure-storage.service"
import NotificationsService from "../notifications/notification.s";
import { And, LessThanOrEqual, MoreThan, Repository } from "typeorm";
import FavouritesService from "../favourites/favourite.s";
import { VoucherCode } from "../../database/entities/voucher_codes.entity";
import { generateRandomCode } from "../../utils/randomCode";
import { GameResults } from "../../database/entities/game_results.entity";

export class EventsService {

    private readonly eventRepository: Repository<Event>;
    private readonly voucherRepository: Repository<Voucher>;
    private readonly voucherCodeRepository: Repository<VoucherCode>;
    private readonly gameResultRepository: Repository<GameResults>;

    constructor() {
        this.eventRepository = DatabaseService.getInstance().getRepository(Event);
        this.voucherRepository = DatabaseService.getInstance().getRepository(Voucher);
        this.voucherCodeRepository = DatabaseService.getInstance().getRepository(VoucherCode);
        this.gameResultRepository = DatabaseService.getInstance().getRepository(GameResults);
    }

    async create(event: any) {

        let eventData = {
            ...event,
            total_vouchers: event.vouchers.length || 0,
        }

        const savedEvent = await this.eventRepository.save(eventData);
        const vouchersData = event.vouchers.map((voucher: any) => ({
            ...voucher,
            event: savedEvent,
        }));

        const codesToGenerate = event.vouchers.map(voucher => {
            return voucher.total_codes;
        });

        if (codesToGenerate.length > 0) {
            codesToGenerate.forEach(async (code, index) => {
                const newVoucherCodes = Array.from({ length: code }, () => generateRandomCode());
                const newVoucherCodesData = newVoucherCodes.map(code => ({ code, event: savedEvent }));
                await this.voucherCodeRepository.save(newVoucherCodesData);
            });
        }

        await this.voucherRepository.save(vouchersData);

        return eventData;
    }

    async getAll(id: string) {
        if(id)
        {
            return await this.eventRepository.find({
                where: {
                    brand_id: id,
                },
                order: {
                    start: 'DESC',
                }
            });
        }
        else
        {
            return await this.eventRepository.find({
                order: {
                    start: 'DESC',
                }
            });
        }

    }

    async getById(id: string) {
        //TODO: with relation games (?)
        return await this.eventRepository.findOne({
            where: { id },
            relations: {
                vouchers: true,
            }
        });
    }

    async softDelete(id: string) {
        return await this.eventRepository.softDelete(id);
    }

    async update(id: string, updateData: Partial<Event>) {
        const existingEvent = await this.eventRepository.findOne({
            where: { id },
            relations: {
                vouchers: true,
            }
        });
        
        // Sao chép sâu để lưu lại giá trị cũ
        const oldEvent = JSON.parse(JSON.stringify(existingEvent)); 
        
        if (updateData.image && existingEvent?.image) {
            AzureStorageService.deleteFile(existingEvent?.image);
        }

        const mergedEvent = this.eventRepository.merge(existingEvent!, updateData);
        
        // Cập nhật vouchers nếu có
        if (updateData.vouchers) {
            const totalCodesNew = mergedEvent.vouchers.map(voucher => {
                return voucher.total_codes;
            });
            const totalCodesOld = oldEvent?.vouchers?.map(voucher => {
                return voucher.total_codes;
            });
            const codesToGenerate = totalCodesNew.map((code, index) => code - (totalCodesOld?.[index] ?? 0));

            if (codesToGenerate.length > 0) {
                codesToGenerate.forEach(async (code, index) => {
                    const newVoucherCodes = Array.from({ length: code }, () => generateRandomCode());
                    const newVoucherCodesData = newVoucherCodes.map(code => ({ code, event: mergedEvent }));
                    const savedVoucherCodes = await this.voucherCodeRepository.save(newVoucherCodesData);
                    console.log(savedVoucherCodes);
                });
            }

            await this.voucherRepository.save(updateData.vouchers);
        }

        // Save the updated entity
        return await this.eventRepository.save(mergedEvent);
    }
    async subscribe(event_id: string, customer_id: string) {
        return await FavouritesService.create({
            event_id,
            customer_id,
        });
    }

    async unsubscribe(event_id: string, customer_id: string) {
        return await FavouritesService.removeByEventIdAndCustomerId(event_id, customer_id);
    }

    async notifyStart(event_id: string) {
        const event = await this.getById(event_id);
        if (event) {
            NotificationsService.notify(event_id, `${event.name} will start in 5 min, join now!`);
        }
    }

    async getEventsStartWithin5Minutes() {
        const now = new Date(); const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
        return await this.eventRepository.find({
            where: {
                start: And(
                    MoreThan(now),
                    LessThanOrEqual(fiveMinutesLater)
                ),
            }
        });
    }

    async getStats({ brand_id }: { brand_id: string }) {
        const events = await this.eventRepository.find({
            where: {
                brand_id: brand_id,
            },
        });

        const stats = await Promise.all(events.map(async event => {
            const playsPerEvent = await this.gameResultRepository.count({
                where: {
                    game_room: {
                        games: {
                            event: {
                                id: event.id,
                            }
                        }
                    }
                }
            });
            return {
                event,
                playsPerEvent,
            };
        }));



        return stats;
    }

}

export default new EventsService();
