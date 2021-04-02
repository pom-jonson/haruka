import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
import NutritionGuidanceSchedule from "./NutritionGuidanceSchedule";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Spinner from "react-bootstrap/Spinner";
import * as localApi from "~/helpers/cacheLocal-utils";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .flex {display: flex;}
  .select-period {
    margin-bottom:0.5rem;
    .from-to{
      padding-left:5px;
      padding-right:5px;
      line-height: 2.3rem;
      margin-top: 8px;
    }
    .label-title {
      width: 4rem;
      margin: 0;
      font-size:1rem;
      line-height: 2.3rem;
    }
  }
  .react-datepicker-wrapper {
    width: 100%;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 14px;
        width: 100%;
        height: 2.3rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
    }
  }
  .table-area {
    table {
      margin:0px;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 80vh - 18rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
        box-sizing: border-box;
      }
      thead{
        display:table;
        width:100%;
        tr{width: calc(100% - 17px);}
          border-bottom: 1px solid #dee2e6;
      }
      td {
          padding: 0.25rem;
          word-break: break-all;
      }
      th {
          text-align: center;
          padding: 0.3rem;
          white-space:nowrap;
          border-bottom: none;
      }
      .order-count {
          width: 8rem;
      }
      .complete-count {
        width: 8rem;
      }
      .cancel-count {
          width: 11rem;
      }
      .print-count {
          width: 4rem;
      }
    }
  }
`;

const ContextMenuUl = styled.div`
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
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 16px;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
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
  .patient-info-table {
        width: 100%;
        table {
            margin-bottom: 0;
        }
        th {
            font-size: 16px;
            vertical-align: middle;
            padding: 0;
            text-align: right;
            width: 110px;
            padding-right: 5px;
        }
        td {
            font-size: 16px;
            vertical-align: middle;
            padding: 0;
            text-align: left;
            padding-left: 5px;
        }
  }
`;

const ContextMenu = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction()}>詳細</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class NutritionGuidanceSlipTotal extends Component {
  constructor(props) {
    super(props);
    let cur_date = new Date();
    this.state = {
      start_date:new Date(),
      end_date:cur_date.setDate(cur_date.getDate() + 1),
      table_data:[],
      openNutritionGuidanceSchedule:false,
      complete_message:"",
      confirm_message:"",
      load_flag:false,
    };
  }

  async componentDidMount() {
    await this.getOrderSlipTotalData();
  }

  getOrderSlipTotalData=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nutrition_guidance/get_slip_total_data";
    let post_data = {
      start_date:formatDateLine(this.state.start_date),
      end_date:formatDateLine(this.state.end_date),
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          table_data:res,
          load_flag:true,
        });
      })
      .catch(() => {

      });
  }

  setPeriod=(key,value)=>{
    this.setState({[key]:value},()=>{
      this.getOrderSlipTotalData();
    });
  };

  closeModal=()=>{
    this.setState({
      openNutritionGuidanceSchedule:false,
      confirm_message:"",
    });
  };

  handleClick=(e)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("nutrition-guidance-slip-total").offsetLeft,
          y: e.clientY + window.pageYOffset - 140
        },
      })
    }
  };

  contextMenuAction = () => {
    this.setState({openNutritionGuidanceSchedule:true});
  }

  confirmPrint=()=>{
    if(this.state.table_data.length > 0){
      this.setState({confirm_message:"印刷しますか？"});
    }
  }

  confirmOk=async()=>{ //㊞
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/nutrition_guidance/print/slip_total";
    let print_data = {};
    print_data.table_data = this.state.table_data;
    if(this.state.start_date != null && this.state.start_date != ""){
      print_data.start_date = formatDateLine(this.state.start_date);
    }
    if(this.state.end_date != null && this.state.end_date != ""){
      print_data.end_date = formatDateLine(this.state.end_date);
    }
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, '栄養指導.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '栄養指導.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }
  
  confirmModalClose=()=>{
    let done_patient_id = localApi.getValue('nutrition_guidance_done_patient');
    let re = /patients[/]\d+/;
    let cur_url = window.location.href;
    let isPatientPage = re.test(cur_url);
    if(isPatientPage){
      let path = cur_url.split("/");
      if(path[path.length - 1] === "soap" && path[path.length - 2] === done_patient_id){
        this.props.goKartePage(done_patient_id);
      }
    }
    localApi.remove('nutrition_guidance_done_patient');
    this.props.closeModal();
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          id='nutrition-guidance-slip-total'
          className="custom-modal-sm nutrition-guidance-slip-total first-view-modal"
        >
          <Modal.Header><Modal.Title>栄養指導</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'select-period flex'}>
                <InputWithLabel
                  label="開始日"
                  type="date"
                  getInputText={this.setPeriod.bind(this, 'start_date')}
                  diseaseEditData={this.state.start_date}
                />
                <div className={'from-to'}>～</div>
                <InputWithLabel
                  label="終了日"
                  type="date"
                  getInputText={this.setPeriod.bind(this, 'end_date')}
                  diseaseEditData={this.state.end_date}
                />
              </div>
              <div className="table-area">
                <table className="table table-bordered table-hover" id="code-table">
                  <thead>
                  <tr>
                    <th>オーダー種別</th>
                    <th className="order-count">オーダー依頼数</th>
                    <th className="complete-count">オーダー実施数</th>
                    <th className="cancel-count">オーダーキャンセル数</th>
                    <th className="print-count">印刷数</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.load_flag ? (
                    <>
                      {this.state.table_data.length > 0 && (
                        this.state.table_data.map(item=>{
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e)}>
                                <td>栄養指導依頼</td>
                                <td className="order-count text-right">{item.order_count}</td>
                                <td className="complete-count text-right">{item.complete_count}</td>
                                <td className="cancel-count text-right">{item.cancel_count}</td>
                                <td className="print-count text-right">{item.print_count}</td>
                              </tr>
                            </>
                          )
                        })
                      )}
                    </>
                  ):(
                    <tr>
                      <td colSpan={'5'} style={{height:"calc(80vh - 20rem)"}}>
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
            <Button className="cancel-btn" onClick={this.confirmModalClose}>キャンセル</Button>
            <Button className={this.state.table_data.length > 0 ? "red-btn" : "disable-btn"} onClick={this.confirmPrint}>印刷</Button>
            <Button className="red-btn" onClick={this.getOrderSlipTotalData}>最新表示</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.openNutritionGuidanceSchedule && (
            <NutritionGuidanceSchedule
              closeModal={this.closeModal}
              guidance_date={formatDateLine(this.state.start_date)}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

NutritionGuidanceSlipTotal.contextType = Context;
NutritionGuidanceSlipTotal.propTypes = {
  closeModal: PropTypes.func,
  goKartePage: PropTypes.func,
};

export default NutritionGuidanceSlipTotal;
