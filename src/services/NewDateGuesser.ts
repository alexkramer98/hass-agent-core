// todo: vanavond, vanmiddag, deze avond, straks, aanstaande ???

import { DateTime } from "luxon";

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

const ABSOLUTE_DATE_REGEX =
  /^(?:op )?(?<day>\d\d?) (?<month>april|augustus|december|februari|januari|juli|juni|maart|mei|november|oktober|september)(?: (?<year>\d{4}))?/v;

// const RELATIVE_DATE_REGEX =
//   /^(?:(?<weekday_a>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?nacht|avond|middag|ochtend)? ?)?(?:over|in|(?:op )?(?<weekday_b>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?nacht|avond|middag|ochtend)? ?) ?(?:in|over)?(?:(?<years>\d\d?) jaar)?(?: en |, | )?(?:(?<months>\d\d?) maand)?(?: ?(?:in|op) de (?<week>\d)e (?:week (?:van (?<month>april|augustus|december|februari|januari|juli|juni|maart|mei|november|oktober|september))?)?(?:(?:op )?(?<weekday_c>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?nacht|avond|middag|ochtend)? ?)?)?(?: en |, | )?(?:(?<weeks>\d\d?) week(?: op ?(?<weekday_d>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?nacht|avond|middag|ochtend)? ?)?)?(?: en |, | )?(?:(?<days>\d\d?) dag)?(?: en |, | )?(?<!g )(?:(?<hours>\d\d?) uur)?(?: en |, | )?(?:(?<minutes>\d\d?) minuut)?(?: en |, | )?/v;

const RELATIVE_DATE_TIME_REGEX =
  /^(?:in|over) ?(?:(?<years>\d\d?) jaar)?(?: en |, | )?(?:(?<months>\d\d?) maand)?(?: en |, | )?(?:(?<weeks>\d\d?) week)?(?: en |, | )?(?:(?<days>\d\d?) dag)?(?: en |, | )?(?:(?<hours>\d\d?) uur)?(?: en |, | )?(?:(?<minutes>\d\d?) minuut)?/v;

// todo: alle weekdays moeten ochtend/nacht/middag/avond met opt. spatie kunnen accepteren
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
      "1 kwartier": "15 minuten",
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

  // private splitInput(input: string) {
  //   const regex =
  //     /(?!$)(?:(?:avond|middag|nacht|ochtend) )?(?:om )?(?:\d\d? )?(?:(?:half|(?:kwart )?voor(?: half)?|(?:kwart )?over(?: half)?) )?(?:\d\d?)?(?:uur)?(?: in de (?:avond|middag|nacht|ochtend))?$/v;
  //
  //   const match = regex.exec(input);
  //
  //   return {
  //     absoluteTime: match?.[0].trim(),
  //     remainder: input.replace(match?.[0] ?? "", "") || undefined,
  //   };
  // }

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

  private parseAbsoluteDate(start: DateTime, input: string) {
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

  private parseRelativeDate(start: DateTime, input: string): DateTime {
    const matches = Object.fromEntries(
      Object.entries(RELATIVE_DATE_TIME_REGEX.exec(input)?.groups ?? []).map(
        ([name, value]) => [name, this.parseNumber(value)],
      ),
    );

    let result = start.plus({
      years: matches.years,
      months: matches.months,
      weeks: matches.weeks,
      days: matches.days,
      hours: matches.hours,
      minutes: matches.minutes,
    });

    if (MONTHS.some((item) => input.includes(item))) {
      const monthIndex = MONTHS.findIndex((item) => input.includes(item)) + 1;

      result = result.set({ month: monthIndex });
    }

    if (["1e", "2e", "3e", "4e"].some((item) => input.includes(item))) {
      const weekIndex =
        (this.parseNumber(/(?<offset>\d)e/v.exec(input)?.groups?.offset) ?? 0) -
        1;

      result = result.startOf("month").plus({ weeks: weekIndex }).set({
        hour: 13,
      });
    }

    if (input.includes(" op ") || input.includes(" om ")) {
      const weekdayIndex = DAYS.findIndex((day) => input.includes(day));

      if (input.includes(" op ")) {
        result = result.startOf("week").plus({
          days: weekdayIndex,
        });
      }

      result = this.parseAbsoluteTime(result, input);
    }

    return result;
  }

  private parseNthWeekOfMonth(start: DateTime, input: string): DateTime {}

  // private parseRelativeDate(start: DateTime, input: string) {
  //   const result = RELATIVE_DATE_REGEX.exec(input)?.groups;
  //   const years = this.parseNumber(result?.years);
  //   const months = this.parseNumber(result?.months);
  //   const weeks = this.parseNumber(result?.weeks);
  //   const days = this.parseNumber(result?.days);
  //   const hours = this.parseNumber(result?.hours);
  //   const minutes = this.parseNumber(result?.minutes);
  //   const month = result?.month;
  //   const week = this.parseNumber(result?.week);
  //   const weekday =
  //     result?.weekday_a ??
  //     result?.weekday_b ??
  //     result?.weekday_c ??
  //     result?.weekday_d;
  //
  //   let newDate = start;
  //
  //   newDate = newDate.plus({
  //     years,
  //     months,
  //     weeks,
  //     days,
  //     hours,
  //     minutes,
  //   });
  //
  //   if (month !== undefined) {
  //     newDate = newDate.set({ month: MONTHS.indexOf(month) + 1 });
  //   }
  //
  //   if (week !== undefined) {
  //     newDate = newDate
  //       .startOf("month")
  //       .plus({ weeks: week - 1 })
  //       .set({
  //         hour: newDate.hour,
  //         minute: newDate.minute,
  //         second: newDate.second,
  //         millisecond: newDate.millisecond,
  //       });
  //   }
  //
  //   if (weekday !== undefined) {
  //     newDate = newDate
  //       .startOf("week")
  //       .plus({
  //         days: DAYS.indexOf(weekday),
  //       })
  //       .set({
  //         hour: newDate.hour,
  //         minute: newDate.minute,
  //         second: newDate.second,
  //         millisecond: newDate.millisecond,
  //       });
  //   }
  //
  //   return newDate;
  // }

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

    if (RELATIVE_DATE_TIME_REGEX.test(normalizedInput)) {
      return this.parseRelativeDate(start, normalizedInput);
    }

    if (ABSOLUTE_DATE_REGEX.test(normalizedInput)) {
      return this.parseAbsoluteDate(start, normalizedInput);
    }

    return this.parseAbsoluteTime(start, normalizedInput);

    // return undefined;
  }
}
