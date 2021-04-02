import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
// import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import {formatDateLine} from "~/helpers/date";
// import * as apiClient from "~/api/apiClient";
// import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";
// import SystemAlertModal from "~/components/molecules/SystemAlertModal";
// import Papa from "papaparse";
// import encoding from "encoding-japanese";
// import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import MedicineRankItem from "~/components/organisms/MedicineRankItem";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";

// const Wrapper = styled.div`
//     overflow-y: auto;
//     height: 100%;
//     .flex {
//         display: flex;
//     }
//     .list-area {
//         margin-top: 10px;
//         width: 100%;
//         height: calc(100% - 50px);
//         overflow-y: auto;    
//         overflow-x: auto;   
//         .table-menu {
//             display: inline-flex;
//             background-color: gainsboro;
//         } 
//         .inline-flex {
//             display: inline-flex;
//             margin-top: -1px;
//         }
//         .date-box {
//             border:1px solid #aaa;
//             width: 120px;
//             padding-left: 5px;
//         }
//         .department-box {
//             border:1px solid #aaa;
//             padding-left: 5px;
//             margin-left: -1px;

//         }
//         .inspection-type-box {
//             border:1px solid #aaa;
//             width: 148px;
//             padding-left: 5px;    
//             margin-left: -1px;
//         }
//         .count-box {
//             border:1px solid #aaa;
//             width: 50px;
//             text-align: right;
//             padding-left: 5px;   
//             padding-right: 2px;
//             margin-left: -1px;
//         }
//     }
//     .no-result {
//         padding: 60px;
//         border: 1px solid #aaa;
//         text-align: center;
//         width: 100%;
//         span {
//             padding: 10px;
//             border: 2px solid #aaa;
//         }
//     }
// `;

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: scroll;
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;

  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${colors.disable};
    }
  }

  p {
    margin-bottom: 0;
  }
`;

// const SpinnerWrapper = styled.div`
//     padding: 0;
// `;

class PrescriptionRankPrintModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm_message: "",
            complete_message:"",
        }
        // this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    async componentDidMount() {
        
    }    

    printPdf = () => {
        if(this.props.prescriptionRankData.length > 0){
          this.setState({confirm_message:"印刷しますか？"});
        }
    }

    confirmCancel = () => {
        this.setState({
          confirm_message: ""
        });
      }

    confirmOk=async()=>{ //
        this.setState({
          confirm_message:"",
          complete_message:"印刷中"
        });
        let path = "/app/api/v2/order/prescription/print/rank_print";
        let print_data = {};
        print_data.table_data = this.props.prescriptionRankData;        
        print_data.patient_info = this.props.patientInfo;
        print_data.course_date = formatDateLine(new Date());
        print_data.modal_type = this.props.modal_type;
        axios({
          url: path,
          method: 'POST',
          data:{print_data},
          responseType: 'blob', // important
        }).then((response) => {
            this.setState({complete_message:""});
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            let title = this.get_title_pdf();
            if(window.navigator.msSaveOrOpenBlob) {
              //IE11 & Edge
              window.navigator.msSaveOrOpenBlob(blob, title);
            }
            else{
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', title); //or any other extension
              document.body.appendChild(link);
              link.click();
            }
          })
          .catch(() => {
            this.setState({
              complete_message:"",
              alert_messages:"印刷失敗",
            });
          })
      }

    get_title_pdf=()=>{
        var title = '処方よく使う薬剤_';
        if (this.props.modal_type == "injection") {
          title = "注射よく使う薬剤_";
        }
        title += this.props.patientInfo.receId;
        title += "_" + formatDateLine(new Date()).split('-').join('');
        return title + ".pdf";
      }

    render() {
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal department-result-preview-modal first-view-modal">
                    <Modal.Header><Modal.Title>よく使う薬剤印刷プレビュー</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <MedicineSelectionWrapper>   
                            <MedicineListWrapper>
                                <div className={'list-area'}> 
                                    {this.props.prescriptionRankData.length > 0 && this.props.prescriptionRankData.map((medicine, orderIndex)=>{
                                        return(                                        
                                            <div key={orderIndex}>
                                              <MedicineRankItem
                                                code={medicine.code}
                                                medicine={medicine}                                                
                                                class_name={"open"}
                                                modal_type={"rank_print"}
                                              />
                                            </div>                                                                      
                                        )
                                    })} 
                                </div>
                            </MedicineListWrapper>                         
                        </MedicineSelectionWrapper>
                        {this.state.confirm_message !== "" && (
                          <SystemConfirmModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.confirmOk.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                          />
                        )}
                        {this.state.complete_message !== '' && (
                          <CompleteStatusModal
                            message = {this.state.complete_message}
                          />
                        )}
                    </Modal.Body>                    
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.confirmCancel}>キャンセル</Button>                      
                      <Button className={this.props.prescriptionRankData.length > 0 ? "red-btn":"disable-btn"} onClick={this.printPdf}>印刷</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
PrescriptionRankPrintModal.contextType = Context;
PrescriptionRankPrintModal.propTypes = {
    confirmCancel: PropTypes.func,
    prescriptionRankData: PropTypes.array,
    modal_type: PropTypes.string,
    patientInfo: PropTypes.object,
};

export default PrescriptionRankPrintModal;
