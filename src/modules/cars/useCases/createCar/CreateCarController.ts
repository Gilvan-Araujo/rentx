import { Request, Response } from "express";
import { container } from "tsyringe";

import { ICreateCarDTO } from "../../dtos/ICreateCarDTO";
import { CreateCarUseCase } from "./CreateCarUseCase";

class CreateCarController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createCarUseCase = container.resolve(CreateCarUseCase);

        const car = await createCarUseCase.execute(
            request.body as ICreateCarDTO,
        );

        return response.status(201).json(car);
    }
}

export { CreateCarController };
