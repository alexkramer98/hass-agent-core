import type { Intent } from "../interfaces";
import { glob } from "glob";

export default class InputParser {
  private readonly intents: Intent[] = [];

  private getTriggerRegex(input: string) {
    const regexString = input
      .replaceAll(" ", "")
      .replaceAll("[", "(")
      .replaceAll("]", ")?")
      .replaceAll(/{([^}]+)}/g, "(?<$1>.+?)");

    return new RegExp(`^${regexString}$`);
  }

  public getIntent(input: string) {
    const sentence = input.toLowerCase().replaceAll(/\W/g, "");
    for (const intent of this.intents) {
      for (const trigger of intent.triggers) {
        const regex = this.getTriggerRegex(trigger);
        if (regex.test(sentence)) {
          const vars = regex.exec(sentence);

          return {
            intent: intent,
            vars: vars?.groups ?? {},
          };
        }
      }
    }
    return undefined;
  }
  public async initialize() {
    const filenames = await glob("src/intents/*.ts");
    for (const filename of filenames) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const intent = (
        await import(filename.replace("src", "../").replace("/", ""))
      ).default;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.intents.push(intent);
    }
  }
}
