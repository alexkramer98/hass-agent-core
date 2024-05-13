// import type {
//   IntentHandlerContext,
//   IntentHandlerVariables,
// } from "../interfaces";
// import { close, defineIntent, reply } from "../interfaces";
//
// async function handler(
//   context: IntentHandlerContext,
//   variables: IntentHandlerVariables,
// ) {
//   if (variables.when === undefined) {
//     return reply(
//       "Wanneer moet ik je herinneren?",
//       async (when) =>
//         await handler(context, {
//           ...variables,
//           when,
//         }),
//     );
//   }
//
//   if (variables.what === undefined) {
//     return reply(
//       "Wat is de herinnering?",
//       async (where) =>
//         await handler(context, {
//           ...variables,
//           where,
//         }),
//     );
//   }
//
//   //   todo: process when
//   return reply("Ik herinner je op BLA aan BLA. Is dat goed?", (response) => {
//     if (response === "ja") {
//       //     todo: doe dingen
//       return close("Prima!");
//     }
//
//     return close("Dan niet jong.");
//   });
// }
//
// export default defineIntent({
//   handler,
//   triggers: ["herinner (mij|me) [{when}] [aan] [{what}]"],
// });
