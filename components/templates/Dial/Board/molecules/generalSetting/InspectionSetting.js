import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { Col } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`
  display:flex;
  width:95%;
  padding-top:20px;
  background-color: ${surface};
  .radio-title-label{
      margin-right:15px;   
      width:120px;
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
  .pullbox{
      .pullbox-title{
        text-align: right;
        margin-right: 15px;
        width: 100px;
      }
      .pullbox-select{
          width:200px;
      }
  }  
  
`;

const inspection_pattern_list = [
    {id:1, valeu:"クリックして検査パターンを選択"},
    {id:2, valeu:"1W透析前"},
    {id:3, valeu:"3W透析前"},    
];
const heart_code_list = [
    {id:1, valeu:"CTR(心胸比)"},
    {id:2, valeu:"比重"},    
];
const heart_image_code_list = [
    {id:1, valeu:"クリックして選択"},
    {id:2, valeu:"胸部"},    
];
const VA_image_code_list = [
    {id:1, valeu:"クリックして選択"},
    {id:2, valeu:"シャント写真"},    
];
class InspectionSetting extends Component {
  constructor(props) {
      super(props);
      this.state = {
        weight_set:0,
        water_set:0,
        time_set:0,
        display_water:0,
        alaram_set:0
      }
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
            <SelectorWithLabel
                options={inspection_pattern_list}
                title="適正透析分析"
                // getSelect={this.getGroup.bind(this)}
                // departmentEditCode={this.state.group}
            />
            <div className="flex radio_area">
                <label className="radio-title-label">検査結果一覧</label>
                <RadioButton
                      id="male"
                      value={0}
                      label="左側を最新にする"
                      name="increse-weight"
                      getUsage={this.getWeightSet.bind(this)}
                      checked={this.state.weight_set == 0 ? true : false}
                  />
                <RadioButton
                    id="femaie"
                    value={1}
                    label="右側を最新にする"
                    name="increse-weight"
                    getUsage={this.getWeightSet}
                    checked={this.state.weight_set == 1 ? true : false}
                />
            </div>
        </Col>
        <Col md="6">
            <SelectorWithLabel
                options={heart_code_list}
                title="心胸比コード"
                // getSelect={this.getGroup.bind(this)}
                // departmentEditCode={this.state.group}
            />
            <SelectorWithLabel
                options={heart_image_code_list}
                title="心胸比画像コード"
                // getSelect={this.getGroup.bind(this)}
                // departmentEditCode={this.state.group}
            />
            <SelectorWithLabel
                options={VA_image_code_list}
                title="VA画像コード"
                // getSelect={this.getGroup.bind(this)}
                // departmentEditCode={this.state.group}
            />
          <div className="flex radio_area">
            <label className="radio-title-label">VA初期表示</label>
            <RadioButton
                    id="alarm_1"
                    value={0}
                    label="絵"
                    name="alarm"
                    getUsage={this.getAlarmSet.bind(this)}
                    checked={this.state.alaram_set == 0 ? true : false}
                />
            <RadioButton
                id="alarm_2"
                value={1}
                label="写真"
                name="alarm"
                getUsage={this.getAlarmSet.bind(this)}
                checked={this.state.alaram_set == 1 ? true : false}
            />
          </div>          
        </Col>    
    </Wrapper>  
    </>
    )
  }
}

export default InspectionSetting