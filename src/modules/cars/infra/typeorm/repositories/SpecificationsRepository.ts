import { Repository, getRepository } from "typeorm";

import {
    type ICreateSpecificationDTO,
    type ISpecificationsRepository,
} from "@/modules/cars/repositories/ISpecificationsRepository";

import { Specification } from "../entities/Specification";

class SpecificationRepository implements ISpecificationsRepository {
    private repository: Repository<Specification>;

    constructor() {
        this.repository = getRepository(Specification);
    }

    async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = this.repository.create({
            name,
            description,
        });

        await this.repository.save(specification);

        return specification;
    }

    async findByName(name: string): Promise<Specification> {
        const foundSpecification = await this.repository.findOne({ name });

        return foundSpecification;
    }

    async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = await this.repository.findByIds(ids);

        return specifications;
    }
}

export { SpecificationRepository };
