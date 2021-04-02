import React, { useContext } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import LargeUserIcon from "../atoms/LargeUserIcon";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import * as localApi from "~/helpers/cacheLocal-utils";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const TableItemWrapper = styled.div`
  border-bottom: 1px solid ${colors.background};
  // padding: 8px 16px;
  width: 100%;

  &.row,
  .row {
    margin: 0;
  }

  &.end {
    background-color: #dedede;
    .department {
      opacity: 0.5;
    }
    .other-department .finished {
      opacity: 1;
    }
  }

  p {
    margin: 0 8px 0 0;
  }

  .accepted-time {
    font-size: 1rem;
    align-self: center;    
    height: 1.5rem;
    line-height: 1.5rem;
  }

  .comments-box {
    align-self: center;
    color: ${colors.onSecondaryDark};
    font-size: 1rem; 
    height: 1.5rem;
    line-height: 1.5rem;
  }

  &:hover {
    background-color: ${colors.secondary200};
    .name,
    .comments-box {
      color: ${colors.secondary600};
      text-decoration: underline;
    }
  }
`;

const PatientInfoBox = styled.div`
  width: 100%;

  .row {
    align-items: center;
  }

  .fa-sm {
    font-size: 1.25rem;
    margin-right: 8px;
  }

  .name {
    font-size: 1rem;
    line-height: 24px;
    // margin: 0 8px;
  }

  .sex {
    margin-right: 8px;
  }
  
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }

  .other-department {
    font-size: 1rem;
    line-height: 24px;
    .red {
      color: rgb(241, 86, 124);
    }
    .finished {
      span {
        color: ${colors.onSurface};
        opacity: 0.5;
      }
    }
    .bold {
      font-weight: bold;
    }
  }

  .department {
    font-size: 1rem;
    // margin-right: 8px;
    position: relative;

    span.finished {
      color: rgb(0, 0, 0);
      opacity: 0.5;      
    }

    /* 診療前の場合 */
    &.before {
      color: ${colors.error};
      font-weight: bold;
    }

    /* 診療後の場合 */
    &.after {
      color: ${colors.midEmphasis};
    }

    /* 診療中止の場合 */
    &.stop {
      color: ${colors.disable};
      &:before {
        content: "";
        width: 100%;
        height: 1px;
        border-top: solid 1px ${colors.disable};
        position: absolute;
        left: 0;
        top: calc(50% - 3px);
        opacity: 0.5;
      }
      &:after {
        content: "";
        width: 100%;
        height: 1px;
        border-bottom: solid 1px ${colors.disable};
        position: absolute;
        left: 0;
        bottom: calc(50% - 3px);
        opacity: 0.5;
      }
    }
  }
`;



const TableItem = props => {
  const { patientsList } = useContext(Context);

  var end_treat = true;
  props.other_departments.map(department => {
    if (department.status != 3 || department.is_deleted != 0) {
      end_treat = false;
    }
  });
  let patient_id = props.systemPatientId;
  let isExist = false;
  if(patientsList != null && patientsList != undefined && patientsList.length > 0) {
    patientsList.map(item=>{
      if (item.system_patient_id == patient_id) {
        isExist = true;
      }
    });
  }

  return (
    <div
      className="table-item table-row"
      style={{cursor:'pointer'}}
    >
      <TableItemWrapper
        className={`row ${props.status == 3 && end_treat ? "end" : ""}`}
      >
        <PatientInfoBox>
          <div className={'row-' + props.index + (props.selected_index == props.index ? ' selected' : '')} style={{display:"flex"}}>
            <div className={`department patient-sex ${props.is_deleted ? "stop" : "before"}`}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);
              }}>
              {props.sex === 1 ? (
                <LargeUserIcon size="sm" color="#9eaeda" />
              ) : (
                <LargeUserIcon size="sm" color="#f0baed" />
              )}
            </div>
            <div className={`department department-name ${props.is_deleted ? "stop" : "before"} ${props.status==3 ? "finished" : ""}`}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}>
              {props.registration_type_name}
            </div>
            <div className={`department patient-id ${props.is_deleted ? "stop" : "before"} ${props.status==3 ? "finished" : ""}`} style={{textAlign:"right"}}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}>
              {props.receivedId}
            </div>
            <div className={`department patient-id ${props.is_deleted ? "stop" : ""}`} style={{textAlign:"right"}}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}>
              {props.patientNumber == 0 ||
              props.patientNumber == undefined ||
              props.patientNumber.length == 0
                ? ""
                : props.patientNumber}
            </div>
            <div className={`department patient-name ${props.is_deleted ? "stop" : ""}`}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}
            >
              {props.name}({props.age})
            </div>
            <div
              className={`department department-content ${props.is_deleted ? "stop" : "before"}`}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}
            >
              {props.diagnosis_type_name == 0 || props.diagnosis_type_name == undefined || props.diagnosis_type_name == "" ? "" : "[" + props.diagnosis_type_name + "]"}&nbsp;
            </div>
            <div
              className={`department other-department ${props.is_deleted ? "stop" : ""}`}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}
            >
              {props.other_departments.length == 0 ? (<>&nbsp;</>):(
                <>
                  {props.other_departments.map((item, index) => {
                    return (
                      <div key={index} className={item.status === 3 ? "finished" : item.status === 2 ? "bold": ""}>
                        <span className="red">{item.department}</span>
                        {item.status !== 0 && <span>[{item.number}]</span>}
                        {index < props.other_departments.length - 1 ? "、" : ""}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className={`department acceptedlist ${props.is_deleted ? "stop" : ""}`} style={{textAlign:"right"}}
              onClick={() => {
                if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                  window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                  return;
                }
                // save before page
                let url_path = window.location.href.split("#");
                localApi.setValue("system_before_page", url_path[1]);
                props.checkKarteMode(props);                
              }}>
              <span className="accepted-time">{props.accepted_datetime_str}</span>
              <span className="comments-box">{props.numbersOfComments}</span> &nbsp;
            </div>
            <div className="base-data" onClick={() => {props.openBasicInfo(props)}} style={props.is_exist_basic_data == 1 ? {color: "blue"} : {color:"red"}}>
              {props.is_exist_basic_data == 1? "入力有":"未入力"}
            </div>
            <div
              className="emphasis-icon"
              style={{backgroundColor:(props.emphasis_icon_info != undefined && props.emphasis_icon_info != null && props.emphasis_icon_info.length > 0
                  && props.emphasis_icon_info[0]['background-color'] != undefined) ? props.emphasis_icon_info[0]['background-color'] : ""}}
               onClick={() => {
                 if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
                   window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
                   return;
                 }
                 // save before page
                 let url_path = window.location.href.split("#");
                 localApi.setValue("system_before_page", url_path[1]);
                 props.checkKarteMode(props);
               }}
            >
              {props.emphasis_icon_info != undefined && props.emphasis_icon_info != null && props.emphasis_icon_info.length > 0 && (
                props.emphasis_icon_info.map((icon_info)=>{
                  let icon_over_text = icon_info['icon_over_text'] != undefined ? icon_info['icon_over_text'] : "";
                  return (
                    <>
                      {icon_over_text  != "" ? (
                        <OverlayTrigger
                          placement={props.index == 0 ? "bottom" : "top"}
                          overlay={renderTooltip(icon_over_text)}>
                          <div className={'icon-character'} style={{color:(icon_info['icon_character_color'] != undefined ? icon_info['icon_character_color'] : "")}}>
                            {icon_info['icon_character']}
                          </div>
                        </OverlayTrigger>
                      ):(
                        <div className={'icon-character'} style={{color:(icon_info['icon_character_color'] != undefined ? icon_info['icon_character_color'] : "")}}>
                          {icon_info['icon_character']}
                        </div>
                      )}
                    </>
                  )
                })
              )}
            </div>
          </div>
        </PatientInfoBox>
      </TableItemWrapper>
    </div>
  );
};

TableItem.propTypes = {
  patientNumber: PropTypes.string,
  index: PropTypes.number,
  selected_index: PropTypes.number,
  systemPatientId: PropTypes.number,
  receivedId: PropTypes.number,
  name: PropTypes.string,
  sex: PropTypes.number,
  age: PropTypes.number,
  inOut: PropTypes.number,
  accepted_datetime_str: PropTypes.string,
  department: PropTypes.string,
  department_code: PropTypes.number,
  diagnosis_type: PropTypes.number,
  diagnosis_type_name: PropTypes.string,
  registration_type: PropTypes.string,
  registration_type_name: PropTypes.string,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
  mainDoctor: PropTypes.string,
  mainNurse: PropTypes.string,
  numbersOfComments: PropTypes.number,
  status: PropTypes.number,
  is_deleted: PropTypes.number,
  deleted_at: PropTypes.string,
  other_departments: PropTypes.array,
  accepted_date: PropTypes.string,
  is_exist_basic_data: PropTypes.number,
  checkKarteMode: PropTypes.func,
  openBasicInfo: PropTypes.func,
  emphasis_icon_info: PropTypes.array,
};

export default TableItem;
