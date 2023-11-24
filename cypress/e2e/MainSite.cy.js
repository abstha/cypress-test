const { describe } = require("mocha");
const testData = require("../fixtures/TestData.json");

describe("Tests for Different Fixtures", () => {
  testData.forEach((fixture, index) => {
    it(`Test for Fixture ${index + 1}`, () => {
      // Access each set of parameters from the fixture
      const {
        phoneNumber,
        pack,
        packName,
        password,
        packResource,
        dashboardName,
      } = fixture;

      // Perform tests using the specific parameters from the fixture
      console.log(`Phone Number: ${phoneNumber}`);
      console.log(`Pack: ${pack}`);
      console.log(`Pack: ${packName}`);
      console.log(`Pack: ${password}`);
      console.log(`Pack: ${packResource}`);
      console.log(`Pack: ${dashboardName}`);

      cy.pause();
      // ...perform other assertions or Cypress operations with the fixture data
    });
  });
});
