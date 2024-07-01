import "dayjs/locale/nl";

import dayjs from "dayjs";
import localizedFormatPlugin from "dayjs/plugin/localizedFormat";
import updateLocalePlugin from "dayjs/plugin/updateLocale";
import weekdayPlugin from "dayjs/plugin/weekday";

dayjs.extend(updateLocalePlugin);

dayjs.locale("nl");
dayjs.updateLocale("nl", {
  weekStart: 1,
});
dayjs.extend(localizedFormatPlugin);
dayjs.extend(weekdayPlugin);

const FULL_HOUR = 60;
const HALF_HOUR = 30;
const QUARTER_HOUR = 15;

export default class NewDateGuesser {
  private normalizeInput(result: string): string {
    const replacements = {
      eerste: "1e",
      tweede: "2e",
      derde: "3e",
      vierde: "4e",
      een: "1",
      één: "1",
      twee: "2",
      drie: "3",
      vier: "4",
      vijf: "5",
      zes: "6",
      zeven: "7",
      acht: "8",
      negen: "9",
      tien: "10",
      middern8: "12 uur in de nacht",
      "'s n8s": "in de nacht",
      n8: "nacht",
      "'s ochtends": "in de ochtend",
      "'s middags": "in de middag",
      "'s avonds": "in de avond",
      "en 1 half uur": "uur en 30 minuten",
      "1 half uur": "30 minuten",
      "anderhalf uur": "1 uur en 30 minuten",
      "3 kwartier": "45 minuten",
      kwartier: "15 minuten",
      "half uur": "30 minuten",
      minuten: "minuut",
      uren: "uur",
      uurtje: "uur",
      dagen: "dag",
      weken: "week",
      maanden: "maand",
      jaren: "jaar",
    };

    for (const [search, replace] of Object.entries(replacements)) {
      result = result.replace(search, replace);
    }

    return result;
  }

  private splitInput(input: string) {
    const regex =
      /(?!$) ?(?:om )?(?:\d\d? )?(?:(?:half|(?:kwart )?voor(?: half)?|(?:kwart )?over(?: half)?) )?(?:\d\d?)?(?:uur)?(?: in de (?:avond|middag|nacht|ochtend))?$/v;

    const match = regex.exec(input);

    return {
      absoluteTime: match?.[0].trim(),
      remainder: input.replace(match?.[0] ?? "", "") || undefined,
    };
  }

  private getNumberOrUndefined(input?: string) {
    const number = Number(input);

    return Number.isNaN(number) ? undefined : number;
  }

  private parsePeriod(input: string) {
    let period: "afternoon" | "evening" | "morning" | "night" | undefined =
      undefined;

    if (input.includes("nacht")) {
      period = "night";
    } else if (input.includes("ochtend")) {
      period = "morning";
    } else if (input.includes("middag")) {
      period = "afternoon";
    } else if (input.includes("avond")) {
      period = "evening";
    }

    return { period };
  }

  private parseFullHour(input: string) {
    return {
      hours: this.getNumberOrUndefined(
        /(?<hours>\d\d?) uur/v.exec(input)?.groups?.hours,
      ),

      minutes: 0,
    };
  }

  private parseAfterHour(input: string) {
    const testResult =
      /(?:(?<minutes>\d\d?)|kwart) over (?:half )?(?<hours>\d\d?)/v.exec(
        input,
      )?.groups;

    const hours = this.getNumberOrUndefined(testResult?.hours);

    let minutes = this.getNumberOrUndefined(testResult?.minutes);

    if (minutes !== undefined && input.includes("half")) {
      minutes += HALF_HOUR;
    }

    if (input.includes("kwart")) {
      minutes = QUARTER_HOUR;
    }

    return { hours, minutes };
  }

  // eslint-disable-next-line max-statements
  private parseBeforeHour(input: string) {
    const testResult =
      /(?:(?<minutes>\d\d?)|kwart) voor (?:half )?(?<hours>\d\d?)/v.exec(
        input,
      )?.groups;

    let hours = this.getNumberOrUndefined(testResult?.hours);
    let minutes = this.getNumberOrUndefined(testResult?.minutes);

    if (hours !== undefined) {
      hours -= 1;
    }

    if (minutes !== undefined) {
      minutes = FULL_HOUR - minutes;

      if (input.includes("half")) {
        minutes -= HALF_HOUR;
      }
    }

    if (input.includes("kwart")) {
      minutes = FULL_HOUR - QUARTER_HOUR;
    }

    return { hours, minutes };
  }

  private parseHalfHour(input: string) {
    let hours = undefined;

    const testResult = /half (?<hours>\d\d?)/v.exec(input)?.groups;

    hours = this.getNumberOrUndefined(testResult?.hours);

    if (hours !== undefined) {
      hours -= 1;
    }

    return { hours, minutes: HALF_HOUR };
  }

  private parseAbsoluteTime(input: string) {
    if (input.includes("uur")) {
      return {
        ...this.parseFullHour(input),
        ...this.parsePeriod(input),
      };
    }

    if (input.includes("over")) {
      return {
        ...this.parseAfterHour(input),
        ...this.parsePeriod(input),
      };
    }

    if (input.includes("voor")) {
      return {
        ...this.parseBeforeHour(input),
        ...this.parsePeriod(input),
      };
    }

    if (input.includes("half")) {
      return {
        ...this.parseHalfHour(input),
        ...this.parsePeriod(input),
      };
    }

    return {
      hours: undefined,
      minutes: undefined,
      ...this.parsePeriod(input),
    };
  }

  public guess(input: string) {
    const normalizedInput = this.normalizeInput(input);

    const { absoluteTime, remainder } = this.splitInput(normalizedInput);

    console.log(this.parseAbsoluteTime(absoluteTime));
  }
}
