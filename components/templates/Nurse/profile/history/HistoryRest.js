import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatTime, formatDateTimeIE} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
`;

class HistoryRest extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }      
    }
    render() {
      var data = this.props.modal_data.rest_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">
            {data.time_of_sleeping > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">睡眠時間</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    約{data.time_of_sleeping}時間
                  </div>
                </div>
              </div>
              </>
            )}
            {data.bedtime != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">就寝時刻</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {formatTime(formatDateTimeIE(data.bedtime))}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.wake_up_time != null && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">起床時刻</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {formatTime(formatDateTimeIE(data.wake_up_time))}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.sleep_time > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入眠までの時間</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {data.sleep_time}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_sleep_interruption == 1 && data.number_of_sleep_interruptions > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">睡眠中断</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {data.number_of_sleep_interruptions}回
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_napping_habit == 1 && data.hours_of_napping > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">午睡習慣</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">                    
                    {data.hours_of_napping}時間
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">睡眠状態</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">                    
                  {data.sleep_state == 1 ? '不眠':'良好'}
                  {data.sleep_state == 1 && data.reason_for_insomnia != '' && (
                    <div>理由・状況: {data.reason_for_insomnia}</div>
                  )}
                  {data.sleep_state == 1 && data.how_to_deal_with_insomnia != '' && (
                    <div>対処法: {data.how_to_deal_with_insomnia}</div>
                  )}
                </div>
              </div>
            </div>
            {data.with_or_without_sleeping_pills == 1 && data.sleeping_pills_name !='' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">使用薬名</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.sleeping_pills_name}
                    <div>{data.frequency_of_sleeping_pills == 1?'時々':'常用'}</div>
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_awake_symptoms == 1 && (
              <>
                <div className="flex between table-row">
                  <div className="text-left">
                    <div className="table-item">覚醒時の症状</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {data.sleepiness_flag == 1 && (<span>眠気&nbsp;&nbsp;</span>)}
                      {data.yawn_flag == 1 && (<span>欠伸&nbsp;&nbsp;</span>)}
                      {data.malaise_flag == 1 && (<span>倦怠感&nbsp;&nbsp;</span>)}
                      {data.other_awake_symptoms_flag == 1 && data.other_awake_symptoms != '' && (<span>{data.other_awake_symptoms}</span>)}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">休息の満足感</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.rest_satisfaction == 1 ? '有':'無'}                  
                </div>
              </div>
            </div>

            {data.rest_status_health_ != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">健康時の休息状況</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.rest_status_health_}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.rest_status_hospitalization != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">入院後の休息状況</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.rest_status_hospitalization}
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

HistoryRest.contextType = Context;

HistoryRest.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryRest;