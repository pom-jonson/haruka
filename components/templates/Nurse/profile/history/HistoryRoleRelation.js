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

class HistoryRoleRelation extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.role_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">家庭内での役割</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.decision_making_flag == 1 && (<span>意思決定&nbsp;&nbsp;</span>)}
                  {data.source_of_income_flag == 1 && (<span>収入源&nbsp;&nbsp;</span>)}
                  {data.housework_flag == 1 && (<span>家事&nbsp;&nbsp;</span>)}
                  {data.childcare_flag == 1 && (<span>育児&nbsp;&nbsp;</span>)}
                  {data.long_term_care_flag == 1 && (<span>介護&nbsp;&nbsp;</span>)}
                  {data.other_domestic_role_flag == 1 && data.other_domestic_role != '' && (<span>{data.other_domestic_role}</span>)}
                </div>
              </div>
            </div>              
            {data.occupation != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">職業</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.occupation}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.job_description != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">仕事内容</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.job_description}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.job_role != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">役割</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.job_role}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.group_activity != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">グループ活動・地域活動</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.group_activity}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.visit_status != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">面会状況</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.visit_status}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.problem != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入院により生じる問題</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.problem}
                  </div>
                </div>
              </div>
              </>
            )}
            
            
            {data.with_or_without_financial_concern == 1 && data.financial_concern != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">経済的心配</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.financial_concern}
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

HistoryRoleRelation.contextType = Context;

HistoryRoleRelation.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryRoleRelation;