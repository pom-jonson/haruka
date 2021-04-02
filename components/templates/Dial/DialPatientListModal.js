import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios";
// import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";

// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

// import { getMasterValidate } from "~/components/templates/Dial/DialMethods";

// import { masterValidate } from "~/helpers/validate";
import {
  // removeRedBorder,
  // addRequiredBg,
  // removeRequiredBg,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
// import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index, makeList_codeName} from "~/helpers/dialConstants";
import {formatDateLine} from "~/helpers/date";
import SearchBar from "~/components/molecules/SearchBar"
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton"
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  .flex {
    display: flex;
  }
  label {
    text-align: right;
    width: 130px;
    font-size: 18px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  .pullbox-label, .pullbox-select{
    width:9.375rem;
  }
  .label-title{
    width:4.375rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .search_type{    
    display:flex;
    margin-left:1rem;
    margin-right:1.25rem;
  }
  .search-area{
    display:flex;
    .search-box{
      input{
        ime-mode: active;
      }
    }
    .search_type{    
      margin-left:10rem;
      margin-right:1.25rem;
    }
  }
  .title-label{
    padding-top:3px;
  }
  
  .radio-btn{
    width:4.375rem;
  }
  table {
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: 60vh;
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
      font-size:1rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .code-number {
        width: 8rem;
    }
    .name{
      width:20rem;
    }
    .kana_name{
      width:9rem;
    }
    .birthday{
      width:8rem;
    }
    .a_tag{
      text-decoration: underline;
      color: blue;
      cursor:pointer;
    }
  }
  .react-datepicker-wrapper {
    width: 100%;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 18px;
        width: 100%;
        height: 38px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
    }
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {
    padding-left: 15px;
    label {
      font-size: 15px;
      margin-left: 120px;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    input {
      font-size: 18px;
      width: 155px;
    }
    .dZZuAe {
      .label-title {
        font-size: 18px;
        padding-top: 3px;
      }
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 18px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-btn label {
      width: 90px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
  }
  .timing .radio-btn label {
    width: 135px;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
`;

class DialPatientListModal extends Component {
  constructor(props) {
    super(props);    
    // let sortOrder = sessApi.getObjectValue("dial_setting","order");        
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.state = {
        patientList: [],
        schVal:'',
        sort_order: 'kana_name', // default: kana_name        
        isOpenSearchPatientListModal:false,
        confirm_message:'',
        alert_message:'',

        dial_group_codes:makeList_codeName(code_master['グループ'], 1),
        
        search_by_day: 0,
        search_by_time: 0,
        curCommonCode:0,
        time_zone_list:getTimeZoneList(),
    }
    
  }

  async componentDidMount(){
    this.getPatientList();
    $('.search-box input').focus();
  }

  getPatientList = async () => {
        
    var params = {
      search_by_patient:0,
      search_by_name_letter: 0,      
      search_by_day: this.state.search_by_day,
      search_by_time: this.state.search_by_time,
      curCommonCode: this.state.curCommonCode,
    }    
    let path = "/app/api/v2/dial/patient/list_condition";
    var post_data = {
        keyword:this.state.schVal,
        sort_order:this.state.sort_order,
        condition: params
    }
    const { data } = await axios.post(path, {param:post_data});
    if(data != undefined && data !=null){
        this.setState({
            patientList:data
        });
    } else {
        this.setState({
            patientList:[]
        });
    }
    return data
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

  goBedside = (system_patient_id) => {
    sessApi.remove('dial_change_flag');
    sessApi.setObjectValue("from_print", "schedule_date",  formatDateLine(new Date()));
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
    this.props.history.replace("/dial/board/system_setting");
    this.props.closeModal();
  };

  goPatientPage = (item) => {
    sessApi.remove('dial_change_flag');
    sessApi.setObjectValue("dial_setting","patient", item);
    sessApi.setObjectValue("dial_setting","patientById", item.system_patient_id);
    this.props.history.replace("/dial/dial_patient");
    this.props.closeModal();
  }

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getPatientList();
    }
  };

  getCommonCodeSelect = e => {      
    this.setState({ curCommonCode: parseInt(e.target.id)}, () => {
      this.getPatientList();
    });
  };

  search = word => {
      word = word.toString().trim();
      this.setState({ schVal: word });
  };

  searchByDay = (e) => {
    this.setState({ search_by_day: parseInt(e.target.value)}, () => {
      this.getPatientList();
    });
  };

  searchByTime = (e) => {
    this.setState({ search_by_time: parseInt(e.target.value)}, () => {
      this.getPatientList();
    });
  };

  onHide = () => {};

  render() {    
    // let originDialGroups = this.state.dial_group_codes;
    // let dialGroups = {0 : "全て", ...originDialGroups};
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dial-patient-list-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>患者一覧</Modal.Title>
          <span style={{position:'absolute', right:'10px', top:'0.5rem'}}>
            <Button type="mono" className="close-btn" onClick={this.props.closeModal}>閉じる</Button>
          </span>          
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='search-area'>
            <SearchBar
                placeholder=""
                search={this.search}
                enterPressed={this.enterPressed}
              />
              <div className="search_type w96 common_code">                                
                  <SelectorWithLabel
                      options={this.state.dial_group_codes}
                      title="グループ"
                      getSelect={this.getCommonCodeSelect}
                      departmentEditCode={this.state.curCommonCode}
                  />                            
              </div>              
            </div>
            <div className="flex">
              <div className="title-label">透析曜日</div>
              <div className="search_type kind">
                  <RadioButton
                      id="day-0"
                      value={0}
                      label="全て"
                      name="search_by_day"
                      getUsage={this.searchByDay}
                      checked={this.state.search_by_day == 0}
                  />
                  <RadioButton
                      id="day-1"
                      value={1}
                      label="月水金"
                      name="search_by_day"
                      getUsage={this.searchByDay}
                      checked={this.state.search_by_day == 1}
                  />
                  <RadioButton
                      id="day-2"
                      value={2}
                      label="火木土"
                      name="search_by_day"
                      getUsage={this.searchByDay}
                      checked={this.state.search_by_day == 2}
                  />
              </div>

              <div className="title-label" style={{marginLeft:'6.25rem'}}>透析時間帯</div>

              <div className="search_type kind">
                  <RadioButton
                      id="time-all"
                      value={0}
                      label="全て"
                      name="search_by_time"
                      getUsage={this.searchByTime}
                      checked={this.state.search_by_time == 0}
                  />
                  {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                      this.state.time_zone_list.map((item)=>{
                          return (
                              <>
                                  <RadioButton
                                      id={`male_${item.id}`}
                                      value={item.id}
                                      label={item.value}
                                      name="usage"
                                      getUsage={this.searchByTime}
                                      checked={this.state.search_by_time === item.id ? true : false}
                                  />
                              </>
                          );
                      })
                  )}
              </div>
            </div>
            <div className='table-content'>
              <table className="table-scroll table table-bordered" id="code-table">
                <thead>
                  <tr>
                    <th className="code-number">ID</th>
                    <th className="name">患者様名</th>
                    <th className="kana_name">カナ氏名</th>
                    <th className="birthday">生年月日</th>                    
                    <th/>
                  </tr>
                </thead>                        
                <tbody>                
                {this.state.patientList !== undefined && this.state.patientList !== null && this.state.patientList.length > 0 && (
                  this.state.patientList.map((item) => {
                    return (
                      <>
                        <tr>
                          <td className='code-number'>{item.patient_number}</td>
                          <td className='name'>{item.patient_name}</td>
                          <td className='kana_name'>{item.kana_name}</td>
                          <td className='birthday'>{item.birthday}</td>
                          <td className=''>
                            <span className='a_tag' style={{marginRight:'20px'}} onClick={this.goBedside.bind(this, item.system_patient_id, Dial_tab_index.DRMedicalRecord)}>Drカルテ</span>
                            <span className='a_tag' onClick={this.goPatientPage.bind(this, item)} >患者マスタ</span>
                          </td>
                        </tr>
                      </>)
                    })
                )}
                </tbody>
              </table>
            </div>            
          </Wrapper>          
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

DialPatientListModal.contextType = Context;

DialPatientListModal.propTypes = {
  closeModal: PropTypes.func,
  history:PropTypes.object,
};

export default DialPatientListModal;
