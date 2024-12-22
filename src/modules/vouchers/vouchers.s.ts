import { DatabaseService } from "../../database/database.service";
import { Voucher } from "../../database/entities/voucher.entity";

class VouchersService {

    private readonly voucherRepository = DatabaseService.getInstance().getRepository(Voucher);

    async create(voucher: Voucher) {
        return await this.voucherRepository.save(voucher);
    }

}

export default new VouchersService();
