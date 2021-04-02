import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";

const Wrapper = styled.div`  
  .flex{display:flex;}
  table {
    margin-bottom:0px;
    font-size:1rem;
    thead{
      display:table;
      width:100%;
      border-bottom:1px solid #dee2e6;
      background-color: #a0ebff;
      tr {width: calc(100% - 17px);}
    }
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(80vh - 26rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{
        background-color:#e2e2e2 !important;
        cursor: pointer;
      }
    }
    tr{
      display: table;
      width: 100%;
    }
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
      border-bottom:none;
    }
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 40vh;
  display: flex;
`;

class DiseaseNameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded:false,
      disease_list:[],
      isAddDiseaseNameModal: false,
      
      disease_number:0,
      disease: null,
    }
  }

  async componentDidMount(){
    await this.searchDiseaseName();
  }

  searchDiseaseName=async()=>{
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
      disease_list:(data.disease_list != null && data.disease_list !== undefined && data.disease_list.length > 0) ? data.disease_list: [],
    });
  }

  getDepartment = (e) => {
    this.setState({department:parseInt(e.target.value)});
  }

  getEndDate = (e) => {
    this.setState({end_date:parseInt(e.target.value)});
  }

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
    this.setState({isAddDiseaseNameModal:false});
  }

  render() {
    return  (
      <Modal show={true}  className="select-disease-name-modal first-view-modal">
        <Modal.Header><Modal.Title>病名一覧</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'flex'}>
              <button onClick={this.showAddDiseaseNameModal.bind(this)}>病名新規登録</button>
              <div style={{marginLeft:"1rem"}}>追加する病名をクリックし、確定してください。該当項目がない場合は、「病名新規登録」ボタンをクリックし、登録してください。</div>
            </div>
            <div className="medicine-list">
              <table className={'table-scroll table table-bordered'}>
                <thead>
                  <tr>
                    <th style={{width:'5rem'}}>分類</th>
                    <th>病名</th>
                    <th style={{width:'8rem'}}>(初回)診療日</th>
                    <th style={{width:'8rem'}}>(初回)検査日</th>
                    <th style={{width:'6rem'}}>病名発症日</th>
                    <th style={{width:'5rem'}}>転帰区分</th>
                    <th style={{width:'6rem'}}>転帰日</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.isLoaded ? (
                  <>
                    {this.state.disease_list.length > 0 && (
                      this.state.disease_list.map((disease)=>{
                        return (
                          <>
                            <tr
                              className={this.state.disease_number === disease.number ? 'selected' : 'disease-row'}
                              onClick={this.handleClick.bind(this, disease.disease_name, disease.number, disease)}
                            >
                              <td style={{width:'5rem'}}> </td>
                              <td>{disease.disease_name}</td>
                              <td style={{width:'8rem'}}> </td>
                              <td style={{width:'8rem'}}> </td>
                              <td style={{width:'6rem'}}> </td>
                              <td style={{width:'5rem'}}> </td>
                              <td style={{width:'6rem'}}> </td>
                            </tr>
                          </>
                        )
                      })
                    )}
                  </>
                ):(
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
                </tbody>
              </table>
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
          <Button className='red-btn' onClick={this.selectDiseaseName.bind(this)}>確定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DiseaseNameList.contextType = Context;
DiseaseNameList.propTypes = {
  closeModal: PropTypes.func,
  selectDiseaseName: PropTypes.func,
  system_patient_id: PropTypes.number,
};
export default DiseaseNameList;
