import React, { Component } from 'react';
import HoverImage from './HoverImage';
import 'whatwg-fetch';
import './BattleSubmission.css';

class BattleSubmission extends Component {

	constructor (props) {
		super(props);
		this.state = {
			title: "",
			url: "",
			status: "loading"
		}
	}

	render () {

		let url = this.state.url;
		if (this.state.url && (this.state.url.indexOf(".gifv") !== -1 || this.state.url.indexOf(".webm") !== -1)) {
			url = this.state.url.replace(".gifv", ".gif").replace(".webm", ".gif");
		}

		let media = (<HoverImage
			url={url}
			loaded={this.imgLoaded.bind(this)}
			failed={this.imgFailed.bind(this)}
			status={this.state.status} />);

		let failedToLoad = (
			<a href={this.state.url} target="_blank" className="failed">
				Unable to load image<br/>
				Click to View Source
			</a>
		)

		let loading = (
			<div className="img-loading">
				<div className="loading loading--double"/>
			</div>
		)

		let gilded = (
			<span className="gilded-icon" title="a redditor has gifted reddit gold to Ghost_Animator for this submission."
			      data-count="1"/>);

		return (
			<div className={'battle-submission'}>
				<div className="content">
					<div className="submission-info">
						<div>/u/{this.props.comment.author}</div>
						<div>
							{this.props.comment.score} pts
							{this.props.comment.gilded > 0 ? gilded : ""}
						</div>
					</div>
					<div className="submission-image">
						{media}
						{this.state.status === "failed" ? failedToLoad : ""}
						{this.state.status === "loading" ? loading : ""}
					</div>
					<div className="submission-title"
					     dangerouslySetInnerHTML={{__html: this.decodeHtml(this.props.comment.body_html)}} />
					<div className="submission-permalink">
						<a href={'https://www.reddit.com' + this.props.comment.permalink}>View Comments</a>
					</div>
				</div>
			</div>
		)
	}

	imgLoaded() {

		this.setState({
			status: "loaded"
		});

		if (this.props.loaded)
			this.props.loaded();
	}

	imgFailed() {
		this.setState({
			status: "failed"
		})
	}

	decodeHtml (html) {
		let txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}

	componentDidMount () {

		if (this.props.comment.body) {
			this.getTitle(this.props.comment.body);
			this.getUrl(this.props.comment.body);
		}
	}

	getTitle (body) {

		let title = "";

		if (body.indexOf('[') === -1)
			title = body;
		else
			title = body.substr(1, body.indexOf('](') - 1)

		this.setState({
			title: title
		})
	}

	getUrl (body) {

		if (body.indexOf('http') !== -1) {

			let re = new RegExp("(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?");
			//let re = new RegExp("(?i)\\b((?:[a-z][\\w-]+:(?:\\/{1,3}|[a-z0-9%])|www\\d{0,3}[.]|[a-z0-9.\\-]+[.][a-z]{2,4}\\/)(?:[^\\s()<>]+|\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\))+(?:\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)|[^\\s`!()\\[\\]{};:'\".,<>?«»“”‘’]))");
			//let re = new RegExp("/(?:(?:https?|ftp|file):\\/\\/|www\\.|ftp\\.)(?:\\([-A-Z0-9+&@#\\/%=~_|$?!:,.]*\\)|[-A-Z0-9+&@#\\/%=~_|$?!:,.])*(?:\\([-A-Z0-9+&@#\\/%=~_|$?!:,.]*\\)|[A-Z0-9+&@#\\/%=~_|$])/igm")
			let urls = re.exec(body)
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
							url: json.data.images[0].link,
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

							//console.log(_json);


							this.setState({
								url: _json.data.link,
								satus: "loading"
							})

						})
					}
				}).catch(err => {

				})
			}
			else {
				this.setState({
					url: url
				})
			}

		}
	}
}

export default BattleSubmission;
