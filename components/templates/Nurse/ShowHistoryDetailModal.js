import React, { 
  Component, 
  // useContext
 } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";  
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
// import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {formatDateTimeIE, formatJapan} from "~/helpers/date";

const Popup = styled.div`
  .flex {
    display: flex;
  }
  height: 100%;
  overflow-y:auto;
  padding:1.5rem;    
  .clickable{
    cursor:pointer;
  }
  table {
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{      
      overflow-y: auto;
      height: 33rem;
      width:100%;
    }        
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .first-body{
      border-right:none;
    }
    .second-title{
      border-left:1px solid black;
    }
  }
  .selected{
    background: lightblue!important;
  }
`;

class ShowHistoryDetailModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      alert_messages:'',      
    }
  }

  closeAlertModal = () => {
    this.setState({
      alert_messages:"",
    })
  }

  getMainDoctor = (doctor_id) => {
    var doctor_list = this.props.doctor_list;
    if (doctor_list == undefined || doctor_list == null || doctor_list.length == 0) return '';
    var doctor_name = '';
    doctor_list.map(item => {
      if (item.id == doctor_id) doctor_name = item.value;
    })
    return doctor_name;
  }

  getMainNurse = (nurse_id) => {
    var nurse_staff_options = this.props.nurse_staff_options;    
    if (nurse_staff_options == undefined || nurse_staff_options == null || nurse_staff_options.length == 0) return '';
    var nurse_name = '';
    nurse_staff_options.map(item => {
      if (item.id == nurse_id) nurse_name = item.value;
    })
    return nurse_name;
  }
  
  render() {
    var detail_data = this.props.detail_data;
    var radio_options = ['自立', '見守り', '部分介助', '全介助'];
    var care_options = ['無', '有', '申請中', '要支援', '要介護']
    return (
      <>
        <Modal
          show={true}          
          id="outpatient"
          className="custom-modal-sm notice-modal first-view-modal"
        >
          <Modal.Header>
            <Modal.Title style={{width:'20rem'}}>履歴</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Popup>
            <table className="table-scroll table table-bordered">
                <tr>
                  <td className='first-title'>{this.props.type == 'visit'?'【病歴】':'【既往歴】'}</td>
                  <td colSpan = '3'>
                    {detail_data.medical_history != undefined && detail_data.medical_history != null && detail_data.medical_history.length > 0 &&
                    (
                      <>
                        <table className = "table-scroll table table-bordered">
                          <tr>
                            <td style={{width:'7rem'}}>年齢</td>
                            <td>病名</td>
                            <td>病院</td>
                          </tr>                          
                          {detail_data.medical_history.map((item) => {
                            if (item.age > 0 || item.disease_name != ''){
                              return (
                                <>
                                  <tr>
                                    <td>{item.age}</td>
                                    <td>{item.disease_name}</td>
                                    <td>{item.hospital}</td>
                                  </tr>
                                </>
                              )
                            }
                          })}
                        </table>
                      </>
                    )}
                  </td>                  
                </tr>
                {this.props.type == 'visit' && (
                  <>
                  <tr>
                    <td className='first-title'>他科受診</td>
                    <td colSpan = '3'>
                      {detail_data.visit_another_hospital != undefined && detail_data.visit_another_hospital != null && detail_data.visit_another_hospital.length > 0 &&
                      (
                        <>
                          <table className = "table-scroll table table-bordered">
                            <tr>
                              <td>病院</td>
                              <td>診療科</td>
                              <td style={{width:'4rem'}}>処方</td>
                            </tr>                          
                            {detail_data.visit_another_hospital.map((item) => {
                              if (item.department != '' || item.hospital != ''){
                                return (
                                  <>
                                    <tr>
                                      <td>{item.hospital}</td>
                                      <td>{item.department}</td>
                                      <td>{item.prescription==1?'有':'無'}</td>
                                    </tr>
                                  </>
                                )
                              }
                            })}
                          </table>
                        </>
                      )}
                    </td>                  
                  </tr>
                  </>
                )}
                {this.props.type != 'visit' ? (
                  <>
                  <tr>
                    <td className='first-title'>【現病歴】</td>
                    <td className='first-body'>{detail_data.current_medical_history}</td>
                    <td className='second-title'>【内服】</td>
                    <td>{detail_data.internal_use}</td>
                  </tr>
                  <tr>
                    <td className='first-title'>【褥瘡】</td>
                    <td className='first-body'>{detail_data.pressure_ulcer_judgment == 1?'有  ' + detail_data.pressure_ulcer_site:'無'}</td>
                    <td className='second-title'>【移動】</td>
                    <td>{detail_data.movement_judgment>=0 ?radio_options[detail_data.movement_judgment] :''}</td>
                  </tr>
                  <tr>
                    <td className='first-title'>【更衣】</td>
                    <td className='first-body'>{detail_data.change_of_clothes_judgment>=0 ?radio_options[detail_data.change_of_clothes_judgment] :''}</td>
                    <td className='second-title'>【入浴】</td>
                    <td>{detail_data.bathing_judgment>=0 ?radio_options[detail_data.bathing_judgment] :''}</td>
                  </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className='first-title'>備考</td>
                      <td className='first-body'>{detail_data.remarks}</td>
                      <td className='second-title'>記録</td>
                      <td>{detail_data.record}</td>
                    </tr>
                    <tr>
                      <td className='first-title'>屯用指示</td>                      
                      <td colSpan='3'>
                        {detail_data.when_necessary_fever != '' && (<div>熱発時 : {detail_data.when_necessary_fever}</div>)}
                        {detail_data.when_necessary_insomnia != '' && (<div>不眠時 : {detail_data.when_necessary_insomnia}</div>)}
                        {detail_data.when_necessary_constipation != '' && (<div>便秘時 : {detail_data.when_necessary_constipation}</div>)}
                      </td>
                    </tr>
                  </>
                )}
                
                <tr>
                  <td className='first-title'>【食事】</td>
                  <td className='first-body'>{detail_data.meal_judgment>=0 ?radio_options[detail_data.meal_judgment] :''}</td>
                  <td className='second-title'>【食種】</td>
                  <td>
                    <div>{this.props.food_type_object != undefined && this.props.food_type_object != null? this.props.food_type_object[detail_data.food_type]:''}</div>
                    <div>{detail_data.food_energy > 0? '【エネルギー】: ' + detail_data.food_energy + '㎉':''}</div>
                    <div>{detail_data.food_type_salt_content > 0? '【塩分】: ' + detail_data.food_type_salt_content + 'g':''}</div>
                  </td>                  
                </tr>
                <tr>
                  <td className='first-title'>【義歯】</td>
                  <td className='first-body'>{detail_data.denture_judgment==1 ?'有':'無'}&nbsp;&nbsp;{detail_data.denture_part==1 && '全部'}{detail_data.denture_part==2 && '部分'}</td>
                  <td className='second-title'>【ＰＥＧ】<br/>【ＥＤチューブ】</td>
                  <td>
                    <div>{detail_data.peg_construction_date != null && detail_data.peg_construction_date != ''? '造設日又は交換（挿入）施工日: '+ formatJapan(formatDateTimeIE(detail_data.peg_construction_date)) :''}</div>
                    <div>{detail_data.scheduled_ed_tube_date != null && detail_data.scheduled_ed_tube_date != ''? '次回交換（挿入）予定日： '+ formatJapan(formatDateTimeIE(detail_data.scheduled_ed_tube_date)) :''}</div>
                  </td>
                </tr>
                <tr>
                  <td className='first-title'>【排泄】</td>
                  {/* <td className='first-body'></td>
                  <td className='second-title'></td> */}
                  <td colSpan='3'>
                    {detail_data.defecation > 0 && '排便: ' + detail_data.defecation + '回/日、  '}
                    {detail_data.last_defecation != '' && '最終排便: ' + formatJapan(formatDateTimeIE(detail_data.last_defecation)) + '、  '}
                    {detail_data.number_of_urination > 0 && '排便: ' + detail_data.number_of_urination + '回/日、  '}
                    バルン: {detail_data.balun_judgment == 1?'有、':'無、'}&nbsp;&nbsp;{detail_data.balun_size > 0?'サイズ(' + detail_data.balun_size + ')、  ' :'  '}
                    {detail_data.balun_insert_date != null && detail_data.balun_insert_date !='' ? formatJapan(formatDateTimeIE(detail_data.balun_insert_date)) + ', ':' '}
                    ストマ: {detail_data.stoma_judgment == 1?'有':'無'}
                  </td>
                </tr>
                {this.props.type != 'visit' ? (
                  <>
                  <tr>
                    <td className='first-title'>【病名】</td>
                    <td className='first-body'>{detail_data.disease_name}</td>
                    <td className='second-title'>【アレルギー】</td>
                    <td>{detail_data.allergic_food == 1?'食品':''}&nbsp;&nbsp;{detail_data.allergic_drugs == 1?'薬品':''}</td>
                  </tr>
                  </>
                ) : (
                  <>
                  <tr>
                    <td className='first-title'>禁忌</td>
                    <td className='first-body'>{detail_data.contraindicated_drug}</td>
                    <td className='second-title'>自立度</td>
                    <td>{detail_data.independence_level}</td>
                  </tr>
                  <tr>
                    <td className='first-title'>認知度</td>
                    <td className='first-body'>{detail_data.dementia_level}</td>
                    <td className='second-title'>【生活歴】</td>
                    <td>{detail_data.life_history}</td>
                  </tr>
                  </>
                )}
                
                <tr>
                  <td className='first-title'>{this.props.type == 'visit'?'身長・体重':'【入院時バイタル】'}</td>
                  <td className='first-body'>
                    {this.props.type != 'visit' ? (
                      <>
                      <div>{detail_data.t > 0?'T: ' + detail_data.t + '℃':''}</div>
                      <div>{detail_data.p > 0?'P: ' + detail_data.p + '回/分':''}</div>
                      <div>{detail_data.bp > 0?'BP: ' + detail_data.bp + '㎜Hg':''}</div>
                      <div>{detail_data.spo2 > 0?'SPO2: ' + detail_data.spo2 + '%':''}</div>
                      <div>{detail_data.height > 0?'身長: ' + detail_data.height + 'cm':''}</div>
                      <div>{detail_data.weight > 0?'体重: ' + detail_data.weight + 'kg':''}</div>
                      </>
                    ): (
                      <>
                      <div>{detail_data.height > 0?detail_data.height + 'cm':''}</div>
                      <div>{detail_data.weight > 0?detail_data.weight + 'kg':''}</div>
                      </>
                    )}                    
                  </td>
                  <td className='second-title'>【介護保険】</td>
                  <td>
                    <div>{detail_data.long_term_care_insurance_judgment > 0? care_options[detail_data.long_term_care_insurance_judgment] :''}</div>
                    <div>{detail_data.long_term_care_insurance_required}</div>
                    <div>{detail_data.long_term_care_insurance_office != null && detail_data.long_term_care_insurance_office !='' ? '事業所: ' + detail_data.long_term_care_insurance_office :''}</div>
                  </td>
                </tr>                
                <tr>
                  <td className='first-title'>【看護上の問題】</td>
                  <td className='first-body'>{detail_data.long_term_care_problems}</td>
                  <td className='second-title'>【障害】</td>
                  <td>
                    {detail_data.visually_impaired == 1?'【視覚障害】  ':''}{detail_data.hearing_impairment == 1?'【聴覚障害】  ':''}
                    {detail_data.language_disorder == 1?'【言語障害】  ':''}{detail_data.movement_disorders == 1?'【運動障害】  ':''}
                  </td>
                </tr>
                <tr>
                  <td className='first-title'>【麻痺】</td>
                  <td className='first-body'>
                    <div>上肢 &nbsp;&nbsp;{detail_data.paralyzed_upper_limbs == 1 ? '有' :'無'}({detail_data.paralyzed_upper_limb_site})</div>
                    <div>下肢 &nbsp;&nbsp;{detail_data.paralyzed_lower_limbs == 1 ? '有' :'無'}({detail_data.paralyzed_lower_limb_site})</div>                    
                  </td>
                  <td className='second-title'>【理解度】</td>
                  <td>{detail_data.comprehension}</td>
                </tr>
                <tr>
                  <td className='first-title'>【気管切開】</td>
                  <td className='first-body'>{detail_data.tracheostomy_judgment == 1?'有':'無'}&nbsp;&nbsp;
                    {detail_data.tracheostomy_type != null && detail_data.tracheostomy_type !='' ?'種類: ' + detail_data.tracheostomy_type + ' Fr' :''}
                  </td>
                  <td className='second-title'>【特記事項】</td>
                  <td>{detail_data.notices}</td>
                </tr>
                <tr>
                  <td className='first-title'>【主治医】</td>
                  <td className='first-body'>{this.getMainDoctor(detail_data.doctor)}</td>
                  <td className='second-title'>【師長】</td>
                  <td>{this.getMainNurse(detail_data.division_teacher)}</td>
                </tr>
                <tr>
                  <td className='first-title'>【記載者】</td>
                  <td className='first-body'>{detail_data.updated_name}</td>
                  <td className='second-title'>【改定日】</td>
                  <td>{formatJapan(formatDateTimeIE(detail_data.revision_date))}</td>
                </tr>
            </table>
            </Popup>
          </Modal.Body>
          <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>              
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeAlertModal}
              handleOk= {this.closeAlertModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>        
      </>
    );
  }
}
ShowHistoryDetailModal.contextType = Context;

ShowHistoryDetailModal.propTypes = {  
  detail_data :  PropTypes.object,
  closeModal: PropTypes.func,  
  food_type_object : PropTypes.object,
  doctor_list : PropTypes.array,
  nurse_staff_options: PropTypes.array,
  type:PropTypes.string
};

export default ShowHistoryDetailModal;
