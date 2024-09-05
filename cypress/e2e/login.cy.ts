describe('when not logged in', () => {
  it('shouldnt visit the home page if the user is not logged in', () => {
    cy.visit('/home');
    cy.url().should('not.contain', '/home');
    cy.url().should('contain', '/welcome');
  });
});

describe('when logged in', () => {
  it('should visit the home page if the user is logged in', () => {
    cy.visit('/welcome');
    cy.contains('LOGIN').should('be.visible').click();
    cy.url().should('contain', '/login');
    cy.get('ion-input[formControlName="email"]').type(
      'makoveevedwin@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.wait(1000);
    cy.get('#login').click();
    cy.url().should('contain', '/home');
  });
});
