import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as colors from "~/components/_nano/colors";
// import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
// import DatePicker, { registerLocale } from "react-datepicker";
// import ja from "date-fns/locale/ja";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import RadioButton from "~/components/molecules/RadioInlineButton";
// import Radiobox from "~/components/molecules/Radiobox";
// import Checkbox from "~/components/molecules/Checkbox";
// import * as apiClient from "~/api/apiClient";
// import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
// import NotDoneListModal from "~/components/organisms/NotDoneListModal";
// import OrderDoneModal from "~/components/templates/OrderList/OrderDoneModal";
// import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
// import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
// import * as sessApi from "~/helpers/cacheSession-utils";
// import {CACHE_SESSIONNAMES} from "~/helpers/constants";
// import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";

// registerLocale("ja", ja);
// import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
// import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
// import SetDetailViewModal from "~/components/templates/Patient/Modals/Common/SetDetailViewModal";
// import axios from "axios/index";
// import $ from "jquery";
// import {KARTEMODE} from "~/helpers/constants";



const Wrapper = styled.div`
  .treat-date{
    padding: 5px;
  }
  .search-department-type{
    display: flex;
    width: 30%;
    label{
        padding: 2px;
    }
  }
  .select-box{
    .pullbox-title{
        width: 50px;
    }
    select{
        width: 150px;
    }
  }
  .select-info{
    height: 50vh;
    border: 1px solid #ddd;
  }
  .user-info-title{
    display: flex;
    overflow: hidden;
    justify-content: space-between;
    margin-top: 15px;
    button{
        height: 40px;
        span{
            font-size: 14px;
        }
    }
  }
  .date-label{
    float: left;
    padding: 5px;
  }
  .col-select-info, .col-user-info{
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .view-date{
    width: 150px;
    border: 1px solid #ddd;
    height: 38px;
    float: left;
    margin-left: 10px;
    border-radius: .3rem;
  }
  .modal-btn {
        width: 40px;        
        height: 40px;        
    }
  .search-order-type{
    width: 70%;
    display: flex;
    justify-content: flex-end;
    .radio-btn{
        width: 100px;
        margin-left: 10px;
        label{
            background: #aaa;
            border-radius: 0px;
            color: white;
        }
    }
    .focused{
        input:checked + label{
            background: white;
            color: #212529;
            border: 1px solid #212529;
        }
    }
  }
  .operation-buttons{
    display: flex;
    justify-content: flex-end;
    margin: 10px auto;
    span{
        font-size: 14px;
    }
  }
  .search-order-results{
    overflow-y: auto;
    height: 50vh;
    border: 1px solid #ddd;
  }

  table{
    width: 100%;
  }

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }

  .btn-group{
    margin: 10% auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }
`;


 const Footer = styled.div`
    display: flex;    
    span{
      color: white;
      font-size: 16px;
    }
    button{
      float: right;
      padding: 5px;
      font-size: 16px;
      margin-right: 16px;
    }
    .ixnvCM{
        font-size: 15px;
        padding-top: 8px;
    }
  `;


class SetUserInfoModal extends Component {
    constructor(props) {
      super(props);  
      this.state={
        department: {
            id: 0,
            value: ""
        },
        ward: {
            id: 0,
            value: ""
        }
      }  

      this.list_data = [
        {
            user_id: 1,
            name_kana: "ﾀﾛｳ",
            user_name: "太郎",
            sex: "男",
            job: "研修医"
        },
        {
            user_id: 2,
            name_kana: "ﾀﾛｳ",
            user_name: "太郎",
            sex: "女",
            job: "研修医"  
        },
        {
            user_id: 3,
            name_kana: "ﾀﾛｳ",
            user_name: "太郎",
            sex: "男",
            job: "研修医"  
        },
        {
            user_id: 4,
            name_kana: "ﾀﾛｳ",
            user_name: "太郎",
            sex: "男",
            job: "研修医"  
        },
        {
            user_id: 5,
            name_kana: "ﾀﾛｳ",
            user_name: "太郎",
            sex: "男",
            job: "研修医"  
        },
        {
            user_id: 6,
            name_kana: "ﾀﾛｳ",
            user_name: "太郎",
            sex: "女",
            job: "研修医"  
        }
      ];

      this.ward_list = [
        {
            id: 1,
            value: "病棟1"
        },
        {
            id: 2,
            value: "病棟2"  
        },
        {
            id: 3,
            value: "病棟3"  
        },
        {
            id: 4,
            value: "病棟4"  
        },
        {
            id: 5,
            value: "病棟5"
        }
      ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;         
    }

    async componentDidMount() {
        // this.getSearchResult();        
    }    

      confirmCancel = () => {
        this.setState({
            confirm_message: "",
            confirm_type: ""
        });
      }

      confirmOk = () => {
        this.doDelete();
        this.setState({
            confirm_message: "",
            confirm_type: ""
        }); 
      }    

      handleWard = (e) => {
        let _state = {
            id: parseInt(e.target.id),
            value: e.target.value
        };
        this.setState({
            ward: _state
        });
      }

      handleDepartments = (e) => {
        let _state = {
            id: parseInt(e.target.id),
            value: e.target.value
        };
        this.setState({
            department: _state
        });
      }

    render() {
        return (
            <>
                <Modal
                    show={true}                    
                    id="outpatient"
                    className="custom-modal-sm patient-exam-modal outpatient-modal set-user-info first-view-modal"
                >
                    <Modal.Header>
                        <Modal.Title>
                            利用者情報
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className="user-info-title" style={{display:"flex"}}>
                                <div>
                                    <label className={'date-label'}>職種</label>
                                    <div className={'view-date'}>{}</div>
                                </div>
                                <div className="select-box">
                                    <SelectorWithLabel
                                        options={this.departmentOptions}
                                        title="診療科"
                                        getSelect={this.handleDepartments}
                                        departmentEditCode={this.state.department.id}
                                    />
                                </div>
                                <div className="select-box">
                                    <SelectorWithLabel
                                        options={this.ward_list}
                                        title="病棟"
                                        getSelect={this.handleWard}
                                        departmentEditCode={this.state.ward.id}
                                    />
                                </div>
                                <div>
                                    <label className={'date-label'}>力ナ</label>
                                    <div className={'view-date'}></div>
                                </div>
                                <Button onClick={this.handleOk}>検索</Button>
                            </div>                           
                            <div style={{display: "flex"}}>
                                <div className="col-user-info" style={{width:"65%"}}>
                                    <div>利用者情報</div>
                                    <div className="search-order-results">                                
                                        <table>
                                            <tr>
                                              <th>利用者ID</th>
                                              <th>カナ氏名</th>
                                              <th>利用者氏名</th>
                                              <th>性別</th>
                                              <th>職種</th>
                                            </tr> 
                                            {this.list_data.length > 0 && this.list_data.map(item=>{                                                                            
                                                return(
                                                    <tr key={item.user_id}>
                                                        <td>{item.user_id}</td>
                                                        <td>{item.name_kana}</td>
                                                        <td>{item.user_name}</td>
                                                        <td>{item.sex}</td>
                                                        <td>{item.job}</td>
                                                    </tr>
                                                );    
                                            })}          
                                        </table>
                                    </div>
                                </div>
                                <div className="btn-group" style={{width: "5%"}}>
                                    <div>
                                        <button className={'modal-btn'}>{'>'}</button>
                                        <button style={{marginTop:"10px"}} className={'modal-btn'}>{'>>'}</button>
                                    </div>
                                    <div>
                                        <button style={{marginBottom:"10px"}} className={'modal-btn'}>{'<'}</button>
                                        <button className={'modal-btn'}>{'<<'}</button>
                                    </div>
                                </div>
                                <div className="col-select-info" style={{width: "30%"}}>
                                    <div>選択情報</div>
                                    <div className="select-info">

                                    </div>
                                </div>
                            </div>
                            
                        </Wrapper>                        
                    </Modal.Body>  
                    <Modal.Footer>  
                        <Footer>
                          <Button onClick={this.props.handleOk}>確定</Button>
                          <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                        </Footer>
                    </Modal.Footer>                                       
                </Modal>
               
            </>
        );
    }
}

SetUserInfoModal.contextType = Context;
SetUserInfoModal.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    discharge_date: PropTypes.string,
    cache_index:PropTypes.number,
};

export default SetUserInfoModal;
