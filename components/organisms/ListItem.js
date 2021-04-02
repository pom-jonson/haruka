import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Checkbox from "../molecules/Checkbox";
import { HOSPITALIZE_PRESCRIPTION_TYPE } from "~/helpers/constants";

const ListItemWrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border-bottom: 1px solid ${colors.disable};
  font-family: "Noto Sans JP", sans-serif;
  align-items: baseline;
  width: 100%;
  padding: 8px 0.2rem 8px 0;
  cursor: pointer;
  position: relative;

  &.open {
    padding-left: 8px;
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
      padding-left: 8px;
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
  .version-span {
    color: red;
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
    letter-spacing: 0px;
    width: auto;
    display: inline-block;
    text-align:left;
    padding-left:4px;
  }
  .patient-name {
    font-size: 12px;
    width: auto;
    display: inline-block;
    margin-left: 0px !important;
    text-align:left;
    padding-left:4px;
  }
`;

const Date = styled.span`
  color: ${colors.onSecondaryDark};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 14px;
  padding: 0 8px;
  padding-right: 0px;
`;

const Department = styled.div`
  color: ${colors.error};
  display: inline-block;
  font-size: 14px;
  padding-left: 8px;
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.notConsentedDataOneSelect !==
      this.state.notConsentedDataOneSelect
    ) {
      this.setState({
        notConsentedDataOneSelect: nextProps.notConsentedDataOneSelect
      });
    }
  }

  getRadio = (name, value) => {
    if (name === "notConsentedDataOneSelect") {
      if (this.props.deselectItem !== undefined) {
        this.props.deselectItem(this.props.orderNumber, value);
      }
    }
  };

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

  getPrescriptionCategoryName = (type) => {
    let karte_status = this.props.karte_status;
    let result = "";
    if (karte_status == 1 || karte_status == 2) {
      result = type == 0 ? "院外" : "院内";
    } else {
      result = HOSPITALIZE_PRESCRIPTION_TYPE[type].value;
    }

    return result;

  }
  openModal = () => {
    this.props.openModal(this.props.number);
  }  

  render() {
    let diagnosing_date = this.props.diagnosing_date.substr(0, 4) + "年" + this.props.diagnosing_date.substr(5, 2) + "月" + this.props.diagnosing_date.substr(8, 2) + "日";
    if (this.props.diagnosing_date_string != undefined && this.props.diagnosing_date_string != "") {
      diagnosing_date += "(" +this.props.diagnosing_date_string + ") ";
    }
    if (this.props.diagnosing_date.length > 10) {
      diagnosing_date += this.props.diagnosing_date.substr(11, 8);
    }    
    return (
      <ListItemWrapper
        className={
          "row " +
          this.props.class_name +
          (this.props.isEdit === true ? " edit" : "") +
          (this.props.is_enabled === 2 ? " deleted" : "") +
          (' pres-title pres-title-'+this.props.number)
        }
        onClick={e => this.props.onAngleClicked(e, this.props.number)}
      >
        <Date className="date">
          {this.props.isNotConsentedPopup && (
            <Checkbox
              ref={ref => (this.selectOne = ref)}
              label="選択"
              getRadio={this.getRadio.bind(this)}
              value={this.state.notConsentedDataOneSelect}
              name="notConsentedDataOneSelect"
            />
          )}
          {diagnosing_date}
        </Date>
        <Department className="department">
          <span>
            {this.props.department}/
            {this.props.karte_status == 1 ? "外来・" : this.props.karte_status == 2 ? "訪問診療・" : this.props.karte_status == 3 ? "入院・" : ""}{this.getPrescriptionCategoryName(this.props.is_internal_prescription)}
            処方
          </span>
          {this.props.is_doctor_consented !== 4 && this.props.done_order === 0 && (
            <span>未実施</span>
          )}
        </Department>
        <div className="patient-name">{this.props.patientName}</div>
        {this.props.medicine_history != undefined && this.props.medicine_history != null && this.props.medicine_history != "" && (
          <span onClick={this.openModal.bind(this)} className="version-span">
            {this.props.medicine_history.split(",").length < 10 ? (
              <>
              （0{this.props.medicine_history.split(",").length}版）
              </>
            ):(
              <>
              （{this.props.medicine_history.split(",").length}版）
              </>
            )}            
          </span>
        )}
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
      </ListItemWrapper>
    );
  }
}

ListItem.propTypes = {
  department: PropTypes.string,
  doctor_name: PropTypes.string,
  substitute_name: PropTypes.string,
  diagnosing_date: PropTypes.string,
  diagnosing_date_string: PropTypes.string,
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
  receiverName: PropTypes.string,
  isFromPrescriptionList: PropTypes.bool,
  karte_status: PropTypes.number,
  medicine_history:PropTypes.string,
  openModal:PropTypes.func,
};

export default ListItem;
