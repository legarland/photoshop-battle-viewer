import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BattleList.css';
import 'whatwg-fetch';
import BattleSubmissionInfo from "./BattleSubmissionInfo";

class BattleList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			items: []
		}
	}

	render() {

		let click = this.props.clicked;
		let listItems = this.state.items.map(item => (
			<Link to={process.env.PUBLIC_URL + "/" +item.data.id} className="battle-list-item">
					<img src={item.data.url} alt=""/>
					<BattleSubmissionInfo id={item.data.id}/>
			</Link>
		));

		return (
			<div className="battle-list-container">
				<div className="battle-list-header">
					Top Posts
				</div>
				<div>{listItems}</div>
			</div>
		)
	}

	componentWillMount() {
		fetch('https://www.reddit.com/r/photoshopbattles.json')
		.then(response => response.json())
		.then(json => {
			let arr = json.data.children.filter(item => !item.data.stickied);
			this.setState({
				items: arr
			})
		});
	}
}

export default BattleList;