import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import InputWithLabel from "../molecules/InputWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import {CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants"
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import $ from "jquery";

const RemarksWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-radius: 4px;
  padding: 8px 8px 8px 0;

  .row {
    margin: 0 0 0 8px;
  }

  .label-title {
    width: 140px;
    margin: 8px 0 0 8px;
  }

  .label-title + label {
    width: 100%;
    margin-top: 8px;
  }

  select {
    width: 100%;
  }

  .block-area {
      // border: 1px solid #aaa;
      margin-top: 20px;
      padding: 20px 10px 10px 10px;
      position: relative;
      label {
        font-size: 14px;
        width: auto;
      }
      .label-unit{
        font-size: 20px;
        margin-top: 8px;
        width: 50px;
      }
      .div-tall-weight {
        margin:0;
      }
    }
    .block-title {
      position: absolute;
      top: -12px;
      left: 10px;
      font-size: 18px;
      background-color: white;
      padding-left: 5px;
      padding-right: 5px;
    }

    .div-drip-rate {      
      width: calc(100% - 140px);
      float: left;
      .hvMNwk{
        width: 100%;
        .label-title{
          width: 140px;
        }        
        input{
          pointer-events: none;
          width: calc(100% - 140px);
          text-align: right;
        }
      }
    }
    .drip-rate-unit{
      width: 50px;
      font-size: 12px !important;
      padding: 16px 12px 16px 6px;
      float: left;
    }
    .no-selected{
      border: 1px solid darkgrey;
      padding: 4px 8px;
      background-color: white;
      span {
        color: black;
        font-weight: normal;
      }
    }

    .inject-remark{
      .hvMNwk{
        width: 100%;
        .label-title{
          width: 140px;
        }        
        input{          
          width: calc(100% - 140px);
        }
      }
    }

    .pullbox{
      width: 100%;
      label{
        width: calc(100% - 140px);
      }
    }
`;

// const options = [
//   {
//     id: 1,
//     value: ""
//   },
//   {
//     id: 2,
//     value: "実施場所1"
//   },
//   {
//     id: 3,
//     value: "実施場所2"
//   },
//   {
//     id: 4,
//     value: "実施場所3"
//   },
//   {
//     id: 5,
//     value: "実施場所4"
//   }
// ];

class InjectionRemarks extends Component {
  constructor(props) {
    super(props);
    let injection_data = karteApi.getSubVal(parseInt(props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    let additions = props.additions;
    let additions_check = {};
    let additions_send_flag_check = {};
    if(additions !== undefined && additions != null && additions.length > 0){
      additions.map(addition=> {
          if(injection_data !== undefined && injection_data != null && injection_data[0].additions !== undefined && injection_data[0].additions[addition.addition_id] !== undefined){
              additions_check[addition.addition_id] = true;
              let sending_flag = injection_data[0].additions[addition.addition_id]['sending_flag'];
              if(sending_flag !== undefined && sending_flag !== null && sending_flag === 1){
                  additions_send_flag_check[addition.addition_id] = true;
              } else {
                  additions_send_flag_check[addition.addition_id] = false;
              }
          } else {
              additions_check[addition.addition_id] = false;
              additions_send_flag_check[addition.addition_id] = false;
          }
      })
    }
    this.state = {      
      free_comment: props.freeComment,
      additions_check:additions_check,
      additions_send_flag_check:additions_send_flag_check,
      additions: props.additions,
      drip_rate: this.props.dripRate ? this.props.dripRate : 0,
      location_id: this.props.locationId ? this.props.locationId : 0,
      water_bubble: this.props.waterBubble ? this.props.waterBubble : 0,
      exchange_cycle: this.props.exchangeCycle ? this.props.exchangeCycle : 0,
      require_time: this.props.requireTime ? this.props.requireTime : 0,
      // implement_location: this.props.implement_location,
      alert_messages: "",
    };
  }

  testRemarkRender = (remark_status) => {  
    this.setState(remark_status);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ 
      additions: nextProps.additions,
    });
  }

  componentDidMount () {        
    // YJ601 薬剤検索欄などに残す必要が無い時にデータが残る不具合
    $('.inject-remark input').on('drop', function(event){
      event.preventDefault();
      return true;
    });        
  }


  getFreeComment = e => {
    this.setState({ free_comment: e.target.value });
  }; 
  updateFreeComment = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.value.length > 20) {
      //キャンセルボタンでは、備考の文字数オーバーアラートが出ないように
      var obj = $(e.relatedTarget);
      if (obj.hasClass("cancel-btn")) return;

      this.setState({
        alert_messages: "備考は、全角20文字以内で入力してください。"
      });
      e.target.focus();
    } else {
      if (e.target.value !== this.props.freeComment) {
        this.props.getFreeComment(e);
      }
    }
  };  

  getAdditions = (name, number) => {
    let check_status = {};
    if (name == 'additions') {
        check_status = this.state.additions_check;
        check_status[number] = !check_status[number];
        this.setState({additions_check:check_status});
        this.props.getAdditionsCheck(check_status, this.state.additions_send_flag_check);
    }
  }

  getAdditionsSendFlag = (name, number) => {
      let check_status = {};
      if (name == 'additions_sending_flag') {
          check_status = this.state.additions_send_flag_check;
          check_status[number] = !check_status[number];
          this.setState({additions_send_flag_check:check_status});
          this.props.getAdditionsCheck(this.state.additions_check, check_status);
      }
  }

  getDripRate = e =>  
    this.setState({ drip_rate: e.target.value }, function() {
  });  

  changeConditionAmount = (type = "drip_rate") => {
    this.props.changeConditionAmount(type);
  }

  getImplementLocation = (e) => {    
    this.props.getImplementLocation(parseInt(e.target.id), e.target.value);
  }

  handleAlertOk = () => {
    this.setState({
      alert_messages: ""
    });
  }

  render() {
    var is_patient = window.location.href.indexOf("preset") == -1;
    const {additions} = this.props;
    const {additions_check} = this.state;
    let karte_mode = this.context.$getKarteMode(this.props.patientId);
    return (
      <RemarksWrapper>   
        <div style={{ display: "flex" }}>
          <SelectorWithLabel
            title="実施場所"
            options={this.props.implementLocationArray}
            getSelect={this.getImplementLocation}
            isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            departmentEditCode={this.state.location_id}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div className="div-drip-rate">          
            <InputWithLabel
              label="点滴速度"
              type="text"
              placeholder=""                      
              diseaseEditData={this.state.drip_rate}
            />          
          </div>                   
          <div className="drip-rate-unit">ml/h</div>
          <div style={{padding:"12px 0px"}}>
            <Button className="no-selected" onClick={()=>this.changeConditionAmount("drip_rate")}>数値変更</Button>
          </div>                    
        </div>
        <div style={{ display: "flex" }}>
          <div className="div-drip-rate">          
            <InputWithLabel
              label="1分あたり"
              type="text"
              placeholder=""                    
              diseaseEditData={this.state.water_bubble}
            />          
          </div>                   
          <div className="drip-rate-unit">滴</div>
          <div style={{padding:"12px 0px"}}>
            <Button className="no-selected" onClick={()=>this.changeConditionAmount("water_bubble")}>数値変更</Button>
          </div>                    
        </div>
        <div style={{ display: "flex" }}>
          <div className="div-drip-rate">          
            <InputWithLabel
              label="交換サイクル"
              type="text"
              placeholder=""                    
              diseaseEditData={this.state.exchange_cycle}
            />          
          </div>                   
          <div className="drip-rate-unit">時間</div>
          <div style={{padding:"12px 0px"}}>
            <Button className="no-selected" onClick={()=>this.changeConditionAmount("exchange_cycle")}>数値変更</Button>
          </div>                    
        </div>
        <div style={{ display: "flex" }}>
          <div className="div-drip-rate">          
            <InputWithLabel
              label="所要時間"
              type="text"
              placeholder=""                    
              diseaseEditData={this.state.require_time}
            />          
          </div>                   
          <div className="drip-rate-unit">時間</div>
          <div style={{padding:"12px 0px"}}>
            <Button className="no-selected" onClick={()=>this.changeConditionAmount("require_time")}>数値変更</Button>
          </div>                    
        </div>
        <div className="inject-remark">
          <InputWithLabel
            label="備考"
            type="text"
            placeholder="全角20字まで"
            getInputText={this.getFreeComment.bind(this)}
            onBlur={this.updateFreeComment}
            diseaseEditData={this.state.free_comment}
            isDisabled={karte_mode == KARTEMODE.READ && is_patient}
          />
        </div>
        {additions != undefined && additions != null && additions.length >0 && (
          <>
            <div className={'block-area shoot-instruction'} style={{width:"100%"}}>
              <div className={'block-title'}>追加指示・指導・処置等選択</div>
              {additions.map(addition => {
                  return (
                      <>
                          <div>
                              <Checkbox
                                  label={addition.name}
                                  getRadio={this.getAdditions.bind(this)}
                                  number={addition.addition_id}
                                  value={additions_check[addition.addition_id]}
                                  name={`additions`}
                                  isDisabled={karte_mode == KARTEMODE.READ && is_patient}
                              />
                              {addition.sending_category === 3 && (
                                  <>
                                      <Checkbox
                                          label={'送信する'}
                                          getRadio={this.getAdditionsSendFlag.bind(this)}
                                          number={addition.addition_id}
                                          value={this.state.additions_send_flag_check[addition.addition_id]}
                                          name={`additions_sending_flag`}
                                          isDisabled={karte_mode == KARTEMODE.READ && is_patient}
                                      />
                                      <div style={{fontSize:"14px", textAlign:"right"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                  </>
                              )}
                          </div>
                      </>
                  )
              })}
            </div>
          </>
        )}
        {this.state.alert_messages != "" && (
          <SystemAlertModal
            hideModal= {this.handleAlertOk.bind(this)}
            handleOk= {this.handleAlertOk.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </RemarksWrapper>
    );
  }
}
InjectionRemarks.contextType = Context;
InjectionRemarks.propTypes = {
  getFreeComment: PropTypes.func,
  getAdditionsCheck: PropTypes.func,
  changeConditionAmount: PropTypes.func,
  getImplementLocation: PropTypes.func,
  freeComment: PropTypes.string,
  implementLocationArray: PropTypes.array,
  locationId: PropTypes.number,
  dripRate: PropTypes.number,
  waterBubble: PropTypes.number,
  exchangeCycle: PropTypes.number,
  requireTime: PropTypes.number,
  additions: PropTypes.array,
  patientId: PropTypes.number,
  cacheSerialNumber: PropTypes.number,
};

export default InjectionRemarks;
