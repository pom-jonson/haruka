import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import $ from "jquery";
import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

registerLocale("ja", ja);

const Popup = styled.div`
  .flex {
    display: flex;
  }
  height: 96%;

  h2 {
    color: ${colors.onSurface};
    font-size: 17px;
    font-weight: 500;
    margin: 6px 0;
  }  
  .case {
    margin-left:20px;
    margin-top:16px;
    .label-title{
      display:none;
    }
    .pullbox-label{
      padding-right:7px;
      height:32px;
      select{
        width: 100%;
        padding-right:11px;
        height:32px;
      }
    }        
  }  
  .disease-header{
    .react-datepicker-wrapper{
      input{
        width:7rem;
        padding-bottom:6px;
      }
    }
    span{
      padding-top:5px;
      padding-left:2px;
      padding-right:2px;
    }
    .department-status{
      .label-title{
        margin-top:-1px;
      }
      .pullbox-title{
        font-size: 16px;
      }      
      .pullbox-label{
        padding-right:7px;
        height:32px;
      }
      select{
        width:100%;
        padding-right:11px;
        height:32px;
      }
    }
    overflow: hidden;
    display:flex;
    .radio-area:nth-child(odd){      
      float: left;
    }
    .ml-3{
      padding-top: 17px;
      padding-left: 20px;
      label{
        font-size:15px;
      }
    }
    .radio-area{
        width: 240px;
        margin-right: 10px;
        border:1px solid darkgray;
        padding: 5px;    
        legend{
        font-size: 16px;
        width: auto;
        margin-bottom: 0;
        padding-left: 10px;
        margin-left: 10px;
        padding-right: 10px;
        }
        .radio-groups{
            label{
                margin-right:20px;
                margin-bottom:5px;
            }
        }
    }
  }
  .small-text-area{
    width: 95%;
    margin-right: 10px;
    margin-top: 10px;
    border:1px solid darkgray;
    padding: 5px;    
    legend{
      font-size: 22px;
      width: auto;
      margin-bottom: 0;
      padding-left: 10px;
      margin-left: 10px;
      padding-right: 10px;
    }    
    margin-bottom:10px;    
    textarea{
      width:95%;
      height:80px;
    }
  }
  .text-area{
    width: 99%;
    margin-right: 10px;
    margin-top: 10px;
    border:1px solid darkgray;
    padding: 5px;    
    legend{
      font-size: 22px;
      width: auto;
      margin-bottom: 0;
      padding-left: 10px;
      margin-left: 10px;
      padding-right: 10px;
    }    
    margin-bottom:10px;    
    textarea{
      width:99%;
      height:350px;
    }
  } 
  .panel-menu {
    width: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    display:flex;
    .menu-btn {
        width:200px;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:200px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 300px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
    
  .label-title {
    float: left;
    text-align: right;
    width: 70px;
    line-height: 38px;
    &.pullbox-title {
      margin-right: 8px;
    }
  }
  
  table {
    font-size: 14px;
    vertical-align: middle;
    width: 100%;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 340px);  
      overflow-y:auto;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    .date-td{
      width:75px;
    }
    .department-td{
      width:100px;
    }
    .hospital-td{
      width:45px;
    }
    .kind-td{
      width:45px;
    }
    .doctor-td{
      width:175px;
    }
    .status-td{
      width:63px;
    }
    .content-td{
      WORD-BREAK: break-all;
    }
  }

  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: 190px;

    .no-result {
      padding: 75px;
      text-align: center;

      p {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
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
  .start_date, .end_date {
    width: 90px;
  }

  .center {
    text-align: center;
    button {
      height: 25px;
      padding: 0;
      line-height: 25px;
      span {
        color: ${colors.surface};
      }
    }

    span {
      color: rgb(241, 86, 124);
    }

    .black {
      color: #000;
    }
  }
  .red {
    color: rgb(241, 86, 124);
  }
  .modal-footer{
    justify-content: center;
  }
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0 20px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const order_options = [
  {id:0, value:'', field_name:''},
  {id:1, value:'最新表示', field_name:'treat_date'}
];

const ContextMenu = ({ visible, x,  y,  parent,  selected_item,}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  <li><div onClick={() => parent.contextMenuAction(selected_item,"edit")}>編集</div></li>
                  <li><div onClick={() => parent.contextMenuAction(selected_item, "delete")}>削除</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};

class SymptomListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date:new Date(),
      end_date:new Date(),
      departmentCode:0,
      order:1,
      treat_date:new Date(),
      number:0,
      inside:1,
      outer:1,      
      modal_data:null,

      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
    }
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }

  componentDidMount(){
    this.getSearchResult();    
  }

  async getSearchResult() {
    let path = "/app/api/v2/karte/symptom/getSymptomData";
    let post_data = {
      start_date:this.state.start_date,
      end_date:this.state.end_date,      
      department_id:this.state.departmentCode,
      patientId:this.props.patientId,
      inside:this.state.inside,
      outer:this.state.outer,
      order:order_options[this.state.order].field_name,
    }
    await apiClient.post(path, post_data)
      .then((res) => {        
        if (res.list_data != null && res.list_data.length != 0){
          this.setState({list_item:res.list_data})
        } else {
          this.setState({
            list_item:[],
          })
        }
      })
  } 

  getDepartment = (e) => {
    
    this.setState({departmentCode:parseInt(e.target.id)}, () => {
      this.getSearchResult();
    });
  }

  getHospitalStatus = (name, value) => {
    switch(name){
      case 'outer-hospital':
        this.setState({outer:value})
        break;
      case 'inside-hospital':
        this.setState({inside:value})
        break;
    }
  }
  
  getStartDate = (value) => {
    this.setState({start_date:value}, () => {
      this.getSearchResult();
    });
  }

  getEndDate = (value) => {
    this.setState({end_date:value}, () => {
      this.getSearchResult();
    });
  }

  getOrder = (e) => {
    this.setState({order:e.target.id})
  }

  create = () => {    
    this.props.closeModal(null);
  }  

  handleClick = (e, selected_item) => {
    if (e.type === "contextmenu") {
        e.preventDefault();
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
            that.setState({ contextMenu: { visible: false } });
            document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
                contextMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
            .getElementById("code-table")
            .addEventListener("scroll", function onScrollOutside() {
                that.setState({
                    contextMenu: { visible: false }
                });
                document
                    .getElementById("code-table")
                    .removeEventListener(`scroll`, onScrollOutside);
            });
        this.setState({
            contextMenu: {
                visible: true,
                x: e.clientX -$('#symptom').offset().left,
                y: e.clientY -$('#symptom').offset().top - 40,
                selected_item,
            },
            
        });
    }
  };

  contextMenuAction = (selected_item, type) => {
    if (type === "edit"){
        this.updateData(selected_item);
    }
    if (type === "delete"){
        this.setState({
            selected_number:selected_item.content_number,
            isDeleteConfirmModal : true,
            confirm_message: "これを削除して良いですか？",
        })
    }
  };

  confirmCancel() {
    this.setState({
        isUpdateConfirmModal: false,
        isDeleteConfirmModal: false,
        confirm_message: "",
    });
  }

  deleteData = async () => {
    let path = "/app/api/v2/karte/symptom/deleteContent";
    let post_data = {
        params:{
            number: this.state.selected_number,
        }
    };
    await apiClient.post(path,  post_data);
    this.confirmCancel();
    this.getSearchResult();
  };

  updateData = (selected_item) => {    
    this.props.closeModal(selected_item);
  };
  closeModal = () => {    
    this.props.closeModal();
  };
  

  render() {
    var departments_options = [{id:0, value:''}];
    departments_options = departments_options.concat(this.departmentOptions);
    return (
      <>
        <Modal
          show={true}          
          id="symptom"
          className="custom-modal-sm patient-exam-modal disease-name-modal first-view-modal"
        >
          <Modal.Header>
              <Modal.Title>症状詳記一覧</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Popup>              
                <div className="disease-header flex">
                  <div className="d-flex" style={{marginTop:'16px'}}>
                    <label style={{marginRight:5,marginTop:4}}>表示期間</label>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.getStartDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                      // customInput={<ExampleCustomInput />}
                    />
                    <span>～</span>
                    <DatePicker
                      locale="ja"
                      selected={this.state.end_date}
                      onChange={this.getEndDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                      // customInput={<ExampleCustomInput />}
                    />
                  </div>
                  <div className="department-status ml-2" style={{marginTop:15}}>
                    <SelectorWithLabel
                      title="診療科"
                      options={departments_options}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.departmentCode}                    
                    />
                  </div>
                  <div className="ml-3">
                    <Checkbox
                        label="外来"
                        getRadio={this.getHospitalStatus.bind(this)}
                        value={this.state.outer}
                        checked = {this.state.outer === 1}
                        name="outer-hospital"
                    />
                    <Checkbox
                        label="入院"
                        getRadio={this.getHospitalStatus.bind(this)}
                        value={this.state.inside}
                        checked = {this.state.inside === 1}
                        name="inside-hospital"
                    />
                  </div>
                  <div className="case">
                    <SelectorWithLabel
                      title=""
                      options={order_options}
                      getSelect={this.getOrder}
                      departmentEditCode={this.state.order}
                    />
                  </div>
                </div>              

                <div className="panel-menu">
                <table className="table table-bordered table-striped table-hover" id="code-table">
                    <thead>
                      <tr >
                        <th className="date-td">年月</th>
                        <th className="department-td">診療科</th>
                        <th className="hospital-td">入外</th>
                        <th className="kind-td">区分</th>
                        <th className="content-td">症状詳記</th>
                        <th className="doctor-td">担当医</th>
                        <th className="status-td">状態</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.list_item != undefined && this.state.list_item != null && this.state.list_item.length > 0 && (
                      this.state.list_item.map(item => {
                        var flag = false;
                        if (!(item.hospital_status > 0)) flag = true;
                        if (this.state.outer == 1 && item.hospital_status == 1 ) flag = true;
                        if (this.state.inside == 1 && item.hospital_status == 2 ) flag = true;
                        if (flag){
                          return(
                            <>
                            <tr onContextMenu={e => this.handleClick(e, item)}>
                              <td className="date-td">{item.treat_date}</td>
                              <td className="department-td">{item.department_name}</td>
                              <td className="hospital-td">
                                {item.hospital_status==1 && '外'}
                                {item.hospital_status == 2 && '入'}
                              </td>
                              <td className="kind-td">{item.symptom_detail_kind}</td>
                              <td className="content-td">{item.symptom_detail_content}</td>
                              <td className="doctor-td">{item.doctor_name}</td>
                              <td className="status-td">{item.status==1?'記載済':''}</td>
                            </tr>
                            </>                        
                          )
                        }
                      })
                    )}
                    </tbody>                  
                  
                  </table>
                </div>
                
              </Popup>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeModal.bind(this)}>キャンセル</Button>
            <Button className="red-btn" onClick={this.create.bind(this)}>新規作成</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}            
          />
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.deleteData.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
          )}          
        </Modal>        
      </>
    );
  }
}
SymptomListModal.contextType = Context;

SymptomListModal.propTypes = {  
  closeModal: PropTypes.func,    
  patientId: PropTypes.number
};

export default SymptomListModal;
