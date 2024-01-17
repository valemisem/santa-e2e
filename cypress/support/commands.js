// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginPage = require("../fixtures/pages/loginPage.json");
const general = require("../fixtures/pages/general.json");
const inviteePage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(general.submitButton).click({ force: true });
});

Cypress.Commands.add("approveAsUser", (user, wishes) => {
  cy.get(general.submitButton).click({ force: true });
  cy.contains("войдите").click({ force: true });

  cy.login(user.email, user.password);

  cy.contains("Создать карточку участника").should("exist");
  cy.get(general.submitButton).click({ force: true });
  cy.get(general.arrowRight).click();
  cy.get(general.arrowRight).click();

  cy.get(inviteePage.wishesInput).type(wishes);
  cy.get(general.arrowRight).click();

  cy.get(inviteeDashboardPage.pictureNotice)
    .invoke("text")
    .then((text) => {
      expect(text).to.include("анонимный чат с вашим Тайным Сантой");
    });
  cy.clearCookies();
});
