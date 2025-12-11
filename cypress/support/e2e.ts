// 

// Import commands.js using ES2015 syntax:
import './commands'



// redux
beforeEach(() => {
  // Clear localStorage before each test to ensure clean state
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});