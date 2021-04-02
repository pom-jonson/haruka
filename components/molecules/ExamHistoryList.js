import React, {Component, useContext} from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatJapanDateSlash} from "../../helpers/date";

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
const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {$canDoAction(FEATURES.EXAMORDER, AUTHS.DONE_OREDER) && (
                <li><div onClick={() => parent.contextMenuAction(row_index,"complete")}>実施</div></li>
            )}
          </ul>
        </ContextMenuUl>
    );
  } else {
    return null;
  }
};
class HistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      order: this.props.order,
      insurance_type: this.props.order.insurance_type,
      patientInfo: this.props.patientInfo,
      patientInfoObject: this.props.patientInfoObject,
      confirm_message: "",
    };
  }

  async componentDidMount() {}

  handleClick = (e, index, state) => {
    if(state == 1) return;
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
          .getElementById("list-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
                .getElementById("list-table")
                .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        },
        row_index: index,
      });
    }
  };

  contextMenuAction = (index, type) => {
    if (type === "complete"){
      this.setState({
        confirm_message: "実施しますか？",
        order_number: index
      })
    }
  };

  confirmCancel() {
    this.setState({
      confirm_message: "",
    });
  }

  confirmOk = () => {
    this.completeData();
    this.setState({
      confirm_message: "",
    });
  };

  openConfirm = () => {
    this.setState({
      confirm_message: "実施しますか？",
    });
  };

  completeData = async () => {
    let path = "/app/api/v2/order/orderComplete";
    let post_data = {
      type:"examination",
      number:this.state.order_number
    };
    await apiClient._post(
        path,
        {params: post_data})
        .then((res) => {
          if(res){
            window.sessionStorage.setItem("alert_messages", res.alert_message);
          }
        })
        .catch((err) => {
          window.sessionStorage.setItem("alert_messages", err.error_messages);
        });
    this.props.searchPrescriptionList();
  };
  i = 0;
  render() {
    const { order,  patientInfoObject } = this.state;

    const isPatientInfoField = patientInfoObject ? true : false;
    const patientInfoKeyNames = [
      "患者情報",
      isPatientInfoField
        ? `${patientInfoObject.name} ${patientInfoObject.patientNumber}`
        : "",
      isPatientInfoField
        ? `${patientInfoObject.sex ? "男性" : "女性"} (${
            patientInfoObject.age
          }歳)`
        : "",
      isPatientInfoField ? `${patientInfoObject.birthday}` : ""
    ];
    return (
      <div className="history-item" onContextMenu={e => this.handleClick(e, this.props.orderNumber,this.props.done_order )} id="list-table">
        <div className="box w70p">
          <div className="flex between drug-item table-row">
            <div className="text-left">
              <div className="table-item">{order.administrate_period !== undefined && order.administrate_period != null ? "採取(予定)日時":"採取日時"}</div>
            </div>
            <div className="text-right">
              {order.administrate_period !== undefined && order.administrate_period != null ? (
                <div className="table-item remarks-comment">
                  {order.administrate_period.done_days.length > 0 && order.administrate_period.done_days.map(item=>{
                    return (
                      <li key ={item}>{item}</li>
                    )
                  })}
                </div>
              ):(
                <div className="table-item remarks-comment">{order.collected_date === "" ? "次回診察日" : order.collected_time === "" ? formatJapanDateSlash(order.collected_date) : formatJapanDateSlash(order.collected_date)+"  "+order.collected_time.substr(0,order.collected_time.length-3)}</div>
              )}
            </div>
          </div>
          <div className="flex between drug-item table-row">
            <div className="text-right">
              <div className="table-item">検査項目</div>
              <div className="table-item remarks-comment"></div>
            </div>                                                
          </div>
          {order.subject != undefined && order.subject != null && order.subject != '' && (
            <>
              <div className="flex between drug-item table-row">
                <div className="text-left">
                  <div className="table-item">概要</div>
                  <div className="table-item remarks-comment">{order.subject}</div>
                </div>
              </div>
            </>
          )}
          {order.examinations.map((item, key)=> {
            return (
              <div className="flex between drug-item table-row" key={key}>
                <div className="text-left exam-order">
                  <div className="table-item">{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.name}</div>
                </div>
              </div>
            )
          })}
          {order.free_instruction != undefined && order.free_instruction.length > 0 && (
            <>
              <div className="flex between drug-item table-row">
                <div className="text-right">
                  <div className="table-item">自由入力オーダー</div>
                  <div className="table-item remarks-comment"></div>
                </div>                                                
              </div>                        
              {order.free_instruction.map((item, key)=> {
                return (
                  <div className="flex between drug-item table-row" key={key}>
                    <div className="text-left exam-order">
                      <div className="table-item">{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.text}</div>
                    </div>
                  </div>
                )
              })} 
            </>
          )}
          {order.todayResult == 1 && (
            <div className="flex between drug-item table-row">
              <div className="text-right">
                <div className="table-item">当日結果説明あり</div>
                <div className="table-item remarks-comment"></div>
              </div>
            </div>
          )}
          {order.order_comment !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-right">
                <div className="table-item">
                  {order.order_comment_urgent != undefined && order.order_comment_urgent == 1?"【至急】":""}
                  {order.fax_report != undefined && order.fax_report == 1?"【FAX報告】":""}
                  依頼コメント: {order.order_comment}
                </div>
                <div className="table-item remarks-comment"></div>
              </div>
            </div>
          )}

          {order.free_comment !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-right">
                <div className="table-item">フリーコメント: {order.free_comment}</div>
                <div className="table-item remarks-comment"></div>
              </div>
            </div>    
          )}

          {order.additions != undefined && Object.keys(order.additions).length > 0 && (
              <>
                  <div className="flex between drug-item table-row">
                      <div className="text-right">
                          <div className="table-item">追加指示等</div>
                          <div className="table-item remarks-comment"></div>
                      </div>
                  </div>
                  {Object.keys(order.additions).map(addition=>{
                      return (
                          <div className="flex between drug-item table-row" key={addition}>
                              <div className="text-left exam-order">
                                  <div className="ml-3">{order.additions[addition].name}</div>
                              </div>
                          </div>
                      )
                  })}
              </>
          )}

        </div>
        {isPatientInfoField ? (
          <div className="w30p float-right patient-info">
            {patientInfoKeyNames.map((keyName, index) => {
              return index == 0 ? (
                <div
                  key={index}
                  className="patientinfo-item table-item text-left patient-info-header"
                >
                  {keyName}
                </div>
              ) : (
                <div
                  key={index}
                  className="patientinfo-item detail-item table-item text-right"
                >
                  {keyName}
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
        />
        {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
        )}
      </div>
    );
  }
}
HistoryList.contextType = Context;

HistoryList.propTypes = {
  order: PropTypes.object,
  orderIndex: PropTypes.number,
  patientId: PropTypes.number,
  orderNumber: PropTypes.number,
  class_name: PropTypes.string,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  patientInfo: PropTypes.array,
  is_doctor_consented: PropTypes.number,
  done_order: PropTypes.number,
  is_enabled: PropTypes.number,
  patientInfoObject: PropTypes.Object,
  searchPrescriptionList: PropTypes.func
};

export default HistoryList;
