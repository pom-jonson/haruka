import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import * as methods from "~/components/templates/Dial/DialMethods";
import {
  makeList_number,
  makeList_code,  
  sortTimingCodeMaster,
} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  float: left;
  .no-result {
    padding: 200px;
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .div-title {
    border-top: solid 1px gray;
    border-left: solid 1px gray;
    border-bottom: solid 1px gray;
    width: 20rem;
    padding-left:0.2rem;
  }
  .div-value {
    border-top: solid 1px gray;
    border-left: solid 1px gray;
    border-bottom: solid 1px gray;
    padding-left:0.2rem;
    word-break: break-all;
  }
  .right-border {
    border-right: solid 1px gray;
  }
`;

const dilution_timings = {
 0: { id: 0, value: "" },
1:{ id: 1, value: "前補液" },
2:  { id: 2, value: "後補液" },
};
const week_days = ['日', '月','火', '水', '木','金', '土'];
const SpinnerWrapper = styled.div`
  padding: 0;
`;

class DialScheduleDetailModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let dial_common_config = JSON.parse(
      window.sessionStorage.getItem("init_status")
    ).dial_common_config;
    this.pattern_unit = null;
    this.decimal_info = null;
    if (
      dial_common_config !== undefined &&
      dial_common_config != null
    ) {
      if (dial_common_config["単位名：透析パターン"] !== undefined) this.pattern_unit = dial_common_config["単位名：透析パターン"];
      if (dial_common_config["小数点以下桁数：透析パターン"] !== undefined) this.decimal_info = dial_common_config["小数点以下桁数：透析パターン"];
    }
    var schedule_date = this.props.schedule_date;
    var system_patient_id = this.props.system_patient_id;
    let default_array = this.getTelegramDefaultValue();

    this.state = {
      load_status: false,
      schedule_date,
      system_patient_id,
      default_array,
    };
    this.conditions = [
      {title:'曜日', key:'day'},
      {title:'時間帯', key:'time_zone'},
      {title:'ベッドNo', key:'bed_no'},
      {title:'コンソール', key:'console'},
      {title:'透析時間', key:'reservation_time'},
      {title:'開始予定時刻', key:'scheduled_start_time'},
      {title:'終了予定時刻', key:'scheduled_end_time'},
      {title:'グループ', key:'group'},
      {title:'グループ2', key:'group2'},
      {title:'DW', key:'dw'},
      {title:'治療法', key:'dial_method'},
      {title:'血流量', key:'blood_flow'},
      {title:'透析液流量', key:'dialysate_amount'},
      {title:'透析液温度', key:'degree'},
      {title:'透析液', key:'dial_liquid'},
      {title:'前補液/後補液の選択', key:'dilution_timing'},
      {title:'補液速度', key:'fluid_speed'},
      {title:'補液量', key:'fluid_amount'},
      {title:'補液温度', key:'fluid_temperature'},
      {title:'I-HDF 補液開始時間', key:'hdf_init_time'},
      {title:'I-HDF 1回補液量', key:'hdf_init_amount'},
      {title:'I-HDF 補液間隔', key:'hdf_step'},
      {title:'I-HDF 1回補液速度', key:'hdf_speed'},
      {title:'最大除水量', key:'max_drainage_amount'},
      {title:'最大除水速度', key:'max_drainage_speed'},
      {title:'穿刺針A', key:'puncture_needle_a'},
      {title:'穿刺針V', key:'puncture_needle_v'},
      {title:'固定テープ', key:'fixed_tape'},
      {title:'消毒液', key:'disinfection_liquid'},
      {title:'補液', key:'fluid'},
      {title:'補食', key:'supplementary_food'},
      {title:'風袋', key:'windbag_1'},
      {title:'風袋2', key:'windbag_2'},
      {title:'風袋3', key:'windbag_3'},
      {title:'備考', key:'list_note'},
    ];
  }

  async UNSAFE_componentWillMount() {
    let bed_master = sessApi.getObjectValue("dial_common_master", "bed_master");
    let console_master = sessApi.getObjectValue(
      "dial_common_master",
      "console_master"
    );
    let dial_method_master = sessApi.getObjectValue(
      "dial_common_master",
      "dial_method_master"
    );
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let material_master = sessApi.getObjectValue(
      "dial_common_master",
      "material_master"
    );
    let time_zones = getTimeZoneList();
    let examinationCodeData = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "examination_master"
    );
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    this.setState({
      time_zones: time_zones != undefined ? time_zones : [],
      bed_master,
      bed_master_number_list: makeList_number((bed_master)),
      console_master,
      console_master_code_list: makeList_code(console_master),
      dial_method_master,
      dial_method_master_code_list: makeList_code(dial_method_master),
      timingCodeData,      
      examination_codes: makeList_code(examinationCodeData),
      dial_group_codes: makeList_code(code_master["グループ"]),
      dial_group_codes2: makeList_code(code_master["グループ2"]),
      puncture_needle_a: makeList_code(material_master["穿刺針"], 1),
      puncture_needle_v: makeList_code(material_master["穿刺針"], 1),
      dialysates: makeList_code(material_master["透析液"], 1),
      disinfection_liquid: makeList_code(material_master["消毒薬"], 1),
      fixed_tape: makeList_code(material_master["固定テープ"], 1),
      examinationCodeData,
    });
    await this.getDialPattern()

    this.setState({ load_status: true });
  }

  async getDialPattern() {
    let path = "/app/api/v2/dial/pattern/getDialPatternDetail";
    const post_data = {
      system_patient_id: this.props.system_patient_id,
      schedule_date: this.props.schedule_date,
      patient_id: this.props.patientInfo.patient_number,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res) {
          this.setState({
            pattern_data: res,
          });
        }
      })
      .catch(() => {});
  }

  setDefaultValue = (dial_method = 0, change_flag = 0) => {
    let default_array = this.getTelegramDefaultValue(dial_method);
    let temp = this.state.schedule_item;
    if (
      default_array != undefined &&
      default_array != null &&
      Object.keys(default_array).length !== 0
    ) {
      Object.keys(default_array).map((index) => {
        let item = default_array[index];
        if (item.is_usable === 0) {
          if (
            index == "weight_before" ||
            index == "target_water_removal_amount"
          ) {
            temp[index] = "";
          } else if (
            index == "syringe_stop_time" ||
            index == "syringe_speed" ||
            index == "syringe_amount"
          ) {
            temp.dial_anti[index] = "";
          } else {
            temp.dial_pattern[index] = "";
          }
        }
      });
      let dial_pattern = temp.dial_pattern;
      if (this.props.add_flag) {
        if (default_array.dw.is_usable === 1) {
          if (
            (dial_pattern["dw"] === undefined || dial_pattern["dw"] === "") &&
            default_array.dw.default_value !== "" &&
            default_array.dw.default_value != null &&
            default_array.dw.default_value !== "0"
          ) {
            temp.dial_pattern["dw"] = parseFloat(
              default_array.dw.default_value
            ).toFixed(1);
          }
        } else {
          temp.dial_pattern["dw"] = "";
        }
        if (default_array.fluid_amount.is_usable === 1) {
          if (
            (dial_pattern["fluid_amount"] === undefined ||
              dial_pattern["fluid_amount"] === "") &&
            default_array.fluid_amount.default_value !== "" &&
            default_array.fluid_amount.default_value != null &&
            default_array.fluid_amount.default_value !== "0"
          ) {
            temp.dial_pattern["fluid_amount"] =
              default_array.fluid_amount.default_value;
          }
        } else {
          temp.dial_pattern["fluid_amount"] = "";
        }
        if (default_array.fluid_speed.is_usable === 1) {
          if (
            (dial_pattern["fluid_speed"] === undefined ||
              dial_pattern["fluid_speed"] === "") &&
            default_array.fluid_speed.default_value !== "" &&
            default_array.fluid_speed.default_value != null &&
            default_array.fluid_speed.default_value !== "0"
          ) {
            temp.dial_pattern["fluid_speed"] =
              default_array.fluid_speed.default_value;
          }
        } else {
          temp.dial_pattern["fluid_speed"] = "";
        }

        if (default_array.blood_flow.is_usable === 1) {
          if (
            (dial_pattern["blood_flow"] === undefined ||
              dial_pattern["blood_flow"] === "") &&
            default_array.blood_flow.default_value !== "" &&
            default_array.blood_flow.default_value != null &&
            default_array.blood_flow.default_value !== "0"
          ) {
            temp.dial_pattern["blood_flow"] =
              default_array.blood_flow.default_value;
          }
        } else {
          temp.dial_pattern["blood_flow"] = "";
        }
        if (default_array.degree.is_usable === 1) {
          if (
            (dial_pattern["degree"] === undefined ||
              dial_pattern["degree"] === "") &&
            default_array.degree.default_value !== "" &&
            default_array.degree.default_value != null &&
            default_array.degree.default_value !== "0"
          ) {
            temp.dial_pattern["degree"] = default_array.degree.default_value;
          }
        } else {
          temp.dial_pattern["degree"] = "";
        }
        if (default_array.fluid_temperature.is_usable === 1) {
          if (
            (dial_pattern["fluid_temperature"] === undefined ||
              dial_pattern["fluid_temperature"] === "") &&
            default_array.fluid_temperature.default_value !== "" &&
            default_array.fluid_temperature.default_value != null &&
            default_array.fluid_temperature.default_value !== "0"
          ) {
            temp.dial_pattern["fluid_temperature"] =
              default_array.fluid_temperature.default_value;
          }
        } else {
          temp.dial_pattern["fluid_temperature"] = "";
        }
        if (default_array.dialysate_amount.is_usable === 1) {
          if (
            (dial_pattern["dialysate_amount"] === undefined ||
              dial_pattern["dialysate_amount"] === "") &&
            default_array.dialysate_amount.default_value !== "" &&
            default_array.dialysate_amount.default_value != null &&
            default_array.dialysate_amount.default_value !== "0"
          ) {
            temp.dial_pattern["dialysate_amount"] =
              default_array.dialysate_amount.default_value;
          }
        } else {
          temp.dial_pattern["dialysate_amount"] = "";
        }
        if (default_array.hdf_init_time.is_usable === 1) {
          if (
            (dial_pattern["hdf_init_time"] === undefined ||
              dial_pattern["hdf_init_time"] === "") &&
            default_array.hdf_init_time.default_value !== "" &&
            default_array.hdf_init_time.default_value != null &&
            default_array.hdf_init_time.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_init_time"] =
              default_array.hdf_init_time.default_value;
          }
        } else {
          temp.dial_pattern["hdf_init_time"] = "";
        }
        if (default_array.hdf_init_amount.is_usable === 1) {
          if (
            (dial_pattern["hdf_init_amount"] === undefined ||
              dial_pattern["hdf_init_amount"] === "") &&
            default_array.hdf_init_amount.default_value !== "" &&
            default_array.hdf_init_amount.default_value != null &&
            default_array.hdf_init_amount.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_init_amount"] =
              default_array.hdf_init_amount.default_value;
          }
        } else {
          temp.dial_pattern["hdf_init_amount"] = "";
        }
        if (default_array.hdf_step.is_usable === 1) {
          if (
            (dial_pattern["hdf_step"] === undefined ||
              dial_pattern["hdf_step"] === "") &&
            default_array.hdf_step.default_value !== "" &&
            default_array.hdf_step.default_value != null &&
            default_array.hdf_step.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_step"] =
              default_array.hdf_step.default_value;
          }
        } else {
          temp.dial_pattern["hdf_step"] = "";
        }
        if (default_array.hdf_speed.is_usable === 1) {
          if (
            (dial_pattern["hdf_speed"] === undefined ||
              dial_pattern["hdf_speed"] === "") &&
            default_array.hdf_speed.default_value !== "" &&
            default_array.hdf_speed.default_value != null &&
            default_array.hdf_speed.default_value !== "0"
          ) {
            temp.dial_pattern["hdf_speed"] =
              default_array.hdf_speed.default_value;
          }
        } else {
          temp.dial_pattern["hdf_speed"] = "";
        }
        if (default_array.dilution_timing.is_usable === 1) {
          if (
            (dial_pattern["dilution_timing"] === undefined ||
              dial_pattern["dilution_timing"] === "") &&
            default_array.dilution_timing.default_value !== "" &&
            default_array.dilution_timing.default_value != null
          ) {
            temp.dial_pattern["dilution_timing"] =
              parseInt(default_array.dilution_timing.default_value) + 1;
          }
        } else {
          temp.dial_pattern["dilution_timing"] = 0;
        }
      }
    }
    if (change_flag != 0)
      this.change_flag = 1;
    this.setState({
      schedule_item: temp,
      default_array,
    });
  };

  onHide = () => {};

  convertDecimal = (_val, _digits) => {
      if (isNaN(parseFloat(_val))) return "";
      return parseFloat(_val).toFixed(_digits);
  };

  getValueFromMaster = (value, master_data) => {
    if (value == undefined || value == null || value == '') return '';
    if (master_data == undefined || master_data == null || master_data.length > 0) return '';
    let find_data = master_data.find(x=>x.number == value);
    if (find_data == undefined || find_data == null) return '';
    return find_data.value;
  }

  render() {
    let {pattern_data, time_zones, bed_master_number_list, console_master_code_list, dial_group_codes, dial_group_codes2, dial_method_master_code_list, puncture_needle_a,
    puncture_needle_v, fixed_tape, disinfection_liquid, dialysates} = this.state;
    let pattern_unit = this.pattern_unit;
    return (
      <Modal show={true} onHide={this.onHide} className="master-modal dial_condition_detail_modal first-view-modal">
        <Modal.Header>
          <Modal.Title>透析条件</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.load_status === false ? (
              <div className="spinner_area no-result">
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ) : (
              <div className='pattern-table'>
              {this.conditions.map((cond_item, cond_key)=>{
                return (
                  <div key={cond_key} className="div-row d-flex">
                    <div className='div-title'>
                    {cond_item.title} {pattern_unit[cond_item.key] != undefined && pattern_unit[cond_item.key] != null && pattern_unit[cond_item.key] != '' ? "（" + pattern_unit[cond_item.key]["value"] + "）" : ""  }
                    </div>
                    {pattern_data != undefined && pattern_data != null && pattern_data.length > 0 && pattern_data.map((item, index)=>{
                      let div_width = 80/pattern_data.length +"rem";
                      return (
                        <div key={index} className={(index == pattern_data.length - 1) ? "div-value right-border" : "div-value"} style={{width:div_width}}>
                        {item[cond_item.key] != undefined && item[cond_item.key] != null && item[cond_item.key] != '' && (
                          <>
                            {cond_item.key == 'day' && week_days[item[cond_item.key]] != undefined ? week_days[item[cond_item.key]] : '' }
                            {cond_item.key == 'time_zone' && time_zones[item[cond_item.key]] != undefined ? time_zones[item[cond_item.key]]['value'] : '' }
                            {cond_item.key == 'bed_no' && bed_master_number_list[item[cond_item.key]] != undefined ? bed_master_number_list[item[cond_item.key]] : '' }
                            {cond_item.key == 'console' && console_master_code_list[item[cond_item.key]] != undefined ? console_master_code_list[item[cond_item.key]] : '' }
                            {cond_item.key == 'group' && dial_group_codes[item[cond_item.key]] != undefined ? dial_group_codes[item[cond_item.key]]: '' }
                            {cond_item.key == 'group2' && dial_group_codes2[item[cond_item.key]] != undefined ? dial_group_codes2[item[cond_item.key]] : '' }
                            {cond_item.key == 'dial_method' && dial_method_master_code_list[item[cond_item.key]] != undefined ? dial_method_master_code_list[item[cond_item.key]] : '' }
                            {cond_item.key == 'dial_liquid' && dialysates[item[cond_item.key]] != undefined ? dialysates[item[cond_item.key]] : '' }
                            {cond_item.key == 'dilution_timing' && dilution_timings[item[cond_item.key]] != undefined ? dilution_timings[item[cond_item.key]]['value'] : '' }
                            {cond_item.key == 'puncture_needle_a' && puncture_needle_a[item[cond_item.key]] != undefined ? puncture_needle_a[item[cond_item.key]] : '' }
                            {cond_item.key == 'puncture_needle_v' && puncture_needle_v[item[cond_item.key]] != undefined ? puncture_needle_v[item[cond_item.key]] : '' }
                            {cond_item.key == 'fixed_tape' && fixed_tape[item[cond_item.key]] != undefined ? fixed_tape[item[cond_item.key]] : '' }
                            {cond_item.key == 'disinfection_liquid' && disinfection_liquid[item[cond_item.key]] != undefined ? disinfection_liquid[item[cond_item.key]] : '' }
                            {cond_item.key != 'day' && cond_item.key != 'time_zone' && cond_item.key != 'bed_no' && cond_item.key != 'console' && cond_item.key != 'group' && cond_item.key != 'group2' && 
                              cond_item.key != 'dial_method' && cond_item.key != 'dilution_timing' && cond_item.key != 'puncture_needle_a' && cond_item.key != 'puncture_needle_v' && cond_item.key != 'dial_liquid' &&
                              cond_item.key != 'fixed_tape' && cond_item.key != 'disinfection_liquid' ? item[cond_item.key] : ''}
                          </>
                        )}
                        {item[cond_item.key] === 0 && cond_item.key == 'day' && (
                          <>
                          {week_days[item[cond_item.key]] != undefined ? week_days[item[cond_item.key]] : '' }
                          </>
                        )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              </div>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>閉じる</span>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

DialScheduleDetailModal.contextType = Context;

DialScheduleDetailModal.propTypes = {
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  system_patient_id: PropTypes.number,
  schedule_date: PropTypes.string,
  add_flag: PropTypes.bool,
  patientInfo: PropTypes.object,
  history: PropTypes.object,
};

export default DialScheduleDetailModal;