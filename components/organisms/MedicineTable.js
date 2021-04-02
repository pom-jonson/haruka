import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import { Link } from "react-router-dom";

// import { formatDate4API } from "../../helpers/date";
const MedicineTableWrapper = styled.div`
  width: 100%;
  background-color: ${colors.surface};
  padding-top: 86px;
  table{
    width: 100%;
  }
  .table-header {
    background-color: rgb(105, 200, 225);
    border-bottom: 1px solid #bbbbbb;
    text-align: center;
    width: 100%;
    color: white;
    display: flex;

    .yj_code {
      width: 10%;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
    .rece_item_number {
      text-align: center;
      width: 8%;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
    .name {
      width: 34%;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
    .gene_name {
      width: 34%;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
    .haruka_start_date {
      width: 17.1%;
      border-left: 1px solid #aaa;
      border-right: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
  }

  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 200px);
    overflow-y: scroll;
  }
  .no-result {
    padding: 200px;
    text-align: center;

    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }

  .odd{
    background-color: ${colors.background};
  }

  .medicinedata {
    width: 100%;
    display: flex;
    .yj_code {
      padding-left: 3px;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
      width: 10%;
    }
    .rece_item_number {
      text-align: right;
      padding-right: 3px;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
      width: 8%;
    }
    .name {
      padding-left: 3px;
      width: 34%;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
    .gene_name {
      padding-left: 3px;
      width: 34%;
      border-left: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
    .haruka_start_date {
      padding-left: 3px;
      width: 16%;
      border-left: 1px solid #aaa;
      border-right: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
    }
  }
  .haruka_start_date{
    span{
      color: orange;
    }
  }
  .zero {
    color: orange;
  }
`;

class MedicineTable extends Component {
  constructor() {
    super();
  }

  formatDateBySlash = dateStr => {
    if (!dateStr || dateStr.length < 8) return "";
    dateStr = "" + dateStr;
    return dateStr.substring(0,4) + "/" + dateStr.substring(5,7) + "/" +dateStr.substring(8,10);
  };

  render() {
    let message;
    if (!this.props.medicineList.length) {
      message = <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>;
    }
    return (
      
      <MedicineTableWrapper>
        <div>
          <div className="table-header table-bordered table-striped">
            <div className="table-item yj_code">YJコード</div>
            <div className="table-item rece_item_number">レセプト品番</div>
            <div className="table-item name">薬品名</div>
            <div className="table-item gene_name">一般名</div>
            <div className="table-item haruka_start_date">適用期間</div>
          </div>
          <div className="table-scroll">
          {this.props.medicineList.length > 0 && (
            this.props.medicineList.map( (medicine, index) => (
              <>
              <Link
                to={`/management/medicine_master/${medicine.haruka_code}`}
                className="table-item table-row"
              >
            <div className={`option table-row medicinedata ${(medicine.haruka_end_date < medicine.haruka_start_date 
                || medicine.haruka_is_enabled == 0 || medicine.rece_item_number == 0 ) ? "odd ": "even"}`} key={index}>
              <div className="table-item yj_code">{medicine.yj_code}</div>
              {medicine.rece_item_number === 0 ? (
                <div className="table-item rece_item_number zero">{medicine.rece_item_number}</div>
              ) : (
                <div className="table-item rece_item_number">{medicine.rece_item_number}</div>
              )}
              <div className="table-item name">{medicine.name}</div>
              <div className="table-item gene_name">{medicine.gene_name}</div>
              <div className="table-item haruka_start_date" dateFormat="yyyy/MM/dd">
                { medicine.haruka_start_date !== null ?this.formatDateBySlash(medicine.haruka_start_date) + "~" : ""}
                { medicine.haruka_end_date < medicine.haruka_start_date ? (<span>{this.formatDateBySlash(medicine.haruka_end_date)}</span>) : 
                this.formatDateBySlash(medicine.haruka_end_date) }
              </div>
            </div>
            </Link>
            </>
            ))
          )}
          {message}
          </div>
        </div>
      </MedicineTableWrapper>
    );
  }
}

MedicineTable.propTypes = {
  medicineList: PropTypes.array
};

export default MedicineTable;
