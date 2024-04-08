import { defineIntent, reply, close } from "../interfaces";

const BENEDEN_DEVICE_ID = "vacuum.eufy_beneden";
const BOVEN_DEVICE_ID = "vacuum.eufy_boven";

export default defineIntent({
  triggers: ["ga stofzuigen", "ga {where} stofzuigen", "ga stofzuigen {where}"],

  handle: async ({ vars, hassClient }) => {
    const vacuumsToStart = [];
    let message = undefined;
    switch (vars.where) {
      case undefined:
        return reply("Waar?", "where");
      case "beneden":
        vacuumsToStart.push(BENEDEN_DEVICE_ID);
        message = "Ik slinger hem beneden aan.";
        break;
      case "boven":
        vacuumsToStart.push(BOVEN_DEVICE_ID);
        message = "Ik slinger hem boven aan.";
        break;
      case "overal":
        vacuumsToStart.push(BENEDEN_DEVICE_ID, BOVEN_DEVICE_ID);
        message = "Ik slinger ze allemaal aan.";
        break;
      default:
        return reply("Ik snap niet waar? Boven, beneden of overal?", "where");
    }

    for (const vacuum of vacuumsToStart) {
      await hassClient.callService("vacuum/start", {
        entity_id: vacuum,
      });
    }

    return close(message);
  },
});
