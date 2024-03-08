import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
const users = require("../../fixtures/users.json");

Given("I navigate to the login page", function () {
  cy.visit("/login");
})

Then('I login successfully as {string} with {string}', function (login, password) {
  cy.login(login, password);  
})

Then ('I am on the dashboard', function () {
  cy.get(`[href="/account"] > .header-item > .header-item__text > .txt--med`).should("exist")
})
