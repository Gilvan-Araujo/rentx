import dayjs from "dayjs";

import { IDateProvider } from "../IDateProvider";

class DayJsDateProvider implements IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number {
        return dayjs(end_date).diff(start_date, "hours");
    }

    dateNow(): Date {
        return dayjs().toDate();
    }

    compareInDays(start_date: Date, end_date: Date): number {
        return dayjs(end_date).diff(start_date, "days");
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hour").toDate();
    }

    compareIfDateIsBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date);
    }
}

export { DayJsDateProvider };
