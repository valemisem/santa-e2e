import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const general = require("../../fixtures/pages/general.json");
const dashboard = require("../../fixtures/pages/dashboardPage.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const drawingPage = require("../../fixtures/pages/drawingPage.json");
import { faker } from "@faker-js/faker";

let newBoxName = faker.random.word();
let maxAmount = 50;
let currency = "Евро";
let inviteLink;
let wishes = faker.word.words();

Given("the user is logged in", function () {
  cy.visit("/login");
  cy.login(users.userMain.email, users.userMain.password);
});

When("the user creates a box", () => {
  cy.contains("Создать коробку").click();
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(general.arrowRight).click();
  cy.get(boxPage["6thIcon"]).click();
  cy.get(general.arrowRight).click();
  cy.get(boxPage.giftPriceToggle).check({ force: true });
  cy.get(boxPage.maxAmount).type(maxAmount);
  cy.get(boxPage.currency).select(currency);
  cy.get(general.arrowRight).click();
  cy.get(general.arrowRight).click();
});

Then("the box is successfully created", () => {
  cy.get(dashboard.createdBoxName).should("have.text", newBoxName + newBoxName);
  cy.get(dashboard.panel)
    .invoke("text")
    .then((text) => {
      // cy.log(text);
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

When("User adds participants", () => {
  cy.get(general.submitButton).click({ force: true });
  cy.get(invitePage.invitedUserNameFieldFirst).type(users.user2.name);
  cy.get(invitePage.invitedUserEmailFieldFirst).type(users.user2.email);
  cy.get(invitePage.invitedUserNameFieldSekond).type(users.user3.name);
  cy.get(invitePage.invitedUserEmailFieldSekond).type(users.user3.email);
  cy.get(invitePage.button).click({ force: true });
});
Then("success", () => {
  cy.get(invitePage.messageField)
    .invoke("text")
    .should(
      "include",
      "Карточки участников успешно созданы и приглашения уже отправляются."
    );
  cy.clearCookies();
});

Then("add participants", () => {
  cy.get(general.submitButton).click({ force: true });
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
    });
  cy.clearCookies();
});

Then("approve users", () => {
  cy.visit(inviteLink);
  cy.approveAsUser(users.user1, wishes);
  cy.visit(inviteLink);
  cy.approveAsUser(users.user2, wishes);
  cy.visit(inviteLink);
  cy.approveAsUser(users.user3, wishes);
});

Given("the user", () => {
  cy.visit("/login");
  cy.login(users.userMain.email, users.userMain.password);
});

When("the user conducts a prize drawing", () => {
  cy.get(drawingPage.boxes).click();
  cy.get(drawingPage.oneBox).last().click({ force: true });
  cy.get(drawingPage.tip).should("exist");
  cy.get(drawingPage.approve1).click({ force: true });
  cy.get(general.submitButton).click({ force: true });
  cy.get(drawingPage.approve2).click();
});

Then("the drawing is successfully completed", () => {
  cy.contains("Жеребьевка проведена!").should("exist");
});

Given("logged in", () => {
  cy.visit("/login");
  cy.login(users.userAutor.email, users.userAutor.password);
});

When("the user deletes the box", () => {
  cy.request({
    method: "GET",
    url: "https://staging.lpitko.ru/api/account/boxes/",
  }).then((response) => {
    expect(response.status).to.eq(200);

    const boxes = response.body;

    boxes.forEach((box) => {
      cy.request({
        method: "DELETE",
        url: `https://staging.lpitko.ru/api/account/box/${Cypress.env("token")}/`})
        .then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    });
  });
});

Then("the box is successfully deleted", () => {
  cy.log("No boxes found to delete.");
});
