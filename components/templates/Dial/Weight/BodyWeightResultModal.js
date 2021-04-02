import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import axios from "axios";
import Button from "../../../atoms/Button";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Clock from 'react-digital-clock';
import Spinner from "react-bootstrap/Spinner";
import AttentionHistoryModal from "~/components/templates/Dial/modals/AttentionHistoryModal";
import { formatJapanDate} from "~/helpers/date";
import {textareaBreakStr} from "~/helpers/dialConstants";

const SpinnerWrapper = styled.div`
  height: 6.5rem;
  display: flex;  
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  .weight{
    text-align: center;
    font-size: 4rem;
    // font-weight: bold;
    vertical-align: center;
    vertical-align: middle;
    // margin-top: 5vh;    
    // margin-bottom: 5vh;    
    span{
      font-size: 3rem;
    }
  }

  .weight_1{
    text-align: center;
    font-size: 6rem;
    // font-weight: bold;
    vertical-align: center;
    vertical-align: middle;    
    span{
      font-size: 3rem;
    }
  }

  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    // padding-top: 10px;
    .info-label {
      text-align: left;
      font-size: 1.875rem;
      width: 150px;
    }    
    .info-data {
        // width: 300px;
        width: calc(100% - 170px);
        font-size: 1.875rem;
        padding: 0px 8px;
        color: blue;
    }
  }

  .attention{
    min-height: 13rem;
    .info-data{
      white-space:pre;
      width: calc(100% - 170px);
      height: 13rem;
      overflow-y: auto;
    }
  }

  .digital-clock{
      span {
          color: black;
          font-size: 2.5rem;
      }
  }

  .red-text {
    color: red !important;
    // font-weight: bold;
  }

  .black-text{
    color: black !important;
  }

  .disable-btn {
    background: lightgray;
    span {
      color: rgb(84, 84, 84);
    }
  }

  .footer{
    display: flex;
    justify-content: center;
    button{
      width: 25rem;
      span{
        font-size: 4rem !important;
      }
    }
    button: first-child{
      margin-right: 11rem;
    }
  }

  .result-area{
    .result-content{
      height: 12.5rem;
    }
  }
`;

const Footer = styled.div`
  .disable-btn {
    background: lightgray;
    span {
      color: rgb(84, 84, 84);
    }
  }
`;

    

export class BodyWeightResultModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      wheel_chair: "",
      ownWeight: "",
      attentionList:[],
      isOpenAttentionHistoryModal: false,
      process_status: 0  
    };
      this.openModalTime=null;
  }

  async componentDidMount() {
    let { data } = await axios.post(
    "/app/api/v2/dial/patient/getAttentionList",
      {
        params: {
          patient_number: this.props.patientInfo.id
        }
      }
    );
    this.setState({
        attentionList: data
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ 
      wheel_chair: nextProps.wheel_status,
      ownWeight: nextProps.originWeight
    });    
    if (nextProps.isLoaded) {
      this.setState({ 
        wheel_chair: nextProps.wheel_status,
        ownWeight: nextProps.originWeight,
        process_status: 1
      });
    } else {
      this.setState({ 
        wheel_chair: nextProps.wheel_status,
        ownWeight: nextProps.originWeight,
        process_status: 0
      });
    }
    // this.props.initWheeChair();
  }

  handleOk = (cur_loading = "") => {
    if (cur_loading == "wheelchair" || cur_loading == "weight") return;
    if (this.props.isLoaded == false && this.state.process_status == 0) {
      return;
    }
    let weightType = this.props.weightType;
    let process_status = "ok";
    if (this.props.isLoaded == false && this.state.process_status == 1) {
      process_status = "fail";
    }

    if (this.props.calcType == "wheelchair_before" || this.props.calcType == "wheelchair_after") {
      this.props.handleOk(this.props.weight, weightType, process_status);  
    } else {
      if (this.state.wheel_chair == "count") {
        weightType = "count"
      }
      this.props.handleOk(this.props.weight, weightType, process_status);
    }
  }

  handleCalculateCancel = () => {
    if(this.openModalTime != null && ((new Date().getTime() - this.openModalTime) < 1000)) return;
    let status = (this.state.process_status + 1) % 2;

    this.setState({
      process_status: status
    }, ()=>{
        this.openModalTime=new Date().getTime();
    });

    if (this.state.wheel_chair == "count") {
      this.props.actionCalc(status, "count");
    } else {
      this.props.actionCalc(status);
    }
    // status: 1 => 計測取消
    // status: 0 => 再計測
  }

  calculateWheelchair = (cur_loading = "") => {
    if (cur_loading == "weight") return;
    if (cur_loading == "wheelchair") {
      //計測取消
      this.handleCalculateCancel();
      return;
    }
    this.props.calcWheelchair();
  }
 
  openAttentionHistory = () => {
    this.setState({
      isOpenAttentionHistoryModal: true
    });
  }

  closeModal = () => {
    this.setState({
        isOpenAttentionHistoryModal: false,
    });
  };

  calculateWeight = (cur_loading = "") => {
    if (cur_loading == "wheelchair") return;
    if (cur_loading == "weight") {
      //計測取消
      this.handleCalculateCancel();
      return;
    }
    this.props.calcWeight();
  }

  render() {
    let weight_type = "前体重";
    const {weightType} = this.props;
    if(weightType == "after_weight"){
        weight_type = "後体重";
    } else if(weightType == "weight_clothes_1"){
        weight_type = "風袋①";
    } else if(weightType == "weight_clothes_2"){
        weight_type = "風袋②";
    } else if(weightType == "weight_clothes_3"){
        weight_type = "風袋③";
    }    
    if (this.state.wheel_chair == "count") {
        weight_type = "車椅子";
    }
    let calc_type = this.props.calcType;
    if (calc_type == "wheelchair_before" || calc_type == "wheelchair_after") {
      calc_type = "wheelchair";
    }
    let str_include_wheelchair = "";
    if (calc_type == "wheelchair" && (weightType == "after_weight" || weightType == "before_weight") && this.state.wheel_chair != "count") {
      str_include_wheelchair = "(車椅子)";      
    }
    let rate="";
    if(this.props.isLoaded) {

      rate = <div className="weight">{weight_type}<span>{str_include_wheelchair}</span> : {parseFloat(this.props.weight).toFixed(1)}㎏</div>; 

      if (this.props.wheelchairWeight != undefined && this.props.wheelchairWeight != "") {

        if(weightType == "after_weight" && this.state.wheel_chair != "count") {

          // rate_1 = <div className="weight_1">後体重 : {Math.abs(this.state.ownWeight- this.props.weight).toFixed(1)}㎏</div>; 
          rate = <div className="weight">後体重 : {Math.abs(this.state.ownWeight- this.props.weight).toFixed(1)}㎏</div>; 

        }
      }     
    } else {
      rate = <><SpinnerWrapper>{this.state.process_status == 0 && ( <Spinner animation="border" variant="secondary" /> )}</SpinnerWrapper><div className="send-label">{weight_type}（{this.state.process_status == 0 ? "通信中" : "計測取消"}）</div></>;
    }    
    // rate = <><SpinnerWrapper><Spinner animation="border" variant="secondary" /></SpinnerWrapper><div className="send-label">{weight_type}（{this.state.process_status == 0 ? "通信中" : "計測取消"}）</div></>;
    const {patientInfo} = this.props;

    // get button name and current loading flag
    let cur_loading = "";
    let wheelchair_btn_name = "車椅子計測";
    let weight_btn_name = "体重再計測";
    if (this.state.process_status == 0) {
      if (this.state.wheel_chair == "count") {
        wheelchair_btn_name = "計測取消";
        cur_loading = "wheelchair";
      } else {
        weight_btn_name = "計測取消";
        cur_loading = "weight";
      }
    }

    // if (this.state.wheel_chair == "count") {

    // }
    return (
      <Modal
        show={true}        
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="weight_dlg"
        className="custom-modal-sm exa-modal weight-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <span>体重計</span>
            
          </Modal.Title>
        </Modal.Header>
       
        <Modal.Body>  
        <Wrapper>
          <div className="pattern_code date-show">
              <div className="info-label">日付</div>
              <div className={this.state.is_diff ? "info-data black-text" : "info-data black-text"}>{formatJapanDate(this.props.schedule_date)}</div>                            
          </div>
          <div className={`digital-clock`}>
              <Clock />
          </div>
          <div className="pattern_code">
              <div className="info-label">患者 ID :</div>
              <div className="info-data">{patientInfo.id}</div>
          </div>
          <div className="pattern_code">
              <div className="info-label">患者名 :</div>
              <div className="info-data">{patientInfo.name}</div>
          </div>
          <div className="pattern_code attention">
            {this.state.attentionList != null && this.state.attentionList != undefined && this.state.attentionList.length > 0 && (            
              <>
                <div className="info-label">注意点 :</div>
                <div className="info-data red-text" onClick={this.openAttentionHistory.bind(this)}>
                  {textareaBreakStr(this.state.attentionList[0].attention)}
                </div>
              </>
            )}
          </div>
          <div className="result-area">
            <div className="result-content">
              {rate}  
            </div>
            <div className="footer">              
              {/*<Button className={this.state.curFocus === 0?"focus": cur_loading == "wheelchair" ? "disable-btn" : ""} onClick={this.handleCalculateCancel}>{weight_btn_name}</Button>*/}


              <Button className={this.state.curFocus === 0?"focus": cur_loading == "wheelchair" ? "disable-btn" : ""} onClick={()=>this.calculateWeight(cur_loading)}>{weight_btn_name}</Button>
              <Button className={this.state.curFocus === 0?"focus": cur_loading == "weight" ? "disable-btn" : ""} onClick={()=>this.calculateWheelchair(cur_loading)}>{wheelchair_btn_name}</Button>

              {/*{!this.props.isLoaded && this.state.process_status == 0 && !(this.props.calcType == "wheelchair_before" || this.props.calcType == "wheelchair_after") && (
                <Button className={this.state.curFocus === 0?"focus": ""} onClick={this.handleCalculateCancel}>計測取消</Button>
              )}
              {(this.props.isLoaded || this.state.process_status == 1) && (
                <Button className={this.state.curFocus === 0?"focus": ""} onClick={this.handleCalculateCancel}>体重再計測</Button>
              )}
              {(this.props.isLoaded || this.state.process_status == 1) && (
                <Button className={this.state.curFocus === 0?"focus": ""} onClick={this.calculateWheelchair}>車椅子計測</Button>
              )}            
              {!this.props.isLoaded && this.state.process_status == 0 && (this.props.calcType == "wheelchair_before" || this.props.calcType == "wheelchair_after") && (
                <Button className={this.state.curFocus === 0?"focus": ""} onClick={this.handleCalculateCancel}>計測取消</Button>
              )}*/}
            </div>                
          </div>
        </Wrapper>        
        </Modal.Body>
        
        <Modal.Footer> 
          <Footer>       
              <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": cur_loading == "wheelchair" || cur_loading == "weight" ? "disable-btn" : "red-btn"} onClick={()=>this.handleOk(cur_loading)}>次へ</Button>
            {this.state.isOpenAttentionHistoryModal && (
                <AttentionHistoryModal
                    modal_data={this.state.attentionList}
                    handleOk={this.handleAddAttention}
                    closeModal={this.closeModal}
                />
            )}
          </Footer>       
        </Modal.Footer>        
      </Modal>
      
    );
  }
}
BodyWeightResultModal.contextType = Context;
BodyWeightResultModal.propTypes = {
  selectDoctorFromModal: PropTypes.func,
  closeModal: PropTypes.func,
  examinations: PropTypes.array,
  preset: PropTypes.array,
  handleOk: PropTypes.func,
  patientInfo: PropTypes.object,
  isLoaded: PropTypes.bool,
  weight: PropTypes.string,
  originWeight: PropTypes.string,
  wheelchairWeight: PropTypes.string,
  schedule_date: PropTypes.string,
  weightType: PropTypes.string,
  wheel_status: PropTypes.string,
  initWheeChair: PropTypes.func,  
  actionCalc: PropTypes.func,  
  calcWheelchair: PropTypes.func,  
  calcWeight: PropTypes.func,  
  calcType: PropTypes.calcType,  
};

export default BodyWeightResultModal;
