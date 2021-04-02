import React, { Component } from "react";
import CanvasJSReact from "../molecules/canvasjs.react";
import PropTypes from "prop-types";
import {formatDateTimeIE, formatTimeIE} from "../../helpers/date";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class VitalChart extends Component {
  constructor(props) {
    super(props);
    this.stageChart = React.createRef();
  }

  componentDidMount() {}

  showMenu = (e) => {
    this.props.showMenu(e, e.dataPoint.x);
  };
  showVitalModal = (e) => {
    this.props.showVitalModal(e.dataPoint.x);
  }

  render() {    
    let contentData = [];
    var min_x = null, max_x = null;
    let graph_max_min_constants = this.props.graph_max_min_constants;
    let temperature_max = graph_max_min_constants !== undefined && graph_max_min_constants.temperature_max_limit !== "" && graph_max_min_constants.temperature_max_limit >= 0 ? parseInt(graph_max_min_constants.temperature_max_limit) : 40;
    let temperature_min = graph_max_min_constants !== undefined && graph_max_min_constants.temperature_min_limit !== "" && graph_max_min_constants.temperature_min_limit >= 0 ? parseInt(graph_max_min_constants.temperature_min_limit) : 36;
    let temperature_interval = parseInt(((temperature_max-temperature_min) / 4));
    let pulse_max = graph_max_min_constants !== undefined && graph_max_min_constants.pulse_max_limit !== "" && graph_max_min_constants.pulse_max_limit >= 0 ? parseInt(graph_max_min_constants.pulse_max_limit) : 240;
    let pulse_min = graph_max_min_constants !== undefined && graph_max_min_constants.pulse_min_limit !== "" && graph_max_min_constants.pulse_min_limit >= 0 ? parseInt(graph_max_min_constants.pulse_min_limit) : 0;
    let pulse_interval = parseInt(((pulse_max-pulse_min) / 4));
    let blood_max = graph_max_min_constants !== undefined && graph_max_min_constants.blood_max_limit !== "" && graph_max_min_constants.blood_max_limit >= 0 ? parseInt(graph_max_min_constants.blood_max_limit) : 240;
    let blood_min = graph_max_min_constants !== undefined && graph_max_min_constants.blood_min_limit !== "" && graph_max_min_constants.blood_min_limit >= 0 ? parseInt(graph_max_min_constants.blood_min_limit) : 0;
    let blood_interval = parseInt(((blood_max-blood_min) / 4));
    let respiratory_max = graph_max_min_constants !== undefined && graph_max_min_constants.respiratory_max_limit !== "" && graph_max_min_constants.respiratory_max_limit >= 0 ? parseInt(graph_max_min_constants.respiratory_max_limit) : 35;
    let respiratory_min = graph_max_min_constants !== undefined && graph_max_min_constants.respiratory_min_limit !== "" && graph_max_min_constants.respiratory_min_limit >= 0 ? parseInt(graph_max_min_constants.respiratory_min_limit) : 15;
    let respiratory_interval = parseInt(((respiratory_max-respiratory_min) / 4));
    if (
      this.props.showData !== undefined &&
      this.props.showData != null &&
      this.props.showData.length > 0
    ) {
      this.props.showData.map((item) => {        
        let gData = [];
        if (item.values != undefined && item.values.length > 0) {
          item.values.map((val) => {            
            if (val.y != '' && val.y != null){
              if (this.props.min_x !== undefined) min_x = this.props.min_x;
              if (this.props.max_x !== undefined) max_x = this.props.max_x;

              let newVal = {};              
              newVal.y = item.label == '血圧' ? parseFloat(val.y) : parseFloat(val.y) >0 ? parseFloat(val.y) : '';
              newVal.tooltip_y = item.label == '血圧' ? parseFloat(val.y) : parseFloat(val.y) > 0 ? parseFloat(val.y) : '';
              newVal.label = val.x;
              newVal.x = formatDateTimeIE(val.x);
              gData.push(newVal);
            }
          });
        }
        let markerColor = "red";
        let lineColor = "red";
        let markerType = "circle";
        let type = "line";
        let  toolTipContent = "「" + item.label.replace(" ", "") + "」 {label}: {tooltip_y}";
        
        var axisYIndex = 0;
        if (item.label == "体温") {
          markerColor = "#00f";
          lineColor = "#00f";
          markerType = "square";
          axisYIndex = 3;
        }
        if (item.label == "低血圧") {
          markerColor = "red";
          lineColor = "red";
          type = "line";
          markerType = "triangle";
          axisYIndex = 2;
        }
        if (item.label == "高血圧") {
          markerColor = "red";
          lineColor = "red";
          type = "line";
          markerType = "triangle_back";
          axisYIndex = 2;
        }
        if (item.label == '脈拍') {
          markerColor = "green";
          lineColor = "green";
          markerType = "circle";
          axisYIndex = 1;
        }
        if (item.label == "呼吸数") {
          markerColor = "#000";
          lineColor = "#000";
          markerType = "cross";
          axisYIndex = 0;
        }
        
        let iData = {
          type,
          toolTipContent,
          xValueType: "dateTime",
          yValueType: "number",
          markerColor: markerColor,
          lineColor: lineColor,
          markerType,
          axisYIndex:axisYIndex,
          dataPoints: gData,
          click:this.showMenu
        };
        contentData.push(iData);
      });
    }
    if(this.props.vital_temp_data !== undefined && this.props.vital_temp_data != null){
        if (this.props.min_x !== undefined) min_x = this.props.min_x;
        if (this.props.max_x !== undefined) max_x = this.props.max_x;
      let item4 = this.props.vital_temp_data;
      let gData4 = [];
      item4.map((val)=>{
        if(val.y !== "") {
          let newVal={};
          newVal.y = parseFloat(val.y);
          newVal.x = formatDateTimeIE(val.x);
          newVal.label = "計測予定　" + formatTimeIE(val.x);
          newVal.indexLabel = val.indexLabel;
          newVal.indexLabelPlacement = "inside";
          newVal.indexLabelFontColor = val.indexLabelFontColor;
          newVal.indexLabelFontSize = val.indexLabelFontSize;
          gData4.push(newVal);
        }
      });
      let iData4 = {
        type:'scatter',
        indexLabelPlacement:"inside",
        markerColor:"transparent",
        markerSize : 30,
        axisYIndex: 0,
        xValueType: "dateTime",
        yValueType: "number",
        
        toolTipContent:'{label}',
        lineColor: "#000",
        click : this.showVitalModal,
        dataPoints: gData4
      };
      contentData.push(iData4);
    }
    
    let labelFontSize = 10;
    var x_interval = 1;
    var x_intervalType = 'day';    
    switch(this.props.x_range){      
      case 2:
        x_interval = 3;
        x_intervalType = 'hour';
        break;
      case 3:
        x_interval = 1;
        x_intervalType = 'hour';
        break;
    }
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor:'lightyellow',
      axisY: [
        { 
          valueFormatString:" ",
          lineThickness:1,
          interval: respiratory_interval,
          includeZero: false,
          suffix: "",
          minimum: respiratory_min,
          maximum: respiratory_max,
          // labelFontSize:labelFontSize,
          // labelFontColor: "lightyellow",
          title: "",
          tickThickness: 0,
          titleFontColor: this.props.titleFontColor,
          margin:0,
          // stripLines:[
          //   {
          //     value:respiratory_min,
          //     label: respiratory_min,
          //     thickness:1,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:respiratory_min + respiratory_interval,
          //     label: respiratory_min + respiratory_interval,
          //     thickness:1,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:respiratory_min + respiratory_interval * 2,
          //     label: respiratory_min + respiratory_interval * 2,
          //     thickness:1,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:respiratory_min + respiratory_interval * 3,
          //     label: respiratory_min + respiratory_interval * 3,
          //     thickness:1,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:respiratory_max,
          //     label: respiratory_max,
          //     thickness:1,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   }
          // ]
        },
        {
          valueFormatString:" ",
          lineThickness:0,
          interval:blood_interval,
          includeZero: false,
          suffix: "",
          minimum: blood_min,
          maximum: blood_max,
          // labelFontSize:labelFontSize,
          // labelFontColor: "lightyellow",
          title: "",
          tickThickness: 0,
          titleFontColor: this.props.titleFontColor,
          margin:-8,
          // stripLines:[
          //   {
          //     value:blood_min,
          //     label: blood_min,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:blood_min + blood_interval,
          //     label: blood_min + blood_interval,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:blood_min + blood_interval * 2,
          //     label: blood_min + blood_interval * 2,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:blood_min + blood_interval * 3,
          //     label: blood_min + blood_interval * 3,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:blood_max,
          //     label: blood_max,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   }
          // ]
        },
        {
          valueFormatString:" ",
          lineThickness:0,
          interval:pulse_interval,
          includeZero: false,
          suffix: "",
          tickThickness: 0,
          minimum: pulse_min,
          maximum: pulse_max,
          // labelFontSize:labelFontSize,
          // labelFontColor: "lightyellow",
          title: "",
          titleFontColor: this.props.titleFontColor,
          margin:-5,
          // stripLines:[
          //   {
          //     value:pulse_min,
          //     label: pulse_min,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:pulse_min + pulse_interval,
          //     label: pulse_min + pulse_interval,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:pulse_min + pulse_interval * 2,
          //     label: pulse_min + pulse_interval * 2,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:pulse_min + pulse_interval * 3,
          //     label: pulse_min + pulse_interval * 3,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:pulse_max,
          //     label: pulse_max,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   }
          // ]
        },
        {
          valueFormatString:" ",
          lineThickness:0,
          interval:temperature_interval,
          includeZero: false,
          suffix: "",
          tickThickness: 0,
          minimum: temperature_min,
          maximum: temperature_max,
          // labelFontSize:labelFontSize,
          // labelFontColor: "lightyellow",
          title: "",
          titleFontColor: this.props.titleFontColor,
          margin:-15,
          // stripLines:[
          //   {
          //     value:temperature_min,
          //     label: temperature_min,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:temperature_min + temperature_interval,
          //     label: temperature_min + temperature_interval,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:temperature_min + temperature_interval * 2,
          //     label: temperature_min + temperature_interval * 2,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:temperature_min + temperature_interval * 3,
          //     label: temperature_min + temperature_interval * 3,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   },
          //   {
          //     value:temperature_max,
          //     label: temperature_max,
          //     thickness:0,
          //     labelPlacement:"outside",
          //     labelBackgroundColor: "lightyellow",
          //     labelFontColor:"black",
          //     color:"black",
          //   }
          // ]
        },
      ],
      axisX: {
        // title: "",
        prefix: "",
        labelMaxWidth: 100,
        labelWrap: true,
        interval: x_interval,
        intervalType: x_intervalType,
        valueFormatString: "YYYYMMDD",
        labelFontSize:labelFontSize,
        minimum:min_x,
        maximum:max_x,
        labelFormatter: function(){
          return  "";
        }
      },
      data: contentData,
    };
    let height = this.props.height != undefined && this.props.height != null && this.props.height > 0? this.props.height: 30;
    return (
      <CanvasJSChart
        options={options}
        height={height}
        remHeight = {true
        }
        // specHeight = {this.props.specHeight}
        onRef={(ref) => (this.chart = ref)}
        ref={this.stageChart}
      />
    );
  }
}

VitalChart.propTypes = {
  height: PropTypes.number,
  showData: PropTypes.array,
  vital_temp_data: PropTypes.array,
  min_y: PropTypes.number,
  max_y: PropTypes.number,
  labelFontSize: PropTypes.number,
  x_range:PropTypes.number,
  max_x: PropTypes.object,
  min_x: PropTypes.object,
  showMenu:PropTypes.func,
  showVitalModal:PropTypes.func,
  titleFontColor:PropTypes.string,
  graph_max_min_constants:PropTypes.object
};

export default VitalChart;
