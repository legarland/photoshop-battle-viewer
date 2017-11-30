import React, { Component } from 'react';
import BattleSubmission from "./BattleSubmission";
import './Battle.css';
import 'whatwg-fetch';
import gold from './gold.png';
import silver from './silver.png';
import bronze from './bronze.png';
import * as imagesLoaded from 'imagesloaded';

class Battle extends Component {

	constructor (props) {
		super(props)
		this.state = {
			battleEntries: [],
			battleItem: {}
		}
	}

	render() {

		const battleEntries = this.state.battleEntries.map(entry =>
			<BattleSubmission comment={entry.data} loaded={this.resizeAllGridItems.bind(this)} />
		);


		if (this.state.battleEntries.length) {
			return (
				<div>
					<div className="battle-item">
						<div className="battle-title">{this.state.battleItem.title}</div>
						<div className="battle-image"><img src={this.state.battleItem.url} alt=""/></div>
					</div>
					<h1>~ Winners ~</h1>
					<div className="battle-winners">
						<div className="battle-second">
							{/*<div className="battle-place">2nd</div>*/}
							<BattleSubmission comment={this.state.battleEntries[1].data}/>
							<div className="podium">
								<img src={silver} alt=""/>
							</div>
						</div>
						<div className="battle-first">
							{/*<div className="battle-place">1st</div>*/}
							<BattleSubmission comment={this.state.battleEntries[0].data}/>
							<div className="podium">
								<img src={gold} alt=""/>
							</div>
						</div>
						<div className="battle-third">
							{/*<div className="battle-place">3rd</div>*/}
							<BattleSubmission comment={this.state.battleEntries[2].data}/>
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
			return (<div/>);
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
		let grid = document.getElementsByClassName("item-grid")[0];
		let allItems = grid.getElementsByClassName("battle-submission");
		for (let x = 0; x < allItems.length; x++) {
			this.resizeGridItem(allItems[x]);
		}
	}

	componentDidMount() {

		let url = 'https://www.reddit.com/r/photoshopbattles/comments/' + this.props.id + '.json?sort=top';
		console.log(url);
		fetch(url)
		.then(response => response.json() )
		.then (json => {
			this.setState({
				battleItem: json[0].data.children[0].data,
				battleEntries: json[1].data.children.filter(item => item.kind === "t1" && item.data.author !== "[deleted]")
			});

			this.resizeAllGridItems();

			// let imgLoad = imagesLoaded(".battle-submission", instance => {
			// 	console.log("images Loaded: ", instance);
			// })

			// let allItems = document.getElementsByClassName("battle-submission");
			// for(let x=0;x<allItems.length;x++){
			//
			// 	let imgLoad = imagesLoaded( allItems[x], instance => {
			// 		//console.log("image loaded");
			// 		let item = instance.elements[0];
			// 		//console.log(instance.images[0]);
			// 		instance.images[0].img.classList.add('loaded');
			//
			// 		setTimeout(() => this.resizeGridItem(item), 1000);
			// 	});
			//
			// 	imgLoad.on('done', instance => {
			// 		console.log("always complete: ", instance.images[0]);
			// 	})
			//
			// }

		})

		window.addEventListener("resize", () => {
			console.log("resizing");
			this.resizeAllGridItems()
		});
	}
}

export default Battle;
