import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {ALLERGY_TYPE_ARRAY, PER_PAGE} from "../../../../../helpers/constants";
import * as apiClient from "~/api/apiClient";
import { formatDateLine } from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import AllergyDetailModal from "./AllergyDetailModal";
import AllergyModal from "~/components/templates/Patient/Modals/Allergy/AllergyModal";
import Pagination from "~/components/molecules/Pagination";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
  .content{
    margin-top: 10px;
    height: calc(100% - 6rem);
    text-align: left;
    width: 100%;
  }
  .pagination {
    margin-right: 0;
    margin-left: auto;
    margin-top: 5px;
    margin-bottom: 0;
  }
  .label-title {
    width: 6rem;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.5rem;
  }
  .pullbox-label {
    width: 12rem;
  }
  .MyCheck{
    label{
      font-size: 1rem !important;
      margin-right: 0.5rem;
      line-height: 34px;
      margin-bottom: 0;
      display: flex;
    }
    input{
      height: 30px !important;
    }
    input:checked {
        background: none;
        border-color: none;
    }
    .react-datepicker-wrapper{
        input {
          width: 7rem;
          height: 38px !important;
          border-radius: 4px;
          border: solid 1px lightgray;
          padding-left: 3px;
        }
    }
  }
  .pullbox-select {
    width: 12rem;
    font-size: 1rem;
  }
  label {
    margin: 0;
  }
  button {
    min-width: auto;
    margin-left: 24px;
  }
  span {
    font-size: 1rem;
  }
  .display-count{
    .pullbox-select, .pullbox-label{
      width: 5rem;
    }
  }
}
`;
const Table = styled.table`
  margin:0px;
  width: 100%;
  tbody{
    display:block;
    overflow-y: scroll;
    height: calc(100vh - 23rem);
    width:100%;
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
  }
  tr{
    display: table;
    width: 100%;
  }
  thead{
    display:table;
    width:100%;        
    border: 1px solid #dee2e6;
    tr{
        width: calc(100% - 16px);
    }
  }
  td {
      padding: 0.25rem;
      word-break: break-all;
      button {
        width:100%;
        margin:0;
        padding: 0;
      }
      border: 1px solid #dee2e6;
  }
  th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
      white-space:nowrap;
      border:none;
      border-right:1px solid #dee2e6;
  }

  .item-name {
    width: 10rem;
  }
  .item-result {
  }
  .item-default {
    width: 5rem;
  }
 

`;

class AllergyListModal extends Component {
  constructor(props) {
    super(props);
      this.state = {
          allergy_id: 0,
          select_date_type:1,
          search_date: "",
          table_list: null,
          openDetailModal: false,
          openRegisterModal: false,
          allergy_type: props.allergy_type,
          display_number: 20,
          openDoctorModal: false
    };
  }
  componentDidMount() {
    let data = sessApi.getDoctorList();
    this.setState({doctors: data});
      let allergy_array = [ {id: 0, value: "全て", type: "" }];
      Object.entries(ALLERGY_TYPE_ARRAY).map((value,key)=>{
          let item = {
              id: key + 1,
              value: value[1],
              type: value[0]
          };
          if (value[0] !== "drugalergy" && value[0] !=="foodalergy"){
            allergy_array.push(item);
          }
      });
      let allergy_id = 0;
      if (this.props.allergy_type !== undefined && this.props.allergy_type != null && this.props.allergy_type != "foodalergy" && this.props.allergy_type != "drugalergy") {
          allergy_id = allergy_array.find(x=>x.type === this.props.allergy_type).id;
      }
      this.setState({allergy_array,allergy_id}, ()=>{
          this.searchList();
      });
  }

    getDepartmentSelect = e => {
        this.setState({
          allergy_id: parseInt(e.target.id),
          allergy_type: this.state.allergy_array.find(x=>x.id === parseInt(e.target.id)).type,
        });
    };

    setDate = (e) =>{
        let search_date = this.state.search_date;
        if(parseInt(e.target.value) === 1){
            search_date = "";
        } else {
            search_date = new Date();
        }
        this.setState({
            select_date_type:parseInt(e.target.value),
            search_date,
        })
    };

    getDate = value => {
        this.setState({
            search_date: value,
            select_date_type:0,
        });
    };

    searchList = async () => {
        let path = "/app/api/v2/order/hospital/allergy/search";
        let post_data = {
          search_date:this.state.search_date !== '' ? formatDateLine(this.state.search_date) : '' ,
          type: this.state.allergy_array.find(x=>x.id === this.state.allergy_id).type,
          select_date_type:this.state.select_date_type,
          system_patient_id: this.props.patientId
        };

        await apiClient._post(
            path,
            {params: post_data})
            .then((res) => {
                if(res){
                    this.setState({ table_list:res });
                }
            })
            .catch(() => {

            })
    };

    showDetailModal = (data) => {
        this.setState({
            allergy_data: data,
            openDetailModal: true
        })
    };

    closeModal = (noclose = 0) => {
      this.modalBlackBack();
      if (this.state.openRegisterModal == true) {
        this.setState({
            openRegisterModal: false,
        });
        if (noclose == 0)
        this.props.closeModal();
        return;
      }
        this.setState({
            openDetailModal: false,
            openRegisterModal: false,
        })
    };

    openRegisterModal = () => {

      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.doctor_code === 0) {
        if (this.context.selectedDoctor.code === 0) {
          this.setState({openDoctorModal: true});
          return;
        }
      }
        if (this.state.allergy_type == "") return;
        var list_modal = document.getElementsByClassName("allergy-list-modal")[0];
        if (list_modal !== undefined){
            list_modal.style['z-index'] = 1040;
        }
        var register_modal = document.getElementsByClassName('allergy-modal')[0];
        if (register_modal !== undefined) {
            register_modal.style['z-index'] = 1050;
        }
        this.modalBlack();
        this.setState({openRegisterModal: true});
    };

    getDisplayNumber = e => {
        this.setState({display_number: e.target.value});
    };

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }
    onHide = () => {};

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  closeDoctor = () => {
      this.setState({openDoctorModal: false});
  }

  selectDoctorFromModal = (id, name) => {
    this.setState({openDoctorModal: false});
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({
        openRegisterModal: true,
    });
    this.modalBlack();
  };
  modalBlack() {
    var base_modal = document.getElementsByClassName("allergy-list-modal");
    for (let i = 0; i < base_modal.length; i++) {
      base_modal[i].style["z-index"] = 1040;
    }
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("allergy-list-modal");
    for (let i = 0; i < base_modal.length; i++) {
      base_modal[i].style["z-index"] = 1050;
    }
  }

  render() {
    const {allergy_array} = this.state;
      let {table_list, pageOfItems} = this.state;
    return  (
        <Modal show={true} className="custom-modal-sm exa-modal allergy-list-modal" onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>患者記載情報一覧</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={`search-box d-flex`}>
                    <SelectorWithLabel
                        options={allergy_array}
                        title="種類"
                        getSelect={this.getDepartmentSelect}
                        departmentEditCode={this.state.allergy_id}
                    />
                    <div className="MyCheck ml-2 d-flex">
                        <Radiobox
                            label="作成日付"
                            value={0}
                            getUsage={this.setDate.bind(this)}
                            checked={this.state.select_date_type === 0 ? true : false}
                            name={`date-set`}
                        />
                        <DatePicker
                            locale="ja"
                            selected={this.state.search_date}
                            onChange={this.getDate.bind(this)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="年/月/日"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dayClassName = {date => setDateColorClassName(date)}                            
                        />
                    </div>
                    <div className="MyCheck ml-2">
                        <Radiobox
                            label="全期間"
                            value={1}
                            getUsage={this.setDate.bind(this)}
                            checked={this.state.select_date_type === 1 ? true : false}
                            name={`date-set`}
                        />
                    </div>
                    <div className="display-count">
                    <SelectorWithLabel
                        options={PER_PAGE}
                        title="表示件数"
                        getSelect={this.getDisplayNumber}
                        departmentEditCode={this.state.display_number}
                    />
                    </div>
                    <Button onClick={this.searchList.bind(this)}>検索</Button>
                </div>
                <div className={`content`}>
                    <Table>
                      <thead>
                        <tr>
                          <th className="item-name" style={{width:"9.95rem"}}>記載日</th>
                          <th>種類</th>
                          <th className="item-default"/>
                        </tr>
                      </thead>
                      <tbody>
                        {pageOfItems !== undefined && pageOfItems !== null && pageOfItems.length > 0 && (
                          pageOfItems.map((item, index) => {
                            let bgcolor = "#ffffff";
                            if (item.type === "infection" || item.type === "alergy") {
                                if (item.body_2 == "1") { //未検査
                                    bgcolor = "rgba(142, 209, 105, 0.3)";
                                } else if (item.body_2 == "2") { //陰性のみ
                                    bgcolor = "rgba(105, 200, 225, 0.3)";
                                } else if (item.body_2 == "3") { //陽性なし・不明あり
                                    bgcolor = "rgba(248, 173, 81, 0.3)";
                                } else if (item.body_2 == "4") { //陽性あり
                                    bgcolor = "rgba(241, 86, 124, 0.3)";
                                }
                            }
                            return (
                              <tr key={index} style={{backgroundColor:bgcolor}}>
                                <td className="item-name">
                                  {item.created_at.substr(0, 4)}年
                                  {item.created_at.substr(5, 2)}月
                                  {item.created_at.substr(8, 2)}日
                                </td>
                                <td>{item.type !== undefined && item.type != null && item.type !== "" ? ALLERGY_TYPE_ARRAY[item.type] : ""}</td>
                                <td className="item-default">
                                  <Button type="common" onClick={this.showDetailModal.bind(this,item)}>詳細</Button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </Table>
                </div>
                <Pagination
                    items={table_list}
                    onChangePage={this.onChangePage.bind(this)}
                    pageSize={parseInt(this.state.display_number)}
                />
              </Wrapper>
              {this.state.openDetailModal && (
                  <AllergyDetailModal
                      modal_data={this.state.allergy_data}
                      closeModal={this.closeModal}
                  />
              )}
              {this.state.openRegisterModal && (
                  <AllergyModal
                      modal_data={null}
                      cache_index={null}
                      closeModal={this.closeModal}
                      patientId={this.props.patientId}
                      allergy_type={this.state.allergy_type}
                      modalName={ALLERGY_TYPE_ARRAY[this.state.allergy_type]}
                      from_list={1}
                  />
              )}
              {this.state.openDoctorModal === true && (
                  <SelectDoctorModal
                      closeDoctor={this.closeDoctor}
                      getDoctor={this.getDoctor}
                      selectDoctorFromModal={this.selectDoctorFromModal}
                      doctors={this.state.doctors}
                  />
              )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>閉じる</Button>
            <Button className={this.state.allergy_type == "" ? "disable-btn" :'red-btn'} onClick={this.openRegisterModal}>新規登録</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

AllergyListModal.contextType = Context;

AllergyListModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  allergy_type:PropTypes.string,
  patientId: PropTypes.number,
};

export default AllergyListModal;