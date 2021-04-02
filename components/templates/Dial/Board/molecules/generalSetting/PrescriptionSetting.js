import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { Col } from "react-bootstrap";


const Wrapper = styled.div`
  display:flex;
  width:100%;
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
  .radio_area{
    margin-bottom:15px;
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
  .right-title{
    text-align: left;
    font-size: 15px;
  }
  .sub_topic{
      font-size:13px;
      text-align:left;
      margin-top:10px;
  }
  
  .block{
      .label-title{
          display:none;
      }
      .row{               
      }
      input{
          width:60px;
          margin-right:10px;
          height:25px;
      }
  }
  
  
`;
// const patients_list=[
//     {id:1, value:"田中", color:0, time:"7:00"},
//     {id:2, value:"鈴木", color:0, time:"7:15"},
//     {id:3, value:"伊藤", color:0, time:"7:30"},
//     {id:4, value:"加藤", color:1, time:"7:45"},
//     {id:5, value:"山田", color:1, time:"8:00"},
//     {id:6, value:"佐々木", color:1, time:"8:00"},
//     {id:7, value:"池田", color:2, time:"8:20"},
//     {id:8, value:"中野", color:2, time:"8:40"},
//     {id:9, value:"西村", color:2, time:"9:00"},
//     {id:10, value:"岡本", color:3, time:"9:30"},
//     {id:11, value:"中川", color:3, time:"9:30"},
//     {id:12, value:"青木", color:3, time:"10:00"},
//     {id:13, value:"西村", color:4, time:"10:100"},    
// ];
class PrescriptionSetting extends Component {
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
              
  
    return (
    <>
      <Wrapper>
        <Col md="6">
            <div className="flex radio_area">
                <label className="radio-title-label">服用表示</label>
                <RadioButton
                      id="male"
                      value={0}
                      label="回収表示しない"
                      name="increse-weight"
                      getUsage={this.getWeightSet.bind(this)}
                      checked={this.state.weight_set == 0 ? true : false}
                  />
                <RadioButton
                    id="femaie"
                    value={1}
                    label="回収「３Х」表示する"
                    name="increse-weight"
                    getUsage={this.getWeightSet}
                    checked={this.state.weight_set == 1 ? true : false}
                />
            </div>
            <div className="flex radio_area">
                <label className="radio-title-label">服用検索</label>
                <RadioButton
                      id="medicine_1"
                      value={0}
                      label="薬剤区分で絞り込み"
                      name="decrease-water"
                      getUsage={this.getWaterSet.bind(this)}
                      checked={this.state.water_set == 0 ? true : false}
                  />
                <RadioButton
                    id="medicine_2"
                    value={1}
                    label="すべて表示"
                    name="decrease-water"
                    getUsage={this.getWaterSet.bind(this)}
                    checked={this.state.water_set == 1 ? true : false}
                />
            </div>
            <div className="flex radio_area">
                <label className="radio-title-label">処方展開</label>
                <RadioButton
                      id="auto_not"
                      value={0}
                      label="自動展開しない"
                      name="display-set"
                      getUsage={this.getDisplaySet.bind(this)}
                      checked={this.state.display_water == 0 ? true : false}
                  />
                <RadioButton
                    id="auto"
                    value={1}
                    label="自動展開する。"
                    name="display-set"
                    getUsage={this.getDisplaySet.bind(this)}
                    checked={this.state.display_water == 1 ? true : false}
                />
            </div>
            
        </Col>
        <Col md="6">
          <div className="right-title">服用検索パネルの用途検索設定</div>
          <div className="block">
                <div className="sub_topic">朝昼夕</div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '朝'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '昼'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '夕'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '夜'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '寝'
                    />
                </div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '眠'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '時'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />                    
                </div>                
          </div>  
          <div className="block">
                <div className="sub_topic">食事指定</div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '食前'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '食間'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '食後'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '食直前'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '食直後'
                    />
                </div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />                    
                </div>                
          </div>  
          <div className="block">
                <div className="sub_topic">回収指定</div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '分1'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '分2'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '分3'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '分4'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '分5'
                    />
                </div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '分6'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />                    
                </div>                
          </div>  
          <div className="block">
                <div className="sub_topic">その他</div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '透析日'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '透析前'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '透析'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '医者'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '指示'
                    />
                </div>
                <div className="row flex">
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '時に'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '時'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    value = '痛'
                    />
                    <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                    />                    
                </div>                
          </div>  
          
          
        </Col>    
    </Wrapper>  
    </>
    )
  }
}

export default PrescriptionSetting