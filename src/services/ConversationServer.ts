import express from "express";
import bodyParser from "body-parser";
import type { Request } from "express";
import type ConversationHandler from "./ConversationHandler";

export default class ConversationServer {
  private readonly app = express();
  private readonly conversationHandler: ConversationHandler;

  public constructor(port: number, conversationHandler: ConversationHandler) {
    this.conversationHandler = conversationHandler;
    this.app.use(bodyParser.json());

    this.app.post("/process", async (request, response) => {
      console.log("processing: ", request.body);

      const { message, deviceId, messageId } = this.validatePayload(
        request.body,
      );

      const reply = await this.conversationHandler.handle(
        message,
        deviceId,
        messageId,
      );

      console.log("replying:", reply);
      response.send(reply);
    });

    this.app.listen(port);
  }
  private validatePayload(requestBody: unknown) {
    if (typeof requestBody !== "object") {
      throw new Error("Invalid payload.");
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    let { devId, msgId, msg } = requestBody as { [key: string]: string };

    if (devId === "None") {
      devId = undefined;
    }
    if (msgId === "None") {
      msgId = undefined;
    }
    if (msg === "None") {
      msg = undefined;
    }

    if (msg === undefined) {
      throw new Error("Invalid payload.");
    }

    return { message: msg, deviceId: devId, messageId: msgId };
  }
}
