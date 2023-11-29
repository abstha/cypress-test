const { describe } = require("mocha");

describe("Tests for Different Fixtures", () => {
  it("test check", () => {
    cy.fixture("TestData.json").then((data) => {
      cy.visit("https://www.ncell.axiata.com/en/auth/login");

      cy.get('input[placeholder="Enter mobile number"]').type(
        data[0].phoneNumber
      );

      cy.get('input[placeholder="Password"]').type(data[0].password);

      cy.get("input.custom-control-input").check({
        force: true,
      });

      cy.get('button[class="btn_primary blockEl"]').click();

      cy.wait(7000);

      cy.get(".main_details").children().should("have.length", 2);

      cy.get(".list_title").contains("Elearning Data").should("exist");

      cy.get(".list_title")
        .contains("Elearning Data")
        .parent() 
        .within(() => {
          cy.get(".list_info span:last-child").should("contain", "25.00 GB");
        });

      cy.pause();
    });
  });
});
