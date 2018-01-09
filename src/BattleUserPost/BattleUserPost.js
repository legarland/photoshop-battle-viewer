import React, { Component } from 'react';
import HoverImage from '../HoverImage/HoverImage';
import './BattleUserPost.css';

class BattleUserPost extends Component {
	constructor (props) {
		super(props);
		this.state = {
			status: "loading",
			battleUrl: "",
			battleSubmissionUrl: "",
		}
	}

	resizeAllGridItems () {

		console.log("resizing");

		let grid = document.getElementsByClassName("battle-user-posts")[0];
		let allItems = grid.getElementsByClassName("battle-user-post");
		for (let x = 0; x < allItems.length; x++) {
			setTimeout(() => {
				this.resizeGridItem(allItems[x]);
			}, 300);
		}
	}

	resizeGridItem (item) {
		let grid = document.getElementsByClassName("battle-user-posts")[0];

		if (!grid) {
			return;
		}

		let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
		let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
		let rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
		item.style.gridRowEnd = "span " + rowSpan;
	}

	render () {

		let url = this.state.battleSubmissionUrl;
		if (this.state.battleSubmissionUrl && (this.state.battleSubmissionUrl.indexOf(".gifv") !== -1 || this.state.battleSubmissionUrl.indexOf(".webm") !== -1)) {
			url = this.state.battleSubmissionUrl.replace(".gifv", ".gif").replace(".webm", ".gif");
		}

		let media = (<HoverImage
			url={url}
			loaded={this.imgLoaded.bind(this)}
			failed={this.imgFailed.bind(this)}
			status={this.state.status}/>);

		let failedToLoad = (
			<a href={this.state.battleSubmissionUrl} target="_blank" className="failed">
				Unable to load image<br/>
				Click to View Source
			</a>
		)

		let loading = (
			<div className="img-loading">
				<div className="loading loading--double"/>
			</div>
		)

		return (
			<div className="battle-user-post">
				<div className="content">
					<div className="submission-image">
						{media}
						{this.state.status === "failed" ? failedToLoad : ""}
						{this.state.status === "loading" ? loading : ""}
					</div>
					<div className="battle-link">
						<a target="_blank" href={"https://reddit.com/r/photoshopbattles/comments/" + this.props.battleId}>View
							Battle
						</a>
					</div>
				</div>
			</div>
		)
	}

	imgLoaded () {

		this.setState({
			status: "loaded"
		});

		this.resizeAllGridItems();

		if (this.props.loaded)
			this.props.loaded();
	}

	imgFailed () {
		this.setState({
			status: "failed"
		})
	}

	componentWillMount () {
		this.getUrl(this.props.battleSubmissionBody)
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			status: "loading"
		})
		this.getUrl(nextProps.battleSubmissionBody)
	}

	getUrl (body) {

		if (body.indexOf('http') !== -1) {

			let re = new RegExp("(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?");
			let urls = re.exec(body);
			let url = (urls.length ? urls[0] : "");

			//console.log(url);

			if (url.indexOf("imgur") !== -1 &&
				(url.indexOf(".jpg") === -1
					&& url.indexOf(".png") === -1
					&& url.indexOf(".gif") === -1
					&& url.indexOf(".webm") === -1)) {
				fetch("https://api.imgur.com/3/album/" + url.substr(url.lastIndexOf('/') + 1), {
					headers: {
						Authorization: "Client-ID 5e3c366493a42a3"
					}
				}).then(response => {
					return response.json()
				}).then(json => {


					if (json.data.images) {
						this.setState({
							battleSubmissionUrl: json.data.images[0].link,
							status: "loading"
						})
					}
					else if (json.data.error) {
						// possible wrong imgur type

						console.log("error");

						this.setState({
							status: "loading"
						});

						fetch("https://api.imgur.com/3/image/" + url.substr(url.lastIndexOf('/') + 1), {
							headers: {
								Authorization: "Client-ID 5e3c366493a42a3"
							}
						}).then(_response => {
							return _response.json()
						}).then(_json => {

							this.setState({
								battleSubmissionUrl: _json.data.link,
								status: "loading"
							})

						})
					}
				}).catch(err => {

				})
			}
			else {
				this.setState({
					battleSubmissionUrl: url
				})
			}

		}
	}

}

export default BattleUserPost;