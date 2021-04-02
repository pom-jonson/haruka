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

class HistoryExercise extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
      this.adl_options = {
          0:'',
          1:'自立',
          2:'要監視',
          3:'部分介助',
          4:'全介助',          
      };
    }
    render() {
      var data = this.props.modal_data.exercise_data;
      return (
        <Wrapper>
          <div className="phy-box w70p">   
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">呼吸リズム</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.breathing_rhythm == 1 ? '不規則':'規則的'}                  
                </div>
              </div>
            </div>
            
            {data.with_or_without_respiratory_symptoms == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">呼吸器症状</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {data.difficult_flag == 1 ? '呼吸困難 ':''}
                    {data.cough_flag == 1 ? '咳 ':''}
                    {data.sputum_flag == 1 ? '淡 ':''}
                    {data.other_respiratory_symptoms_flag == 1 ? 'その他 ':''}
                    {data.other_respiratory_symptoms_flag == 1 && data.other_respiratory_symptoms != '' ? '(' + data.other_respiratory_symptoms + ')':''}
                  </div>
                </div>
              </div>
              </>
            )}

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">呼吸音の異常</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.abnormal_breath_sounds == 1 ? '有':'無'}                  
                </div>
              </div>
            </div>

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">循環リズム</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.circular_rhythm == 1 ? '不整':'整'}                  
                </div>
              </div>
            </div>

            {data.with_or_without_cardiovascular_symptoms == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">循環器症状</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {data.palpitations == 1 ? '動機 ':''}
                    {data.shortness_of_breath == 1 ? '息切れ ':''}
                    {data.chest_pain == 1 ? '胸痛 ':''}
                    {data.other_cardiovascular_symptoms_flag == 1 ? 'その他 ':''}
                    {data.other_cardiovascular_symptoms_flag == 1 && data.other_cardiovascular_symptoms != '' ? '(' + data.other_cardiovascular_symptoms + ')':''}
                  </div>
                </div>
              </div>
              </>
            )}

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">利き手</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.dominant_hand == 1 ? '左':'右'}                  
                </div>
              </div>
            </div>

            {data.with_or_without_range_of_motion == 1 && data.range_of_motion != '' &&(
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">関節運動域制限</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.range_of_motion != '' ? data.range_of_motion :''}
                  </div>
                </div>
              </div>
              </>
            )}
            
            {data.with_or_without_disability == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">身体障害</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    <div>有</div>
                    {data.paralyzed_area_flag == 1 && (
                      <><div>麻痺{data.paralysis_site != ''? '('+data.paralysis_site + ')' :''}</div></>
                    )}
                    {data.defective_site_flag == 1 && (
                      <><div>欠損{data.defect_site != ''? '('+data.defect_site + ')' :''}</div></>
                    )}
                    {data.contracture_site_flag == 1 && (
                      <><div>拘縮{data.contracture_site != ''? '('+data.contracture_site + ')' :''}</div></>
                    )}
                    {data.other_parts_flag == 1 && (
                      <><div>その他{data.other_site != ''? '('+data.other_site + ')' :''}</div></>
                    )}                    
                  </div>
                </div>
              </div>
              </>
            )}
            
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">ADL</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.meal > 0 && (
                    <><div>食事 : {this.adl_options[data.meal]}</div></>
                  )}
                  {data.clean > 0 && (
                    <><div>清潔 : {this.adl_options[data.clean]}</div></>
                  )}
                  {data.changing_clothes > 0 && (
                    <><div>更衣 : {this.adl_options[data.changing_clothes]}</div></>
                  )}
                  {data.excretion > 0 && (
                    <><div>排泄 : {this.adl_options[data.excretion]}</div></>
                  )}
                  {data.move > 0 && (
                    <><div>移動 : {this.adl_options[data.move]}</div></>
                  )}
                  {data.rolling_over > 0 && (
                    <><div>寝返り : {this.adl_options[data.rolling_over]}</div></>
                  )}
                  {data.housework > 0 && (
                    <><div>家事 : {this.adl_options[data.housework]}</div></>
                  )}
                </div>
              </div>
            </div>

            {data.self_help_devices != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">自助具</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.self_help_devices}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.adl_remarks != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">備考</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.adl_remarks}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_exercise_habits == 1 && data.exercise_habits && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">運動習慣</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.exercise_habits}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_activity_restrictions == 1 && data.activity_restrictions && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">活動の制限</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.activity_restrictions}
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

HistoryExercise.contextType = Context;

HistoryExercise.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryExercise;