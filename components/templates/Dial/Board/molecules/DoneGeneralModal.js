import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import renderHTML from 'react-render-html';
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code, sortByTiming, sortTimingCodeMaster, displayInjectionName} from "~/helpers/dialConstants";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .header-title{
    font-size:1.25rem;
    margin-bottom:1.25rem;
  }
  
table {
    thead{
      display:table;
      width:calc(100% - 17px);
    }
    tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 27.5rem);
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
        font-size:0.9rem;
        padding: 0.25rem;
      }
      th {
        font-size:0.9rem;
        position: sticky;
        text-align: center;
        padding: 0.3rem;
      }
      .done_item{
        background-color:rgb(105, 200, 225);
      }
      .not_done_item{
        background-color:lightgrey;
      }
    .no-padding{
      padding:0;
    }
    td label{
      display:none;
    }
    th, td{
      font-size:1rem;
      div{
        margin:0px;
      }
    }
      .table-check {
          width: 4.375rem;
      }
      .item-no {
        width: 3.125rem;
      }
      .code-number {
          width: 14rem;
      }
      .name{
        width:10rem;
        input{
          width:9.5rem;
        }
      }
      .no-result {
      padding: 200px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
 `;

class DoneGeneralModal extends Component {
  constructor(props) {
    super(props);    
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      rows: this.props.done_list,
      selected_row_index:null,
      isCloseConfirmModal:false,
      isSaveConfirmModal:false,
      confirm_message:'',
      confirm_alert_title:'',
      changed_index:[],
      alert_messages:'',      
    };
    this.change_flag = false;
    this.injection_master = sessApi.getObjectValue("dial_common_master","injection_master");
  }

  async componentDidMount() {
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let medicineList = sessApi.getObjectValue("dial_common_master","medicine_master");
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    var timingCodeData = sortTimingCodeMaster(code_master['実施タイミング']);
    var rows = sortByTiming(this.props.done_list, timingCodeData);
    sessApi.setObject('init_done_list', rows);
    this.setState({
      examinationCodeData,
      timingCodeData,
      timing_codes:makeList_code(timingCodeData),
      examination_codes:makeList_code(examinationCodeData),
      medicineList, 
      medicine_list:makeList_code(medicineList),
      rows
    })

    await this.getStaffs();
    await this.setDoctors();
  }

  change_not_done = index => {    
    var temp = this.state.rows;
    var changed_index = this.state.changed_index;
    temp[index].is_completed = 0;
    temp[index].completed_by = 0;
    if (!changed_index.includes(index)) {
      changed_index.push(index);
    }
    this.setState({
      rows:temp,
      selected_row_index:index,
      changed_index
    });
    this.change_flag = true;
  }

  change_done = index => {  
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var temp = this.state.rows;
    var changed_index = this.state.changed_index;
    temp[index].is_completed = 1;
    temp[index].completed_by = authInfo.user_number;    
    if (!changed_index.includes(index)) {
      changed_index.push(index);
    }
    this.setState({
      rows:temp,
      selected_row_index:index,
      changed_index
    })
    this.change_flag = true;
  }

  closeModal = () => {
    this.setState({        
        isShowDoctorList:false,
    })
  }

  showDoctorList = (index) => {
    if (this.state.rows[index].is_completed != 1) return;
    this.setState({
      isShowDoctorList:true,
      selected_row_index:index,
    })
  }
  selectDoctor = (doctor) => {
      var temp = this.state.rows;
      var changed_index = this.state.changed_index;
      temp[this.state.selected_row_index].completed_by = doctor.number;
      if (!changed_index.includes(this.state.selected_row_index)){
        changed_index.push(this.state.selected_row_index);
      }
      this.setState({
        rows:temp,
        changed_index
      });
      this.change_flag = true;
      this.closeModal();
  }

  saveEditedSchedule = () => {
    // var changed_rows = [];
    // this.state.changed_index.map(index => {
    //   changed_rows.push(this.state.rows[index]);
    // })

    // changed_rows = JSON.parse(JSON.stringify(changed_rows));
    this.confirmCancel();
    this.setState({
      alert_messages: '実施状況を登録しました。',
      confirm_alert_title:'登録完了',
    });
    this.props.saveEditedSchedule(this.state.rows, this.props.modal_title);
    sessApi.remove('init_done_list');    
  }

  alertOk = () => {
    this.props.closeModal();
  }

  close = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？',
        confirm_alert_title:'入力中'
      })
    } else {
      this.clsoeThisModal();
    }
  }

  clsoeThisModal = () => {
    this.confirmCancel();
    var init_done_list = sessApi.getObject('init_done_list');
    var rows = this.state.rows;
    rows.map((item, index) => {
      item.is_completed = init_done_list[index].is_completed;
      item.completed_by = init_done_list[index].completed_by;
    })
    this.setState({rows:rows}, () => {
      sessApi.remove('init_done_list');
      this.props.closeModal();      
    });
  }

  confirmCancel = () => {
    this.setState({
      confirm_message:'', 
      isCloseConfirmModal:false,
      isSaveConfirmModal:false,
      confirm_alert_title:'',
      alert_messages:''
    })
  }  

  save = () => {
    if (this.change_flag == false) return;    
    this.setState({
      isSaveConfirmModal:true,
      confirm_message:'実施状況を登録しますか？'      
    })
  }

  getInjectionUnit (code) {
    if (this.injection_master == undefined || this.injection_master == null || this.injection_master.length == 0) return '';
    if (code == undefined || code == null || code == '') return '';
    var inject = this.injection_master.find(x => x.code == code);
    if (inject == undefined) return ''
    var unit = inject.unit;
    if (unit == undefined || unit == null) return '';
    return unit;
}

  onHide=()=>{}

  render() {
    const { modal_title } = this.props;
    let {rows} = this.state;
    let uncompleted_list = this.props.uncompleted_list;    
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal done-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>              
                {modal_title}実施状況一覧
            </Modal.Title>            
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              {uncompleted_list != undefined && uncompleted_list != '' && (
                <div className ='header-title'>
                  {uncompleted_list}の検査は行いましたか？
                </div>
              )}
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>{modal_title}名称</th>
                    {modal_title == '注射' && (
                      <th style={{width:'6rem'}}>数量</th>
                    )}
                    <th className='code-number'>タイミング</th>
                    <th className="name">実施状況</th>
                    <th className="name">実施確認担当者</th>
                    <th className="name">依頼医</th>
                  </tr>
                </thead>
                <tbody>                  
                  {rows.map((item, index) => {
                    if (this.state.timing_codes != undefined && this.state.examination_codes != undefined && this.state.medicine_list != undefined && this.state.staffs != undefined){
                      let name='';
                      var amount_unit = '';
                      switch(modal_title){
                        case '検査':
                          name = this.state.examination_codes[item.examination_code] != undefined?this.state.examination_codes[item.examination_code]:'';
                          break;
                        case '注射':
                          item.data_json.map(val => {
                            name = name + '<div>' + displayInjectionName(val.item_code, val.item_name) + '</div>';
                            amount_unit += '<div>' + val.amount + this.getInjectionUnit(val.item_code) + '</div>';
                          })
                          break;
                        case '透析中処方':
                          name = this.state.medicine_list[item.medicine_code]!=undefined?this.state.medicine_list[item.medicine_code]:'';                          
                          break;
                      }
                      if (this.props.timing != undefined && this.props.timing != null && this.props.timing != ''){
                        var temp = this.state.timingCodeData.filter(x => x.code == item.timing_code);                        
                        if (temp.length > 0 && temp[0].value == this.props.timing){
                          return (
                            <>                          
                              <tr>
                                <td className="text-left">{renderHTML(name)}</td>
                                {modal_title == '注射' && (
                                  <td style={{width:'6rem'}}>{renderHTML(amount_unit)}</td>
                                )}
                                <td className="text-left code-number">{this.state.timing_codes[item.timing_code]}</td>                            
                                {item.is_completed ===1 && (
                                  <td className="text-center done_item name" onClick={() => this.change_not_done(index)}>済</td>
                                )}
                                {item.is_completed ===0 && (
                                  <td className="text-center not_done_item name" onClick={() => this.change_done(index)}>未</td>
                                )}                              
                                <td className = "text-left name" onClick={this.showDoctorList.bind(this, index)}>
                                  {item.completed_by > 0 ? this.state.staff_list_by_number[item.completed_by]:''}                              
                                </td>
                                <td className="text-left name">{(item.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined) ? this.state.doctor_list_by_number[item.instruction_doctor_number] : ''}</td>
                              </tr>
                            </>
                          )
                        }
                      } else {
                        return (
                          <>                          
                            <tr>
                              <td className="text-left">{renderHTML(name)}</td>
                              {modal_title == '注射' && (
                                <td style={{width:'6rem'}}>{renderHTML(amount_unit)}</td>
                              )}
                              <td className="text-left code-number">{this.state.timing_codes[item.timing_code]}</td>                            
                              {item.is_completed ===1 && (
                                <td className="text-center done_item name" onClick={() => this.change_not_done(index)}>済</td>
                              )}
                              {item.is_completed ===0 && (
                                <td className="text-center not_done_item name" onClick={() => this.change_done(index)}>未</td>
                              )}                              
                              <td className = "text-left name" onClick={this.showDoctorList.bind(this, index)}>
                                {item.completed_by > 0 ? this.state.staff_list_by_number[item.completed_by]:''}                              
                              </td>
                              <td className="text-left name">{(item.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined) ? this.state.doctor_list_by_number[item.instruction_doctor_number] : ''}</td>
                            </tr>
                          </>
                        )
                      }
                      
                    }
                  })}
                </tbody>
                </table>
            </Wrapper>
            {this.state.isShowDoctorList && (            
                <DialSelectMasterModal   
                    selectMaster = {this.selectDoctor}
                    closeModal = {this.closeModal}
                    MasterCodeData = {this.state.staffs}
                    MasterName = 'スタッフ'
                />
            )}
            {this.state.isCloseConfirmModal && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.clsoeThisModal}
                  confirmTitle= {this.state.confirm_message}
                  title = {this.state.confirm_alert_title}
              />                   
            )}
            {this.state.isSaveConfirmModal && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.saveEditedSchedule.bind(this)}
                  confirmTitle= {this.state.confirm_message}
              />                   
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button className="cancel-btn" onClick={() =>this.close()}>キャンセル</Button>
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={() =>this.save()}>登録</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.alertOk.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title={this.state.confirm_alert_title}
            />
          )}
        </Modal>
    );
  }
}

DoneGeneralModal.contextType = Context;

DoneGeneralModal.propTypes = {
  done_list: PropTypes.array,
  closeModal:PropTypes.func,
  saveEditedSchedule:PropTypes.func,
  // handleModal:PropTypes.func,
  modal_title:PropTypes.string,
  uncompleted_list:PropTypes.string,
  timing:PropTypes.number,

};

export default DoneGeneralModal;
