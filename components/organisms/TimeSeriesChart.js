import React, { Component } from 'react';
import CanvasJSReact from '../molecules/canvasjs.react';
import PropTypes from "prop-types";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class TimeSeriesChart extends Component {

	constructor(props) {
		super(props);
		// this.state = {
		// 	data: [],
		// 	codeLabel: ""			
		// };
	}

	componentDidMount() {
		// let tmp;
		// this.props.showData.map((item)=>{
		// 	tmp = item;
		// });
		// this.setState({
		// 	codeLabel: tmp.label
		// });
		// let tmpData = [];
		// tmp.values.map((item)=>{
		// 	tmpData.push({label: item.x.substr(0, 4)+" "+item.x.substr(5, 2) + "-"+item.x.substr(5, 2), y: parseFloat(item.y)});
		// });
		// this.setState({
		// 	data: tmpData
		// });
	}

	render() {
		let contentData = [];
		this.props.showData.map((item)=>{
			let gData = [];
			item.values.map((val)=>{
				if(val.y !== "") {
					let newVal={};
					newVal.y = parseFloat(val.y);
					newVal.label =val.x.substr(0, 4)+" "+val.x.substr(5, 2) + "-" + val.x.substr(8, 2);
					// delete val["x"];
					gData.push(newVal);
				}
			});
			let iData = {
				type: "line",
				toolTipContent: "「" + item.label.replace(" ", "") + "」 {label}: {y}",
				yValueType: "number",
				dataPoints: gData
			}
			contentData.push(iData);

		});
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			width: 1000,	
			height: 550,		
			title:{
				text: ""
			},
			axisY: {
				title: "",
				includeZero: false,
				suffix: ""
			},
			axisX: {
				title: "日付",
				prefix: "",
				labelMaxWidth: 60,
				labelWrap: true,
				valueFormatString: "YYYYMMDD",
				labelFontSize: 15,
			},
			data: contentData,
		}
		return (
		<div>
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}		
				pxHeight={true}	
				height={550}	
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

TimeSeriesChart.propTypes = {
  showData: PropTypes.array,
};

export default TimeSeriesChart;                           