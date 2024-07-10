// // eslint-disable-next-line simple-import-sort/imports
// import "dayjs/locale/nl";
// import type { Dayjs } from "dayjs";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import localizedFormatPlugin from "dayjs/plugin/localizedFormat";
// import updateLocalePlugin from "dayjs/plugin/updateLocale";
// import weekdayPlugin from "dayjs/plugin/weekday";
// import type { DateTime } from "luxon";
//
// // eslint-disable-next-line import/no-named-as-default-member
// dayjs.extend(updateLocalePlugin);
// // eslint-disable-next-line import/no-named-as-default-member
// dayjs.extend(customParseFormat);
// // eslint-disable-next-line import/no-named-as-default-member
// dayjs.locale("nl");
// dayjs.updateLocale("nl", {
//   weekStart: 1,
// });
//
// // eslint-disable-next-line import/no-named-as-default-member
// dayjs.extend(localizedFormatPlugin);
// // eslint-disable-next-line import/no-named-as-default-member
// dayjs.extend(weekdayPlugin);
//
// const FULL_HOUR = 60;
// const HALF_HOUR = 30;
// const QUARTER_HOUR = 15;
// const HALF_DAY = 12;
// const FULL_DAY = 24;
//
// const MONTHS = [
//   "januari",
//   "februari",
//   "maart",
//   "april",
//   "mei",
//   "juni",
//   "juli",
//   "augustus",
//   "september",
//   "oktober",
//   "november",
//   "december",
// ];
//
// const DAYS = [
//   "maandag",
//   "dinsdag",
//   "woensdag",
//   "donderdag",
//   "vrijdag",
//   "zaterdag",
//   "zondag",
// ];
//
// const ABSOLUTE_DATE_REGEX =
//   /^(?:op )?(?<day>\d\d?) (?<month>april|augustus|december|februari|januari|juli|juni|maart|mei|november|oktober|september)(?: (?<year>\d{4}))?/v;
//
// const RELATIVE_DATE_REGEX =
//   /^(?:(?<weekday_d>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?)?(?:over|in|(?:op )?(?<weekday_a>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?) (?:(?<years>\d\d?) jaar)?(?: en |, | )?(?:(?<months>\d\d?) maand)?(?: ?(?:in|op) de (?<week>\d)e (?:week (?:van (?<month>april|augustus|februari|januari|juli|juni|maart|mei|novemberdecember|oktober|september))?)?(?:(?:op )?(?<weekday_b>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?)?)?(?: en |, | )?(?:(?<weeks>\d\d?) week(?: op ?(?<weekday_c>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?)?)?(?: en |, | )?(?:(?<days>\d\d?) dag)?(?: en |, | )?(?:(?<hours>\d\d?) uur)?(?: en |, | )?(?:(?<minutes>\d\d?) minuut)?(?: en |, | )?/v;
//
// //   todo: miss daypart niet meer nodig, want timeparser gebruikt geen regex
// // /^(?:(?<weekday_d>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?(?<daypart_d>avond|middag|nacht|ochtend)?)?(?:over|in|(?:op )?(?<weekday_a>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?(?<daypart_a>avond|middag|nacht|ochtend))?) (?:(?<years>\d\d?) jaar)?(?: en |, | )?(?:(?<months>\d\d?) maand)?(?: ?(?:in|op) de (?<week_absolute>\d)e (?:week (?:van (?<month>april|augustus|februari|januari|juli|juni|maart|mei|novemberdecember|oktober|september))?)?(?:(?:op )?(?<weekday_b>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?(?<daypart_b>avond|middag|nacht|ochtend))?)?)?(?: en |, | )?(?:(?<weeks_relative>\d\d?) week(?: op ?(?<weekday_c>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag)(?: ?(?<daypart_c>avond|middag|nacht|ochtend))?)?)?(?: en |, | )?(?:(?<days>\d\d?) dag)?(?: en |, | )?(?:(?<hours>\d\d?) uur)?(?: en |, | )?(?:(?<minutes>\d\d?) minuut)?(?: en |, | )?/v;
// export default class NewDateGuesser {
//   //   todo: .set naar .unit
//   private normalizeInput(result: string): string {
//     const replacements = {
//       eerste: "1e",
//       tweede: "2e",
//       derde: "3e",
//       vierde: "4e",
//       een: "1",
//       één: "1",
//       twee: "2",
//       drie: "3",
//       vier: "4",
//       vijf: "5",
//       zes: "6",
//       zeven: "7",
//       acht: "8",
//       negen: "9",
//       tien: "10",
//       middern8: "12 uur in de nacht",
//       "'s n8s": "in de nacht",
//       n8: "nacht",
//       "'s ochtends": "in de ochtend",
//       "'s middags": "in de middag",
//       "'s avonds": "in de avond",
//       "en 1 half uur": "uur en 30 minuten",
//       "1 half uur": "30 minuten",
//       "anderhalf uur": "1 uur en 30 minuten",
//       "3 kwartier": "45 minuten",
//       "1 kwartier": "15 minuten",
//       kwartier: "15 minuten",
//       "half uur": "30 minuten",
//       minuten: "minuut",
//       uren: "uur",
//       uurtje: "uur",
//       dagen: "dag",
//       weken: "week",
//       maanden: "maand",
//       jaren: "jaar",
//     };
//
//     for (const [search, replace] of Object.entries(replacements)) {
//       result = result.replace(search, replace);
//     }
//
//     return result;
//   }
//
//   private splitInput(input: string) {
//     const regex = //   todo: deze moet niet cijfers jatten uit "2 december 2025"
//       /(?!$)(?:(?:avond|middag|nacht|ochtend) )?(?:om )?(?:\d\d? )?(?:(?:half|(?:kwart )?voor(?: half)?|(?:kwart )?over(?: half)?) )?(?:\d\d?)?(?:uur)?(?: in de (?:avond|middag|nacht|ochtend))?$/v;
//
//     // /(?!$) ?(?:om )?(?:\d\d? )?(?:(?:half|(?:kwart )?voor(?: half)?|(?:kwart )?over(?: half)?) )?(?:\d\d?)?(?:uur)?(?: in de (?:avond|middag|nacht|ochtend))?$/v;
//     const match = regex.exec(input);
//
//     return {
//       absoluteTime: match?.[0].trim(),
//       remainder: input.replace(match?.[0] ?? "", "") || undefined,
//     };
//   }
//
//   private parseNumber(input?: string) {
//     const number = Number(input);
//
//     return Number.isNaN(number) ? undefined : number;
//   }
//
//   private parseFullHour(input: string) {
//     return {
//       hours: this.parseNumber(
//         /(?<hours>\d\d?) uur/v.exec(input)?.groups?.hours,
//       ),
//
//       minutes: 0,
//     };
//   }
//
//   private parseAfterHour(input: string) {
//     const result =
//       /(?:(?<minutes>\d\d?)|kwart) over (?:half )?(?<hours>\d\d?)/v.exec(
//         input,
//       )?.groups;
//
//     let hours = this.parseNumber(result?.hours);
//     let minutes = this.parseNumber(result?.minutes);
//
//     if (
//       minutes !== undefined &&
//       hours !== undefined &&
//       input.includes("half")
//     ) {
//       minutes += HALF_HOUR;
//       hours -= 1;
//     }
//
//     if (input.includes("kwart")) {
//       minutes = QUARTER_HOUR;
//     }
//
//     return {
//       hours,
//       minutes,
//     };
//   }
//
//   // eslint-disable-next-line max-statements
//   private parseBeforeHour(input: string) {
//     const result =
//       /(?:(?<minutes>\d\d?)|kwart) voor (?:half )?(?<hours>\d\d?)/v.exec(
//         input,
//       )?.groups;
//
//     let hours = this.parseNumber(result?.hours);
//     let minutes = this.parseNumber(result?.minutes);
//
//     if (hours !== undefined) {
//       hours -= 1;
//     }
//
//     if (minutes !== undefined) {
//       minutes = FULL_HOUR - minutes;
//
//       if (input.includes("half")) {
//         minutes -= HALF_HOUR;
//       }
//     }
//
//     if (input.includes("kwart")) {
//       minutes = FULL_HOUR - QUARTER_HOUR;
//     }
//
//     return {
//       hours,
//       minutes,
//     };
//   }
//
//   private parseHalfHour(input: string) {
//     const result = /half (?<hours>\d\d?)/v.exec(input)?.groups;
//
//     let hours = this.parseNumber(result?.hours);
//
//     if (hours !== undefined) {
//       hours -= 1;
//     }
//
//     return {
//       hours,
//       minutes: HALF_HOUR,
//     };
//   }
//
//   // eslint-disable-next-line complexity,max-statements,sonarjs/cognitive-complexity
//   private parseAbsoluteTime(start: Dayjs, input: string) {
//     let hours = undefined;
//     let minutes = undefined;
//
//     if (input.includes("uur")) {
//       ({ hours, minutes } = this.parseFullHour(input));
//     } else if (input.includes("over")) {
//       ({ hours, minutes } = this.parseAfterHour(input));
//     } else if (input.includes("voor")) {
//       ({ hours, minutes } = this.parseBeforeHour(input));
//     } else if (input.includes("half")) {
//       ({ hours, minutes } = this.parseHalfHour(input));
//     }
//
//     if (hours === undefined) {
//       hours = 0;
//     }
//
//     if (minutes === undefined) {
//       minutes = 0;
//     }
//
//     // expect 0-8 and 12 to be in the afternoon/evening, unless otherwise specified
//     if (
//       input.includes("middag") ||
//       input.includes("avond") || // eslint-disable-next-line @typescript-eslint/no-magic-numbers
//       (!input.includes("nacht") && !input.includes("ochtend") && hours <= 8) || // eslint-disable-next-line @typescript-eslint/no-magic-numbers
//       hours === 12
//     ) {
//       hours += HALF_DAY;
//     }
//
//     if (hours >= FULL_DAY) {
//       hours = 0;
//     }
//
//     return start.hour(hours).minute(minutes);
//   }
//
//   // todo: eslint putout o.a. weer aan
//
//   private parseAbsoluteDate(start: Dayjs, input: string) {
//     const result = ABSOLUTE_DATE_REGEX.exec(input)?.groups;
//
//     const day = this.parseNumber(result?.day);
//     const year = this.parseNumber(result?.year);
//     const month = result?.month;
//
//     let newDate = start.clone();
//
//     if (day !== undefined) {
//       newDate = newDate.set("date", day);
//     }
//
//     if (month !== undefined) {
//       newDate = newDate.set("months", MONTHS.indexOf(month));
//     }
//
//     if (year !== undefined) {
//       newDate = newDate.set("years", year);
//     }
//
//     return newDate;
//   }
//
//   private parseRelativeDate(start: Dayjs, input: string) {
//     const result = RELATIVE_DATE_REGEX.exec(input)?.groups;
//
//     const years = this.parseNumber(result?.years);
//     const months = this.parseNumber(result?.months);
//     const weeks = this.parseNumber(result?.weeks);
//     const days = this.parseNumber(result?.days);
//     const hours = this.parseNumber(result?.hours);
//     const minutes = this.parseNumber(result?.minutes);
//     const month = result?.month;
//     const week = this.parseNumber(result?.week);
//     const weekday =
//       result?.weekday_a ??
//       result?.weekday_b ??
//       result?.weekday_c ??
//       result?.weekday_d;
//
//     let newDate = start.clone().hour(0).minute(0);
//
//     if (years !== undefined) {
//       newDate = newDate.add(years, "years");
//     }
//
//     if (months !== undefined) {
//       newDate = newDate.add(months, "months");
//     }
//
//     if (weeks !== undefined) {
//       newDate = newDate.add(weeks * 7, "days");
//     }
//
//     if (days !== undefined) {
//       newDate = newDate.add(days, "days");
//     }
//
//     if (hours !== undefined) {
//       newDate = newDate.add(hours, "hours");
//     }
//
//     if (minutes !== undefined) {
//       newDate = newDate.add(minutes, "minutes");
//     }
//
//     if (month !== undefined) {
//       newDate = newDate.month(MONTHS.indexOf(month));
//     }
//
//     if (week !== undefined) {
//       newDate = newDate.date(0).add(7 * week, "days");
//     }
//
//     if (weekday !== undefined) {
//       newDate = newDate.weekday(DAYS.indexOf(weekday));
//     }
//
//     return newDate;
//   }
//
//   public guess(input: string): DateTime | undefined {
//     const normalizedInput = this.normalizeInput(input);
//
//     const start = dayjs()
//       .set("years", 2000)
//       .set("months", 0)
//       .set("date", 1)
//       .set("hours", 0)
//       .set("minutes", 0)
//       .set("seconds", 0);
//
//     // const { absoluteTime, remainder } = this.splitInput(normalizedInput);
//     const time = this.parseAbsoluteTime(start, normalizedInput);
//
//     // todo: als niet remainder, bouw absolute tijd en baseer op vandaag
//     // er kunnen regexes zijn die dingen matchen die ze niet mogen matchen, dus remainder lijkt noodzakelijk zodat er een full test gedaan kan worden
//     if (ABSOLUTE_DATE_REGEX.test(normalizedInput)) {
//       return this.parseAbsoluteDate(time, normalizedInput);
//     }
//
//     if (RELATIVE_DATE_REGEX.test(normalizedInput)) {
//       return this.parseRelativeDate(time, normalizedInput);
//     }
//
//     return undefined;
//   }
// }
import { DateTime } from "luxon";

const FULL_HOUR = 60;
const HALF_HOUR = 30;
const QUARTER_HOUR = 15;
const HALF_DAY = 12;
const FULL_DAY = 24;

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

const RELATIVE_DATE_REGEX =
  /^(?:(?<weekday_d>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?)?(?:over|in|(?:op )?(?<weekday_a>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?) (?:(?<years>\d\d?) jaar)?(?: en |, | )?(?:(?<months>\d\d?) maand)?(?: ?(?:in|op) de (?<week>\d)e (?:week (?:van (?<month>april|augustus|februari|januari|juli|juni|maart|mei|novemberdecember|oktober|september))?)?(?:(?:op )?(?<weekday_b>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?)?)?(?: en |, | )?(?:(?<weeks>\d\d?) week(?: op ?(?<weekday_c>dinsdag|donderdag|maandag|vrijdag|woensdag|zaterdag|zondag) ?)?)?(?: en |, | )?(?:(?<days>\d\d?) dag)?(?: en |, | )?(?:(?<hours>\d\d?) uur)?(?: en |, | )?(?:(?<minutes>\d\d?) minuut)?(?: en |, | )?/v;

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

  private splitInput(input: string) {
    const regex =
      /(?!$)(?:(?:avond|middag|nacht|ochtend) )?(?:om )?(?:\d\d? )?(?:(?:half|(?:kwart )?voor(?: half)?|(?:kwart )?over(?: half)?) )?(?:\d\d?)?(?:uur)?(?: in de (?:avond|middag|nacht|ochtend))?$/v;

    const match = regex.exec(input);

    return {
      absoluteTime: match?.[0].trim(),
      remainder: input.replace(match?.[0] ?? "", "") || undefined,
    };
  }

  private parseNumber(input?: string) {
    const number = Number(input);

    return Number.isNaN(number) ? undefined : number;
  }

  private parseFullHour(input: string) {
    return {
      hours: this.parseNumber(
        /(?<hours>\d\d?) uur/v.exec(input)?.groups?.hours,
      ),

      minutes: 0,
    };
  }

  private parseAfterHour(input: string) {
    const result =
      /(?:(?<minutes>\d\d?)|kwart) over (?:half )?(?<hours>\d\d?)/v.exec(
        input,
      )?.groups;

    let hours = this.parseNumber(result?.hours);
    let minutes = this.parseNumber(result?.minutes);

    if (
      minutes !== undefined &&
      hours !== undefined &&
      input.includes("half")
    ) {
      minutes += HALF_HOUR;
      hours -= 1;
    }

    if (input.includes("kwart")) {
      minutes = QUARTER_HOUR;
    }

    return { hours, minutes };
  }

  private parseBeforeHour(input: string) {
    const result =
      /(?:(?<minutes>\d\d?)|kwart) voor (?:half )?(?<hours>\d\d?)/v.exec(
        input,
      )?.groups;

    let hours = this.parseNumber(result?.hours);
    let minutes = this.parseNumber(result?.minutes);

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
    const result = /half (?<hours>\d\d?)/v.exec(input)?.groups;

    let hours = this.parseNumber(result?.hours);

    if (hours !== undefined) {
      hours -= 1;
    }

    return { hours, minutes: HALF_HOUR };
  }

  private parseAbsoluteTime(start: DateTime, input: string) {
    let hours = undefined;
    let minutes = undefined;

    if (input.includes("uur")) {
      ({ hours, minutes } = this.parseFullHour(input));
    } else if (input.includes("over")) {
      ({ hours, minutes } = this.parseAfterHour(input));
    } else if (input.includes("voor")) {
      ({ hours, minutes } = this.parseBeforeHour(input));
    } else if (input.includes("half")) {
      ({ hours, minutes } = this.parseHalfHour(input));
    }

    if (hours === undefined) {
      hours = 0;
    }

    if (minutes === undefined) {
      minutes = 0;
    }

    if (
      input.includes("middag") ||
      input.includes("avond") ||
      (!input.includes("nacht") && !input.includes("ochtend") && hours <= 8) ||
      hours === 12
    ) {
      hours += HALF_DAY;
    }

    if (hours >= FULL_DAY) {
      hours = 0;
    }

    return start.set({ hour: hours, minute: minutes });
  }

  private parseAbsoluteDate(start: DateTime, input: string) {
    const result = ABSOLUTE_DATE_REGEX.exec(input)?.groups;
    const day = this.parseNumber(result?.day);
    const year = this.parseNumber(result?.year);
    const month = result?.month;

    return start.set({
      day,
      month: month === undefined ? undefined : MONTHS.indexOf(month) + 1,
      year,
    });
  }

  private parseRelativeDate(start: DateTime, input: string) {
    const result = RELATIVE_DATE_REGEX.exec(input)?.groups;
    const years = this.parseNumber(result?.years);
    const months = this.parseNumber(result?.months);
    const weeks = this.parseNumber(result?.weeks);
    const days = this.parseNumber(result?.days);
    const hours = this.parseNumber(result?.hours);
    const minutes = this.parseNumber(result?.minutes);
    const month = result?.month;
    const week = this.parseNumber(result?.week);
    const weekday =
      result?.weekday_a ??
      result?.weekday_b ??
      result?.weekday_c ??
      result?.weekday_d;

    let newDate = start.set({ hour: 0, minute: 0 });

    newDate = newDate.plus({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
    });

    if (month !== undefined) {
      newDate = newDate.set({ month: MONTHS.indexOf(month) + 1 });
    }

    if (week !== undefined) {
      newDate = newDate.startOf("month").plus({ weeks: week - 1 });
    }

    if (weekday !== undefined) {
      newDate = newDate.startOf("week").plus({
        days: DAYS.indexOf(weekday),
      });
    }

    return newDate;
  }

  public guess(input: string): DateTime | undefined {
    const normalizedInput = this.normalizeInput(input);

    const start = DateTime.fromObject({
      year: 2000,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });

    const { absoluteTime, remainder } = this.splitInput(normalizedInput);
    const time = this.parseAbsoluteTime(start, normalizedInput);

    if (ABSOLUTE_DATE_REGEX.test(normalizedInput)) {
      return this.parseAbsoluteDate(time, normalizedInput);
    }

    if (RELATIVE_DATE_REGEX.test(normalizedInput)) {
      return this.parseRelativeDate(time, normalizedInput);
    }

    return undefined;
  }
}
