import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";
import {secondary} from "../../../../_nano/colors";
import { surface } from "~/components/_nano/colors";
import {formatDateLine, formatJapan, formatJapanDateSlash} from "../../../../../helpers/date";
import * as apiClient from "~/api/apiClient";
import axios from "axios/index";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Papa from 'papaparse';
import encoding from 'encoding-japanese';
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {getInspectionName} from "~/helpers/constants";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-sizr:1rem;
  .flex {display: flex;}
  .head-area {
    label {
      width: 5rem;
      text-align: right;
      margin-right: 0.5rem;
      line-height:2rem;
      height:2rem;
      margin-bottom: 0;
    }
  }
  .table-area {
    width:100%;
    margin-top:0.5rem;
  }
  table {
    margin:0px;
    font-size: 1rem;
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(100vh - 21.5rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
      display: table;
      width: 100%;
    }
    thead{
      display:table;
      width:100%;
      tr{width: calc(100% - 17px);}
      border-bottom: 1px solid #dee2e6;
      background-color: ${secondary};
      color: ${surface};
    }
    td {
      padding: 0.25rem;
      word-break: break-all;
      font-size: 1rem;
      vertical-align: top;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    th {
      font-size: 1.25rem;
      text-align: center;
      padding: 0.3rem 0;
      border-bottom: none;
      border-top: none;
      font-weight: normal;
    }
  }
  .no-result {
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InspectionListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_data:null,
      alert_messages:"",
      complete_message:"",
    };
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }
  
  async componentDidMount() {
    await this.searchList();
  }
  
  searchList = async () => {
    if(this.state.list_data != null){
      this.setState({ list_data:null });
    }
    let path = "/app/api/v2/master/inspection/searchByCondition";
    let post_data = {
      target_table:"inspection_order",
      state:this.props.conditions.inspection_state,
      group_code:this.props.conditions.inspection_id,
      frame_codes:this.props.conditions.frame_codes,
      start_date:this.props.conditions.start_date !== '' ? formatDateLine(this.props.conditions.start_date) : '' ,
      end_date:this.props.conditions.end_date !== '' ? formatDateLine(this.props.conditions.end_date) : '' ,
      karte_status:this.props.conditions.karte_status,
      department_codes:this.props.conditions.department_codes
    };
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          this.setState({ list_data:res });
        }
      })
      .catch(() => {
      
      })
  };
  
  getFrameNames=(type=null)=>{
    let html = [];
    let frame_data = '';
    if(this.props.conditions.frame_master.length > 0){
      this.props.conditions.frame_master.map(frame=>{
        if(this.props.conditions.frame_codes.includes(frame['frame_code'])){
          if(html.length > 0){
            frame_data = frame_data+'、'+frame['frame_name'];
            html.push(
              <>
                <span>{'、'+frame['frame_name']}</span>
              </>
            
            )
          } else {
            frame_data = frame_data+frame['frame_name'];
            html.push(
              <>
                <span>{frame['frame_name']}</span>
              </>
            )
          }
        }
      })
    }
    if(type === 'html'){
      return html;
    } else {
      return frame_data;
    }
  };
  
  printPdf=async()=>{
    if(this.state.list_data != null && this.state.list_data.length > 0){
      let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
      if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
      }
      this.setState({complete_message:"印刷中"});
      let path = "/app/api/v2/master/inspection/reservation_list/print_pdf";
      let print_data = {};
      print_data.list_data = this.state.list_data;
      print_data.period = formatJapanDateSlash(formatDateLine(this.props.conditions.start_date))+'～'+formatJapanDateSlash(formatDateLine(this.props.conditions.end_date));
      print_data.inspection_name = this.props.conditions.inspection_name === '' ? '全て' : this.props.conditions.inspection_name;
      print_data.frame = this.getFrameNames();
      print_data.frame_master = this.props.conditions.frame_master;
      axios({
        url: path,
        method: 'POST',
        data:{print_data},
        responseType: 'blob', // important
      }).then((response) => {
          let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
          if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
          }
          this.setState({complete_message:""});
          const blob = new Blob([response.data], { type: 'application/octet-stream' });
          if(window.navigator.msSaveOrOpenBlob) {
            //IE11 & Edge
            window.navigator.msSaveOrOpenBlob(blob, '生理検査予定一覧.pdf');
          }
          else{
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '生理検査予定一覧.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
          }
        })
        .catch(() => {
          this.setState({
            complete_message:"",
            alert_messages:"印刷失敗",
          });
        })
    } else {
      let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
      if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
      }
      this.setState({alert_messages:"条件に一致する結果は見つかりませんでした。"});
    }
  };
  
  closeModal=()=>{
    let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
    this.setState({alert_messages:""});
  };
  
  download_csv=()=> {
    if(this.state.list_data != null && this.state.list_data.length > 0){
      let data = [
        ['伝票種別', '実施日', '開始', '予約枠', '患者ID', '漢字氏名', 'カナ氏名', '性別', '年齡', '生年月日'],
      ];
      this.state.list_data.map(item=>{
        let frame_name = "";
        if(this.props.conditions.frame_master.length > 0){
          this.props.conditions.frame_master.map(frame=>{
            if(frame.frame_code == item.frame_code){
              frame_name = frame.frame_name;
            }
          })
        }
        let data_item = [
          getInspectionName(item.order_data.order_data.inspection_id),
          item.completed_at != null ? (item.completed_at.substr(0, 4))+'/'+(item.completed_at.substr(5, 2))+'/'+(item.completed_at.substr(8, 2)): '',
          item.order_data.order_data.reserve_time,
          frame_name,
          item.patient_number,
          item.patient_name,
          item.patient_name_kana,
          item.gender === 1 ? '男性':'女性',
          item.birthday != null ? (item.age+'歳 '+item.age_month)+'ヶ月':'',
          item.birthday != null ? formatJapan(item.birthday):'',
        ];
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
      
      aTag.download = '生理検査予定一覧.csv';
      
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
          className="custom-modal-sm patient-exam-modal physiological-modal inspection-list-modal"
        >
          <Modal.Header><Modal.Title>生理検査予定一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'head-area'}>
                <div><label>期間 :</label>{formatJapanDateSlash(formatDateLine(this.props.conditions.start_date))}～{formatJapanDateSlash(formatDateLine(this.props.conditions.end_date))}</div>
                <div><label>伝票種別 :</label>{this.props.conditions.inspection_name === '' ? '全て' : this.props.conditions.inspection_name}</div>
                <div><label>予約枠 :</label>{this.getFrameNames('html')}</div>
                <div className={'flex'}>
                  <label>検索結果 : </label><label style={{textAlign:"left"}}>{this.state.list_data == null ? 0 : (this.state.list_data.length)}件</label>
                  <div style={{marginLeft:"auto", marginRight:0}}>
                    <Button type="common" onClick={this.searchList}>最新</Button>
                  </div>
                </div>
              </div>
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered">
                  <thead>
                  <tr>
                    <th style={{width:"10rem"}}>伝票種別</th>
                    <th style={{width:"9rem"}}>実施日</th>
                    <th style={{width:"3rem"}}>開始</th>
                    <th>予約枠</th>
                    <th style={{width:"8rem"}}>患者ID</th>
                    <th style={{width:"17rem"}}>漢字氏名</th>
                    <th style={{width:"17rem"}}>カナ氏名</th>
                    <th style={{width:"3rem"}}>性別</th>
                    <th style={{width:"6rem"}}>年齡</th>
                    <th style={{width:"6rem"}}>生年月日</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.list_data == null ? (
                    <tr style={{height:"calc(100vh - 21.5rem)"}}>
                      <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </td>
                    </tr>
                  ) : (
                    this.state.list_data.length > 0 ? (
                      this.state.list_data.map((item, key) => {
                        return (
                          <>
                            <tr key={key}>
                              <td style={{width:"10rem"}}>{getInspectionName(item.order_data.order_data.inspection_id)}</td>
                              <td style={{width:"9rem"}}>{item.completed_at != null ? formatJapanDateSlash(item.completed_at) : ''}</td>
                              <td style={{width:"3rem"}}>{item.order_data.order_data.reserve_time}</td>
                              <td>
                                {this.props.conditions.frame_master.length > 0 && (
                                  this.props.conditions.frame_master.map(frame=>{
                                    if(frame.frame_code == item.frame_code){
                                      return (frame.frame_name);
                                    }
                                  })
                                )}
                              </td>
                              <td style={{width:"8rem", textAlign:"right"}}>{item.patient_number}</td>
                              <td style={{width:"17rem"}}>{item.patient_name}</td>
                              <td style={{width:"17rem"}}>{item.patient_name_kana}</td>
                              <td style={{width:"3rem"}}>{item.gender === 1 ? '男性':'女性'}</td>
                              <td style={{width:"6rem"}}>{item.birthday != null ? (item.age)+'歳 '+(item.age_month)+'ヶ月':''}</td>
                              <td style={{width:"6rem"}}>{item.birthday != null ? formatJapan(item.birthday):''}</td>
                            </tr>
                          </>)
                      })
                    ):(
                      <tr style={{height:"calc(100vh - 21.5rem)"}}>
                        <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                          <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                        </td>
                      </tr>
                    )
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={(this.state.list_data != null && this.state.list_data.length > 0) ? "red-btn" : "disable-btn"} onClick={this.printPdf}>印刷</Button>
            <Button className={(this.state.list_data != null && this.state.list_data.length > 0) ? "red-btn" : "disable-btn"} onClick={this.download_csv}>ファイル出力</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

InspectionListModal.contextType = Context;
InspectionListModal.propTypes = {
  closeModal: PropTypes.func,
  conditions: PropTypes.array,
};

export default InspectionListModal;
