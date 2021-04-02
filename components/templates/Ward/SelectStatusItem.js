import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

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
       overflow-y: auto;
       height: 100%;
       width:100%;
       tr{cursor:pointer;}
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
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

class SelectStatusItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_index:0,
      alert_messages:"",
    };
  }

  selectItem=(id)=>{
    this.setState({selected_index:id});
  }

  confirmOk=()=>{
    if(this.state.selected_index == 0){
      this.setState({alert_messages: "項目を選択してください。"});  
    } else {
      this.props.setStatusItem(this.state.selected_index);
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
          className="custom-modal-sm select-status-item first-view-modal"
        >
          <Modal.Header><Modal.Title>項目選択</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'table-area flex'}>
                <table className="table-scroll table table-bordered table-hover">
                  <tbody>
                    {this.props.master_data.length > 0 && (
                      this.props.master_data.map((item)=>{
                        if(item.id != 0){
                          return (
                            <>
                              <tr
                                className={this.state.selected_index == item.id ? 'selected' : ""}
                                onClick={this.selectItem.bind(this, item.id)}
                              >
                                <td>{item.value}</td>
                              </tr>
                            </>
                          );
                        }
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>変更取消</Button>
            <Button className={"red-btn"} onClick={this.confirmOk}>{"ガイド"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
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

SelectStatusItem.propTypes = {
  closeModal: PropTypes.func,
  setStatusItem: PropTypes.func,
  master_data: PropTypes.Object,
};

export default SelectStatusItem;
