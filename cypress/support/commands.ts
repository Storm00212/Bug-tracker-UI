// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.contains('AUTHENTICATE').click()
    cy.contains('Welcome back').should('be.visible')
  })
})

// Custom command to create a project
Cypress.Commands.add('createProject', (name: string, description: string) => {
  cy.contains('+ NEW_PROJECT').click()
  cy.get('input[placeholder*="Q4_Marketing_Campaign"]').type(name)
  cy.get('textarea[placeholder*="Brief summary"]').type(description)
  cy.contains('CREATE_PROJECT').click()
  cy.contains('INIT_PROJECT').should('not.exist')
})

// Custom command to create an issue
Cypress.Commands.add('createIssue', (title: string, description: string, priority: string = 'Medium') => {
  cy.contains('+ Issue').click()
  cy.get('input[placeholder*="Brief summary"]').type(title)
  cy.get('textarea[placeholder*="Steps to reproduce"]').type(description)
  cy.get('select[name="Priority"]').select(priority)
  cy.contains('CREATE_ISSUE').click()
  cy.contains('NEW_ISSUE').should('not.exist')
})

// Custom command to select a project
Cypress.Commands.add('selectProject', (projectName: string) => {
  cy.get('select').select(projectName)
})

// Custom command to check dashboard metrics
Cypress.Commands.add('checkDashboardMetrics', (expectedProjects: number, expectedIssues: number) => {
  cy.get('[data-cy="active-projects-count"]').should('contain', expectedProjects.toString())
  cy.get('[data-cy="assigned-issues-count"]').should('contain', expectedIssues.toString())
})

// Custom command to setup Redux store state for testing
Cypress.Commands.add('setupStoreState', (state: any) => {
  cy.window().then((win) => {
    // Mock the Redux store state
    (win as any).store = {
      getState: () => state,
      dispatch: cy.stub(),
      subscribe: cy.stub()
    }
  })
})

// Custom command to check tooltip content
Cypress.Commands.add('checkIssuesTooltip', (expectedIssues: number) => {
  cy.get('[data-cy="assigned-issues-hover-area"]').trigger('mouseover')
  cy.get('[data-cy="issues-tooltip"]').should('be.visible')
  cy.get('[data-cy="issues-tooltip"]').find('[data-cy="tooltip-issue"]').should('have.length.at.most', 10)

  if (expectedIssues > 10) {
    cy.contains('And 5 more issues...').should('be.visible')
  }
})

// Custom command to filter issues
Cypress.Commands.add('filterIssues', (filter: 'all' | 'open' | 'closed') => {
  cy.get(`[data-cy="filter-${filter}"]`).click()
  cy.get(`[data-cy="filter-${filter}"]`).should('have.class', filter === 'all' ? 'bg-primary' : filter === 'open' ? 'bg-green-500' : 'bg-gray-500')
})

// Custom command to wait for API calls
Cypress.Commands.add('waitForAPICalls', () => {
  cy.wait(['@getProjects', '@getBugs', '@getUsers'], { timeout: 10000 })
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      createProject(name: string, description: string): Chainable<void>
      createIssue(title: string, description: string, priority?: string): Chainable<void>
      selectProject(projectName: string): Chainable<void>
      checkDashboardMetrics(expectedProjects: number, expectedIssues: number): Chainable<void>
      checkIssuesTooltip(expectedIssues: number): Chainable<void>
      filterIssues(filter: 'all' | 'open' | 'closed'): Chainable<void>
      waitForAPICalls(): Chainable<void>
      setupStoreState(state: any): Chainable<void>
    }
  }
}

export {}