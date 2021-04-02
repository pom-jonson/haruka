import React, { Component } from "react";
import PropTypes from "prop-types";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { faCalendarAlt } from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {formatDateLine} from "~/helpers/date";
import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
  cursor: pointer;
`;

class ContrastTable extends Component {
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
            cur_index:0,
            day_list,
            month_list,
            japan_year_list,
            title,
        }
    }


    setValue =(index, name, attribute, e)=>{
        let item_details = this.props.item_details;
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
            item_details[index][name+'_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
        }
        let error_flag = false;
        if(name === "value1"){
            if(item_details[index]['input_item1_max_length'] !== "" && item_details[index]['input_item1_max_length'] != null && value !== "" && value != null){
                if(value.toString().length > parseInt(item_details[index]['input_item1_max_length'])){
                    error_flag = true;
                    window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['input_item1_max_length'] +"桁以下で入力してください。");
                    return;
                }
            }
        } else {
            if(item_details[index]['input_item2_max_length'] !== "" && item_details[index]['input_item2_max_length'] != null && value !== "" && value != null){
                if(value.toString().length > parseInt(item_details[index]['input_item2_max_length'])){
                    error_flag = true;
                    window.sessionStorage.setItem("alert_messages", "設定値を"+ item_details[index]['input_item2_max_length'] +"桁以下で入力してください。");
                    return;
                }
            }
        }
        if(error_flag === false){
            item_details[index][name] = value;
            this.props.setItemDetails(item_details);
        }
    }

    formatMonthDate = value => {
        value = parseInt(value);
        if (value < 10) return "0" + value.toString();
        else return value.toString();
    }

    getBirthYear =(index, name, e)=>{
        let item_details = this.props.item_details;
        var birthday = new Date();
        if(item_details[index][name] !== "" && item_details[index][name] != null){
            birthday = new Date(item_details[index][name]);
        }
        var birth_month = birthday.getMonth() + 1;
        var birth_day = birthday.getDate();
        item_details[index][name] = formatDateLine(new Date(e.target.id.toString() + '-' +  this.formatMonthDate(birth_month) + '-' + this.formatMonthDate(birth_day)));
        item_details[index][name+'_format'] = this.state.japan_year_list.find(x => x.id === e.target.id).value + '年' + birth_month + '月' + birth_day + '日';
        this.props.setItemDetails(item_details);
    }

    getBirthMonth =(index, name, e)=>{
        let item_details = this.props.item_details;
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
        let item_details = this.props.item_details;
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
        return (
            <>
            <DatePickerBox>
            {this.props.item_details != undefined && this.props.item_details.length >0 && (
                <table className="table-scroll table table-bordered" id="code-table">
                    <tr className={'table-menu'}>
                        <td style={{width:"30px"}}/>                        
                        <td className="text-center" style={{width:"100%"}}>品名/名称</td>
                        <td className="text-center value-input">設定値</td>
                    </tr>
                    {this.props.item_details.map((item, index) => {
                        if(item['input_item1_attribute'] === 4){
                            if(item['value1'] !== '' && item['value1'] != null){
                                var birthday1 = new Date(item['value1']);
                                var birth_year1 = birthday1.getFullYear();
                                var birth_month1 = birthday1.getMonth() + 1;
                                var birth_day1 = birthday1.getDate();
                            }
                        }
                        if(item['input_item2_attribute'] === 4){
                            if(item['value2'] !== '' && item['value2'] != null){
                                var birthday2 = new Date(item['value2']);
                                var birth_year2 = birthday2.getFullYear();
                                var birth_month2 = birthday2.getMonth() + 1;
                                var birth_day2 = birthday2.getDate();
                            }
                        }
                        return (
                            <tr key={index}>
                                <td className="text-center td-no">{parseInt(index) + 1}</td>                                
                                <td className="text-center">{item['name']}</td>
                                <td className="text-center">
                                    <div className={'flex'}>
                                        <div style={{width:(item['input_item1_unit'] === "" || item['input_item1_unit'] == null) ? '100%' : 'auto'}}>
                                            {item['input_item1_attribute'] === 1 && (
                                                <textarea
                                                    onChange={this.setValue.bind(this, index, 'value1', item['input_item1_attribute'])}
                                                    value={item['value1']}
                                                    style={{width:"100%", height:"1.5rem"}}
                                                >
                                                </textarea>
                                            )}
                                            {item['input_item1_attribute'] === 2 && (
                                                <NumericInputWithUnitLabel
                                                    className="form-control"
                                                    value={item['value1']}
                                                    getInputText={this.setValue.bind(this, index, 'value1', item['input_item1_attribute'])}
                                                    inputmode="numeric"
                                                    min = {0}
                                                />
                                            )}
                                            {item['input_item1_attribute'] === 3 && (
                                                <InputWithLabel
                                                    type="date"
                                                    getInputText={this.setValue.bind(this, index, 'value1', item['input_item1_attribute'])}
                                                    diseaseEditData={(item['value1'] !== "" && item['value1'] != null) ? new Date(item['value1']) : ""}
                                                />
                                            )}
                                            {item['input_item1_attribute'] === 4 && (
                                                <div className="flex birthday_area">
                                                    <DatePicker
                                                        locale="ja"
                                                        selected={birthday1}
                                                        onChange={this.setValue.bind(this, index, 'value1', item['input_item1_attribute'])}
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
                                            {item['input_item1_attribute'] === 5 && (
                                                <textarea
                                                    onChange={this.setValue.bind(this, index, 'value1', item['input_item1_attribute'])}
                                                    value={item['value1']}
                                                    style={{width:"100%", height:"1.5rem"}}
                                                >
                                                </textarea>
                                            )}
                                        </div>
                                        {(item['input_item1_unit'] !== '' && item['input_item1_unit'] != null) && (
                                            <div style={{width:'auto',lineHeight:'1.5rem'}}>{item['input_item1_unit']}</div>
                                        )}
                                    </div>
                                    <div className={'flex'}>
                                        <div style={{width:(item['input_item2_unit'] === "" || item['input_item2_unit'] == null) ? '100%' : 'auto'}}>
                                            {item['input_item2_attribute'] === 1 && (
                                                <textarea
                                                    onChange={this.setValue.bind(this, index, 'value2', item['input_item2_attribute'])}
                                                    value={item['value2']}
                                                    style={{width:"100%", height:"1.5rem"}}
                                                >
                                                </textarea>
                                            )}
                                            {item['input_item2_attribute'] === 2 && (
                                                <NumericInputWithUnitLabel
                                                    className="form-control"
                                                    value={item['value2']}
                                                    getInputText={this.setValue.bind(this, index, 'value2', item['input_item2_attribute'])}
                                                    inputmode="numeric"
                                                    min = {0}
                                                />
                                            )}
                                            {item['input_item2_attribute'] === 3 && (
                                                <InputWithLabel
                                                    type="date"
                                                    getInputText={this.setValue.bind(this, index, 'value2', item['input_item2_attribute'])}
                                                    diseaseEditData={(item['value2'] !== "" && item['value2'] != null) ? new Date(item['value2']) : ""}
                                                />
                                            )}
                                            {item['input_item2_attribute'] === 4 && (
                                                <div className="flex birthday_area">
                                                    <DatePicker
                                                        locale="ja"
                                                        selected={birthday2}
                                                        onChange={this.setValue.bind(this, index, 'value2', item['input_item2_attribute'])}
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
                                            {item['input_item2_attribute'] === 5 && (
                                                <textarea
                                                    onChange={this.setValue.bind(this, index, 'value2', item['input_item2_attribute'])}
                                                    value={item['value2']}
                                                    style={{width:"100%", height:"1.5rem"}}
                                                >
                                                </textarea>
                                            )}
                                        </div>
                                        {(item['input_item2_unit'] !== '' && item['input_item2_unit'] != null) && (
                                            <div style={{width:'auto',lineHeight:'1.5rem'}}>{item['input_item2_unit']}</div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </table>
            )}
            {/* {(this.props.item_details == undefined || this.props.item_details == null || this.props.item_details.length == 0) && (
                <div>該当する造影剤の項目がありません。</div>
            )} */}
            </DatePickerBox>
            </>
            

        );
    }
}

ContrastTable.propTypes = {
    function_id: PropTypes.number,
    item_details: PropTypes.array,
    setItemDetails:PropTypes.func,
};

export default ContrastTable;
