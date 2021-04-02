import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
// import {formatDateLine, formatDateIE, formatTimeSecondIE, formatDateSlash} from "../../helpers/date";
import {formatJapanDateSlash} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  width: 100%;
  height: 100%;
  padding: 9px 9px 9px 2px;   
  position: relative;
  .panel-menu {
    width: 100%;
    .menu-btn {
        width:100px;
        text-align: center;
        border: 1px solid black;
        // background-color: rgba(200, 194, 194, 0.22);
        background-color: lightgray;
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 150px);
        border-bottom: 1px solid black;
    }
  }
  .enabled{
    color:blue;
    cursor:pointer;
  }
  .disabled{
    color:lightgray;
  }
  .new-input{
    cursor:pointer;
    color:blue;
  }  
  .w-100{    
    overflow-y:auto;
    // overflow-x:scroll;
    display:block;
  }
  table {
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height:calc(100vh - 26rem);
      overflow-y:auto;
      display:block;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: center;
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }
 }
 .table{
  th{background-color:#a0ebff;}
}
`;

export class PatientNotDoneListModal extends Component {
  constructor(props) {
    super(props);    
    
    this.state = {
      history_data:null,
      is_loading:true,
    };
  }

  async componentDidMount() {
    // var base_modal = document.getElementsByClassName("custom-modal-sm")[0];
    // base_modal.style['z-index'] = 1040;
    this.searchList();
  }
  
  searchList = async () => {
    let post_data = {
      system_patient_id: this.props.patientId,      
    };
    let path = "/app/api/v2/order/patient/not_done_list";
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {      
      this.setState({        
        history_data:res,
        is_loading: false
      })
    });    
  };  

  getLabel = (item) => {
    let result = "";    
    if (item != undefined && item != null) {
      if (item.done_date != undefined && item.done_date != null && item.done_date != "") {
        // done date
        if (item.done_date.length >= 10) {
          result = formatJapanDateSlash(item.done_date) + "予定";
        } else {
          result = item.done_date;
        }
        // karte status
        if (item.karte_status != undefined && item.karte_status != null && item.karte_status > 0) {
          result += "・" + (item.karte_status == 1 ? "外来" : item.karte_status == 2 ? "訪問診療" : item.karte_status == 3 ? "入院" : "");
        }
        // order type
        if (item.category != undefined && item.category != null && item.category != "") {
          result += "・" + item.category;
        }
        // create date and doctor_name
        if (item.updated_at != undefined && item.updated_at != null && item.updated_at != "") {
          if (item.updated_at.length >= 10 && item.doctor_name != undefined && item.doctor_name != null && item.doctor_name != "") {
            result += "［" + formatJapanDateSlash(item.updated_at) + "・" + item.doctor_name + "］";
          }
        }
      }      
    }
    return result;
  }

  render() {
    let { history_data} = this.state;    
    return (
      <Modal
        show={true}        
        className="custom-modal-sm history-not-done-info-modal"
        id="basicdata-modal"
      >
        <Modal.Header>
          <Modal.Title>未実施オーダー詳細</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="w-100">              
              <table className="table table-bordered table-scroll" id="basic-data-table">
                {/* <thead>
                  <tr className="table-menu">
                    <th className="text-left p-1" style={{width:'100px'}}>日付</th>
                    <th className="text-left p-1" style={{width:'100px'}}>時刻</th>
                    <th className="text-left p-1" style={{width:'300px'}}>医師名(依頼医)</th>
                    <th className="text-left p-1">オーダ種類</th>
                  </tr>
                </thead> */}
                <tbody>
                  {this.state.is_loading == true ? (
                    <>
                      <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    </>
                  ):(
                    <>
                      {history_data != null && history_data.length > 0 && history_data.map((item) => {     
                        let show_label = this.getLabel(item);   
                        if (show_label != "") {                          
                          return (
                            <>
                              <tr>
                                <td className="text-left">{show_label}</td>                        
                              </tr>
                            </>
                          )
                        }                 
                      })}
                    </>
                  )}                  
                </tbody>
              </table>
            </div>                        
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel" className='cancel-btn' onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>                             
      </Modal>
    );  
  }
}
PatientNotDoneListModal.contextType = Context;
PatientNotDoneListModal.propTypes = {
  closeModal: PropTypes.func,
  // patientInfo: PropTypes.object,
  patientId: PropTypes.number,
};

export default PatientNotDoneListModal;
