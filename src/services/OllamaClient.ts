import axios from "axios";
import crypto from "crypto";

export default class OllamaClient {
  private readonly endpoint: string;
  private readonly conversations = [];

  public constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // public async startConversation() {}

  public async chat(message: string) {
    return await axios.post(this.endpoint + "/api/chat/", {
      model: "geitje",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      stream: false,
    });
  }
}
