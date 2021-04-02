import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {
  secondary200,
  disable
} from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
// import {getStrLength} from "~/helpers/constants";
import Checkbox from "~/components/molecules/Checkbox";
import {displayLineBreak} from "~/helpers/dialConstants"
import {getStaffName} from "~/helpers/constants";
import {formatDateLine, formatJapanDateTimeIE, formatTime} from "~/helpers/date";
// import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import renderHTML from "react-render-html";

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;

  .row {
    display: flex;
    width: 100%;
    color: #000;
    margin: auto;

    .right {
      text-align: right;
    }

    .blue {
      color: #0000ff;
    }

    .red {
      text-decoration: line-through;
    }
  }
`;

const Wrapper = styled.div`
  max-height: 70vh;
  height: 70vh;
  overflow-y: auto;
  .history-list {
    width: 100%;
    overflow-y: auto;
    font-size: 1rem;
    table {
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: auto;
          height: 6.25rem;
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
  .history-content {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 10rem);
    .content-header {
      background: aquamarine;
      text-align: left;
      font-size: 1rem;
    }
  }
 `;

const MedicineListWrapper = styled.div`
  font-size: 1rem;
  .text-red{
    color: #ff0000;
    text-decoration: line-through rgb(255, 0, 0);
  }

  .text-blue{
    color: #0000ff;
  }

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
      left: 50px;
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

  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 160px;
    }

    .text-left{
      .table-item{
        width: 150px;
        float: left;
        text-align: right;
        line-height: 21px;
      }
    }
    .text-right{
      .table-item{
        line-height: 21px;
        text-align: left;
        margin-left: 20px;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }

    .no-bottom-line{
      border-bottom: none !important;
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

  .text-right {
    width: calc(100% - 88px);
    overflow: hidden;
  }

  .remarks-comment {
    min-height: 21px;
    margin-left: auto;
    width: calc(100% - 20px);
    word-wrap: break-word;
  }
  .deleted-order {
    text-decoration: line-through;
    label {
      text-decoration: line-through;
    }
  }
  .history-item {
    border-bottom:solid 1px #ddd;
    &:first-child {
      border-top:solid 1px #ddd;
    }
  }
`;

export class ChangeNutritionGuildModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList,
      complete_message: ""
    };
  }
  
  async componentDidMount() {
    await this.getDoctors();
    await this.getStaffs();
    let history_list = [...this.props.historySoapList];
    history_list.map(item=>{
      item.history_show = 1;
      item.substitute_name =item.is_doctor_consented == 2 ? "": getStaffName(item.updated_by);
    });
    
    const differences = this.checkDifference(this.props.historySoapList);
    this.setState({
      outputs: differences.outputs,
      history_list
    });
  }

  getStaffs = async () => {
    await apiClient.post("/app/api/v2/dial/staff/search", {params:{order:"name_kana"}})
    .then((res) => {
      let staff_list_by_number = {};
      if (res != undefined){                
          Object.keys(res).map((key) => {                
            staff_list_by_number[res[key].number] = res[key].name;
          });
      }
      this.setState({
        staffs: res,
        staff_list_by_number
      });
      return res;
    });
  }

  getDoctors = async () => {
    let doctors = sessApi.getObjectValue("init_status","doctors_list");
    if (doctors != undefined && doctors.length > 0) {
      let doctor_list_by_number = {};
        Object.keys(doctors).map((key) => {
          doctor_list_by_number[doctors[key].number] = doctors[key].name;
        });
      this.setState({
        doctors: doctors,
        doctor_list_by_number
      });
      return doctors;
    } else {
      await apiClient.post("/app/api/v2/master/dial_doctor/search?order=name_kana")
        .then((res) => {
          let doctor_list_by_number = {};
          if (res != undefined){
              Object.keys(res).map((key) => {
                doctor_list_by_number[res[key].number] = res[key].name;
              });
          }
          this.setState({
            doctors: res,
            doctor_list_by_number
          });
          return res;
        });
    }
  }
  
  checkDifference = (results) => {    
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    if (result.length > 0) {
      result.map((order, index) => {
        let version = this.props.historySoapList.findIndex(x=>x.number == order.number);
        version = this.props.historySoapList.length - version;
        let current = order;
        // current.doctor_name = order.order_data.order_data.doctor_name;
        // current.department_name = this.props.getDepartmentName(order.order_data.order_data.department_id);
        // current.substitute_name = order.is_doctor_consented == 2 ? "": getStaffName(order.updated_by);
        current.version = version;
        if (index < result.length - 1) {
          current.prev = result[index + 1];
          let output = current;
          output.history_show = 1;          
          outputs.push(output);
        } else {
          current.prev = null;
          let output = current;
          output.history_show = 1;          
          outputs.push(output);
        }
      });
    }
    return {
      outputs: outputs
    };
  };  

  getChangeDetailPart = (cur, prev, _formName) => {
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          <div>{_formName == '処方'?renderHTML(cur): displayLineBreak(cur)}</div>
        </>
      )
    } else {
      if (cur == undefined || cur == null || cur == '') {
        return (
          <>
            <div className="deleted-order">{_formName == '処方'?renderHTML(prev):displayLineBreak(prev)}</div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <div className="text-blue">{_formName == '処方'?renderHTML(cur):displayLineBreak(cur)}</div>
        )
      } else {
        return (
          <>
            <div className="text-blue">{_formName == '処方'?renderHTML(cur):displayLineBreak(cur)}</div>
            <div className='deleted-order'>{_formName == '処方'?renderHTML(prev):displayLineBreak(prev)}</div>
          </>
        )
      }
    }
  }
  
  getChangePart = (cur, prev, _unit, _formName) => {
    if (_formName != undefined && (_formName == "指示事項" || _formName == "指導事項")) {
      if (cur == prev) {
        if (cur == true || cur == 1) {
          return (
            <>
              <div>{displayLineBreak(_unit)}</div>
            </>
          )
        } else {
          return (
            <></>
          );
        }
      } else {
        if ((cur == undefined || cur == null || cur == false || cur == 0) && prev != undefined) {
          return (
            <>
              <div className="deleted-order">{displayLineBreak(_unit)}</div>
            </>
          )
        } else if ((prev == undefined || prev == null || prev == false || prev == 0) && (cur == true || cur == 1)) {
          return (
            <div className="text-blue">{displayLineBreak(_unit)}</div>
          )
        }
      }
    } else {
      if (cur == prev) {
        return (
          <>
            <div>{displayLineBreak(cur)}{_unit != undefined ? _unit : ""}</div>
          </>
        )
      } else {
        if (cur == undefined || cur == null || cur == '') {
          return (
            <>
              <div className="deleted-order">{displayLineBreak(prev)}{_unit != undefined ? _unit : ""}</div>
            </>
          )
        } else if (prev == undefined || prev == null || prev == '') {
          return (
            <div className="text-blue">{displayLineBreak(cur)}{_unit != undefined ? _unit : ""}</div>
          )
        } else {
          return (
            <>
              <div className="text-blue">{displayLineBreak(cur)}{_unit != undefined ? _unit : ""}</div>
              <div className='deleted-order'>{displayLineBreak(prev)}{_unit != undefined ? _unit : ""}</div>
            </>
          )
        }
      }
    }
  }      
  
  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list, outputs} = this.state;
      history_list.find(x=>x.number == number).history_show = value;
      outputs.find(x=>x.number == number).history_show = value;
      this.setState({
        history_list,
        outputs,
      });
    }
  };    

  getKeyNameByNumber = (_number, _type) => {
    let result = "";
    if (_type == "other_facilities_number") {
      result = this.props.otherFacilitiesData.find(
        (x) => x.id === _number
      ) != undefined
        ? this.props.otherFacilitiesData.find(
            (x) => x.id === _number
          ).value
        : "";
    } else if(_type == "other_facilities_department_number") {
      result = this.props.otherFacilitiesDepartmentDatas.find(
        (x) => x.id === _number
      ) != undefined
        ? this.props.otherFacilitiesDepartmentDatas.find(
            (x) => x.id === _number
          ).value
        : "";
    } else if(_type == "other_facilities_doctor_number") {
      result = this.props.otherFacilitiesDoctors.find(
        (x) => x.id === _number
      ) != undefined
        ? this.props.otherFacilitiesDoctors.find(
            (x) => x.id === _number
          ).value
        : "";
    }
    return result;
  }

  getPrevItemBody = (_item, _formName) => {
    let result = "";
    if (_item != undefined && _item.length > 0) {
      _item.map(ele=>{
        if (ele.form_name == _formName) {
          result = ele.body;
        }
      });      
    }

    return result;
  }

  getPrevItemDetailBody = (_item, _formName, _key) => {
    let _obj = "";
    if (_item != undefined && _item != null && _item.length > 0) {
      _item.map(ele=>{
        if (ele.form_name == _formName) {
          _obj = ele;
        }
      });
    }
    let result = "";
    if (_obj != "" && _obj.body != null && _obj.body != "") {
      if (_formName == "身長体重") {        
        let item_obj = JSON.parse(_obj.body);
        if (Object.keys(item_obj).length > 0) {
          result = item_obj[_key];
        }          
      } else if(_formName == "臨床検査値") {
        let item_obj = JSON.parse(_obj.body);
        if (item_obj.length > 0 && item_obj[_key] != undefined && item_obj[_key] != null) {          
          result = item_obj[_key].value;
        }        
      } else if(_formName == "処方") {
        result = _obj.body;          
      } else if(_formName == "依頼内容") {
        let item_obj = JSON.parse(_obj.body);
        if (item_obj.length > 0 && item_obj[_key] != undefined && item_obj[_key] != null) {          
          result = item_obj[_key].default;
        }        
      } else if (_formName == "指示事項") {        
        let item_obj = JSON.parse(_obj.body);
        if (Object.keys(item_obj).length > 0) {
          result = item_obj[_key];
        }                
      } else if (_formName == "指導事項") {        
        let item_obj = JSON.parse(_obj.body);
        if (Object.keys(item_obj).length > 0) {
          result = item_obj[_key];
        }          
      } else if(_formName == "総合所見") {
        result = _obj.body;                
      } else if(_formName == "指導日") {    
        result = _obj.body!=null && _obj.body!=''? formatDateLine(new Date(_obj.body)):''; 
      } else if(_formName == "指導開始日") {               
        result = _obj.body!=null && _obj.body!=''? formatJapanDateTimeIE(new Date(_obj.body)).substring(0, 16).split("/").join("-"):''; 
      } else if(_formName == "指導終了日") {               
        result = _obj.body!=null && _obj.body!=''? formatJapanDateTimeIE(new Date(_obj.body)).substring(0, 16).split("/").join("-"):''; 
      }
    }
    
    return result;
  }
  
  render() {
    let outputs = this.state.outputs;
    var {history_list,doctor_list_by_number, staff_list_by_number} = this.state;
    // let print_disable = false;
    // if (outputs.findIndex(x=>x.history_show == 1) == -1) print_disable = true;    
    return (
      <Modal show={true} size="lg" className="prescription_confirm_modal">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="history-list">
              <table className="table table-bordered table-hover">
                <thead>
                <tr>
                  <th className="check"></th>
                  <th className="version">版数</th>
                  <th className="w-3">進捗</th>
                  <th className="date">変更日時</th>
                  <th className="">変更者</th>
                </tr>
                </thead>
                <tbody>
                {history_list !== undefined &&
                history_list !== null &&
                history_list.length > 0 && 
                doctor_list_by_number != undefined && 
                staff_list_by_number != undefined && 
                history_list.map((item, index) => {
                  index = history_list.length - index;
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
                          {index == 1 ? "初版" : parseInt(index).toString() + "版"}
                        </td>
                        <td className="w-3">
                          {item.is_enabled == 2 ? "削除" : (index == 1 ? "新規" : "修正")}
                        </td>                        
                        <td className="date">
                          {item.updated_at.split('-').join('/')}
                        </td>
                        <td className="text-left">
                          {doctor_list_by_number[item.instruction_doctor_number]}
                              {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}                          
                        </td>
                      </tr>
                    </>
                  );
                })}
                </tbody>
              </table>
            </div>
            <div className="history-content">
              {outputs != undefined && outputs != null && outputs.length > 0 && outputs.map(output=>{
                if(output.history_show == 1){
                  let item_obj_start = "";
                  var item_obj_end = '';
                  return (
                    <>
                      <TabContent>
                        <div className="row">
                          <div className="content w-100">
                            <div className="content-header">
                              <span className="mr-3">{"（" + (output.version == 1 ? "初" : output.version) + "版）"}</span>
                              <span className="mr-3">{output.is_enabled == 2 ? "削除" : (output.version == 1 ? "新規" : "修正")}</span>
                              <span className="mr-3">{output.updated_at.split('-').join('/')}</span>
                              <span className="mr-3">
                                {output.substitute_name !== "" && output.substitute_name != undefined
                                  ? doctor_list_by_number[output.instruction_doctor_number] + "、 入力者: " + output.substitute_name : doctor_list_by_number[output.instruction_doctor_number]}
                              </span>
                            </div>
                            <MedicineListWrapper>                            
                              <div className={`soap-data-item ${output.is_enabled == 2 ? "deleted-order" : ""}`}>
                                <div>
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">医師名</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {output.prev != undefined ? this.getChangePart(doctor_list_by_number[output.instruction_doctor_number], doctor_list_by_number[output.prev.instruction_doctor_number]):this.getChangePart(doctor_list_by_number[output.instruction_doctor_number], undefined)}
                                        </div>
                                      </div>
                                    </div>
                                    {(staff_list_by_number[output.nutrition_doctor_number] == undefined || staff_list_by_number[output.nutrition_doctor_number] == null || staff_list_by_number[output.nutrition_doctor_number] == "") && (output.prev == undefined || (output.prev != undefined && (staff_list_by_number[output.prev.nutrition_doctor_number] == undefined || staff_list_by_number[output.prev.nutrition_doctor_number] == null || staff_list_by_number[output.prev.nutrition_doctor_number] == ""))) ? (
                                      <></>
                                    ):(
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">依頼管理栄養士</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev != undefined ? this.getChangePart(staff_list_by_number[output.nutrition_doctor_number], staff_list_by_number[output.prev.nutrition_doctor_number]):this.getChangePart(staff_list_by_number[output.nutrition_doctor_number], undefined)}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">作成日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {output.prev != undefined ? this.getChangePart(output.write_date, output.prev.write_date):this.getChangePart(output.write_date, undefined)}
                                        </div>
                                      </div>
                                    </div>  
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "身長体重") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = JSON.parse(item.body);
                                          if (Object.keys(item_obj).length > 0) {
                                            return (
                                              <>                                                
                                                {Object.keys(item_obj).map(ele=>{
                                                  let label_name = "";
                                                  let ele_unit = "";
                                                  if (ele == "bmi") {
                                                    label_name = "BMI"
                                                  } else if(ele == "tall") {
                                                    label_name = "身長";
                                                    ele_unit = "cm";
                                                  } else if(ele == "weight") {
                                                    label_name = "体重";
                                                    ele_unit = "kg";
                                                  }
                                                  return (
                                                    <>
                                                      <div className="flex between drug-item table-row">
                                                        <div className="text-left">
                                                          <div className="table-item">{label_name}</div>
                                                        </div>
                                                        <div className="text-right">
                                                          <div className="table-item remarks-comment">
                                                            {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(item_obj[ele], this.getPrevItemDetailBody(output.prev.item, item.form_name, ele), ele_unit):this.getChangePart(item_obj[ele], undefined, ele_unit)}                                                            
                                                          </div>
                                                        </div>
                                                      </div>  
                                                    </>
                                                  );
                                                })}
                                              </>
                                            );
                                          }
                                        }
                                      }
                                    })}
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "臨床検査値") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = JSON.parse(item.body);
                                          if (item_obj.length > 0) {
                                            return (
                                              <>        
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">臨床検査値</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">                                                      
                                                    </div>
                                                  </div>
                                                </div>                                          
                                                {item_obj.map((ele, idx)=>{                                                  
                                                  return (
                                                    <>
                                                      <div className={`flex between drug-item table-row ${idx != (item_obj.length - 1) ? "no-bottom-line":""}`}>
                                                        <div className="text-left">
                                                          <div className="table-item">{ele.name}</div>
                                                        </div>
                                                        <div className="text-right">
                                                          <div className="table-item remarks-comment">
                                                            {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(ele.value, this.getPrevItemDetailBody(output.prev.item, item.form_name, idx), ele.unit):this.getChangePart(ele.value, undefined, ele.unit)}                                                            
                                                          </div>
                                                        </div>
                                                      </div>  
                                                    </>
                                                  );
                                                })}
                                              </>
                                            );
                                          }
                                        }
                                      }
                                    })}
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "処方") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = item.body;
                                          return (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">{item.form_name}</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {output.prev != undefined && output.prev.item != undefined ? this.getChangeDetailPart(item_obj, this.getPrevItemDetailBody(output.prev.item, item.form_name), item.form_name):this.getChangeDetailPart(item_obj, undefined, item.form_name)}
                                                  </div>
                                                </div>
                                              </div>  
                                            </>
                                          );
                                        }
                                      }
                                    })}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-center table-row" style={{border:'1px solid #ddd', borderTop:'none'}}>依頼内容</div>
                                    <div className="phy-box w70p" draggable="true">
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "依頼内容") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = JSON.parse(item.body);
                                          if (item_obj.length > 0) {
                                            return (
                                              <>
                                                {item_obj.map((ele, idx)=>{    
                                                  if(ele.default == "") {
                                                    if(output.prev != undefined && output.prev.item != undefined) {
                                                      if (this.getPrevItemDetailBody(output.prev.item, item.form_name, idx) == "" || this.getPrevItemDetailBody(output.prev.item, item.form_name, idx) == undefined) {                                                        
                                                        return (<></>);
                                                      } else {
                                                        return (
                                                          <>
                                                            <div className={`flex between drug-item table-row ${idx != (item_obj.length - 1) ? "no-bottom-line":""}`}>
                                                              <div className="text-left">
                                                                <div className="table-item">{ele.label}</div>
                                                              </div>
                                                              <div className="text-right">
                                                                <div className="table-item remarks-comment">
                                                                  {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(ele.default, this.getPrevItemDetailBody(output.prev.item, item.form_name, idx), ele.unit):this.getChangePart(ele.default, undefined, ele.unit)}                                                            
                                                                </div>
                                                              </div>
                                                            </div>  
                                                          </>
                                                        );
                                                      }                                                      
                                                    } else {
                                                      return (<></>);
                                                    }
                                                  } else {
                                                    return (
                                                      <>
                                                        <div className={`flex between drug-item table-row ${idx != (item_obj.length - 1) ? "no-bottom-line":""}`}>
                                                          <div className="text-left">
                                                            <div className="table-item">{ele.label}</div>
                                                          </div>
                                                          <div className="text-right">
                                                            <div className="table-item remarks-comment">
                                                              {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(ele.default, this.getPrevItemDetailBody(output.prev.item, item.form_name, idx), ele.unit):this.getChangePart(ele.default, undefined, ele.unit)}                                                            
                                                            </div>
                                                          </div>
                                                        </div>  
                                                      </>
                                                    );
                                                  }                                             
                                                })}
                                              </>
                                            );
                                          }
                                        }
                                      }
                                    })}
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "指示事項") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = JSON.parse(item.body);
                                          if (Object.keys(item_obj).length > 0) {
                                            return (
                                              <>                                                
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">{item.form_name}</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {Object.keys(item_obj).map(ele=>{    
                                                        return (
                                                          <>
                                                            {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(item_obj[ele], this.getPrevItemDetailBody(output.prev.item, item.form_name, ele, item.form_name), ele, item.form_name):this.getChangePart(item_obj[ele], undefined, ele, item.form_name)}                                                            
                                                          </>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                </div>  
                                              </>
                                            );
                                          }
                                        }
                                      }
                                    })}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-center table-row" style={{border:'1px solid #ddd', borderTop:'none'}}>指示報告</div>
                                    <div className="phy-box w70p" draggable="true">                                    
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{                                      
                                      let item_obj = "";
                                      if (item.form_name == "指導日") {
                                        if (item.body != null && item.body != "") {                                          
                                          item_obj = item.body!=null && item.body!=''? formatDateLine(new Date(item.body)):'';
                                          return (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">{item.form_name}</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(item_obj, this.getPrevItemDetailBody(output.prev.item, item.form_name)):this.getChangePart(item_obj, undefined)}                                                            
                                                  </div>
                                                </div>
                                              </div>  
                                            </>
                                          );
                                        }
                                      }
                                    })}                                    
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{                                      
                                      if (item.form_name == "指導開始日") {
                                        if (item.body != null && item.body != "") {                                          
                                          item_obj_start = item.body!=null && item.body!=''? formatTime(new Date(item.body)):'';
                                          if (output.prev != undefined && output.prev.item != undefined){
                                            item_obj_start = this.getChangePart(item_obj_start, this.getPrevItemDetailBody(output.prev.item, item.form_name));
                                          } else {
                                            item_obj_start = this.getChangePart(item_obj_start, undefined);
                                          }
                                        }
                                      }
                                      if (item.form_name == "指導終了日") {                                        
                                        if (item.body != null && item.body != "") {                                          
                                          item_obj_end = item.body!=null && item.body!=''? formatTime(new Date(item.body)):'';
                                          if (output.prev != undefined && output.prev.item != undefined){
                                            item_obj_end = this.getChangePart(item_obj_end, this.getPrevItemDetailBody(output.prev.item, item.form_name));
                                          } else {
                                            item_obj_end = this.getChangePart(item_obj_end, undefined);
                                          }
                                        }
                                        if (item_obj_start != '' || item_obj_end != ''){
                                          return (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">指導期間</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment flex">
                                                    <div>{item_obj_start}</div>
                                                    {item_obj_start != ''?'～':''}
                                                    <div>{item_obj_end}</div>                                                    
                                                  </div>
                                                </div>
                                              </div>  
                                            </>
                                          )                                          
                                        }
                                        item_obj_start ='';
                                        item_obj_end ='';
                                      }
                                    })}
                                    {/* {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "指導終了日") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = item.body!=null && item.body!=''? formatJapanDateTimeIE(new Date(item.body)).substring(0, 16).split("/").join("-"):'';
                                          return (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">{item.form_name}</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(item_obj, this.getPrevItemDetailBody(output.prev.item, item.form_name)):this.getChangePart(item_obj, undefined)}
                                                  </div>
                                                </div>
                                              </div>  
                                            </>
                                          );
                                        }
                                      }
                                    })} */}
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "指導事項") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = JSON.parse(item.body);
                                          if (Object.keys(item_obj).length > 0) {
                                            return (
                                              <>                                                
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">{item.form_name}</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {Object.keys(item_obj).map(ele=>{  
                                                        return (
                                                          <>
                                                            {output.prev != undefined && output.prev.item != undefined ? this.getChangePart(item_obj[ele], this.getPrevItemDetailBody(output.prev.item, item.form_name, ele, item.form_name), ele, item.form_name):this.getChangePart(item_obj[ele], undefined, ele, item.form_name)}                                                            
                                                          </>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                </div>  
                                              </>
                                            );
                                          }
                                        }
                                      }
                                    })}
                                    {output.item != undefined && output.item != null && output.item.length > 0 && output.item.map(item=>{
                                      let item_obj = "";
                                      if (item.form_name == "総合所見") {
                                        if (item.body != null && item.body != "") {
                                          item_obj = item.body;
                                          return (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">{item.form_name}</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {output.prev != undefined && output.prev.item != undefined ? this.getChangeDetailPart(item_obj, this.getPrevItemDetailBody(output.prev.item, item.form_name)):this.getChangeDetailPart(item_obj, undefined)}                                                            
                                                  </div>
                                                </div>
                                              </div>  
                                            </>
                                          );
                                        }
                                      }
                                    })}
                                    
                                  </div>
                                </div>
                              </div>
                            </MedicineListWrapper>
                          </div>
                        </div>
                      </TabContent>
                    </>
                  )
                }                  
              })}
              {this.state.complete_message !== '' && (
                <CompleteStatusModal
                  message = {this.state.complete_message}
                />
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} id='log_cancel_id' className="cancel-btn">閉じる</Button>
          {/*<Button onClick={this.printLog} id='log_print_id' className={print_disable ? "disable-btn" : "red-btn"}>印刷</Button>*/}
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeNutritionGuildModal.contextType = Context;

ChangeNutritionGuildModal.propTypes = {
  closeModal: PropTypes.func,
  // getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  // insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
  otherFacilitiesData: PropTypes.array,
  otherFacilitiesDepartmentDatas: PropTypes.array,
  otherFacilitiesDoctors: PropTypes.array,
};

export default ChangeNutritionGuildModal;