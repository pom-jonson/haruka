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

class HistoryNutrity extends Component {
    constructor(props) {
      super(props);
      this.state = {      
        modal_data: this.props.modal_data,
      }
    }
    render() {
      var data = this.props.modal_data.nutrition_data;      
      return (
        <Wrapper>
          <div className="phy-box w70p">            
            {data.number_of_meals > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">一日の食事回数</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.number_of_meals}回
                  </div>
                </div>
              </div>
              </>
            )}            
              
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">主食</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.rice_flag == 1 && (<span>米飯&nbsp;&nbsp;</span>)}
                  {data.whole_porridge_flag == 1 && (<span>全粥&nbsp;&nbsp;</span>)}
                  {data.heavy_water_flag == 1 && (<span>重湯&nbsp;&nbsp;</span>)}
                  {data.bread_flag == 1 && (<span>パン&nbsp;&nbsp;</span>)}
                  {data.other_staple_food_flag == 1 && data.other_staple_food != '' && (<span>{data.other_staple_food}</span>)}
                </div>
              </div>
            </div>
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">副食</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.usually_flag == 1 && (<span>普通&nbsp;&nbsp;</span>)}
                  {data.soft_vegetables_flag == 1 && (<span>軟菜&nbsp;&nbsp;</span>)}
                  {data.shredded_flag == 1 && (<span>きざみ&nbsp;&nbsp;</span>)}                  
                  {data.other_side_dish_flag == 1 && data.other_side_dish != '' && (<span>{data.other_side_dish}</span>)}
                </div>
              </div>
            </div>            
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">間食の有無</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.with_or_without_eat_between_meals == 1 ? '有' :'無'}
                </div>
              </div>
            </div>

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">摂取状況・方法</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.oral_ingestion_flag == 1 && (<span>経口摂取&nbsp;&nbsp;</span>)}
                  {data.tube_feeding_flag == 1 && (<span>経管栄養&nbsp;&nbsp;</span>)}
                  {data.gastrostomy_flag == 1 && (<span>胃瘻&nbsp;&nbsp;</span>)}
                  {data.enteric_fistula_flag == 1 && (<span>腸瘻&nbsp;&nbsp;</span>)}
                  {data.tpn_flag == 1 && (<span>TPN(完全静脈栄養法)&nbsp;&nbsp;</span>)}
                  {data.other_ingestion_status_flag == 1 && data.other_ingestion_status != '' && (<span>{data.other_ingestion_status}</span>)}
                </div>
              </div>
            </div>
            
            {data.moisture > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">水分摂取状況</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.moisture}mL/d
                  </div>
                </div>
              </div>
              </>
            )}

            {data.unbalanced_diet != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">偏食の有無</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.unbalanced_diet}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.appetite != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">食欲の有無</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.appetite}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.difficulty_swallowing != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">嚥下困難の有無</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.difficulty_swallowing}
                  </div>
                </div>
              </div>
              </>
            )}
            {data.number_of_teeth > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">歯の数</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.number_of_teeth}本
                  </div>
                </div>
              </div>
              </>
            )}
            {data.with_or_without_denture == 1 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">義歯の有無</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.full_dentures_flag == 1 && (<span>総入れ歯&nbsp;&nbsp;</span>)}
                    {data.partial_denture_top_flag == 1 && (<span>部分入れ歯（上）&nbsp;&nbsp;</span>)}
                    {data.partial_denture_bottom_flag == 1 && (<span>部分入れ歯（下）&nbsp;&nbsp;</span>)}
                    {data.insert_tooth_top_flag == 1 && (<span>差し歯（上）&nbsp;&nbsp;</span>)}
                    {data.insert_tooth_bottom_flag == 1 && (<span>差し歯（下）&nbsp;&nbsp;</span>)}
                    {data.other_denture_flag == 1 && data.other_denture != '' && (<span>{data.other_denture}</span>)}
                  </div>
                </div>
              </div>
              </>
            )}
            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">口腔粘膜の状態</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.stomatitis_flag == 1 && (<span>口内炎&nbsp;&nbsp;</span>)}
                  {data.vitiligo_teeth_flag == 1 && (<span>白斑&nbsp;&nbsp;</span>)}
                  {data.meat_bleeding_flag == 1 && (<span>歯肉出血&nbsp;&nbsp;</span>)}
                  {data.dry_flag == 1 && (<span>乾燥&nbsp;&nbsp;</span>)}                    
                  {data.other_oral_mucosa_flag == 1 && data.other_oral_mucosa != '' && (<span>{data.other_oral_mucosa}</span>)}
                </div>
              </div>
            </div>

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">う歯</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.caries == 1?'有':'無'}
                </div>
              </div>
            </div>

            {data.weight > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">体重</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.weight}kg
                  </div>
                </div>
              </div>
              </>
            )}
            {data.height > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">身長</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.height}cm
                  </div>
                </div>
              </div>
              </>
            )}

            {data.weight_change_period != null && data.weight_change_period != '' && data.weight_change_kg > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">体重の増加または減少</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.weight_change_period}ごろから{data.weight_change_kg}kg
                  </div>
                </div>
              </div>
              </>
            )}

            {data.temperature > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">体温</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.temperature}℃
                  </div>
                </div>
              </div>
              </>
            )}
            {data.normal_temperature > 0 && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">平熱</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.normal_temperature}℃
                  </div>
                </div>
              </div>
              </>
            )}

            <div className="flex between table-row">
              <div className="text-left">
                <div className="table-item">顔色</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {data.usually_color_flag == 1 && (<span>普通&nbsp;&nbsp;</span>)}
                  {data.pallor_flag == 1 && (<span>蒼白&nbsp;&nbsp;</span>)}
                  {data.flush_flag == 1 && (<span>紅潮&nbsp;&nbsp;</span>)}
                  {data.yellow_dyeing_flag == 1 && (<span>黄染&nbsp;&nbsp;</span>)}                    
                  {data.other_complexion_flag == 1 && data.other_complexion != '' && (<span>{data.other_complexion}</span>)}
                </div>
              </div>
            </div>

            {data.skin != '' && (
              <>
              <div className="flex between table-row">
                <div className="text-left">
                  <div className="table-item">皮膚の状態</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {data.skin}
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

HistoryNutrity.contextType = Context;

HistoryNutrity.propTypes = {  
  modal_data: PropTypes.object,  
};

export default HistoryNutrity;