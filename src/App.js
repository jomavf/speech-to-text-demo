import React, { Component } from 'react';

import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Switch, Redirect, Route } from 'react-router'

import HomePage from './Containers/Home'
import SearchPage from './Containers/Search'
import RecordPage from './Containers/Record'
import UploadVideo from './Containers/UploadVideo'
import NavBar from './Components/NavBar';


class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <NavBar/>
          <main>
            <Switch>
                <Redirect from="/" to="/home" exact/>
                <Route path="/home" component={HomePage}/>
                <Route path="/search" component={SearchPage}/>
                <Route path="/record" component={RecordPage}/>
                <Route path="/upload" component={UploadVideo}/>
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>  
    );
  }
}

export default App;
