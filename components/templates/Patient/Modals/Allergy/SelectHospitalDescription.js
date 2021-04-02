import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatJapanDateSlash, getPrevMonthByJapanFormat} from "~/helpers/date";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
registerLocale("ja", ja);
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  width:100%;
  height:100%;
  font-size:1rem;
  .flex{display:flex;}
  .input-date-area{
    div {margin-top:0;}
    .label-title{
      font-size:1rem;
      line-height:2rem;
      width:5rem;
      margin:0;
    }
    input[type="text"]{
      width:6rem;
      padding-top:0;
      height:2rem;
      font-size:1rem;
    }
  }
  .list-area {
    width:100%;
    height:calc(100% - 7rem);
    overflow-y:auto;
    border:1px solid #aaa;
  }
  .div-row {
    border-bottom:1px solid #aaa;
    padding:0.2rem;
    cursor: pointer;
  }
  .selected-row {
    background-color:#0067C0;
    color: white;
  }
  .item-title {
    width:8rem;
  }
  .item-value {
    width:calc(100% - 8rem);
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class SelectHospitalDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      start_date:getPrevMonthByJapanFormat(new Date()),
      end_date:new Date(),
      list_data:[],
      selected_numbers:[],
      confirm_title:"",
      confirm_message:"",
    };
    this.modal_title = "";
    this.body1_title = "";
    this.body2_title = "";
    this.description_type = "";
    switch (props.type) {
      case "progress_to_hospitalization":
        this.modal_title = "入院までの経過";
        this.body1_title = "主訴";
        this.body2_title = "現病歴";
        this.description_type = "process_hospital";
        break;
      case "current_symptoms_on_admission":
        this.modal_title = "入院時現症";
        this.body1_title = "入院時身体所見";
        this.body2_title = "入院時検査所見";
        this.description_type = "current_symptoms_on_admission";
        break;
      case "medical_history_allergies":
        this.modal_title = "既往歴・アレルギー";
        this.body1_title = "既往歴";
        this.body2_title = "アレルギー";
        this.description_type = "past";
        break;
    }
  }

  async componentDidMount(){
    await this.searchList();
  }
  
  setDateValue = (key,value) => {
    this.setState({[key]:value});
  };
  
  searchList=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/order/hospital/description/search";
    let post_data = {
      system_patient_id:this.props.system_patient_id,
      type:this.description_type,
      start_date:formatDateLine(this.state.start_date),
      end_date:formatDateLine(this.state.end_date),
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.setState({
          list_data:res,
          load_flag:true,
          selected_numbers:[],
        });
      })
  }

  confirmAdd=()=>{
    this.setState({
      confirm_title:"貼付確認",
      confirm_message:"貼付しますか？",
    });
  }
  
  getHistoryInfo=(history)=>{
    let history_arr = history == null ? [] : history.split(',');
    let history_length = history_arr.length == 0 ? 1 : history_arr.length;
    return ((history_length > 9) ? history_length+"" : "0"+history_length)+"版 ";
  }
  
  selectItem=(number)=>{
    let selected_numbers = this.state.selected_numbers;
    let index = selected_numbers.indexOf(number);
    if(index === -1){
      selected_numbers.push(number);
    } else {
      selected_numbers.splice(index, 1);
    }
    this.setState({selected_numbers});
  }
  
  confirmCancel=()=>{
    this.setState({
      confirm_title:"",
      confirm_message:"",
    });
  }
  
  confirmOk=()=>{
    let ret_data = "";
    this.state.list_data.map(item=>{
      if(this.state.selected_numbers.includes(item.number)){
        if(item.body_1 != null && item.body_1 !== ""){
          ret_data = ret_data + this.body1_title + "\n" + item.body_1 + "\n";
        }
        if(this.props.type === "current_symptoms_on_admission" && item.order_data.order_data.optional_json !== undefined){
          let input_flag = false;
          if(item.order_data.order_data.optional_json.tpha != 0){
            ret_data = ret_data + "TPHA：" + (item.order_data.order_data.optional_json.tpha == 1 ? "(+)": (item.order_data.order_data.optional_json.tpha == 2 ? "(-)" : "(±)"));
            input_flag = true;
          }
          if(item.order_data.order_data.optional_json.hbs_ag != 0){
            ret_data = ret_data + "HBs-Ag：" + (item.order_data.order_data.optional_json.hbs_ag == 1 ? "(+)": (item.order_data.order_data.optional_json.hbs_ag == 2 ? "(-)" : "(±)"));
            input_flag = true;
          }
          if(item.order_data.order_data.optional_json.hcv_Ab != 0){
            ret_data = ret_data + "HCV-Ab：" + (item.order_data.order_data.optional_json.hcv_Ab == 1 ? "(+)": (item.order_data.order_data.optional_json.hcv_Ab == 2 ? "(-)" : "(±)"));
            input_flag = true;
          }
          if(item.order_data.order_data.optional_json.hiv != 0){
            ret_data = ret_data + "HIV：" + (item.order_data.order_data.optional_json.hiv == 1 ? "(+)": (item.order_data.order_data.optional_json.hiv == 2 ? "(-)" : "(±)"));
            input_flag = true;
          }
          if(input_flag){ret_data = ret_data + "\n";}
        }
        if(item.body_2 != null && item.body_2 !== ""){
          ret_data = ret_data + this.body2_title + "\n" + item.body_2 + "\n";
        }
      }
    });
    this.props.handleOk(ret_data);
  }

  render() {
    return  (
      <Modal show={true}  className="select-hospital-description first-view-modal">
        <Modal.Header><Modal.Title>{this.modal_title}選択</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className='flex input-date-area'>
                <InputWithLabelBorder
                  label="検索期間"
                  type="date"
                  getInputText={this.setDateValue.bind(this,"start_date")}
                  diseaseEditData={this.state.start_date}
                />
                <span style={{marginLeft:'0.5rem', marginRight:'0.5rem', lineHeight:'2rem'}}>～</span>
                <DatePicker
                  locale="ja"
                  selected={this.state.end_date}
                  onChange={this.setDateValue.bind(this,"end_date")}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  minDate={this.state.start_date}
                  dayClassName = {date => setDateColorClassName(date)}                
                />
                <button style={{marginLeft:"0.5rem"}} onClick={this.searchList.bind(this)}>検索</button>
              </div>
              <div style={{marginTop:"0.5rem"}}><button>全選択</button></div>
              <div style={{marginTop:"0.5rem"}}>{this.modal_title + " " + this.props.department_name + " " +this.props.ward_name}</div>
              <div className={'list-area'}>
                {this.state.load_flag ? (
                  <>
                    {this.state.list_data.length > 0 && (
                      this.state.list_data.map(item=>{
                        return (
                          <>
                            <div className={'div-row ' + (this.state.selected_numbers.includes(item.number) ? 'selected-row' : '')} onClick={this.selectItem.bind(this, item.number)}>
                              <div style={{textAlign:"right"}}>{formatJapanDateSlash(item.created_at) + " " + (this.getHistoryInfo(item.hostory)) + " " + item.doctor_name}</div>
                              {(item.body_1 != null) && (item.body_1 !== "") && (
                                <div className={'flex'}>
                                  <div className={'item-title'}>{this.body1_title}</div>
                                  <div className={'item-value'}>{displayLineBreak(item.body_1)}</div>
                                </div>
                              )}
                              <div className={'flex'}>
                                <div className={'item-title'}>{this.body2_title}</div>
                                <div className={'item-value'}>
                                  {(this.props.type == "current_symptoms_on_admission") && (item.order_data.order_data.optional_json !== undefined) && (
                                    <>
                                      {item.order_data.order_data.optional_json.tpha != 0 && (
                                        <span className="mr-2">TPHA：{item.order_data.order_data.optional_json.tpha == 1 ? "(+)": (item.order_data.order_data.optional_json.tpha == 2 ? "(-)" : "(±)")}</span>
                                      )}
                                      {item.order_data.order_data.optional_json.hbs_ag != 0 && (
                                        <span className="mr-2">HBs-Ag：{item.order_data.order_data.optional_json.hbs_ag == 1 ? "(+)": (item.order_data.order_data.optional_json.hbs_ag == 2 ? "(-)" : "(±)")}</span>
                                      )}
                                      {item.order_data.order_data.optional_json.hcv_Ab != 0 && (
                                        <span className="mr-2">HCV-Ab：{item.order_data.order_data.optional_json.hcv_Ab == 1 ? "(+)": (item.order_data.order_data.optional_json.hcv_Ab == 2 ? "(-)" : "(±)")}</span>
                                      )}
                                      {item.order_data.order_data.optional_json.hiv != 0 && (
                                        <span className="mr-2">HIV：{item.order_data.order_data.optional_json.hiv == 1 ? "(+)": (item.order_data.order_data.optional_json.hiv == 2 ? "(-)" : "(±)")}</span>
                                      )}
                                      {((item.order_data.order_data.optional_json['tpha'] != 0) || (item.order_data.order_data.optional_json['hbs_ag'] != 0) ||
                                        (item.order_data.order_data.optional_json['hcv_Ab'] != 0) || (item.order_data.order_data.optional_json['hiv'] != 0)) && (
                                        <br />
                                      )}
                                    </>
                                  )}
                                  {displayLineBreak(item.body_2)}
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      }
                    ))}
                  </>
                ):(
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className={(this.state.selected_numbers.length > 0) ? 'red-btn' : 'disable-btn'} onClick={this.confirmAdd.bind(this)}>貼付</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

SelectHospitalDescription.contextType = Context;
SelectHospitalDescription.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  system_patient_id: PropTypes.number,
  type: PropTypes.string,
  department_name: PropTypes.string,
  ward_name: PropTypes.string,
};
export default SelectHospitalDescription;
