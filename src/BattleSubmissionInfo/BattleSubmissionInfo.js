import React, { Component } from 'react';
import * as shortener from 'short-number';
import upvote from '../Assets/upvote.png';
import psicon from '../Assets/ps-icon.png';
import './BattleSubmissionInfo.css'
import 'whatwg-fetch';

class BattleSubmissionInfo extends Component {

	constructor (props) {
		super(props);

		this.state = {
			score: 0,
			submissions: 0
		}
	}

	render () {

		return (
			<div className="battle-submission-info">
				 <span className="score">
					  <img src={upvote}/>
						<span>{this.state.score}</span>
					</span>
					<span className="submissions">
						<img src={psicon} alt=""/>
						<span>{this.state.submissions}</span>
					</span>
			</div>
		)
	}

	loadInfo(id) {
		let url = 'https://www.reddit.com/r/photoshopbattles/comments/' + id + '.json?sort=top';
		fetch(url)
		.then(response => response.json())
		.then(json => {

			console.log("data received");

			this.setState({
				score: shortener(json[0].data.children[0].data.score),
				submissions: shortener(json[1].data.children.filter(item => item.kind === "t1" && item.data.author !== "[deleted]").length)
			}, () => {

			});
		});
	}

	componentWillReceiveProps (nextProps) {
		this.loadInfo(nextProps.id);
	}

	componentWillMount() {
		this.loadInfo(this.props.id);
	}
}

export default BattleSubmissionInfo;