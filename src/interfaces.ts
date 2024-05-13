import type HassClient from "./services/HassClient";
import type OllamaClient from "./services/OllamaClient";

export interface IntentHandlerContext {
  hassClient: HassClient;
  ollamaClient: OllamaClient;
}

export interface IntentHandlerVariables {
  [key: string]: string;
}

// eslint-disable-next-line etc/prefer-interface
export type IntentResponseHandler = (
  response: string,
) => Promise<IntentResponse>;

export interface Intent {
  handler: (
    context: IntentHandlerContext,
    variables: IntentHandlerVariables,
  ) => Promise<IntentResponse>;
  triggers: string[];
}

export interface IntentResponse {
  message?: string;
  responseHandler?: IntentResponseHandler;
}

export interface IntentVariables {
  [key: string]: string;
}

export interface HassConversationResponse {
  conversation_id: null;
  response: {
    card: {
      [key: string]: unknown;
    };
    data: {
      code?: string;
      failed?: unknown[];
      success?: unknown[];
      targets?: unknown[];
    };
    language: string;
    response_type: string;
    speech: {
      plain: {
        extra_data: null;
        speech: string;
      };
    };
  };
}

export interface IntentPendingAnswer {
  deviceId?: string;
  intent: Intent;
  messageId?: string;
  responseHandler: IntentResponseHandler;
  variables: IntentVariables;
}

export const defineIntent = (intent: Intent) => intent;

export const reply = (
  message: string,
  responseHandler?: IntentResponseHandler,
): IntentResponse => ({
  message,
  responseHandler,
});
