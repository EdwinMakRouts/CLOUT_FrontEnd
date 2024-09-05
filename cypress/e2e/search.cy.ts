describe('search', () => {
  it('can access to search', () => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"]').type(
      'makoveevedwin@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.wait(1000);
    cy.get('#login').click();
    cy.url().should('contain', '/home');
    cy.xpath('//*[@id="tab-button-search"]/ion-icon').click();
    cy.url().should('contain', '/search');
    cy.xpath(
      '//*[@id="main-content"]/app-main/ion-tabs/div/ion-router-outlet/app-search/ion-content/ion-grid/ion-row/ion-searchbar/div/input'
    ).type('example');
  });
});
