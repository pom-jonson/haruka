import React, { Component } from "react";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Button from "~/components/atoms/Button";
import DialPatientNav from "../DialPatientNav";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatJapanDate, formatDateSlash, formatDateTimeIE} from "~/helpers/date";
import * as methods from "~/components/templates/Dial/DialMethods";
import FormWithLabel from "~/components/molecules/FormWithLabel";
import DigitalImageModal from "~/components/templates/Dial/MedicalInformation/DigitalImageModal";
import PropTypes from "prop-types";
import axios from "axios/index";

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
    padding-left: 7px;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
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
    font-size:1.5rem;
    width:82%;
    position:relative;
    .right{
      position:absolute;
      right:0px;
      bottom: 2px;
      label{
        margin-bottom:0px;
        font-size:1rem;
      }
      .radio-btn label{
        width: 7.5rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        padding: 0px 0.3rem;
        font-size: 1.3rem;
        text-align:center;
        margin: 0 0.3rem;
      }
    }
  }
  .sub-title-list{
    font-size: 1.5rem;
    width:18%;
    margin-left: 2%;
  }
  .top-area{
    padding-top:1rem;
    clear:both;
  }
  .file_check_area{
    .gender-label{
      margin-left:1rem;
    }
  }
  .footer-buttons{
    width: 80%;
    align-items: flex-start;
    justify-content: space-between;
    .left-area {
      display: flex;
      margin-top: auto;
      margin-bottom: auto;
      .input-period {
        div {
          display: flex;
          flex-direction: row;
          div {
            line-height: 2.5rem;
            width: 11rem;
          }
        }
      }
      clear: both;
      display: flex;
      .label-title{
        text-align:right;
      }
      input{
        width:4rem;
        margin:0;
        height:2.5rem;
      }
      .radio-btn{
        label{
          width: 3.5rem;
          border: 1px solid;
          margin-top: 1rem;
          border-radius: 0px;
          margin-right: 3px;
          font-weight:600;
        }
      }
      button{
        margin-left:1rem;
      }
      .period-unit {
          width: 50px;
          line-height: 2.5rem;
          margin: 0;
      }
      .select-radio {
          label {
              margin: 0;
              line-height: 2.5rem;
              height: 2.5rem;
          }
      }
    }
    .right-area {

    }
  }
`;
const Wrapper = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  display: block;
  font-size: 1rem;
  width: 80%;
  height: calc(100vh - 18.75rem);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  label {
      text-align: right;
  }
  
    .flex {
        display: flex;
     }
    .inline-flex {
        display: inline-flex;
        border-bottom: 1px solid gray;
     }
     .fl {
        float: left;
     }
    .table-area {
        height: 100%;
        width: 100%;
        border: solid 1px darkgray;
        overflow-y: auto;
        overflow-x: auto;
        .mbm5p {
            margin-bottom: -0.3rem;
        }
        .table-menu {
            background-color: gainsboro;
        }
        .head-title {
          font-size: 1rem;
          writing-mode: tb-rl;
          width: 2.8rem;
          border-right: 1px solid gray;
          writing-mode: vertical-rl;
          text-orientation: upright;
          text-align: left;
          height: 14.375rem;
        }
        .date {
          width: 10.625rem;
          text-align: center;
          border-right: 1px solid gray;
        }
        .content {
          border-right: 1px solid gray;
          width: 2.8rem;
          text-align: center;
        }
        .selected-cell {
            background-color: #84f0e9;
        }
    }
 `;

const List = styled.div`
  display: block;
  overflow-y: auto;
  font-size: 0.75rem;
  width: 18%;
  margin-left: 2%;
  height: calc(100vh - 18.75rem);
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: 1px solid #aaa;
  margin-bottom:1.875rem;
  .table-row {
    font-size: 0.75rem;
    margin 0.3rem 0;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
  }
    .image-area {
        text-align:center;
        border: 1px solid #aaa;
        margin: 0.625rem;
        height: 6.5rem;
         img {
            max-width:100%;
            max-height:5rem;
            padding: 0.3rem;
         }
    }

    .a-link{
        border-bottom: 1px solid;
        color: #007bff;
        cursor:pointer;
        margin-top:3px;
        margin-bottom:3px;
    }
 `;

class ImageDisplayIndividual extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      system_patient_id : 0,
      image_list:{},
      image_only_list:[],
      select_cell: 0,
      date_sort_order:0,
      thumbnail_list:[],
      cur_date:undefined,
      genre_code:0,
      period_month:'',
      openDigitalImageModal:false,
    }
  }
  
  async UNSAFE_componentWillMount(){
    await this.getGenreMasterCode("画像");
  }
  
  selectPatient = (patientInfo) => {
    this.setState({
      patientInfo: patientInfo,
      system_patient_id: patientInfo.system_patient_id,
      select_cell: 0,
      date_sort_order:0,
      thumbnail_list:[],
      cur_date:undefined,
      genre_code:0,
    }, ()=>{
      this.getImageList();
    });
  };
  
  async getImageList(){
    if(this.state.system_patient_id === ''){
      window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/getImageByPatient";
    const post_data = {
      system_patient_id:this.state.system_patient_id,
      date_sort_order:this.state.date_sort_order,
      period_month:this.state.period_month,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          this.setState({
            image_list : res,
          });
        }
      })
      .catch(() => {
      
      });
  }
  
  async getImageInfo(code, cur_date = undefined){
    if(code === 0){
      window.sessionStorage.setItem("alert_messages", '画像ジャンルを選択してください。');
      return;
    }    
    let path = "/app/api/v2/dial/medicine_information/getImageByGenre";
    const post_data = {
      system_patient_id:this.state.system_patient_id,
      image_genre_code:code,
      cur_date: cur_date != undefined ? formatDateLine(cur_date) : undefined,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          var image_only_list = [];
          if (res.length > 0){
            res.map(item => {
              if (item.imgBase64 != '') image_only_list.push(item);
            })
          }          
          this.setState({
            image_only_list,
            thumbnail_list : res,
            cur_date : cur_date,
            genre_code:code
          });
        }
      })
      .catch(() => {
      });
  }
  
  setDateSort = (e) => {
    this.setState({date_sort_order:parseInt(e.target.value)}, ()=>{
      this.getImageList();
    });
  };
  
  setPeriod = (e) => {
    this.setState({
      period_month:parseInt(e.target.value),
      period_month_text:'',
    }, ()=>{
      this.getImageList();
    });
  };
  
  getPeriodMonths = (e) => {
    this.setState({
      period_month_text: parseInt(e.target.value),
      period_month:'',
    })
  };
  
  onInputKeyPressed = (e) => {
    if(e.keyCode === 13 && this.state.period_month_text !== '' && (!isNaN(parseInt(this.state.period_month_text)))){
      this.setState({
        period_month: parseInt(this.state.period_month_text),
      }, ()=>{
        this.getImageList();
      })
    }
  };
  
  openDigitalImageModal=()=>{
    if(this.state.image_only_list != undefined && this.state.image_only_list != null && this.state.image_only_list.length > 0){
      this.setState({openDigitalImageModal:true});
    } else {
      return;
      // window.sessionStorage.setItem("alert_messages", "画像を選択してください。");
    }
  };
  
  closeModal=()=>{
    this.setState({openDigitalImageModal:false});
  };
  
  cancelSelect=()=>{
    this.setState({
      cur_date:undefined,
      genre_code:0,
      thumbnail_list:[],
      image_only_list:[],
    })
  };
  
  downloadfile = async(image_path, filename) => {
    let path = "/app/api/v2/dial/download/VAfiles";
    await axios({
      url: path,
      method: 'POST',
      data:{
        image_path:image_path
      },
      responseType: 'blob', // important
    }).then((response) => {
      if (response.data.size > 0){
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, filename);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      }
    });
  }
  
  render() {
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
          <div className="title">画像表示(個別)</div>
          <div className="top-area flex">
            <div className="sub-title-image flex">
              <div className = "checkbox-area left">
                画像一覧
              </div>
              <div className="right file_check_area flex">
                <RadioButton
                  id="asc"
                  value={0}
                  label="日付昇順"
                  name="display_order"
                  getUsage={this.setDateSort}
                  checked={this.state.date_sort_order === 0}
                />
                <RadioButton
                  id="desc"
                  value={1}
                  label="日付降順"
                  name="display_order"
                  getUsage={this.setDateSort}
                  checked={this.state.date_sort_order === 1}
                />
              </div>
            </div>
            <div className="sub-title-list">サムネイル</div>
          </div>
          <Wrapper>
            <div className="table-area">
              <div className={'fl mbm5p'}>
                <div className={'inline-flex table-menu'}>
                  <div className="date" />
                  {this.state.genreMasterCode !== undefined && this.state.genreMasterCode !== null && this.state.genreMasterCode.length > 0 && (
                    this.state.genreMasterCode.map((item) => {
                      return (
                        <>
                          <div className="head-title clickable" onClick={() => this.getImageInfo(item.number)}>{item.name}</div>
                        </>
                      )
                    })
                  )}
                </div>
              </div>
              {this.state.image_list !== undefined && this.state.image_list !== null && (
                Object.keys(this.state.image_list).map((index) => {
                  return (
                    <>
                      <div className={'fl'}>
                        <div className={'inline-flex'}>
                          { this.state.cur_date === index ? (
                            <div className="date selected-cell text-left">{formatJapanDate(index)}</div>
                          ) : (
                            <div className="date">{formatJapanDate(index)}</div>
                          )}
                          {this.state.genreMasterCode !== undefined && this.state.genreMasterCode !== null && this.state.genreMasterCode.length > 0 && (
                            this.state.genreMasterCode.map((code) => {
                              if(this.state.image_list[index][code.number] != undefined){
                                var class_name = 'content';                                                                
                                if(this.state.cur_date != undefined){
                                  if(this.state.cur_date === index && code.number === this.state.genre_code) class_name = 'content selected-cell';
                                } else {
                                  if (code.number == this.state.genre_code) class_name = 'content selected-cell';
                                }
                                return (
                                  <>
                                    <div
                                      style={{cursor:"pointer", textAlign:"right"}}
                                      className={class_name}
                                      onClick={()=>this.getImageInfo(code.number, index)}
                                    >
                                      {'●' + this.state.image_list[index][code.number]['count']}
                                    </div>
                                  </>
                                )
                              } else {
                                return (
                                  <>
                                    <div className="content"></div>
                                  </>
                                )
                              }
                            })
                          )}
                        </div>
                      </div>
                    </>)
                })
              )}
            </div>
          </Wrapper>
          
          <List>
            {this.state.thumbnail_list != undefined && this.state.thumbnail_list != null && this.state.thumbnail_list.length > 0 && (
              this.state.thumbnail_list.map((item, index) => {
                if(item.imgBase64 !== ''){
                  return (
                    <>
                      <div className={'image-area'} onContextMenu={e => this.handleClick(e, index)}>
                        <div style={{lineHeight:'5rem'}}>
                          <img src={item.imgBase64} alt="" />
                        </div>
                        <div className='text-center'>
                          {this.state.cur_date == undefined && (
                            <>
                            <span>{formatDateSlash(formatDateTimeIE(item.updated_at))}</span>&nbsp;&nbsp;
                            </>
                          )}
                          <span>{item.image_title != null && item.image_title != ''? item.image_title : 'タイトルなし'}</span>
                        </div>
                      </div>
                    </>
                  )
                }
                if(item.filename !=null && item.filename != '' && item.imgBase64 == ''){
                  return (
                    <>
                      <div className='image-area'>
                        <div className='a-link' onClick = {this.downloadfile.bind(this, item.image_path, item.filename)}>
                          <span>{formatDateSlash(formatDateTimeIE(item.updated_at))}</span>&nbsp;&nbsp;
                          <span>{item.image_title != null && item.image_title != ''? item.image_title : 'タイトルなし'}</span>
                        </div>
                      </div>
                    </>
                  )
                }
              })
            )}
          </List>
          <div className="footer-buttons">
            <div className="left-area">
              <div className={'flex input-period'}>
                <FormWithLabel
                  type="number"
                  label="最終取り込み日から"
                  onChange={this.getPeriodMonths.bind(this)}
                  onKeyPressed={this.onInputKeyPressed}
                  value={this.state.period_month_text}
                />
                <label className="period-unit">ヶ月</label>
              </div>
              <div className={'select-radio flex'}>
                <RadioButton
                  id="3_month"
                  value={3}
                  label="３ヶ月"
                  name="period"
                  getUsage={this.setPeriod}
                  checked={this.state.period_month === 3}
                />
                <RadioButton
                  id="6_month"
                  value={6}
                  label="６ヶ月"
                  name="period"
                  getUsage={this.setPeriod}
                  checked={this.state.period_month === 6}
                />
                <RadioButton
                  id="1_year"
                  value={12}
                  label="１年"
                  name="period"
                  getUsage={this.setPeriod}
                  checked={this.state.period_month === 12}
                />
                <RadioButton
                  id="whole_period"
                  value={-1}
                  label="全て"
                  name="period"
                  getUsage={this.setPeriod}
                  checked={this.state.period_month === -1}
                />
              </div>
            </div>
            <div className="right-area">
              <Button
                className={(this.state.image_only_list !== undefined && this.state.image_only_list != null && this.state.image_only_list.length > 0) ? "" : "disable-btn"}
                onClick={this.openDigitalImageModal}
              >選択画像 表示</Button>
              <Button className={(this.state.thumbnail_list !== undefined && this.state.thumbnail_list != null && this.state.thumbnail_list.length > 0) ? "" : "disable-btn"} onClick={this.cancelSelect}>選択解除</Button>
            </div>
            {/*<Button type="mono">自動取込履歴</Button>*/}
          </div>
          {this.state.openDigitalImageModal && (
            <DigitalImageModal
              closeModal={this.closeModal}
              image_list={this.state.image_only_list}
            />
          )}
        </Card>
      </>
    )
  }
}

ImageDisplayIndividual.propTypes = {
  history: PropTypes.object,
};
export default ImageDisplayIndividual