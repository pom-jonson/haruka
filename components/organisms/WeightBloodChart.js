import React, { Component } from "react";
import CanvasJSReact from "../molecules/canvasjs.react";
import PropTypes from "prop-types";
// import * as colors from "~/components/_nano/colors";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class WeightBloodChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    let contentData = [];
    let blood_count = 0;
    if (this.props.showData !== undefined && this.props.showData != null && this.props.showData.length > 0){
      this.props.showData.map((item) => {
        item.values.map((val) => {
          if (item.label == "透析前血圧" || item.label == "透析後血圧" || item.label == "透析前後血圧") {
            if (val.y != null && Array.isArray(val.y) && val.y[0] != null) {
              blood_count++;
            }
          }
        })
      });
      this.props.showData.map((item) => {
        let gData = [];    
        item.values.map((val) => {
            let newVal = {};
            newVal.y = val.y == null ? null : parseFloat(val.y);
            if (item.label == "透析前血圧" || item.label == "透析後血圧" || item.label == "透析前後血圧") {
              newVal.y = val.y;
              if (val.y != null && val.y.length > 0 && blood_count == 1) {
                newVal.y = val.y[1];
              }
            }
            newVal.label = val.x.substr(0,10);
              // parseInt(val.x.substr(5, 2)) + "/" + parseInt(val.x.substr(8, 2));

            newVal.tooltip_y = 
              item.label == "透析前血圧" ||
              item.label == "透析後血圧" ||
              item.label == "透析前後血圧"
                ? val.y != null ? val.y[1] + '/' + val.y[0] : ''
                : (val.y != null ? parseFloat(val.y).toFixed(1): '');
            if (val.markerColor != undefined) {
              newVal.markerColor = val.markerColor;
            }
            if (item.blue_line != undefined && item.blue_line && item.y_value != undefined) {
              newVal.tooltip_y = item.y_value[1] + '/' + item.y_value[0];
            }
            if (val.color != undefined) {
              newVal.color = val.color;
            }
            if (val.label != undefined) {
              newVal.toolTipContent = "「" + val.label.replace(" ", "") + "」 " + newVal.label + ": " + newVal.tooltip_y;
            }
            gData.push(newVal);
        }
        );
        let markerColor = "#f00";
        let lineColor = "#f00";
        let markerType = "circle";
        let color = "";
        let type = "line";
        let  toolTipContent = "「" + item.label.replace(" ", "") + "」 {label}: {tooltip_y}";
        if (item.label == "最低血圧" || item.label == "最高血圧") {
          markerColor = "#0f0";
          markerType = blood_count > 1 ? "none" :"circle";
        }
        if (item.label == "透析前血圧" || item.label == "透析後血圧" || item.label == "透析前後血圧") {
          color = "pink";
          // type = "rangeArea";
          type = blood_count > 1 ? "rangeArea" :"line";
          markerType = blood_count > 1 ? "none" :"circle";
        }
        if (item.label == "前体重") markerColor = "#f00";
        if (item.label == "DW") {
          markerType = "none";
          lineColor = "#0ff";
          type = "stepLine";
        }
        if (item.blue_line != undefined && item.blue_line) {
          lineColor = "blue";
          markerType = blood_count > 1 ? "none" :"circle";
          markerColor = "blue";
          type = "line";
          toolTipContent = "「" + item.label.replace(" ", "") + "」 {label}: {tooltip_y}";
        }
        if (item.label == "後体重") {
          type = "scatter";
          markerColor = "#0f0";
        }
        
        if (item.label == "blank") {
          lineColor = "none";
          markerType = "none";
        }

        if (item.label == '増加量') {
          type = 'column';
          // color = item.label == '増加量' ? "green" : "blue";
        }
        let iData = {
          type,
          toolTipContent,
          yValueType: "number",
          color,
          markerColor: markerColor,
          lineColor: lineColor,
          markerType,
          dataPoints: gData,
          connectNullData: true,
          nullDataLineDashType: "line"
        };
        if (this.props.markerSize != undefined) {
          iData.markerSize = this.props.markerSize;
        }
        
        if (item.label == '体重' ){
          iData.connectNullData = true;
          iData.nullDataLineDashType ="dot" ;
        }
        contentData.push(iData);
      });
    }
    let graph_date_array = this.props.graph_date_array;
    let labelFontSize = 12;
    if (this.props.labelFontSize != undefined) labelFontSize = this.props.labelFontSize;
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      title: {
        text: "",
      },
      axisY: {
        title: "",
        includeZero: false,
        suffix: "",
        minimum: this.props.min_y,
        maximum: this.props.max_y,
      },
      axisX: {
        title: "日付",
        prefix: "",
        labelMaxWidth: 100,
        labelWrap: true,
        interval: 2,
        intervalType: "day",
        valueFormatString: "YYYYMMDD",
        labelFontSize,
        labelFormatter:function(e){
          if (graph_date_array == undefined || graph_date_array == null ) return "";
          if (e.label == undefined || e.label == null || e.label == '') return '';
          if(graph_date_array.includes(e.label.substr(0,10))) {
            return  parseInt(e.label.substr(5, 2)) + "/" + parseInt(e.label.substr(8, 2));
          }
          return '';
        }
      },
      data: contentData,
      markerSize: 12,
    };
    let height =
      this.props.height != undefined &&
      this.props.height != null &&
      this.props.height > 0
        ? this.props.height
        : 30;
    return (
      <CanvasJSChart
        options={options}
        height={height}        
        specHeight = {this.props.specHeight}
        onRef={(ref) => (this.chart = ref)}
      />
    );
  }
}

WeightBloodChart.propTypes = {
  height: PropTypes.number,
  showData: PropTypes.array,
  min_y: PropTypes.number,
  max_y: PropTypes.number,
  year_show: PropTypes.number,
  graph_date_array: PropTypes.array,
  labelFontSize: PropTypes.number,
  markerSize: PropTypes.number,
  remHeight:PropTypes.bool,
  specHeight:PropTypes.string
};

export default WeightBloodChart;
