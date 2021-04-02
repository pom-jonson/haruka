import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatJapanDateSlash} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
`;

class HistorySummary extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.summary_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.health_perception_health_care_flag == 1 && data.health_perception_health_care != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">健康知覚-健康管理</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.health_perception_health_care}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.nutrition_metabolism_flag == 1 && data.nutrition_metabolism != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">栄養-代謝</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.nutrition_metabolism}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.excretion_flag == 1 && data.excretion != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">排泄</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.excretion}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.activity_exercise_flag == 1 && data.activity_exercise != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">活動-運動</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.activity_exercise}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.sleep_rest_flag == 1 && data.sleep_rest != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">睡眠-休息</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.sleep_rest}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.cognition_perception_flag == 1 && data.cognition_perception != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">認知-知覚</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.cognition_perception}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.self_perception_flag == 1 && data.self_perception != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">自己知覚-自己概念</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.self_perception}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.role_relationship_flag == 1 && data.role_relationship != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">役割-関係</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.role_relationship}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.sexual_reproduction_flag == 1 && data.sexual_reproduction != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">性-生殖</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.sexual_reproduction}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.coping_stress_resistance_flag == 1 && data.coping_stress_resistance != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">性-生殖</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.coping_stress_resistance}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.value_belief_flag == 1 && data.value_belief != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">性-生殖</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.value_belief}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.comprehensive_evaluation != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">総合評価</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.comprehensive_evaluation}({formatJapanDateSlash(data.evaluation_at)})
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

HistorySummary.contextType = Context;

HistorySummary.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistorySummary;