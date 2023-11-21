const number = "9779800015083";

// describe("PRBT tests", () => {
//   it("tests if the user can login to the PRBT website", () => {
//     cy.visit("https://prbt.ncell.axiata.com");
//     cy.contains("More").click();
//     cy.contains("Buy").click();
//     cy.get('input[name="user"]').eq(0).type(number, { force: true });
//   });
// });

// describe("login test", () => {
//   it("logs the user into the system", () => {
//     cy.visit("https://prbt.ncell.axiata.com/music/portal/#/home");
//     cy.pause();
//     cy.contains("Login").click({ force: true });
//     cy.get('input[ng-model="mobileno"]')
//       .eq(0)
//       .type("9800015053", { force: true });
//     cy.pause();
//     cy.contains("SEND OTP").click({ force: true });
//     cy.get('button[title="Validate Password"]').click();
//   });
// });

// describe("buying a prbt", () => {
//   it("checks if the user can buy a prbt", () => {
//     cy.visit("https://prbt.ncell.axiata.com");
//     cy.contains("More").click();

//     cy.contains("Buy").click();

//     cy.get("[placeholder='Mobile Number']")
//       .eq(1)
//       .type("9800015053", { force: true });

//     cy.get("[title='Get Password']").click();
//   });
// });

