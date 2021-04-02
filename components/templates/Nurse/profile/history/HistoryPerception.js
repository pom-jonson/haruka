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

class HistoryPerception extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.perception_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.pupil_r != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">瞳孔 R</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.pupil_r}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.pupil_l != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">瞳孔 L</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.pupil_l}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_visual_impairment == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">視覚障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                  {data.visual_impairment_r_flag == 1 && (<span>R&nbsp;&nbsp;</span>)}
                  {data.visual_impairment_l_flag == 1 && (<span>L&nbsp;&nbsp;</span>)}
                  {data.glasses_flag == 1 && (<span>眼鏡の使用&nbsp;&nbsp;</span>)}
                  {data.contact_flag == 1 && (<span>コンタクトレンズの使用&nbsp;&nbsp;</span>)}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_hearing_impairment == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">聴覚障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                  {data.hearing_impairment_r_flag == 1 && (<span>R&nbsp;&nbsp;</span>)}
                  {data.hearing_impairment_l_flag == 1 && (<span>L&nbsp;&nbsp;</span>)}
                  {data.hearing_aid_flag == 1 && (<span>補聴器の使用&nbsp;&nbsp;</span>)}                  
                  </div>
                </div>
              </div>
              </>
            )}            
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">眩暈・ふらつきの有無</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.dizziness_wobbling == 1 ? '有' :'無'}
                </div>
              </div>
            </div>
            {data.with_or_without_olfactory_disorder == 1 && data.olfactory_disorder != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">嗅覚障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.olfactory_disorder}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_taste_disorders == 1 && data.taste_disorders != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">味覚障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.taste_disorders}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.language_disorder == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">言語障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.sign_language_flag == 1 && (<span>手話&nbsp;&nbsp;</span>)}
                    {data.dial_flag == 1 && (<span>文字盤&nbsp;&nbsp;</span>)}
                    {data.written_conversation_flag == 1 && (<span>筆談&nbsp;&nbsp;</span>)}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_disorientation == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">見当識障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.man_flag == 1 && (<span>人&nbsp;&nbsp;</span>)}
                    {data.place_flag == 1 && (<span>場所&nbsp;&nbsp;</span>)}
                    {data.time_flag == 1 && (<span>時間&nbsp;&nbsp;</span>)}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_paresthesia == 1 && data.paresthesia_site != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">知覚障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.paresthesia_site}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_pain == 1 && data.pain_site != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">身体可動性障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.pain_site}
                    {data.how_to_deal_with_pain != '' && (<div>{data.how_to_deal_with_pain}</div>)}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_consciousness_disorder == 1 && data.consciousness_disorder != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">意識障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.consciousness_disorder}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_cognitive_impairment == 1 && data.cognitive_impairment != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">認知障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.cognitive_impairment}
                  </div>
                </div>
              </div>
              </>
            )}            

            {data.memory != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">記憶力</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.memory}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.judgment_ability != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">判断能力</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.judgment_ability}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.conversational_ability != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">会話能力</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.conversational_ability}
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

HistoryPerception.contextType = Context;

HistoryPerception.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryPerception;