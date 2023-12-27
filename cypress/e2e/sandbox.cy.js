const { describe } = require("mocha");

describe("API testing", () => {
  it("checks for the API request from the App", () => {
    cy.request("https://ncell.axiata.com").then((response) => {
      cy.log(response.body);
    });
    cy.request({
      method: "POST",
      url: "https://webapi.ncell.axiata.com/v1/account/login/request",
      body: {
        phoneNumber: "9800015053",
        password: "test12345@",
        redirectTo: null,
      },
    }).then((response) => {
      expect(response.body).to.have.property("message", "OK");
    });

    cy.stub(responseVar)
    
    cy.pause();
  });
});

describe("API request tests", ()=> {
    it("checks for the number of incoming API request from the web app", ()=>{

    })

    it("stores the initial cookie from the initial login", ()=> {

    })

    it("uses the stored cookie for the response sent", ()=> {
     let cookieVal = []
     cy.getAllCookies().then((cookies)=> {
        cookies.forEach((cookie) => {
            cookieVal.append(cookie)
        })
     })

     console.log(cookieVal)

     cy.request({
        method:"POST",
        url: "https://webapi.ncell.axiata.com/v1/accoount/login/request",
        body: {
            phoneNumber: "9800015053",
            password: "test12345@",
            redirectTo : null
        }.then((response)=> {
            expect(response.body).to.have.property("message", "OK")
            if(response.body){
                console.log("The request has been successfully processed");
            }
            else{
                console.log("There is an error with the request parsing.");
            }
        })
     })
    })
})
