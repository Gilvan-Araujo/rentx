import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@/shared/infra/http/app";
import createConnection from "@/shared/infra/typeorm";

let connection: Connection;

describe("Create Category Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        const query = `INSERT INTO USERS (id, name, email, password, "isAdmin", created_at, driver_license) values('${id}', 'admin', 'admin@admin.com', '${password}', true, now(), 'ABC-1234')`;

        connection.query(query);
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new category", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@admin.com",
            password: "admin",
        });

        const { refresh_token } = responseToken.body;

        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest",
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        expect(response.status).toBe(201);
    });

    it("should not be able to create a new category if name exists", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@admin.com",
            password: "admin",
        });

        const { refresh_token } = responseToken.body;

        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest",
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        expect(response.status).toBe(400);
    });
});
