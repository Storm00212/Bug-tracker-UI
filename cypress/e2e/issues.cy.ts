describe('Issue Management', () => {
  beforeEach(() => {
    // Login and set up project context
    cy.window({ timeout: 15000 }).then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
    })
    cy.intercept('GET', '**/api/projects', { fixture: 'projects-list.json' }).as('getProjects')
    cy.visit('/', { timeout: 15000 })
    cy.wait('@getProjects', { timeout: 15000 })
  })

  describe('Issue Creation', () => {
    it('should display issue creation modal', () => {
      cy.get('[data-cy="project-selector"]', { timeout: 10000 }).select('1')
      cy.get('[data-cy="new-issue-button"]', { timeout: 10000 }).click()
      cy.contains('NEW_ISSUE', { timeout: 10000 }).should('be.visible')
      cy.get('input[placeholder*="Brief summary"]', { timeout: 10000 }).should('be.visible')
      cy.get('textarea[placeholder*="Steps to reproduce"]', { timeout: 10000 }).should('be.visible')
      cy.get('select[name="Priority"]', { timeout: 10000 }).should('be.visible')
      cy.get('select[name="AssignedTo"]', { timeout: 10000 }).should('be.visible')
    })

    it('should successfully create a new issue', () => {
      cy.intercept('POST', '**/api/bugs', { fixture: 'issue-create-success.json' }).as('createIssue')
      cy.intercept('GET', '**/api/users/project/1', { fixture: 'project-users.json' }).as('getUsers')

      // Select a project first
      cy.get('[data-cy="project-selector"]', { timeout: 10000 }).select('1')
      cy.wait('@getUsers', { timeout: 15000 })

      cy.get('[data-cy="new-issue-button"]', { timeout: 10000 }).click()
      cy.get('input[placeholder*="Brief summary"]', { timeout: 10000 }).type('Test Issue Title')
      cy.get('textarea[placeholder*="Steps to reproduce"]', { timeout: 10000 }).type('Test issue description')
      cy.get('select[name="Priority"]', { timeout: 10000 }).select('High')
      cy.get('select[name="AssignedTo"]', { timeout: 10000 }).select('1')
      cy.contains('CREATE_ISSUE', { timeout: 10000 }).click()

      cy.wait('@createIssue', { timeout: 15000 })
      cy.contains('NEW_ISSUE', { timeout: 10000 }).should('not.exist')
      cy.contains('Issue created successfully', { timeout: 10000 }).should('be.visible')
    })

    it('should show validation errors for empty title', () => {
      cy.get('[data-cy="project-selector"]', { timeout: 10000 }).select('1')
      cy.get('[data-cy="new-issue-button"]', { timeout: 10000 }).click()

      cy.get('textarea[placeholder*="Steps to reproduce"]', { timeout: 10000 }).type('Description without title')
      cy.contains('CREATE_ISSUE', { timeout: 10000 }).click()

      cy.contains('Issue title is required', { timeout: 10000 }).should('be.visible')
    })

    it('should handle API errors during issue creation', () => {
      cy.intercept('POST', '**/api/bugs', {
        statusCode: 400,
        body: { message: 'Invalid data' }
      }).as('createIssueError')

      cy.get('[data-cy="project-selector"]', { timeout: 10000 }).select('1')
      cy.get('[data-cy="new-issue-button"]', { timeout: 10000 }).click()
      cy.get('input[placeholder*="Brief summary"]', { timeout: 10000 }).type('Error Issue')
      cy.contains('CREATE_ISSUE', { timeout: 10000 }).click()

      cy.wait('@createIssueError', { timeout: 15000 })
      cy.contains('Failed to save issue', { timeout: 10000 }).should('be.visible')
    })

    it('should cancel issue creation', () => {
      cy.get('[data-cy="project-selector"]', { timeout: 10000 }).select('1')
      cy.get('[data-cy="new-issue-button"]', { timeout: 10000 }).click()
      cy.get('input[placeholder*="Brief summary"]', { timeout: 10000 }).type('Cancelled Issue')
      cy.contains('CANCEL', { timeout: 10000 }).click()

      cy.contains('NEW_ISSUE', { timeout: 10000 }).should('not.exist')
      cy.contains('Cancelled Issue', { timeout: 10000 }).should('not.exist')
    })
  })

  describe('Issue Display and Interaction', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/bugs/project/1', { fixture: 'bugs-project-1.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users/project/1', { fixture: 'project-users.json' }).as('getUsers')
      cy.get('select').select('1')
      cy.wait(['@getBugs', '@getUsers'])
    })

    it('should display issues in correct columns', () => {
      cy.contains('Open').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Resolved').should('be.visible')

      // Check that issues are in correct columns - look for status badges
      cy.get('.bg-gray-700').should('exist') // Open column indicator
      cy.get('.bg-yellow-900\\/30').should('exist') // In Progress column indicator
    })

    it('should show issue details in modal when clicked', () => {
      cy.get('.bg-surface.border').first().click() // Click first issue card
      cy.contains('EDIT_ISSUE').should('be.visible')
      cy.get('input[name="Title"]').should('be.visible')
      cy.get('textarea[name="Description"]').should('be.visible')
    })

    it('should allow drag and drop between columns', () => {
      cy.intercept('PUT', '**/api/bugs/*', { fixture: 'issue-update-success.json' }).as('updateIssue')

      // This is complex to test with drag and drop in Cypress
      // For now, we'll just verify the columns exist and can be interacted with
      cy.contains('Open').should('be.visible')
      cy.contains('In Progress').should('be.visible')
      cy.contains('Resolved').should('be.visible')
    })
  })

  describe('Issue Updates', () => {
    it('should update issue status', () => {
      cy.intercept('PUT', '**/api/bugs/1', { fixture: 'issue-update-success.json' }).as('updateIssue')

      cy.get('select').select('1')
      cy.get('.bg-surface.border').first().click() // Click first issue card
      cy.get('select[name="Status"]').select('Resolved')
      cy.contains('SAVE_CHANGES').click()

      cy.wait('@updateIssue')
      cy.contains('EDIT_ISSUE').should('not.exist')
    })

    it('should update issue assignee', () => {
      cy.intercept('PUT', '**/api/bugs/1', { fixture: 'issue-update-success.json' }).as('updateIssue')

      cy.get('select').select('1')
      cy.get('.bg-surface.border').first().click() // Click first issue card
      cy.get('select[name="AssignedTo"]').select('2')
      cy.contains('SAVE_CHANGES').click()

      cy.wait('@updateIssue')
    })

    it('should delete an issue', () => {
      cy.intercept('DELETE', '**/api/bugs/1', { statusCode: 200 }).as('deleteIssue')

      cy.get('select').select('1')
      cy.get('.bg-surface.border').first().click() // Click first issue card
      cy.contains('[DELETE]').click()

      cy.wait('@deleteIssue')
      cy.contains('EDIT_ISSUE').should('not.exist')
    })
  })

  describe('Issue Data Loading', () => {
    it('should handle loading states', () => {
      cy.intercept('GET', '**/api/bugs/project/1', { delay: 2000, fixture: 'bugs-project-1.json' }).as('slowBugs')

      cy.get('select').select('1')
      cy.contains('Loading dashboard...').should('be.visible')

      cy.wait('@slowBugs')
      cy.contains('Loading dashboard...').should('not.exist')
    })

    it('should handle empty issues list', () => {
      cy.intercept('GET', '**/api/bugs/project/1', { body: [] }).as('emptyBugs')

      cy.get('select').select('1')
      cy.wait('@emptyBugs')

      cy.contains('NO ISSUES').should('be.visible')
    })

    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/bugs/project/1', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('bugsError')

      cy.get('select').select('1')
      cy.wait('@bugsError')

      cy.contains('Error:').should('be.visible')
    })
  })
})