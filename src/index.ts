import { config } from "dotenv";
import { ToadScheduler } from "toad-scheduler";

import DateGuesser from "./services/DateGuesser";
import GoogleTasksClient from "./services/GoogleTasksClient";
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

if (process.env.GOOGLE_EMAIL === undefined) {
  throw new Error("Google email is undefined.");
}

if (process.env.GOOGLE_PASS === undefined) {
  throw new Error("Google pass is undefined.");
}

const hassClient = new HassClient(
  process.env.HASS_ENDPOINT,
  process.env.HASS_TOKEN,
);
const ollamaClient = new OllamaClient(process.env.OLLAMA_ENDPOINT);
const dateGuesser = new DateGuesser();
const googleTasksClient = new GoogleTasksClient();
const scheduler = new ToadScheduler();

googleTasksClient.scheduleSessionKeepalive(scheduler);

const intentHandler = new IntentHandler(
  inputParser,
  hassClient,
  ollamaClient,
  dateGuesser,
  googleTasksClient,
  scheduler,
);

const server = new Server(intentHandler);

server.listen(Number(process.env.PORT));
