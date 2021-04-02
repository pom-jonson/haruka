import React, { Component } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import axios from "axios";
import { formatJapanDate, getPrevDayByJapanFormat, getNextDayByJapanFormat, formatDateLine } from "~/helpers/date";
import * as methods from "../Dial/DialMethods";
import XRayPreviewModal from "./XRayPreviewModal";
import XRayRecordModal from "./XRayRecordModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {getTimeZoneList} from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import Checkbox from "~/components/molecules/Checkbox";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .footer {
    clear:both;
  }
  .flex{
      display:flex;
      .label-title{
        width: 6rem;
        text-align: right;
        margin-right: 11px;
        font-size: 1rem;
      }
      .pullbox-label, .pullbox-select{
          width:5.5rem;
      }
      .date-label{
        margin-left: 50px;
        margin-right: 1rem;
        padding-top: 3px;
      }
  }
  .prev-day {
    cursor: pointer;
    padding-right: 0.625rem;
    display: inline-block;
    font-size: 1.25rem;
  }
  .next-day {
    cursor: pointer;
    padding-left: 0.625rem;
    display: inline-block;
    font-size: 1.25rem;
    margin-right:1rem;
  }
  .react-datepicker-wrapper{
    font-size: 1.25rem;
  }
  .day-area{
    margin: 1.25rem 0px 0.625rem 0px;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: calc( 100vh - 250px);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  overflow-y: auto;
  label {
      text-align: right;
  }
  table {
    overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 60px;
      }
      .item-no {
        width: 50px;
      }
      .code-number {
          width: 120px;
      }
  }

  .second-th th{
    background: white;
  }

  .table th, .table td{
    vertical-align: middle;
  }
  
 `;


class XRayLetter extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    let time_zones_list = getTimeZoneList();
    var time_zones = [{id:0, value:''}];
    if (time_zones_list != undefined && time_zones_list.length > 0){
      time_zones_list.map(item => {
        time_zones.push(item);
      })
    }
    this.state = {
      table_list: [],
      x_ray_date: new Date(),
      isOpenPreviewModal: false,
      isOpenRadiationRecordModal:false,
      facility_data:[],
      
      time_zones,
      floor:'',
      time_zone:0,
      all_check:false,
    }
  }
  
  async componentDidMount(){
    this.searchXRayData();
  }
  
  searchXRayData = async () => {
    let cur_date = this.state.x_ray_date ? formatDateLine(this.state.x_ray_date) : "";
    let path = "/app/api/v2/dial/print/x_ray_search";
    let post_data = {
      from_date: cur_date,
      end_date: cur_date,
      floor: this.state.floor,
      time_zone:this.state.time_zone,
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      table_list: data != null && data != undefined && data.length > 0 ? data[0] : [],
      facility_data:data[1],
      all_check:false,
    });
  }
  
  PrevDay = () => {
    let now_day = this.state.x_ray_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ x_ray_date: cur_day}, () => {
      this.searchXRayData();
    });
  };
  
  NextDay = () => {
    let now_day = this.state.x_ray_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ x_ray_date: cur_day}, () => {
      this.searchXRayData();
    });
  };
  
  getDate = value => {
    this.setState({
      x_ray_date: value,
    }, () => {
      this.searchXRayData();
    });
  };
  
  
  openPreviewModal = () => {
    var patient_list = this.print_filter(this.state.table_list);
    if (patient_list == undefined){
      window.sessionStorage.setItem("alert_messages", '患者様を1人以上選択してください。');
      return;
    }
    this.setState({
      patient_list,
      isOpenPreviewModal: true,
      all_print:0,
    });
  }
  openPreviewListModal = () => {
    this.setState({
      patient_list: this.state.table_list,
      isOpenPreviewModal: true,
      all_print:1,
    });
  }
  
  closeModal = () => {
    this.setState({
      isOpenPreviewModal: false,
      isOpenRadiationRecordModal:false,
    });
  };
  getfloor = e => {
    this.setState({floor:e.target.value}, () => {
      this.searchXRayData();
    })
  }
  
  gettime = e => {
    this.setState({time_zone:e.target.id}, () => {
      this.searchXRayData();
    })
  }
  
  getRadio = (index,  name, value) => {
    var temp = this.state.table_list;
    if (name == 'check'){
      temp[index].is_selected = value;
      this.setState({table_list:temp});
    }
    if (name == 'all_check'){
      temp.map(item => {
        item.is_selected = value;
      })
      this.setState({
        table_list:temp,
        all_check:value
      })
    }
  }
  
  getCanclick(){
    let can_click = false;
    if (this.state.table_list != undefined && this.state.table_list != null && this.state.table_list.length > 0){
      this.state.table_list.map(item=>{
        if (item.is_selected) can_click = true;
      });
    }
    return can_click;
  }
  
  openRadiationRecord = () => {
    var patient_list = this.print_filter(this.state.table_list);
    if (patient_list == undefined){
      window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
      return;
    }
    this.setState({
      patient_list,
      isOpenRadiationRecordModal:true});
  }
  
  print_filter = (data) => {
    if (data == undefined || data == null || data.length == 0 ) return undefined;
    var new_data = [];
    var index = 0;
    if (data.length > 0){
      data.map((item) => {
        if (item.is_selected){
          new_data[index] = item;
          index++;
        }
      })
    } else {
      Object.keys(data).map(key => {
        if (data[key].is_selected){
          new_data[index] = data[key];
          index++;
        }
      })
    }
    
    
    if (new_data.length == 0) return undefined;
    return new_data;
  }
  
  handleOK =()=> {
    this.closeModal();
    this.searchXRayData();
  }
  
  render() {
    let {table_list} = this.state;
    var floors = [
      {id:0, value:''},
      {id:1, value:'2F'},
      {id:2, value:'3F'},
    ];
    let can_click = this.getCanclick();
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    var patient_list = this.print_filter(table_list);
    return (
      <Card>
        <div className="title">X線照射録</div>
        <div className="day-area flex">
          <SelectorWithLabel
            options={floors}
            title="フロアー"
            getSelect={this.getfloor}
            departmentEditCode={this.state.floor}
          />
          <SelectorWithLabel
            options={this.state.time_zones}
            title="時間帯"
            getSelect={this.gettime}
            departmentEditCode={this.state.time_zone}
          />
          <label className='date-label' style={{cursor:"text"}}>照射録日付</label>
          <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
          <DatePicker
            locale="ja"
            selected={this.state.x_ray_date}
            onChange={this.getDate.bind(this)}
            dateFormat="yyyy/MM/dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            customInput={<ExampleCustomInput />}
            dayClassName = {date => setDateColorClassName(date)}
          />
          <div className="next-day" onClick={this.NextDay}>{" >"}</div>
          <div className='footer-buttons'>
            <Button style={{position:'absolute', right:'2rem'}} className={patient_list!=undefined?'':'disable-btn'} onClick={this.openRadiationRecord}>照射条件</Button>
          </div>
        </div>
        <Wrapper>
          <table className="table table-bordered table-hover" id="code-table">
            <thead>
            <tr>
              <th className="item-no" rowSpan={2}>
                <Checkbox
                  label=""
                  getRadio={this.getRadio.bind(this, 0)}
                  value={this.state.all_check}
                  checked = {this.state.all_check}
                  name="all_check"
                />
              </th>
              <th className="name" rowSpan={2}>氏名</th>
              <th className="code-number" rowSpan={2}>患者番号</th>
              <th className="name" rowSpan={2}>性別</th>
              <th className="" rowSpan={2}>年齢</th>
              <th className="" rowSpan={2}>撮影部位</th>
              <th className="" colSpan={5}>撮影方法</th>
              <th className="" rowSpan={2}>技師サイン</th>
              <th className="" rowSpan={2}>コメント</th>
            </tr>
            <tr className="second-th">
              <th>KVP</th>
              <th>mA</th>
              <th>Sec</th>
              <th>FED</th>
              <th>リス</th>
            </tr>
            </thead>
            <tbody>
            {table_list !== undefined && table_list !== null && table_list.length > 0 && (
              table_list.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td style={{textAlign:'center'}}>
                        <Checkbox
                          label=""
                          getRadio={this.getRadio.bind(this, index)}
                          value={item.is_selected}
                          checked = {item.is_selected}
                          name="check"
                        />
                      </td>
                      <td className="text-left ml-1">{item.patient_name}</td>
                      <td className="text-right mr-1">{item.patient_number}</td>
                      <td>{item.gender == 1 ? "男": item.gender == 2 ? "女" : ""}</td>
                      <td className="text-right mr-1">{item.age}</td>
                      <td>{item.body_part}</td>
                      <td className="text-right mr-1">{item.kvp}</td>
                      <td className="text-right mr-1">{item.ma}</td>
                      <td className="text-right mr-1">{item.sec}</td>
                      <td className="text-right mr-1">{item.fed}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>)
              })
            )}
            </tbody>
          </table>
        </Wrapper>
        <div className="footer-buttons">
          <Button onClick={this.openPreviewListModal.bind(this)} className={'red-btn'}>帳票プレビュー（一覧）</Button>
          <Button onClick={this.openPreviewModal} className={can_click == true? "red-btn" : "disable-btn"}>帳票プレビュー（個別）</Button>
        </div>
        
        {this.state.isOpenPreviewModal!== false && this.state.patient_list != undefined && this.state.patient_list.length>0 && (
          <XRayPreviewModal
            closeModal={this.closeModal}
            contents={this.state.patient_list}
            cur_date={formatJapanDate(this.state.x_ray_date)}
            facility_data={this.state.facility_data}
            all_print={this.state.all_print}
            time_zone={this.state.time_zone}
            floor={this.state.floor}
            x_ray_date={this.state.x_ray_date}
          />
        )}
        {this.state.isOpenRadiationRecordModal!== false && this.state.patient_list != undefined && this.state.patient_list.length>0 && (
          <XRayRecordModal
            handleOK = {this.handleOK}
            closeModal={this.closeModal}
            contents={this.state.patient_list}
            cur_date={formatJapanDate(this.state.x_ray_date)}
          />
        )}
      </Card>
    )
  }
}

export default XRayLetter