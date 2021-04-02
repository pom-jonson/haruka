import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import {formatDateLine, formatTimeIE} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  font-size:1rem;
  label, .pullbox-title {
    font-size:1rem;
  }
  .div-top-content, .div-bottom-content{
    margin-left: 5rem;
    margin-top: 1rem;
  }
  .div-title {
    line-height: 2.3rem;
    width: 10rem;
    margin-left:0.5rem;
  }
  .div-bottom{
    margin-top: 1rem;
  }
  .flex {
    display:flex;
  }
  .select-date{
    .react-datepicker{
      width: 130% !important;
      font-size: 1.25rem;
      .react-datepicker__month-container{
        width:79% !important;
        height:24.375rem;
      }
      .react-datepicker__navigation--next--with-time{
        right: 6rem;
      }
      .react-datepicker__time-container{
        width:21% !important;
      }
      .react-datepicker__time-box{
        width:auto !important;
      }
      .react-datepicker__current-month{
        font-size: 1.25rem;
      }
      .react-datepicker__day-names, .react-datepicker__week{
        display: flex;
        justify-content: space-between;
      }
      .react-datepicker__month{
        .react-datepicker__week{
          margin-bottom:0.25rem;
        }
      }
    }
  }
  .react-datepicker-wrapper {
    input {
      width: 15rem;
      height:2.3rem;
    }
  }
  .pullbox{
    .pullbox-title{
      width:10rem;
      margin:0;
      line-height: 2.3rem;
      margin-left: 0.5rem;
    }
    .pullbox-label {
      margin:0;
      .pullbox-select {
        width:10rem;
        height: 2.3rem;
      }
    }
  }
  .select-stop-date{
    .pullbox{
      .pullbox-title{
        width:0;
        margin:0;
      }
    }
  }
  .free-comment {
    div {margin:0;}
    .label-title {
      margin:0;
      line-height: 2.3rem;
      width:10rem;
      margin-left: 0.5rem;
    }
    input {
      width:20rem;
      height: 2.3rem;
    }
  }
  label {
    line-height: 2.3rem;
  }
`;

class OutReturnHospitalModal extends Component {
    constructor(props) {
      super(props); 
      let going_in_date = new Date();
      going_in_date.setDate(new Date().getDate()+1);
      this.state={  
        going_out_flag:0,
        going_in_flag:0,
        going_out_date:new Date(),
        stop_serving_date:new Date(),
        meal_time_classification_master:[{id:0, value:""}],
        stop_serving_time_class:0,
        stop_serving_comment:"",
        going_out_master:[{id:0, value:""}],
        going_out_id:0,
        is_treatment:0,
        going_in_date,
        start_date:going_in_date,
        start_time_classification:0,
        start_comment:"",
        alert_messages:"",
        hos_number:props.hos_number,
      }  
      this.change_flag = 0;
    }

    async componentDidMount() {
      await this.getData();
    }

    getData=async()=>{
      let path = "/app/api/v2/ward/get/going_out_data";
      let post_data = {
      };
      await apiClient
          .post(path, {
              params: post_data
          })
          .then((res) => {
            let meal_time_classification_master = this.state.meal_time_classification_master;
            let going_out_master = this.state.going_out_master;
            if(res.meal_time_classification_master.length > 0){
              res.meal_time_classification_master.map(meal=>{
                meal_time_classification_master.push({id:meal.number, value:meal.name});
              });
            }
            if(res.going_out_master.length > 0){
              res.going_out_master.map(item=>{
                going_out_master.push({id:item.number, value:item.name});
              });
            }
            let _state={};
            _state['meal_time_classification_master'] = meal_time_classification_master;
            _state['going_out_master'] = going_out_master;
            let hospital_out = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_OUT);
            if(hospital_out !== undefined && hospital_out != null){
              this.change_flag = 1;
              _state['going_out_flag'] = 1;
              _state['going_out_date'] = new Date(hospital_out.going_out_date.split("-").join("/"));
              _state['stop_serving_date'] = new Date(hospital_out.stop_serving_date.split("-").join("/"));
              _state['stop_serving_time_class'] = hospital_out.stop_serving_time_class;
              _state['stop_serving_time_class_name'] = hospital_out.stop_serving_time_class_name;
              _state['going_out_id'] = hospital_out.going_out_id;
              _state['is_treatment'] = hospital_out.is_treatment;
              _state['stop_serving_comment'] = hospital_out.stop_serving_comment== null ? "" : hospital_out.stop_serving_comment;
              _state['hos_number'] = hospital_out.hos_number;
            }
            let hospital_return = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_RETURN);
            if(hospital_return !== undefined && hospital_return != null){
              this.change_flag = 1;
              _state['going_in_flag'] = 1;
              _state['going_in_date'] = new Date(hospital_return.going_in_date.split("-").join("/"));
              _state['start_date'] = new Date(hospital_return.start_date.split("-").join("/"));
              _state['start_time_classification'] = hospital_return.start_time_classification;
              _state['start_time_classification_name'] = hospital_return.start_time_classification_name;
              _state['start_comment'] = hospital_return.start_comment== null ? "" : hospital_return.start_comment;
              _state['hos_number'] = hospital_out.hos_number;
            }
            this.setState(_state);
          })
          .catch(() => {

          });
    };

    setDateValue = (key,value) => {
      this.change_flag = 1;
      this.setState({[key]:value});
    };

    setTimeClassification = (key,e) => {
      this.change_flag = 1;
      this.setState({
        [key]:parseInt(e.target.id),
        [key+"_name"]:e.target.value,
      });
    };

    setGoingOutId = (e) => {
      this.change_flag = 1;
      this.setState({
        going_out_id:parseInt(e.target.id),
        going_out_name:e.target.value,
      });
    };

    getRadioOutReturn = (name, value) => {
      if (name == "going_out_flag") {
        if(value == 0 && this.state.going_in_flag == 0){
          this.change_flag = 0;
        } else {
          this.change_flag = 1;
        }
        this.setState({
          going_out_flag: value
        });
      } else if(name == "going_in_flag") {
        if(value == 0 && this.state.going_out_flag == 0){
          this.change_flag = 0;
        } else {
          this.change_flag = 1;
        }
        this.setState({
          going_in_flag: value
        });
      } else if(name == "is_treatment") {
        this.change_flag = 1;
        this.setState({
          is_treatment: value
        });
      }
    } 

    setFreeCommnet(key,e) {
      this.change_flag = 1;
      this.setState({[key]:e.target.value});
    }

    saveData=()=>{
      if(this.change_flag == 0){
        return;
      } else {
        return;
      }
      // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      // if(this.state.stop_serving_time_class == 0){
      //   this.setState({alert_messages:"配膳停止の時間区分を選択してください。"});
      //   return;
      // }
      // if(this.state.going_out_flag == 1){
      //   if(this.state.going_out_id == 0){
      //     this.setState({alert_messages:"外出泊理由を選択してください。"});
      //     return;
      //   }
      //   let hospital_out = {};
      //   hospital_out['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
      //   hospital_out['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
      //   hospital_out['patient_id'] = this.props.patientId;
      //   hospital_out['department_id'] = this.props.department_id;
      //   hospital_out['going_out_date'] = formatDateLine(this.state.going_out_date)+' '+formatTimeIE(this.state.going_out_date);
      //   hospital_out['stop_serving_date'] = formatDateLine(this.state.stop_serving_date);
      //   hospital_out['stop_serving_time_class'] = this.state.stop_serving_time_class;
      //   hospital_out['stop_serving_time_class_name'] = this.state.stop_serving_time_class_name;
      //   hospital_out['going_out_id'] = this.state.going_out_id;
      //   hospital_out['going_out_name'] = this.state.going_out_name;
      //   hospital_out['is_treatment'] = this.state.is_treatment;
      //   hospital_out['stop_serving_comment'] = this.state.stop_serving_comment == "" ? null : this.state.stop_serving_comment;
      //   hospital_out['hos_number'] = this.state.hos_number;
      //   karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_OUT, JSON.stringify(hospital_out), 'insert');
      // }
      // if(this.state.going_in_flag == 1){
      //   let hospital_return = {};
      //   if(this.state.start_time_classification == 0){
      //     this.setState({alert_messages:"配膳開始の時間区分を選択してください。"});
      //     return;
      //   }
      //   hospital_return['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
      //   hospital_return['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
      //   hospital_return['patient_id'] = this.props.patientId;
      //   hospital_return['department_id'] = this.props.department_id;
      //   hospital_return['department_name'] = this.props.department_name;
      //   hospital_return['going_in_date'] = formatDateLine(this.state.going_in_date)+' '+formatTimeIE(this.state.going_in_date);
      //   hospital_return['start_date'] = formatDateLine(this.state.start_date);
      //   hospital_return['start_time_classification'] = this.state.start_time_classification;
      //   hospital_return['start_time_classification_name'] = this.state.start_time_classification_name;
      //   hospital_return['start_comment'] = this.state.start_comment == "" ? null : this.state.start_comment;
      //   hospital_out['hos_number'] = this.state.hos_number;
      //   karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_RETURN, JSON.stringify(hospital_return), 'insert');
      // }
      // if(this.props.from_mode != "calendar"){
      //   this.context.$setExaminationOrderFlag(1);
      // }
      // this.props.closeModal();    
    }

    closeModal=()=>{
      this.setState({alert_messages:""});
    }

    render() {
      return (
        <>  
          <Modal
            show={true}                    
            id="outpatient"
            className="custom-modal-sm patient-exam-modal outpatient-modal out-return-meal first-view-modal"
          >
            <Modal.Header><Modal.Title>外出泊・帰院</Modal.Title></Modal.Header>
            <Modal.Body>
              <DatePickerBox>
                <Wrapper>
                  <div className="div-top">
                    <div className="flex">
                      <Checkbox
                        label={'【外出泊情報】'}
                        getRadio={this.getRadioOutReturn.bind(this)}
                        value={this.state.going_out_flag}
                        name={`going_out_flag`}
                      />
                    </div>
                    <div className="div-top-content">
                      <div className={'flex select-date'}>
                        <div className={'div-title'}>外出泊日時</div>
                        <DatePicker
                          locale="ja"
                          id='discharge_date_id'
                          selected={this.state.going_out_date}
                          onChange={this.setDateValue.bind(this,"going_out_date")}
                          dateFormat="yyyy/MM/dd h:mm aa"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          disabled={this.state.going_out_flag === 0}
                        />
                      </div>
                      <div className={'flex select-stop-date'} style={{marginTop:"0.5rem"}}>
                        <div className={'div-title'}>配膳停止</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.stop_serving_date}
                          onChange={this.setDateValue.bind(this,"stop_serving_date")}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                          disabled={this.state.going_out_flag === 0}
                        />
                        <SelectorWithLabel
                          title=""
                          options={this.state.meal_time_classification_master}
                          getSelect={this.setTimeClassification.bind(this, 'stop_serving_time_class')}
                          departmentEditCode={this.state.stop_serving_time_class}
                          isDisabled={this.state.going_out_flag === 0}
                        />
                        <div className={'div-title'}>より停止</div>
                      </div>
                      <div className={'flex'} style={{marginTop:"0.5rem"}}>
                        <SelectorWithLabel
                          title="外出泊理由"
                          options={this.state.going_out_master}
                          getSelect={this.setGoingOutId}
                          departmentEditCode={this.state.going_out_id}
                          isDisabled={this.state.going_out_flag === 0}
                        />
                        <div style={{marginLeft:"0.5rem"}}>
                          <Checkbox
                            label={'治療外泊'}
                            getRadio={this.getRadioOutReturn.bind(this)}
                            value={this.state.is_treatment}
                            name={`is_treatment`}
                            isDisabled={this.state.going_out_flag === 0}
                          />
                        </div>
                      </div>
                      <div className="free-comment" style={{marginTop:"0.5rem"}}>
                        <InputBoxTag
                          label="フリーコメント"
                          type="text"
                          getInputText={this.setFreeCommnet.bind(this, 'stop_serving_comment')}
                          value={this.state.stop_serving_comment}
                          id="stop_serving_comment_id"
                          isDisabled={this.state.going_out_flag === 0}
                        />
                      </div>
                    </div>
                  </div>         
                  <div className="div-bottom">
                    <div className="div-flex">
                      <Checkbox
                        label={'【帰院情報】'}
                        getRadio={this.getRadioOutReturn.bind(this)}
                        value={this.state.going_in_flag}
                        name={`going_in_flag`}
                      />
                    </div>
                    <div className="div-bottom-content">
                      <div className={'flex select-date'}>
                        <div className={'div-title'}>帰院日時</div>
                        <DatePicker
                          locale="ja"
                          id='discharge_date_id'
                          selected={this.state.going_in_date}
                          onChange={this.setDateValue.bind(this,"going_in_date")}
                          dateFormat="yyyy/MM/dd h:mm aa"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          disabled={this.state.going_in_flag === 0}
                        />
                      </div>
                      <div className={'flex select-stop-date'} style={{marginTop:"0.5rem"}}>
                        <div className={'div-title'}>配膳開始</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.start_date}
                          onChange={this.setDateValue.bind(this,"start_date")}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                          disabled={this.state.going_in_flag === 0}
                        />
                        <SelectorWithLabel
                          title=""
                          options={this.state.meal_time_classification_master}
                          getSelect={this.setTimeClassification.bind(this, 'start_time_classification')}
                          departmentEditCode={this.state.start_time_classification}
                          isDisabled={this.state.going_in_flag === 0}
                        />
                        <div className={'div-title'}>より開始</div>
                      </div>
                      <div className="free-comment" style={{marginTop:"0.5rem"}}>
                        <InputBoxTag
                          label="フリーコメント"
                          type="text"
                          getInputText={this.setFreeCommnet.bind(this, 'start_comment')}
                          value={this.state.start_comment}
                          id="start_comment_id"
                          isDisabled={this.state.going_in_flag === 0}
                        />
                      </div>
                    </div>
                  </div>                  
                </Wrapper>
              </DatePickerBox>
            </Modal.Body>      
            <Modal.Footer>  
              <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
              <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.saveData}>確定</Button>
            </Modal.Footer>    
            {this.state.alert_messages !== "" && (
              <SystemAlertModal
                hideModal= {this.closeModal.bind(this)}
                handleOk= {this.closeModal.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}                                 
          </Modal>               
        </>
      );
    }
}

OutReturnHospitalModal.contextType = Context;
OutReturnHospitalModal.propTypes = {
  patientId: PropTypes.number,
  hos_number: PropTypes.number,
  department_id: PropTypes.number,
  department_name: PropTypes.string,
  from_mode: PropTypes.string,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
};

export default OutReturnHospitalModal;
