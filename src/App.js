import React, { Component } from 'react';

import logo from './logo.svg';
import getCaretCoordinates from 'textarea-caret';
import './App.css';
import AutoSugg from './autoSuggest'
import Grid from './grid'
import InputBox from './inputBox'

import { List } from 'semantic-ui-react'
class App extends Component {
  constructor(){
    super();
  }

  render() {
    return (
            <Grid/>
    );
  }
}

export default App;
