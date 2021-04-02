import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine, formatDateIE} from "~/helpers/date";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
registerLocale("ja", ja);
import * as apiClient from "~/api/apiClient";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {Instruction_status, displayLineBreak} from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";
import renderHTML from 'react-render-html';

const Wrapper = styled.div`
  padding:1.25rem 0.625rem;
  
  border:1px solid lightgrey;
  height:calc(100vh -90px);
  .text-left{
      text-align:left;
  }
  .text-right{
    text-align:right;
  }
  .text-center{
      text-align:center;
  }
  .search_part{
      display:flex;
      .switch{
        position: absolute;
        right: 2.5rem;
        label{
            font-size:1rem;
        }
      }
  }
  .label-title{
      width:5rem;
      font-size:1rem;
      text-align:right;
      margin-right:0.625rem;
  }
  .pullbox-select{
      width:9.375rem;
      font-size:1rem;
  }
  .select_date_range{
      display:flex;
      .pullbox{
          margin-right:1.25rem;
      }
      span{
          padding-top:0.5rem;
      }
      label{
        margin-left: 2.5rem;
        font-size: 1rem;
      }
      .pullbox-label{
          margin-leff: 0px;
      }
      .ixnvCM{
          padding-top:0.3rem;
      }
  }
   .example-custom-input{
        font-size: 1rem;
        width:11.25rem;
        text-align:center;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        border: 1px solid;
        margin-left:0.3rem;
        margin-right:0.3rem;
    }
    .example-custom-input.disabled{
        background:lightgray;
    }
    .content{
        overflow:hidden;
        // height: calc(100vh - 25rem);
        overflow-y:scroll;
        border:1px solid lightgrey;
    }
    table{
        // max-height: calc(100vh - 25rem);
        border:none;

        thead{
            display: table;
            width:100%;
        }
        tbody{
            height: calc(100vh - 25rem);
            overflow-y:auto;
            display:block;
        }
        tr{
            display: table;
            width: 100%;
            box-sizing: border-box;
        }
    }
    th{
        font-size:1rem;
        text-align:center;
        border:1px solid #dee2e6;
        padding-left: 2px;
        padding-right: 2px;
        background:lightgray;
        font-weight:normal;
    }
    td{
        font-size:1rem;
        vertical-align:middle;
        word-break:break-all;
        label{
            margin:0;
        }
        p{
            margin-bottom:0px;
        }
    }
     .top-div {
      margin-top: -1.5rem;
     }
      .check-status {
          width: 6.25rem;
      }
      .date-area {
          width: 6.75rem;
      }
      .patient_no {
          width: 2.8rem;
      }
      .patient_type {
          width: 5.625rem;
      }
      .attach_doc {
          width: 3.75rem;
      }
      .manager_name {
          width: 5rem;
      }
      .patient_name {
          width: 11.25rem;
      }
    .footer{
        button{
            padding-left: 2.5rem;
            padding-right: 2.5rem;
        }
        button span{
            font-size:1.25rem;
        }
    }
    .spinner_area {
        text-align: center;
    }
 `;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 1.25rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const SpinnerWrapper = styled.div`
    padding-top: 4.375rem;
    padding-bottom: 4.375rem;
    height: 6.25rem;
`;


// const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
const ContextMenu = ({ visible, x,  y,  parent,  item}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {item.status ==4 && (<li onClick={() => parent.changeStatus(item,1)}><div>未対応にする</div></li>)}
          {/* <li onClick={() => parent.changeStatus(item,2)}><div>要確認にする</div></li>
                    <li onClick={() => parent.changeStatus(item,3)}><div>対応中にする</div></li> */}
          {item.status !=4 && (<li onClick={() => parent.changeStatus(item,4)}><div>対応済みにする</div></li>)}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const order_options = [
  { id: 0, value: "", field_name:"" },
  { id: 1, value: "日時", field_name:"write_date"},
  { id: 2, value: "対応状況", field_name:"status"},
];

class Instruction extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    
    this.state = {
      start_date:schedule_date!=undefined?schedule_date:new Date(),
      end_date:schedule_date!=undefined?schedule_date:new Date(),
      system_patient_id : patientInfo != undefined && patientInfo != null?patientInfo.system_patient_id:0,
      schedule_date: schedule_date!=undefined?schedule_date:new Date(),
      isConfirmModal:false,
      modal_data: {},
      table_data:null,
      display_all:1,
      all_period:1,
    }
  }
  
  async componentDidMount(){
    let server_time = await getServerTime();
    await this.getDrKarteStyle();
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    this.setState({
      start_date:schedule_date!=undefined?schedule_date:new Date(server_time),
      end_date:schedule_date!=undefined?schedule_date:new Date(server_time),
      schedule_date: schedule_date!=undefined?schedule_date:new Date(server_time),
    })
    this.getList();
  }
  getDrKarteStyle = async () => {
    let path = "/app/api/v2/management/config/get_drkarte_style";
    await apiClient.post(path).then(res=>{
      this.setState({drkarte_style: res});
    })
  }

  componentWillUnmount() {    

    var html_obj = document.getElementsByClassName("instruction_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.patientInfo.system_patient_id == this.state.system_patient_id && nextProps.schedule_date == this.state.schedule_date) return;
    let server_time = await getServerTime();
    this.setState({
      system_patient_id:nextProps.patientInfo.system_patient_id,
      schedule_date:nextProps.schedule_date,
      start_date:nextProps.schedule_date!=undefined?nextProps.schedule_date:new Date(server_time),
      end_date:nextProps.schedule_date!=undefined?nextProps.schedule_date:new Date(server_time),
    }, () => {
      this.getList();
    });
  }
  getList = async() => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo.system_patient_id == undefined) {
      this.setState({table_data:[]})
      return;
    }
    
    let path = "/app/api/v2/dial/board/Soap/getInstruction";
    let post_data = {
      patient_id: this.state.system_patient_id,
      // start_date: this.state.all_period!=1 ? formatDateLine(this.state.start_date):undefined,
      // end_date: this.state.all_period!=1 ? formatDateLine(this.state.end_date):undefined,
      start_date: formatDateLine(this.state.start_date),
      end_date: formatDateLine(this.state.end_date),
      status: this.state.status,
      order_field: this.state.order_field,
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      table_data: data == undefined ? [] : data,
    });
  }
  
  confirmCancel() {
    this.setState({
      isConfirmModal: false,
      confirm_message: "",
    });
  }
  
  checkAllPeriod = (name, value) => {
    if (name == "period_all"){
      this.setState({all_period:value}, () => {
        this.getList();
      });
    }
  }
  
  getStartDate = value => {
    this.setState({ start_date: value }, ()=>{ this.getList() });
  };
  getEndDate = value => {
    this.setState({ end_date: value }, ()=>{ this.getList() });
  };
  
  
  handleClick = (e, item) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
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
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        },
        item:item,
      });
    }
  };
  
  changeStatus = (item, status_to_change) => {
    this.setState({
      item,
      status_to_change,
      isConfirmModal:true,
      confirm_message:"対応状況を変更して良いですか？",
    })
  };
  
  setStatus = async() => {
    if (this.state.item.status == this.state.status_to_change){
      this.confirmCancel();
      window.sessionStorage.setItem("alert_messages", "変更がありません。");
      return;
    }
    let path = "/app/api/v2/dial/board/Soap/setStatus";
    let post_data = {
      params: {
        timeline_number:this.state.item.timeline_number,
        status:this.state.status_to_change,
        system_patient_id:this.state.system_patient_id,
      }
    };
    await apiClient.post(path,  post_data).
      then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages","変更完了##" + res.alert_message);
          this.props.checkInstructionStatus(this.state.system_patient_id, this.state.schedule_date);
          this.confirmCancel();
          this.getList();
        }
      })
      .catch(() => {
        return false;
      });
    
  }
  getSearchStatus = (e) => {
    this.setState({status:parseInt(e.target.id)}, () => {
      this.getList();
    })
  }
  
  getOrder = e => {
    this.setState({order_field: order_options[parseInt(e.target.id)].field_name}, () => {
      this.getList();
    })
  }
  
  goPrintInstruction = () => {
    var schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    sessApi.setObjectValue("from_bedside", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_bedside", "patient", patientInfo);
    this.props.history.replace("/print/InstructionPrint");
  }
  
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.instruction_list_width !== undefined ? this.state.drkarte_style.instruction_list_width : 120;
    return (pres_array.map(item=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right"}}>{item.right_str}</div>
        </div>
      )
    }))
  }
  IsJsonString = (str) => {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
  
  render() {    
    let table_data = this.state.table_data;
    var instruction_options =[
      { id: 0, value: "" },
      { id: 1, value: "未"},
      // { id: 2, value: "要確認" },
      // { id: 3, value: "対応中"},
      { id: 4, value: "済"},
    ]
    return (
      <Wrapper className="instruction_wrapper">
        <div className="search_part">
          <div className = "select_date_range">            
            <SelectorWithLabel
              options={instruction_options}
              title="対応状況"
              getSelect={this.getSearchStatus}
              departmentEditCode={this.state.status}
            />            
            <button style = {{position:'absolute', right:"3.125rem", fontSize:'1rem'}} onClick={this.goPrintInstruction.bind(this)}>全患者の指示一覧</button>
          </div>
        </div>
        <div className='content'>
          <table className="table table-bordered table-hover" id={'code-table'}>
            <thead>
            <th className="check-status">対応状況</th>
            <th className="date-area">記入日</th>
            <th className="patient_name">記入者</th>
            <th>指示内容</th>
            </thead>
            <tbody>
            {(table_data === undefined || table_data == null) ? (
              <tr>
                <td colSpan={'4'}>
                  <div className='spinner_area'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            ):(
              <>
                {Object.keys(table_data).length > 0 && (
                  Object.keys(table_data).map((key) => {
                    if (key != ''){
                      return(
                        <>
                          <tr onContextMenu={e => this.handleClick(e, table_data[key][0])}>
                            <td className="text-center check-status" style={{background:table_data[key][0].status!=4?'red':'none'}}>
                              {table_data[key][0].status!=null?Instruction_status[table_data[key][0].status]:'未'}
                            </td>
                            <td className="text-center date-area">{formatDateLine(formatDateIE(table_data[key][0].write_date))}</td>
                            <td className="text-center patient_name">{table_data[key][0].updater_name}</td>
                            <td style={{fontSize:'1.125rem'}}>
                              {table_data[key].map(item => {
                                if (item.category_1 == "Drカルテ" && item.category_2.includes('処方') && this.IsJsonString(item.body)) {
                                  return (
                                    <>
                                      <div>{this.prescriptionRender(JSON.parse(item.body))}</div>
                                    </>
                                  )
                                } else {
                                  return(
                                    <>
                                      <div>{displayLineBreak(renderHTML(item.body))}</div>
                                    </>
                                  )
                                }
                              })}
                            </td>
                          </tr>
                        </>
                      )
                    }
                    
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </div>
        {this.state.isConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.setStatus.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          item= {this.state.item}
        />
      </Wrapper>
    )
  }
}

Instruction.contextType = Context;

Instruction.propTypes = {
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
  checkInstructionStatus:PropTypes.func,
  history: PropTypes.object,
};

export default Instruction