import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectDailysisPrescriptionModal from "./SelectDailysisPrescriptionModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  .dailysis_condition{
    display:flex;
  }
  
  .left{
    float:left;
    font-size:17px;
  }

  .right{
    float:right;
    font-size:15px;
    cursor:pointer;
  }
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date, .dialyser_table{
    margin-top:15px;
    margin-bottom:10px;
    font-size:15px;
  }   
  input {
    width: 100%;
    font-size: 15px;
  }  
  td label{
    display:none;
  }
  th{
    font-size:13px;
    padding-left:2px;
    padding-right:2px;
    text-align:center;
  }
  td{
    vertical-align:middle;    
    text-align:center;
    font-size:14px;    
    padding-left:2px;
    padding-right:2px;
  }
  
  .done_dialyser{
    background-color:rgb(105, 200, 225);
  }
  .not_done_dialyser{
    background-color:lightgrey;
  }
  .checkbox_area {
    padding-left: 15px;
  }  
  .register_info{
    padding-left: 220px;
  }
  .inline_input{
    display:flex;
    .label-title{
      width:70px;
      text-align:right;
      margin-right:10px;
    }
    input{
      width:140px;
    } 
    label{
      cursor: text !important;
    }
  }
  
  .footer {    
    margin-left: 30px;
    margin-top: 10px;
    text-align: center;
    padding-top:20px;
    clear:both;
    label{
      width:100px;      
    }        
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
      padding-left: 90px;
      padding-right: 90px;
    }
    .add-button {
      text-align: center;      
    }
    span {
      color: white;
      font-size: 15px;
      font-weight: 100;
    }
  }
 `;

class EditDailysisPrescriptionSchedulModal extends Component {
  constructor(props) {
    super(props);        
    this.state = {      
      schedule_item:this.props.schedule_item,      
      showDailysisPrescriptionListModal:false
    }    
  }

  getValue = (index, e) => {
    var temp = {...this.state.schedule_item};
    temp.dailysis_prescriptions[index].doctor_name = e.target.value;
    this.setState({
      schedule_item:temp
    });    
  };   

  // getCheckValue = (name, value) => {    
  //   var temp = {...this.state.schedule_item};
  //   if (name == 'temporary_setting'){
  //     temp.temporary_flag = value;
  //   }
  //   this.setState({
  //     schedule_item: temp
  //   });
  // }

  change_not_done = index => {    
    var temp = {...this.state.schedule_item};
    temp.dailysis_prescriptions[index].flag_done = 0;
    temp.dailysis_prescriptions[index].doctor_name = '';
    this.setState({
      schedule_item:temp
    })
  }

  change_done = index => {  
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));  
    var temp = {...this.state.schedule_item};
    temp.dailysis_prescriptions[index].flag_done = 1;
    temp.dailysis_prescriptions[index].doctor_name = authInfo.name;
    this.setState({
      schedule_item:temp
    })
  }
  // async registerPatient()  {
  //     if(this.state.content.length == 0){
  //         window.sessionStorage.setItem("alert_messages", "お知らせコンテンツを入力してください。");
  //         return;
  //     }
  //     let path = "/app/api/v2/dial/patient/register";
  //     const post_data = {
  //       body: this.state.content
  //     };
  //     await apiClient
  //       ._post(path, {
  //         params: post_data
  //       })
  //       .then((res) => {
  //         if (res)
  //           window.sessionStorage.setItem("alert_messages", res.alert_message);
  //       })
  //       .catch(() => {
  //             window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
  //     });
  // }
  
  add_dialyser_modal = () => {
    this.setState({showDailysisPrescriptionListModal:true});
  }

  addDailysisPrescription = key => {
    var dailysis_prescription = this.props.dailysis_prescription_list[key];
    var temp = {...this.state.schedule_item};    
    temp.dailysis_prescriptions.push(dailysis_prescription);    
    this.setState({showDailysisPrescriptionListModal:false});
    this.setState({
      schedule_item:temp
    })
  }
  closeDailysisPrescriptionModal = () => {
    this.setState({showDailysisPrescriptionListModal:false});
  }

  // saveEditedSchedule = () => {
  //   var temp = {...this.state.schedule_item};
  //   temp.updated_flag = 1;    
  //   this.setState({
  //     schedule_item:temp}, ()=>{
  //       this.props.saveDailysisSchedule(this.state.schedule_item, this.state.schedule_item.patient_id, this.state.schedule_item.schedule_day);
  //       this.props.closeModal();    
  //     });    
  // }

  render() {    
    const { closeModal} = this.props;
    return  (
      <Modal show={true} className="master-modal dailysis-prescription-modal">
        <Modal.Header>
          <Modal.Title>透析中処方編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
              <div className='modal_header'>
                <div className="schedule_date">{this.state.schedule_item.schedule_year}年{this.state.schedule_item.schedule_month}月{this.state.schedule_item.schedule_day}日({this.state.schedule_item.schedule_week})</div>
                <span className="patient_id">{this.state.schedule_item.patient_id} : </span>
                <span className="patient_name">{this.state.schedule_item.patient_name}</span>                
              </div>
                <div className = "dialyser_table">
                  <div className="left">透析中処方</div>
                  <div className = "right" onClick ={this.add_dialyser_modal}><Icon icon={faPlus} />透析中処方追加</div>
                  {this.state.showDailysisPrescriptionListModal && (
                    <SelectDailysisPrescriptionModal
                        dailysisPrescriptionList={this.props.dailysis_prescription_list}
                        closeModal={this.closeDailysisPrescriptionModal}
                        addDailysisPrescription={this.addDailysisPrescription}
                    />
                  )}
                  <table className="table-scroll table table-bordered" id="dialyer-table">
                    <thead>
                      <tr>
                        <th>区分</th>                        
                        <th>薬剤名称</th>
                        <th>数量</th>
                        <th>実施タイミング</th>
                        <th>時間</th>
                        <th>医事送信</th>
                        <th>実施</th>
                        <th>実施者</th>
                      </tr>
                    </thead>
                    <tbody>                      
                      {this.state.schedule_item.dailysis_prescriptions !==undefined && this.state.schedule_item.dailysis_prescriptions !==null && this.state.schedule_item.dailysis_prescriptions.length >0 && (
                        this.state.schedule_item.dailysis_prescriptions.map((dailysis_prescription, index) => {
                          return (
                            <>
                            <tr>
                              <td>{dailysis_prescription.classify}</td>
                              <td>{dailysis_prescription.name}</td>
                              <td>{dailysis_prescription.quantity}</td>
                              <td>{dailysis_prescription.timing}</td>
                              <td>{dailysis_prescription.hours}</td>
                              <td>{dailysis_prescription.sent_done}</td>
                              {dailysis_prescription.flag_done ===1 && (
                                <td className="text-center done_dialyser" onClick={() => this.change_not_done(index)}>済</td>
                              )}
                              {dailysis_prescription.flag_done ===0 && (
                                <td className="text-center not_done_dialyser" onClick={() => this.change_done(index)}>未</td>
                              )}                              
                              <td>
                                <InputBoxTag
                                  label=""
                                  type="text"
                                  getInputText={this.getValue.bind(this, index)}
                                  value={dailysis_prescription.doctor_name}
                                />                                
                              </td>
                            </tr>
                            </>
                          )
                        }) 
                      )}                      

                    </tbody>
                  </table>
                  <div className="register_info">
                    <div className="inline_input">
                      <InputBoxTag
                          label="入力日"
                          type="text"
                          placeholder=""
                          className="left"
                          // getInputText={this.getValue.bind(this,'predict_hours')}
                          // value={this.state.schedule_item.schedule_content.predict_hours}
                      />
                      <InputBoxTag
                          label="入力時間"
                          type="text"
                          placeholder=""
                          className="left"
                          // getInputText={this.getValue.bind(this,'predict_hours')}
                          // value={this.state.schedule_item.schedule_content.predict_hours}
                      />
                    </div>
                    <div className="inline_input remove-x-input">
                      <InputBoxTag
                          label="入力者"
                          type="text"
                          placeholder=""
                          className="left"
                          isDisabled={true}
                          // getInputText={this.getValue.bind(this,'predict_hours')}
                          // value={this.state.schedule_item.schedule_content.predict_hours}
                      />
                      <InputBoxTag
                          label="指示者"
                          type="text"
                          placeholder=""
                          isDisabled={true}
                          className="left"
                          // getInputText={this.getValue.bind(this,'predict_hours')}
                          // value={this.state.schedule_item.schedule_content.predict_hours}
                      />
                    </div>                    
                  </div>
                </div>
                <div className="footer-buttons">                  
                  <Button className="red-btn" onClick={closeModal}>キャンセル</Button>
                </div>
            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

EditDailysisPrescriptionSchedulModal.contextType = Context;

EditDailysisPrescriptionSchedulModal.propTypes = {
  closeModal: PropTypes.func,
  saveDailysisSchedule: PropTypes.func,
  dailysis_prescription_list:PropTypes.array,
  schedule_item:PropTypes.array,
};

export default EditDailysisPrescriptionSchedulModal;
