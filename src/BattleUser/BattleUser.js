import React, {Component} from 'react';
import './BattleUser.css';

class BattleUser extends Component {

	constructor (props) {
		super (props);
	}

	render() {

		let class2 = this.props.active ? "battle-user-active" : "";

		return (
			<div className={`battle-user ${class2}`} onClick={() => this.props.clicked(this.props.name)}>
				<div className="place">#{this.props.place}</div>
				<div className="stats">{this.props.wins + " / " + this.props.points }</div>
				<div className="username">{this.props.name}</div>
			</div>
		)
	}
}

export default BattleUser;
