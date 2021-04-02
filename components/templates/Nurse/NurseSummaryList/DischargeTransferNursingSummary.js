import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateLine} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
// import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Radiobox from "~/components/molecules/Radiobox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectPatientModal from "~/components/templates/Patient/components/SelectPatientModal";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  font-size:1rem;
  .flex {
    display: flex;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .div-value {
    height:2rem;
    line-height:2rem;
    padding:0 0.3rem;
    border:1px solid #aaa;
    min-width:10rem;
  }
  .div-title {
    height:2rem;
    line-height:2rem;
    margin-right:0.5rem;
  }
  .react-datepicker-wrapper {
    input {
     height: 2rem;
     width: 6rem;
     font-size:1rem;
    }
  }
  .panel-menu {
    margin-top:0.5rem;
    display:flex;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    .menu-btn {
      width:33%;
      text-align: center;
      border: 1px solid #aaa;
      background-color: rgba(200, 194, 194, 0.22);
      height: 2rem;
      line-height: 2rem;
      cursor: pointer;
    }
    .active-menu {
      width:33%;
      text-align: center;
      border-top: 1px solid #aaa;
      border-right: 1px solid #aaa;
      border-left: 1px solid #aaa;
      height: 2rem;
      line-height: 2rem;
    }
  }
  .panel-body {
    width:99%;
    height: calc(100% - 7rem);
    padding:0.5rem;
    border-bottom: 1px solid #aaa;
    border-right: 1px solid #aaa;
    border-left: 1px solid #aaa;
    button {
      height:2rem;
    }
    .left-area {
      width:45%;
    }
    .left-area {
      width:50%;
    }
    .radio-area{
      line-height: 2rem;
      label {
        font-size:1rem;
        margin-bottom:0;
      }
    } 
    .list-area {
      width: 100%;
      height: calc(100% - 21.5rem);
      overflow-y: auto;
      border: 1px solid #aaa;
      margin-top: -1px;
      padding-bottom: 0.3rem;
      .row-data {
        display:flex;
        border-bottom: 1px solid #aaa;
        .data-number {
          width:3rem; 
          text-align:right;
          padding:0.3rem; 
          border-right: 1px solid #aaa;
        }
        .data-value {
          width:calc(100% - 3rem);
          padding:0.3rem; 
        }
      }
    }
    .tab-2-body {
      height: calc(100% - 22rem);
      margin-top:0.5rem;
      .left-block {
        width:40%;
      }
      .middle-block {
        width:30%;
        height:100%;
        .set-family {
          .label-title {display:none;}
          .pullbox-label {margin-bottom:0;}
          .pullbox-select {
            font-size: 1rem;
            width: 5rem;
            height:2rem;
          }
        }
        .box-value {
          width:calc(100% - 5.5rem);
          height:100%;
          border: 1px solid #aaa;
          overflow-y:auto;
        }
      }
      .right-block {
        width:26%;
        height:100%;
        .box-value {
          width:100%;
          height:20%;
          border: 1px solid #aaa;
          overflow-y:auto;
          margin-top:-1px;
        }
      }
    }
    .tab-3-body {
      width:40%;
      height: 95%;
      margin:0.5rem auto;
      border: 1px solid #aaa;
      .box-header{
        width:100%;
        height:2rem;
        line-height:2rem;
        text-align:center;
        border-bottom: 1px solid #aaa;
      }
      .box-value{
        width:100%;
        height:calc(100% - 2rem);
        overflow-y:auto;
        padding:0.3rem;
      }
    }
  } 
`;

class DischargeTransferNursingSummary extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    let cur_date = new Date();
    this.state = {
      tab_id:1,
      date_and_time_of_hospitalization:new Date(),
      discharge_date:new Date(),
      allergy_type:0,
      infect_type:0,
      create_comment:"",
      move_type:1,
      meal_type:1,
      excretion_type:1,
      bath_clean:1,
      cloth_tachment:1,
      excretion_method:1,
      sleep_type:0,
      internal_medicine:1,
      failure_type:1,


      from_date:new Date(),
      end_date:cur_date.setDate(cur_date.getDate() + 1),
      first_ward_id:0,
      ward_master : [{ id: 0, value: "全て" },],
      department_id:0,
      search_type:1,
      patient_id:"",
      table_data:[],
      alert_messages:'',
      confirm_message:'',
      confirm_type:'',
      selectPatient: false,
      patient_number:"",
    };
    this.ward_name = [];
  }

  getDate = (key,value) => {
    if (value == null) {
      value = new Date();
    }
    this.setState({[key]: value});
  };

  setTab = (val) => {
    this.setState({
      tab_id:parseInt(val),
    });
  };

  setRadioType = (e) => {
    this.setState({[e.target.name]:parseInt(e.target.value)})
  }

  setComment=(key, e)=>{
    this.setState({[key]: e.target.value});
  }

  setFamily = e => {
    this.setState({ first_ward_id: parseInt(e.target.id)});
  };

  async componentDidMount() {
    // await this.getMasterData();
    // await this.getSearchResult();
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/ward/get/master_data/plan_list";
    let post_data = {
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            this.ward_name[ward.number] = ward.name;
            ward_master.push({id:ward.number, value:ward.name});
          })
        }
        this.setState({ward_master});
      })
      .catch(() => {
      });
  }

  setDepartment = e => {
    this.setState({ department_id: parseInt(e.target.id)}, ()=>{
      this.getSearchResult();
    });
  };

  getSearchResult =async()=>{
    let path = "/app/api/v2/ward/get/in_out/hospital/plan_list";
    let post_data = {
      from_date:formatDateLine(this.state.from_date),
      end_date:formatDateLine(this.state.end_date),
      first_ward_id:this.state.first_ward_id,
      department_id:this.state.department_id,
      patient_id:this.state.patient_id,
      search_type:this.state.search_type, //0:予定含む 1:決定完了
      tab_id:this.state.tab_id, //0:入院 1:退院
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          table_data: res,
        });
      })
      .catch(() => {
      });
  }

  confirmCancel() {
    let state_data = {
      alert_messages: "",
      confirm_message: "",
      confirm_type: ""
    };
    this.setState(state_data);
  }


  openSelectPatientModal = () => {
    this.setState({
      selectPatient: true
    });
  }

  selectPatient = (patient) => {
    this.setState({
      patient_number: patient.patientNumber,
      patient_id: patient.systemPatientId,
      selectPatient: false,
    }, ()=>{
      this.getSearchResult();
    });
  }

  closeModal = () => {
    this.setState({
      selectPatient: false,
    });
  }

  removePatientId=()=>{
    this.setState({
      patient_number:"",
      confirm_message:"",
      confirm_type:"",
    }, ()=>{
      this.getSearchResult();
    });
  }

  confirmClear=()=>{
    if(this.state.patient_number != ""){
      this.setState({
        confirm_message:"患者IDをクリアします。よろしいですか？",
        confirm_type:"clear_patient"
      });
    }
  }

  render() {
    return (
      <Modal show={true} id="add_contact_dlg"  className="discharge-transfer-nursing-summary first-view-modal">
        <Modal.Header><Modal.Title>退院・転院時看護要約</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <PatientsWrapper>
              <div className={'flex'}>
                <div className={'div-value'} style={{width:"6rem"}}>2020/09/18</div>
                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>患者氏名</div>
                <div className={'div-value'}>患者 Ａ</div>
                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>入院日</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.from_date}
                  onChange={this.getDate.bind(this, "date_and_time_of_hospitalization")}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="年/月/日"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>退院日</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.from_date}
                  onChange={this.getDate.bind(this, "discharge_date")}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="年/月/日"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
              </div>
              <div className={'flex'} style={{marginTop:"0.5rem"}}>
                <div className={'div-title'}>承認状態</div>
                <div className={'div-value'}></div>
                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>承認日</div>
                <div className={'div-value'}></div>
                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>承認者氏名</div>
                <div className={'div-value'}></div>
                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>承認コメント</div>
                <div className={'div-value'}></div>
              </div>
              <div className="panel-menu">
                {this.state.tab_id === 1 ? (
                  <div className="active-menu">要約①</div>
                ) : (
                  <div className="menu-btn" onClick={this.setTab.bind(this, 1)}>要約①</div>
                )}
                {this.state.tab_id === 2 ? (
                  <div className="active-menu">要約②</div>
                ) : (
                  <div className="menu-btn"  onClick={this.setTab.bind(this, 2)}>要約②</div>
                )}                    
                {this.state.tab_id === 3 ? (
                  <div className="active-menu">要約③</div>
                ) : (
                  <div className="menu-btn"  onClick={this.setTab.bind(this, 3)}>要約③</div>
                )}                    
              </div>
              <div className={'panel-body'}>
                {this.state.tab_id == 1 && (
                  <>
                    <div className={'flex'}>
                      <div className={'left-area'}>
                        <div className={'flex'}>
                          <div className={'div-title'}>病名</div>
                          <button>▼</button>
                          <div className={'div-value'} style={{width:"25rem", height:"4rem", overflowY:"auto", lineHeight:0}}></div>
                        </div>
                        <div className={'flex'} style={{marginTop:"0.5rem"}}>
                          <div className={'div-title'}>術式</div>
                          <button>▼</button>
                          <div className={'div-value'} style={{width:"25rem", height:"4rem", overflowY:"auto", lineHeight:0}}></div>
                        </div>
                        <div className={'div-title'} style={{marginTop:"0.5rem"}}>アレルギー</div>
                        <div className={'flex radio-area'}>
                          <Radiobox
                            label={'有'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.allergy_type === 1}
                            name={`allergy_type`}
                          />
                          <Radiobox
                            label={'無'}
                            value={0}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.allergy_type === 0}
                            name={`allergy_type`}
                          />
                          <div className={'div-value'}></div>
                        </div>
                        <div className={'div-title'}>感染症</div>
                        <div className={'flex radio-area'}>
                          <Radiobox
                            label={'有'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.infect_type === 1}
                            name={`infect_type`}
                          />
                          <Radiobox
                            label={'無'}
                            value={0}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.infect_type === 0}
                            name={`infect_type`}
                          />
                          <div className={'div-value'}></div>
                        </div>
                      </div>
                      <div className={'right-area'}>
                        <div className={'flex'}>
                          <div className={'div-title'} style={{width:"5rem"}}>科別</div>
                          <div className={'div-value'}>内科</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"0.5rem"}}>
                          <div className={'div-title'} style={{width:"5rem"}}>主治医</div>
                          <div className={'div-value'}>医師 Ａ</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"0.5rem"}}>
                          <div className={'div-title'} style={{width:"5rem"}}>記載者</div>
                          <div className={'div-value'}>ＡＡ</div>
                          <div className={'div-value'} style={{marginLeft:"0.5rem"}}>看護師 Ａ</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"0.5rem"}}>
                          <div className={'div-title'} style={{width:"5rem"}}>その他備考</div>
                          <div className={'div-value'} style={{width:"30rem", height:"5rem", overflowY:"auto", lineHeight:0}}></div>
                          <button style={{height:"2rem", marginLeft:"0.5rem"}}>取り込み</button>
                        </div>
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.5rem"}}>
                      <div className={'div-value'} style={{width:"40rem"}}>入院中の問題点と看護実践（解決状況）</div>
                      <button style={{marginLeft:"0.5rem"}}>看護問題リスト</button>
                      <button style={{marginLeft:"0.5rem"}}>SOAP&フォーカス</button>
                    </div>
                    <div className={'div-value'} style={{width:"100%", textAlign:"center", marginTop:"-1px"}}>看護問題・看護計画・評価</div>
                    <div className={'list-area'}>
                      <div className={'row-data'}>
                        <div className={'data-number'}>1</div>
                        <div className={'data-value'}>
                          <div>～～ 便検</div>
                          <div>～～～～ 計測日＝ 2010年 12月20日(月)</div>
                          <div>～		Ｓ＝「お腹が張っている」</div>
                          <div>～		Ｏ＝～～～～</div>
                          <div>～		Ａ＝～～～～～～～～</div>
                          <div>～～～～～</div>
                          <div>～		Ｐ＝～～～～</div>
                          <div>～～～～～</div>
                        </div>
                      </div>
                      <div className={'row-data'}>
                        <div className={'data-number'}>2</div>
                        <div className={'data-value'}>
                          <div>～～ 便検</div>
                          <div>～～～～ 計測日＝ 2010年 12月20日(月)</div>
                          <div>～		Ｓ＝「お腹が張っている」</div>
                          <div>～		Ｏ＝～～～～</div>
                          <div>～		Ａ＝～～～～～～～～</div>
                          <div>～～～～～</div>
                          <div>～		Ｐ＝～～～～</div>
                          <div>～～～～～</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {this.state.tab_id == 2 && (
                  <>
                    <div className={'div-value'} style={{width:"33%", textAlign:"center"}}>看護必要状況</div>
                    <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>移動</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'自立(独歩・杖)'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.move_type === 1}
                            name={`move_type`}
                          />
                          <Radiobox
                            label={'歩行器・押し車'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.move_type === 2}
                            name={`move_type`}
                          />
                          <Radiobox
                            label={'車いす'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.move_type === 3}
                            name={`move_type`}
                          />
                          <Radiobox
                            label={'ベッド上'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.move_type === 4}
                            name={`move_type`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>食事</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'自立'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.meal_type === 1}
                            name={`meal_type`}
                          />
                          <Radiobox
                            label={'全介助'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.meal_type === 2}
                            name={`meal_type`}
                          />
                          <Radiobox
                            label={'経管栄養'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.meal_type === 3}
                            name={`meal_type`}
                          />
                          <Radiobox
                            label={'半介助'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.meal_type === 4}
                            name={`meal_type`}
                          />
                          <Radiobox
                            label={'絶食'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.meal_type === 4}
                            name={`meal_type`}
                          />
                          <Radiobox
                            label={'点滴'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.meal_type === 4}
                            name={`meal_type`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>排泄</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'自立'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_type === 1}
                            name={`excretion_type`}
                          />
                          <Radiobox
                            label={'一部介助'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_type === 2}
                            name={`excretion_type`}
                          />
                          <Radiobox
                            label={'全介助'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_type === 3}
                            name={`excretion_type`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                    </div>
                    <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>入浴・保清</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'自立'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.bath_clean === 1}
                            name={`bath_clean`}
                          />
                          <Radiobox
                            label={'機械浴'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.bath_clean === 2}
                            name={`bath_clean`}
                          />
                          <Radiobox
                            label={'介助浴'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.bath_clean === 3}
                            name={`bath_clean`}
                          />
                          <Radiobox
                            label={'清拭(手浴・足浴・洗髪含む)'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.bath_clean === 4}
                            name={`bath_clean`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>食事</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'自立'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.cloth_tachment === 1}
                            name={`cloth_tachment`}
                          />
                          <Radiobox
                            label={'一部介助'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.cloth_tachment === 2}
                            name={`cloth_tachment`}
                          />
                          <Radiobox
                            label={'全介助'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.cloth_tachment === 3}
                            name={`cloth_tachment`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>排泄方法</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'ポータブル'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_method === 1}
                            name={`excretion_method`}
                          />
                          <Radiobox
                            label={'オムツ'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_method === 2}
                            name={`excretion_method`}
                          />
                          <Radiobox
                            label={'尿器'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_method === 3}
                            name={`excretion_method`}
                          />
                          <Radiobox
                            label={'トイレ'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_method === 4}
                            name={`excretion_method`}
                          />
                          <Radiobox
                            label={'バルンカテーテル'}
                            value={5}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.excretion_method === 5}
                            name={`excretion_method`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                    </div>
                    <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>入浴・保清</div>
                        <div className={'flex'}>
                          <div className={'div-title'}>睡眠障害</div>
                          <Radiobox
                            label={'有'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.sleep_type === 1}
                            name={`sleep_type`}
                          />
                          <Radiobox
                            label={'無'}
                            value={0}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.sleep_type === 0}
                            name={`sleep_type`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>内服</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'自己管理'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.internal_medicine === 1}
                            name={`internal_medicine`}
                          />
                          <Radiobox
                            label={'一回配薬'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.internal_medicine === 2}
                            name={`internal_medicine`}
                          />
                          <Radiobox
                            label={'一日配薬'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.internal_medicine === 3}
                            name={`internal_medicine`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                      <div className={'radio-area'} style={{width:"33%"}}>
                        <div className={'div-title'}>障害</div>
                        <div className={'flex'}>
                          <Radiobox
                            label={'聴覚'}
                            value={1}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.failure_type === 1}
                            name={`failure_type`}
                          />
                          <Radiobox
                            label={'視覚'}
                            value={2}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.failure_type === 2}
                            name={`failure_type`}
                          />
                          <Radiobox
                            label={'味覚'}
                            value={3}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.failure_type === 3}
                            name={`failure_type`}
                          />
                          <Radiobox
                            label={'その他'}
                            value={4}
                            getUsage={this.setRadioType.bind(this)}
                            checked={this.state.failure_type === 4}
                            name={`failure_type`}
                          />
                        </div>
                        <div className={'div-value'} style={{width:"100%"}}></div>
                      </div>
                    </div>
                    <div className={'flex justify-content tab-2-body'}>
                      <div className={'left-block'}>
                        <div className={'div-value'} style={{width:"100%"}}>家族構成及び主介護者（キーパーソン）</div>
                        <div style={{textAlign:"right", marginTop:"12rem"}}>
                          <button>取り込み</button>
                        </div>
                      </div>
                      <div className={'middle-block'}>
                        <div className={'div-value'} style={{width:"100%"}}>病気・障害・後遺症等の受け止め方/退院後の生活に関する意向</div>
                        <div className={'flex'} style={{height:"29%", marginTop:"-1px"}}>
                          <div className={'div-title'} style={{width:"5rem"}}>本人</div>
                          <div className={'box-value'}></div>
                        </div>
                        <div className={'flex'} style={{height:"29%", marginTop:"-1px"}}>
                          <div className={'div-title'} style={{width:"5rem"}}></div>
                          <div className={'box-value'}></div>
                        </div>
                        <div className={'flex'} style={{height:"29%", marginTop:"-1px"}}>
                          <div className={'set-family'}>
                            <div className={'div-title'} style={{width:"5rem"}}>家族</div>
                            <SelectorWithLabel
                              options={[]}
                              title=""
                              getSelect={this.setFamily}
                              departmentEditCode={0}
                            />
                          </div>
                          <div className={'box-value'}></div>
                        </div>
                      </div>
                      <div className={'right-block'}>
                        <div className={'flex'}>
                          <div className={'div-value'}>既往歴</div>
                          <button style={{marginLeft:"auto", marginRight:0}}>取り込み</button>
                        </div>
                        <div className={'box-value'}></div>
                        <div className={'div-value'} style={{width:"100%", marginTop:"-1px"}}>その他留意事項</div>
                        <div className={'box-value'}></div>
                        <div className={'div-value'} style={{width:"15rem", marginTop:"-1px"}}>緊急連絡先</div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-value'}></div>
                          <div className={'div-title'} style={{marginLeft:"0.5rem"}}>様</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>Tel</div>
                          <div className={'div-value'}></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {this.state.tab_id == 3 && (
                  <>
                    <div className={'tab-3-body'}>
                      <div className={'box-header'}>その他</div>
                      <div className={'box-value'}></div>
                    </div>
                  </>
                )}
              </div>
            </PatientsWrapper>                
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div className={'creat-comment'}>
            <InputWithLabel
              type="text"
              label="作成コメント"
              getInputText={this.setComment.bind(this, 'create_comment')}
              diseaseEditData={this.state.create_comment}
            />
          </div>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className={"red-btn"}>印刷</Button>
          <Button className={"red-btn"}>仮保存</Button>
          <Button className={"red-btn"}>確定保存</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.removePatientId.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}                
        {this.state.selectPatient && (
          <SelectPatientModal
            handleOk={this.selectPatient}
            closeModal={this.closeModal}
          />
        )}
      </Modal>
    );
  }
}

DischargeTransferNursingSummary.contextType = Context;
DischargeTransferNursingSummary.propTypes = {
  closeModal: PropTypes.func,
}
export default DischargeTransferNursingSummary;

