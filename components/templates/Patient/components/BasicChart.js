import React, { Component } from 'react';
import CanvasJSReact from '~/components/molecules/canvasjs.react';
import PropTypes from "prop-types";
// import {formatTimeHourIE, new Date} from "~/helpers/date";
// import * as colors from "~/components/_nano/colors";
import {formatDateTimeIE, formatDateSlash, formatJapanDateTimeIE} from '../../../../helpers/date';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class BasicChart extends Component {
    constructor(props) {
        super(props);        
        this.state = {            
            start_date:this.props.start_date,
            end_date:this.props.end_date,
            showData:this.props.showData,
            selected_period_type:this.props.selected_period_type,
            min_blood:50,
            max_blood:250,
            min_pulse:40,
            max_pulse:150,
            min_temperature:35,
            max_temperature:42,
        }
        this.stageChart = React.createRef();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {        
        if (this.props.start_date == this.state.start_date && this.props.end_date == this.state.end_date) return
        this.setState({            
            start_date:nextProps.start_date,
            end_date:nextProps.end_date,
            showData:nextProps.showData,
            selected_period_type:nextProps.selected_period_type,
        });
    }

    render() {
        let contentData = [];
        let {showData} = this.props;
        if(showData != undefined && showData.length > 0 ){
            if (this.props.graph_kind == 0){
                //身長
                let gData_height = [];
                showData.map(item => {
                    if(item.height != undefined && item.height != null && parseFloat(item.height) > 0){
                        let newVal={};
                        var x_date = new Date(item.measure_date);
                        var x_date2 = new Date(item.measure_date);
                        x_date.setHours(0);
                        x_date.setMinutes(0);
                        x_date.setSeconds(0);
                        newVal.y = parseFloat(item.height);
                        newVal.x = x_date;
                        newVal.tip_x = formatDateSlash(x_date);
                        gData_height.push(newVal);

                        x_date2.setHours(0);                        
                        x_date2.setMinutes(0);
                        x_date2.setSeconds(1);
                        newVal={};
                        newVal.y = parseFloat(item.height);
                        newVal.x = x_date2;
                        newVal.tip_x = formatDateSlash(x_date);
                        gData_height.push(newVal);
                    }
                })                
                let iData_height = {
                    type: "line",
                    markerType: "circle",
                    // showInLegend: true,                    
                    markerSize: 10,
                    markerColor: 'red',
                    // axisYIndex: 1,
                    lineColor:'red',
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    toolTipContent: "{tip_x}, "  + " {y}",
                    yValueType: "number",
                    dataPoints: gData_height
                };
                contentData.push(iData_height);

                //体重
                let gData_weight = [];
                showData.map(item => {
                    if(item.weight != undefined && item.weight != null && parseFloat(item.weight) > 0){
                        let newVal={};
                        var x_date = new Date(item.measure_date);
                        x_date.setHours(0);
                        x_date.setMinutes(0);
                        x_date.setSeconds(0);
                        newVal.y = parseFloat(item.weight);
                        newVal.x = x_date;
                        newVal.tip_x = formatDateSlash(x_date);                        
                        gData_weight.push(newVal);
                    }                    
                })                
                let iData_weight = {
                    type: "line",
                    markerType: "square",
                    // showInLegend: true,                    
                    markerSize: 10,
                    markerColor: 'blue',
                    // axisYIndex: 1,
                    lineColor:'blue',
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    toolTipContent: "{tip_x}, "  + " {y}",
                    yValueType: "number",
                    dataPoints: gData_weight
                };
                contentData.push(iData_weight);
            } else {
                let gData_high_blood = [];
                showData.map(item => {
                    if(item.max_blood != undefined && item.max_blood != null && parseFloat(item.max_blood) > 0){
                        let newVal={};
                        // var x_data1 = new Date(formatDateTimeIE(item.measure_at));
                        var x_data2 = new Date(formatDateTimeIE(item.measure_at));

                        x_data2.setSeconds(x_data2.getSeconds() +1);
                        newVal.y = parseFloat(item.max_blood);
                        newVal.x = new Date(formatDateTimeIE(item.measure_at));
                        newVal.tip_x = (formatJapanDateTimeIE(item.measure_at));
                        gData_high_blood.push(newVal);

                        newVal = {};
                        newVal.y = parseFloat(item.max_blood);
                        newVal.x = x_data2;
                        newVal.tip_x = (formatJapanDateTimeIE(item.measure_at));                        
                        gData_high_blood.push(newVal);
                    }
                })
                let iData_high_blood = {
                    type: "line",
                    markerType: "triangle",
                    // showInLegend: true,                    
                    markerSize: 10,
                    markerColor: 'red',
                    // axisYIndex: 1,
                    lineColor:'red',
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    toolTipContent: "{tip_x}, "  + " {y}",
                    yValueType: "number",
                    dataPoints: gData_high_blood
                };
                contentData.push(iData_high_blood);

                let gData_low_blood = [];
                showData.map(item => {
                    if(item.min_blood != undefined && item.min_blood != null && parseFloat(item.min_blood) > 0){
                        let newVal={};
                        newVal.y = parseFloat(item.min_blood);
                        newVal.x = new Date(formatDateTimeIE(item.measure_at));
                        newVal.tip_x = (formatJapanDateTimeIE(item.measure_at));
                        gData_low_blood.push(newVal);
                    }
                })
                let iData_low_blood = {
                    type: "line",
                    markerType: "triangle_back",
                    // showInLegend: true,                    
                    markerSize: 10,
                    markerColor: 'red',
                    // axisYIndex: 1,
                    lineColor:'red',
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    toolTipContent: "{tip_x}, "  + " {y}",
                    yValueType: "number",
                    dataPoints: gData_low_blood
                };
                contentData.push(iData_low_blood);

                let gData_temperature = [];
                showData.map(item => {
                    if(item.temperature != undefined && item.temperature != null && parseFloat(item.temperature) > 0){
                        let newVal={};
                        newVal.y = parseFloat(item.temperature);
                        newVal.x = new Date(formatDateTimeIE(item.measure_at));
                        newVal.tip_x = (formatJapanDateTimeIE(item.measure_at));
                        gData_temperature.push(newVal);                        
                    }                    
                })
                let iData_temperature = {
                    type: "line",
                    markerType: "circle",
                    // showInLegend: true,                    
                    markerSize: 10,
                    markerColor: '#e612d7',
                    axisYIndex: 1,
                    lineColor:'#e612d7',
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    toolTipContent: "{tip_x}, "  + " {y}",
                    yValueType: "number",
                    dataPoints: gData_temperature
                };
                contentData.push(iData_temperature);

                let gData_pluse = [];
                showData.map(item => {
                    if(item.pluse != undefined && item.pluse != null && parseFloat(item.pluse) > 0){
                        let newVal={};
                        newVal.y = parseFloat(item.pluse);
                        newVal.x = new Date(formatDateTimeIE(item.measure_at));
                        newVal.tip_x = (formatJapanDateTimeIE(item.measure_at));
                        gData_pluse.push(newVal);
                    }
                })
                let iData_pluse = {
                    type: "line",
                    markerType: "square",
                    // showInLegend: true,                    
                    markerSize: 10,
                    markerColor: 'blue',
                    // axisYIndex: 1,
                    lineColor:'blue',
                    xValueType: "dateTime",
                    axisXType: "secondary",
                    toolTipContent: "{tip_x}, "  + " {y}",
                    yValueType: "number",
                    dataPoints: gData_pluse
                };
                contentData.push(iData_pluse);
            }
            
        }
        if (this.state.start_date != undefined && this.state.end_date != undefined && this.state.start_date != null && this.state.end_date != null){
            var start_date = new Date(this.state.start_date);
            var end_date = new Date(this.state.end_date);



            var abb_end_date = new Date(this.state.end_date);
            var dataPoints  = [];
            start_date.setHours(0);
            start_date.setMinutes(0);
            start_date.setSeconds(0);
            if (this.state.selected_period_type == '月'){
                abb_end_date.setHours(21);
                abb_end_date.setMinutes(0);
                abb_end_date.setSeconds(0);                
            }
            if (this.state.selected_period_type == '週'){
                abb_end_date.setHours(2);
                abb_end_date.setMinutes(0);
                abb_end_date.setSeconds(0);                
            }
            dataPoints = [
                {x:start_date,y:0},
                {x:end_date,y:0},
                {x:abb_end_date,y:0}
            ];
            
            if (this.state.selected_period_type == '日'){                
                abb_end_date.setHours(0);
                abb_end_date.setMinutes(30);
                abb_end_date.setSeconds(0);                
                dataPoints = [
                    {x:start_date,y:0},
                    {x:end_date,y:0, label:24},
                    {x:abb_end_date,y:0}
                ];
            }
            let iData5 = {
                type: "line",
                markerType:"none",
                // axisYIndex: 1,
                // lineColor:'black',
                xValueType: "dateTime",
                axisXType: "secondary",                
                yValueType: "number",

                dataPoints:dataPoints,
            }            
            contentData.push(iData5);
        }        
        
        let day_interval = 1;
        let valueFormatString = 'MM-DD';
        let intervalType = "day";
        switch(this.state.selected_period_type){
            case '年':
                day_interval = 1;
                valueFormatString = "M月";
                intervalType = "month";
                break;
            case '月':
                day_interval = 1;
                valueFormatString = "DD日";
                intervalType = "day";
                break;
            case '週':
                day_interval = 1;
                valueFormatString = "DD-DDD";
                intervalType = "day";
                break;
            case '日':
                day_interval = 1;
                valueFormatString = "HH";
                intervalType = "hour";
                break;
        }        
        let axixY = "";
        if (this.props.modal_type == 0){
            axixY = [
                {
                    // title: "身長, 体重",
                    interval:50,
                    minimum: 0,
                    maximum: 250,
                    titleFontSize:16,
                    includeZero: false,
                    labelFontSize: 16,
                    suffix: "",
                }
            ];
        }  else {
            axixY = [
                {
                    title: "血圧, 脈拍",
                    interval:50,
                    minimum: 0,
                    maximum: 250,
                    titleFontSize:25,
                    includeZero: false,
                    labelFontSize: 16,
                    suffix: "",
                    titleFontColor:'white',
                },
                {
                    title: "体温",
                    interval:1,
                    minimum: 35,
                    maximum: 40,
                    titleFontSize:25,                    
                    labelFontSize: 16,
                    includeZero: false,
                    titleFontColor:'white',
                },
            ];
        }
        
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light1", // "light1", "dark1", "dark2"
            title:{
                text: ""
            },
            axisY: axixY,
            axisY2:[{
                maximum:40,
                labelFormatter: function() {
                    return "";
                }
            }],
            // axisY2:
            axisX2: {
                title: "",
                prefix: "",
                labelMaxWidth: 60,
                // gridThickness: 2,
                interval:day_interval,
                intervalType: intervalType,
                labelWrap: true,
                valueFormatString: valueFormatString,
                labelFontSize: 16,
            },
            dataPointWidth:5,            
            // height:260,
            data: contentData,
        };
        let height = this.props.height != undefined && this.props.height != null && this.props.height > 0 ? this.props.height : 35;
        return (
            <CanvasJSChart
                options = {options}
                onRef={ref => this.chart = ref}
                height={height}
                width = {'100vh'}
                ref={this.stageChart}
            />
        );
    }
}

BasicChart.propTypes = {
    showData: PropTypes.array,        
    start_date : PropTypes.string,
    end_date : PropTypes.string,
    height:PropTypes.number,
    graph_kind:PropTypes.number,
    selected_period_type : PropTypes.string,
    modal_type : PropTypes.number,
};

export default BasicChart;