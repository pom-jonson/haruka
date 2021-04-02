import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SlipDetail from "./SlipDetail";
import {formatDateLine} from "~/helpers/date";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 margin-top:0;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2.3rem;
   line-height:2.3rem;
 }
 .div-value {
   height:2.3rem;
   line-height:2.3rem;
   border:1px solid #aaa;
   padding:0 0.3rem;
 }
 .table-area {
   margin-top:0.5rem;
   width: 100%;
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: calc(80vh - 17rem);
       width:100%;
       tr{cursor:pointer;}
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;    
       border-bottom: 1px solid #dee2e6;    
       tr{width: calc(100% - 17px);}
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
     }
   }  
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class TreatInjectionSelect extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    this.state = {
      load_flag:true,
      table_list: this.props.modal_data && this.props.modal_data.length > 0 ? this.props.modal_data : [],
      alert_messages:"",
      department_codes,
      diagnosis,
      isOpenInstructionBook:false,
      isOpenDoneInput:false,
    };
  }
  async componentDidMount() {
    // await this.searchSoapFocusRecord();
  }

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  setViewMode = (name, value) => {
    this.setState({[name]: value});
  }

  searchSoapFocusRecord=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/search_plan/soap_focus_record";
    let post_data = {
      start_date:(this.state.start_date != null && this.state.start_date !== "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !== "") ? formatDateLine(this.state.end_date) : "",
      problem_focus_classification:this.state.problem_focus_classification,
      nursing_problem_focus:this.state.nursing_problem_focus,
      article:this.state.article,
      problem_number:this.state.problem_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          soap_focus_records:res,
          selected_index:-1,
        });
      })
      .catch(() => {

      });
  };

  confirmOk=()=>{
    if(this.state.selected_index == -1){
      this.setState({alert_messages: (this.state.problem_focus_classification == "#" ? "看護問題" : "フォーカス") + "を選択してください。"});  
    }
  }

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      isOpenDoneInput:false,
      isOpenInstructionBook:false,
    });  
  }

  openInstructionBook=()=>{
    this.setState({isOpenInstructionBook:true});
  }

  openDoneInput=()=>{
    this.setState({isOpenDoneInput:true});
  }

  getDisplayOrder = (_order) => {
    let result = {};

    if (_order.order_title == "注射") {
      // 状態
      // result.status = _order.done_order == 1 ? "実施済み" : _order.done_order == 2 ? "受付済み" : "未実施";
      result.status = _order.done_order == 1 ? "●" : _order.done_order == 2 ? "●" : "○";
      // 実施日
      result.execute_date = this.getImplementDate(_order.done_order, _order.treat_date, _order.updated_at);
      // 受付番号
      result.accept_no = "";
      // 患者ID
      result.patient_id = _order.patient_number;
      // 氏名
      result.patient_name = _order.patient_name;
      // 性別
      result.sex = _order.gender == 1 ? "男性" : "女性";
      // 年齢
      result.age = _order.age ? _order.age : "";
      // 担当医師名
      result.doctor = _order.order_data.doctor_name;
      // 診療科
      result.department = _order.order_data.department;
      // 依頼内容
      result.instruction_content = _order.karte_status == 3 ? "入院注射" : _order.karte_status == 2 ? "在宅注射" : "外来注射";
      // 指示受け日時
      result.instruction_accept_date = this.getConvertDateTime(_order.created_at);

    } else {
      // 状態
      result.status = _order.state == 0 ? "○": "●";
      // 実施日
      result.execute_date = this.getConvertDateTime(_order.completed_at);
      // 受付番号
      result.accept_no = "";
      // 患者ID
      result.patient_id = _order.patient_number;
      // 氏名
      result.patient_name = _order.patient_name;
      // 性別
      result.sex = _order.gender == 1 ? "男性" : "女性";
      // 年齢
      result.age = _order.age ? _order.age : "";
      // 担当医師名
      result.doctor = _order.order_data.order_data.header.doctor_name;
      // 診療科
      result.department = this.state.diagnosis[_order.order_data.order_data.header.department_id];
      // 依頼内容
      result.instruction_content = _order.general_id === 2 ? "在宅処置" : _order.general_id === 3 ? "入院処置" : "外来処置";
      // 指示受け日時
      result.instruction_accept_date = this.getConvertDateTime(_order.created_at);
    }

    //
    return result;
  }

  getConvertDateTime = (_date=null, _type=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;

    if (_type == "type_2") {
      result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2);
      return result;
    }

    result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2) + " ";
    if (_date.length > 10) {
      result = result + _date.substr(11, 2) + ":" + _date.substr(14, 2);
    }

    return result
  }

  getImplementDate = (_doneOrder, _treatDate, _updatedAt) => {
    let result = "";
    if (_doneOrder == 1) {
      if (_treatDate != undefined && _treatDate != null && _treatDate != "" && _treatDate.length > 4) {
        result = this.getConvertDateTime(_treatDate);
      } else {
        result = this.getConvertDateTime(_updatedAt);
      }
    }
    return result;
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm treat-injection-list first-view-modal"
        >
          <Modal.Header><Modal.Title>処置注射選択</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className={'div-title'} style={{width:"4rem"}}>患者ID</div>
                <div className={'div-value'}>{this.props.patientInfo.patientNumber}</div>
                <div className={'div-title'} style={{width:"5rem", marginLeft:"2rem"}}>患者氏名</div>
                <div className={'div-value'}>{this.props.patientInfo.patientName}</div>
                <div className={'div-title'} style={{width:"3rem", marginLeft:"2rem"}}>性別</div>
                <div className={'div-value'}>{this.props.patientInfo.gender == 1 ? "男性" : "女性"}</div>
                <div className={'div-title'} style={{width:"3rem", marginLeft:"2rem"}}>年齢</div>
                <div className={'div-value'}>{this.props.patientInfo.age}</div>
                <div className={'div-value'} style={{border:"none"}}>才</div>
              </div>
              <div className={'table-area flex'}>
                <table className="table-scroll table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style={{width:"3rem"}}>状態</th>
                      <th style={{width:"7rem"}}>日付</th>
                      <th style={{width:"8rem"}}>受付番号</th>
                      <th>依頼内容</th>
                      <th style={{width:"8rem"}}>診療科</th>
                      <th style={{width:"10rem"}}>担当医師名</th>
                      <th style={{width:"10rem"}}>指示受け日時</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.load_flag ? (
                      <>
                        {this.state.table_list.length > 0 && (
                          this.state.table_list.map(order=>{
                            let display_order = this.getDisplayOrder(order);
                            return (
                              <>
                                <tr>
                                  <td style={{width:"3rem",textAlign:"center"}}>{display_order.status}</td>
                                  <td style={{width:"7rem"}}>{this.props.treat_date}</td>
                                  <td style={{width:"8rem",textAlign:"right"}}>{order.number}</td>
                                  <td>{display_order.instruction_content}</td>
                                  <td style={{width:"8rem"}}>{display_order.department}</td>
                                  <td style={{width:"10rem"}}>{display_order.doctor}</td>
                                  <td style={{width:"10rem"}}>{display_order.instruction_accept_date}</td>
                                </tr>                                
                              </>
                            )
                          })
                        )}                        
                      </>
                    ):(
                      <tr>
                        <td colSpan={'3'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"} onClick={this.openInstructionBook}>{"指示簿"}</Button>
            <Button className={"red-btn"} onClick={this.openDoneInput}>{"実施入力"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )} 
          {this.state.isOpenInstructionBook && (
            <>
            </>
          )}
          {this.state.isOpenDoneInput && (
            <SlipDetail
              closeModal={this.closeModal}
              closeModalAndRefresh={this.props.closeModalAndRefresh}
              patientInfo={this.props.patientInfo}
              treat_date={this.props.treat_date}
              modal_data={this.state.table_list}
            />
          )}
        </Modal>
      </>
    );
  }
}

TreatInjectionSelect.propTypes = {
  closeModal: PropTypes.func,
  closeModalAndRefresh: PropTypes.func,
  modal_data: PropTypes.array,
  treat_date: PropTypes.string,
  patientInfo: PropTypes.object,
};

export default TreatInjectionSelect;
