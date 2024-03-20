Feature: User logs in

Scenario: I want to log in
  Given I navigate to the log in page
  Then I log in successfully
  
      | login       | password |
      | valentina1 | test1234  |

  And I am on the user dashboard
     
