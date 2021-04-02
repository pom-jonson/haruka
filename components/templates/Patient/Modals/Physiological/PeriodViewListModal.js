import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import InputWithLabel from "~/components/molecules/InputWithLabel";
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import encoding from "encoding-japanese";
import Papa from "papaparse";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .inspection-period {
        .period-title {
            line-height: 30px;
            width: 100px;
        }
        div {
            margin-top: 0;
        }
        .from-to{
            padding-left:5px;
            padding-right:5px;
            line-height: 30px;
        }
        .label-title {
            width: 0;
            margin: 0;
        }
    }
    .btn-area {
        margin-top: 10px;
    }
    
    .view-mode-area {
        margin-top: 10px;
        height: calc(100% - 90px);
        .table-menu {
            display: inline-flex;
            background-color: #e2caff;
        }
        .inline-flex {
            display: inline-flex;
            margin-top: -1px;
        }
        .date-box {
            border:1px solid #aaa;
            width: 120px;
            text-align:center;
            background-color: #e2caff;
        }
        .time-box {
            border:1px solid #aaa;
            width: 50px;
            text-align:center;
        }
        margin-bottom:0;
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

class PeriodViewListModal extends Component {
  constructor(props) {
    super(props);
    let cur_date = new Date();
    this.state = {
      start_date:new Date(),
      end_date: new Date(cur_date.getTime() + 60 * 60 * 24 * 7 * 1000),
      alert_messages:"",
      status_list:null,
    };
  }
  
  async componentDidMount() {
  }
  
  searchList=async()=>{
    if(this.state.start_date == null || this.state.start_date === "" || this.state.end_date == null || this.state.end_date === ""){
      let base_modal = document.getElementsByClassName("period-view-list-modal")[0];
      if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
      }
      this.setState({alert_messages:"期間を設定してください。"});
      return;
    }
    let path = "/app/api/v2/master/inspection/reservation/status_list";
    let post_data = {
      group_code:this.props.group_code,
      frame_code:this.props.frame_code,
      start_date:formatDateLine(this.state.start_date),
      end_date:formatDateLine(this.state.end_date),
      target_table:this.props.target_table,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res.time === undefined){
          this.setState({
            status_list:{},
          });
        } else {
          this.setState({
            status_list:res.order,
            time_master:res.time,
          });
        }
      })
      .catch(() => {
      
      })
  };
  
  setInspectionPeriod=(key,value)=>{
    this.setState({[key]:value});
  };
  
  closeModal=()=>{
    this.setState({alert_messages:""});
    let base_modal = document.getElementsByClassName("period-view-list-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
  };
  
  createTableHead=()=>{
    let table_data = [];
    this.state.time_master.map(time=>{
      table_data.push(
        <div className={'time-box'}>{time.start_time}</div>
      );
    });
    return table_data;
  };
  
  getStyle=(type)=>{
    let base_modal = document.getElementsByClassName("period-view-list-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      let modal_width = document.getElementsByClassName("period-view-list-modal")[0].getElementsByClassName("modal-body")[0].offsetWidth;
      let table_width = this.state.time_master.length * 50 + 120 +50;
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
  
  creatTableBody=(data)=>{
    let table_data = [];
    let total_count = 0;
    Object.keys(data).map((index)=>{
      total_count += data[index];
      table_data.push(
        <div className={'time-box'}>{data[index] == 0 ? "" : data[index]}</div>
      );
    });
    table_data.push(
      <div className={'time-box'}>{total_count == 0 ? "" : total_count}</div>
    );
    return table_data;
  };
  
  downLoadCsv=()=>{
    if(this.state.status_list != null && Object.keys(this.state.status_list).length > 0){
      let data = [];
      let head_line = ['予約日'];
      this.state.time_master.map(time=>{
        head_line.push(time.start_time);
      });
      head_line.push('合計');
      data.push(head_line);
      Object.keys(this.state.status_list).map((date)=>{
        let item = this.state.status_list[date];
        let data_item = [formatJapanDateSlash(date)];
        let total_count = 0;
        Object.keys(item).map((index)=>{
          total_count += item[index];
          data_item.push(item[index] == 0 ? "" : item[index]);
        });
        data_item.push(total_count == 0 ? "" : total_count);
        data.push(data_item);
      });
      
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
      
      aTag.download = (this.props.order_type === 1 ? "生理検査" : (this.props.order_type === 2 ? "内視鏡検査" : "放射線"))+'予約状況一覧（期間表示）.csv';
      
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
          className="custom-modal-sm patient-exam-modal inspection-status-list-modal period-view-list-modal"
        >
          <Modal.Header><Modal.Title>{this.props.order_type === 1 ? "生理検査" : (this.props.order_type === 2 ? "内視鏡検査" : "放射線")}予約状況一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className={'inspection-period flex'}>
                  <div className={'period-title'}>期間設定</div>
                  <InputWithLabel
                    type="date"
                    getInputText={this.setInspectionPeriod.bind(this, 'start_date')}
                    diseaseEditData={this.state.start_date}
                  />
                  <div className={'from-to'}>～</div>
                  <InputWithLabel
                    type="date"
                    getInputText={this.setInspectionPeriod.bind(this, 'end_date')}
                    diseaseEditData={this.state.end_date}
                  />
                </div>
                <div style={{width:"calc(100% - 502px)", textAlign:"right"}}>
                  <button onClick={this.props.closeModal} style={{marginRight:"6px"}}>閉じる</button>
                </div>
              </div>
              <div className={'flex btn-area'}>
                <button onClick={this.searchList}>期間表示</button>
                <div className={'space-area'} style={{width:"calc(100% - 270px)"}}> </div>
                <button style={{marginLeft:"12px"}} onClick={this.downLoadCsv}>ファイル出力</button>
              </div>
              {this.state.status_list != null && Object.keys(this.state.status_list).length === 0 && (
                <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
              )}
              {this.state.status_list != null && Object.keys(this.state.status_list).length > 0 && (
                <div className={'view-mode-area'}>
                  <div style={{float:this.getStyle('float'), display:this.getStyle('display'), marginBottom:this.getStyle('margin-bottom')}}>
                    <div className={'table-menu'}>
                      <div className={'date-box'}>予約日</div>
                      {this.createTableHead()}
                      <div className={'time-box'}>合計</div>
                    </div>
                  </div>
                  {Object.keys(this.state.status_list).map((date)=>{
                    let data = this.state.status_list[date];
                    return (
                      <>
                        <div style={{float:this.getStyle('float'), display:this.getStyle('display')}}>
                          <div className={'inline-flex'}>
                            <div className={'date-box'}>{formatJapanDateSlash(date)}</div>
                            {this.creatTableBody(data)}
                          </div>
                        </div>
                      </>
                    )
                  })}
                </div>
              )}
            </Wrapper>
            {this.state.alert_messages !== "" && (
              <SystemAlertModal
                hideModal= {this.closeModal.bind(this)}
                handleOk= {this.closeModal.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

PeriodViewListModal.contextType = Context;
PeriodViewListModal.propTypes = {
  closeModal: PropTypes.func,
  group_code: PropTypes.number,
  frame_code: PropTypes.number,
  order_type: PropTypes.number,
  target_table: PropTypes.string,
};

export default PeriodViewListModal;