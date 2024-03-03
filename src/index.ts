import { config } from "dotenv";
import InputParser from "./services/InputParser";
import ConversationHandler from "./services/ConversationHandler";
import ConversationServer from "./services/ConversationServer";

config();

const inputParser = new InputParser();
await inputParser.initialize();

const conversationHandler = new ConversationHandler(inputParser);
const conversationServer = new ConversationServer(
  Number(process.env.PORT),
  conversationHandler,
);
