import { container } from "tsyringe";

import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayJsDateProvider } from "./DateProvider/implementations/DayJsProvider";
import { IMailProvider } from "./MailProvider/IMailProvider";
import { EtherealMailProvider } from "./MailProvider/implementations/EtherealMailProvider";

container.registerSingleton<IDateProvider>(
    "DayjsDateProvider",
    DayJsDateProvider,
);

container.registerSingleton<IMailProvider>(
    "EtherealMailProvider",
    EtherealMailProvider,
);
