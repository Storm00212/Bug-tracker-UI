describe('Project Management', () => {
  beforeEach(() => {
    // Login first
    cy.window({ timeout: 15000 }).then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
    })
    cy.visit('/', { timeout: 15000 })
  })

  describe('Project Creation', () => {
    it('should display project creation modal', () => {
      cy.get('[data-cy="new-project-button"]', { timeout: 10000 }).click()
      cy.contains('INIT_PROJECT', { timeout: 10000 }).should('be.visible')
      cy.get('input[placeholder*="Q4_Marketing_Campaign"]', { timeout: 10000 }).should('be.visible')
      cy.get('textarea[placeholder*="Brief summary"]', { timeout: 10000 }).should('be.visible')
    })

    it('should successfully create a new project', () => {
      cy.intercept('POST', '**/api/projects', { fixture: 'project-create-success.json' }).as('createProject')

      cy.get('[data-cy="new-project-button"]', { timeout: 10000 }).click()
      cy.get('input[placeholder*="Q4_Marketing_Campaign"]', { timeout: 10000 }).type('Test Project')
      cy.get('textarea[placeholder*="Brief summary"]', { timeout: 10000 }).type('A test project description')
      cy.contains('CREATE_PROJECT', { timeout: 10000 }).click()

      cy.wait('@createProject', { timeout: 15000 })
      cy.contains('INIT_PROJECT', { timeout: 10000 }).should('not.exist')
      cy.contains('Project created successfully', { timeout: 10000 }).should('be.visible')
    })

    it('should show validation errors for empty project name', () => {
      cy.get('[data-cy="new-project-button"]', { timeout: 10000 }).click()
      cy.get('textarea[placeholder*="Brief summary"]', { timeout: 10000 }).type('Description without name')
      cy.contains('CREATE_PROJECT', { timeout: 10000 }).click()

      cy.contains('Project name is required', { timeout: 10000 }).should('be.visible')
    })

    it('should handle API errors during project creation', () => {
      cy.intercept('POST', '**/api/projects', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('createProjectError')

      cy.get('[data-cy="new-project-button"]', { timeout: 10000 }).click()
      cy.get('input[placeholder*="Q4_Marketing_Campaign"]', { timeout: 10000 }).type('Error Project')
      cy.contains('CREATE_PROJECT', { timeout: 10000 }).click()

      cy.wait('@createProjectError', { timeout: 15000 })
      cy.contains('Failed to create project', { timeout: 10000 }).should('be.visible')
    })

    it('should cancel project creation', () => {
      cy.get('[data-cy="new-project-button"]', { timeout: 10000 }).click()
      cy.get('input[placeholder*="Q4_Marketing_Campaign"]', { timeout: 10000 }).type('Cancelled Project')
      cy.contains('CANCEL', { timeout: 10000 }).click()

      cy.contains('INIT_PROJECT', { timeout: 10000 }).should('not.exist')
      cy.contains('Cancelled Project', { timeout: 10000 }).should('not.exist')
    })
  })

  describe('Project Selection and Navigation', () => {
    it('should display project selector when projects exist', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')

      cy.visit('/')
      cy.wait('@getProjects')

      cy.contains('PROJECT:').should('be.visible')
      cy.get('select').should('be.visible')
    })

    it('should switch between projects', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/project/1', { fixture: 'bugs-project-1.json' }).as('getBugs1')
      cy.intercept('GET', '**/api/bugs/project/2', { fixture: 'bugs-project-2.json' }).as('getBugs2')
      cy.intercept('GET', '**/api/users/project/1', { fixture: 'project-users.json' }).as('getUsers1')
      cy.intercept('GET', '**/api/users/project/2', { fixture: 'project-users.json' }).as('getUsers2')

      cy.visit('/')
      cy.wait('@getProjects')

      // Select first project
      cy.get('select').select('1')
      cy.wait(['@getBugs1', '@getUsers1'])
      cy.contains('Open').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Resolved').should('be.visible')

      // Switch to second project
      cy.get('select').select('2')
      cy.wait(['@getBugs2', '@getUsers2'])
      cy.contains('Open').should('be.visible')
    })

    it('should show dashboard when no project is selected', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')

      cy.visit('/')
      cy.wait('@getProjects')

      // Dashboard should be visible by default
      cy.contains('Welcome back').should('be.visible')
      cy.contains('Active Projects').should('be.visible')
      cy.contains('Assigned Issues').should('be.visible')
    })
  })

  describe('Project Data Loading', () => {
    it('should handle loading states', () => {
      cy.intercept('GET', '**/api/projects', { delay: 2000, fixture: 'projects-list.json' }).as('slowProjects')

      cy.visit('/')
      cy.contains('Loading dashboard...').should('be.visible')

      cy.wait('@slowProjects')
      cy.contains('Loading dashboard...').should('not.exist')
    })

    it('should handle empty projects list', () => {
      cy.intercept('GET', '**/api/projects', { body: [] }).as('emptyProjects')

      cy.visit('/')
      cy.wait('@emptyProjects')

      cy.contains('No Project Selected').should('be.visible')
      cy.contains('PROJECT:').should('not.exist')
    })

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/projects', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('projectsError')

      cy.visit('/')
      cy.wait('@projectsError')

      cy.contains('Error: Server error').should('be.visible')
    })
  })
})