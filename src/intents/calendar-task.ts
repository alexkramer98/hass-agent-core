import { defineIntent, reply, close } from "../interfaces";

export default defineIntent({
  triggers: [
    "maak een herinnering",
    "herinner [(mij|me)] over {amount} (dag|dagen|uur|uren|minuut|minuten) [{thing}]",
  ],

  handle: async ({ vars, hassClient, triggerSentence }) => {},
});
