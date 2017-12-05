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

class App extends Component {

	constructor (props) {

		super(props);
		this.state = {
			posts: [],
			battleId: "",
			items: []
		};

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
