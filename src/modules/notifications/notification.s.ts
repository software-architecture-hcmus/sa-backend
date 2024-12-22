import { DatabaseService } from "../../database/database.service";
import { Notification } from "../../database/entities/notification.entity";
import { Repository } from "typeorm";
import FavouritesService from "../favourites/favourite.s";
import { emitEventNotification } from "../../lib/socket/emitEventNotification";
import { Favourite } from "../../database/entities/favourite.entity";

export class NotificationsService {

    private readonly notificationRepository: Repository<Notification>;

    constructor() {
        this.notificationRepository = DatabaseService.getInstance().getRepository(Notification);
    }

    async create(data: {
        account_id: string;
        event_id: string;
        content: string;
    }) {

        const notification = this.notificationRepository.create({
            account_id: data.account_id,
            event: { id: data.event_id },
            content: data.content,
        });
        return await this.notificationRepository.save(notification);
    }

    async notify(event_id: string, content: string) {
        const favourites = await FavouritesService.getByEventId(event_id);
        favourites.forEach((favourite: Favourite) => {
            this.create({
                account_id: favourite.customer_id,
                event_id,
                content,
            });
            emitEventNotification({
                event_id,
                content,
            }, favourite.customer_id);
        });
       
    }

    async getByAccountId(account_id: string) {
        return await this.notificationRepository.find({
            where: { account_id },
            relations: {
                event: true,
            }
        });
    }
}

export default new NotificationsService();
