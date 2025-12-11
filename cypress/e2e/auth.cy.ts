describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Login Functionality', () => {
    it('should display login form by default', () => {
      cy.contains('Welcome_Back').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.contains('LOGIN').should('be.visible')
      cy.contains('SIGN_UP').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.contains('AUTHENTICATE').click()
      // Should show error toast
      cy.contains('Email is required').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.get('input[name="email"]').type('invalid@email.com')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.contains('AUTHENTICATE').click()

      // Should show error message
      cy.contains('Invalid credentials').should('be.visible')
    })

    it('should successfully login with valid credentials', () => {
      cy.intercept('POST', '**/api/users/login', { fixture: 'login-success.json' }).as('loginRequest')

      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.contains('AUTHENTICATE').click()

      cy.wait('@loginRequest')
      cy.contains('Welcome back').should('be.visible')
    })

    it('should handle network errors during login', () => {
      cy.intercept('POST', '**/api/users/login', { forceNetworkError: true }).as('loginError')

      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.contains('AUTHENTICATE').click()

      cy.wait('@loginError')
      cy.contains('Network error').should('be.visible')
    })
  })

  describe('Signup Functionality', () => {
    it('should display signup form when signup button is clicked', () => {
      cy.contains('SIGN_UP').click()
      cy.contains('Init_User').should('be.visible')
      cy.get('input[name="name"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('select[name="role"]').should('be.visible')
    })

    it('should successfully register a new user', () => {
      cy.intercept('POST', '**/api/users/register', { fixture: 'register-success.json' }).as('registerRequest')

      cy.contains('SIGN_UP').click()
      cy.get('input[name="name"]').type('newuser')
      cy.get('input[name="email"]').type('newuser@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('select[name="role"]').select('User')
      cy.contains('CREATE_ACCOUNT').click()

      cy.wait('@registerRequest')
      cy.contains('Account created successfully').should('be.visible')
    })

    it('should show error for duplicate email during registration', () => {
      cy.intercept('POST', '**/api/users/register', {
        statusCode: 400,
        body: { message: 'Failed to create account. Email may already exist.' }
      }).as('registerError')

      cy.contains('SIGN_UP').click()
      cy.get('input[name="name"]').type('existinguser')
      cy.get('input[name="email"]').type('existing@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('select[name="role"]').select('User')
      cy.contains('CREATE_ACCOUNT').click()

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
      cy.contains('Welcome back').should('be.visible')
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
      cy.contains('Welcome_Back').should('be.visible')
    })

    it('should logout successfully', () => {
      // First login
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token')
      })

      cy.visit('/')
      cy.contains('Welcome back').should('be.visible')

      // Click logout
      cy.contains('Disconnect').click()
      cy.contains('Welcome_Back').should('be.visible')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })
  })
})