import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {disable, midEmphasis, secondary200} from "../../../../_nano/colors";
import styled from "styled-components";
import {formatJapanDateSlash} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";

const MedicineListWrapper = styled.div`
  font-size: 12px;

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

  .patient-name {
    margin-left: 16px;
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

class MedicineGuidanceOrderData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  getDoctorName = (doctor_code) => {
      let doctor_data = sessApi.getDoctorList();
      let doctor = doctor_data.find(x=>x.doctor_code == doctor_code);
      if (doctor != undefined && doctor != null) {
          return doctor.name;
      } else {
          return "";
      }
  }

  render() {
    let {cache_data} = this.props;
    if (cache_data === undefined && Object.keys(cache_data).length === 0) {
      return (<></>)
    } else
      return (
          <>
              <MedicineListWrapper>
                <div className="open order">
                  <div className={"history-item" + (cache_data.isForUpdate == 1?' line-done':'')}>
                    <div className="phy-box w70p" draggable="true">
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">同意日</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">
                            {cache_data.consent_date !== undefined && cache_data.consent_date != null && cache_data.consent_date !== "" ? formatJapanDateSlash(cache_data.consent_date) : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">医師名</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">{cache_data.doctor_id !== undefined ? this.getDoctorName(cache_data.doctor_id) : ''}</div>
                        </div>
                      </div>
                      <div className="flex between drug-item table-row">
                        <div className="text-left">
                          <div className="table-item">服薬指導可・不可</div>
                        </div>
                        <div className="text-right">
                          <div className="table-item remarks-comment">{cache_data.medication_instruction_flag == 1 ? "可" : "不可"}</div>
                        </div>
                      </div>
                      {cache_data.guidance_date !== undefined && cache_data.guidance_date != null && cache_data.guidance_date !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">指導開始日</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {formatJapanDateSlash(cache_data.guidance_date)}
                            </div>
                          </div>
                        </div>
                      )}
                      {cache_data.drug_instruction_flag !== undefined && cache_data.drug_instruction_flag != null && cache_data.drug_instruction_flag !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item"></div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {cache_data.drug_instruction_flag == 0 ? "麻薬指導なし" : "麻薬指導あり"}
                            </div>
                          </div>
                        </div>
                      )}
                      {cache_data.disease_name_flag !== undefined && cache_data.home_instruction_flag != null && cache_data.home_instruction_flag !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item"></div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {cache_data.home_instruction_flag == 0 ? "在宅指導なし" : "在宅指導あり"}
                            </div>
                          </div>
                        </div>
                      )}
                      {cache_data.disease_name_flag !== undefined && cache_data.disease_name_flag != null && cache_data.disease_name_flag !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item"></div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {cache_data.disease_name_flag == 0 ? "在宅指導なし" : "病名等未告知あり"}
                            </div>
                          </div>
                        </div>
                      )}
                      {cache_data.patient_description !== undefined && cache_data.patient_description != null && cache_data.patient_description !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">患者への説明</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {cache_data.patient_description}
                            </div>
                          </div>
                        </div>
                      )}
                      {cache_data.impossible_reason !== undefined && cache_data.impossible_reason != null && cache_data.impossible_reason !== "" && (
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">不可理由</div>
                          </div>
                          <div className="text-right">
                            <div className="table-item remarks-comment">
                              {cache_data.impossible_reason}
                            </div>
                          </div>
                        </div>
                      )}
                      {cache_data.request_contents_array !== undefined && cache_data.request_contents_array != null && cache_data.request_contents_array.length > 0 && (
                        <>
                        <div className="flex between drug-item table-row">
                          <div className="text-left">
                            <div className="table-item">指導依頼内容</div>
                          </div>
                          <div className="text-right">
                            {cache_data.request_contents_array.map(basic_item=>{
                              return (
                                <div className="table-item remarks-comment" key={basic_item}>
                                  {basic_item.guidance_medication_name}
                                </div>
                              )
                            })}
                            {cache_data.other_request_content != undefined && cache_data.other_request_content != "" && (
                              <div className="table-item remarks-comment">
                                {cache_data.other_request_content}
                              </div>
                            )}
                          </div>
                        </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              
              </MedicineListWrapper>
          </>
      )
  }
}

MedicineGuidanceOrderData.contextType = Context;

MedicineGuidanceOrderData.propTypes = {
  cache_data: PropTypes.object,
};

export default MedicineGuidanceOrderData;
