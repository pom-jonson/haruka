import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import InspectionListModal from "./InspectionListModal";
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
    overflow-y: auto;
    width: 100%;
    height: 100%;
    .flex {display: flex;}
    font-size:1rem;
    .condition-area {
      .condition {
        display:flex;
        .label-title {
          width:auto;
          margin-right:0.5rem;
          line-height:2rem;
        }
      }
      .inspection-period {
        div {margin-top:0;}
        .from-to{
          padding:0 0.5rem;
          line-height: 2rem;
        }
        .label-title {display:none;}
      }
      .inspection-state {
        label {
          font-size:1rem;
          line-height: 2rem;
          margin-bottom: 0;
        }
      }
      .karte-status {
        label {
          font-size:1rem;
          line-height: 2rem;
          margin-bottom: 0;
        }
      }
    }
    .react-datepicker-popper {
      margin-top: 10px !important;
    }
    .react-datepicker-wrapper {
      input {
        font-size: 1rem;
        width: 7rem;
        height: 2rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    }
    .div-border {
      border: 1px solid #aaa;
    }
    .condition-table {
      -webkit-box-pack: justify;
      justify-content: space-between;
      height: calc(100% - 3rem);
      margin-top: 0.5rem;
        .reservation-frame {
            width: 38%;
            .select-inspection {
              margin-left:0.5rem;
              margin-top:0.5rem;
              width:calc(100% - 1rem);
              .label-title {
                width:5rem;
                margin:0;
                line-height:2rem;
                font-size:1rem;
              }
              .pullbox-label {
                width:calc(100% - 5rem);
                .pullbox-select {
                  width:100%;
                  height:2rem;
                  font-size:1rem;
                }
              }
            }
            
            .reservation-frame-list {
                width: calc(100% - 1rem);
                margin: auto;
                margin-top: 0.5rem;
                height: calc(100% - 6rem);
            }
        }
        .medical_department-ward {
            width: 61%;
            height:100%;
            .medical-department {
                width: 50%;
                .medical-department-list {
                  width: calc(100% - 0.5rem);
                  margin-left: 0.5rem;
                  margin-top: 0.5rem;
                  height: calc(100% - 3.5rem);
                }
            }
            .ward {
                width: 50%;
                .ward-list {
                  width: calc(100% - 1rem);
                  margin-left: 0.5rem;
                  margin-top: 0.5rem;
                  height: calc(100% - 3.5rem);
                }
            }
        }
    }
    table {
        td {padding:0 0.2rem;}
        .td-check {
          text-align: center;
          width: 25px;
          label {
            margin: 0;
            input {margin-right:0;}
          }
        }
    }
`;

class InspectionReservationListModal extends Component {
  constructor(props) {
    super(props);
    let cur_date = new Date();
    this.state = {
      start_date:new Date(),
      end_date:cur_date.setDate(cur_date.getDate() + 1),
      inspection_state:0,
      karte_status:0,
      inspection_id:0,
      inspection_name:'',
      department_codes:[],
      isInspectionListModal:false,
      group_master:[],
      frame_master_data:[],
      frame_master:[],
      frame_codes:[],
      ward_master:[],
      ward_codes:[],
    }
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }
  
  async componentDidMount() {
    await this.getCondition();
  }
  
  getCondition=async()=>{
    let path = "/app/api/v2/master/inspection/reservation_list/getCondition";
    let post_data = {
      order_type:1,
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '' ,
      end_date:this.state.end_date !== '' ? formatDateLine(this.state.end_date) : '' ,
    };
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        let group_master = [{id:0, value:""}];
        if(res.group_master.length > 0){
          res.group_master.map(group=>{
            group_master.push({id:parseInt(group.group_code), value:group.group_name})
          });
        }
        this.setState({
          group_master,
          frame_master_data:res.frame_master,
          ward_master:res.ward_master,
        });
      })
      .catch(() => {
      
      })
  };
  
  setInspectionPeriod=(key,value)=>{
    this.setState({[key]:value},()=>{
      this.getCondition();
    });
  };
  
  setInspectionState = (e) => {
    this.setState({inspection_state:parseInt(e.target.value)});
  };
  
  setKarteStatus = (e) => {
    this.setState({karte_status:parseInt(e.target.value)});
  };
  
  setInspectionId = (e) => {
    let inspection_id = parseInt(e.target.id);
    let frame_master = [];
    if(inspection_id !== 0 && Object.keys(this.state.frame_master_data).length > 0 && this.state.frame_master_data[inspection_id] !== undefined){
      frame_master = this.state.frame_master_data[inspection_id];
    }
    this.setState({
      inspection_id,
      inspection_name:e.target.value,
      frame_master,
      frame_codes:[],
    });
  };
  
  selectDepartmentCode =(name, number)=>{
    if(name == "department_code"){
      let department_codes = this.state.department_codes;
      let index = department_codes.indexOf(number);
      if(index === -1){
        department_codes.push(number);
      } else {
        department_codes.splice(index, 1);
      }
      this.setState({
        department_codes,
      });
    }
  };
  
  selectFrameCode =(name, number)=>{
    if(name == "reservation_frame"){
      let frame_codes = this.state.frame_codes;
      let index = frame_codes.indexOf(number);
      if(index === -1){
        frame_codes.push(number);
      } else {
        frame_codes.splice(index, 1);
      }
      this.setState({
        frame_codes,
      });
    }
  };
  
  selectWardCode =(name, number)=>{
    if(name == "ward_code"){
      let ward_codes = this.state.ward_codes;
      let index = ward_codes.indexOf(number);
      if(index === -1){
        ward_codes.push(number);
      } else {
        ward_codes.splice(index, 1);
      }
      this.setState({
        ward_codes,
      });
    }
  };
  
  selectDepartmentAll =(act)=>{
    let department_codes = [];
    if(act == "select"){
      this.departmentOptions.map(item=>{
        department_codes.push(item.id);
      });
    }
    this.setState({
      department_codes,
    });
  };
  
  selectFrameAll =(act)=>{
    let frame_codes = [];
    if(act == "select"){
      if(this.state.frame_master.length > 0){
        this.state.frame_master.map(item=>{
          frame_codes.push(item.frame_code);
        });
      }
    }
    this.setState({
      frame_codes,
    });
  };
  
  selectWardAll =(act)=>{
    let ward_codes = [];
    if(act == "select"){
      if(this.state.ward_master.length > 0){
        this.state.ward_master.map(item=>{
          ward_codes.push(item.ward_code);
        });
      }
    }
    this.setState({
      ward_codes,
    });
  };
  
  createDepartmentTable=()=>{
    let html = [];
    for(let index = 0; index < this.departmentOptions.length; index+=2){
      html.push(
        <tr>
          <td className={'td-check'}>
            {this.departmentOptions[index] !== undefined && this.departmentOptions[index] != null && (
              <Checkbox
                getRadio={this.selectDepartmentCode.bind(this)}
                value={(this.state.department_codes.includes(this.departmentOptions[index]['id']))}
                number={this.departmentOptions[index]['id']}
                name="department_code"
              />
            )}
          </td>
          <td>{this.departmentOptions[index] !== undefined && this.departmentOptions[index] != null ? this.departmentOptions[index]['value'] : ''}</td>
          <td className={'td-check'}>
            {this.departmentOptions[index+1] !== undefined && this.departmentOptions[index+1] != null && (
              <Checkbox
                getRadio={this.selectDepartmentCode.bind(this)}
                value={(this.state.department_codes.includes(this.departmentOptions[index+1]['id']))}
                number={this.departmentOptions[index+1]['id']}
                name="department_code"
              />
            )}
          </td>
          <td>{this.departmentOptions[index+1] !== undefined && this.departmentOptions[index+1] != null ? this.departmentOptions[index+1]['value'] : ''}</td>
        </tr>
      )
    }
    return html;
  };
  
  openInspectionListModal=()=>{
    this.setState({
      isInspectionListModal:true,
    });
  };
  
  closeModal=()=>{
    this.setState({
      isInspectionListModal:false,
    });
  };
  
  createFrameTable=()=>{
    let html = [];
    if(this.state.frame_master.length > 0){
      this.state.frame_master.map(frame=>{
        html.push(
          <tr>
            <td className={'td-check'}>
              <Checkbox
                getRadio={this.selectFrameCode.bind(this)}
                value={(this.state.frame_codes.includes(frame['frame_code']))}
                number={frame['frame_code']}
                name="reservation_frame"
              />
            </td>
            <td>{frame['frame_name']}</td>
          </tr>
        )
      })
    }
    return html;
  };
  
  createWardTable=()=>{
    let html = [];
    if(this.state.ward_master.length > 0){
      for(let index = 0; index < this.state.ward_master.length; index+=2){
        html.push(
          <tr>
            <td className={'td-check'}>
              {this.state.ward_master[index] !== undefined && this.state.ward_master[index] != null && (
                <Checkbox
                  getRadio={this.selectWardCode.bind(this)}
                  value={(this.state.ward_codes.includes(this.state.ward_master[index]['ward_code']))}
                  number={this.state.ward_master[index]['ward_code']}
                  name="ward_code"
                />
              )}
            </td>
            <td>{this.state.ward_master[index] !== undefined && this.state.ward_master[index] != null ? this.state.ward_master[index]['name'] : ''}</td>
            <td className={'td-check'}>
              {this.state.ward_master[index+1] !== undefined && this.state.ward_master[index+1] != null && (
                <Checkbox
                  getRadio={this.selectWardCode.bind(this)}
                  value={(this.state.ward_codes.includes(this.state.ward_master[index+1]['ward_code']))}
                  number={this.state.ward_master[index+1]['ward_code']}
                  name="ward_code"
                />
              )}
            </td>
            <td>{this.state.ward_master[index+1] !== undefined && this.state.ward_master[index+1] != null ? this.state.ward_master[index+1]['name'] : ''}</td>
          </tr>
        )
      }
    }
    return html;
  };
  
  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal physiological-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>生理検査予定一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'condition-area flex'}>
                  <div className={'condition'} style={{width:"39%"}}>
                    <div className={'label-title'}>期間設定</div>
                    <div className={'inspection-period flex'}>
                      <InputWithLabel
                        type="date"
                        getInputText={this.setInspectionPeriod.bind(this, 'start_date')}
                        diseaseEditData={this.state.start_date}
                      />
                      <div className={'from-to'}>～</div>
                      <InputWithLabel
                        type="date"
                        getInputText={this.setInspectionPeriod.bind(this, 'end_date')}
                        diseaseEditData={this.state.end_date}
                      />
                    </div>
                  </div>
                  <div className={'condition'} style={{width:"30%"}}>
                    <div className={'label-title'}>状態</div>
                    <div className={'inspection-state'}>
                      <Radiobox
                        label={'未受付'}
                        value={0}
                        getUsage={this.setInspectionState.bind(this)}
                        checked={this.state.inspection_state == 0 ? true : false}
                        disabled={true}
                        name={`inspection_state`}
                      />
                      <Radiobox
                        label={'受付済'}
                        value={1}
                        getUsage={this.setInspectionState.bind(this)}
                        checked={this.state.inspection_state == 1 ? true : false}
                        disabled={true}
                        name={`inspection_state`}
                      />
                      <Radiobox
                        label={'実施済'}
                        value={2}
                        getUsage={this.setInspectionState.bind(this)}
                        checked={this.state.inspection_state == 2 ? true : false}
                        disabled={true}
                        name={`inspection_state`}
                      />
                      <Radiobox
                        label={'すべて'}
                        value={3}
                        getUsage={this.setInspectionState.bind(this)}
                        checked={this.state.inspection_state == 3 ? true : false}
                        disabled={true}
                        name={`inspection_state`}
                      />
                    </div>
                  </div>
                  <div className={'condition'} style={{width:"30%"}}>
                    <div className={'label-title'}>入外区分</div>
                    <div className={'karte-status'}>
                      <Radiobox
                        label={'共通'}
                        value={0}
                        getUsage={this.setKarteStatus.bind(this)}
                        checked={this.state.karte_status == 0 ? true : false}
                        disabled={true}
                        name={`karte_status`}
                      />
                      <Radiobox
                        label={'入院'}
                        value={3}
                        getUsage={this.setKarteStatus.bind(this)}
                        checked={this.state.karte_status == 3 ? true : false}
                        disabled={true}
                        name={`karte_status`}
                      />
                      <Radiobox
                        label={'外来'}
                        value={1}
                        getUsage={this.setKarteStatus.bind(this)}
                        checked={this.state.karte_status == 1 ? true : false}
                        disabled={true}
                        name={`karte_status`}
                      />
                    </div>
                  </div>
                </div>
                <div className={'condition-table flex'}>
                  <div className={'reservation-frame'}>
                    <div style={{lineHeight:"2rem", height:"2rem"}}>伝票・予約枠</div>
                    <div className={'div-border'} style={{height:"calc(100% - 2rem)"}}>
                      <div className={'select-inspection'}>
                        <SelectorWithLabel
                          title={'伝票種別'}
                          options={this.state.group_master}
                          getSelect={this.setInspectionId}
                          departmentEditCode={this.state.inspection_id}
                        />
                      </div>
                      <div className={'flex'} style={{marginRight:"0.5rem"}}>
                        <div style={{paddingLeft:"0.5rem", lineHeight:"2rem"}}>予約枠</div>
                        <div className={'flex'} style={{marginLeft:"auto", marginRight:0}}>
                          <div style={{marginRight:"0.5rem"}}>
                            <Button type="common" onClick={this.selectFrameAll.bind(this, 'select')}>すべて選択</Button>
                          </div>
                          <Button type="common" onClick={this.selectFrameAll.bind(this, 'delete')}>すべて削除</Button>
                        </div>
                      </div>
                      <div className={'reservation-frame-list div-border'}>
                        <table className="table-scroll table table-bordered">
                          {this.createFrameTable()}
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className={'medical_department-ward'}>
                    <div style={{lineHeight:"2rem", height:"2rem"}}>診療科・病棟</div>
                    <div className={'div-border flex'} style={{height:"calc(100% - 2rem)"}}>
                      <div className={'medical-department'}>
                        <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                          <div style={{paddingLeft:"0.5rem", lineHeight:"2rem"}}>診療科</div>
                          <div className={'flex'} style={{marginLeft:"auto", marginRight:0}}>
                            <div style={{marginRight:"0.5rem"}}>
                              <Button type="common" onClick={this.selectDepartmentAll.bind(this, 'select')}>すべて選択</Button>
                            </div>
                            <Button type="common" onClick={this.selectDepartmentAll.bind(this, 'delete')}>すべて削除</Button>
                          </div>
                        </div>
                        <div className={'medical-department-list div-border'}>
                          <table className="table-scroll table table-bordered">
                            {this.createDepartmentTable()}
                          </table>
                        </div>
                      </div>
                      <div className={'ward'}>
                        <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                          <div style={{paddingLeft:"0.5rem", lineHeight:"2rem"}}>病棟</div>
                          <div className={'flex'} style={{marginLeft:"auto", marginRight:0}}>
                            <div style={{marginRight:"0.5rem"}}>
                              <Button type="common" onClick={this.selectWardAll.bind(this, 'select')}>すべて選択</Button>
                            </div>
                            <div style={{marginRight:"0.5rem"}}>
                              <Button type="common" onClick={this.selectWardAll.bind(this, 'delete')}>すべて削除</Button>
                            </div>
                          </div>
                        </div>
                        <div className={'ward-list div-border'}>
                          <table className="table-scroll table table-bordered">
                            {this.createWardTable()}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.openInspectionListModal}>一覧展開</Button>
          </Modal.Footer>
          {this.state.isInspectionListModal && (
            <InspectionListModal
              closeModal={this.closeModal}
              conditions={this.state}
            />
          )}
        </Modal>
      </>
    );
  }
}

InspectionReservationListModal.contextType = Context;
InspectionReservationListModal.propTypes = {
  closeModal: PropTypes.func,
};

export default InspectionReservationListModal;
