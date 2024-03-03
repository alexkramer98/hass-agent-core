import { defineIntent, reply, close } from "../interfaces";

export default defineIntent({
  triggers: ["ga stofzuigen", "ga {where} stofzuigen", "ga stofzuigen {where}"],

  handle: (vars) => {
    if (vars.where === undefined) {
      return reply("Waar?", "where");
    }
    if (!["boven", "beneden"].includes(vars.where)) {
      return reply("Ik snap niet waar? Boven of beneden?", "where");
    }

    return close("Best");
  },
});
