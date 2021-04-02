import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DialSideBar from "../DialSideBar";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {makeList_code} from "~/helpers/dialConstants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import AggregateAgePreviewModal from "../../Print/AggregateAgePreviewModal";
// import AggregateDayPreviewModal from "../../Print/AggregateDayPreviewModal";
import AggregatePatientPreviewModal from "../../Print/AggregatePatientPreviewModal";
import { formatDateLine } from "~/helpers/date";
import axios from "axios/index";
import PropTypes from "prop-types";
import {getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import {makeList_codeName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 390px);
  left:200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
    .footer {
        margin-top: 10px;
        text-align: center;
    }
`;

const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 70px;
  padding: 10px;
  float: left;
  .search-box {
    width: 100%;
    display: flex;
  }
  .label-title {
    width: 95px;
    font-size: 1rem;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-select {
      font-size: 1rem;
      width: auto;
      padding-right:1.5rem;
      max-width:14rem;
  }
  .cur_date {
    font-size: 25px;
  }
  .print-type {
    font-size: 1rem;
    margin-left: 15px;
    .radio-btn label{
        width: 6rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 0.9rem;
    }
  }
  .radio-label {
    padding: 0.7rem 0 0 3rem;
    font-size: 1rem;
  }
  .pullbox-title {
    font-size: 1rem;
  }
  .pullbox-label {
    font-size: 1rem;
  }
 `;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: calc( 100vh - 300px);
  overflow-x: hidden;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .year-area {
      font-size: 30px;
      margin-left: 40%;
      margin-right: 40%;
      .prev-year {
        width: 20%;
        text-align: right;
        cursor: pointer;
      }
      .next-year {
        width: 20%;
        text-align: left;
        cursor: pointer;
      }
      .show-year {
          width: 60%;
          text-align: center;
      }
  }
  .month-area {
      margin-left: 20%;
      margin-right: 20%;
      .month-box {
        width: 15%;
        border: 1px solid  rgb(206, 212, 218);
        margin-right: 1.5%;
        margin-bottom: 10px;
        label {
          width: 100%;
          font-size: 20px;
          padding: 30px 20px;
          margin-right: 0;
          input {
            top: 0px;
          }
        }
      }
  }
  .padding-month {
      padding-top: 30px;
  }
  .title-padding {
    padding-top: 50px;
    padding-left: 55px;
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const week_days = ['日', '月', '火', '水', '木', '金', '土'];

class Aggregate extends Component {
  constructor(props) {
    super(props);
    let print_type = ["患者別表", "日付集計表", "年齢比率"];
    let print_dial_time = ["予定時間", "実績時間"];
    let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");

    this.aggregate_target_is_results_only = 1;
    if (sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").aggregate_target_is_results_only != undefined ){
      this.aggregate_target_is_results_only = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").aggregate_target_is_results_only;  
    }
    this.aggregate_time_round_mode = 0;
    if (sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").aggregate_time_round_mode != undefined ){
      this.aggregate_time_round_mode = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").aggregate_time_round_mode;  
    }

    this.state = {
      print_type,
      print_type_value: 0,
      print_dial_time,
      print_dial_time_value: 0,
      select_group: 0,
      months,
      year: '',
      print_month:'',
      dial_group_codes:makeList_code(code_master['グループ']),
      dial_group_codes_options:makeList_codeName(code_master['グループ'], 1),
      group_no:"",
      japan_year_name: "",
      from_date: "",
      end_date: "",
      is_loaded:false,
    }
  }
  
  async componentDidMount () {
    let server_time = await getServerTime();
    let cur_year = parseInt(new Date(server_time).getFullYear());
    let cur_month = parseInt(new Date(server_time).getMonth());
    this.setState({
      year:cur_year,
      print_month:cur_month,
      is_loaded:true,
    }, async()=>{
      await this.getJapanYearName();
      await this.getPeriod();
    });
  }
  
  getSelectGroup = e => {
    this.setState({
      group_no: e.target.id,
      group_name:e.target.value,
    });
  };
  
  selectPrintType = (e) => {
    this.setState({ print_type_value: parseInt(e.target.value)});
  };
  
  selectPrintMonth = (e) => {
    this.setState({ print_month: parseInt(e.target.value)},() => {
      this.getJapanYearName();
      this.getPeriod();
    });
  };
  
  selectPrintDialTime = (e) => {
    this.setState({ print_dial_time_value: parseInt(e.target.value)});
  };
  
  PrevYear = () => {
    let now_year = this.state.year;
    this.setState({ year: now_year - 1},() => {
      this.getJapanYearName();
      this.getPeriod();
    });
  };
  
  NextYear = () => {
    let now_year = this.state.year;
    this.setState({ year: now_year + 1},() => {
      this.getJapanYearName();
      this.getPeriod();
    });
  };
  
  getJapanYearName = () => {
    var current_year = this.state.year;
    var japan_year_name ='';
    var i = 0;
    for (i=1900;i <= current_year; i++){
      if (i <= 1912) {
        japan_year_name = "明治" + (i-1867).toString();
      } else if (i>1912 && i<1927){
        japan_year_name = "大正" + (i-1911).toString();
      } else if (i >=1927 && i<1990){
        japan_year_name = "昭和" + (i-1925).toString();
      } else if (i >= 1990 && i<=2019){
        japan_year_name = "平成" + (i-1988).toString();
      } else {
        japan_year_name = "令和" + (i-2018).toString();
      }
    }
    japan_year_name = japan_year_name + "年" + (this.state.print_month+1).toString() + "月";
    this.setState({japan_year_name});
  };
  
  getAggregate = async () =>{
    var year = this.state.year;
    var month = this.state.print_month;
    var from_date = formatDateLine(new Date(year, month, 1));
    var end_date = formatDateLine(new Date(year, month+1, 0));
    let path = "/app/api/v2/dial/print/aggregate_search";
    let post_data = {
      from_date,
      end_date,
      group_no: this.state.group_no,
      search_kind:this.state.print_type_value,
      print_dial_time_value:this.state.print_dial_time_value,
      done_flag: this.aggregate_target_is_results_only == 1?1:0,
      aggregate_time_round_mode : this.aggregate_time_round_mode,
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      table_data: data != null && data != undefined ? data : [],
      open_modal:true,
      from_date: from_date,
      end_date: end_date
    });
  };
  
  openModal = () => {
    this.getAggregate();
  };
  
  closeModal = () => {
    this.setState({
      open_modal: false
    })
  };
  getPeriod = () => {
    var year = this.state.year;
    var month = this.state.print_month;
    var from_date = new Date(year, month, 1);
    var end_date = new Date(year, month+1, 0);
    var days_month=[];
    for (var d = from_date; d<=end_date;d.setDate(d.getDate() + 1)){
      var week_name =week_days[d.getDay()];
      days_month.push({
        day:d.getDate(),
        week:week_name,
        date:formatDateLine(d)
      })
    }
    this.setState({list_date_week:days_month})
    return days_month;
  }
  
  render() {    
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <Card>
          <div className="title">透析実績集計</div>
          <SearchPart>
            <div className="search-box">
              <SelectorWithLabel
                options={this.state.dial_group_codes_options}
                title="グループ"
                getSelect={this.getSelectGroup}
                selectedValue={this.state.group_no}
              />
              <div className="radio-label">印刷種別</div>
              <div className="print-type">
                {this.state.print_type.map((item, key)=>{
                  return (
                    <>
                      <RadioButton
                        id={`print_type_${key}`}
                        value={key}
                        label={item}
                        name="print_type"
                        getUsage={this.selectPrintType}
                        checked={this.state.print_type_value == key ? true : false}
                      />
                    </>
                  );
                })}
              </div>
              <div className="radio-label">印刷透析時間</div>
              <div className="print-type">
                {this.state.print_dial_time.map((item, key)=>{
                  return (
                    <>
                      <RadioButton
                        id={`print_dial_time_${key}`}
                        value={key}
                        label={item}
                        name="print_dial_time"
                        getUsage={this.selectPrintDialTime}
                        checked={this.state.print_dial_time_value == key ? true : false}
                      />
                    </>
                  );
                })}
              </div>
            </div>
          </SearchPart>
          {this.state.is_loaded ? (
            <>
              <Wrapper>
                <div className="title-padding">集計範囲</div>
                <div className="year-area flex">
                  <div className="prev-year" onClick={this.PrevYear}>{"<"}</div>
                  <div className="show-year">{" " + this.state.year + "年 "}</div>
                  <div className="next-year" onClick={this.NextYear}>{">"}</div>
                </div>
                <div className="month-area padding-month flex">
                  {this.state.months.map((item, key)=>{
                    return (
                      <>
                        <div className="month-box">
                          <RadioButton
                            label={item + "月"}
                            getUsage={this.selectPrintMonth.bind(this)}
                            name="check"
                            id={`print_month_${key}`}
                            value={key}
                            checked={this.state.print_month == key ? true : false}
                          />
                        </div>
                      </>
                    );
                  })}
                </div>
              </Wrapper>
              <div className="footer-buttons footer">
                <Button onClick={this.openModal} className={this.state.curFocus === 1?"red-btn focus": "red-btn"}>集計</Button>
              </div>
            </>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
          {/* {this.state.open_modal && this.state.print_type_value === 2 &&(
                    <AggregateAgePreviewModal
                        contents={this.state.table_data}
                        closeModal={this.closeModal}
                        japan_year={this.state.japan_year_name}
                        group_name={this.state.group_name}
                        print_dial_time_value={this.state.print_dial_time_value}
                    />
                )}
                {this.state.open_modal && this.state.print_type_value === 1 &&(
                    <AggregateDayPreviewModal
                        contents={this.state.table_data}
                        list_date_week={this.state.list_date_week}
                        closeModal={this.closeModal}
                        japan_year={this.state.japan_year_name}
                        group_name={this.state.group_name}
                    />
                )} */}
          {this.state.open_modal &&(
            <AggregatePatientPreviewModal
              contents={this.state.table_data}
              list_date_week={this.state.list_date_week}
              closeModal={this.closeModal}
              japan_year={this.state.japan_year_name}
              group_name={this.state.group_name}
              print_dial_time_value={this.state.print_dial_time_value}
              print_type={this.state.print_type_value}
              from_date={this.state.from_date}
              end_date={this.state.end_date}
              aggregate_time_round_mode = {this.aggregate_time_round_mode}
            />
          )}
        </Card>
      </>
    )
  }
}

Aggregate.propTypes = {
  history : PropTypes.object
};
export default Aggregate;