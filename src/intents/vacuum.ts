import type {
  IntentHandlerContext,
  IntentHandlerVariables,
  IntentResponse,
} from "../interfaces";
import { defineIntent, reply } from "../interfaces";

const BENEDEN_DEVICE_ID = "vacuum.eufy_beneden";
const BOVEN_DEVICE_ID = "vacuum.eufy_boven";

const handler = async (
  context: IntentHandlerContext,
  variables: IntentHandlerVariables,
): Promise<IntentResponse> => {
  const vacuumsToStart = [];

  let message = undefined;

  switch (variables.where) {
    case undefined: {
      return reply(
        "Waar?",
        async (where) =>
          await handler(context, {
            where,
          }),
      );
    }

    case "beneden": {
      vacuumsToStart.push(BENEDEN_DEVICE_ID);
      message = "Ik slinger hem beneden aan.";

      break;
    }

    case "boven": {
      vacuumsToStart.push(BOVEN_DEVICE_ID);
      message = "Ik slinger hem boven aan.";

      break;
    }

    case "overal": {
      vacuumsToStart.push(BENEDEN_DEVICE_ID, BOVEN_DEVICE_ID);
      message = "Ik slinger ze allemaal aan.";

      break;
    }

    default: {
      return reply(
        "Ik snap niet waar. Boven, beneden of overal?",
        async (where) =>
          await handler(context, {
            where,
          }),
      );
    }
  }

  await Promise.all(
    vacuumsToStart.map(
      async (entity_id) =>
        await context.hassClient.callService("vacuum/start2", {
          entity_id,
        }),
    ),
  );

  return reply(message);
};

export default defineIntent({
  handler,
  triggers: ["ga stofzuigen", "ga {where} stofzuigen", "ga stofzuigen {where}"],
});
