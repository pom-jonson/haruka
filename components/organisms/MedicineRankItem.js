import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";

const MedicineRankItemWrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border-bottom: 1px solid ${colors.disable};
  align-items: baseline;
  width: 100%;
  padding: 0px;
  cursor: pointer;
  position: relative;

  &.open {
    h4:before {
      content: "";
      background-color: ${colors.error};
      width: 8px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .angle {
      transform: rotate(180deg);
    }

    table {
      display: table !important;
    }
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
  }

  table {
    display: none !important;
  }
`;

const MedicineRankItemPrintWrapper = styled.div`
  background-color: ${colors.onSecondaryLight};  
  align-items: baseline;
  width: 100%;
  padding: 0px;
  cursor: pointer;
  position: relative;

  &.open {

    table {
      display: table !important;
    }
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
  }

  table {
    display: none !important;
  }
`;

const Table = styled.table`
  width: 100%;

  tr > td:first-child {
    text-align: center;
    width: 75px;
  }

  tr > td:nth-child(2) {
    text-align: right;
    width: calc(100% - 75px);
  }

  &,
  tr,
  td {
    border: 1px solid rgb(213, 213, 213);
  }
`;

const TablePrint = styled.table`
  width: 100%;

  tr > td:first-child {
    text-align: center;
    width: 75px;
  }

  tr > td:nth-child(2) {
    text-align: right;
    width: calc(100% - 75px);
  }

  &,
  tr,
  td {
    border: 1px solid rgb(213, 213, 213);
    border-left: 0px solid rgb(213, 213, 213);
  }
`;

const H4 = styled.h4`
  font-size: 0.9rem;
  line-height: 2.5rem;
  position: relative;
  font-family: NotoSansJP;
  padding: 0px 8px;
  margin: 0px;
  width: 100%;

  .medicine_information_print{
    display: inline-block;
    position: absolute;
    right: 5px;
    margin: auto;
    top: 5px;
    bottom: 0px;

    .info_row {
      display: block;
      text-align: right;
      line-height: 1rem;
      font-size: 0.75rem;

      .info_item {
        display: inline-block;
        width: auto;
        font-size: 0.75rem;
        margin-left: 4px;

        &.times {
          text-align: left;
          min-width: 6rem;
        }

        span {
          display: inlin-block;
          width: 33.3333%;
          text-align: right;
          font-size: 0.75rem;
        }
      }
    }
  }

  .medicine_information {
    display: inline-block;
    position: absolute;
    right: 35px;
    margin: auto;
    top: 0px;
    bottom: 0px;

    .info_row {
      display: block;
      text-align: right;
      line-height: 1rem;
      font-size: 0.75rem;

      .info_item {
        display: inline-block;
        width: auto;
        font-size: 0.75rem;
        margin-left: 4px;

        &.times {
          text-align: left;
          min-width: 6rem;
        }

        span {
          display: inlin-block;
          width: 33.3333%;
          text-align: right;
          font-size: 0.75rem;
        }
      }
    }
  }
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${colors.onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
`;

class MedicineRankItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  onDragStart = (e, number) => {
    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }

    e.dataTransfer.setData("text", "rank:" + number);

    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    } 
  };

  render() {
    const keyName = {
      name: "名称",
      gene_name: "一般名",
      count: "処方回数",
      first_use_date: "初回",
      latest_use_date: "最終",
      usage: "使用",
      normal: "情報"
    };

    const h4_content = (
      <>
        <div style={{width:"75%"}}
          onClick={e => this.props.onAngleClicked(e, this.props.medicine.code)}
        >
          {this.props.medicine.name}
        </div>
        {this.props.modal_type != "rank_print" && (
          <Angle
            className="angle"
            icon={faAngleDown}
            onClick={e => this.props.onAngleClicked(e, this.props.medicine.code)}
          />
        )}
        <div
          className={this.props.modal_type != "rank_print" ? "medicine_information" : "medicine_information_print"}
          onClick={e => this.props.onAngleClicked(e, this.props.medicine.code)}
        >
          <div className="info_row">
            <div
              className="info_item times"
              onClick={e =>
                this.props.onAngleClicked(e, this.props.medicine.code)
              }
            >
              <span
                onClick={e =>
                  this.props.onAngleClicked(e, this.props.medicine.code)
                }
              >
                {keyName.count}
              </span>
              <span>:</span>
              {this.props.medicine.count}
            </div>
            <div
              className="info_item"
              onClick={e =>
                this.props.onAngleClicked(e, this.props.medicine.code)
              }
            >
              <span
                onClick={e =>
                  this.props.onAngleClicked(e, this.props.medicine.code)
                }
              >
                {keyName.latest_use_date}
              </span>
              <span>:</span>
              {this.props.medicine.latest_use_date}
            </div>
          </div>
          <div
            className="info_row"
            onClick={e =>
              this.props.onAngleClicked(e, this.props.medicine.code)
            }
          >
            <span
              onClick={e =>
                this.props.onAngleClicked(e, this.props.medicine.code)
              }
            >
              {keyName.first_use_date}
            </span>
            <span>:</span>
            {this.props.medicine.first_use_date}
          </div>
        </div>
      </>
    );

    return (
      <>
        {this.props.modal_type == "rank_print" ? (
          <MedicineRankItemPrintWrapper
            className={
              "row " +
              this.props.class_name +
              (this.props.isEdit === true ? " edit" : "")
            }
          >
            <H4
              onClick={e => this.props.onAngleClicked(e, this.props.medicine.code)}
              className="draggable"
              draggable
              onDragStart={e => this.onDragStart(e, this.props.medicine.code)}
            >
              {h4_content}
            </H4>
            <TablePrint>
              <tr>
                <td>{keyName.gene_name}</td>
                <td>{this.props.medicine.gene_name}</td>
              </tr>
              <tr>
                <td>{keyName.count}</td>
                <td>{this.props.medicine.count}</td>
              </tr>
              <tr>
                <td>{keyName.usage}</td>
                <td>
                  {this.props.medicine.usages.map(usage => {
                    return (
                      <p key={usage.code}>
                        {usage.name}({usage.count}回)
                      </p>
                    );
                  })}
                </td>
              </tr>
            </TablePrint>
          </MedicineRankItemPrintWrapper>
        ) : (
          <MedicineRankItemWrapper
            className={
              "row " +
              this.props.class_name +
              (this.props.isEdit === true ? " edit" : "")
            }
          >
            <H4
              onClick={e => this.props.onAngleClicked(e, this.props.medicine.code)}
              className="draggable"
              draggable
              onDragStart={e => this.onDragStart(e, this.props.medicine.code)}
            >
              {h4_content}
            </H4>
            <Table>
              <tr>
                <td>{keyName.gene_name}</td>
                <td>{this.props.medicine.gene_name}</td>
              </tr>
              <tr>
                <td>{keyName.count}</td>
                <td>{this.props.medicine.count}</td>
              </tr>
              <tr>
                <td>{keyName.usage}</td>
                <td>
                  {this.props.medicine.usages.map(usage => {
                    return (
                      <p key={usage.code}>
                        {usage.name}({usage.count}回)
                      </p>
                    );
                  })}
                </td>
              </tr>
            </Table>
          </MedicineRankItemWrapper>
        )}
      </>
    );
  }
}

MedicineRankItem.propTypes = {
  onAngleClicked: PropTypes.func,
  medicine: PropTypes.array,
  isEdit: PropTypes.bool,
  class_name: PropTypes.string,
  modal_type: PropTypes.string,
  code: PropTypes.number
};

export default MedicineRankItem;
