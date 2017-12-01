import React, { Component } from 'react';
import './HoverImage.css';

class HoverImage extends Component {

	constructor (props) {
		super(props);
	}

	render () {

		return (
			<img
				className={"battle-submission-img " + this.props.status}
				src={this.props.url}
				onLoad={this.imgLoaded.bind(this)}
				onError={this.imgFailed.bind(this)}
			  onClick={this.mouseOver.bind(this)}/>
		)
	}

	mouseOver(e) {

		console.log("handling mouse over");

		let imgContainer = document.createElement('div');
		imgContainer.className = "big-image-container";

		let img = document.createElement('img');
		img.src = this.props.url;
		img.className = "big-image";

		//img.style.left = e.clientX - img.offsetWidth / 2;
		//img.style.top = (e.clientY - img.offsetTop) + "px";

		imgContainer.onclick = ()=> {
			document.body.removeChild(imgContainer);
		};

		imgContainer.appendChild(img);

		document.body.appendChild(imgContainer);
	}

	imgLoaded() {

		if (this.props.loaded) {
			this.props.loaded();
		}
	}

	imgFailed() {

		if (this.props.failed) {
			this.props.failed();
		}
	}
}

export default HoverImage;