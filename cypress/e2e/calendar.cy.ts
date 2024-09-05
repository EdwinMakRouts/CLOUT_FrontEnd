describe('calendar', () => {
  it('can access to calendar', () => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"]').type(
      'makoveevedwin@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.wait(1000);
    cy.get('#login').click();
    cy.url().should('contain', '/home');
    cy.xpath('//*[@id="tab-button-calendar"]/ion-icon').click();
    cy.url().should('contain', '/calendar');
    cy.wait(1000);
    cy.get('calendar').should('exist');
  });

  it('show should publications if there are, if there arent shouldnt show', () => {
    cy.visit('/login');
    cy.wait(1000);
    cy.get('ion-input[formControlName="email"]').type(
      'makoveevedwin@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.get('#login').click();
    cy.wait(1000);
    cy.visit('/calendar');
    cy.get('.monthview-primary-with-event')
      .its('length')
      .then((length) => {
        if (length > 0) {
          cy.get('.monthview-primary-with-event').first().click();
          cy.get('.post-container').should('exist');
        } else {
          cy.get('.post-container').should('not.exist');
        }
      });
  });
});
