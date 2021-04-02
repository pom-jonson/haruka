import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
  import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";
  // import Radiobox from "~/components/molecules/Radiobox";  
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";  
  import Button from "~/components/atoms/Button";
  import {
    formatDateString,
    formatDateTimeIE,
    // formatDateLine, 
    formatDateSlash
  } from "~/helpers/date";
  // import $ from "jquery";
  import PlanListNew from "~/components/templates/Patient/NursingDocument/PlanListNew";
import * as localApi from "~/helpers/cacheLocal-utils";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {getServerTime} from "~/helpers/constants";
import axios from "axios/index";

  const Popup = styled.div`
    display:block;    
    height: 96%;

    .selected-record{
      background: lightblue !important;
    }
  
    h2 {
      color: ${colors.onSurface};
      font-size: 1.1rem;
      font-weight: 500;
      margin: 6px 0;
    }
    .table-area {
      margin-top:1rem;      
      margin-bottom: 0.8rem;
      table {
        font-size: 1rem;
        margin-bottom: 0;
      }
        
        thead{
          margin-bottom: 0;
          display:table;
          width:100%;        
          // border: 1px solid #dee2e6;
          tr{
              width: calc(100% - 17px);
          }
        }
        tbody{
          height: 16vh;
          overflow-y: scroll;
          display:block;
          tr:nth-child(even) {background-color: #f2f2f2;}
          tr:hover{
            background-color:#e2e2e2 !important;
            cursor: pointer;
          }
        }
        .problem-tbody{
          height: 70vh;
        }
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
          border-bottom: 0px !important;
        }
        td {
            padding: 0.25rem;
            text-align: left;
        }
        th {
            text-align: center;
            padding: 0.3rem;
            background-color: rgb(160, 235, 255);
        }      
        .tl {
            text-align: left;
        }      
        .tr {
            text-align: right;
        }
    }
    .selected{
      background: lightblue;
    }
  `;
  
  class NursePlanReferenceModal extends Component {
    constructor(props) {
      super(props);
      let patientId = props.patientId;
      let path = window.location.href.split("/");
      if(path[path.length - 1] == "nursing_document"){
        let nurse_patient_info = localApi.getObject("nurse_patient_info");
        if(nurse_patient_info !== undefined && nurse_patient_info != null){
          patientId = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
        }
      }
      this.state = {
        patientId,
        departmentCode:1,
        number:0,
        tab_id:0,        
        problem_list: [],        
        selected_index:0,
        complete_message:'',
        alert_messages:'',
        // search_kind: "problem_plan_search",
      }
      this.PlanRef = React.createRef();
    }  
    async componentDidMount(){
      await this.getNurseProblem();
    }

    getNurseProblem=async()=> {
      let path = "/app/api/v2/master/nurse/problem_search";
      let post_data = {
        system_patient_id:this.state.patientId,
        order:'asc'
      };
      await apiClient
        .post(path, {
          params: post_data
        })
        .then((res) => {
          if (res!= undefined && res != null && res.length>0){
            this.setState({
              problem_list:res,
              selected_problem_item: res[0],
              selected_index:0
            });
          } else {
            this.setState({problem_list:[]})
          }
          
        })
        .catch(() => {
          this.setState({problem_list:[]})
        });
    };

    selectProblem = (selected_item, idx) => {
      this.setState({
        selected_problem_item:selected_item,
        selected_index: idx
      })
    }

    get_title_pdf =async() => {
      let server_time = await getServerTime(); // y/m/d H:i:s
      let pdf_file_name = "看護計画_" + this.props.patientInfo.receId + "_" + formatDateString(new Date(server_time)) + ".pdf";
      return pdf_file_name;
    }

    print = async() => {
      if (this.state.selected_problem_item == undefined || this.state.selected_problem_item == null){
        this.setState({
          alert_messages:'印刷する看護計画を選択してください。'
        })
        return;
      }
      var problem_history_data = this.PlanRef.current.problem_history_data;
      if (problem_history_data == undefined || problem_history_data == null || problem_history_data.length == 0){
        this.setState({
          alert_messages:'登録した看護計画がありません。'
        })
        return;
      }
      this.setState({
        complete_message:"印刷中"
      });
      let pdf_file_name = await this.get_title_pdf();
      let path = "/app/api/v2/nursing_service/print/nurse_plan";
      let print_data = {};
      print_data.patient_info = this.props.patientInfo;
      print_data.problem_info = this.state.selected_problem_item;
      print_data.selected_index = this.state.selected_index;
      print_data.plan_info = problem_history_data;
      axios({
        url: path,
        method: 'POST',
        data:{print_data},
        responseType: 'blob', // important
      }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
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

    confirmCancel=()=>{      
      this.setState({
        alert_messages: "",
        confirm_message: "",        
        complete_message:''
      });
    }
  
    render() {      
      var {problem_list} = this.state;      
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
          >
            <Modal.Header>
              <Modal.Title style={{width:'20rem'}}>看護業務照会</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"4rem"}}>No</th>
                      <th>内容</th>
                      <th style={{width:"10rem"}}>登録日</th>
                      <th style={{width:"10rem"}}>登録者</th>
                      <th style={{width:"10rem"}}>評価日</th>
                      <th style={{width:"10rem"}}>評価</th>
                      <th style={{width:"10rem", borderRightStyle:'none'}}>次回評価日</th>
                    </tr>
                    </thead>
                    <tbody>
                      {problem_list.length > 0 && (
                        problem_list.map((item, idx) => {
                          return(
                            <>                            
                            <tr onClick={this.selectProblem.bind(this, item, idx)} className={this.state.selected_index === idx ? 'selected-record' : ''}>
                              <td className='text-center clickable' style={{width:"4rem"}}>#{idx + 1}</td>
                              <td>{item.name}</td>
                              <td className='text-center' style={{width:"10rem"}}>{formatDateSlash(formatDateTimeIE(item.created_at))}</td>
                              <td style={{width:"10rem"}}>{item.creater_name}</td>
                              <td className='text-center' style={{width:"10rem"}}>{formatDateSlash(formatDateTimeIE(item.evaluation_class_date))}</td>
                              <td style={{width:"10rem"}}>{item.evaluation_name}</td>
                              <td className='text-center' style={{width:"10rem"}}>{formatDateSlash(formatDateTimeIE(item.next_evaluate_date))}</td>
                            </tr>
                            </>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className='detail-area'>
                  {this.state.selected_problem_item != undefined && this.state.selected_problem_item != null && (
                    <PlanListNew
                      nurse_problem_item = {this.state.selected_problem_item}
                      problem_index = {this.state.selected_index}
                      ref = {this.PlanRef}
                    />
                  )}
                </div>                
              </Popup>
            </Modal.Body>
            <Modal.Footer>
              <Button className="red-btn" onClick={this.print.bind(this)}>印刷</Button>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            </Modal.Footer>
            {this.state.complete_message !== '' && (
              <CompleteStatusModal
                message = {this.state.complete_message}
              />
            )}
            {this.state.alert_messages !== "" && (
              <SystemAlertModal
                hideModal= {this.confirmCancel.bind(this)}
                handleOk= {this.confirmCancel.bind(this)}
                showMedicineContent= {this.state.alert_messages}            
              />
            )}
          </Modal>
        </>
      );
    }
  }
  NursePlanReferenceModal.contextType = Context;
  
  NursePlanReferenceModal.propTypes = {  
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    patientInfo : PropTypes.object,
    detailedPatientInfo : PropTypes.object,
  };
  
  export default NursePlanReferenceModal;
  