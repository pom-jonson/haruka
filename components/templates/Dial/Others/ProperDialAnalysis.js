import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import DialSideBar from "../DialSideBar";
import Context from "~/helpers/configureStore";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DatePicker from "react-datepicker";
import {formatDateLine, formatJapanDate} from "../../../../helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
import SelectPannelModal from "../Common/SelectPannelModal";
import * as apiClient from "~/api/apiClient";
import ViewRangeSetModal from "~/components/templates/Dial/Others/ViewRangeSetModal";
import ProperDialAnalysisListPreview from "~/components/templates/Dial/Others/ProperDialAnalysisListPreview";
import Papa from "papaparse";
import encoding from "encoding-japanese";
import PropTypes from "prop-types";
import {Dial_tab_index, setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
    position: fixed;
    top: 0px;
    width: calc(100% - 390px);
    left: 200px;
    margin: 0px;
    height: 100vh;
    float: left;
    background-color: ${surface};
    padding: 1.25rem;
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .title {
        font-size: 2rem;
        padding-left: 0.5rem;
        border-left: solid 0.3rem #69c8e1;
    }
    .others {
      position:absolute;
      right:1.25rem;
      button {
          margin-left: 0.2rem;
          margin-bottom: 0px;
          margin-top: 0.3rem;
      }
      span {
          font-size: 1rem;
      }
    }
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .content-area {
        width: 100%;
        height: calc(100% - 15rem);
        margin-bottom:2rem;
        align-items: flex-start;
        justify-content: space-between;
        .left-area {
            width: 60%;
            height: 100%;
            .view-btn {
              align-items: flex-start;
              justify-content: space-between;
            }
            .graph-box:hover {
                background-color: #00ff9c !important;
            }
            .table-area {
                width: 100%;
                height: calc(100% - 30px);
                border:1px solid #aaa;
                .graph-area {
                    width: 95%;
                    height: 85%;
                    padding-top: 5%;
                    .value-line {
                        width:10%;
                        border-right:1px solid #aaa;
                    }
                    .graph-line {
                        width:6%;
                        height: 100%;
                        margin-left:6%;
                        margin-right:6%;
                    }
                }
                .graph-value{
                    height:10%;
                    width:95%;
                    .value-line {
                        width:10%;
                    }
                    .graph-line {
                        border-top:1px solid #aaa;
                        width:18%;
                        height: 100%;
                        text-align:center
                    }
                }
            }
        }
        .right-area {
            width: 35%;
            height: 100%;
            .table-area {
                width: 100%;
                height: calc(100% - 30px);
                border:1px solid #aaa;
                overflow-y: auto;
                .tr-row {
                    cursor:pointer;
                }
                .tr-row:hover {
                    background-color: #00ff9c;
                }
            }
        }
        table {
            width:100%;
            td {
                padding:0;
                padding-left: 0.2rem;
                padding-right: 0.2rem;
            }
        }
    }
    .footer {
        text-align: center;
        margin-top: 3rem;
        button {
            text-align: center;
            border-radius: 0.25rem;
            background: rgb(105, 200, 225);
            border: none;
            margin-right: 1rem;
        }
        span {
            color: white;
            font-size: 1rem;
            font-weight: 100;
        }
    }
    .div-title {
        line-height:30px;
        height: 30px;
    }
`;

const SearchPart = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    .select-exam {
        .exam-item {
            border:1px solid #aaa;
            width: 20rem;
            padding-left:5px;
            height: 30px;
            line-height: 30px;
            cursor:pointer;
        }
    }
    .select-dial-status {
        .radio-btn label {
            margin-bottom: 0px;
            width: 5rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            padding: 0px 0.3rem;
            font-size: 1.3rem;
            text-align: center;
            margin: 0 0.3rem;
        }
    }
    .select-period {
        width: 25rem;
        span{
            margin: 0px 0.625rem;
            line-height: 30px;
        }
        .cur-date {
          border: 1px solid #aaa;
          height: 30px;
          line-height: 30px;
          padding: 0 2px 0 2px;
          cursor:pointer;
        }
    }
    .select-group {
        .pullbox {
            .label-title {
                width: 0;
            }
            .pullbox-label {
                select {
                    width: 15rem;
                    height: 30px;
                }
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
    }
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
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
`;

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       patient_info,
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <>
            <li><div onClick={() =>parent.contextMenuAction(patient_info, "go_drkarte")}>Drカルテへ</div></li>
          </>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ProperDialAnalysis extends Component {
  constructor(props) {
    super(props);
    let code_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"code_master");
    this.dial_group_codes = [];
    this.dial_group_codes.push({id:0, value:"全て"});
    code_master['グループ'].map(dial_group=>{
      if(dial_group.is_enabled){
        this.dial_group_codes.push({id:dial_group.code, value:dial_group.name});
      }
    });
    this.state = {
      cur_exam_code:0,
      cur_exam_name:"",
      start_date:"",
      end_date:"",
      group_code:0,
      openSelectExamItem:false,
      dial_status:1,
      patient_list:[],
      view_mode:"graph",
      openViewRangeSet:false,
      range_data:null,
      openPreviewModal:false,
      openPreviewListModal:false,
      dial_group_codes: this.dial_group_codes
    }
  }
  
  async componentDidMount () {
    let server_time = await getServerTime();
    let cur_date = new Date(server_time);
    let cur_year = cur_date.getFullYear();
    let cur_month = cur_date.getMonth() + 1;
    let start_date = new Date(cur_year, cur_month - 1, 1);
    let end_date = new Date(cur_year, cur_month, 0);
    this.setState({
      start_date,
      end_date,
    });
  }
  
  searchPatientList=async()=>{
    if(this.state.cur_exam_code === 0){
      window.sessionStorage.setItem("alert_messages", "検査項目を選択してください。");
      return;
    }
    if((this.state.start_date == null || this.state.start_date === "") || (this.state.end_date == null || this.state.end_date === "")){
      window.sessionStorage.setItem("alert_messages", "分析機関を設定してください。");
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/search_examination_patient_list";
    let post_data = {
      start_date:formatDateLine(this.state.start_date),
      end_date:formatDateLine(this.state.end_date),
      examination_code:this.state.cur_exam_code,
      dial_status:this.state.dial_status,
      dial_group:this.state.group_code,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res.patient !== undefined && res.range == null  && (res.max !== res.min)){
          let interval = parseFloat((res.max - res.min)/5).toFixed(1);
          let range_data = {};
          range_data['range1_2'] = parseFloat(interval + res.min).toFixed(1);
          range_data['range2_1'] = range_data['range1_2'];
          range_data['range2_2'] = parseFloat(res.min + (interval *2)).toFixed(1);
          range_data['range3_1'] = range_data['range2_2'];
          range_data['range3_2'] = parseFloat(res.min + (interval *3)).toFixed(1);
          range_data['range4_1'] = range_data['range3_2'];
          range_data['range4_2'] = parseFloat(res.min + (interval *4)).toFixed(1);
          range_data['range5_1'] = range_data['range4_2'];
          res.range = range_data;
        }
        this.setState({
          patient_list:res.patient !== undefined ? res.patient : [],
          range_max:parseFloat(res.max),
          range_min:parseFloat(res.min),
          range_data:res.range,
        });
      })
      .catch(() => {
      })
  };
  
  setDialStatus = (e) => {
    this.setState({ dial_status: parseInt(e.target.value)}, ()=>{
      this.searchPatientList();
    })
  };
  
  setPeriod=(key,value)=>{
    if (key == 'start_date'){
      if (value.getTime() > this.state.end_date.getTime()){
        window.sessionStorage.setItem("alert_messages", '期間を正確に入力してください。');
        return;
      }
    }
    if (key == 'end_date'){
      if (value.getTime() < this.state.start_date.getTime()){
        window.sessionStorage.setItem("alert_messages", '期間を正確に入力してください。');
        return;
      }
    }
    this.setState({[key]:value}, ()=>{
      this.searchPatientList();
    })
  };
  
  getSelectGroup = e => {
    this.setState({group_code: parseInt(e.target.id)}, ()=>{
      this.searchPatientList();
    })
  };
  
  openSelectExamItem=()=>{
    this.setState({openSelectExamItem:true});
  };
  
  selectMaster=(item)=>{
    this.setState({
      cur_exam_code:item.code,
      cur_exam_name:item.name,
      openSelectExamItem:false,
    }, ()=>{
      this.searchPatientList();
    })
  };
  
  closeModal=()=>{
    this.setState({
      openSelectExamItem:false,
      openViewRangeSet:false,
      openPreviewModal:false,
      openPreviewListModal:false,
    });
  };
  
  getBackColor=(value, type=null)=>{
    let interval = 0;
    if(this.state.range_data == null){
      interval = parseFloat((this.state.range_max - this.state.range_min)/5).toFixed(1);
      if(this.state.range_max === this.state.range_min){
        interval = 0;
      }
      if(value <= (interval + this.state.range_min)){
        if(type == "string"){
          return "～"+(interval + this.state.range_min).toFixed(1);
        } else {
          return "rgb(151,243,247)";
        }
      }
      if(value <= (interval*2 + this.state.range_min)){
        if(type == "string"){
          return (interval + this.state.range_min).toFixed(1) + "～"+(interval*2 + this.state.range_min);
        } else {
          return "rgb(142,198,195)";
        }
      }
      if(value <= (interval*3 + this.state.range_min)){
        if(type == "string"){
          return (interval*2 + this.state.range_min).toFixed(1) + "～"+(interval*3 + this.state.range_min);
        } else {
          return "rgb(246,235,170)";
        }
      }
      if(value <= (interval*4 + this.state.range_min)){
        if(type == "string"){
          return (interval*3 + this.state.range_min).toFixed(1) + "～"+(interval*4 + this.state.range_min);
        } else {
          return "rgb(239,213,193)";
        }
      }
      if(type == "string"){
        return (interval*4 + this.state.range_min).toFixed(1) + "～";
      } else {
        return "rgb(232,223,234)";
      }
    } else {
      if(value <= parseFloat(this.state.range_data['range1_2'])){
        if(type == "string"){
          return parseFloat(this.state.range_data['range1_2']).toFixed(1) + "～";
        } else {
          return "rgb(151,243,247)";
        }
      }
      if((parseFloat(this.state.range_data['range2_1']) < value) && (value<= parseFloat(this.state.range_data['range2_2']))){
        if(type == "string"){
          return parseFloat(this.state.range_data['range1_2']).toFixed(1) + "～" + parseFloat(this.state.range_data['range2_2']).toFixed(1);
        } else {
          return "rgb(142,198,195)";
        }
      }
      if((parseFloat(this.state.range_data['range3_1']) < value) && (value<= parseFloat(this.state.range_data['range3_2']))){
        if(type == "string"){
          return parseFloat(this.state.range_data['range3_1']).toFixed(1) + "～" + parseFloat(this.state.range_data['range3_2']).toFixed(1);
        } else {
          return "rgb(246,235,170)";
        }
      }
      if((parseFloat(this.state.range_data['range4_1']) < value) && (value<= parseFloat(this.state.range_data['range4_2']))){
        if(type == "string"){
          return parseFloat(this.state.range_data['range4_1']).toFixed(1) + "～" + parseFloat(this.state.range_data['range4_2']).toFixed(1);
        } else {
          return "rgb(239,213,193)";
        }
      }
      if(parseFloat(this.state.range_data['range5_1']) <= value){
        if(type == "string"){
          return parseFloat(this.state.range_data['range5_1']).toFixed(1) + "～";
        } else {
          return "rgb(232,223,234)";
        }
      }
      return "";
    }
  };
  
  getClassName=(type, value)=>{
    let interval = 0;
    if(this.state.range_data == null){
      interval = parseFloat((this.state.range_max - this.state.range_min)/5).toFixed(1);
      if(this.state.range_max === this.state.range_min){
        interval = 0;
      }
      if(value <= (interval + this.state.range_min)){
        return type+"1-area";
      }
      if(value <= (interval*2 + this.state.range_min)){
        return type+"2-area";
      }
      if(value <= (interval*3 + this.state.range_min)){
        return type+"3-area";
      }
      if(value <= (interval*4 + this.state.range_min)){
        return type+"4-area";
      }
      return type+"5-area";
    } else {
      if(value <= parseFloat(this.state.range_data['range1_2'])){
        return type+"1-area";
      }
      if((parseFloat(this.state.range_data['range2_1']) < value) && (value<= parseFloat(this.state.range_data['range2_2']))){
        return type+"2-area";
      }
      if((parseFloat(this.state.range_data['range3_1']) < value) && (value<= parseFloat(this.state.range_data['range3_2']))){
        return type+"3-area";
      }
      if((parseFloat(this.state.range_data['range4_1']) < value) && (value<= parseFloat(this.state.range_data['range4_2']))){
        return type+"4-area";
      }
      if(parseFloat(this.state.range_data['range5_1']) <= value){
        return type+"5-area";
      }
      return "";
    }
  };
  
  getHeight=(range, position)=>{
    let all_count = this.state.patient_list.length;
    let range_count = 0;
    if(this.state.range_data == null){
      if(this.state.range_max === this.state.range_min){
        let color_height = 0;
        if(range == 1){
          color_height = (all_count/(((all_count/10)+1)*10))*100;
        }
        if(position === "up"){
          return (100 - color_height)+"%";
        } else if(position === "down"){
          return color_height+"%";
        } else {
          return range_count;
        }
      }
      let interval = parseFloat((this.state.range_max - this.state.range_min)/5).toFixed(1);
      let range_value= interval*parseInt(range) + this.state.range_min;
      this.state.patient_list.map(patient=>{
        if(range == 5){
          if(parseFloat(range_value - interval).toFixed(1) <= parseFloat(patient.value)){
            range_count++;
          }
        } else if(range == 1) {
          if(parseFloat(patient.value) <= range_value){
            range_count++;
          }
        } else {
          if((parseFloat(range_value - interval).toFixed(1) < parseFloat(patient.value)) && (parseFloat(patient.value) <= range_value)){
            range_count++;
          }
        }
      });
    } else {
      let range1_1= range == 1 ? 0 : this.state.range_data['range'+range+'_1'];
      let range1_2= range == 5 ? 0 : this.state.range_data['range'+range+'_2'];
      this.state.patient_list.map(patient=>{
        if(range == 5){
          if(parseFloat(range1_1) <= parseFloat(patient.value)){
            range_count++;
          }
        } else if(range == 1){
          if(parseFloat(patient.value) <= range1_2){
            range_count++;
          }
        } else {
          if((parseFloat(range1_1) < parseFloat(patient.value)) && (parseFloat(patient.value) <= range1_2)){
            range_count++;
          }
        }
      });
    }
    let top = (parseInt(all_count/10) + 1)*10;
    let color_height = (range_count/top)*100;
    if(position === "up"){
      return (100 - color_height)+"%";
    } else if(position === "down"){
      return color_height+"%";
    } else {
      return range_count;
    }
  };
  
  getRange=(range)=>{
    if(this.state.range_data == null){
      if(this.state.range_max === this.state.range_min){
        if(range == 1){
          return "～"+parseFloat((this.state.range_max)).toFixed(1);
        } else {
          return"";
        }
      }
      let interval = parseFloat((this.state.range_max - this.state.range_min)/5).toFixed(1);
      if(range == 1){
        let range_value = this.state.range_min + (interval * 1);
        return "～"+range_value.toFixed(1);
      }
      if(range == 2){
        let range_value = this.state.range_min + (interval * 1);
        return range_value.toFixed(1)+"～"+parseFloat(this.state.range_min + (interval *2)).toFixed(1);
      }
      if(range == 3){
        return parseFloat(this.state.range_min + (interval *2)).toFixed(1)+"～"+parseFloat(this.state.range_min + (interval *3)).toFixed(1);
      }
      if(range == 4){
        return parseFloat(this.state.range_min + (interval *3)).toFixed(1)+"～"+parseFloat(this.state.range_min + (interval *4)).toFixed(1);
      }
      if(range == 5){
        return parseFloat(this.state.range_min + (interval *4)).toFixed(1)+"～";
      }
    } else {
      if(range == 1){
        return "～"+parseFloat(this.state.range_data['range1_2']).toFixed(1);
      }
      if(range == 5){
        return parseFloat(this.state.range_data['range5_1']).toFixed(1)+"～";
      }
      return parseFloat(this.state.range_data['range'+range+'_1']).toFixed(1)+"～"+parseFloat(this.state.range_data['range'+range+'_2']).toFixed(1);
    }
  };
  
  getRangeCount=(range)=>{
    let all_count = this.state.patient_list.length;
    let range_count = 0;
    if(this.state.range_data == null){
      if(this.state.range_max === this.state.range_min){
        if(range == 1){
          return all_count;
        }
        return "";
      }
      let interval = parseFloat((this.state.range_max - this.state.range_min)/5).toFixed(1);
      let range_value= interval*parseInt(range) + this.state.range_min;
      this.state.patient_list.map(patient=>{
        if(range == 5){
          if(parseFloat(range_value - interval).toFixed(1) <= parseFloat(patient.value)){
            range_count++;
          }
        } else if(range == 1) {
          if(parseFloat(patient.value) <= range_value){
            range_count++;
          }
        } else {
          if((parseFloat(range_value - interval) < parseFloat(patient.value)) && (parseFloat(patient.value) <= range_value)){
            range_count++;
          }
        }
      });
    } else {
      let range1_1= range == 1 ? 0 : this.state.range_data['range'+range+'_1'];
      let range1_2= range == 5 ? 0 : this.state.range_data['range'+range+'_2'];
      this.state.patient_list.map(patient=>{
        if(range == 5){
          if(parseFloat(range1_1) <= parseFloat(patient.value)){
            range_count++;
          }
        } else if(range == 1){
          if(parseFloat(patient.value) <= range1_2){
            range_count++;
          }
        } else {
          if((parseFloat(range1_1) < parseFloat(patient.value)) && (parseFloat(patient.value) <= range1_2)){
            range_count++;
          }
        }
      });
    }
    return range_count === 0 ? "" : range_count;
  };
  
  getGraphLeft=()=>{
    let all_count = this.state.patient_list.length;
    let top = (parseInt(all_count/10) + 1)*10;
    let ret_html = [];
    if(parseInt(top%4) == 0){
      ret_html.push(
        <>
          <div style={{textAlign:"right", paddingRight:"0.3rem", height:"25%"}}>{top}人</div>
          <div style={{textAlign:"right", paddingRight:"0.3rem", height:"25%"}}>{top/4*3}人</div>
          <div style={{textAlign:"right", paddingRight:"0.3rem", height:"25%"}}>{top/2}人</div>
          <div style={{textAlign:"right", paddingRight:"0.3rem", height:"25%"}}>{top/4}人</div>
        </>
      )
    } else {
      ret_html.push(
        <>
          <div style={{textAlign:"right", paddingRight:"0.3rem", height:"50%"}}>{top}人</div>
          <div style={{textAlign:"right", paddingRight:"0.3rem", height:"50%"}}>{top/2}人</div>
        </>
      )
    }
    ret_html.push(
      <div style={{textAlign:"right", paddingRight:"0.3rem", marginTop:"-1rem"}}>{"0人"}</div>
    );
    return ret_html;
  };
  
  setViewMode=(type)=>{
    this.setState({view_mode:type})
  };
  
  openViewRangeSet=()=>{
    if(this.state.cur_exam_code === 0){
      window.sessionStorage.setItem("alert_messages", "検査項目を選択してください。");
      return;
    }
    this.setState({openViewRangeSet:true});
  };
  
  handleOk=(range_data)=>{
    this.setState({
      range_data,
      openViewRangeSet:false,
    });
  };
  
  openPreviewModal=(modal_type)=>{
    if (!(this.state.patient_list.length>0)) return;
    this.setState({
      openPreviewListModal:true,
      modal_type
    });
  };
  
  get_title_csv=async()=>{
    let title = "適正透析分析_";
    title = title + formatDateLine(this.state.start_date).split('-').join('') + "-";
    title = title + formatDateLine(this.state.end_date).split('-').join('');
    return title + ".csv";
  }
  
  download_csv=async()=> {
    if(this.state.patient_list.length > 0){
      let title = await this.get_title_csv();
      let data = [];
      let head_line = [];
      head_line.push(' ');
      head_line.push('患者番号');
      head_line.push('患者氏名');
      head_line.push('検査日');
      head_line.push(' ');
      data.push(head_line);
      this.state.patient_list.map(patient=>{
        let data_item = [];
        data_item.push(this.getBackColor(patient['value'], "string"));
        data_item.push(patient['patient_number']);
        data_item.push(patient['patient_name']);
        data_item.push(patient['examination_date'].split('-').join('/'));
        data_item.push(parseFloat(patient['value']).toFixed(2));
        data.push(data_item);
      })
      const config = {
        delimiter: ',', // 区切り文字
        header: true, // キーをヘッダーとして扱う
        newline: '\r\n', // 改行
      };
      
      const delimiterString = Papa.unparse(data, config);
      const strArray = encoding.stringToCode(delimiterString);
      const convertedArray = encoding.convert(strArray,'SJIS', 'UNICODE');
      const UintArray = new Uint8Array(convertedArray);
      const blobUrl = new Blob([UintArray], {type: 'text/csv'});
      const blob = blobUrl;
      const aTag = document.createElement('a');
      aTag.download = title;
      
      // 各ブラウザに合わせ、CSVをダウンロード
      if (window.navigator.msSaveBlob) {
        // for IE
        window.navigator.msSaveBlob(blob, aTag.download);
      } else if (window.URL && window.URL.createObjectURL) {
        // for Firefox
        aTag.href = window.URL.createObjectURL(blob);
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
      } else if (window.webkitURL && window.webkitURL.createObject) {
        // for Chrome
        aTag.href = (window.URL || window.webkitURL).createObjectURL(blob);
        
        aTag.click();
      } else {
        // for Safari
        window.open(
          `data:type/csv;base64,${window.Base64.encode(this.state.content)}`,
          '_blank'
        );
      }
    }
  };
  
  goOtherPage = (url) => {
    this.props.history.replace(url);
  };
  
  typeHover=(e, type, class_name)=>{
    this.removeHover(e, type);
    let class_obj = document.getElementsByClassName(class_name);
    if(class_obj !== undefined && class_obj != null && class_obj.length > 0){
      for (let i=0; i < class_obj.length; i++){
        class_obj[i].style['background-color'] = "#00ff9c";
      }
    }
  };
  
  removeHover=(e, type)=>{
    for (let index=1; index < 6; index++){
      let class_obj = document.getElementsByClassName(type+index+"-area");
      if(class_obj !== undefined && class_obj != null && class_obj.length > 0){
        for (let i=0; i < class_obj.length; i++){
          let back_color = class_obj[i].getAttribute("back-color");
          if(back_color !== undefined && back_color != null){
            class_obj[i].style['background-color'] = back_color;
          } else {
            class_obj[i].style['background-color'] = "";
          }
        }
      }
    }
  };
  
  handleClick=(e, patient_info)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: { visible: false }});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false },});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("patient-list")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("bed_area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX-200,
          y: e.clientY + window.pageYOffset,
        },
        patient_info,
      });
    }
  };
  
  contextMenuAction = (patient_info) => {
    sessApi.setObjectValue("from_print", "schedule_date", patient_info.examination_date);
    sessApi.setObjectValue("from_print", "system_patient_id", patient_info.system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
    this.props.history.replace("/dial/board/system_setting");
  };
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <Card>
          <div className='flex'>
            <div className="title">適正透析分析</div>
            <div className='others'>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/guideline")}>PとCaの治療指針</Button>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/GuidelineTSAT")}>フェリチンとTSATの治療指針</Button>
              <Button className="disable-button" style={{marginLeft:'1.5rem'}}>適正透析分析</Button>
            </div>
          </div>
          <SearchPart>
            <div className={'select-exam'}>
              <div className={'div-title'}>検査項目</div>
              <div className={'exam-item'} onClick={this.openSelectExamItem}>{this.state.cur_exam_name}</div>
            </div>
            <div className={'select-dial-status'}>
              <div className={'div-title'}> </div>
              <div className={'flex'}>
                <RadioButton
                  id={'dial_before'}
                  value={1}
                  label={'前'}
                  name="dial_status"
                  getUsage={this.setDialStatus}
                  checked={this.state.dial_status === 1}
                />
                <RadioButton
                  id={'dial_after'}
                  value={2}
                  label={'後'}
                  name="dial_status"
                  getUsage={this.setDialStatus}
                  checked={this.state.dial_status === 2}
                />
              </div>
            </div>
            <div className={'select-period'}>
              <div className={'div-title'}>分析期間</div>
              <div className={'flex'}>
                {this.state.start_date != "" && (
                  <>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.setPeriod.bind(this, 'start_date')}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                      customInput={<ExampleCustomInput />}
                    />
                    <span>～</span>
                    <DatePicker
                      locale="ja"
                      selected={this.state.end_date}
                      onChange={this.setPeriod.bind(this, 'end_date')}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                      customInput={<ExampleCustomInput />}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="select-group">
              <div className={'div-title'}>クループ</div>
              <SelectorWithLabel
                options={this.dial_group_codes}
                getSelect={this.getSelectGroup}
                departmentEditCode={this.state.group_code}
              />
            </div>
          </SearchPart>
          <div className={'content-area flex'}>
            <div className={'left-area'}>
              <div className={'view-btn flex'}>
                <div
                  className={'div-title'}
                  style={{cursor:"pointer", padding:"0 0.2rem", backgroundColor:this.state.view_mode === "graph" ? "#008eff" : "", color:this.state.view_mode === "graph" ? "white" : ""}}
                  onClick={this.setViewMode.bind(this, 'graph')}
                >棒グラフ</div>
                <div
                  className={'div-title'}
                  style={{cursor:"pointer", padding:"0 0.2rem", backgroundColor:this.state.view_mode === "data" ? "#008eff" : "", color:this.state.view_mode === "data" ? "white" : ""}}
                  onClick={this.setViewMode.bind(this, 'data')}
                >データを表示</div>
              </div>
              <div className={'table-area'}>
                {this.state.patient_list.length > 0 && this.state.view_mode === "graph" && (
                  <>
                    <div className={'graph-area flex'}>
                      <div className={'value-line'}>{this.getGraphLeft()}</div>
                      <div className={'graph-line'}>
                        <div style={{width:"100%",height:this.getHeight(1, 'up')}}> </div>
                        <div
                          style={{width:"100%",backgroundColor:"rgb(151,243,247)",height:this.getHeight(1, 'down')}}
                          className={'graph-box graph1-area'}
                          back-color="rgb(151,243,247)"
                          onMouseOver={e=>this.typeHover(e, "table", "table1-area")}
                          onMouseOut={e=>this.removeHover(e, "table")}
                        > </div>
                      </div>
                      <div className={'graph-line'}>
                        <div style={{width:"100%",height:this.getHeight(2, 'up')}}> </div>
                        <div
                          style={{width:"100%",backgroundColor:"rgb(142,198,195)",height:this.getHeight(2, 'down')}}
                          className={'graph-box graph2-area'}
                          back-color="rgb(142,198,195)"
                          onMouseOver={e=>this.typeHover(e, "table", "table2-area")}
                          onMouseOut={e=>this.removeHover(e, "table")}
                        > </div>
                      </div>
                      <div className={'graph-line'}>
                        <div style={{width:"100%",height:this.getHeight(3, 'up')}}> </div>
                        <div
                          style={{width:"100%",backgroundColor:"rgb(246,235,170)",height:this.getHeight(3, 'down')}}
                          className={'graph-box graph3-area'}
                          back-color="rgb(246,235,170)"
                          onMouseOver={e=>this.typeHover(e, "table", "table3-area")}
                          onMouseOut={e=>this.removeHover(e, "table")}
                        > </div>
                      </div>
                      <div className={'graph-line'}>
                        <div style={{width:"100%",height:this.getHeight(4, 'up')}}> </div>
                        <div
                          style={{width:"100%",backgroundColor:"rgb(239,213,193)",height:this.getHeight(4, 'down')}}
                          className={'graph-box graph4-area'}
                          back-color="rgb(239,213,193)"
                          onMouseOver={e=>this.typeHover(e, "table", "table4-area")}
                          onMouseOut={e=>this.removeHover(e, "table")}
                        > </div>
                      </div>
                      <div className={'graph-line'}>
                        <div style={{width:"100%",height:this.getHeight(5, 'up')}}> </div>
                        <div
                          style={{width:"100%",backgroundColor:"rgb(232,223,234)",height:this.getHeight(5, 'down')}}
                          className={'graph-box graph5-area'}
                          back-color="rgb(232,223,234)"
                          onMouseOver={e=>this.typeHover(e, "table", "table5-area")}
                          onMouseOut={e=>this.removeHover(e, "table")}
                        > </div>
                      </div>
                    </div>
                    <div className={'graph-value flex'}>
                      <div className={'value-line'}> </div>
                      <div className={'graph-line'}>
                        <div>{this.getRange(1)}</div>
                        <div>{this.getHeight(1, 'count')}人</div>
                      </div>
                      <div className={'graph-line'}>
                        <div>{this.getRange(2)}</div>
                        <div>{this.getHeight(2, 'count')}人</div>
                      </div>
                      <div className={'graph-line'}>
                        <div>{this.getRange(3)}</div>
                        <div>{this.getHeight(3, 'count')}人</div>
                      </div>
                      <div className={'graph-line'}>
                        <div>{this.getRange(4)}</div>
                        <div>{this.getHeight(4, 'count')}人</div>
                      </div>
                      <div className={'graph-line'}>
                        <div>{this.getRange(5)}</div>
                        <div>{this.getHeight(5, 'count')}人</div>
                      </div>
                    </div>
                  </>
                )}
                {this.state.patient_list.length > 0 && this.state.view_mode === "data" && (
                  <>
                    <table className="table-scroll table table-bordered">
                      <tr>
                        {this.getRange(1) !== "" && (
                          <td>{this.getRange(1)}</td>
                        )}
                        {this.getRange(2) !== "" && (
                          <td>{this.getRange(2)}</td>
                        )}
                        {this.getRange(3) !== "" && (
                          <td>{this.getRange(3)}</td>
                        )}
                        {this.getRange(4) !== "" && (
                          <td>{this.getRange(4)}</td>
                        )}
                        {this.getRange(5) !== "" && (
                          <td>{this.getRange(5)}</td>
                        )}
                      </tr>
                      <tr>
                        {this.getRange(1) !== "" && (
                          <td
                            style={{textAlign:"right"}}
                            className={'graph-box graph1-area'}
                            onMouseOver={e=>this.typeHover(e, "table", "table1-area")}
                            onMouseOut={e=>this.removeHover(e, "table")}
                          >{this.getRangeCount(1)}</td>
                        )}
                        {this.getRange(2) !== "" && (
                          <td
                            style={{textAlign:"right"}}
                            className={'graph-box graph2-area'}
                            onMouseOver={e=>this.typeHover(e, "table", "table2-area")}
                            onMouseOut={e=>this.removeHover(e, "table")}
                          >{this.getRangeCount(2)}</td>
                        )}
                        {this.getRange(3) !== "" && (
                          <td
                            style={{textAlign:"right"}}
                            className={'graph-box graph3-area'}
                            onMouseOver={e=>this.typeHover(e, "table", "table3-area")}
                            onMouseOut={e=>this.removeHover(e, "table")}
                          >{this.getRangeCount(3)}</td>
                        )}
                        {this.getRange(4) !== "" && (
                          <td
                            style={{textAlign:"right"}}
                            className={'graph-box graph4-area'}
                            onMouseOver={e=>this.typeHover(e, "table", "table4-area")}
                            onMouseOut={e=>this.removeHover(e, "table")}
                          >{this.getRangeCount(4)}</td>
                        )}
                        {this.getRange(5) !== "" && (
                          <td
                            style={{textAlign:"right"}}
                            className={'graph-box graph5-area'}
                            onMouseOver={e=>this.typeHover(e, "table", "table5-area")}
                            onMouseOut={e=>this.removeHover(e, "table")}
                          >{this.getRangeCount(5)}</td>
                        )}
                      </tr>
                    </table>
                  </>
                )}
              </div>
            </div>
            <div className={'right-area'}>
              <div className={'div-title'}>患者一覧</div>
              <div className={'table-area'} id={'patient-list'}>
                <table className="table-scroll table table-bordered">
                  {this.state.patient_list.length > 0 && (
                    this.state.patient_list.map(patient=>{
                      return (
                        <>
                          <tr
                            className={'tr-row '+this.getClassName("table", patient.value)}
                            onMouseOver={e=>this.typeHover(e, "graph", this.getClassName("graph", patient.value))}
                            onMouseOut={e=>this.removeHover(e, "graph")}
                            onContextMenu={e => this.handleClick(e, patient)}
                          >
                            <td style={{backgroundColor:this.getBackColor(patient.value), width:"30px"}}> </td>
                            <td className={'text-right'}>{patient.patient_number}</td>
                            <td>{patient.patient_name}</td>
                            <td className={'text-right'}>{parseFloat(patient.value).toFixed(2)}</td>
                          </tr>
                        </>
                      )
                    })
                  )}
                </table>
              </div>
            </div>
          </div>
          <div className="footer-buttons">
            <Button className="red-btn" onClick={this.openViewRangeSet}>表示範囲設定</Button>
            <Button className="red-btn" onClick={this.openPreviewModal.bind(this, 'data')}>帳票プレビュー（リスト）</Button>
            <Button className="red-btn" onClick={this.openPreviewModal.bind(this, 'graph')}>帳票プレビュー（グラフ）</Button>
            <Button className="red-btn" onClick={this.download_csv}>データ出力（CSV）</Button>
          </div>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            patient_info={this.state.patient_info}
          />
          {this.state.openSelectExamItem && (
            <SelectPannelModal
              selectMaster = {this.selectMaster}
              closeModal={this.closeModal}
              MasterName = {'検査項目'}
            />
          )}
          {this.state.openViewRangeSet && (
            <ViewRangeSetModal
              closeModal={this.closeModal}
              handleOk={this.handleOk}
              exam_name={this.state.cur_exam_name}
              exam_code={this.state.cur_exam_code}
              range_data={this.state.range_data}
            />
          )}
          {this.state.openPreviewListModal && (
            <ProperDialAnalysisListPreview
              closeModal={this.closeModal}
              table_data={this.state}
              start_date={formatDateLine(this.state.start_date)}
              end_date={formatDateLine(this.state.end_date)}
              modal_type={this.state.modal_type}
            />
          )}
        </Card>
      </>
    )
  }
}

ProperDialAnalysis.contextType = Context;
ProperDialAnalysis.propTypes = {
  history: PropTypes.object
};
export default ProperDialAnalysis