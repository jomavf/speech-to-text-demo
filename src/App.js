import React, { Component } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Switch, Redirect, Route } from 'react-router'

import HomePage from './Containers/Home'
import SearchPage from './Containers/Search'
import RecordPage from './Containers/Record'
import NavBar from './Components/NavBar';

class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <NavBar/>
        <main>
          <Switch>
            <Redirect from="/" to="/search" exact/>
            <Route path="/home" component={HomePage}/>
            <Route path="/search" component={SearchPage}/>
            <Route path="/record" component={RecordPage}/>
          </Switch>
        </main>
      </BrowserRouter>  
    );
  }
}

export default App;
