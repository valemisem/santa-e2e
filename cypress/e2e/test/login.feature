Feature: User can create a box and run it

  Scenario: User creates a box
    Given the user is logged in
    When the user creates a box
    Then the box is successfully created

  Scenario: User add participants
    When User adds participants
      | name       | email                           |
      | valentina1 | valentina.misem+test@gmail.com  |
      | valentina2 | valentina.misem+test1@gmail.com |
      | valentina3 | valentina.misem+test2@gmail.com |
    Then success
    Then add participants
    Then approve users

  Scenario: Box drawing
    Given the user
    When the user conducts a prize drawing
    Then the drawing is successfully completed

  Scenario: Box deleted
    Given logged in
    When the user deletes the box
    Then the box is successfully deleted
