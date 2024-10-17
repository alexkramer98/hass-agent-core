/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable max-lines */

import type { DateTime } from "luxon";

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
  private normalizeInput(input: string): string {
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
      ",5 uur": " uur en 30 minuut",
    };

    let result = input;

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

  // eslint-disable-next-line max-statements
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

  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity,max-statements
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

    const result = start.set({
      day,
      month: month === undefined ? undefined : MONTHS.indexOf(month) + 1,
      year,
    });

    return this.parseAbsoluteTime(result, input);
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

    const result = start.plus({
      day: this.parseNumber(matches?.days),
    });

    if (input.includes(" om ")) {
      return this.parseAbsoluteTime(result, input);
    }

    return result;
  }

  private parseRelativeWeeks(start: DateTime, input: string): DateTime {
    const matches = /(?<weeks>\d\d?) week/v.exec(input)?.groups;
    const weekdayIndex = DAYS.findIndex((day) => input.includes(day));

    let result = start.plus({
      weeks: this.parseNumber(matches?.weeks),
    });

    if (weekdayIndex !== -1) {
      result = result.set({
        // @ts-expect-error will always be in range
        weekday: weekdayIndex + 1,
      });

      return this.parseAbsoluteTime(result, input);
    }

    if (input.includes(" om ")) {
      return this.parseAbsoluteTime(result, input);
    }

    return result;
  }

  private parseAbsoluteDay(start: DateTime, input: string): DateTime {
    const weekdayIndex = DAYS.findIndex((day) => input.includes(day));
    const newIndex =
      weekdayIndex + 1 < start.weekday ? weekdayIndex + 8 : weekdayIndex + 1;

    const result = start.set({
      // @ts-expect-error will always be in range
      weekday: newIndex,
    });

    return this.parseAbsoluteTime(result, input);
  }

  private parseTomorrowish(start: DateTime, input: string): DateTime {
    const delta = input.startsWith("over") ? 2 : 1;

    const result = start.plus({
      day: delta,
    });

    return this.parseAbsoluteTime(result, input);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity,max-statements
  public guess(start: DateTime, rawInput: string): DateTime {
    const input = this.normalizeInput(rawInput);

    if (ABSOLUTE_DATE_REGEX.test(input)) {
      return this.parseAbsoluteDate(start, input);
    }

    if (/^(?:deze |van)(?:avond|middag|nacht|ochtend)/v.test(input)) {
      return this.parseAbsoluteTime(start, input);
    }

    if (/^(?:over)?morgen/v.test(input)) {
      return this.parseTomorrowish(start, input);
    }

    if (input.includes("over ")) {
      if (input.includes(" week")) {
        return this.parseRelativeWeeks(start, input);
      }

      if (input.includes(" dag")) {
        return this.parseRelativeDays(start, input);
      }

      if (input.includes(" uur") || input.includes(" minuut")) {
        return this.parseRelativeHoursMinutes(start, input);
      }
    }

    if (DAYS.some((item) => input.includes(item))) {
      return this.parseAbsoluteDay(start, input);
    }

    return this.parseAbsoluteTime(start, input);
  }
}
