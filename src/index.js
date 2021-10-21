import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Prompt } from 'react-router-dom'

const useBeforeUnload = ({ when, message }) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = message
      return message
    }

    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [when, message])
}

const Home = () => <h1>Home</h1>

const Input = ({ initialValue }) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (e) => setValue(e.target.value)
  useBeforeUnload({
    when: value !== initialValue,
    message: 'Are you sure you want to leave?',
  })

  return (
    <>
      <input type="text" value={value} onChange={handleChange} />
      <Prompt
        when={value !== initialValue}
        message="Are you sure you want to leave?"
      />
    </>
  )
}

const App = () => {
  return (
    <Router
      getUserConfirmation={(message, callback) => {
        console.log('open modal here!')
        const allowTransition = window.confirm(message)
        window.setTimeout(() => {
          callback(allowTransition)
        }, 1000)
      }}
    >
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/input">Input</Link>
        </li>
      </ul>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/input"
        render={() => <Input initialValue="horst" />}
      />
    </Router>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
