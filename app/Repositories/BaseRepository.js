const { AppLogHelper } = require("../../config/helpers");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findFirstByColumn(condition) {
        return await this.model.findOne({
            where: condition,
        });
    }

    async findAllByColumn(condition) {
        return await this.model.findAll({
            where: condition,
        });
    }

    async findCountByColumn(condition) {
        return await this.model.findAndCountAll({
            where: condition,
        });
    }

    async all(payload = {}) {
        const paginate = {
            offset: Number(payload.offset) || 0,
            limit: Number(payload.limit) || 20,
        }
        console.log('payload', payload,'paginate', paginate);
        
        AppLogHelper.setTotalRecordCount(await this.model.count());
        return await this.model.findAll(paginate);
    }

    create = async (payload) => {
        return await this.model.create(payload)
    }

    update = async (payload, condition) => {
        return await this.model.update(payload,{ where: condition });
    }

    // You can add other common methods here if needed.
}

module.exports = BaseRepository;