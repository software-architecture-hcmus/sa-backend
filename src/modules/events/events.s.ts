import { DatabaseService } from "../../database/database.service";
import { Event } from "../../database/entities/event.entity";
import { Voucher } from "../../database/entities/voucher.entity";
import AzureStorageService from "../../shared/azure/azure-storage.service"
import NotificationsService from "../notifications/notification.s";
import { And, LessThanOrEqual, MoreThan, Repository } from "typeorm";
import FavouritesService from "../favourites/favourite.s";

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

    async getAll() {

        return await this.eventRepository.find({
            order: {
                start: 'DESC',
            }
        });
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
        const existingEvent = await this.eventRepository.findOneBy({ id });
        
        if (updateData.image && existingEvent?.image) {
            AzureStorageService.deleteFile(existingEvent?.image);
        }

        const mergedEvent = this.eventRepository.merge(existingEvent!, updateData);
        
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

}

export default new EventsService();
