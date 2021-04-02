import React, { Component } from "react";
import PropTypes from "prop-types";
// import * as colors from "../_nano/colors";
import styled from "styled-components";
import Checkbox from "../molecules/Checkbox";
// import UsageTab from "../molecules/UsageTab";
import {KARTEMODE} from "~/helpers/constants"
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";

registerLocale("ja", ja);

// const Ul = styled.ul`
//   width: 100%;

//   &.nav {
//     padding-left: 8px;
//   }

//   > li > div {
//     cursor: pointer;
//   }

//   > li > a {
//     color: #bbbbbb;
//     padding: 4px 14px;
//   }

//   > li > a.active {
//     color: ${colors.onSurface};
//   }

//   .row {
//     // width: calc(100% - 140px);
//     width: 100%;
//     padding-left: 7px;
//     padding-top: 4px;
//   }
// `;

const Wrapper = styled.div`
  width: 100%;

  .row {    
    display: flex;
    width: 100%;
    padding-left: 7px;
    padding-top: 4px;
  }

  .selected {
    background-color: rgb(105, 200, 225);
    span {
      color: white;
    }
  }
  .schedule-date-area{
    display: inline-block;
    div{
      width: auto;
    }
  }
  .no-selected{
    background-color: white;
    span {
      color: black;
    }
  }
  .inject-category{
    overflow: hidden;
    button{
      border: 1px solid black;
      padding: 4px 8px;
      margin-right: 4px;
      float: left;
    }

    input{
      width: 100px;
      font-size: 14px;
      text-align: center;
    }

    .react-datepicker-popper{
      margin-left: -200px !important;
    }
    .react-datepicker__triangle{
      margin-left: 200px !important;
    }
    .react-datepicker__navigation{
      border: 0.45rem solid transparent;
      padding:0px;
      margin-right:0px;
    }
    .react-datepicker__navigation--previous{      
      border-right-color: #ccc;      
      
    }
    .react-datepicker__navigation--next{      
      border-left-color: #ccc;
    }
  }
  
  .disable-background-input{
    input{
      pointer-events: none;
      background: #ddd;
      border: 1px solid black;
    }
  }
  .inject-search{
    display: flex;
  }
  .date{
    float: left;    
  }
  .inject-type{
    .inject-type-btn{      
      min-width:4rem;
      height:2rem;
      padding-left:0.5rem;
      padding-right:0.5rem;
      padding-bottom:0rem;
      padding-top:0rem;      
    }
    .date{
      font-size:1rem;
      padding:0.25rem 0.5rem;
      padding-top:0.3rem;
      padding-bottom:0;
    }
    .react-datepicker-wrapper{
      input{
        border-width: 1px !important;
        padding: 0px 0px !important;
        width:5.5rem;
        font-size:1rem;
        height:2rem;
        line-height:2rem;
      }
    }
  }
`;

class InjectionInOutNav extends Component {
  constructor(props) {
    super(props);    

    this.cur_date = new Date();
    this.schedule_date = new Date();
    this.schedule_date.setDate(new Date().getDate()+1);
    this.state = {
      schedule_date: this.props.schedule_date,
      id: this.props.id,
      unusedDrugSearch: this.props.unusedDrugSearch,
      profesSearch: this.props.profesSearch,
      normalNameSearch: this.props.normalNameSearch
    };
  }

  getRadio = (name, value) => {
    this.props.getRadio(name, value);
  };

  getDate = value => {
    this.props.setScheduleDate(value);
  }

  selectInOut = (id) => {
    // if exist period injection
    let cacheState = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    let hasAdministratePeriod = false;
    if (cacheState != undefined && cacheState != null && cacheState[0].injectData.length > 0) {
      cacheState[0].injectData.map(item=>{
        if (item.administrate_period != undefined && item.administrate_period != null) {
          hasAdministratePeriod = true;
        }
      });
    }
    if (hasAdministratePeriod == true && this.context.karte_status.code == 1) return;

    let schedule_date = this.state.schedule_date;
    if (id == 3 || id == 1 || id == 4) { // 当日注射      
      schedule_date = this.cur_date;
    } else {      
      let date1 = this.state.schedule_date;
      date1.setHours(0, 0, 0, 0);
      let date2 = this.cur_date;
      date2.setHours(0, 0, 0, 0);
      if (date1.getTime() == date2.getTime()) {
        schedule_date = this.schedule_date;
      }
    }
    this.props.selectInOut(id, schedule_date);
  }

  testInOutRender = (reset_state) => {
    this.setState(reset_state);
  }

  render() {
    var is_patient = window.location.href.indexOf("preset") == -1;
    let karte_mode = this.context.$getKarteMode(this.props.patientId);
    return (
      <>
        <Wrapper>      
          <div className={`inject-category ${this.state.id == 3 || this.state.id == 4 || this.state.id == 1 ? "disable-background-input":""}`}>
            <div className="inject-type">
              <Button className={this.state.id == 0 ? "selected inject-type-btn" : "no-selected inject-type-btn"} onClick={()=>this.selectInOut(0)}>予約注射</Button>
              {this.context.karte_status.code == 1 && (
                <>
                  <Button className={this.state.id == 4 ? "selected inject-type-btn" : "no-selected inject-type-btn"} onClick={()=>this.selectInOut(4)}>定期注射</Button>
                </>
              )}
              <Button className={this.state.id == 3 ? "selected inject-type-btn" : "no-selected inject-type-btn"} onClick={()=>this.selectInOut(3)}>当日注射</Button>
              <Button className={this.state.id == 1 ? "selected inject-type-btn" : "no-selected inject-type-btn"} onClick={()=>this.selectInOut(1)}>実施済み注射</Button>
              <div className="schedule-date-area">
                <div className="date" style={{fontSize:'1rem', height:"2rem", lineHeight:"2rem", padding:"0px", paddingRight:"0.2rem", paddingLeft:"0.5rem"}}>予定日付</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.id == 3 || this.state.id == 4 || this.state.id == 1 ? this.cur_date : this.state.schedule_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  minDate={this.state.id == 3 || this.state.id == 4 || this.state.id == 1 ? "": this.schedule_date}
                  placeholderText="年/月/日"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
              </div>
            </div>            
          </div>
          <div className="inject-search">
            <div>
              <Checkbox
                label="登録外薬品を含む検索"
                name="unusedDrugSearch"
                getRadio={this.getRadio.bind(this)}
                value={this.state.unusedDrugSearch}
                isDisabled={karte_mode == KARTEMODE.READ && is_patient}
              />
            </div>
            <div>
              <Checkbox
                label="全文検索"
                name="profesSearch"
                getRadio={this.getRadio.bind(this)}
                value={this.state.profesSearch}
                isDisabled={karte_mode == KARTEMODE.READ && is_patient}
              />
            </div>
            <div>
              <Checkbox
                label="一般名検索"
                name="normalNameSearch"
                getRadio={this.getRadio.bind(this)}
                value={this.state.normalNameSearch}
                isDisabled={karte_mode == KARTEMODE.READ && is_patient}
              />
            </div>
          </div>
        </Wrapper>
      </>
    );
  }
}
InjectionInOutNav.contextType = Context;
InjectionInOutNav.propTypes = {
  id: PropTypes.number,
  selectInOut: PropTypes.func,
  setScheduleDate: PropTypes.func,
  unusedDrugSearch: PropTypes.bool,
  profesSearch: PropTypes.bool,
  normalNameSearch: PropTypes.bool, 
  schedule_date: PropTypes.string, 
  getRadio: PropTypes.func,
  patientId: PropTypes.number,
  cacheSerialNumber: PropTypes.number,
};

export default InjectionInOutNav;
