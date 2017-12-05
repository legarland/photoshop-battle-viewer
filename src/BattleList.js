import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './BattleList.css';
import 'whatwg-fetch';
import BattleSubmissionInfo from "./BattleSubmissionInfo";

class BattleList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			items: [],
			first: false
		}
	}

	render() {

		let click = this.props.clicked;
		let listItems = this.state.items.map(item => (
			<Link to={"/" +item.data.id} className="battle-list-item">
					<img src={item.data.url} alt=""/>
					<BattleSubmissionInfo id={item.data.id}/>
			</Link>
		));

		if (this.state.first) {
			this.setState({first: false});
			return <Redirect to={"/" + this.state.items[0].data.id}/>
		}

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
				items: arr,
				first: true
			}, ()=> {
			})
		});
	}
}

export default BattleList;