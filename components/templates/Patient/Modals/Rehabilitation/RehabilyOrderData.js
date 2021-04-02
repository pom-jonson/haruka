import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {disable, midEmphasis, secondary200} from "../../../../_nano/colors";
import styled from "styled-components";
import {displayLineBreak} from "~/helpers/dialConstants";
import {REHABILY_DISEASE} from "~/helpers/constants";
import {formatJapanDateSlash} from "~/helpers/date";
// import * as sessApi from "~/helpers/cacheSession-utils";

const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};  
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";  
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .phy-box{
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 200px;
    }    

    .text-left{
      .table-item{
        width: 150px;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .line-through {
    color: #ff0000;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;      
    }
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 75px;    
  }
  .number .rp{
    text-decoration-line: underline;
  }

  .unit{
    text-align: right;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
    word-break: break-all;
    label {
      margin-bottom: 0;
    }
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  p {
    margin-bottom: 0;
  }

`;

class RehabilyOrderData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.font_props = 1;        
  }  

  getInsuranceName = (_insuranceName) => {
    let result = "既定";

    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;

    return _insuranceName
  }

  render() {
    this.font_props = this.context.font_props;
    let {rehabily_data} = this.props;
    let status_type_array = {1:"開始", 2:"変更", 3:"中止", 4:"終了"};
    let disease_type_array = {1:"急性", 2:"慢性"};
    let start_place_array = {1:"ベッドサイドより", 2:"リハ医療室にて", 3:"院内にて", 4:"院外にて"};
    if (rehabily_data === undefined && Object.keys(rehabily_data).length === 0) {
      return (<></>)
    } else
      return (
          <>
              <MedicineListWrapper font_props = {this.props.font_props} className="rehabily-content">
                <div className="open order">
                  <div className="history-item">
                    <div className="phy-box w70p" draggable="true">
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">依頼日</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">
                            {rehabily_data.request_date !== undefined && rehabily_data.request_date != null && rehabily_data.request_date !== "" ? formatJapanDateSlash(rehabily_data.request_date) : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">保険</div>
                        </div>
                        <div className="text-right">
                          <div className={"table-item remarks-comment " + (this.props.edit_flag ? "cache-insurance-name" : "")}>
                            {this.props.edit_flag ? this.getInsuranceName(this.props.patient_insurance_name) : this.getInsuranceName(rehabily_data.insurance_name)}
                          </div>
                        </div>
                      </div>
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">依頼医</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">
                            {rehabily_data.request_doctor_name !== undefined && rehabily_data.request_doctor_name != null && rehabily_data.request_doctor_name !== "" ? rehabily_data.request_doctor_name : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">処方日</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">
                            {rehabily_data.prescription_date !== undefined && rehabily_data.prescription_date != null && rehabily_data.prescription_date !== "" ? formatJapanDateSlash(rehabily_data.prescription_date) : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">処方医</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">
                            {rehabily_data.prescription_doctor_name !== undefined && rehabily_data.prescription_doctor_name != null && rehabily_data.prescription_doctor_name !== "" ? rehabily_data.prescription_doctor_name : ""}
                          </div>
                        </div>
                      </div>
                      {rehabily_data.status_type !== undefined && rehabily_data.status_type != null && rehabily_data.status_type !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item"></div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {rehabily_data.status_type !== undefined && rehabily_data.status_type != null && rehabily_data.status_type !== "" ? status_type_array[rehabily_data.status_type] : ""}
                            </div>
                          </div>
                        </div>
                      )}
                      {rehabily_data.done_want_date !== undefined && rehabily_data.done_want_date != null && rehabily_data.done_want_date !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">実施希望日</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {rehabily_data.done_want_date !== undefined && rehabily_data.done_want_date != null && rehabily_data.done_want_date !== "" ? formatJapanDateSlash(rehabily_data.done_want_date) : ""}
                            </div>
                          </div>
                        </div>
                      )}
                      {rehabily_data.calculation_start_date !== undefined && rehabily_data.calculation_start_date != null && rehabily_data.calculation_start_date !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">起算日</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {rehabily_data.calculation_start_date !== undefined && rehabily_data.calculation_start_date != null && rehabily_data.calculation_start_date !== "" ? formatJapanDateSlash(rehabily_data.calculation_start_date) : ""}
                            </div>
                          </div>
                        </div>
                      )}
                      {rehabily_data.free_comment !== undefined && rehabily_data.free_comment != null && rehabily_data.free_comment !== "" && (
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">経過・RISK・合併症等</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">
                            {rehabily_data.free_comment !== undefined && rehabily_data.free_comment != null && rehabily_data.free_comment !== "" ? displayLineBreak(rehabily_data.free_comment) : ""}
                          </div>
                        </div>
                      </div>
                      )}
                      {rehabily_data.special_comment !== undefined && rehabily_data.special_comment != null && rehabily_data.special_comment !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">特記事項</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {rehabily_data.special_comment !== undefined && rehabily_data.special_comment != null && rehabily_data.special_comment !== "" ? displayLineBreak(rehabily_data.special_comment) : ""}
                            </div>
                          </div>
                        </div>
                      )}
                      {rehabily_data.fault_name_array !== undefined && rehabily_data.fault_name_array != null && rehabily_data.fault_name_array.length > 0 && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">障害名</div>
                          </div>
                          <div className="text-right">
                            {rehabily_data.fault_name_array.map(basic_item=>{
                              return (
                                <div className="table-item remarks-comment" key={basic_item}>
                                  {basic_item}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      {rehabily_data.start_place !== undefined && rehabily_data.start_place != null && rehabily_data.start_place !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">開始希望場所</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {rehabily_data.start_place !== undefined && rehabily_data.start_place != null && rehabily_data.start_place !== "" ? start_place_array[rehabily_data.start_place] : ""}
                            </div>
                          </div>
                        </div>
                      )}
                      {rehabily_data.basic_policy_array !== undefined && rehabily_data.basic_policy_array != null && rehabily_data.basic_policy_array.length > 0 && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">基本方針</div>
                          </div>
                          <div className="text-right">
                            {rehabily_data.basic_policy_array.map(basic_item=>{
                              return (
                                <div className="table-item remarks-comment" key={basic_item}>
                                  {basic_item}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      {rehabily_data.social_goal_array !== undefined && rehabily_data.social_goal_array != null && rehabily_data.social_goal_array.length > 0 && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">社会的ゴール</div>
                          </div>
                          <div className="text-right">
                            {rehabily_data.social_goal_array.map(basic_item=>{
                              return (
                                <div className="table-item remarks-comment" key={basic_item}>
                                  {basic_item}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              {rehabily_data.disease_list !== undefined && rehabily_data.disease_list != null && rehabily_data.disease_list.length > 0 &&rehabily_data.disease_list.map(disease_item=>{
                return (
                  <>
                    <div className="open order">
                      <div className="history-item">
                        <div className="phy-box w70p" draggable="true">
                          {disease_item.disease_name !== undefined && disease_item.disease_name !== "" && (
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">病名</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{disease_item.disease_name}</div>
                                </div>
                              </div>
                          )}
                          {disease_item.occur_date !== undefined && disease_item.occur_date !== "" && (
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">発症日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{(disease_item.occur_date !== undefined && disease_item.occur_date != null && disease_item.occur_date !== '') ? formatJapanDateSlash(disease_item.occur_date) : ''}</div>
                                </div>
                              </div>
                          )}
                          {disease_item.treat_start_date !== undefined && disease_item.treat_start_date !== "" && (
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">{disease_item.date_type != undefined && disease_item.date_type != null ? REHABILY_DISEASE[disease_item.date_type] : ""}</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{disease_item.treat_start_date != null ? formatJapanDateSlash(disease_item.treat_start_date) : ""}</div>
                                </div>
                              </div>
                          )}
                          {disease_item.start_date !== undefined && disease_item.start_date !== "" && (
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">病名登録日</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{(disease_item.start_date !== undefined && disease_item.start_date != null && disease_item.start_date !== '') ? formatJapanDateSlash(disease_item.start_date) : ''}</div>
                                </div>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )
              })}
              {rehabily_data.developed_date_for_add !== undefined && rehabily_data.developed_date_for_add != null && rehabily_data.developed_date_for_add != '' && (
                <div className="open order">
                  <div className="history-item">
                    <div className="phy-box w70p" draggable="true">
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">
                            {rehabily_data.early_rehabilitation_date_type != undefined && rehabily_data.early_rehabilitation_date_type != null && (
                              <><span>早期リハビリテーション</span><br /><span>{REHABILY_DISEASE[rehabily_data.early_rehabilitation_date_type]}</span></>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">{(rehabily_data.developed_date_for_add !== undefined && rehabily_data.developed_date_for_add != null && rehabily_data.developed_date_for_add !== '') ? formatJapanDateSlash(rehabily_data.developed_date_for_add) : ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                <div className="open order">
                  <div className="history-item">
              <div className="phy-box w70p" draggable="true">
              <div className="flex between drug-item table-row">
                <div className="text-left">
                  <div className="table-item">リハビリ直告病患</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment">
                    {rehabily_data.disease_type !== undefined && rehabily_data.disease_type != null && rehabily_data.disease_type !== "" ? disease_type_array[rehabily_data.disease_type] : ""}
                  </div>
                </div>
              </div>
              {rehabily_data.acute_date !== undefined && rehabily_data.acute_date != null && rehabily_data.acute_date !== "" && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">急性憎悪日</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {rehabily_data.acute_date !== undefined && rehabily_data.acute_date != null && rehabily_data.acute_date !== "" ? formatJapanDateSlash(rehabily_data.acute_date) : ""}
                    </div>
                  </div>
                </div>
              )}
              {rehabily_data.abandoned_syndrome_date !== undefined && rehabily_data.abandoned_syndrome_date != null && rehabily_data.abandoned_syndrome_date !== "" && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">廃用症候群憎悪日</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {rehabily_data.abandoned_syndrome_date !== undefined && rehabily_data.abandoned_syndrome_date != null && rehabily_data.abandoned_syndrome_date !== "" ? formatJapanDateSlash(rehabily_data.abandoned_syndrome_date) : ""}
                    </div>
                  </div>
                </div>
              )}
              {rehabily_data.acute_disease_start_date !== undefined && rehabily_data.acute_disease_start_date != null && rehabily_data.acute_disease_start_date !== "" && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">急性期疾患起算日</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {rehabily_data.acute_disease_start_date !== undefined && rehabily_data.acute_disease_start_date != null && rehabily_data.acute_disease_start_date !== "" ? formatJapanDateSlash(rehabily_data.acute_disease_start_date) : ""}
                    </div>
                  </div>
                </div>
              )}
              {rehabily_data.infection_exist !== undefined && rehabily_data.infection_exist != null && rehabily_data.infection_exist !== "" && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">感染症</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {rehabily_data.infection_exist === 1 ? "有" : "無"}
                    </div>
                  </div>
                </div>
              )}
              </div>
              </div>
              </div>
              {rehabily_data.detail !== undefined && rehabily_data.detail != null && Object.keys(rehabily_data.detail).map(index=>{
                let detail_tab_item = rehabily_data.detail[index];
                return(
                    detail_tab_item.map(detail_item=>{
                      return (
                          <>
                              <div className="open order">
                                <div className="history-item">
                                  <div className="phy-box w70p" draggable="true">
                                    {detail_item.therapy_item1_name != undefined && detail_item.therapy_item1_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">療法項目１</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{detail_item.therapy_item1_name}</div>
                                          </div>
                                        </div>
                                    )}
                                    {detail_item.therapy_item2_name != undefined && detail_item.therapy_item2_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">療法項目２</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{detail_item.therapy_item2_name}
                                            {detail_item.therapy_item2_amount != undefined && detail_item.therapy_item2_amount != '' ? 
                                            " " + detail_item.therapy_item2_amount + (detail_item.therapy_item2_unit != undefined ? detail_item.therapy_item2_unit : ""):""}</div>
                                          </div>
                                        </div>
                                    )}
                                    {detail_item.position1_name != undefined && detail_item.position1_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">部位1</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{detail_item.position1_name}</div>
                                          </div>
                                        </div>
                                    )}

                                    {detail_item.position2_name != undefined && detail_item.position2_name != "" && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">部位2</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">{detail_item.position2_name}</div>
                                          </div>
                                        </div>
                                    )}
                                    {detail_item.item_details !== undefined && detail_item.item_details != null && detail_item.item_details.length > 0 && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item"/>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {detail_item.item_details.map(sub_item=>{
                                                return (
                                                  <div key={sub_item}>
                                                    {sub_item.item_name !== undefined && sub_item.item_name != null && sub_item.item_name !== "" && (
                                                      <label>{sub_item.item_name}{((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""}</label>
                                                    )}
                                                    {sub_item.format1 != null && sub_item.format1 != undefined && sub_item.format1.includes("年") && sub_item.format1.includes("月") ? (
                                                      <label>
                                                        {sub_item.value1 != null && sub_item.value1 != undefined && (                                                                                  
                                                            <label>{(sub_item.value1_format !== undefined) ? sub_item.value1_format : sub_item.value1}</label>
                                                        )}
                                                        {sub_item.value2 != null && sub_item.value2 != undefined && (
                                                            <> ~ <label>{(sub_item.value2_format !== undefined) ? sub_item.value2_format : sub_item.value2}</label></>
                                                        )}
                                                      </label>                                                                            
                                                    ):(
                                                      <label>
                                                        {sub_item.value1 != null && sub_item.value1 != undefined && (
                                                            <label>{sub_item.value1}</label>
                                                        )}
                                                        {sub_item.value2 != null && sub_item.value2 != undefined && (
                                                            <label>{sub_item.value2}</label>
                                                        )}
                                                      </label>
                                                    )} 
                                                    {sub_item.lot !== undefined && sub_item.lot != null && sub_item.lot !== "" && (
                                                      <label>{sub_item.lot}{((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""}</label>
                                                    )}
                                                  </div>
                                                )}
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {rehabily_data.additions != undefined && Object.keys(rehabily_data.additions).length > 0 && (
                                <div className="open order">
                                  <div className="history-item">
                                    <div className="phy-box w70p" draggable="true">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">追加指示等</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {Object.keys(rehabily_data.additions).map(addition=>{
                                              return(
                                                  <>
                                                    <span>{rehabily_data.additions[addition].name}</span><br />
                                                  </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </>
                      )
                    })
                )

              })}
              </MedicineListWrapper>
          </>
      )
  }
}

RehabilyOrderData.contextType = Context;

RehabilyOrderData.propTypes = {
  rehabily_data: PropTypes.object,
  font_props: PropTypes.number,
  edit_flag: PropTypes.bool,
  patient_insurance_name: PropTypes.string,
};

export default RehabilyOrderData;