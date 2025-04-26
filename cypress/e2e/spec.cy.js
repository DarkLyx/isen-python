describe('Create and connect to an account', () => {
  it('Visits the Oc commerce site', () => {
    cy.visit('/home')

    // User is able to create an account an to be redirect to login pages

    cy.contains('SIGNUP').click()
    cy.url().should('include', '/user/signup')
    // cy.contains('fname')
    cy.get('[id^=fname]').type('fakeuser')
    cy.get('[id^=lname]').type('toto')
    cy.get('[id^=username]').type('fakeuser')
    cy.get('[id^=email]').type('fake@email.com')
    cy.get('[id^=pass]').type('1hstesh<23456789')
    cy.get('[id^=re_pass]').type('1hstesh<23456789')
    cy.get('form').contains('Register').click()
    cy.url().should('include', '/user/login')

    // User is able to connect with the previously created account
    cy.get('[id^=your_name]').type('fakeuser')
    cy.get('[id^=your_pass]').type('1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')
    cy.contains('FAVOURITE')
  })
})


describe('Put item in favourite', () => {
  it('Connect to OC commerce and put in favourite', () => {

    // In this test you should load the home url and connect with the previous account
    cy.visit('/home')
    cy.contains('LOGIN').click()
    cy.get('[id^=your_name]').type('fakeuser')
    cy.get('[id^=your_pass]').type('1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')

    // You will go to favourite pages to make sure there is no favourite
    cy.contains('FAVOURITE').click()
    cy.get('table tbody tr td a').should('not.exist')

    // Then go back to home
    cy.contains('OC-commerce').click()


    // You will add an item to favourite
    cy.get('.portfolio-item')
      .first()
      .within(() => {
        cy.get('a[id^=favBtn]').click()
      });

    // You will go to favourite pages to confirm item is here
    cy.contains('FAVOURITE').click()
    cy.get('table tbody tr td a').should('exist')

    // You will then delete the item  an check it has been successfully deleted
    cy.get('table tbody tr td a').first().click()
    cy.get('.portfolio-item').should('have.length', 0)
  });
})


describe('Filter the products', () => {
  it('restrict the price between 20 and 30', () => {
    
    cy.visit('/home')
    cy.get('input[id^=min_price]').type('20')
    cy.get('input[id^=max_price]').type('30')
    cy.get('button[id^=filter]').click()
    cy.get('.portfolio-item h6')
    .each(($el) => {
      const text = $el.text();
      const price = parseFloat(text.replace('$', '').trim());
      expect(price).to.be.within(20, 30);
    });
    

  })
})


describe('ascendent sorting', () => {
  it('we will verify if the products are sorted', () => {

    cy.visit('/home')
    const prices = []

    cy.get('#form-filter').select('asc')
    cy.get('button[id^=filter]').click()

    cy.get('.portfolio-item h6')
      .each(($el) => {
        const text = $el.text();
        const price = parseFloat(text.replace('$', '').trim())
        prices.push(price)
      })
      .then(() => {
        const isSortedAsc = (arr) => {
          for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
              return false;
            }
          }
          return true;
        }

        expect(isSortedAsc(prices)).to.equal(true) // Appelle la fonction ici et vérifie
      })
  })
})

describe('descendent sorting', () => {
  it('we will verify if the products are sorted part 2', () => {

    cy.visit('/home')
    const prices = []

    cy.get('#form-filter').select('desc')
    cy.get('button[id^=filter]').click()

    cy.get('.portfolio-item h6')
      .each(($el) => {
        const text = $el.text();
        const price = parseFloat(text.replace('$', '').trim())
        prices.push(price)
      })
      .then(() => {
        const isSortedDesc = (arr) => {
          for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < arr[i + 1]) {
              return false;
            }
          }
          return true;
        }

        expect(isSortedDesc(prices)).to.equal(true) // Appelle la fonction ici et vérifie
      })
  })
})




