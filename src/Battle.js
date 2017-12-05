import React, { Component } from 'react';
import BattleSubmission from "./BattleSubmission";
import ReactLoading from 'react-loading';
import './Battle.css';
import 'whatwg-fetch';
import gold from './gold.png';
import silver from './silver.png';
import bronze from './bronze.png';
import * as imagesLoaded from 'imagesloaded';

class Battle extends Component {

	constructor (props) {
		super(props);

		this.resizeAllGridItems = this.resizeAllGridItems.bind(this);

		this.state = {
			battleEntries: [],
			battleItem: {}
		}
	}

	render() {

		const battleEntries = this.state.battleEntries.map(entry =>
			<BattleSubmission comment={entry.data} loaded={this.resizeAllGridItems} />
		);


		if (this.state.battleEntries && this.state.battleEntries.length) {
			return (
				<div className="battle">
					<div className="battle-item">
						<div className="battle-title">{this.state.battleItem.title}</div>
						<div className="battle-image"><img src={this.state.battleItem.url} alt=""/></div>
					</div>
					<h1>~ Winners ~</h1>
					<div className="battle-winners">
						<div className="battle-second">
							{/*<div className="battle-place">2nd</div>*/}
							{ this.state.battleEntries[1] ? (<BattleSubmission comment={this.state.battleEntries[1].data}/>) : (<div/>)}
							<div className="podium">
								<img src={silver} alt=""/>
							</div>
						</div>
						<div className="battle-first">
							{/*<div className="battle-place">1st</div>*/}
							{ this.state.battleEntries[0] ? (<BattleSubmission comment={this.state.battleEntries[0].data}/>) : (<div/>)}
							<div className="podium">
								<img src={gold} alt=""/>
							</div>
						</div>
						<div className="battle-third">
							{/*<div className="battle-place">3rd</div>*/}
							{ this.state.battleEntries[2] ? (<BattleSubmission comment={this.state.battleEntries[2].data}/>) : (<div/>)}
							<div className="podium">
								<img src={bronze} alt=""/>
							</div>
						</div>
					</div>
					<h1>~ All Submissions ~</h1>
					<div className={'item-grid'}>{battleEntries.length && battleEntries}</div>
				</div>
			);
		}
		else {
			return (<div className="full-screen-loading"><ReactLoading type="bars" color="#333333" /></div>);
		}
	}

	resizeInstance(instance) {

	}

	resizeGridItem (item) {
		let grid = document.getElementsByClassName("item-grid")[0];
		let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
		let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
		let rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
		item.style.gridRowEnd = "span " + rowSpan;
	}

	resizeAllGridItems () {

		console.log("resizing");

		let grid = document.getElementsByClassName("item-grid")[0];
		let allItems = grid.getElementsByClassName("battle-submission");
		for (let x = 0; x < allItems.length; x++) {
			setTimeout(()=>{this.resizeGridItem(allItems[x]);}, 1000);
		}
	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.match.params.id !== this.props.match.params.id) {
			this.setState({
				battleEntries: [],
				battleItem: {}
			});
		}

		if (this.state.battleEntries.length == [] || nextProps.match.params.id !== this.props.match.params.id) {

			let url = 'https://www.reddit.com/r/photoshopbattles/comments/' + nextProps.match.params.id + '.json?sort=top';
			console.log(url);
			fetch(url)
			.then(response => response.json())
			.then(json => {

				console.log("data received");

				this.setState({
					battleItem: json[0].data.children[0].data,
					battleEntries: json[1].data.children.filter(item => item.kind === "t1" && item.data.author !== "[deleted]")
				}, () => {

				});
			});
		}

		window.addEventListener("resize", () => {
			console.log("resizing");
			this.resizeAllGridItems()
		});
	}

	componentWillUnmount() {
		console.log("unmounting");
	}
}

export default Battle;
