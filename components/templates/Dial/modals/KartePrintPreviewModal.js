import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatJapanDate,formatTime,formatJapanMonth, getPrevMonthByJapanFormat, formatDateLine} from "~/helpers/date";
import Button from "../../../atoms/Button";
import ReactToPrint from "react-to-print";
import * as methods from "../DialMethods";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import axios from "axios";
import {makeList_code} from "~/helpers/dialConstants";

const Header = styled.div`
    font-size: 20px;
    display: block; text-align: center; 
    // position: fixed;
    // height:200px;
  // top: 0mm;
    // position: running(header);
    .border{border:solid 1px black !important;}
.border-left{border-left: solid 1px black !important;}
.border-right {border-right: solid 1px black !important;}
.border-top {border-top: solid 1px black !important;}
.border-bottom {border-bottom: solid 1px black !important;}
.flex{
    display: flex;
}
.header-title{
    text-align: center;
   .title{
    font-size: 40px;
   } 
   .month{
    float: right;
    margin-top: 30px;
   }
}
.w5{width:5%;}
.w10{width:10%;}
.w15{width:15%;}
.w20{width:20%;}
.w25{width:25%;}
.w30{width:30%;}
.pl5{padding-left: 5px;}
.padding{    align-items: center;
    display: flex;}
.circle{
    border: solid 1px black;
    border-radius: 50%;
    width: 30px;
    text-align: center;
    margin: auto;
    display: block;
}

//@media print {
//    div {display:none}    
//}
 `;
const Footer = styled.div`
    font-size: 25px;
    // position: fixed;
    display: block;
    text-align: right;
    // position: running(footer);
 `;

// const Body = styled.div`
//     height: 113vw;
//     .table-bordered th, .table-bordered td {
//     border: 1px solid #000000;
// }
//  `;
const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    margin-right: 2%;
    height: calc(100% - 40px);
    overflow-y: auto;
    float: left;
    padding: 20px;
    
    label {
        margin: 0;
    }
     .table-bordered th, .table-bordered td {
    border: 1px solid #000000;
}
    table {
    border-color: black important;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: center;
            input {
                margin: 0;
            }
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .table-check {
            width: 60px;
        }
        .table-content {
            width: 65%;
        }
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
 `;

 const Wraper = styled.div`
    .flex{
        display:flex;
    }
    .label-title{
        font-size: 15px;
        width: 35px;
        text-align: right;
        margin: 0;
        margin-right: 10px;
        margin-top: 2px;
        margin-left: 10px;
    }
         .table-bordered th, .table-bordered td {
    border: 1px solid #000000;
}
    .period_area{
        position:absolute;
        right:20px;
    }
    .react-datepicker-wrapper input{
        width:110px;
    }
 `;

const periodics = ["【臨時処方】", "【定期処方1】", "【定期処方2】", "【定期処方3】"];

class ComponentToPrint extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
        let karte_list = this.props.print_data;
        let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
        this.state={
            patientInfo,
            schedule_date,
            end_date:this.props.end_date,
            from_date:this.props.from_date,
            karte_list,
            facilityInfo:this.props.facilityInfo,

            examinationCodeData,
            examination_codes:makeList_code(examinationCodeData),
        }
    }

    componentDidMount() {        
        this.getKarteInfo();
        this.getDiease();
        this.getDiseases();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({            
            end_date:nextProps.end_date,
            from_date:nextProps.from_date,
            facilityInfo:nextProps.facilityInfo,
        }, () => {
            this.getKarteInfo();
        });
    }
    getKarteInfo = async() => {
        let path = "/app/api/v2/dial/board/Karte/search";
        await apiClient
            ._post(path, {
                params: {
                    is_enabled:1,
                    system_patient_id: this.state.patientInfo.system_patient_id,
                    from_date:formatDateLine(this.state.from_date),
                    end_date:formatDateLine(this.state.end_date),
                    blank_instruction: 1
                }
            })
            .then((res) => {
                this.setState({
                    karte_list:res['karte_list'],
                })

            })
            .catch(() => {

            });
    }
    getDiease = async () =>{
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
        let path = "/app/api/v2/dial/medicine_information/getDiseaseHistory";
        let post_data = {
            patient_id: patientInfo.system_patient_id,
            end_date: formatDateLine(this.state.end_date),
            get_last: 1
        };
        await axios.post(path, {params: post_data})
            .then((res) => {
                this.setState({
                    disease_history: res.data,
                });
                return res.data;
            })
            .catch(() => {
                return false;
            });
    }
    render() {
        let {patientInfo, schedule_date, karte_list, facilityInfo, disease_history } = this.state;
        return (
            <List>
                <Header>
                    {/*<h1>*/}
                    <div className={`header-title`}>
                        <span className={'title'}>診 療 経 過</span>
                        <span className={'month'}>{schedule_date!= null && formatJapanMonth(schedule_date)}</span>
                    </div>
                    <div className={`patient-info border flex`}>
                        <div className={'w5 border-right padding text-center pl5'}>診断</div>
                        <div className={`w30 border-right padding`}>
                            <div>{disease_history!=null?disease_history.name: ""}</div>
                            {/*<div>閉塞性尿路障害</div>*/}
                        </div>
                        <div className={`w5 border-right padding text-center pl5`}>氏名</div>
                        <div className={`w15 border-right padding`}>{patientInfo != null && patientInfo.patient_name}</div>
                        <div className={`w10 border-right text-center`}>
                            <div className={`border-bottom`}>年 齢</div>
                            <div >透析歴</div>
                        </div>
                        <div className={`w15 border-right`}>
                            <div className={`text-center border-bottom`}>{patientInfo != null && patientInfo.age}歳</div>
                            <div className={`text-center`}>1年7ヶ月</div>
                        </div>
                        <div className={`border-right w5 text-center`}>
                            <div className={`text-center`}><span className={patientInfo != null && patientInfo.gender === 1 && "circle"}>男</span></div>
                            <div className={`text-center`}><span className={patientInfo != null && patientInfo.gender === 2 && "circle"}>女</span></div>
                        </div>
                        <div className={`border-right w5 text-center padding`}>
                            確認
                        </div>
                        <div className={`w10 padding`}>
                            院長
                        </div>
                    </div>
                </Header>
                {/*<Body>*/}
                <table className="table-scroll table table-bordered" id="medical-record-table">
                    <thead>
                    <tr>
                        <th className="text-center">透析経過</th>
                        <th className="text-center">処置・検査・処方</th>
                    </tr>
                    </thead>
                    <tbody>
                    {karte_list !==undefined && karte_list !==null && (
                        Object.keys(karte_list).map((key) => {                            
                            let item =karte_list[key];
                            return (
                                <>
                                    <tr>
                                        <td className="title-td" style={{background:"lightblue"}}>
                                            {formatJapanDate(key)}
                                        </td>
                                        <td className="title-td">
                                            <span>透析実施</span>
                                            {item.karte.length==0 && (
                                                <span>(未実施)</span>
                                            )}
                                            {item.karte.length !=0 && this.state.staff_list_by_number !=undefined && (
                                                <>
                                                    <span>&nbsp;回診&nbsp;</span>
                                                    <span>{item.dial[0] != null && item.dial[0].created_by != null ? this.state.staff_list_by_number[item.dial[0].created_by] : ""}</span>
                                                    <span>
                                                        {item.dial[0] != null && item.dial[0].start_date != null ? formatTime(item.dial[0].start_date) : ""}
                                                        </span>
                                                    <span>&nbsp;{item.dial[0] != null && item.dial[0].start_date != null ? "~" : ""}&nbsp;</span>
                                                    <span>&nbsp;{item.dial[0] != null && item.dial[0].end_date != null ? formatTime(item.dial[0].end_date) : ""}&nbsp;</span>
                                                    <span>&nbsp;透析時間&nbsp;</span>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="title-td">
                                        {item.karte.length != 0 && (
                                            <>
                                                <span>
                                                    体重:{item.dial[0] != null && item.dial[0].weight_before != null ? item.dial[0].weight_before+ "kg" : "0kg⇒"}
                                                    {item.dial[0] != null && item.dial[0].weight_after != null ? item.dial[0].weight_after+ "kg" : "0kg"}
                                                </span>
                                                <span>
                                                    血圧:{item.dial[0] != null && item.dial[0].bp_pressure_max != null ? item.dial[0].bp_pressure_max: 0}/{item.dial[0] != null && item.dial[0].bp_pressure_min != null ? item.dial[0].bp_pressure_min:0}
                                                </span>
                                                {/* <span>⇒</span>
                                                <span>{item.dial[1] != null && item.dial[1].bp_pressure_max != null ? item.dial[1].bp_pressure_max: 0}/{item.dial[1] != null && item.dial[0].bp_pressure_min != null ? item.dial[1].bp_pressure_min: 0}</span> */}
                                            </>
                                        )}
                                        </td>
                                        <td/>
                                    </tr>
                                    {item.karte != null && item.karte['Drカルテ'] != null &&  item.karte['Drカルテ'] .length>0 && this.state.staff_list_by_number != undefined && (
                                        item.karte['Drカルテ'].map((karte_item)=>{
                                            return (
                                                <>
                                                    <tr>
                                                        <td >
                                                            <div>
                                                                {karte_item.category_2==='経過'? "【経過】":"【所見】"}
                                                                {this.state.staff_list_by_number[karte_item.created_by]}
                                                            </div>
                                                        </td>
                                                        <td/>
                                                    </tr>
                                                    <tr>
                                                        <td>{karte_item.body}</td>
                                                        <td/>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    )}
                                    {item.karte != null && item.karte['処置モニタ'] != null &&  item.karte['処置モニタ'] .length>0 && (                                                
                                        item.karte['処置モニタ'].map((soap_item)=>{
                                            return (
                                                <>
                                                    {soap_item.category_2==='O'|| soap_item.category_2==='S' && (
                                                        <>
                                                            <tr>
                                                                <td >
                                                                    {soap_item.body}
                                                                </td>
                                                                <td/>
                                                            </tr>
                                                        </>
                                                    )}
                                                </>
                                            )
                                        })
                                    )}
                                    {item.karte != null && item.karte['処置モニタ'] != null &&  item.karte['処置モニタ'] .length>0 && (
                                        item.karte['処置モニタ'].map((soap_item)=>{
                                            return (
                                                <>
                                                    {soap_item.category_2==='A'|| soap_item.category_2==='P' && (
                                                        <>
                                                            <tr>
                                                                <td/>
                                                                <td >
                                                                    {soap_item.body}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </>
                                            )
                                        })
                                    )}
                                    {item.manage != null && item.manage.length > 0 && (
                                        item.manage.map(manage_item => {
                                            return(
                                                <>
                                                    <tr>
                                                        <td/>
                                                        <td style = {{background:'antiquewhite', textAlign:'left'}} className = {manage_item.is_comment_requiered ==1 && manage_item.comment == null?"comment-required":""}>
                                                            <div>【管理料 指導料など】</div>
                                                            <div>{manage_item.name}</div>
                                                        </td>
                                                    </tr>
                                                </>
                                            )        
                                        })
                                    )}
                                    {item.presc != null && item.presc.length >0 && (
                                        item.presc.map((pres_item)=>{
                                            return (
                                                <>
                                                    <tr>
                                                        <td/>
                                                        <td>
                                                            {pres_item.regular_prescription_number != null && periodics[pres_item.regular_prescription_number]}
                                                        </td>
                                                    </tr>

                                                    {pres_item.data_json.length > 0 && pres_item.data_json.map((rp_item)=>{
                                                        return (
                                                            <>
                                                                {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item)=>{
                                                                    return (
                                                                        <>
                                                                            <tr>
                                                                                <td/>
                                                                                <td>
                                                                                    <span>{medi_item.item_name}</span>
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    )
                                                                })}
                                                                <tr>
                                                                    <td/>
                                                                    <td>
                                                                        <span>{rp_item.usage_name}</span>
                                                                        <span>{rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : ""}</span>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    })}
                                                </>
                                            )
                                        })
                                    )}
                                    {item.inspect != null && item.inspect.length >0 && this.state.examination_codes !== undefined && (
                                        item.inspect.map((pres_item)=>{
                                            return (
                                                <>
                                                    <tr>
                                                        <td/>
                                                        <td >
                                                            {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期検査】" :"【臨時検査】"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td/>
                                                        <td>
                                                            {pres_item.is_completed==1?"済) ":"未) "}{pres_item.examination_code != null && this.state.examination_codes[pres_item.examination_code]}
                                                        </td>
                                                    </tr>
                                               </>
                                            )
                                        })
                                    )}
                                    {item.inject != null && item.inject.length >0 && (
                                        item.inject.map((pres_item)=>{
                                            return (
                                                <>
                                                    <tr>
                                                        <td/>
                                                        <td >
                                                            {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期注射】" :"【臨時注射】"}
                                                        </td>
                                                    </tr>
                                                    {/*is_completed*/}
                                                    {pres_item.data_json!== null && pres_item.data_json.length>0 && (
                                                        pres_item.data_json.map(medicine=>{
                                                            return(
                                                                <>
                                                                    <tr>
                                                                        <td/>
                                                                        <td>{pres_item.is_completed==1?"済) ":"未) "}{medicine.item_name}</td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        })
                                                    )}
                                                </>
                                            )
                                        })
                                    )}
                                </>
                            )
                        })
                    )}
                    </tbody>
                </table>
                {/*</Body>*/}
                <Footer>
                    {facilityInfo != undefined && facilityInfo[0].medical_institution_name}
                </Footer>
            </List>
        );
    }
}

class KartePrintPreviewModal extends Component {
  constructor(props) {
    super(props);
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    this.state = {
        end_date:new Date(schedule_date),
        from_date:new Date(getPrevMonthByJapanFormat(schedule_date)),
    }
  }
    closeModal = () =>{
        this.props.closeModal();
    };

    setStartDate = (value) => {
        this.setState({from_date:value})        
    }

    setEndDate = (value) => {
        this.setState({end_date:value})
    }

  render() {
   // const { closeModal} = this.props;
      return  (
        <Modal show={true} onHide={this.closeModal.bind(this)} id="add_contact_dlg"  className="master-modal printer-modal">
          <Modal.Body>
              <Wraper>
                <div className="flex">
                    <Button onClick={this.closeModal.bind(this)} color="primary" style={{marginRight:'20px'}}>キャンセル</Button>
                    <ReactToPrint
                    trigger={() => (
                        <Button size="small" color="primary">
                            印刷
                        </Button>
                    )}
                    content={() => this.componentRef}
                    />
                    <div className="flex period_area">
                        <InputWithLabel
                            className="start_date"
                            label="期間"
                            type="date"
                            getInputText={this.setStartDate}
                            diseaseEditData={this.state.from_date}
                        />

                        <InputWithLabel
                            className="end_date"
                            label="~"
                            type="date"
                            getInputText={this.setEndDate}
                            diseaseEditData={this.state.end_date}
                        />
                    </div>                
                </div>
                
              </Wraper>
              <ComponentToPrint
                  ref={el => (this.componentRef = el)}
                  print_data={this.props.print_data}
                  facilityInfo = {this.props.facilityInfo}
                  from_date={this.state.from_date}
                  end_date={this.state.end_date}
              />
          </Modal.Body>
        </Modal>
    );
  }
}

KartePrintPreviewModal.contextType = Context;

KartePrintPreviewModal.propTypes = {
    print_data: PropTypes.object,
    closeModal: PropTypes.func,
    facilityInfo: PropTypes.array,
};
ComponentToPrint.propTypes = {
    print_data: PropTypes.object,
    closeModal: PropTypes.func,
    from_date:PropTypes.string,
    end_date:PropTypes.end_date,
    facilityInfo:PropTypes.array,
};

export default KartePrintPreviewModal;
