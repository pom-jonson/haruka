import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as methods from "../DialMethods";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import { displayLineBreak } from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";
import renderHTML from 'react-render-html';
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import Pagination from "~/components/molecules/Pagination";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const SpinnerWrapper = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  font-size: 1rem;
  width: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  p {
    margin-bottom: 0;
  }
  .history-list {
    width: 100%;
    height: 3.5rem;
    font-size: 1rem;
    .patient-info {
      text-align: left;
    }
    label {
      font-size: 1rem;
    }
    .pullbox-title {
      font-size: 1rem;
      line-height: 1.9rem;
    }
    .pullbox-label, .pullbox-select {
      width: 5rem;
      font-size: 1rem;
      line-height: 1.9rem;
      height: 1.9rem;
    }
    
  }
  .history-content {
    width: 100%;
    font-size:1rem;
    .content-header {
      background: lightblue;
      text-align: left;
      border-top: solid 1px gray;;
      border-bottom: solid 1px gray;;
      label {
        font-size: 1rem;
      }
    }
    .w100{
      width:100%;
      border:1px solid lightgray;
      text-align:left;
    }
    .w50{
      width:50%;
    }
    .content-body {
      overflow-y: scroll;
      height: 39rem;
      border: solid 1px lightgray;
      div {
        word-break: break-all;
      }
      .blue-div {
        color: blue;
      }
      .deleted {
        background-position: 0px 50%;
        color: black;
        text-decoration: none;
        background-image: linear-gradient(rgb(0,0,0), rgb(0,0,0));
        background-repeat: repeat-x;
        background-size: 100% 1px;
      }
      .top-div {
        margin-top: -1.5rem;
       }
    }
    .content-title {
      .left-div {
        width: calc(50% - 8.5px);
      }
      .right-div {
        width: calc(50% + 8.5px);
      }
    }
  }
  .paginate_link {
    width: 3.5rem;
  }
 `;

export class DrConsentModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    this.state = {
      is_loaded : false,
      patientInfo:patientInfo !== undefined && patientInfo != null ? patientInfo : undefined,
      current_page: 1,
      display_number: 20,
      checked_list: [],
      table_data:[],
      confirm_message: "",
      alert_messages: "",
      alert_action: "",
      pageOfItems:null,
      all_check: 0
    };
  }
  
  async UNSAFE_componentWillMount(){
    await this.getDoctors();
    await this.getStaffs();
    await this.getDrKarteStyle();
    await this.getNotConsentedList();
  }
  // getDisplayNumber = e => {
  //   this.setState({display_number: e.target.value});
  // };
  onChangePage(pageOfItems, pager) {
    this.setState({ pageOfItems: pageOfItems, current_page: pager.currentPage });
  }
  
  getNotConsentedList = async(_flag = null) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let params = {
      instruction_doctor_number: authInfo.doctor_number,
    }
    if (this.state.patientInfo !== undefined && this.state.patientInfo.system_patient_id !== undefined) {
      params.system_patient_id = this.state.patientInfo.system_patient_id;
    }
    let path = "/app/api/v2/dial/board/Soap/get_drkarte_consent_list";
    await apiClient._post(path, params)
      .then(res => {
        if (res) {
          let result = [];
          if (res.data.length > 0) {
            res.data.map(item=>{
              if (item.history_data !== undefined && item.history_data != null) {
                item.outputs = this.getHistory(item.history_data);
              }
              result.push(item);
            });
          }
          this.setState({
            table_data: result,
            is_loaded: true
          });
        } else {
          this.setState({
            table_data:[],
            is_loaded: true,
          })
        }
      })
      .catch(()=> {
        this.setState({
          table_data:[],
          is_loaded: true,
        })
      });
  }
  
  getHistory = (res) => {
    let sub_detail = [];
    Object.keys(res.sub_detail).map(key => {
      sub_detail[key] = res.sub_detail[key];
    });
    let history_list = [];
    res.instruction.map((item) => {
      history_list.push({
        number: item.number,
        timeline_number: item.timeline_number,
        body: item.body,
        body_2: item.body_2,
        category_: item.category_,
        category_2: item.category_2,
        instruction_doctor_number: item.instruction_doctor_number,
        updated_by: item.updated_by,
        updated_at: item.updated_at,
        is_doctor_consented: item.is_doctor_consented,
        is_enabled: item.is_enabled,
        relation: item.relation,
      });
    });
    if (res.course != undefined && res.course != null && res.course.length > 0){
      res.course.map(item => {
        history_list.push({
          number: item.number,
          timeline_number: item.timeline_number,
          body: item.body,
          body_2: item.body_2,
          category_: item.category_,
          category_2: item.category_2,
          instruction_doctor_number: item.instruction_doctor_number,
          updated_by: item.updated_by,
          updated_at: item.updated_at,
          is_doctor_consented: item.is_doctor_consented,
          relation: item.relation,
          is_enabled: item.is_enabled,
        })
      })
    }
    let outputs = [];
    if (history_list.length > 0) {
      history_list.map((item)=>{
        if (item.relation != null) {
          let find_index = history_list.findIndex(x=>x.number == item.relation);
          if (find_index > -1) {
            history_list[find_index].relation_data = item;
          }
        }
      })
    }
    
    history_list = history_list.filter(x=>x.relation == null);
    let result = JSON.parse(JSON.stringify(history_list));
    result.reverse();
    result.map((item, index) => {
      item.new = true;
      let prev = undefined;
      let chanage_history = [];
      
      if (index > 0) {
        prev = result[index - 1];
        if (prev.category_2 == item.category_2 && item.category_2 == '経過'){
          if (prev.body != item.body) {
            item.prev_body = prev.body;
            item.new = true;
          } else {
            item.new = false;
          }
        } else {
          if (item.category_2 != '経過' && prev.category_2 != '経過'){
            if (prev.body != item.body) {
              item.prev_body = prev.body;
              item.new = true;
            } else {
              item.new = false;
            }
          }
        }
        if (item.relation_data !== undefined) {
          let prev_relation = result[index - 1].relation_data;
          if (prev_relation !== undefined) {
            if (prev_relation.category_2 == item.relation_data.category_2 && item.relation_data.category_2 == '経過'){
              if (prev_relation.body != item.relation_data.body) {
                item.relation_data.prev_body = prev_relation.body;
                item.relation_data.new = true;
              } else {
                item.relation_data.new = false;
              }
            } else {
              if (item.relation_data.category_2 != '経過' && prev_relation.category_2 != '経過'){
                if (prev_relation.body != item.relation_data.body) {
                  item.relation_data.prev_body = prev_relation.body;
                  item.relation_data.new = true;
                } else {
                  item.relation_data.new = false;
                }
              }
            }
          } else {
            item.relation_data.new = true;
          }
          // if (prev.category_2 == "経過" && item.relation_data.category_2 == "経過" && prev_relation.body == item.relation_data.body) {
          //   item.relation_data.new = false;
          // }
          // if (prev.category_2 != "経過" && item.relation_data.category_2 != "経過" && prev_relation.body == item.relation_data.body) {
          //   item.relation_data.new = false;
          // }
        }
      } else {
        if (item.relation_data !== undefined) {
          item.relation_data.new = true;
        }
      }
      Object.keys(res.sub_detail).map(key => {
        let sub_item = res.sub_detail[key];
        
        if (item.timeline_number == key) {
          item.sub_item = [];
          sub_item.map((change_item, change_index)=>{
            if (change_item.category_2 != "指示" && change_item.category_2 != "経過") {
              chanage_history.push({
                body:change_item.body,
                body_2:change_item.body_2,
                category_1:change_item.category_1,
                category_2:change_item.category_2,
              });
            } else if (change_item.category_2 == "経過") {
              let pass_item = {
                body:change_item.body,
                body_2:change_item.body_2,
                category_1:change_item.category_1,
                category_2:change_item.category_2,
                prev_body: undefined,
                new: true
              };
              if (prev != undefined) {
                let prev_sub_item = res.sub_detail[prev.timeline_number];
                if (prev_sub_item != undefined){
                  if (prev_sub_item[change_index] != undefined && prev_sub_item[change_index].category_2 == "経過") {
                    if (change_item.body != prev_sub_item[change_index].body) {
                      pass_item.prev_body = prev_sub_item[change_index].body;
                      pass_item.new = true;
                    } else {
                      pass_item.new = false;
                    }
                  }
                } else {
                  if (prev.category_2 == '経過'){
                    if (change_item.body != prev.body){
                      pass_item.prev_body = prev.body;
                      pass_item.new = true;
                    } else {
                      pass_item.new = false;
                    }
                  }
                }
              }
              item.sub_item.push(pass_item);
            }
          })
        }
      });
      item.chanage_history = chanage_history;
      outputs.push(item);
    });
    outputs.reverse();
    return outputs;
  }
  
  checkAllRadio = (name, value) => {
    if (name == "all_check") {
      let {table_data} = this.state;
      if (table_data.length == 0) return;
      table_data.map(item=>{
        item.is_checked = value;
      })
      this.setState({all_check: value, table_data});
    }
  }
  getRadio = (name, number) => {
    if (name === "check") {
      let {table_data} = this.state;
      let findIndex = table_data.findIndex(x=>x.number == number);
      if (findIndex > -1) {
        table_data[findIndex].is_checked = table_data[findIndex].is_checked == 1 ? 0 : 1;
      } else {
        findIndex = table_data.findIndex(x=>x.history != null && x.history.includes(number));
        if (findIndex > -1 && table_data[findIndex].outputs !== undefined) {
          let sub_findIndex = table_data[findIndex].outputs.findIndex(x=>x.number == number);
          if (sub_findIndex > -1) {
            table_data[findIndex].outputs[sub_findIndex].is_checked = table_data[findIndex].outputs[sub_findIndex].is_checked == 1 ? 0 : 1;
          }
        }
      }
      this.setState({table_data});
    }
  };
  
  existCheck = () => {
    let {table_data} = this.state;
    if (table_data === undefined || table_data == null || table_data.length == 0) return false;
    let findIndex = table_data.findIndex(x=>x.is_checked == 1);
    let result = false;
    if (findIndex > -1) {
      result = true;
    } else {
      table_data.map(item=>{
        if (item.outputs !== undefined && item.outputs.length > 0) {
          item.outputs.map(sub_item=>{
            if (sub_item.is_checked == 1) result = true;
          })
        }
      });
    }
    return result;
  };
  
  openConfirmModal = () => {
    if (!this.existCheck()) return;
    this.setState({
      confirm_message: "チェックを入れている項目を承認しますか？",
      confirm_title: "承認確認",
      confirm_action: "register"
    });
    this.modalBlack();
  };
  
  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_action: "",
      alert_messages: "",
      alert_action: "",
      confirm_title: ""
    });
    if (this.state.alert_action == "close") {
      this.props.closeModal();
    }
  }
  getDrKarteStyle = async () => {
    let path = "/app/api/v2/management/config/get_drkarte_style";
    await apiClient.post(path).then(res=>{
      this.setState({drkarte_style: res});
    })
  }
  
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action == "register") {
      this.register();
    } else if (this.state.confirm_action == "cancel") {
      this.props.closeModal();
    }
  }
  
  closeModal = () => {
    if (this.existCheck()) {
      this.setState({
        confirm_message: "チェックを入れている項目がありますが、破棄して画面を閉じますか？",
        confirm_title: "注意",
        confirm_action: "cancel"
      });
      this.modalBlack();
      return;
    }
    this.props.closeModal();
  };
  
  register = async () => {
    let post_data = {};
    this.state.table_data.map(item=> {
      if(item.is_checked == 1) {
        let system_patient_id = item.system_patient_id;
        if (post_data[system_patient_id] !== undefined) {
          post_data[system_patient_id].push(item.number)
        } else {
          post_data[system_patient_id] = [item.number];
        }
      }
    });
    this.state.table_data.map(item=>{
      if (item.outputs !== undefined && item.outputs.length > 0) {
        item.outputs.map(sub_item=>{
          if (sub_item.is_checked == 1) {
            let system_patient_id = item.system_patient_id;
            if (post_data[system_patient_id] !== undefined) {
              post_data[system_patient_id].push(sub_item.number)
            } else {
              post_data[system_patient_id] = [sub_item.number];
            }
          }
        })
      }
    });
    let path = "/app/api/v2/dial/board/Soap/consent_drkarte";
    await apiClient._post(path, {params: post_data}).then(()=>{
      this.setState({
        alert_messages: "承認しました。",
        alert_action: "close"
      });
      this.modalBlack();
    })
  }
  getCheckCount = () => {
    let count = 0;
    this.state.table_data.map(item=> {
      if(item.is_checked == 1) count++;
    });
    return count;
  }
  getCurrentCheckCount = () => {
    let count = 0;
    if (this.state.pageOfItems === undefined || this.state.pageOfItems == null || this.state.pageOfItems.length === 0) return "";
    this.state.pageOfItems.map(item=> {
      if(item.is_checked == 1) count++;
    });
    return count;
  }
  modalBlack = () => {
    let base_modal = document.getElementsByClassName("modal-history-drkarte")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
  }
  modalBlackBack = () => {
    let base_modal = document.getElementsByClassName("modal-history-drkarte")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
  }
  
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 80;
    return (pres_array.map(item=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right"}}>{item.right_str}</div>
        </div>
      )
    }))
  }
  IsJsonString = (str) => {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
  
  render() {
    var {doctor_list_by_number, pageOfItems, table_data, staff_list_by_number} = this.state;
    var exist_check = this.existCheck();
    return (
      <Modal show={true} size="lg" className="modal-history-drkarte master-modal">
        <Modal.Header>
          <Modal.Title>Drカルテ・経過/指示承認</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <Wrapper>
              <div className="history-list">
                {this.state.patientInfo !== undefined && this.state.patientInfo.system_patient_id !== undefined && (
                  <div className="patient-info">{this.state.patientInfo.patient_number}：{this.state.patientInfo.patient_name}</div>
                )}
                <div className="d-flex">
                  <Checkbox
                    ref={ref => (this.selectAll = ref)}
                    label="ページ内の全件を選択"
                    getRadio={this.checkAllRadio.bind(this)}
                    value={this.state.all_check}
                    name="all_check"
                  />
                  <div className="ml-2">承認予定：{this.getCheckCount()}　現ページ：{this.state.current_page}/{this.state.display_number}件　承認予定{this.getCurrentCheckCount()}件</div>
                </div>
              </div>
              <div className="history-content">
                <div className="w-100 flex content-title">
                  <div className="left-div text-center border-left border-top border-right border-bottom p-1">経過</div>
                  <div className="right-div text-center border-top border-right border-bottom p-1">指示・処方・処置</div>
                </div>
                <div className="content-body mb-2">
                  {pageOfItems != null && pageOfItems.length > 0 &&
                  pageOfItems.map((item, index) => {
                    return(
                      <>
                        {item.outputs != undefined && item.outputs != null && item.outputs.length > 0 ?
                          item.outputs.map((sub_item, sub_index) => {
                            sub_index = item.outputs.length - sub_index;
                            if (sub_item.is_doctor_consented == 0)
                            return(
                              <>
                                <div className="content-header pl-1" key={index} style={{borderBottom:"none"}}>
                                  <Checkbox
                                    label="選択"
                                    number={sub_item.number}
                                    getRadio={this.getRadio.bind(this)}
                                    value={sub_item.is_checked}
                                    name={"check"}
                                  />
                                  {(this.state.patientInfo === undefined || this.state.patientInfo.system_patient_id === undefined) && (
                                    <span className="mr-3">{item.patient_number}：{item.patient_name}</span>
                                  )}
                                  <span className="mr-3">初版登録：{item.created_at.split('-').join('/')}</span>
                                  <span className="mr-3">初版依頼医：{item.instruction_doctor_number > 0 && doctor_list_by_number[item.instruction_doctor_number] !== undefined ? doctor_list_by_number[item.instruction_doctor_number] : ""}</span>
                                </div>
                                <div className="content-header pl-1">
                                  <span className="mr-3">{sub_index == 1 ? "初版" : parseInt(sub_index).toString() + "版"}</span>
                                  <span className="mr-3">{sub_index == 1 ? "新規" : "修正"}</span>
                                  <span className="mr-3">{sub_item.updated_at.split('-').join('/')}</span>
                                  <span className="mr-3">
                                  {doctor_list_by_number[sub_item.instruction_doctor_number]}
                                    {sub_item.updated_by != null && staff_list_by_number[sub_item.updated_by]!= doctor_list_by_number[sub_item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[sub_item.updated_by])}
                                  </span>
                                </div>
                                <div className='w100 flex'>
                                  <div className='w50' style={{borderRight:'1px solid lightgray'}}>
                                    {sub_item.category_2 == '経過' && (
                                      <>
                                        <div className={`m-1 ${sub_item.new == true ? 'blue-div' : ''}`}>{renderHTML(sub_item.body)}</div>
                                        {sub_item.prev_body != undefined && sub_item.prev_body != "" && (
                                          <del className='m-1 deleted'>{renderHTML(sub_item.prev_body)}</del>
                                        )}
                                      </>
                                    )}
                                    {sub_item.category_2 != '経過' && sub_item.sub_item != undefined && sub_item.sub_item != null && sub_item.sub_item.length > 0 && sub_item.sub_item.map((pass_item) => {
                                      return(
                                        <>
                                          <div className={`m-1 ${pass_item.new == true ? 'blue-div' : ''}`}>{pass_item.category_2 == '経過' && renderHTML(pass_item.body)}</div>
                                          {pass_item.prev_body != undefined && pass_item.prev_body != "" && (
                                            <del className='m-1 deleted'>{renderHTML(pass_item.prev_body)}</del>
                                          )}
                                        </>
                                      )
                                    })}
                                    {sub_item.relation_data !== undefined && sub_item.relation_data.category_2 == "経過" && (
                                      <>
                                        <div className={`m-1 ${sub_item.relation_data.new == true ? 'blue-div' : ''}`}>{renderHTML(sub_item.relation_data.body)}</div>
                                      </>
                                    )}
                                  </div>
                                  <div className='w50'>
                                    {sub_item.category_2 !='経過' && (
                                      <>
                                        <div className={`m-1 ${sub_item.new == true ? 'blue-div' : ''}`}>
                                          {this.IsJsonString(sub_item.body) ? (
                                            <div>{this.prescriptionRender(JSON.parse(sub_item.body))}</div>
                                          ):(
                                            <div style={{clear:'both'}}>{renderHTML(sub_item.body)}</div>
                                          )}
                                        </div>
                                        {sub_item.prev_body != undefined && sub_item.prev_body != "" && (
                                          <del className='m-1 deleted'>
                                            {this.IsJsonString(sub_item.prev_body) ? (
                                              <div>{this.prescriptionRender(JSON.parse(sub_item.prev_body))}</div>
                                            ):(
                                              <>{renderHTML(sub_item.prev_body)}</>
                                            )}
                                          </del>
                                        )}
                                        {sub_item.chanage_history != undefined && sub_item.chanage_history != null && sub_item.chanage_history.length > 0 && sub_item.chanage_history.map((change_item, change_key) => {
                                          return(
                                            <div className='m-1' key={change_key}>
                                              {this.IsJsonString(change_item.body) ? (
                                                <div>{this.prescriptionRender(JSON.parse(change_item.body))}</div>
                                              ):(
                                                <div style={{clear:'both'}}>{displayLineBreak(change_item.body)}</div>
                                              )}
                                            </div>
                                          )
                                        })}
                                        {sub_item.relation_data !== undefined && sub_item.relation_data.category_2 == "指示" && (
                                          <>
                                            <div className={`m-1 ${sub_item.relation_data.new == true ? 'blue-div' : ''}`}>{renderHTML(sub_item.relation_data.body)}</div>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            )
                          }) : (
                            <>
                              <div className="content-header pl-1" key={index} style={{borderBottom:"none"}}>
                                <Checkbox
                                  label="選択"
                                  number={item.number}
                                  getRadio={this.getRadio.bind(this)}
                                  value={item.is_checked}
                                  name={"check"}
                                />
                                {(this.state.patientInfo === undefined || this.state.patientInfo.system_patient_id === undefined) && (
                                  <span className="mr-3">{item.patient_number}：{item.patient_name}</span>
                                )}
                                <span className="mr-3">初版登録：{item.created_at.split('-').join('/')}</span>
                                <span className="mr-3">初版依頼医：{item.instruction_doctor_number > 0 && doctor_list_by_number[item.instruction_doctor_number] !== undefined ? doctor_list_by_number[item.instruction_doctor_number] : ""}</span>
                              </div>
                              <div className="content-header pl-1">
                                <span className="mr-3">初版</span>
                                <span className="mr-3">新規</span>
                                <span className="mr-3">{item.created_at.split('-').join('/')}</span>
                                <span className="mr-3">
                                  {doctor_list_by_number[item.instruction_doctor_number]}
                                  {item.created_by != null && staff_list_by_number[item.created_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.created_by])}
                                  </span>
                              </div>
                              <div className='w100 flex'>
                                <div className='w50' style={{borderRight:'1px solid lightgray'}}>
                                  {item.course != null && (
                                    <>
                                      <div className={`m-1 ${item.new == true ? 'blue-div' : ''}`}>{renderHTML(item.course.body)}</div>
                                    </>
                                  )}
                                </div>
                                <div className='w50'>
                                  {item.instruction != null && (
                                    <>
                                      <div className={`m-1 ${item.new == true ? 'blue-div' : ''}`}>{renderHTML(item.instruction.body)}</div>
                                    </>
                                  )}
                                  {item.other_change != undefined && item.other_change != null && item.other_change.length > 0 && item.other_change.map((change_item, change_key) => {
                                    return(
                                      <div className='m-1' key={change_key}>
                                        {this.IsJsonString(change_item.body) ? (
                                          <div>{this.prescriptionRender(JSON.parse(change_item.body))}</div>
                                        ):(
                                          <>{displayLineBreak(change_item.body)}</>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                      </>
                    )
                  })
                  }
                </div>
                <Pagination
                  items={table_data}
                  onChangePage={this.onChangePage.bind(this)}
                  pageSize={parseInt(this.state.display_number)}
                />
              </div>
            </Wrapper>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal} className="cancel-btn">キャンセル</Button>
          <Button onClick={this.openConfirmModal} className={exist_check?"red-btn":"disable-btn"}>承認</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}
DrConsentModal.contextType = Context;

DrConsentModal.propTypes = {
  closeModal: PropTypes.func,
};

export default DrConsentModal;