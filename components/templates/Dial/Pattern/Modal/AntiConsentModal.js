import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as methods from "../../DialMethods";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import { getWeekday } from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";
// import renderHTML from 'react-render-html';
// import { CACHE_SESSIONNAMES} from "~/helpers/constants";
// import * as sessApi from "~/helpers/cacheSession-utils";
// import {PER_PAGE} from "~/helpers/constants";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
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
  float: left;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  p {
    margin-bottom: 0;
  }
  .history-list {
    width: 100%;
    height:4rem;
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

export class AntiConsentModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    var patientInfo = this.props.patientInfo;
    this.state = {
      is_loaded : false,
      patientInfo:patientInfo !== undefined && patientInfo != null ? patientInfo : undefined,
      current_page: 1,
      display_number: 10,
      checked_list: [],
      table_data:[],
      confirm_message: "",
      alert_messages: "",
      alert_action: "",
      pageOfItems:null,
      all_check: 0
    };
  }
  
  async componentDidMount(){
    await this.getDoctors();
    await this.getStaffs();
    await this.getNotConsentedList();
  }
  
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
    let path = "/app/api/v2/dial/pattern/get_anti_consent_list";
    await apiClient._post(path, params)
    .then(res => {
      if (res) {
        this.setState({
          table_data: res,
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
  
  checkAllRadio = (name, value) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (name == "all_check") {
      let {table_data} = this.state;
      if (table_data.length == 0) return;
      table_data.map(item=>{
        if (item.is_doctor_consented == 0 && item.instruction_doctor_number == authInfo.doctor_number) item.is_checked = value;
        if (item.history_data != null){
          item.history_data.map(history_item => {
            if (history_item.is_doctor_consented == 0 && history_item.instruction_doctor_number == authInfo.doctor_number) history_item.is_checked = value;
          })
        }
      })
      this.setState({all_check: value, table_data});
    }
  }
  getRadio = (index, name, number) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));    
    if (name === "check") {
      var all_check = true;
      let {table_data, pageOfItems} = this.state;
      var findIndex = '';
      findIndex = table_data.findIndex(x=>x.number == number);      
      if (findIndex > -1) {
        table_data[findIndex].is_checked = table_data[findIndex].is_checked == 1 ? 0 : 1;
      }
      if (pageOfItems[index].history_data != null){
        findIndex = pageOfItems[index].history_data.findIndex(x=>x.number == number);        
        if (findIndex > -1) {          
          pageOfItems[index].history_data[findIndex].is_checked = pageOfItems[index].history_data[findIndex].is_checked == 1 ? 0 : 1;
        }  
      }
      
      table_data.map(item => {
        if (item.is_doctor_consented == 0 && item.instruction_doctor_number == authInfo.doctor_number) {
          if (item.is_checked != true) {            
            all_check = false;
          }
        }
        if (item.history_data != null){
          item.history_data.map(history_item => {
            if (history_item.is_doctor_consented == 0 && history_item.instruction_doctor_number == authInfo.doctor_number) {
              if (history_item.is_checked != true) {                
                all_check = false;
              }
            }
          })
        }
      })
      this.setState({
        table_data,
        all_check
      });
    }
  };


  existCheck = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let {table_data} = this.state;
    if (table_data === undefined || table_data.length == 0) return false;
    let findIndex = table_data.findIndex(x=>x.is_checked == 1 && x.is_doctor_consented == 0 && x.instruction_doctor_number == authInfo.doctor_number);
    if (findIndex > -1) return true;
    var res = false;
    table_data.map(item => {
      if (item.history_data != null){
        findIndex = item.history_data.findIndex(x=>x.is_checked == 1 && x.is_doctor_consented == 0 && x.instruction_doctor_number == authInfo.doctor_number);
        if (findIndex > -1) res = true;
      }
    })
    return res;
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
      if (item.history_data != null){
        item.history_data.map(history_item => {
          if (history_item.is_checked == 1){
            let system_patient_id = history_item.system_patient_id;
            if (post_data[system_patient_id] !== undefined) {
              post_data[system_patient_id].push(history_item.number)
            } else {
              post_data[system_patient_id] = [history_item.number];
            }
          }
        })
      }
    });
    let path = "/app/api/v2/dial/pattern/consent_anti";
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
    var table_data = this.state.table_data;
    if (table_data == undefined || table_data == null || table_data.length == 0) return count;
    table_data.map(item=> {
      if(item.is_checked == 1) count++;
      if (item.history_data != null){
        item.history_data.map(history_item => {
          if (history_item.is_checked == 1 && history_item.number != item.number) count++;
        })
      }
    });
    return count;
  }
  getCurrentCheckCount = () => {
    let count = 0;
    if (this.state.pageOfItems === undefined || this.state.pageOfItems == null || this.state.pageOfItems.length === 0) return "";
    this.state.pageOfItems.map(item=> {
      if(item.is_checked == 1) count++;
      if (item.history_data != null){
        item.history_data.map(history_item => {
          if (history_item.is_checked == 1 && history_item.number != item.number) count++;
        })
      }
    });
    return count;
  }
  modalBlack = () => {
    let base_modal = document.getElementsByClassName("modal-history-drkarte")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
  }  

  getInDetailItems = (code, data) => {    
    if (data == undefined || data.pattern == undefined || data.pattern.length == 0) return false;
    var item_data = data.pattern;
    var index = item_data.findIndex(x => x.code == code);
    if (index == -1) return false;
    return item_data[index];
  }

  render() {
    var {doctor_list_by_number,staff_list_by_number, pageOfItems, table_data} = this.state;
    var exist_check = this.existCheck();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    return (
      <Modal show={true} size="lg" className="modal-history-drkarte master-modal">
        <Modal.Header>
          <Modal.Title>抗凝固法パターン承認</Modal.Title>
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
                <div className="ml-2">承認予定：{this.getCheckCount()}</div>
                <div className="ml-2">現ページ：{this.state.current_page}/{this.state.display_number}件　承認予定{this.getCurrentCheckCount()}件</div>
              </div>
            </div>
            <div className="history-content">
              <div className="content-body">
                {pageOfItems != null && pageOfItems.length > 0 &&
                pageOfItems.map((item, index) => {
                  var history_data = item.history_data != null?item.history_data:[item];
                  var first_item = history_data[history_data.length-1];
                  return(
                    <>
                      <div className="content-header pl-1" key={index}>                        
                        {(this.state.patientInfo === undefined || this.state.patientInfo.system_patient_id === undefined) && (
                          <span className="mr-3">{item.patient_number}：{item.patient_name}</span>
                        )}
                        <span className="mr-3">初版登録：{item.created_at.split('-').join('/')}</span>
                        <span className="mr-3">初版依頼医：{first_item.instruction_doctor_number > 0 && doctor_list_by_number[first_item.instruction_doctor_number] !== undefined ? doctor_list_by_number[first_item.instruction_doctor_number] : ""}</span>
                      </div>
                      <div className='w100' style={{marginBottom:'1.5rem'}}>
                        {history_data != undefined && history_data != null && history_data.length > 0 && (
                          history_data.map((history_item, history_index) => {
                            var prev_data = history_data[history_index + 1];
                            history_index = history_data.length - history_index;
                            var pattern_name_changed = (prev_data != undefined && item.pattern_title != prev_data.pattern_title);
                            if (history_item.is_doctor_consented == 0 && history_item.instruction_doctor_number == authInfo.doctor_number){
                              return(
                                <>
                                <div className="content-header pl-1">
                                  <Checkbox
                                    label="選択"
                                    number={item.number}
                                    getRadio={this.getRadio.bind(this, index)}
                                    value={item.is_checked}
                                    name={"check"}
                                  />
                                  <span className="mr-3">{history_index == 1 ? "初版" : parseInt(history_index).toString() + "版"}</span>
                                  <span className="mr-3">{history_index == 1 ? "新規" : "修正"}</span>                            
                                  <span className="mr-3">{item.updated_at.split('-').join('/')}</span>
                                  <span className="mr-3">
                                    {doctor_list_by_number[item.instruction_doctor_number]}
                                    {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}
                                  </span>
                                </div>
                                <div className='content-main'>
                                  <div className={'w100'}>
                                    <div className={(history_index == 1 || pattern_name_changed)?'w100 blue-div':'w100'}>
                                      {history_item.pattern_title}
                                    </div>
                                    {pattern_name_changed && (
                                      <>
                                      <del>{prev_data.pattern_title}</del>
                                      </>
                                    )}
                                  </div>
                                  {history_item.pattern.map((pattern_item, item_index) => {
                                    var detail_item_in_prev = this.getInDetailItems(pattern_item.item_code, prev_data);
                                    var deleted_detail_items = [];
                                    if (pattern_name_changed != true && prev_data != undefined && prev_data.pattern != undefined && prev_data.pattern != null){
                                      prev_data.pattern.map(prev_pattern_item => {
                                        if (item.pattern.findIndex(x => x.code == prev_pattern_item.code) == -1) deleted_detail_items.push(prev_pattern_item);
                                      })
                                    }
                                    return(
                                      <>
                                      <div className={'w100 flex ' + (history_index == 1?'blue-div':'')}>
                                        <div style={{width:'80%', borderRight:'1px solid lightgray'}}>
                                          <div className={(pattern_name_changed != true && detail_item_in_prev != false) ? (deleted_detail_items[item_index] != undefined?'blue-div':'') : 'blue-div'}>
                                            {pattern_item.name}
                                          </div>
                                          {deleted_detail_items[item_index] != undefined && (
                                            <del>{deleted_detail_items[item_index].name}</del>
                                          )}
                                        </div>
                                        <div className='text-right' style={{width:'10%', borderRight:'1px solid lightgray'}}>
                                          <div className={(pattern_name_changed != true && detail_item_in_prev != false) ? (detail_item_in_prev.amount != pattern_item.amount?'blue-div':'') : 'blue-div'}>
                                            {pattern_item.amount}
                                          </div>
                                          {pattern_name_changed != true && detail_item_in_prev != false && detail_item_in_prev.amount != pattern_item.amount && (
                                            <del>{detail_item_in_prev.amount}</del>
                                          )}
                                        </div>
                                        <div style={{width:'10%'}}>
                                          <div className={(pattern_name_changed != true && detail_item_in_prev != false) ? (detail_item_in_prev.unit != pattern_item.unit?'blue-div':'') : 'blue-div'}>{pattern_item.unit}</div>
                                          {pattern_name_changed != true && detail_item_in_prev != false && detail_item_in_prev.unit != pattern_item.unit && (
                                            <del>{detail_item_in_prev.unit}</del>
                                          )}
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })}
                                  <div className={'w100'}>
                                    <div className={(history_index == 1 || (prev_data != undefined && history_item.weekday != prev_data.weekday))?'w100 blue-div':'w100'}>
                                      {getWeekday(history_item.weekday).join('・')}
                                    </div>
                                    {prev_data != undefined && history_item.weekday != prev_data.weekday && (
                                      <>
                                      <del>{getWeekday(prev_data.weekday).join('・')}</del>
                                      </>
                                    )}
                                  </div>
                                  <div className={'w100'}>
                                    <div className={(history_index == 1 || (prev_data != undefined && (history_item.time_limit_to != prev_data.time_limit_to || history_item.time_limit_from != prev_data.time_limit_from)))?'w100 blue-div':'w100'}>
                                      {history_item.time_limit_from}～{history_item.time_limit_to != null?history_item.time_limit_to:'無期限'}
                                    </div>
                                    {prev_data != undefined && (history_item.time_limit_to != prev_data.time_limit_to || history_item.time_limit_from != prev_data.time_limit_from) && (
                                      <>
                                      <del>{prev_data.time_limit_from}～{prev_data.time_limit_to != null?prev_data.time_limit_to:'無期限'}</del>
                                      </>
                                    )}
                                  </div>
                                </div>
                                </>
                              )
                            }
                          })
                        )}
                      </div>
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
AntiConsentModal.contextType = Context;

AntiConsentModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo:PropTypes.object,
};

export default AntiConsentModal;