import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../atoms/Button";
import * as apiClient from "../../api/apiClient";
import MedicineDetailModal from "../organisms/MedicineDetailModal";

const Item = styled.li`
  display: block;
  overflow: hidden;

  &.duplicate-reject{
    background: #FF9999;
    border-radius: 20px;
    padding-left: 10px;
  }
  &.disabled {
    background: #FFFFCC;
    color: #999;
    border-radius: 20px;
    padding-left: 10px;
  }
  &.duplicate-alert{
    background: #FFFFCC;
    border-radius: 20px;
    padding-left: 10px;
  }  
  &.focused {
    display: block;
    background: #a0ebff;
    border-radius: 13.5px;
    color: black;
    padding-left: 10px;
  }

  .medicine_name {
    float:left;
  }

  .btn_detail {
    float:right;
  }

  .prefix{
    min-width: 30px;
    width: 30px;
    float: left;
    display: list-item;
  }
`;

class SmallMedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMedicineDetail: false,
      medicineDetail: []
    }
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  insertMed = () => {
    // if (this.props.className.includes("disabled")) return;
    this.props.insertMed(
      this.props.medicine,
      this.props.indexOfInsertPres,
      this.props.indexOfInsertMed,     
    );
    this.props.onHideDlg();
  };

 insertMedClick = (e) => {
    // if (this.props.className.includes("disabled")) return;
    if(e.target.tagName !== "SPAN" && e.target.tagName !== "BUTTON") {
      this.props.insertMed(
        this.props.medicine,
        this.props.indexOfInsertPres,
        this.props.indexOfInsertMed,     
      );
      // this.props.onHideDlg();

    }
  };


  simulateClick() {    
    if (this.props.className === "focused" && this.props.isEnter) {
      this.insertMed();
    }
  }

  onMouseOver(e, index) {
    if (e !== undefined) this.props.onMouseOver(index);
  }

  handleDetail = (e, code) => {
    e.preventDefault();
    let params = {type: "haruka", codes: parseInt(code)};
    this.getMedicineDetailList(params);
  }

  getMedicineDetailList = async (params) => {    
    await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    }).then((res) => {

      var base_modal = document.getElementsByClassName("med-shadow-modal")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
      this.setState({
        showMedicineDetail: true,
        medicineDetail: res
      });
    });
  }

  handleCancel = () => {
    var base_modal = document.getElementsByClassName("med-shadow-modal")[0];
    if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1050;
    }
    this.setState({
      showMedicineDetail: false
    }); 
  }

  render() {
    const { medicine, className } = this.props;
    return (
      <>
      <Item
        onClick={e=>this.insertMedClick(e)}
        className={className}
        ref={this.simulateClick.bind(this)}
        onMouseOver={e => this.onMouseOver(e, this.props.itemIndex)}
      >
        {this.props.isExistPrefixMedicine == true && (
          <div className="prefix">{medicine.prefix_name != null && medicine.prefix_name != undefined && medicine.prefix_name != "" ? medicine.prefix_name+"  " : ""}</div>
        )}
        <div className="medicine_name">{medicine.name}</div>
        {medicine.gene_name != "" && this.props.normalNameSearch == true ? <div>{medicine.gene_name}</div> : ""}
        {medicine.exists_detail_information === 1 &&(
          <Button onClick={e=> this.handleDetail(e, this.props.medicine.code)} className="btn_detail">詳細</Button>
        )}
      </Item>
      {this.state.showMedicineDetail && (
        <MedicineDetailModal
          hideModal={this.handleCancel}
          handleCancel={this.handleCancel}
          medicineDetailList={this.state.medicineDetail}
        />
      )}
      </>
    );
  }
}

SmallMedList.propTypes = {
  medicine: PropTypes.object,
  className: PropTypes.string,
  isEnter: PropTypes.bool,
  normalNameSearch: PropTypes.bool,
  isExistPrefixMedicine: PropTypes.bool,
  insertMed: PropTypes.func,
  indexOfInsertPres: PropTypes.number,
  indexOfInsertMed: PropTypes.number,
  onMouseOver: PropTypes.func,
  onHideDlg: PropTypes.func,
  itemIndex: PropTypes.number
};

export default SmallMedList;
