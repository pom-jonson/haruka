import React, { Component } from "react";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabel from "../../../molecules/InputWithLabel";
import { Col } from "react-bootstrap";
import DialPatientNav from "../DialPatientNav";
import PropTypes from "prop-types";

const Card = styled.div`
  position: fixed;  
  top: 70px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        margin-top: 0.625rem;
        text-align: center;
        button {
          text-align: center;
          border-radius: 0.25rem;
          background: rgb(105, 200, 225); 
          border: none;
          margin-right: 1.875rem;
        }
        
        span {
          color: white;
          font-size: 0.8rem;
          font-weight: 100;
        }
    }
  .flex{
    display:flex;
  }
  .sub-title-image{
    width:82%;
    position:relative; 
    input{
      width:4.375rem;
    }
    .radio-btn{
      label{
        width: 3rem;
        border: 1px solid;
        margin-top: 1rem;
        border-radius: 0px;
        margin-right: 3px;
        font-weight:600;
      }
    }  
    .pullbox{
      .label-title{
        display:none;
      }
      select{
        width:7.5rem;
      }
    }
    
  }
  .sub-title-list{
    width:18%;
    margin-right: 2%;
    font-size: 1rem;
  }
  .top-area{    
    clear:both;
  }
  .footer{
    clear: both;
    display: flex;
    .label-title{
      text-align:right;
    }
    input{
      width:4.375rem;
    }
    label{
      font-size:1rem;
    }
    .radio-btn{
      label{
        width: 2.5rem;
        border: 1px solid;
        margin-top: 2px;
        border-radius: 0px;
        margin-right: 3px;
        font-weight:600;
        font-size:0.75rem;
      }
      margin-top:0.625rem;
    }
    button{
      margin-left:12.5rem;
    }
    .gender-label{
      margin-top:1rem;
    }
  }  
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 100%;
  height: 1rem;  
  padding-left:0px;
  float: left;
  .list-title {
    margin-top: 1.25rem;
    font-size: 1rem;
    width: 20%;
  }
  .search-box {
      width: 80%;
      display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
    display:none;
  }
  .pullbox-select {
      font-size: 0.75rem;
      width: 12.5rem;
  }
  .browse-file{
    div{
      width:100%;
    }
    button{
      margin-left: 1rem;    
      height: 90%;
      margin-top: 9px;
    }
  }
 `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 18%;
  margin-right: 2%;
  height: calc( 100vh - 17.5rem);
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .table-row {
    font-size: 0.75rem;
    margin 0.3rem 0;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
  }

 `;
const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 80%;
  height: calc( 100vh - 20rem);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  overflow-x:hidden;
  label {
    text-align: right;
  }  
  .thumbnail{
    width:25%;
  }
 `;

 const groups = [
  { id: 0, value: ''},
  { id: 1, value: "透析室1" },
  { id: 2, value: "透析室2" },    
  { id: 3, value: "透析室3" },    
  { id: 4, value: "透析室4" },    
];
const sort_order = [
  { id: 0, value: "", field_name:""},
  { id: 1, value: "コード番号", field_name:"code"},
  { id: 2, value: "名称", field_name:"name"},    
];
class ImageDisplayBatch extends Component {
  constructor(props) {
    super(props);
    let list_array = [
      "シャント",
      "心電図",
      "超音波",
      "ヘリカルCT",
      "シャント状況",
      "シャントエコー",
      "眼底",
      "腹部エコー"
    ];
    let list_item = [
      {name:'田中'},
      {name:'朝子'},
      {name:'幸子'},
      {name:'板垣'},
      {name:'木村'}
    ];

    this.state = {
      schVal: "",
      list_array,     
      list_item     
    }      
  }
    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo: patientInfo
        });
    };
      
  render() { 
    let {list_array, list_item} = this.state;            
    return (
      <>
          <DialSideBar
              onGoto={this.selectPatient}
              history = {this.props.history}
          />
          <DialPatientNav
              patientInfo={this.state.patientInfo}
              history = {this.props.history}
          />
          <Card>
            <div className="title">画像表示(一覧)</div>
            <SearchPart>
              <div className="sub-title-list"></div>
              <div className="sub-title-image flex">
                <Col md="3">
                  <div>曜日</div>
                </Col>
                <Col md="5">
                  <div>時間帯</div>
                </Col>
                <Col md="2">
                  <div>グループ</div>
                </Col>
                <Col md="2">
                  <div>表示順</div>
                </Col>
              </div>
                
            </SearchPart>
            <div className="top-area flex">
              <div className="sub-title-list">画像ジャンル</div>
              <div className="sub-title-image flex">
                <Col md="3" className="flex">                
                  <RadioButton
                      id="half_1"
                      value={0}
                      label="月水金"
                      name="week_day"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 0 ? true : false}
                  />
                  <RadioButton
                      id="half_2"
                      value={1}
                      label="火木土"
                      name="week_day"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
                  />
                  <RadioButton
                      id="whole"
                      value={2}
                      label="全体"
                      name="week_day"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
                  />
                </Col>
                <Col md="5" className="flex">                
                  <RadioButton
                      id="morning"
                      value={0}
                      label="午前"
                      name="time"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 0 ? true : false}
                  />
                  <RadioButton
                      id="afternoon"
                      value={1}
                      label="午後"
                      name="time"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
                  />
                  <RadioButton
                      id="evening"
                      value={2}
                      label="夜間"
                      name="time"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
                  />
                  <RadioButton
                      id="night"
                      value={3}
                      label="深夜"
                      name="time"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
                  />
                  <RadioButton
                      id="all_time"
                      value={4}
                      label="全体"
                      name="time"
                      // getUsage={this.getMedicineCategory}
                      // checked={this.state.category == 1 ? true : false}
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
                <Col md="2" className="flex">
                  <SelectorWithLabel
                    options={sort_order}
                    title=""
                    // getSelect={this.getGroup.bind(this)}
                    // departmentEditCode={this.state.group}
                    />
                </Col>
              </div>            
            </div> 
            <List>              
            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
              list_array.map(item => {
                return (
                  <>
                  <div className="table-row">{item}</div>
                  </>
                )
              })
            )}
            </List>                    
            <Wrapper>
              <table className="table-scroll table table-bordered" id="code-table">
                <thead>
                  <tr>
                    <th  className="date"/>
                    <th  className="date"/>
                    <th className="">2019/11/12</th>
                    <th className="">2019/11/13</th>
                    <th className="">2019/11/14</th>
                    <th className="">2019/11/15</th>
                  </tr>
                </thead>
                <tbody>
                      
                      {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                          list_item.map((item, index) => {
                              return (
                              <>
                                <tr onContextMenu={e => this.handleClick(e, index)}>
                                  <td>{index+1}</td>
                                  <td className="text-center">{item.name}</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>                                  
                                </tr>
                              </>)
                          })
                      )}
                      </tbody>
                  </table>
                          
            </Wrapper>            
            <div className="footer">
              <InputWithLabel 
                label="最終取り込み日から"
                type="text"
              />
              <label className="mr-2 gender-label">ヶ月</label>
                    <RadioButton
                        id="3_month"
                        value={0}
                        label="３ヶ月"
                        name="period"
                        // getUsage={this.getMedicineCategory}
                        // checked={this.state.category == 0 ? true : false}
                    />
                    <RadioButton
                        id="6_month"
                        value={1}
                        label="６ヶ月"
                        name="period"
                        // getUsage={this.getMedicineCategory}
                        // checked={this.state.category == 1 ? true : false}
                    />                  
                    <RadioButton
                        id="12_month"
                        value={0}
                        label="１年"
                        name="period"
                        // getUsage={this.getMedicineCategory}
                        // checked={this.state.category == 0 ? true : false}
                    />
                    <RadioButton
                        id="whole_period"
                        value={1}
                        label="全て"
                        name="period"
                        // getUsage={this.getMedicineCategory}
                        // checked={this.state.category == 1 ? true : false}
                    />
              <Button type="mono">選択画像 表示</Button>              
            </div>                      
                   

            {/* <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
            /> */}
        </Card>
         
      </>
    )
  }
}

ImageDisplayBatch.propTypes = {
  history: PropTypes.object
};
export default ImageDisplayBatch