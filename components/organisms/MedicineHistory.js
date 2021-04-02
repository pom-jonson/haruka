import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import HistoryList from "../molecules/HistoryList";
import ListItem from "../organisms/ListItem";
import ChangeLogModal from "../organisms/ChangeLogModal";
import $ from "jquery";
import Context from "~/helpers/configureStore";
import { getRandomKey } from "../../helpers/random";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, WEEKDAYS} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const MedicineSelectionWrapper = styled.div`
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: scroll;
`;

const MedicineListWrapper = styled.div`
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
    width: 55px;
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
    width: calc(100% - 80px);
    .table-item{
      padding-left:70px;
    }
  }
  .padleft70{
    padding-left:70px;
  }
  .ml{
    margin-left:20px!important;
    width: calc(100% - 80px);
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

  .stop-rp {
    background: rgb(229, 229, 229) !important;
    color: red;
    .table-row {
      &:nth-child(2n) {
        background-color: rgb(229, 229, 229);
      }
    }
  }
`;

function CheckArrayList(order_json) {
  let order_data = [];
  let med_consult = "";
  let supply_med_info = "";
  let potion_info = "";
  if (!Array.isArray(order_json.params.medicine.order_data)) {
    order_data = Object.values(
      order_json.params.medicine.order_data.order_data
    );
    med_consult = order_json.params.medicine.order_data.med_consult != undefined && order_json.params.medicine.order_data.med_consult == 1 ? "【お薬相談希望あり】": "";
    supply_med_info = order_json.params.medicine.order_data.supply_med_info != undefined && order_json.params.medicine.order_data.supply_med_info == 1 ? "【薬剤情報提供あり】": "";
    potion_info = order_json.params.medicine.order_data.potion != undefined && order_json.params.medicine.order_data.is_internal_prescription == 5 && (order_json.params.medicine.order_data.potion == 0 || order_json.params.medicine.order_data.potion == 1) ? order_json.params.medicine.order_data.potion ? "持参薬（自院）" : "持参薬（他院）": "";
  }
  let is_enabled =
    order_json.params.medicine.is_enabled === 3 ||
    order_json.params.medicine.is_enabled === 2
      ? 2
      : 0;
  let class_name =
    order_json.params.medicine.order_data.class_name === "open" ? "" : "hidden";
  let free_comment =
    order_json.params.medicine.order_data.free_comment !== undefined
      ? Array.isArray(order_json.params.medicine.order_data.free_comment)
        ? order_json.params.medicine.order_data.free_comment.join("、")
        : order_json.params.medicine.order_data.free_comment
      : "";
  const data = order_data.map(function(order, index) {
    return (
      <>
        <HistoryList
          key={getRandomKey()}
          orderNumber={order_json.params.medicine.number}
          patientId={order_json.params.parent.props.patientId}
          order_data={order_json.params.medicine.order_data}
          order={order}
          orderIndex={order_json.params.orderIndex}
          serial_number={index + 1}
          onCopyOrder={order_json.params.parent.onCopyOrder}
          onCopyOrders={order_json.params.parent.onCopyOrders}
          onEditOrders={order_json.params.parent.onEditOrders}
          onRegisterSet={order_json.params.parent.onRegisterSet}
          doChangeDepartmentAction={order_json.params.parent.doChangeDepartmentAction}
          onPrintOrders={order_json.params.parent.onPrintOrders}
          // doctors={order_json.params.parent.props.doctors}
          doctors={order_json.doctors}
          doctor_code={order_json.params.parent.props.doctor_code}
          doctor_name={order_json.params.parent.props.doctor_name}
          setDoctorInfo={order_json.params.parent.props.setDoctorInfo}
          patientInfo={order_json.params.parent.props.patientInfo}
          initPresData={order_json.params.parent.props.initPresData}
          class_name={class_name}
          is_doctor_consented={order_json.params.medicine.is_doctor_consented}
          done_order={order_json.params.medicine.done_order}
          is_enabled={
            order_json.params.medicine.is_enabled === 3 ||
            order_json.params.medicine.is_enabled === 2
              ? 2
              : order.is_enabled !== undefined
              ? order.is_enabled
              : 0
          }
          openNotConsentedModal={
            order_json.params.parent.props.openNotConsentedModal
          }
          isNotConsentedPopup={order_json.params.parent.props.isNotConsentedPopup}
          isNotConsentedDataLength={
            order_json.params.parent.props.isNotConsentedDataLength
          }
          forNotConsentedCheckDoctorCode={
            order_json.params.medicine.order_data.doctor_code
          }
          consent={order_json.params.parent.props.consent}
          patientInfoObject={null}
          isPrescriptionList={false}
          getDelData={order_json.params.parent.props.getDelData}
          is_receipt_archive_data={
            order_json.params.medicine.order_data.is_receipt_archive_data !==
            undefined
              ? order_json.params.medicine.order_data.is_receipt_archive_data
              : 0
          }
          medicine={order_json.params.medicine}
          openModal={order_json.params.parent.openModal}
          cacheSerialNumber={order_json.params.parent.props.cacheSerialNumber}
          isEdit={order_json.params.isEdit}
          medicineHistory={order_json.params.parent.state.medicineHistory}
        />
      </>
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
          className={'box w70p float-left-prescription pres-history pres-order-'+order_json.params.medicine.number
            + ((order_json.params.gray_orders.includes(order_json.params.medicine.number)) ? ' doing ' : '')}
        >
          {med_consult !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{med_consult}</div>
            </div>
          )}
          {supply_med_info !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{supply_med_info}</div>
            </div>
          )}
          {potion_info !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{potion_info}</div>
            </div>
          )}
          {order_json.params.medicine.order_data
            .psychotropic_drugs_much_reason !== undefined &&
            order_json.params.medicine.order_data
              .psychotropic_drugs_much_reason !== "" && (
              <div className="flex between option table-row">
                <div className="flex full-width table-item">
                  <div className="number"></div>
                  <div className="ml-3 full-width mr-2 ml">
                    <label>向精神薬多剤投与理由: </label>
                    <label>{order_json.params.medicine.order_data.psychotropic_drugs_much_reason}</label>
                  </div>
                </div>
                <div className="w80 table-item"></div>
              </div>
            )}
          {order_json.params.medicine.order_data.poultice_many_reason !==
            undefined &&
            order_json.params.medicine.order_data.poultice_many_reason !==
              "" && (
              <div className="flex between option table-row">
                <div className="flex full-width table-item">
                  <div className="number"></div>
                  <div className="ml-3 full-width mr-2 ml">
                    <label>湿布薬超過投与理由: </label>
                    <label>{order_json.params.medicine.order_data.poultice_many_reason}</label>                  
                </div>
                </div>
                <div className="w80 table-item"></div>
              </div>
            )}
          {free_comment !== "" && (
            <div className="flex between option table-row">
                <div className="flex full-width table-item">
                  <div className="number"></div>
                  <div className="ml-3 full-width mr-2 ml">
                    <label>備考: </label>
                    <label>{free_comment}</label>                    
                  </div>
                </div>
                <div className="w80 table-item"></div>
              </div>
          )}
        </div>
      </div>
    </>
  );
}

class MedicineHistory extends Component {
  state = {
    medicineHistory: this.props.medicineHistory,
    allPrescriptionOpen: null,
    order: [],
    modalVisible: false,
    selectedOrderNumber: 0
  };
  
  constructor(props) {
    super(props);
    this.processing = false;
    this.gray_orders = [];
    let prescription_gray_info = localApi.getObject("prescription_gray_info");
    if(prescription_gray_info != undefined && prescription_gray_info != null && prescription_gray_info.order_numbers != undefined){
      this.gray_orders = prescription_gray_info.order_numbers;
    }
    this.pres_done_numbers = [];
    let prescription_done_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
    if(prescription_done_data != undefined && prescription_done_data != null && prescription_done_data.length > 0){
      prescription_done_data.map(medicine=>{
        this.pres_done_numbers.push(medicine.number);
      })
    }
  }

  medicineData = [];

  isMounted = false;
  async componentDidMount() {
    this.isMounted = true;
    /*@cc_on 
    var doc = document;
    eval('var document = doc');
    @*/
    document
      .getElementById("medicine_selection_wrapper")
      .addEventListener("scroll", this.handleScroll);

    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    const scrollTop = window.localStorage.getItem(
      "medicine_selection_wrapper_scroll",
      0
    );
    $("#medicine_selection_wrapper").scrollTop(scrollTop);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allPrescriptionOpen != prevState.allPrescriptionOpen) {
      this.state.medicineHistory.map(item => {
        if (this.props.allPrescriptionOpen !== undefined) {
          if (this.props.allPrescriptionOpen == true) {
            item.order_data.class_name = "";
          } else if (this.props.allPrescriptionOpen == false) {
            item.order_data.class_name = "open";
          }
        }
      });
    }
  }

  onCopyOrder = (order, type) => {
    if (this.props.copyOrder(order, type) === false) {
      alert("このRpは薬品が重複されているので追加できません。");
    }
  };

  onCopyOrders = (index, act=null) => {
    if(act === "preset_do_deployment"){
      let preset_do_deployment_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT);
      let preset_data = {};
      /*@cc_on 
      var w = window;
      eval('var window = w');
      @*/
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      let patient_do_get_mode = initState.patient_do_get_mode;
      if(patient_do_get_mode == 0 || authInfo.staff_category === 1){
          preset_data.order_data = preset_do_deployment_data[index]['prescription_data'];
      } else {
          preset_data.order_data = preset_do_deployment_data[this.context.selectedDoctor.code][index]['prescription_data'];
      }
      this.props.copyOrders(preset_data, 'hasDoctor');
    } else {      
      this.props.copyOrders(this.state.medicineHistory[index], act);
    }

  };

  onEditOrders = (index, is_done = false) => {
    this.props.editOrders(this.state.medicineHistory[index], is_done);
  };

  onRegisterSet = (index, type) => {
      this.props.registerSet(this.state.medicineHistory[index], type);
    };

  doChangeDepartmentAction = index => {
    this.props.changeDepartment(this.state.medicineHistory[index]);
  };

  onPrintOrders = index => {
    this.props.printOrders(this.state.medicineHistory[index]);
  };

  openModal = number => {
    this.setState({
      modalVisible: true,
      selectedOrderNumber: number
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedOrderNumber: 0
    });
  };

  onAngleClicked(e, number) {
    e.stopPropagation();
    e.preventDefault();
    let obj = $(e.target);
    // 見出しの「nn版」の文字をクリックしたときに、内容の開閉が一緒に動いてしまう
    // →履歴を開く部分は、内容開閉操作のクリック判定が動かないように   2020-08-19
    if (obj.hasClass("version-span")) return;
    let history = this.state.medicineHistory.map(function(item) {
      if (item.number === number) {
        item.order_data.class_name =
          item.order_data.class_name === "open" ? "" : "open";
      }
      return item;
    });

    this.setState({
      medicineHistory: history
    });
  }

  getOrderNumberList = (orderNumber, value) => {
    if (value == 1 && !this.state.order.includes(orderNumber)) {
      let order = this.state.order;
      order.push(orderNumber);
      this.setState({ order });
    } else if (value == 0 && this.state.order.includes(orderNumber)) {
      var order = this.state.order.filter(value => {
        return value != orderNumber;
      });
      this.setState({ order: order });
    }
  };

  isOrderNumberList = () => {
    return this.state.order;
  };

  onDragStart = (e, number) => {
    // get clipboard data
    let before_data = "";
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({alertMessage: "death"});
      return;   
    }

    e.dataTransfer.setData("text", "prescription:" + number);

    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    }
  };

  onDragItemDetailsStart = (e, number) => {
    // get clipboard data
    let before_data = "";
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    } 

    e.dataTransfer.setData("text", "item_details:" + number);

    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    } 
  };

  handleScroll = async () => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    window.localStorage.setItem(
      "medicine_selection_wrapper_scroll",
      $("#medicine_selection_wrapper").scrollTop()
    );
    // var { processing, stopGetHistory, page } = this.context;
    let stopGetHistory = this.props.stopGetHistory;
    let page = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER);
    let processing = this.processing
    if (processing) return false;
    if (this.props.match === undefined) return false;
    if (
      !stopGetHistory &&
      $("#medicine_selection_wrapper").scrollTop() +
        $("#medicine_selection_wrapper").height() >=
        $("#medicine_history_wrapper").height() - 100
    ) {
      // this.context.$updateProcessing(true);
    this.processing = true;
      // this.context.$updatePageNumber(page + 1);
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, page + 1);
      var data = this.props.scrollAddHistoryData({
        id: this.props.match.params.id,
        limit: 5,
        offset: (page + 1) * 5,
        medicineHistory:this.state.medicineHistory
      });
      if (data.length > 0) {
        const { $canDoAction, FEATURES, AUTHS } = this.context;

        let medicineHistory = this.state.medicineHistory;
        data.map(data_item => {
          if (
            $canDoAction(FEATURES.PRESCRIPTION, AUTHS.SHOW_DELETE) ||
            data_item.is_enabled === 1
          ) {
            medicineHistory.push(data_item);
          }
        });
        this.setState({ medicineHistory });                
        this.props.setChildState("medicineHistory", medicineHistory);
        window.localStorage.setItem("haruka_cache_medicineHistory", JSON.stringify(medicineHistory));
      }

      // this.context.$updateProcessing(false);
      this.processing = false;
    }
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
    const keyName = {
      can_generic_name: "一般名処方",
      is_not_generic: "後発不可",
      milling: "粉砕",
      free_comment: "備考",
      separate_packaging: "別包",
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };

    let edited_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    let edit_number = edited_data != undefined && edited_data != null ? edited_data[0].number : 0;
    let medicineHistoryList = this.state.medicineHistory.map(
      (medicine, orderIndex) => {        
        // check all order deleted for red color paint inclulding function items
        let all_order_deleted = this.checkAllOrderDeleted(medicine);
        return (
          <>
          <div
            key={orderIndex}
            className={"draggable pres-medicine pres-medicine-" + medicine.number + ((this.pres_done_numbers.includes(medicine.number)) ? " line-done" : "")}
            draggable={
              ((this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) == true || 
                    this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) == true) ? true: false)
            }
            onDragStart={e => this.onDragStart(e, medicine.number)}
          >
            <ListItem
              department={medicine.order_data.department}
              isOrderNumberList
              ya
              doctor_name={medicine.order_data.doctor_name}
              class_name={medicine.order_data.class_name}
              substitute_name={medicine.order_data.substitute_name}
              diagnosing_date={medicine.created_at ? medicine.created_at: ""}
              diagnosing_date_string={this.getWeekDay(medicine.created_at)}
              is_internal_prescription={medicine.order_data.is_internal_prescription}
              onAngleClicked={this.onAngleClicked.bind(this)}
              number={medicine.number}
              // isEdit={(edit_number==medicine.number && this.props.isEditingIndex == -1) ? true : (this.props.isEditingIndex == orderIndex ? true : false)}
              isEdit={(edit_number==medicine.number ? true : false)}
              is_doctor_consented={medicine.is_doctor_consented}
              done_order={medicine.done_order}
              is_enabled={medicine.is_enabled}
              isNotConsentedPopup={this.props.isNotConsentedPopup}
              orderNumber={medicine.number}
              getOrderNumberList={this.getOrderNumberList}
              notConsentedDataOneSelect={medicine.data_one_select}
              deselectItem={this.props.deselectItem}
              patientName={
                this.props.patientId === -1
                  ? medicine.patient_name + "[" + medicine.patient_number + "]"
                  : ""
              }
              karte_status={medicine.karte_status}
              medicine_history={medicine.history}
              openModal={this.openModal.bind(this)}
            />
            {medicine.order_data.class_name === "open" && (
              <>
                <CheckArrayList
                  params={{
                    medicine: medicine,
                    orderIndex: orderIndex,
                    parent: this,
                    all_deleted: all_order_deleted,
                    isEdit: edit_number == medicine.number ? true : false,
                    doctors:this.props.doctors,
                    gray_orders:this.gray_orders
                  }}
                />
                {medicine.order_data.item_details != null && medicine.order_data.item_details != undefined && medicine.order_data.item_details.length > 0 && (
                  <div
                    className={medicine.is_enabled !== undefined && medicine.is_enabled === 2 ? "" : "draggable"}
                    draggable={medicine.is_enabled !== undefined && medicine.is_enabled === 2 ? false :
                      ((this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) == true ||
                        this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) == true) ? true: false)
                    }
                    onDragStart={e => this.onDragItemDetailsStart(e, medicine.number)}
                  >
                    {medicine.order_data.item_details.map(ele=>{
                      return(
                        <>
                          {(ele != null && ele.item_id != 0) && (
                            <div
                              className={'function-region '
                                + (((medicine.is_enabled !== undefined && medicine.is_enabled === 2) || all_order_deleted) ? "line-through":"")
                                + ' pres-history pres-order-'+medicine.number + ((this.gray_orders.includes(medicine.number)) ? ' doing ' : '')}
                            >
                              <div className="function-region-name">
                                <label>{ele.item_name}{((ele.value1 != undefined && ele.value1 != null) || (ele.value2 != undefined && ele.value2 != null)) ? "：":""}</label>
                                <label>
                                  {ele.value1 != null && ele.value1 != undefined && (
                                    <>{ele.value1}<br/></>
                                  )}
                                  {ele.value2 != null && ele.value2 != undefined && (
                                    <>{ele.value2}</>
                                  )}
                                </label>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
          </>
        );
      }
    );

    return (
      <MedicineSelectionWrapper id="medicine_selection_wrapper">
        <MedicineListWrapper id="medicine_history_wrapper">
          {medicineHistoryList}
        </MedicineListWrapper>
        {this.state.modalVisible && (
          <ChangeLogModal
            closeModal={this.closeModal}
            keyName={keyName}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            size="lg"
            category={'処方'}
          />
        )}
        {this.state.alertMessage == "death" && (
            <AlertNoFocusModal
              hideModal= {this.cancelAlertModal.bind(this)}
              handleOk= {this.cancelAlertModal.bind(this)}
              showMedicineContent= {"死亡した患者です。"}
            />
          )}
      </MedicineSelectionWrapper>
    );
  }
}
MedicineHistory.contextType = Context;
MedicineHistory.defaultProps = {
  allPrescriptionOpen: null
};

MedicineHistory.propTypes = {
  patientId: PropTypes.number,
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  editOrders: PropTypes.func,
  registerSet: PropTypes.func,
  changeDepartment: PropTypes.func,
  printOrders: PropTypes.func,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  medicineHistory: PropTypes.array,
  patientInfo: PropTypes.array,
  // isEditingIndex: PropTypes.number,
  openNotConsentedModal: PropTypes.func,
  isNotConsentedPopup: PropTypes.bool,
  stopGetHistory: PropTypes.bool,
  isNotConsentedDataLength: PropTypes.number,
  consent: PropTypes.func,
  deselectItem: PropTypes.func,
  getDelData: PropTypes.func,
  scrollAddHistoryData: PropTypes.func,
  setChildState: PropTypes.func,
  initPresData: PropTypes.func,
  match: PropTypes.object,
  cacheSerialNumber: PropTypes.number,
};

export default MedicineHistory;
