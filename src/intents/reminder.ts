import { DateTime } from "luxon";

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

  const guessedDateTime = context.dateGuesser.guess(
    DateTime.now(),
    variables.when,
  );

  await context.hassClient.callService("todo/add_item", {
    // @see https://github.com/home-assistant/core/issues/110165.
    due_date: guessedDateTime
      .plus({
        day: 1,
      })
      .toISODate(),

    item: `[${guessedDateTime.toFormat("H:mm")}] ${variables.what}`,
    entity_id: process.env.REMINDER_TODO_ID,
  });

  return reply("Akkoord.");
};

export default defineIntent({
  handler,
  triggers: ["herinner [(me|mij)] [{when}] [aan {what}]"],
});
