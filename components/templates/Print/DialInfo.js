import React, { Component } from "react";
import { Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { formatJapanDate, formatDateLine } from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialSideBar from "~/components/templates/Dial/DialSideBar";
import DialPatientNav from "~/components/templates/Dial/DialPatientNav";
import { makeList_code, getWeekday } from "~/helpers/dialConstants";
import * as methods from "~/components/templates/Dial/DialMethods";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import DialInfoPrintModal from "~/components/templates/Dial/Board/molecules/printSheets/DialInfoPrintModal";

const Wrapper = styled.div`
  position: fixed;
  top: 70px;
  height: calc(100vh - 100px);
  font-size: 14px;
  width: calc(100% - 390px);
  left: 200px;
  padding: 20px;
`;

const Card = styled.div`
  .header {
    margin-top: 10px;
  }
  .flex {
    display: flex;
  }
  .right_fixed {
    position: absolute;
    right: 30px;
    font-size: 18px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 25px;
  }
  .body {
    font-size: 1rem;
    max-height: calc(100vh - 15rem);
    overflow-y: auto;
  }
  .blog {
    border: 2px solid;
    margin-bottom: 5px;
  }
  .field {
    background: lightgray;
    width: 120px;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }
  .left-value {
    width: 120px;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }
  .value {
    width: calc(100% - 120px);
    border-bottom: 1px solid;
    border-right: 1px solid;
    padding-left: 10px;
    label {
      margin-right: 20%;
    }
  }
  .big-value {
    padding-left: 10px;
    height: 100px;
    overflow-y: scroll;
  }
  .big-value-field {
    border-top: 2px solid;
    border-right: 2px solid;
    border-left: 2px solid;
  }
  .big-field {
    background: lightgray;
    border-right: 1px solid;
  }
  .small-value {
    padding-left: 10px;
    width: calc(50% - 120px);
    border-bottom: 1px solid;
    border-right: 1px solid;
  }
  .anti-field {
    width: 20px;
    background: lightgray;
    border-bottom: 1px solid;
    border-right: 1px solid;
  }
  .anti-items {
    width: calc(100% - 20px);
    padding-left: 10px;
    border-bottom: 1px solid;
    border-right: 1px solid;
  }
  .shanto-left {
    border-right: 1px solid;
  }
  .inject-field {
    width: 50px;
    text-align: center;
    padding-top: 20px;
    background: lightgray;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }
  .inject-body {
    padding-left: 20px;
    border-right: 1px solid;
    border-bottom: 1px solid;
    width: 100%;
  }
  textarea {
    width: 100%;
  }
  .picture-area {
    margin-left: 4rem;
    img {
      width: 19rem;
    }
  }
  .footer {
    text-align: right;
    padding-right: 30px;
    font-size: 1.125rem;
    position: relative;
    bottom: 0px;
    right: 0px;
  }
`;
const week_days_arr = ["日","月","火","水","木","金","土"];
const week_days_arr_inject = ["月","火","水","木","金","土", "日"];
class DialInfo extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let injection_master = sessApi.getObjectValue(
      "dial_common_master",
      "injection_master"
    );
    let material_master = sessApi.getObjectValue(
      "dial_common_master",
      "material_master"
    );
    let dial_methodData = sessApi.getObjectValue(
      "dial_common_master",
      "dial_method_master"
    );
    let examinationCodeData = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "examination_master"
    );

    this.state = {
      examinationCodeData,
      examination_codes: makeList_code(examinationCodeData),
      puncture_needle_a: makeList_code(material_master["穿刺針"]),
      puncture_needle_v: makeList_code(material_master["穿刺針"]),
      dialysates: makeList_code(material_master["透析液"]),
      disinfection_liquid: makeList_code(material_master["消毒薬"]),
      fixed_tape: makeList_code(material_master["固定テープ"]),
      injection_master,
      injection_codeData: makeList_code(injection_master),
      infectionData: code_master["感染症"],
      diseaseData: code_master["原疾患"],
      infection_codeData: makeList_code(code_master["感染症"]),
      contraindicationData: code_master["禁忌薬（アレルギー）"],
      contraindication_codeData: makeList_code(
        code_master["禁忌薬（アレルギー）"]
      ),
      relationsData: code_master["家族歴"],
      relations_codeData: makeList_code(code_master["家族歴"]),
      insuranceData: code_master["保険区分"],
      insurance_codeData: makeList_code(code_master["保険区分"]),
      dial_methodData,
      dial_method_codeData: makeList_code(dial_methodData),
      VA_codes: makeList_code(code_master["VA名称"]),
      isOpenPrintModal: false,
      is_loaded: false,
      commnet: "",
      instruction: "",
      ctr_value: '',
    };
  }
  async UNSAFE_componentWillMount() {
    // await this.getStaffs();
    await this.getFacility();
    await this.getOtherFacilitiesInfo();
    this.setState({is_loaded:true})
  }
  componentDidMount () {}

  getOtherFacilitiesInfo = async()=> {
      let path = "/app/api/v2/dial/master/getOtherFacilitiesOrder";
      await apiClient._post(path, {params:{
        order:'name_kana'
      }})
      .then(res => {
        if (res != null && res.length > 0){
          this.setState({
            otherfacilities:res,
          })
        }
      })
      .catch(()=> {
        this.setState({
          otherfacilities:undefined,
          otherfacilities_options:undefined,
        })
      })
    }

  checkInfection(infection_data) {
    if (infection_data == null || infection_data.length == 0) return "";
    var result = {
      hbs_antigen: 0,
      hbs_antibody: 0,
      hcv_antibody: 0,
    };
    infection_data.map((item) => {
      if (
        this.state.infection_codeData[item.infrection_code] ==
        "ＨＢｓ抗原（＋）"
      )
        result.hbs_antigen = 1;
      if (
        this.state.infection_codeData[item.infrection_code] ==
        "ＨＢｓ抗体（＋）"
      )
        result.hbs_antibody = 1;
      if (
        this.state.infection_codeData[item.infrection_code] == "HCV抗体（＋）"
      )
        result.hcv_antibody = 1;
    });

    return result;
  }

  getComment = (e) => {
    this.setState({ comment: e.target.value });
  };

  getInstruction = (e) => {
    this.setState({ instruction: e.target.value });
  };

  getDialInfo = async () => {
    let patientInfo = sessApi.getObjectValue("dial_setting", "patient");
    if (patientInfo == undefined || patientInfo == null) {
      return;
    }
    this.setState({is_loaded: false})
    let path = "/app/api/v2/dial/common/getDialInfoDetail";
    let post_data = {
      params: { system_patient_id: patientInfo.system_patient_id },
    };
    await apiClient.post(path, post_data).then((res) => {
      this.setState({
        dial_data: res,
      });
    });
    path = "/app/api/v2/dial/medicine_information/heart/list";
    post_data = {
      params: { system_patient_id: patientInfo.system_patient_id,
      cur_date:formatDateLine(new Date()) },
    };
    await  apiClient.post(path, post_data).then((res) => {
      let ctr_value = '';
      if (res != null && res.length > 0){
        res.map(item=>{
          let ctr_data = item.chest_ratio;
          if (ctr_data != undefined && ctr_data != null && ctr_data != "" && ctr_value == "")
          ctr_value = ctr_data;
        })
      }
      this.setState({ctr_value});
    }).finally(()=>{
      this.setState({
        is_loaded: true
      })
    });
  };

  selectPatient = (patientInfo) => {
    this.setState({ patientInfo: patientInfo }, () => {
      this.getDialInfo();
    });
  };

  openPrintPreview = () => {
    if (this.state.patientInfo === undefined || this.state.patientInfo == null) {
      return;
    }
    this.setState({
      isOpenPrintModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      isOpenPrintModal: false,
    });
  };

  render() {    
    let facility =
      this.state.facilityInfo != undefined
        ? this.state.facilityInfo[0].ccorporation_name + "　" + this.state.facilityInfo[0].medical_institution_name
        : "";
    let facilityInfo = this.state.facilityInfo;
    let patientInfo = sessApi.getObjectValue("dial_setting", "patient");
    let dial_data = this.state.dial_data;
    var infection_status = "";
    if (dial_data != undefined)
      infection_status = this.checkInfection(dial_data.infection);

    let time_zones = getTimeZoneList();
    var week_days = [];
    var injection_week_days = [];
    var injection_array = [];
    var injection_day_array = {};
    if (dial_data != undefined && dial_data != null && dial_data.dial_pattern != null && dial_data.dial_pattern.cond_data.length > 0){
      dial_data.dial_pattern.cond_data.map(item => {
        week_days.push(week_days_arr[item.day]);
      })
    }
      
    if (
      dial_data != undefined &&
      dial_data != null &&
      dial_data.injection != null
    )
    if (dial_data.injection != null && dial_data.injection.length > 0) {
      dial_data.injection.map(item=>{
        injection_week_days = getWeekday(item.weekday);
        injection_week_days.map(day_item=>{
          let find_data = injection_array.find(x=>x.key == day_item);
          let injection_row = {}
          if (find_data != undefined && find_data.data_json != undefined) {
            let find_json = find_data.data_json;
            let cur_json = JSON.parse(item.data_json);
            let merge_json = find_json.concat(cur_json);
            let find_index = injection_array.findIndex(x=>x.key == day_item);
            injection_row = {key: day_item, data_json: merge_json};
            injection_array[find_index] = injection_row;
          } else {
            injection_row = {key: day_item, data_json: JSON.parse(item.data_json)};
            injection_array.push(injection_row);
          }

        })
      });
      injection_array.map(item=>{
        let find_keys = week_days_arr_inject.indexOf(item.key);
        if (find_keys >=0) {
          injection_day_array[find_keys] = item;
        }
      })
    }
    var genders = { 0: "", 1: "男", 2: "女" };
    var bloods = { 0: "A", 1: "B", 2: "O", 3: "AB", 4: "" };
    var primary_disease = '';
    if (patientInfo != undefined && patientInfo.primary_disease != '' && this.state.diseaseData != null && this.state.diseaseData.length > 0) {
      primary_disease = this.state.diseaseData.find(x=>x.code == patientInfo.primary_disease) ? this.state.diseaseData.find(x=>x.code == patientInfo.primary_disease).name : '';
    }
    var facility_name ='';
    if (patientInfo != undefined){
      facility_name = patientInfo.facility_name;
    }    
    let tooltip = '';
    if (this.state.patientInfo === undefined || this.state.patientInfo == null) {
      tooltip = "患者様を選択してください。";
    }

    var family_str = '';
    if (patientInfo != undefined && patientInfo.family != undefined && patientInfo.family.length > 0){
      patientInfo.family.map((item) => {
        if (item.is_alive == 1 && item.is_living_together == 1) {
          family_str += this.state.relations_codeData[item.relation] + ', ';          
        }
      })
      if (family_str != ''){
        family_str = family_str.substr(0, family_str.length -2);
      }
    }
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}          
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo} 
          history = {this.props.history}
        />
        <Wrapper>
          {/* <ComponentToPrint
            ref={(el) => (this.componentRef = el)}
            dial_data={this.state.dial_data}
          /> */}
          <Card>
            <>
              <div className="header flex">
                <div className="title">透析情報書</div>
                <div className="right_fixed">{facility}</div>
              </div>
              <div className="body flex">
                <Col md="6">
                  <div className="personal_info blog">
                    <div className="flex">
                      <div className="field">氏名</div>
                      <div className="value">
                        <label>
                          {patientInfo != undefined
                            ? patientInfo.patient_name
                            : ""}
                        </label>
                        <label>
                          {patientInfo != undefined
                            ? genders[patientInfo.gender]
                            : ""}
                        </label>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">生年月日</div>
                      <div className="value">
                        <label>
                          {patientInfo != undefined
                            ? formatJapanDate(patientInfo.birthday)
                            : ""}
                        </label>
                        <label>
                          {patientInfo != undefined
                            ? patientInfo.age + "才"
                            : ""}
                        </label>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">住所</div>
                      <div className="value">
                        {patientInfo != undefined
                          ? ((patientInfo.address != undefined ? patientInfo.address : "") + (patientInfo.building_name != undefined ? patientInfo.building_name : ""))
                          : ""}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">自宅TEL</div>
                      <div className="value">
                        {patientInfo != undefined &&
                        patientInfo.tel_number != null
                          ? patientInfo.tel_number
                          : ""}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">携帯番号</div>
                      <div className="value">
                        {patientInfo != undefined &&
                        patientInfo.mobile_number != null
                          ? patientInfo.mobile_number
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="live_info blog">
                    <div className="flex">
                      <div className="field">同居者</div>
                      <div className="value">{family_str}</div>
                    </div>
                  </div>
                  <div className="insurance_info blog">
                    <div className="flex">
                      <div className="field">介護保険</div>
                      <div className="value">
                        {patientInfo != undefined &&
                          patientInfo.insurance != null &&
                          this.state.insurance_codeData[
                            patientInfo.insurance.insurance_category_code
                          ]}
                        {patientInfo != undefined &&
                          patientInfo.insurance == null &&
                          "なし"}
                      </div>
                    </div>
                  </div>
                  <div className="infection_info blog">
                    <div className="flex">
                      <div className="field">血液型</div>
                      <div className="value">
                        {patientInfo != undefined &&
                        patientInfo.blood_type != null
                          ? bloods[patientInfo.blood_type] + "型"
                          : ""}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">HBs抗原</div>
                      <div className="small-value" style={{ fontSize: "22px" }}>
                        {infection_status != "" &&
                        infection_status["hbs_antigen"] == 1
                          ? "+"
                          : "-"}
                      </div>
                      <div className="field">HCV抗体</div>
                      <div className="small-value" style={{ fontSize: "22px" }}>
                        {infection_status != "" &&
                        infection_status["hcv_antibody"] == 1
                          ? "+"
                          : "-"}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">HBs抗体</div>
                      <div className="small-value" style={{ fontSize: "22px" }}>
                        {infection_status != "" &&
                        infection_status["hbs_antibody"] == 1
                          ? "+"
                          : "-"}
                      </div>
                      <div className="field">ワ&nbsp;&nbsp;&nbsp;氏</div>
                      <div
                        className="small-value"
                        style={{ fontSize: "22px" }}
                      ></div>
                    </div>
                  </div>
                  <div className="contraindication_info blog">
                    <div className="flex">
                      <div className="field" style={{letterSpacing:"-2px"}}>アレルギー・禁忌</div>
                      <div className="value">
                        {dial_data != undefined &&
                          dial_data.contraindication.length == 0 &&
                          "無し"}
                        {dial_data != undefined &&
                          dial_data.contraindication.length > 0 &&
                          dial_data.contraindication.map((item) => {
                            return (
                              <>
                                <div>
                                  {
                                    this.state.contraindication_codeData[
                                      item.contraindicant_code
                                    ]
                                  }
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <div className="disease_info blog">
                    <div className="flex">
                      <div className="field">原疾患</div>
                      <div className="value">
                        {primary_disease}
                      </div>
                    </div>
                  </div>
                  <div className="blog">
                    <div className="flex">
                      <div className="big-field" style={{paddingRight:"0.5rem"}}>
                        現病歴・既往歴・合併症・シャント歴
                      </div>
                      <div style={{ paddingLeft: "10px" }}>
                        診療情報提供書参照
                      </div>
                    </div>
                  </div>
                  <div className="blog">
                    <div className="flex">
                      <div className="field">導入日</div>
                      <div className="value">
                        {patientInfo != undefined
                          ? formatJapanDate(patientInfo.dial_start_date)
                          : ""}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">導入病院</div>
                      <div className="value">{facility_name}</div>
                    </div>
                  </div>
                  <div className="">
                    <div className="field big-value-field">他院受診</div>
                    <div className="big-value blog"></div>
                  </div>
                  <div className="">
                    <div className="field big-value-field">その他</div>
                    <div className="big-value blog"></div>
                  </div>
                  <div className="">
                    <div className="field big-value-field">コメント</div>
                    <div className="comment-area blog">
                      <textarea
                        onChange={this.getComment.bind(this)}
                        value={this.state.comment}
                      ></textarea>
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="blog">
                    <div className="flex">
                      <div className="field">HDクール</div>
                      <div className="value">
                        {week_days.length > 0 &&
                          week_days.map((item, index) => {
                            if (this.state.dial_method_codeData[dial_data.dial_pattern.cond_data[index].dial_method] == 'HD'){
                              return (
                                <>
                                  <label style={{ marginRight: "30px" }}>
                                    {item}&nbsp;
                                    {
                                      time_zones[dial_data.dial_pattern.cond_data[index].time_zone]
                                        .value
                                    }
                                    &nbsp;
                                    {dial_data.dial_pattern.cond_data[index].reservation_time}
                                  </label>
                                  <br/>
                                </>
                              );
                            }
                            
                          })}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="left" style={{ width: "100%" }}>
                        <div className="flex">
                          <div className="field">治療法</div>
                          <div className="value">
                            {dial_data != undefined && dial_data.dial_pattern != null && dial_data.dial_pattern.cond_data.length > 0 &&
                            dial_data.dial_pattern.cond_data.map(item => {
                              if (item.dial_method > 0){
                                return(
                                  <>
                                  <div>{this.state.dial_method_codeData[item.dial_method]}</div>
                                  </>
                                )                                
                              }
                            })}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="field">ダイアライザー</div>
                          <div className="value">
                            {dial_data != undefined &&
                            dial_data.dial_dialyzer != null
                              ? dial_data.dial_dialyzer.name
                              : ""}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="field">血流量</div>
                          <div className="value">
                            {dial_data != undefined && dial_data.dial_pattern != null && dial_data.dial_pattern.cond_data.length > 0 &&
                              dial_data.dial_pattern.cond_data.map(item => {
                                if (item.blood_flow > 0){
                                  return(
                                    <>
                                    <div>{item.blood_flow + " mL/min"}</div>
                                    </>
                                  )
                                }
                            })}                            
                          </div>
                        </div>
                        <div className="flex">
                          <div className="field">透析液</div>
                          <div className="value">
                            {dial_data != undefined && dial_data.dial_pattern != null && dial_data.dial_pattern.cond_data.length > 0 &&
                            dial_data.dial_pattern.cond_data.map(item => {
                              if (item.dial_liquid > 0){
                                return(
                                  <>
                                  <div>{this.state.dialysates[item.dial_liquid]}</div>
                                  </>
                                )
                              }
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="right flex" style={{ width: "100%" }}>
                        <div className="anti-field">抗凝固法</div>
                        <div className="anti-items">
                          {dial_data != undefined &&
                            dial_data.dial_anti != null && (
                              <div>
                                ■
                                {dial_data.dial_anti.name_short != ""
                                  ? dial_data.dial_anti.name_short
                                  : dial_data.dial_anti.title}
                              </div>
                            )}
                          {dial_data != undefined &&
                            dial_data.dial_anti != null &&
                            dial_data.dial_anti.anti_items.length > 0 &&
                            dial_data.dial_anti.anti_items.map((item) => {
                              return (
                                <>
                                  <div>
                                    ・{item.name}&nbsp;&nbsp;&nbsp;{item.amount} {item.unit}
                                  </div>
                                </>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">補液量</div>
                      <div className="small-value">
                        {dial_data != undefined && dial_data.dial_pattern != null && dial_data.dial_pattern.cond_data.length > 0 &&
                          dial_data.dial_pattern.cond_data.map(item => {
                            if (item.fluid_amount > 0){
                              return(
                                <>
                                <div>{item.fluid_amount + " L"}</div>
                                </>
                              )                              
                            }
                        })}                        
                      </div>
                      <div className="field">透析液流量</div>
                      <div className="small-value">
                      {dial_data != undefined && dial_data.dial_pattern != null && dial_data.dial_pattern.cond_data.length > 0 &&
                          dial_data.dial_pattern.cond_data.map(item => {
                            if (item.dialysate_amount > 0){
                              return(
                                <>
                                <div>{item.dialysate_amount + " mL/min"}</div>
                                </>
                              )                              
                            }
                        })}                        
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">ドライウェイト</div>
                      <div className="value">
                        {patientInfo != undefined &&
                        patientInfo != null &&
                        patientInfo.dw > 0
                          ? parseFloat(patientInfo.dw).toFixed(1) + " kg"
                          : ""}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="field">C&nbsp;&nbsp;T&nbsp;&nbsp;R</div>
                      <div className="value">{this.state.ctr_value != undefined && this.state.ctr_value != '' ? this.state.ctr_value + " %" : ""}</div>
                    </div>
                  </div>
                  <div className="blog">
                    <div className="flex">
                      <div className="field">透析室への入院</div>
                      <div className="small-value">独歩</div>
                      <div className="field">体重測定</div>
                      <div className="small-value">立位</div>
                    </div>
                  </div>
                  <div className="shanto-area flex blog" style={{background:'white'}}>
                    {dial_data != undefined && dial_data.VA != null && (
                      <>
                        <div className="shanto-left">
                          <div className="field">シャント部位</div>
                          <div className="va-title left-value">
                            {this.state.VA_codes[dial_data.VA.va_title_code]}
                          </div>
                          <div className="field">作成年月日</div>
                          <div className="left-value">
                            {formatJapanDate(dial_data.VA.date)}
                          </div>
                        </div>
                        <div className="shanto-right picture-area">
                          <img src={dial_data.VA.imgBase64} alt="" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="blog">
                    <div className="flex">
                      <div className="field">指示</div>
                      <div className="value" style={{paddingLeft:0}}>
                        <textarea
                          onChange={this.getInstruction.bind(this)}
                          value={this.state.instruction}
                          style={{height: "100%"}}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="field big-value-field">注射薬</div>
                    <div className="blog">
                    {Object.keys(injection_day_array).length > 0 && Object.keys(injection_day_array).map((index)=>{
                      let injection_week_day_item =  injection_day_array[index];
                      return (
                          <>
                            <div className="flex" key={index}>
                              <div className="inject-field">{injection_week_day_item.key}</div>
                              <div className="inject-body">
                                {injection_week_day_item.data_json.map((item) => {
                                  if (item != null && item.item_name != undefined && item.item_name != "") {
                                    return (
                                      <>
                                        <div>
                                          {item.item_name}&nbsp;&nbsp;
                                          {item.amount}
                                        </div>
                                      </>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          </>
                        );
                    })}
                    </div>
                  </div>
                  <div className="footer">
                    {facilityInfo != undefined && (
                      <>
                        <div>
                          {facility}&nbsp;&nbsp;&nbsp;&nbsp;TEL&nbsp;&nbsp;
                          {facilityInfo[0].phone_number}
                        </div>
                        <div className="address">
                          {facilityInfo[0].address_1}
                        </div>
                        <div className="address">
                          {facilityInfo[0].address_2}
                        </div>
                      </>
                    )}
                    <div className="record-date">
                      記入年月日&nbsp;&nbsp;{formatJapanDate(new Date())}
                    </div>
                  </div>
                </Col>
              </div>
            </>
          </Card>
          <div className="footer-buttons mt-1">
              <Button className={tooltip != '' ? 'disable-btn' : 'red-btn'} tooltip={tooltip != '' ? tooltip : ''} onClick={this.openPrintPreview}>帳票プレビュー</Button>
          </div>
          {this.state.isOpenPrintModal && (
            <DialInfoPrintModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              print_data={this.state}
              week_days={week_days}
              injection_week_days={injection_week_days}
              primary_disease={primary_disease}
              facility_name={facility_name}
              injection_array={injection_day_array}
              patientInfo={this.state.patientInfo}
            />
          )}
        </Wrapper>
      </>
    );
  }
}

DialInfo.contextType = Context;

DialInfo.propTypes = {
  patientInfo: PropTypes.object,
  history: PropTypes.object,
};

export default DialInfo;
