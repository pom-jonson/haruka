import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "../atoms/Button";
import Context from "~/helpers/configureStore";
import {formatDateLine, formatDateIE, formatTimeSecondIE, formatDateSlash} from "../../helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import {KARTEMODE} from "~/helpers/constants"
import {makeList_number} from "~/helpers/dialConstants"

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  width: 100%;
  height: auto;
  padding: 9px 9px 9px 2px;   
  position: relative;
  .panel-menu {
    width: 100%;
    .menu-btn {
        width:100px;
        text-align: center;
        border: 1px solid black;
        // background-color: rgba(200, 194, 194, 0.22);
        background-color: lightgray;
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 150px);
        border-bottom: 1px solid black;
    }
  }
  .enabled{
    color:blue;
    cursor:pointer;
  }
  .disabled{
    color:lightgray;
  }
  .new-input{
    cursor:pointer;
    color:blue;
  }  
  .w-100{    
    overflow-y:auto;
    // overflow-x:scroll;
    display:block;
  }
  table {
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height:190px;
      overflow-y:auto;
      display:block;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: center;
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }
 }
 .table{
  th{background-color:#a0ebff;}
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
    padding: 0px;
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
  if (visible) {
    return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
            <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
          </ul>
        </ContextMenuUl>
    );
  } else {
    return null;
  }
};

export class HistoryInfoModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });

    this.state = {
      tab_id: 0,
      isDeleteConfirmModal: false,
      modal_type: 0,    //0:身長・体重  , 1:バイタル
      history_data:null,
      height_weight_data: null,
      vital_data: null,
      modal_data: null,
      is_loaded:false,

      department_codes,
      department_options:diagnosis,
    };
  }

  async componentDidMount() {
    var base_modal = document.getElementsByClassName("custom-modal-sm")[0];
    base_modal.style['z-index'] = 1040;
    this.getWardMaster();
    this.getPatientDiseases();
    this.searchList();
  }

  getPatientDiseases = async() => {
    let path = "/app/api/v2/disease_name/search_in_patient";
    await apiClient.get(path, {params:{systemPatientId: this.props.patientId}})
    .then(res => {
      if (res.disease_list != undefined && res.disease_list != null && res.disease_list.length > 0){
        var options = [{id:0, value:''}];
        var diseaseName_object = {};
        res.disease_list.map(item => {                    
          options.push({id:item.number, value:item.disease_name});
          diseaseName_object[item.number] = item.disease_name;
        })
        this.setState({
          diseaseName_options:options,
          disaseNamses:res.disease_list,          
          diseaseName_object,          
        })
        
      }
    })      
  }

  getWardMaster = async()=> {
    let path = "/app/api/v2/ward/get/bed_control/master_data";
    await apiClient.post(path, {params: {}})
    .then(res => {
      this.setState({        
        hospital_room_master:makeList_number(res.hospital_room_master),
      })
    })
  }
  
  searchList = async () => {
    if (this.props.patientId === undefined || this.context.dateStatus === undefined || this.context.dateStatus == null) return;
    let post_data = {
      system_patient_id: this.props.patientId,
      measure_date: formatDateLine(this.context.dateStatus),
    };
    let path = "/app/api/v2/order/get/all_done_history";
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {      
      this.setState({        
        history_data:res,
      })
    });

    path = "/app/api/v2/in_out_hospital/in_hospital/getHospitalHistory";
    await apiClient.post(path, {
      params: {patient_id:this.props.patientId}
    }).then((res) => {      
      this.setState({
        is_loaded:true,
        hospitailization_data : res,
      })
    });
  };

  
  handleClick = (e, index, modal_type) => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
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
          .getElementById("basic-data-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
                .getElementById("basic-data-table")
                .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("basicdata-modal").offsetLeft,
          y: e.clientY + window.pageYOffset - 100
        },
        row_index: index, 
        modal_type:modal_type
      });
    }
  };

  contextMenuAction = (index, type) => {
    let edit_date;
    if (type === "edit"){      
      
      if(this.state.tab_id == 1){
        edit_date =formatDateLine(formatDateIE(this.state.vital_data[index].measure_at));
      } else {
        edit_date =this.state.height_weight_data[index].measure_date;
      }      
      if (edit_date == formatDateLine(new Date())){
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.EDIT, 0)){
          window.sessionStorage.setItem("alert_messages","変更権限がありません。");
          return;
        }
      } else {
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.EDIT_OLD, 0)){
          window.sessionStorage.setItem("alert_messages","変更(過去)権限がありません。");
          return;
        }
      }        
      
      this.editData(index);
    }
    if (type === "delete"){      
      if(this.state.tab_id == 1){
        edit_date = formatDateLine(formatDateIE(this.state.vital_data[index].measure_at));
      } else {
        edit_date =this.state.height_weight_data[index].measure_date;
      }      
      if (edit_date == formatDateLine(new Date())){
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.DELETE, 0)){
          window.sessionStorage.setItem("alert_messages","削除権限がありません。");
          return;
        }
      } else {
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.DELETE_OLD, 0)){
          window.sessionStorage.setItem("alert_messages","削除(過去)権限がありません。");
          return;
        }
      }        
      
      
      this.setState({
        selected_number:this.state.tab_id === 0 ? this.state.height_weight_data[index].number : this.state.vital_data[index].number
      }, ()=> {
        this.delete();
      })
    }
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  editData = (index) => {    
    let modal_data = this.state.tab_id === 0 ? this.state.height_weight_data[index] : this.state.vital_data[index];
    this.setState({
      modal_data,      
    });
  };

  delete = () => {    
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "削除して良いですか？",
    });
  };

  render() {
    let { history_data, hospitailization_data} = this.state;    
    return (
      <Modal
        show={true}        
        className="custom-modal-sm history-info-modal first-view-modal"
        id="basicdata-modal"
      >
        <Modal.Header>
          <Modal.Title>受診歴／入退院歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="w-100">
              <div className="sub-title">受診歴</div>
              <table className="table table-bordered table-scroll" id="basic-data-table">
                <thead>
                  <tr className="table-menu">
                    <th className="text-left p-1" style={{width:'100px'}}>日付</th>
                    <th className="text-left p-1" style={{width:'100px'}}>時刻</th>
                    <th className="text-left p-1" style={{width:'300px'}}>医師名(依頼医)</th>
                    <th className="text-left p-1">オーダ種類</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.is_loaded && history_data != null && history_data.length > 0 && history_data.map((item) => {                    
                    let order_title = item.category;
                    if(item.category === '処方' || item.category === '処置' || item.category === '注射'){
                        order_title = (item.karte_status === 1 ? '外来' : '在宅') + item.category;
                    }
                    if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
                      item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
                      order_title = '検体検査';
                      if (item.sub_category == "細胞診検査") order_title = "細胞診検査";
                      else if (item.sub_category == "病理検査") order_title = "病理組織検査";
                      else if (item.sub_category == "細菌検査") order_title = "細菌・抗酸菌検査";
                    }
                    if(item.category === '放射線' || item.category === '生理検査'){
                        order_title = item.sub_category;
                    }
                    return (
                      <tr key={item.number}>
                        <td className="text-left p-1" style={{width:'100px'}}>{formatDateSlash(item.updated_at.split('-').join('/'))}</td>
                        <td className="text-left p-1" style={{width:'100px'}}>{formatTimeSecondIE(item.updated_at)}</td>
                        <td className="text-left p-1" style={{width:'300px'}}>{item.order_data != undefined && item.order_data != null && item.order_data.doctor_name}</td>
                        <td className="text-left p-1">{order_title}</td>
                      </tr>
                    )
                  })}
                  {this.state.is_loaded != true && (
                    <>
                    <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="w-100" style={{marginTop:'15px'}}>
              <div className="sub-title">入退院歴</div>
              <table className="table table-bordered table-scroll" id="basic-data-table">
                <thead>
                  <tr className="table-menu">
                    <th className="text-left p-1" style={{width:'180px'}}>日付</th>
                    <th className="text-left p-1" style={{width:'150px'}}>診療科</th>
                    <th className="text-left p-1" style={{width:'150px'}}>病室</th>
                    <th className="text-left p-1">実施状況</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.is_loaded && hospitailization_data != undefined && hospitailization_data != null && hospitailization_data.length > 0 && (
                    hospitailization_data.map(item => {
                      return(
                        <>
                          <tr>
                            <td className='text-left' style={{width:'180px'}}>{formatDateSlash(item.treat_date.split('-').join('/'))}</td>
                            <td className='text-left' style={{width:'150px'}}>{this.state.department_options != undefined && this.state.department_options != null?this.state.department_options[item.department_id]:''}</td>
                            <td className='text-left' style={{width:'150px'}}>{this.state.hospital_room_master != undefined && this.state.hospital_room_master != null?this.state.hospital_room_master[item.hospital_room_id]:''}</td>
                            <td className='text-left'>{item.order_title}</td>
                          </tr>
                        </>
                      )
                    })
                  )}
                  {this.state.is_loaded != true && (
                    <>
                      <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </>
                  )}
                </tbody>
              </table>
            </div>            
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel" className='cancel-btn' onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>                
        {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.deleteData.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
        )}
        <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
        />
      </Modal>
    );  
  }
}
HistoryInfoModal.contextType = Context;
HistoryInfoModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
};

export default HistoryInfoModal;
