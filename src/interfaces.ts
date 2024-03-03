export interface Intent {
  triggers: string[];
  handle: (vars: { [key: string]: string | undefined }) => IntentResponse;
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
