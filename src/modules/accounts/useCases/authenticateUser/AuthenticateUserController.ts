import { container } from "tsyringe";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
    async handle(request, response): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUserUseCase = container.resolve(
            AuthenticateUserUseCase,
        );

        const token = await authenticateUserUseCase.execute({
            email,
            password,
        });

        return response.json(token);
    }
}

export { AuthenticateUserController };
