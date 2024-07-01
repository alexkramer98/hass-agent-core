import { config } from "dotenv";

import DateGuesser from "./services/DateGuesser";
import HassClient from "./services/HassClient";
import InputParser from "./services/InputParser";
import IntentHandler from "./services/IntentHandler";
import OllamaClient from "./services/OllamaClient";
import Server from "./services/Server";

config();

const inputParser = new InputParser();

await inputParser.initialize();

if (process.env.HASS_ENDPOINT === undefined) {
  throw new Error("Hass endpoint is undefined.");
}

if (process.env.OLLAMA_ENDPOINT === undefined) {
  throw new Error("Ollama endpoint is undefined.");
}

if (process.env.HASS_TOKEN === undefined) {
  throw new Error("Hass token is undefined.");
}

const hassClient = new HassClient(
  process.env.HASS_ENDPOINT,
  process.env.HASS_TOKEN,
);
const ollamaClient = new OllamaClient(process.env.OLLAMA_ENDPOINT);
const intentHandler = new IntentHandler(inputParser, hassClient, ollamaClient);
const server = new Server(intentHandler);

server.listen(Number(process.env.PORT));

const dateGuesser = new DateGuesser().guess(
  // "volgende week zondag",
  "volgende week maandag",

  // "4 januari om 3 uur",

  // "over drie weken op donderdag om half 6",
);
