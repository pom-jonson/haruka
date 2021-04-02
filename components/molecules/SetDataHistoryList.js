import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import SetHistoryUl from "./SetHistoryUl";
import Context from "~/helpers/configureStore";
import SameOptions from "./SameOptions";
import { formatDate } from "../../helpers/date";
import styled from "styled-components";
import $ from "jquery";
import SystemConfirmModal from "./SystemConfirmModal";
import {formatJapanDateSlash} from "~/helpers/date";

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
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
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({
  visible,
  x,
  y,
  parent,
  isFromPrescriptionList,
  is_receipt_archive_data
}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);

  if (visible) {
    return (
      <ContextMenuUl>
        {isFromPrescriptionList ? (
          <ul
            className="context-menu"
            style={{ left: `${x}px`, top: `${y}px` }}
          />
        ) : (
          <ul
            className="context-menu"
            style={{ left: `${x}px`, top: `${y}px` }}
          >
            {($canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER_OLD) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER_PROXY) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER_PROXY_OLD) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_OLD) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY) ||
              $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY_OLD)) && (
              <>
                <li>
                  <div onClick={() => parent.contextMenuAction("doRp")}>
                    コピー[Rp単位]
                  </div>
                </li>
                <li>
                  <div onClick={() => parent.contextMenuAction("doAll")}>
                    コピー[処方箋]
                  </div>
                </li>
              </>
            )}
            {(is_receipt_archive_data === undefined ||
              (is_receipt_archive_data !== 1 &&
                ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_OLD) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY) ||
                  $canDoAction(
                    FEATURES.PRESCRIPTION,
                    AUTHS.EDIT_PROXY_OLD
                  )))) && (
              <li>
                <div onClick={() => parent.contextMenuAction("edit")}>編集</div>
              </li>
            )}   
            {(
              <li>
                <div onClick={() => parent.contextMenuAction("delete")}>セットを削除</div>
              </li>
            )}                     
          </ul>
        )}
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class SetDataHistoryList extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      isEdit: false,
      order: this.props.order,
      days: this.props.order.days,
      days_suffix: this.props.order.days_suffix,
      one_dose_package: this.props.order.one_dose_package,
      temporary_medication: this.props.order.temporary_medication,
      insurance_type: this.props.order.insurance_type,
      body_part: this.props.order.body_part,
      usage: this.props.order.usage,
      usage_name: this.props.order.usage_name,      
      selectedDoctorName: this.props.doctor_name,
      currentUserName: authInfo.name,
      confirm_message: "",
      confirm_type: "",      
    };
  }

  async componentDidMount() {}

  getCheckSameOptions = () => {
    let med = this.props.order.med[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      this.props.order.med.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };

  getSameOptions = aa => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};

        value[key] = this.props.order.med[0][key];
        values.push(value);
      });
    }
    let value = {};
    value["one_dose_package"] = this.props.order["one_dose_package"];
    values.push(value);
    value = {};
    value["temporary_medication"] = this.props.order["temporary_medication"];
    values.push(value);
    value = {};
    value["mixture"] = this.props.order["mixture"];
    values.push(value);
    return values;
  };

  onDragStart = (e, order_number) => {
    e.dataTransfer.setData(
      "text",
      "preset_order:" + this.props.orderNumber + ":" + order_number
    );
    e.stopPropagation();
  };

  contextMenuAction = act => {
    if (act === "doRp") {
      this.onCopyOrder();
    } else if (act === "doAll") {
      this.onCopyOrders();
    } else if (act === "edit") {      
      this.setState({
        confirm_message: "現在のセットを編集しますか？",
        confirm_type: "_edit"
      });
    } else if (act === "delete") {     
      this.setState({
        confirm_message: "現在のセットを削除しますか？",
        confirm_type: "_delete"
      });
    }

    window.localStorage.setItem(
      "medicine_selection_wrapper_scroll",
      $("#medicine_selection_wrapper").scrollTop()
    );
  };

  handleClick(e) {   
  
    if (e.type === "contextmenu") {
      e.preventDefault();
      e.target.click();
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
      if (
        document.getElementById("medicine_selection_wrapper") !== undefined &&
        document.getElementById("medicine_selection_wrapper") !== null
      ) {
        document
          .getElementById("medicine_selection_wrapper")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("medicine_selection_wrapper")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      }

      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        }
      });
    }    
  }

  onCopyOrder = () => {
    this.props.onCopyOrder(this.state.order);
  };

  onCopyOrders = () => {
    this.props.onCopyOrders(this.props.order_dataIndex);
  };

  onEditOrders = () => {        
    this.props.onEditOrders(this.props.order_dataIndex);
  };

  onDeleteOrders = () => {        
    this.props.onDeleteOrders(this.props.order_dataIndex);
  };  

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }

    return insurance;
  };

  confirmOk() {
    switch(this.state.confirm_type){
      case "_edit":
        this.onEditOrders();
        break;      
      case "_delete":
        this.onDeleteOrders();
        break;      
    }
    this.setState({
      confirm_message: "",
      confirm_type: "",
    });
  }

  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_type: "",
    }); 
  }
  
  i = 0;
  render() {       
    const { order, mediInfo } = this.state;
    const keyName = {
      can_generic_name: "一般名処方",
      is_not_generic: "後発不可",
      milling: "粉砕",
      // free_comment: "備考",
      separate_packaging: "別包",
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };

    let sameKeys = this.getCheckSameOptions();
    const sameOptions = this.getSameOptions(sameKeys);
    let sameOptionsView;
    if (sameOptions !== undefined && sameOptions.length > 0) {
      sameOptionsView = (
        <SameOptions sameOptions={sameOptions} keyNames={keyName} />
      );
    }

    //const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

    return (
      <div
        className={
          "history-item " +
          this.props.class_name +
          (order.isDoing === true ? " doing " : "")
        }
      >
        <div
          className="box w70p"
          draggable={true}
          onDragStart={e => this.onDragStart(e, this.props.orderIndex)}
          onContextMenu={e => this.handleClick(e)}
        >
          {order.med.map((medi, index) => {
            this.i += 1;
            return (
              <SetHistoryUl
                key={this.i}
                medi={medi}
                keyNames={keyName}
                units={mediInfo}
                serial_number={index + 1}
                orderIndex={this.props.orderIndex+1}
              />
            );
          })}
          <div className="flex between drug-item table-row">
            <div className="text-right">
              <div className="table-item">
                {!order.usage_name ? "" : `用法: ${order.usage_name}`}
              </div>
              {order.usage_remarks_comment ? (
                <div className="table-item remarks-comment">
                  {order.usage_remarks_comment.map((comment, ci) => {
                    return <p key={ci}>{comment}</p>;
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="w80 table-item">
              {order.days !== 0 && order.days !== undefined
                ? order.days +
                  (order.days_suffix !== undefined && order.days_suffix !== ""
                    ? order.days_suffix
                    : "日分")
                : ""}
            </div>
          </div>
          {order.start_date && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                  {`処方開始日: ${formatJapanDateSlash(formatDate(order.start_date))}`}
              </div>
            </div>
          )}
          {order.insurance_type !== undefined && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`保険: ${this.getInsurance(order.insurance_type)}`}
              </div>
            </div>
          )}
          {order.body_part !== undefined && order.body_part !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`部位/補足: ${order.body_part}`}
              </div>
            </div>
          )}
          {order.discontinuation_start_date !== undefined &&
            order.discontinuation_start_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止期間の最初日: ${formatDate(
                    order.discontinuation_start_date
                  )}`}
                </div>
              </div>
            )}
          {order.discontinuation_end_date !== undefined &&
            order.discontinuation_end_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止期間の最後日: ${formatDate(
                    order.discontinuation_end_date
                  )}`}
                </div>
              </div>
            )}
          {order.discontinuation_comment !== undefined &&
            order.discontinuation_comment !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止コメント: ${order.discontinuation_comment}`}
                </div>
              </div>
            )}
          {sameOptionsView}
        </div>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}             
          isFromPrescriptionList={this.props.patientInfo === null}
          is_receipt_archive_data={this.props.is_receipt_archive_data}
        />
        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
          <SystemConfirmModal
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
SetDataHistoryList.contextType = Context;

SetDataHistoryList.propTypes = {
  order: PropTypes.object,
  orderIndex: PropTypes.number,
  order_dataIndex: PropTypes.number,
  class_name: PropTypes.string,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  patientInfo: PropTypes.array,
  orderNumber: PropTypes.number,
  onCopyOrder: PropTypes.func,
  onCopyOrders: PropTypes.func,
  onEditOrders: PropTypes.func,
  onDeleteOrders: PropTypes.func,
  is_receipt_archive_data: PropTypes.number  
};

export default SetDataHistoryList;
