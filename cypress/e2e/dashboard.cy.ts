describe('Dashboard Component', () => {
  beforeEach(() => {
    // Login first and setup mock data
    cy.window({ timeout: 15000 }).then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
    })

    // Setup mock API responses
    cy.intercept('GET', '**/api/projects', { fixture: 'user-projects.json' }).as('getProjects')
    cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'assigned-bugs.json' }).as('getBugs')
    cy.intercept('GET', '**/api/users', { fixture: 'all-users.json' }).as('getUsers')

    cy.visit('/', { timeout: 15000 })
    cy.wait(['@getProjects', '@getBugs', '@getUsers'], { timeout: 15000 })
  })

  describe('Dashboard Loading and Display', () => {
    it('should display loading state initially', () => {
      cy.intercept('GET', '**/api/projects', { delay: 1000, fixture: 'user-projects.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/assignee/1', { delay: 1000, fixture: 'assigned-bugs.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users', { delay: 1000, fixture: 'all-users.json' }).as('getUsers')

      cy.visit('/', { timeout: 15000 })
      cy.contains('Loading dashboard...', { timeout: 10000 }).should('be.visible')

      cy.wait(['@getProjects', '@getBugs', '@getUsers'], { timeout: 15000 })
      cy.contains('Loading dashboard...', { timeout: 10000 }).should('not.exist')
    })

    it('should display welcome message with username', () => {
      cy.contains('Welcome back, testuser', { timeout: 15000 }).should('be.visible')
      cy.contains("Here's an overview of your work", { timeout: 10000 }).should('be.visible')
    })

    it('should display metrics panel with correct data', () => {
      // Check metrics display
      cy.get('[data-cy="active-projects-count"]', { timeout: 10000 }).should('contain', '3')
      cy.get('[data-cy="assigned-issues-count"]', { timeout: 10000 }).should('contain', '5')
    })
  })

  describe('Assigned Issues Tooltip', () => {
    it('should show tooltip on hover', () => {
      cy.get('[data-cy="assigned-issues-hover-area"]', { timeout: 10000 }).trigger('mouseover')
      cy.get('[data-cy="issues-tooltip"]', { timeout: 10000 }).should('be.visible')
      cy.contains('Your Assigned Issues', { timeout: 10000 }).should('be.visible')
    })

    it('should display issue details in tooltip', () => {
      cy.get('[data-cy="assigned-issues-hover-area"]', { timeout: 10000 }).trigger('mouseover')

      // Check that issues are displayed with details
      cy.get('[data-cy="issues-tooltip"]', { timeout: 10000 }).within(() => {
        cy.get('[data-cy="tooltip-issue"]', { timeout: 10000 }).first().within(() => {
          cy.contains('Bug #101', { timeout: 10000 }).should('be.visible')
          cy.contains('Fix login issue', { timeout: 10000 }).should('be.visible')
          cy.contains('Open', { timeout: 10000 }).should('be.visible')
          cy.contains('Project Alpha', { timeout: 10000 }).should('be.visible')
        })
      })
    })

    it('should show scrollable list for many issues', () => {
      cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'many-assigned-bugs.json' }).as('getManyBugs')
      cy.visit('/', { timeout: 15000 })
      cy.wait('@getManyBugs', { timeout: 15000 })

      cy.get('[data-cy="assigned-issues-hover-area"]', { timeout: 10000 }).trigger('mouseover')
      cy.get('[data-cy="issues-tooltip"]', { timeout: 10000 }).should('be.visible')
      cy.contains('And 5 more issues...', { timeout: 10000 }).should('be.visible')
    })

    it('should hide tooltip on mouse leave', () => {
      cy.get('[data-cy="assigned-issues-hover-area"]', { timeout: 10000 }).trigger('mouseover')
      cy.get('[data-cy="issues-tooltip"]', { timeout: 10000 }).should('be.visible')

      cy.get('[data-cy="assigned-issues-hover-area"]', { timeout: 10000 }).trigger('mouseleave')
      cy.get('[data-cy="issues-tooltip"]', { timeout: 10000 }).should('not.exist')
    })
  })

  describe('Recent Activity Filtering', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/projects', { fixture: 'user-projects.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'assigned-bugs.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users', { fixture: 'all-users.json' }).as('getUsers')
      cy.visit('/')
      cy.wait(['@getProjects', '@getBugs', '@getUsers'])
    })

    it('should display all issues by default', () => {
      cy.get('[data-cy="filter-all"]').should('have.class', 'bg-primary')
      cy.get('[data-cy="issue-card"]').should('have.length', 5)
    })

    it('should filter to open issues only', () => {
      cy.get('[data-cy="filter-open"]').click()
      cy.get('[data-cy="filter-open"]').should('have.class', 'bg-green-500')
      cy.get('[data-cy="issue-card"]').should('have.length', 3)
      cy.get('[data-cy="issue-card"]').each(($card) => {
        cy.wrap($card).should('contain', 'Open')
      })
    })

    it('should filter to closed issues only', () => {
      cy.get('[data-cy="filter-closed"]').click()
      cy.get('[data-cy="filter-closed"]').should('have.class', 'bg-gray-500')
      cy.get('[data-cy="issue-card"]').should('have.length', 2)
      cy.get('[data-cy="issue-card"]').each(($card) => {
        cy.wrap($card).should('contain', 'Resolved')
      })
    })

    it('should show empty state when no issues match filter', () => {
      // Mock empty results for closed filter
      cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'no-closed-bugs.json' }).as('getNoClosedBugs')
      cy.visit('/')
      cy.wait('@getNoClosedBugs')

      cy.get('[data-cy="filter-closed"]').click()
      cy.contains('No recent issues found').should('be.visible')
    })
  })

  describe('Issue Cards and Navigation', () => {
    it('should display issue cards with correct information', () => {
      cy.get('[data-cy="issue-card"]').first().within(() => {
        cy.get('[data-cy="issue-id"]').should('contain', '#101')
        cy.get('[data-cy="issue-title"]').should('contain', 'Fix login issue')
        cy.contains('Open').should('be.visible')
        cy.contains('Project Alpha').should('be.visible')
      })
    })

    it('should navigate to project when issue card is clicked', () => {
      cy.intercept('GET', '**/api/bugs/project/1', { fixture: 'project-bugs.json' }).as('getProjectBugs')
      cy.intercept('GET', '**/api/users/project/1', { fixture: 'project-users.json' }).as('getProjectUsers')

      cy.get('[data-cy="issue-card"]').first().click()
      cy.wait(['@getProjectBugs', '@getProjectUsers'])

      // Should navigate to project view
      cy.get('[data-cy="project-columns"]').should('be.visible')
      cy.get('[data-cy="column-open"]').should('be.visible')
    })

    it('should show correct project name in issue cards', () => {
      cy.get('[data-cy="issue-card"]').first().within(() => {
        cy.get('[data-cy="issue-project"]').should('contain', 'Project Alpha')
      })
    })

    it('should display assignee information correctly', () => {
      cy.get('[data-cy="issue-card"]').first().within(() => {
        cy.get('[data-cy="issue-assignee-avatar"]').should('exist')
        cy.get('[data-cy="issue-assignee-name"]').should('contain', 'John Doe')
      })
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/projects', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('projectsError')

      cy.visit('/')
      cy.wait('@projectsError')

      cy.contains('Error loading dashboard').should('be.visible')
    })

    it('should handle empty data gracefully', () => {
      cy.intercept('GET', '**/api/projects', { body: [] }).as('emptyProjects')
      cy.intercept('GET', '**/api/bugs/assignee/1', { body: [] }).as('emptyBugs')
      cy.intercept('GET', '**/api/users', { body: [] }).as('emptyUsers')

      cy.visit('/')
      cy.wait(['@emptyProjects', '@emptyBugs', '@emptyUsers'])

      cy.get('[data-cy="active-projects-count"]').should('contain', '0')
      cy.get('[data-cy="assigned-issues-count"]').should('contain', '0')
      cy.contains('No recent issues found').should('be.visible')
    })

    it('should handle missing user data', () => {
      cy.intercept('GET', '**/api/users', { body: [] }).as('emptyUsers')

      cy.visit('/')
      cy.wait('@emptyUsers')

      // Should still display issues but without assignee info
      cy.get('[data-cy="issue-card"]').should('exist')
      cy.get('[data-cy="issue-assignee-avatar"]').should('not.exist')
    })

    it('should handle network timeouts', () => {
      cy.intercept('GET', '**/api/projects', { delay: 10000, fixture: 'user-projects.json' }).as('slowProjects')

      cy.visit('/')
      cy.contains('Loading dashboard...', { timeout: 11000 }).should('be.visible')

      cy.wait('@slowProjects', { timeout: 11000 })
      cy.contains('Loading dashboard...').should('not.exist')
    })

    it('should handle invalid project IDs', () => {
      cy.intercept('GET', '**/api/bugs/assignee/1', {
        fixture: 'bugs-with-invalid-project-ids.json'
      }).as('invalidProjectBugs')

      cy.visit('/')
      cy.wait('@invalidProjectBugs')

      // Should display "Project #123" for unknown projects
      cy.get('[data-cy="issue-project"]').should('contain', 'Project #999')
    })
  })

  describe('Responsive Design and UI Elements', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/projects', { fixture: 'user-projects.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'assigned-bugs.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users', { fixture: 'all-users.json' }).as('getUsers')
      cy.visit('/')
      cy.wait(['@getProjects', '@getBugs', '@getUsers'])
    })

    it('should display correctly on mobile viewport', () => {
      cy.viewport('iphone-6')
      cy.get('[data-cy="dashboard-container"]').should('be.visible')
      cy.get('[data-cy="metrics-panel"]').should('have.class', 'grid-cols-1')
    })

    it('should display correctly on desktop viewport', () => {
      cy.viewport('macbook-15')
      cy.get('[data-cy="metrics-panel"]').should('have.class', 'md:grid-cols-2')
    })

    it('should apply correct Tailwind styling', () => {
      // Check that custom theme colors are applied
      cy.get('[data-cy="active-projects-metric"]').should('have.css', 'background-color', 'rgb(21, 33, 41)') // surface
      cy.get('[data-cy="assigned-issues-metric"]').should('have.css', 'background-color', 'rgb(21, 33, 41)') // surface
    })

    it('should show hover effects', () => {
      cy.get('[data-cy="issue-card"]').first().trigger('mouseover')
      cy.get('[data-cy="issue-card"]').first().should('have.class', 'hover:border-primary')
    })
  })

  describe('Data Integration and State Management', () => {
    it('should update metrics when data changes', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'user-projects.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'assigned-bugs.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users', { fixture: 'all-users.json' }).as('getUsers')

      cy.visit('/')
      cy.wait(['@getProjects', '@getBugs', '@getUsers'])

      cy.get('[data-cy="active-projects-count"]').should('contain', '3')

      // Simulate data change
      cy.intercept('GET', '**/api/projects', { fixture: 'updated-projects.json' }).as('getUpdatedProjects')
      cy.reload()
      cy.wait('@getUpdatedProjects')

      cy.get('[data-cy="active-projects-count"]').should('contain', '4')
    })

    it('should handle Redux state updates', () => {
      cy.intercept('GET', '**/api/projects', { fixture: 'user-projects.json' }).as('getProjects')
      cy.intercept('GET', '**/api/bugs/assignee/1', { fixture: 'assigned-bugs.json' }).as('getBugs')
      cy.intercept('GET', '**/api/users', { fixture: 'all-users.json' }).as('getUsers')

      cy.visit('/')
      cy.wait(['@getProjects', '@getBugs', '@getUsers'])

      // Check that Redux state is properly set
      cy.window().its('store').invoke('getState').its('projects').its('projects').should('have.length', 3)
      cy.window().its('store').invoke('getState').its('bugs').its('bugs').should('have.length', 5)
    })
  })
})