import { Router } from "express";

import { ResetPasswordController } from "@/modules/accounts/useCases/resetPassword/ResetPasswordController";
import { SendForgottenPasswordEmailController } from "@/modules/accounts/useCases/sendForgottenPasswordEmail/SendForgottenPasswordEmailController";

const passwordRoutes = Router();

const sendForgottenPasswordEmailController =
    new SendForgottenPasswordEmailController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post("/forgot", sendForgottenPasswordEmailController.handle);
passwordRoutes.post("/reset", resetPasswordController.handle);

export { passwordRoutes };
