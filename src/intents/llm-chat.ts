import { defineIntent, reply, close } from "../interfaces";

export default defineIntent({
  triggers: ["geef mij de geit"],

  handle: async ({ ollamaClient, vars: { answer } }) => {
    let response = undefined;
    if (answer === undefined) {
      response = await ollamaClient.chat("Hallo, hoe gaat het?");
    } else {
      response = await ollamaClient.chat(answer);
    }

    // console.log(response);

    return reply(response.data.message.content, "answer");
  },
});
