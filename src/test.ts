import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormatPlugin from "dayjs/plugin/localizedFormat";
import updateLocalePlugin from "dayjs/plugin/updateLocale";
import weekdayPlugin from "dayjs/plugin/weekday";
import { DateTime } from "luxon";

import DateGuesser from "./services/DateGuesser";

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

const guesser = new DateGuesser();

const getDate = (): DateTime => DateTime.local(2000, 1, 1, 15, 36, 22, 611);

const tests = {
  "om 4 uur": getDate().set({
    hour: 16,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "om 10 uur": getDate().set({
    hour: 10,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "om 6 uur": getDate().set({
    hour: 18,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "4 februari om half 4": getDate().set({
    day: 4,
    month: 2,
    hour: 15,
    minute: 30,
    second: 0,
    millisecond: 0,
  }),

  "10 maart om kwart voor 6": getDate().set({
    day: 10,
    month: 3,
    hour: 17,
    minute: 45,
    second: 0,
    millisecond: 0,
  }),

  "15 april om 10 uur 's ochtends": getDate().set({
    day: 15,
    month: 4,
    hour: 10,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "30 juni om kwart over 2 's middags": getDate().set({
    day: 30,
    month: 6,
    hour: 14,
    minute: 15,
    second: 0,
    millisecond: 0,
  }),

  "20 juli 2024 om 5 over half 8": getDate().set({
    year: 2024,
    day: 20,
    month: 7,
    hour: 19,
    minute: 35,
    second: 0,
    millisecond: 0,
  }),

  "25 augustus om 3 uur 's nachts": getDate().set({
    day: 25,
    month: 8,
    hour: 3,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "10 september om 11 uur": getDate().set({
    day: 10,
    month: 9,
    hour: 11,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "5 oktober om 20 voor 4 's middags": getDate().set({
    day: 5,
    month: 10,
    hour: 15,
    minute: 40,
    second: 0,
    millisecond: 0,
  }),

  "31 december 2024 om kwart voor 12": getDate().set({
    year: 2024,
    day: 31,
    month: 12,
    hour: 11,
    minute: 45,
    second: 0,
    millisecond: 0,
  }),

  "2 februari om kwart over 3 in de middag": getDate().set({
    day: 2,
    month: 2,
    hour: 15,
    minute: 15,
    second: 0,
    millisecond: 0,
  }),

  "8 maart om 20 over 8 's ochtends": getDate().set({
    day: 8,
    month: 3,
    hour: 8,
    minute: 20,
    second: 0,
    millisecond: 0,
  }),

  "14 april 2024 om kwart over 7": getDate().set({
    year: 2024,
    day: 14,
    month: 4,
    hour: 19,
    minute: 15,
    second: 0,
    millisecond: 0,
  }),

  "22 mei om 10 uur in de avond": getDate().set({
    day: 22,
    month: 5,
    hour: 22,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "19 juni om half 2": getDate().set({
    day: 19,
    month: 6,
    hour: 13,
    minute: 30,
    second: 0,
    millisecond: 0,
  }),

  "19 juni om zeven voor half 9 in de ochtend": getDate().set({
    day: 19,
    month: 6,
    hour: 8,
    minute: 23,
    second: 0,
    millisecond: 0,
  }),

  "7 juli om kwart voor 9 's ochtends": getDate().set({
    day: 7,
    month: 7,
    hour: 8,
    minute: 45,
    second: 0,
    millisecond: 0,
  }),

  "13 augustus 2024 om kwart over 5 in de ochtend": getDate().set({
    year: 2024,
    day: 13,
    month: 8,
    hour: 5,
    minute: 15,
    second: 0,
    millisecond: 0,
  }),

  "27 september om 6 uur 's middags": getDate().set({
    day: 27,
    month: 9,
    hour: 18,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "9 oktober om kwart over 11 in de avond": getDate().set({
    day: 9,
    month: 10,
    hour: 23,
    minute: 15,
    second: 0,
    millisecond: 0,
  }),

  "16 november 2024 om 2 uur 's middags": getDate().set({
    year: 2024,
    day: 16,
    month: 11,
    hour: 14,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "24 december om 9 uur 's ochtends": getDate().set({
    day: 24,
    month: 12,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "11 januari om half 6": getDate().set({
    day: 11,
    month: 1,
    hour: 17,
    minute: 30,
    second: 0,
    millisecond: 0,
  }),

  "5 mei om 3 uur 's middags": getDate().set({
    day: 5,
    month: 5,
    hour: 15,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "18 juni om kwart voor 4 's middags": getDate().set({
    day: 18,
    month: 6,
    hour: 15,
    minute: 45,
    second: 0,
    millisecond: 0,
  }),

  // -------------------

  "over 3 uur": getDate().plus({ hours: 3 }),

  "over 10 minuten": getDate().plus({ minutes: 10 }),

  "over een kwartier": getDate().plus({ minutes: 15 }),

  "over een half uur": getDate().plus({ minutes: 30 }),

  "over drie kwartier": getDate().plus({ minutes: 45 }),

  "over een uur": getDate().plus({ hours: 1 }),

  "over 2 dagen": getDate().plus({ days: 2 }),
  "over 5 dagen": getDate().plus({ days: 5 }),

  "over 5 minuten": getDate().plus({ minutes: 5 }),

  "over anderhalf uur": getDate().plus({ hours: 1, minutes: 30 }),

  "over 4 uur en 30 minuten": getDate().plus({
    hours: 4,
    minutes: 30,
  }),

  "over 3 weken": getDate().plus({ weeks: 3 }),

  "over 2 weken op maandagavond": getDate().set({
    day: 10,
    hour: 19,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "2 weken op dinsdag": getDate().set({
    day: 11,
    month: 3,
    hour: 13,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "over 2 weken op woensdag om 4 uur": getDate().set({
    day: 12,
    hour: 16,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "2 weken op donderdag om 5 uur 's middags": getDate().set({
    month: 2,
    day: 17,
    hour: 17,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "over 2 weken om 6 uur": getDate()
    .plus({ weeks: 2 })
    .set({ hour: 18, minute: 0, second: 0, millisecond: 0 }),

  "op zaterdag over 2 weken": getDate().set({
    day: 15,
  }),

  "op vrijdag": getDate().set({
    day: 7,
    hour: 13,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  vrijdag: getDate().set({
    day: 7,
    hour: 13,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),

  "donderdag om half 4": getDate().set({
    day: 6,
    hour: 15,
    minute: 30,
    second: 0,
    millisecond: 0,
  }),
};

for (const [input, expectedDate] of Object.entries(tests)) {
  const result = guesser.guess(input);

  if (result === undefined) {
    console.log(`NOT IMPLEMENTED: ${input}`);

    continue;
  }

  const pass = result.toMillis() === expectedDate.toMillis();

  if (pass) {
    // console.log(`PASS: ${input}`);
  } else {
    const message = `FAIL: "${input}", expected: ${expectedDate.toJSDate().toLocaleString()}, got: ${result.toJSDate().toLocaleString()}`;

    console.log(message);
  }
}
