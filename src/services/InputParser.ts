import { glob } from "glob";

import type { Intent, MatchedIntent } from "../interfaces";

export default class InputParser {
  private intents: Intent[] = [];

  private getTriggerRegex(input: string) {
    const regexString = input
      .replaceAll(" ", "")
      .replaceAll("[", "(")
      .replaceAll("]", ")?")
      // eslint-disable-next-line max-len
      // eslint-disable-next-line regexp/prefer-named-capture-group,regexp/strict,prefer-named-capture-group,regexp/no-super-linear-move,regexp/require-unicode-regexp,regexp/require-unicode-sets-regexp
      .replaceAll(/{([^}]+)}/g, "(?<$1>.+?)");

    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(`^${regexString}$`);
  }

  public matchIntent(sentence: string): MatchedIntent | undefined {
    for (const intent of this.intents) {
      for (const trigger of intent.triggers) {
        const regex = this.getTriggerRegex(trigger);

        if (regex.test(sentence)) {
          const matchedVariables = regex.exec(sentence)?.groups ?? {};
          const cleanMatchedVariables = Object.fromEntries(
            Object.entries(matchedVariables).filter(
              ([, value]: [string, string | undefined]) => value !== undefined,
            ),
          );

          return {
            intent,
            matchedVariables: cleanMatchedVariables,
          };
        }
      }
    }

    return undefined;
  }

  public async initialize() {
    const filenames = await glob("src/intents/*.ts");
    const promises = [];

    for (const filename of filenames) {
      // eslint-disable-next-line import/no-dynamic-require,no-unsanitized/method
      promises.push(import(filename.replace("src", "../").replace("/", "")));
    }

    const intents = await Promise.all(promises);

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    this.intents = intents.map((item) => item.default);
  }
}
