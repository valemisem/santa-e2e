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

  describe("Delete boxes using API", () => {
    before(() => {
      cy.visit("/login");
      cy.login(users.userMain.email, users.userMain.password);
    });
  
    it.only("The page loads correctly", () => {
      cy.request({
        method: "GET",
        url: `/account/boxes`
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    var token = "HOD61y"
    Cypress.env("token", token)

    it.only("Delete a task using API", () => {
      cy.request({
        method: "DELETE",
        
        url: `api/box/${Cypress.env("token")}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    })
  })

})


