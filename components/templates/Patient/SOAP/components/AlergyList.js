import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

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
      height: calc(70vh - 15rem);
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

class AlergyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alergy_list:null,
      isLoaded:false,
      allergy_name:'',
      selected_number:0,
      alert_message:''
    }    
  }

  async componentDidMount(){
    await this.getAllergyData();
  }

  async getAllergyData () {    
      let path = "/app/api/v2/allergy/getAllergy";
      let post_data = {
          system_patient_id:this.props.system_patient_id,
          type:this.props.type,
      };
      await apiClient.post(path, {
          params: post_data
      }).then((res) => {        
        this.setState({
          alergy_list:res,
          isLoaded:true,
        })
      });      
  }

  closeAlert = () => {
    this.setState({alert_message:''});
  }

  handleOk = () =>{    
    if(this.state.allergy_name == ''){
      this.setState({alert_message:'アレルギーを選択してください。'})      
      return;
    } else {      
      this.props.selectAlergy(this.state.allergy_name);
      this.props.closeModal();
    }
  }

  selectItem = (item) => {
    this.setState({
      selected_number:item.number,
      allergy_name:item.allergen_name,
    })
  }

  render() {    
    return  (
      <Modal show={true} id=""  className="select-disease-name-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>アレルギー</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>            
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
                    <th style={{width:'12rem'}}>アレルギー{this.props.type == 'food'?'食物':'薬剤'}</th>                    
                    <th style={{width:'7rem'}}>開始日</th>
                    <th>症状</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.alergy_list != undefined && this.state.alergy_list != null && this.state.alergy_list.length > 0 ? (
                    this.state.alergy_list.map(item => {
                      return (
                        <>
                          <tr onClick={this.selectItem.bind(this, item)} className={this.state.selected_number === item.number ? 'selected' : 'item-row'}>
                            <td style={{width:'12rem'}}>{item.allergen_name}</td>
                            <td style={{width:'7rem'}}>{item.start_date}</td>
                            <td>{item.symptom}</td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <tr>
                        <td colSpan="3" className="center">
                          <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                        </td>
                      </tr>
                    </>
                  )}
                  </tbody>
                </table>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>          
          <Button className='red-btn' onClick={this.handleOk.bind(this)}>確定</Button>
        </Modal.Footer>
        {this.state.alert_message != "" && (
          <SystemAlertModal
            hideModal = {this.closeAlert}
            handleOk = {this.closeAlert}   
            showMedicineContent= {this.state.alert_message}
          />
        )}
      </Modal>
      
    );
  }
}

AlergyList.contextType = Context;

AlergyList.propTypes = {
  closeModal: PropTypes.func,
  selectAlergy: PropTypes.func,
  system_patient_id: PropTypes.number,
  type : PropTypes.string,
  patientId: PropTypes.number,
};

export default AlergyList;
