import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter  as Router} from 'react-router-dom'
import { Routes } from '../router/router'
// import App from '../components/index/index'
import './index.scss'

const basename = 'websocket'

const App = (
  <Router>
    <Routes />
  </Router>
)

ReactDOM.render (
  App,
  document.getElementById("app")
)