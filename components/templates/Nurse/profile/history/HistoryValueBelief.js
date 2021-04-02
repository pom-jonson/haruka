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

class HistoryValueBelief extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.belief_data;
      return (
        <Wrapper>
          <div className="phy-box w70p">
            {data.religion == 1 && (data.religious_customs != '' || data.lifestyle != '') && (
                <>
                <div className="flex between table-row">
                    <div className="text-left">
                    <div className="table-item">宗教</div>
                    </div>
                    <div className="text-right">
                    <div className="table-item remarks-comment">有</div>
                    </div>
                </div>
                {data.religious_customs != '' && (
                  <div className="flex between table-row">
                    <div className="text-left">
                      <div className="table-item">宗教的習慣</div>
                    </div>
                    <div className="text-right">
                      <div className="table-item remarks-comment">{data.religious_customs}</div>
                    </div>
                  </div>
                )}
                {data.lifestyle != '' && (
                  <div className="flex between table-row">
                    <div className="text-left">
                      <div className="table-item">生活習慣</div>
                    </div>
                    <div className="text-right">
                      <div className="table-item remarks-comment">{data.lifestyle}</div>
                    </div>
                  </div>
                )}
                </>
            )}
            {data.value != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">価値・信念</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.value}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.life_goal != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">人生目標</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.life_goal}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.health_relationship != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">健康状態との関係</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.health_relationship}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.points_to_remember != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">治療への留意点</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.points_to_remember}
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

HistoryValueBelief.contextType = Context;

HistoryValueBelief.propTypes = {  
  modal_data: PropTypes.object,
};

export default HistoryValueBelief;