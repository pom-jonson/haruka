import React, { Component } from 'react';
import CanvasJSReact from '~/components/molecules/canvasjs.react';
import PropTypes from "prop-types";
import {formatTimeIE, formatDateTimeIE} from "../../../../../helpers/date";
import * as colors from "~/components/_nano/colors";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class TimeSeriesChart extends Component {
    constructor(props) {
        super(props);
        let schedule_date = this.props.schedule_date;
        if (schedule_date == undefined) schedule_date = new Date();
        this.state = {
            schedule_date,
            start_time:this.props.start_time,
            end_time:this.props.end_time,
            min_blood:50,
            max_blood:250,
            min_pulse:40,
            max_pulse:150,
            min_temperature:35,
            max_temperature:42,
            x_range:this.props.x_range,
        }
        this.stageChart = React.createRef();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.schedule_date == nextProps.schedule_date && this.state.start_time == nextProps.start_time && this.state.end_time == nextProps.end_time &&
            this.state.x_range == nextProps.x_range) return;
        this.setState({
            schedule_date:nextProps.schedule_date,
            start_time:nextProps.start_time,
            end_time:nextProps.end_time,
            x_range:nextProps.x_range,
        });        
    }

    getMinY(data){
        if(data == undefined || data == null || data.length == 0) return ;
        return data.reduce((min, p) => p.y < min ? p.y : min, data[0].y);
    }
    getMaxY(data){
        if(data == undefined || data == null || data.length == 0) return ;
        return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
    }

    showDoneModal = (e) => {
        this.props.showDoneModal(e.dataPoint.kind, e.dataPoint.timing);
    };

    showTemperature = () => {
        this.props.showTemperature();
    };

    setMinX = (min, value) => {
        if (min == '') return value;        
        if (typeof min == 'string') min = min.split("-").join("/");
        if (typeof value == 'string') value = value.split("-").join("/");        
        if (new Date(min).getTime() > new Date(value).getTime()) return new Date(value);
        return new Date(min);
    }

    render() {
        let contentData = [];
        let {showData} = this.props;
        let max_x='', min_x='';
        var min_y = 1;
        var max_y = 249;        

        if(showData != undefined && showData.length > 0 ){
            //透析開始, 透析終了-------------------------------
            if (this.state.start_time != undefined && this.state.end_time != undefined && this.state.start_time != null && this.state.end_time != null){            
                let iData5 = {
    
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    yValueType: "number",
                    markerType:"none",
                    type:'rangeColumn',
                    toolTipContent:'{label}',
                    // axisYType: "secondary",
                    axisYIndex: 0,
                    lineThickness: 2,
                    color:'black',
                    dataPoints:[
                        {x:formatDateTimeIE(this.state.start_time),y:[30,180], label:formatTimeIE(this.state.start_time)},
                        {x:formatDateTimeIE(this.state.end_time),y:[30,180], label:formatTimeIE(this.state.end_time)}
                    ]                
                };
                contentData.push(iData5);
                if (min_x == '') min_x = this.props.min_x;
            }
            //---------------------------------------------------
            //脈拍--------------------------------------------------------------
            let item1 = this.props.showData[0];
            let gData1 = [];

            item1.values.map((val)=>{
                if(val.y !== "") {
                    let newVal={};
                    newVal.y = parseFloat(val.y);
                    newVal.x = formatDateTimeIE(val.x);
                    newVal.label =formatTimeIE(val.x);
                    gData1.push(newVal);                    
                }
            });
            let iData1 = {
                type: "line",
                markerType: "circle",
                // showInLegend: true,
                // legendText: "脈拍",
                markerSize: 8,
                markerColor: item1.markerColor != undefined?item1.markerColor: colors.pulseLineColor,                
                axisYIndex: 1,
                lineColor: item1.lineColor != undefined?item1.lineColor: colors.pulseLineColor,                
                xValueType: "dateTime",
                axisXType: "secondary",
                toolTipContent: "{label}「" + item1.label.replace(" ", "") + "」 {y}",
                yValueType: "number",
                dataPoints: gData1
            };
            contentData.push(iData1);
            if (gData1.length > 0 && min_x == '') min_x = this.props.min_x;
            //------------------------------------------------------------------

            //血圧低-------------------------------------------------------------
            let item2 = this.props.showData[1];
            let gData2 = [];
            item2.values.map((val)=>{
                if(val.y !== "") {
                    let newVal={};
                    newVal.y = parseFloat(val.y);
                    newVal.x = formatDateTimeIE(val.x);
                    newVal.label =formatTimeIE(val.x);
                    gData2.push(newVal);                 
                }
            });
            let iData2 = {
                type: "line",
                markerType: "triangle",
                // showInLegend: true,
                // legendText: "血圧低",
                markerSize: 13,
                markerColor: item2.markerColor != undefined?item2.markerColor: colors.bloodLineColor,
                axisYIndex: 0,
                lineColor: item2.lineColor != undefined?item2.lineColor: colors.bloodLineColor,
                xValueType: "dateTime",
                axisXType: "secondary",
                toolTipContent: "{label}「"+item2.label.replace(" ", "") + "」 {y}",
                yValueType: "number",
                dataPoints: gData2
            };
            contentData.push(iData2);
            if (gData2.length > 0  && min_x == '') min_x = this.props.min_x;
            //-------------------------------------------------------------------


            //血圧高---------------------------------------------------------------
            let item3 = this.props.showData[2];
            let gData3 = [];
            item3.values.map((val)=>{
                if(val.y !== "") {
                    let newVal={};
                    newVal.y = parseFloat(val.y);
                    newVal.x = formatDateTimeIE(val.x);
                    newVal.label =formatTimeIE(val.x);
                    gData3.push(newVal);                    
                }
            });
            let iData3 = {
                type: "line",
                markerType: "triangle_back",
                // showInLegend: true,
                // legendText: "血圧高",
                markerSize: 13,
                markerColor: item3.markerColor != undefined?item3.markerColor: colors.bloodLineColor,
                axisYIndex: 0,
                lineColor: item3.lineColor != undefined?item3.lineColor: colors.bloodLineColor,
                xValueType: "dateTime",
                axisXType: "secondary",
                toolTipContent: "{label}「" + item3.label.replace(" ", "") + "」  {y}",
                yValueType: "number",
                dataPoints: gData3
            };
            contentData.push(iData3);
            if (gData3.length > 0 && min_x == '') min_x = this.props.min_x;
            //-------------------------------------------------------------------------------

            //体温データ----------------------------------------------------------------------
            let item_temperature = this.props.showData[3];
            let gData_temperature = [];
            item_temperature.values.map((val)=>{
                if(val.y !== "") {
                    let newVal={};
                    newVal.y = parseFloat(val.y);
                    newVal.x = formatDateTimeIE(val.x);
                    newVal.label =formatTimeIE(val.x);
                    newVal.indexLabel = val.indexLabel;
                    newVal.indexLabelPlacement = "inside";
                    // newVal.kind = val.kind;
                    newVal.indexLabelFontColor = val.indexLabelFontColor;
                    gData_temperature.push(newVal);                    
                }
            });
            let iData_temperature = {
                type: "scatter",
                indexLabelPlacement:"inside",
                markerColor:"transparent",
                // markerColor:colors.temperatureLineColor,
                markerSize : 30,
                // markerType: "none",
                // showInLegend: true,
                // legendText: "体温",
                // lineColor:colors.temperatureLineColor,
                axisYIndex: 1,
                xValueType: "dateTime",
                axisXType: "secondary",
                toolTipContent: "「" + item_temperature.label.replace(" ", "") + "」 {label}",
                indexLabelFontSize:20,
                yValueType: "number",
                click : this.showTemperature,
                dataPoints: gData_temperature
            };
            contentData.push(iData_temperature);
            if (gData_temperature.length > 0 && min_x == '') min_x = this.props.min_x;
            //-----------------------------------------------------------------------------

            if(this.props.applied_data!=undefined){
                let item4 = this.props.applied_data;
                let gData4 = [];
                item4.map((val)=>{
                    if(val.y !== "") {
                        let newVal={};
                        newVal.y = parseFloat(val.y);
                        newVal.x = formatDateTimeIE(val.x);
                        newVal.label =formatTimeIE(val.x);
                        newVal.indexLabel = val.indexLabel;
                        newVal.indexLabelPlacement = "inside";
                        newVal.kind = val.kind;
                        newVal.timing = val.timing;
                        newVal.indexLabelFontColor = val.indexLabelFontColor;
                        gData4.push(newVal);
                    }
                });
                let iData4 = {
                    type:'scatter',
                    // markerType:"none",
                    indexLabelPlacement:"inside",
                    markerColor:"transparent",
                    markerSize : 30,
                    axisYIndex: 0,
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    // axisYType: "secondary",                    
                    yValueType: "number",
                    indexLabelFontSize:15,
                    toolTipContent:'{label}',
                    click : this.showDoneModal,
                    dataPoints: gData4
                };
                contentData.push(iData4);
                if (gData4.length > 0 && min_x == '') min_x = this.props.min_x;
            }

        }

        if (contentData.length == 0){
            contentData = [
                {
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    yValueType: "number",
                    markerType:"none",
                    dataPoints:[
                        {x:"08:00",y:0},
                        {x:"15:00",y:0},
                    ]
                },
            ];
        }
        var x_range = this.state.x_range;
        if (min_x != ''){
          min_x = new Date(min_x);
          max_x = new Date();
          // min_x.setMinutes(0);
          // min_x.setSeconds(0);
          // max_x.setTime(min_x.getTime() + (x_range+0.2) *60*60*1000);
          max_x.setTime(min_x.getTime() + (x_range) *60*60*1000);
          if (max_x.getMinutes() < 12) max_x.setMinutes(12);
          min_x.setTime(min_x.getTime() - 20*60*1000);
        }
        
        var axisX_option = {
            title: "",
            prefix: "",
            labelMaxWidth: 60,
            gridThickness: 1,
            // maximum:max_x,
            // minimum:min_x,
            interval:1,
            intervalType: "hour",
            labelWrap: true,
            valueFormatString: "HH:mm",
            labelFontSize: 14,
        };
        if (min_x != undefined && min_x != null && min_x != '' && max_x != '' && contentData.length > 0){            
            axisX_option = {
                title: "",
                prefix: "",
                labelMaxWidth: 60,                
                maximum:max_x,
                minimum:min_x,
                interval:1,
                intervalType: "hour",
                labelWrap: true,
                valueFormatString: "HH:mm",
                labelFontSize: 14,
                gridThickness: 1,
                // labelFormatter:function(e){
                //     if(e.chart.axisX2[0].minimum.getTime() + 15 * 60 * 1000 < e.value)
                //         return formatTimeIE(e.value);
                //     return "";
                // }
            };
        } 

        //--------------------------------------------------------
            if (this.props.interval_y_between_label != undefined && this.props.interval_y_between_label > 0 && min_x != ''){              
              for (var i = 1; i <= 25; i++){
                if (i % 5 == 0) continue;
                var iData0 = {
                  xValueType: "dateTime",
                  axisXType: "secondary",
                  yValueType: "number",
                  markerType:"none",
                  // axisYType: "secondary",
                  type:'line',
                  axisYIndex: 0,
                  lineThickness: 0.5,
                  color:'gray',
                  dataPoints:[
                      {x:min_x,y:10 * i},
                      {x:max_x,y:10 * i},                      
                  ]
                };                
                contentData.unshift(iData0);
              }
            }
          //--------------------------------------------------------
        
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light1", // "light1", "dark1", "dark2"
            title:{
                text: ""
            },
            axisY: [{
                // title: "血圧",
                interval:50,
                minimum: min_y,
                maximum: max_y,
                titleFontSize:14,
                includeZero: false,
                labelFontSize: 14,
                suffix: "",
                gridColor: "black",
            },
            // {
            //     // title: "脈拍",
            //     interval:40,
            //     minimum: 1,
            //     maximum: 199,
            //     titleFontSize:14,
            //     // lineColor: "pink",
            //     labelFontSize: 14,
            //     includeZero: false
            // },
            // {
            //     // title: "体温",
            //     interval: 2,
            //     minimum: 34,
            //     maximum: 41,
            //     titleFontSize:16,
            //     lineColor: "#51CDA0",
            //     labelFontSize: 16,
            //     includeZero: false
            // }
            ],

            // axisY2:[{
            //     interval:40,
            //     minimum: 1,
            //     maximum: 199,                
            //     labelFormatter: function() {
            //         return "";
            //     }
            // }],
            
            axisX2:axisX_option,
            dataPointWidth:5,
            
            // height:260,
            data: contentData,
        };
        let height = this.props.height != undefined && this.props.height != null && this.props.height> 0 ? this.props.height : 30;
        return (
                <CanvasJSChart
                    options = {options}
                    onRef={ref => this.chart = ref}
                    pxHeight={this.props.pxHeight}
                    height ={height}
                    ref={this.stageChart}                    
                />
        );
    }
}
TimeSeriesChart.defaultProps = {
    x_range:8,
};

TimeSeriesChart.propTypes = {
    showData: PropTypes.array,
    applied_data :PropTypes.object,
    showDoneModal : PropTypes.func,
    showTemperature : PropTypes.func,
    schedule_date : PropTypes.string,
    start_time : PropTypes.string,
    end_time : PropTypes.string,
    height:PropTypes.number,
    pxHeight:PropTypes.bool,
    x_range:PropTypes.number,
    min_x:PropTypes.object,
    interval_y_between_label: PropTypes.number,
};

export default TimeSeriesChart;
