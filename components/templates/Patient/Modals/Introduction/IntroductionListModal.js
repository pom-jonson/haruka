import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import { formatDateSlash} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import {KARTEMODE} from "~/helpers/constants";
import IntroductionRegister from "./IntroductionRegister";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: 100%;
  padding: 9px 9px 9px 2px;
  overflow: auto;
  position: relative;
  table {
    margin:0;    
    height: 100%;
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    thead{
      display: table;
      width: calc(100% - 0px);
    }
    tbody{
      height:calc(70vh - 370px);
      overflow-y:auto;
      display:block;
    }
    tr {
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;            
        input {
            margin: 0;
        }
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }
  }
  .footer {
    span{
      color: white;
      font-size: 16px;
    }
    button{
      float: right;
      padding: 5px;
      font-size: 16px;
      margin-right: 16px;
    }
  }
`;

export class IntroductionListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenInputModal: false,
      is_loaded:false,
    };
  }

  async componentDidMount() {
    await this.getStaff();
    await this.searchList();
  }

  openIntroduction = () => {
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    this.setState({
      isOpenInputModal: true,
    });
  };

  getStaff = async () =>{
      await apiClient.get("/app/api/v2/secure/staff/search?")
          .then((res) => {
              let staff_list_by_number = {};
              if (res != undefined){
                  Object.keys(res).map((key) => {
                      staff_list_by_number[res[key].number] = res[key].name;
                  });
              }
              this.setState({
                  staffs: res,
                  staff_list_by_number
              });
              return res;
          });
  };

  closeModal = () => {
    this.setState({
      isOpenInputModal: false,
    }, ()=> {
      this.searchList();
    })
  };

  searchList = async () => {
    if (this.props.patientId === undefined || this.context.dateStatus === undefined || this.context.dateStatus == null) return;
    let post_data = {
      system_patient_id: this.props.patientId,
    };
    let path = "/app/api/v2/patients/introduction/search";
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
      this.setState({introduction_list: res, is_loaded: true});
    });
  };

  setPatientStaff = async (staff_number) => {
    this.closeModal();
      let path = "/app/api/v2/patients/patient_staff/register";
      let post_data = {
          params: {
              system_patient_id: this.props.patientId,
              staff_id:staff_number,
          },
      };
      await apiClient.post(path,  post_data);
  };

  openHistory = (selected_history) => {
    this.setState({
        selected_history,
        isOpenInputModal: true,
    });
  };

  render() {
    let {patientInfo} = this.props;
    let {introduction_list} = this.state;
    return (
      <Modal
        show={true}        
        className="patient-staff-list-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>紹介情報</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="d-flex w-100">
              <div className="w-25 pl-3">患者ID</div>
              <div className="w-75">: {patientInfo.receId != undefined && patientInfo.receId != null ? patientInfo.receId : patientInfo.patientNumber}</div>
            </div>
            <div className="d-flex w-100">
              <div className="w-25 pl-3">名前</div>
              <div className="w-75">: {patientInfo.name}{patientInfo.age !== undefined && patientInfo.age !== 0 ? "(" +patientInfo.age + ")" : ""}</div>
            </div>
            <div style={{height: "70%"}}>
            {this.state.is_loaded ? (
              <table className="table table-bordered table-scroll w-100 mt-2" id="basic-data-table">
                <thead>
                  <tr className="table-menu">
                      <th className="text-left p-1 w-25 text-center">日時</th>
                      <th className="text-left p-1 w-75 text-center">医療機関名</th>
                  </tr>
                </thead>
                <tbody>
                  {introduction_list != null && introduction_list.length > 0 ? introduction_list.map((item,index) => {
                      return (
                          <tr key={index} onClick={this.openHistory.bind(this,item)} style={{cursor:"pointer"}}>
                              <td className="text-left p-1 w-25">{formatDateSlash(item.write_date)}</td>
                              <td className="text-left p-1 w-75">{item.facility_name}</td>
                          </tr>
                      )
                  }) : (
                      <tr><td colSpan={2}>まだ登録がありません</td></tr>
                  )}
                </tbody>
              </table>
                  ) :(
                  <>
                      <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                  </>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" id="btnCancel" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.openIntroduction}>紹介情報登録</Button>
        </Modal.Footer>
        {this.state.isOpenInputModal && (
            <IntroductionRegister
                closeModal={this.closeModal}
                patientInfo={this.props.patientInfo}
                patientId={this.props.patientId}
                selected_history={this.state.selected_history}
              />
        )}
      </Modal>
    );  
  }
}
IntroductionListModal.contextType = Context;
IntroductionListModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
};

export default IntroductionListModal;