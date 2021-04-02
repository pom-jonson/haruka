import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatJapanDateSlash} from "~/helpers/date";
import {makeList_number} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
`;

class HistoryProfile extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
        nurse_staff: this.props.nurse_staff,
        nurse_staff_object: makeList_number(this.props.nurse_staff),
        hosptial_purpose_master_object:makeList_number(this.props.hosptial_purpose_master),
        disaseNamses_object:this.props.diseaseName_object
      }
      this.criteria_options = {
        0:'',
        1:'Ⅰ',
        2:'Ⅱ',
        3:'Ⅱa',
        4:'Ⅱb',
        5:'Ⅲ',
        6:'Ⅲa',
        7:'Ⅲb',
        8:'Ⅳ',
        9:'M',
      };
    }
    render() {
      var data = this.props.modal_data.profile_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">来院者</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.myself_flag ==1?'本人 ':''}
                  {data.spouse_flag ==1?'配偶者 ':''}
                  {data.mother_flag ==1?'母親 ':''}
                  {data.father_flag ==1?'父親 ':''}
                  {data.children_flag ==1?'子供 ':''}
                  {data.children_flag ==1 && data.other_children !=''?'(' + data.other_children + ') ':''}
                  {data.brother_flag ==1?'兄弟 ':''}
                  {data.brother_flag ==1 && data.other_brother !=''?'(' + data.other_brother + ') ':''}
                  {data.other_flag ==1?'その他 ':''}
                  {data.other_flag ==1 && data.other_visitor !=''?'(' + data.other_visitor + ')':''}
                </div>
              </div>
            </div>
            {data.medical_history_id > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">病歴</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {this.state.disaseNamses_object[data.medical_history_id]}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.key_pearson != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">キーパーソン</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.key_pearson}{data.relation != ''? '(' + data.relation + ')':''}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.respiration != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">R</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.respiration}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.pulse != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">P</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.pulse}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.heart_rate != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">HR</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.heart_rate}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.diastolic_blood_pressure != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">DBP</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.diastolic_blood_pressure}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.systolic_blood_pressure != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">SBP</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.systolic_blood_pressure}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.measurement_prohibited_area != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">測定禁止部位・備考</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.measurement_prohibited_area}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.purpose_of_hospitalization > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入院目的</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {this.state.hosptial_purpose_master_object[data.purpose_of_hospitalization]}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.hospitalization_history >= 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入院歴</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.hospitalization_history == 1 ? 'あり': 'なし'}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.external_prescription == 1 && data.hospitalization_history_reference != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入院履歴等その他備考</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.hospitalization_history_reference}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.external_prescription >= 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">院外処方があるか</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.external_prescription == 1 ? 'はい': 'いいえ'}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.external_prescription == 1 && data.external_prescription_reference != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">院外処方</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.external_prescription_reference}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.background_of_hospitalization != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入院までの経緯</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.background_of_hospitalization}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.current_medical_history != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">現病歴</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {this.props.current_medical_history}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.remarks != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">備考</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.remarks}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.attention != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">留意してほしいこと</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.attention}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.consideration_during_treatment != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">治療経過中の配慮</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.consideration_during_treatment}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.pressure_sore == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">褥瘡</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.sacral_region_flag ==1?'仙骨部 ':''}
                    {data.ischium_flag ==1?'坐骨部 ':''}
                    {data.coccyx_flag ==1?'尾骨部 ':''}
                    {data.ilium_flag ==1?'腸骨部 ':''}
                    {data.greater_trochanter_club_flag ==1?'大転子部 ':''}
                    {data.calcaneus_flag ==1?'踵骨部 ':''}
                    {data.pressure_sore_other_flag ==1?'その他 ':''}
                    {data.pressure_sore_other_flag ==1 && data.other !=''?'(' + data.other + ')':''}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.braden_scale != null && data.braden_scale != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">評価スケール</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.braden_scale}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.criteria > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">日常生活</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {this.criteria_options[data.criteria]}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.replacement_enforcement_date != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">建設日又は交換（挿入）施行日</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {formatJapanDateSlash(data.replacement_enforcement_date)}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.next_scheduled_replacement_date != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">次回交換（挿入）予定日</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {formatJapanDateSlash(data.next_scheduled_replacement_date)}
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">タオルリース</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.towel_lease == 1? '有': '無'}
                </div>
              </div>
            </div>
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">衣類リース</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.clothing_lease == 1? '有': '無'}
                </div>
              </div>
            </div>
            {data.hospital_change_source != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">転院元</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.hospital_change_source}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.hearing_nurse_id > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">聴取看護師</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {this.state.nurse_staff_object[data.hearing_nurse_id]}
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </Wrapper>
      )
    }
}

HistoryProfile.contextType = Context;

HistoryProfile.propTypes = {  
  modal_data: PropTypes.object,
  current_medical_history:PropTypes.string,
  nurse_staff: PropTypes.array,
  hosptial_purpose_master: PropTypes.array,
  diseaseName_object:PropTypes.array,
};

export default HistoryProfile;