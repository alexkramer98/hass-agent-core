import { config } from "dotenv";
import InputParser from "./services/InputParser";
import ConversationHandler from "./services/ConversationHandler";
import ConversationServer from "./services/ConversationServer";
import HassClient from "./services/HassClient";
import OllamaClient from "./services/OllamaClient";

config();

const inputParser = new InputParser();
await inputParser.initialize();

if (process.env.HASS_ENDPOINT === undefined) {
  throw new Error("Hass endpoint is undefined.");
}
if (process.env.HASS_TOKEN === undefined) {
  throw new Error("Hass token is undefined.");
}

const hassClient = new HassClient(
  process.env.HASS_ENDPOINT,
  process.env.HASS_TOKEN,
);
const ollamaClient = new OllamaClient(process.env.OLLAMA_ENDPOINT);
const conversationHandler = new ConversationHandler(
  inputParser,
  hassClient,
  ollamaClient,
);
const conversationServer = new ConversationServer(
  Number(process.env.PORT),
  conversationHandler,
);
