import React, { Component } from 'react';
import logo from './logo.svg';
import 'whatwg-fetch';
import './App.css';
import Battle from './Battle';

class App extends Component {

	constructor (props) {
		super(props);
		this.state = {
			posts: [],
			battleId: ""
		}
	}

  render() {

	  const postListItems = this.state.posts.map(post =>
      <li key={post.data.id}>
        <Battle title={post.data.title} id={post.data.id}/>
      </li>
	  );

	  const postList = (
	    <ul>{postListItems}</ul>
    );

    if (this.state && this.state.battleId) {
	    return (
        <div className="App">
          <header>

          </header>
	        <div className="battle-container">
            <Battle title="Test" id={this.state.battleId} />
	        </div>
        </div>
	    );
    }
    else return null;
  }

  componentWillMount() {

	  fetch('https://www.reddit.com/r/photoshopbattles.json?sort=top&t=today').then(response => {
		  return response.json()
	  }).then(json => {
	    console.log(json.data);
		  this.setState(
			  {
				  battleId: json.data.children[2].data.id
			  }
		  )
	  })
  }

  componentDidMount() {

  }
}

export default App;
