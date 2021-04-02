import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
registerLocale("ja", ja);
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code, displayLineBreak} from "~/helpers/dialConstants";
import {formatJapan} from "~/helpers/date";
import { Modal } from "react-bootstrap";
// import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  width: 100%;
  height:100%;
  display: flex;
  font-size: 1rem;
  padding-left: 0.6rem;
  align-items: flex-start;
  justify-content: space-between;
  .left-area{
      width: 55%;
      height: 100%;
      overflow-y: auto;
  }
  .right-area{
      width: 40%;
      height: 100%;
      overflow-y: auto;
  }
  .div-title{
      width: 25%;
      padding: 0.25rem;
      background: lightgrey;
      text-align: center;
      vertical-align: middle;
  }
  .div-content{
      padding: 0.25rem;
      width: 75%;
  }
  .two-content{
      width: 37.5%;
  }
  .div-comment{
      width: 75%;
      overflow-y: auto;
      word-break: break-all;
      height: 10rem;
  }
  table{
      td{
          font-size: 1rem;
          padding: 0.25rem;
          height: 2rem;
          word-break:break-all;
          word-wrap:break-word;
      }
  }
  .border{
      border: solid 1px black !important;
  }
  .border-bottom{
      border-bottom: solid 1px black !important;
  }
  .right-area{
      .div-title{
          padding-top: 70%;
          border-right: none !important;
      }
  }
 `;
const blood_type = ['A', 'B','O','AB'];

class PatientMainModal extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let japan_year_list = [];
        var i =0;
        var japan_year_name ='';
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
        this.state = {
            system_patient_id : this.props.system_patient_id,
            patientInfo: this.props.patientInfo,
            japan_year_list
        }
    }

    async componentDidMount(){        
        this.getList();
        let code_master = sessApi.getObjectValue("dial_common_master","code_master");
        this.setState({
            primary_disease_codes: makeList_code(code_master['原疾患']),
            death_cause_codes: makeList_code(code_master['死亡原因']),
            occupation_codes: makeList_code(code_master['職業']),
            dial_group_codes: makeList_code(code_master['グループ']),
            dial_group_codes2: makeList_code(code_master['グループ2']),
        })
    }

    getList = async() => {
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
        if (patientInfo == undefined || patientInfo.system_patient_id == undefined) {
            this.setState({table_data:[]})
            return;
        }

        let path = "/app/api/v2/dial/patient/emergency_contact";
        let post_data = {
            system_patient_id: this.state.system_patient_id,
            is_enabled:1,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({
            emergency_data: data,
            origin_data:[...data]
        });
    }

    getJapanDate (val) {
        if (val == undefined || val == null || val == "") return "";
        var cur_year = val.substring(0,4);
        var cur_month = val.substring(5,7);
        var cur_day = val.substring(8,10);
        return this.state.japan_year_list.find(x => x.id == cur_year).value + '年' + cur_month + '月' + cur_day + '日';
    }
		onHide () {}
 
    render() {
        let {patientInfo, emergency_data} = this.state;
        let rh = "";
        if (patientInfo != undefined && 
            patientInfo != null && 
            patientInfo.RH != undefined && 
            patientInfo.RH != null) {
            rh = patientInfo.RH == 0 ? "+" : patientInfo.RH == 1 ? "-" : "";
            if (rh != "") rh = "(" + rh + ")";
        }        
        return (
					<Modal show={true} onHide={this.onHide} className="wordPattern-modal master-modal patient-info-edit-modal first-view-modal">
            <Modal.Header>
							<Modal.Title>基本情報/緊急連絡先</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Wrapper>
									<div className="left-area">
											<table className="table">
													<tr>
															<td className="div-title border">患者番号</td>
															<td className="div-content border">{patientInfo.patient_number != undefined ? patientInfo.patient_number : ""}</td>
													</tr>
											</table>
											<table className="table">
													<tr>
															<td className="div-title border">フリガナ</td>
															<td className="div-content border">{patientInfo.kana_name != undefined ? patientInfo.kana_name : ""}</td>
													</tr>
													<tr>
															<td className="div-title border">氏名</td>
															<td className="div-content border">{patientInfo.patient_name != undefined ? patientInfo.patient_name : ""}</td>
													</tr>
											</table>
											<table className="table">
													<tr>
															<td className="div-title border" rowSpan={2}>住所</td>
															<td className="div-content border">{patientInfo.address != undefined ? patientInfo.address : ""}{patientInfo.building_name != undefined ? patientInfo.building_name : ""}</td>
													</tr>
													<tr>
															<td className="div-content border">{` `}</td>
													</tr>
											</table>
											<table className="table">
													<tr>
															<td className="div-title border">自宅</td>
															<td className="div-content border">{patientInfo.tel_number != undefined ? patientInfo.tel_number : ""}</td>
													</tr>
													<tr>
															<td className="div-title border">携帯</td>
															<td className="div-content border">{patientInfo.mobile_number != undefined ? patientInfo.mobile_number : ""}</td>
													</tr>
											</table>
											<table className="table">
													<tr>
															<td className="div-title border">メールアドレス</td>
															<td className="div-content border">{patientInfo.mail_address != undefined ? patientInfo.mail_address : ""}</td>
													</tr>
											</table>
											<table className="table">
													<tr>
															<td className="div-title border">職業</td>
															<td className="div-content border">{patientInfo.occupation != undefined && patientInfo.occupation != null && this.state.occupation_codes != undefined? this.state.occupation_codes[patientInfo.occupation] : ""}</td>
													</tr>
											</table>
											<table className="table">
													<tr>
															<td className="div-title border">生年月日</td>
															<td className="two-content border">{formatJapan(patientInfo.birthday)}</td>
															<td className="two-content border">{this.getJapanDate(patientInfo.birthday)}</td>
													</tr>
													<tr>
															<td className="div-title border">年齢</td>
															<td className="two-content border">{patientInfo.age != null && patientInfo.age != "" ? patientInfo.age + "歳" : ""}</td>
													</tr>
													<tr>
															<td className="div-title border">血液型</td>
															<td className="two-content border">{patientInfo!=undefined && patientInfo!=null && patientInfo.blood_type != null && patientInfo.blood_type != 4 ? blood_type[patientInfo.blood_type] + rh:''}</td>
													</tr>
											</table>
											<table className="table comment-table">
													<tr>
															<td className="div-title border">コメント</td>
															<td className="div-comment border">{displayLineBreak(patientInfo.comment)}</td>
													</tr>
											</table>
									</div>
									<div className="right-area d-flex">
											<div className="div-title border" style={{height:"100%", marginTop:"70%;", borderRight:"none"}}>緊急連絡先</div>
											<div className="div-content border" style={{height:"100%", overflowY:"auto", padding:0}}>
													{emergency_data != undefined && emergency_data != null && emergency_data.length > 0 && emergency_data.map(item=>{
															return (
																	<div key={item} className="border-bottom pl-1">
																			<div>{item.name} {item.relation != null && item.relation != '' ? "（" + item.relation + "）" : ""}</div>
																			<div>{item.address_1} {item.address_2}</div>
																			{(item.phone_number_1_name != null && item.phone_number_1_name != '') || (item.phone_number_1 != null && item.phone_number_1 !=  '') ? (
																					<div>① {item.phone_number_1_name}{item.phone_number_1_name != null && item.phone_number_1_name != '' && item.phone_number_1 != null && item.phone_number_1 !=  '' ? "：":"" }{item.phone_number_1}</div>
																			):(<></>)}
																			{(item.phone_number_2_name != null && item.phone_number_2_name != '') || (item.phone_number_2 != null && item.phone_number_2 !=  '') ? (
																					<div>② {item.phone_number_2_name}{item.phone_number_2_name != null && item.phone_number_2_name != '' && item.phone_number_2 != null && item.phone_number_2 !=  '' ? "：":"" }{item.phone_number_2}</div>
																			):(<></>)}
																			<div>{displayLineBreak(item.note)}</div>
																	</div>
															)
													})}
											</div>
									</div>
							</Wrapper>
						</Modal.Body>
						<Modal.Footer>
              <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
                <span>キャンセル</span>
              </div>
							{/* <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button> */}
						</Modal.Footer>
					</Modal>
        )
    }
}

PatientMainModal.contextType = Context;

PatientMainModal.propTypes = {
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
    system_patient_id: PropTypes.number,
    from_source: PropTypes.string,
};

export default PatientMainModal