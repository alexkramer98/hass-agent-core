import { DateTime } from "luxon";

const ABSOLUTE_DATE_REGEX =
  /^(?:op )?(?<day>\d\d?) (?<month>april|augustus|december|februari|januari|juli|juni|maart|mei|november|oktober|september)(?: (?<year>\d{4}))?/v;

const MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

const DAYS = [
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
  "zondag",
];

export default class DateGuesser {
  private normalizeInput(result: string): string {
    const replacements = {
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
      "'s n8s": "in de nacht",
      n8: "nacht",
      "'s ochtends": "in de ochtend",
      "'s middags": "in de middag",
      "'s avonds": "in de avond",
      "en 1 half uur": "uur en 30 minuten",
      "1 half uur": "30 minuten",
      "anderhalf uur": "1 uur en 30 minuten",
      "3 kwartier": "45 minuten",
      "1 kwartier": "15 minuten",
      kwartier: "15 minuten",
      "half uur": "30 minuten",
      minuten: "minuut",
      uren: "uur",
      uurtje: "uur",
      dagen: "dag",
      weken: "week",
    };

    for (const [search, replace] of Object.entries(replacements)) {
      result = result.replace(search, replace);
    }

    return result;
  }

  private parseNumber(input?: string) {
    const number = Number(input);

    return Number.isNaN(number) ? undefined : number;
  }

  private parseFullHour(input: string) {
    return {
      hour: this.parseNumber(/(?<hour>\d\d?) uur/v.exec(input)?.groups?.hour),

      minute: 0,
    };
  }

  private parseAfterHour(input: string) {
    const result =
      /(?:(?<minute>\d\d?)|kwart) over (?:half )?(?<hour>\d\d?)/v.exec(
        input,
      )?.groups;

    let hour = this.parseNumber(result?.hour);
    let minute = this.parseNumber(result?.minute);

    if (minute !== undefined && hour !== undefined && input.includes("half")) {
      minute += 30;
      hour -= 1;
    }

    if (input.includes("kwart")) {
      minute = 15;
    }

    return { hour, minute };
  }

  private parseBeforeHour(input: string) {
    const result =
      /(?:(?<minute>\d\d?)|kwart) voor (?:half )?(?<hour>\d\d?)/v.exec(
        input,
      )?.groups;

    let hour = this.parseNumber(result?.hour);
    let minute = this.parseNumber(result?.minute);

    if (hour !== undefined) {
      hour -= 1;
    }

    if (minute !== undefined) {
      minute = 60 - minute;

      if (input.includes("half")) {
        minute -= 30;
      }
    }

    if (input.includes("kwart")) {
      minute = 45;
    }

    return { hour, minute };
  }

  private parseHalfHour(input: string) {
    const result = /half (?<hour>\d\d?)/v.exec(input)?.groups;

    let hour = this.parseNumber(result?.hour);

    if (hour !== undefined) {
      hour -= 1;
    }

    return { hour, minute: 30 };
  }

  private parseAbsoluteTime(start: DateTime, input: string): DateTime {
    let hour = undefined;
    let minute = undefined;

    if (input.includes("uur")) {
      ({ hour, minute } = this.parseFullHour(input));
    } else if (input.includes("over")) {
      ({ hour, minute } = this.parseAfterHour(input));
    } else if (input.includes("voor")) {
      ({ hour, minute } = this.parseBeforeHour(input));
    } else if (input.includes("half")) {
      ({ hour, minute } = this.parseHalfHour(input));
    }

    if (hour === undefined) {
      if (input.includes("nacht")) {
        hour = 3;
      } else if (input.includes("ochtend")) {
        hour = 9;
      } else if (input.includes("middag")) {
        hour = 13;
      } else if (input.includes("avond")) {
        hour = 19;
      } else {
        hour = 13;
      }
    } else if (
      hour === 12 &&
      ["nacht", "avond"].some((item) => input.includes(item))
    ) {
      hour = 0;
    } else if (
      hour >= 1 &&
      hour <= 5 &&
      !["nacht", "ochtend"].some((item) => input.includes(item))
    ) {
      hour += 12;
    } else if (hour >= 6 && hour <= 8 && !input.includes("ochtend")) {
      hour += 12;
    } else if (hour >= 9 && hour <= 11 && input.includes("avond")) {
      hour += 12;
    }

    minute ??= 0;

    return start.set({
      hour,
      minute,
      second: 0,
      millisecond: 0,
    });
  }

  private parseAbsoluteDate(start: DateTime, input: string): DateTime {
    const matches = ABSOLUTE_DATE_REGEX.exec(input)?.groups;
    const day = this.parseNumber(matches?.day);
    const year = this.parseNumber(matches?.year);
    const month = matches?.month;

    return start.set({
      day,
      month: month === undefined ? undefined : MONTHS.indexOf(month) + 1,
      year,
    });
  }

  private parseRelativeHoursMinutes(start: DateTime, input: string): DateTime {
    const hourMatches = /(?<value>\d\d?) uur/v.exec(input)?.groups;
    const minutesMatches = /(?<value>\d\d?) minuut/v.exec(input)?.groups;

    return start.plus({
      hour: this.parseNumber(hourMatches?.value),
      minute: this.parseNumber(minutesMatches?.value),
    });
  }

  private parseRelativeDays(start: DateTime, input: string): DateTime {
    const matches = /(?<days>\d\d?) dag/v.exec(input)?.groups;

    return start.plus({
      day: this.parseNumber(matches?.days),
    });
  }

  public guess(input: string): DateTime | undefined {
    const normalizedInput = this.normalizeInput(input);

    // todo: current datetime
    const start = DateTime.fromObject({
      year: 2000,
      month: 1,
      day: 1,
      hour: 15,
      minute: 36,
      second: 22,
      millisecond: 611,
    });

    let result = start;

    if (normalizedInput.startsWith("over ")) {
      if (
        normalizedInput.includes(" uur") ||
        normalizedInput.includes(" minuut")
      ) {
        result = this.parseRelativeHoursMinutes(start, normalizedInput);
      } else if (normalizedInput.includes(" dag")) {
        result = this.parseRelativeDays(start, normalizedInput);
      } else if (normalizedInput.includes(" week")) {
        // todo: handle weken + dag + dagdeel
      }
    } else if (ABSOLUTE_DATE_REGEX.test(normalizedInput)) {
      result = this.parseAbsoluteDate(start, normalizedInput);
    }

    if (normalizedInput.includes("om ")) {
      return this.parseAbsoluteTime(result, normalizedInput);
    }

    return result;
  }
}
