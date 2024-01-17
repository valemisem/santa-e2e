const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const general = require("../fixtures/pages/general.json");
const dashboard = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteePage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";
import { after } from "lodash";

describe("user can create a box and run it", () => {
  // пользователь 1 логинится
  // пользователь 1 создает коробку
  // пользователь 1 получает приглашение
  // пользователь 2 переходит по приглашению
  // пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.random.word();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let wishes = faker.word.words();

  it("user logs in and creates a box ", () => {
    cy.visit("/login");
    cy.login(users.userMain.email, users.userMain.password);

    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(":nth-child(3) > .frm").then(($token) => {
      // save a token to a var
      var token = $token.val();
      // var token = '' + token
      // cy.get(boxPage.boxNameField).type(token); // проверка сохраненной переменной
    });

    cy.get(general.arrowRight).click();
    cy.get(boxPage["6thIcon"]).click();
    cy.get(general.arrowRight).click();

    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAmount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(general.arrowRight).click();
    cy.get(general.arrowRight).click();
    cy.get(dashboard.createdBoxName).should(
      "have.text",
      newBoxName + newBoxName
    );

    cy.get(dashboard.panel)
      .invoke("text")
      .then((text) => {
        // cy.log(text);
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(general.submitButton).click({ force: true });
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("approve as user1", () => {
    cy.visit(inviteLink);
    cy.get(general.submitButton).click({ force: true });
    cy.contains("войдите").click({ force: true });

    cy.login(users.user1.email, users.user1.password);

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

  Cypress._.times(1, () => {
    it("delete box", () => { // либо after (("...") => {})
      cy.visit("/login");
      cy.login(users.userMain.email, users.userMain.password);
      cy.get(
        '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item'
      ).click();
      cy.get(".base--clickable .user-card ").first().click({ force: true });
      cy.get(
        ".layout-1__header-wrapper-fixed > .layout-1__header-secondary > .header-secondary > .header-secondary__right-item > .toggle-menu-wrapper > .toggle-menu-button > .toggle-menu-button--inner"
      ).click();
      cy.contains("Архивация и удаление").click({ force: true });
      cy.get(
        ":nth-child(2) > .form-page-group__main > .frm-wrapper > .frm"
      ).type("Удалить коробку");
      cy.get(".layout-row-end > .btn-service").click({ force: true });
    });
  });
});
