/**
 * @Author: Ali
 * @Date:   2019-10-25T11:08:21+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-25T11:26:54+02:00
 */

import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home'
import About from './components/pages/About'
import './App.css';

const App = () => {
  return (
  <Router>
    <>
      <Navbar />  
      <div className="container">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
        </Switch>
      </div>
    </>
  </Router>
  )
}

export default App;
