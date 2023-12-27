//DEV NOTES:

//This cron code runs in a node environment, If this code is to be run in a device wihtout node, wont work.
//Node cron to set up a automated script to run the cypress test at a specific time

const cron = require("node-cron");
const { exec } = require("child_process");

cron.schedule("33 11 * * *", () => {
  console.log("Job is running at 11:33 AM");
  exec(
    'npx cypress run --headed --spec "C:/Users/abhinav/Desktop/automation tests/cypress test/cypress/e2e/SanityTesting.cy.js" --browser chrome --project "C:/Users/abhinav/Desktop/automation tests/cypress test"',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Cypress: ${error}`);
        return;
      }
      console.log(`Cypress output: ${stdout}`);
      console.log("The cron job has finished scheduling.")
      console.error(`Cypress errors: ${stderr}`);
      
    }
  );
});
