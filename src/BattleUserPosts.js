import React, { Component } from 'react';
import BattleUserPost from "./BattleUserPost";
import './BattleUserPosts.css';

class BattleUserPosts extends Component {
	constructor (props) {
		super (props);
	}

	render() {

		console.log("Posts Rendering");

		const posts = this.props.wins.map((win, index) => (
			<BattleUserPost key={index} battleId={win.battleId} battleSubmissionId={win.battleSubmissionId} battleSubmissionBody={win.battleSubmissionBody} />
		));


		return (
			<div className="battle-user-posts">
				{posts}
			</div>
		)
	}
}

export default BattleUserPosts;