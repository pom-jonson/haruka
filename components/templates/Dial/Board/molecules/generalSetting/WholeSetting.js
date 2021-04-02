import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { Col } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatTimePicker} from "~/helpers/date";
registerLocale("ja", ja);

const Wrapper = styled.div`
  display:flex;
  width:95%;
  padding-top:20px;
  background-color: ${surface};
  .radio-title-label{
      margin-right:15px;   
      width:65px;
      text-align:right;   
  }
  .radio-btn{
      width:135px;
      background-color:black;
      label{
        margin-bottom: 0px;
        color: white;
      }
      input:checked + label {
          border-radius:0px;
          background:red;
      }
  }
  .time-title-label{
      width:40px;      
  }
  .react-datepicker-wrapper{
      margin-right:10px;
  }
  .radio_area{
      margin-bottom:15px;
  }
  .time_set_area{
      margin-bottom:10px;
  }
  .input_area{
    .label-title{
      width:76px;
      text-align: right;
    }
    input{
      width:90px;
      margin-right:10px;
    }
    span{
      font-size:12px;
      width:40px;
      padding-top:15px;
      padding-left:5px;
    }
  }
  .alarm-set-title{
    margin-top: 50px;
    text-align: left;
    margin-bottom: 5px;
  }
  .selectbox-title{
      text-align:left;
  }
  .alarm_area{
      margin-left:30px;
  }
  
`;
const patients_list=[
    {id:1, value:"田中", color:0, time:"7:00"},
    {id:2, value:"鈴木", color:0, time:"7:15"},
    {id:3, value:"伊藤", color:0, time:"7:30"},
    {id:4, value:"加藤", color:1, time:"7:45"},
    {id:5, value:"山田", color:1, time:"8:00"},
    {id:6, value:"佐々木", color:1, time:"8:00"},
    {id:7, value:"池田", color:2, time:"8:20"},
    {id:8, value:"中野", color:2, time:"8:40"},
    {id:9, value:"西村", color:2, time:"9:00"},
    {id:10, value:"岡本", color:3, time:"9:30"},
    {id:11, value:"中川", color:3, time:"9:30"},
    {id:12, value:"青木", color:3, time:"10:00"},
    {id:13, value:"西村", color:4, time:"10:100"},    
];
class WholeSetting extends Component {
  constructor(props) {
      super(props);
      this.state = {
        spec_morning_setting:formatTimePicker("08:00:00"),
        morning_setting:formatTimePicker("06:00:00"),
        afternoon_setting:formatTimePicker("12:00:00"),
        evening_setting:formatTimePicker("17:00:00"),
        night_setting:formatTimePicker("21:00:00"),
        weight_set:0,
        water_set:0,
        time_set:0,
        display_water:0,
        alaram_set:0
      }
  }

  getSpecMorning = (value) => {
    this.setState({spec_morning_setting:value})
  }

  getMorning = (value) => {
    this.setState({morning_setting:value})
  }
  getAfternoon = (value) => {
    this.setState({afternoon_setting:value})
  }
  getEvening = (value) => {
    this.setState({evening_setting:value})
  }
  getNight = (value) => {
    this.setState({night_setting:value})
  }
  getWeightSet = (e) =>{
    this.setState({weight_set:parseInt(e.target.value)});
  }
  getWaterSet = (e) =>{
    this.setState({water_set:parseInt(e.target.value)});
  }
  getDisplaySet = (e) =>{
    this.setState({display_water:parseInt(e.target.value)});
  }
  getTimeSet = (e) =>{
    this.setState({time_set:parseInt(e.target.value)});
  }
  getAlarmSet = (e) =>{
    this.setState({alaram_set:parseInt(e.target.value)});
  }
  render() {        
    // let {list_array, list_item} = this.state;            
  
    return (
    <>
      <Wrapper>
        <Col md="6">
            <div className="flex radio_area">
                <label className="radio-title-label">増加量計算</label>
                <RadioButton
                      id="weight_1"
                      value={0}
                      label="前体重-前回後体重"
                      name="increse-weight"
                      getUsage={this.getWeightSet.bind(this)}
                      checked={this.state.weight_set == 0 ? true : false}
                  />
                <RadioButton
                    id="weight_2"
                    value={1}
                    label="後体重-DW"
                    name="increse-weight"
                    getUsage={this.getWeightSet}
                    checked={this.state.weight_set == 1 ? true : false}
                />
            </div>
            <div className="flex radio_area">
                <label className="radio-title-label">除水計算</label>
                <RadioButton
                      id="water_1"
                      value={0}
                      label="「目標体重」を設定"
                      name="decrease-water"
                      getUsage={this.getWaterSet.bind(this)}
                      checked={this.state.water_set == 0 ? true : false}
                  />
                <RadioButton
                    id="water_2"
                    value={1}
                    label="「残し」を設定"
                    name="decrease-water"
                    getUsage={this.getWaterSet.bind(this)}
                    checked={this.state.water_set == 1 ? true : false}
                />
            </div>
            <div className="flex radio_area">
                <label className="radio-title-label">除水目安線</label>
                <RadioButton
                      id="display_1"
                      value={0}
                      label="表示しない"
                      name="display-set"
                      getUsage={this.getDisplaySet.bind(this)}
                      checked={this.state.display_water == 0 ? true : false}
                  />
                <RadioButton
                    id="display_2"
                    value={1}
                    label="表示する"
                    name="display-set"
                    getUsage={this.getDisplaySet.bind(this)}
                    checked={this.state.display_water == 1 ? true : false}
                />
            </div>
            <div className="flex radio_area">
                <label className="radio-title-label">日付またぎ</label>
                <RadioButton
                      id="time_1"
                      value={0}
                      label="0:00、1:00～"
                      name="date-set"
                      getUsage={this.getTimeSet.bind(this)}
                      checked={this.state.time_set == 0 ? true : false}
                  />
                <RadioButton
                    id="time_2"
                    value={1}
                    label="24:00、25:00～"
                    name="date-set"
                    getUsage={this.getTimeSet.bind(this)}
                    checked={this.state.time_set == 1 ? true : false}
                />
            </div>
            <div className="flex time_set_area">
                <label className="time-title-label"></label>
                <DatePicker
                    selected={this.state.spec_morning_setting}
                    onChange={this.getSpecMorning.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="時間"
                />
                <span>8時までを前日とみなす</span>
            </div>
            <div className="flex time_set_area">
                <label className="time-title-label">午前</label>
                <DatePicker
                    selected={this.state.morning_setting}
                    onChange={this.getMorning.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="時間"
                />
                <span>各時間帯の開始時間目安</span>
            </div>
            <div className="flex time_set_area">
                <label className="time-title-label">午後</label>
                <DatePicker
                    selected={this.state.afternoon_setting}
                    onChange={this.getAfternoon.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="時間"
                />                
            </div>
            <div className="flex time_set_area">
                <label className="time-title-label">夜間</label>
                <DatePicker
                    selected={this.state.evening_setting}
                    onChange={this.getEvening.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="時間"
                />                
            </div>
            <div className="flex time_set_area">
                <label className="time-title-label">深夜</label>
                <DatePicker
                    selected={this.state.night_setting}
                    onChange={this.getNight.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="時間"
                />                
            </div>
        </Col>
        <Col md="6">
            <div className="flex input_area">
                <InputBoxTag
                label="血圧高 上限値"
                type="text"
                // getInputText={this.getValue.bind(this)}
                // value = {value}
                />
                
                <InputBoxTag
                label="血圧低 上限値"
                type="text"
                // getInputText={this.getValue.bind(this)}
                // value = {value}
                />    
          </div>  
          <div className="flex input_area">
                <InputBoxTag
                label="下限値"
                type="text"
                // getInputText={this.getValue.bind(this)}
                // value = {value}
                />
                
                <InputBoxTag
                label="下限値"
                type="text"
                // getInputText={this.getValue.bind(this)}
                // value = {value}
                />    
          </div>  
          <div className="alarm-set-title">他の端末から更新があった際の方法</div>
          <div className="flex radio_area alarm_area">
            <RadioButton
                    id="alarm_1"
                    value={0}
                    label="メッセージボックス表示"
                    name="alarm"
                    getUsage={this.getAlarmSet.bind(this)}
                    checked={this.state.alaram_set == 0 ? true : false}
                />
            <RadioButton
                id="alarm_2"
                value={1}
                label="更新ボックスの表示"
                name="alarm"
                getUsage={this.getAlarmSet.bind(this)}
                checked={this.state.alaram_set == 1 ? true : false}
            />
          </div>
          <div className="selectbox-title">Dr.HEMODY初期の患者一覧の並び順</div>
                <SelectorWithLabel
                    options={patients_list}
                    title=""
                    // getSelect={this.getGroup.bind(this)}
                    // departmentEditCode={this.state.group}
                />
          <div className="selectbox-title">CARE BOARD初期の患者一覧の並び順</div>
                <SelectorWithLabel
                    options={patients_list}
                    title=""
                    // getSelect={this.getGroup.bind(this)}
                    // departmentEditCode={this.state.group}
                />
        </Col>    
    </Wrapper>  
    </>
    )
  }
}

export default WholeSetting