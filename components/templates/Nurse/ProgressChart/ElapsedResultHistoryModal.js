import React, { Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import {getStaffName} from "~/helpers/constants";
  
  const Popup = styled.div`
    height: 96%;
    padding:1.5rem;    
    .clickable{
      cursor:pointer;
    }
    table {
      margin-bottom:0px;
      thead{
        display:table;
        width:100%;
      }
      tbody{
        display:block;
        overflow-y: auto;
        height: 33rem;
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}      
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      } 
      .no{
        width:2rem;
      }
      .date{
        width:12rem;
        text-align:center;
      }
      .content{
        width:15rem;
      }
      .updated_by{
        width:15rem;
      }
    }
    .selected{
      background: lightblue!important;
    }
  `;
  
  class ElapsedResultHistoryModal extends Component {
    constructor(props) {
      super(props);
      var history_data = this.props.history_data;      
      this.state = {
        history_data,
      }
    }

    setHistoryItem = (selected_number) => {
      this.setState({selected_number})
    }

    handleOk = () => {
      if (this.state.selected_number > 0){
        this.props.handleOk(this.state.selected_number);
      } else {
        window.sessionStorage.setItem("alert_messages","更新歴を選択してください。");      
      }
    }
    
    render() {
      var history_data = this.state.history_data;
      let {tier_3rd_number_data} = this.props;
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>更新歴一覧</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
              <table className="table-scroll table table-bordered">
                <thead>
                  <tr>
                    <th className='no'/>
                    <th className='date'>更新日時</th>
                    <th className='content'>項目</th>
                    <th className='updated_by'>更新者</th>
                    <th className='comment'>コメント</th>
                  </tr>
                </thead>
                <tbody>
                  {history_data != undefined && history_data != null && history_data.length > 0 && (
                    history_data.map((item, index) => {
                      return(
                        <>
                          {/*<tr onClick={this.setHistoryItem.bind(this, item.number)} className={this.state.selected_number == item.number?'selected clickable':'clickable'}>*/}
                          <tr onClick={this.setHistoryItem.bind(this, item.number)}>
                            <td className='no text-right'>{index + 1}</td>
                            <td className='date'>{item.updated_at}</td>
                            <td className='content'>{tier_3rd_number_data[item.tier_3rd_id] !== undefined ? tier_3rd_number_data[item.tier_3rd_id].name : ""}</td>
                            <td className="updated_by">{getStaffName(item.updated_by)}</td>
                            <td className="comment">{item.comment}</td>
                          </tr>
                        </>
                      )
                    })
                  )}
                </tbody>
              </table>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                {/*<Button className="red-btn" onClick={this.handleOk}>確定</Button>*/}
            </Modal.Footer>            
          </Modal>        
        </>
      );
    }
  }
  ElapsedResultHistoryModal.contextType = Context;
  
  ElapsedResultHistoryModal.propTypes = {
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    history_data:PropTypes.array,
    tier_3rd_number_data:PropTypes.object,
  };
  
  export default ElapsedResultHistoryModal;