describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the app to load and Redux to initialize
    cy.window().should('have.property', 'Cypress')
  })

  describe('Login Functionality', () => {
    it('should display login form by default', () => {
      // Wait for the auth page to render
      cy.get('[data-cy="login-button"]', { timeout: 10000 }).should('be.visible')
      cy.contains('Welcome_Back').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.contains('LOGIN').should('be.visible')
      cy.contains('SIGN_UP').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.get('[data-cy="login-submit-button"]', { timeout: 10000 }).should('be.visible').click()
      // Should show error toast
      cy.contains('Email is required').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.get('[data-cy="email-input"]').type('invalid@email.com')
      cy.get('[data-cy="password-input"]').type('wrongpassword')
      cy.get('[data-cy="login-submit-button"]').click()

      // Should show error message
      cy.contains('Invalid credentials').should('be.visible')
    })

    it('should successfully login with valid credentials', () => {
      cy.intercept('POST', '**/api/users/login', { fixture: 'login-success.json' }).as('loginRequest')

      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-submit-button"]').click()

      cy.wait('@loginRequest')
      cy.contains('Welcome back, testuser').should('be.visible')
    })

    it('should handle network errors during login', () => {
      cy.intercept('POST', '**/api/users/login', { forceNetworkError: true }).as('loginError')

      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="login-submit-button"]').click()

      cy.wait('@loginError')
      cy.contains('Network error').should('be.visible')
    })
  })

  describe('Signup Functionality', () => {
    it('should display signup form when signup button is clicked', () => {
      cy.get('[data-cy="signup-button"]').click()
      cy.contains('Init_User').should('be.visible')
      cy.get('[data-cy="username-input"]').should('be.visible')
      cy.get('[data-cy="email-input"]').should('be.visible')
      cy.get('[data-cy="password-input"]').should('be.visible')
      cy.get('[data-cy="role-select"]').should('be.visible')
    })

    it('should successfully register a new user', () => {
      cy.intercept('POST', '**/api/users/register', { fixture: 'register-success.json' }).as('registerRequest')

      cy.get('[data-cy="signup-button"]').click()
      cy.get('[data-cy="username-input"]').type('newuser')
      cy.get('[data-cy="email-input"]').type('newuser@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="role-select"]').select('User')
      cy.get('[data-cy="register-submit-button"]').click()

      cy.wait('@registerRequest')
      cy.contains('Account created successfully').should('be.visible')
    })

    it('should show error for duplicate email during registration', () => {
      cy.intercept('POST', '**/api/users/register', {
        statusCode: 400,
        body: { message: 'Failed to create account. Email may already exist.' }
      }).as('registerError')

      cy.get('[data-cy="signup-button"]').click()
      cy.get('[data-cy="username-input"]').type('existinguser')
      cy.get('[data-cy="email-input"]').type('existing@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="role-select"]').select('User')
      cy.get('[data-cy="register-submit-button"]').click()

      cy.wait('@registerError')
      cy.contains('Failed to create account').should('be.visible')
    })
  })

  describe('Session Management', () => {
    it('should persist login session', () => {
      // Mock successful login and token storage
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token')
      })

      cy.visit('/')
      // Should automatically show dashboard without login form
      cy.contains('Welcome back, testuser').should('be.visible')
    })

    it('should handle expired tokens', () => {
      cy.intercept('GET', '**/api/users/profile', {
        statusCode: 401,
        body: { message: 'Token expired' }
      }).as('expiredToken')

      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired-token')
      })

      cy.visit('/')
      cy.wait('@expiredToken')
      // Should redirect to login
      cy.get('[data-cy="login-button"]').should('be.visible')
    })

    it('should logout successfully', () => {
      // First login
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token')
      })

      cy.visit('/')
      cy.contains('Welcome back, testuser').should('be.visible')

      // Click logout
      cy.get('[data-cy="logout-button"]').click()
      cy.get('[data-cy="login-button"]').should('be.visible')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })
  })
})