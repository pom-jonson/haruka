import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { formatDate, formatJapanDateSlash, formatDateLine, getWeekNamesBySymbol } from "~/helpers/date";
// import Button from "~/components/atoms/Button";
import {
  secondary200,
  midEmphasis,
  disable,
} from "~/components/_nano/colors";
import PropTypes from "prop-types";
import { KEY_CODES } from "~/helpers/constants";
import { CACHE_LOCALNAMES, WEEKDAYS } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SameOptionsNew from "~/components/molecules/SameOptionsNew";

const underLine = {
  textDecorationLine: "underline"
};

const textAlignRight = {
  textAlign: "right"
};

const MedicineListWrapper = styled.div`
  font-size: 12px;

  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 70px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 70px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .align-left{
    text-align: left;
  }

  .phy-box{
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 200px;
    }    

    .text-left{
      .table-item{
        width: 9.375rem;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .line-through {
    color: #ff0000;
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

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 70px;
  }
  .number .rp{
    text-decoration-line: underline;
  }

  .unit{
    text-align: right;
  }

  .unit {
    margin-left: auto;
    text-align: right;
    width: 80px;
  }

  .full-text {
    width: 100%;
    text-align: right;
    margin-right: 11px;
  }

  .w80 {
    text-align: right;
    width: 5rem;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .inject-usage{
    width: calc(100% - 158px);
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
      color: ${midEmphasis};
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

  .soap-data-item{
    overflow-y: auto;
    max-height: 600px;
    min-height: 400px;
    border: 1px solid #ddd;
  }
  .soap-del-data-item{    
    border: 1px solid #ddd;
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
  .prescription-body-part {
    width: 100%;
    padding-left: 6.5rem;
  }
`;

export class PrescriptionConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      presData: this.props.presData,
      curFocus: 0,
      allOptions: [
        "milling",
        "can_generic_name",
        "is_not_generic",
        "one_dose_package",
        "temprary_dedicine",
        "insurance_type",
        "separate_packaging",
        "mixture"
      ],
      visible : false
    }
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.btns = [];
    this.flag = 0;
    this.cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
    this.cache_del_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    this.cache_del_data_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
    this.cache_injection_del_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    this.cache_injection_del_data_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
    this.inject_cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT);
    // this.inject_cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    this.implement_location = null;
  }

  async componentDidMount() {
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 1
    });
    this.flag = 1;
    if (
      document.getElementById("soap-input-prescription") !== undefined &&
      document.getElementById("soap-input-prescription") !== null
    ) {
      document.getElementById("soap-input-prescription").focus();
    }

    let deletedRpHistory = [];
    let deletedHistory = [];
    let deletedInjectHistory = [];
    let deletedInjectRpHistory = [];

    // prescription
    let cache_del_data = this.cache_del_data;
    let cache_del_data_history = this.cache_del_data_history;
    if (cache_del_data !== undefined && cache_del_data !== null && cache_del_data.length > 0 && cache_del_data_history!== undefined && cache_del_data_history != null && cache_del_data_history.length > 0) {
      cache_del_data.filter(ele=>{
        if (ele.cacheSerialNumber == this.props.cacheSerialNumber) {
          return ele;
        }
      }).map(delData => {
              cache_del_data_history.map(med => {
                  let medicine = { ...med };
                  if (medicine.number == delData.number) {
                      if (delData.order_data !== undefined) {
                          let order_data = [];
                          let deleted_order = [];
                          medicine.order_data.order_data.map(med_order_data => {
                              let deleted = false;
                              delData.order_data.map(item => {
                                  if (item.order_number === med_order_data.order_number) {
                                      deleted = true;
                                      deleted_order.push(med_order_data);
                                  }
                              });
                              if (deleted === false) {
                                  order_data.push(med_order_data);
                              }
                          });

                          if (order_data.length > 0) {
                              medicine.is_enabled = 4; // RP delete
                              medicine.order_data.order_data = deleted_order;
                          } else {
                              medicine.is_enabled = 3; // all delete
                          }
                      }
                  }
                  // 中止
                  if (medicine.number == delData.number && medicine.stop_order !== undefined && medicine.stop_order !== null && medicine.stop_order === 1) {
                      medicine.openTag = 1;
                      // tmpStopPrescription.push(medicine);
                  } else {
                      // 削除
                      if (medicine.is_enabled == 3) {
                          medicine.openTag = 1;
                          deletedHistory.push(medicine);
                      }else if(medicine.is_enabled == 4){
                          medicine.openTag = 1;
                          deletedRpHistory.push(medicine);
                      }
                  }
              });
          });
    }

    // injection
    let cache_injection_del_data = this.cache_injection_del_data;
    let cache_injection_del_data_history = this.cache_injection_del_data_history;
        if (cache_injection_del_data !== undefined && cache_injection_del_data !== null && cache_injection_del_data.length > 0 && cache_injection_del_data_history !== undefined && cache_injection_del_data_history != null && cache_injection_del_data_history.length > 0) {
            cache_injection_del_data.filter(ele=>{
        if (ele.cacheSerialNumber == this.props.cacheSerialNumber) {
          return ele;
        }
      }).map(delData => {
                    cache_injection_del_data_history.map(med => {
                        let medicine = { ...med };
                        if (medicine.number == delData.number) {
                            if (delData.order_data !== undefined) {
                                let order_data = [];
                                let deleted_order = [];
                                medicine.order_data.order_data.map(med_order_data => {
                                    let deleted = false;
                                    delData.order_data.map(item => {
                                        if (item.order_number === med_order_data.order_number) {
                                            deleted = true;
                                            deleted_order.push(med_order_data);
                                        }
                                    });
                                    if (deleted === false) {
                                        order_data.push(med_order_data);
                                    }
                                });

                                if (order_data.length > 0) {
                                    medicine.is_enabled = 4; // RP delete
                                    medicine.order_data.order_data = deleted_order;
                                } else {
                                    medicine.is_enabled = 3; // all delete
                                }
                            }
                        }
                        // 中止
                        if (medicine.number == delData.number && medicine.stop_order !== undefined && medicine.stop_order !== null && medicine.stop_order === 1) {
                            medicine.openTag = 1;
                            // tmpStopInjection.push(medicine);
                        } else {
                            // 削除
                            if (medicine.is_enabled == 3) {
                                medicine.openTag = 1;
                                deletedInjectHistory.push(medicine);
                            }else if(medicine.is_enabled == 4){
                                medicine.openTag = 1;
                                deletedInjectRpHistory.push(medicine);
                            }
                        }
                    });
                });
        }
    this.setState({
      deletedHistory,
      deletedRpHistory,
      deletedInjectHistory,
      deletedInjectRpHistory
    });
  }

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

  confirmPrescription = () => {
    this.setState({
      visible: false
    },()=>{
      this.props.confirmPrescriptionOk();
    });
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let fnum = (this.flag + 1) % this.btns.length;

      this.setState({curFocus : fnum});
      this.flag = fnum;
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.confirmPrescription();
      }else{
        this.props.closeModal();
      }
    }
  }

  getCheckSameOptions = (ele_order) => {
    let med = ele_order.medicines[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      ele_order.medicines.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };

  getSameOptions = (ele_order, aa) => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};

        value[key] = ele_order.medicines[0][key];
        values.push(value);
      });
    }
    let value = {};
    value["one_dose_package"] = ele_order["one_dose_package"];
    values.push(value);
    value = {};
    value["temporary_medication"] = ele_order["temporary_medication"];
    values.push(value);
    value = {};
    value["mixture"] = ele_order["mixture"];
    values.push(value);
    return values;
  };
  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };

  // 確認モーダル・SOAPで、一般名処方オプションが薬剤とRP末尾の2か所表示される
    getCheckSameOptions = (ele_order) => {
      if (ele_order == null ||
        ele_order == undefined ||
        ele_order.medicines == undefined ||
        ele_order.medicines == null ||
        ele_order.medicines.length < 1) {
        return;
      }
      let med = ele_order.medicines[0];
      let keys = Object.keys(med);
      let equalKeys = [];
      const allEqual = arr => arr.every(v => v === arr[0]);
      keys.map(key => {
        let value = [];
        ele_order.medicines.map(medi => {
          value.push(medi[key]);
        });
        if (allEqual(value)) {
          equalKeys.push(key);
        }
      });
      return equalKeys;
    };

    // 確認モーダル・SOAPで、一般名処方オプションが薬剤とRP末尾の2か所表示される
    getSameOptions = (ele_order, aa) => {
      let values = [];
      if (aa !== undefined) {
        aa.map(key => {
          let value = {};

          value[key] = ele_order.medicines[0][key];
          values.push(value);
        });
      }
      let value = {};
      value["one_dose_package"] = ele_order["one_dose_package"];
      values.push(value);
      value = {};
      value["temporary_medication"] = ele_order["temporary_medication"];
      values.push(value);
      value = {};
      value["mixture"] = ele_order["mixture"];
      values.push(value);
      return values;
    };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }

  getDeleteArea(){
    //*******************
        //prescription
        const tmpPresData = this.state.deletedHistory;
        if(tmpPresData == undefined || tmpPresData == null || tmpPresData.length == 0){
            return (<></>);
        }

        //prescription
        const prescriptionData = tmpPresData.map((element, index) => {
            return (
                <div className="data-list" key={index}>
                    <div className="data-title">
                        <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
                            <div className="flex">
                                <div className="note">【{element.order_data.is_internal_prescription == 0?"院外" : "院内"}処方】 ＜削除＞</div>
                            </div>
                            <div className="date">
                                {element.order_data.executed_date_time !== "" && (
                                    <>
                                        {element.order_data.executed_date_time.substr(0, 4)}/
                                        {element.order_data.executed_date_time.substr(5, 2)}/
                                        {element.order_data.executed_date_time.substr(8, 2)}
                                        ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                                        {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                                        {element.order_data.executed_date_time.substr(14, 2)}分
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <MedicineListWrapper>
                        <div className={`history-item soap-del-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                            {element.order_data.order_data.filter(item => {
                                // if (item.usage_name.includes("ＸＸ")) {
                                //     return false;
                                // }
                                // if (
                                //     parseInt(item.usage) > 0 &&
                                //     item.enable_days !== undefined &&
                                //     item.enable_days === 0
                                // ) {
                                //     return true;
                                // }
                                // return (
                                //     item.usage > 0 &&
                                //     (item.days > 0 ||
                                //         (item.usage_replace_number !== undefined &&
                                //             item.usage_replace_number.length > 0))
                                // );
                                return ( item.usage_name != "" );
                            }).map((item, key)=>{
                                let keyName = {                                  
                                  one_dose_package: "一包化",
                                  temporary_medication: "臨時処方",
                                  mixture:"混合"
                                };
                                let sameKeys = this.getCheckSameOptions(item);
                                let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(item, sameKeys) : "";
                                let sameOptionsView;                                
                                if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                                  
                                  sameOptionsView = (
                                    <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
                                  );
                                  let noExistRpOptions = 0;
                                  sameOptions.map(option=>{        
                                    let key = Object.keys(option)[0];        
                                    if (key == "one_dose_package") {          
                                      if (option['one_dose_package'] == undefined || option['one_dose_package'] == null || option['one_dose_package'] == 0) {
                                        noExistRpOptions ++;
                                      }
                                    }
                                    if (key == "temporary_medication") {          
                                      if (option['temporary_medication'] == undefined || option['temporary_medication'] == null || option['temporary_medication'] == 0) {
                                        noExistRpOptions ++;
                                      }
                                    }
                                    if (key == "mixture") {          
                                      if (option['mixture'] == undefined || option['mixture'] == null || option['mixture'] == 0) {
                                        noExistRpOptions ++;
                                      }
                                    }
                                  })
                                  if (noExistRpOptions == 3) sameOptionsView = (<></>);
                                }
                                return (
                                    <div className="history-item" key={key}>
                                        <div className="box w70p" draggable="true">
                                            {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                                                return (
                                                    <>
                                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                          <div className="flex between">
                                                              <div className="flex full-width table-item text-right">
                                                                  <div className="number align-left" style={underLine}>
                                                                      {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                                                  </div>

                                                                  <div className="ml-3 full-width w100 align-left">
                                                                      {medicine_item.item_name}
                                                                      {medicine_item.amount > 0 &&
                                                                      medicine_item.uneven_values !== undefined &&
                                                                      medicine_item.uneven_values.length > 0 && (
                                                                          <p style={textAlignRight}>
                                                                              {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                                          </p>
                                                                      )}
                                                                      {medicine_item.free_comment
                                                                          ? medicine_item.free_comment.map(comment => {
                                                                              return (
                                                                                  <p key={comment.id} style={textAlignRight}>
                                                                                      {comment}
                                                                                  </p>
                                                                              );
                                                                          })
                                                                          : ""}                                                                    
                                                                  </div>
                                                              </div>
                                                              <div className="w80 table-item" style={textAlignRight}>
                                                                  {" "}
                                                                  {medicine_item.amount}
                                                                  {medicine_item.unit}
                                                              </div>
                                                          </div>
                                                      </div>
                                                      {(medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                        
                                                        <div className="flex between option table-row">
                                                          <div className="text-right table-item">
                                                            {medicine_item.can_generic_name === 1 && (
                                                              <>&nbsp;<span style={underLine}>【一般名処方】</span></>
                                                            )}
                                                            {medicine_item.is_not_generic === 1 && (
                                                              <>&nbsp;<span style={underLine}>【後発不可】</span></>
                                                            )}
                                                            {(medicine_item.milling !== undefined && medicine_item.milling === 1) && (
                                                              <>&nbsp;<span style={underLine}>【粉砕】</span></>
                                                            )}
                                                            {medicine_item.separate_packaging === 1 && (
                                                              <>&nbsp;<span style={underLine}>【別包】</span></>
                                                            )}
                                                          </div>
                                                        </div>
                                                      )}
                                                    </>
                                                )
                                            })}
                                            <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    <div className="table-item">
                                                        {!item.usage_name ? "" : `用法: ${item.usage_name}`}
                                                    </div>
                                                    {item.usage_remarks_comment ? (
                                                        <div className="table-item remarks-comment">
                                                            {item.usage_remarks_comment.map((comment, ci) => {
                                                                return <p key={ci}>{comment}</p>;
                                                            })}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className="w80 table-item">
                                                    {item.days !== 0 && item.days !== undefined
                                                        ? item.days +
                                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                                            ? item.days_suffix
                                                            : "日分")
                                                        : ""}
                                                </div>
                                            </div>
                                            {sameOptionsView}
                                            {item.start_date !== undefined && item.start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.insurance_type !== undefined && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`保険: ${this.getInsurance(item.insurance_type)}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.body_part !== undefined && item.body_part !== "" && (
                                                <div className="flex between option table-row prescription-body-part">
                                                    <div className="text-right table-item">
                                                        {`部位/補足: ${item.body_part}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_start_date !== undefined &&
                                            item.discontinuation_start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最初日: ${formatDate(
                                                            item.discontinuation_start_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_end_date !== undefined &&
                                            item.discontinuation_end_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最後日: ${formatDate(
                                                            item.discontinuation_end_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_comment !== undefined &&
                                            item.discontinuation_comment !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止コメント: ${item.discontinuation_comment}`}
                                                    </div>
                                                </div>
                                            )}                                            
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </MedicineListWrapper>
                </div>
            )
        });

        return(
            <>
                {prescriptionData}
            </>
        );
    }

  getDeleteRpArea(){
        //prescription
        const tmpPresData = this.state.deletedRpHistory;
        if(tmpPresData == undefined || tmpPresData == null || tmpPresData.length == 0){
            return (<></>);
        }

        //prescription
        const prescriptionData = tmpPresData.map((element, index) => {
            return (
                <div className="data-list" key={index}>
                    <div className="data-title">
                        <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
                            <div className="flex">
                                <div className="note">【{element.order_data.is_internal_prescription == 0?"院外" : "院内"}処方】 ＜一部削除＞</div>
                            </div>
                        </div>
                        <div className="date">
                                {element.order_data.executed_date_time !== "" && (
                                    <>
                                        {element.order_data.executed_date_time.substr(0, 4)}/
                                        {element.order_data.executed_date_time.substr(5, 2)}/
                                        {element.order_data.executed_date_time.substr(8, 2)}
                                        ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                                        {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                                        {element.order_data.executed_date_time.substr(14, 2)}分
                                    </>
                                )}
                            </div>
                    </div>
                    <MedicineListWrapper>
                        <div className={`history-item soap-del-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                            {element.order_data.order_data.filter(item => {
                                return (item.usage_name != "");
                            }).map((item, key)=>{
                                let keyName = {                                  
                                  one_dose_package: "一包化",
                                  temporary_medication: "臨時処方",
                                  mixture:"混合"
                                };
                                let sameKeys = this.getCheckSameOptions(item);
                                let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(item, sameKeys) : "";
                                let sameOptionsView;                                
                                if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {                                  
                                  sameOptionsView = (
                                    <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
                                  );
                                  let noExistRpOptions = 0;
                                  sameOptions.map(option=>{        
                                    let key = Object.keys(option)[0];        
                                    if (key == "one_dose_package") {          
                                      if (option['one_dose_package'] == undefined || option['one_dose_package'] == null || option['one_dose_package'] == 0) {
                                        noExistRpOptions ++;
                                      }
                                    }
                                    if (key == "temporary_medication") {          
                                      if (option['temporary_medication'] == undefined || option['temporary_medication'] == null || option['temporary_medication'] == 0) {
                                        noExistRpOptions ++;
                                      }
                                    }
                                    if (key == "mixture") {          
                                      if (option['mixture'] == undefined || option['mixture'] == null || option['mixture'] == 0) {
                                        noExistRpOptions ++;
                                      }
                                    }
                                  })
                                  if (noExistRpOptions == 3) sameOptionsView = (<></>);
                                }
                                return (
                                    <div className="history-item" key={key}>
                                        <div className="box w70p" draggable="true">
                                            {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                                                return (
                                                    <>
                                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                          <div className="flex between">
                                                              <div className="flex full-width table-item text-right">
                                                                  <div className="number align-left" style={underLine}>
                                                                      {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                                                  </div>

                                                                  <div className="ml-3 full-width w100 align-left">
                                                                      {medicine_item.item_name}
                                                                      {medicine_item.amount > 0 &&
                                                                      medicine_item.uneven_values !== undefined &&
                                                                      medicine_item.uneven_values.length > 0 && (
                                                                          <p style={textAlignRight}>
                                                                              {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                                          </p>
                                                                      )}
                                                                      {medicine_item.free_comment
                                                                          ? medicine_item.free_comment.map(comment => {
                                                                              return (
                                                                                  <p key={comment.id} style={textAlignRight}>
                                                                                      {comment}
                                                                                  </p>
                                                                              );
                                                                          })
                                                                          : ""}                                                                    
                                                                  </div>
                                                              </div>
                                                              <div className="w80 table-item" style={textAlignRight}>
                                                                  {" "}
                                                                  {medicine_item.amount}
                                                                  {medicine_item.unit}
                                                              </div>
                                                          </div>
                                                      </div>
                                                      {(medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                        
                                                        <div className="flex between option table-row">
                                                          <div className="text-right table-item">
                                                            {medicine_item.can_generic_name === 1 && (
                                                              <>&nbsp;<span style={underLine}>【一般名処方】</span></>
                                                            )}
                                                            {medicine_item.is_not_generic === 1 && (
                                                              <>&nbsp;<span style={underLine}>【後発不可】</span></>
                                                            )}
                                                            {(medicine_item.milling !== undefined && medicine_item.milling === 1) && (
                                                              <>&nbsp;<span style={underLine}>【粉砕】</span></>
                                                            )}
                                                            {medicine_item.separate_packaging === 1 && (
                                                              <>&nbsp;<span style={underLine}>【別包】</span></>
                                                            )}
                                                          </div>
                                                        </div>
                                                      )}
                                                    </>
                                                )
                                            })}
                                            <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    <div className="table-item">
                                                        {!item.usage_name ? "" : `用法: ${item.usage_name}`}
                                                    </div>
                                                    {item.usage_remarks_comment ? (
                                                        <div className="table-item remarks-comment">
                                                            {item.usage_remarks_comment.map((comment, ci) => {
                                                                return <p key={ci}>{comment}</p>;
                                                            })}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className="w80 table-item">
                                                    {item.days !== 0 && item.days !== undefined
                                                        ? item.days +
                                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                                            ? item.days_suffix
                                                            : "日分")
                                                        : ""}
                                                </div>
                                            </div>
                                            {sameOptionsView}
                                            {item.start_date !== undefined && item.start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.insurance_type !== undefined && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`保険: ${this.getInsurance(item.insurance_type)}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.body_part !== undefined && item.body_part !== "" && (
                                                <div className="flex between option table-row prescription-body-part">
                                                    <div className="text-right table-item">
                                                        {`部位/補足: ${item.body_part}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_start_date !== undefined &&
                                            item.discontinuation_start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最初日: ${formatDate(
                                                            item.discontinuation_start_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_end_date !== undefined &&
                                            item.discontinuation_end_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最後日: ${formatDate(
                                                            item.discontinuation_end_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_comment !== undefined &&
                                            item.discontinuation_comment !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止コメント: ${item.discontinuation_comment}`}
                                                    </div>
                                                </div>
                                            )}                                            
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </MedicineListWrapper>
                </div>
            )
        });

        return(
            <>
                {prescriptionData}
            </>
        );
    }

  getDeleteInjectionArea(){
        //injection
        const tmpInjectionData = this.state.deletedInjectHistory;
        if(tmpInjectionData == undefined || tmpInjectionData == null || tmpInjectionData.length == 0){
            return (<></>);
        }

        //injection
        const injectionData = tmpInjectionData.map((element, index) => {
            return (
                <div className="data-list" key={index}>
                    <div className="data-title">
                        <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
                            <div className="flex">
                                <div className="note">【注射】 ＜削除＞</div>
                            </div>
                            <div className="date">
                                {element.order_data.executed_date_time !== "" && (
                                    <>
                                        {element.order_data.executed_date_time.substr(0, 4)}/
                                        {element.order_data.executed_date_time.substr(5, 2)}/
                                        {element.order_data.executed_date_time.substr(8, 2)}
                                        ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                                        {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                                        {element.order_data.executed_date_time.substr(14, 2)}分
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <MedicineListWrapper>
                        <div className={`history-item soap-del-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                            {element.order_data.order_data.filter(item => {
                                return (item.usage_name != "");
                            }).map((item, key)=>{
                                return (
                                    <div className="history-item" key={key}>
                                        <div className="box w70p" draggable="true">
                                            <div className="flex between drug-item table-row">
                                                <div className="number" style={underLine}>
                                                    {" Rp" + parseInt(key + 1)}
                                                </div>
                                                <div className="text-right">
                                                    <div className="table-item">
                                                        {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                                    </div>
                                                </div>
                                                <div className="w80 table-item">
                                                    {item.days !== 0 && item.days !== undefined
                                                        ? item.days +
                                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                                            ? item.days_suffix
                                                            : "日分")
                                                        : ""}
                                                </div>
                                            </div>
                                            {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                                                return (
                                                    <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                        <div className="flex between">
                                                            <div className="flex full-width table-item">
                                                                <div className="number">
                                                                </div>

                                                                <div className="ml-3 full-width mr-2">
                                                                    {medicine_item.item_name}
                                                                    {medicine_item.amount > 0 &&
                                                                    medicine_item.uneven_values !== undefined &&
                                                                    medicine_item.uneven_values.length > 0 && (
                                                                        <p style={textAlignRight}>
                                                                            {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                                        </p>
                                                                    )}
                                                                    {medicine_item.free_comment
                                                                        ? medicine_item.free_comment.map(comment => {
                                                                            return (
                                                                                <p key={comment.id} style={textAlignRight}>
                                                                                    {comment}
                                                                                </p>
                                                                            );
                                                                        })
                                                                        : ""}
                                                                </div>
                                                            </div>
                                                            <div className="w80 table-item" style={textAlignRight}>
                                                                {" "}
                                                                {medicine_item.amount}
                                                                {medicine_item.unit}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {item.is_precision !== undefined &&
                                            item.is_precision == 1 && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        【精密持続点滴】
                                                    </div>
                                                </div>
                                            )}
                                            {item.start_date !== undefined && item.start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.insurance_type !== undefined && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`保険: ${this.getInsurance(item.insurance_type)}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.body_part !== undefined && item.body_part !== "" && (
                                                <div className="flex between option table-row prescription-body-part">
                                                    <div className="text-right table-item">
                                                        {`部位/補足: ${item.body_part}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_start_date !== undefined &&
                                            item.discontinuation_start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最初日: ${formatDate(
                                                            item.discontinuation_start_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_end_date !== undefined &&
                                            item.discontinuation_end_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最後日: ${formatDate(
                                                            item.discontinuation_end_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_comment !== undefined &&
                                            item.discontinuation_comment !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止コメント: ${item.discontinuation_comment}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    <div className="table-item">
                                                        {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                                    </div>
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                            </div>
                                            )}
                                            {item.usageName != undefined && item.usageName != null && item.usageName != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    {item.usage_remarks_comment ? (
                                                        <div className="table-item remarks-comment">
                                                            {item.usage_remarks_comment.map((comment, ci) => {
                                                                return <p key={ci}>{comment}</p>;
                                                            })}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </MedicineListWrapper>
                </div>
            )
        });

        return(
            <>
                {injectionData}
            </>
        );
    }

  getDeleteInjectionRpArea(){
        // injection
        const tmpInjectData = this.state.deletedRpHistory;
        if(tmpInjectData == undefined || tmpInjectData == null || tmpInjectData.length == 0){
            return (<></>);
        }

        // injection
        const injectionData = tmpInjectData.map((element, index) => {
            return (
                <div className="data-list" key={index}>
                    <div className="data-title">
                        <div className={`data-item ${element.openTag == 1 ? 'open' : ''}`}>
                            <div className="flex">
                                <div className="note">【注射】 ＜一部削除＞</div>
                            </div>
                            <div className="date">
                                {element.order_data.executed_date_time !== "" && (
                                    <>
                                        {element.order_data.executed_date_time.substr(0, 4)}/
                                        {element.order_data.executed_date_time.substr(5, 2)}/
                                        {element.order_data.executed_date_time.substr(8, 2)}
                                        ({this.getWeekDay(element.order_data.executed_date_time.substr(0,10))})
                                        {' '}{element.order_data.executed_date_time.substr(11, 2)}時
                                        {element.order_data.executed_date_time.substr(14, 2)}分
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <MedicineListWrapper>
                        <div className={`history-item soap-del-data-item ${element.openTag == 1 ? 'open line-through' : ''}`}>
                            {element.order_data.order_data.filter(item => {
                                return (item.usage_name != "");
                            }).map((item, key)=>{
                                return (
                                    <div className="history-item" key={key}>
                                        <div className="box w70p" draggable="true">
                                            <div className="flex between drug-item table-row">
                                                <div className="number" style={underLine}>
                                                    {" Rp" + parseInt(key + 1)}
                                                </div>
                                                <div className="text-right">
                                                    <div className="table-item">
                                                        {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                                    </div>
                                                </div>
                                                <div className="w80 table-item">
                                                    {item.days !== 0 && item.days !== undefined
                                                        ? item.days +
                                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                                            ? item.days_suffix
                                                            : "日分")
                                                        : ""}
                                                </div>
                                            </div>
                                            {item.med.length > 0 && item.med.filter(medicine_item => {return medicine_item.item_name != "";}).map((medicine_item, medicine_key)=>{
                                                return (
                                                    <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                        <div className="flex between">
                                                            <div className="flex full-width table-item">
                                                                <div className="number">
                                                                </div>

                                                                <div className="ml-3 full-width mr-2">
                                                                    {medicine_item.item_name}
                                                                    {medicine_item.amount > 0 &&
                                                                    medicine_item.uneven_values !== undefined &&
                                                                    medicine_item.uneven_values.length > 0 && (
                                                                        <p style={textAlignRight}>
                                                                            {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                                        </p>
                                                                    )}
                                                                    {medicine_item.free_comment
                                                                        ? medicine_item.free_comment.map(comment => {
                                                                            return (
                                                                                <p key={comment.id} style={textAlignRight}>
                                                                                    {comment}
                                                                                </p>
                                                                            );
                                                                        })
                                                                        : ""}
                                                                </div>
                                                            </div>
                                                            <div className="w80 table-item" style={textAlignRight}>
                                                                {" "}
                                                                {medicine_item.amount}
                                                                {medicine_item.unit}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {item.is_precision !== undefined &&
                                            item.is_precision == 1 && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        【精密持続点滴】
                                                    </div>
                                                </div>
                                            )}
                                            {item.start_date !== undefined && item.start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.insurance_type !== undefined && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`保険: ${this.getInsurance(item.insurance_type)}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.body_part !== undefined && item.body_part !== "" && (
                                                <div className="flex between option table-row prescription-body-part">
                                                    <div className="text-right table-item">
                                                        {`部位/補足: ${item.body_part}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_start_date !== undefined &&
                                            item.discontinuation_start_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最初日: ${formatDate(
                                                            item.discontinuation_start_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_end_date !== undefined &&
                                            item.discontinuation_end_date !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止期間の最後日: ${formatDate(
                                                            item.discontinuation_end_date
                                                        )}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.discontinuation_comment !== undefined &&
                                            item.discontinuation_comment !== "" && (
                                                <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                        {`中止コメント: ${item.discontinuation_comment}`}
                                                    </div>
                                                </div>
                                            )}
                                            {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    <div className="table-item">
                                                        {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                                    </div>
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                            </div>
                                            )}
                                            {item.usageName != undefined && item.usageName != null && item.usageName != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-right">
                                                    {item.usage_remarks_comment ? (
                                                        <div className="table-item remarks-comment">
                                                            {item.usage_remarks_comment.map((comment, ci) => {
                                                                return <p key={ci}>{comment}</p>;
                                                            })}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className="w80 table-item">
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </MedicineListWrapper>
                </div>
            )
        });
        return(
            <>
                {injectionData}
            </>
        );
    }

  callVisible = (p_visible, _presData) => {
    if (p_visible == true) {
      this.cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
      this.cache_del_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
      this.cache_del_data_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY);
      this.cache_injection_del_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
      this.cache_injection_del_data_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY);
      this.inject_cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT);
    }
    if (_presData != null) {
      this.setState({
        visible: p_visible,
        presData: _presData
      });
    } else {
      this.setState({
        visible: p_visible
      });
    }
  }

  getDoneTimes = (_done_times=null) => {
    if (_done_times == null || _done_times.length < 1) return "";

    let result = _done_times.map((item, index)=>{
      return(
        <>
          <span> {index+1}回目 {item != "" ? item : "未定"}{index == (_done_times.length - 1) ? "":"、"}</span>
        </>
      );
    }); 

    return result;   
  }

  render() {
    let cache_data = this.cache_data;
    if (cache_data != null){
      let key = Object.keys(cache_data)[0];
      cache_data = cache_data[key][0];
    }
    let inject_cache_data = this.inject_cache_data;
    if (inject_cache_data != null) {
      let inject_key = Object.keys(inject_cache_data)[0];
      inject_cache_data = inject_cache_data[inject_key];
    }

    // ●YJ287 注射の実施予定日がRPごとに表示される不具合
    // ・確認モーダル、SOAP右カラム、実施モーダルで発生
    // ・投与期間入力を使用したRPが1つも無い時は、中央カラムと同様に、注射オーダー1つに対して1回だけ表示してください。
    let hasAdministrate = false;
    if (this.props.type == "injection" && this.state.presData.length > 0) {
      this.state.presData.filter(ele=>{
        if (ele.usageName != "") {
          return ele;
        }
      }).map(item=>{
        if (item.administrate_period != undefined && item.administrate_period != null) {
          hasAdministrate = true;
        }
      });
    }


    // get deleted prescription from cache
    const DeletePart = this.getDeleteArea(); // order
    const DeleteRpPart = this.getDeleteRpArea(); // rp

    // get deleted injection from cache
    const DeleteInjectionPart = this.getDeleteInjectionArea(); // order
    const DeleteInjectionRpPart = this.getDeleteInjectionRpArea(); // rp

    // prescription 一般名処方... show.
    let keyName = {      
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture:"混合"
    };
    // let sameKeys = this.getCheckSameOptions();
    // const sameOptions = this.getSameOptions(sameKeys);
    // let sameOptionsView;
    // if (sameOptions !== undefined && sameOptions.length > 0) {
    //   sameOptionsView = (
    //     <SameOptions sameOptions={sameOptions} keyNames={keyName} />
    //   );
    // }
    return (
      <>
        <Modal
        // show={true}
        show={this.state.visible}
        id="soap-input-prescription"
        className="custom-modal-sm prescription_confirm_modal first-view-modal"
        onKeyDown={this.onKeyPressed}
        >
          <Modal.Header>
            <Modal.Title>{this.props.type =="prescription" ? "処方登録予定内容" : "注射登録予定内容"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MedicineListWrapper>
              <div className={`history-item soap-data-item open order`}>
                <div>
                    {this.props.type == "prescription" && this.state.presData.filter(ele=>{
                      if (ele.usageName != "") {
                        return ele;
                      }
                    }).map((item, key)=>{

                        let sameKeys = this.getCheckSameOptions(item);
                        let sameOptions = this.getSameOptions(item, sameKeys);
                        let sameOptionsView;
                        if (sameOptions !== undefined && sameOptions.length > 0) {
                          sameOptionsView = (
                            <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
                          );
                          let noExistRpOptions = 0;
                          sameOptions.map(option=>{        
                            let key = Object.keys(option)[0];        
                            if (key == "one_dose_package") {          
                              if (option['one_dose_package'] == undefined || option['one_dose_package'] == null || option['one_dose_package'] == 0) {
                                noExistRpOptions ++;
                              }
                            }
                            if (key == "temporary_medication") {          
                              if (option['temporary_medication'] == undefined || option['temporary_medication'] == null || option['temporary_medication'] == 0) {
                                noExistRpOptions ++;
                              }
                            }
                            if (key == "mixture") {          
                              if (option['mixture'] == undefined || option['mixture'] == null || option['mixture'] == 0) {
                                noExistRpOptions ++;
                              }
                            }
                          })
                          if (noExistRpOptions == 3) sameOptionsView = (<></>);
                        }

                        let rp_pos = null;                                        
                        if (item.medicines.length > 0) {
                          item.medicines.map((element, idx)=>{
                            if (element.medicineName != "" && rp_pos == null) {
                              rp_pos = idx;
                            }
                          });                          
                        }
                        if (rp_pos == null) rp_pos = 0;
                        return (
                            <div className="history-item" key={key}>
                                <div className="box w70p">
                                    {item.medicines.length > 0 && item.medicines.map((medicine_item, medicine_key)=>{
                                        return (
                                          <>
                                            {medicine_item.medicineName != "" && (
                                              <>
                                                <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                    <div className="flex between">
                                                        <div className="flex full-width table-item">
                                                            <div className="number" style={underLine}>
                                                                {medicine_key !== rp_pos ? "" : " Rp" + parseInt(key + 1)}
                                                            </div>

                                                            <div className="ml-3 full-width mr-2">
                                                                {medicine_item.medicineName}
                                                                {medicine_item.amount > 0 &&
                                                                medicine_item.uneven_values !== undefined &&
                                                                medicine_item.uneven_values.length > 0 && (
                                                                    <p style={textAlignRight}>
                                                                        {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                                    </p>
                                                                )}
                                                                {medicine_item.free_comment
                                                                    ? medicine_item.free_comment.map(comment => {
                                                                        return (
                                                                            <p key={comment.id} style={textAlignRight}>
                                                                                {comment}
                                                                            </p>
                                                                        );
                                                                    })
                                                                    : ""}                                                                
                                                            </div>
                                                        </div>
                                                        <div className="w80 table-item" style={textAlignRight}>
                                                            {" "}
                                                            {medicine_item.amount}
                                                            {medicine_item.unit}
                                                        </div>
                                                    </div>
                                                </div>
                                                {(medicine_item.can_generic_name === 1 || medicine_item.is_not_generic === 1 || (medicine_item.milling != undefined && medicine_item.milling === 1) || medicine_item.separate_packaging === 1) && (                                                        
                                                  <div className="flex between option table-row">
                                                    <div className="text-right table-item">
                                                      {medicine_item.can_generic_name === 1 && (
                                                        <>&nbsp;<span style={underLine}>【一般名処方】</span></>
                                                      )}
                                                      {medicine_item.is_not_generic === 1 && (
                                                        <>&nbsp;<span style={underLine}>【後発不可】</span></>
                                                      )}
                                                      {(medicine_item.milling !== undefined && medicine_item.milling === 1) && (
                                                        <>&nbsp;<span style={underLine}>【粉砕】</span></>
                                                      )}
                                                      {medicine_item.separate_packaging === 1 && (
                                                        <>&nbsp;<span style={underLine}>【別包】</span></>
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )
                                    })}
                                      <div className="flex drug-item table-row">
                                          <div className="text-right">
                                            <div className="table-item">
                                              {!item.usageName ? "" : "用法: " + item.usageName}
                                            </div>
                                            <div className="table-item remarks-comment">
                                              {item.usage_remarks_comment.map((comment, ci) => {
                                                return <p key={ci}>{comment}</p>;
                                              })}
                                            </div>
                                          </div>
                                          <div className="w80 table-item">
                                              {item.days !== 0 && item.days !== undefined
                                                  ? item.days +
                                                  (item.days_suffix !== undefined && item.days_suffix !== ""
                                                      ? item.days_suffix
                                                      : "日分")
                                                  : ""}
                                          </div>
                                      </div>
                                      {sameOptionsView}
                                    {item.is_precision !== undefined &&
                                    item.is_precision == 1 && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                【精密持続点滴】
                                            </div>
                                        </div>
                                    )}
                                    {item.start_date !== undefined && item.start_date !== "" && (item.administrate_period == undefined || item.administrate_period == null) && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`処方開始日: ${formatJapanDateSlash(formatDate(item.start_date))}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.insurance_type !== undefined && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`保険: ${this.getInsurance(item.insurance_type)}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.body_part !== undefined && item.body_part !== "" && (
                                        <div className="flex between option table-row prescription-body-part">
                                            <div className="text-right table-item">
                                                {`部位/補足: ${item.body_part}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.discontinuation_start_date !== undefined &&
                                    item.discontinuation_start_date !== "" && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`中止期間の最初日: ${formatDate(
                                                    item.discontinuation_start_date
                                                )}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.discontinuation_end_date !== undefined &&
                                    item.discontinuation_end_date !== "" && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`中止期間の最後日: ${formatDate(
                                                    item.discontinuation_end_date
                                                )}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.discontinuation_comment !== undefined &&
                                    item.discontinuation_comment !== "" && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`中止コメント: ${item.discontinuation_comment}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.administrate_period != undefined && item.administrate_period != null && (
                                      <div className={'flex between drug-item table-row'}>
                                        <div className="unit"></div>
                                        <div className="text-right">
                                          投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}~{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                          <br />
                                          {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                            <>
                                              間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                            </>
                                          )}
                                          {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                            <>
                                              曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                            </>
                                          )}
                                        </div>
                                        <div className="unit"></div>
                                      </div>
                                    )}                                    
                                </div>
                            </div>
                        )
                    })}
                    {this.props.type == "prescription" && cache_data != null && cache_data.med_consult != null && cache_data.med_consult !== undefined && cache_data.med_consult == 1 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                            【お薬相談希望あり】
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "prescription" && cache_data != null && cache_data.supply_med_info != null && cache_data.supply_med_info !== undefined && cache_data.supply_med_info == 1 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                            【薬剤情報提供あり】
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "prescription" && cache_data != null && cache_data.potion != null && cache_data.potion !== undefined && (cache_data.potion == 0 || cache_data.potion == 1) && cache_data.is_internal_prescription == 5 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {cache_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "prescription" && cache_data != null && cache_data.psychotropic_drugs_much_reason != null && cache_data.psychotropic_drugs_much_reason !== undefined && cache_data.psychotropic_drugs_much_reason !== "" && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`向精神薬多剤投与理由: ${cache_data.psychotropic_drugs_much_reason}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "prescription" && cache_data != null && cache_data.poultice_many_reason != null && cache_data.poultice_many_reason !== undefined && cache_data.poultice_many_reason !== "" && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`湿布薬超過投与理由: ${cache_data.poultice_many_reason}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "prescription" && cache_data != null && cache_data.free_comment != null && cache_data.free_comment !== undefined && cache_data.free_comment.length > 0 && cache_data.free_comment[0] != null && cache_data.free_comment[0] != '' && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`備考: ${cache_data.free_comment[0]}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                    {this.props.type == "prescription" && cache_data != null && cache_data.item_details != null && cache_data.item_details != undefined && cache_data.item_details.length > 0 && cache_data.item_details.map(ele=>{
                        return(
                            <>
                                {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                                    <div className="function-region">
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
                    {/*deleted prescription area*/}
                    {this.props.type == "prescription" && DeletePart}
                    {this.props.type == "prescription" && DeleteRpPart}
                    {this.props.type == "injection" && this.state.presData.filter(ele=>{
                      if (ele.usageName != "") {
                        return ele;
                      }
                    }).map((item, key)=>{
                        return (
                            <div className="history-item" key={key}>
                                <div className="box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="number" style={underLine}>
                                            {" Rp" + parseInt(key + 1)}
                                        </div>
                                        <div className="text-right inject-usage">
                                            <div className="table-item">
                                                {!item.usageName ? "" : "手技 " + item.usageName}
                                            </div>
                                            {/* {item.usage_remarks_comment ? (
                                                <div className="table-item remarks-comment">
                                                    {item.usage_remarks_comment.map((comment, ci) => {
                                                        return <p key={ci}>{comment}</p>;
                                                    })}
                                                </div>
                                            ) : (
                                                ""
                                            )} */}
                                        </div>
                                        <div className="w80 table-item">
                                        </div>
                                    </div>
                                    {item.medicines.length > 0 && item.medicines.map((medicine_item, medicine_key)=>{
                                      return (
                                        <>
                                        {medicine_item.medicineName != "" && (
                                          <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                              <div className="flex between">
                                                  <div className="flex full-width table-item">
                                                      <div className="number">
                                                      </div>

                                                      <div className="ml-3 full-width mr-2">
                                                          {medicine_item.medicineName}
                                                          {medicine_item.amount > 0 &&
                                                          medicine_item.uneven_values !== undefined &&
                                                          medicine_item.uneven_values.length > 0 && (
                                                              <p style={textAlignRight}>
                                                                  {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                              </p>
                                                          )}
                                                          {medicine_item.free_comment
                                                              ? medicine_item.free_comment.map(comment => {
                                                                  return (
                                                                      <p key={comment.id} style={textAlignRight}>
                                                                          {comment}
                                                                      </p>
                                                                  );
                                                              })
                                                              : ""}
                                                      </div>
                                                  </div>
                                                  <div className="w80 table-item" style={textAlignRight}>
                                                      {" "}
                                                      {medicine_item.amount}
                                                      {medicine_item.unit}
                                                  </div>
                                              </div>
                                          </div>
                                        )}
                                        </>
                                      )
                                  })}

                                    {item.is_precision !== undefined &&
                                    item.is_precision == 1 && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                【精密持続点滴】
                                            </div>
                                        </div>
                                    )}
                                    {item.insurance_type !== undefined && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`保険: ${this.getInsurance(item.insurance_type)}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.body_part !== undefined && item.body_part !== "" && (
                                        <div className="flex between option table-row prescription-body-part">
                                            <div className="text-right table-item">
                                                {`部位/補足: ${item.body_part}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.discontinuation_start_date !== undefined &&
                                    item.discontinuation_start_date !== "" && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`中止期間の最初日: ${formatDate(
                                                    item.discontinuation_start_date
                                                )}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.discontinuation_end_date !== undefined &&
                                    item.discontinuation_end_date !== "" && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`中止期間の最後日: ${formatDate(
                                                    item.discontinuation_end_date
                                                )}`}
                                            </div>
                                        </div>
                                    )}
                                    {item.discontinuation_comment !== undefined &&
                                    item.discontinuation_comment !== "" && (
                                        <div className="flex between option table-row">
                                            <div className="text-right table-item">
                                                {`中止コメント: ${item.discontinuation_comment}`}
                                            </div>
                                        </div>
                                    )}

                                    {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" ? (
                                      <div className="flex between drug-item table-row">
                                          <div className="text-right">
                                              <div className="table-item">
                                                  {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                              </div>
                                              {item.usage_remarks_comment ? (
                                                  <div className="table-item remarks-comment">
                                                      {item.usage_remarks_comment.map((comment, ci) => {
                                                          return <p key={ci}>{comment}</p>;
                                                      })}
                                                  </div>
                                              ) : (
                                                  ""
                                              )}
                                          </div>
                                          <div className="w80 table-item">
                                          </div>
                                      </div>
                                    ):item.usage_remarks_comment && item.usage_remarks_comment.length > 0 && (
                                      <div className="flex between drug-item table-row">
                                          <div className="text-right">
                                              {item.usage_remarks_comment ? (
                                                  <div className="table-item remarks-comment">
                                                      {item.usage_remarks_comment.map((comment, ci) => {
                                                          return <p key={ci}>{comment}</p>;
                                                      })}
                                                  </div>
                                              ) : (
                                                  ""
                                              )}
                                          </div>
                                          <div className="w80 table-item">
                                          </div>
                                      </div>
                                    )}  
                                  {hasAdministrate == true && inject_cache_data != undefined && inject_cache_data != null && inject_cache_data[0] != undefined && inject_cache_data[0] != null &&  inject_cache_data[0].is_completed !== null && inject_cache_data[0].is_completed !== undefined && inject_cache_data[0].is_completed != 1 && (item.administrate_period == undefined || item.administrate_period == null) && (
                                    <div className={'flex between drug-item table-row'}>
                                      <div className="unit"></div>
                                      <div className="text-right">
                                        {`実施予定日: ${formatJapanDateSlash(formatDateLine(inject_cache_data[0].schedule_date))}`}                              
                                      </div>
                                      <div className="unit"></div>
                                    </div>
                                  )}                                
                                  {item.administrate_period != undefined && item.administrate_period != null && (
                                    <div className={'flex between drug-item table-row'}>
                                      <div className="unit"></div>
                                      <div className="text-right inject-usage">
                                          <div>
                                            1日{item.administrate_period.done_count}回 : {this.getDoneTimes(item.administrate_period.done_times)}
                                          </div>
                                          <div>
                                            投与期間 : {formatJapanDateSlash(item.administrate_period.period_start_date)}～{formatJapanDateSlash(item.administrate_period.period_end_date)}
                                          </div>
                                          {item.administrate_period.period_type == 0 && item.administrate_period.period_category != null && (
                                            <div>
                                              間隔 : {item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月"}
                                            </div>
                                          )}
                                          {item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0 && (
                                            <div>
                                              曜日 : {getWeekNamesBySymbol(item.administrate_period.period_week_days)}
                                            </div>
                                          )}
                                          {item.administrate_period.start_count != undefined && item.administrate_period.done_days != undefined && ( item.administrate_period.start_count != 1 || item.administrate_period.end_count != item.administrate_period.done_count) && (
                                            <>
                                              <div>
                                                初回 {formatJapanDateSlash(item.administrate_period.done_days[0])}の{item.administrate_period.start_count}回目から
                                              </div>
                                              <div>
                                                最終 {formatJapanDateSlash(item.administrate_period.done_days[item.administrate_period.done_days.length - 1])}の{item.administrate_period.end_count}回目まで
                                              </div>
                                            </>
                                          )}
                                      </div>
                                      <div className="unit">
                                        {item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":""}
                                      </div>
                                    </div>
                                  )}
                                </div>
                            </div>
                        )
                    })} 
                    {hasAdministrate != true && inject_cache_data != undefined && inject_cache_data != null && inject_cache_data[0] != undefined && inject_cache_data[0] != null &&  inject_cache_data[0].is_completed !== null && inject_cache_data[0].is_completed !== undefined && inject_cache_data[0].is_completed != 1 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`実施予定日: ${formatJapanDateSlash(formatDateLine(inject_cache_data[0].schedule_date))}`}
                            </div>
                          </div>
                        </div>
                      </div>                      
                    )}                   
                    {this.props.type == "injection" && inject_cache_data != null && inject_cache_data[0].location_name !== null && inject_cache_data[0].location_name !== undefined && inject_cache_data[0].location_name !== "" &&
                      inject_cache_data[0].location_name !== 0 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`実施場所: ${inject_cache_data[0].location_name}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "injection" && inject_cache_data != null && inject_cache_data[0].drip_rate !== null && inject_cache_data[0].drip_rate !== undefined && inject_cache_data[0].drip_rate !== "" &&
                      inject_cache_data[0].drip_rate !== 0 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`点滴速度: ${inject_cache_data[0].drip_rate}ml/h`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "injection" && inject_cache_data != null && inject_cache_data[0].water_bubble !== null && inject_cache_data[0].water_bubble !== undefined && inject_cache_data[0].water_bubble !== "" &&
                      inject_cache_data[0].water_bubble !== 0 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`1分あたり: ${inject_cache_data[0].water_bubble}滴`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "injection" && inject_cache_data != null && inject_cache_data[0].exchange_cycle !== null && inject_cache_data[0].exchange_cycle !== undefined && inject_cache_data[0].exchange_cycle !== "" &&
                      inject_cache_data[0].exchange_cycle !== 0 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`交換サイクル: ${inject_cache_data[0].exchange_cycle}時間`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "injection" && inject_cache_data != null && inject_cache_data[0].require_time !== null && inject_cache_data[0].require_time !== undefined && inject_cache_data[0].require_time !== "" &&
                      inject_cache_data[0].require_time !== 0 && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`所要時間: ${inject_cache_data[0].require_time}時間`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                    {this.props.type == "injection" &&
                    inject_cache_data != null &&
                    inject_cache_data[0].free_comment != null &&
                    inject_cache_data[0].free_comment !== undefined &&
                    inject_cache_data[0].free_comment.length > 0 &&
                    inject_cache_data[0].free_comment[0] != null &&
                    inject_cache_data[0].free_comment[0] != undefined &&
                    inject_cache_data[0].free_comment[0] != "" && (
                      <div className="history-item">
                        <div className="box">
                          <div className="flex between option table-row">
                            <div className="text-right table-item">
                              {`備考: ${inject_cache_data[0].free_comment[0]}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.type == "injection" && inject_cache_data != null && inject_cache_data[0].item_details != null && inject_cache_data[0].item_details != undefined && inject_cache_data[0].item_details.length > 0 && inject_cache_data[0].item_details.map(ele=>{
                        return(
                            <>
                                {ele != null && ele != undefined && ele.item_id != null && ele.item_id != undefined && ele.item_id != 0 && (
                                    <div className="function-region">
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
                    {this.props.type == "injection" && DeleteInjectionPart}
                    {this.props.type == "injection" && DeleteInjectionRpPart}
                </div>
              </div>
          </MedicineListWrapper>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.props.closeModal}
              className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
            >
              <span>キャンセル</span>
            </div>
            <div
              id="system_confirm_Ok"
              className={this.state.curFocus === 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn red-btn"}
              onClick={this.confirmPrescription}
              style={{cursor:"pointer"}}
            >
              <span>確定</span>
            </div>
            {/*<Button id="btnCancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.closeModal}>キャンセル</Button>
            <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.confirmPrescription} style={{marginRight:'10px'}}>確定</Button>*/}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

PrescriptionConfirmModal.propTypes = {
  presData: PropTypes.array,
  patientId: PropTypes.number,
  closeModal: PropTypes.func,
  confirmPrescriptionOk: PropTypes.func,
  type: PropTypes.string,
  patientInfo: PropTypes.object,
  cacheSerialNumber: PropTypes.number,
};

export default PrescriptionConfirmModal;
