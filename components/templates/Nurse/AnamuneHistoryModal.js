import React, { 
  Component, 
  // useContext
 } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";  
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {formatDateSlash} from "~/helpers/date";

const Popup = styled.div`
  .flex {
    display: flex;
  }
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
      width:22rem;
      text-align:center;
    }
    .reason{
      width:37rem;
    }
  }
  .selected{
    background: lightblue!important;
  }
`;

class AnamuneHistoryModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      alert_messages:''
    }
  }

  closeAlertModal = () => {
    this.setState({
      alert_messages:"",
    })
  }

  async componentDidMount(){
    this.getHistoryData();
  }

  getHistoryData = async () => {
    let path = "/app/api/v2/nursing_service/get/summary_individual_all";
    var database_flag = 0;
    switch(this.props.from_source){
      case 'database':
        database_flag = 1;
        break;
      case 'anamune':
        database_flag = 2;
        break;
      case 'visit':
        path = "/app/api/v2/nursing_service/get/visit_summary_individual_all";      
    }
    let post_data = {
      history_numbers:this.props.history_numbers,
      database_flag,
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.setState({history_data:res});
      })
  }

  setHistoryItem = (item) => {
    this.setState({
      selected_number:item.number,
      selected_hitory_item:item
    })
  }

  handleOk = () => {
    if (this.state.selected_number > 0){
      this.props.handleOk(this.state.selected_hitory_item);
    } else {
      this.setState({
        alert_messages:"更新歴を選択してください。"
      })
    }
  }
  
  render() {
    var history_data = this.state.history_data;      
    return (
      <>
        <Modal
          show={true}          
          id="outpatient"
          className="custom-modal-sm notice-modal first-view-modal"
        >
          <Modal.Header>
              <Modal.Title style={{width:'20rem'}}>歴一覧</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Popup>
            <table className="table-scroll table table-bordered">
              <thead>
                <tr>
                  <th className='no'></th>
                  <th className='date'>更新日付</th>
                  {/* <th className='reason'>更新理由</th> */}
                  <th>更新者</th>
                </tr>
              </thead>
              <tbody>
                {history_data != undefined && history_data != null && history_data.length > 0 && (
                  history_data.map((item, index) => {
                    return(
                      <>
                        <tr onClick={this.setHistoryItem.bind(this, item)} className={this.state.selected_number == item.number?'selected clickable':'clickable'}>
                          <td className='no' style={{textAlign:"right"}}>{index + 1}</td>
                          <td className='date'>{item.revision_date != null ? formatDateSlash(item.revision_date.split('-').join('/')) : ""}</td>
                          {/* <td className='reason'>{item.reason_for_renewal}</td> */}
                          <td className='text-center'>{item.updated_name}</td>
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
              <Button className="red-btn" onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeAlertModal}
              handleOk= {this.closeAlertModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>        
      </>
    );
  }
}
AnamuneHistoryModal.contextType = Context;

AnamuneHistoryModal.propTypes = {  
  handleOk :  PropTypes.func,
  closeModal: PropTypes.func,
  history_numbers: PropTypes.string,
  from_source: PropTypes.string,
};

export default AnamuneHistoryModal;
