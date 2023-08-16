import { inject, injectable } from "tsyringe";

import { type ICategoriesRepository } from "@/modules/cars/repositories/ICategoriesRepository";

import { Category } from "../../infra/typeorm/entities/Category";

@injectable()
class ListCategoriesUseCase {
    constructor(
        @inject("CategoriesRepository")
        private readonly categoriesRepository: ICategoriesRepository,
    ) {}

    async execute(): Promise<Category[]> {
        const allCategories = await this.categoriesRepository.list();

        return allCategories;
    }
}

export { ListCategoriesUseCase };
