import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import PeriodViewListModal from "./PeriodViewListModal";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import encoding from "encoding-japanese";
import Papa from "papaparse";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  .flex {display: flex;}
  font-size:1rem;
  .reservation-type {
      .label-title {
        width: 12.5rem;
        line-height: 2rem;
        font-size: 1rem;
      }
      .pullbox-label {
        select {
          width: 15rem;
          font-size: 1rem;
          height: 2rem;
        }
      }
  }
  .select-layout {
    margin-left: 1rem;
    label{
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
  .select-date {
    .prev-day {
      cursor: pointer;
      border: 1px solid #aaa;
      background-color: white;
      line-height: 30px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .next-day {
      cursor: pointer;
      border: 1px solid #aaa;
      background-color: white;
      line-height: 30px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .select-today {
      cursor: pointer;
      border: 1px solid #aaa;
      background-color: white;
      line-height: 30px;
      margin-left: 5px;
      margin-right: 5px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .react-datepicker-wrapper {
      margin-left: 5px;
      input {
          height: 32px;
          width:6rem;
          font-size:1rem;
      }
    }
  }
  .select-view-mode {
    width: calc(100% - 310px);
    padding-left: 10px;
    label {
      padding-left: 5px;
      font-size: 1rem;
      line-height: 2rem;
    }
  }
  .view-mode-area {
    margin-top: 0.5rem;
    height: calc(100vh - 21rem);
    margin-bottom: 0px;
    overflow-y: auto;
    .table-menu {
        display: inline-flex;
        background-color: #e2caff;
    }
    .inline-flex {
        display: inline-flex;
        margin-top: -1px;
    }
    .time-box {
        border:1px solid #aaa;
        width: 110px;
        text-align:center;
        background-color: #e2caff;
    }
    .person-box {
        border:1px solid #aaa;
        width: 50px;
        text-align:center;
    }
    .td-height {
      height:110px;
      line-height: 110px;
    }
    .number-box {
      border:1px solid #aaa;
      width: 140px;
      text-align:center;
    }
    .patient-box {
      border:1px solid #aaa;
      width: 140px;
      padding-left: 5px;
      background: rgb(254, 241, 207);
      padding-top: 5px;
      padding-bottom: 5px;
    }
    margin-bottom:0;
  }
  .simple-mode-area {
    margin-top: 0.5rem;
    height: calc(100% - 200px);
    margin-bottom:0;
    table {margin-bottom: 0;}
    thead{
      display: table;
      width:400px;
    }
    tbody{
      height: calc(100vh - 23rem);
      overflow-y:auto;
      display:block;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    tr{
      display: table;
      width:400px
      box-sizing: border-box;
    }
    td {
      padding: 0.25rem;
      text-align: left;
    }
    th {
      color: black;
      text-align: center;
      padding: 0.3rem;
    }
  }
  .no-result {
    padding: 200px;
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
`;

class InspectionStatusList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group_master:[{id:0, value:""}],
      frame_master_data:[],
      frame_master:[{id:0, value:""}],
      group_code:0,
      frame_code:0,
      frame_name:"",
      set_window:0,
      reservation_date:new Date(),
      view_mode:1,
      alert_messages:"",
      status_list:null,
      col_count:0,
    };
    this.frame_name = "";
  }
  
  async componentDidMount() {
    await this.getCondition();
  }
  
  getCondition=async()=>{
    let path = "/app/api/v2/master/inspection/reservation_list/getCondition";
    let post_data = {
      order_type:1,
      start_date:this.state.reservation_date !== '' ? formatDateLine(this.state.reservation_date) : '' ,
      end_date:this.state.reservation_date !== '' ? formatDateLine(this.state.reservation_date) : '' ,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        let group_master = [{id:0, value:""}];
        if(res.group_master.length > 0){
          res.group_master.map(group=>{
            group_master.push({id:parseInt(group.group_code), value:group.group_name})
          });
        }
        this.setState({
          group_master,
          frame_master_data:res.frame_master,
        });
      })
      .catch(() => {
      
      })
  };
  
  searchList=async()=>{
    if(this.state.group_code === 0){
      this.setState({alert_messages:"予約グループコード/名称を選択してください。"});
      return;
    }
    if(this.state.frame_code === 0){
      this.setState({alert_messages:"予約枠名称を選択してください。"});
      return;
    }
    if(this.state.reservation_date == null || this.state.reservation_date === ""){
      this.setState({alert_messages:"予約日付を選択してください。"});
      return;
    }
    let path = "/app/api/v2/master/inspection/reservation/status_list";
    let post_data = {
      group_code:this.state.group_code,
      frame_code:this.state.frame_code,
      reservation_date:formatDateLine(this.state.reservation_date),
      target_table:"inspection_order",
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res.status_data === undefined){
          this.setState({
            status_list:{},
            col_count:0,
          });
        } else {
          this.setState({
            status_list:res.status_data,
            col_count:res.col_count,
          });
          this.frame_name = this.state.frame_name;
        }
        
      })
      .catch(() => {
      
      })
  };
  
  setReservationGroupCode = (e) => {
    let group_code = parseInt(e.target.id);
    let frame_master = [{id:0, value:""}];
    if(group_code !== 0 && Object.keys(this.state.frame_master_data) > 0 && this.state.frame_master_data[group_code] !== undefined){
      let frame_data = this.state.frame_master_data[group_code];
      if(frame_data.length > 0){
        frame_data.map(frame=>{
          let frame_info = {id:frame.frame_code, value:frame.frame_name};
          frame_master.push(frame_info);
        })
      }
    }
    this.setState({
      group_code,
      frame_master,
      frame_code:0,
    });
  };
  
  setReservationFrameName = (e) => {
    this.setState({
      frame_code:parseInt(e.target.id),
      frame_name:e.target.value,
    });
  };
  
  setWindow = (e) => {
    this.setState({set_window:parseInt(e.target.value)});
  };
  
  setViewMode = (e) => {
    this.setState({view_mode:parseInt(e.target.value)});
  };
  
  moveDay = (type) => {
    let now_day = this.state.reservation_date;
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      reservation_date: cur_day,
    });
  };
  
  selectToday=()=>{
    this.setState({
      reservation_date: new Date(),
    });
  };
  
  setInspectionDATE = value => {
    this.setState({
      reservation_date: value,
    });
  };
  
  closeModal=()=>{
    this.setState({
      isPeriodViewListModal: false,
      alert_messages:"",
    });
  };
  
  openPeriodViewListModal=()=>{
    if(this.state.group_code === 0){
      this.setState({alert_messages:"予約グループコード/名称を選択してください。"});
      return;
    }
    if(this.state.frame_code === 0){
      this.setState({alert_messages:"予約枠名称を選択してください。"});
      return;
    }
    this.setState({isPeriodViewListModal:true,});
  };
  
  createTableHead=()=>{
    let table_data = [];
    for (let i = 0; i < this.state.col_count; i ++){
      table_data.push(
        <div className={'number-box'}>{i+1}</div>
      );
    }
    return table_data;
  };
  
  creatTableBody=(data)=>{
    let table_data = [];
    for (let i = 0; i < this.state.col_count; i ++){
      if(data['order'] !== undefined && data['order'][i] !== undefined){
        let patient = data['order'][i];
        table_data.push(
          <div className={'patient-box'}>
            <span>ID {patient.patient_number}</span><br/>
            <span>{patient.patient_name_kana}</span><br/>
            <span>{patient.patient_name}</span><br/>
            <span>{this.frame_name}</span>
          </div>
        );
      } else {
        table_data.push(
          <div className={'number-box td-height'}> </div>
        );
      }
    }
    return table_data;
  };
  
  getStyle=(type)=>{
    let base_modal = document.getElementsByClassName("inspection-status-list-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      let modal_width = document.getElementsByClassName("inspection-status-list-modal")[0].getElementsByClassName("modal-body")[0].offsetWidth;
      let table_width = this.state.col_count * 140 + 110 +50;
      if(modal_width > table_width){
        if(type === 'float'){
          return '';
        }
        if(type === 'display'){
          return 'flex';
        }
        if(type === 'margin-bottom'){
          return '0px';
        }
      } else {
        if(type === 'float'){
          return 'left';
        }
        if(type === 'display'){
          return 'block';
        }
        if(type === 'margin-bottom'){
          return '-6px';
        }
      }
    } else {
      return '';
    }
  };
  
  downLoadCsv=()=>{
    if(this.state.status_list != null && Object.keys(this.state.status_list).length > 0){
      let data = [];
      if(this.state.view_mode === 1){
        let head_line = ['', '',];
        for (let i = 0; i < this.state.col_count; i ++){
          head_line.push(i+1);
        }
        data.push(head_line);
        Object.keys(this.state.status_list).map(date=>{
          let item = this.state.status_list[date];
          let data_item = [
            item.start_time +'～'+ item.end_time,
            (item.order !== undefined ? item.order.length : 0)+'/'+item.max_count,
          ];
          
          for (let i = 0; i < this.state.col_count; i ++){
            if(item['order'] !== undefined && item['order'][i] !== undefined){
              let patient = item['order'][i];
              data_item.push(patient.patient_name.trim()+'（'+patient.patient_number+'）');
            } else {
              data_item.push('');
            }
          }
          data.push(data_item);
        });
      } else {
        let head_line = ['予約時間', '取得状況',];
        data.push(head_line);
        Object.keys(this.state.status_list).map(date=>{
          let item = this.state.status_list[date];
          let data_item = [item.start_time +'～'+ item.end_time, (item.order !== undefined ? item.order.length : 0)+'/'+item.max_count];
          data.push(data_item);
        });
      }
      
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
      
      if(this.state.view_mode === 1){
        aTag.download = '生理検査予約状況一覧（詳細）.csv';
      } else {
        aTag.download = '生理検査予約状況一覧（簡易）.csv';
      }
      
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
  
  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal inspection-status-list-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>生理検査予約状況一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div className={'reservation-type'}>
                    <SelectorWithLabel
                      title="予約グループコード/名称"
                      options={this.state.group_master}
                      getSelect={this.setReservationGroupCode}
                      departmentEditCode={this.state.group_code}
                    />
                    <SelectorWithLabel
                      title="予約枠名称"
                      options={this.state.frame_master}
                      getSelect={this.setReservationFrameName}
                      departmentEditCode={this.state.frame_code}
                    />
                  </div>
                  <div className={'select-layout'}>
                    <div>選択モード</div>
                    <Radiobox
                      label={'初期ウインドウのみ'}
                      value={0}
                      getUsage={this.setWindow.bind(this)}
                      checked={this.state.set_window === 0}
                      disabled={true}
                      name={`set_window`}
                    />
                    <Radiobox
                      label={'全ウインドウ'}
                      value={1}
                      getUsage={this.setWindow.bind(this)}
                      checked={this.state.set_window === 1}
                      disabled={true}
                      name={`set_window`}
                    />
                  </div>
                </div>
                <div className={'flex select-date'}>
                  <div className="prev-day" onClick={this.moveDay.bind(this, 'prev')}>{"＜ "}</div>
                  <div className={'select-today'} onClick={this.selectToday.bind()}>本日</div>
                  <div className="next-day" onClick={this.moveDay.bind(this, 'next')}>{" ＞"}</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.reservation_date}
                    onChange={this.setInspectionDATE.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="年/月/日"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <div style={{marginLeft:"0.5rem"}}><Button type="common" onClick={this.openPeriodViewListModal.bind(this)}>期間表示</Button></div>
                </div>
                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                  <Button type="common" onClick={this.searchList.bind(this)}>最新</Button>
                  <div className={'flex select-view-mode'}>
                    <div style={{lineHeight:"2rem"}}>表示モード</div>
                    <Radiobox
                      label={'簡易'}
                      value={0}
                      getUsage={this.setViewMode.bind(this)}
                      checked={this.state.view_mode === 0}
                      disabled={true}
                      name={`view_mode`}
                    />
                    <Radiobox
                      label={'詳細'}
                      value={1}
                      getUsage={this.setViewMode.bind(this)}
                      checked={this.state.view_mode === 1}
                      disabled={true}
                      name={`view_mode`}
                    />
                  </div>
                </div>
                {this.state.status_list != null && Object.keys(this.state.status_list).length === 0 && (
                  <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                )}
                {this.state.status_list != null && Object.keys(this.state.status_list).length > 0 && this.state.view_mode === 1 && (
                  <div className={'view-mode-area'}>
                    <div style={{float:this.getStyle('float'), display:this.getStyle('display'), marginBottom:this.getStyle('margin-bottom')}}>
                      <div className={'table-menu'}>
                        <div className={'time-box'}> </div>
                        <div className={'person-box'}> </div>
                        {this.createTableHead()}
                      </div>
                    </div>
                    {Object.keys(this.state.status_list).map((index)=>{
                      let data = this.state.status_list[index];
                      return (
                        <>
                          <div style={{float:this.getStyle('float'), display:this.getStyle('display')}}>
                            <div className={'inline-flex'}>
                              <div className={'time-box td-height'}>{data.start_time +'～'+ data.end_time}</div>
                              <div className={'person-box td-height'}>{data.order !== undefined ? data.order.length : 0}{'/'+data.max_count}</div>
                              {this.creatTableBody(data)}
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>
                )}
                {this.state.status_list != null && Object.keys(this.state.status_list).length > 0 && this.state.view_mode === 0 && (
                  <div className={'simple-mode-area'}>
                    <table className="table-scroll table table-bordered">
                      <thead>
                      <tr>
                        <th style={{width:"110px"}}>予約時間</th>
                        <th style={{width:"110px"}}>取得状況</th>
                      </tr>
                      </thead>
                      <tbody>
                      {Object.keys(this.state.status_list).map((index)=>{
                        let data = this.state.status_list[index];
                        return (
                          <>
                            <tr>
                              <td className={'text-center'} style={{width:"110px"}}>{data.start_time +'～'+ data.end_time}</td>
                              <td className={'text-center'} style={{width:"110px"}}>{data.order !== undefined ? data.order.length : 0}{'/'+data.max_count}</td>
                            </tr>
                          </>
                        )
                      })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            <Button
              className={(this.state.status_list != null && Object.keys(this.state.status_list).length > 0) ? "red-btn" : "disable-btn"}
              onClick={this.downLoadCsv}
              isDisabled={(this.state.status_list != null && Object.keys(this.state.status_list).length > 0) ? true : false}
            >ファイル出力</Button>
          </Modal.Footer>
          {this.state.isPeriodViewListModal && (
            <PeriodViewListModal
              closeModal={this.closeModal}
              group_code={this.state.group_code}
              frame_code={this.state.frame_code}
              target_table={"inspection_order"}
              order_type={1}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

InspectionStatusList.contextType = Context;
InspectionStatusList.propTypes = {
  closeModal: PropTypes.func,
};

export default InspectionStatusList;