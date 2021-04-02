import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import NumericInputWithUnitLabel from "../../../../molecules/NumericInputWithUnitLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {formatTimeIE, formatDateLine, formatDateSlash, formatTimePicker, formatDateTimeIE, formatTime} from "~/helpers/date";
// import {formatTimeIE, formatDateLine, formatTimePicker, formatDateTimeIE} from "~/helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import axios from "axios/index";
import SelectorWithLabel from "../../../../molecules/SelectorWithLabel";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName, toHalfWidthOnlyNumber} from '~/helpers/dialConstants';
// import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
   height: 200px;
   display: flex;
   justify-content: center;
   align-items: center;
 `;
const Wrapper = styled.div`
  height: 100%;
  .table-area {
    margin: auto;
    font-size: 1rem;
    font-family: "Noto Sans JP", sans-serif;
    .table-header{
      border:1px solid #dee2e6;
      .menu {
        width: 3rem;
        padding: 0.25rem;
        border-right:1px solid #dee2e6;
        text-align: center;
        font-weight: 600;
      }
      .td-last {
        width: 17px;
        border-right: none;
      }
    }
    .table-body{
      border:1px solid #dee2e6;
      overflow-y: scroll;
      max-height: 57vh;
      .pullbox-title{
        width: 0px;
      }
      .pullbox-label{
        width: 100%;
      }
      .pullbox-select{
        width: 100%;
      }
      .text-check{
        label{
          margin-right: 0px;
          line-height: 38px;
          input{
            margin-right: 0px !important;
          }
        }
      }

      .td-number{
        .label-title{
          width: 0px;
          margin-right: 0px;
        }
        .label-unit{
          width: 0px;
          margin-left: 0px;
        }
        input{
          width: 100% !important;
        }
      }

      .div-tr {
        border-bottom:1px solid #dee2e6;
      }
      .div-td {
        border-right:1px solid #dee2e6;
        padding: 0.2rem;
        word-break: break-all;
        vertical-align: middle;
        div{margin-top:0;}
        input {
          // text-align: right;
          font-size: 1rem;
          width: 100%;
        }
        label{
          margin-bottom: 0px;
        }
        .react-datepicker-wrapper{
          height: 38px;
          input{
            height: 38px;
          }
        }
      }      
    }
    table {
        margin-bottom:0;
        // thead{
        //   display: table;
        //   width:100%;
        // }
        // tbody{
        //   height:52vh;
        //   overflow-y:hidden;
        //   display:block;
        // }
        tr{
          width: 100%;
          box-sizing: border-box;
        }
        td {
            padding: 0.25rem;
            text-align: left;
            position:relative;
            label{
                width:0px;
                margin-right:0px;
            }
            div{
                margin-top:0px;
            }
            .pullbox-title {
              width: 0;
              fone-size: 1rem;
            }
            .pullbox-select, .pullbox-label {
              width: 100%;
              margin-bottom: 0;
              height: 30px;
            }
            input {
              font-size: 1rem;
              ime-mode: inactive;
            }
            .react-numeric-input input {
              width: 5rem; !important;
              height: 30px;
            }
        }
        .tl {
            text-align: left;
        }
        .tr {
            text-align: right;
        }
        .text-check {
          width: 4rem;
          padding-right: 1.2rem;
          label {
            input {margin-right: 0}
          }
        }
        .text-select {
          .pullbox-select, .pullbox-label {
            max-width: 28rem;
          }
        }
        .text-date {
          width: 7.2rem;
        }
        .text-number {
          width: 6rem;
          .label-unit {
            margin-right: 0;
            margin-left: 0;
          }
        }
        .text-select1 {
          width: 10rem;
        }
        
        .react-datepicker__input-container{
            input{
                width: 6rem !important;
                font-size: 1rem;
                ime-mode: inactive;
                height: 30px;
            }
        }
     }
  }
 `;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
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
`;

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {row_index != undefined && row_index != null ? (<>
            <li><div onClick={() => parent.contextMenuAction(row_index,"register")}>追加</div></li>
            {parent.state.modal_data[row_index] !== undefined && parent.state.modal_data[row_index].number > 0 ? (<></>):(
              <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
            )}
          </>):(
            <li><div onClick={() => parent.contextMenuAction(row_index,"register")}>追加</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class OxygenCalculateModal extends Component {
  constructor(props) {
    super(props);    
    let modal_data = props.modal_data;
    var selected_oxygen_date = props.selected_oxygen_date;
    if (modal_data !== undefined && modal_data != null && modal_data.length > 0){
      modal_data = JSON.parse(JSON.stringify(modal_data));
      modal_data.map(item=>{
        item.number = item.number !== undefined && item.number != null ? item.number : 0;
        item.start_date = item.start_date != undefined && item.start_date != null ? new Date(item.start_date):null;
        if (selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != ''){
          item.start_date = selected_oxygen_date;
        }
        item.start_time = item.start_time != null ? formatTimePicker(item.start_time):null;
        item.end_time = item.end_time != null ? formatTimePicker(item.end_time):null;
      });
    } else {
      modal_data = [];
    }
    let oxygen_amount = this.calculateOxygen(modal_data);
    this.state = {
      modal_data,
      oxygen_amount,
      alert_messages:"",
      inhaler_options: [{id: 0, value: ""}],
      source_options: [{id: 0, value: "", main_unit: "", category_id: ""}],
      is_loaded:false
    }
    let {select_practice} = this.props;
    this.fio2_require = select_practice !== undefined && select_practice.oxygen_treatment_flag == 1 && select_practice.oxygen_ratio_flag == 1;
    this.blank_row = {
      order_flag: 1, 
      start_date: selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != '' ? selected_oxygen_date : null,
      start_time: null,
      start_time_value: "",
      end_time: null,
      end_time_value: "",
      oxygen_flow: "", 
      blood_flow: "", 
      density: "", 
      fio2_value: "", 
      rate: "",
      vt_value: "",
      oxygen_inhaler_id: 0,
      oxygen_inhaler_name: "",
      oxygen_source_code: 0,
      main_unit: "",
      category_id: "",
      oxygen_source_name: "",
      setted_steady_flow_rate: "",
    };  
    
    let current_date = selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != '' ? selected_oxygen_date : null
    var cur_date = new Date();
    if (current_date != null) {
      cur_date = current_date;
    }
    // var now = new Date(server_time);
    var now = new Date();
    cur_date.setHours(now.getHours());
    cur_date.setMinutes(now.getMinutes());
    cur_date.setSeconds(0);
    this.cur_date = cur_date;

    this.key_code = [];
    this.start_pos = [];
  }
  async componentDidMount(){
    let {modal_data} = this.state;
    let path = "/app/api/v2/master/oxygen/getOxygenMaster";
    let { data } = await axios.post(path);
    if (data.oxygen_inhaler_data !== undefined && data.oxygen_inhaler_data.length > 0) {
      let {inhaler_options} = this.state;
      data.oxygen_inhaler_data.map(item=>{
        inhaler_options.push({id:item.number, value: item.name});
      })
    }
    if (data.oxygen_source_list !== undefined && data.oxygen_source_list.length > 0) {
      let {source_options} = this.state;
      data.oxygen_source_list.map(item=>{
        source_options.push({id:item.haruka_code, value: item.name, main_unit: item.main_unit, category_id: item.treat_item_category_id});
      })
    }

    let blank_row = {
      order_flag: 1, 
      start_date: this.props.selected_oxygen_date != undefined && this.props.selected_oxygen_date != null && this.props.selected_oxygen_date != '' ? this.props.selected_oxygen_date : null,
      start_time: null,
      start_time_value: "",
      end_time: null,
      end_time_value: "",
      oxygen_flow: "", 
      blood_flow: "", 
      density: "", 
      fio2_value: "", 
      rate: "",
      vt_value: "",
      oxygen_inhaler_id: 0,
      oxygen_inhaler_name: "",
      oxygen_source_code: 0,
      main_unit: "",
      category_id: "",
      oxygen_source_name: "",
      setted_steady_flow_rate: "",
    };

    if (modal_data === undefined || modal_data == null || modal_data.length == 0) {
      modal_data.push(blank_row);
    }    
    modal_data.sort(this.compare);
    if (modal_data[modal_data.length - 1]['start_time'] != null && modal_data[modal_data.length - 1]['end_time'] != null && modal_data[modal_data.length - 1]['oxygen_flow'] != "") {
      if (modal_data[modal_data.length - 1]['oxygen_inhaler_id'] != "" && modal_data[modal_data.length - 1]['oxygen_inhaler_name'] != "") {
        blank_row.oxygen_inhaler_name = modal_data[modal_data.length - 1]['oxygen_inhaler_name'];
        blank_row.oxygen_inhaler_id = modal_data[modal_data.length - 1]['oxygen_inhaler_id'];
      }
      modal_data.push(blank_row);
    }
    let oxygen_amount = this.calculateOxygen(modal_data);
    this.setState({modal_data, oxygen_amount, is_loaded: true});
  }
  compare ( a, b ) {
    if (a.start_date <= b.start_date && a.start_time < b.start_time ){
      return -1;
    }
    if (a.start_date >= b.start_date && a.start_time > b.start_time ){
      return 1;
    }
    return 0;
  }
  
  getValue = (key, index, value) => {
    if (key == "end_time") {
      if (formatTimeIE(value) == "00:00") {
        value.setDate(value.getDate() + 1)
      }
    }
    let {modal_data} = this.state;
    if (key == "end_time" && modal_data[index]['start_time'] != undefined && modal_data[index]['start_time'] != null && !this.checkDate(modal_data[index]['start_time'], value)) {
      this.setState({alert_messages:"終了時間は開始時間以降の時間を選択してください。"});
      this.modalBlack();
      return;
    }
    if (key == "start_time" && modal_data[index]['end_time'] != undefined && modal_data[index]['end_time'] != null && !this.checkDate(value, modal_data[index]['end_time'])) {
      this.setState({alert_messages:"始時時間は終了開間以前の時間を選択してください。"});
      this.modalBlack();
      return;
    }
    modal_data[index][key]= value;
    // ----- new code ------
    // let cur_item = modal_data[index];
    if (key == "start_time" || key == "end_time") {
      // if (cur_item.start_time != undefined && cur_item.end_time != undefined && cur_item.end_time > cur_item.start_time) {
      // }
    } else if(key == "fio2_value") { // FiO2の変更した場合
      if (modal_data[index].blood_flow != undefined && modal_data[index].blood_flow != "") {
        // count 使用酸素流量
        let oxygen_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 * modal_data[index].blood_flow).toFixed(2);
        modal_data[index].oxygen_flow = oxygen_flow;        
      } else if((modal_data[index].blood_flow == undefined || modal_data[index].blood_flow == null || modal_data[index].blood_flow == "") && 
        modal_data[index].oxygen_flow != undefined && 
        modal_data[index].oxygen_flow != "") {
        // count 流量
        let blood_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 / modal_data[index].oxygen_flow).toFixed(2);
        modal_data[index].blood_flow = blood_flow;
        // count VT
        if (modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].rate != undefined && modal_data[index].rate != "" && modal_data[index].rate != 0) {
          modal_data[index].vt_value = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].rate).toFixed(2);
        } else if(modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].vt_value != 0) {
          modal_data[index].rate = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].vt_value).toFixed(2);
        } else if(modal_data[index].rate != undefined && modal_data[index].rate != "" && modal_data[index].rate != 0) {
          modal_data[index].rate = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].vt_value).toFixed(2);
        }
      }
    } else if(key == "blood_flow") { // 流量を変更した場合
      // count VT
      if (modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].rate != undefined && modal_data[index].rate != "" && modal_data[index].rate != 0) {
        modal_data[index].vt_value = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].rate).toFixed(2);
      } else if(modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].vt_value != 0) {
        modal_data[index].rate = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].vt_value).toFixed(2);
      } else if(modal_data[index].rate != undefined && modal_data[index].rate != "" && modal_data[index].rate != 0) {
        modal_data[index].rate = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].vt_value).toFixed(2);
      }

      // 使用酸素流量, Fio2_value
      if (!((modal_data[index].oxygen_flow == undefined || modal_data[index].oxygen_flow == "") && (modal_data[index].fio2_value == undefined || modal_data[index].fio2_value == ""))) {
        if (modal_data[index].oxygen_flow != undefined && modal_data[index].oxygen_flow != "" && modal_data[index].fio2_value != undefined && modal_data[index].fio2_value != "") {
          // count 使用酸素流量
          modal_data[index].oxygen_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 * modal_data[index].blood_flow).toFixed(2);
        } else if(modal_data[index].fio2_value != undefined && modal_data[index].fio2_value != "") {
          // count 使用酸素流量
          modal_data[index].oxygen_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 * modal_data[index].blood_flow).toFixed(2);
        } else if(modal_data[index].oxygen_flow != undefined && modal_data[index].oxygen_flow != "") {          
          // count Fi O2
          modal_data[index].fio2_value = parseFloat((modal_data[index].oxygen_flow / modal_data[index].blood_flow * 79 + 21) / 100).toFixed(2);
        }
      }      
    } else if(key == "oxygen_flow") { // 使用酸素流量を変更した場合
      if (modal_data[index].fio2_value != undefined && modal_data[index].fio2_value != "") {        
        // count 流量
        let blood_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 / modal_data[index].oxygen_flow).toFixed(2);
        modal_data[index].blood_flow = blood_flow;

        // count VT
        if (modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].rate != undefined && modal_data[index].rate != "" && modal_data[index].rate != 0) {
          modal_data[index].vt_value = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].rate).toFixed(2);
        } else if(modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].vt_value != 0) {
          modal_data[index].rate = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].vt_value).toFixed(2);
        } else if(modal_data[index].rate != undefined && modal_data[index].rate != "" && modal_data[index].rate != 0) {
          modal_data[index].rate = parseFloat(modal_data[index].blood_flow * 1000 / modal_data[index].vt_value).toFixed(2);
        }        
      } else if(modal_data[index].blood_flow != undefined && modal_data[index].blood_flow != "") {
        // count Fi O2
        modal_data[index].fio2_value = parseFloat((modal_data[index].oxygen_flow / modal_data[index].blood_flow * 79 + 21) / 100).toFixed(2);
      }          
    } else if(key == "vt_value" || key == "rate") {
      if (modal_data[index].vt_value != undefined && modal_data[index].vt_value != "" && modal_data[index].rate != undefined && modal_data[index].rate != "" ) {
        // count 流量
        let blood_flow = parseFloat(modal_data[index].vt_value * modal_data[index].rate / 1000).toFixed(2);
        modal_data[index].blood_flow = blood_flow;

        // 使用酸素流量, Fio2_value
        if (!((modal_data[index].oxygen_flow == undefined || modal_data[index].oxygen_flow == "") && (modal_data[index].fio2_value == undefined || modal_data[index].fio2_value == ""))) {
          if (modal_data[index].oxygen_flow != undefined && modal_data[index].oxygen_flow != "" && modal_data[index].fio2_value != undefined && modal_data[index].fio2_value != "") {
            // count 使用酸素流量
            modal_data[index].oxygen_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 * modal_data[index].blood_flow).toFixed(2);
          } else if(modal_data[index].fio2_value != undefined && modal_data[index].fio2_value != "") {
            // count 使用酸素流量
            modal_data[index].oxygen_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 * modal_data[index].blood_flow).toFixed(2);
          } else if(modal_data[index].oxygen_flow != undefined && modal_data[index].oxygen_flow != "") {          
            // count Fi O2
            modal_data[index].fio2_value = parseFloat((modal_data[index].oxygen_flow / modal_data[index].blood_flow * 79 + 21) / 100).toFixed(2);
          }
        }
      }
    } else if (key == "setted_steady_flow_rate" && value !== "" && modal_data[index].fio2_value !== undefined && modal_data[index].fio2_value != '' && modal_data[index].blood_flow !== undefined && modal_data[index].blood_flow != '' ) {
      if (value == "" || value == "0" || value == "0." || value == null) value = 0;
      let oxygen_flow = parseFloat((modal_data[index].fio2_value * 100 - 21) / 79 * modal_data[index].blood_flow).toFixed(2);
      modal_data[index].oxygen_flow = parseFloat(parseFloat(oxygen_flow) + parseFloat(value)).toFixed(2);
    }

    
    let oxygen_amount = this.calculateOxygen(modal_data);
    if (modal_data[modal_data.length - 1]['oxygen_source_code'] !== undefined && modal_data[modal_data.length - 1]['oxygen_source_code'] != null && modal_data[modal_data.length - 1]['oxygen_source_code'] != "" &&
      modal_data[modal_data.length - 1]['start_time'] != null && modal_data[modal_data.length - 1]['end_time'] != null && modal_data[modal_data.length - 1]['oxygen_flow'] !== "") {
      var selected_oxygen_date = this.props.selected_oxygen_date;
      modal_data.push({
        order_flag: 1, 
        start_date: selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != '' ? selected_oxygen_date : null,
        start_time: null, 
        start_time_value: "", 
        end_time: null, 
        end_time_value: "", 
        oxygen_flow: "", 
        blood_flow:"", 
        density: "",
        oxygen_inhaler_name: modal_data[modal_data.length - 1]['oxygen_inhaler_name'],
        oxygen_inhaler_id: modal_data[modal_data.length - 1]['oxygen_inhaler_id'],
        oxygen_source_code: modal_data[modal_data.length - 1]['oxygen_source_code'],
        oxygen_source_name: modal_data[modal_data.length - 1]['oxygen_source_name'],
        setted_steady_flow_rate: "",
      });
    }

    this.setState({modal_data, oxygen_amount});
  };
  
  getTimeValue = (key, index, value, e) => {
    let key_value = "start_time_value";
    if (key == "end_time") {
      key_value = "end_time_value";
    }

    let rows = JSON.parse(JSON.stringify(this.state.modal_data));
    if (rows.length > 0) {
      rows.map(item=>{
        if (item.start_date != undefined && item.start_date != null && item.start_date != "") {
          item.start_date = new Date(item.start_date);
        }
        if (item.start_time != undefined && item.start_time != null && item.start_time != "") {
          item.start_time = new Date(item.start_time);
        }
        if (item.end_time != undefined && item.end_time != null && item.end_time != "") {
          item.end_time = new Date(item.end_time);
        }
      });
    }
    if (e == undefined){
      
      // start
      if (key == "end_time") {
        if (formatTimeIE(value) == "00:00") {
          value.setDate(value.getDate() + 1)
        }
      }
  
      // ==============      
      if (key == "end_time" && rows[index]['start_time'] != undefined && rows[index]['start_time'] != null && !this.checkDate(rows[index]['start_time'], value)) {
        this.setState({alert_messages:"終了時間は開始時間以降の時間を選択してください。"});
        this.modalBlack();
        return;
      }
      if (key == "start_time" && rows[index]['end_time'] != undefined && rows[index]['end_time'] != null && !this.checkDate(value, rows[index]['end_time'])) {
        this.setState({alert_messages:"始時時間は終了開間以前の時間を選択してください。"});
        this.modalBlack();
        return;
      }

      // var value_time_object = rows[index]['start_date'] != null ? rows[index]['start_date'] : new Date();
      // value_time_object.setMinutes(value.getMinutes());
      // value_time_object.setHours(value.getHours());  
      
      // let value_time_object = new Date(rows[index]['start_date'].getFullYear(), rows[index]['start_date'].getMonth() + 1, rows[index]['start_date'].getDate(), value.getHours(), value.getMinutes())
      // console.log("value_time_object", value_time_object);

      rows[index][key] = new Date(rows[index]['start_date'].getFullYear(), rows[index]['start_date'].getMonth(), rows[index]['start_date'].getDate(), value.getHours(), value.getMinutes());
      rows[index][key_value] = formatTime(new Date(rows[index]['start_date'].getFullYear(), rows[index]['start_date'].getMonth() + 1, rows[index]['start_date'].getDate(), value.getHours(), value.getMinutes()));  

      // rows[index][key]= value;    
      
      let oxygen_amount = this.calculateOxygen(rows);
      if (rows[rows.length - 1]['oxygen_source_code'] !== undefined && rows[rows.length - 1]['oxygen_source_code'] != null && rows[rows.length - 1]['oxygen_source_code'] != "" &&
        rows[rows.length - 1]['start_time'] != null && rows[rows.length - 1]['end_time'] != null && rows[rows.length - 1]['oxygen_flow'] !== "") {
        var selected_oxygen_date = this.props.selected_oxygen_date;
        rows.push({
          order_flag: 1, 
          start_date: selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != '' ? selected_oxygen_date : null,
          start_time: null, 
          start_time_value: "", 
          end_time: null, 
          end_time_value: "", 
          oxygen_flow: "", 
          blood_flow:"", 
          density: "",
          oxygen_inhaler_name: rows[rows.length - 1]['oxygen_inhaler_name'],
          oxygen_inhaler_id: rows[rows.length - 1]['oxygen_inhaler_id'],
          oxygen_source_code: rows[rows.length - 1]['oxygen_source_code'],
          oxygen_source_name: rows[rows.length - 1]['oxygen_source_name'],
          setted_steady_flow_rate: "",
        });
      }      

      // end
      this.setState({
        modal_data: rows,
        oxygen_amount,
        change_flag: true,
      });
      return;
    }

    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);    

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setTime(key, index, e);
    
    rows[index][key_value] = input_value;
    this.setState({
      modal_data: rows
    }, () => {
      var obj = document.getElementById('start_time_id_' + index);
      if (key == "end_time") {
        obj = document.getElementById('end_time_id_' + index);        
      }
      if (this.key_code[index] == 46){        
        obj.setSelectionRange(this.start_pos[index], this.start_pos[index]);
      }
      if (this.key_code[index] == 8){        
        obj.setSelectionRange(this.start_pos[index] - 1, this.start_pos[index] - 1);
      }
    })     
  };
  
  handleClick = (e) => {
    if (this.props.view_only) return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("basicdata-modal").offsetLeft,
          y: e.clientY + window.pageYOffset - 170
        },
      });
    }
  };
  
  handleTrClick = (e, index) => {
    if (this.props.view_only) return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("basicdata-modal").offsetLeft,
          y: e.clientY + window.pageYOffset - 170
        },
        row_index: index,
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    let {modal_data} = this.state;
    modal_data = modal_data !== undefined && modal_data != null && modal_data.length > 0 ? modal_data: [];
    let blank = {
      order_flag: 1, 
      start_date: this.props.selected_oxygen_date != undefined && this.props.selected_oxygen_date != null && this.props.selected_oxygen_date != '' ? this.props.selected_oxygen_date : null,
      start_time: null,
      start_time_value: "",
      end_time: null,
      end_time_value: "",
      oxygen_flow: "", 
      blood_flow: "", 
      density: "", 
      fio2_value: "", 
      rate: "",
      vt_value: "",
      oxygen_inhaler_id: 0,
      oxygen_inhaler_name: "",
      oxygen_source_code: 0,
      main_unit: "",
      category_id: "",
      oxygen_source_name: "",
      setted_steady_flow_rate: "",
    };
    
    if (modal_data[modal_data.length - 1]['oxygen_inhaler_id'] != "" && modal_data[modal_data.length - 1]['oxygen_inhaler_name'] != "") {
      blank.oxygen_inhaler_name = modal_data[modal_data.length - 1]['oxygen_inhaler_name'];
      blank.oxygen_inhaler_id = modal_data[modal_data.length - 1]['oxygen_inhaler_id'];
    }
    if (modal_data[modal_data.length - 1]['oxygen_source_name'] != "") {
      blank.oxygen_source_name = modal_data[modal_data.length - 1]['oxygen_source_name'];
      blank.oxygen_source_code = modal_data[modal_data.length - 1]['oxygen_source_code'];
    }
    if (type === "delete"){
      modal_data.splice(index,1);
    } else if (type === "register"){      
      modal_data.push(blank);
    }
    let oxygen_amount = this.calculateOxygen(modal_data);
    this.setState({modal_data,oxygen_amount});
  };
  
  handleOk = () => {
    let {modal_data, source_options} = this.state;
    let alert_messages = "";
    modal_data = modal_data.filter(x=>x.start_date != "" && x.start_time != null && x.end_time != null && x.start_time != "" && x.end_time != "");
    modal_data.map(item=>{
      if (this.fio2_require && (item.fio2_value === undefined || item.fio2_value == "")) alert_messages = "Fi O2を入力してください。";
      if (item.oxygen_source_code === undefined || item.oxygen_source_code == "") alert_messages = "酸素供給源を選択してください。";
      if (((item.vt_value !== undefined && item.vt_value != null && item.vt_value !== "") && (item.rate === undefined || item.rate == null || item.rate === "")) ||
        ((item.rate !== undefined && item.rate != null && item.rate !== "") && (item.vt_value === undefined || item.vt_value == null || item.vt_value === ""))) alert_messages = "VTとRateは両方入力するか、両方空欄にしてください";
    });
    if (alert_messages !== "") {
      this.setState({alert_messages});
      this.modalBlack();
      return;
    }
    if (this.props.from_source != 'progress_chart'){
      let key_result = {};
      modal_data.map(item=>{
        if (key_result[item.oxygen_source_code] === undefined) {
          key_result[item.oxygen_source_code] = [];
          key_result[item.oxygen_source_code].push(item);
        } else {
          key_result[item.oxygen_source_code].push(item);
        }
      });
      let total_amount = 0;
      if (Object.keys(key_result).length > 0) {
        Object.keys(key_result).map(index=>{
          let item = key_result[index];
          let oxygen_amount = this.calculateOxygen(item);
          if (oxygen_amount > 0) total_amount += oxygen_amount;
          let find_option = source_options.find(x=>x.id == index);
          if (find_option !== undefined) {
            item[0].main_unit = find_option.main_unit;
            item[0].category_id = find_option.category_id;
          }
          item[0].oxygen_amount = oxygen_amount;
        });
      }
      if (Object.keys(key_result).length > 0) {
        Object.keys(key_result).map(index=>{
          let item = key_result[index];
          item.map(sub_item=>{
            sub_item.start_time = formatTimeIE(sub_item.start_time);
            sub_item.end_time = formatTimeIE(sub_item.end_time);
            sub_item.start_date = formatDateLine(sub_item.start_date);
          })
        });
      }
      this.props.handleOk(key_result, total_amount);
    } else {
      var enable_data = [];      
      if (this.props.origin_oxygen_items != undefined && this.props.origin_oxygen_items != null && this.props.origin_oxygen_items.length > 0){
        var origin_oxygen_items = this.props.origin_oxygen_items
        var check_duplicate_flag_whole = false;
        modal_data.map(item => {
          var check_duplicate_flag = false;
          origin_oxygen_items.map(origin_item => {            
            if ((item.start_time.getTime() >= formatDateTimeIE(origin_item.start_time).getTime() && item.start_time.getTime() <= formatDateTimeIE(origin_item.end_time).getTime()) 
              || (item.end_time.getTime() >= formatDateTimeIE(origin_item.start_time).getTime() && item.end_time.getTime() <= formatDateTimeIE(origin_item.end_time).getTime())) {
                check_duplicate_flag = true
              }
          })
          if (check_duplicate_flag) {
            check_duplicate_flag_whole = true;
          } else {
            enable_data.push(item);
          }
        })
      } else {
        enable_data = modal_data;
      }
      this.props.handleOk(enable_data, check_duplicate_flag_whole);
    }
  };
  
  // [終了時間 - 開始時間](分) × 流量() × 濃度(%)
  calculateOxygen(data){
    if (data === undefined || data == null || data.length == 0) return null;
    let oxygen_amount = 0;
    data.map(item=>{
      let column_result = 0;
      let start_time = item.start_time != null ? item.start_time : 0;
      let end_time = item.end_time != null ? item.end_time : 0;
      let oxygen_flow = item.oxygen_flow !== undefined && item.oxygen_flow != null && item.oxygen_flow !== "" ? parseFloat(item.oxygen_flow).toFixed(2) : 0;
      if (end_time == 0 || start_time == 0 || oxygen_flow == 0) column_result = 0;
      else {
        if (end_time>start_time && item.order_flag == 1) {
          column_result = Math.round(parseFloat((end_time - start_time)) / 1000 / 60) * oxygen_flow;
          column_result = Math.round(column_result * 100)/100;
        }
      }
      oxygen_amount += column_result;
    });
    return oxygen_amount;
  }
  
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() >= to.getTime()) return false;
    return true;
  }
  closeAlertModal () {
    this.setState({alert_messages: ''});
    this.modalBlackBack();
  }
  modalBlack() {
    var base_modal = document.getElementsByClassName("basicdata-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("basicdata-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  
  getRadio = (name, index) => {
    if (name == "oxygen_check") {
      let {modal_data} = this.state;
      if(modal_data[index]['order_flag']){
        modal_data[index]['order_flag'] = 0;
      } else {
        modal_data[index]['order_flag'] = 1;
      }
      this.setState({modal_data});
    }
  }
  getInhaler = (index, e) => {
    let {modal_data} = this.state;
    modal_data[index]['oxygen_inhaler_id'] = e.target.id;
    modal_data[index]['oxygen_inhaler_name'] = e.target.value;
    this.setState({modal_data});
  }
  getSource = (index, e) => {
    let {modal_data} = this.state;
    modal_data[index]['oxygen_source_code'] = e.target.id;
    modal_data[index]['oxygen_source_name'] = e.target.value;
    this.setState({modal_data});
  }

  timeKeyEvent = (key, index, e) => {    
    let key_value = "start_time_value";
    if (key == "end_time") {
      key_value = "end_time_value";
    }
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code[index] = key_code;
    this.start_pos[index] = start_pos;
    var obj = document.getElementById('start_time_id_' + index);
    if (key == "end_time") {
      obj = document.getElementById('end_time_id_' + index);      
    }

    let input_value = e.target.value;
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }    

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setTime(key, index, e);
      return;
    }

    var rows = this.state.modal_data;
    if (rows.length > 0) {
      rows.map(item=>{
        if (item.start_date != undefined && item.start_date != null && item.start_date != "") {
          item.start_date = new Date(item.start_date);
        }
        if (item.start_time != undefined && item.start_time != null && item.start_time != "") {
          item.start_time = new Date(item.start_time);
        }
        if (item.end_time != undefined && item.end_time != null && item.end_time != "") {
          item.end_time = new Date(item.end_time);
        }
      });
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        rows[index][key_value] = ''
        this.setState({modal_data: rows}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        rows[index][key_value] = input_value;
        this.setState({modal_data: rows}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);
        rows[index][key_value] = input_value;
        this.setState({
          modal_data: rows
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        rows[index][key_value] = input_value;
        this.setState({
          modal_data: rows
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        rows[index][key_value] = input_value;
        this.setState({
          modal_data: rows
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){
        rows[index][key_value] = '';
        this.setState({modal_data: rows}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){
          rows[index][key_value] = input_value.slice(1,2);
          this.setState({
            modal_data: rows
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){
          rows[index][key_value] = input_value.slice(0,1);
          this.setState({
            modal_data: rows
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      rows[index][key_value] = input_value;
      this.setState({
        modal_data: rows
      })
    }
  }

  setTime = (key, index, e) => {    
    let key_value = "start_time_value";
    if (key == "end_time") {
      key_value = "end_time_value";
    }
    // let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // // let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");    
    // let schedule_date = "";
    let rows = this.state.modal_data;
    if (rows.length > 0) {
      rows.map(item=>{
        if (item.start_date != undefined && item.start_date != null && item.start_date != "") {
          item.start_date = new Date(item.start_date);
        }
        if (item.start_time != undefined && item.start_time != null && item.start_time != "") {
          item.start_time = new Date(item.start_time);
        }
        if (item.end_time != undefined && item.end_time != null && item.end_time != "") {
          item.end_time = new Date(item.end_time);
        }
      });
    }
    // var value_time_object = new Date(schedule_date);
    // var value_time_object = rows[index] != undefined && rows[index]['start_date'] != undefined ? rows[index]['start_date'] : null;

    // console.log("value_time_object", value_time_object);
      
    // rows[index]["updated_by"] = authinfo.user_number;
    // rows[index]["staff"] = authinfo.name;    
    
    if (e.target.value.length != 5) {
      rows[index][key] = null;
      rows[index][key_value] = "";
      let oxygen_amount = this.calculateOxygen(rows);
      this.setState({
        modal_data: rows,
        oxygen_amount,
        change_flag: true,
      });
      return;
    }

    // validate
    if (key == "end_time" && rows[index]['start_time'] != undefined && rows[index]['start_time'] != null && !this.checkDate(rows[index]['start_time'], new Date(formatDateSlash(rows[index]['start_date']) + " " + e.target.value + ":00"))) {
      if (rows[index]['end_time'] != undefined && rows[index]['end_time'] != null && rows[index]['end_time'] != "") {
        rows[index]['end_time_value'] = formatTime(rows[index]['end_time']);
      } else {
        rows[index]['end_time_value'] = "";
      }      
      this.setState({modal_data: rows, alert_messages:"終了時間は開始時間以降の時間を選択してください。"});
      this.modalBlack();
      return;
    }
    if (key == "start_time" && rows[index]['end_time'] != undefined && rows[index]['end_time'] != null && !this.checkDate(new Date(formatDateSlash(rows[index]['start_date']) + " " + e.target.value + ":00"), rows[index]['end_time'])) {
      if (rows[index]['start_time'] != undefined && rows[index]['start_time'] != null && rows[index]['start_time'] != "") {
        rows[index]['start_time_value'] = formatTime(rows[index]['start_time']);
      } else {
        rows[index]['start_time_value'] = "";
      }      
      this.setState({modal_data: rows, alert_messages:"始時時間は終了開間以前の時間を選択してください。"});
      this.modalBlack();
      return;
    }



    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      rows[index][key] = null;
      rows[index][key_value] = "";
      this.setState({
        modal_data: rows,
        change_flag: true,
      })      
      return;
    }

    rows[index][key] = new Date(formatDateSlash(rows[index]['start_date']) + " " + e.target.value + ":00");
    rows[index][key_value] = e.target.value;
    let oxygen_amount = this.calculateOxygen(rows);
    if (rows[rows.length - 1]['oxygen_source_code'] !== undefined && rows[rows.length - 1]['oxygen_source_code'] != null && rows[rows.length - 1]['oxygen_source_code'] != "" &&
      rows[rows.length - 1]['start_time'] != null && rows[rows.length - 1]['end_time'] != null && rows[rows.length - 1]['oxygen_flow'] !== "") {
      var selected_oxygen_date = this.props.selected_oxygen_date;
      rows.push({
        order_flag: 1, 
        start_date: selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != '' ? selected_oxygen_date : null,
        start_time: null, 
        start_time_value: "", 
        end_time: null, 
        end_time_value: "", 
        oxygen_flow: "", 
        blood_flow:"", 
        density: "",
        oxygen_inhaler_name: rows[rows.length - 1]['oxygen_inhaler_name'],
        oxygen_inhaler_id: rows[rows.length - 1]['oxygen_inhaler_id'],
        oxygen_source_code: rows[rows.length - 1]['oxygen_source_code'],
        oxygen_source_name: rows[rows.length - 1]['oxygen_source_name'],
        setted_steady_flow_rate: "",
      });
    }

    this.setState({
      oxygen_amount
    });

    // if (value_time_object != null) {      
    //   value_time_object.setMinutes(mins);
    //   value_time_object.setHours(hours);    
    // }    
  
    // rows[index][key] = value_time_object;
    // this.setState({modal_data: rows, change_flag:true})
  }

  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }
  
  render() {
    let {modal_data, oxygen_amount} = this.state;
    let {practice_name, selected_oxygen_date, from_source} = this.props;
    this.last_td_width = 45;
    if (this.fio2_require) {
      this.last_td_width = 73;
    }
    return  (
      <Modal show={true} size="lg" className={this.fio2_require ? "basicdata-modal tag-add-modal oxygen-calculate-modal" : "basicdata-modal tag-add-modal oxygen-calculate-small-modal"} id="basicdata-modal">
        <Modal.Header>
          <Modal.Title>酸素量計算</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            {this.state.is_loaded ? (
              <Wrapper>
                {/* {this.props.from_source != 'progress_chart' && ( */}
                <div className="w-100 d-flex" style={{marginBottom:"3px"}}>
                  <div className={`text-right mr-1 w-auto`} style={{height:"30px", lineHeight:"30px"}}>行為名</div><div className={`border`} style={{height:"30px", lineHeight:"30px",width:"90%"}}>{practice_name}</div>
                </div>
                {/* )} */}
                <div className="table-area" onContextMenu={e => this.handleClick(e)}>
                  <div className="table-header flex">
                    <div className="menu" style={{width:"3rem"}}>使用</div>
                    <div className="menu" style={{width:"8rem"}}>装置</div>
                    <div className="menu" style={{width:"7rem"}}>日付</div>
                    <div className="menu" style={{width:"5rem"}}>開始</div>
                    <div className="menu" style={{width:"5rem"}}>終了</div>
                    {this.fio2_require && (
                      <>
                        <div className="menu td-number" style={{width:"7rem"}}>Fi O2</div>
                        <div className="menu td-number" style={{width:"7rem"}}>流量<br />[L/分]</div>
                        <div className="menu td-number" style={{width:"8rem"}}>VT<br />[mL]</div>
                        <div className="menu td-number" style={{width:"7rem"}}>Rate <br />[回/分]</div>
                        <div className="menu td-number" style={{width:"8rem"}}>設定定常流量<br />[L/分]</div>
                      </>
                    )}
                    <div className="menu td-number" style={{width:"8rem"}}>使用酸素流量<br />[L/分]</div>
                    <div className="menu" style={{width:"calc(100% - " + this.last_td_width + "rem" + " - 17px)"}}>酸素供給源</div>
                    <div className={'menu td-last'}> </div>
                  </div>
                  <div className="table-body">                                    
                    {modal_data !== undefined && modal_data != null && modal_data.length>0 && modal_data.map((item,index)=>{                      
                      var start_min_time = null;
                      var end_min_time = null;
                      var start_max_time = null;
                      var end_max_time = null;
                      if (item.start_date != undefined && item.start_date != null && item.start_date != ''){
                        start_min_time = new Date(item.start_date);
                        start_min_time.setHours(0);
                        start_min_time.setMinutes(0);
                        start_min_time.setSeconds(0);
                        end_min_time = new Date(item.start_date);
                        end_min_time.setHours(0);
                        end_min_time.setMinutes(0);
                        end_min_time.setSeconds(0);
                        start_max_time = new Date(item.start_date);
                        start_max_time.setHours(23);
                        start_max_time.setMinutes(59);
                        start_max_time.setSeconds(59);
                        end_max_time = start_max_time;
                      } else {
                        start_min_time = new Date();
                        start_min_time.setHours(0);
                        start_min_time.setMinutes(0);
                        start_min_time.setSeconds(0);
                        end_min_time = new Date();
                        end_min_time.setHours(0);
                        end_min_time.setMinutes(0);
                        end_min_time.setSeconds(0);
                        start_max_time = new Date();
                        start_max_time.setHours(23);
                        start_max_time.setMinutes(59);
                        start_max_time.setSeconds(59);
                        end_max_time = start_max_time;
                      }
                      if (item.start_time != undefined && item.start_time != null && item.start_time != ''){
                        end_min_time = item.start_time;
                      }
                      if (index > 0){
                        if (modal_data[index-1].end_time != undefined && modal_data[index-1].end_time  != null && modal_data[index-1].end_time  != '' && formatDateLine(item.start_date) == formatDateLine(modal_data[index -1].start_date)){
                          start_min_time = modal_data[index-1].end_time;
                        }
                      }
                      return (
                        <div className="div-tr flex" key={index} onContextMenu={e => this.handleTrClick(e, index)}>
                          <div className="div-td text-center text-check" style={{width:"3rem"}}>
                            {this.props.view_only ? (
                              <Checkbox
                                label=""
                                number={index}
                                getRadio={this.getRadio.bind(this)}
                                value={item.order_flag}
                                name="oxygen_check"
                                isDisabled={true}
                              />
                            ):(
                              <Checkbox
                                label=""
                                number={index}
                                getRadio={this.getRadio.bind(this)}
                                value={item.order_flag}
                                name="oxygen_check"
                              />
                            )}
                          </div>
                          <div className="div-td text-center text-select1" style={{width:"8rem"}}>
                            {this.props.view_only ? (
                              <>{item.oxygen_inhaler_name}</>
                            ):(
                              <SelectorWithLabel
                                options={this.state.inhaler_options}
                                title=""
                                getSelect={this.getInhaler.bind(this, index)}
                                departmentEditCode={item.oxygen_inhaler_id}
                              />
                            )}
                          </div>
                          <div className="div-td text-center text-date" style={{width:"7rem"}}>
                            {this.props.view_only ? (
                              <>{formatDateSlash(item.start_date)}</>
                            ):(
                              <DatePicker
                                locale="ja"
                                selected={item.start_date}
                                onChange={this.getValue.bind(this,"start_date",index)}
                                dateFormat="yyyy/MM/dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"                              
                                dayClassName = {date => setDateColorClassName(date)}
                                disabled={(from_source == "progress_chart" && selected_oxygen_date != undefined && selected_oxygen_date != null && selected_oxygen_date != '')? true: false}                                
                              />
                            )}
                          </div>
                          <div className="div-td text-center text-date" style={{width:"5rem"}}>
                            {this.props.view_only ? (
                              <>{formatTimeIE(item.start_time)}</>
                            ):(
                              <DatePicker
                                selected={item.start_time}
                                onChange={this.getTimeValue.bind(this,"start_time",index)}
                                onKeyDown = {this.timeKeyEvent.bind(this,"start_time", index)}
                                onBlur = {this.setTime.bind(this,"start_time", index)}
                                value = {item.start_time_value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="開始時間"
                                minTime = {start_min_time}
                                maxTime={start_max_time}  
                                id = {"start_time_id_" + index}                              
                              />
                            )}
                          </div>
                          <div className="div-td text-center text-date" style={{width:"5rem"}}>
                            {this.props.view_only ? (
                              <>{formatTimeIE(item.end_time)}</>
                            ):(
                              <DatePicker
                                selected={item.end_time}
                                onChange={this.getTimeValue.bind(this,"end_time",index)}   
                                onKeyDown = {this.timeKeyEvent.bind(this, "end_time", index)}
                                onBlur = {this.setTime.bind(this, "end_time", index)}
                                value = {item.end_time_value}                             
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="終了時間"
                                minTime = {end_min_time}
                                maxTime={end_max_time}
                                id = {"end_time_id_" + index}
                              />
                            )}
                          </div>
                          {this.fio2_require && (
                            <>
                              <div className="div-td text-number td-number" style={{width:"7rem"}}>{this.props.view_only ? (
                                <>{item.fio2_value}</>
                              ):(
                                <NumericInputWithUnitLabel
                                  label=""
                                  className="form-control"
                                  value={item.fio2_value}
                                  getInputText={this.getValue.bind(this,"fio2_value",index)}
                                  inputmode="numeric"
                                  step={0.1}
                                  min={0.21}
                                  max={1.00}
                                />
                              )}</div>
                              <div className="div-td text-number td-number" style={{width:"7rem"}}>
                                {this.props.view_only ? (
                                  <>{item.blood_flow}</>
                                ):(
                                  <NumericInputWithUnitLabel
                                    label=""
                                    className="form-control"
                                    value={item.blood_flow}
                                    getInputText={this.getValue.bind(this,"blood_flow",index)}
                                    inputmode="numeric"
                                    min={0}
                                  />
                                )}
                              </div>
                              <div className="div-td text-number td-number" style={{width:"8rem"}}>{this.props.view_only ? (
                                <>{item.vt_value}</>
                              ):(
                                <NumericInputWithUnitLabel
                                  label=""
                                  className="form-control"
                                  value={item.vt_value}
                                  getInputText={this.getValue.bind(this,"vt_value",index)}
                                  inputmode="numeric"
                                  min={0}
                                />
                              )}</div>
                              <div className="div-td text-number td-number" style={{width:"7rem"}}>{this.props.view_only ? (
                                <>{item.rate}</>
                              ):(
                                <NumericInputWithUnitLabel
                                  label=""
                                  className="form-control"
                                  value={item.rate}
                                  getInputText={this.getValue.bind(this,"rate",index)}
                                  inputmode="numeric"
                                  min={0}
                                />
                              )}</div>
                              <div className="div-td text-number td-number" style={{width:"8rem"}}>
                                {this.props.view_only ? (
                                  <>{item.setted_steady_flow_rate}</>
                                ):(
                                  <NumericInputWithUnitLabel
                                    label=""
                                    className="form-control"
                                    value={item.setted_steady_flow_rate}
                                    getInputText={this.getValue.bind(this,"setted_steady_flow_rate",index)}
                                    inputmode="numeric"
                                    min={0}
                                  />
                                )}
                              </div>
                            </>
                          )}
                          <div className="div-td text-number td-number" style={{width:"8rem"}}>
                            {this.props.view_only ? (
                              <>{item.oxygen_flow}</>
                            ):(
                              <NumericInputWithUnitLabel
                                label=""
                                className="form-control"
                                value={item.oxygen_flow}
                                getInputText={this.getValue.bind(this,"oxygen_flow",index)}
                                inputmode="numeric"
                                min={0}
                              />
                            )}
                          </div>
                          <div className="div-td text-center text-select" style={{width:"calc(100% - " + this.last_td_width + "rem)"}}>
                            {this.props.view_only ? (
                              <>{item.oxygen_source_name}</>
                            ):(
                              <SelectorWithLabel
                                options={this.state.source_options}
                                title=""
                                getSelect={this.getSource.bind(this, index)}
                                departmentEditCode={item.oxygen_source_code}
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <div className="note-area mt-3" style={{float:"left"}}>
                    ※ 24時（深夜0時）迄指定の際は、終了時間に00:00を入力してください。
                  </div>
                  <div className={`d-flex mt-2 text-right mr-3`} style={{float:"right",lineHeight: "2rem"}}>
                    <div>酸素量</div><div className="border pr-1 ml-1" style={{width: 100,height:"2rem"}}>{oxygen_amount}</div><div className="ml-1">L</div>
                  </div>
                </div>
              </Wrapper>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              row_index={this.state.row_index}
            />
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div className="custom-modal-btn cancel-btn" onClick={this.props.closeModal} style={{cursor: "pointer"}}><span>キャンセル</span></div>
          {this.props.view_only != true && (
            <div className="custom-modal-btn red-btn" onClick={this.handleOk} style={{cursor: "pointer"}}><span>確 定</span></div>
          )}
        </Modal.Footer>
        
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeAlertModal.bind(this)}
            handleOk= {this.closeAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.alert_title}
          />
        )}
      </Modal>
    );
  }
}

OxygenCalculateModal.contextType = Context;

OxygenCalculateModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.array,
  practice_name: PropTypes.string,
  handleOk:PropTypes.func,
  view_only:PropTypes.bool,
  treat_id:PropTypes.number,
  treat_detail_id:PropTypes.string,
  select_practice:PropTypes.object,
  from_source : PropTypes.string,
  show_days: PropTypes.number,
  selected_oxygen_date: PropTypes.string,
  origin_oxygen_items: PropTypes.array,
};

export default OxygenCalculateModal;