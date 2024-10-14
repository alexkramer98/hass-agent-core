import crypto from "node:crypto";

import type {
  Intent,
  IntentPendingAnswer,
  IntentResponse,
  IntentVariables,
  MatchedIntent,
} from "../interfaces";
import type DateGuesser from "./DateGuesser";
import type HassClient from "./HassClient";
import type InputParser from "./InputParser";
import type OllamaClient from "./OllamaClient";

export default class IntentHandler {
  private readonly pendingAnswers: IntentPendingAnswer[] = [];

  // eslint-disable-next-line @typescript-eslint/max-params
  public constructor(
    private readonly inputParser: InputParser,
    private readonly hassClient: HassClient,
    private readonly ollamaClient: OllamaClient,
    private readonly dateGuesser: DateGuesser,
  ) {}

  private getPendingAnswer(deviceId?: string, messageId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    let index = -1;

    if (deviceId !== undefined) {
      index = this.pendingAnswers.findIndex(
        (item) => item.deviceId === deviceId,
      );
    } else if (messageId !== undefined) {
      index = this.pendingAnswers.findIndex(
        (item) => item.messageId === messageId,
      );
      console.log(this.pendingAnswers, index, this.pendingAnswers[index]);
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (index !== -1) {
      return this.pendingAnswers.splice(index, 1)[0];
    }

    return undefined;
  }

  private handleResponse({
    deviceId,
    intent,
    intentResponse,
    variables,
  }: {
    deviceId?: string;
    intent: Intent;
    intentResponse: IntentResponse;
    variables: IntentVariables;
  }) {
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

  private getInitialData(): {
    intent: Intent | undefined;
    intentResponse: IntentResponse | undefined;
    variables: IntentVariables | undefined;
  } {
    return {
      intent: undefined,
      intentResponse: undefined,
      variables: undefined,
    };
  }

  private async fallback(message: string) {
    const response = await this.hassClient.processConversation(message);
    const data = response.data.response;
    const isError = data.response_type === "error";

    if (isError) {
      if (data.data.code === "no_intent_match") {
        return {
          message: "Ik snap het niet man.",
        };
      }

      return {
        message: "Er ging shit stuk.",
      };
    }

    return {
      message: data.speech.plain.speech,
    };
  }

  private async processExisting(
    pendingAnswer: IntentPendingAnswer,
    message: string,
  ) {
    const intentResponse = await pendingAnswer.responseHandler(message);
    const { intent, variables } = pendingAnswer;

    return {
      intent,
      intentResponse,
      variables,
    };
  }

  private async processNew(matchedIntent: MatchedIntent) {
    const intentResponse = await matchedIntent.intent.handler(
      {
        hassClient: this.hassClient,
        ollamaClient: this.ollamaClient,
        dateGuesser: this.dateGuesser,
      },
      matchedIntent.matchedVariables,
    );
    const { intent, matchedVariables: variables } = matchedIntent;

    return {
      intent,
      intentResponse,
      variables,
    };
  }

  public async handle(
    message: string,
    deviceId?: string,
    messageId?: string,
  ): Promise<{
    message: string;
    messageId?: string;
  }> {
    const pendingAnswer = this.getPendingAnswer(deviceId, messageId);

    // eslint-disable-next-line sonar/no-dead-store
    let { intent, intentResponse, variables } = this.getInitialData();

    if (pendingAnswer === undefined) {
      const matchedIntent = this.inputParser.matchIntent(message);

      if (matchedIntent === undefined) {
        return await this.fallback(message);
      }

      ({ intent, intentResponse, variables } =
        await this.processNew(matchedIntent));
    } else {
      ({ intent, intentResponse, variables } = await this.processExisting(
        pendingAnswer,
        message,
      ));
    }

    return this.handleResponse({
      deviceId,
      intent,
      intentResponse,
      variables,
    });
  }
}
