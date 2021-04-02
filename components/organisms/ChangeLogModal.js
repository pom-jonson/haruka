import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import axios from "axios";
import { formatDate, formatJapanDateSlash, getWeekNamesBySymbol } from "../../helpers/date";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import Checkbox from "~/components/molecules/Checkbox";
import { secondary200, disable } from "~/components/_nano/colors";
import {getStaffName} from "~/helpers/constants";
import renderHTML from 'react-render-html';

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  padding: 9px 2px 0px 2px;
  flex-wrap: wrap;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;

  .row {
    display: flex;
    width: 100%;
    color: #000;
    margin: auto;

    .unit {
      width: 50px;
      text-align: left;
    }

    .content {
      flex: 1;
      text-align: left;
    }

    .right {
      text-align: right;
    }

    .blue {
      color: #0000ff;
    }

    .deleted {
      text-decoration: line-through;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        margin: 0;
        padding: 0;
        line-height: 1.5;
        word-break: break-all;
        label {
          margin-bottom: 0;
        }
      }
    }
  }
`;
const Wrapper = styled.div`
  max-height: 70vh;
  height: 70vh;
  overflow-y: auto;
  .doctor-name-area{
    span{
      color: blue;
    }
  }
  .history-list {
    overflow-y: auto;
    font-size: 1rem;
    .text-blue{
      color: blue;
    }
    table {
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: auto;
          height: 4.25rem;
          width:100%;
      }
      tr{
          display: table;
          width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
        word-break: break-all;
          padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .check {
          width: 2.3rem;
          label {
            margin-right: 0;
          }
      }
      .date {
          width: 10rem;
      }
      .version {
          width: 3rem;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
      .name{
        width:20rem;
      }
    }
  }
  .history-content{
    height: calc(100% - 8rem);
    overflow-y: auto;
    .content-header {
      background: aquamarine;
    }
    .content-body{
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
          left: 80px;
        }
        &:after {
          content: "";
          background-color: ${disable};
          width: 1px;
          height: 100%;
          position: absolute;
          top: 0;
          right: 80px;
        }

        .table-row {
          &:nth-child(2n) {
            background-color: ${secondary200};
          }
        }
      }

      .full-width {
        width: calc(100% - 5rem - 15px);
      }
    }
    .item-details-tab {
      padding-top: 3px;
    }
    .deleted-order .row{
      text-decoration: line-through;
      label {
        text-decoration: line-through;
      }
      div {
        text-decoration: line-through;
      }
    }
  }
`;

export class ChangeLogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history_list: null,
      is_loaded: false,
      allOptions: [
        "milling",
        "can_generic_name",
        "is_not_generic",
        "one_dose_package",
        "temprary_dedicine",
        "insurance_type",
        "separate_packaging"
      ],
    };
  }

  async componentDidMount() {
    const history_list = await this.getTrackData();
    let differences = await this.checkDifference(history_list);
    this.setState({
      history_list,
      differences: differences.tabs,
      outputs: differences.outputs,
      item_details: differences.item_details,
      selectedTabIndex: 0,
      output: differences.outputs[0],
      item_details_output: differences.item_details_outputs[0],
      item_details_outputs: differences.item_details_outputs,
      is_loaded: true
    });
    document.getElementById("log_cancel_id").focus();
  }

  getTrackData = async () => {
    let result = [];
    let new_result = [];
      await axios.get("/app/api/v2/order/prescription/find/changelog", {
          params: { num: this.props.orderNumber }
      }).then(res => {
          result = res.data;
          result.map(item => {
              item.order_data.order_data = item.order_data.order_data.map(order => {
                  order.med = order.med.map(med => {
                      if (med.uneven_values !== undefined && med.uneven_values.length > 0) {
                          let unevenValues = [];
                          med.uneven_values.map(splitNum => {
                              if (splitNum.value !== undefined) {
                                  unevenValues.push(
                                      splitNum.label + " " + splitNum.value + med.unit
                                  );
                              }
                          });
                          med.free_comment.splice(0, 0, unevenValues.join(","));
                      }
                      return med;
                  });
                  return order;
              });
              item.history_show = 1;
              item.substitute_name = item.is_doctor_consented == 2 ? "" : getStaffName(item.updated_by);
              new_result.push(item);
          });
          });
    return new_result;
  };

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.insuranceTypeList) {
      this.props.insuranceTypeList.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    return insurance;
  };

  tempFunc = med => {
    let temp = {
      amount: {
        value: med.amount,
        type: 1
      },
      can_generic_name: {
        value: med.can_generic_name,
        type: 1
      },
      is_not_generic: {
        value: med.is_not_generic,
        type: 1
      },
      milling: {
        value: med.milling,
        type: 1
      },
      separate_packaging: {
        value: med.separate_packaging,
        type: 1
      },
      unit: {
        value: med.unit,
        type: 1
      },
      item_name: {
        value: med.item_name,
        type: 1
      }
    };

    // free_comment
    temp.free_comment = [];
    if (Array.isArray(med.free_comment)) {
      med.free_comment.map(oComment => {
        temp.free_comment.push({
          value: oComment,
          type: 1
        });
      });
    }

    return temp;
  };
  // type = 1 : new, type = 0 not changed -1: changed
  checkDifference = async(results) => {
    let changedVal = [];
    let item_details = [];
    let outputs = [];
    let item_details_outputs = [];
    let result = results;
    if (result.length > 0) {
      result.map((order, index) => {
        let version = results.findIndex(x=>x.number == order.number);
        version = results.length - version;
        let is_enabled = order.is_enabled;
        if (index < result.length - 1) {  // count > 1
          changedVal.push({
            id: index,
            label: "履歴" + (index + 1),
            latest: {
              date: order.updated_at,
              doctor_name: order.order_data.doctor_name,
              department_name: order.order_data.department,
              substitute_name: order.is_doctor_consented == 2 ? "": getStaffName(order.updated_by),
            },
            old: {
              date: result[index + 1].updated_at,
              doctor_name: result[index + 1].order_data.doctor_name,
              department_name: result[index + 1].order_data.department,
              // substitute_name:result[index + 1].order_data.substitute_name === undefined? "" : result[index + 1].order_data.substitute_name
              substitute_name:result[index + 1].is_doctor_consented == 2 ? "": getStaffName(result[index + 1].updated_by),
            }
          });
          item_details[index] = order.order_data.item_details;
          let current_item_details = order.order_data.item_details;
          let prev_item_details = result[index + 1].order_data.item_details;

          let current = order.order_data.order_data;
          let cur_potion = order.order_data.potion;
          let cur_is_internal_prescription = order.order_data.is_internal_prescription;
          let prev = result[index + 1].order_data.order_data;
          let prev_potion = result[index + 1].order_data.potion;
          let prev_is_internal_prescription = result[index + 1].order_data.is_internal_prescription;
          if (order.order_data.free_comment !== undefined) {
            order.order_data.free_comment = Array.isArray(order.order_data.free_comment) ? order.order_data.free_comment.join(",") : order.order_data.free_comment;
          } else {
            order.order_data.free_comment = "";
          }
          if (result[index + 1].order_data.free_comment !== undefined) {
            result[index + 1].order_data.free_comment = Array.isArray(result[index + 1].order_data.free_comment) ? result[index + 1].order_data.free_comment.join(",") : result[index + 1].order_data.free_comment;
          } else {
            result[index + 1].order_data.free_comment = "";
          }          
          outputs[index] = [];
          current.map(orderItem => {
            let prevItem = undefined;
            let output = {};
            prev.map(item => {
              if (orderItem.order_number === item.order_number) {
                prevItem = item;
              }
            });
            if (orderItem.body_part === undefined) orderItem.body_part = "";

            if (prevItem !== undefined) {
              if (prevItem.body_part === undefined) prevItem.body_part = "";
              output = {
                days: {
                  value: orderItem.days,
                  old: prevItem.days,
                  type: orderItem.days === prevItem.days ? 0 : -1,
                  new_suffix:
                    orderItem.days_suffix !== undefined &&
                    orderItem.days_suffix !== "" ? orderItem.days_suffix : "日分",
                  old_suffix:
                    prevItem.days_suffix !== undefined &&
                    prevItem.days_suffix !== "" ? prevItem.days_suffix : "日分"
                },
                usage_name: {
                  value: orderItem.usage_name,
                  old: prevItem.usage_name,
                  type: orderItem.usage_name === prevItem.usage_name ? 0 : -1
                },
                injectUsageName: {
                  value: orderItem.injectUsageName,
                  old: prevItem.injectUsageName,
                  type: orderItem.injectUsageName === prevItem.injectUsageName ? 0 : (prevItem.injectUsageName != undefined && prevItem.injectUsageName != '' ? -1 : 1)
                },
                med_consult: {
                  value: orderItem.med_consult,
                  old: prevItem.med_consult,
                  type: orderItem.med_consult === prevItem.med_consult ? 0 : orderItem.med_consult === 1 ? 1 : -1
                },
                supply_med_info: {
                  value: orderItem.supply_med_info,
                  old: prevItem.supply_med_info,
                  type:orderItem.supply_med_info === prevItem.supply_med_info  ? 0  : orderItem.supply_med_info === 1  ? 1  : -1
                },
                potion: {
                  value: cur_potion,
                  old: prev_potion,
                  type:cur_potion === prev_potion  ? 0  : cur_potion === 1  ? 1  : -1
                },
                is_internal_prescription: {
                  value: cur_is_internal_prescription,
                  old: prev_is_internal_prescription,
                  type:cur_is_internal_prescription === prev_is_internal_prescription  ? 0  : cur_is_internal_prescription === 1  ? 1  : -1
                },                
                med: [],
                one_dose_package: {
                  value: orderItem.one_dose_package,
                  old: prevItem.one_dose_package,
                  type:orderItem.one_dose_package === prevItem.one_dose_package  ? 0  : orderItem.one_dose_package === 1  ? 1  : -1
                },
                mixture: {
                  value: orderItem.mixture,
                  old: prevItem.mixture,
                  type:orderItem.mixture === prevItem.mixture  ? 0  : orderItem.mixture === 1  ? 1  : -1
                },
                temporary_medication: {
                  value: orderItem.temporary_medication,
                  old: prevItem.temporary_medication,
                  type:orderItem.temporary_medication ===prevItem.temporary_medication  ? 0  : orderItem.temporary_medication === 1  ? 1  : -1
                },
                insurance_type: {
                  value: orderItem.insurance_type,
                  old: prevItem.insurance_type,
                  type:orderItem.insurance_type === prevItem.insurance_type  ? 0  : -1
                },
                body_part: {
                  value: orderItem.body_part,
                  old: prevItem.body_part,
                  type: orderItem.body_part === prevItem.body_part ? 0 : -1
                },
                start_date: {
                  value: orderItem.start_date,
                  old: prevItem.start_date,
                  type: orderItem.start_date === prevItem.start_date ? 0 : -1
                }
              };

              // usage_remarks_comment
              let comments = [];
              if ( Array.isArray(orderItem.usage_remarks_comment) && Array.isArray(prevItem.usage_remarks_comment) ) {
                orderItem.usage_remarks_comment.map(oComment => {
                  let isNew = true;
                  prevItem.usage_remarks_comment.map(pComment => {
                    if (oComment === pComment) {
                      isNew = false;
                    }
                  });
                  comments.push({
                    value: oComment,
                    type: isNew ? 1 : 0
                  });
                });

                prevItem.usage_remarks_comment.map(pComment => {
                  let isRemoved = true;
                  orderItem.usage_remarks_comment.map(oComment => {
                    if (oComment === pComment) {
                      isRemoved = false;
                    }
                  });
                  if (isRemoved) {
                    comments.push({
                      value: pComment,
                      type: -1
                    });
                  }
                });
              }
              output.usage_remarks_comment = comments;

              orderItem.med.map(med => {
                let prevMed = undefined;
                prevItem.med.map(med1 => {
                  if (med.item_number == med1.item_number) {
                    prevMed = med1;
                  }
                });

                if (prevMed != undefined) {
                  let temp = {
                    amount: {
                      value: med.amount,
                      old: prevMed.amount,
                      type: med.amount === prevMed.amount ? 0 : -1
                    },
                    can_generic_name: {
                      value: med.can_generic_name,
                      old: prevMed.can_generic_name,
                      type:
                        med.can_generic_name === prevMed.can_generic_name
                          ? 0
                          : med.can_generic_name === 1
                          ? 1
                          : -1
                    },
                    is_not_generic: {
                      value: med.is_not_generic,
                      old: prevMed.is_not_generic,
                      type:
                        med.is_not_generic === prevMed.is_not_generic
                          ? 0
                          : med.is_not_generic === 1
                          ? 1
                          : -1
                    },
                    milling: {
                      value: med.milling,
                      old: prevMed.milling,
                      type:
                        med.milling === prevMed.milling
                          ? 0
                          : med.milling === 1
                          ? 1
                          : -1
                    },
                    separate_packaging: {
                      value: med.separate_packaging,
                      old: prevMed.separate_packaging,
                      type:
                        med.separate_packaging === prevMed.separate_packaging
                          ? 0
                          : med.separate_packaging === 1
                          ? 1
                          : -1
                    },
                    unit: {
                      value: med.unit,
                      old: prevMed.unit,
                      type: med.unit === prevMed.unit ? 0 : -1
                    },
                    item_name: {
                      value: med.item_name,
                      old: prevMed.item_name,
                      type: med.item_name === prevMed.item_name ? 0 : -1
                    }
                  };

                  // free_comment
                  temp.free_comment = [];
                  if (
                    Array.isArray(med.free_comment) &&
                    Array.isArray(prevMed.free_comment)
                  ) {
                    med.free_comment.map(oComment => {
                      let isNew = true;
                      prevMed.free_comment.map(pComment => {
                        if (oComment === pComment) {
                          isNew = false;
                        }
                      });
                      temp.free_comment.push({
                        value: oComment,
                        type: isNew ? 1 : 0
                      });
                    });

                    prevMed.free_comment.map(pComment => {
                      let isRemoved = true;
                      med.free_comment.map(oComment => {
                        if (oComment === pComment) {
                          isRemoved = false;
                        }
                      });
                      if (isRemoved) {
                        temp.free_comment.push({
                          value: pComment,
                          type: -1
                        });
                      }
                    });
                  }

                  output.med.push(temp);
                } else {
                  const temp = this.tempFunc(med);
                  output.med.push(temp);
                }
              });

              prevItem.med.map(med => {
                let currentMed = undefined;
                orderItem.med.map(med1 => {
                  if (med.item_number == med1.item_number) {
                    currentMed = med1;
                  }
                });

                if (currentMed === undefined) {
                  let temp = {
                    amount: {
                      value: med.amount,
                      type: -1
                    },
                    can_generic_name: {
                      old: med.can_generic_name,
                      type: -1
                    },
                    is_not_generic: {
                      old: med.is_not_generic,
                      type: -1
                    },
                    milling: {
                      old: med.milling,
                      type: -1
                    },
                    separate_packaging: {
                      old: med.separate_packaging,
                      type: -1
                    },
                    unit: {
                      value: med.unit,
                      type: -1
                    },
                    item_name: {
                      value: med.item_name,
                      type: -1
                    }
                  };

                  // free_comment
                  temp.free_comment = [];
                  if (Array.isArray(med.free_comment)) {
                    med.free_comment.map(oComment => {
                      temp.free_comment.push({
                        value: oComment,
                        type: -1
                      });
                    });
                  }
                  output.med.push(temp);
                }
              });

              if (orderItem.usage_replace_number !== undefined && orderItem.usage_replace_number.length > 0 && orderItem.usage_name.includes("ＸＸ")) {
                let value = orderItem.usage_name;
                orderItem.usage_replace_number.map(number => {
                  value = value.replace("ＸＸ", number);
                });
                output.usage_name.value = value;
                output.days.hidden = 1;
              }

              if (prevItem.usage_replace_number !== undefined && prevItem.usage_replace_number.length > 0 && prevItem.usage_name.includes("ＸＸ")) {
                let value = prevItem.usage_name;
                prevItem.usage_replace_number.map(number => {
                  value = value.replace("ＸＸ", number);
                });
                output.usage_name.old = value;
                output.days.hidden = 1;
              }
              if (orderItem.administrate_period !== undefined) {
                if (prevItem.administrate_period !== undefined) {
                  output.administrate_period = {
                    value: orderItem.administrate_period,
                    old: prevItem.administrate_period,
                    type: JSON.stringify(orderItem.administrate_period) == JSON.stringify(prevItem.administrate_period) ? 0 : -1
                  };
                } else {
                  output.administrate_period = {
                    value: orderItem.administrate_period,
                    type: 1
                  };
                }
              } else {
                if (prevItem.administrate_period !== undefined) {
                  output.administrate_period = {
                    value: prevItem.administrate_period,
                    type: -1
                  };
                }
              }
            } else {
              output = {
                days: {
                  value: orderItem.days,
                  type: 1,
                  new_suffix: orderItem.days_suffix !== undefined && orderItem.days_suffix !== "" ? orderItem.days_suffix : "日分"
                },
                usage_name: {
                  value: orderItem.usage_name,
                  type: 1
                },
                injectUsageName: {
                  value: orderItem.injectUsageName,
                  type: 1
                },
                med_consult: {
                  value: orderItem.med_consult,
                  type: 1
                },
                supply_med_info: {
                  value: orderItem.supply_med_info,
                  type: 1
                },
                potion: {
                  value: cur_potion,
                  type: 1
                },
                is_internal_prescription: {
                  value: cur_is_internal_prescription,
                  type: 1
                },
                med: [],
                one_dose_package: {
                  value: orderItem.one_dose_package,
                  type: 1
                },
                mixture: {
                  value: orderItem.mixture,
                  type: 1
                },
                temporary_medication: {
                  value: orderItem.temporary_medication,
                  type: 1
                },
                insurance_type: {
                  value: orderItem.insurance_type,
                  type: 1
                },
                body_part: {
                  value: orderItem.body_part,
                  type: 1
                },
                start_date: {
                  value: orderItem.start_date,
                  type: 1
                }
              };
      
              // usage_remarks_comment
              let comments = [];
              if (Array.isArray(orderItem.usage_remarks_comment)) {
                orderItem.usage_remarks_comment.map(oComment => {
                  comments.push({
                    value: oComment,
                    type: 1
                  });
                });
              }
              output.usage_remarks_comment = comments;

              orderItem.med.map(med => {
                const temp = this.tempFunc(med);
                output.med.push(temp);
              });
  
              if (orderItem.administrate_period !== undefined) {
                output.administrate_period = {
                  value: orderItem.administrate_period,
                  type: 1
                };
              }

              if (orderItem.usage_replace_number !== undefined &&orderItem.usage_replace_number.length > 0 && orderItem.usage_name.includes("ＸＸ")) {
                let value = orderItem.usage_name;
                orderItem.usage_replace_number.map(number => {
                  value = value.replace("ＸＸ", number);
                });
                output.usage_name.value = value;
                output.days.hidden = 1;
              }
            }
            output.is_enabled=order.is_enabled;
            outputs[index].push(output);
          });

          let removedIndex = 0;
          prev.map(prevItem => {
            let removed = true;
            current.map((item, index) => {
              if (prevItem.order_number === item.order_number) {
                removed = false;
                removedIndex = index;
              }
            });

            if (prevItem.body_part === undefined) prevItem.body_part = "";

            if (removed === true) {
              let output = {
                days: {
                  value: prevItem.days,
                  type: -1,
                  new_suffix: prevItem.days_suffix !== undefined && prevItem.days_suffix !== ""   ? prevItem.days_suffix   : "日分"
                },
                usage_name: {
                  value: prevItem.usage_name,
                  type: -1
                },
                injectUsageName: {
                  value: prevItem.injectUsageName,
                  type: -1
                },
                med_consult: {
                  value: prevItem.med_consult,
                  type: -1
                },
                supply_med_info: {
                  value: prevItem.supply_med_info,
                  type: -1
                },
                potion: {
                  value: prev_potion,
                  type: -1
                },
                med: [],
                one_dose_package: {
                  old: prevItem.one_dose_package,
                  type: -1
                },
                mixture: {
                  old: prevItem.mixture,
                  type: -1
                },
                temporary_medication: {
                  old: prevItem.temporary_medication,
                  type: -1
                },
                insurance_type: {
                  old: prevItem.insurance_type,
                  type: -1
                },
                body_part: {
                  old: prevItem.body_part,
                  type: -1
                },
                start_date: {
                  old: prevItem.start_date,
                  type: -1
                }
              };

              // usage_remarks_comment
              output.usage_remarks_comment = [];
              if (Array.isArray(prevItem.usage_remarks_comment)) {
                prevItem.usage_remarks_comment.map(pComment => {
                  output.usage_remarks_comment.push({
                    value: pComment,
                    type: -1
                  });
                });
              }

              prevItem.med.map(med => {
                let temp = {
                  amount: {
                    value: med.amount,
                    type: -1
                  },
                  can_generic_name: {
                    old: med.can_generic_name,
                    type: -1
                  },
                  is_not_generic: {
                    old: med.is_not_generic,
                    type: -1
                  },
                  milling: {
                    old: med.milling,
                    type: -1
                  },
                  separate_packaging: {
                    old: med.separate_packaging,
                    type: -1
                  },
                  unit: {
                    value: med.unit,
                    type: -1
                  },
                  item_name: {
                    value: med.item_name,
                    type: -1
                  }
                };

                // free_comment
                temp.free_comment = [];
                if (Array.isArray(med.free_comment)) {
                  med.free_comment.map(oComment => {
                    temp.free_comment.push({
                      value: oComment,
                      type: -1
                    });
                  });
                }
                output.med.push(temp);
              });

              if (prevItem.usage_replace_number !== undefined &&prevItem.usage_replace_number.length > 0 &&prevItem.usage_name.includes("ＸＸ")) {
                let value = prevItem.usage_name;
                prevItem.usage_replace_number.map(number => {
                  value = value.replace("ＸＸ", number);
                });
                output.usage_name.value = value;
                output.days.hidden = 1;
              }
              outputs[index].splice(removedIndex + 1, 0, output);
            }
          });
          if (outputs[index].length > 0) {
            outputs[index][0].karte_status = {
              value: order.order_data.karte_status,
              old: result[index + 1].order_data.karte_status,
              type:order.order_data.karte_status ===result[index + 1].order_data.karte_status ? 0  : (result[index + 1].order_data.karte_status != undefined && result[index + 1].order_data.karte_status != '' ? -1 : 1)
            };
            outputs[index][0].order_title = {
              value: order.order_title,
              old: result[index + 1].order_title,
              type:order.order_title ===result[index + 1].order_title ? 0  : (result[index + 1].order_title != undefined && result[index + 1].order_title != '' ? -1 : 1)
            };
            outputs[index][0].psychotropic_drugs_much_reason = {
              value: order.order_data.psychotropic_drugs_much_reason,
              old: result[index + 1].order_data.psychotropic_drugs_much_reason,
              type:order.order_data.psychotropic_drugs_much_reason ===result[index + 1].order_data.psychotropic_drugs_much_reason ? 0  : (result[index + 1].order_data.psychotropic_drugs_much_reason != undefined && result[index + 1].order_data.psychotropic_drugs_much_reason != '' ? -1 : 1)
            };

            outputs[index][0].poultice_many_reason = {
              value: order.order_data.poultice_many_reason,
              old: result[index + 1].order_data.poultice_many_reason,
              type:order.order_data.poultice_many_reason ===result[index + 1].order_data.poultice_many_reason  ? 0  : (result[index + 1].order_data.poultice_many_reason != undefined && result[index + 1].order_data.poultice_many_reason != '' ? -1 : 1)
            };

            outputs[index][0].free_comment = {
              value: order.order_data.free_comment,
              old: result[index + 1].order_data.free_comment,
              type:order.order_data.free_comment ===result[index + 1].order_data.free_comment  ? 0  : 
              (result[index + 1].order_data.free_comment != undefined && result[index + 1].order_data.free_comment != null && result[index + 1].order_data.free_comment[0] != undefined && result[index + 1].order_data.free_comment[0] != '' ? -1 : 1)
            };

            outputs[index][0].location_name = {
              value: order.order_data.location_name,
              old: result[index + 1].order_data.location_name,
              type:order.order_data.location_name ===result[index + 1].order_data.location_name  ? 0  : (result[index + 1].order_data.location_name != undefined && result[index + 1].order_data.location_name != '' ? -1 : 1)
            };
            outputs[index][0].drip_rate = {
              value: order.order_data.drip_rate,
              old: result[index + 1].order_data.drip_rate,
              type:order.order_data.drip_rate ===result[index + 1].order_data.drip_rate  ? 0  : (result[index + 1].order_data.drip_rate != undefined && result[index + 1].order_data.drip_rate != '' ? -1 : 1)
            };

            outputs[index][0].water_bubble = {
              value: order.order_data.water_bubble,
              old: result[index + 1].order_data.water_bubble,
              type:order.order_data.water_bubble ===result[index + 1].order_data.water_bubble  ? 0  : (result[index + 1].order_data.water_bubble != undefined && result[index + 1].order_data.water_bubble != '' ? -1 : 1)
            };

            outputs[index][0].exchange_cycle = {
              value: order.order_data.exchange_cycle,
              old: result[index + 1].order_data.exchange_cycle,
              type:order.order_data.exchange_cycle ===result[index + 1].order_data.exchange_cycle  ? 0  : (result[index + 1].order_data.exchange_cycle != undefined && result[index + 1].order_data.exchange_cycle != '' ? -1 : 1)
            };

            outputs[index][0].require_time = {
              value: order.order_data.require_time,
              old: result[index + 1].order_data.require_time,
              type:order.order_data.require_time ===result[index + 1].order_data.require_time  ? 0  : (result[index + 1].order_data.require_time != undefined && result[index + 1].order_data.require_time != '' ? -1 : 1)
            };
            outputs[index][0].date = order.updated_at;
            outputs[index][0].version = version;
            // outputs[index][0].doctor_name = order.order_data.doctor_name;
            outputs[index][0].doctor_name = {
              value: order.order_data.doctor_name,
              old: result[index + 1].order_data.doctor_name,
              type:order.order_data.doctor_name ===result[index + 1].order_data.doctor_name  ? 0  : (result[index + 1].order_data.doctor_name != undefined && result[index + 1].order_data.doctor_name != '' ? -1 : 1)
            };
            outputs[index][0].department_name = order.order_data.department;
            outputs[index][0].substitute_name = order.is_doctor_consented == 2 ? "" : getStaffName(order.updated_by);
          }

          item_details_outputs[index] = [];
          if (current_item_details != undefined && current_item_details != null) {
            current_item_details.map((curItem) => {
              var prevItem = undefined;
              var output = {};
              // prevItem = prev_item_details[curIndex];
              prev_item_details.map(item => {
                if (curItem.item_id === item.item_id) {
                  prevItem = item;
                }
              });
              if (prevItem != undefined) {
                output = {
                  item_name:{
                    value: curItem.item_name,
                    old: prevItem.item_name,
                    type: curItem.item_name == prevItem.item_name ? 0 : -1,
                  },
                  value1:{
                    value: curItem.value1,
                    old: prevItem.value1,
                    type: curItem.value1 == prevItem.value1 ? 0 : -1,
                  },
                  value2:{
                    value: curItem.value2,
                    old: prevItem.value2,
                    type: curItem.value2 == prevItem.value2 ? 0 : -1,
                  }
                }
              } else {
                output = {
                  item_name:{
                    value: curItem.item_name,
                    type: 1,
                  },
                  value1:{
                    value: curItem.value1,
                    type: 1,
                  },
                  value2:{
                    value: curItem.value2,
                    type: 1,
                  },
                  classfic_name: curItem.classfic_name,
                  value1_format: curItem.value1_format,
                  value2_format: curItem.value2_format,
                }
              }
              output.is_enabled = order.is_enabled;
              item_details_outputs[index].push(output);
            });

          }
          if (prev_item_details != undefined && prev_item_details != null) {
            let removedIndex = 0;
            prev_item_details.map(prevItem=>{
              let removed = true;
              current_item_details.map((item, index)=>{
                if (prevItem.item_id == item.item_id && item.is_deleted != 1) {
                  removed = false;
                  removedIndex = index;
                  item.is_deleted = 1;
                }
              });
              if (removed) {
                var output = {};
               output = {
                  item_name:{
                    old: prevItem.item_name,
                    type: -1,
                  },
                  value1:{
                    old: prevItem.value1,
                    type: -1,
                  },
                  value2:{
                    old: prevItem.value2,
                    type: -1,
                  },
                  classfic_name: prevItem.classfic_name,
                  value1_format: prevItem.value1_format,
                  value2_format: prevItem.value2_format,
                }
              item_details_outputs[index].splice(removedIndex + 1, 0, output);
              }
            })
          }
        
        } else {  // count = 1;
          item_details[index] = order.order_data.item_details;
          let current_item_details = order.order_data.item_details;

          let current = order.order_data.order_data;
          let cur_potion = order.order_data.potion;
          if (order.order_data.free_comment !== undefined) {
            order.order_data.free_comment = Array.isArray(order.order_data.free_comment)? order.order_data.free_comment.join(",") : order.order_data.free_comment;
          } else {
            order.order_data.free_comment = "";
          }  
          outputs[index] = [];
          current.map(orderItem => {
            let output = {};

            if (orderItem.body_part === undefined) orderItem.body_part = "";
            output = {
              days: {
                value: orderItem.days,
                type: 1,
                new_suffix: orderItem.days_suffix !== undefined && orderItem.days_suffix !== "" ? orderItem.days_suffix : "日分"
              },
              usage_name: {
                value: orderItem.usage_name,
                type: 1
              },
              injectUsageName: {
                value: orderItem.injectUsageName,
                type: 1
              },
              med_consult: {
                value: orderItem.med_consult,
                type: 1
              },
              supply_med_info: {
                value: orderItem.supply_med_info,
                type: 1
              },
              potion: {
                value: cur_potion,
                type: 1
              },
              med: [],
              one_dose_package: {
                value: orderItem.one_dose_package,
                type: 1
              },
              mixture: {
                value: orderItem.mixture,
                type: 1
              },
              temporary_medication: {
                value: orderItem.temporary_medication,
                type: 1
              },
              insurance_type: {
                value: orderItem.insurance_type,
                type: 1
              },
              body_part: {
                value: orderItem.body_part,
                type: 1
              },
              start_date: {
                value: orderItem.start_date,
                type: 1
              }
            };

            // usage_remarks_comment
            let comments = [];
            if (Array.isArray(orderItem.usage_remarks_comment)) {
              orderItem.usage_remarks_comment.map(oComment => {
                comments.push({
                  value: oComment,
                  type: 1
                });
              });
            }
            output.usage_remarks_comment = comments;

            orderItem.med.map(med => {
              const temp = this.tempFunc(med);
              output.med.push(temp);
            });
            if (orderItem.administrate_period !== undefined) {
              output.administrate_period = {
                value: orderItem.administrate_period,
                type: 1
              };
            }

            if (orderItem.usage_replace_number !== undefined &&orderItem.usage_replace_number.length > 0 &&orderItem.usage_name.includes("ＸＸ")) {
                let value = orderItem.usage_name;
                orderItem.usage_replace_number.map(number => {
                  value = value.replace("ＸＸ", number);
                });
                output.usage_name.value = value;
                output.days.hidden = 1;
              }
            outputs[index].push(output);
          });

          if (outputs[index].length > 0) {
            outputs[index][0].karte_status = {
              value: order.order_data.karte_status,
              type: 1
            };
            outputs[index][0].order_title = {
              value: order.order_title,
              type: 1
            };
            outputs[index][0].psychotropic_drugs_much_reason = {
              value: order.order_data.psychotropic_drugs_much_reason,
              type: 1
            };

            outputs[index][0].poultice_many_reason = {
              value: order.order_data.poultice_many_reason,
              type:1
            };

            outputs[index][0].free_comment = {
              value: order.order_data.free_comment,
              type: 1
            };

            outputs[index][0].location_name = {
              value: order.order_data.location_name,
              type: 1
            };

            outputs[index][0].drip_rate = {
              value: order.order_data.drip_rate,
              type: 1
            };

            outputs[index][0].water_bubble = {
              value: order.order_data.water_bubble,
              type:1
            };

            outputs[index][0].exchange_cycle = {
              value: order.order_data.exchange_cycle,
              type:1
            };

            outputs[index][0].require_time = {
              value: order.order_data.require_time,
              type:1
            };
            outputs[index][0].date = order.updated_at;
            outputs[index][0].version = version;
            outputs[index][0].is_enabled = is_enabled;
            // outputs[index][0].doctor_name = order.order_data.doctor_name;
            outputs[index][0].doctor_name = {
              value: order.order_data.doctor_name,              
              type:1
            };
            outputs[index][0].department_name = order.order_data.department;
            outputs[index][0].substitute_name =
                order.order_data.substitute_name === ""
                  ? ""
                  : order.order_data.substitute_name;
          }

          item_details_outputs[index] = [];
          if (current_item_details != undefined && current_item_details != null) {
            current_item_details.map(curItem => {
              var output = {};
               output = {
                  item_name:{
                    value: curItem.item_name,
                    type: 1,
                  },
                  value1:{
                    value: curItem.value1,
                    type: 1,
                  },
                  value2:{
                    value: curItem.value2,
                    type: 1,
                  },
                  classfic_name: curItem.classfic_name,
                  value1_format: curItem.value1_format,
                  value2_format: curItem.value2_format,
                }
                output.is_enabled = order.is_enabled;
              item_details_outputs[index].push(output);
            });
          }
        }
        outputs[index][0].history_show= true;
        outputs[index][0].number= order.number;
      });
    }
    return {
      tabs: changedVal,
      outputs: outputs,
      item_details: item_details,
      item_details_outputs
    };
  };

  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list, outputs} = this.state;
      history_list.find(x=>x.number == number).history_show = value;
      outputs.find(x=>x[0].number == number)[0].history_show = value;
      this.setState({
        history_list,
      });
    }
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
  getCheckSameOptions = (ele_order) => {
    if (ele_order == null || 
      ele_order == undefined || 
      ele_order.med == undefined || 
      ele_order.med == null || 
      ele_order.med.length < 1) {
      return;
    }
    let med = ele_order.med[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      ele_order.med.map(medi => {
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

        value[key] = ele_order.med[0][key];
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
  
  getTimeArray = (time_array) => {
    let new_array = [];
    time_array.map(item=>{
      if (item != "") new_array.push(item)
      else new_array.push("未定");
    });
    return new_array.join("、");
  }

  render() {
    const { closeModal } = this.props;
    const {history_list} = this.state;
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
    const karte_status_name= {
      1:'外来',
      2:'訪問診療',
      3:'入院',
    }
    return (
      <Modal show={true} size="lg" className="prescription_confirm_modal">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded == false ? (
            <Wrapper>
              <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            </Wrapper>
          ):(
            <Wrapper>
              {history_list == null || history_list.length == 0 && (
                <div>変更履歴がありません。</div>
              )}
              {history_list.length > 0 && (
                <>
                <div className="history-list">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th className="check"></th>
                        <th className="version">版数</th>
                        <th className="w-3">進捗</th>
                        <th className="w-5">診療科</th>
                        <th className="date">変更日時</th>
                        <th className="">変更者</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history_list !== undefined && history_list !== null && history_list.length > 0 &&
                        history_list.map((item, index) => {
                          let idx = history_list.length - index;
                          let doctor_change = false;
                          if (history_list[index + 1] !== undefined) {
                            if (item.order_data.order_data.doctor_name !== history_list[index + 1].order_data.order_data.doctor_name) doctor_change = true;
                          }
                          return (
                            <>
                              <tr>
                                <td className="text-center check">
                                  <Checkbox
                                    label=""
                                    getRadio={this.getRadio.bind(this, item.number)}
                                    value={item.history_show}
                                    name="check"
                                  />
                                </td>
                                <td className="version">
                                  {idx == 1 ? "初版" : parseInt(idx).toString() + "版"}
                                </td>
                                <td className="w-3">
                                  {item.is_enabled == 2 ? "削除" : (idx == 1 ? "新規" : "修正")}
                                </td>
                                <td className="w-5">
                                  {item.order_data.department}
                                </td>
                                <td className="date">
                                  {item.updated_at.split('-').join('/')}
                                </td>
                                <td className="text-left">
                                  <span className={doctor_change ? "text-blue":""}>{item.order_data.doctor_name}</span>
                                  {item.substitute_name !== undefined && item.substitute_name !== "" && (
                                    <span>、 入力者: {item.substitute_name}</span>
                                  )}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="history-content border">
                {Array.isArray(this.state.outputs) && this.state.outputs.length > 0 && this.state.outputs.map((output, output_index)=>{
                  if (output[0].history_show){                    
                    let doctor_name = "";
                    if (output[0].substitute_name !== "" && output[0].substitute_name != undefined) {
                      if (output[0].doctor_name.old != undefined && output[0].doctor_name.value != output[0].doctor_name.old) {
                        doctor_name = "<span>" + output[0].doctor_name.value + "、" + "</span>" + " 入力者: " + output[0].substitute_name;
                      } else {
                        doctor_name = output[0].doctor_name.value + "、" + " 入力者: " + output[0].substitute_name;
                      }
                    } else {
                      if (output[0].doctor_name.old != undefined && output[0].doctor_name.value != output[0].doctor_name.old) {
                        doctor_name = "<span>" + output[0].doctor_name.value + "</span>";
                      } else {                        
                        doctor_name = output[0].doctor_name.value;
                      }
                    }
                    return (
                      <>
                        <div className="content-header">
                          <span className="mr-3">{"（" + (output[0].version == 1 ? "初" : output[0].version) + "版）"}</span>
                          <span className="mr-3">{output[0].is_enabled == 2 ? "削除" : (output[0].version == 1 ? "新規" : "修正")}</span>
                          <span className="mr-3">{output[0].department_name}</span>
                          <span className="mr-3">{output[0].date.split('-').join('/')}</span>
                          <span className="mr-3 doctor-name-area">
                            {renderHTML(doctor_name)}
                          </span>
                        </div>
                        {this.props.category == "処方" && (
                          <>
                            {Array.isArray(output) && output.length > 0 && (
                              <TabContent  className={output[0].is_enabled==2?"deleted-order":""}>
                                <div className="row">
                                  <div className="unit" />
                                  <div className="content right">
                                    <ul>
                                      <li>
                                       {typeof output[0].karte_status.value !== "undefined" && output[0].karte_status.value !== "" && (
                                          <span className={ output[0].karte_status.type === 1 ? "blue": ""}>
                                            {karte_status_name[output[0].karte_status.value] }
                                          </span>
                                        )}
                                       {typeof output[0].order_title.value !== "undefined" && output[0].order_title.value !== "" && (
                                          <span className={ output[0].order_title.type === 1 ? "blue": ""}>
                                            ・{output[0].order_title.value}
                                          </span>
                                        )}
                                        </li>
                                        {(typeof output[0].karte_status.old !== "undefined" && output[0].karte_status.old !== "" && output[0].karte_status.type === -1) ||
                                         typeof output[0].order_title.old !== "undefined" && output[0].order_title.old !== "" && output[0].order_title.type === -1 ? (
                                          <li>
                                          <span className="deleted">{karte_status_name[output[0].karte_status.old] }・{output[0].order_title.old}</span>
                                          </li>                                    
                                        ):(<></>)}
                                    </ul>
                                  </div>
                                  <div className="unit" />
                                </div>
                              </TabContent>
                            )}
                            {Array.isArray(output) &&
                            output.length > 0 &&
                            output.map((order, index) => {
                              return (
                                <TabContent key={index} className={order.is_enabled==2?"deleted-order":""}>
                                  <div className="row">
                                    <div className="unit">Rp {index + 1}</div>
                                    <div className="content">
                                      {order.med.map((med, medIndex) => {
                                        return (
                                          <ul key={medIndex}>
                                            <li
                                              className={
                                                med.item_name.type === 1
                                                  ? "blue"
                                                  : med.item_name.type === -1 &&
                                                    med.item_name.old === undefined
                                                  ? "deleted"
                                                  : ""
                                              }
                                            >
                                              {med.item_name.value}
                                            </li>
                                            {med.item_name.type === -1 &&
                                              med.item_name.old && (
                                                <li className="deleted">{med.item_name.old}</li>
                                              )}
                                            {med.item_name.type === 0 &&
                                              med.amount.type === -1 &&
                                              med.amount.old && <li>&nbsp;</li>}

                                            {(med.can_generic_name.value === 1 ||
                                              med.is_not_generic.value === 1 ||
                                              med.separate_packaging.value === 1 ||
                                              med.milling.value === 1) && (
                                              <li className="right">
                                                {med.can_generic_name.value === 1 && (
                                                  <span
                                                    className={
                                                      med.can_generic_name.type === 1
                                                        ? "blue"
                                                        : ""
                                                    }
                                                  >
                                                    【{keyName.can_generic_name}】
                                                  </span>
                                                )}
                                                {med.is_not_generic.value === 1 && (
                                                  <span
                                                    className={
                                                      med.is_not_generic.type === 1
                                                        ? "blue"
                                                        : ""
                                                    }
                                                  >
                                                    【{keyName.is_not_generic}】
                                                  </span>
                                                )}
                                                {med.milling.value === 1 && (
                                                  <span
                                                    className={
                                                      med.milling.type === 1 ? "blue" : ""
                                                    }
                                                  >
                                                    【{keyName.milling}】
                                                  </span>
                                                )}
                                                {med.separate_packaging.value === 1 && (
                                                  <span
                                                    className={
                                                      med.separate_packaging.type === 1 ? "blue" : ""
                                                    }
                                                  >
                                                    【{keyName.separate_packaging}】
                                                  </span>
                                                )}                                                                                                
                                              </li>
                                            )}

                                            {((med.can_generic_name.old === 1 &&
                                              med.can_generic_name.type === -1) ||
                                              (med.is_not_generic.old === 1 &&
                                                med.is_not_generic.type === -1) ||
                                              (med.separate_packaging.old === 1 &&
                                                med.separate_packaging.type === -1) ||
                                              (med.milling.old === 1 &&
                                                med.milling.type === -1)) && (
                                              <li className="right">
                                                {med.can_generic_name.old === 1 &&
                                                  med.can_generic_name.type === -1 && (
                                                    <span className="deleted">
                                                      【{keyName.can_generic_name}】
                                                    </span>
                                                  )}
                                                {med.is_not_generic.old === 1 &&
                                                  med.is_not_generic.type === -1 && (
                                                    <span className="deleted">
                                                      【{keyName.is_not_generic}】
                                                    </span>
                                                  )}
                                                {med.milling.old === 1 &&
                                                  med.milling.type === -1 && (
                                                    <span className="deleted">
                                                      【{keyName.milling}】
                                                    </span>
                                                  )}
                                                {med.separate_packaging.old === 1 &&
                                                  med.separate_packaging.type === -1 && (
                                                    <span className="deleted">
                                                      【{keyName.separate_packaging}】
                                                    </span>
                                                  )}                                                
                                              </li>
                                            )}
                                            {Array.isArray(med.free_comment) &&
                                              med.free_comment.length > 0 &&
                                              med.free_comment.map((comment, ind) => {
                                                return (
                                                  <li
                                                    key={ind}
                                                    className={
                                                      comment.type === 1
                                                        ? "blue right"
                                                        : comment.type === -1
                                                        ? "deleted right"
                                                        : "right"
                                                    }
                                                  >
                                                    {comment.value}
                                                  </li>
                                                );
                                              })}
                                          </ul>
                                        );
                                      })}
                                    </div>
                                    <div className="unit right">
                                      {order.med.map((med, medIndex) => {
                                        return (
                                          <ul key={medIndex}>
                                            <li
                                              className={
                                                med.amount.type === 1
                                                  ? "blue"
                                                  : med.amount.type === -1 &&
                                                    med.amount.old === undefined
                                                  ? "deleted"
                                                  : ""
                                              }
                                            >
                                              {med.amount.value}
                                              {med.unit.value}
                                            </li>
                                            {med.amount.type === -1 && med.amount.old && (
                                              <li className="deleted">
                                                {med.amount.old}
                                                {med.unit.old}
                                              </li>
                                            )}
                                            {med.amount.type === 0 &&
                                              med.item_name.type === -1 &&
                                              med.item_name.old && <li>&nbsp;</li>}

                                            {(med.can_generic_name.value === 1 ||
                                              med.is_not_generic.value === 1 ||
                                              med.separate_packaging.value === 1 ||
                                              med.milling.value === 1) && <li>&nbsp;</li>}
                                            {((med.can_generic_name.old === 1 &&
                                              med.can_generic_name.type === -1) ||
                                              (med.is_not_generic.old === 1 &&
                                                med.is_not_generic.type === -1) ||
                                              (med.separate_packaging.old === 1 &&
                                                med.separate_packaging.type === -1) ||
                                              (med.milling.old === 1 &&
                                                med.milling.type === -1)) && <li>&nbsp;</li>}

                                            {Array.isArray(med.free_comment) &&
                                              med.free_comment.length > 0 &&
                                              med.free_comment.map((comment, ind) => {
                                                return (
                                                  <li
                                                    key={ind}
                                                    className={
                                                      comment.type === 1
                                                        ? "blue right"
                                                        : comment.type === -1
                                                        ? "deleted right"
                                                        : "right"
                                                    }
                                                  />
                                                );
                                              })}
                                          </ul>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="unit" />
                                    <div className="content right">
                                      <ul>
                                        <li
                                          className={
                                            order.usage_name.type === 1
                                              ? "blue"
                                              : order.usage_name.type === -1 &&
                                                order.usage_name.old === undefined
                                              ? "deleted"
                                              : ""
                                          }
                                        >
                                          用法: {order.usage_name.value}
                                        </li>
                                        {order.usage_name.type === -1 &&
                                          order.usage_name.old !== undefined && (
                                            <li className="deleted">
                                              用法: {order.usage_name.old}
                                            </li>
                                          )}
                                        {order.usage_name.type === 0 &&
                                          order.days.type === -1 &&
                                          order.days.old && <li>&nbsp;</li>}
                                      </ul>
                                    </div>
                                    <div className="unit right">
                                      <ul>
                                        {order.days.hidden === undefined && (
                                          <li
                                            className={
                                              order.days.type === 1
                                                ? "blue"
                                                : order.days.type === -1 &&
                                                  order.days.old === undefined
                                                ? "deleted"
                                                : ""
                                            }
                                          >
                                            {order.days.value > 0
                                              ? `${order.days.value}${order.days.new_suffix}`
                                              : ""}
                                          </li>
                                        )}
                                        {order.days.hidden === 1 && <li>&nbsp;</li>}
                                        {order.days.type === -1 &&
                                          order.days.hidden === undefined &&
                                          order.days.old !== undefined && (
                                            <li className="deleted">
                                              {order.days.old > 0
                                                ? `${order.days.old}${order.days.old_suffix}`
                                                : ""}
                                            </li>
                                          )}
                                        {order.days.type === 0 &&
                                          order.usage_name.type === -1 &&
                                          order.usage_name.old && <li>&nbsp;</li>}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="unit" />
                                    <div className="content right">
                                      <ul>                                        
                                        {(order.one_dose_package.value === 1 ||
                                          order.temporary_medication.value === 1 ||
                                          order.mixture.value === 1) && (
                                          <li className="right">
                                            {order.one_dose_package.value === 1 && (
                                              <span
                                                className={
                                                  order.one_dose_package.type === 1
                                                    ? "blue"
                                                    : ""
                                                }
                                              >
                                                【{keyName.one_dose_package}】
                                              </span>
                                            )}                                                
                                            {order.temporary_medication.value ===
                                              1 && (
                                              <span
                                                className={
                                                  order.temporary_medication.type ===
                                                  1
                                                    ? "blue"
                                                    : ""
                                                }
                                              >
                                                【{keyName.temporary_medication}】
                                              </span>
                                            )}                                                
                                            {order.mixture.value ===
                                              1 && (
                                              <span
                                                className={
                                                  order.mixture.type ===
                                                  1
                                                    ? "blue"
                                                    : ""
                                                }
                                              >
                                                【{keyName.mixture}】
                                              </span>
                                            )}
                                          </li> 
                                        )}
                                        {((order.one_dose_package.old === 1 &&
                                            order.one_dose_package.type === -1)  ||
                                          (order.temporary_medication.old === 1 &&
                                            order.temporary_medication.type === -1)  ||
                                          (order.mixture.old === 1 &&
                                            order.mixture.type === -1)) && (
                                          <li className="right">                                            
                                            {order.one_dose_package.old === 1 &&
                                              order.one_dose_package.type === -1 && (
                                                <span className="deleted">
                                                  【{keyName.one_dose_package}】
                                                </span>
                                              )}
                                            {order.temporary_medication.old === 1 &&
                                              order.temporary_medication.type === -1 && (
                                                <span className="deleted">
                                                  【{keyName.temporary_medication}】
                                                </span>
                                              )}
                                            {order.mixture.old === 1 &&
                                              order.mixture.type === -1 && (
                                                <span className="deleted">
                                                  【{keyName.mixture}】
                                                </span>
                                              )}
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                    <div className="unit" />
                                  </div>
                                  <div className="row">
                                    <div className="unit" />
                                    <div className="content right">
                                      <ul>
                                        {order.start_date.value !== undefined && (
                                          <li>
                                            <span
                                              className={
                                                order.start_date.type === 1 ? "blue" : ""
                                              }
                                            >
                                              {`処方開始日: ${formatJapanDateSlash(formatDate(order.start_date.value))}`}
                                            </span>
                                          </li>
                                        )}
                                        {order.one_dose_package.old !== undefined &&
                                          order.start_date.type === -1 && (
                                            <li>
                                              <span className="deleted">
                                                {`処方開始日: ${formatJapanDateSlash(formatDate(order.start_date.old))}`}
                                              </span>
                                            </li>
                                          )}
                                      </ul>
                                    </div>
                                    <div className="unit" />
                                  </div>
                                  <div className="row">
                                    <div className="unit" />
                                    <div className="content right">
                                      <ul>
                                        {order.insurance_type.value !== undefined && (
                                          <li>
                                            <span
                                              className={
                                                order.insurance_type.type === 1 ? "blue" : ""
                                              }
                                            >
                                              保険:{" "}
                                              {this.getInsurance(order.insurance_type.value)}
                                            </span>
                                          </li>
                                        )}
                                        {order.insurance_type.old !== undefined &&
                                          order.insurance_type.type === -1 && (
                                            <li>
                                              <span className="deleted">
                                                保険:{" "}
                                                {this.getInsurance(order.insurance_type.old)}
                                              </span>
                                            </li>
                                          )}
                                      </ul>
                                    </div>
                                    <div className="unit" />
                                  </div>
                                  <div className="row">
                                    <div className="unit" />
                                    <div className="content right">
                                      <ul>
                                        {order.body_part.value !== undefined &&
                                          order.body_part.value !== "" && (
                                            <li>
                                              <span
                                                className={
                                                  order.body_part.type === 1 ? "blue" : ""
                                                }
                                              >
                                                部位/補足: {order.body_part.value}
                                              </span>
                                            </li>
                                          )}
                                        {order.body_part.old !== undefined &&
                                          order.body_part.old !== "" &&
                                          order.body_part.type === -1 && (
                                            <li>
                                              <span className="deleted">
                                                部位/補足: {order.body_part.old}
                                              </span>
                                            </li>
                                          )}
                                      </ul>
                                    </div>
                                    <div className="unit" />
                                  </div>
                                  {order.administrate_period !== undefined && (
                                    <div className="row">
                                      <div className="unit" />
                                      <div className="content right">
                                        <ul>
                                          {order.administrate_period.value !== undefined &&
                                          order.administrate_period.value !== "" && (
                                            <li>
                                              <span
                                                className={
                                                  order.administrate_period.type === 1 ? "blue" : ""
                                                }
                                              >
                                                 投与期間 : {formatJapanDateSlash(order.administrate_period.value.period_start_date)}~{formatJapanDateSlash(order.administrate_period.value.period_end_date)}
                                                {order.administrate_period.value.period_type == 0 && order.administrate_period.value.period_category != null && (
                                                  <>
                                                    {"　"}間隔 : {order.administrate_period.value.period_category == 0 ? "日":order.administrate_period.value.period_category == 1 ? "週" : "月"}
                                                  </>
                                                )}
                                                {order.administrate_period.value.period_type == 1 && order.administrate_period.value.period_week_days.length > 0 && (
                                                  <>
                                                    {"　"}曜日 : {getWeekNamesBySymbol(order.administrate_period.value.period_week_days)}
                                                  </>
                                                )}
                                              </span>
                                            </li>
                                          )}
                                          {order.administrate_period.old !== undefined &&
                                          order.administrate_period.old !== "" &&
                                          order.administrate_period.type === -1 && (
                                            <li>
                                              <span className="deleted">
                                                投与期間 : {formatJapanDateSlash(order.administrate_period.old.period_start_date)}~{formatJapanDateSlash(order.administrate_period.old.period_end_date)}
                                                {order.administrate_period.old.period_type == 0 && order.administrate_period.old.period_category != null && (
                                                  <>
                                                    {"　"}間隔 : {order.administrate_period.old.period_category == 0 ? "日":order.administrate_period.old.period_category == 1 ? "週" : "月"}
                                                  </>
                                                )}
                                                {order.administrate_period.old.period_type == 1 && order.administrate_period.old.period_week_days.length > 0 && (
                                                  <>
                                                    {"　"}曜日 : {getWeekNamesBySymbol(order.administrate_period.old.period_week_days)}
                                                  </>
                                                )}
                                              </span>
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                      <div className="unit" />
                                    </div>
                                  )}
                                  {Array.isArray(order.usage_remarks_comment) &&
                                    order.usage_remarks_comment.length > 0 && (
                                      <div className="row">
                                        <div className="unit" />
                                        <div className="content right">
                                          <ul>
                                            {order.usage_remarks_comment.map(
                                              (comment, ind) => {
                                                return (
                                                  <li
                                                    key={ind}
                                                    className={
                                                      comment.type === 1
                                                        ? "blue right"
                                                        : comment.type === -1
                                                        ? "deleted right"
                                                        : "right"
                                                    }
                                                  >
                                                    {comment.value}
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </div>
                                        <div className="unit" />
                                      </div>
                                    )}
                                </TabContent>
                              );
                            })}
                            {Array.isArray(output) && output.length > 0 && (
                              <TabContent  className={output[0].is_enabled==2?"deleted-order":""}>
                                <div className="row">
                                  <div className="unit" />
                                  <div className="content right">
                                    <ul>                                    
                                      {output[0].med_consult.value === 1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].med_consult.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【お薬相談希望あり】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].med_consult.old === 1 &&
                                        output[0].med_consult.type === -1 && (
                                          <li>
                                            <span className="deleted">【お薬相談希望あり】</span>
                                          </li>
                                        )}

                                      {output[0].supply_med_info.value === 1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].supply_med_info.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【薬剤情報提供あり】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].supply_med_info.old === 1 &&
                                        output[0].supply_med_info.type === -1 && (
                                          <li>
                                            <span className="deleted">【薬剤情報提供あり】</span>
                                          </li>
                                        )}
                                      {(output[0].potion.value === 0 || output[0].potion.value === 1) && output[0].is_internal_prescription != undefined && output[0].is_internal_prescription.value == 5 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].potion.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            {output[0].potion.value === 0 ? "持参薬（自院）" : "持参薬（他院）"}
                                          </span>
                                        </li>
                                      )}
                                      {(output[0].potion.old === 0 || output[0].potion.old === 1) && output[0].is_internal_prescription != undefined && output[0].is_internal_prescription.value == 5 &&
                                        output[0].potion.type === -1 && (
                                          <li>
                                            <span className="deleted">{output[0].potion.old === 0 ? "持参薬（自院）" : "持参薬（他院）"}</span>
                                          </li>
                                        )}
                                      {typeof output[0].psychotropic_drugs_much_reason.value !== "undefined" &&
                                      output[0].psychotropic_drugs_much_reason
                                        .value !== "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0]
                                                .psychotropic_drugs_much_reason.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            向精神薬多剤投与理由:{" "}
                                            {
                                              output[0]
                                                .psychotropic_drugs_much_reason.value
                                            }
                                          </span>
                                        </li>
                                      )}
                                      {typeof output[0].psychotropic_drugs_much_reason.old !== "undefined" &&
                                      output[0].psychotropic_drugs_much_reason
                                        .old !== "" &&
                                        output[0].psychotropic_drugs_much_reason
                                          .type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              向精神薬多剤投与理由:{" "}
                                              {
                                                output[0]
                                                  .psychotropic_drugs_much_reason.old
                                              }
                                            </span>
                                          </li>
                                        )}
                                      {typeof output[0].poultice_many_reason.value !== "undefined" &&
                                      output[0].poultice_many_reason.value !==
                                        "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].poultice_many_reason.type ===
                                              1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            湿布薬超過投与理由:{" "}
                                            {output[0].poultice_many_reason.value}
                                          </span>
                                        </li>
                                      )}
                                      {typeof output[0].poultice_many_reason.old !== "undefined" &&
                                      output[0].poultice_many_reason.old !== "" &&
                                        output[0].poultice_many_reason.type ===
                                          -1 && (
                                          <li>
                                            <span className="deleted">
                                              湿布薬超過投与理由:{" "}
                                              {output[0].poultice_many_reason.old}
                                            </span>
                                          </li>
                                        )}
                                      {output[0].free_comment.value !== "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].free_comment.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            備考: {output[0].free_comment.value}
                                          </span>
                                        </li>
                                      )}
                                      {output[0].free_comment.old !== "" &&
                                        output[0].free_comment.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              備考: {output[0].free_comment.old}
                                            </span>
                                          </li>
                                        )}
                                    </ul>
                                  </div>
                                  <div className="unit" />
                                </div>
                              </TabContent>
                            )}
                          </>
                        )}
                        {this.props.category == "注射" && (
                          <>
                            {Array.isArray(output) &&
                              output.length > 0 &&
                              output.map((order, index) => {
                                return (
                                  <TabContent key={index} className={order.is_enabled==2?"deleted-order":""}>
                                    <div className="row">
                                      <div className="unit">Rp {index + 1}</div>
                                      <div className="content">
                                        {order.med.map((med, medIndex) => {
                                          return (
                                            <ul key={medIndex}>
                                              <li
                                                className={
                                                  med.item_name.type === 1
                                                    ? "blue"
                                                    : med.item_name.type === -1 &&
                                                      med.item_name.old === undefined
                                                    ? "deleted"
                                                    : ""
                                                }
                                              >
                                                {med.item_name.value}
                                              </li>
                                              {med.item_name.type === -1 &&
                                                med.item_name.old && (
                                                  <li className="deleted">{med.item_name.old}</li>
                                                )}
                                              {med.item_name.type === 0 &&
                                                med.amount.type === -1 &&
                                                med.amount.old && <li>&nbsp;</li>}

                                              {(med.can_generic_name.value === 1 ||
                                                med.is_not_generic.value === 1 ||
                                                med.separate_packaging.value === 1 ||
                                                med.milling.value === 1) && (
                                                <li className="right">
                                                  {med.can_generic_name.value === 1 && (
                                                    <span
                                                      className={
                                                        med.can_generic_name.type === 1
                                                          ? "blue"
                                                          : ""
                                                      }
                                                    >
                                                      【{keyName.can_generic_name}】
                                                    </span>
                                                  )}
                                                  {med.is_not_generic.value === 1 && (
                                                    <span
                                                      className={
                                                        med.is_not_generic.type === 1
                                                          ? "blue"
                                                          : ""
                                                      }
                                                    >
                                                      【{keyName.is_not_generic}】
                                                    </span>
                                                  )}
                                                  {med.milling.value === 1 && (
                                                    <span
                                                      className={
                                                        med.milling.type === 1 ? "blue" : ""
                                                      }
                                                    >
                                                      【{keyName.milling}】
                                                    </span>
                                                  )}
                                                  {med.separate_packaging.value === 1 && (
                                                    <span
                                                      className={
                                                        med.separate_packaging.type === 1 ? "blue" : ""
                                                      }
                                                    >
                                                      【{keyName.separate_packaging}】
                                                    </span>
                                                  )}
                                                </li>
                                              )}

                                              {((med.can_generic_name.old === 1 &&
                                                med.can_generic_name.type === -1) ||
                                                (med.is_not_generic.old === 1 &&
                                                  med.is_not_generic.type === -1) ||
                                                (med.separate_packaging.old === 1 &&
                                                  med.separate_packaging.type === -1) ||
                                                (med.milling.old === 1 &&
                                                  med.milling.type === -1)) && (
                                                <li className="right">
                                                  {med.can_generic_name.old === 1 &&
                                                    med.can_generic_name.type === -1 && (
                                                      <span className="deleted">
                                                        【{keyName.can_generic_name}】
                                                      </span>
                                                    )}
                                                  {med.is_not_generic.old === 1 &&
                                                    med.is_not_generic.type === -1 && (
                                                      <span className="deleted">
                                                        【{keyName.is_not_generic}】
                                                      </span>
                                                    )}
                                                  {med.milling.old === 1 &&
                                                    med.milling.type === -1 && (
                                                      <span className="deleted">
                                                        【{keyName.milling}】
                                                      </span>
                                                    )}
                                                  {med.separate_packaging.old === 1 &&
                                                    med.separate_packaging.type === -1 && (
                                                      <span className="deleted">
                                                        【{keyName.separate_packaging}】
                                                      </span>
                                                    )}
                                                </li>
                                              )}
                                              {Array.isArray(med.free_comment) &&
                                                med.free_comment.length > 0 &&
                                                med.free_comment.map((comment, ind) => {
                                                  return (
                                                    <li
                                                      key={ind}
                                                      className={
                                                        comment.type === 1
                                                          ? "blue right"
                                                          : comment.type === -1
                                                          ? "deleted right"
                                                          : "right"
                                                      }
                                                    >
                                                      {comment.value}
                                                    </li>
                                                  );
                                                })}
                                            </ul>
                                          );
                                        })}
                                      </div>
                                      <div className="unit right">
                                        {order.med.map((med, medIndex) => {
                                          return (
                                            <ul key={medIndex}>
                                              <li
                                                className={
                                                  med.amount.type === 1
                                                    ? "blue"
                                                    : med.amount.type === -1 &&
                                                      med.amount.old === undefined
                                                    ? "deleted"
                                                    : ""
                                                }
                                              >
                                                {med.amount.value}
                                                {med.unit.value}
                                              </li>
                                              {med.amount.type === -1 && med.amount.old && (
                                                <li className="deleted">
                                                  {med.amount.old}
                                                  {med.unit.old}
                                                </li>
                                              )}
                                              {med.amount.type === 0 &&
                                                med.item_name.type === -1 &&
                                                med.item_name.old && <li>&nbsp;</li>}

                                              {(med.can_generic_name.value === 1 ||
                                                med.is_not_generic.value === 1 ||
                                                med.separate_packaging.value === 1 ||
                                                med.milling.value === 1) && <li>&nbsp;</li>}
                                              {((med.can_generic_name.old === 1 &&
                                                med.can_generic_name.type === -1) ||
                                                (med.is_not_generic.old === 1 &&
                                                  med.is_not_generic.type === -1) ||
                                                (med.separate_packaging.old === 1 &&
                                                  med.separate_packaging.type === -1) ||
                                                (med.milling.old === 1 &&
                                                  med.milling.type === -1)) && <li>&nbsp;</li>}

                                              {Array.isArray(med.free_comment) &&
                                                med.free_comment.length > 0 &&
                                                med.free_comment.map((comment, ind) => {
                                                  return (
                                                    <li
                                                      key={ind}
                                                      className={
                                                        comment.type === 1
                                                          ? "blue right"
                                                          : comment.type === -1
                                                          ? "deleted right"
                                                          : "right"
                                                      }
                                                    />
                                                  );
                                                })}
                                            </ul>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="unit" />
                                      <div className="content right">
                                        <ul>
                                          <li
                                            className={
                                              order.usage_name.type === 1
                                                ? "blue"
                                                : order.usage_name.type === -1 &&
                                                  order.usage_name.old === undefined
                                                ? "deleted"
                                                : ""
                                            }
                                          >
                                            手技: {order.usage_name.value}
                                          </li>
                                          {order.usage_name.type === -1 &&
                                            order.usage_name.old !== undefined && (
                                              <li className="deleted">
                                                手技: {order.usage_name.old}
                                              </li>
                                            )}
                                          {order.usage_name.type === 0 &&
                                            order.days.type === -1 &&
                                            order.days.old && <li>&nbsp;</li>}
                                        </ul>
                                      </div>
                                      <div className="unit right">
                                        <ul>
                                          {order.days.hidden === undefined && (
                                            <li
                                              className={
                                                order.days.type === 1
                                                  ? "blue"
                                                  : order.days.type === -1 &&
                                                    order.days.old === undefined
                                                  ? "deleted"
                                                  : ""
                                              }
                                            >
                                              {order.days.value > 0
                                                ? `${order.days.value}${order.days.new_suffix}`
                                                : ""}
                                            </li>
                                          )}
                                          {order.days.hidden === 1 && <li>&nbsp;</li>}
                                          {order.days.type === -1 &&
                                            order.days.hidden === undefined &&
                                            order.days.old !== undefined && (
                                              <li className="deleted">
                                                {order.days.old > 0
                                                  ? `${order.days.old}${order.days.old_suffix}`
                                                  : ""}
                                              </li>
                                            )}
                                          {order.days.type === 0 &&
                                            order.usage_name.type === -1 &&
                                            order.usage_name.old && <li>&nbsp;</li>}
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="unit" />
                                      <div className="content right">
                                        <ul>
                                          {order.insurance_type.value !== undefined && (
                                            <li>
                                              <span
                                                className={
                                                  order.insurance_type.type === 1 ? "blue" : ""
                                                }
                                              >
                                                保険:{" "}
                                                {this.getInsurance(order.insurance_type.value)}
                                              </span>
                                            </li>
                                          )}
                                          {order.insurance_type.old !== undefined &&
                                            order.insurance_type.type === -1 && (
                                              <li>
                                                <span className="deleted">
                                                  保険:{" "}
                                                  {this.getInsurance(order.insurance_type.old)}
                                                </span>
                                              </li>
                                            )}
                                        </ul>
                                      </div>
                                      <div className="unit" />
                                    </div>
                                    <div className="row">
                                      <div className="unit" />
                                      <div className="content right">
                                        <ul>
                                          {order.body_part.value !== undefined &&
                                            order.body_part.value !== "" && (
                                              <li>
                                                <span
                                                  className={
                                                    order.body_part.type === 1 ? "blue" : ""
                                                  }
                                                >
                                                  部位/補足: {order.body_part.value}
                                                </span>
                                              </li>
                                            )}
                                          {order.body_part.old !== undefined &&
                                            order.body_part.old !== "" &&
                                            order.body_part.type === -1 && (
                                              <li>
                                                <span className="deleted">
                                                  部位/補足: {order.body_part.old}
                                                </span>
                                              </li>
                                            )}
                                        </ul>
                                      </div>
                                      <div className="unit" />
                                    </div>
                                    {order.administrate_period !== undefined && (
                                      <div className="row">
                                        <div className="unit" />
                                        <div className="content right">
                                          <ul>
                                            {order.administrate_period.value !== undefined &&
                                            order.administrate_period.value !== "" && (
                                              <li>
                                              <span
                                                className={
                                                  order.administrate_period.type === 1 ? "blue" : ""
                                                }
                                              >
                                                 投与期間 : {formatJapanDateSlash(order.administrate_period.value.period_start_date)}~{formatJapanDateSlash(order.administrate_period.value.period_end_date)}
                                                {order.administrate_period.value.period_type == 0 && order.administrate_period.value.period_category != null && (
                                                  <>
                                                    {"　"}間隔 : {order.administrate_period.value.period_category == 0 ? "日":order.administrate_period.value.period_category == 1 ? "週" : "月"}
                                                  </>
                                                )}
                                                {order.administrate_period.value.period_type == 1 && order.administrate_period.value.period_week_days.length > 0 && (
                                                  <>
                                                    {"　"}曜日 : {getWeekNamesBySymbol(order.administrate_period.value.period_week_days)}
                                                  </>
                                                )}
                                                {order.administrate_period.value.done_times !== undefined && order.administrate_period.value.done_times.length > 0 && (
                                                  <>
                                                    {"　"}時間 : {this.getTimeArray(order.administrate_period.value.done_times)}
                                                  </>
                                                )}
                                              </span>
                                              </li>
                                            )}
                                            {order.administrate_period.old !== undefined &&
                                            order.administrate_period.old !== "" &&
                                            order.administrate_period.type === -1 && (
                                              <li>
                                              <span className="deleted">
                                                投与期間 : {formatJapanDateSlash(order.administrate_period.old.period_start_date)}~{formatJapanDateSlash(order.administrate_period.old.period_end_date)}
                                                {order.administrate_period.old.period_type == 0 && order.administrate_period.old.period_category != null && (
                                                  <>
                                                    {"　"}間隔 : {order.administrate_period.old.period_category == 0 ? "日":order.administrate_period.old.period_category == 1 ? "週" : "月"}
                                                  </>
                                                )}
                                                {order.administrate_period.old.period_type == 1 && order.administrate_period.old.period_week_days.length > 0 && (
                                                  <>
                                                    {"　"}曜日 : {getWeekNamesBySymbol(order.administrate_period.old.period_week_days)}
                                                  </>
                                                )}
                                                {order.administrate_period.value.done_times !== undefined && order.administrate_period.value.done_times.length > 0 && (
                                                  <>
                                                    {"　"}時間 : {this.getTimeArray(order.administrate_period.value.done_times)}
                                                  </>
                                                )}
                                              </span>
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                        <div className="unit" />
                                      </div>
                                    )}
                                    {order.injectUsageName.value !== undefined && order.injectUsageName.value !== "" && (

                                      <div className="row">
                                        <div className="unit" />
                                        <div className="content right">
                                          <ul>
                                            <li
                                              className={
                                                order.injectUsageName.type === 1
                                                  ? "blue"
                                                  : order.injectUsageName.type === -1 &&
                                                    order.injectUsageName.old === undefined
                                                  ? "deleted"
                                                  : ""
                                              }
                                            >
                                              用法: {order.injectUsageName.value}
                                            </li>
                                            {order.injectUsageName.type === -1 &&
                                              order.injectUsageName.old !== undefined && (
                                                <li className="deleted">
                                                  用法: {order.injectUsageName.old}
                                                </li>
                                              )}                          
                                          </ul>
                                        </div>
                                        <div className="unit right">
                                          <ul>
                                            <li>&nbsp;</li>                                                  
                                          </ul>
                                        </div>
                                      </div>
                                    )}
                                    {Array.isArray(order.usage_remarks_comment) &&
                                      order.usage_remarks_comment.length > 0 && (
                                        <div className="row">
                                          <div className="unit" />
                                          <div className="content right">
                                            <ul>
                                              {order.usage_remarks_comment.map(
                                                (comment, ind) => {
                                                  return (
                                                    <li
                                                      key={ind}
                                                      className={
                                                        comment.type === 1
                                                          ? "blue right"
                                                          : comment.type === -1
                                                          ? "deleted right"
                                                          : "right"
                                                      }
                                                    >
                                                      {comment.value}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                          <div className="unit" />
                                        </div>
                                      )}                     
                                  </TabContent>
                                );
                              })}
                            {Array.isArray(output) && output.length > 0 && (
                              <TabContent className={output[0].is_enabled==2?"deleted-order":""}>
                                <div className="row">
                                  <div className="unit" />
                                  <div className="content right">
                                    <ul>
                                      {output[0].location_name.value != undefined && output[0].location_name.value != "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].location_name.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            実施場所: {output[0].location_name.value}
                                          </span>
                                        </li>
                                      )}
                                      {output[0].location_name.old != undefined && output[0].location_name.old != "" &&
                                        output[0].location_name.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              実施場所: {output[0].location_name.old}
                                            </span>
                                          </li>
                                        )}
                                      {output[0].drip_rate.value != undefined && output[0].drip_rate.value != "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].drip_rate.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            点滴速度: {output[0].drip_rate.value}ml/h
                                          </span>
                                        </li>
                                      )}
                                      {output[0].drip_rate.old != undefined && output[0].drip_rate.old != "" &&
                                        output[0].drip_rate.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              点滴速度: {output[0].drip_rate.old}ml/h
                                            </span>
                                          </li>
                                        )}
                                      {output[0].water_bubble.value != undefined && output[0].water_bubble.value != "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].water_bubble.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            1分あたり: {output[0].water_bubble.value}滴
                                          </span>
                                        </li>
                                      )}
                                      {output[0].water_bubble.old != undefined && output[0].water_bubble.old != "" &&
                                        output[0].water_bubble.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              1分あたり: {output[0].water_bubble.old}滴
                                            </span>
                                          </li>
                                        )}
                                      {output[0].exchange_cycle.value != undefined &&output[0].exchange_cycle.value != "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].exchange_cycle.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            交換サイクル: {output[0].exchange_cycle.value}時間
                                          </span>
                                        </li>
                                      )}
                                      {output[0].exchange_cycle.old != undefined && output[0].exchange_cycle.old != "" &&
                                        output[0].exchange_cycle.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              交換サイクル: {output[0].exchange_cycle.old}時間
                                            </span>
                                          </li>
                                        )}
                                      {output[0].require_time.value != undefined && output[0].require_time.value != "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].require_time.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            所要時間: {output[0].require_time.value}時間
                                          </span>
                                        </li>
                                      )}
                                      {output[0].require_time.old != undefined && output[0].require_time.old != "" &&
                                        output[0].require_time.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              所要時間: {output[0].require_time.old}時間
                                            </span>
                                          </li>
                                        )}
                                      
                                      {output[0].one_dose_package.value === 1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].one_dose_package.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【{keyName.one_dose_package}】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].one_dose_package.old === 1 &&
                                        output[0].one_dose_package.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              【{keyName.one_dose_package}】
                                            </span>
                                          </li>
                                        )}
                                      {output[0].temporary_medication.value ===
                                        1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].temporary_medication.type ===
                                              1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【{keyName.temporary_medication}】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].temporary_medication.old === 1 &&
                                        output[0].temporary_medication.type ===
                                          -1 && (
                                          <li>
                                            <span className="deleted">
                                              【{keyName.temporary_medication}】
                                            </span>
                                          </li>
                                        )}
                                      {output[0].mixture.value ===
                                        1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].mixture.type ===
                                              1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【{keyName.mixture}】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].mixture.old === 1 &&
                                        output[0].mixture.type ===
                                          -1 && (
                                          <li>
                                            <span className="deleted">
                                              【{keyName.mixture}】
                                            </span>
                                          </li>
                                        )}
                                      {output[0].med_consult.value === 1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].med_consult.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【お薬相談希望あり】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].med_consult.old === 1 &&
                                        output[0].med_consult.type === -1 && (
                                          <li>
                                            <span className="deleted">【お薬相談希望あり】</span>
                                          </li>
                                        )}

                                      {output[0].supply_med_info.value === 1 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].supply_med_info.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            【薬剤情報提供あり】
                                          </span>
                                        </li>
                                      )}
                                      {output[0].supply_med_info.old === 1 &&
                                        output[0].supply_med_info.type === -1 && (
                                          <li>
                                            <span className="deleted">【薬剤情報提供あり】</span>
                                          </li>
                                        )}
                                      {(output[0].potion.value === 0 || output[0].potion.value === 1) && output[0].is_internal_prescription != undefined && output[0].is_internal_prescription.value == 5 && (
                                        <li>
                                          <span
                                            className={
                                              output[0].potion.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            {output[0].potion.value === 0 ? "持参薬（自院）" : "持参薬（他院）"}
                                          </span>
                                        </li>
                                      )}
                                      {(output[0].potion.old === 0 || output[0].potion.old === 1) && output[0].is_internal_prescription != undefined && output[0].is_internal_prescription.value == 5 &&
                                        output[0].potion.type === -1 && (
                                          <li>
                                            <span className="deleted">{output[0].potion.old === 0 ? "持参薬（自院）" : "持参薬（他院）"}</span>
                                          </li>
                                        )}
                                      {output[0].free_comment.value !== "" && (
                                        <li>
                                          <span
                                            className={
                                              output[0].free_comment.type === 1
                                                ? "blue"
                                                : ""
                                            }
                                          >
                                            備考: {output[0].free_comment.value}
                                          </span>
                                        </li>
                                      )}
                                      {output[0].free_comment.old !== "" &&
                                        output[0].free_comment.type === -1 && (
                                          <li>
                                            <span className="deleted">
                                              備考: {output[0].free_comment.old}
                                            </span>
                                          </li>
                                        )}
                                    </ul>
                                  </div>
                                  <div className="unit" />
                                </div>
                              </TabContent>
                            )}
                          </>
                        )}
                        {Array.isArray(this.state.item_details_outputs[output_index]) &&
                          this.state.item_details_outputs[output_index].length > 0 &&
                          this.state.item_details_outputs[output_index].map((item, index) => {
                            if(item !== undefined && item != null){
                              return (
                                <TabContent key={index} className={item.is_enabled==2?"deleted-order item-details-tab":"item-details-tab"}>
                                    <div className="row">
                                        {index == 0 ? (
                                          <div className="unit">品名</div>
                                        ):(
                                          <div className="unit"></div>
                                        )}
                                        <div className="content">
                                          <ul>
                                            <li>
                                              {item.item_name.value !== undefined &&
                                              item.item_name.value != "" && (
                                                  <label className={item.item_name.type === 1 ? "blue" : item.item_name.old != undefined && item.item_name.old != "" && item.item_name.value != item.item_name.old ? "blue" : ""}>
                                                    ・{item.item_name.value}
                                                    {item.value1.value != undefined && item.value1.value != '' ? "：" : ""}
                                                  </label>
                                              )}
                                              {item.item_name.old !== undefined &&
                                              item.item_name.old !== "" &&
                                              item.item_name.type === -1 && (
                                                  <label className="deleted">
                                                    ・{item.item_name.old}
                                                    {item.value1.old != undefined && item.value1.old != '' ? "：" : ""}
                                                  </label>
                                              )}
                                              {item.value1.value !== undefined &&
                                                item.value1.value !== "" && (
                                                  <>
                                                    <label className={item.value1.type === 1 ? "blue" : item.value1.old != undefined && item.value1.old != "" && item.value1.value != item.value1.old ? "blue" : ""}>
                                                      {item.value1.value}
                                                    </label>
                                                  </>
                                                )}
                                              {item.value1.old !== undefined &&
                                                item.value1.old !== "" &&
                                                item.value1.type === -1 && (
                                                  <>
                                                    <label className="deleted">
                                                      {item.value1.old}
                                                    </label>
                                                  </>
                                                )}
                                              {item.value2.value !== undefined &&
                                                item.value2.value !== "" && (
                                                  <>
                                                    <label className={item.value2.type === 1 ? "blue" : item.value2.old != undefined && item.value2.old != "" && item.value2.value != item.value2.old ? "blue" : ""}>
                                                      {item.value2.value}
                                                    </label>
                                                  </>
                                                )}
                                              {item.value2.old !== undefined &&
                                                item.value2.old !== "" &&
                                                item.value2.type === -1 && (
                                                  <>
                                                    <label className="deleted">
                                                      {item.value2.old}
                                                    </label>
                                                  </>
                                                )}
                                            </li>
                                          </ul>
                                        </div>
                                    </div>
                                </TabContent>
                              );
                            }
                        })}

                      </>
                    )
                  }
                })}
                </div>
                </>
              )}
            </Wrapper>
          )}
        </Modal.Body>
        <Modal.Footer><Button className="cancel-btn ml-2" id='log_cancel_id' onClick={closeModal}>閉じる</Button></Modal.Footer>
      </Modal>
    );
  }
}
ChangeLogModal.contextType = Context;

ChangeLogModal.propTypes = {
  closeModal: PropTypes.func,
  orderNumber: PropTypes.number,
  keyName: PropTypes.object,
  insuranceTypeList: PropTypes.array,
  category: PropTypes.string
};

export default ChangeLogModal;
