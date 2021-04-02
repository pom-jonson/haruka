import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import BigCheckbox from "../../../molecules/BigCheckbox";
import Button from "~/components/atoms/Button";
import { formatTimeIE } from "../../../../helpers/date";
import * as apiClient from "~/api/apiClient";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as methods from "~/components/templates/Dial/DialMethods";
import { makeList_code, Dial_tab_index, 
  compareTwoObjects
} from "~/helpers/dialConstants";
import { secondary600 } from "~/components/_nano/colors";

const Wrapper = styled.div`
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 1.25rem;
  height: calc(100vh - 15rem);
  text-align: center;
  margin-bottom: 0.625rem;
  float: left;
  text-align: left;
  font-size: 1.5rem;
  .border-div {
    border: solid 1px #ddd;
  }
  .blue-div {
    border: solid 1px rgb(105, 200, 225);
    color: rgb(105, 200, 225);
  }
  .blue-text {
    color: rgb(105, 200, 225);
    margin-left: 0.625rem;
  }
  .blue-label {
    p {
      color: rgb(105, 200, 225);
    }
  }
  .flex {
    display: flex;
  }
  .footer {
    display: flex;
    margin-top: 1.25rem;
    .btn-area {
      margin: auto;
    }
    button {
      text-align: center;
      border-radius: 0.25rem;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 1.875rem;
      span {
        color: white;
        font-size: 1.25rem;
        font-weight: bold
      }
    }
    button:hover {
      background-color: ${secondary600};
    }
  }
  .confirm-body {
    height: calc(100vh - 18.75rem);
    overflow-y: auto;
    overflow-x: hidden;
    .confirm-head {
      font-size: 1.75rem;
      display: flex;
    }
    .confirm-data {
      display: flex;
      padding-top: 0.625rem;
    }
    .left-width {
      width: 25%;
    }
    .right-width {
      width: 75%;
      padding-left: 0.3rem;
      line-height: 3rem;
      height: 3rem;
    }
    .right-width1 {
      width: 50%;
      padding-left: 0.3rem;
      line-height: 3rem;
      height: 3rem;
    }
    .right-width2 {
      width: 25%;
      padding-left: 0.625rem;
      line-height: 3rem;
      height: 3rem;
      font-size: 1rem;
    }
    .right-width3 {
      width: 20%;
      padding-left: 0.625rem;
      line-height: 3rem;
      height: 3rem;
    }
  }
`;

class BeforeConfirm extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      schedule_number: 0,
      is_patient_name: 0,
      is_dial_method: 0,
      is_dialiyzer: 0,
      is_anti: 0,
      is_puncture_needle_a: 0,
      is_puncture_needle_v: 0,
      is_fixed_tape: 0,
      is_disinfection_liquid: 0,
      confirm_date: "",
      confirm_man: "",
      is_loaded:true
    };
    this.prev_props = JSON.parse(JSON.stringify(this.props));
  }

  componentWillUnmount() {    

    var html_obj = document.getElementsByClassName("before_confirm_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }    
  }

  shouldComponentUpdate(nextprops, nextstate) {    
    nextprops = JSON.parse(JSON.stringify(nextprops));    
    if (compareTwoObjects(nextprops, this.prev_props) && compareTwoObjects(nextstate, this.state)) return false;
    this.prev_props = JSON.parse(JSON.stringify(nextprops));        
    return true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isConfirmComplete !== false) return;
    if (nextProps.end_dial_schedule == true) return;    
    let scheduleData = nextProps.schedule_data;
    
    // let check_values = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"check_values");
    if (scheduleData != undefined && scheduleData != null) {      
      if (scheduleData.pre_start_confirm_at != null && scheduleData.pre_start_confirm_by_name != null) {           
        // if (this.state.schedule_data != undefined){
        //   if (scheduleData.pre_start_confirm_at == this.state.schedule_data.pre_start_confirm_at 
        //     && scheduleData.pre_start_confirm_by_name == this.state.schedule_data.pre_start_confirm_by_name) return;
        // }
        // if (this.state.confirm_date == formatTimeIE(scheduleData.pre_start_confirm_at) && this.state.confirm_man == scheduleData.pre_start_confirm_by_name) return;
        sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 1);
        this.setState({
          schedule_data:scheduleData,
          schedule_number: scheduleData.number,
          confirm_date: formatTimeIE(scheduleData.pre_start_confirm_at),
          confirm_man: scheduleData.pre_start_confirm_by_name,
          is_patient_name: 1,
          is_dial_method: 1,
          is_dialiyzer: 1,
          is_anti: 1,
          is_puncture_needle_a: 1,
          is_puncture_needle_v: 1,
          is_fixed_tape: 1,
          is_disinfection_liquid: 1,
        });
      } else {
        // if (this.state.confirm_date == '' && this.state.confirm_man == '' && scheduleData.number == this.state.schedule_number) return;
        // if (this.state.is_patient_name | this.state.is_dial_method | this.state.is_dialiyzer | this.state.is_anti | this.state.is_puncture_needle_a 
        //   | this.state.is_puncture_needle_v | this.state.is_fixed_tape | this.state.is_disinfection_liquid == 1){          
            this.setState({
              is_patient_name: 0,
              is_dial_method: 0,
              is_dialiyzer: 0,
              is_anti: 0,
              is_puncture_needle_a: 0,
              is_puncture_needle_v: 0,
              is_fixed_tape: 0,
              is_disinfection_liquid: 0,

              schedule_data:scheduleData,
              schedule_number: scheduleData.number,
              confirm_date: "",
              confirm_man: "",
            })
            sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
          // }
      }
    } else {      
      this.setState({
        schedule_data:undefined,
        schedule_number:0,
        confirm_date: "",
        confirm_man: "",
        is_patient_name: 0,
        is_dial_method:0,
        is_dialiyzer:0,
        is_anti:0,
        is_puncture_needle_a:0,
        is_puncture_needle_v:0,
        is_fixed_tape:0,
        is_disinfection_liquid: 0,
      });
    }
  }

  componentDidMount() {    
    let check_values = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"check_values");
    let confirm_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"confirm_data");
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    var material_master = sessApi.getObjectValue("dial_common_master","material_master");
    this.setState({
      puncture_needle_a: makeList_code(material_master["穿刺針"], 1),
      puncture_needle_v: makeList_code(material_master["穿刺針"], 1),
      fixed_tape: makeList_code(material_master["固定テープ"], 1),
      disinfection_liquid: makeList_code(material_master["消毒薬"], 1),
      dialysates: makeList_code(material_master["透析液"], 1),
      schedule_number: schedule_data !== undefined && schedule_data != null? schedule_data.number:0,
      schedule_data,
    })
    if (schedule_data !== undefined && schedule_data != null && schedule_data.pre_start_confirm_at != null) {
      this.setState({
        confirm_date: formatTimeIE(schedule_data.pre_start_confirm_at),
        confirm_man: schedule_data.pre_start_confirm_by_name,
        is_patient_name: 1,
        is_dial_method: 1,
        is_dialiyzer: 1,
        is_anti: 1,
        is_puncture_needle_a: 1,
        is_puncture_needle_v: 1,
        is_fixed_tape: 1,
        is_disinfection_liquid: 1,
      });
      return;
    }
    if (confirm_data !== undefined && confirm_data != null && confirm_data.confirm_date != null && confirm_data.confirm_date !='') {
      this.setState({
        confirm_date: confirm_data.confirm_date,
        confirm_man: confirm_data.confirm_man,
        is_patient_name: 1,
        is_dial_method: 1,
        is_dialiyzer: 1,
        is_anti: 1,
        is_puncture_needle_a: 1,
        is_puncture_needle_v: 1,
        is_fixed_tape: 1,
        is_disinfection_liquid: 1,
      });
      return;
    }
    if (check_values !== undefined && check_values !== null) {
      this.setState({
        confirm_date: "",
        confirm_man: "",
        is_patient_name:
          check_values.is_patient_name !== undefined
            ? check_values.is_patient_name
            : 0,
        is_dial_method:
          check_values.is_dial_method !== undefined
            ? check_values.is_dial_method
            : 0,
        is_dialiyzer:
          check_values.is_dialiyzer !== undefined
            ? check_values.is_dialiyzer
            : 0,
        is_anti: check_values.is_anti !== undefined ? check_values.is_anti : 0,
        is_puncture_needle_a:
          check_values.is_puncture_needle_a !== undefined
            ? check_values.is_puncture_needle_a
            : 0,
        is_puncture_needle_v:
          check_values.is_puncture_needle_v !== undefined
            ? check_values.is_puncture_needle_v
            : 0,
        is_fixed_tape:
          check_values.is_fixed_tape !== undefined
            ? check_values.is_fixed_tape
            : 0,
        is_disinfection_liquid:
          check_values.is_disinfection_liquid !== undefined
            ? check_values.is_disinfection_liquid
            : 0,
      });
    }
  }

  getRadio = (name, value) => {
    if (this.props.patientInfo == undefined || this.props.patientInfo == null || this.props.patientInfo.patient_number == undefined) {
      return;
    }    
    let scheduleData = this.props.schedule_data;
    if (scheduleData.start_date != null || scheduleData.console_start_date != null) return;
    if (name === "patient_name") {
      this.setState({ is_patient_name: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "dial_method") {
      this.setState({ is_dial_method: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "dialiyzer") {
      this.setState({ is_dialiyzer: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "anti") {
      this.setState({ is_anti: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "puncture_needle_a") {
      this.setState({ is_puncture_needle_a: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "puncture_needle_v") {
      this.setState({ is_puncture_needle_v: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "fixed_tape") {
      this.setState({ is_fixed_tape: value }, () => {
        this.isAllCheck();
      });
    } else if (name === "disinfection_liquid") {
      this.setState({ is_disinfection_liquid: value }, () => {
        this.isAllCheck();
      });
    }
  };

  isAllCheck() {
    let check_values = {
      is_patient_name: this.state.is_patient_name,
      is_dial_method: this.state.is_dial_method,
      is_dialiyzer: this.state.is_dialiyzer,
      is_anti: this.state.is_anti,
      is_puncture_needle_a: this.state.is_puncture_needle_a,
      is_puncture_needle_v: this.state.is_puncture_needle_v,
      is_fixed_tape: this.state.is_fixed_tape,
      is_disinfection_liquid: this.state.is_disinfection_liquid,
    };
    if (
      this.state.is_patient_name &&
      this.state.is_dial_method &&
      this.state.is_dialiyzer &&
      this.state.is_anti &&
      this.state.is_puncture_needle_a &&
      this.state.is_puncture_needle_v &&
      this.state.is_fixed_tape &&
      this.state.is_disinfection_liquid
    ) {
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 1);
      this.setConfirm(true);
    } else {
      var ex_check_status = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check");
      sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check", 0);
      if (ex_check_status) this.setConfirm(false);
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "check_values", check_values);
  }

  async setConfirm(is_confirm = true) {
    let scheduleData = this.props.schedule_data;
    if (scheduleData == undefined || scheduleData == null) {
      return;
    }
    if (is_confirm){      
      if (this.state.confirm_date == "") {
        if (!(this.state.is_patient_name && this.state.is_dial_method && this.state.is_dialiyzer && this.state.is_anti &&
          this.state.is_puncture_needle_a && this.state.is_puncture_needle_v && this.state.is_fixed_tape && this.state.is_disinfection_liquid)) {
            return;
        }
        if (scheduleData.pre_start_confirm_at != "" && scheduleData.pre_start_confirm_by_name != "") {
          this.setState({
              confirm_date: formatTimeIE(scheduleData.pre_start_confirm_at),
              confirm_man: scheduleData.pre_start_confirm_by_name,
            }, () => {
              sessApi.setObjectValue( CACHE_SESSIONNAMES.DIAL_BOARD, "confirm_data", this.state );
            });
          return;
        }
        this.confirmPost(scheduleData, true);
      }
    } else {
      this.setState({
        confirm_date:'',
        confirm_man:''
      }, () => {
        sessApi.setObjectValue( CACHE_SESSIONNAMES.DIAL_BOARD, "confirm_data", this.state );
      })
      
      this.confirmPost(scheduleData, false);
    }
  }
  
  confirmPost = async (scheduleData, checked = true) => {
    var complete_message = checked?'登録中' :'取り消し中';

    
    let path = "/app/api/v2/dial/board/set_confirm_condition";
    const post_data = {
      number: scheduleData.number,
      uncheck:!checked
    };
    await apiClient._post(path, {params: post_data})
      .then((res) => {
        if (res) {
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          this.setState({
              confirm_date: (res.confirm_date != null && res.confirm_date != '')?formatTimeIE(res.confirm_date):'',
              confirm_man: (res.confirm_date != null && res.confirm_date != '')?authInfo.name:'',              
            }, () => {
              sessApi.setObjectValue( CACHE_SESSIONNAMES.DIAL_BOARD, "confirm_data", this.state);
              this.props.getSchedule(1, complete_message);                            
            }
          );
        }
      })
      .catch(() => {        
      })
  }

  tabChange = (type) => {
    if (type === "drainage") this.props.tabChange(Dial_tab_index.DrainageSet);
    else if (type === "hand_over") this.props.tabChange(Dial_tab_index.Sending);
  };

  render() {    
    let { schedule_data } = this.props;
    let is_started = schedule_data.start_date != null || schedule_data.console_start_date != null;
    let {
      puncture_needle_a,
      puncture_needle_v,
      fixed_tape,
      disinfection_liquid,
    } = this.state;
    // let all_checked = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check");
    return (      
      <Wrapper className="before_confirm_wrapper">
        <div className={`confirm-body`}>
          <div className={"flex"}>
            <div className={"left-width confirm-head"}>
              確認時間{" "}
              <div className={`blue-text`}> {this.state.confirm_date}</div>
            </div>
            <div className={"right-width confirm-head"}>
              確認者{" "}
              <div className={`blue-text`}> {this.state.confirm_man}</div>
            </div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_patient_name? "blue-label left-width ": "left-width"}>
              <BigCheckbox
                label="このベッドの患者は"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_patient_name}
                name="patient_name"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.patient_name != null && schedule_data.patient_name !== "" ) || is_started}
              />
            </div>
            <div className={this.state.is_patient_name? "blue-div right-width1": "right-width1 border-div"}>
              {schedule_data !== undefined && schedule_data.patient_name}
            </div>
            <div className={"right-width2"}>さんで間違いありませんか？</div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_dial_method? "blue-label left-width": "left-width"}>
              <BigCheckbox
                label="治療法"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_dial_method}
                name="dial_method"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.method_data !== undefined && schedule_data.dial_pattern !== undefined 
                  && schedule_data.method_data[schedule_data.dial_pattern.dial_method] !== "") || is_started}
              />
            </div>
            <div className={this.state.is_dial_method? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined && schedule_data.method_data !== undefined && schedule_data.dial_pattern !== undefined
                ? schedule_data.method_data[schedule_data.dial_pattern.dial_method]: " "}
            </div>
            {/*<div className={'right-width3'}>血液ポンプ速度</div>*/}
            {/*<div className={this.state.is_dial_method ? "blue-div right-width3" : "border-div right-width3"}>*/}
            {/*    {schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.blood_flow != null &&*/}
            {/*    schedule_data.dial_pattern.blood_flow != "" && schedule_data.dial_pattern.blood_flow+"ml/min"}*/}
            {/*</div>*/}
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_dialiyzer ? "blue-label left-width" : "left-width"}>
              <BigCheckbox
                label="ダイアライザ"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_dialiyzer}
                name="dialiyzer"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.dial_dialyzer !== undefined && schedule_data.dial_dialyzer !== null &&
                    schedule_data.dial_dialyzer[0] !== undefined && schedule_data.dial_dialyzer[0] !== null) || is_started}
              />
            </div>
            <div className={this.state.is_dialiyzer? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined &&
              schedule_data.dial_dialyzer !== undefined &&
              schedule_data.dial_dialyzer !== null &&
              schedule_data.dial_dialyzer[0] !== undefined &&
              schedule_data.dial_dialyzer[0] !== null
                ? schedule_data.dial_dialyzer[0].name
                : ""}
            </div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_anti ? "blue-label left-width" : "left-width"}>
              <BigCheckbox
                label="抗凝固剤"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_anti}
                name="anti"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null ) || is_started}
              />
            </div>
            <div className={this.state.is_anti? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null? schedule_data.dial_anti.title: ""}
            </div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_puncture_needle_a? "blue-label left-width": "left-width"}>
              <BigCheckbox
                label="穿刺針<動脈>"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_puncture_needle_a}
                name="puncture_needle_a"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.dial_pattern !== undefined && schedule_data.dial_pattern.puncture_needle_a != null &&
                    puncture_needle_a != null && puncture_needle_a[schedule_data.dial_pattern.puncture_needle_a] != null ) || is_started}
              />
            </div>
            <div className={this.state.is_puncture_needle_a? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined && schedule_data.dial_pattern !== undefined &&
              schedule_data.dial_pattern.puncture_needle_a != null && puncture_needle_a != null &&
              puncture_needle_a[schedule_data.dial_pattern.puncture_needle_a] !=null
                ? puncture_needle_a[schedule_data.dial_pattern.puncture_needle_a]: " "}
            </div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_puncture_needle_v? "blue-label left-width": "left-width"}>
              <BigCheckbox
                label="穿刺針<静脈>"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_puncture_needle_v}
                name="puncture_needle_v"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.dial_pattern !== undefined && puncture_needle_v != null &&
                    puncture_needle_v[schedule_data.dial_pattern.puncture_needle_v] != null) || is_started}
              />
            </div>
            <div className={this.state.is_puncture_needle_v? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined &&
              schedule_data.dial_pattern !== undefined &&
              schedule_data.dial_pattern.puncture_needle_v != null &&
              puncture_needle_v != null &&
              puncture_needle_v[schedule_data.dial_pattern.puncture_needle_v] !=null? puncture_needle_v[schedule_data.dial_pattern.puncture_needle_v]: " "}
            </div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_fixed_tape? "blue-label left-width": "left-width"}>
              <BigCheckbox
                label="固定テープ"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_fixed_tape}
                name="fixed_tape"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined && schedule_data.dial_pattern !== undefined && fixed_tape != null &&
                    fixed_tape[schedule_data.dial_pattern.fixed_tape] != null) || is_started}
              />
            </div>
            <div className={this.state.is_fixed_tape? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined && schedule_data.dial_pattern !== undefined &&
              schedule_data.dial_pattern.fixed_tape != null && fixed_tape != null &&
              fixed_tape[schedule_data.dial_pattern.fixed_tape] != null
                ? fixed_tape[schedule_data.dial_pattern.fixed_tape]
                : " "}
            </div>
          </div>
          <div className={"confirm-data"}>
            <div className={this.state.is_disinfection_liquid? "blue-label left-width": "left-width"}>
              <BigCheckbox
                label="消毒薬"
                getRadio={this.getRadio.bind(this)}
                value={this.state.is_disinfection_liquid}
                name="disinfection_liquid"
                isGroup={true}
                isDisabled={!(schedule_data !== undefined &&
                    schedule_data.dial_pattern !== undefined &&
                    schedule_data.dial_pattern.disinfection_liquid != null &&
                    disinfection_liquid != null && disinfection_liquid[schedule_data.dial_pattern.disinfection_liquid] != null ) || is_started}
              />
            </div>
            <div className={this.state.is_disinfection_liquid? "blue-div right-width": "border-div right-width"}>
              {schedule_data !== undefined &&
              schedule_data.dial_pattern !== undefined &&
              schedule_data.dial_pattern.disinfection_liquid != null &&
              disinfection_liquid != null &&
              disinfection_liquid[schedule_data.dial_pattern.disinfection_liquid] != null? disinfection_liquid[schedule_data.dial_pattern.disinfection_liquid]: " "}
            </div>
          </div>
        </div>        
        <div className="footer">
          <div className={"btn-area"}>
            <Button className={this.state.curFocus === 1 ? "focus" : ""} onClick={() => this.tabChange("hand_over")}>
              申し送り確認
            </Button>
            <Button onClick={() => this.tabChange("drainage")} className={this.state.curFocus === 1 ? "focus" : ""}>
              除水設定
            </Button>
          </div>
        </div>
      </Wrapper>
    );
  }
}

BeforeConfirm.contextType = Context;

BeforeConfirm.propTypes = {
  patientInfo: PropTypes.object,
  schedule_data: PropTypes.object,
  tabChange: PropTypes.func,
  getSchedule: PropTypes.func,
  isConfirmComplete:PropTypes.bool,
  get_generalInfo_flag:PropTypes.bool,
  end_dial_schedule:PropTypes.bool
};

export default BeforeConfirm;
