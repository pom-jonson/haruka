import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DatePicker from "react-datepicker";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { formatJapanDate, formatDateLine } from "~/helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import axios from "axios";
import Context from "~/helpers/configureStore";
import auth from "~/api/auth";
import {PER_PAGE} from "~/helpers/constants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import LogPagination from "~/components/templates/Maintenance/LogPagination";
import FromApiPagination from "~/components/templates/Maintenance/FromApiPagination";
import Spinner from "react-bootstrap/Spinner";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2.5rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
    .footer {
        margin-top: 10px;
        text-align: center;
        button {
          text-align: center;
          border-radius: 4px;
          background: rgb(105, 200, 225);
          border: none;
          margin-right: 30px;
        }
        
        span {
          color: white;
          font-size: 1rem;
          font-weight: 100;
        }
    }
    .gender {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: auto;
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        padding-left:1rem
        padding-right:1rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
    padding: 0;
`;

const SearchPart = styled.div`
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 120px;
  padding: 20px;
  float: left;
  .display_number{
    .pullbox-title{
      font-size: 1rem;
    }
  }
  .update-btn{
    height:2.5rem;
    width: 5rem;
    margin-left:0.5rem;
    span{
      font-size: 1rem;
    }
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 10px;

  }
  .pullbox-select {
      font-size: 1rem;
      width: 9rem;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 3.75rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 1rem;
    }
  }
  .radio-label {
    width: 7rem;
    float: left;
    padding-top: 5px;
    padding-right: 10px;
    text-align: right;
  }
  .select_date_range{
      display:flex;
      .pullbox{
          margin-right:20px;
      }
      span{
          padding: 5px 0.9rem;
          margin: 0px 10px;
      }
  }
   .example-custom-input{
        font-size: 0.9rem;
        width:11.25rem;
        text-align:center;
        padding-left: 0.9rem;
        padding-right: 0.9rem;
        padding-top: 5px;
        padding-bottom: 5px;
        border: 1px solid;
        margin-left:5px;
        margin-right:5px;
    }

    .direct_man{
      div {
        margin-top:0;
      }
      label{
        font-size: 1rem;
        margin-top: 8px;
        width: 7rem;
        padding-right: 10px;
        margin-right: 3px;
      }

      input{
        width: 12.5rem;
        height: 2.5rem;
      }
    }
    .pullbox-select{
      height: 2.5rem;
    }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  float: left;
  margin-bottom: 10px;
  .paginate_link{
    width:3.5rem;
    text-align:center;
  }
  label {
      text-align: right;
  }
  table {
    thead{
        display:table;
        width:100%;        
        th{
          border-bottom: none !important;
          border-top: none !important;
        }
    }
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc( 100vh - 23rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
        display: table;
        width: 100%;
    }
    text-align: center;
      td {
          padding: 0.25rem;
          text-align: left;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
  }
 `;

const TooltipMenuUl = styled.ul`
 .context-menu {
   animation-name: fadeIn;
   animation-duration: 0.4s;
   background-clip: padding-box;
   background-color: white;
   border-radius: 4px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
   list-style-type: none;
   margin: 0;
   outline: none;
   padding: 0;
   position: absolute;
   text-align: left;
   overflow: hidden;
   -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
   z-index: 200;
  //  width: 20rem;
   opacity: 0.8;
   border: 2px solid #807f7f;
   border-radius: 12px;
 }
 .tooltip-item{
   display: flex;
 }
 .item-title{
   width: 6rem;
   text-align: left;
   padding: 3px 3px !important;
 }
 .item-content{
   width: auto;
   word-break: break-all;
 }
 .tooltip-content-area{
   line-height: 1rem;
   background: #050404;
   color: white;
 }
 .context-menu li {
   font-size: 1rem;
   line-height: 1.3rem;
   clear: both;
   color: black;
   cursor: pointer;
   font-weight: normal;
   margin: 0;
   padding: 0px;
   transition: all 0.3s;
   white-space: nowrap;
   border-bottom: solid 1px #888;
   -webkit-transition: all 0.3s;
   div {
     padding: 3px 3px;
   }
 }
`;

const Tooltip = ({visible,x,y,tooltip_content}) => {
  if (visible && tooltip_content != null && tooltip_content != '') {
    return (
      <TooltipMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className="tooltip-content-area">
              <div className="tooltip-item">
                <div className="item-content">{displayLineBreak(tooltip_content)}</div>
              </div>
            </div>
          </li>
        </ul>
      </TooltipMenuUl>
    );
  } else {
    return null;
  }
};

class StaffOperationHistoryLog extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      start_date:new Date(),
      end_date:new Date(),
      table_data:null,
      staff_name: "",
      patient_name: "",
      current_page: 1,
      patient_id: 0,
      staff_id: 0,
      isShowPatientList: false,
      isLoaded: false,
      isShowStaffList: false,
      confirm_message:"",
      sort_category: "時系列昇順",
      display_number: 20,
    }
  }
  
  componentDidMount =async()=> {
    auth.refreshAuth(location.pathname+location.hash);
    await this.getPatientList();
    await this.getStaffs();
    await this.getStaffLogs();
  }
  
  getStaffLogs = async (_flag=null) => {
    let path = "/app/api/v2/secure/staff/getOperationHistoryLog";
    var post_data = {
      start_date: formatDateLine(this.state.start_date),
      end_date: formatDateLine(this.state.end_date),
      patient_id: this.state.patient_id,
      current_page: this.state.current_page,
      display_number: this.state.display_number,
      get_data_flag: _flag,
      staff_id: this.state.staff_id,
    }
    if (this.state.sort_category == "時系列昇順") {
      post_data.order = "time_series_up";
    } else if(this.state.sort_category == "時系列降順") {
      post_data.order = "time_series_down";
    } else if(this.state.sort_category == "患者ごとにまとめる") {
      post_data.order = "each_patient";
    }
    
    const { data } = await axios.post(path, {param:post_data});
    if (_flag == "only_data") {
      this.setState({
        pageOfItems: data != undefined && data !=null ? data.data : [],
        isLoaded: true
      });
      return;
    }
    if(data != undefined && data !=null){
      this.setState({
        table_data: data.page,
        pageOfItems: data.data,
        isLoaded: true
      });
    } else {
      this.setState({
        table_data:[],
        pageOfItems:[],
        isLoaded: true
      });
    }
  }
  
  getPatientList = async () => {
    let path = "/app/api/v2/dial/patient/list";
    var post_data = {
    }
    const { data } = await axios.post(path, {param:post_data});
    if(data != undefined && data !=null && data.data != undefined && data.data != null && data.data.length> 0){
      data.data.map(item=>{
        item.name = item.patient_name
      });
      this.setState({
        patientList:data.data
      });
    } else {
      this.setState({
        patientList:[]
      });
    }
  };
  
  closeModal = () => {
    this.setState({
      isShowPatientList: false,
      isShowStaffList: false,
    })
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  getStartDate = value => {
    this.setState({
      start_date: value
    }, ()=>{
      // this.getList()
    });
  };
  
  getEndDate = value => {
    this.setState({
      end_date: value
    }, ()=>{
      // this.getList()
    });
  };
  
  showPatientList = () => {
    if(this.state.patientList !== undefined && this.state.patientList != null && this.state.patientList.length > 0){
      this.setState({
        isShowPatientList:true
      });
    }
  }
  
  showStaffList = () => {
    if(this.state.staffs !== undefined && this.state.staffs != null && this.state.staffs.length > 0){
      this.setState({
        isShowStaffList:true
      });
    }
  }
  
  closeDoctorSelectModal = () => {
    this.setState({
      isShowStaffList:false,
      isShowPatientList:false,
    });
  }
  
  selectPatient = (patient) => {
    this.setState({
      patient_name:patient.name,
      patient_id: patient.system_patient_id
    })
    this.closeDoctorSelectModal();
  }
  
  selectStaff = (staff) => {
    this.setState({
      staff_name:staff.name,
      staff_id: staff.number,
    })
    this.closeDoctorSelectModal();
  }
  
  clearPatient = () => {
    this.setState({
      patient_name: "",
      patient_id: 0,
    });
    this.closeDoctorSelectModal();
  }
  
  clearStaff = () => {
    this.setState({
      staff_name:"",
      staff_id: 0,
    });
    this.closeDoctorSelectModal();
  }
  
  handleSort = e => {
    this.setState({sort_category: e.target.value, isLoaded: false}, () => {
      this.getStaffLogs();
    });
  };
  
  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };
  
  onChangePage(pageOfItems, _curPage) {
    this.setState({
      pageOfItems: pageOfItems,
      current_page: _curPage,
      isLoaded: false
    }, ()=>{
      this.getStaffLogs("only_data");
    });
  }
  
  // sort_category = () => {
  
  // })
  
  handleStaffLogs = () => {
    this.setState({isLoaded: false}, () => {
      this.getStaffLogs();
    });
  }
  
  editTooltip = async(e, item) => {
    e.preventDefault();
    var tooltip_content = item.op_content;
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX,
        y: e.clientY+window.pageYOffset,
      },
      tooltip_content,
    });
  };
  
  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };
  
  render() {
    let {pageOfItems} = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <Card>
        <div className="title">操作履歴</div>
        <SearchPart>
          <div className={'flex'}>
            <div className = "select_date_range">
              <div className="radio-label">処理日範囲</div>
              <DatePicker
                locale="ja"
                selected={this.state.start_date}
                onChange={this.getStartDate.bind(this)}
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
                onChange={this.getEndDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName = {date => setDateColorClassName(date)}
                customInput={<ExampleCustomInput />}
              />
            </div>
            <div className="gender">
              <RadioButton
                id={`sort_01`}
                value={"時系列昇順"}
                label={"時系列昇順"}
                name="radio_sort"
                getUsage={this.handleSort}
                checked={this.state.sort_category === "時系列昇順"}
              />
              <RadioButton
                id={`sort_02`}
                value={"時系列降順"}
                label={"時系列降順"}
                name="radio_sort"
                getUsage={this.handleSort}
                checked={this.state.sort_category === "時系列降順"}
              />
              <RadioButton
                id={`sort_03`}
                value={"患者ごとにまとめる"}
                label={"患者ごとにまとめる"}
                name="radio_sort"
                getUsage={this.handleSort}
                checked={this.state.sort_category === "患者ごとにまとめる"}
              />
            </div>
          </div>
          <div className={'flex search-part'} style={{paddingTop:"10px"}}>
            <div className='direct_man flex' >
              <div className={'remove-x-input'} onClick={this.showPatientList.bind(this)}>
                <InputWithLabel
                  label="患者指定"
                  type="text"
                  isDisabled={true}
                  diseaseEditData={this.state.patient_name}
                />
              </div>
              <Button style={{width:"38px", height:"2.5rem", lineHeight:"2.5rem", marginLeft:"0.5rem"}} type="common" onClick={this.clearPatient}>C</Button>              
            </div>
            <div className='direct_man flex'>
              <div className={'remove-x-input'} onClick={this.showStaffList.bind(this)}>
                <InputWithLabel
                  label="スタッフ指定"
                  type="text"
                  isDisabled={true}
                  diseaseEditData={this.state.staff_name}
                />
              </div>
              <Button style={{width:"38px", height:"2.5rem", lineHeight:"2.5rem", marginLeft:"0.5rem"}} type="common" onClick={this.clearStaff}>C</Button>              
            </div>
            <div className="display_number">
              <SelectorWithLabel
                options={PER_PAGE}
                title="表示件数"
                getSelect={this.getDisplayNumber}
                departmentEditCode={this.state.display_number}
              />
            </div>
            <Button type="common" onClick={this.handleStaffLogs} className={this.state.curFocus === 1?"focus update-btn": "update-btn"}>更新</Button>
          </div>
        </SearchPart>
        <Wrapper>
          
          <table className="table table-bordered table-hover">
            <thead style={{borderBottom:"1px solid #dee2e6"}}>
            <tr style={{width:"calc(100% - 17px)"}}>
              <th style={{width:"6rem"}}>処理日</th>
              <th style={{width:"5rem"}}>処理時間</th>
              <th style={{width:"6rem"}}>日付</th>
              <th style={{width:"6rem"}}>患者番号</th>
              <th style={{width:"15rem"}}>患者名</th>
              {/*<th className="name">システム名</th>*/}
              {/*<th className="name">処理画面</th>*/}
              <th style={{width:"10rem"}}>画面名称</th>
              <th style={{width:"10rem"}}>スタッフ名</th>
              <th>更新区分</th>
            </tr>
            </thead>
            <tbody id="code-table">
            {this.state.isLoaded == false ? (
              <>
                <div className='text-center' style={{paddingTop:"200px"}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              </>
            ):(
              <>
                {pageOfItems !== undefined && pageOfItems !== null && pageOfItems.length > 0 && (
                  pageOfItems.map((item, index) => {
                    return (
                      <>
                        <tr onContextMenu={e => this.handleClick(e, index)}
                            onMouseOver={e=>this.editTooltip(e,item)}
                            onMouseOut={this.hideTooltip}
                        >
                          <td style={{width:"6rem"}}>{item.cur_date}</td>
                          <td style={{width:"5rem"}}>{item.op_date}</td>
                          <td style={{width:"6rem"}}>{item.cur_date}</td>
                          <td style={{width:"6rem", textAlign:"right"}}>{item.patient_number != null ? item.patient_number : ""}</td>
                          <td style={{width:"15rem"}}>{item.patient_name != null ? item.patient_name : ""}</td>
                          {/*<td className="name text-left">{this.context.currentSystem == "dialysis" ? "透析システム" : this.context.currentSystem == "haruka" ? "HARUKA" : ""}</td>*/}
                          {/*<td className="name text-left">{(item.op_screen == "計測値手入力" || item.op_screen == "血圧手入力" || item.op_screen == "体温手入力") ? "ベッドサイド" : item.op_screen}</td>*/}
                          <td style={{width:"10rem"}}>{item.op_screen}</td>
                          <td style={{width:"10rem"}}>{item.name}</td>
                          <td>{item.op_type}</td>
                        </tr>
                      </>)
                  })
                )}
              </>
            )}
            </tbody>
          </table>
          <FromApiPagination
            items={this.state.table_data}
            onChangePage={this.onChangePage.bind(this)}
            pageSize = {this.state.display_number}
            showAlways={true}
          />
          <Tooltip
            {...this.state.tooltip}
            parent={this}
            tooltip_content={this.state.tooltip_content}
          />
        </Wrapper>
        {this.state.isShowStaffList !== false && (
          <DialSelectMasterModal
            selectMaster = {this.selectStaff}
            closeModal = {this.closeDoctorSelectModal}
            MasterCodeData = {this.state.staffs}
            MasterName = 'スタッフ'
          />
        )}
        {this.state.isShowPatientList !== false && (
          <DialSelectMasterModal
            selectMaster = {this.selectPatient}
            closeModal = {this.closeDoctorSelectModal}
            MasterCodeData = {this.state.patientList}
            MasterName = '患者'
          />
        )}
      </Card>
    )
  }
}

StaffOperationHistoryLog.contextType = Context;
export default StaffOperationHistoryLog;