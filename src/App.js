import React, { Component } from 'react';
import * as queryString from 'query-string';
import {
	BrowserRouter as Router,
	Route,
	HashRouter,
	Link
} from 'react-router-dom';
import logo from './logo.svg';
import 'whatwg-fetch';
import './App.css';
import Battle from './Battle';
import BattleList from './BattleList';
import Home from "./Home";

class App extends Component {

	constructor (props) {

		super(props);
		this.state = {
			posts: [],
			battleId: "",
			items: []
		};

		var config = {
			apiKey: "AIzaSyDt8YXlYKxQa0XYVk2VImCA08uOAP_YkU4",
			authDomain: "photoshop-battle-viewer.firebaseapp.com",
			databaseURL: "https://photoshop-battle-viewer.firebaseio.com",
			projectId: "photoshop-battle-viewer",
			storageBucket: "",
			messagingSenderId: "61973137829"
		};
		window.firebase.initializeApp(config);

		this.clicker = this.clicker.bind(this);

		fetch('https://www.reddit.com/r/photoshopbattles.json')
		.then(response => response.json())
		.then(json => {
			let arr = json.data.children.filter(item => !item.data.stickied);
			console.log(arr);
			this.setState({
				items: arr
			})
		});
	}

	clicker(id) {

		this.setState(
			{
				battleEntries: []
			}
		);


	}

  render() {

	    return (
	    	<HashRouter>
	        <div className="App">
						<BattleList items={this.state.items} clicked={this.clicker}/>
		        <div className="battle-container">
	            <Route path={"/:id"} component={Battle} />
			        <Route path={"/"} exact component={Home}></Route>
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
