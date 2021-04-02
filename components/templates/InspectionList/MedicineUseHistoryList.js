import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
// import { getWeekName} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../molecules/InputWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import auth from "~/api/auth";
import {formatDateLine} from "../../../helpers/date";
import * as localApi from "~/helpers/cacheLocal-utils";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }
  .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
    label{
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .hBWNut {
    padding-top: 90px!important;
  }
  .schedule-area {
      background-color: white;
  }
  .arrow{
    cursor:pointer;
    font-size:20px
  }
  .prev-month {
      padding-right: 5px;
  }
  .next-month {
    padding-left: 5px;
  }
  .schedule-area {
    width: 100%;
    height: calc(100% - 220px);
    overflow-y: auto;
    table {
        margin-bottom: 0;
    }
    td {
        padding:0;
        text-align: center;
        font-size: 16px;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 8px;
        font-size: 18px;
        font-weight: normal;
        border-bottom: 1px solid #aaa;
        background-color: #e2caff;
    }
    .med-no {
        background-color: #e2caff;
    }
    .no-result {
      padding: 200px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
 
  .sunday-border {
    border-right: 1px solid #aaa;
  }
  .tr-border {
    td {
        border-bottom: 1px solid #aaa;
    }
  }
  
  .med-name{
    font-size:0.875rem;
    width: 12rem;
  }
  .med-unit{
    font-size:0.875rem;
    width: 4rem;
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  .search-box {
      width: 100%;
      display: flex;
  }
 .pullbox-select {
      font-size: 0.875rem;
      width: auto;
      padding-right: 2rem;
      height:30px;
  }
  .hvMNwk{
      margin-top: 0;
      .label-title{
          width: 0.5rem;
      }
  }
  .check-area{
      label {
          font-size: 0.875rem;
      }
  }
  .period{
      .react-datepicker-wrapper{
          input {
              width: 10rem;
          }
      }
  }
`;

const SpinnerWrapper = styled.div`
    padding-top: 70px;
    padding-bottom: 70px;
    height: 100px;
`;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

class MedicineUseHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_month: new Date(),
      visit_group : [{ id: 0, value: "" },],
      visit_group_id:0,
      order_type:0,
      visit_type:"",
      data_list:{},
      confirm_message: "",
      alert_messages:'',
      complete_message:'',
      display_type : [{ id: 0, value: "「1日」単位で表示" },],
      display_type_id:0,
      inspections: [
        {name:'処方薬', value:1},
        {name:'内服薬', value:2},
        {name:'外用薬', value:3},
        {name:'注射薬', value:4},
        {name:'用法表示', value:5},
      ],
      medicine_category: [1, 2,3,4,5],
      time_limit_from: new Date(),
      time_limit_to: new Date(new Date().setDate(new Date().getDate()+7)),
      one_day_array:[],
    };
    this.tr_index = null;
    this.td_index = null;
  }
  
  async componentDidMount() {
    auth.refreshAuth(location.pathname+location.hash);
    localApi.setValue("system_next_page", "/medicine_use_history");
    localApi.setValue("system_before_page", "/medicine_use_history");
    await this.getOneDayArray();
    await this.getSearchResult();
  }
  
  getOneDayArray = async()=>{
    let path = "/app/api/v2/medicine/get_one_day_separate";
    await apiClient._post(path).then(res=>{
      this.setState({
        one_day_array:res
      })
    })
  };
  getCheck = (name, number) => {
    if (name == 'inspections') {
      var check_status = this.state.medicine_category;
      var find_idx = check_status.indexOf(number);
      if (find_idx == -1) check_status.push(number);
      else check_status.splice(find_idx, 1);
      this.setState({medicine_category:check_status});
    }
  };
  
  getSearchResult =async()=>{
    let path = "/app/api/v2/medicine/history_list";
    let post_data = {
      time_limit_from:formatDateLine(this.state.time_limit_from),
      time_limit_to: formatDateLine(this.state.time_limit_to),
      medicine_category: this.state.medicine_category,
    };
    await apiClient._post(path, {params: post_data})
      .then((res) => {
        this.setState({
          data_list: res,
          complete_message: '',
        });
      })
      .catch(() => {
      });
  }
  
  createTable = (type,date_key,usage) => {
    let end_date = this.dayDifference(this.state.time_limit_from, this.state.time_limit_to);
    let table_menu = [];
    if(type === 'null'){
      table_menu.push(<td colSpan={end_date + 1}>
        <div className='spinner_area'>
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        </div>
      </td>);
    } else if(type === 'no_data'){
      table_menu.push(<td colSpan={end_date + 2}><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></td>);
    } else if(type === 'thead' || type === 'tbody'){
      let from_date = new Date(this.state.time_limit_from);
      for (let i = 0; i < end_date; i++) {
        let cur_dt = new Date(this.state.time_limit_from);
        cur_dt.setDate(from_date.getDate() + i);
        let week = cur_dt.getDay();
        let cur_date = formatDateLine(cur_dt);
        if(type === 'thead'){
          table_menu.push(<th className={week == 6 ? "sunday-border" : ""}>
            <div className={'text-center'}>{this.getWeekName(cur_dt)}</div>
            <div className={'text-center'}>{cur_dt.getDate()}</div>
          </th>)
        }
        if(type === 'tbody') {
          table_menu.push(<td className={week == 6 ? "sunday-border td-"+i : "td-"+i}>
            {cur_date == date_key && (
              <div>{this.getSeporator(usage)}</div>
            )}
          </td>)
        }
      }
    }
    return table_menu
  };
  
  getSeporator (usage) {
    let {one_day_array} = this.state;
    let one_day_separate_number = null;
    if (one_day_array != null && one_day_array[usage] != null && one_day_array[usage][0] != null) {
      one_day_separate_number = one_day_array[usage][0].one_day_separate_number;
    }
    if (one_day_separate_number == null) return '';
    if (one_day_separate_number == 0 || one_day_separate_number == 1){
      return "-";
    }
    let seporator = '';
    if (parseInt(one_day_separate_number) > 1 ) {
      for (var i= 0; i<one_day_separate_number; i++) {
        if (i!=one_day_separate_number -1)
          seporator += '-' + '/';
        else
          seporator += '-';
      }
    }
    return seporator;
  }
  
  gettime_limit_to = value => {
    if (value.getTime() - this.state.time_limit_from.getTime() < 0) {
      return;
    }
    this.setState({time_limit_to: value},()=>{
      this.getSearchResult();
    });
  };
  gettime_limit_from = value => {
    this.setState({time_limit_from: value},()=>{
      this.getSearchResult();
    });
  };
  
  goToPage = () => {
    let system_before_page = localApi.getValue('system_before_page');
    this.props.history.replace(system_before_page != "" ? system_before_page : "/top");
  };
  
  getPlaceSelect = e => {
    this.setState({
      display_type_id: parseInt(e.target.id),
    });
  };
  
  searchRecent = () => {
    this.getSearchResult();
  };
  
  dayDifference(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  
  getWeekName (week_date) {
    var weekday = new Array(7);
    weekday[0] = "日";
    weekday[1] = "月";
    weekday[2] = "火";
    weekday[3] = "水";
    weekday[4] = "木";
    weekday[5] = "金";
    weekday[6] = "土";
    return weekday[week_date.getDay()];
  }
  
  render() {
    let i = 0;
    return (
      <PatientsWrapper>
        <div className="title-area"><div className={'title'}>薬歴参照</div></div>
        <Flex>
          <div className="period d-flex">
            <label className="title-label">検索期間</label>
            <InputWithLabel
              label=""
              type="date"
              getInputText={this.gettime_limit_from}
              diseaseEditData={this.state.time_limit_from}
            />
            <InputWithLabel
              label=""
              type="date"
              getInputText={this.gettime_limit_to}
              diseaseEditData={this.state.time_limit_to}
            />
            <SelectorWithLabel
              options={this.state.display_type}
              title=""
              getSelect={this.getPlaceSelect}
              departmentEditCode={this.state.display_type_id}
            />
          </div>
          <div className="d-flex w-100 pt-1 border-top">
            <div className="d-flex w-75">
              <label className="title-label mt-1" style={{marginRight:"0.5rem"}}>表示区分</label>
              {this.state.inspections.map(inspection => {
                return (
                  <div className="check-area mt-1 d-flex" key={inspection}>
                    <Checkbox
                      label={inspection.name}
                      getRadio={this.getCheck.bind(this)}
                      number={inspection.value}
                      value={this.state.medicine_category.includes(inspection.value)}
                      name={`inspections`}
                    />
                  </div>
                )
              })}
            </div>
            <div className="w-25 text-right">
              <Button type="mono" className="tab-btn" onClick={()=>this.goToPage()}>閉じる</Button>
            </div>
          </div>
          <div className="d-flex w-100 pt-1 border-top">
            <div className="w-50">
              <Button type="mono" onClick={this.searchRecent} className="mr-1">最新表示</Button>
              <Button type="mono">項目設定</Button>
            </div>
            <div className="w-50 text-right">
              <Button type="mono" onClick={this.printList}>一覧印刷</Button>
            </div>
          </div>
        </Flex>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead>
            <tr>
              {/*<th className="med-no"></th>*/}
              <th className="med-name">薬品名</th>
              <th className="med-unit">単位</th>
              {this.createTable('thead')}
            </tr>
            </thead>
            <tbody>
            {this.state.data_list == null ? (
              <tr>
                {this.createTable('null')}
              </tr>
            ):(
              <>
                {Object.keys(this.state.data_list).length === 0 ? (
                  <tr>
                    {/*<td className="med-no"><div  className="med-no">{` `}</div></td>*/}
                    <td className="med-name"><div  className="med-name">{` `}</div></td>
                    <td className="med-unit"><div className="med-unit">{` `}</div></td>
                    {this.createTable('no_data')}
                  </tr>
                ) : (
                  Object.keys(this.state.data_list).map((index) => {
                    let item = this.state.data_list[index];
                    i++;
                    return (
                      <>
                        {item.map((pres_item, pres_key)=>{
                          return (
                            <>
                              {pres_item.order_data.order_data.map((rp_item,rp_key)=>{
                                return (<>
                                  {rp_item.med.map((med_item, med_key)=>{
                                    return (
                                      <tr className={'tr-border tr-'+index} style={{backgroundColor:"white"}} key={i*(pres_key+1)*(rp_key+1)+(med_key)}>
                                        {/*<td className="med-no"><div className="med-no">{i*(pres_key+1)*(rp_key+1)+(med_key)}</div></td>*/}
                                        <td className="med-name">
                                          <div className="med-name">{med_item.item_name}</div>
                                          {this.state.medicine_category.includes(5) && (
                                            <div>{rp_item.usage_name}</div>
                                          )}
                                        </td>
                                        <td className="med-unit"><div className="med-unit">{med_item.unit}</div></td>
                                        {this.createTable('tbody', index, rp_item.usage)}
                                      </tr>
                                    )
                                  })}
                                </>)
                              })}
                            </>
                          )
                        })}
                      </>
                    )
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </div>
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </PatientsWrapper>
    );
  }
}

MedicineUseHistoryList.contextType = Context;
MedicineUseHistoryList.propTypes = {
  history: PropTypes.object,
}
export default MedicineUseHistoryList;