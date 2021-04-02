import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import { KEY_CODES } from "~/helpers/constants";
// import renderHTML from 'react-render-html';
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import RadioGroupButton from "~/components/molecules/RadioGroup";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;

  .radio-area {
    margin-top:1rem;    
    .radio-btn label{
        width: 3.75rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
    }
    .radio-group-btn label{
      font-size: 0.875rem;
      min-width: 7rem;
      max-width: 10rem;
      padding: 0.25rem 0.25rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin-left: 0.3rem;
    }
  }
`;

const weeks = ['日', '月', '火','水','木','金','土'];
class SelectWeekModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    var conditions_data = this.props.conditions_data;
    var distinct_condictions = {};
    var distinct_weeks = {};
    var distinct_weeks_num = {};
    // var dial_method_temp = '';
    Object.keys(conditions_data).map(key => {
      var item = conditions_data[key];
      distinct_condictions[item.dial_method] = item;
      if (distinct_weeks[item.dial_method] == undefined) distinct_weeks[item.dial_method] = '';
      if (distinct_weeks_num[item.dial_method] == undefined) distinct_weeks_num[item.dial_method] = 0;
      distinct_weeks[item.dial_method] += weeks[item.day] + '・';
      distinct_weeks_num[item.dial_method] += Math.pow(2, item.day);
    })
    if (Object.keys(distinct_weeks).length > 0){
      Object.keys(distinct_weeks).map(key => {
        distinct_weeks[key] = distinct_weeks[key].substring(0, distinct_weeks[key].length-1);
      })
    }
    
    this.distinct_condictions = distinct_condictions;
    this.distinct_weeks = distinct_weeks;
    this.distinct_weeks_num = distinct_weeks_num;
    this.state = {
    //   curFocus: props.curFocus !== undefined ? props.curFocus : 0,
    }    
    this.btns = [];
    // this.flag = props.curFocus !== undefined ? props.curFocus : 0;
  }

  async componentDidMount() {
    if (
      document.getElementById("system_confirm_Ok") !== undefined &&
      document.getElementById("system_confirm_Ok") !== null
    ) {
      document.getElementById("system_confirm_Ok").focus();
    }
    this.btns = ["btnOK","btnCancel"];
    this.setState({
    //   curFocus: this.props.curFocus !== undefined ? this.props.curFocus : 0
    });
    // this.flag = this.props.curFocus !== undefined ? this.props.curFocus : 0;
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = (this.flag + 1) % this.btns.length; 

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.handleOk();
      }else{
        this.props.closeModal();
      }      
    }
  }

  enableHaruka = () => {    
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == null || initState == undefined) {
      return "haruka";
    }    
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
  }

  selectDialMethod = e => {
    this.setState({dial_method:e.target.value})
  }

  handleOk = () => {
    if (!(this.state.dial_method > 0)){
      window.sessionStorage.setItem("alert_messages",  "変更対象を選択してください。");
      return;
    }
    this.props.handleOk(this.distinct_condictions[this.state.dial_method], this.distinct_weeks_num[this.state.dial_method],this.distinct_weeks[this.state.dial_method]);
  }

  render() {
    return (
      <Modal
        show={true}
        id="system_alert_dlg"
        // onHide={this.props.hideConfirm}
        className = "system-confirm master-modal"
        tabIndex="0"        
      >
        {/* {this.enableHaruka() != "haruka" && ( */}
          <Modal.Header><Modal.Title>変更対象選択</Modal.Title></Modal.Header>
        {/* )} */}
        <Modal.Body>
          <div className="auto-logout">
              <DoubleModal>
              <div>この患者様には治療法の異なる曜日があります。どの方法の透析条件を編集しますか？</div>
              <div className='radio-area'>
                {Object.keys(this.distinct_condictions).map((key, index)=>{
                  var item = this.distinct_condictions[key];                  
                  return (
                      <>
                          <RadioGroupButton
                              id={`cond_${index}`}
                              value={item.dial_method}
                              label={item.dial_method_name + '(' + this.distinct_weeks[key] + ')'}
                              name="gender"
                              getUsage={this.selectDialMethod}
                              checked={this.state.dial_method==item.dial_method}
                          />
                      </>
                  );
                })}
              </div>
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>
          {/* <Button className={"cancel-btn"} onClick={this.props.closeModal}>キャンセル</Button> */}
          <Button id="system_confirm_Ok" className={"red-btn"} onClick={this.handleOk}>はい</Button>
          {/*<Button id="system_confirm_Cancel" className={this.state.curFocus === 1?"focus": ""} onClick={this.props.confirmCancel}></Button>*/}
        </Modal.Footer>
      </Modal>
    );
  }
}
SelectWeekModal.propTypes = {
    handleOk : PropTypes.func,
    closeModal : PropTypes.func,
    conditions_data : PropTypes.array
};

export default SelectWeekModal;
