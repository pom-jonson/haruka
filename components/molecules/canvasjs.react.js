var React = require('react');
var CanvasJS = require('./canvasjs.min');
import PropTypes from "prop-types";
CanvasJS = CanvasJS.Chart ? CanvasJS : window.CanvasJS;

class CanvasJSChart extends React.Component {
	static _cjsContainerId = 0
	constructor(props) {		
		super(props);		
		this.options = props.options ? props.options : {};		
		let unit = "vh";
		if (this.props.pxHeight != undefined && this.props.pxHeight != null && this.props.pxHeight == true) unit = "px";
    if (this.props.remHeight != undefined && this.props.remHeight != null && this.props.remHeight == true) unit = "rem";
    if (this.props.specHeight != undefined && this.props.specHeight != null ){
      this.containerProps = {width: "100%", position: "relative", height: this.props.specHeight};
    } else {
      this.containerProps = {width: "100%", position: "relative", height: this.props.height !== undefined ? this.props.height+unit : "65vh"};
    }
		this.chartContainerId = "canvasjs-react-chart-container-" + CanvasJSChart._cjsContainerId++;
	}	
	componentDidMount() {
		//Create Chart and Render		
		this.chart = new CanvasJS.Chart(this.chartContainerId, this.options);
		this.chart.render();
		
		if(this.props.onRef)
			this.props.onRef(this.chart);
	}	
    
	componentDidUpdate() {
		//Update Chart Options & Render
		this.chart.options = this.props.options;
		this.chart.render();
	}
  
  componentWillUnmount() {
		//Destroy chart and remove reference
		this.chart.destroy();
		if(this.props.onRef)
			this.props.onRef(undefined);
	}		
	render() {		
		//return React.createElement('div', { id: this.chartContainerId, style: this.containerProps });		
		return <div id = {this.chartContainerId} style = {this.containerProps}/>		
	}	
}

var CanvasJSReact = {
    CanvasJSChart: CanvasJSChart,
    CanvasJS: CanvasJS
};

CanvasJSChart.propTypes = {
  options: PropTypes.object,
  onRef: PropTypes.object,
	height: PropTypes.number,
	pxHeight: PropTypes.bool,
  remHeight:PropTypes.bool,
  specHeight:PropTypes.string,
};

export default CanvasJSReact;