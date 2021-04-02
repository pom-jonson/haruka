import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "../atoms/Button";
import Context from "~/helpers/configureStore";
import {formatDateLine, formatDateSlash, formatTimeSecondIE, formatDateIE} from "../../helpers/date";
import BasicInfoInputModal from "../../components/templates/Patient/components/BasicInfoInputModal"
import BasicInfoGraphModal from "../../components/templates/Patient/components/BasicInfoGraphModal"
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import {KARTEMODE} from "~/helpers/constants"
import Pagination from "~/components/molecules/Pagination";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

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
  height: 100%;
  overflow: auto;
  position: relative;
  font-size: 1rem;
  .flex {display:flex;}
  .panel-menu {
    width: 100%;
    margin-top: 0.5rem;
    .menu-btn {
        width:100px;
        text-align: center;
        border: 1px solid #aaa;
        background-color: lightgray;
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid #aaa;
        border-right: 1px solid #aaa;
        border-left: 1px solid #aaa;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 150px);
        border-bottom: 1px solid #aaa;
    }
  }
  .panel-body {
    border: 1px solid #aaa;
    border-top: none;
    padding:5px;
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
  .table-area {
    margin-bottom:0.5rem;
    table {margin:0px;}
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(85vh - 28rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
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
      background-color:#a0ebff;
    }
    td {
      padding: 0.25rem;
      word-break: break-all;
      font-size: 1rem;
      vertical-align: middle;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.25rem;
      font-size: 1rem;
      white-space:nowrap;
      border:1px solid #dee2e6;
      border-bottom:none;
      border-top:none;
      font-weight: normal;
    }
  }
  .display-number {
    .label-title {
      width:5rem;
      font-size:1rem;
      line-height:2rem;
    }
    .pullbox-label {margin-bottom: 0;}
    .pullbox-select {
      width:4rem;
      font-size:1rem;
      height:2rem;
      line-height:2rem;
    }
  }
  .pagination {
    margin-bottom: 0;
    li {
      height: 2rem;
      a {
        line-height: 2rem;
        height: 2rem;
        font-size: 1rem;
        padding: 0 12px;
      }
    }
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
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

export class BasicInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab_id: 0,
      isOpenInputModal: false,
      isOpenGraphModal: false,
      isDeleteConfirmModal: false,
      modal_type: 0,    //0:身長・体重  , 1:バイタル
      today_height_weight_data: null,
      height_weight_data: [],
      vital_data: [],
      modal_data: null,
      display_number: 10,
      pageOfItems:null,
      is_loaded:false,
      confirm_message:"",
      alert_messages:"",
    };
    this.per_page = [{id:1, value:10},{id:2, value:20},{id:3, value:50}];
    this.karte_mode = KARTEMODE.READ;
  }
  
  async componentDidMount() {
    let base_modal = document.getElementsByClassName("basicdata-modal")[0];
    base_modal.style['z-index'] = 1040;
    this.karte_mode = this.context.$getKarteMode(this.props.patientId);
    await this.searchList();
  }
  
  setTab = ( e, val ) => {
    this.setState({ tab_id:val });
  };
  // 身長・体重
  openHeightInputModal = () => {
    if (this.props.from_mode !== "nursing_document" && this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let alert_messages = "";
    if(this.state.today_height_weight_data != null && this.state.today_height_weight_data.length > 0) {
      alert_messages = "当日の身長と体重が登録済みです。";
    }
    if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.REGISTER, 0)){
      alert_messages = "登録権限がありません。";
    }
    if(alert_messages != ""){
      this.setState({alert_messages});
      return;
    }
    this.setState({
      isOpenInputModal: true,
      modal_data:null,
      modal_type: 0,
    });
    let base_modal = document.getElementsByClassName("basic-info-view-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
  };
  
  // バイタル
  openVitalInputModal = () => {
    if (this.props.from_mode !== "nursing_document" && this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages:"登録権限がありません。"});
      return;
    }
    this.setState({
      isOpenInputModal: true,
      modal_data:null,
      modal_type: 1
    });
    let base_modal = document.getElementsByClassName("basic-info-view-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
  };
  
  closeModal = (act, alert_messages=null) => {
    this.setState({
      isOpenInputModal: false,
      isOpenGraphModal: false,
      alert_messages:act == "register" ? alert_messages : "",
    }, async()=> {
      if(act== "register"){
        await this.searchList();
      }
    });
    let base_modal = document.getElementsByClassName("basic-info-view-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1040;
  };
  
  searchList = async () => {
    if (this.props.patientId === undefined || this.context.dateStatus === undefined || this.context.dateStatus == null) return;
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    let post_data = {
      system_patient_id: this.props.patientId,
      measure_date: formatDateLine(this.context.dateStatus),
    };
    let path = "/app/api/v2/patients/basic_data/search";
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
      let today_height_weight_data = this.state.today_height_weight_data;
      let height_weight_data = this.state.height_weight_data;
      if (res['height_weight'] != undefined && res['height_weight'] != null && res['height_weight'].length > 0) {
        today_height_weight_data = [];
        res['height_weight'].map(item => {
          if (item.measure_date == formatDateLine(new Date())) {
            today_height_weight_data.push(item);
          }
        });
        height_weight_data = res['height_weight'];
      }
      this.setState({
        today_height_weight_data,
        height_weight_data,
        vital_data: res['vital']!= undefined && res['vital']!= null?res['vital']:[],
        max_min_constants:res['max_min_constants'],
        is_loaded:true,
      })
    });
  };
  
  openGraphModal = () => {
    if (this.state.tab_id === 0){
      if (this.state.height_weight_data == undefined || this.state.height_weight_data == null || this.state.height_weight_data.length==0) return;
      this.setState({
        isOpenGraphModal: true,
        graph_data: this.state.height_weight_data,
        modal_type:0
      });
    } else if (this.state.tab_id === 1) {
      if (this.state.vital_data == undefined || this.state.vital_data == null || this.state.vital_data.length==0) return;
      this.setState({
        isOpenGraphModal: true,
        graph_data: this.state.vital_data,
        modal_type:1
      });
    }
  };
  
  handleClick = (e, index, modal_type) => {
    if (this.props.from_mode !== "nursing_document" && this.karte_mode == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
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
        edit_date =formatDateLine(formatDateIE(this.state.pageOfItems[index].measure_at));
      } else {
        edit_date =this.state.pageOfItems[index].measure_date;
      }
      if (edit_date == formatDateLine(new Date())){
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.EDIT, 0)){
          this.setState({alert_messages:"変更権限がありません。"});
          return;
        }
      } else {
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.EDIT_OLD, 0)){
          this.setState({alert_messages:"変更(過去)権限がありません。"});
          return;
        }
      }
      this.editData(index);
    }
    if (type === "delete"){
      if(this.state.tab_id == 1){
        edit_date = formatDateLine(formatDateIE(this.state.pageOfItems[index].measure_at));
      } else {
        edit_date =this.state.pageOfItems[index].measure_date;
      }
      if (edit_date == formatDateLine(new Date())){
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.DELETE, 0)){
          this.setState({alert_messages:"削除権限がありません。"});
          return;
        }
      } else {
        if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.DELETE_OLD, 0)){
          this.setState({alert_messages:"削除(過去)権限がありません。"});
          return;
        }
      }
      this.setState({
        selected_number:this.state.tab_id === 0 ? this.state.pageOfItems[index].number : this.state.pageOfItems[index].number
      }, ()=> {
        this.delete();
      })
    }
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
      alert_messages: "",
    });
  }
  
  editData = (index) => {
    let modal_data = this.state.tab_id === 0 ? this.state.pageOfItems[index] : this.state.pageOfItems[index];
    this.setState({
      modal_data,
      isOpenInputModal: true,
    });
  };
  
  delete = () => {
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "削除して良いですか？",
    });
  };
  
  deleteData = async () => {
    let path = "/app/api/v2/patients/basic_data/delete";
    let post_data = {
      params: {
        type: this.state.tab_id === 0 ? "height_weight" : "vital",
        number:this.state.selected_number
      },
    };
    await apiClient.post(path,  post_data);
    await this.confirmCancel();
    await this.searchList();
  };
  
  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };
  
  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  }
  
  render() {    
    let {patientInfo} = this.props;
    let {height_weight_data, vital_data, today_height_weight_data, pageOfItems} = this.state;
    return (
      <Modal
        show={true}
        className="custom-modal-sm med-modal basicdata-modal basic-info-view-modal first-view-modal height-weight-vital"
        id="basicdata-modal"
      >
        <Modal.Header>
          <Modal.Title>基礎データ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="d-flex w-100">
              <div style={{width:"5rem"}}>患者ID</div>
              <div>: {patientInfo.receId != undefined && patientInfo.receId != null ? patientInfo.receId : patientInfo.patientNumber}</div>
            </div>
            <div className="d-flex w-100">
              <div style={{width:"5rem"}}>名前</div>
              <div>: {patientInfo.name}{patientInfo.age !== undefined && patientInfo.age !== 0 ? "(" +patientInfo.age + ")" : ""}</div>
            </div>
            <div className="panel-menu d-flex">
              { this.state.tab_id === 0 ? (
                <><div className="active-menu">身長・体重</div></>
              ) : (
                <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>身長・体重</div></>
              )}
              { this.state.tab_id === 1 ? (
                <><div className="active-menu">バイタル</div></>
              ) : (
                <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>バイタル</div></>
              )}
              <div className="no-menu"></div>
            </div>
            <div className={'panel-body'}>
              <div className="graph-link p-1">
                {this.state.tab_id === 0 && (
                  <span className={(height_weight_data!=undefined && height_weight_data!=null && height_weight_data.length>0)?'enabled':'disabled'} onClick={this.openGraphModal.bind(this)}>グラフ表示</span>
                )}
                {this.state.tab_id === 1 && (
                  <span className={(vital_data!=undefined && vital_data!=null && vital_data.length>0)?'enabled':'disabled'} onClick={this.openGraphModal.bind(this)}>グラフ表示</span>
                )}
              </div>
              {this.state.tab_id === 0 && (
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered" id="basic-data-table">
                    <thead>
                    <tr>
                      <th style={{width: "100px"}}>測定日</th>
                      <th style={{width: "300px"}}>身長</th>
                      <th>体重</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.is_loaded ? (
                      <>
                        {(today_height_weight_data == null || today_height_weight_data.length == 0 ) && (
                          <tr>
                            <td style={{width: "100px"}}>{formatDateSlash(this.context.dateStatus)}</td>
                            <td colSpan={2}
                              className={'text-center ' + ((this.props.from_mode !== "nursing_document" && this.karte_mode === KARTEMODE.READ) ? "disabled" : "new-input")}
                              onClick={this.openHeightInputModal}
                            >
                              新規に入力
                            </td>
                          </tr>
                        )}
                        {this.state.is_loaded && pageOfItems != null && pageOfItems.length > 0 && pageOfItems.map((item,index) => {
                          return (
                            <tr key={item.number} onContextMenu={e => this.handleClick(e, index, 0)}>
                              <td style={{width: "100px"}}>{formatDateSlash(item.measure_date)}</td>
                              <td style={{width: "300px"}} className="text-right">{parseFloat(item.height).toFixed(this.state.max_min_constants.height_decimal_place)}cm</td>
                              <td className="text-right">{parseFloat(item.weight).toFixed(this.state.max_min_constants.weight_decimal_place)}kg</td>
                            </tr>
                          )
                        })}
                      </>
                    ):(
                      <>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              )}
              {this.state.tab_id ===1 && (
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered" id="basic-data-table">
                    <thead>
                    <tr>
                      <th style={{width: "100px"}}>測定日</th>
                      <th>測定時間</th>
                      <th style={{width: "100px"}}>体温</th>
                      <th style={{width: "100px"}}>最高血圧</th>
                      <th style={{width: "100px"}}>最低血圧</th>
                      <th style={{width: "100px"}}>脈拍</th>
                      <th style={{width: "100px"}}>呼吸数</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.is_loaded ? (
                      <>
                        <tr>
                          <td style={{width: "100px"}}>{formatDateSlash(this.context.dateStatus)}</td>
                          <td colSpan={6}
                            className={'text-center ' + ((this.props.from_mode !== "nursing_document" && this.karte_mode === KARTEMODE.READ) ? "disabled" : "new-input")}
                            onClick={this.openVitalInputModal}
                          >
                            新規に入力
                          </td>
                        </tr>
                        {this.state.is_loaded && pageOfItems != null && pageOfItems.length > 0 && pageOfItems.map((item,index) => {
                          return (
                            <tr key={item.number} onContextMenu={e => this.handleClick(e, index, 1)}>
                              <td style={{width: "100px"}}>{item.measure_at != null ? formatDateSlash(formatDateIE(item.measure_at)) : ""}</td>
                              <td>{item.measure_at != null ? formatTimeSecondIE(item.measure_at) : ""}</td>
                              <td style={{width: "100px"}} className="text-right">{parseFloat(item.temperature).toFixed(1)}℃</td>
                              <td style={{width: "100px"}} className="text-right">{item.max_blood}mmHg</td>
                              <td style={{width: "100px"}} className="text-right">{item.min_blood}mmHg</td>
                              <td style={{width: "100px"}} className="text-right">{item.pluse}bpm</td>
                              <td style={{width: "100px"}} className="text-right">{item.respiratory}bpm</td>
                            </tr>
                          )
                        })}
                      </>
                    ):(
                      <>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className={'flex'}>
                <div className="display-number">
                  <SelectorWithLabel
                    options={this.per_page}
                    title="表示件数"
                    getSelect={this.getDisplayNumber}
                    departmentEditCode={this.state.display_number}
                  />
                </div>
                <Pagination
                  items={this.state.tab_id ===0 ? height_weight_data : vital_data}
                  onChangePage={this.onChangePage.bind(this)}
                  pageSize = {this.state.display_number}
                />
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel" className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
        {this.state.isOpenInputModal && this.state.max_min_constants != undefined && (
          <BasicInfoInputModal
            closeModal={this.closeModal}
            patientId={this.props.patientId}
            modal_type={this.state.modal_type}
            modal_data={this.state.modal_data}
            max_min_constants = {this.state.max_min_constants}
          />
        )}
        {this.state.isOpenGraphModal && (
          <BasicInfoGraphModal
            closeModal={this.closeModal}
            patientId={this.props.patientId}
            modal_type={this.state.modal_type}
            graph_data={this.state.graph_data}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <ConfirmNoFocusModal
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
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}

BasicInfoModal.contextType = Context;
BasicInfoModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  from_mode: PropTypes.string,
};

export default BasicInfoModal;
