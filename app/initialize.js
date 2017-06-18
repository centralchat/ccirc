import ReactDOM from 'react-dom';
import React from 'react';


import Me from 'irc/me';
import Conn from 'irc/connection';

import { Router, Route, hashHistory } from 'react-router'

import App from 'pages/app';
import Chat from 'pages/chat';
import Login from 'pages/login';


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" exact component={Login}/>
      <Route path="/chat/:target"  component={Chat} />
  </Router>), document.querySelector('#app'));
});

