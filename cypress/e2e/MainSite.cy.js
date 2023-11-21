const { describe } = require("mocha");
const { exec } = require("child_process");
const { readFile } = require("fs");


describe("Testing existence of previous data pack", ()=> {
  it("checks if there is the same data pack already bought", ()=>{

  })
})

describe("Initial balance check", ()=>{
  it("checks the initial balance be")
})

describe("Buying data packs", () => {

  it("checks the balance of the account", ()=>{
    cy.visit("https ")
  })

  it("buys the Rs 265 voice pack", () => {
    cy.fixture("TestData.json").then((testData) => {
      cy.visit(
        "https://www.ncell.axiata.com/en/individual/data-and-voice?packageCategories=voice-packs"
      );

      cy.contains("Load More").click();
      cy.contains(testData.Pack).click();
      cy.contains("Buy Now").click();
      cy.get('[name="phoneNumber"]').type(testData.phoneNumber);
      cy.contains("Continue").click();

      cy.pause();

      cy.exec(
        'node "C:/Users/abhinav/Desktop/automation tests/Mobile testing/test.js"',
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
        "C:/Users/abhinav/Desktop/automation tests/cypress test/OTP.txt",
        "utf8"
      ).then((otp) => {
        for (let i = 0; i < otp.length; i++) {
          cy.get(`input[aria-label*="Character ${i + 1}"]`).type(otp.charAt(i));
        }
      });
      cy.pause();
    });
  });
});

describe("Sanity testing product confirmation", () => {
  it("checks if the product has been activated or not", () => {
    cy.visit("https://www.ncell.axiata.com/en/auth/login");
    cy.fixture("TestData.json").then((testData) => {
      cy.get('input[aria-label="Username"]').type(testData.phoneNumber);
      cy.get('input[placeholder="Password"]').type(testData.password);
      cy.get("input.custom-control-input").check({
        force: true,
      });
      cy.contains("Login").click();
      cy.pause();
    });
  });
});