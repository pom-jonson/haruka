import React, { Component } from "react";
import PropTypes from "prop-types";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { faCalendarAlt } from "@fortawesome/pro-solid-svg-icons";
import axios from "axios/index";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {formatDateLine} from "~/helpers/date";
import RoutineInputPanel from "./RoutineInputPanel";
import $ from "jquery";
import {FUNCTION_ID_CATEGORY} from "~/helpers/constants";
import Checkbox from "~/components/molecules/Checkbox";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import Button from "~/components/atoms/Button";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
  cursor: pointer;
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {padding: 0.2rem 0.5rem;}
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {color: blue;}
`;

const ContextMenu = ({visible,x,y,parent, index, change}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction('add')}>追加</div></li>
          {change === true && (
            <li><div onClick={() => parent.contextMenuAction('delete', index)}>削除</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ItemTableBody extends Component {
  constructor(props) {
    super(props);
    let japan_year_list = [];
    let month_list = [];
    let day_list = [];
    var i =0;
    var japan_year_name ='';
    for (i=1;i<=12;i++){
      month_list.push({id:i,value:i});
    }
    for (i =1;i<=31;i++){
      day_list.push({id:i,value:i});
    }
    var current_year = new Date().getFullYear();
    for (i=1900;i <= current_year+80; i++){
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
      japan_year_list.push({id:i, value:japan_year_name});
    }
    japan_year_list.reverse();
    let title = "";
    switch (this.props.function_id){
      case 1:
        title = "汎用オーダー";
        break;
      case 2:
        title = "在宅";
        break;
      case 3:
        title = "放射線";
        break;
      case 4:
        title = "精神";
        break;
      case 5:
        title = "リハビリ";
        break;
    }
    this.state = {
      isItemSelectModal:false,
      isRoutineModal:false,
      cur_index:0,
      item_categories:[{ id: 0, value: ""},],
      day_list,
      month_list,
      japan_year_list,
      title,
      item_details:props.item_details,
    };
    this.tr_index = 0;
  }
  
  async componentDidMount() {
    let path = "/app/api/v2/order/guidance/getItemCategories";
    let post_data = {
      function_id:this.props.function_id,
    };
    let { data } = await axios.post(path, {params: post_data});
    if(data.length){
      let item_categories = this.state.item_categories;
      data.map((item, index)=>{
        item_categories[index + 1] = {id: item.item_category_id, value: item.name};
      });
      this.setState({
        item_categories,
      });
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      item_details:nextProps.item_details,
    });
  }
  
  getItemCategory =(index, e)=>{
    let item_details = this.state.item_details;
    item_details[index]['classfic'] = e.target.id;
    this.props.setItemDetails(item_details);
  }
  
  openItemSelectModal = value => {
    this.setState({
      isItemSelectModal: true,
      cur_index: value,
    })
  };
  
  closeModal = () => {
    this.setState({
      isItemSelectModal: false,
      isRoutineModal: false,
    });
  };
  
  setItemName = (data) => {
    let item_details = this.state.item_details;
    let detail = [];
    if (this.props.function_id == FUNCTION_ID_CATEGORY.RADIATION || this.props.function_id == FUNCTION_ID_CATEGORY.ENDOSCOPE){
      detail = data;
    }
    detail['classfic'] = data.item_category_id;
    detail['classfic_name'] = (this.state.item_categories.find(x => x.id === data.item_category_id) != undefined) ? this.state.item_categories.find(x => x.id === data.item_category_id).value : '';
    detail['item_id'] = data.item_id;
    detail['item_name'] = data.name;
    if(data.input_item1_flag === 1){
      detail['attribute1'] = data.input_item1_attribute;
      detail['format1'] = data.input_item1_format;
      detail['unit_name1'] = data.input_item1_unit;
      detail['max_length1'] = data.input_item1_max_length;
      if(detail['attribute1'] === 4){
        detail['value1'] = formatDateLine(new Date());
        let cur_date = new Date(detail['value1']);
        let cur_year = cur_date.getFullYear();
        let cur_month = cur_date.getMonth() + 1;
        let cur_day = cur_date.getDate();
        detail['value1_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
      }
    }
    if(data.input_item2_flag === 1){
      detail['attribute2'] = data.input_item2_attribute;
      detail['format2'] = data.input_item2_format;
      detail['unit_name2'] = data.input_item2_unit;
      detail['max_length2'] = data.input_item2_max_length;
      if(detail['attribute2'] === 4){
        detail['value2'] = formatDateLine(new Date());
        let cur_date = new Date(detail['value2']);
        let cur_year = cur_date.getFullYear();
        let cur_month = cur_date.getMonth() + 1;
        let cur_day = cur_date.getDate();
        detail['value2_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
      }
    }
    item_details[this.state.cur_index] = detail;
    this.props.setItemDetails(item_details);
    this.closeModal();
  };
  
  setValue =(index, name, attribute, e)=>{
    let item_details = this.state.item_details;
    let value = "";
    if(attribute === 1 || attribute === 5){
      value = e.target.value;
    }
    if(attribute === 2){
      value = e;
      if(parseFloat(value) < 0) value = 0;
    }
    if(attribute === 3){
      value = formatDateLine(e);
    }
    if(attribute === 4){
      value = formatDateLine(e);
      let cur_date = new Date(value);
      let cur_year = cur_date.getFullYear();
      let cur_month = cur_date.getMonth() + 1;
      let cur_day = cur_date.getDate();
      item_details[index][name+'_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
    }
    let error_flag = false;
    if(name === "value1"){
      if(item_details[index]['max_length1'] !== "" && item_details[index]['max_length1'] != null && value !== "" && value != null){
        if(value.toString().length > parseInt(item_details[index]['max_length1'])){
          error_flag = true;
          // window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['max_length1'] +"桁以下で入力してください。");
          // return;
        }
      }
    } else {
      if(item_details[index]['max_length2'] !== "" && item_details[index]['max_length2'] != null && value !== "" && value != null){
        if(value.toString().length > parseInt(item_details[index]['max_length2'])){
          error_flag = true;
          // window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['max_length2'] +"桁以下で入力してください。");
          // return;
        }
      }
    }
    if(error_flag === false){
      item_details[index][name] = value;
      this.props.setItemDetails(item_details);
    } else {
      this.props.setItemDetails(item_details);
    }
  };
  
  setTreatValue =(index, name, attribute, e)=>{
    let item_details = this.state.item_details;
    let value = "";
    if(attribute === 2){
      value = e.target.value;
      if(parseFloat(value) < 0) value = 0;
    }
    let error_flag = false;
    if(name === "value1"){
      if(item_details[index]['max_length1'] !== "" && item_details[index]['max_length1'] != null && value !== "" && value != null){
        if(value.toString().length > parseInt(item_details[index]['max_length1'])){
          error_flag = true;
        }
      }
    } else {
      if(item_details[index]['max_length2'] !== "" && item_details[index]['max_length2'] != null && value !== "" && value != null){
        if(value.toString().length > parseInt(item_details[index]['max_length2'])){
          error_flag = true;
        }
      }
    }
    if(error_flag === false){
      item_details[index][name] = value;
      this.props.setItemDetails(item_details);
    } else {
      this.props.setItemDetails(item_details);
    }
  }
  
  formatMonthDate = value => {
    value = parseInt(value);
    if (value < 10) return "0" + value.toString();
    else return value.toString();
  }
  
  getBirthYear =(index, name, e)=>{
    let item_details = this.state.item_details;
    var birthday = new Date();
    if(item_details[index][name] !== "" && item_details[index][name] != null){
      birthday = new Date(item_details[index][name]);
    }
    var birth_month = birthday.getMonth() + 1;
    var birth_day = birthday.getDate();
    item_details[index][name] = formatDateLine(new Date(e.target.id.toString() + '-' +  this.formatMonthDate(birth_month) + '-' + this.formatMonthDate(birth_day)));
    item_details[index][name+'_format'] = this.state.japan_year_list.find(x => x.id === parseInt(e.target.id)).value + '年' + birth_month + '月' + birth_day + '日';
    this.props.setItemDetails(item_details);
  }
  
  getBirthMonth =(index, name, e)=>{
    let item_details = this.state.item_details;
    var birthday = new Date();
    if(item_details[index][name] !== "" && item_details[index][name] != null){
      birthday = new Date(item_details[index][name]);
    }
    var birth_year = birthday.getFullYear();
    var birth_day = birthday.getDate();
    item_details[index][name] = formatDateLine(new Date(birth_year.toString() + '-' +  this.formatMonthDate(e.target.id) + '-' + this.formatMonthDate(birth_day)));
    item_details[index][name+'_format'] = this.state.japan_year_list.find(x => x.id === birth_year).value + '年' + e.target.id + '月' + birth_day + '日';
    this.props.setItemDetails(item_details);
  }
  
  getBirth_day =(index, name, e)=>{
    let item_details = this.state.item_details;
    var birthday = new Date();
    if(item_details[index][name] !== "" && item_details[index][name] != null){
      birthday = new Date(item_details[index][name]);
    }
    var birth_year = birthday.getFullYear();
    var birth_month = birthday.getMonth() + 1;
    item_details[index][name] = formatDateLine(new Date(birth_year.toString() + '-' +  this.formatMonthDate(birth_month) + '-' + this.formatMonthDate(e.target.id)));
    item_details[index][name+'_format'] = this.state.japan_year_list.find(x => x.id === birth_year).value + '年' + birth_month + '月' + e.target.id + '日';
    this.props.setItemDetails(item_details);
  }
  
  handleClick = (e, index, change) => {
    if(this.props.function_id === 1){
      return;
    }
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
      
      let x_val = e.clientX - document.getElementById("code-table").offsetLeft - 225;
      if (this.props.function_id == 1 || this.props.function_id == 4 || this.props.function_id == 6){
        x_val = e.clientX - $('#first-view-modal').offset().left;
      }
      let y_val = e.clientY + window.pageYOffset - 80;
      if (this.props.function_id == FUNCTION_ID_CATEGORY.RADIATION){
        x_val = e.clientX - $('#code-table').offset().left;
        y_val = e.clientY -$('#code-table').offset().top - 50;
      }
      if(this.props.function_id == FUNCTION_ID_CATEGORY.ENDOSCOPE){
        x_val = e.clientX - $('.set-detail-area').offset().left - 30;
        y_val = e.clientY -$('.set-detail-area').offset().top;
      }
      if(this.props.function_id === FUNCTION_ID_CATEGORY.RIHABILY){
        var set_table_x = document.getElementsByClassName('set-detail-area')[0].offsetLeft;
        var set_table_y = document.getElementsByClassName('set-detail-area')[0].offsetTop;
        x_val = e.clientX - set_table_x - 75;
        y_val = e.clientY - set_table_y - 45;
      }
      if (this.props.function_id === FUNCTION_ID_CATEGORY.PRESCRIPTION) {
        x_val = e.clientX;
        y_val = e.clientY;
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: x_val,
          y: y_val,
        },
        index,
        change,
      });
    }
  };
  
  contextMenuAction = (type, index) => {
    let item_details = [];
    let new_row = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
    if(type === "delete"){
      this.state.item_details.map((item, idx)=>{
        if(idx != index){
          item_details.push(item);
        }
      });
      if(this.props.function_id !== 1){
        if(Object.keys(item_details).length === 0){
          item_details.push(new_row);
        }
      }
    }
    if(type === 'add'){
      item_details = this.state.item_details;
      item_details.push(new_row);
    }
    this.props.setItemDetails(item_details);
  };
  
  openRoutineModal = (index, name, value) => {
    this.setState({
      isRoutineModal: false,
      cur_index: index,
      cur_name: name,
      routine_value: value,
    })
  };
  
  setRoutineValue =(value)=>{
    let item_details = this.state.item_details;
    item_details[this.state.cur_index][this.state.cur_name] = value;
    this.props.setItemDetails(item_details);
    this.closeModal();
  }
  
  setEnabled =(name, index)=>{
    let item_details = this.state.item_details;
    item_details[index][name] = (item_details[index][name] !== undefined && item_details[index][name] == 1) ? 0 : 1;
    this.props.setItemDetails(item_details);
  }
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="icon-datepicker" onClick={onClick}>
        <Icon icon={faCalendarAlt} className="calendar_icon" />
        <InputBoxTag
          label=""
          type="hidden"
          value = {value}
        />
      </div>
    );
    this.tr_index = 0;
    return (
      <>
        <DatePickerBox style={{width:"100%", height:"100%"}}>
          <table className="table table-bordered table-hover" id="code-table">
            <thead>
            <tr className={'table-menu'}>
              <th className="item-no"/>
              {this.props.function_id != FUNCTION_ID_CATEGORY.RADIATION && this.props.function_id != FUNCTION_ID_CATEGORY.ENDOSCOPE && (
                <>
                  <th className="table-check">品分類</th>
                </>
              )}
              <th className="code-number">{this.props.function_id == FUNCTION_ID_CATEGORY.GUIDANCE ? '有効' : "検索"}</th>
              <th className="name">品名/名称</th>
              <th>設定値</th>
            </tr>
            </thead>
            <tbody>
            {Object.keys(this.state.item_details).map((index) => {
              if(this.state.item_details[index]['attribute1'] === 4){
                if(this.state.item_details[index]['value1'] !== '' && this.state.item_details[index]['value1'] != null){
                  var birthday1 = new Date(this.state.item_details[index]['value1']);
                  var birth_year1 = birthday1.getFullYear();
                  var birth_month1 = birthday1.getMonth() + 1;
                  var birth_day1 = birthday1.getDate();
                }
              }
              if(this.state.item_details[index]['attribute2'] === 4){
                if(this.state.item_details[index]['value2'] !== '' && this.state.item_details[index]['value2'] != null){
                  var birthday2 = new Date(this.state.item_details[index]['value2']);
                  var birth_year2 = birthday2.getFullYear();
                  var birth_month2 = birthday2.getMonth() + 1;
                  var birth_day2 = birthday2.getDate();
                }
              }
              this.tr_index += 1;
              return (
                <tr key={index}
                    onContextMenu={e => this.handleClick(e, index, this.state.item_details[index]['delete'] === undefined ? true : false)}
                >
                  <td className="text-right item-no" style={{paddingRight:"0.2rem"}}>{parseInt(this.tr_index)}</td>
                  {this.props.function_id != FUNCTION_ID_CATEGORY.RADIATION && this.props.function_id != FUNCTION_ID_CATEGORY.ENDOSCOPE && (
                    <>
                      <td className="select-class table-check">
                        {this.state.item_details[index]['item_id'] !== 0 ? (
                          <div style={{paddingLeft:"0.2rem"}}>{this.state.item_details[index]['classfic_name']}</div>
                        ) : (
                          <SelectorWithLabel
                            title=""
                            options={this.state.item_categories}
                            getSelect={this.getItemCategory.bind(this, index)}
                            departmentEditCode={this.state.item_details[index]['classfic']}
                          />
                        )}
                      </td>
                    </>
                  )}
                  <td className="text-center code-number">
                    {this.props.function_id == FUNCTION_ID_CATEGORY.GUIDANCE && (
                      <>
                        <Checkbox
                          label=""
                          number = {index}
                          getRadio={this.setEnabled.bind(this)}
                          value={(this.state.item_details[index]['is_enabled'] !== undefined && this.state.item_details[index]['is_enabled'] === 1)}
                          name="is_enabled"
                        />
                      </>
                    )}
                    {this.state.item_details[index]['delete'] === undefined && (
                      <Button type="common" className={'search-item-btn'} onClick={this.openItemSelectModal.bind(this,index)}>検索</Button>
                    )}
                  </td>
                  <td className={'name'} style={{paddingLeft:"0.2rem"}}>{this.state.item_details[index]['item_name']}</td>
                  <td className="text-center value-area">
                    <div className={'flex'}>
                      <div className={'input-value'} style={{width:(this.state.item_details[index]['unit_name1'] === "" || this.state.item_details[index]['unit_name1'] == null) ? '100%' : '80%'}}>
                        {this.state.item_details[index]['attribute1'] === 1 && (
                          <textarea
                            onChange={this.setValue.bind(this, index, 'value1', this.state.item_details[index]['attribute1'])}
                            value={this.state.item_details[index]['value1']}
                            style={{width:"100%", height:"38px"}}
                          />
                        )}
                        {this.state.item_details[index]['attribute1'] === 2 && (
                          <>
                            {this.props.from_source == "treatment" ? (
                              <InputWithLabel
                                label=""
                                type="number"
                                getInputText={this.setTreatValue.bind(this, index, 'value1', this.state.item_details[index]['attribute1'])}
                                diseaseEditData={this.state.item_details[index]['value1']}
                                className="treat-input-value"
                              />
                            ) : (
                              <NumericInputWithUnitLabel
                                className="form-control"
                                value={this.state.item_details[index]['value1']}
                                getInputText={this.setValue.bind(this, index, 'value1', this.state.item_details[index]['attribute1'])}
                                inputmode="numeric"
                              />
                            )}
                          </>
                        )}
                        {this.state.item_details[index]['attribute1'] === 3 && (
                          <InputWithLabel
                            type="date"
                            getInputText={this.setValue.bind(this, index, 'value1', this.state.item_details[index]['attribute1'])}
                            diseaseEditData={(this.state.item_details[index]['value1'] !== "" && this.state.item_details[index]['value1'] != null) ? new Date(this.state.item_details[index]['value1']) : ""}
                          />
                        )}
                        {this.state.item_details[index]['attribute1'] === 4 && (
                          <div className="flex birthday_area">
                            <DatePicker
                              locale="ja"
                              selected={birthday1}
                              onChange={this.setValue.bind(this, index, 'value1', this.state.item_details[index]['attribute1'])}
                              dateFormat="yyyy/MM/dd"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              todayButton={"今日"}
                              customInput={<ExampleCustomInput />}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                            <SelectorWithLabel
                              options={this.state.japan_year_list}
                              title=""
                              getSelect={this.getBirthYear.bind(this, index, 'value1')}
                              departmentEditCode={birth_year1}
                            />
                            <span>年</span>
                            <div className="month_day flex">
                              <SelectorWithLabel
                                options={this.state.month_list}
                                title=""
                                getSelect={this.getBirthMonth.bind(this, index, 'value1')}
                                departmentEditCode={birth_month1}
                              />
                              <span>月</span>
                              <SelectorWithLabel
                                options={this.state.day_list}
                                title=""
                                getSelect={this.getBirth_day.bind(this, index, 'value1')}
                                departmentEditCode={birth_day1}
                              />
                              <span>日</span>
                            </div>
                          </div>
                        )}
                        {this.state.item_details[index]['attribute1'] === 5 && (
                          <textarea
                            onChange={this.setValue.bind(this, index, 'value1', this.state.item_details[index]['attribute1'])}
                            value={this.state.item_details[index]['value1']}
                            style={{width:"100%", height:"38px"}}
                          />
                        )}
                      </div>
                      {(this.state.item_details[index]['unit_name1'] !== '' && this.state.item_details[index]['unit_name1'] != null) && (
                        <div className='unit-div' style={{width:'20%',lineHeight:'38px'}}>{this.state.item_details[index]['unit_name1']}</div>
                      )}
                    </div>
                    <div className={'flex'}>
                      <div style={{width:(this.state.item_details[index]['unit_name2'] === "" || this.state.item_details[index]['unit_name2'] == null) ? '100%' : '80%'}}>
                        {this.state.item_details[index]['attribute2'] === 1 && (
                          <textarea
                            onChange={this.setValue.bind(this, index, 'value2', this.state.item_details[index]['attribute2'])}
                            value={this.state.item_details[index]['value2']}
                            style={{width:"100%", height:"38px"}}
                          />
                        )}
                        {this.state.item_details[index]['attribute2'] === 2 && (
                          <>
                            {this.props.from_source == "treatment" ? (
                              <InputWithLabel
                                label=""
                                type="number"
                                getInputText={this.setTreatValue.bind(this, index, 'value2', this.state.item_details[index]['attribute2'])}
                                diseaseEditData={this.state.item_details[index]['value2']}
                                className="treat-input-value"
                              />
                            ) : (
                              <NumericInputWithUnitLabel
                                className="form-control"
                                value={this.state.item_details[index]['value2']}
                                getInputText={this.setValue.bind(this, index, 'value2', this.state.item_details[index]['attribute2'])}
                                inputmode="numeric"
                              />
                            )}
                          </>
                        )}
                        {this.state.item_details[index]['attribute2'] === 3 && (
                          <InputWithLabel
                            type="date"
                            getInputText={this.setValue.bind(this, index, 'value2', this.state.item_details[index]['attribute2'])}
                            diseaseEditData={(this.state.item_details[index]['value2'] !== "" && this.state.item_details[index]['value2'] != null) ? new Date(this.state.item_details[index]['value2']) : ""}
                          />
                        )}
                        {this.state.item_details[index]['attribute2'] === 4 && (
                          <div className="flex birthday_area">
                            <DatePicker
                              locale="ja"
                              selected={birthday2}
                              onChange={this.setValue.bind(this, index, 'value2', this.state.item_details[index]['attribute2'])}
                              dateFormat="yyyy/MM/dd"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              todayButton={"今日"}
                              customInput={<ExampleCustomInput />}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                            <SelectorWithLabel
                              options={this.state.japan_year_list}
                              title=""
                              getSelect={this.getBirthYear.bind(this, index, 'value2')}
                              departmentEditCode={birth_year2}
                            />
                            <span>年</span>
                            <div className="month_day flex">
                              <SelectorWithLabel
                                options={this.state.month_list}
                                title=""
                                getSelect={this.getBirthMonth.bind(this, index, 'value2')}
                                departmentEditCode={birth_month2}
                              />
                              <span>月</span>
                              <SelectorWithLabel
                                options={this.state.day_list}
                                title=""
                                getSelect={this.getBirth_day.bind(this, index, 'value2')}
                                departmentEditCode={birth_day2}
                              />
                              <span>日</span>
                            </div>
                          </div>
                        )}
                        {this.state.item_details[index]['attribute2'] === 5 && (
                          <textarea
                            onChange={this.setValue.bind(this, index, 'value2', this.state.item_details[index]['attribute2'])}
                            value={this.state.item_details[index]['value2']}
                            style={{width:"100%", height:"38px"}}
                          />
                        )}
                      </div>
                      {(this.state.item_details[index]['unit_name2'] !== '' && this.state.item_details[index]['unit_name2'] != null) && (
                        <div style={{width:'20%',lineHeight:'38px'}}>{this.state.item_details[index]['unit_name2']}</div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
          {this.state.isItemSelectModal && (
            <SelectPannelHarukaModal
              selectMaster = {this.setItemName}
              closeModal= {this.closeModal}
              MasterName= {'品名'}
              function_id= {this.props.function_id}
              item_category_id={this.props.function_id == FUNCTION_ID_CATEGORY.RADIATION
                ? 9 : (this.props.function_id == FUNCTION_ID_CATEGORY.ENDOSCOPE ? 20 : this.state.item_details[this.state.cur_index]['classfic'])}
            />
          )}
          {this.state.isRoutineModal && (
            <RoutineInputPanel
              closeModal= {this.closeModal}
              title= {this.state.title}
              value={this.state.routine_value}
              setValue={this.setRoutineValue.bind(this)}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
            index={this.state.index}
            change={this.state.change}
          />
        </DatePickerBox>
      </>
    );
  }
}

ItemTableBody.propTypes = {
  function_id: PropTypes.number,
  item_details: PropTypes.array,
  setItemDetails:PropTypes.func,
  from_source: PropTypes.string
};

export default ItemTableBody;
