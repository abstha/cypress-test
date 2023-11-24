const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: true,
    retries: 3,
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports/mochawesome",
      overwrite: true,
      html: true,
      json: true,
      inline: true,
      charts: true,
    },
  },
  // Other Cypress configuration options...
});
