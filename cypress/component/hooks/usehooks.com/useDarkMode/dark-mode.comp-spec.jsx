import { mount } from '@cypress/react'
import React from 'react'
import useDarkMode from './use-dark-mode'
import Toggle from './Toggle'
import Content from './Content'
import './styles.css'

import { recurse } from 'cypress-recurse'

function App() {
  const [darkMode, setDarkMode] = useDarkMode()

  return (
    <div>
      <div className="navbar">
        <Toggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <Content />
    </div>
  )
}

describe('Dark Mode', () => {
  it('should toggle dark mode', () => {
    mount(<App />)
    cy.get('.toggle-control').should('be.visible')

    cy.get('.toggle-control').click()
    recurse(
      () => cy.get('#dmcheck').should(Cypress._.noop),
      (toggle) => toggle[0].checked === false
    )
    cy.get('#dmcheck').should('not.be.checked')

    cy.get('.toggle-control').click()
    cy.get('#dmcheck', { timeout: 10000 }).should('be.checked')
  })

  it('should load the theme from the local storage', () => {
    cy.wrap(localStorage).invoke('setItem', 'dark-mode-enabled', false)
    mount(<App />)
    cy.get('#dmcheck').should('not.be.checked')

    cy.wrap(localStorage).invoke('setItem', 'dark-mode-enabled', true)
    mount(<App />)
    cy.get('#dmcheck').should('be.checked')

    cy.wrap(localStorage)
      .invoke('getItem', 'dark-mode-enabled')
      .should('equal', 'true')
  })
})

// also take a look at Gleb's example
// https://github.com/bahmutov/react-dark-mode/blob/master/src/DarkMode.spec.ct.tsx
