import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{display: flex;}
 .table-area {
   width: 100%;
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: 37vh;
       width:100%;
       tr{cursor:pointer;}
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;    
       border-bottom: 1px solid #dee2e6;    
       tr{width: calc(100% - 17px);}
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
     }
     .selected {background-color:#6FF !important;}
     .selected:hover {background-color:#6FF !important;}
   }  
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class NurseProblemFocusSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      master_data:[],
      selected_index:-1,
      alert_messages:"",
    };
  }

  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/nursing_service/get/nursing_problem_focus_each_inpatient";
    let post_data = {
      hos_number:this.props.hos_number,
      modal_type:this.props.modal_type
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          master_data:res,
        });
      })
      .catch(() => {

      });
  }

  async componentDidMount() {
    document.getElementById("cancel_btn").focus();
  }

  selectProblem=(index)=>{
    this.setState({selected_index:index});
  }

  confirmOk=()=>{
    if(this.state.selected_index == -1){
      this.setState({alert_messages: (this.props.modal_type == "problem" ? "看護問題" : "フォーカス") + "を選択してください。"});
    } else {
      this.props.setProblem(this.state.master_data[this.state.selected_index]);
    }
  }

  closeModal=()=>{
    this.setState({alert_messages:""});
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm nurse-problem-focus-select first-view-modal"
        >
          <Modal.Header><Modal.Title>{this.props.modal_type == "problem" ? "看護問題" : "フォーカス"}選択</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'table-area flex'}>
                <table className="table-scroll table table-bordered table-hover" id={'table_area'}>
                  <thead>
                    <tr>
                      {this.props.modal_type == "problem" ? (
                        <>
                          <th style={{width:"5rem"}}>問題番号</th>
                          <th>看護問題</th>
                          <th style={{width:"6rem"}}>記録日</th>
                        </>
                      ):(
                        <>
                          <th>フォーカス</th>
                          <th style={{width:"6rem"}}>記録日</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.load_flag ? (
                      <>
                        {this.state.master_data.length > 0 && (
                          this.state.master_data.map((item, index)=>{
                            return (
                              <>
                                <tr
                                className={this.state.selected_index == index ? 'selected' : ""}
                                onClick={this.selectProblem.bind(this, index)}
                                >
                                  {this.props.modal_type == "problem" ? (
                                    <>
                                      <td style={{width:"5rem"}}>{"#"+item.problem_number}</td>
                                      <td>{item.name}</td>
                                      <td style={{width:"6rem"}}>{item.record_date != undefined ? item.record_date : "未記録"}</td>
                                    </>
                                  ):(
                                    <>
                                      <td>{item.name}</td>
                                      <td style={{width:"6rem"}}>{item.record_date != undefined ? item.record_date : "未記録"}</td>
                                    </>
                                  )}
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    ):(
                      <tr>
                        <td colSpan={'3'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
              <span>キャンセル</span>
            </div>
            <div onClick={this.confirmOk} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>確定</span>
            </div>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

NurseProblemFocusSelect.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  setProblem: PropTypes.func,
  hos_number: PropTypes.number,
};

export default NurseProblemFocusSelect;
