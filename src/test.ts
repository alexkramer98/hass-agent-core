import NewDateGuesser from "./services/NewDateGuesser";

const guesser = new NewDateGuesser();

const input = `om 3 uur 's middags
om 4 uur 's nachts
om 8 uur 's avonds
7 uur in de ochtend
om half 6
om 5 uur
om kwart voor 7
om kwart over 10
om 20 over 3
om tien voor half 8
10 over 2 in de nacht
om 7 over 3
tien over half 8
om 20 over 9
om middernacht
om 6 voor zeven
om vijf voor half 3`;

for (const item of input.split("\n")) {
  console.log("input:", item);
  guesser.guess(item);
}
