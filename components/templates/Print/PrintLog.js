import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DatePicker from "react-datepicker";
// import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
// import RadioButton from "~/components/molecules/RadioInlineButton";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel"
import { formatJapanDate, formatDateLine, formatTimeIE } from "~/helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
// import DialMultiSelectMasterModal from "~/components/templates/Dial/Common/DialMultiSelectMasterModal";
import DialMultiSelectPatientModal from "~/components/templates/Dial/Common/DialMultiSelectPatientModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import axios from "axios";
import {PER_PAGE} from "~/helpers/constants";
import Context from "~/helpers/configureStore";
import PrintLogPreview from "./PrintLogPreview"
import FromApiPagination from "~/components/templates/Maintenance/FromApiPagination";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .display_number{
    .pullbox-title{
      font-size: 1rem;
    }
  }
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
          font-size: 16px;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: block;
  // align-items: flex-start;
  // justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 105px;
  padding: 20px;
  padding-bottom: 5px;
  padding-top: 15px;
  float: left;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 7rem;
    text-align: right;
    margin-right: 3px;
    padding-right: 10px;
  }
  .pullbox-select {
      font-size: 16px;
      width: 150px;
  }
  .medicine_type {
    font-size: 16px;
    margin-left: 15px;
    .radio-btn label{
        width: 60px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 16px;
    }
  }
  .radio-label {
    width: 7rem;
    float: left;
    padding-right: 10px;
    text-align: right;
    font-size: 1rem;
  }
  .select_date_range{
      display:flex;
      .pullbox{
          margin-right:20px;
      }
      span{
          padding-top:9px;
          margin: 0px 10px;
      }
    
  }
   .example-custom-input{
        font-size: 15px;
        width:180px;
        text-align:center;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
        border: 1px solid;
        margin-left:5px;
        margin-right:5px;
        cursor: pointer;
    }
    .select_patient{
        button{
            height: 38px;
            padding: 8px 16px;
            span{
                font-size: 1rem;
                padding-top:0px !important;
            }
        }
    }

    .direct_man{
      label{
        width: 120px;
      }
      .label-title{
        font-size:1rem;
      }
      .pullbox-label, .pullbox-select{
          width:200px;
      }

      input{
        width: 200px;
      }

      .hvMNwk{
        margin-top: 0px;
      }
    }

    button{
      margin-left: 10px;
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
  .pagination{
    margin-bottom: 0.5rem !important;
  }
  
  table {
    text-align: center;
    thead{
        display:table;
        // width:calc(100% - 1rem);
        width:100%;
        tr{width: calc(100% - 17px);}
    }
    tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 24rem);
        // width:100%;
    }
    tr{
        display: table;
        width:100%;
    }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
          word-break:break-all;
          word-wrap:break-word;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
          word-break:break-all;
          word-wrap:break-word;
      }
      .date-td {
        width: 7rem;
      }
      .time-td{
        width: 6rem;
      }
      .name{
          width:9rem;
      }
      .code-number {
          width: 7rem;
      }
  }

 `;

const page_names= [
  { id: 0, value: ""},
  { id: 1, value: "透析パターン"},
  { id: 2, value: "抗凝固法パターン"},
  { id: 3, value: "ダイアライザパターン"},
  { id: 4, value: "注射パターン"},
  { id: 5, value: "処方パターン"},
  { id: 6, value: "検査パターン"},
  { id: 7, value: "透析中処方パターン"},
  { id: 8, value: "管理料パターン"},
  { id: 9, value: "透析スケジュール"},
  { id: 10, value: "処方スケジュール"},
  { id: 11, value: "透析中処方スケジュール"},
  { id: 12, value: "注射スケジュール"},
  { id: 13, value: "検査スケジュール"},
  { id: 14, value: "管理料スケジュール"},
];
class PrintLog extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let table_data = [];
    this.state = {
      start_date:new Date(),
      end_date:new Date(),
      table_data,
      staff_name: "",
      patient_name: "",
      patient_id: 0,
      staff_id: 0,
      current_page: 1,
      isShowPatientList: false,
      isLoaded: false,
      isShowStaffList: false,
      isOpenPrintPreviewModal: false,
      selected_patients_list:[],
      confirm_message:"",
      display_number: 20,
    }
  }
  
  async componentDidMount () {
    await this.getStaffLogs();
    await this.getStaffs();
  }
  
  getStaffLogs = async (_flag=null) => {
    let path = "/app/api/v2/dial/staff/search_staff_logs_print";
    var post_data = {
      start_date: formatDateLine(this.state.start_date),
      end_date: formatDateLine(this.state.end_date),
      patient_ids: this.state.patient_ids,
      page:this.state.page,
      current_page: this.state.current_page,
      display_number: this.state.display_number,
      staff_id: this.state.staff_id,
      get_data_flag: _flag
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
  
  closeModal = () => {
    this.setState({
      isShowPatientList: false,
      isShowStaffList: false,
      isOpenPrintPreviewModal: false,
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
      start_date: value,
      isLoaded: false
    }, ()=>{
      this.getStaffLogs()
    });
  };
  
  getEndDate = value => {
    this.setState({
      end_date: value,
      isLoaded: false
    }, ()=>{
      this.getStaffLogs()
    });
  };
  
  showPatientList = () => {
    this.setState({
      isShowPatientList:true
    });
  }
  
  showStaffList = () => {
    this.setState({
      isShowStaffList:true
    });
  }
  
  selectPatients = (patients) => {
    this.setState({
      // patient_name:patient.patient_name,
      selected_patients_list:patients,
      patient_ids: patients,
      isLoaded: false
    }, () => {
      this.getStaffLogs();
    })
    this.closeModal();
  }
  
  selectStaff = (staff) => {
    this.setState({
      staff_name:staff.name,
      staff_id: staff.number,
    })
    this.closeModal();
  }
  
  // clearPatient = () => {
  //   this.setState({
  //      patient_name: "",
  //      patient_id: 0,
  //   });
  //   this.closeModal();
  // }
  
  clearStaff = () => {
    this.setState({
      staff_name:"",
      staff_id: 0,
    });
    this.closeModal();
  }
  
  getPage = (e) => {
    this.setState({
      page_id:parseInt(e.target.id),
      page: page_names[parseInt(e.target.id)].value,
      isLoaded: false
    }, () => {
      this.getStaffLogs();
    })
  }
  
  openPreviewModal = () => {
    this.setState({isOpenPrintPreviewModal: true})
  }
  
  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };
  
  onChangePage(pageOfItems, _curPage) {
    this.setState({
      pageOfItems: pageOfItems,
      current_page: _curPage,
      isLoaded: false
    },()=>{
      this.getStaffLogs("only_data");
    });
  }
  
  render() {
    let {pageOfItems} = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <Card>
        <div className="title">変更履歴</div>
        <SearchPart>
          <div className={'flex'}>
            <div className="radio-label" style={{lineHeight:"38px"}}>処理日範囲</div>
            <DatePicker
              locale="ja"
              selected={this.state.start_date}
              onChange={this.getStartDate.bind(this)}
              dateFormat="yyyy/MM/dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              customInput={<ExampleCustomInput />}
              dayClassName = {date => setDateColorClassName(date)}
            />
            <span style={{lineHeight:"32px"}}>～</span>
            <DatePicker
              locale="ja"
              selected={this.state.end_date}
              onChange={this.getEndDate.bind(this)}
              dateFormat="yyyy/MM/dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              customInput={<ExampleCustomInput />}
              dayClassName = {date => setDateColorClassName(date)}
            />
          </div>
          <div className={'flex'} style={{paddingTop:"7px"}}>
            <div className="display_number">
              <SelectorWithLabel
                options={PER_PAGE}
                title="表示件数"
                getSelect={this.getDisplayNumber}
                departmentEditCode={this.state.display_number}
              />
            </div>
            <div className="select_patient"><Button onClick={this.showPatientList.bind(this)}>患者選択</Button></div>
            <div className='direct_man'>
              <SelectorWithLabel
                options={page_names}
                title="処理画面"
                getSelect={this.getPage}
                departmentEditCode={this.state.page_id}
              />
            </div>
          </div>
        </SearchPart>
        <Wrapper>
          <table className="table table-bordered table-hover" id="code-table">
            <thead>
            <tr>
              <th className='date-td'>処理日</th>
              <th className="time-td">処理時間</th>
              <th className="code-number">患者番号</th>
              <th className='name'>患者名</th>
              <th className='name'>システム名</th>
              <th className='screen'>処理画面</th>
              <th className='name'>スタッフ名</th>
              <th className="code-number last-th">更新区分</th>
            </tr>
            </thead>
            <tbody>
            {this.state.isLoaded == false ? (
              <div className='spinner-disease-loading center'>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ):(
              <>
                {this.state.table_data != null && this.state.table_data != undefined && this.state.table_data.length > 0 && pageOfItems !== undefined && pageOfItems !== null && pageOfItems.length > 0 && this.state.staff_list_by_number != undefined && (
                  pageOfItems.map((item, index) => {
                    return (
                      <>
                        <tr onContextMenu={e => this.handleClick(e, index)}>
                          <td className="date-td text-center">{item.cur_date}</td>
                          <td className="time-td text-center">{formatTimeIE(item.op_date)}</td>
                          <td className="code-number text-left">{item.patient_number}</td>
                          <td className='name text-left'>{item.patient_name}</td>
                          <td className='name'>{this.context.currentSystem == "dialysis" ? "透析システム" : this.context.currentSystem == "haruka" ? "HARUKA" : ""}</td>
                          <td className='screen text-left'>{item.op_screen}</td>
                          <td className='name text-left'>{this.state.staff_list_by_number[item.staff_number]}</td>
                          <td className="code-number">{item.op_type}</td>
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
          <div className="footer-buttons">
            <Button className={'red-btn'} onClick={this.openPreviewModal}>帳票プレビュー</Button>
          </div>
        </Wrapper>
        {this.state.isShowStaffList !== false && (
          <DialSelectMasterModal
            selectMaster = {this.selectStaff}
            closeModal = {this.closeModal}
            MasterCodeData = {this.state.staffs}
            MasterName = 'スタッフ'
            clearItem = {this.clearStaff}
          />
        )}
        {this.state.isShowPatientList !== false && (
          <DialMultiSelectPatientModal
            selectMasters = {this.selectPatients}
            closeModal = {this.closeModal}
            selected_masters_list = {this.state.selected_patients_list}
            clearItem = {this.clearPatient}
          />
        )}
        {this.state.isOpenPrintPreviewModal !== false && (
          <PrintLogPreview
            closeModal = {this.closeModal}
            table_data = {this.state.pageOfItems}
            start_date = {this.state.start_date}
            end_date = {this.state.end_date}
            staff_list_by_number = {this.state.staff_list_by_number}
            page_name={this.state.page}
          />
        )}
      </Card>
    )
  }
}

PrintLog.contextType = Context;
export default PrintLog