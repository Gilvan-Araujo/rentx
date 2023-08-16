import { container } from "tsyringe";

import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayJsDateProvider } from "./DateProvider/implementations/DayJsProvider";

container.registerSingleton<IDateProvider>(
    "DayjsDateProvider",
    DayJsDateProvider,
);
