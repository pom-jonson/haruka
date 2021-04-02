import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import InjectionHistoryList from "../molecules/InjectionHistoryList";
import InjectionListItem from "../organisms/InjectionListItem";
import { getRandomKey } from "../../helpers/random";
import ChangeLogModal from "../organisms/ChangeLogModal";
import $ from "jquery";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { formatJapanDateSlash } from "~/helpers/date";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import {WEEKDAYS} from "~/helpers/constants";

const InjectionSelectionWrapper = styled.div`
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: scroll;  
`;

const InjectionListWrapper = styled.div`
  font-size: 12px;

  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${colors.disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 60px;
    }
    &:after {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 70px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${colors.secondary200};
      }
    }
  }

  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 100%;
      float: left;
      padding: 5px;
      word-break: break-all; 
    }
  }

  .line-through {
    color: #ff0000;
  }

  .line-done {
    color: #0000ff;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }

  .patient-name {
    margin-left: 16px;
  }

  .drug-item {
    border-bottom: 1px solid ${colors.disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 75px;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${colors.disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${colors.midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .hidden {
    display: none;
  }

  p {
    margin-bottom: 0;
  }

  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
`;

function CheckArrayList(order_json) {
  let order_data = [];
  let inject_consult = "";
  let supply_inject_info = "";
  if (!Array.isArray(order_json.params.injection.order_data)) {
    order_data = Object.values(
      order_json.params.injection.order_data.order_data
    );    
  }
  let is_enabled =
    order_json.params.injection.is_enabled === 3 ||
    order_json.params.injection.is_enabled === 2
      ? 2
      : 0;
  let class_name =
    order_json.params.injection.order_data.class_name === "open" ? "" : "hidden";  

  let free_comment =
    order_json.params.injection.order_data.free_comment !== undefined
      ? Array.isArray(order_json.params.injection.order_data.free_comment)
        ? order_json.params.injection.order_data.free_comment.join("、")
        : order_json.params.injection.order_data.free_comment
      : "";
  const data = order_data.map(function(order, index) {
    return (
      <InjectionHistoryList
        key={getRandomKey()}
        diagnosing_date={
          order_json.params.injection.order_data.executed_date_time
            ? order_json.params.injection.order_data.executed_date_time
            : ""
        }
        orderNumber={order_json.params.injection.number}
        patientId={order_json.params.parent.props.patientId}
        order_data={order_json.params.injection.order_data}
        is_completed={order_json.params.injection.order_data.is_completed}
        schedule_date={order_json.params.injection.order_data.schedule_date}
        order={order}
        orderIndex={order_json.params.orderIndex}
        serial_number={index + 1}
        onCopyOrder={order_json.params.parent.onCopyOrder}
        onCopyOrders={order_json.params.parent.onCopyOrders}
        onEditOrders={order_json.params.parent.onEditOrders}
        onRegisterSet={order_json.params.parent.onRegisterSet}
        doChangeDepartmentAction={order_json.params.parent.doChangeDepartmentAction}
        onPrintOrders={order_json.params.parent.onPrintOrders}
        doctors={order_json.params.parent.props.doctors}
        doctor_code={order_json.params.parent.props.doctor_code}
        doctor_name={order_json.params.parent.props.doctor_name}
        setDoctorInfo={order_json.params.parent.props.setDoctorInfo}
        patientInfo={order_json.params.parent.props.patientInfo}
        initInjectData={order_json.params.parent.props.initInjectData}
        class_name={class_name}
        is_doctor_consented={order_json.params.injection.is_doctor_consented}
        done_order={order_json.params.injection.done_order}
        is_enabled={
          order_json.params.injection.is_enabled === 3 ||
          order_json.params.injection.is_enabled === 2
            ? 2
            : order.is_enabled !== undefined
            ? order.is_enabled
            : 0
        }
        openNotConsentedModal={
          order_json.params.parent.props.openNotConsentedModal
        }
        openSomeCompletedCancel={order_json.params.parent.props.openSomeCompletedCancel}
        isNotConsentedPopup={order_json.params.parent.props.isNotConsentedPopup}
        isNotConsentedDataLength={
          order_json.params.parent.props.isNotConsentedDataLength
        }
        forNotConsentedCheckDoctorCode={
          order_json.params.injection.order_data.doctor_code
        }
        consent={order_json.params.parent.props.consent}
        patientInfoObject={null}
        isPrescriptionList={false}
        getDelData={order_json.params.parent.props.getDelData}
        is_receipt_archive_data={
          order_json.params.injection.order_data.is_receipt_archive_data !==
          undefined
            ? order_json.params.injection.order_data.is_receipt_archive_data
            : 0
        }
        medicine={order_json.params.injection}
        openModal={order_json.params.parent.openModal}
        cacheSerialNumber={order_json.params.parent.props.cacheSerialNumber}
        isEdit={order_json.params.isEdit}
        stopPeriodRp={order_json.params.parent.stopPeriodRp}
        stopPeriodOrder={order_json.params.parent.stopPeriodOrder}
        stopPeriodInjectionCategory={order_json.params.parent.stopPeriodInjectionCategory}
      />
    );
  });
  return (
    <>
      {data}      
      <div
        className={
          ((is_enabled !== undefined && is_enabled === 2) || order_json.params.all_deleted == true 
            ? "history-item line-through "
            : "history-item ") + class_name
        }
      >
        <div
          className={'box w70p float-left-prescription inject-history inject-order-'+order_json.params.injection.number
          + ((order_json.params.gray_orders.includes(order_json.params.injection.number)) ? ' doing ' : '')}
        >
          {order_json.params.injection.order_data.is_completed != undefined && order_json.params.injection.order_data.is_completed != 4 && (
            <>
              <div className={`flex between drug-item table-row ${order_json.params.all_deleted == true && "line-through"}`}>
                <div className="text-right">
                  {order_json.params.injection.order_data.schedule_date != undefined && order_json.params.injection.order_data.schedule_date != null && order_json.params.injection.order_data.schedule_date != "" && (
                    <div className="table-item">
                      {"実施予定日: " + formatJapanDateSlash(order_json.params.injection.order_data.schedule_date)}
                    </div>
                  )}          
                  {order_json.params.injection.done_order == 1 && (            
                    <div className="table-item">
                      {"実施日時: " + formatJapanDateSlash(order_json.params.injection.order_data.executed_date_time) + " " + order_json.params.injection.order_data.executed_date_time.substr(11, 2) + "時" + order_json.params.injection.order_data.executed_date_time.substr(14, 2) + "分"}
                    </div>
                  )}
                </div>
                <div className="w80 table-item">              
                </div>
              </div>
            </>
          )}
          {inject_consult !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{inject_consult}</div>
            </div>
          )}
          {supply_inject_info !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{supply_inject_info}</div>
            </div>
          )}
          {order_json.params.injection.order_data
            .psychotropic_drugs_much_reason !== undefined &&
            order_json.params.injection.order_data
              .psychotropic_drugs_much_reason !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`向精神薬多剤投与理由: ${
                    order_json.params.injection.order_data
                      .psychotropic_drugs_much_reason
                  }`}
                </div>
              </div>
            )}
          {order_json.params.injection.order_data.poultice_many_reason !==
            undefined &&
            order_json.params.injection.order_data.poultice_many_reason !==
              "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`湿布薬超過投与理由: ${
                    order_json.params.injection.order_data.poultice_many_reason
                  }`}
                </div>
              </div>
            )}  
          {order_json.params.injection.order_data.location_name !==
            undefined &&
            order_json.params.injection.order_data.location_name !==
              "" &&
            order_json.params.injection.order_data.location_name !==
              0 && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`実施場所: ${order_json.params.injection.order_data.location_name}`}
              </div>
            </div>
          )}
          {order_json.params.injection.order_data.drip_rate !==
            undefined &&
            order_json.params.injection.order_data.drip_rate !==
              "" &&
            order_json.params.injection.order_data.drip_rate !==
              0 && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`点滴速度: ${order_json.params.injection.order_data.drip_rate}ml/h`}
              </div>
            </div>
          )}
          {order_json.params.injection.order_data.water_bubble !==
            undefined &&
            order_json.params.injection.order_data.water_bubble !==
              "" &&
            order_json.params.injection.order_data.water_bubble !==
              0 && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`1分あたり: ${order_json.params.injection.order_data.water_bubble}滴`}
              </div>
            </div>
          )}
          {order_json.params.injection.order_data.exchange_cycle !==
            undefined &&
            order_json.params.injection.order_data.exchange_cycle !==
              "" &&
            order_json.params.injection.order_data.exchange_cycle !==
              0 && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`交換サイクル: ${order_json.params.injection.order_data.exchange_cycle}時間`}
              </div>
            </div>
          )}
          {order_json.params.injection.order_data.require_time !==
            undefined &&
            order_json.params.injection.order_data.require_time !==
              "" &&
            order_json.params.injection.order_data.require_time !==
              0 && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`所要時間: ${order_json.params.injection.order_data.require_time}時間`}
              </div>
            </div>
          )}
          {free_comment !== "" && (
            <div className="flex between option table-row">
              <div className="number"></div>
              <div className="ml-3 text-right mr-2" style={{wordBreak:"break-all"}}>
                {`備考: ${free_comment}`}
              </div>
              <div className="w80 table-item"></div>
            </div>
          )}        
        </div>
      </div>
    </>
  );
}

class InjectionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      injectionHistory: props.injectionHistory,  
      modalVisible: false,
      selectedOrderNumber: 0
    };
    this.processing = false;
    this.isMounted = false;
    this.gray_orders = [];
    let injection_gray_info = localApi.getObject("injection_gray_info");
    if(injection_gray_info != undefined && injection_gray_info != null && injection_gray_info.order_numbers != undefined){
      this.gray_orders = injection_gray_info.order_numbers;
    }
    this.inject_done_numbers = [];
    let inject_done_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE);
    if(inject_done_data != undefined && inject_done_data != null && inject_done_data.length > 0){
      inject_done_data.map(medicine=>{
        this.inject_done_numbers.push(medicine.number);
      })
    }
  }

  async componentDidMount() {
    this.isMounted = true;
    document
      .getElementById("injection_selection_wrapper")
      .addEventListener("scroll", this.handleScroll);

    const scrollTop = window.localStorage.getItem(
      "injection_selection_wrapper_scroll",
      0
    );

    $("#injection_selection_wrapper").scrollTop(scrollTop);
  }

  onDragStart = (e, number) => {
    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }

    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });   
      return;   
    }

    e.dataTransfer.setData("text", "injection:" + number);

    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    }
  };

  onDragItemDetailsStart = (e, number) => {
    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }

    e.dataTransfer.setData("text", "item_details:" + number);
    
    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    } 
  };

  onAngleClicked(e, number) {    
    e.stopPropagation();
    e.preventDefault();
    let history = this.state.injectionHistory.map(function(item) {
      if (item.number === number) {
        item.order_data.class_name =
          item.order_data.class_name === "open" ? "" : "open";
      }
      return item;
    });
    this.setState({
      injectionHistory: history
    });
  }

  onCopyOrder = (order, type) => {
    if (this.props.copyOrder(order, type) === false) {
      alert("このRpは薬品が重複されているので追加できません。");
    }
  };

  onCopyOrders = (index, type) => {
    this.props.copyOrders(this.state.injectionHistory[index], type);
  };

  stopPeriodRp = (order_number, rp_number, doctor_code, doctor_name) => {
    this.props.stopPeriodRp(order_number, rp_number, doctor_code, doctor_name);
  };

  stopPeriodOrder = (order_number, doctor_code, doctor_name) => {
    this.props.stopPeriodOrder(order_number, doctor_code, doctor_name);
  };

  stopPeriodInjectionCategory = (_param) => {
    this.props.stopPeriodInjectionCategory(_param);
  };

  onEditOrders = (index, is_done = false) => {
    this.props.editOrders(this.state.injectionHistory[index], is_done);
  };

  onRegisterSet = index => {
    this.props.registerSet(this.state.injectionHistory[index]);
  };
  doChangeDepartmentAction = index => {
    this.props.changeDepartment(this.state.injectionHistory[index]);
  };

  onPrintOrders = index => {
    this.props.printOrders(this.state.injectionHistory[index]);
  };

  openModal = number => {
    this.setState({
      modalVisible: true,
      selectedOrderNumber: number
    });
  };

  handleScroll = async () => {
    window.localStorage.setItem(
      "injection_selection_wrapper_scroll",
      $("#injection_selection_wrapper").scrollTop()
    );
    let stopGetHistory = this.props.stopGetHistory;
    let page = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER);
    let processing = this.processing;

    if (processing) return false;
    if (this.props.match === undefined) return false;

    if (!stopGetHistory && $("#injection_selection_wrapper").scrollTop() + $("#injection_selection_wrapper").height() >= $("#injection_history_wrapper").height() - 100) {
      this.processing = true;
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, page + 1);
      var data = this.props.scrollAddInjectionHistoryData({
        id: this.props.match.params.id,
        limit: 5,
        offset: (page + 1) * 5
      });
      if (data.length > 0) {
        const { $canDoAction, FEATURES, AUTHS } = this.context;

        let injectionHistory = this.state.injectionHistory;
        data.map(data_item => {
          if (
            $canDoAction(FEATURES.PRESCRIPTION, AUTHS.SHOW_DELETE) ||
            data_item.is_enabled === 1
          ) {
            injectionHistory.push(data_item);
          }
        });
        this.setState({ injectionHistory });
        this.props.setInjectionHistory(injectionHistory);
        window.localStorage.setItem("haruka_cache_injectionHistory", JSON.stringify(injectionHistory));
      }

      // this.context.$updateProcessing(false);
      this.processing = false;
    }
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedOrderNumber: 0
    });
  };

  checkAllOrderDeleted = (_medicine) => {
    let result = false;
    if (_medicine == undefined || _medicine == null) return result;

    let del_count = 0;
    _medicine.order_data.order_data.map(item=>{
      if (item.is_enabled == 2) del_count ++;
    });

    result = _medicine.order_data.order_data.length == del_count ? true : false;

    return result;
  }

  cancelAlertModal = () => {
    this.setState({
      alertMessage: ""
    });
  }

  getWeekDay = dateStr => {
    if (dateStr && dateStr != "") {
      let str_date = dateStr.substr(0,10);
      let weekday = new Date(str_date).getDay();
      return WEEKDAYS[weekday];    
    }
    return "";    
  }

  render() {      
    let edited_inject_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    let edit_number = edited_inject_data != undefined && edited_inject_data != null ? edited_inject_data[0].number : -1;
    let injectionHistoryList = this.state.injectionHistory.map(
      (injection, orderIndex) => {
        // check all order deleted for red color paint inclulding function items
        let all_order_deleted = this.checkAllOrderDeleted(injection);        
        return (
          <>
          <div
            key={orderIndex}
            className={"draggable inject-medicine inject-medicine-" + injection.number + ((this.inject_done_numbers.includes(injection.number)) ? " line-done" : "")}
            draggable={
              ((this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) == true || 
                    this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) == true) ? true: false)
            }
            onDragStart={e => this.onDragStart(e, injection.number)}         
          >
            <InjectionListItem
              department={injection.order_data.department}              
              doctor_name={injection.order_data.doctor_name}
              class_name={injection.order_data.class_name}
              substitute_name={injection.order_data.substitute_name}
              diagnosing_date={
                injection.order_data.executed_date_time
                  ? injection.order_data.executed_date_time
                  : ""
              }
              diagnosing_date_string={this.getWeekDay(injection.order_data.executed_date_time)}
              is_completed={
                injection.order_data.is_completed
              }
              onAngleClicked={this.onAngleClicked.bind(this)}
              number={injection.number}
              // isEdit={edit_number==injection.number && this.props.isEditingIndex == -1 ? true : this.props.isEditingIndex == orderIndex ? true : false }
              isEdit={edit_number==injection.number ? true : false }
              is_doctor_consented={injection.is_doctor_consented}
              done_order={injection.done_order}
              // order_record={injection.order_data.order_data}
              isNotConsentedPopup={this.props.isNotConsentedPopup}
              deselectItem={this.props.deselectItem}
              deselectInjectionItem={this.props.deselectInjectionItem}
              is_enabled={injection.is_enabled}
              orderNumber={injection.number}
              getOrderNumberList={this.getOrderNumberList}
              notConsentedDataOneSelect={injection.data_one_select}
              patientName={
                this.props.patientId === -1
                  ? injection.patient_name + "[" + injection.patient_number + "]"
                  : ""
              }
              karte_status={injection.karte_status}
              injection_history={injection.history}
              openModal={this.openModal.bind(this)}
            />
            {injection.order_data.class_name === "open" && (
              <>
                <CheckArrayList
                  params={{
                    injection: injection,
                    orderIndex: orderIndex,
                    parent: this,
                    all_deleted: all_order_deleted,
                    // isEdit: edit_number==injection.number && this.props.isEditingIndex == -1 ? true : this.props.isEditingIndex == orderIndex ? true : false
                    isEdit: edit_number==injection.number ? true : false,
                    gray_orders:this.gray_orders
                  }}
                />                
                <div className={
                      injection.is_enabled !== undefined && injection.is_enabled === 2
                        ? ""
                        : "draggable"
                    }
                    draggable={
                      injection.is_enabled !== undefined && injection.is_enabled === 2
                        ? false
                        : ((this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) == true || 
                          this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) == true) ? true: false)
                    }
                    onDragStart={e => this.onDragItemDetailsStart(e, injection.number)}>
                {injection.order_data.item_details != null && injection.order_data.item_details != undefined && injection.order_data.item_details.length > 0 && injection.order_data.item_details.map(ele=>{
                  return(
                    <>
                    {(ele != null && ele.item_id != 0) && (
                      <div
                        className={'function-region '
                        + (((injection.is_enabled !== undefined && injection.is_enabled === 2) || all_order_deleted) ? "line-through":"")
                        + ' inject-history inject-order-'+injection.number + ((this.gray_orders.includes(injection.number)) ? ' doing ' : '')}
                      >
                        <div className="function-region-name">
                          <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                          {ele.format1 != null && ele.format1 != undefined && ele.format1.includes("年") && ele.format1.includes("月") ? (
                            <label>
                              {ele.value1 != null && ele.value1 != undefined && (
                                  <label>{(ele.value1_format !== undefined) ? ele.value1_format : ele.value1}</label>
                              )}
                              {ele.value2 != null && ele.value2 != undefined && (
                                  <> ~ <label>{(ele.value2_format !== undefined) ? ele.value2_format : ele.value2}</label></>
                              )}
                            </label>
                          ):(
                            <label>
                              {ele.value1 != null && ele.value1 != undefined && (
                                  <label>{ele.value1}</label>
                              )}
                              {ele.value2 != null && ele.value2 != undefined && (
                                  <label>{ele.value2}</label>
                              )}
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                    </>
                  );
                })}
                </div>
              </>

            )}
          </div>

          {/* {injection.history !== "" &&
            injection.history.split(",").length > 1 && (
              <a
                onClick={() => this.openModal(injection.number)}
                style={historyButtonStyle}
              >
                変更履歴
              </a>
            )} */}
          </>
        );
      }
    );
    return (
      <InjectionSelectionWrapper id="injection_selection_wrapper">
        <InjectionListWrapper id="injection_history_wrapper">
          {injectionHistoryList}
        </InjectionListWrapper>      
        {this.state.modalVisible && (
          <ChangeLogModal
            closeModal={this.closeModal}            
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            size="lg"
            category={'注射'}
          />
        )}  
        {this.state.alertMessage == "death" && (
          <AlertNoFocusModal
            hideModal= {this.cancelAlertModal.bind(this)}
            handleOk= {this.cancelAlertModal.bind(this)}
            showMedicineContent= {"死亡した患者です。"}
          />
        )}
      </InjectionSelectionWrapper>
    );
  }
}
InjectionHistory.contextType = Context;

InjectionHistory.propTypes = {
  patientId: PropTypes.number,
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  stopPeriodRp: PropTypes.func,
  stopPeriodOrder: PropTypes.func,
  stopPeriodInjectionCategory: PropTypes.func,
  editOrders: PropTypes.func,
  registerSet: PropTypes.func,
  changeDepartment: PropTypes.func,
  printOrders: PropTypes.func,
  openNotConsentedModal: PropTypes.func,
  openSomeCompletedCancel: PropTypes.func,
  isNotConsentedPopup: PropTypes.bool,
  stopGetHistory: PropTypes.bool,
  deselectItem: PropTypes.func,
  doctors: PropTypes.array,
  setDoctorInfo: PropTypes.func,
  deselectInjectionItem: PropTypes.func,
  injectionHistory: PropTypes.array,  
  patientInfo: PropTypes.array,
  getDelData: PropTypes.func,
  scrollAddInjectionHistoryData: PropTypes.func,
  setInjectionHistory: PropTypes.func,
  initInjectData: PropTypes.func,
  // isEditingIndex: PropTypes.number,
  match: PropTypes.object,
  cacheSerialNumber: PropTypes.number,
};

export default InjectionHistory;
