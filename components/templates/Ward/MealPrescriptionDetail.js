import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {formatDateLine, formatJapan, formatJapanDateSlash, formatJapanDateTime} from "~/helpers/date";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .patient-info {
    width:100%;
    display: flex;
    margin-bottom:0.5rem;
    .left-area {
      width:22rem;
      .div-label {
        width:4.5rem;
      }
      .div-value {
        width:calc(100% - 4.5rem);
      }
    }
    .right-area {
      width:calc(100% - 22rem);
      .div-label {
        min-width:2.5rem;
      }
      .div-value {
        width:calc(100% - 2.5rem);
      }
    }
  }
  .border-1px {
    border:1px solid #aaa;
  }
  .border-right-1px {
    border-right:1px solid #aaa;
  }
  .border-top-1px {
    border-top:1px solid #aaa;
  }
  .td-title {
    width:3rem;
    text-align:center;
    padding:0.2rem 0;
  }
  .td-value {
    width:calc(100% - 3rem);
    padding:0.2rem;
  }
  .vertical-middle {
    width:3rem;
    display: flex;
    align-items: center;
    div {
      width: 100%;
      text-align: center;
    }
  }
  
`;

class MealPrescriptionDetail extends Component {
  constructor(props) {
    super(props);
    let department_data = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.departmentOptions = [];
    if(department_data.length > 0){
      department_data.map(department=>{
        this.departmentOptions[department['id']] = department['value'];
      })
    }
    this.state = {
      complete_message:"",
    };
  }
  
  getDoctorName = (nDoctorConsented = -1, strDoctorName = "", strStuffName) => {
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else {
      return strDoctorName + "（入力者 : " + strStuffName + "）";
    }
  }
  
  get_title_pdf = () => {
    let title = "食事箋_";
    title += this.props.modal_data.patient_number + "_";
    if (this.props.modal_data.start_date != null) {
      title = title + formatDateLine(this.props.modal_data.start_date).split('-').join('');
    } else if(this.props.modal_data.end_date != null){
      title = title + formatDateLine(this.props.modal_data.end_date).split('-').join('');
    }
    return title+".pdf";
  }
  
  orderPrint = () => {
    this.setState({complete_message:"印刷中"});
    let pdf_file_name = this.get_title_pdf();
    let path = "/app/api/v2/meal/print_meal";
    let print_data = {};
    print_data.meal_info = this.props.modal_data;
    print_data.type = "order_prescription_print";
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
        this.setState({complete_message:""});
      })
  }
  
  render() {
    let {modal_data} = this.props;
    return  (
      <Modal show={true}  className="custom-modal-sm first-view-modal meal-prescription-detail-modal">
        <Modal.Header><Modal.Title>食事オーダー</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'patient-info'}>
              <div className={'left-area'}>
                <div className={'flex'}>
                  <div className={'div-label'}>病歴番号</div>
                  <div className={'div-value'}>: {modal_data.patient_number}</div>
                </div>
                <div className={'flex'}>
                  <div className={'div-label'}>氏名</div>
                  <div className={'div-value'}>: {modal_data.patient_name}</div>
                </div>
                <div className={'flex'}>
                  <div className={'div-label'}>生年月日</div>
                  <div className={'div-value'}>: {formatJapan(modal_data.birthday.split('-').join('/'))}</div>
                </div>
                <div className={'flex'}>
                  <div className={'div-label'}>依頼日時</div>
                  <div className={'div-value'}>: {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== "" ?
                    formatJapanDateTime(modal_data.treatment_datetime):""}</div>
                </div>
              </div>
              <div className={'right-area'}>
                <div className={'flex'}>
                  <div className={'div-label'}>病室</div>
                  <div className={'div-value'}>: {modal_data.ward_name}/{modal_data.room_name}/{modal_data.bed_name == null ? "病床未定" : modal_data.bed_name}</div>
                </div>
                <div className={'flex'}>
                  <div className={'div-label'}>病名</div>
                  <div className={'div-value'}>: {modal_data.disease_name}</div>
                </div>
                <div className={'flex'}>
                  <div className={'div-label'}>身長</div>
                  <div>: {modal_data.weight_height.height !== "" ? (' ' + modal_data.weight_height.height + "㎝　") : "　"}</div>
                  <div className={'div-label'} style={{marginLeft:"0.5rem"}}> 体重</div>
                  <div>: {modal_data.weight_height.weight !== "" ? (' ' + modal_data.weight_height.weight + "㎏") : ""}</div>
                </div>
                <div className={'flex'}>
                  <div className={'div-label'}>医師</div>
                  <div className={'div-value'}>: {this.getDoctorName(modal_data.is_doctor_consented, modal_data.order_data.order_data.doctor_name, modal_data.input_staff_name)}</div>
                </div>
              </div>
            </div>
            <div className={'border-1px'} style={{textAlign:"center", padding:"0.2rem 0"}}>{modal_data.classific}</div>
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'td-title border-right-1px'}>期間</div>
              <div className={'td-value'}>
                {modal_data.start_time_name != null ? (formatJapanDateSlash(modal_data.start_date) + " " + modal_data.start_time_name + "より ") : ""}
                {modal_data.end_date != null ? (formatJapanDateSlash(modal_data.end_date) + " " + modal_data.end_time_name + "まで") : ""}
              </div>
            </div>
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'border-right-1px'} style={{textAlign:"center", width:"50%", padding:"0.2rem 0"}}>一　　般　　食</div>
              <div style={{textAlign:"center", width:"50%", padding:"0.2rem 0"}}>特　　別　　食</div>
            </div>
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'flex border-right-1px'} style={{width:"50%"}}>
                <div className={'td-title border-right-1px'}>食種</div>
                <div className={'td-value'}>
                  {modal_data.food_classification_name === "一般食" ? modal_data.food_type_name : ""}
                </div>
              </div>
              <div style={{width:"50%", padding:"0.2rem"}}>
                {modal_data.food_classification_name === "特別食" ? modal_data.food_type_name : ""}
              </div>
            </div>
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'border-right-1px td-title'}>
                <div>主</div>
                <div>食</div>
              </div>
              <div style={{width:"calc(100% - 3rem)", padding:"0.2rem"}}>
                <div>昼 : {(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.staple_food_id_noon_name : modal_data.order_data.order_data.staple_food_id_noon_name}</div>
                <div>夕 : {(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.staple_food_id_evening_name : modal_data.order_data.order_data.staple_food_id_evening_name}</div>
              </div>
            </div>
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'flex border-right-1px'} style={{width:"50%"}}>
                <div className={'td-title border-right-1px'}>副食</div>
                <div className={'td-value'}>{(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.side_food_name : modal_data.order_data.order_data.side_food_name}</div>
              </div>
              <div className={'flex'} style={{width:"50%", padding:"0 0.2rem"}}>
                <div className={'td-title border-right-1px'}>朝食</div>
                <div className={'td-value'}>{(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.staple_food_id_morning_name : modal_data.order_data.order_data.staple_food_id_morning_name}</div>
              </div>
            </div>
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'border-right-1px vertical-middle'}>
                <div>飲物</div>
              </div>
              <div style={{width:"calc(100% - 3rem)", padding:"0.2rem"}}>
                <div>朝 : {(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.drink_id_morning_name : modal_data.order_data.order_data.drink_id_morning_name}</div>
                <div>昼 : {(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.drink_id_noon_name : modal_data.order_data.order_data.drink_id_noon_name}</div>
                <div>夕 : {(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? modal_data.drink_id_evening_name : modal_data.order_data.order_data.drink_id_evening_name}</div>
              </div>
            </div>
            {(modal_data.order_title === "外泊実施" || modal_data.order_title === "帰院実施") ? (
              <>
                {modal_data.thick_liquid_food_id != null && (
                  <div className={'flex border-1px'} style={{borderTop:"none"}}>
                    <div className={'border-right-1px vertical-middle'}>
                      <div>
                        <div>流</div>
                        <div>動</div>
                        <div>食</div>
                      </div>
                    </div>
                    <div style={{width:"calc(100% - 3rem)", padding:"0 0.2rem"}}>
                      <div>流動食名 : {modal_data.thick_liquid_food_name}</div>
                      <div>摂取方法 : {modal_data.ingestion_method_name}</div>
                      <div>
                        朝 : {modal_data.thick_liquid_food_number_name_morning === "" ? "　" : (modal_data.thick_liquid_food_number_name_morning + "本 ")}
                        昼 : {modal_data.thick_liquid_food_number_name_noon === "" ? "　" : (modal_data.thick_liquid_food_number_name_noon + "本 ")}
                        夕 : {modal_data.thick_liquid_food_number_name_evening === "" ? "　" : (modal_data.thick_liquid_food_number_name_evening + "本 ")}
                      </div>
                    </div>
                  </div>
                )}
                {!(modal_data.staple_food_morning_free_comment == null && modal_data.staple_food_noon_free_comment == null &&
                  modal_data.staple_food_evening_free_comment == null && modal_data.meal_comment.length === 0 && modal_data.free_comment === null
                ) && (
                  <div className={'flex border-1px'} style={{borderTop:"none", marginBottom:"1px"}}>
                    <div className={'border-right-1px vertical-middle'}>
                      <div>
                        <div>コ</div>
                        <div>メ</div>
                        <div>ン</div>
                        <div>ト</div>
                      </div>
                    </div>
                    <div style={{width:"calc(100% - 3rem)", paddingTop:"0.2rem", paddingBottom:"0.2rem"}}>
                      {modal_data.staple_food_morning_free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>朝 : {modal_data.staple_food_morning_free_comment}</div>
                      )}
                      {modal_data.staple_food_noon_free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>昼 : {modal_data.staple_food_noon_free_comment}</div>
                      )}
                      {modal_data.staple_food_evening_free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>夕 : {modal_data.staple_food_evening_free_comment}</div>
                      )}
                      {modal_data.meal_comment.length > 0 && (
                        modal_data.meal_comment.map((comment, index)=>{
                          return (
                            <>
                              <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}} className={(index == 0 && !(modal_data.staple_food_morning_free_comment == null &&
                                modal_data.staple_food_noon_free_comment == null && modal_data.staple_food_evening_free_comment == null)) ? 'border-top-1px' : ''}>{comment.name}</div>
                            </>
                          )
                        })
                      )}
                      {modal_data.free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}} className={!(modal_data.staple_food_morning_free_comment == null &&
                          modal_data.staple_food_noon_free_comment == null && modal_data.staple_food_evening_free_comment == null && modal_data.meal_comment.length === 0
                        ) ? 'border-top-1px' : ''}
                        >{modal_data.free_comment}</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ):(
              <>
                {modal_data.order_data.order_data.thick_liquid_food_id != null && (
                  <div className={'flex border-1px'} style={{borderTop:"none"}}>
                    <div className={'border-right-1px vertical-middle'}>
                      <div>
                        <div>流</div>
                        <div>動</div>
                        <div>食</div>
                      </div>
                    </div>
                    <div style={{width:"calc(100% - 3rem)", padding:"0 0.2rem"}}>
                      <div>流動食名 : {modal_data.order_data.order_data.thick_liquid_food_name}</div>
                      <div>摂取方法 : {modal_data.order_data.order_data.ingestion_method_name}</div>
                      <div>
                        朝 : {(modal_data.order_data.order_data.thick_liquid_food_number_name_morning !== undefined && modal_data.order_data.order_data.thick_liquid_food_number_name_morning !== "") ? (modal_data.order_data.order_data.thick_liquid_food_number_name_morning + "本 ") : "　"}
                        昼 : {(modal_data.order_data.order_data.thick_liquid_food_number_name_noon !== undefined && modal_data.order_data.order_data.thick_liquid_food_number_name_noon !== "") ? (modal_data.order_data.order_data.thick_liquid_food_number_name_noon + "本 ") : "　"}
                        夕 : {(modal_data.order_data.order_data.thick_liquid_food_number_name_evening !== undefined && modal_data.order_data.order_data.thick_liquid_food_number_name_evening !== "") ? (modal_data.order_data.order_data.thick_liquid_food_number_name_evening + "本 ") : "　"}
                      </div>
                    </div>
                  </div>
                )}
                {!(modal_data.order_data.order_data.staple_food_morning_free_comment == null &&
                  modal_data.order_data.order_data.staple_food_noon_free_comment == null &&
                  modal_data.order_data.order_data.staple_food_evening_free_comment == null &&
                  modal_data.order_data.order_data.meal_comment.length === 0 &&
                  modal_data.order_data.order_data.free_comment === null
                ) && (
                  <div className={'flex border-1px'} style={{borderTop:"none", marginBottom:"1px"}}>
                    <div className={'border-right-1px vertical-middle'}>
                      <div>
                        <div>コ</div>
                        <div>メ</div>
                        <div>ン</div>
                        <div>ト</div>
                      </div>
                    </div>
                    <div style={{width:"calc(100% - 3rem)", paddingTop:"0.2rem", paddingBottom:"0.2rem"}}>
                      {modal_data.order_data.order_data.staple_food_morning_free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>朝 : {modal_data.order_data.order_data.staple_food_morning_free_comment}</div>
                      )}
                      {modal_data.order_data.order_data.staple_food_noon_free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>昼 : {modal_data.order_data.order_data.staple_food_noon_free_comment}</div>
                      )}
                      {modal_data.order_data.order_data.staple_food_evening_free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>夕 : {modal_data.order_data.order_data.staple_food_evening_free_comment}</div>
                      )}
                      {modal_data.order_data.order_data.meal_comment.length > 0 && (
                        modal_data.order_data.order_data.meal_comment.map((comment, index)=>{
                          return (
                            <>
                              <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}} className={(index == 0 && !(modal_data.order_data.order_data.staple_food_morning_free_comment == null &&
                                modal_data.order_data.order_data.staple_food_noon_free_comment == null &&
                                modal_data.order_data.order_data.staple_food_evening_free_comment == null)) ? 'border-top-1px' : ''}>{comment.name}</div>
                            </>
                          )
                        })
                      )}
                      {modal_data.order_data.order_data.free_comment != null && (
                        <div style={{paddingLeft:"0.2rem", paddingRight:"0.2rem"}} className={!(modal_data.order_data.order_data.staple_food_morning_free_comment == null &&
                          modal_data.order_data.order_data.staple_food_noon_free_comment == null &&
                          modal_data.order_data.order_data.staple_food_evening_free_comment == null &&
                          modal_data.order_data.order_data.meal_comment.length === 0
                        ) ? 'border-top-1px' : ''}
                        >{modal_data.order_data.order_data.free_comment}</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            <div className={'flex border-1px'} style={{borderTop:"none"}}>
              <div className={'flex border-right-1px'} style={{width:"50%"}}>
                <div className={'td-title border-right-1px'}>旧室</div>
                <div className={'td-value'}> </div>
              </div>
              <div className={'flex'} style={{width:"50%", padding:"0 0.2rem"}}>
                <div className={'td-title border-right-1px'}>新室</div>
                <div className={'td-value'}> </div>
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className="cancel-btn">閉じる</Button>
          <Button onClick={this.orderPrint} className="red-btn">食事箋印刷</Button>
        </Modal.Footer>
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </Modal>
    );
  }
}

MealPrescriptionDetail.contextType = Context;
MealPrescriptionDetail.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
};
export default MealPrescriptionDetail;
