import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .table-area {
   width: 100%;
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: 44vh;
       width:100%;
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
   }  
 }
`;

class NurseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    document.getElementById("cancel_btn").focus();
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm nurse-list first-view-modal"
        >
          <Modal.Body>
            <Wrapper>
              <div className={'table-area flex'}>
                <table className="table-scroll table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style={{width:"10rem"}}>看護師名</th>
                      <th style={{width:"5rem"}}>出勤状況</th>
                      <th style={{width:"3rem"}}>当直</th>
                      <th style={{width:"3rem"}}>部屋</th>
                      <th style={{width:"6rem"}}>ベッド</th>
                      <th style={{width:"7rem"}}>診療科</th>
                      <th>患者氏名</th>
                      <th style={{width:"4rem"}}>チーム</th>
                      <th style={{width:"10rem"}}>担当看護師</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.nurse_data.map((nurse)=>{
                      return (
                        <>
                          {nurse.patient_charge.length > 0 ? (
                            nurse.patient_charge.map((patient, patient_idx)=>{
                              return (
                                <>
                                  <tr>
                                    <td style={{width:"10rem"}}>{patient_idx == 0 ? nurse.name : ""}</td>
                                    <td style={{width:"5rem"}}>{this.props.attendance_names[patient.attendance_id]}</td>
                                    <td style={{width:"3rem", textAlign:"center"}}>{patient.is_duty == 1 ? "○" : ""}</td>
                                    <td style={{width:"3rem"}}>{this.props.room_names[patient.room_num]}</td>
                                    <td style={{width:"6rem"}}>{this.props.bed_names[patient.bed_num]}</td>
                                    <td style={{width:"7rem"}}>{this.props.department_names[patient.treatment_department]}</td>
                                    <td>{patient.patient_name}</td>
                                    <td style={{width:"4rem"}}>なし</td>
                                    <td style={{width:"10rem"}}>{this.props.nurse_names[patient.nurse_id_in_charge]}</td>
                                  </tr>
                                </>
                              )
                            })
                          ):(
                            <>
                              <tr>
                                <td style={{width:"10rem"}}>{nurse.name}</td>
                                <td style={{width:"5rem"}}></td>
                                <td style={{width:"3rem"}}></td>
                                <td style={{width:"3rem"}}></td>
                                <td style={{width:"6rem"}}></td>
                                <td style={{width:"7rem"}}></td>
                                <td></td>
                                <td style={{width:"4rem"}}></td>
                                <td style={{width:"10rem"}}></td>
                              </tr>
                            </>
                          )}
                        </>
                      )}
                    )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.props.closeModal}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_btn'
            >
              <span>キャンセル</span>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

NurseList.propTypes = {
  closeModal: PropTypes.func,
  nurse_data: PropTypes.object,
  attendance_names: PropTypes.object,
  room_names: PropTypes.object,
  bed_names: PropTypes.object,
  department_names: PropTypes.object,
  nurse_names: PropTypes.object,
};

export default NurseList;
