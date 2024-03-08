Feature: User can log in

Scenario: I want to login
  Given I navigate to the login page
  Then I login successfully as "<login>" with "<password>"
  And I am on the dashboard
  
  Examples:
      | login | password |
      | valentina.misem@gmail.com | test1234  |
      | valentina.misem+test@gmail.com | test1234  |

  
     
