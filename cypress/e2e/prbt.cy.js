const { describe } = require("mocha");
const xlsx = require("node-xlsx");
const fs = require("fs");

const fileName = "testResult.xlsx";
let testResult = [];

before(() => {
  testResult = [];
  testResult.push(["Test Case", "Status"]); 
});

after(() => {
  const data = [{ name: "My Sheet", data: testResult }];
  const buffer = xlsx.build(data);

  try {
    fs.writeFileSync(fileName, buffer);
    console.log("File created");
  } catch (err) {
    console.error(err.message);
  }
});

describe("test 1 ", () => {
  it("checks 1", () => {
    let abc = false;
    if (abc) {
      testResult.push(["Test1", "Pass"]);
    } else {
      testResult.push(["Test1", "Fail"]);
    }
  });

  it("checks 2", () => {
    let bcd = true;
    if (bcd) {
      testResult.push(["Test2", "Pass"]);
    } else {
      testResult.push(["Test2", "Fail"]);
    }
  });
});
