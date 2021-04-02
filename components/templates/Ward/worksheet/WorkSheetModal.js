import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
// import {formatDateLine, formatDateSlash} from "~/helpers/date";
import {formatDateLine, formatDateFull, formatJapanDateSlash} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
// import {formatDateLine} from "~/helpers/date";
// import Radiobox from "~/components/molecules/Radiobox";
import * as sessApi from "~/helpers/cacheSession-utils";
import Context from "~/helpers/configureStore";
import {HOSPITALIZE_PRESCRIPTION_TYPE, getInspectionName, CACHE_SESSIONNAMES} from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
registerLocale("ja", ja);

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 label {
   margin-bottom:0;
   height:2rem;
   line-height:2rem;
 }
 button {
  height: 2rem;
  font-size: 1rem;
  width: 5rem;
 }
 .prev-btn, .next-btn{
   margin-left: 2rem;
   width: 5rem;
 }
.select-period {
    .period-title {    
        line-height: 2rem;
        width: 70px;
        text-align: right;
        margin-right: 10px;
    }
    div {
        margin-top: 0;
    }
    input {
      width:7rem;
      height:2rem;
    }
    .from-to{
        padding-left:5px;                
        padding-right:5px;    
        line-height: 2rem;
    }
    .label-title {
        width: 0;
        margin: 0;
    }
}
.pullbox-select {
    height: 2rem;
    width: 10rem;
}
.pullbox {
    .label-title {
        width: 70px;
        text-align: right;
        line-height: 2rem;
        margin-right: 10px;
        font-size: 16px;
    }
}
.radio-area {
    label {
        line-height: 2rem;
        font-size: 14px;
        width: 10rem;
    }
    width:100%;
}
.table-title {
    margin-top: 0.5rem;
    label {
        margin-bottom: 0;
    }
    .table-name {
        border: 1px solid #aaa;
        width: 180px;
        text-align: center;
    }
    .table-color {
        width: 100px;
        text-align: center;
    }
    .table-request {
        width: 50px;
        text-align: center;
    }
    .table-ok {
        width: 50px;
        text-align: center;
        border: 1px solid #aaa;
    }
}

.table-area {
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
    
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      border: 1px solid #dee2e6;
      tr{
          width: calc(100% - 18px);
      }
    }
    tbody{
      height: 30vh;
      overflow-y: scroll;
      display:block;
      // tr:nth-child(even) {background-color: #f2f2f2;}
      // tr:hover{background-color:#e2e2e2;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }      
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
    .white-row:hover {background-color: #f2f2f2;}
    .purple-row {
      background-color: #A757A8;
      color:white;
    }
    .purple-row:hover {
      background-color: #f377f5;
      color:white;
    }
    .pink-row {
      background-color: #F8ABA6;
      color:white;
    }
    .pink-row:hover {
      background-color: #fb8078;
      color:white;
    }
}
// .selected {
//     background: rgb(105, 200, 225) !important;
// }
.react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}

.spinner-disease-loading{
  height: 20rem;
  overflow-y: auto;
  width: 100%;
}

.patient-name{
  width: "80px";
  line-height: 30px;
  margin-left: 10rem;
}
.patient-name-label{
  width: 10rem;
  border: 1px solid #aaa;
  margin-right: 3rem;
}
.button-group{
  float: right;
  button{
    margin-left: 10px;
  }
}
.user-css{
  width: 7rem;
  line-height: 2rem;
  padding-right: 0.5rem;
}
.user-content-css{
  width: 10rem;
  border: 1px solid #aaa;
  line-height: 2rem;
  margin-right: 20px;
  padding-left: 0.2rem;
}
.react-datepicker-wrapper{
  input{
    height: 30px;
  }
}
.patient-info-style{
  justify-content: space-between;
}
.display-content{
  justify-content: center;
  label{
    font-size: 1rem;
  }
}
.content-area{  
  height: 56vh;
  overflow-y: scroll;
  border: 1px solid #aaa;
}
.no-title{
  height: 60vh;
}

.page-show{
  position:absolute;
  margin-left: 7rem;
  margin-top: 0.5rem;
}
.order-block{
  border-top: 1px solid #aaa;
}
.order-header{
  border-bottom: 1px solid #ddd;
  padding-top: 5px;
  padding-left: 5px;
}
.order-content{
  padding-left: 5px;
}
`;

const SpinnerOtherWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

class WorkSheetModal extends Component {
  constructor(props) {
    super(props);  
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {   
      print_date: this.props.course_date != undefined && this.props.course_date != null && this.props.course_date != "" ? new Date(this.props.course_date) : new Date(),
      curPage: 1,
      departmentOptions,
      worksheetInfo: this.props.worksheetInfo ? this.props.worksheetInfo: null,
      instruction_content: this.props.worksheetInfo && this.props.worksheetInfo != null && this.props.worksheetInfo.instruction_content ? this.props.worksheetInfo.instruction_content : "",
      confirm_message:"",
      order_list: [],
      complete_message:"",
      isLoaded: false,
      alert_messages:"",
      confirm_type:"",            
    }
  }

  async componentDidMount() {    
    // await this.getInstructionInfo();

    // 実施場所
    // await this.getImplementLocationApi();

    // get patient's all order of a day.
    await this.getAllOrderInfo();
  }  

  // 未実施リスト's function reuse
  getAllOrderInfo =async()=>{
    // if(this.state.isLoaded){
    //   this.setState({isLoaded: false});
    // }
    let path = "/app/api/v2/order/get/not_done_list";
    let patient_id = this.props.patientId;
    if (this.props.type != "individual") {
      patient_id = this.props.selectedPatients[this.state.curPage - 1].patient_id;
    }
    let post_data = {
      classific_id: 0,// 機能分類 0:全て
      order_category_id: 0,// オーダー種類
      search_date:this.state.print_date !== '' ? formatDateLine(this.state.print_date) : '',
      start_date: '' ,
      no_date: 0,
      select_date_type:0,
      hospitalized_flag: 0,
      current_page: 1,
      // display_number: 20,
      get_type:'data',
      select_status: 1,
      patient_id: patient_id,
      worksheet_flag: 1
    };
        
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res && res.data != undefined && res.data != null && res.data.length > 0) {          
          this.setState({
            order_list: res.data,
            isLoaded: true
          });
        } else {
          this.setState({
            order_list: [],
            isLoaded: true
          });
        }
      })
      .catch(() => {
        this.setState({
          isLoaded: true
        });
      });
  }

  // getInstructionInfo = async () => {
  //   let path = "/app/api/v2/master/nurse/get_worksheet";
  //   let patient_info = this.props.selectedPatients[this.state.curPage - 1];
  //   let post_data = {
  //     patientId:patient_info.patient_id
  //   };
  //   await apiClient
  //     .post(path, {
  //       params: post_data
  //     })
  //     .then((res) => {
  //       if (res!= undefined && res != null && res.length>0){
  //         this.setState({
  //           worksheetInfo:res[0],
  //           instruction_content:res[0].instruction_content             
  //         });
  //       }        
  //     })
  //     .catch(() => {        
  //     });
  // }

  getDate = value => {  
    
    if (this.state.isLoaded == false) return;

    this.setState({
      print_date: value,      
      isLoaded: false
    },async()=>{
      await this.getAllOrderInfo();
    });
  }

  getPrevPatient = () => {
    if (this.props.type == "individual") return;
    if (this.state.curPage <= 1) return;
    this.setState({
      curPage: this.state.curPage - 1
    },async()=>{
      await this.getAllOrderInfo();
    });
  }

  getNextPatient = () => {
    if (this.props.type == "individual") return;
    if (this.state.curPage >= this.props.selectedPatients.length) return;
    this.setState({
      curPage: this.state.curPage + 1
    },async()=>{
      await this.getAllOrderInfo();
    });
  }

  getDepartmentName = (id) => {    
    let result = "";
    this.state.departmentOptions.map(item=>{
      if (item.id == id) {
        result = item.value
      }
    });

    return result;
  }

  saveWorkSheetAndPrint = async () => {
    // save problem      
    let path = "/app/api/v2/master/nurse/save_worksheet";    
    if (this.state.worksheetInfo != null) {      
      if (this.props.type == "individual") {
        let post_data = {
          patient_id:this.props.patientId,
          work_sheet_id:this.state.worksheetInfo.number,
          print_date:formatDateFull(this.state.print_date, "-"),
          instruction_content:this.state.instruction_content,
          is_enabled:1,
        };
        await apiClient
          ._post(path, {
            params: post_data
          })
          .then((res) => {
            // suucess
            if (res.alert_message == "success") {            
              // count ++;
            }
          })
          .catch((err) => {
            if (err.response.data) {
              // const { error_messages } = err.response.data;
              // error_msg = error_messages;
            }
            // return false;
          });
      } else {            
        // for (let i = 0; i < this.props.selectedPatients.length; i ++) {
          // let patient_info = this.props.selectedPatients[i];
          let patient_info = this.getCurrentPatientInfo();
          let post_data = {
            patient_id:patient_info.patient_id,
            work_sheet_id:this.state.worksheetInfo.number,
            print_date:formatDateFull(this.state.print_date, "-"),
            instruction_content:this.state.instruction_content,
            is_enabled:1,
          };
          await apiClient
            ._post(path, {
              params: post_data
            })
            .then((res) => {
              // suucess
              if (res.alert_message == "success") {            
                // count ++;
              }
            })
            .catch((err) => {
              if (err.response.data) {
                // const { error_messages } = err.response.data;
                // error_msg = error_messages;
              }
              // return false;
            });
        // }
      } 
    }  


    // print
    await this.printWorkSheet();

    // this.props.closeModal(); 
  }

  printWorkSheet = () => {
    // if(this.state.problem_list.length > 0){
      this.setState({
        confirm_message:"印刷しますか？",
        confirm_type: "print"
      });
    // }
  }

  closeConfirmModal = () =>{
    this.setState({      
      confirm_message:"",
      confirm_type:"",      
      alert_messages:"",      
    });    
  };

  get_title_pdf = () => {        
    let _post_patient_info = this.getCurrentPatientInfo();
    
    let print_date = this.state.print_date !== '' ? formatDateLine(this.state.print_date) : formatDateLine(new Date());
    print_date = print_date.split('-').join('')
    
    let patientd_id = "";
    if (this.props.type == "individual") {
      patientd_id = _post_patient_info.receId;
    } else {
      patientd_id = _post_patient_info.patientInfo.receId
    }
    
    let pdf_file_name = "個人看護ワークシート_" + print_date + "_" + patientd_id + ".pdf";
    return pdf_file_name;
  }

  confirmPrint = () => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/master/nurse/worksheet/worksheet_print";
    let print_data = {};
    let _post_patient_info = this.getCurrentPatientInfo();
    if (this.props.type == "individual") {
      _post_patient_info.patient_number = _post_patient_info.receId;      
      _post_patient_info.patient_name = _post_patient_info.name;      
      _post_patient_info.patient_name_kana = _post_patient_info.kana;      
      _post_patient_info.gender = _post_patient_info.sex;      
      _post_patient_info.department_id = this.context.department.code == 0 ? 1 : this.context.department.code;
      _post_patient_info.department_name = this.context.department.name !== "" ? this.context.department.name : "内科";

    }    
    print_data.table_data = this.state.instruction_content;    
    print_data.patient_info = _post_patient_info;
    print_data.print_date = this.state.print_date;
    print_data.order_data = this.state.order_list;

    let pdf_file_name = this.get_title_pdf();
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }

  getCurrentPatientInfo = () => {
    let cur_patient_info = {};
    if (this.props.type == "individual") {
      cur_patient_info = this.props.selectedPatients;
    } else {
      cur_patient_info = this.props.selectedPatients[this.state.curPage - 1];
    }

    return cur_patient_info;
  }

  // getImplementLocationApi = async () => {
  //   let path = "/app/api/v2/order/prescription/getImplementLocation";
  //   let post_data = {
  //     patient_id: this.props.patientId
  //   };
  //   await apiClient._post(path,
  //     {params: post_data})
  //     .then((res) => {
  //       if (res) {
  //         console.log("res", res);
  //         // let treat_location = [{id:0,value:""}];
  //         // if (res.treat_location != null && res.treat_location.length > 0){
  //         //   res.treat_location.map(item=>{
  //         //     treat_location.push({id:item.location_id, value: item.name})
  //         //   });

  //         //   // YJ419 入院患者の処置や注射は、病棟に応じた実施場所が初期選択されるように
  //         //   if (res.treat_init_location != undefined && res.treat_init_location != null && this.context.karte_status != undefined && this.context.karte_status.name == "入院") {
  //         //     this.modal_obj.location_id = res.treat_init_location;
  //         //   }
  //         // }
  //         // this.modal_obj.implement_location = treat_location;
  //       }
  //     })
  //     .catch(() => {
  //     });
  // }

  render() {
    let cur_patient_info = this.getCurrentPatientInfo();      
    let _gender = this.props.type == "individual"? cur_patient_info.sex : cur_patient_info.gender;
    let start_place_array = {1:"ベッドサイドより", 2:"リハ医療室にて", 3:"院内にて", 4:"院外にて"};
    let disease_type_array = {1:"急性", 2:"慢性"};

    // K142 ワークシート 種類選択無しモードの追加
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let nursing_worksheet_mode_selectable = "ON";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
     if(initState.conf_data.nursing_worksheet_mode_selectable !== undefined){
       nursing_worksheet_mode_selectable = initState.conf_data.nursing_worksheet_mode_selectable;
     }     
    }

    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>個人看護ワークシート</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {nursing_worksheet_mode_selectable == "ON" && this.state.worksheetInfo != null && (
                  <div className={'flex'} style={{marginBottom:"2rem"}}>
                    {this.state.worksheetInfo.name ? this.state.worksheetInfo.name : ""}
                  </div>
                )}
                <div className={'flex'} style={{marginBottom:"1rem"}}>
                  <div className="user-css">印刷日</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.print_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText={"年/月/日"}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
                <div className={'flex'} style={{marginBottom:"0.5rem"}}>
                  <div className="user-css">患者ＩＤ</div>
                  <div className="user-content-css">{this.props.type == "individual" ? cur_patient_info.receId : cur_patient_info.patient_number}</div>
                  <div className="user-css">患者氏名</div>
                  <div className="user-content-css" style={{width:"14rem"}}>{this.props.type == "individual" ? cur_patient_info.name : cur_patient_info.patient_name}</div>
                  <div className="user-css">患者カナ氏名</div>
                  <div className="user-content-css" style={{width:"14rem"}}>{this.props.type == "individual" ? cur_patient_info.kana : cur_patient_info.patient_name_kana}</div>
                </div>
                <div className={'flex patient-info-style'} style={{marginBottom:"2rem"}}>
                  <div className={'flex'}>
                    <div className="user-css">年齢</div>
                    <div className="user-content-css">{cur_patient_info.age}歳{cur_patient_info.age_month}ヶ月</div>
                    <div className="user-css">性別</div>
                    <div className="user-content-css" style={{width:"4rem"}}>{_gender == 2 ? "女性": "男性"}</div>
                    <div className="user-css" style={{width:"4rem"}}>血液型</div>
                    <div className="user-content-css" style={{width:"4rem"}}>{cur_patient_info.blood_type ? cur_patient_info.blood_type : ""}</div>
                    <div className="user-css">診療科</div>
                    <div className="user-content-css" style={{width:"12rem"}}>{this.props.type == "individual" ? this.context.department.name !== "" ? this.context.department.name : "内科" : this.getDepartmentName(cur_patient_info.department_id)}</div>
                  </div>
                  <div>
                    <div className={'flex'}>     
                      <Button type="common" className={'prev-btn'} onClick={this.getPrevPatient}>前項</Button>                           
                      <Button type="common" className={'next-btn'} onClick={this.getNextPatient}>次項</Button>                                                                                           
                    </div>                
                    {this.props.selectedPatients.length > 1 && (
                      <div className={'flex page-show'}>                                
                        ({this.state.curPage}/{this.props.selectedPatients.length})
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={'flex display-content'}>
                  <label>指示内容</label>                
                </div>              
                <div className={nursing_worksheet_mode_selectable != "ON" ? 'content-area no-title' : 'content-area'}>
                  {this.state.isLoaded == false ? (
                    <div className='spinner-disease-loading center'>
                      <SpinnerOtherWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerOtherWrapper>
                    </div>
                  ):(
                    <>                    
                  <div style={{paddingLeft:"5px"}}>
                    {this.state.instruction_content ? this.state.instruction_content : ""}
                  </div>                
                  {this.state.order_list.length > 0 && (
                    <>
                      {this.state.order_list.map(order=>{
                        // 処方、注射、生体検査、放射線、内視鏡
                        let karte_status_name = "外来・";
                        if (order.karte_status != undefined && order.karte_status != null) {
                          karte_status_name = order.karte_status == 1 ? "外来・" : order.karte_status == 2 ? "訪問診療・" : order.karte_status == 3 ? "入院・" : "";
                        }
                        // 伝票名 -- 画面.伝票名には、カルテの【】に記載されている内容
                        let category_title = '';
                        if(order.category === '注射'){
                          category_title = karte_status_name + "注射";
                        } else if(order.category === '処方'){
                          let prescription_category = order.order_data.is_internal_prescription == 0?"院外" : "院内";
                          if(order.karte_status == 3) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[order.order_data.is_internal_prescription].value
                          category_title = karte_status_name + prescription_category;
                          category_title += '処方';
                        } else if(order.category === '検査' && (order.sub_category === 'オーダー' || order.sub_category === '細胞診検査' ||
                          order.sub_category === '病理検査' || order.sub_category === '細菌検査')){
                          let order_title = '検体検査';
                          if (order.sub_category == "細胞診検査") order_title = "細胞診検査";
                          else if (order.sub_category == "病理検査") order_title = "病理組織検査";
                          else if (order.sub_category == "細菌検査") order_title = "細菌・抗酸菌検査";
                          category_title = karte_status_name + order_title;
                        } else if(order.category === '入院' && (order.sub_category === '退院実施' || order.sub_category === '退院決定' || order.sub_category === '退院許可' || order.sub_category === '転棟・転室実施')){
                          category_title = karte_status_name + order.sub_category;
                        } else if(order.category === 'リハビリ'){
                          category_title = karte_status_name + order.category;
                        } else if(order.category =='放射線'){
                          category_title = karte_status_name + '放射線 '+ ' ' + order.sub_category;
                        } else if(order.category =='放射線'){
                          category_title = karte_status_name + order != null && order.order_data.order_data.inspection_id != null && order.order_data.order_data.inspection_id != undefined ? getInspectionName(order.order_data.order_data.inspection_id) : "生理";
                        } else if(order.category =='生理検査' || order.category =='内視鏡検査'){
                          category_title = karte_status_name + '生理検査 '+ ' ' + order.sub_category;
                        } else if(order.category =='処置'){
                          category_title = order.karte_status == 3 ? "入院処置" : order.karte_status === 2 ? "在宅処置" : "外来処置";                        
                        } else if(order.category == "nurse_instruction"){
                          category_title = "看護指示";
                        }

                        if (category_title != "") {
                          category_title = "【"+category_title+"】";
                        }

                        return (
                          <>
                            {order.category != undefined && order.category != null && order.category == "処方" && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    {category_title}
                                  </div>
                                  <div className="order-content">
                                    {order.order_data.order_data.map(ele=>{
                                      return (
                                        <>
                                          {ele.med.length > 0 && ele.med.map(child=>{
                                            return(
                                              <>                                                  
                                                <div>薬剤：{child.item_name} {child.amount + child.unit}</div>
                                              </>
                                            );
                                          })}
                                          {ele.usage_name != "" && (
                                            <div>用法：{ele.usage_name}</div>
                                          )}                                            
                                          {ele.body_part != "" && (
                                            <div>部位/補足：{ele.body_part}</div>
                                          )}                                                                        
                                        </>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && order.category == "注射" && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    {category_title}
                                  </div>
                                  <div className="order-content">
                                    {order.order_data.location_name != "" && (                                
                                      <div>実施場所：{order.order_data.location_name}</div>
                                    )}
                                    {order.order_data.drip_rate != "" && (                                
                                      <div>点滴速度：{order.order_data.drip_rate}ml/h</div>
                                    )}
                                    {order.order_data.water_bubble != "" && (                                
                                      <div>1分あたり：{order.order_data.water_bubble}滴</div>
                                    )}
                                    {order.order_data.exchange_cycle != "" && (                                
                                      <div>交換サイクル：{order.order_data.exchange_cycle}時間</div>
                                    )}
                                    {order.order_data.require_time != "" && (                                
                                      <div>所要時間：{order.order_data.require_time}時間</div>
                                    )}
                                    {order.order_data.free_comment != "" && order.order_data.free_comment.length > 0 && order.order_data.free_comment[0] != null && order.order_data.free_comment[0] != "" && (                                
                                      <div>備考：{order.order_data.free_comment[0]}</div>
                                    )}                                      
                                    {order.order_data.order_data.map(ele=>{
                                      let is_period_injection = 0;
                                      if (order.order_data.is_completed != undefined && order.order_data.is_completed == 4) {
                                        is_period_injection = 1;
                                      }
                                      let schedule_date_time = "";
                                      if(order.order_data.schedule_date !== null && order.order_data.schedule_date !== undefined && order.order_data.schedule_date != "" && order.order_data.is_completed == 4 && order.cnt_index != undefined) {
                                        schedule_date_time = formatJapanDateSlash(order.order_data.schedule_date);                                      
                                        if (ele.done_numbers[order.order_data.schedule_date][order.cnt_index].time != "") {
                                          schedule_date_time = schedule_date_time + " " + ele.done_numbers[order.order_data.schedule_date][order.cnt_index].time;
                                        } else {
                                          schedule_date_time = schedule_date_time + " 未定";
                                        }
                                      }
                                      return (
                                        <>
                                          {ele.usage_name != "" && (
                                            <div>手技：{ele.usage_name}</div>
                                          )}                                            
                                          {ele.body_part != "" && (
                                            <div>部位/補足：{ele.body_part}</div>
                                          )}                                                                        
                                          {ele.med.length > 0 && ele.med.map(child=>{
                                            return(
                                              <>                                                  
                                                <div>薬剤：{child.item_name} {child.amount + child.unit}</div>                                                                                                    
                                              </>
                                            );
                                          })}
                                          {is_period_injection == 1 && schedule_date_time != "" && (
                                            <div>実施予定時刻: {schedule_date_time}</div>
                                          )}
                                        </>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && order.category == "生体検査" && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    {category_title}
                                  </div>
                                  <div className="order-content">
                                  </div>
                                </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && order.category == "放射線" && (
                              <>
                              <div className="order-block">
                                <div className="order-header">
                                  {category_title}
                                </div>
                                <div className="order-content">
                                  <div>
                                    {order.order_data.order_data.portable_shoot != undefined && order.order_data.order_data.portable_shoot != null && order.order_data.order_data.portable_shoot != "" && (
                                      <>
                                        <div>撮影: ポータブル</div>
                                      </>
                                    )}
                                  </div>
                                  {order.order_data.order_data.radiation_data != undefined && order.order_data.order_data.radiation_data != null && order.order_data.order_data.radiation_data.length>0 &&(
                                    order.order_data.order_data.radiation_data.map(item => {
                                      return(
                                        <>
                                          <div className="flex">                                        
                                            {item.classfic_name != "" && (
                                              <div>撮影区分 : {item.classfic_name}&nbsp;</div>
                                            )}
                                            {item.part_name != "" && (                                            
                                              <div style={{paddingLeft:"1rem"}}>部位: {item.part_name}&nbsp;</div>
                                            )}
                                            {item.left_right_name != "" && (                                                                                        
                                              <div style={{paddingLeft:"1rem"}}>左右: {item.left_right_name}&nbsp;</div>
                                            )}
                                            <div>                                            
                                              {Object.keys(item.selected_directions).length > 0 && Object.keys(item.selected_directions).map((ele_key, index)=>{
                                                return(
                                                  <>
                                                  <span>{index == 0 ? ' 方向: ':' '}</span>
                                                  <span>{item.selected_directions[ele_key]}&nbsp;</span>
                                                  </>
                                                )}
                                              )}
                                            </div>
                                            {item.method_name != undefined && item.method_name != '' && (
                                              <div>撮影体位/方法: {item.method_name}&nbsp;</div>
                                            )}
                                            <div>                                            
                                              {Object.keys(item.selected_comments).length > 0 && Object.keys(item.selected_comments).map((ele_key, index)=>{
                                                return(
                                                  <>
                                                  <span>{index == 0 ? ' 撮影コメント: ':' '}</span>
                                                  <span>{item.selected_comments[ele_key]}&nbsp;</span>
                                                  </>
                                                )
                                              })}                                            
                                            </div>                                        
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {order.done_order == 1 && order.order_data.order_data.done_comment != undefined && order.order_data.order_data.done_comment != null && order.order_data.order_data.done_comment != "" && (
                                    <>
                                      <div>実施コメント: {order.order_data.order_data.done_comment}</div>
                                    </>
                                  )}
                                  {order.done_order == 1 && order.order_data.order_data.shoot_done_user != undefined && order.order_data.order_data.shoot_done_user != null && order.order_data.order_data.shoot_done_user != "" && (
                                    <>
                                      <div>撮影実施者: {order.order_data.order_data.shoot_done_user}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.height != undefined && order.order_data.order_data.height != null && order.order_data.order_data.height != "" && (
                                    <>
                                      <div>身長: {order.order_data.order_data.height} cm</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.weight != undefined && order.order_data.order_data.weight != null && order.order_data.order_data.weight != "" && (
                                    <>
                                      <div>体重: {order.order_data.order_data.weight} kg</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.surface_area != undefined && order.order_data.order_data.surface_area != null && order.order_data.order_data.surface_area != "" && (
                                    <>
                                      <div>体表面積: {order.order_data.order_data.surface_area} ㎡</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.sick_name != undefined && order.order_data.order_data.sick_name != null && order.order_data.order_data.sick_name != "" && (
                                    <>
                                      <div>臨床診断、病名: {order.order_data.order_data.sick_name}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.etc_comment != undefined && order.order_data.order_data.etc_comment != null && order.order_data.order_data.etc_comment != "" && (
                                    <>
                                      <div>主訴、臨床経過 検査目的、コメント: {order.order_data.order_data.etc_comment}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.request_comment != undefined && order.order_data.order_data.request_comment != null && order.order_data.order_data.request_comment != "" && (
                                    <>
                                      <div>依頼コメント: {order.order_data.order_data.request_comment}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.pregnancy != undefined && order.order_data.order_data.pregnancy != null && order.order_data.order_data.pregnancy != "" && (
                                    <>
                                      <div>妊娠: {order.order_data.order_data.pregnancy}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.film_output != undefined && order.order_data.order_data.film_output != null && order.order_data.order_data.film_output != "" && (
                                    <>
                                      <div>フィルム出力: {order.order_data.order_data.film_output}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.filmsend != undefined && order.order_data.order_data.filmsend != null && order.order_data.order_data.filmsend != "" && (
                                    <>
                                      <div>フィルム搬送先: {order.order_data.order_data.filmsend}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.kind != undefined && order.order_data.order_data.kind != null && order.order_data.order_data.kind != "" && (
                                    <>
                                      <div>区分: {order.order_data.order_data.kind}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.move != undefined && order.order_data.order_data.move != null && order.order_data.order_data.move != "" && (
                                    <>
                                      <div>移動形態: {order.order_data.order_data.move}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.use != undefined && order.order_data.order_data.use != null && order.order_data.order_data.use != "" && order.order_data.order_data.use != "使用しない" && (
                                    <>
                                      <div>造影剤使用: {order.order_data.order_data.use}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.inquiry != undefined && order.order_data.order_data.inquiry != null && order.order_data.order_data.inquiry != "" && (
                                    <>
                                      <div>造影剤問診票: {order.order_data.order_data.inquiry}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.selected_instructions != undefined && order.order_data.order_data.selected_instructions != null && order.order_data.order_data.selected_instructions.length > 0 && (
                                    <>
                                      <div>撮影指示:                                    
                                      {order.order_data.order_data.selected_instructions.map(item_ele=>{
                                        return(
                                          <><div>{item_ele.name}</div></>
                                        );                                      
                                      })}
                                      </div>
                                    </>
                                  )}
                                  {order.order_data.order_data.selected_shootings != undefined && order.order_data.order_data.selected_shootings != null && order.order_data.order_data.selected_shootings.length > 0 && (
                                    <>
                                      <div>撮影:
                                      {order.order_data.order_data.selected_shootings.map(item_ele=>{
                                        return(
                                          <><div>{item_ele.name}</div></>
                                        );                                      
                                      })}
                                      </div>
                                    </>
                                  )}
                                  {order.order_data.order_data.other_kind != undefined && order.order_data.order_data.other_kind != null && (
                                    <>
                                      <div>分類: {order.order_data.order_data.other_kind.name}</div>
                                    </>
                                  )}
                                  {order.order_data.order_data.other_kind_detail != undefined && order.order_data.order_data.other_kind_detail != null && (
                                    <>
                                      <div>分類詳細: {order.order_data.order_data.other_kind_detail.name}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.other_body_part != undefined && order.order_data.order_data.other_body_part != null && (
                                    <>
                                      <div>部位: {order.order_data.order_data.other_body_part}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.free_comment != undefined && order.order_data.order_data.free_comment != null && (
                                    <>
                                      <div>フリーコメント: {order.order_data.order_data.free_comment}</div>                                    
                                    </>
                                  )}
                                  {order.order_data.order_data.additions != undefined && order.order_data.order_data.additions != null && order.order_data.order_data.additions.length > 0 && (
                                    <>
                                      <div>追加項目:
                                      {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                        return(
                                          <>
                                            <div>{order.order_data.order_data.additions[addition_id].name}</div>
                                          </>
                                        );
                                      })}
                                      </div>
                                    </>
                                  )}
                                  {order.order_data.order_data.done_order ==1 && order.order_data.order_data.obtain_tech != undefined && order.order_data.order_data.obtain_tech != null && order.order_data.order_data.obtain_tech != "" && (
                                    <>
                                      <div>造影剤注入手技: {order.order_data.order_data.obtain_tech}</div>                                    
                                    </>
                                  )}                                
                                </div>
                              </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && (order.category == "内視鏡検査" || order.category == "生理検査") && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    {category_title}
                                  </div>
                                  <div className="order-content">
                                    
                                    {order.order_data.order_data.classification1_name != undefined && order.order_data.order_data.classification1_name != null && order.order_data.order_data.classification1_name != "" && (
                                      <>
                                        <div>検査種別: {order.order_data.order_data.classification1_name}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.classification2_name != undefined && order.order_data.order_data.classification2_name != null && order.order_data.order_data.classification2_name != "" && (
                                      <>
                                        <div>検査詳細: {order.order_data.order_data.classification2_name}</div>                                      
                                      </>
                                    )}     
                                    {order.order_data.order_data.inspection_type_name != undefined && order.order_data.order_data.inspection_type_name != null && order.order_data.order_data.inspection_type_name != "" && (
                                      <>
                                        <div>検査種別: {order.order_data.order_data.inspection_type_name}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_item_name != undefined && order.order_data.order_data.inspection_item_name != null && order.order_data.order_data.inspection_item_name != "" && (
                                      <>
                                        <div>検査項目: {order.order_data.order_data.inspection_item_name}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.endoscope_purpose_name != undefined && order.order_data.order_data.endoscope_purpose_name != null && order.order_data.order_data.endoscope_purpose_name != "" && (
                                      <>
                                        <div>検査目的: {order.order_data.order_data.endoscope_purpose_name}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_purpose != undefined && order.order_data.order_data.inspection_purpose.length > 0 && order.order_data.order_data.inspection_purpose.map(item=>{
                                      return(
                                        <>
                                          <div>検査目的: {item.name}</div>
                                        </>
                                      );                                    
                                    })}

                                    {order.order_data.order_data.inspection_symptom != undefined && order.order_data.order_data.inspection_symptom != null && order.order_data.order_data.inspection_symptom.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.inspection_symptom.map(item=>{
                                          return (
                                            <>
                                              <div>現症: {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_risk != undefined && order.order_data.order_data.inspection_risk != null && order.order_data.order_data.inspection_risk.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.inspection_risk.map(item=>{
                                          return (
                                            <>
                                              <div>冠危険因子: {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_sick != undefined && order.order_data.order_data.inspection_sick != null && order.order_data.order_data.inspection_sick.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.inspection_sick.map(item=>{
                                          return (
                                            <>
                                              <div>{item.title} : {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_request != undefined && order.order_data.order_data.inspection_request != null && order.order_data.order_data.inspection_request.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.inspection_request.map(item=>{
                                          return (
                                            <>
                                              <div>{item.title} : {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.is_anesthesia != undefined && order.order_data.order_data.is_anesthesia != null && order.order_data.order_data.is_anesthesia.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.is_anesthesia.map(item=>{
                                          return (
                                            <>
                                              <div>{item.title} : {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.is_sedation != undefined && order.order_data.order_data.is_sedation != null && order.order_data.order_data.is_sedation.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.is_sedation.map(item=>{
                                          return (
                                            <>
                                              <div>{item.title} : {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_movement != undefined && order.order_data.order_data.inspection_movement != null && order.order_data.order_data.inspection_movement.length > 0 && (
                                      <>                                        
                                        {order.order_data.order_data.inspection_movement.map(item=>{
                                          return (
                                            <>
                                              <div>患者移動形態: {item.name}</div>
                                            </>
                                          );                                        
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.height != undefined && order.order_data.order_data.height != null && order.order_data.order_data.height != "" && (
                                      <>
                                        <div>身長: {order.order_data.order_data.height} cm</div>
                                      </>
                                    )} 
                                    {order.order_data.order_data.weight != undefined && order.order_data.order_data.weight != null && order.order_data.order_data.weight != "" && (
                                      <>
                                        <div>体重: {order.order_data.order_data.weight} kg</div>                                      
                                      </>
                                    )} 
                                    {order.order_data.order_data.surface_area != undefined && order.order_data.order_data.surface_area != null && order.order_data.order_data.surface_area != "" && (
                                      <>
                                        <div>体表面積: {order.order_data.order_data.surface_area} ㎡</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.connection_date_title != undefined && (
                                      <>
                                        <div>{order.order_data.order_data.connection_date_title} : {formatJapanDateSlash(order.order_data.order_data.calculation_start_date)}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.sick_name != undefined && order.order_data.order_data.sick_name != null && order.order_data.order_data.sick_name != "" && (
                                      <>
                                        <div>臨床診断、病名: {order.order_data.order_data.sick_name}</div>
                                      </>                                      
                                    )}
                                    {order.order_data.order_data.etc_comment != undefined && order.order_data.order_data.etc_comment != null && order.order_data.order_data.etc_comment != "" && (
                                      <>
                                        <div>主訴、臨床経過 検査目的、コメント: {order.order_data.order_data.etc_comment}</div>                                      
                                      </>                                       
                                    )}
                                    {order.order_data.order_data.special_presentation != undefined && order.order_data.order_data.special_presentation != "" && (
                                      <>
                                        <div>特殊指示: {order.order_data.order_data.special_presentation}</div>                                                                            
                                      </>                                      
                                    )}
                                    {order.order_data.order_data.count != undefined && order.order_data.order_data.count != "" && (
                                      <>                                      
                                        <div>{order.order_data.order_data.count_label !=''?order.order_data.order_data.count_label:''} :  {order.order_data.order_data.count_suffix!=''?order.order_data.order_data.count_suffix:''}</div>                                      
                                      </>                                      
                                    )}
                                    {order.order_data.order_data.body_part != undefined && order.order_data.order_data.body_part != null && order.order_data.order_data.body_part != "" && (
                                      <>
                                        <div>部位指定コメント: {order.order_data.order_data.body_part}</div>
                                      </>                                      
                                    )}
                                    {order.state == 2 && order.order_data.order_data.done_comment != undefined && order.order_data.order_data.done_comment != null && order.order_data.order_data.done_comment != "" && (
                                      <>
                                        <div>実施コメント: {order.order_data.order_data.done_comment}</div>                                      
                                      </>                                      
                                    )}
                                    {order.order_data.order_data.additions != undefined && Object.keys(order.order_data.order_data.additions).length > 0 && (
                                      <>
                                        <div>追加指示等:
                                        {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                          return (
                                            <>
                                              <div>{order.order_data.order_data.additions[addition_id].name}</div>                                            
                                            </>
                                          );
                                        })}
                                        </div>
                                      </>                                      
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && order.category == "リハビリ" && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    {category_title}
                                  </div>
                                  <div className="order-content">
                                    {order.order_data.order_data.start_place !== undefined && order.order_data.order_data.start_place != null && order.order_data.order_data.start_place !== "" && (
                                      <>
                                        <div>開始希望場所: {order.order_data.order_data.start_place !== undefined && order.order_data.order_data.start_place != null && order.order_data.order_data.start_place !== "" ? start_place_array[order.order_data.order_data.start_place] : ""}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.disease_type !== undefined && order.order_data.order_data.disease_type != null && order.order_data.order_data.disease_type !== "" && (
                                      <>
                                        <div>リハビリ直告病患: {order.order_data.order_data.disease_type !== undefined && order.order_data.order_data.disease_type != null && order.order_data.order_data.disease_type !== "" ? disease_type_array[order.order_data.order_data.disease_type] : ""}</div>                                      
                                      </>
                                    )}
                                    {order.order_data.order_data.detail != undefined && Object.keys(order.order_data.order_data.detail).map(item => {
                                      let detail_tab_item = order.order_data.order_data.detail[item];
                                        return(
                                          detail_tab_item.map(detail_item=>{
                                            return (                                            
                                                <>
                                                  {detail_item.therapy_item1_name != undefined && detail_item.therapy_item1_name != "" && (
                                                    <div>
                                                      療法項目１:{detail_item.therapy_item1_name}
                                                    </div>                                        
                                                  )}
                                                  {detail_item.therapy_item2_name != undefined && detail_item.therapy_item2_name != "" && (
                                                    <div>
                                                      {"療法項目２:" + detail_item.therapy_item2_name+(detail_item.therapy_item2_amount != undefined && detail_item.therapy_item2_amount != '' ? 
                                                          " " + detail_item.therapy_item2_amount + detail_item.therapy_item2_unit:"")}                                              
                                                    </div>                                        
                                                  )}
                                                  {detail_item.position1_name != undefined && detail_item.position1_name != "" && (
                                                    <div>
                                                      {"部位1:" + detail_item.position1_name}
                                                    </div>                                        
                                                  )}

                                                  {detail_item.position2_name != undefined && detail_item.position2_name != "" && (
                                                    <div>
                                                      {"部位2:" + detail_item.position2_name}
                                                    </div>                                        
                                                  )}                                              
                                              </>
                                            )
                                          })
                                        )
                                      })}                                                                        
                                  </div>
                                </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && (order.category == "汎用オーダー" || order.category === '管理・指導') && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    【汎用オーダー】
                                  </div>
                                  <div className="order-content">
                                    {order.order_data.order_data.karte_description_name !== undefined && order.order_data.order_data.karte_description_name != null && order.order_data.order_data.karte_description_name !="" && (                                    
                                      <div>
                                        カルテ記述名称: {order.order_data.order_data.karte_description_name}                                        
                                      </div>
                                    )}
                                    {order.order_data.order_data.additions !== undefined && order.order_data.order_data.additions != null && Object.keys(order.order_data.order_data.additions).length > 0 && (
                                      <div>
                                        追加指示等:                                      
                                        <div>
                                          {Object.keys(order.order_data.order_data.additions).map(addition=>{
                                            return(
                                              <>
                                              <div>
                                                {order.order_data.order_data.additions[addition].name}
                                              </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    {order.order_data.order_data.karte_text_data !== undefined && order.order_data.order_data.karte_text_data != null && order.order_data.order_data.karte_text_data.length > 0 && (
                                      <div>                                      
                                        カルテ記述内容:                                      
                                        <div>
                                          {order.order_data.order_data.karte_text_data.map(karte_text=>{
                                            return(
                                              <>
                                              <div>
                                                {karte_text.karte_text}
                                              </div>
                                              </>
                                            )
                                          })}                                        
                                        </div>
                                      </div>
                                    )}
                                    {(order.order_data.order_data.comment !== undefined && order.order_data.order_data.comment != null && order.order_data.order_data.comment != "") && (
                                      <div>
                                        コメント:{order.order_data.order_data.comment}                                      
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                            {order.category != undefined && order.category != null && order.category == "処置" && (
                              <>
                                <div className="order-block">
                                  <div className="order-header">
                                    {category_title}
                                  </div>
                                  <div className="order-content">
                                    {order.order_data.order_data.detail != undefined && order.order_data.order_data.detail.map(item => {
                                        return(
                                          <>                                          
                                            {item.classification_name != undefined && item.classification_name != "" && (
                                              <div>
                                                {"分類:" + item.classification_name}
                                              </div>
                                            )}
                                            {item.practice_name != undefined && item.practice_name != "" && (
                                              <div>
                                                {"行為名:" + item.practice_name}
                                              </div>
                                            )}
                                            {item.request_name != undefined && item.request_name != "" && (
                                              <div>
                                                {"請求情報:" + item.request_name}
                                              </div>
                                            )}
                                            {item.position_name != undefined && item.position_name != "" && (
                                              <div>
                                                {"部位:" + item.position_name}
                                              </div>
                                            )}
                                            {item.side_name != undefined && item.side_name != "" && (
                                              <div>
                                                {"左右:" + item.side_name}
                                              </div>
                                            )}
                                            {item.barcode != undefined && item.barcode != "" && (
                                              <div>
                                                {"バーコード:" + item.barcode}
                                              </div>
                                            )}
                                            {item.comment != undefined && item.comment != "" && (
                                              <div>
                                                {"コメント:" + item.comment}
                                              </div>
                                            )}
                                          </>
                                        )
                                      })}
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        );
                      })}
                    </>
                  )}
                    </>
                  )}
                </div>                          
                {this.state.confirm_message !== "" && this.state.confirm_type == "print" && (
                  <SystemConfirmJapanModal
                    hideConfirm= {this.closeConfirmModal.bind(this)}
                    confirmCancel= {this.closeConfirmModal.bind(this)}
                    confirmOk= {this.confirmPrint.bind(this)}   
                    confirmTitle= {this.state.confirm_message}           
                  />
                )}
                {this.state.alert_messages !== "" && (
                  <SystemAlertModal
                    hideModal= {this.closeConfirmModal.bind(this)}
                    handleOk= {this.closeConfirmModal.bind(this)}
                    showMedicineContent= {this.state.alert_messages}
                  />
                )}
                {this.state.complete_message !== '' && (
                  <CompleteStatusModal
                    message = {this.state.complete_message}
                  />
                )}              
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>   
            <Button className="red-btn" onClick={this.saveWorkSheetAndPrint}>印刷</Button>               
          </Modal.Footer>
        </Modal>

      </>
    );
  }
}

WorkSheetModal.contextType = Context;
WorkSheetModal.propTypes = {  
  worksheetInfo: PropTypes.object,  
  selectedPatients: PropTypes.array,  
  type: PropTypes.string,  
  course_date: PropTypes.string,  
  closeModal: PropTypes.func,  
  patientId: PropTypes.number,
};

export default WorkSheetModal;
