import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormatPlugin from "dayjs/plugin/localizedFormat";
import updateLocalePlugin from "dayjs/plugin/updateLocale";
import weekdayPlugin from "dayjs/plugin/weekday";
import { DateTime } from "luxon";

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

const guesser = new NewDateGuesser();

const getDate = (): DateTime => DateTime.local(2000, 1, 1, 0, 0, 0);

const tests = {
  "4 februari om half 4": getDate().set({
    day: 4,
    month: 2,
    hour: 15,
    minute: 30,
  }),

  "10 maart om kwart voor 6": getDate().set({
    day: 10,
    month: 3,
    hour: 17,
    minute: 45,
  }),

  "1 januari 2025 om middernacht": getDate().set({
    year: 2025,
    day: 1,
    month: 1,
    hour: 0,
    minute: 0,
  }),

  "15 april om 10 uur 's ochtends": getDate().set({
    day: 15,
    month: 4,
    hour: 10,
    minute: 0,
  }),

  "30 juni om kwart over 2 's middags": getDate().set({
    day: 30,
    month: 6,
    hour: 14,
    minute: 15,
  }),

  "20 juli 2024 om 5 over half 8": getDate().set({
    year: 2024,
    day: 20,
    month: 7,
    hour: 19,
    minute: 35,
  }),

  "25 augustus om 3 uur 's nachts": getDate().set({
    day: 25,
    month: 8,
    hour: 3,
    minute: 0,
  }),

  "10 september om 11 uur": getDate().set({
    day: 10,
    month: 9,
    hour: 11,
    minute: 0,
  }),

  "5 oktober om 20 voor 4 's middags": getDate().set({
    day: 5,
    month: 10,
    hour: 15,
    minute: 40,
  }),

  "31 december 2024 om kwart voor 12": getDate().set({
    year: 2024,
    day: 31,
    month: 12,
    hour: 11,
    minute: 45,
  }),

  "2 februari om kwart over 3 's middags": getDate().set({
    day: 2,
    month: 2,
    hour: 15,
    minute: 15,
  }),

  "8 maart om 20 over 8 's ochtends": getDate().set({
    day: 8,
    month: 3,
    hour: 8,
    minute: 20,
  }),

  "14 april 2024 om kwart over 7": getDate().set({
    year: 2024,
    day: 14,
    month: 4,
    hour: 19,
    minute: 15,
  }),

  "22 mei om 10 uur 's avonds": getDate().set({
    day: 22,
    month: 5,
    hour: 22,
    minute: 0,
  }),

  "19 juni om half 2": getDate().set({
    day: 19,
    month: 6,
    hour: 13,
    minute: 30,
  }),

  "19 juni om zeven voor half 9 in de ochtend": getDate().set({
    day: 19,
    month: 6,
    hour: 8,
    minute: 23,
  }),

  "7 juli om kwart voor 9 's ochtends": getDate().set({
    day: 7,
    month: 7,
    hour: 8,
    minute: 45,
  }),

  "13 augustus 2024 om kwart over 5 in de ochtend": getDate().set({
    year: 2024,
    day: 13,
    month: 8,
    hour: 5,
    minute: 15,
  }),

  "27 september om 6 uur 's middags": getDate().set({
    day: 27,
    month: 9,
    hour: 18,
    minute: 0,
  }),

  "9 oktober om kwart over 11 in de avond": getDate().set({
    day: 9,
    month: 10,
    hour: 23,
    minute: 15,
  }),

  "16 november 2024 om 2 uur 's middags": getDate().set({
    year: 2024,
    day: 16,
    month: 11,
    hour: 14,
    minute: 0,
  }),

  "24 december om 9 uur 's ochtends": getDate().set({
    day: 24,
    month: 12,
    hour: 9,
    minute: 0,
  }),

  "11 januari om half 6": getDate().set({
    day: 11,
    month: 1,
    hour: 17,
    minute: 30,
  }),

  "5 mei om 3 uur 's middags": getDate().set({
    day: 5,
    month: 5,
    hour: 15,
    minute: 0,
  }),

  "18 juni om kwart voor 4 's middags": getDate().set({
    day: 18,
    month: 6,
    hour: 15,
    minute: 45,
  }),

  // -------------------

  "over 3 uur": getDate().plus({ hours: 3 }),

  "over 10 minuten": getDate().plus({ minutes: 10 }),

  "over een kwartier": getDate().plus({ minutes: 15 }),

  "over een half uur": getDate().plus({ minutes: 30 }),

  "over drie kwartier": getDate().plus({ minutes: 45 }),

  "in een uur": getDate().plus({ hours: 1 }),

  "over 2 dagen": getDate().plus({ days: 2 }),

  "over 6 maanden": getDate().plus({ months: 6 }),

  "over 10 jaar": getDate().plus({ years: 10 }),

  "in 5 minuten": getDate().plus({ minutes: 5 }),

  "in anderhalf uur": getDate().plus({ hours: 1, minutes: 30 }),

  "over 2 jaar, 3 maanden en 2 weken, 1 dag, 4 uur en 30 minuten":
    getDate().plus({
      years: 2,
      months: 3,
      weeks: 2,
      days: 1,
      hours: 4,
      minutes: 30,
    }),

  "over 1 jaar en 2 maanden": getDate().plus({ years: 1, months: 2 }),

  "over 3 dagen en 6 en een half uur": getDate().plus({
    days: 3,
    hours: 6,
    minutes: 30,
  }),

  "over 3 weken": getDate().plus({ weeks: 3 }),

  "over een maand en 1 week": getDate().plus({ months: 1, weeks: 1 }),

  "in 2 weken op maandagavond": getDate().set({
    day: 10,
    hour: 18,
  }),

  "over 3 jaar, 2 maanden en 2 weken op dinsdag": getDate().plus({
    years: 3,
    months: 2,
    weeks: 2,
    days: 2,
  }),

  "over 2 weken op woensdag om 4 uur": getDate().plus({
    weeks: 2,
    days: 3,
    hours: 4,
  }),

  "over 1 maand en 2 weken op donderdag 5 uur 's middags": getDate().plus({
    months: 1,
    weeks: 2,
    days: 4,
    hours: 17,
  }),

  "over 2 weken om 6 uur": getDate().plus({ weeks: 2, hours: 6 }),

  "vrijdag nacht over 3 weken": getDate().plus({ weeks: 3, days: 5, hours: 0 }),

  "op zaterdag over 2 weken en 2 en een half uur": getDate().plus({
    weeks: 2,
    days: 6,
    hours: 2,
    minutes: 30,
  }),

  "op zondag over 2 maanden": getDate().plus({ months: 2, days: 7 }),

  "dinsdag over 2 jaren en 3 maanden en 2 weken en anderhalf uur":
    getDate().plus({
      years: 2,
      months: 3,
      weeks: 2,
      days: 2,
      hours: 1,
      minutes: 30,
    }),

  "over 2 jaar in de vierde week van september": getDate().plus({
    years: 2,
    months: 8,
    weeks: 4,
  }),

  "in 2 jaar op de derde woensdag": getDate().plus({
    years: 2,
    months: 3,
    days: 16,
  }),

  "over 2 maanden in de derde week op maandag avond": getDate().plus({
    months: 2,
    weeks: 3,
    days: 1,
    hours: 18,
  }),
};

for (const [input, expectedDate] of Object.entries(tests)) {
  const result = guesser.guess(input);

  if (result === undefined) {
    console.log(`NOT IMPLEMENTED: ${input}`);

    continue;
  }

  const pass = result.toMillis() === expectedDate.toMillis();

  if (!pass) {
    const message = `fail: "${input}", expected: ${expectedDate.toJSDate().toLocaleString()}, got: ${result.toJSDate().toLocaleString()}`;

    console.log(message);
  }
}
