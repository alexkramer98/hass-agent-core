import type InputParser from "./InputParser";
import type { Intent, IntentVars } from "../interfaces";
import crypto from "crypto";
import type HassClient from "./HassClient";
import type OllamaClient from "./OllamaClient";
import type { HassConversationResponse } from "../interfaces";

export default class ConversationHandler {
  private readonly activeConversations: {
    intent: Intent;
    vars: IntentVars;
    answerKey: string;
    deviceId?: string;
    messageId?: string;
  }[] = [];
  private readonly inputParser: InputParser;
  private readonly hassClient: HassClient;
  private readonly ollamaClient: OllamaClient;

  public constructor(
    inputParser: InputParser,
    hassClient: HassClient,
    ollamaClient: OllamaClient,
  ) {
    this.inputParser = inputParser;
    this.hassClient = hassClient;
    this.ollamaClient = ollamaClient;
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

  public async handle(message: string, deviceId?: string, messageId?: string) {
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
      //try to find the intent here
      const intentData = this.inputParser.getIntent(message);

      if (!intentData) {
        //try to run it through the default conversation handler
        const response = await this.hassClient.processConversation(message);

        const data = response.data.response;

        const isError = data.response_type === "error";
        if (isError) {
          if (data.data.code === "no_intent_match") {
            return {
              id: "None",
              msg: "Ik snap het niet man.",
            };
          }
          return {
            id: "None",
            msg: "Er ging shit stuk.",
          };
        }

        return {
          id: "None",
          msg: data.speech.plain.speech,
        };
      }
      intent = intentData.intent;
      vars = intentData.vars;
    }

    const response = await intent.handle({
      vars,
      hassClient: this.hassClient,
      ollamaClient: this.ollamaClient,
      triggerSentence: message,
    });

    if (response.answerKey === undefined) {
      return {
        id: "None",
        msg: response.message,
      };
    } else if (deviceId !== undefined) {
      void this.hassClient.callService("script/turn_on", {
        variables: { device_id: deviceId },
        entity_id: "script.rewake_satellite",
      });
    }

    const newMessageId = crypto.randomUUID();

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
