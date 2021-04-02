import React, { Component } from "react";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
// import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { Col } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import { formatJapanDate } from "~/helpers/date";
import CanvasJSReact from '~/components/molecules/canvasjs.react';
import RangeSetting from "./RangeSetting";
import PropTypes from "prop-types";
import {setDateColorClassName} from "~/helpers/dialConstants";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const options = {
    data:[{
        type:"column",
        dataPoints:[
            {label:"~8.3", y:3, color:'cornflowerblue'},
            {label:"8.3 ~ 9.6", y:3, color:'yellow'},
            {label:"9.6 ~ 10.9", y:3, color:'lightpink'},
            {label:"8.3 ~ 12.2", y:3, color:'lightsalmon'},
            {label:"12.2 ~ ", y:1, color:'mediumaquamarine'},
        ]
    }]
}

registerLocale("ja", ja);

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 390px);
  left: 200px;
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
  .flex{
    display:flex;
    margin-bottom:4px;
  }
  .sub-title-image{
    width:82%;
    position:relative; 
    .left{
      label{
        font-size:15px;
      }
    }  
    .right{
      position:absolute;
      right:0px;
      label{
        margin-bottom:0px;
        font-size:15px;
      }
      .radio-btn{
        width:100px;
        border:1px solid lightgray;
        label{
          border-radius:0px;
        }        
      }
    }
  }
  .sub-title-list{
    width:18%;
    margin-left: 2%;
    font-size: 18px;
  }
  .top-area{    
    clear:both;
  }
  .file_check_area{
    .gender-label{
      margin-left:15px;
    }
  }
  .footer{
    clear: both;
    display: flex;
    .button_area{
        width:820px;
        margin-left:auto;
        margin-right:auto;
    }
    .label-title{
      text-align:right;
    }    
    input{
      width:70px;
    }
    .radio-btn{
      label{
        width: 60px;
        border: 1px solid;
        margin-top: 15px;
        border-radius: 0px;
        margin-right: 3px;
        font-weight:600;
      }
    }
    button{
      margin-left:15px;
    }
    .gender-label{
      margin-top:15px;
    }
  }
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 80%;
  height: calc( 100vh - 250px);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
      text-align: right;
  }
  table {
      overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
      }
      th {
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 60px;
      }
      .item-no {
        width: 50px;
      }
      .code-number {
          width: 120px;
      }
  }

 `;
 const SearchPart = styled.div`
  display: block;    
  font-size: 16px;
  width: 100%;
  height:auto;
  font-size:16px;
  padding-left:0px;
  float: left;
  .list-title {
    margin-top: 20px;
    font-size: 14px;
    width: 20%;
  }
  .radio-btn{
    margin-left: 20px;
    width: 40px;
    height:fit-content;
    border: 1px solid lightgray;
    label{
        font-size:18px;
        border-radius:0px;
        margin-bottom: 0px;
        padding-top: 4px;
        padding-bottom: 4px;
    }
  }
  
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
    display:none;
  }
  .pullbox-select {
      font-size: 15px;
      width: 200px;
  }
  .date_area{
    span{
        margin-left: 5px;
        margin-right: 5px; 
      }
  }
  .react-datepicker-wrapper{
    padding: 4px;
    border: 1px solid;
    height:fit-content;
  }

  
 `;
 const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 18%;
  margin-left: 2%;
  height: calc( 100vh - 250px);
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .table-row {
    display:flex;
    font-size: 12px;
    margin 5px 0;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
    div{
        margin-right:15px
    }
    .right{
        position:absolute;
        right:12px;
    }
    .color{
        width:25px;
    }
    .color-0{
        background-color:cornflowerblue;
    }
    .color-1{
        background-color:lightsalmon;
    }
    .color-2{
        background-color:yellow;
    }
    .color-3{
        background-color:lightpink;
    }
    .color-4{
        background-color:mediumaquamarine;
    }
  }
  img{
    width:100%;
  }

 `;
 const groups = [
    { id: 0, value: ''},
    { id: 1, value: "透析室1" },
    { id: 2, value: "透析室2" },    
    { id: 3, value: "透析室3" },    
    { id: 4, value: "透析室4" },    
  ];
class DialysisAnalysis extends Component {
  constructor(props) {
      super(props);
      let list_array = [
        {id:1, name:"田中", color:0, time:"7:00"},
        {id:2, name:"鈴木", color:0, time:"7:15"},
        {id:3, name:"伊藤", color:0, time:"7:30"},
        {id:4, name:"加藤", color:1, time:"7:45"},
        {id:5, name:"山田", color:1, time:"8:00"},
        {id:6, name:"佐々木", color:1, time:"8:00"},
        {id:7, name:"池田", color:2, time:"8:20"},
        {id:8, name:"中野", color:2, time:"8:40"},
        {id:9, name:"西村", color:2, time:"9:00"},
        {id:10, name:"岡本", color:3, time:"9:30"},
        {id:11, name:"中川", color:3, time:"9:30"},
        {id:12, name:"青木", color:3, time:"10:00"},
        {id:13, name:"西村", color:4, time:"10:100"},
        
      ];
      let tmp = {}
      let list_item = [];
      for( var i = 1; i < 8; i++){
        tmp = {id:i, date:"2019.07.0"+i.toString()};
        list_item.push(tmp);
      }      
          
      this.state = {            
        list_array,
        list_item,  
        date_sort_order:0, 
        start_date:new Date(),
        end_date:new Date()     ,
        isRangeSettingModal: false,
      }
      
  }
getRadio = (name) => {
    if (name === "check") {
        // console.log(name)
    }
};
getStartDate = value => {
    this.setState({
        start_date: value,
    });
  };
  getEndDate = value => {
    this.setState({
        end_date: value,
    });
  };
    OpenInputPanelModal = () => {
        this.setState({ isRangeSettingModal:true });
    }
    closeModal = () => {
        this.setState({
            isRangeSettingModal: false,
        });
    };
  render() {        
    let {list_array} = this.state;    
    const ExampleCustomInput = ({ value, onClick }) => (
        <div className="cur-date example-custom-input" onClick={onClick}>
            {formatJapanDate(value)}
        </div>
    );
    return (
      <>
        <DialSideBar
          history = {this.props.history}
        />      
        <Card>
          <div className="title">適正透析分析</div>
          <SearchPart>              
              <div className="flex">
                <Col md="4">
                  <div>検査項目</div>
                </Col>
                <Col md="5">
                  <div>分析期間</div>
                </Col>
                <Col md="2">
                  <div>グループ</div>
                </Col>                
              </div>
              <div className="flex">
                <Col md="4" className="flex">
                    <SelectorWithLabel
                        options={groups}
                        title=""
                        // getSelect={this.getGroup.bind(this)}
                        // departmentEditCode={this.state.group}
                    />
                    <RadioButton
                      id="before"
                      value={0}
                      label="前"
                      name="week_day"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 0 ? true : false}
                  />
                  <RadioButton
                      id="after"
                      value={1}
                      label="後"
                      name="week_day"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
                  />

                </Col>
                <Col md="5" className="flex date_area">
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
                </Col>
                <Col md="2" className="flex">
                    <SelectorWithLabel
                        options={groups}
                        title=""
                        // getSelect={this.getGroup.bind(this)}
                        // departmentEditCode={this.state.group}
                    />
                </Col>                
              </div>
        </SearchPart>
          <div className="top-area flex">              
            <div className="sub-title-image flex">
                <div className = "checkbox-area left">棒グラフ</div>
                <div className="right flex">                
                <Checkbox
                    label="テータを表示"
                    getRadio={this.getRadio.bind(this)}
                    // value={this.state.allChecked}
                    name="check"
                />         
                </div>                      
              </div>            
              <div className="sub-title-list">患者一覧</div>
          </div> 
          
          <Wrapper>
            <CanvasJSChart options = {options}
                    /* onRef = {ref => this.chart = ref} */
                />
           </Wrapper>            
        
          <List>              
            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
              list_array.map(item => {
                return (
                  <>
                    <div className="table-row">
                      <div className={`color color-${item.color}`}></div>
                      <div className="patient_name">{item.name}</div>
                      <div className="time right">{item.time}</div>
                    </div>
                  </>
                )
              })
            )}
            </List>   
            <div className="footer">
                <div className="button_area">
                    <Button type="mono" onClick={ this.OpenInputPanelModal }>表示範囲設定</Button>
                    <Button type="mono">帳票プレビュー(リスト)</Button>              
                    <Button type="mono">帳票プレビュー(グラフ)</Button>              
                    <Button type="mono">データ出力(Excel)</Button>
                </div>              
            </div>
            {this.state.isRangeSettingModal && (
                <RangeSetting
                    handleOk={this.handleOk}
                    closeModal={this.closeModal}
                />
            )}
            </Card>      
      </>
    )
  }
}

DialysisAnalysis.propTypes = {
  history : PropTypes.object
};
export default DialysisAnalysis