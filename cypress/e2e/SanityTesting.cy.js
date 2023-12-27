//DEV NOTES:

//The code currently works using cypress to test the products in the Ncell web app.
//It utilizes appium via cy.exec method to handle the OTP sent to the mobile device for confirming the product .
//The code can be run automatically if you run the cron.js file and the time for the test to run automatically can also be set there.
//The appium script has predefined device specs which if must be changed should be viewed via android studio and changed accordingly.

//FUTURE IMPROVEMENTS:
//The whole process can be done in about 20% of the code written here if the API can directly be accessed.
//Cypress does support API testing which will make the code more efficient.
//Tried making a GUI in react to get the test parameter manually. It works but the design can be made much more cleaner.
//The whole process can be coded in appium and no cypress code will be needed if all the features are tested via the ncell SCA.

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

function performTests(fixtureData, index) {
  //checks the balance remaining in the device and asserts if the pack can be bought
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

      //reads the balance from the json file and compares it with the pack value for asserting if the balance is enough
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
      // till here
    });

    //buys the data pack in the web site
    it("buys the Rs 265 voice pack", () => {
      cy.visit(
        "https://www.ncell.axiata.com/en/individual/data-and-voice?packageCategories=data-packs"
      );

      cy.contains("Load More").click();
      cy.wait(2000);

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

        //reads the otp from the json and loops the OTP one by one in the OTP field
        cy.readFile(
          "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
          "utf8"
        ).then((otpObject) => {
          const otp = otpObject.BuyOTP;
          cy.log(`Read OTP value: ${otp}`);
          //
          for (let i = 0; i < otp.length; i++) {
            cy.get(`input[aria-label*="Character ${i + 1}"]`).type(
              otp.charAt(i)
            );
          }
        });
        //till here
        cy.contains("Continue").click();
        cy.contains("Insufficient Balance").should("be.visible");
      });
    });
  });

  //describe
  //more test suites can be added or removed by adding it in a describe block .

  describe("adequate balance testing", () => {
    //test code
    // it("checks for recharge card and recharges the number", () => {
    //   cy.visit("https://www.ncell.axiata.com/en/individual/recharge");
    //   cy.contains("Recharge").click();
    //   cy.get('input[placeholder= "Enter Mobile number"]').type(
    //     fixtureData.phoneNumber
    //   );
    //   cy.get('input[placeholder="Enter card PIN number"]').type(
    //     fixtureData.pinNumber
    //   );

    //   const btn = cy.get("button").contains("Recharge").click();
    //   //test code
    //   if(!btn){
    //     console.log("the button cannot be clicked")
    //   }
    //   else{
    //     console.log("the data has been succsefully recharged");
    // }
    //till here
    // });
    //till here

    // cy.readFile(
    //   "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json"
    // ).then((data)=>{
    //   console.log(data.BuyOTP)
    //   console.log(data.balance)
    //   console.log(data.otp)
    // })

    // cy.get("")
    //till here

    //Same as above balance check
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
      //till here
    });

    //buys the data pack via USSD
    it("buys the Rs 265 voice pack", () => {
      if (index == 0) {
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
      } else {
        cy.exec(
          'node "C:/Users/abhinav/Desktop/automation tests/Mobile testing/Samsung.js" buyDataPack2'
        );
      }
    });

    //checks if the product has been activated or not not in the dashboard
    it("checks if the product has been activated or not", () => {
      cy.visit("https://www.ncell.axiata.com/en/auth/login");
      Login(fixtureData.phoneNumber, fixtureData.password);
      cy.wait(10000);

      cy.contains(fixtureData.packName);

      cy.contains("button.btn_secondary.btm__btn", "Details").click();

      //checks for presence of each subaccount
      cy.get(".main_details").children().should("have.length.gte", 2);
      for (let i = 0; i < fixtureData.dashboardName.length; i++) {
        cy.get(".list_title")
          .contains(fixtureData.dashboardName[i])
          .should("exist");
      }
      //till here

      //checks for each subaccount and its respective resource
      for (let i = 0; i < fixtureData.dashboardName.length; i++) {
        cy.get(".dashboard_data_list")
          .contains(fixtureData.dashboardName[i])
          .parent()
          .within(() => {
            cy.get(".list_cs span:last-child").then(($el) => {
              const val = $el.text();
              const num = parseFloat(val.match(/\d+\.\d+/)[0]);
              const inval = Math.floor(num);
              let bval = Math.floor(inval); // can be deleted
              console.log(bval); //cannot be returned
              let packVal = fixtureData.packResource[i];
              const convNum = parseFloat(packVal.match(/\d+\.\d+/)[0]);
              const convVal = Math.floor(convNum);

              expect(inval).to.be.equal(convVal);
            });
          });
      }
      //till here

      //   //checks the products validity in date and if multiple packs are activated at once, the latest packs validity should be displayed
      //   const date = Date();
      //   const day = date.getDate();
      //   const month = date.getMonth() + 1;
      //   const year = date.getFullYear();

      //   const time = date.getCurrentTime();

      //   const fullDate = `${day}-${month}-${year}-"time"-${time}`;

      //   cy.get("list_title")
      //     .contains(fixtureData.packName)
      //     .parent()
      //     .within(() => {
      //       cy.get("list_cs p:first_child").contains(fullDate);
      //     });
      //   //till here
      //   cy.get(".list_title")
      //     .contains(fixtureData.dashboardName)
      //     .parent()
      //     .within(() => {
      //       cy.get(".list_info span:last-child").should(
      //         "contain",
      //         fixtureData.packResource
      //       );
      //     });
    });
  });

  describe("Resource usage testing", () => {
    //uses a youtube for 1 minute by turning on the data.
    it("Uses a app for 1 minute", () => {
      cy.exec(
        'node "C:/Users/abhinav/Desktop/automation tests/Mobile Testing/Samsung.js" usageTest',
        { timeout: 90000 }
      );
    });

    //it checks if the data has been used after using the app
    it("Checks the data usage after using the app", () => {
      Login(fixtureData.phoneNumber, fixtureData.password);

      cy.wait(10000);

      //added new, might be changed to check for subaccount resource.

      for (let i = 0; i < fixtureData.dashboardName.length; i++) {
        cy.get(".dashboard_data_list")
          .contains(fixtureData.dashboardName[i])
          .parent()
          .within(() => {
            cy.get(".list_cs span:last-child").then(($el) => {
              const val = $el.text();
              const num = parseFloat(val.match(/\d+\.\d+/)[0]);
              const inval = Math.floor(num);
              let packVal = fixtureData.packResource[i];
              const convNum = parseFloat(packVal.match(/\d+\.\d+/)[0]);
              const bval = Math.floor(convNum);

              expect(inval).to.be.gte(bval);
            });
          });

        cy.get(".list_title").each(($element) => {
          cy.log($element.text());
        });
        //this checks if the first span value is less than second. still in progress
        cy.get(".list_info span:first-child").then(($firstSpan) => {
          const firstValue = parseFloat($firstSpan.text());

          cy.get(".list_info span:last-child").then(($secondSpan) => {
            const secondValue = parseFloat($secondSpan.text());

            expect(firstValue).to.be.lte(secondValue);
          });
        });

        cy.get(".list_info > .list_cs > span").each(($element) => {
          cy.contains($element.text());
        });
      }
    });
  });

  //placeholder tests
  describe("Multiple activation testing", () => {
    it("checks if multiple activation is allowed or not", () => {
      for (let i = 0; i < fixtureData.dashboardName.length; i++){
      cy.log(fixtureData.packName);
      cy.log(fixtureData.packResource);
      cy.log(fixtureData.balance);
      cy.log(fixtureData.dashboardName[i]);
      }
    });

    it("checks if multiple activation resource is added or not", () => {
      Login(fixtureData.phoneNumber, fixtureData.password);
      // cy.get(".dashboard_data_list").contains(fixtureData.dashboardName);
    });
  });
  //till here
}

//loops each parameter one at a time and provides index of the parameter for additional uses
testData.forEach((fixture, index) => {
  describe(`Pack Name: ${fixture.packName}`, () => {
    performTests(fixture, index);
  });
});
