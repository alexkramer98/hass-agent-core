import type {
  IntentHandlerContext,
  IntentHandlerVariables,
  IntentResponse,
} from "../interfaces";
import { defineIntent, reply } from "../interfaces";
import OldDateGuesser from "../services/OldDateGuesser";

const handler = (
  context: IntentHandlerContext,
  variables: IntentHandlerVariables,
): IntentResponse => {
  //   eslint-disable-next-line putout/putout
  console.log(variables, new OldDateGuesser().guess(variables.when));

  return reply("yo");
};

export default defineIntent({
  handler,
  triggers: ["herinner [(me|mij)] [{when}] [aan {what}]"],
});
