import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat, formatJapanDate, formatDateLine} from "~/helpers/date"
import * as apiClient from "~/api/apiClient";
import SealPrintPreviewModal from "./SealPrintPreviewModal";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import renderHTML from 'react-render-html';
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {setDateColorClassName} from "~/helpers/dialConstants";
// import * as sessApi from "~/helpers/cacheSession-utils";
import axios from "axios";
registerLocale("ja", ja);

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  float: left;
  width: calc(100% - 190px);
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 10px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;


const Wrapper = styled.div`
  width: 100%;
  height: calc( 100vh - 220px);
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;

  .content{
    margin-top: 10px;
    overflow:hidden;
    overflow-y: auto;
    height: calc(100vh - 12.5rem);
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .clickable{
    cursor:pointer;
    input{
      cursor:pointer;
    }
  }
  .year_month{
    font-size: 25px;
    margin-left: 40%;
  }
  .arrow{
    margin-left: 10px;
    margin-right: 10px;
  }
  .patterns{
      display:inline;
      width:100%;
      .one_pattern_blog{
          width:25%!important;
          display: inline-block;
          margin-bottom:20px;
          padding-left:25px;
          div{
            // white-space: nowrap;
          }
      }
  }
  .patient_name{
    word-break: break-all;
    white-space: break-spaces!important;
  }
  .aggregate{
      padding-left:20px;
  }
  .aggregate_title{
    font-size:20px;
  }
  .label-title {
    font-size:1rem;
    width: 4rem;
    text-align: right;
    margin-right: 0.625rem;
    line-height: 1.875rem;
  }
  .pullbox-select {
    font-size: 1rem;
    max-width: 12rem;
    height: 1.875rem;
    padding-right:2rem;
    width:auto;
  }
  .selectbox-area {
    margin-left: 5rem;
    padding-top:1rem;
  }
 `;

class Seal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    this.state = {
      isOpenPreviewModal: false,
      search_day:new Date(),
      display_group:[{ id: 0, value: "全て" }],
    }
  }
  
  async componentDidMount(){
    let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
    window.sessionStorage.removeItem("from_daily_print");
    if (from_daily_print_date != undefined && from_daily_print_date != null){
      this.setState({search_day:new Date(from_daily_print_date)},()=>{
        this.getSearchResult(this.state.search_day);
      })
    } else {
      this.getSearchResult(this.state.search_day);
    }
    
    this.display_group = [{ id: 0, value: "全て" }];
    
    this.getGroup1().then(result => {
      if (result != null && result != undefined && result.length > 0) {
        result.map((item, index)=>{
          this.display_group.push({id: index+1, value:item.value});
        });
      }
    })
    this.setState({display_group: this.display_group})
  }
  
  getGroup1 = async () => {
    let path = "/app/api/v2/dial/master/bed/getGroup1List";
    let post_data = {
    };
    const { data } = await axios.post(path, {params: post_data});
    return data;
  };
  
  getSearchResult = async(search_day) => {
    let path = "/app/api/v2/dial/pattern/anti/aggregate";
    let post_data = {
      search_day:formatDateLine(search_day),
      group:this.state.schGroup,
    };
    await apiClient.post(path, {params: post_data}).then((res)=>{
      this.setState({
        patterns:res.patterns,
        aggregate:res.aggregate
      })
    })
  }
  
  getSearchDay = value => {
    this.setState({
      search_day: value,
    }, () => {
      this.getSearchResult(this.state.search_day);
    });
  }
  
  PrevDay = () => {
    this.setState({ search_day: getPrevDayByJapanFormat(this.state.search_day)}, () => {
      this.getSearchResult(this.state.search_day);
    });
    
  };
  
  NextDay = () => {
    this.setState({ search_day: getNextDayByJapanFormat(this.state.search_day)}, () => {
      this.getSearchResult(this.state.search_day);
    });
  };
  
  openPreviewModal = () => {
    this.setState({
      isOpenPreviewModal: true,
    });
  }
  closeModal = () => {
    this.setState({
      isOpenPreviewModal: false,
    });
  };
  
  filter = (item, index) => {
    switch(index){
      case 1:
        if (item.label_1_text != undefined && item.label_1_text != null && item.label_1_text !='') return item.label_1_text;
        if (item.label_2_text != undefined && item.label_2_text != null && item.label_2_text !='') return item.label_2_text;
        break;
      // case 2:
      //     if (item.label_2_text != undefined && item.label_2_text != null && item.label_2_text !='') return item.label_2_text;
      //     break;
      // case 3:
      //     if (item.label_3_text != undefined && item.label_3_text != null && item.label_3_text !='') return item.label_3_text;
      //     break;
      default:
        if (item.label_1_text != undefined && item.label_1_text != null && item.label_1_text !='') return item.label_1_text;
        if (item.label_2_text != undefined && item.label_2_text != null && item.label_2_text !='') return item.label_2_text;
        break;
    }
    if (item.name_short != undefined && item.name_short != null && item.name_short !='') return item.name_short;
    return item.name
  }
  
  getGroupSelect = (e) => {
    this.setState({ schGroup: e.target.value }, () => {
      this.getSearchResult(this.state.search_day);
    });
  };
  
  render() {
    let {patterns, aggregate} = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <Card>
          <Wrapper>
            <div className="title">抗凝固剤シール</div>
            <div className="year_month flex">
              <div className="prev-day arrow clickable" onClick={this.PrevDay}>{"< "}</div>
              <DatePicker
                locale="ja"
                selected={this.state.search_day}
                onChange={this.getSearchDay.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={<ExampleCustomInput />}
                dayClassName = {date => setDateColorClassName(date)}
              />
              <div className="next-day arrow clickable" onClick={this.NextDay}>{" >"}</div>
              <div className="selectbox-area">
                <SelectorWithLabel
                  options={this.state.display_group}
                  title="フロア"
                  getSelect={this.getGroupSelect}
                  departmentEditCode={this.state.schGroup}
                />
              </div>
            </div>
            <div className="content">
              <div className="patterns">
                {patterns != undefined && patterns != null && patterns.length>0 && (
                  patterns.map((item, index) => {
                    return (
                      <div className="one_pattern_blog" key={index}>
                        <div className="patient_name">{item.patient_name}</div>
                        <div className="label label_1" style={item.label_1_is_colored_font?{color:'#'+item.label_color}:{background:'none'}}>{this.filter(item,1)}</div>
                        <div className="IP_velocity">{item.anti_items != null && item.anti_items.amount != ''?item.anti_items.amount+item.anti_items.unit:renderHTML('<br/>')}</div>
                        <div className="label label_2" style={item.label_2_is_colored_font?{color:'#'+item.label_color}:{background:'none'}}>{item.label_2_text}</div>
                      </div>
                    )
                  })
                )}
              </div>
              <div className="aggregate">
                {aggregate != undefined && aggregate != null && aggregate.length>0 && (
                  <div className="aggregate_title">《集計》</div>
                )}
                {aggregate != undefined && aggregate != null && aggregate.length>0 && (
                  aggregate.map((item, index) => {
                    return(
                      <div key ={index} className="one_group" style={item.label_color!=null?{color:'#'+item.label_color}:{background:'none'}}>{item.name}&nbsp;:&nbsp;{item.count}本</div>
                    )
                  })
                )}
              </div>
            
            </div>
            
            <div className="footer-buttons">
              <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
            </div>
            {this.state.isOpenPreviewModal!== false && (
              <SealPrintPreviewModal
                closeModal={this.closeModal}
                content_data={this.state}
                // aggregate = {this.state.aggregate}
                // schedule_date = {this.state.search_day}
              />
            )}
          </Wrapper>
        </Card>
      </>
    )
  }
}

export default Seal
