describe('register user', () => {
  it('create a new user', () => {
    cy.visit('/register');
    cy.get('ion-input[formControlName="firstName"]').type('random');
    cy.get('ion-input[formControlName="lastName"]').type('unknown');
    cy.get('ion-input[formControlName="bornDate"]').type('1990-10-10');
    cy.get('ion-input[formControlName="username"]').type('unknown');
    cy.get('ion-input[formControlName="email"]').type(
      'clout.red.social@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.get('#condition').click();
    cy.wait(1000);
    cy.get('#register').click();
    cy.url().should('contain', '/home');
  });
});

describe('publications', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"]').type(
      'clout.red.social@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.wait(1000);
    cy.get('#login').click();
    cy.url().should('contain', '/home');
  });

  it('cant create a publication', () => {
    cy.get('#open-modal').click();
    cy.get('#text-descripcion').type('This is a random publication');
    cy.xpath('//*[@id="publish-button"]').should('have.attr', 'disabled');
  });

  it('like, comment and share a publication', () => {
    cy.visit('/post/1');
    cy.wait(2000);
    cy.get('#heart-icon')
      .should('have.attr', 'src', '../../../assets/icons/ic-heart-filled.svg')
      .click();
    cy.wait(1000);
    cy.get('#heart-icon').should(
      'have.attr',
      'src',
      '../../../assets/icons/ic-heart-empty.svg'
    );
    cy.get('#share-icon').click();

    cy.window()
      .then((win) => {
        // Utilizar la API del portapapeles para leer su contenido
        return win.navigator.clipboard.readText(); // Obtener el texto del portapapeles
      })
      .then((clipboardContent) => {
        expect(clipboardContent).to.equal('https://clout-pin.web.app/post/1');
      });

    cy.get('#comment-icon').click();
    cy.wait(1000);
    cy.xpath(
      '/html/body/app-root/ion-app/ion-router-outlet/app-post/ion-content/ion-grid/div/div[3]/ion-row/div[1]/input'
    ).type('Hello, this is a comment');
    cy.xpath(
      '/html/body/app-root/ion-app/ion-router-outlet/app-post/ion-content/ion-grid/div/div[3]/ion-row/div[2]/button'
    ).click();
    cy.wait(1000);
    cy.get('ion-list') // Selecciona el ion-list
      .find('ion-item') // Busca dentro de ion-list los ion-item
      .contains('Hello, this is a comment') // Verifica que haya un ion-item que contenga "Hola"
      .should('exist');
  });
});

describe('settings', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('ion-input[formControlName="email"]').type(
      'clout.red.social@gmail.com'
    );
    cy.get('ion-input[formControlName="password"]').type('password');
    cy.wait(1000);
    cy.get('#login').click();
    cy.url().should('contain', '/home');
    cy.get('#tab-button-profile').click();
    cy.url().should('contain', '/profile');
    cy.xpath('//*[@id="close-placeholder"]/ion-buttons/ion-button').click();
    cy.wait(1500);
    cy.url().should('contain', '/settings');
  });

  it('edit user data and confirm', () => {
    cy.get('#edit-bio').click();
    cy.get('#biografy').type('I am a random user');
    cy.get('#edit-bio').click();
    cy.xpath(
      '/html/body/app-root/ion-app/ion-router-outlet/app-main/ion-tabs/div/ion-router-outlet/app-profile-settings/ion-header/ion-toolbar/ion-buttons/ion-button'
    ).click();
    cy.wait(1500);
    cy.url().should('contain', '/profile');
    cy.get('#bio').should('contain', 'I am a random user');
  });

  it('delete the user', () => {
    cy.xpath(
      '//*[@id="main-content"]/app-main/ion-tabs/div/ion-router-outlet/app-profile-settings/ion-content/ion-grid/ion-col/ion-row[5]/ion-button'
    ).click();
    cy.wait(1500);
    cy.xpath('//*[@id="ion-overlay-3"]/div[2]/div[3]/button[2]').click();
  });
});
