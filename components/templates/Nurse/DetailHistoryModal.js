import React, {
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
//   import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";
  // import Radiobox from "~/components/molecules/Radiobox";  
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  // import $ from "jquery";  
  // import {formatJapanDate, formatDateTimeIE} from "~/helpers/date";
  // import Checkbox from "~/components/molecules/Checkbox";  
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";
  // registerLocale("ja", ja);

  const Popup = styled.div`
    .flex {
      display: flex;
    }
    height: 96%;    
    button{
      height:36px;         
    }    
    .no-border-td{
      border-top:none;
      border-left:noen;
      border-bottom:none;
      width:120px;
    }    
    .main-content{
      justify-content: space-between;
      .one-blog{
        width:250px;
      }
      th{
        background:lightgray;
      }
      .blog-header{
        height:20px;
      }
      .blog-title{
        height:20px;
        margin-left:15px;
      }
      .main-level{
        font-size: 25px;
        margin-left: 50px;
        height:40px;
      }
      .table-content{
        margin-left:50px;
      }
    }
    .selected {
      background:lightblue;
    }
    .date{
      width:14rem;
    }
    th, td{
      vertical-align:middle;
      text-align:center;
    }
  `;
  class DetailHistoryModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        confirm_flag:false,
      }
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    componentDidMount(){
      this.getSearchResult();
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/nursing_service/require_history_search";      
      let post_data = {
        patient_id:this.props.patientId,
        selected_detail_field: this.props.necessary_master[this.props.selected_detail_name],
      };
      await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          history_data:res,
        })
      });
    }

    selectCheckbox = (name, value) => {
      this.setState({[name]:value});
    }
  
    render() {            
      return (
        <>
          <Modal show={true} id="outpatient" className="custom-modal-smfirst-view-modal">
            <Modal.Header>
              <Modal.Title style={{width:'25rem'}}>歴参照</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className='content-box'>
                  <table className="table-scroll table table-bordered">
                    <tr>
                      <th className='date'>作成日</th>
                      <th>{this.props.selected_detail_name}の値</th>
                    </tr>                  
                    {this.state.history_data != undefined && this.state.history_data != null && this.state.history_data.length > 0 && (
                      this.state.history_data.map(item => {
                        var necessary_master = this.props.necessary_master;                        
                        return (
                          <>
                          <tr>
                            <td>{item.created_at}</td>
                            <td>
                              {item[necessary_master[this.props.selected_detail_name]]}
                            </td>
                          </tr>
                          </>
                        )
                      })
                    )}
                  </table>
                {this.state.history_data == undefined || this.state.history_data == null && this.state.history_data.length == 0 && (
                  <><div>履歴がありません。</div></>
                )}
                </div>                
              </Popup>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }
  DetailHistoryModal.contextType = Context;
  
  DetailHistoryModal.propTypes = {
    closeModal: PropTypes.func,
    selected_detail_name: PropTypes.string,
    necessary_master: PropTypes.object,
    patientId: PropTypes.number
  };
  
  export default DetailHistoryModal;
  