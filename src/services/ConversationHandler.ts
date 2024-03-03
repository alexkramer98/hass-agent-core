import type InputParser from "./InputParser";
import type { Intent, IntentVars } from "../interfaces";
import crypto from "crypto";

export default class ConversationHandler {
  private readonly activeConversations: {
    intent: Intent;
    vars: IntentVars;
    answerKey: string;
    deviceId?: string;
    messageId?: string;
  }[] = [];
  private readonly inputParser: InputParser;

  public constructor(inputParser: InputParser) {
    this.inputParser = inputParser;
  }

  private findBy(deviceId?: string, messageId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    let index = -1;

    if (deviceId !== undefined) {
      index = this.activeConversations.findIndex(
        (item) => item.deviceId === deviceId,
      );
    } else if (messageId !== undefined) {
      console.log("hier");
      index = this.activeConversations.findIndex(
        (item) => item.messageId === messageId,
      );
      console.log(
        this.activeConversations,
        index,
        this.activeConversations[index],
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (index !== -1) {
      console.log("found");
      return this.activeConversations.splice(index, 1)[0];
    }

    return undefined;
  }

  public handle(message: string, deviceId?: string, messageId?: string) {
    let intent: Intent | undefined = undefined;
    let vars: IntentVars = {};

    const conversation = this.findBy(deviceId, messageId);

    if (conversation !== undefined) {
      intent = conversation.intent;
      vars = conversation.vars;
      vars[conversation.answerKey] = message
        .toLowerCase()
        .replaceAll(/\W/g, "");
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

    const newMessageId =
      deviceId === undefined ? undefined : crypto.randomUUID();

    this.activeConversations.push({
      intent,
      vars,
      answerKey: response.answerKey,
      deviceId,
      messageId: newMessageId,
    });

    return {
      id: newMessageId,
      msg: response.message,
    };
  }
}
