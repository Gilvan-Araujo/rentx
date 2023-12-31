import "reflect-metadata";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import { AppError } from "@/shared/errors/AppError";
import createConnection from "@/shared/infra/typeorm";

import "@/shared/container";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${process.env.TMP_FOLDER}/avatar`));
app.use("/cars", express.static(`${process.env.TMP_FOLDER}/cars`));

app.use(router);

app.use(
    (
        err: Error,
        _request: express.Request,
        response: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: express.NextFunction,
    ) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                message: err.message,
            });
        }

        return response.status(500).json({
            status: "error",
            message: `Internal Server Error - ${err.message}`,
        });
    },
);

export { app };
