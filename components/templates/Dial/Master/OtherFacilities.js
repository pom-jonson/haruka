import React, { Component, useContext } from "react";

import { Col } from "react-bootstrap";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import OtherFacilitiesModal from "../modals/OtherFacilitiesModal";
import OtherFacilitiesDepartmentModal from "../modals/OtherFacilitiesDepartmentModal";
import OtherFacilitiesDoctorModal from "../modals/OtherFacilitiesDoctorModal";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 18px;
  margin-right: 5px;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .clickable{
    cursor:pointer;
  }
  .selected{
    background:lightblue!important;
  }
  table {
    tr{
      display: table;
      box-sizing: border-box;
    }
    margin-bottom:0;    
    thead{
      display: table;
      width:100%;
      font-size: 1rem;
      border-bottom: 1px solid #dee2e6;
      tr{
        width:calc(100% - 18px);
      }
    }
    tbody{
      height: calc(100vh - 250px);  
      overflow-y:scroll;
      display:block;
      tr{
        width:100%;
      }
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}    
    td {
      word-break: break-all;
        padding: 0.25rem;
        text-align: center;
        font-size: 1rem;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border-bottom: none;
        border-top: none;
    }      
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
 }
.table-check {
    width: 60px;
    input{
      margin-right: 0px;
    }
}
.td-no {
  width: 25px;
  white-space:nowrap;
}
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 70px;
  padding: 20px;
  padding-left: 0px;
  float: left;
  .search-box {
    width: 100%;
    display: flex;
    div{
      height: 2rem;
      line-height: 2rem;
    }
    .pullbox-select{
      height: 2rem;
    }
    input{
      width: 20rem;
      height: 2rem;
      font-size: 1rem;
      padding: 0.3rem;
      padding-left: 3rem;        
    }
    svg{
      font-size: 1rem;
      top: 0.5rem;
      left: 0.5rem;
    }
  }
  label{
    margin-bottom: 0px;
  }
  .label-title {
    width: 6rem;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 9.375rem;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 15px;
    .radio-btn label {
      width: 60px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
      font-size: 1rem;
    }
  }
`;
const ListTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  float: left;
  span {
    color: blue;
  }
  svg{
    font-size: 1rem;
  }
  .area {
    width: 32%;
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    flex-wrap: wrap;
  }
  .tl {
    width: 50%;
    text-align: left;
    float: left;
  }
  .tr {
    width: 100%;
    text-align: right;
    cursor: pointer;
    padding: 0;
    &.disabled {
      opacity: 0.5;
    }
  }
`;

const Lists = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  float: left;
`;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;  
  width: 32%;
  float: left;  
  label {
    margin: 0;
  }
  .tl {
    text-align: left;
  }
  .tr {
    text-align: right;
  }
`;

const display_class = [
  { id: 0, value: "全て" },
  { id: 1, value: "表示のみ" },
  { id: 2, value: "非表示のみ" }
];

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
  .display-part{
    .pullbox-title{
      margin-top: 0.1rem;
    }
  }
`;

const display_order = [
  { id: 0, value: "表示順", field_name:"sort_number"},  
  { id: 1, value: "カナ順", field_name:"name_kana"},
  { id: 2, value: "名称順", field_name:"name"},
];

const ContextMenu = ({ visible, x, y, parent, row_index }) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {$canDoAction(FEATURES.DIAL_OTHER_FACILITY_MASTER,AUTHS.EDIT,0) != false && (
            <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
          )}
          {$canDoAction(FEATURES.DIAL_OTHER_FACILITY_MASTER,AUTHS.DELETE,0) != false && (
            <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class OtherFacilities extends Component {
  constructor(props) {
    super(props);

    let other_facilities_data = [];
    let other_facilities_department_data = [];
    let other_facilities_doctor_data = [];
    this.state = {
      schVal: "",
      other_facilities_data,
      other_facilities_department_data,
      other_facilities_doctor_data,
      isOpenOtherFacilitiesModal: false,
      isOpenOtherFacilitiesDepartmentModal: false,
      isOpenOtherFacilitiesDoctorModal: false,
      selectedOtherFacilitiesIndex: null,
      selectedOtherFacilitiesDepartmentIndex: null,
      modal_data: {},
      search_order: 1, // 表示順
      search_class: 1, // 表示区分
      isDeleteConfirmModal: false,
      confirm_message:"",
      is_loaded_one : true,
      is_loaded_two : true,
      is_loaded_three : true,
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  getSelectedOtherFacilitiesNumber = () => {
    return this.state.other_facilities_data[
      this.state.selectedOtherFacilitiesIndex
    ].number;
  };

  getSelectedOtherFacilitiesDepartmentNumber = () => {
    return this.state.other_facilities_department_data[
      this.state.selectedOtherFacilitiesDepartmentIndex
    ].number;
  };

  // 検索
  searchOtherFacilitiesList = async () => {
    let path = "/app/api/v2/dial/master/other_facilities_search";
    let post_data = {
      keyword: this.state.schVal,
      is_enabled: this.state.search_class,
      order:display_order[this.state.search_order].field_name,
    };
    let { data } = await axios.post(path, { params: post_data });
    if (data != undefined && data != null && data.length > 0){
      this.setState({
        other_facilities_data: data,
        selectedOtherFacilitiesIndex: 0, 
        selected_facility_number:data[0].number,
        is_loaded_one: false
      })
    } else{
      this.setState({
        other_facilities_data: [],
        selectedOtherFacilitiesIndex: null,
        selected_facility_number:0,
        selectedOtherFacilitiesDepartmentIndex: null,
        other_facilities_department_data: [],
        other_facilities_doctor_data: [],
        is_loaded_one: false
      });
    }
    
  };

  // 検索 - 診療科
  searchOtherFacilitiesDepartmentList = async () => {
    let path = "/app/api/v2/dial/master/other_facilities_department_search";
    let post_data = {
      // other_facilities_number: this.getSelectedOtherFacilitiesNumber(),
      // other_facilities_number: this.state.selected_facility_number,
      keyword: this.state.schVal,
      is_enabled: this.state.search_class,
      order:display_order[this.state.search_order].field_name,
    };
    let { data } = await axios.post(path, { params: post_data });
    if (data != undefined && data != null && data.length > 0){
      this.setState({
        other_facilities_department_data: data,
        selectedOtherFacilitiesDepartmentIndex:0,
        selected_department_number:data[0].number,
        is_loaded_two: false
       });
    } else{
      this.setState({
        other_facilities_department_data: [],
        other_facilities_doctor_data:[],
        selectedOtherFacilitiesDepartmentIndex:null,
        selected_department_number:0,
        is_loaded_two: false
      });
    }
    
  };

  // 検索 - 担当医
  searchOtherFacilitiesDoctorList = async () => {
    let path = "/app/api/v2/dial/master/other_facilities_doctor_search";
    let post_data = {
      // other_facilities_number: this.getSelectedOtherFacilitiesNumber(),
      // other_facilities_department_number: this.getSelectedOtherFacilitiesDepartmentNumber(),
      // other_facilities_number: this.selected_facility_number,
      // other_facilities_department_number: this.state.selected_department_number,
      keyword: this.state.schVal,
      is_enabled: this.state.search_class,
      order:display_order[this.state.search_order].field_name,
    };
    let { data } = await axios.post(path, { params: post_data });
    this.setState({ 
      other_facilities_doctor_data: data,
      is_loaded_three: false
    });
  };
  getAllData = () => {
    this.searchOtherFacilitiesList();   
    this.searchOtherFacilitiesDepartmentList(); 
    this.searchOtherFacilitiesDoctorList();
  }

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code == 13) {
      this.getAllData();
    }
  };  
  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };

  handleOtherFacilitiesOk = () => {
    this.setState({
      is_loaded_one: true,
      isOpenOtherFacilitiesModal: false
    }, ()=> {
      this.searchOtherFacilitiesList();      
    });
  };
  handleOtherFacilitiesDepartmentOk = () => {
    this.setState({
      is_loaded_two: true,
      isOpenOtherFacilitiesDepartmentModal: false
    }, ()=> {
      this.searchOtherFacilitiesDepartmentList();      
    });    
  };
  handleOtherFacilitiesDoctorOk = () => {
    this.setState({
      is_loaded_three: true,
      isOpenOtherFacilitiesDoctorModal: false
    }, ()=> {
      this.searchOtherFacilitiesDoctorList();      
    });        
  };

  createOtherFacilities = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
    }
    this.setState({
      isOpenOtherFacilitiesModal: true,
      modal_data: null
    });
  };
  createOtherFacilitiesDepartment = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
    }
    // if (this.state.selectedOtherFacilitiesIndex === null) {
    //   return;
    // }
    this.setState({
      isOpenOtherFacilitiesDepartmentModal: true,
      modal_data: null
    });
  };
  createOtherFacilitiesDoctor = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
    }
    // if (this.state.selectedOtherFacilitiesDepartmentIndex === null) {
    //   return;
    // }
    this.setState({
      isOpenOtherFacilitiesDoctorModal: true,
      modal_data: null
    });
  };
  closeModal = () => {
    this.setState({
      isOpenOtherFacilitiesModal: false,
      isOpenOtherFacilitiesDepartmentModal: false,
      isOpenOtherFacilitiesDoctorModal: false,
      modal_data: {}
    });
  };

  getOrderSelect = e => {
    //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getAllData();
    });
  };
  getClassSelect = e => {
    //表示区分
    this.setState(
      {
        search_class: parseInt(e.target.id)
      },
      () => {
        this.getAllData();
      }
    );
  };

  handlesOtherFacilitiesRowClick = (e, index, selected_number) => {
    this.setState({
        selectedOtherFacilitiesIndex: index,
        selected_facility_number:selected_number,
        selectedOtherFacilitiesDepartmentIndex: null
      });
  };
  handlesOtherFacilitiesDepartmentRowClick = (e, index) => {
    this.setState({
        selectedOtherFacilitiesDepartmentIndex: index
      });
  };
  handleContextMenu = (e, index, listName) => {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    [
      "other-facilities-table",
      "other-facilities-department-table",
      "other-facilities-doctor-table"
    ].forEach(table_id => {
      document
        .getElementById(table_id)
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById(table_id)
            .removeEventListener(`scroll`, onScrollOutside);
        });
    });
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset
      },
      row_index: index,
      contextMenuListName: listName
    });
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.editData(index);
    }
    if (type === "delete") {
      this.setState({delete_index:index}, ()=> {
        let name = '';
        if (this.state.contextMenuListName === "other_facilities") {
            name = this.state.other_facilities_data[index].name;
        } else if (
            this.state.contextMenuListName === "other_facilities_department"
        ) {
            name = this.state.other_facilities_department_data[index].name;
        } else if (this.state.contextMenuListName === "other_facilities_doctor") {
            name = this.state.other_facilities_doctor_data[index].name;
        }
        this.delete(name);
      })
    }
  };

  delete = (name) => {
    this.setState({
      isDeleteConfirmModal : true,
        confirm_message: "「" + name + "」" + " これを削除して良いですか？",
    });
  };

  editData = index => {
    // eslint-disable-next-line no-console    

    if (this.state.contextMenuListName === "other_facilities") {
      let modal_data = this.state.other_facilities_data[index];
      this.setState({
        modal_data,
        isOpenOtherFacilitiesModal: true
      });
    } else if (
      this.state.contextMenuListName === "other_facilities_department"
    ) {
      let modal_data = this.state.other_facilities_department_data[index];
      this.setState({
        modal_data,
        isOpenOtherFacilitiesDepartmentModal: true
      });
    } else if (this.state.contextMenuListName === "other_facilities_doctor") {
      let modal_data = this.state.other_facilities_doctor_data[index];
      this.setState({
        modal_data,
        isOpenOtherFacilitiesDoctorModal: true
      });
    }
  };

  deleteData = async () => {
    // eslint-disable-next-line no-console    
    let index = this.state.delete_index;
    if (this.state.contextMenuListName === "other_facilities") {
      let number = this.state.other_facilities_data[index].number;
      let path = "/app/api/v2/dial/master/other_facilities_delete";
      let post_data = {
        params: number
      };
      await axios.post(path, post_data);
      window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
      this.confirmCancel();
      this.setState({
        is_loaded_one: true
      }, ()=>{
        this.searchOtherFacilitiesList();
      });
    } else if (
      this.state.contextMenuListName === "other_facilities_department"
    ) {
      let number = this.state.other_facilities_department_data[index].number;
      let path = "/app/api/v2/dial/master/other_facilities_department_delete";
      let post_data = {
        params: number
      };
      await axios.post(path, post_data);
      window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
      this.confirmCancel();
      this.setState({
        is_loaded_two: true
      }, ()=>{        
        this.searchOtherFacilitiesDepartmentList();
      });
    } else if (this.state.contextMenuListName === "other_facilities_doctor") {
      let number = this.state.other_facilities_doctor_data[index].number;
      let path = "/app/api/v2/dial/master/other_facilities_doctor_delete";
      let post_data = {
        params: number
      };
      await axios.post(path, post_data);
      window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
      this.confirmCancel();
      this.setState({
        is_loaded_three: true
      }, ()=>{                
        this.searchOtherFacilitiesDoctorList();
      });
    }
  };
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  render() {
    let {
      other_facilities_data,
      other_facilities_department_data,
      other_facilities_doctor_data
    } = this.state;    
    return (
      <Card>
        <div className="title">他施設マスタ</div>
        <SearchPart>
          <div className="search-box">
            <SearchBar
              placeholder=""
              search={this.search}
              enterPressed={this.enterPressed}
            />
            <div className="display-part">
              <SelectorWithLabel
                options={display_class}
                title="表示区分"
                getSelect={this.getClassSelect}
                departmentEditCode={display_class[
                  this.state.search_class
                ].id.toString()}
              />
            </div>
            <SelectorWithLabel
              options={display_order}
              title="表示順"
              getSelect={this.getOrderSelect}
              departmentEditCode={display_order[this.state.search_order].id}
            />
          </div>
        </SearchPart>
        <ListTitle>
          <div className="area">
            <div className="tl">施設一覧</div>
            <Col className="tr" onClick={this.createOtherFacilities}>
              <Icon icon={faPlus} />
              施設を追加
            </Col>
          </div>
          <div className="area">
            <div className="tl">診療科一覧</div>
            <div
              // className={`tr col ${
              //   this.state.selectedOtherFacilitiesIndex === null
              //     ? "disabled"
              //     : ""
              // }`}
              className='tr col'
              onClick={this.createOtherFacilitiesDepartment}
            >
              <Icon icon={faPlus} />
              診療科を追加
            </div>
          </div>
          <div className="area">
            <div className="tl">担当医一覧</div>
            <div
              // className={`tr col ${
              //   this.state.selectedOtherFacilitiesDepartmentIndex === null
              //     ? "disabled"
              //     : ""
              // }`}
              className='tr col'
              onClick={this.createOtherFacilitiesDoctor}
            >
              <Icon icon={faPlus} />
              担当医を追加
            </div>
          </div>
        </ListTitle>
        <Lists>
          <List>
            <table className="table-scroll table table-bordered">
              <thead>
                <tr>
                  <th className='td-no'/>
                  <th className="table-check">表示</th>
                  <th className="name">施設名</th>
                </tr>
              </thead>
              <tbody id="other-facilities-table">
                {this.state.is_loaded_one == true ? (
                  <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {other_facilities_data !== undefined &&
                      other_facilities_data !== null &&
                      other_facilities_data.length > 0 &&
                      other_facilities_data.map((item, index) => {
                        return (
                          <tr
                            key={index.toString()}
                            onContextMenu={e =>
                              this.handleContextMenu(e, index, "other_facilities")
                            }
                            onClick={e =>
                              this.handlesOtherFacilitiesRowClick(e, index, item.number)
                            }
                            className={`${
                              this.state.selectedOtherFacilitiesIndex == index
                                ? "selected clickable"
                                : "clickable"
                            }`}
                          >
                            <td className='td-no text-right'>{index + 1}</td>
                            <td className="text-center table-check">
                              <Checkbox
                                label=""
                                // getRadio={this.getRadio.bind(this)}
                                isDisabled={true}
                                value={item.is_enabled}
                                name="check"
                              />
                            </td>
                            <td className="name tl">{item.name}</td>
                          </tr>
                        );
                      })}
                  </>
                )}
              </tbody>
            </table>
          </List>
          <List>
            <table className="table-scroll table table-bordered">
              <thead>
                <tr>
                  <th className='td-no'/>
                  <th className="table-check">表示</th>
                  <th className="name">診療科</th>
                </tr>
              </thead>
              <tbody id="other-facilities-department-table">
                {this.state.is_loaded_two == true ? (
                  <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                  {other_facilities_department_data !== undefined &&
                    other_facilities_department_data !== null &&
                    other_facilities_department_data.length > 0 &&
                    other_facilities_department_data.map((item, index) => {
                      return (
                        <tr
                          key={index.toString()}
                          onContextMenu={e =>
                            this.handleContextMenu(
                              e,
                              index,
                              "other_facilities_department"
                            )
                          }
                          onClick={e =>
                            this.handlesOtherFacilitiesDepartmentRowClick(
                              e,
                              index
                            )
                          }
                          className={`${
                            this.state.selectedOtherFacilitiesDepartmentIndex == index? "selected clickable" : "clickable"}`}
                        >
                          <td className='td-no text-right'>{index + 1}</td>
                          <td className="text-center table-check">
                            <Checkbox
                              label=""
                              // getRadio={this.getRadio.bind(this)}
                              isDisabled={true}
                              value={item.is_enabled}
                              name="check"
                            />
                          </td>
                          <td className="name tl">{item.name}</td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </List>
          <List>
            <table className="table-scroll table table-bordered">
              <thead>
                <tr>
                  <th className='td-no' />
                  <th className="table-check">表示</th>
                  <th className="name">担当医</th>
                </tr>
              </thead>
              <tbody id="other-facilities-doctor-table">
                {this.state.is_loaded_three == true ? (
                  <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {other_facilities_doctor_data !== undefined &&
                      other_facilities_doctor_data !== null &&
                      other_facilities_doctor_data.length > 0 &&
                      other_facilities_doctor_data.map((item, index) => {
                        return (
                          <tr
                            key={index.toString()}
                            onContextMenu={e =>
                              this.handleContextMenu(
                                e,
                                index,
                                "other_facilities_doctor"
                              )
                            }
                          >
                            <td className='td-no text-right'>{index + 1}</td>
                            <td className="text-center table-check">
                              <Checkbox
                                label=""
                                // getRadio={this.getRadio.bind(this)}
                                isDisabled={true}
                                value={item.is_enabled}
                                name="check"
                              />
                            </td>
                            <td className="name tl">{item.name}</td>
                          </tr>
                        );
                      })}
                  </>
                )}
              </tbody>
            </table>
          </List>
        </Lists>
        {/* <div className="footer"></div> */}
        {this.state.isOpenOtherFacilitiesModal && (
          <OtherFacilitiesModal
            handleOk={this.handleOtherFacilitiesOk}
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
          />
        )}
        {this.state.isOpenOtherFacilitiesDepartmentModal && (
          <OtherFacilitiesDepartmentModal
            handleOk={this.handleOtherFacilitiesDepartmentOk}
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
            // selectedOtherFacilitiesNumber={this.getSelectedOtherFacilitiesNumber()}
            selectedOtherFacilitiesNumber={this.state.selected_facility_number}
          />
        )}
        {this.state.isOpenOtherFacilitiesDoctorModal && (
          <OtherFacilitiesDoctorModal
            handleOk={this.handleOtherFacilitiesDoctorOk}
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
            // selectedOtherFacilitiesNumber={this.getSelectedOtherFacilitiesNumber()}
            selectedOtherFacilitiesNumber={this.state.selected_facility_number}
            // selectedOtherFacilitiesDepartmentNumber={this.getSelectedOtherFacilitiesDepartmentNumber()}
            selectedOtherFacilitiesDepartmentNumber={this.state.selected_department_number}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.deleteData.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          row_index={this.state.row_index}
        />
      </Card>
    );
  }
}
OtherFacilities.contextType = Context;

export default OtherFacilities;
