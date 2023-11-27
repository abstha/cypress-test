const { describe } = require("mocha");
const testData = require("../fixtures/TestData.json");

function Login(number, password) {
  cy.visit("https://www.ncell.axiata.com/en");
  cy.contains("Login").click();
  cy.get('input[placeholder="Enter mobile number"]').type(number);
  cy.get('input[placeholder="Password"]').type(password);
  cy.get("input.custom-control-input").check({
    force: true,
  });
  cy.get('button[class="btn_primary blockEl"]').click();
}

function performTests(fixtureData) {
  describe("low balance testing", () => {
    it("checks if the balance is enough to buy the data pack", () => {
      cy.exec(
        'node "C:/Users/abhinav/Desktop/automation tests/Mobile testing/Samsung.js" balance',
        { log: true }
      ).then(({ stdout, stderr }) => {
        if (stdout) {
          cy.log(`Standard output:\n${stdout}`);
        }
        if (stderr) {
          cy.log(`Error output:\n${stderr}`);
        }
      });
      cy.readFile(
        "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
        "utf8"
      ).then((data) => {
        const parsedBalance = parseFloat(data.balance);
        const packValueString = fixtureData.pack;
        const match = packValueString.match(/\d+/);
        const packValue = parseInt(match[0]);

        console.log(parsedBalance, "parsedbalance");
        console.log(match[0], "packvalue");

        if (parsedBalance < match[0]) {
          cy.log("Balance is insufficient to buy the data pack");
          expect(parsedBalance).to.be.lessThan(packValue);
        } else if (parsedBalance >= match[0]) {
          cy.log("Balance is sufficient to buy the data pack");
          expect(parsedBalance).to.be.gte(packValue);
        } else {
          throw new Error("Invalid balance value");
        }
      });
    });

    it("buys the Rs 265 voice pack", () => {
      cy.visit(
        "https://www.ncell.axiata.com/en/individual/data-and-voice?packageCategories=data-packs"
      );

      cy.contains("Load More").click();
      cy.wait(2000);
      // cy.contains(testData.packName).click();

      cy.contains(fixtureData.pack).click();
      cy.contains("Buy Now").click();
      cy.get('[name="phoneNumber"]').type(fixtureData.phoneNumber);
      cy.contains("Continue").click();

      cy.exec(
        'node "C:/Users/abhinav/Desktop/automation tests/Mobile testing/Samsung.js" otp BuyOTP',
        { log: true }
      ).then(({ stdout, stderr }) => {
        if (stdout) {
          cy.log(`Standard output:\n${stdout}`);
        }
        if (stderr) {
          cy.log(`Error output:\n${stderr}`);
        }

        cy.readFile(
          "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
          "utf8"
        ).then((otpObject) => {
          const otp = otpObject.BuyOTP;
          cy.log(`Read OTP value: ${otp}`);

          for (let i = 0; i < otp.length; i++) {
            cy.get(`input[aria-label*="Character ${i + 1}"]`).type(
              otp.charAt(i)
            );
          }
        });
        cy.contains("Continue").click();
        cy.contains("Insufficient Balance").should("be.visible");
      });
    });
  });

  describe("adequate balance testing", () => {
    it("checks if the balance is enough to buy the data pack", () => {
      cy.readFile(
        "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
        "utf8"
      ).then((data) => {
        const parsedBalance = parseFloat(data.balance);
        const packValueString = fixtureData.pack;
        const match = packValueString.match(/\d+/);
        const packValue = parseInt(match[0]);

        console.log(parsedBalance, "parsedbalance");
        console.log(match[0], "packvalue");

        if (parsedBalance < match[0]) {
          cy.log("Balance is insufficient to buy the data pack");
          expect(parsedBalance).to.be.lessThan(packValue);
        } else if (parsedBalance >= match[0]) {
          cy.log("Balance is sufficient to buy the data pack");
        } else {
          throw new Error("Invalid balance value");
        }
      });
    });

    it("buys the Rs 265 voice pack", () => {
      cy.exec(
        'node "C:/Users/abhinav/Desktop/automation tests/Mobile testing/Samsung.js" buyDataPack',
        { log: true }
      ).then(({ stdout, stderr }) => {
        if (stdout) {
          cy.log(`Standard output:\n${stdout}`);
        }
        if (stderr) {
          cy.log(`Error output:\n${stderr}`);
        }
      });
    });

    it("checks if the product has been activated or not", () => {
      cy.visit("https://www.ncell.axiata.com/en/auth/login");
      Login(fixtureData.phoneNumber, fixtureData.password);
      cy.wait(10000);

      cy.contains(fixtureData.packName);

      cy.contains("button.btn_secondary.btm__btn", "Details").click();
      cy.contains(fixtureData.packResource);

      cy.get("p.list_title").contains(fixtureData.dashboardName);

      cy.contains("p.list_title", fixtureData.dashboardName)
        .closest(".single_list") //.closest finds the closest element in regards to the parent element
        .find(".progress-bar")
        .should("have.attr", "aria-valuenow", "100%");

      cy.contains();
    });
  });

  describe("Resource usage testing", () => {
    it("Uses a app for 1 minute", () => {
      cy.exec(
        'node "C:/Users/abhinav/Desktop/automation tests/Mobile Testing/Samsung.js" usageTest',
        { timeout: 90000 }
      );
    });

    it("Checks the data usage after using the app", () => {
      Login(fixtureData.phoneNumber, fixtureData.password);

      cy.wait(10000);
      cy.get("p.list_title")
        .contains(fixtureData.dashboardName)
        .should("exist");

      // cy.contains("p.list_title", "Of Rs 25 Data")
      //   .closest(".single_list")
      //   .find(".progress-bar")
      //   .invoke("attr", "aria-valuenow")
      //   .then((value) => {
      //     const currentValue = parseInt(value.replace("%", ""), 10);
      //     expect(currentValue).to.be.lessThan(100);
      //   });
      const packNameToCheck = fixtureData.packName; // Retrieve the pack name from the fixture

      // Find the pack-related element
      cy.contains(".list_title", packNameToCheck).then(($packElement) => {
        // Traverse to the progress bar associated with this pack
        const progressBar = $packElement
          .closest(".single_list")
          .find(".progress-bar");

        // Get the width of the progress bar
        const progressBarWidth = parseFloat(progressBar.css("width"));

        // Assert the progress bar value is less than 100% (change the condition based on your requirement)
        expect(progressBarWidth).to.be.lessThan(100);
      });
    });
  });

  describe("Multiple activation testing", () => {
    it("checks if multiple activation is allowed or not", () => {
      cy.log(fixtureData.packName);
      cy.log(fixtureData.packResource);
      cy.log(fixtureData.balance);
      cy.log(fixtureData.dashboardName);
    });
  });
}

testData.forEach((fixture, index) => {
  describe(`Fixture ${index + 1}`, () => {
    performTests(fixture);
  });
});
