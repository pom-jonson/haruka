import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {secondary200,disable} from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {getStaffName} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;

  .row {
    display: flex;
    width: 100%;
    color: #000;
    margin: auto;

    .right {
      text-align: right;
    }

    .blue {
      color: #0000ff;
    }

    .red {
      text-decoration: line-through;
    }
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  float: left;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .history-list {
    width: 100%;
    overflow-y: auto;
    font-size: 1rem;
    table {
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: auto;
          height: 4.25rem;
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
          }
      }
      .date {
          width: 10rem;
      }
      .version {
          width: 6rem;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
      .name{
        width:20rem;
      }
    }
  }
  .history-content {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 8rem);
    .content-header {
      background: aquamarine;
      text-align: left;
    }
    .deleted-order .row{
      text-decoration: line-through;
    }
  }
 `;

const MedicineListWrapper = styled.div`
  font-size: 1rem;
  .text-red{
    color: #ff0000;
    text-decoration: line-through rgb(255, 0, 0);
  }
  .text-blue{
    color: #0000ff;
  }
  .deleted-order {
    text-decoration: line-through;
  }
  .right-value {
      width: calc(100% - 190px);
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 180px;
    }    
    .text-left{
      .table-item{
        width: 170px;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
        margin-left: 20px;
      }
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .line-through {
    color: #ff0000;
  }
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {
        margin-right: 0;
      }
    }
    div {
      margin-right: 8px;
    }
    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .text-right {
    width: calc(100% - 88px);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 20px);
    word-wrap: break-word;
  }
  .deleted-order{
    text-decoration: line-through;
  }
`;

export class HospitalDischargeSummaryChangeLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded:false,
      history_list:[],
      outputs:[],
      dial_other_facilities:[],
    };
    this.doctor_names = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        this.doctor_names[doctor.doctor_code] = doctor.name;
      }
    });
  }
  
  async componentDidMount() {
    let path = "/app/api/v2/ward/summary/hospital_discharge/view_history";
    let post_data = {
      history_numbers:this.props.history_numbers,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        res.history_data.map(item=>{
          item.history_show = 1;
        });
        let differences = this.checkDifference(res.history_data);
        let dial_other_facilities = [];
        if(res.dial_other_facilities_master.length > 0){
          res.dial_other_facilities_master.map(facility=>{
            dial_other_facilities[facility.number] = facility.name;
          });
        }
        this.setState({
          is_loaded:true,
          history_list:res.history_data,
          dial_other_facilities,
          outputs: differences.outputs,
        });
      })
      .catch(() => {
      });
  }

  checkDifference = (results) => {
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    if (result.length > 0) {
      result.map((record, index) => {
        let version = results.findIndex(x=>x.number == record.number);
        version = results.length - version;
        let current = record;
        current.version = version;
        if (index < result.length - 1) {
          current.prev = result[index + 1];
          let output = current;          
          outputs.push(output);                         
        } else {
          current.prev = null;
          let output = current;          
          outputs.push(output);                         
        }
      });
    }
    return {
      outputs: outputs
    };
  };

  compareWithPrev = (cur, prev, cond) => {
    if (cond == "inspection-date") {
      if (cur != prev) {
        return "different";
      }
    }

    if (cond == "array_names") {
      let data = cur.map(item=>{
        return item.name;
      });
      if (!data.includes(cur)) {
        return "different";
      }
    }
    return "equal";
  }

  getChangePart = (cur, prev, type="string") => {
    if(type == "string"){
      if (cur == prev) {
        return (
          <>
            <div>{cur != undefined ? cur : ""}</div>
          </>
        )
      } else {
        if (cur == undefined || cur == null || cur == '') {
          return (
            <>
              {prev != undefined && (
                <div className="deleted-order">{prev}</div>
              )}
            </>
          )
        } else if (prev == undefined || prev == null || prev == '') {
          return (
            <div className="text-blue">{cur != undefined ? cur : ""}</div>
          )
        } else {
          return (
            <>
              <div className="text-blue">{cur != undefined ? cur : ""}</div>
              <div className='deleted-order'>{prev != undefined ? prev : ""}</div>
            </>
          )
        }
      }
    }
    if(type == "array"){
      let cur_length = cur != undefined ? cur.length : 0;
      let prev_length = prev != undefined ? prev.length : 0;
      cur = cur_length == 0 ? [] : cur;
      prev = prev_length == 0 ? [] : prev;
      let ret_html = [];
      if(cur.length > 0){
        cur.map(value=>{
          if(this.checkExitData(value, prev)){
            ret_html.push(<div>{value}</div>);
          } else {
            ret_html.push(<div className="text-blue">{value}</div>);

          }
        })
      }
      if(prev.length > 0){
        prev.map(value=>{
          if(!this.checkExitData(value, cur)){
            ret_html.push(<div className='deleted-order'>{value}</div>);
          }
        })
      }
      return ret_html;
    }
  };

  checkExitData=(value, data)=>{
    let check_flag = false;
    if(data.length > 0){
      data.map(item=>{
        if(item == value){
          check_flag = true;
        }
      })
    }
    return check_flag;
  }

  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list} = this.state;
      history_list.find(x=>x.number == number).history_show = value;
      let differences = await this.checkDifference(history_list);
      this.setState({
        history_list,
        outputs: differences.outputs,
      });
    }
  };

  render() {
    let outputs = this.state.outputs;
    let history_list = this.state.history_list;
    return (
      <Modal show={true} size="lg" className="modal-history-inspection">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.is_loaded ? (
              <>
                <div className="history-list">
                  <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                      <th className="check"></th>
                      <th className="version">版数</th>
                      <th className="w-3">進捗</th>
                      <th className="date">変更日時</th>
                      <th className="">変更者</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history_list.map((item, index) => {
                      index = history_list.length - index;
                      return (
                        <>
                          <tr>
                            <td className="text-center check">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, item.number)}
                                value={item.history_show}
                                name="check"
                              />
                            </td>
                            <td className="version">
                              {index == 1 ? "初版" : parseInt(index).toString() + "版"}
                            </td>
                            <td className="w-3">
                              {item.is_enabled == 2 ? "削除" : (index == 1 ? "新規" : "修正")}
                            </td>
                            <td className="date">{item.updated_at.split('-').join('/')}</td>
                            <td className="text-left">{getStaffName(item.updated_by)}</td>
                          </tr>
                        </>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
                <div className="history-content">
                  {outputs.map(output=>{
                    return (
                      <>
                        <TabContent>
                          <div className="row">
                            <div className="content w-100">
                              <div className="content-header">
                                <span className="mr-3">{"（" + (output.version == 1 ? "初" : output.version) + "版）"}</span>
                                <span className="mr-3">{output.is_enabled == 2 ? "削除" : (output.version == 1 ? "新規" : "修正")}</span>
                                <span className="mr-3">{output.updated_at.split('-').join('/')}</span>
                                <span className="mr-3">{getStaffName(output.updated_by)}</span>
                              </div>
                              <MedicineListWrapper>
                                <div className={`history-item ${(output.is_enabled == 2) ? "deleted-order" : ""}`}>
                                  <div className="history-item">
                                    <div className="phy-box w70p">
                                      {((output.progress_to_hospitalization != null) || (output.prev != null && output.prev.progress_to_hospitalization!= null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">入院までの経過</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(output.progress_to_hospitalization, undefined)
                                            ):(
                                              this.getChangePart(output.progress_to_hospitalization, output.prev.progress_to_hospitalization)
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.current_symptoms_on_admission != null) || (output.prev != null && output.prev.current_symptoms_on_admission!= null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">入院時現症</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(output.current_symptoms_on_admission, undefined)
                                            ):(
                                              this.getChangePart(output.current_symptoms_on_admission, output.prev.current_symptoms_on_admission)
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.medical_history_allergies != null) || (output.prev != null && output.prev.medical_history_allergies!= null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">既往歴・アレルギー</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(output.medical_history_allergies, undefined)
                                            ):(
                                              this.getChangePart(output.medical_history_allergies, output.prev.medical_history_allergies)
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.clinical_course != null) || (output.prev != null && output.prev.clinical_course != null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">既往歴・アレルギー</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(output.clinical_course, undefined)
                                            ):(
                                              this.getChangePart(output.clinical_course, output.prev.clinical_course)
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.discharge_prescription != null) || (output.prev != null && output.prev.discharge_prescription != null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">退院処方</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(output.discharge_prescription, undefined)
                                            ):(
                                              this.getChangePart(output.discharge_prescription, output.prev.discharge_prescription)
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.reservation_information_after_discharge != null) || (output.prev != null && output.prev.reservation_information_after_discharge != null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">退院後予約情報</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(output.reservation_information_after_discharge, undefined)
                                            ):(
                                              this.getChangePart(output.reservation_information_after_discharge, output.prev.reservation_information_after_discharge)
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.referral_transfer != null) || (output.prev != null && output.prev.referral_transfer != null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">紹介状/転院先</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart((this.state.dial_other_facilities[output.referral_transfer] !== undefined) ? this.state.dial_other_facilities[output.referral_transfer] : "", undefined)
                                            ):(
                                              this.getChangePart((this.state.dial_other_facilities[output.referral_transfer] !== undefined) ? this.state.dial_other_facilities[output.referral_transfer] : "", (this.state.dial_other_facilities[output.prev.referral_transfer] !== undefined) ? this.state.dial_other_facilities[output.prev.referral_transfer] : "")
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {((output.referral_doctor != null) || (output.prev != null && output.prev.referral_doctor != null)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">紹介医師</div>
                                          </div>
                                          <div className="text-left right-value">
                                            {output.prev == null ? (
                                              this.getChangePart(this.doctor_names[output.referral_doctor] !== undefined ? this.doctor_names[output.referral_doctor] : "", undefined)
                                            ):(
                                              this.getChangePart(this.doctor_names[output.referral_doctor] !== undefined ? this.doctor_names[output.referral_doctor] : "", this.doctor_names[output.prev.referral_doctor] !== undefined ? this.doctor_names[output.prev.referral_doctor] : "")
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </MedicineListWrapper>
                            </div>
                          </div>
                        </TabContent>
                      </>
                    )
                  })}
                </div>
              </>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className="cancel-btn">キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

HospitalDischargeSummaryChangeLog.contextType = Context;
HospitalDischargeSummaryChangeLog.propTypes = {
  closeModal: PropTypes.func,
  history_numbers: PropTypes.string,
};
export default HospitalDischargeSummaryChangeLog;