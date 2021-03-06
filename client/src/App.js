/**
 * @Author: Ali
 * @Date:   2019-10-25T11:08:21+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-31T11:33:19+01:00
 */

import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home'
import About from './components/pages/About'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import PrivateRoute from './components/routing/PrivateRoute'

import ContactState from './context/contact/ContactState'
import AuthState from './context/auth/AuthState'
import AlertState from './context/alert/AlertState'

import setAuthToken from './utils/setAuthToken'
import './App.css';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () => {
  return (
    <AuthState>
    <ContactState>
    <AlertState>
    <Router>
        <Navbar />
        <div className="container">
        <Alert />
          <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <Route exact path='/about' component={About} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </div>
    </Router>
    </AlertState>
  </ContactState>
  </AuthState>
  )
}

export default App;
