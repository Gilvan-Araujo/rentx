import { inject, injectable } from "tsyringe";

import { type ISpecificationsRepository } from "@/modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@/shared/errors/AppError";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateSpecificationUseCase {
    constructor(
        @inject("SpecificationRepository")
        private readonly specificationsRepository: ISpecificationsRepository,
    ) {}

    async execute({ name, description }: IRequest): Promise<void> {
        const specificationAlreadyExists =
            await this.specificationsRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new AppError("Specification already exists!");
        }

        await this.specificationsRepository.create({
            name,
            description,
        });
    }
}

export { CreateSpecificationUseCase };
