import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

class CreateRentalController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createRentalUseCase = container.resolve(CreateRentalUseCase);

        const rental = await createRentalUseCase.execute({
            user_id: request.user.id,
            car_id: request.body.car_id,
            expected_return_date: request.body.expected_return_date,
        });

        return response.status(201).send(rental);
    }
}

export { CreateRentalController };
