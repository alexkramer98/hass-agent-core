import type InputParser from "./InputParser";
import type { Intent, IntentVars } from "../interfaces";
import crypto from "crypto";

export default class ConversationHandler {
  private readonly messages: {
    [id: string]: {
      intent: Intent;
      vars: IntentVars;
      answerKey: string;
      deviceId?: string;
    };
  } = {};
  private readonly inputParser: InputParser;

  public constructor(inputParser: InputParser) {
    this.inputParser = inputParser;
  }

  public handle(message: string, deviceId?: string, messageId?: string) {
    let intent: Intent | undefined = undefined;
    let vars: IntentVars = {};

    if (messageId !== undefined) {
      const conversation = this.messages[messageId];
      if (conversation) {
        intent = conversation.intent;
        vars = conversation.vars;
        vars[conversation.answerKey] = message
          .toLowerCase()
          .replaceAll(/\W/g, "");

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.messages[messageId];
      }
    }

    if (intent === undefined) {
      const intentData = this.inputParser.getIntent(message);
      if (!intentData) {
        return {
          id: "None",
          msg: "Ik snap het niet man.",
        };
      }
      intent = intentData.intent;
      vars = intentData.vars;
    }

    const response = intent.handle(vars);

    if (response.answerKey === undefined) {
      return {
        id: "None",
        msg: response.message,
      };
    }
    const newMessageId = crypto.randomUUID();

    this.messages[newMessageId] = {
      intent,
      vars,
      answerKey: response.answerKey,
      deviceId,
    };

    return {
      id: newMessageId,
      msg: response.message,
    };
  }
}
