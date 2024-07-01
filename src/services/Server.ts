import bodyParser from "body-parser";
import express from "express";
import expressAsyncHandler from "express-async-handler";

import type IntentHandler from "./IntentHandler";

export default class Server {
  private readonly app = express();

  public constructor(private readonly intentHandler: IntentHandler) {
    this.app.use(bodyParser.json());

    this.app.post(
      "/process",
      expressAsyncHandler(async (request, response) => {
        console.log("processing:", request.body);

        const { deviceId, message, messageId } = this.getPayload(request.body);

        const reply = await this.intentHandler.handle(
          message,
          deviceId,
          messageId,
        );

        console.log("replying:", reply);

        response.send({
          id: reply.messageId ?? "None",
          msg: reply.message,
        });
      }),
    );
  }

  private getPayloadValue(value?: string): string | undefined {
    if (value === "None") {
      return undefined;
    }

    return value;
  }

  private getPayload(requestBody: unknown) {
    if (typeof requestBody !== "object") {
      throw new TypeError("Invalid payload.");
    }

    let {
      deviceId,
      message,
      messageId,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    } = requestBody as {
      [key: string]: string;
    };

    deviceId = this.getPayloadValue(deviceId);
    messageId = this.getPayloadValue(messageId);
    message = this.getPayloadValue(message);

    if (message === undefined) {
      throw new Error("Invalid payload.");
    }

    return {
      deviceId,

      message: message
        .toLowerCase()
        .trim()
        .replaceAll(/[^a-z0-9 ]+/gv, ""),

      messageId,
    };
  }

  public listen(port: number) {
    this.app.listen(port);
  }
}
