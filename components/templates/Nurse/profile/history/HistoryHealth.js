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

class HistoryHealth extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.health_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.diagnosis != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">診断名</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.diagnosis}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.doctor_explanation != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">医師の説明</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.doctor_explanation}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.the_person_understanding != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">本人の理解</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.the_person_understanding}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.family_supporter_understanding != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">家族・協力者の理解</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.family_supporter_understanding}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.with_or_without_for_health == 1 && data.for_health != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">健康のために気を付けていること</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.for_health}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.coping != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">今後の対処</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.coping}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.medical_history != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">既往症</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.medical_history}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.allergy != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">アレルギー</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.allergy}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.infection != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">感染症</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.infection}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.drinking != 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">飲酒</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.drinking == 1 && (
                      <>
                      <span>有：</span>
                      {data.frequency_of_drinking > 0 && (<span>{data.frequency_of_drinking}回/週  </span>)}
                      {data.amount_of_drinking > 0 && (<span>{data.amount_of_drinking}合/日</span>)}
                      </>
                    )}
                    {data.drinking == 2 && (
                      <>
                        <span>禁酒：</span>
                        {data.drinking_content != '' && (<span>{data.drinking_content}</span>)}
                      </>
                    )}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.smoking != 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">喫煙</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.smoking == 1 && (
                      <>
                      <span>吸う：</span>
                      {data.number_of_smoking > 0 && (<span>{data.number_of_smoking}本/日  </span>)}
                      {data.years_of_smoking > 0 && (<span>{data.years_of_smoking}年</span>)}
                      </>
                    )}
                    {data.smoking == 2 && (
                      <>
                        <span>禁煙</span>                        
                      </>
                    )}
                  </div>
                </div>
              </div>
              </>
            )}
            
            <div className="flex between table-row">
                <div className="text-left">
                    <div className="table-item">輸血歴</div>
                </div>
                <div className="text-right">
                    <div className="table-item remarks-comment">
                    {data.blood_transfusion_history == 1 ? '有' : '無'}
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

HistoryHealth.contextType = Context;

HistoryHealth.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryHealth;