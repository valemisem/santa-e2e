const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://staging.lpitko.ru",
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {},
  watchForFileChanges: false
});
