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
			first: false,
			sort: 'month',
			sortType: 'hot'
		}

		this.sortChange = this.sortChange.bind(this);
		this.sortTypeChange = this.sortTypeChange.bind(this);
	}

	sortTypeChange(event) {
		this.setState({
			sortType: event.target.value
		}, () => {
			this.loadPosts();
		})
	}

	sortChange(event) {
		this.setState({
			sort: event.target.value
		}, () => {
			this.loadPosts();
		})
	}

	render() {

		let click = this.props.clicked;
		let listItems = this.state.items.map(item => (
			<Link to={"/" +item.data.id} className="battle-list-item">
					<img src={item.data.url} alt=""/>
					<BattleSubmissionInfo id={item.data.id}/>
			</Link>
		));

		// if (this.state.first) {
		// 	this.setState({first: false});
		// 	return <Redirect to={"/" + this.state.items[0].data.id}/>
		// }

		return (
			<div className="battle-list-container">
				<div className="battle-list-header">
					<div className="battle-list-header-title">Sort Posts</div>
					<div className="battle-sort">

						<select onChange={this.sortTypeChange} value={this.state.sortType}>
							<option value="hot">hot</option>
							<option value="top">top</option>
						</select>

						{this.state.sortType === 'top' ?
							(<select onChange={this.sortChange} value={this.state.sort}>
								<option value="hour">past hour</option>
								<option value="day"> past 24 hours</option>
								<option value="week">past week</option>
								<option value="month">past month</option>
								<option value="year">past year</option>
								<option value="all">all time</option>
							</select>)
							: null}
					</div>
				</div>
				<div className="battle-list-items">{listItems}</div>
			</div>
		)
	}

	loadPosts() {

		let url = 'https://www.reddit.com/r/photoshopbattles.json';

		if (this.state.sortType === 'top') {
			url = 'https://www.reddit.com/r/photoshopbattles/top.json?sort=top&t=' + this.state.sort;
		}

		fetch(url)
		.then(response => response.json())
		.then(json => {
			let arr = json.data.children.filter(item => !item.data.stickied);
			this.setState({
				items: arr,
				first: true
			}, ()=> {
				document.getElementsByClassName("battle-list-items")[0].scrollTop = 0;
			})
		});
	}

	componentWillMount() {
		this.loadPosts();
	}
}

export default BattleList;