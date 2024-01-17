const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const general = require("../fixtures/pages/general.json");
const dashboard = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const drawingPage = require("../fixtures/pages/drawingPage.json");
import { faker } from "@faker-js/faker";

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

  it.only("user logs in and creates a box ", () => {
    cy.visit("/login");
    cy.login(users.userMain.email, users.userMain.password);

    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(":nth-child(3) > .frm").then(($token) => {
    // save a token to a var
    var token = $token.val();
    // var token = '' + token
    // cy.get(boxPage.boxNameField).type(token); // проверка сохраненной переменной
    Cypress.env("token", token)
    })

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

  it.only("add users without an invitation link", () => {
    cy.get(general.submitButton).click({ force: true });
    cy.get(invitePage.invitedUserNameFieldFirst).type(users.user2.name);
    cy.get(invitePage.invitedUserEmailFieldFirst).type(users.user2.email);
    cy.get(invitePage.invitedUserNameFieldSekond).type(users.user3.name);
    cy.get(invitePage.invitedUserEmailFieldSekond).type(users.user3.email);
    cy.get(invitePage.button).click({ force: true });
    cy.get(invitePage.messageField)
      .invoke("text")
      .should(
        "include",
        "Карточки участников успешно созданы и приглашения уже отправляются."
      );
    cy.clearCookies();
  });

  it("approve users", () => {
    cy.visit(inviteLink);
    cy.approveAsUser(users.user1, wishes);
    cy.visit(inviteLink);
    cy.approveAsUser(users.user2, wishes);
    cy.visit(inviteLink);
    cy.approveAsUser(users.user3, wishes);
  });

  it('drawing', () => {
    cy.visit("/login");
    cy.login(users.userMain.email, users.userMain.password);
    cy.get(drawingPage.boxes).click();
    cy.get(drawingPage.oneBox).last().click({ force: true });
    cy.get(drawingPage.tip).should("exist")
    cy.get(drawingPage.approve1).click({force: true})
    cy.get(general.submitButton).click({ force: true });
    cy.get(drawingPage.approve2).click()
    cy.contains("Жеребьевка проведена").should("exist")
  });

describe("Delete boxes using API, arhive box using UI", () => {
  before(() => {
    cy.visit("/login");
    cy.login(users.userMain.email, users.userMain.password);
  });

  it("The page loads correctly", () => {
    cy.request({
      method: "GET",
      url: `/account/boxes`
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  var token = "BmaIKR" // change 
  Cypress.env("token", token)

  it("Delete a task using API", () => {
    cy.request({
      method: "DELETE",
      
      url: `api/box/${Cypress.env("token")}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  })

 it('arhive box', () => {
    cy.get(
      '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item > .header-item__text > .txt--med'
    ).click();
    cy.get(':nth-child(1) > a.base--clickable > .user-card').first().click();
    cy.get(
      '.layout-1__header-wrapper-fixed > .layout-1__header-secondary > .header-secondary > .header-secondary__right-item > .toggle-menu-wrapper > .toggle-menu-button > .toggle-menu-button--inner'
    ).click();
    cy.contains("Архивация и удаление").click({ force: true });

    cy.get(':nth-child(1) > .form-page-group__main > .frm-wrapper > .frm').type("Архивировать коробку");
    cy.get('.btn-service').click();
  });
})
})