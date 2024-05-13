import crypto from "node:crypto";

import type {
  Intent,
  IntentPendingAnswer,
  IntentResponse,
  IntentVariables,
} from "../interfaces";
import type HassClient from "./HassClient";
import type InputParser from "./InputParser";
import type OllamaClient from "./OllamaClient";

export default class IntentHandler {
  private readonly pendingAnswers: IntentPendingAnswer[] = [];

  public constructor(
    private readonly inputParser: InputParser,
    private readonly hassClient: HassClient,
    private readonly ollamaClient: OllamaClient,
  ) {}

  private getPendingAnswer(deviceId?: string, messageId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    let index = -1;

    if (deviceId !== undefined) {
      index = this.pendingAnswers.findIndex(
        (item) => item.deviceId === deviceId,
      );
      // eslint-disable-next-line sonarjs/elseif-without-else
    } else if (messageId !== undefined) {
      console.log("hier");
      index = this.pendingAnswers.findIndex(
        (item) => item.messageId === messageId,
      );
      console.log(this.pendingAnswers, index, this.pendingAnswers[index]);
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (index !== -1) {
      console.log("found");

      return this.pendingAnswers.splice(index, 1)[0];
    }

    return undefined;
  }

  public async handle(message: string, deviceId?: string, messageId?: string) {
    const pendingAnswer = this.getPendingAnswer(deviceId, messageId);

    let intentResponse: IntentResponse | undefined = undefined;
    let intent: Intent | undefined = undefined;
    let variables: IntentVariables | undefined = undefined;

    if (pendingAnswer === undefined) {
      // try to find the intent here
      const intentData = this.inputParser.matchIntent(message);

      if (intentData === undefined) {
        // try to run it through the default conversation handler
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

      intentResponse = await intentData.intent.handler(
        {
          hassClient: this.hassClient,
          ollamaClient: this.ollamaClient,
        },
        intentData.matchedVariables,
      );
      intent = intentData.intent;
      variables = intentData.matchedVariables;
    } else {
      intentResponse = await pendingAnswer.responseHandler(message);
      intent = pendingAnswer.intent;
      variables = pendingAnswer.variables;
    }

    if (intentResponse.responseHandler === undefined) {
      return {
        message: intentResponse.message,
      };
    }

    if (deviceId !== undefined) {
      void this.hassClient.callService("script/turn_on", {
        entity_id: "script.rewake_satellite",

        variables: {
          device_id: deviceId,
        },
      });
    }

    const newMessageId = crypto.randomUUID();

    this.pendingAnswers.push({
      deviceId,
      intent,
      messageId: newMessageId,
      responseHandler: intentResponse.responseHandler,
      variables,
    });

    return {
      message: intentResponse.message,
      messageId: newMessageId,
    };
  }
}
