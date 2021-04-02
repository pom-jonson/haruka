import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import {formatJapanDateSlash} from "~/helpers/date";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import {displayLineBreak} from "~/helpers/dialConstants";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .flex {display:flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .select-karte-status {
    display:flex;
    margin-left: 0.5rem;
    label {
      font-size:1rem;
      line-height:2rem;
    }
  }
  .history-list {
    width: 100%;
    table {
      thead{
        display:table;
        width:100%;
      }
      tbody{
        display:block;
        overflow-y: auto;
        height: 10rem;
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
      }
      .check {
        width: 2rem;
        label {
          margin-right: 0;
          input {margin-right: 0;}
        }
      }
      .date {width: 12rem;}
      .version {width: 3rem;}
      .order-title {width: 15rem;}
      .department {width: 10rem;}
    }
  }
  .seal-area {
    margin-top:0.5rem;
    width:100%;
    height:calc(100% - 16rem);
    padding:0.2rem;
    border:1px solid black;
    font-family: MS Gothic,monospace;
    overflow-y:auto;
  }
 `;

export class KarteSealPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      order_list: [],
      seal_list: [],
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      complete_message:"",
      alert_messages:"",
      karte_status_1:props.from_mode === "visit_treatment_schedule_list" ? 0 : 1,
      karte_status_2:1,
      karte_status_3:props.from_mode === "visit_treatment_schedule_list" ? 0 : 1,
      multiple_print_mode:1,
      patient_number_name:"",
      same_place_karte:1,
      tree_date_name:"",
    };
    this.order_list = [];
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[department.id] = department.value;
    });
  }
  
  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/karte/tree/get/seal_data";
    await apiClient
      .post(path, {
        patient_id:this.props.search_condition.patient_id,
        patient_number:this.props.search_condition.patient_number,
        patient_name:this.props.search_condition.patient_name,
        medical_department_code:this.props.search_condition.department_id,
        enable_flag: 1,
        date:this.props.search_condition.date,
        karte_view_mode:'date',
        search_mode:'seal_print',
      })
      .then((res) => {
        this.order_list = res.order_list;
        let multiple_print_mode = res.multiple_print_mode;
        let seal_list = [];
        let order_list = [];
        let same_place_karte = 1;
        let cur_place_karte = "";
        if(res.order_list.length > 0){
          res.order_list.map(item=>{
            if((item.karte_status == 1 && this.state.karte_status_1) || (item.karte_status == 2 && this.state.karte_status_2) || (item.karte_status == 3 && this.state.karte_status_3)){
              order_list.push(item);
              if(item.history_show == 1){
                if(cur_place_karte == ""){cur_place_karte = item.place_karte_name;}
                if(multiple_print_mode == 0 && same_place_karte == 1 && cur_place_karte != item.place_karte_name){
                  same_place_karte = 0;
                  cur_place_karte = item.place_karte_name;
                }
                seal_list.push({text:item.text, place_karte_name:item.place_karte_name});
              }
            }
          });
        }
        this.setState({
          load_flag:true,
          order_list,
          seal_list,
          multiple_print_mode,
          patient_number_name:res.patient_number_name,
          same_place_karte,
          tree_date_name:res.tree_date_name,
        });
      })
      .catch(() => {
      });
  }
  
  setCheckState =(name, number)=>{
    if(name == "history_show"){
      let order_list = [];
      let seal_list = [];
      let same_place_karte = 1;
      let cur_place_karte = "";
      this.order_list.map(item=>{
        if(item.number == number){
          item.history_show = item.history_show == 0 ? 1 : 0;
        }
        if((item.karte_status == 1 && this.state.karte_status_1) || (item.karte_status == 2 && this.state.karte_status_2) || (item.karte_status == 3 && this.state.karte_status_3)){
          order_list.push(item);
          if(item.history_show == 1){
            if(cur_place_karte == ""){cur_place_karte = item.place_karte_name;}
            if(this.state.multiple_print_mode == 0 && same_place_karte == 1 && cur_place_karte != item.place_karte_name){
              same_place_karte = 0;
              cur_place_karte = item.place_karte_name;
            }
            seal_list.push({text:item.text, place_karte_name:item.place_karte_name});
          }
        }
      });
      this.setState({order_list, seal_list, same_place_karte});
    }
  };
  
  getHistoryInfo=(history)=>{
    let history_arr = history == null ? [] : history.split(',');
    let history_length = history_arr.length == 0 ? 1 : history_arr.length;
    return ((history_length > 9) ? history_length : "0"+history_length)+"版 ";
  }
  
  confirmSealPrint=()=>{
    this.setState({
      confirm_type:"print",
      confirm_title:"印刷確認",
      confirm_message:"印刷を実行しますか？",
    });
  }
  
  sealPrint=async()=>{
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      complete_message:"印刷中",
    });
    let path = "/app/api/v2/print_haruka/seal_printer/date";
    let karte_numbers = [];
    this.state.order_list.map(item=>{
      if(item.history_show == 1 && item.print_status != 2){
        karte_numbers.push(item.number);
      }
    });
    apiClient
      .post(path, {
        karte_numbers,
        seal_data:this.state.seal_list,
        patient_number:this.props.search_condition.patient_number,
        patient_name:this.props.search_condition.patient_name,
        multiple_print_mode:this.state.multiple_print_mode,
        same_place_karte:this.state.same_place_karte,
        tree_date_name:this.state.tree_date_name,
        patient_number_name:this.state.patient_number_name,
      })
      .then((res) => {
        this.setState({
          complete_message: "",
          confirm_type: "modal_close",
          alert_messages: res.alert_message,
        });
      })
      .catch(() => {
      });
  
  }
  
  closeModal=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal('save');
    }
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      alert_messages:"",
    });
  }
  
  setKarteStatus=(name, value) => {
    let order_list = [];
    let seal_list = [];
    let karte_status_1 = name === "karte_status_1" ? value : this.state.karte_status_1;
    let karte_status_2 = name === "karte_status_2" ? value : this.state.karte_status_2;
    let karte_status_3 = name === "karte_status_3" ? value : this.state.karte_status_3;
    let same_place_karte = 1;
    let cur_place_karte = "";
    this.order_list.map(item=>{
      if((item.karte_status == 1 && karte_status_1) || (item.karte_status == 2 && karte_status_2) || (item.karte_status == 3 && karte_status_3)){
        order_list.push(item);
        if(item.history_show == 1){
          if(cur_place_karte == ""){cur_place_karte = item.place_karte_name;}
          if(this.state.multiple_print_mode == 0 && same_place_karte == 1 && cur_place_karte != item.place_karte_name){
            same_place_karte = 0;
            cur_place_karte = item.place_karte_name;
          }
          seal_list.push({text:item.text, place_karte_name:item.place_karte_name});
        }
      }
    });
    this.setState({
      [name]: value,
      order_list,
      seal_list,
      same_place_karte
    });
  }

  render() {
    let seal_list_length = this.state.seal_list.length;
    return (
      <Modal show={true} size="lg" className="modal-history-inspection first-view-modal">
        <Modal.Header><Modal.Title>シール印刷プレビュー</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'select-karte-status'}>
              <Checkbox
                label="外来"
                getRadio={this.setKarteStatus.bind(this)}
                value={this.state.karte_status_1}
                name="karte_status_1"
              />
              <Checkbox
                label="入院"
                getRadio={this.setKarteStatus.bind(this)}
                value={this.state.karte_status_3}
                name="karte_status_3"
              />
              <Checkbox
                label="訪問診療"
                getRadio={this.setKarteStatus.bind(this)}
                value={this.state.karte_status_2}
                name="karte_status_2"
              />
            </div>
            <div className={'flex justify-content'} style={{fontWeight:"bold"}}>
              <div>
                {formatJapanDateSlash(this.props.search_condition.date)}
                {this.props.search_condition.department_id !== undefined ? this.department_names[this.props.search_condition.department_id] : ""}
              </div>
              <div>{this.props.search_condition.patient_number}：{this.props.search_condition.patient_name}</div>
            </div>
            <div className="history-list">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="check"> </th>
                    <th className="version">版数</th>
                    <th className="department">診療科</th>
                    <th className="order-title">種類</th>
                    <th className="date">登録日時</th>
                    <th className="">登録者・依頼医</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.load_flag ? (
                  <>
                    {this.state.order_list.length > 0 &&
                      this.state.order_list.map((item) => {
                        return (
                          <>
                            <tr>
                              <td className="text-center check">
                                <Checkbox
                                  getRadio={this.setCheckState.bind(this)}
                                  value={item.history_show}
                                  number={item.number}
                                  name="history_show"
                                />
                              </td>
                              <td className="version">{this.getHistoryInfo(item.history)}</td>
                              <td className="department">{item.department_name}</td>
                              <td className={'order-title'}>{item.order_title}</td>
                              <td className="date">{item.treatment_datetime}</td>
                              <td className="text-left">{item.created_name}</td>
                            </tr>
                          </>
                        );
                    })}
                  </>
                ):(
                  <tr>
                    <td colSpan={'5'} style={{height:"9.9rem"}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
            <div className={'seal-area'}>
              {this.state.load_flag ? (
                <>
                  {this.state.seal_list.length > 0 && (
                    <>
                      {this.state.same_place_karte == 1 && (
                        <div>{displayLineBreak(this.state.seal_list[0]['place_karte_name'])}</div>
                      )}
                      {this.state.multiple_print_mode == 0 && (
                        <>
                          <div>{displayLineBreak(this.state.tree_date_name)}</div>
                          <div>{displayLineBreak(this.state.patient_number_name)}</div>
                          <div>{"".padStart(50, "=")}</div>
                        </>
                      )}
                      {this.state.seal_list.map((item, index)=>{
                          return (
                            <>
                              {this.state.same_place_karte == 0 && (
                                <div>{displayLineBreak(item['place_karte_name'])}</div>
                              )}
                              <div>{displayLineBreak(item['text'])}</div>
                              {(index !== (seal_list_length - 1)) && (
                                <div>{"".padStart(50, "=")}</div>
                              )}
                            </>
                          )
                        })
                      }
                    </>
                  )}
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {this.state.seal_list.length > 0 ? (
            <div onClick={this.confirmSealPrint} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>印刷</span></div>
          ):(
            <OverlayTrigger
              placement={"top"}
              overlay={renderTooltip("印刷対象が選択されていません。")}
            >
              <div className={"custom-modal-btn disable-btn"}><span>印刷</span></div>
            </OverlayTrigger>
          )}
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.sealPrint}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}

KarteSealPrint.contextType = Context;

KarteSealPrint.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  historySoapList: PropTypes.array,
  search_condition: PropTypes.object,
  from_mode: PropTypes.string,
};
export default KarteSealPrint;