import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import createConnection from "..";

async function create() {
    const connection = await createConnection("localhost");

    const id = uuidV4();
    const password = await hash("admin", 8);

    const query = `INSERT INTO USERS (id, name, email, password, "isAdmin", created_at, driver_license)
    values('${id}', 'admin', 'admin@admin.com', '${password}', true, now(), 'ABC-1234')`;

    await connection.query(query);

    await connection.close();
}

create().then(() => console.log("User admin created"));
