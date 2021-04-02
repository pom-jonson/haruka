import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import RadioButton from "~/components/molecules/RadioInlineButton";


const Wrapper = styled.div`
  display:block;
  width:95%;
  padding-top:20px;
  text-align:left;
  background-color: ${surface};
  .radio-title-label{
      margin-right:15px;   
      width:90px;
      text-align:right;   
  }
  .radio-btn{
      width:175px;
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
    display:flex;
    margin-bottom: 15px;
    margin-left: 20px;
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
      width:fit-content;
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
  .login_set{
      margin-left:104px;
  }
  
`;

class CertificateSetting extends Component {
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
            <div className="flex radio_area">
                <label className="radio-title-label">ログアウト方法</label>
                <RadioButton
                      id="male"
                      value={0}
                      label="手動ログアウト"
                      name="increse-weight"
                      getUsage={this.getWeightSet.bind(this)}
                      checked={this.state.weight_set == 0 ? true : false}
                  />
                <RadioButton
                    id="femaie"
                    value={1}
                    label="カード離脱時ログアウト"
                    name="increse-weight"
                    getUsage={this.getWeightSet}
                    checked={this.state.weight_set == 1 ? true : false}
                />
            </div>
            <div className="input_area">
                <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <span>分間操作がなけらばログアウト</span>
            </div>
            
            <div className="flex radio_area">
                <label className="radio-title-label">スタッフ変更時</label>
                <RadioButton
                      id="male"
                      value={0}
                      label="入力中画面を残す"
                      name="decrease-water"
                      getUsage={this.getWaterSet.bind(this)}
                      checked={this.state.water_set == 0 ? true : false}
                  />
                <RadioButton
                    id="femaie"
                    value={1}
                    label="入力中画面を閉じる"
                    name="decrease-water"
                    getUsage={this.getWaterSet.bind(this)}
                    checked={this.state.water_set == 1 ? true : false}
                />
            </div>
            <div className="flex radio_area">
                <label className="radio-title-label">NFC認証時</label>
                <RadioButton
                      id="male"
                      value={0}
                      label="システム音を鳴らす。"
                      name="display-set"
                      getUsage={this.getDisplaySet.bind(this)}
                      checked={this.state.display_water == 0 ? true : false}
                  />
                <RadioButton
                    id="femaie"
                    value={1}
                    label="システム音を鳴らさない。"
                    name="display-set"
                    getUsage={this.getDisplaySet.bind(this)}
                    checked={this.state.display_water == 1 ? true : false}
                />
            </div>
            
            <label className="">他の端末からログインする場合</label>
            <div className="flex radio_area login_set">
                <RadioButton
                      id="allow"
                      value={0}
                      label="ログイン切替可能"
                      name="date-set"
                      getUsage={this.getTimeSet.bind(this)}
                      checked={this.state.time_set == 0 ? true : false}
                  />
                <RadioButton
                    id="not_allow"
                    value={1}
                    label="ログイン切替不可"
                    name="date-set"
                    getUsage={this.getTimeSet.bind(this)}
                    checked={this.state.time_set == 1 ? true : false}
                />
            </div>
            
    </Wrapper>  
    </>
    )
  }
}

export default CertificateSetting