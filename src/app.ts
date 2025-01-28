import { startHost } from "./router";

const main = async () => {
  startHost(4444);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
