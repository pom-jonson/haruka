import React, { Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
// import {getStaffName} from "~/helpers/constants";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Checkbox from "~/components/molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";

  const Popup = styled.div`
    height: 96%;
    // padding:1.5rem;
    .label-title{
      width:auto;
      margin-top:3px;
    }
    .clickable{
      cursor:pointer;
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
        height: 33rem;
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}      
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      } 
      .no{
        width:6rem;
        label{
          margin-right:0;
        }
      }
      .date{
        // width:12rem;
        text-align:center;
      }
      .content{
        width:40rem;
      }
      .updated_by{
        width:15rem;
      }
    }
    .selected{
      background: lightblue!important;
    }
  `;
  
  class AllStopModal extends Component {
    constructor(props) {
      super(props);
      var elapsed_result_data = this.props.elapsed_result_data;      
      this.state = {
        elapsed_result_data,        
        end_date:'',
        alert_messages:'',
        confirm_message:'',
        confirm_alert_title:''
      }
    }

    handleOk = () => {
      var elapsed_result_data = this.state.elapsed_result_data;
      if (elapsed_result_data == undefined || elapsed_result_data == null || elapsed_result_data.length == 0) return;
      if (this.state.end_date == ''){
        this.setState({alert_messages: '終了日を入力してください。'});
        return;
      }
      
      var checked_flag = false;
      elapsed_result_data.map(item => {
        if (item.is_checked) checked_flag = true;
      })
      
      if (checked_flag == false){
        this.setState({alert_messages:'登録する項目がありません。'});
        return;
      }
      this.setState({
        confirm_message:'終了日を一括設定しますか？',
        confirm_alert_title:'登録確認'
      })
    }

    confirmOk = async() => {
      var elapsed_result_data = this.state.elapsed_result_data;
      var checked_items = [];
      elapsed_result_data.map(item => {
        if (item.is_checked) checked_items.push(item);
      })
      var post_data = {
        system_patient_id:this.props.system_patient_id,
        end_date:this.state.end_date,
        plan_data:checked_items,
        start_date:''
      }
      var path = "/app/api/v2/nurse/progress_chart/register_elapsed_title_multi";
      await apiClient._post(path, {params:post_data})
        .then(() => {
          this.props.handleOk(this.state.elapsed_result_data);
          this.props.closeModal();
        })
    }

    getInputdate = (name, value) => {
      this.setState({[name]:value});
      this.change_flag = true;
    }

    getRadio = (title_id, name, value) => {      
      var {elapsed_result_data} = this.state;
      var index = '';
      if (name == 'title'){
        index = elapsed_result_data.findIndex(x => x.title_id == title_id);
        if (index > -1){
          elapsed_result_data[index].is_checked = value;
        }
      }
      this.setState({elapsed_result_data})
    }

    confirmCancel = () => {
      this.setState({
        alert_messages:'', 
        confirm_message:'',
        confirm_alert_title:''
      })
    }
    
    render() {
      var {elapsed_result_data} = this.state;
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>観察項目一括中止</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <InputWithLabelBorder
                  label="終了日"
                  type="date"
                  getInputText={this.getInputdate.bind(this, 'end_date')}
                  diseaseEditData={this.state.end_date}                   
                />
                <table className="table-scroll table table-bordered">
                  <thead>
                    <tr>
                      <th className='no'/>                      
                      <th className='content'>名称</th>
                      <th className='date'>開始日</th>                      
                    </tr>
                  </thead>
                  <tbody>
                    {elapsed_result_data != undefined && elapsed_result_data != null && elapsed_result_data.length > 0 && (
                      elapsed_result_data.map((item) => {
                        var title = '';
                        if (item.tier_3rd_name != null){
                          title = item.tier_2nd_name + ' ＞ ' + item.tier_3rd_name;
                        } else {
                          if (item.free_category != null) title += item.free_category + ' ＞ ';
                          title += item.title;
                        }
                        var surfix = '';
                        if (item.side != null && item.side != '') surfix += '(' + item.side;
                        if (item.part != null && item.part != '') {
                          if (surfix =='') surfix += '(';
                          surfix += item.part;
                        }
                        if (surfix != '') surfix += ')';
                        return(
                          <>
                            <tr >
                              <td className='no text-center'>
                                <Checkbox
                                  label=""
                                  getRadio={this.getRadio.bind(this, item.title_id)}
                                  value={item.is_checked}
                                  name="title"
                                />
                              </td>
                              <td className='content'>{title + surfix}</td>
                              <td className='date'>{item.start_date}</td>
                            </tr>
                          </>
                        )
                      })
                    )}                    
                  </tbody>
                </table>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className="red-btn" onClick={this.handleOk}>確定</Button>
            </Modal.Footer>
            {this.state.alert_messages !== "" && (
              <SystemAlertModal
                hideModal= {this.confirmCancel.bind(this)}
                handleOk= {this.confirmCancel.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}
            {this.state.confirm_message != '' && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          </Modal>        
        </>
      );
    }
  }
  AllStopModal.contextType = Context;
  
  AllStopModal.propTypes = {
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,    
    elapsed_result_data:PropTypes.array,
    system_patient_id:PropTypes.number
  };
  
  export default AllStopModal;