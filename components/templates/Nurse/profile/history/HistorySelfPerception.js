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

class HistorySelfPerception extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.self_perception_data;
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.strong_point != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">性格長所</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.strong_point}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.weak_point != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">性格短所</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.weak_point}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.appearance != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">容姿・外見について</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.appearance}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.change_after_illness != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">病気になって変わったこと</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.change_after_illness}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.going_forward != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">今後どうなりたいか</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.going_forward}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.worries_anxiety != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">病気に関する悩み・不安</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.worries_anxiety}
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

HistorySelfPerception.contextType = Context;

HistorySelfPerception.propTypes = {  
  modal_data: PropTypes.object,
};

export default HistorySelfPerception;