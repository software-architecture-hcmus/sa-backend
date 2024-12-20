import { DatabaseService } from "../../database/database.service";
import { Event } from "../../database/entities/event.entity";
import { Voucher } from "../../database/entities/voucher.entity";
import { Repository } from "typeorm";

export class EventsService {

    private readonly eventRepository: Repository<Event>;
    private readonly voucherRepository: Repository<Voucher>;

    constructor() {
        this.eventRepository = DatabaseService.getInstance().getRepository(Event);
        this.voucherRepository = DatabaseService.getInstance().getRepository(Voucher);
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
        await this.voucherRepository.save(vouchersData);

        return eventData;
    }

    async getAll(params: any) {
        return await this.eventRepository.find({
            where: params,
        });
    }

    async getById(id: string) {
        return await this.eventRepository.findOne({
            where: { id },
            relations: {
                vouchers: true,
            }
        });
    }

}

export default new EventsService();
