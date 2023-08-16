import { NextFunction, Response, Request } from "express";

import { UsersRepository } from "@/modules/accounts/infra/typeorm/repositories/UsersRepository";

export async function ensureAdmin(
    request: Request,
    _response: Response,
    next: NextFunction,
) {
    const { id } = request.user;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(id);

    if (!user.isAdmin) throw new Error("User isn't admin!");

    return next();
}
