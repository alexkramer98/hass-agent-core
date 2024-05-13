import axios from "axios";

import type { HassConversationResponse } from "../interfaces";

export default class HassClient {
  public constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  // eslint-disable-next-line etc/no-misused-generics,etc/no-t
  public async callService<T>(name: string, data: object) {
    return await this.callApi<T>(`services/${name}`, data);
  }

  public async processConversation(text: string) {
    return await this.callApi<HassConversationResponse>(
      "conversation/process",
      {
        text,
      },
    );
  }

  // eslint-disable-next-line etc/no-misused-generics,etc/no-t
  private async callApi<T>(endpoint: string, data: object) {
    return await axios.post<T>(`${this.baseUrl}/api/${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`,

        "Content-Type": "application/json",
      },
    });
  }
}
