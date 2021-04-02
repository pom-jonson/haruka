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

class HistoryStress extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.stress_data;
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.past_stress != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">過去一番ストレスを感じたこと</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.past_stress}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.changes_in_the_past != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">過去心身の変化</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.changes_in_the_past}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.how_to_deal_with_the_past != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">過去対処法</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.how_to_deal_with_the_past}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.present_stress != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">現在ストレスに感じていること</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.present_stress}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.changes_in_the_present != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">現在心身の変化</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.changes_in_the_present}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.how_to_deal_with_the_present != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">現在対処法</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.how_to_deal_with_the_present}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.hobby != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">趣味</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.hobby}
                  </div>
                </div>
              </div>
              </>
            )}

            {data.adviser == 1 && data.relationship != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">相談相手</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.relationship}
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

HistoryStress.contextType = Context;

HistoryStress.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryStress;