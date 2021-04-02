import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import TableItem from "../organisms/TableItem";
import Context from "~/helpers/configureStore";
import BasicInfoModal from "../organisms/BasicInfoModal";
import Spinner from "react-bootstrap/Spinner";

const PatientsTableWrapper = styled.div`
  width: 100%;
  background-color: rgb(241, 243, 244);
  .table-header {
    background-color: ${colors.surface};
    border-bottom: 1px solid #bbbbbb;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    top: 85px;
    width: 100%;
    z-index: 99;
  }
  .table-scroll {
    width: 100%;
    background-color: ${colors.surface};
    height: calc(100vh - 16rem);
    overflow-y: scroll;
    .no-result {
      padding: 200px;
      text-align: center;
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
  .registerList {
    margin-left: 24px;
  }
  .table-item {
    color: ${colors.onSurface};
    &:hover {
      color: ${colors.onSurface};
      text-decoration: none;
    }
  }
  .table-header {
    width: calc(100% - 17px);
    font-size: 1.125rem;
    div {text-align:center;}
  }
  .table-scroll .table-row {
    font-size: 1rem;
  }
  .table-row {
    .patient-sex {
      width: 3rem;
      border-right:1px solid #dee2e6;
      text-align:center;
      padding: 8px;
      line-height: 2rem;
      svg {margin:0;}
    }
    .department-name {
      width: 10rem;
      border-right:1px solid #dee2e6;
      padding: 8px;
      line-height: 2rem;
    }
    .patient-id {
      width: 8rem;
      border-right:1px solid #dee2e6;
      padding: 8px;
      line-height: 2rem;
    }
    .patient-name {
      width: 20rem;
      border-right:1px solid #dee2e6;
      padding: 8px;
      line-height: 2rem;
    }
    .department-content {
      width: 10rem;
      border-right:1px solid #dee2e6;
      padding: 8px;
      line-height: 2rem;
    }
    .other-department {
      width: calc(100% - 80rem);
      border-right:1px solid #dee2e6;
      padding: 8px;
      line-height: 2rem;
    }
    .acceptedlist {
      width: 10rem;
      border-right:1px solid #dee2e6;
      padding: 8px;
      line-height: 2rem;
    }
    .base-data {
      width: 7rem;
      padding: 8px;
      line-height: 2rem;
      border-right:1px solid #dee2e6;
    }
    .emphasis-icon {
      width: 4rem;
      padding: 8px;
      line-height: 2rem;
      text-align:center;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class PatientsTable extends Component {
  constructor() {
    super();
    this.state = {
      patientsData: [
        {
          number: 1,
          patientNumber: " 9999999",
          systemPatientId: 1,
          name: "テスト　患者３１７ ",
          age: 73,
          sex: 1,
          inOut: 0,
          department: "内科",
          accepted_time: "00:31:06",
          diagnosis_type: 1,
          diagnosis_type_name: "診察",
          registration_type: 0,
          registration_type_name: "再来",
          mainDoctor: "",
          mainNurse: ""
        }
      ],
      isOpenBasicInfo: false,
    };
  }
  
  openBasicInfo = (patient_info) => {
    this.setState({
      isOpenBasicInfo: true,
      isOpenKarteModeModal: false,
      patientInfo:patient_info,
      patientId:patient_info.systemPatientId
    })
  };
  
  closeModal = () => {
    this.setState({
      isOpenBasicInfo: false
    });
  };
  
  render() {
    const PatientsList = [];
    let message;
    
    if (this.props.patientsList.length) {
      this.props.patientsList.map((patient, index) => {
        PatientsList.push(
          <TableItem
            key={index}
            index={index}
            patientNumber={patient.patientNumber}
            systemPatientId={patient.systemPatientId}
            receivedId={patient.receivedId}
            name={patient.name}
            sex={patient.sex}
            age={patient.age}
            deaprtment={patient.deaprtment}
            inOut={patient.inOut}
            department={patient.department}
            department_code={patient.department_code}
            accepted_datetime_str={patient.accepted_datetime_str}
            diagnosis_type={patient.diagnosis_type}
            diagnosis_type_name={patient.diagnosis_type_name}
            registration_type={patient.department}
            registration_type_name={patient.department}
            created_at={patient.created_at}
            updated_at={patient.updated_at}
            mainDoctor={patient.mainDoctor}
            mainNurse={patient.mainNurse}
            numbersOfComments={patient.numbersOfComments}
            status={patient.status}
            is_deleted={patient.is_deleted}
            deleted_at={patient.deleted_at}
            other_departments={patient.other_departments}
            accepted_date={patient.accepted_date}
            is_exist_basic_data={patient.is_exist_basic_data}
            checkKarteMode={this.props.checkKarteMode}
            openBasicInfo = {this.openBasicInfo}
            selected_index = {this.props.selected_index}
            emphasis_icon_info = {patient.emphasis_icon_info}
          />
        );
      });
    } else {
      if(this.props.is_searched == true)
        message = <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>;
    }
    
    return (
      <PatientsTableWrapper>
        <div className="table-header table-row">
          <div className="patient-sex">&nbsp;</div>
          <div className="department-name">診療科</div>
          <div className="patient-id">受付番号</div>
          <div className="patient-id">患者ID</div>
          <div className="patient-name">名前</div>
          <div className="department-content">診療内容</div>
          <div className="other-department">同時診療</div>
          <div className="acceptedlist">受付時間</div>
          <div className="base-data">基礎データ</div>
          <div className="emphasis-icon"> </div>
        </div>
        <div className="table-scroll scroll-area">
          {this.props.is_searched ? (
            <>{PatientsList}{message}</>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
        </div>
        {this.state.isOpenBasicInfo && (
          <BasicInfoModal
            closeModal={this.closeModal}
            patientInfo={this.state.patientInfo}
            patientId={this.state.patientId}
          />
        )}
      </PatientsTableWrapper>
    );
  }
}
PatientsTable.contextType = Context;
PatientsTable.propTypes = {
  patientsList: PropTypes.array,
  is_searched:PropTypes.bool,
  checkKarteMode:PropTypes.func,
  selected_index:PropTypes.number,
};

export default PatientsTable;
