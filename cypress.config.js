const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 800,
  projectId: 'fq2xh3',
  video: false,
  e2e: {
    defaultCommandTimeout: 10000,
    specPattern: "**/*.feature",
    baseUrl: "https://staging.lpitko.ru",
    testIsolation: false,
    setupNodeEvents(on, config) {
     
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);
      addCucumberPreprocessorPlugin(on, config);
      allureWriter(on, config, {resultsDir: "allure-results"})

      return config;
    },
  },
  env: {
    allureReuseAfterSpec: true,
  },
    watchForFileChanges: false
});


