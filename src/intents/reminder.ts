import type {
  IntentHandlerContext,
  IntentHandlerVariables,
  IntentResponse,
} from "../interfaces";
import { defineIntent, reply } from "../interfaces";
import DateGuesser from "../services/DateGuesser";

const handler = (
  context: IntentHandlerContext,
  variables: IntentHandlerVariables,
): IntentResponse => {
  //   eslint-disable-next-line putout/putout
  console.log(variables, new DateGuesser().guess(variables.when));

  return reply("yo");
};

export default defineIntent({
  handler,
  triggers: ["herinner [(me|mij)] [{when}] [aan {what}]"],
});
