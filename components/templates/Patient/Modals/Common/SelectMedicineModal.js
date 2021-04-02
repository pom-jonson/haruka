import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Radiobox from "~/components/molecules/Radiobox";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";

const Wrapper = styled.div`  
    .header{
        
    }
    .flex{
        display:flex;
    }
    .radio-area{
        width:45%;        
        margin-right: 10px;
        margin-top: 5px;
        border:1px solid darkgray;
        padding: 5px;    
        legend{
        font-size: 16px;
        width: auto;
        margin-bottom: 0;
        padding-left: 10px;
        margin-left: 10px;
        padding-right: 10px;
        }
        margin-bottom:10px;
        .radio-groups{
            label{
                margin-right:20px;
                margin-bottom:5px;
                font-size:14px;
            }
        }
    }
    .medicine-list{
    }
  
  table {
    margin-bottom:0px;
    font-size: 1rem;
    vertical-align: middle;
    width: 100%;
    thead{
      display:table;
      width: 100%;
      tr{width: calc(100% - 17px);}
    }
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(70vh - 20rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2;}
      tr {cursor: pointer;}
    }
    tr{
      display: table;
      width: 100%;
    }
    td {
      word-break: break-all;
      padding: 0.25rem;
      font-size:1rem;
    }
    th {
        position: sticky;
        font-size:1.25rem;
        padding: 0.3rem;
        background-color: ${colors.midEmphasis};
        color: ${colors.surface};
        text-align: center;
        font-weight: normal;
        label {
          color: ${colors.surface};
        }
    }
    .table-check {
        width: 3.75rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
        width: 7.5rem;
    }
    .name{
      width:10rem;
    }
  }

  .table-scroll {
    width: 100%;
    height: 100%;

    .no-result {
      padding: 75px;
      text-align: center;

      p {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }

  .disease-row {
    cursor: pointer;
  }
  .selected {
    background: lightblue !important;
  }
  .selected:hover {
    background: lightblue !important;
  }
 `;

const SpinnerWrapper = styled.div`
    justify-content: center;
    align-items: center;
    height: 40vh;
    display: flex;
//   margin-left: 33vh;
//   display: table-caption;
//   position: absolute;
//   top: 230px;
//   top: 40vh;
`;

class SelectMedicineModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department:1,
      end_date:0,
      disease_list:null,
      isLoaded:false,
      disease_name:'',
      disease_number:0,
      isAddDiseaseNameModal: false,
      disease: null,
    }
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }

  async componentDidMount(){
    await this.searchDiseaseName();
  }

  searchDiseaseName =async()=>{
    this.closeModal();
    const { data } = await axios.get(
      "/app/api/v2/disease_name/search_in_patient",
      {
        params: {
          systemPatientId:this.props.system_patient_id,
        }
      }
    );
    this.setState({
      isLoaded: true,
      disease_list:(data.disease_list != null && data.disease_list !== undefined && data.disease_list.length > 0) ? data.disease_list: null,
    });
  }

  getDepartment = (e) => {
    this.setState({department:parseInt(e.target.value)});
  }

  getEndDate = (e) => {
    this.setState({end_date:parseInt(e.target.value)});
  }

  getDepartmentName = code => {
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    return name;
  };

  handleClick(disease_name, disease_number, disease) {
    this.setState({
      disease_name,
      disease_number,
      disease,
    });
  }

  selectDiseaseName =()=>{
    if(this.state.disease_name === ''){
      window.sessionStorage.setItem("alert_messages", '病名を選択してください。');
    } else {
      this.props.selectDiseaseName(this.state.disease_name, this.state.disease);
      this.props.closeModal();
    }
  }

  showAddDiseaseNameModal = () => {
    this.setState({isAddDiseaseNameModal:true});
  }

  closeModal = () => {
    this.setState({
      isAddDiseaseNameModal:false
    });
  }

  render() {
    return  (
      <Modal show={true} id=""  className="select-disease-name-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>病名</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="header flex">
              <fieldset className="radio-area">
                <legend className="blog-title">診療科</legend>
                <div className = "radio-groups">
                  <Radiobox
                    label={`自科(${this.context.department.name !== ""?this.context.department.name:"内科"})`}
                    value={0}
                    getUsage={this.getDepartment.bind(this)}
                    checked={this.state.department === 0 ? true : false}
                    name={`department`}
                  />
                  <Radiobox
                    label={'全科'}
                    value={1}
                    getUsage={this.getDepartment.bind(this)}
                    checked={this.state.department === 1 ? true : false}
                    name={`department`}
                  />
                </div>
              </fieldset>
              <fieldset className="radio-area">
                <legend className="blog-title">転帰/未転帰</legend>
                <div className = "radio-groups">
                  <Radiobox
                    label={'未転帰のみ'}
                    value={0}
                    getUsage={this.getEndDate.bind(this)}
                    checked={this.state.end_date === 0}
                    name={`outcome`}
                  />
                  <Radiobox
                    label={'全て'}
                    value={1}
                    getUsage={this.getEndDate.bind(this)}
                    checked={this.state.end_date === 1}
                    name={`outcome`}
                  />
                </div>
              </fieldset>
            </div>
            <div className="medicine-list">
              {this.state.isLoaded === false ? (
                <div className='center'>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              ) : (
                <table className={'table-scroll table table-bordered'}>
                  <thead>
                  <tr>
                    <th style={{width:'6rem'}}>診療科</th>
                    <th>病名</th>
                    <th style={{width:'7rem'}}>開始日</th>
                    <th style={{width:'7rem'}}>終了日</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.disease_list != null ? (
                    this.state.disease_list.map(disease => {
                      if(this.state.department === 1){
                        if(this.state.end_date === 0){
                          if(disease.end_date == null){
                            return (
                              <>
                                <tr
                                  className={this.state.disease_number === disease.number ? 'selected' : 'disease-row'}
                                  onClick={this.handleClick.bind(this, disease.disease_name, disease.number, disease)}
                                >
                                  <td style={{width:'6rem'}}>{this.getDepartmentName(disease.department_code)}</td>
                                  <td>{disease.disease_name}</td>
                                  <td style={{width:'7rem'}}>{disease.start_date}</td>
                                  <td style={{width:'7rem'}}></td>
                                </tr>
                              </>
                            );
                          }
                        } else {
                          return (
                            <>
                              <tr
                                className={this.state.disease_number === disease.number ? 'selected' : 'disease-row'}
                                onClick={this.handleClick.bind(this, disease.disease_name, disease.number, disease)}
                              >
                                <td style={{width:'6rem'}}>{this.getDepartmentName(disease.department_code)}</td>
                                <td>{disease.disease_name}</td>
                                <td style={{width:'7rem'}}>{disease.start_date}</td>
                                <td style={{width:'7rem'}}>{disease.end_date === null ? "" : disease.end_date}</td>
                              </tr>
                            </>
                          );
                        }
                      } else {
                        if(disease.department_code == (this.context.department.code == 0 ? 1: this.context.department.code)){
                          if(this.state.end_date === 0){
                            if(disease.end_date == null){
                              return (
                                <>
                                  <tr
                                    className={this.state.disease_number === disease.number ? 'selected' : 'disease-row'}
                                    onClick={this.handleClick.bind(this, disease.disease_name, disease.number, disease)}
                                  >
                                    <td style={{width:'6rem'}}>{this.getDepartmentName(disease.department_code)}</td>
                                    <td>{disease.disease_name}</td>
                                    <td style={{width:'7rem'}}>{disease.start_date}</td>
                                    <td style={{width:'7rem'}}></td>
                                  </tr>
                                </>
                              );
                            }
                          } else {
                            return (
                              <>
                                <tr
                                  className={this.state.disease_number === disease.number ? 'selected' : 'disease-row'}
                                  onClick={this.handleClick.bind(this, disease.disease_name, disease.number, disease)}
                                >
                                  <td style={{width:'6rem'}}>{this.getDepartmentName(disease.department_code)}</td>
                                  <td>{disease.disease_name}</td>
                                  <td style={{width:'7rem'}}>{disease.start_date}</td>
                                  <td style={{width:'7rem'}}>{disease.end_date === null ? "" : disease.end_date}</td>
                                </tr>
                              </>
                            );
                          }
                        }
                      }
                    })
                  ) : (
                    <>
                      <tr>
                        <td colSpan="6" className="center">
                          <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                        </td>
                      </tr>
                    </>
                  )}
                  </tbody>
                </table>
              )}
            </div>
            {this.state.isAddDiseaseNameModal && (
              <DiseaseNameModal
                closeModal = {this.searchDiseaseName}
                patientId={this.props.system_patient_id}
              />
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className='red-btn' onClick={this.showAddDiseaseNameModal.bind(this)}>病名新規登録</Button>
          <Button className='red-btn' onClick={this.selectDiseaseName.bind(this)}>確定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectMedicineModal.contextType = Context;

SelectMedicineModal.propTypes = {
  closeModal: PropTypes.func,
  selectDiseaseName: PropTypes.func,
  system_patient_id: PropTypes.number,
};

export default SelectMedicineModal;
