import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { onSecondaryDark } from "../_nano/colors";

const ListItemWrapper = styled.div`
  border-bottom: 1px solid ${colors.disable};
  font-family: "Noto Sans JP", sans-serif;
  align-items: baseline;
  width: 100%;
  padding: 8px 32px 8px 0;
  cursor: pointer;
  position: relative;
  background: rgb(160, 235, 255);

  &.open {
    &:before {
      content: "";
      background-color: ${colors.error};
      width: 8px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .date {
      padding-left: 16px;
    }

    .angle {
      transform: rotate(180deg);
    }
  }
  &.edit {
    background: #eee;
  }

  &.deleted {
    background: #ddd;
  }

  .doctor-name {
    margin-left: 0;
  }

  .not-consented {
    color: ${colors.error};
  }

  

  .angle {
    margin: auto;
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
`;

const NamesLabel = styled.div`
  margin-left: auto;
  text-align: right;
  .doctor-name {
    font-size: 12px;
    letter-spacing: -2px;
    width: 100px;
    display: inline-block;
  }
  .patient-name {
    font-size: 12px;
    width: 100px;
    display: inline-block;
    margin-left: 0px !important;
    font-size: 10px;
  }
`;

const Date = styled.span`
  color: ${colors.onSecondaryDark};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 14px;
  padding: 0 8px;
`;

const Department = styled.div`
  // color: ${colors.error};
  display: inline-block;
  font-size: 14px;

  span {
    margin-right: 4px;
  }
`;

const DoctorName = styled.span`
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
`;

// const Angle = styled(FontAwesomeIcon)`
//   color: ${colors.onSurface};
//   cursor: pointer;
//   display: inline-block;
//   font-size: 25px;
// `;

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notConsentedDataOneSelect: false
    };
  }

  async componentDidMount() {
    this.setState({
      notConsentedDataOneSelect:
        this.props.notConsentedDataOneSelect !== undefined
          ? this.props.notConsentedDataOneSelect
          : false
    });
  }

  getReceiverName = () => {
    if (this.props.isFromPrescriptionList) {
      if (
        this.props.receiverName !== undefined &&
        this.props.receiverName !== ""
      ) {
        return "、 薬剤師: " + this.props.receiverName;
      }
    }
    return "";
  };

  render() {
    return (
      <ListItemWrapper
        className="row"
        onClick={e => this.props.onAngleClicked(e, this.props.number)}
      >
        <Date className="date">
          {this.props.diagnosing_date.substr(0, 4)}年
          {this.props.diagnosing_date.substr(5, 2)}月
          {this.props.diagnosing_date.substr(8, 2)}日
          {this.props.diagnosing_date.length > 10 &&
            `${this.props.diagnosing_date.substr(11, 2)}時`}
          {this.props.diagnosing_date.length > 10 &&
            `${this.props.diagnosing_date.substr(14, 2)}分`}
        </Date>

        <Department className="department">
          {/* <span>
            {this.props.department}/
            {this.props.is_internal_prescription === 0 ? "院外" : "院内"}
            処方
          </span> */}
          {this.props.is_doctor_consented !== 4 && this.props.done_order === 0 && (
            <span>未実施</span>
          )}
            <span>{this.props.patientName}</span>
            <span>{this.props.patientNumber}</span>

        </Department>
        <div className="patient-name"></div>
        <NamesLabel className="name-label">
          {this.props.is_doctor_consented === 4 ? (
            <DoctorName>
              {this.props.is_enabled === 2 ? "[削除済み]" : ""}
              {this.props.doctor_name}
              <br />
              （過去データ取り込み）
            </DoctorName>
          ) : (
            <>
              {this.props.is_doctor_consented === 2 ? (
                <DoctorName>
                  {this.props.is_enabled === 2 ? "[削除済み]" : ""}
                  {this.props.doctor_name}
                  {this.getReceiverName()}
                </DoctorName>
              ) : (
                <>
                  {this.props.is_doctor_consented === 1 ? (
                    <>
                      <p>
                        <span>
                          [承認済み]
                          {this.props.is_enabled === 2 ? "[削除済み]" : ""}
                          依頼医:{" "}
                        </span>
                        <DoctorName>
                          {this.props.doctor_name}
                          {this.getReceiverName()}
                        </DoctorName>
                      </p>
                      <p>
                        <span>入力者: </span>
                        <DoctorName>
                          {this.props.substitute_name === undefined
                            ? ""
                            : this.props.substitute_name}
                        </DoctorName>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <span className="not-consented">[未承認]</span>
                        {this.props.is_enabled === 2 ? "[削除済み]" : ""}依頼医:
                        <DoctorName className="not-consented doctor-name">
                          {this.props.doctor_name}
                          {this.getReceiverName()}
                        </DoctorName>
                      </p>
                      <p>
                        <span>入力者: </span>
                        <DoctorName className="patient-name">
                          {this.props.substitute_name === undefined
                            ? ""
                            : this.props.substitute_name}
                        </DoctorName>
                      </p>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </NamesLabel>
        {/* <Angle className="angle" icon={faAngleDown} /> */}
      </ListItemWrapper>
    );
  }
}

ListItem.propTypes = {
  department: PropTypes.string,
  doctor_name: PropTypes.string,
  substitute_name: PropTypes.string,
  diagnosing_date: PropTypes.string,
  class_name: PropTypes.string,
  onAngleClicked: PropTypes.func,
  number: PropTypes.number,
  isEdit: PropTypes.bool,
  is_doctor_consented: PropTypes.number,
  done_order: PropTypes.number,
  is_enabled: PropTypes.number,
  isNotConsentedPopup: PropTypes.bool,
  notConsentedDataOneSelect: PropTypes.bool,
  orderNumber: PropTypes.number,
  getOrderNumberList: PropTypes.func,
  is_internal_prescription: PropTypes.number,
  deselectItem: PropTypes.func,
  patientName: PropTypes.func,
  patientNumber: PropTypes.func,
  receiverName: PropTypes.string,
  isFromPrescriptionList: PropTypes.bool
};

export default ListItem;
