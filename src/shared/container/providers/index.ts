import { container } from "tsyringe";

import "dotenv/config";
import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayJsDateProvider } from "./DateProvider/implementations/DayJsProvider";
import { IMailProvider } from "./MailProvider/IMailProvider";
import { EtherealMailProvider } from "./MailProvider/implementations/EtherealMailProvider";
import { LocalStorageProvider } from "./StorageProvider/implementations/LocalStorageProvider";
import { S3StorageProvider } from "./StorageProvider/implementations/S3StorageProvider";
import { IStorageProvider } from "./StorageProvider/IStorageProvider";

container.registerSingleton<IDateProvider>(
    "DayjsDateProvider",
    DayJsDateProvider,
);

container.registerSingleton<IMailProvider>(
    "EtherealMailProvider",
    EtherealMailProvider,
);

const diskStorage = {
    local: LocalStorageProvider,
    s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    diskStorage[process.env.disk],
);
