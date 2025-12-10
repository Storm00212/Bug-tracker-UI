describe('Project Management', () => {
  beforeEach(() => {
    // Login first
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
    })
    cy.visit('/')
  })

  describe('Project Creation', () => {
    it('should display project creation modal', () => {
      cy.get('[data-cy="new-project-button"]').click()
      cy.get('[data-cy="project-modal"]').should('be.visible')
      cy.get('[data-cy="project-name-input"]').should('be.visible')
      cy.get('[data-cy="project-description-input"]').should('be.visible')
    })

    it('should successfully create a new project', () => {
      cy.intercept('POST', '**/api/projects', { fixture: 'project-create-success.json' }).as('createProject')

      cy.get('[data-cy="new-project-button"]').click()
      cy.get('[data-cy="project-name-input"]').type('Test Project')
      cy.get('[data-cy="project-description-input"]').type('A test project description')
      cy.get('[data-cy="project-submit-button"]').click()

      cy.wait('@createProject')
      cy.get('[data-cy="project-modal"]').should('not.exist')
      cy.contains('Test Project').should('be.visible')
    })

    it('should show validation errors for empty project name', () => {
      cy.get('[data-cy="new-project-button"]').click()
      cy.get('[data-cy="project-description-input"]').type('Description without name')
      cy.get('[data-cy="project-submit-button"]').click()

      cy.contains('Project name is required').should('be.visible')
    })

    it('should handle API errors during project creation', () => {
      cy.intercept('POST', '**/api/projects', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('createProjectError')

      cy.get('[data-cy="new-project-button"]').click()
      cy.get('[data-cy="project-name-input"]').type('Error Project')
      cy.get('[data-cy="project-submit-button"]').click()

      cy.wait('@createProjectError')
      cy.contains('Server error').should('be.visible')
    })

    it('should cancel project creation', () => {
      cy.get('[data-cy="new-project-button"]').click()
      cy.get('[data-cy="project-name-input"]').type('Cancelled Project')
      cy.get('[data-cy="project-cancel-button"]').click()

      cy.get('[data-cy="project-modal"]').should('not.exist')
      cy.contains('Cancelled Project').should('not.exist')
    })
  })

  describe('Project Selection and Navigation', () => {
    it('should display project selector when projects exist', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')

      cy.visit('/')
      cy.wait('@getProjects')

      cy.get('[data-cy="project-selector"]').should('be.visible')
      cy.get('[data-cy="project-selector"]').should('contain', 'Select Project')
    })

    it('should switch between projects', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/project/1', { fixture: 'bugs-project-1.json' }).as('getBugs1')
      cy.intercept('GET', '**/api/bugs/project/2', { fixture: 'bugs-project-2.json' }).as('getBugs2')

      cy.visit('/')
      cy.wait('@getProjects')

      // Select first project
      cy.get('[data-cy="project-selector"]').select('1')
      cy.wait('@getBugs1')
      cy.get('[data-cy="project-title"]').should('contain', 'Project Alpha')

      // Switch to second project
      cy.get('[data-cy="project-selector"]').select('2')
      cy.wait('@getBugs2')
      cy.get('[data-cy="project-title"]').should('contain', 'Project Beta')
    })

    it('should show dashboard when no project is selected', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')

      cy.visit('/')
      cy.wait('@getProjects')

      // Dashboard should be visible by default
      cy.contains('Welcome back').should('be.visible')
      cy.get('[data-cy="active-projects-count"]').should('be.visible')
      cy.get('[data-cy="assigned-issues-count"]').should('be.visible')
    })
  })

  describe('Project Data Loading', () => {
    it('should handle loading states', () => {
      cy.intercept('GET', '**/api/projects', { delay: 2000, fixture: 'projects-list.json' }).as('slowProjects')

      cy.visit('/')
      cy.get('[data-cy="loading-spinner"]').should('be.visible')

      cy.wait('@slowProjects')
      cy.get('[data-cy="loading-spinner"]').should('not.exist')
    })

    it('should handle empty projects list', () => {
      cy.intercept('GET', '**/api/projects', { body: [] }).as('emptyProjects')

      cy.visit('/')
      cy.wait('@emptyProjects')

      cy.contains('No Project Selected').should('be.visible')
      cy.get('[data-cy="project-selector"]').should('not.exist')
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