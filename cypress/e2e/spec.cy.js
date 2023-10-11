describe('Hurricane Insurance form submission', () => {

  beforeEach(() => {
    cy.visit('https://sure-qa-challenge.vercel.app')
  })

  it('Verify that user can choose the insurance plan with valid credentials', () => {
    cy.get('[data-testid="postalCode"]').type('12345')
    cy.get('[type="submit"]').click()
    cy.url()
        .should('include', '/building-material')

    cy.get('[data-testid="straw"]').click()
    cy.get('[data-testid="submit_cta"]').click()
    cy.url()
        .should('include', '/water-proximity')

    cy.get('[value="true"]').click()
    cy.get('[type="submit"]').click()
    cy.url()
        .should('include', '/quote')

    cy.get('[data-testid="price_Complete"]').then( el => {
      let num = Number(el.text().split('$')[1])
      expect(typeof num).eq('number')
    })
  })

  it('Verify that user can not submit the form with invalid credentials', () => {
    cy.get('[data-testid="postalCode"]').type('1234')
    cy.get('[type="submit"]').click()
    cy.get('.MuiFormHelperText-filled')
        .should('be.visible')
        .and('have.text', 'Invalid zip code')
        .and ('have.css','color', 'rgb(244, 67, 54)')
  })

  it('Verify that user can not submit the form with blank zip code field', () => {
    cy.get('[type="submit"]').click()
    cy.get('.jss10 > div > p')
        .should('be.visible')
        .and('have.text', 'Required')
        .and ('have.css','color', 'rgb(244, 67, 54)')
  })

  it('Verify that user can not submit the form without choosing any option on building material page', () => {
    cy.get('[data-testid="postalCode"]').type('12345')
    cy.get('[type="submit"]').click()
    cy.url()
        .should('include', '/building-material')

    cy.get('[data-testid="submit_cta"]').click()
    cy.url()
        .should('not.include', '/water-proximity')
        .and('include', '/building-material')
  })

  it('Verify that user can not submit the form without choosing any option on water proximity page', () => {
    cy.get('[data-testid="postalCode"]').type('12345')
    cy.get('[type="submit"]').click()
    cy.url()
        .should('include', '/building-material')

    cy.get('[data-testid="straw"]').click()
    cy.get('[data-testid="submit_cta"]').click()
    cy.url()
        .should('include', '/water-proximity')

    cy.get('[type="submit"]').click()
    cy.url()
        .should('not.include', '/quote')
        .should('include', '/water-proximity')
  })

  it('If user is not near a body of water, verify that Complete plan checkbox label should not include the price', () => {
    cy.get('[data-testid="postalCode"]').type('12345')
    cy.get('[type="submit"]').click()

    cy.get('[data-testid="straw"]').click()
    cy.get('[data-testid="submit_cta"]').click()

    cy.get('[value="false"]').click()
    cy.get('[type="submit"]').click()
    cy.url()
        .should('include', '/quote')

    cy.get('span.MuiFormControlLabel-label')
        .should('have.text', 'Include Flood Protection')
  })

  it('If user is near a body of water, verify that Complete plan checkbox label should include the price', () => {
    cy.get('[data-testid="postalCode"]').type('12345')
    cy.get('[type="submit"]').click()

    cy.get('[data-testid="straw"]').click()
    cy.get('[data-testid="submit_cta"]').click()

    cy.get('[value="true"]').click()
    cy.get('[type="submit"]').click()
    cy.url()
        .should('include', '/quote')

    cy.get('span.MuiFormControlLabel-label')
        .should('have.text', 'Include Flood Protection (+$176)')
  })

  it('Verify that users answers persisted within the a browser session, after reload or navigation', () => {
    cy.get('[data-testid="postalCode"]').type('12345')
    cy.get('[type="submit"]').click()

    cy.get('[data-testid="straw"]').click()
    cy.get('[data-testid="submit_cta"]').click()

    cy.get('[value="true"]').click()
    cy.get('[type="submit"]').click()

    cy.getAllSessionStorage().then(result => {
      expect(result).to.deep.equal({'https://sure-qa-challenge.vercel.app' : {
              'application:postalCode': '12345',
              'application:waterProximity': 'true',
              'application:buildingMaterial': 'straw'
            }
          })
    })

    cy.reload()
    cy.getAllSessionStorage().then(result => {
      expect(result).to.deep.equal({'https://sure-qa-challenge.vercel.app' : {
          'application:postalCode': '12345',
          'application:waterProximity': 'true',
          'application:buildingMaterial': 'straw'
        }
      })
    })

    cy.go('back')
    cy.getAllSessionStorage().then(result => {
      expect(result).to.deep.equal({'https://sure-qa-challenge.vercel.app' : {
          'application:postalCode': '12345',
          'application:waterProximity': 'true',
          'application:buildingMaterial': 'straw'
        }
      })
    })
  })
})
