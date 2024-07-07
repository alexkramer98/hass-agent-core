import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormatPlugin from "dayjs/plugin/localizedFormat";
import updateLocalePlugin from "dayjs/plugin/updateLocale";
import weekdayPlugin from "dayjs/plugin/weekday";
import weekOfYearPlugin from "dayjs/plugin/weekOfYear";

import NewDateGuesser from "./services/NewDateGuesser";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(updateLocalePlugin);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(customParseFormat);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale("nl");
dayjs.updateLocale("nl", {
  weekStart: 1,
});

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(localizedFormatPlugin);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(weekdayPlugin);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(weekOfYearPlugin);

const guesser = new NewDateGuesser();

const getDate = (): Dayjs =>
  // -------------------
  dayjs()
    .set("years", 2000)
    .set("months", 0)
    .set("date", 1)
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0);

const tests = {
  "4 februari om half 4": getDate()
    .set("date", 4)
    .set("months", 1)
    .set("hours", 15)
    .set("minutes", 30),

  "10 maart om kwart voor 6": getDate()
    .set("date", 10)
    .set("months", 2)
    .set("hours", 17)
    .set("minutes", 45),

  "1 januari 2025 om middernacht": getDate()
    .set("year", 2025)
    .set("date", 1)
    .set("months", 0)
    .set("hours", 0)
    .set("minutes", 0),

  "15 april om 10 uur 's ochtends": getDate()
    .set("date", 15)
    .set("months", 3)
    .set("hours", 10)
    .set("minutes", 0),

  "30 juni om kwart over 2 's middags": getDate()
    .set("date", 30)
    .set("months", 5)
    .set("hours", 14)
    .set("minutes", 15),

  "20 juli 2024 om 5 over half 8": getDate()
    .set("year", 2024)
    .set("date", 20)
    .set("months", 6)
    .set("hours", 19)
    .set("minutes", 35),

  "25 augustus om 3 uur 's nachts": getDate()
    .set("date", 25)
    .set("months", 7)
    .set("hours", 3)
    .set("minutes", 0),

  "10 september om 11 uur": getDate()
    .set("date", 10)
    .set("months", 8)
    .set("hours", 11)
    .set("minutes", 0),

  "5 oktober om 20 voor 4 's middags": getDate()
    .set("date", 5)
    .set("months", 9)
    .set("hours", 15)
    .set("minutes", 40),

  "31 december 2024 om kwart voor 12": getDate()
    .set("year", 2024)
    .set("date", 31)
    .set("months", 11)
    .set("hours", 11)
    .set("minutes", 45),

  "2 februari om kwart over 3 's middags": getDate()
    .set("date", 2)
    .set("months", 1)
    .set("hours", 15)
    .set("minutes", 15),

  "8 maart om 20 over 8 's ochtends": getDate()
    .set("date", 8)
    .set("months", 2)
    .set("hours", 8)
    .set("minutes", 20),

  "14 april 2024 om kwart over 7": getDate()
    .set("year", 2024)
    .set("date", 14)
    .set("months", 3)
    .set("hours", 19)
    .set("minutes", 15),

  "22 mei om 10 uur 's avonds": getDate()
    .set("date", 22)
    .set("months", 4)
    .set("hours", 22)
    .set("minutes", 0),

  "19 juni om half 2": getDate()
    .set("date", 19)
    .set("months", 5)
    .set("hours", 13)
    .set("minutes", 30),

  "19 juni om zeven voor half 9 in de ochtend": getDate()
    .set("date", 19)
    .set("months", 5)
    .set("hours", 8)
    .set("minutes", 23),

  "7 juli om kwart voor 9 's ochtends": getDate()
    .set("date", 7)
    .set("months", 6)
    .set("hours", 8)
    .set("minutes", 45),

  "13 augustus 2024 om kwart over 5 in de ochtend": getDate()
    .set("year", 2024)
    .set("date", 13)
    .set("months", 7)
    .set("hours", 5)
    .set("minutes", 15),

  "27 september om 6 uur 's middags": getDate()
    .set("date", 27)
    .set("months", 8)
    .set("hours", 18)
    .set("minutes", 0),

  "9 oktober om kwart over 11 in de avond": getDate()
    .set("date", 9)
    .set("months", 9)
    .set("hours", 23)
    .set("minutes", 15),

  "16 november 2024 om 2 uur 's middags": getDate()
    .set("year", 2024)
    .set("date", 16)
    .set("months", 10)
    .set("hours", 14)
    .set("minutes", 0),

  "24 december om 9 uur 's ochtends": getDate()
    .set("date", 24)
    .set("months", 11)
    .set("hours", 9)
    .set("minutes", 0),

  "11 januari om half 6": getDate()
    .set("date", 11)
    .set("months", 0)
    .set("hours", 17)
    .set("minutes", 30),

  "5 mei om 3 uur 's middags": getDate()
    .set("date", 5)
    .set("months", 4)
    .set("hours", 15)
    .set("minutes", 0),

  "18 juni om kwart voor 4 's middags": getDate()
    .set("date", 18)
    .set("months", 5)
    .set("hours", 15)
    .set("minutes", 45),

  // -------------------

  "over 3 uur": getDate().set("hours", 3),

  "over 10 minuten": getDate().set("minutes", 10),

  "over een kwartier": getDate().set("minutes", 15),

  "over een half uur": getDate().set("minutes", 30),

  "over drie kwartier": getDate().set("minutes", 45),

  "in een uur": getDate().set("hours", 1),

  "over 2 dagen": getDate().set("date", 3),

  "over 6 maanden": getDate().set("months", 6),

  "over 10 jaar": getDate().set("years", 2010),

  "in 5 minuten": getDate().set("minutes", 5),

  "in anderhalf uur": getDate().set("hours", 1).set("minutes", 30),

  "over 2 jaar, 3 maanden en 2 weken, 1 dag, 4 uur en 30 minuten": getDate()
    .set("years", 2002)
    .set("months", 3)
    .week(2)
    .set("date", 1)
    .set("hours", 4)
    .set("minutes", 30),

  "over 1 jaar en 2 maanden": getDate().set("years", 2001).set("months", 2),

  "over 3 dagen en 6 en een half uur": getDate()
    .set("date", 4)
    .set("hours", 6)
    .set("minutes", 30),

  "over 3 weken": getDate().week(4),

  "over een maand en 1 week": getDate().set("months", 1).week(1),

  "in 2 weken op maandagavond": getDate()
    .set("weeks", 2)
    .set("days", 1)
    .set("hours", 18),

  "over 3 jaar, 2 maanden en 2 weken op dinsdag": getDate()
    .set("years", 3)
    .set("months", 2)
    .set("weeks", 2)
    .set("days", 2),

  "over 2 weken op woensdag om 4 uur": getDate()
    .set("weeks", 2)
    .set("days", 3)
    .set("hours", 4),

  "over 1 maand en 2 weken op donderdag 5 uur ‘s middags": getDate()
    .set("months", 1)
    .set("date", 14)
    .set("days", 4)
    .set("hours", 17),

  "over 2 weken om 6 uur": getDate().set("weeks", 2).set("hours", 6),

  "vrijdag nacht over 3 weken": getDate()
    .set("weeks", 3)
    .set("days", 5)
    .set("hours", 0),

  "op zaterdag over 2 weken en 2 en een half uur": getDate()
    .set("weeks", 2)
    .set("days", 6)
    .set("hours", 2)
    .set("minutes", 30),

  "op zondag over 2 maanden": getDate().set("months", 3).set("days", 7),

  "dinsdag over 2 jaren en 3 maanden en 2 weken en anderhalf uur": getDate()
    .set("years", 2)
    .set("months", 3)
    .set("weeks", 2)
    .set("days", 2)
    .set("hours", 1)
    .set("minutes", 30),

  "over 2 jaar in de vierde week van september": getDate()
    .set("years", 2)
    .set("months", 8)
    .set("date", 22),

  "in 2 jaar op de derde woensdag": getDate()
    .set("years", 2)
    .set("months", 0)
    .set("date", 17)
    .set("days", 3),

  "over 2 maanden in de derde week op maandag avond": getDate()
    .set("months", 2)
    .set("date", 15)
    .set("days", 1)
    .set("hours", 18),
};

const input = `over 3 uur
over 10 minuten
over een kwartier
over een half uur
over drie kwartier
in een uur
over 2 dagen
over 6 maanden
over 10 jaar
in 5 minuten
in anderhalf uur
over 2 jaar, 3 maanden en 2 weken, 1 dag, 4 uur en 30 minuten
over 1 jaar en 2 maanden
over 3 dagen en 6 en een half uur
over 3 weken
over een maand en 1 week
in 2 weken op maandagavond
over 3 jaar, 2 maanden en 2 weken op dinsdag
over 2 weken op woensdag om 4 uur
over 1 maand en 2 weken op donderdag 5 uur ‘s middags
over 2 weken om 6 uur
vrijdag nacht over 3 weken
op zaterdag over 2 weken en 2 en een half uur
op zondag over 2 maanden
dinsdag over 2 jaren en 3 maanden en 2 weken en anderhalf uur
over 2 jaar in de vierde week van september
in 2 jaar op de derde woensdag
over 2 maanden in de derde week op maandag avond`;

for (const [input, expectedDate] of Object.entries(tests)) {
  const result = guesser.guess(input);

  if (result === undefined) {
    console.log(`NOT IMPLEMENTED: ${input}`);

    continue;
  }

  const pass = result.unix() === expectedDate.unix();

  if (!pass) {
    const message = `FAIL: "${input}", expected: ${expectedDate.toDate().toLocaleString()}, got: ${result.toDate().toLocaleString()}`;

    console.log(message);
  }
}
