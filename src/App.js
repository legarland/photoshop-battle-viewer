import React, { Component } from 'react';
import * as queryString from 'query-string';
import {
	BrowserRouter as Router,
	Route,
	HashRouter,
	Link
} from 'react-router-dom';
import logo from './Assets/logo.svg';
import 'whatwg-fetch';
import './App.css';
import Battle from './Battle/Battle';
import BattleList from './BattleList/BattleList';
import Home from "./Home/Home";

class App extends Component {

	constructor (props) {

		super(props);

		const config = {
			apiKey: "AIzaSyDt8YXlYKxQa0XYVk2VImCA08uOAP_YkU4",
			authDomain: "photoshop-battle-viewer.firebaseapp.com",
			databaseURL: "https://photoshop-battle-viewer.firebaseio.com",
			projectId: "photoshop-battle-viewer",
			storageBucket: "",
			messagingSenderId: "61973137829"
		};
		window.firebase.initializeApp(config);
	}


  render() {

	    return (
	    	<HashRouter>
	        <div className="App">
						<BattleList />
		        <div className="battle-container">
	            <Route path={"/:id"} component={Battle} />
			        <Route path={"/"} exact component={Home} />
		        </div>
	        </div>
		    </HashRouter>
	    );
  }

  componentDidUpdate() {

  }

  componentDidMount() {

  }
}

export default App;
