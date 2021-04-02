import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 64vh;
  flex-direction: column;
  display: flex;
  text-align: center;
  overflow-y: auto;
  .search_type {
    font-size: 12px;
      margin-top: 5px;
      display: flex;

      .radio-btn {
        margin-right: 10px;
        width: 125px;
        label{
          width: 100%;
          border: solid 1px rgb(206, 212, 218);
          border-radius: 4px;
          margin-left: 5px;
        }
      }
    }
    .kind {
      .radio-btn {
        width: 80px;
      }
    }
    .patient-list {
      border: solid 1px rgb(206,212,218);
     }
     .search-box {
    input {
     width: 266px;
     margin-left: -24px;
    }
   }

  ul {
    padding-inline-start: 20px;
    li {

      span.medovername {
        display: inline-block;
        width: 240px;
      }
      span.btn {                                           
        display: inline;
        button {
          padding: 2px;
        }
      }
      span.chk {
        color: green;
      }
      .usage-permission-allow{
        background-color: #ffffcc; 
      }
      .usage-permission-reject{
        background-color: #ffddcc; 
      }

    }
  }

  .done_item{
    background-color:rgb(105, 200, 225);
  }
  .not_done_item{
    background-color:lightgrey;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    width:100%;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      padding-left: 60px;
      padding-right: 60px;    
    }
    .add-button {
      text-align: center;
      button{
        margin-right:20px;
      }      
    }
    span {
      color: white;
      font-size: 16px;
      letter-spacing: 7px;
      margin-left:4px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}
td label{
  display:none;
}
th, td{
  font-size:17px;
  padding: 8px;
}
 `;

class DonePrescriptionModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    // let prescriptionInfo = this.props.done_list;
    // let temporary_rows = []
    // let regular_rows = []
    // if (prescriptionInfo !== undefined || prescriptionInfo != null){
    //     temporary_rows = prescriptionInfo.filter(item=>{
    //         if (item.regular_prescription_number === 0) {
    //             return item;
    //         }
    //     });

    //     regular_rows = prescriptionInfo.filter(item=>{
    //         if (item.regular_prescription_number !== 0) {
    //             return item;
    //         }
    //     });
    // }
    this.state={
      isShowDoctorList:false,
        // temporary_rows,
        // regular_rows,
      isCloseConfirmModal:false,
      isSaveConfirmModal:false,
      confirm_message:'',
      confirm_alert_title:'',
      changed_numbers:[],
    }
    this.change_flag = false;
  }

  async componentDidMount () {
      await this.getStaffs();
      await this.setDoctors();
      let prescriptionInfo = this.props.done_list;
      if (prescriptionInfo === undefined || prescriptionInfo == null) return;
      let temporary_rows = prescriptionInfo.filter(item=>{
          if (item.regular_prescription_number === 0) {
              return item;
          }
      });

      let regular_rows = prescriptionInfo.filter(item=>{
          if (item.regular_prescription_number !== 0) {
              return item;
          }
      });
      sessApi.setObject('init_temp_list', temporary_rows);
      sessApi.setObject('init_regular_list', regular_rows);
      this.setState({
          temporary_rows,
          regular_rows,
      })
  }

  change_not_done = (index, is_temp) => {
      var changed_numbers = this.state.changed_numbers;
      if(is_temp){
        var regluar = this.state.regular_rows;
        regluar[index].is_completed = 0;
        regluar[index].staff = '';
        regluar[index].completed_by = null;
        if (!changed_numbers.includes(regluar[index].schedule_number)){
          changed_numbers.push(regluar[index].schedule_number);
        }
        this.setState({
            regular_rows:regluar,
            changed_numbers
        });
      } else {
        var temp = this.state.temporary_rows;        
        temp[index].is_completed = 0;
        temp[index].staff = '';
        temp[index].completed_by = null;
        if (!changed_numbers.includes(temp[index].schedule_number)){
          changed_numbers.push(temp[index].schedule_number);
        }
        this.setState({
          temporary_rows:temp,
          changed_numbers
        });
      }
      this.change_flag = true;
  }

  change_done = (index, is_temp) => {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      var changed_numbers = this.state.changed_numbers;
      if(is_temp){
          var regluar = this.state.regular_rows;
          regluar[index].is_completed = 1;
          regluar[index].staff = '';
          regluar[index].completed_by = authInfo.user_number;
          if (!changed_numbers.includes(regluar[index].schedule_number)){
            changed_numbers.push(regluar[index].schedule_number);
          }
          this.setState({
              regular_rows:regluar
          })
      } else {
          var temp = this.state.temporary_rows;
          temp[index].is_completed = 1;
          temp[index].staff = '';
          temp[index].completed_by = authInfo.user_number;
          if (!changed_numbers.includes(temp[index].schedule_number)){
            changed_numbers.push(temp[index].schedule_number);
          }
          this.setState({
              temporary_rows:temp
          })
      }
      this.change_flag = true;
  }

  saveEditedSchedule = () => {
      let rows = [];
      var changed_numbers = this.state.changed_numbers;
      if (this.state.temporary_rows.length>0) {
        this.state.temporary_rows.map(item =>{
          if (changed_numbers.includes(item.schedule_number)) rows.push(item);
        })
      }
      if (this.state.regular_rows.length>0) {
        this.state.regular_rows.map(item =>{
          if (changed_numbers.includes(item.schedule_number)) rows.push(item);
        })
      }
      // rows = JSON.parse(JSON.stringify(rows));
      window.sessionStorage.setItem("alert_messages",  "登録完了##" + "実施状況を登録しました。");
      this.props.saveEditedSchedule(rows, this.props.modal_title);
      this.props.closeModal();
      sessApi.remove('init_temp_list');
      sessApi.remove('init_regular_list');
  }
  closeModal = () => {
    this.setState({isShowDoctorList:false})
  }

  selectDoctor = (doctor) => {
    var changed_numbers = this.state.changed_numbers;
    var temp;
    if (this.selected_type == 0){
      temp = this.state.temporary_rows;
      temp[this.state.selected_row_index].completed_by = doctor.number;
      if (!changed_numbers.includes(temp[this.state.selected_row_index].schedule_number)){
        changed_numbers.push(temp[this.state.selected_row_index].schedule_number);
      }
      this.setState({temporary_rows:temp, changed_numbers})
    } else {
      temp = this.state.regular_rows;
      temp[this.state.selected_row_index].completed_by = doctor.number;
      if (!changed_numbers.includes(temp[this.state.selected_row_index].schedule_number)){
        changed_numbers.push(temp[this.state.selected_row_index].schedule_number);
      }
      this.setState({regular_rows:temp, changed_numbers})
    }
    this.closeModal();
    this.change_flag = true;
  }

  close = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？',
        confirm_alert_title:'入力中'
      })
    } else {
      this.closeThisModal();
      this.props.closeModal();
    }
  }

  closeThisModal = () => {
    var init_temp_list = sessApi.getObject('init_temp_list');
    var init_regular_list = sessApi.getObject('init_regular_list');
    var temporary_rows = this.state.temporary_rows;
    var regular_rows = this.state.regular_rows;
    temporary_rows.map((item, index) => {
      item.is_completed = init_temp_list[index].is_completed;
      item.completed_by = init_temp_list[index].completed_by;
    })
    regular_rows.map((item, index) => {
      item.is_completed = init_regular_list[index].is_completed;
      item.completed_by = init_regular_list[index].completed_by;
    })
    this.setState({
      temporary_rows,
      regular_rows,
    }, () => {
      sessApi.remove('init_temp_list');
      sessApi.remove('init_regular_list');
      this.props.closeModal();
    });
    
  }

  confirmCancel = () => {
    this.setState({
      confirm_message:'', 
      isCloseConfirmModal:false,
      isSaveConfirmModal:false,
      confirm_alert_title:''
    })
  }  

  save = () => {
    if (this.change_flag == false) return;    
    this.setState({
      isSaveConfirmModal:true,
      confirm_message:'実施状況を登録しますか？'      
    })
  }

  showDoctorList = (index, type) => {
    var temp;
    if (type == 0){
      temp = this.state.temporary_rows;
    } else {
      temp = this.state.regular_rows;
    }
    if (temp[index].is_completed != 1) return;
    this.selected_type = type;
    this.setState({
      isShowDoctorList:true,
      selected_row_index:index,      
    })
  }

  onHide=()=>{}

  render() {    
    const { modal_title } = this.props;
    let {regular_rows,temporary_rows} = this.state;
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal prescription-done-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>              
                {modal_title}実施状況一覧
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
                  {temporary_rows != undefined && temporary_rows != null && temporary_rows.length >0 && this.state.staff_list_by_number != undefined &&(
                  <>
                    <table className="table-scroll table table-bordered">
                      <thead>                      
                        <th>No</th>
                        <th>臨時処方分類</th>
                        <th>薬剤</th>
                        <th>服用</th>                        
                        <th>コメント</th>
                        <th>実施状況</th>
                        <th>実施確認担当者</th>
                        <th>依頼医</th>
                      </thead>
                      <tbody>
                      {temporary_rows.map((item, index) => {
                        return(
                          item.data_json.map((pres_item, sub_index)=> {
                            return(
                              <>
                                <tr>
                                  {sub_index==0 && (
                                    <td className="text-left" rowSpan={item.data_json.length}>{index+1}</td>
                                  )}
                                  <td className="text-left">{pres_item.prescription_category}</td>
                                  <td className="text-left pl-1">
                                    {pres_item.medicines.map(medicine=>{
                                      return(
                                        <>
                                        <div>●{medicine.item_name}</div>
                                        </>
                                      )
                                    })}
                                  </td>
                                  <td className="text-left">{pres_item.usage_name}</td>
                                  {sub_index==0 && (
                                    <td className="text-left" rowSpan={item.data_json.length}>{item.comment}</td>
                                  )}
                                  {sub_index==0 && (
                                    item.is_completed !== null && item.is_completed === 1 ? (
                                        <td rowSpan={item.data_json.length} className="text-center done_item" onClick={() => this.change_not_done(index,0)}>済</td>
                                    ):(
                                        <td rowSpan={item.data_json.length} className="text-center not_done_item" onClick={() => this.change_done(index,0)}>未</td>
                                    )                                    
                                  )}                                  
                                  {sub_index==0 && (
                                    <>
                                      <td rowSpan={item.data_json.length} className = "text-left" onClick={this.showDoctorList.bind(this, index, 0)}>
                                        {item.completed_by > 0 ? this.state.staff_list_by_number[item.completed_by]:''}
                                      </td>
                                      <td className="text-left" rowSpan={item.data_json.length}>{(item.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined) ? this.state.doctor_list_by_number[item.instruction_doctor_number] : ''}</td>
                                  </>
                                  )}
                                  
                                </tr>
                              </>  
                            )
                          })
                        )
                    })}
                    </tbody>
                  </table>
                  </>
                  )}
              
                  {regular_rows != undefined && regular_rows != null && regular_rows.length >0 && this.state.staff_list_by_number != undefined && (
                    <>
                    <table className="table-scroll table table-bordered">
                      <thead>
                        <th>No</th>
                        <th>定期処方分類</th>
                        <th>薬剤</th>
                        <th>服用</th>
                        <th>コメント</th>
                        <th>実施状況</th>
                        <th>実施確認担当者</th>
                        <th>依頼医</th>
                      </thead>
                      <tbody>
                      {regular_rows.map((item, index) => {
                        return(
                          item.data_json.map((pres_item, sub_index)=> {
                            return(
                              <>
                                <tr>
                                  {sub_index==0 && (
                                    <td className="text-left" rowSpan={item.data_json.length}>{index+1}</td>
                                  )}
                                  <td className="text-left">{pres_item.prescription_category}</td>
                                  <td className="text-left">
                                    {pres_item.medicines.map(medicine=>{
                                      return(
                                        <>
                                        <div>●{medicine.item_name}</div>
                                        </>
                                      )
                                    })}
                                  </td>
                                  <td className="text-left">{pres_item.usage_name}</td>
                                  {sub_index==0 && (
                                    <td className="text-left" rowSpan={item.data_json.length}>{item.comment}</td>
                                  )}
                                  {sub_index==0 && (
                                    item.is_completed !== null && item.is_completed === 1 ? (
                                        <td rowSpan={item.data_json.length} className="text-center done_item" onClick={() => this.change_not_done(index,1)}>済</td>
                                    ):(
                                        <td rowSpan={item.data_json.length} className="text-center not_done_item" onClick={() => this.change_done(index,1)}>未</td>
                                    )                                    
                                  )}                                  
                                  {sub_index==0 && (
                                    <>
                                      <td rowSpan={item.data_json.length} className = "text-left" onClick={this.showDoctorList.bind(this, index,1)}>
                                        {item.completed_by > 0 ? this.state.staff_list_by_number[item.completed_by]:''}
                                      </td>
                                      <td className="text-left" rowSpan={item.data_json.length}>{(item.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined) ? this.state.doctor_list_by_number[item.instruction_doctor_number] : ''}</td>
                                  </>
                                  )}
                                  
                                </tr>
                              </>  
                            )
                          })
                        )
                    })}
                    </tbody>
                  </table>
                  </>
                  )}
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
                  confirmOk= {this.closeThisModal}
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
        </Modal>
    );
  }
}

DonePrescriptionModal.contextType = Context;

DonePrescriptionModal.propTypes = {
  done_list: PropTypes.array,  
  closeModal:PropTypes.func,
  saveEditedSchedule:PropTypes.func,  
  modal_title:PropTypes.string

};

export default DonePrescriptionModal;
