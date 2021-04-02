import React, { Component } from 'react';
import Button from "~/components/atoms/Button";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
	width: 290px;	
	margin: 0 auto;
	button{
		min-width: 60px;
    background: #ddd;    
    border: 1px solid #848383;
    span{
    	color: black !important;
    	font-size: 24px !important;
    }
	}

	.time-up, .time-down{
		display: flex;
		button{
			padding: 4px 16px !important;
			background: #eee !important;
		}
	}

	.time-up{
		margin-bottom: 3px;
	}

	.time-down{
		margin-top: 3px;
	}

	.left-area{
		width: 130px;
    float: left;
    button:last-child{
    	margin-left: 3px;
    }
	}	

	.mid-area{
		width: 30px;
		font-size: 48px;		
	}

	.right-area{
		width: 130px;
		button:last-child{
    	margin-left: 3px;
    }
	}

	.time-number{
		display: flex;
		button{
			width: 60px;
			height: 94px;
			background: white !important;
			span{
				font-size: 48px !important;
			}
		}
	}
`;

class UpDownTimeset extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selected_time: "00:00",			
			hour_first: "",
			hour_second: "",
			min_first: "",
			min_second: "",
		}
	}

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ 
			// selected_time: nextProps.selected,			
			// hour_first: parseInt(nextProps.selected.substring(0, 1)),
			// hour_second: parseInt(nextProps.selected.substring(1, 2)),
			// min_first: parseInt(nextProps.selected.substring(3, 4)),
			// min_second: parseInt(nextProps.selected.substring(4, 5)),
			hour_first: nextProps.hour_one,
			hour_second: nextProps.hour_two,
			min_first: nextProps.min_one,
			min_second: nextProps.min_two
    });
  }

	componentDidMount() {
	}

	countUp = (type) => {
		if (type == "h_first") {
			let val = this.state.hour_first;

			// exception 
			if (val == 1 && this.state.hour_second > 3) {
				return;
			}

			val = val == 2 ? 0 : val + 1;
			
			// this.setState({
			// 	hour_first: val
			// });
			this.props.updateTime("hour_first", val);

		} else if(type == "h_second") {
			
			let val_first = this.state.hour_first;
			let val_second = this.state.hour_second;
			
			if (val_first == 0 || val_first == 1) {
				val_second = val_second == 9 ? 0 : val_second + 1;
			}
			
			if (val_first == 2) {
				val_second = val_second > 2 ? 0 : val_second + 1;
			}			
			
			// this.setState({
			// 	hour_second: val_second
			// });

			this.props.updateTime("hour_second", val_second);
		} else if(type == "m_first") {
			let val_first = this.state.min_first;
			val_first = val_first == 5 ? 0 : val_first + 1;

			// this.setState({
			// 	min_first: val_first
			// });

			this.props.updateTime("min_first", val_first);

		} else if(type == "m_second") {
			let val_min_first = this.state.min_first;
			let val_min_second = this.state.min_second;			
			let val_hour_first = this.state.hour_first;
			let val_hour_second = this.state.hour_second;
			
			if (val_min_second == 9) {
				val_min_first = val_min_first == 5 ? 0 : val_min_first + 1;
				val_min_second = val_min_second == 9 ? 0 : val_min_second + 1;

				if (val_min_first == 0) {
					if (val_hour_first == 2) {
						val_hour_second = val_hour_second == 3 ? 0 : val_hour_second + 1;
						if (val_hour_second == 0) {
							val_hour_first = 0;
						}
					} else {
						val_hour_second = val_hour_second == 9 ? 0 : val_hour_second + 1;
						if (val_hour_second == 0) {
							val_hour_first = val_hour_first + 1;
						}
					}
				}
			} else {
				val_min_second = val_min_second + 1;
			}

			// this.setState({
			// 	hour_first: val_hour_first,
			// 	hour_second: val_hour_second,
			// 	min_first: val_min_first,
			// 	min_second: val_min_second
			// });
			let post = {
				hour_first: val_hour_first,
				hour_second: val_hour_second,
				min_first: val_min_first,
				min_second: val_min_second
			};

			this.props.updateTime("hour_min", post);
		}
	}

	countDown = (type) => {
		if (type == "h_first") {
			let val = this.state.hour_first;

			// exception 
			if (val == 0 && this.state.hour_second > 3) {
				return;
			}

			val = val == 0 ? 2 : val - 1;
			
			// this.setState({
			// 	hour_first: val
			// });

			this.props.updateTime("hour_first", val);

		} else if(type == "h_second") {
			
			let val_first = this.state.hour_first;
			let val_second = this.state.hour_second;
			
			if (val_first == 0 || val_first == 1) {
				val_second = val_second == 0 ? 9 : val_second - 1;
			}
			
			if (val_first == 2) {
				val_second = val_second ==0 ? 3 : val_second - 1;
			}			
			
			// this.setState({
			// 	hour_second: val_second
			// });

			this.props.updateTime("hour_second", val_second);
		} else if(type == "m_first") {
			let val_first = this.state.min_first;
			val_first = val_first == 0 ? 5 : val_first - 1;

			// this.setState({
			// 	min_first: val_first
			// });

			this.props.updateTime("min_first", val_first);
		} else if(type == "m_second") {
			let val_min_first = this.state.min_first;
			let val_min_second = this.state.min_second;			
			let val_hour_first = this.state.hour_first;
			let val_hour_second = this.state.hour_second;
			
			if (val_min_second == 0) {
				val_min_first = val_min_first == 0 ? 5 : val_min_first - 1;
				val_min_second = val_min_second == 0 ? 9 : val_min_second - 1;

				if (val_min_first == 5) {
					if (val_hour_first == 0) {
						val_hour_second = val_hour_second == 0 ? 3 : val_hour_second - 1;
						if (val_hour_second == 3) {
							val_hour_first = 2;
						}
					} else {
						val_hour_second = val_hour_second == 0 ? 9 : val_hour_second - 1;
						if (val_hour_second == 9) {
							val_hour_first = val_hour_first - 1;
						}
					}
				}
			} else {
				val_min_second = val_min_second - 1;
			}

			// this.setState({
			// 	hour_first: val_hour_first,
			// 	hour_second: val_hour_second,
			// 	min_first: val_min_first,
			// 	min_second: val_min_second
			// });
			let post = {
				hour_first: val_hour_first,
				hour_second: val_hour_second,
				min_first: val_min_first,
				min_second: val_min_second
			};

			this.props.updateTime("hour_min", post);
		}
	}

	render() {
		return (
		<Wrapper>
			<div className="time-up">
				<div className="left-area">
					<Button onClick={()=>this.countUp("h_first")}>▲</Button>
					<Button onClick={()=>this.countUp("h_second")}>▲</Button>
				</div>
				<div className="mid-area">
					
				</div>
				<div className="right-area">
					<Button onClick={()=>this.countUp("m_first")}>▲</Button>
					<Button onClick={()=>this.countUp("m_second")}>▲</Button>
				</div>
			</div>
			<div className="time-number">
				<div className="left-area">
					<Button>{this.state.hour_first}</Button>
					<Button>{this.state.hour_second}</Button>
				</div>
				<div className="mid-area">
					:
				</div>
				<div className="right-area">
					<Button>{this.state.min_first}</Button>
					<Button>{this.state.min_second}</Button>
				</div>
			</div>
			<div className="time-down">
				<div className="left-area">
					<Button onClick={()=>this.countDown("h_first")}>▼</Button>
					<Button onClick={()=>this.countDown("h_second")}>▼</Button>
				</div>
				<div className="mid-area">
					
				</div>
				<div className="right-area">
					<Button onClick={()=>this.countDown("m_first")}>▼</Button>
					<Button onClick={()=>this.countDown("m_second")}>▼</Button>
				</div>
			</div>
		</Wrapper>
		);
	}
}

UpDownTimeset.propTypes = {
  selected: PropTypes.string,
  hour_one: PropTypes.number,
  hour_two: PropTypes.number,
  min_one: PropTypes.number,
  min_two: PropTypes.number,
  updateTime: PropTypes.func,
};

export default UpDownTimeset;                           