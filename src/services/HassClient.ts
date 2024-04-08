import axios from "axios";

export default class HassClient {
  private readonly token: string;
  private readonly endpoint: string;

  public constructor(endpoint: string, token: string) {
    this.endpoint = endpoint;
    this.token = token;
  }

  public async callService(name: string, data: object) {
    return await axios.post(this.endpoint + "/api/services/" + name, data, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: "Bearer " + this.token,
      },
    });
  }
}
