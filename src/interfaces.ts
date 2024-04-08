import type HassClient from "./services/HassClient";
import type OllamaClient from "./services/OllamaClient";

export interface Intent {
  triggers: string[];
  handle: (context: {
    vars: { [key: string]: string | undefined };
    triggerSentence: string;
    hassClient: HassClient;
    ollamaClient: OllamaClient;
  }) => Promise<IntentResponse>;

  // handle: (vars: { [key: string]: string | undefined }) => IntentResponse;
}

export interface IntentResponse {
  message?: string;
  answerKey?: string;
}

export interface IntentVars {
  [key: string]: string;
}

export const defineIntent = (intent: Intent) => intent;

export const reply = (message: string, answerKey: string): IntentResponse => ({
  message: message,
  answerKey: answerKey,
});

export const close = (message?: string): IntentResponse => ({
  message,
});
