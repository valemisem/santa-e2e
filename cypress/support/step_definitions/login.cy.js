import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
const users = require("../../fixtures/users.json");

Given("I navigate to the log in page", function () {
  cy.visit("/login");
})

Then('I log in successfully', function () {
  cy.login(users.userMain.email, users.userMain.password);
})

Then ('I am on the user dashboard', function () {
  cy.get(`[href="/account"] > .header-item > .header-item__text > .txt--med`).should("exist")
})