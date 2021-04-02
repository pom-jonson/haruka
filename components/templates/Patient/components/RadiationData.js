import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatJapanDateSlash} from "~/helpers/date";
import renderHTML from 'react-render-html';
import {displayLineBreak} from "~/helpers/dialConstants"
import axios from "axios";
import {openPacs, CACHE_LOCALNAMES, CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as patientApi from "~/helpers/cachePatient-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import {getStrLength} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

const imageButtonStyle = {
  textAlign: "center",
  color: "blue",
  cursor: "pointer",
  float: "right"
};

class RadiationData extends React.Component {
  constructor(props) {
    super(props);
    this.radiation_pacs_flag = "ON";
    var radiation_pacs_flag = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"radiation_pacs_flag");
    if (radiation_pacs_flag != undefined && radiation_pacs_flag != null) this.radiation_pacs_flag = radiation_pacs_flag;
    this.state = {
      isOpenInspectionImageModal:false,
    };
  }

  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }

  openInspectionImageModal = async (number, type=null) => {
    let path = "/app/api/v2/order/inspection/getImage";
    if (type == "radiation") {
      path = "/app/api/v2/order/radiation/getImage";
    } else if (type == "examination") {
      path = "/app/api/v2/order/examination/getImage";
    }

    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpenInspectionImageModal:false,
    })
  }

  handleOpenPacs = (patientId) => {    
    // YJ34 PACS機能の修正
    patientApi.setVal(patientId, CACHE_LOCALNAMES.PAC_STATUS, JSON.stringify("on"));
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let patientInfo = karteApi.getPatient(current_system_patient_id);
    if(patientInfo == undefined || patientInfo == null) return;

    openPacs(patientInfo.receId, "open");
  }
  
  
  render() {
    let {data} = this.props;
    if (data === undefined || (data != undefined && Object.keys(data).length === 0)) {
      return (<></>)
    } else{
        return (
            <>
              <div className="history-item">
                <div className="phy-box w70p">
                  <div className="flex between drug-item table-row">
                    <div className="text-left">
                      <div className="table-item">{data.radiation_name =='他医撮影診断'?'日付':'検査日'}</div>
                    </div>
                    <div className="text-right">
                      <div className="table-item remarks-comment">
                        {data.treat_date == "日未定" ? "[日未定]"
                          : (formatJapanDateSlash(data.treat_date) + ((data.reserve_time != undefined && data.reserve_time != "") ? (" "+data.reserve_time) : ""))}
                        {data.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                      </div>
                    </div>
                  </div>
                  <div className="flex between drug-item table-row">
                    <div className="text-left">
                      <div className="table-item">保険</div>
                    </div>
                    <div className="text-right">
                      <div className="table-item remarks-comment cache-insurance-name">{this.getInsuranceName(data.insurance_name)}</div>
                    </div>
                  </div>
                  {data.portable_shoot != undefined && data.portable_shoot != null && data.portable_shoot != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">撮影</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">ポータブル</div>
                      </div>
                    </div>
                  )}
                  {data.radiation_data != undefined && data.radiation_data.length>0 && (
                    data.radiation_data.map(item=> {
                      return(
                        <>
                          {item.classfic_name != undefined && item.classfic_name != '' && (
                            <>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">撮影区分</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{item.classfic_name}</div>
                                </div>
                              </div>
                            </>
                          )}
                          {item.part_name != undefined && item.part_name != '' && (
                            <>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">撮影部位</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">
                                    {item.left_right_name != undefined && item.left_right_name !='' && item.left_right_name}{item.part_name}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {item.selected_directions != undefined && Object.keys(item.selected_directions).length > 0 &&
                          Object.keys(item.selected_directions).map((id, index) => {
                            return(
                              <>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    {index ==0 && (
                                      <div className="table-item">方向</div>
                                    )}
                                    {index !=0 && (
                                      <div className="table-item"></div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{item.selected_directions[id]}</div>
                                  </div>
                                </div>
                              </>
                            )
                          })
                          }
                          {data.done_order == 1 && item.done_selected_directions != undefined && Object.keys(item.done_selected_directions).length > 0 &&
                          Object.keys(item.done_selected_directions).map((id) => {
                            return(
                              <>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                      <div className="table-item"></div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">実施:{item.done_selected_directions[id]}</div>
                                  </div>
                                </div>
                              </>
                            )
                          })
                          }
                          {item.method_name != undefined && item.method_name != '' && (
                            <>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">撮影体位/方法</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{item.method_name}</div>
                                </div>
                              </div>
                            </>
                          )}
                          {item.selected_comments != undefined && Object.keys(item.selected_comments).length > 0 &&
                          Object.keys(item.selected_comments).map((id, index) => {
                            return(
                              <>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    {index ==0 && (
                                      <div className="table-item">撮影コメント</div>
                                    )}
                                    {index !=0 && (
                                      <div className="table-item"></div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{item.selected_comments[id]}</div>
                                  </div>
                                </div>
                              </>
                            )
                          })
                          }
                          {((data.done_order == 1 && item.done_shoot_count > 0) ||  item.shoot_count > 0) && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">撮影回数</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{data.done_order == 1 && item.done_shoot_count > 0 ? item.done_shoot_count : item.shoot_count}</div>
                              </div>
                            </div>
                          )}

                          {item.sub_picture != undefined && item.sub_picture != null && item.sub_picture != "" && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">分画数</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.sub_picture}</div>
                              </div>
                            </div>
                          )}

                          {item.direction_count != undefined && item.direction_count != null && item.direction_count != "" && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">方向数</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.direction_count}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item.kV >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">KV</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.kV}{item['kV_unit']}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item.mA >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">mA</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.mA}{item['mA_unit']}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item.sec >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">sec</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.sec}{item['sec_unit']}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item.FFD >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">FFD</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.FFD}{item['FFD_unit']}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item['管電圧'] >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">管電圧</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item['管電圧']}{item['管電圧_unit']}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item['トータル'] >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">トータル</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item['トータル']}{item['トータル_unit']}</div>
                              </div>
                            </div>
                          )}
                          {data.done_order == 1 && item['曝射時間'] >0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">曝射時間</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item['曝射時間']}{item['曝射時間_unit']}</div>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })
                  )}
                  {data.done_order == 1 && data.done_comment != undefined && data.done_comment != null && data.done_comment != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">実施コメント</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{displayLineBreak(data.done_comment)}</div>
                      </div>
                    </div>
                  )}
                  {data.done_order == 1 && data.shoot_done_user != undefined && data.shoot_done_user != null && data.shoot_done_user != "" && (
                    <div className="flex between drug-item table-row">
                        <div className="text-left">
                        <div className="table-item">撮影実施者</div>
                        </div>
                        <div className="text-right">
                        <div className="table-item remarks-comment">{data.shoot_done_user}</div>
                        </div>
                    </div>
                  )}

                  {(data.height > 0 || data.done_height >0) && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">身長</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.done_height > 0? data.done_height:data.height}cm</div>
                      </div>
                    </div>
                  )}
                  {(data.weight > 0 || data.done_weight >0) && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">体重</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.done_weight > 0? data.done_weight:data.weight}kg</div>
                      </div>
                    </div>
                  )}
                  {(data.surface_area > 0 || data.done_surface_area >0) && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">体表面積</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.done_surface_area > 0? data.done_surface_area:data.surface_area}㎡</div>
                      </div>
                    </div>
                  )}
                  {data.sick_name != undefined && data.sick_name != null && data.sick_name != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">臨床診断、病名</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.sick_name}</div>
                      </div>
                    </div>
                  )}
                  {data.etc_comment != undefined && data.etc_comment != null && data.etc_comment != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">
                          <p>主訴、臨床経過</p>
                          <p>検査目的、コメント</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.etc_comment}</div>
                      </div>
                    </div>
                  )}
                  {data.request_comment != undefined && data.request_comment != null && data.request_comment != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">依頼コメント</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.request_comment}</div>
                      </div>
                    </div>
                  )}
                  {data.pregnancy != undefined && data.pregnancy != null && data.pregnancy != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">妊娠</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.pregnancy}</div>
                      </div>
                    </div>
                  )}
                  {data.film_output != undefined && data.film_output != null && data.film_output != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">フィルム出力</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.film_output}</div>
                      </div>
                    </div>
                  )}
                  {data.filmsend != undefined && data.filmsend != null && data.filmsend != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">フィルム搬送先</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.filmsend}</div>
                      </div>
                    </div>
                  )}
                  {data.kind != undefined && data.kind != null && data.kind != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">区分</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.kind}</div>
                      </div>
                    </div>
                  )}
                  {data.move != undefined && data.move != null && data.move != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">移動形態</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.move}</div>
                      </div>
                    </div>
                  )}
                  {data.use != undefined && data.use != null && data.use != "" && data.use != "使用しない" && (
                      <div className="flex between drug-item table-row">
                          <div className="text-left">
                              <div className="table-item">造影剤使用</div>
                          </div>
                          <div className="text-right">
                              <div className="table-item remarks-comment">{data.use}</div>
                          </div>
                      </div>
                  )}
                  {data.inquiry != undefined && data.inquiry != null && data.inquiry != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">造影剤問診票</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.inquiry}</div>
                      </div>
                    </div>
                  )}
                  {data.selected_instructions != undefined && data.selected_instructions != null && data.selected_instructions.length > 0 && (
                    <>
                      {data.selected_instructions.map((item, index)=>{
                        return (
                          <>
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                {index ==0 && (
                                  <div className="table-item">撮影指示</div>
                                )}
                                {index !=0 && (
                                  <div className="table-item"></div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.name}</div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </>
                  )}
                  {data.selected_shootings != undefined && data.selected_shootings != null && data.selected_shootings.length > 0 && (
                    <>
                      {data.selected_shootings.map((item, index)=>{
                        return (
                          <>
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                {index ==0 && (
                                  <div className="table-item">撮影</div>
                                )}
                                {index !=0 && (
                                  <div className="table-item"></div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{item.name}</div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </>
                  )}
                  {data.other_kind != undefined && data.other_kind != null && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">分類</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.other_kind.name}</div>
                      </div>
                    </div>
                  )}
                  {data.other_kind_detail != undefined && data.other_kind_detail != null && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">分類詳細</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.other_kind_detail.name}</div>
                      </div>
                    </div>
                  )}
                  {data.other_body_part != undefined && data.other_body_part != null && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">部位</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.other_body_part}</div>
                      </div>
                    </div>
                  )}
                  {data.free_comment != undefined && data.free_comment != null && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">フリーコメント</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.free_comment}</div>
                      </div>
                    </div>
                  )}
                  {data.additions != undefined && data.additions != null && Object.keys(data.additions).length > 0 && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">追加項目</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">
                          {Object.keys(data.additions).map(addition_id => {
                            var item = data.additions[addition_id];
                            return(
                              <>
                                <div>{item.name}</div>
                              </>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {data.done_order == 1 && data.obtain_tech != undefined && data.obtain_tech != null && data.obtain_tech != '' && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item">造影剤注入手技</div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">{data.obtain_tech}</div>
                      </div>
                    </div>
                  )}
                  {data.done_order == 1 && data.details !== undefined && data.details.length>0 && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                        <div className="table-item"> </div>
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">
                          {data.details.map(detail=>{                                                  
                            if (detail.item_id > 0){
                              return(
                                <>
                                    <div><label>・{detail.name}
                                      {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                      {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                        <>
                                          {getStrLength(detail.value1) > 32 && (<br />)}
                                          <span>{detail.value1}{detail.input_item1_unit}</span><br />
                                        </>
                                      )}
                                      {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                        <>
                                          {getStrLength(detail.value2) > 32 && (<br />)}
                                          <span>{detail.value2}{detail.input_item2_unit}</span><br />                                          
                                        </>
                                      )}
                                  </div>
                                </>
                              )
                            }
                            
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {data.image_path != null && data.image_path != undefined && data.image_path != "" && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">
                          <a
                            className="soap-image-title"
                            onClick={() => this.openInspectionImageModal(data.number, "radiation")}
                            style={imageButtonStyle}
                          >
                            画像を見る
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  {this.radiation_pacs_flag == 'ON' && data.done_order == 1 && (
                    <div className="flex between drug-item table-row">
                      <div className="text-left">
                      </div>
                      <div className="text-right">
                        <div className="table-item remarks-comment">
                          <a className="soap-image-title" onClick={()=>this.handleOpenPacs(data.system_patient_id)} style={imageButtonStyle}>PACS</a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {this.state.isOpenInspectionImageModal == true && (
                <EndoscopeImageModal
                  closeModal={this.closeModal}
                  imgBase64={this.state.endoscope_image}
                />
              )}
            </>
        )        
    }    
  }
}

RadiationData.contextType = Context;

RadiationData.propTypes = {
  data: PropTypes.object,
  patientId: PropTypes.number
};

export default RadiationData;