import React from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "~/components/_nano/colors";
import LargeUserIcon from "~/components/atoms/LargeUserIcon";

const TableItemWrapper = styled.div`
  border-bottom: 1px solid ${colors.background};
  padding: 8px 16px;
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
    font-size: 12px;
    align-self: center;
  }

  .comments-box {
    align-self: center;
    color: ${colors.onSecondaryDark};
    font-size: 10px;
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
    font-size: 20px;
    margin-right: 8px;
  }

  .name {
    font-size: 14px;
    line-height: 24px;
    margin: 0 8px;
  }

  .sex {
    margin-right: 8px;
  }

  .other-department {
    font-size: 14px;
    line-height: 24px;
    margin: 0 8px;
    display: flex;
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
    font-size: 14px;
    margin-right: 8px;
    position: relative;

    .department-type {
      display: inline-block;
    }

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
  var end_treat = true;
  props.other_departments.map(department => {
    if (department.status != 3 || department.is_deleted != 0) {
      end_treat = false;
    }
  });
  return (
      <TableItemWrapper
        className={`row ${props.status == 3 && end_treat ? "end" : ""}`}
      >
        <PatientInfoBox>
          <div className="row">
            <div
              className={`department ${props.is_deleted ? "stop" : "before"}`}
            >
              {props.sex === 1 ? (
                <LargeUserIcon size="sm" color="#9eaeda" />
              ) : (
                <LargeUserIcon size="sm" color="#f0baed" />
              )}
                <span className={`department-type ${props.status==3 ? "finished" : ""}`}>
                {props.registration_type_name}
              </span>
                <span className={`ml-2 ${props.status==3 ? "finished" : ""}`}>{props.receivedId}</span>
            </div>
            <div
              className={`department patient-id ${
                props.is_deleted ? "stop" : ""
              }`}
            >
              {props.patientNumber == 0 ||
              props.patientNumber == undefined ||
              props.patientNumber.length == 0
                ? ""
                : props.patientNumber}
            </div>
            <div
              className={`department name ${props.is_deleted ? "stop" : ""}`}
            >
              {props.name}({props.age})
            </div>
            <div
              className={`department department-content ${
                props.is_deleted ? "stop" : "before"
              }`}
            >
              {props.diagnosis_type_name == 0 ||
              props.diagnosis_type_name == undefined ||
              props.diagnosis_type_name == ""
                ? ""
                : "[" + props.diagnosis_type_name + "]"}
            </div>
            <div
              className={`department other-department ${
                props.is_deleted ? "stop" : ""
              }`}
            >
              {props.other_departments.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      item.status === 3
                        ? "finished"
                        : item.status === 2
                        ? "bold"
                        : ""
                    }
                  >
                    <span className="red">{item.department}</span>
                    {item.status !== 0 && <span>[{item.number}]</span>}
                    {index < props.other_departments.length - 1 ? "、" : ""}
                    &nbsp;
                  </div>
                );
              })}
            </div>
            <div
              className={`department acceptedlist ${
                props.is_deleted ? "stop" : ""
              }`}
            >
              <div className="accepted-time">{props.accepted_datetime_str}</div>
              <div className="comments-box">{props.numbersOfComments}</div>
            </div>
          </div>
        </PatientInfoBox>
      </TableItemWrapper>
  );
};

TableItem.propTypes = {
  patientNumber: PropTypes.string,
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
  accepted_date: PropTypes.string
};
TableItem.contextType = Context;
export default TableItem;
