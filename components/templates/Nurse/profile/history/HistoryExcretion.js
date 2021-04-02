import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatJapanDateSlash, formatTime, formatDateTimeIE} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
`;

class HistoryExcretion extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
      this.stool_properties_options = {
          0:'',
          1:'コロコロ',
          2:'硬',
          3:'やや硬',
          4:'普通',
          5:'やや軟',
          6:'泥状',
          7:'水様',
      };
    }
    render() {
      var data = this.props.modal_data.excertion_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">
            {data.number_of_bowel_movements > 0 && data.defecation_every_other_day > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">排便回数</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.number_of_bowel_movements}回/{data.defecation_every_other_day}日
                  </div>
                </div>
              </div>
              </>
            )}
            {data.stool_properties != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">便の性状（ＢＳスコア）</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {this.stool_properties_options[data.stool_properties]}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.last_defecation != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">最終排便日</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {formatJapanDateSlash(data.last_defecation)}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_defecation_concomitant_symptoms == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">排便随伴症状</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.discomfort_flag == 1 ? '不快感 ':''}
                    {data.feeling_of_residual_stool_flag == 1 ? '残便感 ':''}
                    {data.abdominal_pain_flag == 1 ? '腹痛 ':''}
                    {data.tactile_sensation_flag == 1 ? '硬便触知 ':''}
                    {data.other_defecation_concomitant_symptoms_flag == 1 ? 'その他 ':''}
                    {data.other_defecation_concomitant_symptoms_flag == 1 && data.other_defecation_concomitant_symptoms != '' ? '(' + data.other_defecation_concomitant_symptoms + ')':''}
                  </div>
                </div>
              </div>
              </>
            )}

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">腸蠕動</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.gut_peristalsis == 1 ? '減弱':'大過'}                  
                </div>
              </div>
            </div>

            {data.coping != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">便通のための対処方法</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.coping}
                  </div>
                </div>
              </div>
              </>
            )}

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">便入薬</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.laxative_flag == 1 ? '緩下剤 ':''}
                  {data.enema_flag == 1 ? '浣腸 ':''}
                  {data.suppository_flag == 1 ? '座薬 ':''}
                  {data.antidiarrheal_agent_flag == 1 ? '止痢剤 ':''}                  
                  {data.drug_delivery_remarks != '' && (
                    <>
                      <div>備考 : {data.drug_delivery_remarks}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">オムツ</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.diapers == 1 ? '有':'無'}
                </div>
              </div>
            </div>

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">ストーマ</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                {data.stoma == 1 ? '有':'無'}
                </div>
              </div>
            </div>

            {data.urination_frequency_day > 0 || data.urination_frequency_night > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">排尿回数</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    <div>{data.urination_frequency_day>0 ? data.urination_frequency_day + '回/日': ''}</div>
                    <div>{data.urination_frequency_night > 0 ? data.urination_frequency_night + '回/夜間' :''}</div>                    
                  </div>
                </div>
              </div>
              </>
            )}
            {data.last_urination != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">最終排尿日</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {formatJapanDateSlash(data.last_urination)}&nbsp;&nbsp;
                    {data.last_urination_time != null && data.last_urination_time != '' ? formatTime(formatDateTimeIE(data.last_urination_time)) + '時頃':''}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.changes_in_urination_status != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">排尿状況の変化</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.changes_in_urination_status}
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">尿失禁</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.urinary_incontinence == 1? '有':'無'}
                </div>
              </div>
            </div>

            {data.with_or_without_urinary_concomitant_symptoms == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">排尿随伴症状</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.urinary_pressure_flag == 1 ? '尿意圧迫 ':''}
                    {data.urine_leak_flag == 1 ? '尿漏れ ':''}
                    {data.full_feeling_of_continuation_flag == 1 ? '継続の満感 ':''}
                    {data.residual_urine_flag == 1 ? '残尿感 ':''}
                    {data.other_urinary_concomitant_symptoms_flag == 1 ? 'その他 ':''}
                    {data.other_urinary_concomitant_symptoms_flag == 1 && data.other_urinary_concomitant_symptoms != '' ? '(' + data.other_urinary_concomitant_symptoms + ')':''}
                  </div>
                </div>
              </div>
              </>
            )}

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">排尿方法</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.intermittent_catheterization_flag == 1 ? '間欠的導尿 ':''}
                  {data.indwelling_catheter_flag == 1 ? '留置カテーテル ':''}
                  {data.urinary_tract_change_flag == 1 ? '尿路変更 ':''}                  
                  {data.urination_method_remarks != '' && (
                    <>
                      <div>備考 : {data.urination_method_remarks}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {data.other != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">その他</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.other}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.summary != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">要約</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.summary}
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

HistoryExcretion.contextType = Context;

HistoryExcretion.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryExcretion;