import type {
  IntentHandlerContext,
  IntentHandlerVariables,
  IntentResponse,
} from "../interfaces";
import { defineIntent, reply } from "../interfaces";

const handler = async (
  context: IntentHandlerContext,
  variables: IntentHandlerVariables,
): Promise<IntentResponse> => {
  if (variables.when === undefined) {
    return reply(
      "Wanneer?",
      async (response) =>
        await handler(context, {
          ...variables,
          when: response,
        }),
    );
  }

  if (variables.what === undefined) {
    return reply(
      "Waarvoor?",
      async (response) =>
        await handler(context, {
          ...variables,
          what: response,
        }),
    );
  }

  return reply("Akkoord.");
};

export default defineIntent({
  handler,
  triggers: ["herinner [(me|mij)] [{when}] [aan {what}]"],
});
