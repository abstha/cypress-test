const { describe } = require("mocha");
const dat = require("../fixtures/mock.json");


function pt(fixtures, data) {
  describe("Tests for Different Fixtures", () => {
    it("test check", () => {
      cy.visit("https://www.ncell.axiata.com/en/auth/login");

      cy.get('input[placeholder="Enter mobile number"]').type(
        fixtures.phoneNumber
      );

      cy.get('input[placeholder="Password"]').type(fixtures.password);

      cy.get("input[id='checkboxSignINTerms']").click({ force: true });

      cy.get("input.custom-control-input").check({
        force: true,
      });

      cy.get('button[class="btn_primary blockEl"]').click();

      cy.wait(7000);

      console.log(fixtures.dashboardName.length);

      cy.get(".main_details").children().should("have.length.gte", 2);
      for (let i = 0; i < fixtures.dashboardName.length; i++) {
        cy.get(".list_title")
          .contains(fixtures.dashboardName[i])
          .should("exist");
      }

      for (let i = 0; i < fixtures.dashboardName.length; i++) {
        cy.get(".dashboard_data_list")
          .contains(fixtures.dashboardName[i])
          .parent()
          .within(() => {
            cy.get(".list_cs span:last-child").then(($el) => {
              const val = $el.text();
              const num = parseFloat(val.match(/\d+\.\d+/)[0]);
              const inval = Math.floor(num);
              let bval = Math.floor(inval); // can be deleted
              console.log(bval) //cannot be returned
              let packVal = fixtures.packResource[i];
              
              const convNum = parseFloat(packVal.match(/\d+\.\d+/)[0]);
              const convVal = Math.floor(convNum);

              expect(inval).to.be.equal(convVal);
            });
          });
      }
    });
  });
}

dat.forEach((fixture, index) => {
  describe(`Pack Name: ${fixture.packName}`, () => {
    pt(fixture, index);
  });
});
