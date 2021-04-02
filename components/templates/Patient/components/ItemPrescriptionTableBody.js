import React, { Component } from "react";
import PropTypes from "prop-types";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SelectPannelHarukaModal from "../Modals/Common/SelectPannelHarukaModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import { faCalendarAlt } from "@fortawesome/pro-solid-svg-icons";
// import axios from "axios/index";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {formatDateLine} from "~/helpers/date";
import RoutineInputPanel from "../Modals/Guidance/RoutineInputPanel";
import {FUNCTION_ID_CATEGORY} from "~/helpers/constants";
import $ from "jquery";
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
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
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent, index, change
                     }) => {
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

class ItemPrescriptionTableBody extends Component {
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
        for (i=1900;i <= (current_year + 80); i++){
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
            item_details:[
              {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
            ],
        }
    }

    async componentDidMount() {
        this.setState({
            item_details:this.props.item_details
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

    getValueFormat = (_array, _id) =>{
        let result = null;
        
        if (_array != null && _array != undefined && _array.length > 0) {            
            _array.map(item=>{
                if (item.id == _id) {
                    result = item.value;
                }
            });
        }

        return result;
    }

    setItemName = (data) => {
        let item_details = this.state.item_details;
        let detail = [];
        detail['classfic'] = data.item_category_id;
        detail['classfic_name'] = (this.state.item_categories.find(x => x.id === data.item_category_id) !== undefined) ? this.state.item_categories.find(x => x.id === data.item_category_id).value : '';
        detail['item_id'] = data.item_id;
        detail['item_name'] = data.name;
        detail['attribute1'] = null;
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
                detail['value1_format'] = this.getValueFormat(this.state.japan_year_list, cur_year) + '年' + cur_month + '月' + cur_day + '日';
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
                detail['value2_format'] = this.getValueFormat(this.state.japan_year_list, cur_year) + '年' + cur_month + '月' + cur_day + '日';
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
            item_details[index][name+'_format'] = this.getValueFormat(this.state.japan_year_list, cur_year) + '年' + cur_month + '月' + cur_day + '日';
        }
        let error_flag = false;
        if(name === "value1"){
            if(item_details[index]['max_length1'] !== "" && item_details[index]['max_length1'] != null && value !== "" && value != null){
                if(value.toString().length > parseInt(item_details[index]['max_length1'])){
                    error_flag = true;
                    window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['max_length1'] +"桁以下で入力してください。");
                    return;
                }
            }
            
        } else {
            if(item_details[index]['max_length2'] !== "" && item_details[index]['max_length2'] != null && value !== "" && value != null){
                if(value.toString().length > parseInt(item_details[index]['max_length2'])){
                    error_flag = true;
                    window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['max_length2'] +"桁以下で入力してください。");
                    return;
                }
            }
        }
        if(error_flag === false){
            item_details[index][name] = value;
            this.props.setItemDetails(item_details);
        }
    }

    setTextValue =(index, name, attribute, e)=>{
        let item_details = this.state.item_details;
        if(attribute === 1 || attribute === 5)
            item_details[index][name] = e.target.value;
        if(attribute === 2)
            item_details[index][name] = e;
        this.setState({item_details});
    }

    onBlurText = (index, name) => {
        let item_details = this.state.item_details;
        let error_flag = false;
        if(name === "value1"){
            if(item_details[index]['max_length1'] !== "" && item_details[index]['max_length1'] != null && item_details[index][name] !== "" && item_details[index][name] != null){
                if(item_details[index][name].toString().length > parseInt(item_details[index]['max_length1'])){
                    error_flag = true;
                    window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['max_length1'] +"桁以下で入力してください。");
                    return;
                }
                if (item_details[index]['item_name'] == '（１日Ｘ回）') {
                    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
                    if (item_details[index][name] != "" && !RegExp.test(item_details[index][name])) {
                        error_flag = true;
                        window.sessionStorage.setItem("alert_messages", "設定値を数値で入力してください。");
                        return;
                    }
                }
            }
        } else {
            if(item_details[index]['max_length2'] !== "" && item_details[index]['max_length2'] != null && item_details[index][name] !== "" && item_details[index][name] != null){
                if(item_details[index][name].toString().length > parseInt(item_details[index]['max_length2'])){
                    error_flag = true;
                    window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['max_length2'] +"桁以下で入力してください。");
                    return;
                }
            }
        }
        if(error_flag === false){
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
        item_details[index][name+'_format'] = this.getValueFormat(this.state.japan_year_list, e.target.id) + '年' + birth_month + '月' + birth_day + '日';
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
        item_details[index][name+'_format'] = this.getValueFormat(this.state.japan_year_list, birth_year) + '年' + e.target.id + '月' + birth_day + '日';
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
        item_details[index][name+'_format'] = this.getValueFormat(this.state.japan_year_list, birth_year) + '年' + birth_month + '月' + e.target.id + '日';
        this.props.setItemDetails(item_details);
    }

    handleClick = (e, index, change) => {
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
            let offset_left = 0;
            // injection has tree
            if (this.props.function_id == FUNCTION_ID_CATEGORY.INJECTION) {
              offset_left = $('#injection-div-history').offset().left;
            // prescription has tree
            } else if(this.props.function_id == FUNCTION_ID_CATEGORY.PRESCRIPTION) {
              offset_left = $('#div-history').offset().left;
            }
            let state_data = {};
            state_data['contextMenu'] = {
              visible: true,
              x: e.clientX - offset_left,
              y: e.clientY - 120
            };
            state_data['index'] = index;
            state_data['change'] = change;
            let clientX = e.clientX;
            let clientY = e.clientY; 
            this.setState(state_data, ()=>{
              let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
              let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
              let window_height = window.innerHeight;
              let window_width = window.innerWidth;
              if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
                state_data['contextMenu']['x'] = clientX - offset_left - menu_width;
                state_data['contextMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
                this.setState(state_data);
              } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
                state_data['contextMenu']['x'] = clientX - offset_left;
                state_data['contextMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
                this.setState(state_data);
              } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
                state_data['contextMenu']['x'] = clientX - offset_left - menu_width;
                state_data['contextMenu']['y'] = clientY + window.pageYOffset - 120;
                this.setState(state_data);
              }
            });
        }
    };

    contextMenuAction = (type, index) => {
        let item_details = this.state.item_details;
        if(type === "delete"){
            delete item_details[index];
            if(Object.keys(item_details).length === 0){
                let new_row = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
                item_details[0] = new_row;
            }
        }
        if(type === 'add'){
            let new_row = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
            item_details[item_details.length] = new_row;
        }
        this.setState({item_details});
        this.props.setItemDetails(item_details);
    };

    setRoutineValue =(value)=>{
        let item_details = this.state.item_details;
        item_details[this.state.cur_index][this.state.cur_name] = value;
        this.props.setItemDetails(item_details);
        this.closeModal();
    }

    testPrescriptionNameRender = (prescriptionName_status) => {
        this.setState(prescriptionName_status);
    }

    testRender = (_itemDetails) => {
        this.setState({
            item_details: _itemDetails
        });
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

        let _item_details = this.state.item_details;
        // initialize item_details
        if (_item_details == undefined || _item_details == null || Object.keys(_item_details).length == 0) {
            _item_details = [
              {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
            ];
        }
        let row_number = 0;
        return (
            <>
            <DatePickerBox>
                <table className="table-scroll table table-bordered" id="code-table">
                    <tr className={'table-menu'}>
                        <td style={{width:"30px"}}/>
                        <td className="text-center detail-category" style={{width:"150px"}}>品分類</td>
                        <td className="text-center detail-search-btn" style={{width:"60px"}}>検索</td>
                        <td className="text-center detail-item-name">品名/設定値</td>
                    </tr>
                    {_item_details != undefined && _item_details != null && Object.keys(_item_details).length > 0 && Object.keys(_item_details).map((index) => {
                        if (_item_details[index] != null && _item_details[index] != undefined) {                            
                            row_number ++;
                            if(_item_details[index]['attribute1'] === 4){
                                if(_item_details[index]['value1'] !== '' && _item_details[index]['value1'] != null){
                                    var birthday1 = new Date(_item_details[index]['value1']);
                                    var birth_year1 = birthday1.getFullYear();
                                    var birth_month1 = birthday1.getMonth() + 1;
                                    var birth_day1 = birthday1.getDate();
                                }
                                if(_item_details[index]['value2'] !== '' && _item_details[index]['value2'] != null){
                                    var birthday2 = new Date(_item_details[index]['value2']);
                                    var birth_year2 = birthday2.getFullYear();
                                    var birth_month2 = birthday2.getMonth() + 1;
                                    var birth_day2 = birthday2.getDate();
                                }
                            }
                            return (
                                <tr key={index}
                                    onContextMenu={e => this.handleClick(e, index, _item_details[index]['delete'] === undefined)}
                                >
                                    <td className="text-center td-no">{row_number}</td>
                                    <td className="text-center select-class">
                                        {_item_details[index]['item_id'] !== 0 ? (
                                            <div className="text-center">{_item_details[index]['classfic_name']}</div>
                                        ) : (
                                            <SelectorWithLabel
                                                title=""
                                                options={this.state.item_categories}
                                                getSelect={this.getItemCategory.bind(this, index)}
                                                departmentEditCode={_item_details[index]['classfic']}
                                            />
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {_item_details[index]['delete'] === undefined && (
                                            <button className={'search-item-btn'} onClick={this.openItemSelectModal.bind(this,index)}>検索</button>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <div className="text-left border-bottom p-1">
                                            {_item_details[index]['item_name']}
                                        </div>
                                        <div className="text-center pt-1">
                                            <div className={'flex'}>
                                                <div style={{width:(_item_details[index]['unit_name1'] === "" || _item_details[index]['unit_name1'] == null) ? '100%' : '80%'}}>
                                                    {_item_details[index] != null && _item_details[index]['attribute1'] != undefined && _item_details[index]['attribute1'] === 1 && (
                                                        <textarea
                                                            onChange={this.setTextValue.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            onBlur={this.onBlurText.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            value={_item_details[index]['value1']}
                                                            style={{width:"100%", height:"38px"}}
                                                        >
                                                    </textarea>
                                                    )}
                                                    {_item_details[index] != null && _item_details[index]['attribute1'] != undefined && _item_details[index]['attribute1'] === 2 && (
                                                        <NumericInputWithUnitLabel
                                                            className="form-control"
                                                            value={_item_details[index]['value1']}
                                                            getInputText={this.setTextValue.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            onBlur={this.onBlurText.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            inputmode="numeric"
                                                        />
                                                    )}
                                                    {_item_details[index]['attribute1'] === 3 && (
                                                        <InputWithLabel
                                                            type="date"
                                                            getInputText={this.setValue.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            diseaseEditData={(_item_details[index]['value1'] !== "" && _item_details[index]['value1'] != null) ? new Date(_item_details[index]['value1']) : ""}
                                                        />
                                                    )}
                                                    {_item_details[index]['attribute1'] === 4 && (
                                                        <div className="flex birthday_area">
                                                            <DatePicker
                                                                locale="ja"
                                                                selected={birthday1}
                                                                onChange={this.setValue.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                                dateFormat="yyyy/MM/dd"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                todayButton={"今日"}
                                                                dayClassName = {date => setDateColorClassName(date)}
                                                                customInput={<ExampleCustomInput />}
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
                                                    {_item_details[index] != null && _item_details[index]['attribute1'] != undefined && _item_details[index]['attribute1'] === 5 && (
                                                        <textarea
                                                            onChange={this.setTextValue.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            onBlur={this.onBlurText.bind(this, index, 'value1', _item_details[index]['attribute1'])}
                                                            value={_item_details[index]['value1']}
                                                            style={{width:"100%", height:"38px"}}
                                                        >
                                                    </textarea>
                                                    )}
                                                </div>
                                                {(_item_details[index]['unit_name1'] !== '' && _item_details[index]['unit_name1'] != null) && (
                                                    <div style={{width:'10%',lineHeight:'30px'}}>{_item_details[index]['unit_name1']}</div>
                                                )}
                                            </div>
                                            <div className={'flex'}>
                                                <div style={{width:(_item_details[index]['unit_name2'] === "" || _item_details[index]['unit_name2'] == null) ? '100%' : '80%'}}>
                                                    {_item_details[index] != null && _item_details[index]['attribute2'] != undefined && _item_details[index]['attribute2'] === 1 && (
                                                        <textarea
                                                            onChange={this.setTextValue.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            onBlur={this.onBlurText.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            value={_item_details[index]['value2']}
                                                            style={{width:"100%", height:"38px"}}
                                                        >
                                                    </textarea>
                                                    )}
                                                    {_item_details[index] != null && _item_details[index]['attribute2'] != undefined && _item_details[index]['attribute2'] === 2 && (
                                                        <NumericInputWithUnitLabel
                                                            className="form-control"
                                                            value={_item_details[index]['value2']}
                                                            getInputText={this.setTextValue.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            onBlur={this.onBlurText.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            inputmode="numeric"
                                                        />
                                                    )}
                                                    {_item_details[index]['attribute2'] === 3 && (
                                                        <InputWithLabel
                                                            type="date"
                                                            getInputText={this.setValue.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            diseaseEditData={(_item_details[index]['value2'] !== "" && _item_details[index]['value2'] != null) ? new Date(_item_details[index]['value2']) : ""}
                                                        />
                                                    )}
                                                    {_item_details[index]['attribute2'] === 4 && (
                                                        <div className="flex birthday_area">
                                                            <DatePicker
                                                                locale="ja"
                                                                selected={birthday2}
                                                                onChange={this.setValue.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                                dateFormat="yyyy/MM/dd"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                todayButton={"今日"}
                                                                dayClassName = {date => setDateColorClassName(date)}
                                                                customInput={<ExampleCustomInput />}
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
                                                    {_item_details[index] != null && _item_details[index]['attribute2'] != undefined && _item_details[index]['attribute2'] === 5 && (
                                                        <textarea
                                                            onChange={this.setTextValue.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            onBlur={this.onBlurText.bind(this, index, 'value2', _item_details[index]['attribute2'])}
                                                            value={_item_details[index]['value2']}
                                                            style={{width:"100%", height:"38px"}}
                                                        >
                                                    </textarea>
                                                    )}
                                                </div>
                                                {(_item_details[index]['unit_name2'] !== '' && _item_details[index]['unit_name2'] != null) && (
                                                    <div style={{width:'20%',lineHeight:'38px'}}>{_item_details[index]['unit_name2']}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                            )
                        }
                    })}
                </table>
                {this.state.isItemSelectModal && (
                    <SelectPannelHarukaModal
                        selectMaster = {this.setItemName}
                        closeModal= {this.closeModal}
                        MasterName= {'品名'}
                        function_id= {this.props.function_id}
                        item_category_id={_item_details[this.state.cur_index]['classfic']}
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

ItemPrescriptionTableBody.propTypes = {
    function_id: PropTypes.number,
    item_details: PropTypes.array,
    setItemDetails:PropTypes.func,
};

export default ItemPrescriptionTableBody;
