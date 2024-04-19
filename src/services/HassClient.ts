import axios from "axios";
import { HassConversationResponse } from "../interfaces";

export default class HassClient {
  private readonly token: string;
  private readonly baseUrl: string;

  public constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  public async callService<T>(name: string, data: object) {
    return await this.callApi<T>("services/" + name, data);
  }

  public async processConversation(text: string) {
    return await this.callApi<HassConversationResponse>(
      "conversation/process",
      {
        text,
      },
    );
  }

  private async callApi<T>(endpoint: string, data: object) {
    return await axios.post<T>(this.baseUrl + "/api/" + endpoint, data, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: "Bearer " + this.token,
      },
    });
  }
}
