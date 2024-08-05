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

export default class OldDateGuesser {
  private findAndReplace(
    result: string,
    replacements: {
      [key: string]: string;
    },
  ) {
    Object.entries(replacements).forEach(([search, replace]) => {
      result = result.replace(search, replace);
    });

    return result;
  }

  private normalizeNumbers(input: string) {
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
    };

    return this.findAndReplace(input, replacements);
  }

  private normalizeRelative(input: string) {
    const result = this.normalizeNumbers(input);

    const replacements = {
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

    return this.findAndReplace(result, replacements);
  }

  private parseRelative(input: string) {
    const normalizedInput = this.normalizeRelative(input);
    const regex = // eslint-disable-next-line max-len,regexp/no-super-linear-move,sonar/unused-named-groups
      /(?<years>\d+) jaar|(?<months>\d+) maand|(?<weeks>\d+) week|(?<days>\d+) dag|(?<hours>\d+) uur|(?<minutes>\d+) minuut/gv;

    const groups = ["years", "months", "weeks", "days", "hours", "minutes"];

    let match = undefined;
    let result = dayjs();

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(normalizedInput)) !== null) {
      for (const group of groups) {
        if (match.groups?.[group] !== undefined) {
          // @ts-expect-error - exists
          result = result.add(Number(match.groups[group]), group);
        }
      }
    }

    // todo: op/om (over 3 weken op maandag om 3 uur)
    return result;
  }

  private parseAbsolute(input: string) {
    let date = dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0);

    // const normalizedInput = this.normalizeNumbers(input);
    // const regex =
    //   // eslint-disable-next-line max-len
    //   // eslint-disable-next-line security/detect-unsafe-regex,regexp/no-super-linear-move,sonar/unused-named-groups,max-len
    //   /(?<day>\d+) (?<month>april|augustus|december|februari|januari|juli|juni|maart|mei|november|oktober|september) ?(?<year>\d+)?/gv;
    //
    // let match = undefined;
    //
    // const matches: { day?: string; month?: string; year?: string } = {};
    // const groups = ["day", "month", "year"];
    //
    // // eslint-disable-next-line no-cond-assign
    // while ((match = regex.exec(normalizedInput)) !== null) {
    //   for (const group of groups) {
    //     if (match.groups?.[group] !== undefined) {
    //       // @ts-expect-error - exists
    //       matches[group] = match.groups[group];
    //     }
    //   }
    // }
    //
    // // todo: is datum valid? Wanneer afbreken?
    // //   todo: 15.30 en 15:30 komen nu niet goed mee, maar zin mag niet eindigen met .
    //   todo: tijd bepalen, sharen met bovenstaande functie
    const weekdays = [
      "maandag",
      "dinsdag",
      "woensdag",
      "donderdag",
      "vrijdag",
      "zaterdag",
      "zondag",
    ];

    for (const [index, weekday] of weekdays.entries()) {
      if (input.includes(weekday)) {
        if (!input.includes("volgende week") && index < date.day() - 1) {
          date = date.add(1, "weeks");
        }

        date = date.weekday(index);

        break;
      }
    }

    if (input.includes("volgend jaar")) {
      date = date.add(1, "years").set("months", 0).set("date", 1);
    } else if (input.includes("volgende maand")) {
      date = date.add(1, "months").set("date", 1);
    } else if (input.includes("volgende week")) {
      date = date.add(1, "weeks");

      if (!weekdays.some((weekday) => input.includes(weekday))) {
        date = date.weekday(0);
      }
    } else if (input.includes("overmorgen")) {
      date = date.add(2, "days");
    } else if (input.includes("morgen")) {
      date = date.add(1, "days");

      if (input.includes("morgenmiddag")) {
        date = date.add(12, "hours");
      } else if (input.includes("morgenavond")) {
        date = date.add(18, "hours");
      }
    }

    return date;
  }

  public guess(input: string): Date | undefined {
    if (["over ", "in "].some((condition) => input.includes(condition))) {
      console.log("REL", this.parseRelative(input).format("L LT"));

      return this.parseRelative(input).toDate();
    }

    // todo: match NUM MND NUM -> losse parsefunctie
    console.log("ABS", this.parseAbsolute(input).format("L LT"));

    return this.parseAbsolute(input);
  }
}
