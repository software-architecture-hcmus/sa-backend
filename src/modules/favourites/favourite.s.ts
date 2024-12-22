import { DatabaseService } from "../../database/database.service";
import { Favourite } from "../../database/entities/favourite.entity";
import { Repository } from "typeorm";

export class FavouritesService {

    private readonly favouriteRepository: Repository<Favourite>;

    constructor() {
        this.favouriteRepository = DatabaseService.getInstance().getRepository(Favourite);
    }

    async getByCustomerId(customer_id: string) {
        return await this.favouriteRepository.find({
            where: { customer_id },
            relations: {
                event: true,
            }
        });
    }

    async getByEventId(event_id: string) {
        return await this.favouriteRepository.find({
            where: {
                event: {
                    id: event_id
                }
            },
        });
    }

    async create(data:{
        event_id: string;
        customer_id: string;
    }) {
        const favourite = this.favouriteRepository.create({
            event: { id: data.event_id },
            customer_id: data.customer_id,
        });
        return await this.favouriteRepository.save(favourite);
    }

    async removeByEventIdAndCustomerId(event_id: string, customer_id: string) {
        return await this.favouriteRepository.delete({
            event: { id: event_id },
            customer_id,
        });
    }
}

export default new FavouritesService();
