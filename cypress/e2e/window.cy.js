const { describe } = require("mocha");

describe("Multiple window test", () => {
  it("Tests using multiple windows", () => {
    cy.visit(
      "https://www.ncell.axiata.com/en/individual/data-and-voice?packageCategories=voice-packs"
    );

    cy.contains("Load More").click();
    cy.contains("Rs. 265").click();
    cy.contains("Buy Now").click();
    cy.get('[name="phoneNumber"]').type("9703935000");
    cy.contains("Continue").click();

    cy.visit("https://messages.google.com/web");
    cy.pause();
  });
});
