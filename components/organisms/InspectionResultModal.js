import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface, secondary, secondary200, disable } from "../_nano/colors";
import { Modal } from "react-bootstrap";
import InspectionTimeSeriesModal from "./InspectionTimeSeriesModal";
import InspectionWithPastResultModal from "./InspectionWithPastResultModal";
import MedicineDetailModal from "./MedicineDetailModal";
import * as apiClient from "../../api/apiClient";
import Button from "../atoms/Button";
import Checkbox from "../molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import renderHTML from 'react-render-html';
import Spinner from "react-bootstrap/Spinner";
import {getHalfLength} from "~/helpers/dialConstants"

const SpinnerWrapper = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  line-height: 1.7;
  margin-bottom: 1rem;

  p {
    width: 32%;
    margin: 0;
  }

  .flex {
    display: flex;
  }

  dl {
    display: flex;
    margin: 0;
    width: 30%;
  }
  dt {
    font-weight: normal;
  }
  dd {
    margin: 0 16px 0 0;
  }
  .btn-area {
    width: 15%;
    dd {
      margin: 0;
    }
  }
  .btn-disable{
    button{
      pointer-events: none;
      background: #ddd;
      span{
        color: gray;
      }
    }
  }
`;

const NoDiv = styled.div`
  height: 62vh;
  .no-data{
    text-align: center;
    padding: 18rem;
    font-size: 20px;
  }
`;

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  max-height: 60vh;
  overflow-y: auto;
  display: table;

  a.timeCode:hover{
    cursor: pointer !important;
    color: blue !important;
  }

  thead{
      display: table;
      width:100%;
  }
  tbody {
      height: calc(60vh - 9rem) !important;
      overflow-y:auto;
      display:block;
      width: 100%;
  }   

  tr {
    display: table;
    width: 100%;
    &:nth-child(2n + 1) {
      background-color: ${secondary200};
    }
  }

  tr:hover{
    cursor: pointer !important;
  }

  th{
    position: sticky;
    top: 0px;
  }

  th,
  td {
    border: 1px solid ${disable};
    padding: 4px;
  }

  th {
    background-color: ${secondary};
    color: ${surface};
    text-align: center;
  }

  .item-name {
    width: 18rem;
  }
  .item-result {
    width: 9rem;
  }
  .item-default {
    width: 12rem;
  }
  .item-comment {
    // width: 10rem;
  }
  .item-check{
    width: 1rem;
    z-index: 100;
    label {
      margin-right:0;
    }
    
  }

  .button-not-permission{
    background-color: gray;
  }
  s{
    color: #6c6c6c;
  }

`;

const ContextMenuUl = styled.ul`
  margin-bottom:0px!important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
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
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({
  visible,
  x,
  y,
  index,
  parent,
  code,
  item,
  type
}) => {

  if (visible) {
    let existComment = 0;
    if (type == "comment") {
      if (item.boilerplate_1 !== undefined && item.boilerplate_1 !== "") {
        existComment = 1;
      }
      if (item.boilerplate_2 !== undefined && item.boilerplate_2 !== "") {
        existComment = 1;
      }
      if (item.remarks !== undefined && item.remarks !== "") {
        existComment = 1;
      }
      if (item.long_comment !== undefined && item.long_comment !== null && item.long_comment !== "") {
        existComment = 1;
      }            
    }
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}> 
          <li>
            <div onClick={() => parent.contextMenuAction("showInspection", code, index)}>
              この検査を並べて表示
            </div>
          </li>                   
          <li>
            <div onClick={() => parent.contextMenuAction("timeSeries", code, index)}>
              この検査をグラフで表示
            </div>
          </li>
          {existComment == 1 && (
            <li>
              <div onClick={() => parent.contextMenuAction("commentToClipboard", item)}>
                コメントをコピー
              </div>
            </li>              
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InspectionResultModal extends Component {

  constructor(props) {
    super(props);
    this.handleMedicineDetailClick = this.handleMedicineDetailClick.bind(this);
    this.clickTimeCode = this.clickTimeCode.bind(this);
    this.state = {
      showTimeSeries: false,
      timeSeriesContent: [],
      medicineDetail: [],
      showPastResult: false,
      showMedicineDetail: false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        index: 0
      },
      checkList: [],
      allCheck: 0,
      confirm_message:"",
      inspectionList:props.inspectionList,
      is_loaded: this.props.in_hospital_header_number == undefined && this.props.out_hospital_header_number == undefined ? true : false
    };
    
  }

  async componentDidMount() {
    if (this.props.in_hospital_header_number == undefined && this.props.out_hospital_header_number == undefined) return;
    let params = {
      patientId: this.props.patientId
    };
    if (this.props.in_hospital_header_number != undefined && this.props.in_hospital_header_number != "") {
      params.header_number = this.props.in_hospital_header_number;
    }
    if (this.props.out_hospital_header_number != undefined && this.props.out_hospital_header_number != "") {
      params.header_number = this.props.out_hospital_header_number;
    }
    await apiClient.post("/app/api/v2/karte/get_exam_result", {
      params: params
    }).then((res) => {
      if (res) {
        this.setState({inspectionList: res});
      }
    }).finally(()=>{
      this.setState({is_loaded: true});
    });
  }

  handleCancel = () => {
    let inspection_result_dlg = document.getElementsByClassName("inspection-result-dlg")[0];
    if(inspection_result_dlg !== undefined && inspection_result_dlg != null){
        inspection_result_dlg.style['z-index'] = 1050;
    }
    this.setState({
      showPastResult: false,
      showMedicineDetail: false
    }); 
  }

  closeTimeSeriesModal = () => {
    this.setState({
      showTimeSeries: false
    });
  }

  getTimeSeries = async (params, type) => {    
    await apiClient.get("/app/api/v2/karte/inspection/history", {
      params: params
    }).then((res) => {
        let inspection_result_dlg = document.getElementsByClassName("inspection-result-dlg")[0];
        if(inspection_result_dlg !== undefined && inspection_result_dlg != null){
            inspection_result_dlg.style['z-index'] = 1040;
        }
        if (type === "_past" ) {
          this.setState({
            showPastResult: true,
            timeSeriesContent: res
          });
        }else if(type === "_timeSeries"){
          this.setState({
            showTimeSeries: true,
            timeSeriesContent: res
          });
        }        
    });
  }

  clickTimeCode = (e, item) => { 
    e.preventDefault();
    let tagName = e.target.tagName;  
    if(tagName === "TD") {
      let params = {patient_id: this.props.patientId, code: item.code};    
      this.getTimeSeries(params, "_past");        
    }
  }

  handleClick(e, index, item, _type) {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // e.target.click();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("inspection_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("inspection_dlg")
              .removeEventListener(`scroll`, onScrollOutside);
          });    
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("inspection_dlg").offsetLeft,
          y: e.clientY + window.pageYOffset - document.getElementById("inspection_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop,
          index: index,
          code: item.code,
          item: item,
          type: _type
        }
      });   
    }
  }

  contextMenuAction = (act, code) => {
    let chkList = [];
    chkList.push(code);
    if (act === "timeSeries") {
        let params = {patient_id: this.props.patientId, code: chkList};
        this.getTimeSeries(params, "_timeSeries");
    }
    if (act === "showInspection") {
        let params = {patient_id: this.props.patientId, code: chkList};
        this.getTimeSeries(params, "_past");
    }
    if (act === "commentToClipboard") {
        this.commentToClipboard(code);
    }
  };

  // ●YJ873 検査結果モーダルから結果値を引用できるようtに
  commentToClipboard = (_item) => {

    let clipboard_text = "";
    if (_item.boilerplate_1 !== undefined && _item.boilerplate_1 !== "") {
      clipboard_text = _item.boilerplate_1 + "\n";
    }
    if (_item.boilerplate_2 !== undefined && _item.boilerplate_2 !== "") {      
      clipboard_text += _item.boilerplate_2 + "\n";
    }
    if (_item.remarks !== undefined && _item.remarks !== "") {
      clipboard_text += _item.remarks + "\n";
    }
    if (_item.long_comment !== undefined && _item.long_comment !== null && _item.long_comment !== "") {
      clipboard_text += _item.long_comment.split("｜").join("\n");
    }

    if (window.clipboardData) {
      window.clipboardData.setData ("Text", clipboard_text);
    }
  }

    timeSeries =()=>{
        if (this.state.checkList.length === 0) {
            let inspection_result_dlg = document.getElementsByClassName("inspection-result-dlg")[0];
            if(inspection_result_dlg !== undefined && inspection_result_dlg != null){
                inspection_result_dlg.style['z-index'] = 1040;
            }
            this.setState({
                confirm_message: "項目を選択してください。",
            });
        } else {
            let params = {patient_id: this.props.patientId, code: this.state.checkList};
            this.getTimeSeries(params, "_timeSeries");
        }
    }

    showInspection =()=>{
        let inspection_result_dlg = document.getElementsByClassName("inspection-result-dlg")[0];
        if(inspection_result_dlg !== undefined && inspection_result_dlg != null){
            inspection_result_dlg.style['z-index'] = 1040;
        }
        if (this.state.checkList.length === 0) {
            this.setState({
                confirm_message: "項目を選択してください。",
            });
        } else {
            let params = {patient_id: this.props.patientId, code: this.state.checkList};
            this.getTimeSeries(params, "_past");
        }
    }

    confirmCancel() {
        let inspection_result_dlg = document.getElementsByClassName("inspection-result-dlg")[0];
        if(inspection_result_dlg !== undefined && inspection_result_dlg != null){
            inspection_result_dlg.style['z-index'] = 1050;
        }
        this.setState({
            confirm_message: "",
        });
    }

  handleMedicineDetailClick = (e, code) => {
    e.preventDefault();
    let params = {type: "haruka", codes: parseInt(code)};
    this.getMedicineDetailList(params);
  }

  getMedicineDetailList = async (params) => {    
    await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    }).then((res) => {    
      this.setState({
        showMedicineDetail: true,
        medicineDetail: res
      });
    });
  }

  getRadio(name, value) {
    if (name == "all_check") {    
      if (value == 0) {
        this.setState({
          allCheck: value,
          checkList: [],
        });
      }else{   
        let chkList = []; 
        this.state.inspectionList.results.map(item=>{
          chkList.push(item.code);
        });    
        this.setState({
          allCheck: value,
          checkList: chkList
        });
      }
    } else {
      let chkList = [...this.state.checkList];
      if( value === 1) {
        chkList.push(name);
      }
      else {
        var index = chkList.indexOf(name)
        if (index !== -1) {
          chkList.splice(index, 1);
        }
      }
      if (this.state.inspectionList.results.length == chkList.length) {
        this.setState({
          checkList: chkList,
          allCheck: 1,
        });
      }else{
        this.setState({
          checkList: chkList,
          allCheck: 0,
        });
      }
    }

  }
  getKanaName = () => {
    let kana_name = '';
    let rece_kana_name = this.props.patient_name_kana != undefined  && this.props.patient_name_kana != null &&  this.props.patient_name_kana != '' ? this.props.patient_name_kana.trim(): "";
    rece_kana_name = this.toHalfWidth(rece_kana_name);
    if (this.state.inspectionList == null || this.state.inspectionList == null) return;
    let result_data = this.state.inspectionList.results;
    if (result_data != undefined && result_data.length >0) {
      result_data.map(item=>{
        if(item.patient_name != '' && item.patient_name != null && this.toHalfWidth(item.patient_name) != rece_kana_name) {
          if ((kana_name != '' && (kana_name.search(item.patient_name) < 0)) || kana_name == ''){
            kana_name = kana_name + item.patient_name + "　";
          }
        }
      })
    }
    return kana_name;
  }
  toHalfWidth = (strVal) => {
      if (strVal == undefined || strVal==null || strVal == '') return '';
      // 半角変換
      strVal = this.zenkakuToHankaku(strVal);
      var halfVal = strVal.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      return halfVal;
  }
  zenkakuToHankaku = (mae) => {
      let zen = new Array(
          'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ'
        ,'サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト'
        ,'ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ'
        ,'マ','ミ','ム','メ','モ','ヤ','ヰ','ユ','ヱ','ヨ'
        ,'ラ','リ','ル','レ','ロ','ワ','ヲ','ン'
        ,'ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ'
        ,'ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ'
        ,'パ','ピ','プ','ペ','ポ'
        ,'ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ'
        ,'゛','°','、','。','「','」','ー','・',
      );
      let hirakana = new Array(
          'あ','い','う','え','お','か','き','く','け','こ'
        ,'さ','し','す','せ','そ','た','ち','つ','て','と'
        ,'な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'
        ,'ま','み','む','め','も','や','い','ゆ','え','よ'
        ,'ら','り','る','れ','ろ','わ','を','ん'
        ,'が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ'
        ,'だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'
        ,'ぱ','ぴ','ぷ','ぺ','ぽ'
        ,'ぁ','ぃ','ぅ','ぇ','ぉ','ゃ','ゅ','ょ','っ'
        ,'゛','°','、','。','「','」','ー','・',
      );

      let han = new Array(
          'ｱ','ｲ','ｳ','ｴ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ'
        ,'ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ﾂ','ﾃ','ﾄ'
        ,'ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ'
        ,'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ｲ','ﾕ','ｴ','ﾖ'
        ,'ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ'
        ,'ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ'
        ,'ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ'
        ,'ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ'
        ,'ｧ','ｨ','ｩ','ｪ','ｫ','ｬ','ｭ','ｮ','ｯ'
        ,'ﾞ','ﾟ','､','｡','｢','｣','ｰ','･'
      );
      
      let ato = "";
      for (let i=0;i<mae.length;i++){
        let maechar = mae.charAt(i);
        let zenindex = zen.indexOf(maechar);
        let hindex = hirakana.indexOf(maechar);
        if(zenindex >= 0){
          maechar = han[zenindex];
        } else if(hindex >= 0) {
          maechar = han[hindex];
        }
        ato += maechar;
      }
      return ato;
  }

  // ●YJ873 検査結果モーダルから結果値を引用できるようtに
  copyToClipboard = () => {
    if(this.state.checkList.length < 1) return;

    if (this.state.inspectionList.results != undefined && this.state.inspectionList.results.length > 0) {
      
      let clipboard_text = "";
      
      // count item with longest width
      let long_item_count = 0;
      this.state.inspectionList.results.filter(item=>{
        if (this.state.checkList.includes(item.code)) {          
          if (long_item_count < getHalfLength(item.label)) {
            long_item_count = getHalfLength(item.label);
          }
          return item;
        }
      }).map(item=>{
        if (item.label != undefined && item.label != "") {          
          clipboard_text += item.label + this.getEmpttySpaces(long_item_count - getHalfLength(item.label));
          if (item.value != undefined && item.value != "") {
            clipboard_text += "　" + item.value;
            if (item.unit != undefined && item.unit != "") {
              clipboard_text += item.unit + "\n";
            } else {
              clipboard_text += "\n";
            }
          } else {
            clipboard_text += "\n";
          }
        }
      });

      if (window.clipboardData) {
        window.clipboardData.setData ("Text", clipboard_text);
      }
    }    

  }

  getEmpttySpaces = (_n) => {
    let result = "";
    if(_n < 1) return result;
    let one_space = " ";
    for (var i = _n - 1; i >= 0; i--) {
      result += one_space;
    }
    return result;
  }

  render() {
    let { inspectionList, is_loaded } = this.state;
    let kana_name = this.getKanaName();
    let nDetailCount = 0;
    let noExistData = false;
    if (inspectionList == null || inspectionList == undefined || inspectionList.length < 1) {
      noExistData = true;
    } else if (inspectionList.results == null || inspectionList.results == undefined || inspectionList.results.length < 1) {
      noExistData = true;
    }
    let inspectionResult = "";
    if (noExistData == true) {
      inspectionResult = <></>;
    } else {
      inspectionResult = inspectionList.results.map(
        (item, index) => {
        if (item.exists_detail_information === 1) {
          nDetailCount ++;
        }
        return (
          <tr key={index}>
            <td className={'item-check'}>
              <Checkbox
                label=""
                getRadio={this.getRadio.bind(this)}
                value={this.state.allCheck == 1 ? 1: this.state.checkList.indexOf(item.code) !== -1 ? 1 : 0}
                name={item.code}
              />
            </td>
            <td className="item-name" onClick={e => this.clickTimeCode(e, item)} onContextMenu={e => this.handleClick(e, index, item)}>{item.label !== undefined && item.label !== ""?item.label:""}</td>
            <td className="item-result" onClick={e => this.clickTimeCode(e, item)} onContextMenu={e => this.handleClick(e, index, item)}>{item.value_status == "L" && "↓"} {item.value !== undefined && item.value !== ""?item.value:""} {item.unit !== undefined && item.unit !== ""?item.unit:""} {item.status !== undefined && item.status !== ""?item.status:""}</td>
            <td className="item-default" onClick={e => this.clickTimeCode(e, item)} onContextMenu={e => this.handleClick(e, index, item)}>{item.reference_value !== undefined && item.reference_value !== ""?item.reference_value:""}</td>
            <td className="item-comment" onClick={e => this.clickTimeCode(e, item)} onContextMenu={e => this.handleClick(e, index, item, "comment")}>
            {item.boilerplate_1 !== undefined && item.boilerplate_1 !== ""?item.boilerplate_1:""}
            {item.boilerplate_1 !== undefined && item.boilerplate_1 !== "" && item.boilerplate_1 !== "" && (
              <br />
            )}
            {item.boilerplate_2 !== undefined && item.boilerplate_2 !== ""?item.boilerplate_2:""}
            {item.boilerplate_2 !== undefined && item.boilerplate_2 !== "" && (
              <br />
            )}
            {item.remarks !== undefined && item.remarks !== ""?item.remarks:""}
            {item.long_comment !== undefined && item.long_comment != null && item.long_comment !== ""? renderHTML((item.remarks !== undefined && item.remarks !== "" ? "<br/>":"") + item.long_comment.split("｜").join("<br/>")):""}</td>
            {item.exists_detail_information === 1 && (
              <td className="btnDetail" onClick={e => this.clickTimeCode(e, item)} onContextMenu={e => this.handleClick(e, index, item)}>
                <Button id="btnDetail" onClick={e=> this.handleMedicineDetailClick(e, item.code)}>詳細</Button>
              </td>
            )}          
          </tr>
        );
      });   
    }
    return (
      <>
      <Modal
        show={true}
        id="inspection_dlg"
        centered
        size="lg"
        className={'inspection-result-dlg'}
      >
        <Modal.Header>
          <Modal.Title>検査結果</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height: "60vh"}}>
          {is_loaded ? (
            <>
              <div className="d-flex">
                {kana_name != '' && (
                  <div style={{fontSize:"1.2rem"}}>患者名：{kana_name}</div>
                )}
                {/* {this.props.patientName != undefined && (
                  <div>患者名: {this.props.patientName}</div>
                )} */}
                {this.props.patientNumber != undefined && (
                  <div className="ml-2">({this.props.patientNumber})</div>
                )}
              </div>
              {noExistData == true ? (
                <NoDiv>
                  <div className="no-data">結果が登録されていません。</div>
                </NoDiv>
              ) : (
                <>
                  <Div>
                      <div className="flex">
                        <dl>
                          <dt>採取日：</dt>
                          <dd>
                          {inspectionList.collected_date.substr(0, 4)}年
                          {inspectionList.collected_date.substr(5, 2)}月
                          {inspectionList.collected_date.substr(8, 2)}日
                          </dd>
                        </dl>
                        <dl>
                          <dt>医師：</dt>
                          <dd>{inspectionList.doctor_name}</dd>
                        </dl>
                        <dl className={'btn-area'}>
                          <dt><Button onClick={this.showInspection}>並べて表示</Button></dt>
                          <dd></dd>
                        </dl>
                        <dl className={this.state.checkList.length > 0 ? 'btn-area' : 'btn-area btn-disable'}>
                          <dt><Button onClick={this.copyToClipboard}>コピー</Button></dt>
                          <dd></dd>
                        </dl>
                        <dl className={'btn-area'}>
                          <dt><Button onClick={this.timeSeries}>グラフで表示</Button></dt>
                          <dd></dd>
                        </dl>
                      </div>
    
                  </Div>
                  <Table>
                    <thead>
                      <tr>
                        <th className="item-check">
                        <Checkbox
                          label=""
                          getRadio={this.getRadio.bind(this)}
                          value={this.state.allCheck}
                          name={'all_check'}
                        />
                        </th>
                        <th className="item-name">項目名</th>
                        <th className="item-result">結果</th>
                        <th className="item-default">基準値</th>
                        <th className="item-comment">コメント</th>
                        {nDetailCount > 0 && (
                          <th></th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {inspectionResult}
                    </tbody>
                  </Table>
                    <div className='order-comment d-flex w-100 mt-2'>
                        <div style={{fontSize: "0.875rem"}} className="mt-1">フリーコメント</div>
                        <div style={{borderRadius: "0.4rem",height:"2rem"}} className="ml-2 w-75 border pl-1 pt-1">{this.state.inspectionList.order_comment != undefined ? this.state.inspectionList.order_comment : ''}</div>
                    </div>
                </>
              )}
            </>
          ):(
            <SpinnerWrapper><Spinner animation="border" variant="secondary" /></SpinnerWrapper>
          )}
        </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      </Modal>
      {this.state.showTimeSeries && (
        <InspectionTimeSeriesModal
          closeTimeSeriesModal={this.closeTimeSeriesModal}
          showData={this.state.timeSeriesContent}
        />
      )}  
      {this.state.showPastResult && (
        <InspectionWithPastResultModal
          hideModal={this.handleCancel}
          handleCancel={this.handleCancel}
          inspectionWithPastList={this.state.timeSeriesContent}
          selected_date={inspectionList.collected_date}
        />
      )}
      {this.state.showMedicineDetail && (
        <MedicineDetailModal
          hideModal={this.handleCancel}
          handleCancel={this.handleCancel}
          medicineDetailList={this.state.medicineDetail}
        />
      )}
      {this.state.confirm_message !== "" && (
          <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.confirm_message}
          />
      )}
      </>
    );
  }
}

InspectionResultModal.propTypes = {
  closeModal: PropTypes.func,
  inspectionList: PropTypes.object,
  patientId: PropTypes.number,
  patientNumber: PropTypes.string,
  patientName: PropTypes.string,
  patient_name_kana: PropTypes.string,
  in_hospital_header_number: PropTypes.number,
  out_hospital_header_number: PropTypes.number,
};

export default InspectionResultModal;
