/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "notes",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          version: "6.41.0"
        }
      },
    };
  },
  async run() {
    await import("./infra/storage");
    await import("./infra/api");
  },
});
