import React, { Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import SymptomListModal from "./SymptomListModal";
registerLocale("ja", ja);
import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Popup = styled.div`
  .flex {
    display: flex;
  }
  height: 96%;

  h2 {
    color: ${colors.onSurface};
    font-size: 17px;
    font-weight: 500;
    margin: 6px 0;
  }  
  .case {
    select{
      width: 600px;
    }
  }
  .list-button{
    position: absolute;
    right: 10px;
    top: 25px;
    button{
      span{
        font-size:1rem;
      }
    }
  }
  .disease-header{
    .d-flex{
      margin-top:19px;
    }
    margin-bottom:10px;
    .react-datepicker-wrapper{
      input{
        width:80px;
        font-size:16px;
        padding-bottom:5px;        
      }
    }
    .department-status{
      margin-top:14px;
      .pullbox-title{
        font-size: 16px;
        margin-top:4px;
      }      
    }
    .pullbox-label{
      margin-top:4px;
      select{
        font-size:16px;
        width:auto;
      }
    }
    overflow: hidden;
    display:flex;
    .radio-area:nth-child(odd){
      float: left;
    }
    .radio-area{
        width: 225px;
        margin-right: 10px;
        border:1px solid darkgray;
        padding-left: 5px;
        padding-right: 5px;
        padding-top:2px;
        padding-bottom:0px;
        legend{
          font-size: 14px;
          width: auto;
          margin-bottom: 2px;
          padding-left: 10px;
          margin-left: 10px;
          padding-right: 10px;
          margin-bottom:0px;
        }
        .radio-groups{
            label{
              margin-right:20px;
              margin-bottom:5px;
              font-size:14px;
            }
        }
    }
    .select-box{
      margin-top:14px;
      .label-title{
        width:0px;
      }
      label{
        font-size:1rem;
        padding-right:7px;
        select{
          width:auto;
          padding-right:11px;
          font-size:1rem;
        }
      }
    }
    .pullbox-label, .pullbox-select{
      height:32px;
    }
  }
  .small-text-area{
    width: 95%;
    margin-right: 10px;
    margin-top: 10px;
    border:1px solid darkgray;
    padding: 5px;    
    legend{
      font-size: 22px;
      width: auto;
      margin-bottom: 0;
      padding-left: 10px;
      margin-left: 10px;
      padding-right: 10px;
    }    
    margin-bottom:10px;    
    textarea{
      width:95%;
      height:80px;
    }
  }
  .text-area{
    width: 99%;
    margin-right: 10px;
    margin-top: 10px;
    border:1px solid darkgray;
    padding: 5px;    
    legend{
      font-size: 22px;
      width: auto;
      margin-bottom: 0;
      padding-left: 10px;
      margin-left: 10px;
      padding-right: 10px;
    }    
    margin-bottom:10px;    
    textarea{
      width:99%;
      height:350px;
    }
  } 
  .panel-menu {
    width: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    display:flex;
    .menu-btn {
        width:200px;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:200px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 300px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
    
  .label-title {
    float: left;
    text-align: right;
    width: 70px;
    line-height: 38px;
    &.pullbox-title {
      margin-right: 8px;
    }
  }

  
  table {
    font-size: 14px;
    vertical-align: middle;
    width: 100%;
  }

  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: 190px;

    .no-result {
      padding: 75px;
      text-align: center;

      p {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }
  .start_date, .end_date {
    width: 90px;
  }

  .center {
    text-align: center;
    button {
      height: 25px;
      padding: 0;
      line-height: 25px;
      span {
        color: ${colors.surface};
      }
    }

    span {
      color: rgb(241, 86, 124);
    }

    .black {
      color: #000;
    }
  }
  .red {
    color: rgb(241, 86, 124);
  }
`;

class SymptomDetailModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      isShowList:false,
      departmentCode:1,
      tab_id:0,
      hospital_status:0,
      example_case:0,
      treat_date:new Date(),
      example_contents:{
        1:'',
        2:'',
        3:'',
        4:'',
        5:'',
        6:'',
        7:'',
        50:'',
        51:'',
        52:'',
        90:''
      },
      number:0
    }
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }  
  componentDidMount(){
    this.getSearchResult();
  }
  async getSearchResult() {
    let path = "/app/api/v2/karte/symptom/getSymptomData";
    let post_data = {
      treat_date:this.state.treat_date,
      hospital_status:this.state.hospital_status,
      department_id:this.state.departmentCode,
      patientId:this.props.patientId,
      number:this.state.number,
    }
    await apiClient.post(path, post_data)
      .then((res) => {        
        if (res.length != 0){
          this.setState({number:res.number, example_contents:res.content})
        } else {
          this.setState({
            number:0,
            example_contents:{
              1:'',
              2:'',
              3:'',
              4:'',
              5:'',
              6:'',
              7:'',
              50:'',
              51:'',
              52:'',
              90:''
            },
          })
        }
      })
  } 

  getDepartment = (e) => {
    this.setState({departmentCode:parseInt(e.target.id)});
  }

  getHospitalStatus = (e) => {
    this.setState({hospital_status:parseInt(e.target.value)});
  }

  setTab = ( val ) => {    
    this.setState({
        tab_id:parseInt(val),        
    });
  };

  getTreatDate = (value) => {
    this.setState({treat_date:value});
  }

  getExampleCase = (e) => {
    this.setState({example_case:e.target.id, tab_id:0})
  }

  getContent = (symptom_detail_kind,e) => {
    if(e.target.value.length >2400){
      window.sessionStorage.setItem("alert_messages", "全角2400文字まで入力してください。");
      return;
    }
    var example_contents = this.state.example_contents;
    example_contents[symptom_detail_kind] = e.target.value;
    this.setState({example_contents});
  }

  async saveData(is_temporary){
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/karte/symptom/register";
    let post_data = {
      treat_date:this.state.treat_date,
      hospital_status:this.state.hospital_status,
      department_id:this.state.departmentCode,
      example_contents:this.state.example_contents,
      status: is_temporary,
      number:this.state.number,
      doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      patient_id:this.props.patientId,
    
    }
    await apiClient.post(path, post_data)
      .then(() => {
        if (this.state.number > 0) {
          window.sessionStorage.setItem("alert_messages", "変更しました。");
        } else {
          window.sessionStorage.setItem("alert_messages", "登録しました。");
        }
        
    })
  }

  showList(){
    this.setState({isShowList:true,});
  }

  closeModal =(item = undefined) =>{
    var tab_id = 0, example_case = 0;
    if (item != undefined){
      if (item.symptom_detail_kind > 4 && item.symptom_detail_kind <= 7){
        tab_id = 1;
        example_case = 0;
      }
      if (item.symptom_detail_kind <=4 && item.symptom_detail_kind >0) example_case = 0;
      switch(item.symptom_detail_kind){
        case 50:
          example_case = 1;
          break;
        case 51:
          example_case = 2;
          break;
        case 52:
          example_case = 3;
          break;
        case 90:
          example_case = 4;
          break;
      }
      this.setState({
        isShowList:false,
        departmentCode:item == null?1:item.department_id,
        tab_id,
        hospital_status:item == null?0:item.hospital_status,
        example_case,
        treat_date:item == null?new Date():new Date(item.treat_date),
        // example_contents:{
        //   1:item != null && item.symptom_detail_kind ==1?item.symptom_detail_content:'',
        //   2:item != null && item.symptom_detail_kind ==2?item.symptom_detail_content:'',
        //   3:item != null && item.symptom_detail_kind ==3?item.symptom_detail_content:'',
        //   4:item != null && item.symptom_detail_kind ==4?item.symptom_detail_content:'',
        //   5:item != null && item.symptom_detail_kind ==5?item.symptom_detail_content:'',
        //   6:item != null && item.symptom_detail_kind ==6?item.symptom_detail_content:'',
        //   7:item != null && item.symptom_detail_kind ==7?item.symptom_detail_content:'',
        //   50:item != null && item.symptom_detail_kind ==50?item.symptom_detail_content:'',
        //   51:item != null && item.symptom_detail_kind ==51?item.symptom_detail_content:'',
        //   52:item != null && item.symptom_detail_kind ==52?item.symptom_detail_content:'',
        //   90:item != null && item.symptom_detail_kind ==90?item.symptom_detail_content:'',
        // },
        number:item == null?0:item.detail_number,
      }, () => {
        if (item != null) this.getSearchResult();
      });
    } else {
      this.setState({isShowList:false});
    }
    
  }

  render() {
    var example_case_list = [
      {id:0, value:'規定に基づく診療報酬明細書の場合'},
      {id:1, value:'治験概要の添付が必要な診療報酬明細の場合'},
      {id:2, value:'疾患別リハビリテーションに係る治療継続の理由等の記載の必要な場合'},
      {id:3, value:'廃用症候群に係る評価表'},
      {id:4, value:'上記以外の場合'},
    ]
    var {example_contents} = this.state;
    return (
      <>
        <Modal
          show={true}          
          id="outpatient"
          className="custom-modal-sm patient-exam-modal disease-name-modal first-view-modal"
        >
          <Modal.Header>
              <Modal.Title>症状詳記</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Popup>              
                <div className="disease-header flex">
                  <div className="d-flex">
                  <label style={{marginRight:5,marginTop:5, fontSize:'16px'}}>診療年月</label>
                  <DatePicker
                    locale="ja"
                    selected={this.state.treat_date}
                    onChange={this.getTreatDate.bind(this)}
                    dateFormat="yyyy/MM"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                    // customInput={<ExampleCustomInput />}
                  />
                  </div>
                  <div className="department-status ml-2" style={{marginTop:'14px'}}>
                    <SelectorWithLabel
                      title="診療科"
                      options={this.departmentOptions}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.departmentCode}                    
                    />
                  </div>
                  <fieldset className="radio-area ml-3">
                      <legend className="blog-title">入外区分</legend>
                      <div className = "radio-groups">
                          <Radiobox
                              label={'入外'}
                              value={0}
                              getUsage={this.getHospitalStatus.bind(this)}
                              checked={this.state.hospital_status === 0 ? true : false}
                              name={`outcome`}
                          />
                          <Radiobox
                              label={'外来'}
                              value={1}
                              getUsage={this.getHospitalStatus.bind(this)}
                              checked={this.state.hospital_status === 1 ? true : false}
                              name={`outcome`}
                          />
                          <Radiobox
                              label={'入院'}
                              value={2}
                              getUsage={this.getHospitalStatus.bind(this)}
                              checked={this.state.hospital_status === 2 ? true : false}
                              name={`outcome`}
                          />
                      </div>
                  </fieldset>
                  <div className = 'select-box'>
                    <SelectorWithLabel
                      title=""
                      options={example_case_list}
                      getSelect={this.getExampleCase}
                      departmentEditCode={this.state.example_case}
                    />
                  </div>
                  <div className="list-button">
                    <Button className="ok" onClick={this.showList.bind(this)}>一覧表示</Button>
                  </div>
                </div>
                <div className="case">                
                </div>

                <div className="panel-menu">
                  { this.state.tab_id === 0 ? (
                      <><div className="active-menu">{this.state.example_case ==0?'症状詳記(1/2)':'症状詳記'}</div></>
                  ) : (
                      <><div className="menu-btn" onClick={this.setTab.bind(this, 0)}>{this.state.example_case ==0?'症状詳記(1/2)':'症状詳記'}</div></>
                  )}
                  { this.state.tab_id === 1 ? (
                      <><div className="active-menu">症状詳記(2/2)</div></>
                  ) : (
                      <>
                      {this.state.example_case == 0 && (
                        <div className="menu-btn" onClick={this.setTab.bind(this, 1)}>症状詳記(2/2)</div>
                      )}
                      </>
                  )}
                  <div className="no-menu"/>
                </div>
                <div className="w-100" style={{overflowY:"auto",height:"90%"}}>
                { this.state.tab_id === 0 && this.state.example_case ==0 && (
                  <>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">患者の主たる疾患の診断根拠となった臨床症状(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 1)} value={example_contents[1]}></textarea>
                  </fieldset>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">患者の主たる疾患の診断根拠となった臨床症状の診察・検査所見(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 2)} value={example_contents[2]}></textarea>
                  </fieldset>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">主たる治療行為の必要性(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 3)} value={example_contents[3]}></textarea>
                  </fieldset>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">主な治療行為の経過(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 4)} value={example_contents[4]}></textarea>
                  </fieldset>
                  </>
                )}
                { this.state.tab_id === 1 && this.state.example_case ==0 && (
                  <>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">診療報酬明細書の合計点数が100万点以上の場合における薬剤に係る症状等(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 5)} value={example_contents[5]}></textarea>
                  </fieldset>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">診療報酬明細書の合計点数が100万点以上の場合における処置に係る症状等(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 6)} value={example_contents[6]}></textarea>
                  </fieldset>
                  <fieldset className="small-text-area">
                    <legend className="blog-title">その他(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 7)} value={example_contents[7]}></textarea>
                  </fieldset>
                  </>
                )}
                { this.state.tab_id === 0 && this.state.example_case ==1 && (
                  <>
                  <fieldset className="text-area">
                    <legend className="blog-title">厚生労働大臣の定める選定療養第７号の規定に基づく薬事法に規定する治療にかかる地検概要(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 50)} value={example_contents[50]}></textarea>
                  </fieldset>
                  </>
                )}
                { this.state.tab_id === 0 && this.state.example_case ==2 && (
                  <>
                  <fieldset className="text-area">
                    <legend className="blog-title">疾患別リハビリテーション（心大血管疾患、脳血管疾患等、運動器及び呼吸器）に係る治療継続の理由等の記載(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 51)} value={example_contents[51]}></textarea>
                  </fieldset>
                  </>
                )}
                { this.state.tab_id === 0 && this.state.example_case ==3 && (
                  <>
                  <fieldset className="text-area">
                    <legend className="blog-title">廃用症候群に係る評価表(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 52)} value={example_contents[52]}></textarea>
                  </fieldset>
                  </>
                )}
                { this.state.tab_id === 0 && this.state.example_case ==4 && (
                  <>
                  <fieldset className="text-area">
                    <legend className="blog-title">規定に基づく診療報酬明細書以外の診療報酬明細書の症状詳記(全角2400文字まで)</legend>
                    <textarea onChange={this.getContent.bind(this, 90)}>{example_contents[90]}</textarea>
                  </fieldset>
                  </>
                )}
                </div>
                
              </Popup>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.saveData.bind(this, 0)}>仮登録</Button>
            <Button className="red-btn" onClick={this.saveData.bind(this, 1)}>確定</Button>
          </Modal.Footer>
          {this.state.isShowList && (
            <SymptomListModal
              handleOk = {this.handleOk}
              closeModal = {this.closeModal}
              patientId = {this.props.patientId}
            />
          )}
        </Modal>        
      </>
    );
  }
}
SymptomDetailModal.contextType = Context;

SymptomDetailModal.propTypes = {  
  closeModal: PropTypes.func,    
  patientId: PropTypes.number, 
  modal_data : PropTypes.object,
};

export default SymptomDetailModal;
