import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import * as async from 'async';
import './Home.css';
import BattleUser from "../BattleUser/BattleUser";
import BattleUserPosts from "../BattleUserPosts/BattleUserPosts";

class Home extends Component {

	users = {};

	constructor (props) {
		super(props);

		this.state = {
			users: {},
			loading: true,
			selectedUserWins: [],
			selectedUserName: ""
		}

		this.loadUserSubmissions = this.loadUserSubmissions.bind(this);
	}

	render () {

		console.log("Rendering");

		let users = Object.keys(this.state.users).map(key => {
			let u = this.state.users[key];
			return new User(key, u.score, u.wins)
		})

		users.sort((a, b) => b.wins - a.wins || b.score - a.score);

		let userDisplay = users.slice(0, 10).map((u, i) => (
				<BattleUser key={u.name} clicked={this.loadUserSubmissions} active={this.state.selectedUserName === u.name}
				            place={i + 1} points={u.points} name={u.name} wins={u.wins}/>
			)
		);

		return (
			<div className="home-page">
				<h1>Photoshop Battle Viewer</h1>
				<h3>Select a battle image on the left</h3>
				<div className="top-users">
					<div className="battle-users-list">
						<div className="battle-user">
							<div className="place">place</div>
							<div className="stats">wins/total points</div>
							<div className="username">user</div>
						</div>
						{this.state.loading ? <ReactLoading type="bars" color="#333333"/> : userDisplay}
					</div>
					{this.state.selectedUserWins.length > [] ? <BattleUserPosts wins={this.state.selectedUserWins}/> : null}
				</div>
			</div>
		)
	}

	loadUserSubmissions (name) {

		window.firebase.database().ref('users').child(name).child('wins').once('value', snap => {
			let wins = [];
			snap.forEach(childSnap => {
				window.firebase.database().ref('battles').child(childSnap.key).once('value', battleSnap => {
					let win = {
						battleId: childSnap.key,
						battleSubmissionId: battleSnap.val().battleSubmissionId,
						battleSubmissionBody: battleSnap.val().battleSubmissionBody,
						points: battleSnap.val().points,
						battleDate: battleSnap.val().battleDate
					}
					wins.push(win);
					this.setState({
						selectedUserWins: wins,
						selectedUserName: name
					})
				});
			})
		});
	}

	componentDidMount () {
		this.loadPosts(null, 0);
	}

	loadPosts (lastPostId, count) {

		// window.firebase.database().ref('battles').orderByChild('points').limitToLast(20).once('value', snaps => {
		// 	snaps.forEach(snap => {
		// 		console.log("top votes battle: ", snap.val());
		// 	})
		// })

		window.firebase.database().ref('users').orderByChild('winCount').limitToLast(10).once('value', snap => {
			snap.forEach(childSnap => {
				console.log(childSnap.key + ": " + childSnap.val().score + " score - " + childSnap.val().winCount + " wins");

				this.users[childSnap.key] = {
					score: childSnap.val().score,
					wins: Object.keys(childSnap.val().wins).length
				};
			})

			this.setState({
				users: this.users,
				loading: false
			})
		})

		// window.firebase.database().ref("users").once('value', snap => {
		// 	snap.forEach(childSnap => {
		// 		window.firebase.database().ref("users").child(childSnap.key).child('winCount').set(Object.keys(childSnap.val().wins).length)
		// 	})
		// })
	}
}

class User {
	name;
	points;
	wins;

	constructor (_name, _points, _wins) {
		this.name = _name;
		this.points = _points;
		this.wins = _wins;
	}
}

export default Home;