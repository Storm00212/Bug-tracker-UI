describe('Issue Management', () => {
  beforeEach(() => {
    // Login and set up project context
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
    })
    cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')
    cy.visit('/')
    cy.wait('@getProjects')
  })

  describe('Issue Creation', () => {
    it('should display issue creation modal', () => {
      cy.get('[data-cy="new-issue-button"]').click()
      cy.get('[data-cy="issue-modal"]').should('be.visible')
      cy.get('[data-cy="issue-title-input"]').should('be.visible')
      cy.get('[data-cy="issue-description-input"]').should('be.visible')
      cy.get('[data-cy="issue-priority-select"]').should('be.visible')
      cy.get('[data-cy="issue-assignee-select"]').should('be.visible')
    })

    it('should successfully create a new issue', () => {
      cy.intercept('POST', '**/api/bugs', { fixture: 'issue-create-success.json' }).as('createIssue')
      cy.intercept('GET', '**/api/users/project/1', { fixture: 'project-users.json' }).as('getUsers')

      // Select a project first
      cy.get('[data-cy="project-selector"]').select('1')
      cy.wait('@getUsers')

      cy.get('[data-cy="new-issue-button"]').click()
      cy.get('[data-cy="issue-title-input"]').type('Test Issue Title')
      cy.get('[data-cy="issue-description-input"]').type('Test issue description')
      cy.get('[data-cy="issue-priority-select"]').select('High')
      cy.get('[data-cy="issue-assignee-select"]').select('1')
      cy.get('[data-cy="issue-submit-button"]').click()

      cy.wait('@createIssue')
      cy.get('[data-cy="issue-modal"]').should('not.exist')
      cy.contains('Test Issue Title').should('be.visible')
    })

    it('should show validation errors for empty title', () => {
      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="new-issue-button"]').click()

      cy.get('[data-cy="issue-description-input"]').type('Description without title')
      cy.get('[data-cy="issue-submit-button"]').click()

      cy.contains('Title is required').should('be.visible')
    })

    it('should handle API errors during issue creation', () => {
      cy.intercept('POST', '**/api/bugs', {
        statusCode: 400,
        body: { message: 'Invalid data' }
      }).as('createIssueError')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="new-issue-button"]').click()
      cy.get('[data-cy="issue-title-input"]').type('Error Issue')
      cy.get('[data-cy="issue-submit-button"]').click()

      cy.wait('@createIssueError')
      cy.contains('Invalid data').should('be.visible')
    })

    it('should cancel issue creation', () => {
      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="new-issue-button"]').click()
      cy.get('[data-cy="issue-title-input"]').type('Cancelled Issue')
      cy.get('[data-cy="issue-cancel-button"]').click()

      cy.get('[data-cy="issue-modal"]').should('not.exist')
      cy.contains('Cancelled Issue').should('not.exist')
    })
  })

  describe('Issue Display and Interaction', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/bugs/project/1', { fixture: 'bugs-project-1.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users/project/1', { fixture: 'project-users.json' }).as('getUsers')
      cy.get('[data-cy="project-selector"]').select('1')
      cy.wait(['@getBugs', '@getUsers'])
    })

    it('should display issues in correct columns', () => {
      cy.get('[data-cy="column-open"]').should('contain', 'Open')
      cy.get('[data-cy="column-in-progress"]').should('contain', 'In Progress')
      cy.get('[data-cy="column-resolved"]').should('contain', 'Resolved')

      // Check that issues are in correct columns
      cy.get('[data-cy="column-open"]').find('[data-cy="issue-card"]').should('have.length.greaterThan', 0)
    })

    it('should show issue details in modal when clicked', () => {
      cy.get('[data-cy="issue-card"]').first().click()
      cy.get('[data-cy="issue-detail-modal"]').should('be.visible')
      cy.get('[data-cy="issue-detail-title"]').should('be.visible')
      cy.get('[data-cy="issue-detail-description"]').should('be.visible')
    })

    it('should allow drag and drop between columns', () => {
      cy.intercept('PUT', '**/api/bugs/*', { fixture: 'issue-update-success.json' }).as('updateIssue')

      // Drag from Open to In Progress
      cy.get('[data-cy="column-open"] [data-cy="issue-card"]').first()
        .trigger('dragstart')
      cy.get('[data-cy="column-in-progress"]')
        .trigger('drop')

      cy.wait('@updateIssue')
      // Verify the issue moved
      cy.get('[data-cy="column-in-progress"]').should('contain', 'Test Issue')
    })
  })

  describe('Issue Updates', () => {
    it('should update issue status', () => {
      cy.intercept('PUT', '**/api/bugs/1', { fixture: 'issue-update-success.json' }).as('updateIssue')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="issue-card"]').first().click()
      cy.get('[data-cy="issue-status-select"]').select('Resolved')
      cy.get('[data-cy="issue-save-button"]').click()

      cy.wait('@updateIssue')
      cy.get('[data-cy="issue-detail-modal"]').should('not.exist')
    })

    it('should update issue assignee', () => {
      cy.intercept('PUT', '**/api/bugs/1', { fixture: 'issue-update-success.json' }).as('updateIssue')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="issue-card"]').first().click()
      cy.get('[data-cy="issue-assignee-select"]').select('2')
      cy.get('[data-cy="issue-save-button"]').click()

      cy.wait('@updateIssue')
    })

    it('should delete an issue', () => {
      cy.intercept('DELETE', '**/api/bugs/1', { statusCode: 200 }).as('deleteIssue')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="issue-card"]').first().click()
      cy.get('[data-cy="issue-delete-button"]').click()
      cy.get('[data-cy="confirm-delete-button"]').click()

      cy.wait('@deleteIssue')
      cy.get('[data-cy="issue-detail-modal"]').should('not.exist')
    })
  })

  describe('Issue Data Loading', () => {
    it('should handle loading states', () => {
      cy.intercept('GET', '**/api/bugs/project/1', { delay: 2000, fixture: 'bugs-project-1.json' }).as('slowBugs')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.get('[data-cy="loading-spinner"]').should('be.visible')

      cy.wait('@slowBugs')
      cy.get('[data-cy="loading-spinner"]').should('not.exist')
    })

    it('should handle empty issues list', () => {
      cy.intercept('GET', '**/api/bugs/project/1', { body: [] }).as('emptyBugs')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.wait('@emptyBugs')

      cy.contains('No issues found').should('be.visible')
    })

    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/bugs/project/1', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('bugsError')

      cy.get('[data-cy="project-selector"]').select('1')
      cy.wait('@bugsError')

      cy.contains('Error loading issues').should('be.visible')
    })
  })
})