describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 15000 })
    // Wait for the app to load and Redux to initialize
    cy.window({ timeout: 15000 }).should('have.property', 'Cypress')
    // Wait for the body to be visible
    cy.get('body', { timeout: 15000 }).should('be.visible')
  })

  describe('Login Functionality', () => {
    it('should display login form by default', () => {
      // Wait for the auth page to render
      cy.get('[data-cy="login-button"]', { timeout: 20000 }).should('be.visible')
      cy.contains('Welcome_Back', { timeout: 10000 }).should('be.visible')
      cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible')
      cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
      cy.contains('LOGIN', { timeout: 10000 }).should('be.visible')
      cy.contains('SIGN_UP', { timeout: 10000 }).should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.get('[data-cy="login-submit-button"]', { timeout: 15000 }).should('be.visible').click()
      // Should show error toast
      cy.contains('Email is required', { timeout: 10000 }).should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.get('[data-cy="email-input"]', { timeout: 10000 }).type('invalid@email.com')
      cy.get('[data-cy="password-input"]', { timeout: 10000 }).type('wrongpassword')
      cy.get('[data-cy="login-submit-button"]', { timeout: 10000 }).click()

      // Should show error message
      cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible')
    })

    it('should successfully login with valid credentials', () => {
      cy.intercept('POST', '**/api/users/login', { fixture: 'login-success.json' }).as('loginRequest')

      cy.get('[data-cy="email-input"]', { timeout: 10000 }).type('test@example.com')
      cy.get('[data-cy="password-input"]', { timeout: 10000 }).type('password123')
      cy.get('[data-cy="login-submit-button"]', { timeout: 10000 }).click()

      cy.wait('@loginRequest', { timeout: 15000 })
      cy.contains('Welcome back, testuser', { timeout: 15000 }).should('be.visible')
    })

    it('should handle network errors during login', () => {
      cy.intercept('POST', '**/api/users/login', { forceNetworkError: true }).as('loginError')

      cy.get('[data-cy="email-input"]', { timeout: 10000 }).type('test@example.com')
      cy.get('[data-cy="password-input"]', { timeout: 10000 }).type('password123')
      cy.get('[data-cy="login-submit-button"]', { timeout: 10000 }).click()

      cy.wait('@loginError', { timeout: 15000 })
      cy.contains('Network error', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Signup Functionality', () => {
    it('should display signup form when signup button is clicked', () => {
      cy.get('[data-cy="signup-button"]', { timeout: 10000 }).click()
      cy.contains('Init_User', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="username-input"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="email-input"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="password-input"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="role-select"]', { timeout: 10000 }).should('be.visible')
    })

    it('should successfully register a new user', () => {
      cy.intercept('POST', '**/api/users/register', { fixture: 'register-success.json' }).as('registerRequest')

      cy.get('[data-cy="signup-button"]', { timeout: 10000 }).click()
      cy.get('[data-cy="username-input"]', { timeout: 10000 }).type('newuser')
      cy.get('[data-cy="email-input"]', { timeout: 10000 }).type('newuser@example.com')
      cy.get('[data-cy="password-input"]', { timeout: 10000 }).type('password123')
      cy.get('[data-cy="role-select"]', { timeout: 10000 }).select('User')
      cy.get('[data-cy="register-submit-button"]', { timeout: 10000 }).click()

      cy.wait('@registerRequest', { timeout: 15000 })
      cy.contains('Account created successfully', { timeout: 10000 }).should('be.visible')
    })

    it('should show error for duplicate email during registration', () => {
      cy.intercept('POST', '**/api/users/register', {
        statusCode: 400,
        body: { message: 'Failed to create account. Email may already exist.' }
      }).as('registerError')

      cy.get('[data-cy="signup-button"]', { timeout: 10000 }).click()
      cy.get('[data-cy="username-input"]', { timeout: 10000 }).type('existinguser')
      cy.get('[data-cy="email-input"]', { timeout: 10000 }).type('existing@example.com')
      cy.get('[data-cy="password-input"]', { timeout: 10000 }).type('password123')
      cy.get('[data-cy="role-select"]', { timeout: 10000 }).select('User')
      cy.get('[data-cy="register-submit-button"]', { timeout: 10000 }).click()

      cy.wait('@registerError', { timeout: 15000 })
      cy.contains('Failed to create account', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Session Management', () => {
    it('should persist login session', () => {
      // Mock successful login and token storage
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token')
      })

      cy.visit('/', { timeout: 15000 })
      // Should automatically show dashboard without login form
      cy.contains('Welcome back, testuser', { timeout: 15000 }).should('be.visible')
    })

    it('should handle expired tokens', () => {
      cy.intercept('GET', '**/api/users/profile', {
        statusCode: 401,
        body: { message: 'Token expired' }
      }).as('expiredToken')

      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired-token')
      })

      cy.visit('/', { timeout: 15000 })
      cy.wait('@expiredToken', { timeout: 15000 })
      // Should redirect to login
      cy.get('[data-cy="login-button"]', { timeout: 15000 }).should('be.visible')
    })

    it('should logout successfully', () => {
      // First login
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token')
      })

      cy.visit('/', { timeout: 15000 })
      cy.contains('Welcome back, testuser', { timeout: 15000 }).should('be.visible')

      // Click logout
      cy.get('[data-cy="logout-button"]', { timeout: 10000 }).click()
      cy.get('[data-cy="login-button"]', { timeout: 15000 }).should('be.visible')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })
  })
})