import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
`;

class HistoryGender extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.gender_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.with_or_without_genital_disease == 1 && data.genital_disease != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">生殖器疾患</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.genital_disease}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_menopause_symptom == 1 &&  data.menopause_symptom != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">更年期障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.menopause_symptom}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.sexual_problem != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">性に対する問題</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.sexual_problem}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.menarche_age > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">初経年齢</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.menarche_age}歳
                  </div>
                </div>
              </div>
              </>
            )}
            {data.menopause_age > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">閉経年齢</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.menopause_age}歳
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">月経周期</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <span>{data.menstrual_cycle == 0?'順調':'不順'}&nbsp;&nbsp;</span>
                  {data.menstrual_cycle_days > 0 && (<span>{data.menstrual_cycle_days}日周期</span>)}
                  <span></span>
                </div>
              </div>
            </div>
            {data.menstruation_period_of_days > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">月経日数</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.menstruation_period_of_days}日間
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">月経量</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.menstrual_blood_loss == 1 ? "多い": data.menstrual_blood_loss == 2 ? "普通":"少ない"}
                </div>
              </div>
            </div>

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">不正出血の有無</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.with_or_without_abnormal_vaginal_bleeding == 1?'有':'無'}
                </div>
              </div>
            </div>

            {data.with_or_without_concomitant_symptoms == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">月経随伴症状</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    <div>有</div>
                    {data.back_pain_flag ==1 && (<span>腰痛&nbsp;&nbsp;</span>)}
                    {data.stomach_ache_flag ==1 && (<span>腹痛&nbsp;&nbsp;</span>)}
                    {data.diarrhea_flag ==1 && (<span>下痢&nbsp;&nbsp;</span>)}
                    {data.constipation_flag ==1 && (<span>便秘&nbsp;&nbsp;</span>)}
                    {data.other_concomitant_symptoms_flag == 1 && data.other_concomitant_symptoms != '' && (<span>{data.other_concomitant_symptoms}</span>)}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.use_of_analgesics == 1 && data.analgesics_name != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">鎮痛薬の使用</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.analgesics_name}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.number_of_pregnancy > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">妊娠回数</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.number_of_pregnancy}回
                  </div>
                </div>
              </div>
              </>
            )}
            {data.natural_delivery > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">自然分娩</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.natural_delivery}回
                  </div>
                </div>
              </div>
              </>
            )}
            {data.caesarean_section > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">帝王切開</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.caesarean_section}回
                  </div>
                </div>
              </div>
              </>
            )}
            {data.spontaneous_abortion > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">自然流産</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.spontaneous_abortion}回
                  </div>
                </div>
              </div>
              </>
            )}
            {data.artificial_abortion > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">人工流産</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.artificial_abortion}回
                  </div>
                </div>
              </div>
              </>
            )}
            
            {data.contraception_method != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">避妊方法</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.contraception_method}
                  </div>
                </div>
              </div>
              </>
            )}

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

HistoryGender.contextType = Context;

HistoryGender.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryGender;