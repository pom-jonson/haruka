import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
// import Button from "~/components/atoms/Button";
import ManagefeeModal from "../modals/ManagefeeModal";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Context from "~/helpers/configureStore";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
`;
const Card = styled.div`
  position: fixed;getRadio
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .table_title {
    height: 1.875rem;
  }
  .disabled{
    opacity:0.5;
    pointer-events:none;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .footer {
    text-align: center;
    clear: both;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    button {
      text-align: center;
      border-radius: 0.25rem;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 1.875rem;
    }

    span {
      color: white;
      font-size: 1.25rem;
      font-weight: 100;
    }
  }
  .search-box{
    input{height:35px;}
  }
  .cur-date{
    font-size: 1.2rem;
    background: rgb(105, 200, 225);
    color: white;
    height: 43px;
    padding-top: 10px;
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 28px;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  margin-top:25px;
  height: calc(100vh - 12.5rem);  
  .left {
    text-align: left;
    float: left;
    width: 50%;
  }
  .right {
    text-align: right;
    float: right;
    width: 50%;
    cursor: pointer;
    label{
      font-size:1rem;
    }
  }
  .table_container {
    height: calc(100vh - 16.875rem);
    border: 1px solid lightgrey;
  }  

  table {
    thead{
      display: table;
      width:100%;
    }   
    tbody{
      height: calc(100vh - 19.5rem);
      overflow-y:auto;
      display:block;
    } 
    .table-number{
      width: 1.875rem;
    }
    .table-sort-number{
      width: 3.75rem;
    }
    .name{
      width: 17rem;
    }
    .comment{
      width:7.5rem;
    }
    .kind{
      width: 9rem;
    }
    .implement-name{
      width: 10rem;
    }
    .day{
      width: 5rem;
    }
    .count{
      width: 6rem;
    }
    .month{
      width:3rem;
    }
    
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }       
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      padding: 0.25rem;
      text-align: center;
      word-break: break-all;
    }
    th {
      text-align: center;
      padding: 0.3rem;
    }
    .code-number {
      width: 7.5rem;
    }
    .tl {
      text-align: left;
    }
    .tr {
      text-align: right;
    }
  }
  margin-bottom: 0.625rem;
  .gHLxSm{font-size: 1rem;}  

  .managefee-list{

  }
`;
const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;    
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 0rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_ADMINFEE_MASTER,AUTHS.EDIT,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_ADMINFEE_MASTER,AUTHS.DELETE,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class Managefee extends Component {
  constructor(props) {
    super(props);    
    let managefee_list = [];
    
    this.state = {
      schVal: "",
      managefee_list,
      patient_list:[],
      checked_patient_status:{},
      modal_data: {},
      isOpenModal: false,
      isDeleteConfirmModal: false,
      confirm_message:"",
      allChecked:true,
      allChecked_patient:true, 
      criteria_date:new Date(),
    };
  }
  getRadio = (system_patient_id,name, value) => {
    if (name == "check") {
      this.setState({allChecked:value})
    }
    if (name == 'patient_check'){
      this.setState({allChecked_patient:value})
    }
    if (name == 'select_patient'){
      var checked_patient_status = this.state.checked_patient_status;
      checked_patient_status[system_patient_id] = value;
      this.setState({checked_patient_status});
    }
  };

  async componentDidMount() {
    this.searchManagefeeData();
    this.getSearchPatient();
  }

  // 検索
  searchManagefeeData = async () => {
    let path = "/app/api/v2/dial/master/managefee_search";
    let post_data = {
      is_enabled: this.state.display_item != 0 ? this.state.display_item : "",
      order:'name_kana'
    };
    let { data } = await axios.post(path, { params: post_data });
    this.setState({ managefee_list: data });
  };

  handleOk = () => {
      this.setState({
          isOpenModal: false
      });
      this.searchManagefeeData();
  };

  createManagefee = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_ADMINFEE_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
    }
    this.setState({ 
      modal_data: null,
      row_index: -1,
      isOpenModal: true,      
    });
  };
  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  updateData = (index) => {
    let modal_data = this.state.managefee_list[index];
    this.setState({
      modal_data,
      row_index: index,
      isOpenModal: true
    });
  };
    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        });
    }
  contextMenuAction = (index, type) => {
    if (type === "edit"){
      this.updateData(index);
    }
    else if (type === "delete"){
      this.setState({selected_number:this.state.managefee_list[index].number}, () => {
        this.delete(this.state.managefee_list[index].name);
      })            
    }
  };
    delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
        });
    };
    deleteData = async () => {
        let path = "/app/api/v2/dial/master/managefee_delete";
        let post_data = {
            params: this.state.selected_number,
        };
        await axios.post(path, post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.confirmCancel();
        this.searchManagefeeData();
    };
    handleClick = (e, type, item) => {
        if (e.type === "contextmenu") {
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
            document
                .getElementById("code-table")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextMenu: { visible: false }
                    });
                    document
                        .getElementById("code-table")
                        .removeEventListener(`scroll`, onScrollOutside);
                });
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX,
                    y: e.clientY + window.pageYOffset
                },
                favouriteMenuType: type,
                selected_fee_number:item.number,
                selected_fee_item:item,
            });
        }
    };

    // getDate = (value) => {
    //   this.setState({criteria_date:formatDateLine(value)});
    // }

    enterPressed = e => {
      var code = e.keyCode || e.which;
      if (code === 13) {
        this.getSearchPatient();
      }
    };

    search = word => {
      word = word.toString().trim();
      this.setState({ schVal: word });
    };

    getSearchPatient = async() => {
      let path = "/app/api/v2/dial/patient/list_condition";
      var post_data = {
        keyword:this.state.schVal,        
      }
      const { data } = await axios.post(path, {param:post_data});
        if(data != undefined && data !=null){            
          var checked_patient_status = this.state.checked_patient_status;
          var temp_status = {};
          data.map(item => {
            if (checked_patient_status[item.system_patient_id]) {
              temp_status[item.system_patient_id] = true; 
            } else {
              temp_status[item.system_patient_id] = false;
            }
          });
          checked_patient_status = {};
          checked_patient_status = temp_status;
          this.setState({
                patient_list:data,
                checked_patient_status,
            });
        } else {
            this.setState({
                patient_list:[],
                checked_patient_status:{}
            });
        }
    }

    selectManageFee(item) {
      this.setState({
        selected_fee_number:item.number,
        selected_fee_item:item,
      })
    }

  render() {
    let { managefee_list } = this.state;
    // const ExampleCustomInput = ({ value, onClick }) => (
    //   <div className="cur-date morning example-custom-input" onClick={onClick}>
    //       基準日:{formatJapanDate(value)}
    //   </div>
    // );
    return (
      <Card>
        <div className="title">管理料マスタ</div>
        <Wrapper>
          <div className="table_title">
            <span className="left">管理料/指導料</span>
            <Col
              className={`right {this.state.curFocus === 1?"focus": ""}`}
              onClick={this.createManagefee}
            >
              <Icon icon={faPlus} />
              管理料を追加
            </Col>
          </div>
          <div className="table_container managefee-list">
            <table className="table-scroll table table-bordered ">
              <thead>
                <tr>
                  <th className="table-number" />
                  <th className="table-sort-number">表示</th>
                  <th className="name">名称</th>
                  <th className="comment">コメント</th>
                  <th className="kind">区分</th>
                  <th className="implement-name">実施</th>
                  <th className="day">曜日</th>
                  <th className="count">週</th>
                  <th className="month">月</th>
                  <th>カナ名称</th>
                </tr>
              </thead>
              <tbody id="code-table">
                {managefee_list !== undefined &&
                  managefee_list !== null &&
                  managefee_list.length > 0 &&
                  managefee_list.map((item, index) => {
                    if (this.state.allChecked){
                      if (item.is_enabled){
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e, index, item)} onClick={this.selectManageFee.bind(this, item)}
                             className={this.state.selected_fee_number == item.number?'selected clickable':'clickable'}>
                            <td className="table-number text-right">{index + 1}</td>
                            <td className="table-sort-number">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, null)}                              
                                name="check"
                                value={item.is_enabled}
                                isDisabled={true}
                              />
                            </td>
                            <td className="tl name">{item.name}</td>
                            <td className="tl comment text-left">
                              {item.is_comment_requiered === 1 ? "必須" : ""}
                            </td>
                            <td className="tl kind text-left">
                              {item.is_pattern === 0
                                ? "パターン管理方式"
                                : "手動"}
                            </td>
                            <td className="tl implement-name">
                              {item.is_pattern ? item.type : ""}
                            </td>
                            <td className="tl day">
                              {item.is_pattern && item.type === "週・月を指定"
                                ? "月日火水木金土".split("")[item.weekday]
                                : ""}
                            </td>
                            <td className="tl count">
                              {item.is_pattern && item.type === "週・月を指定"
                                ? "第" +
                                  (item.monthly_enable_week_number + 1) +
                                  "週"
                                : ""}
                            </td>
                            <td className="tl month">
                              {item.is_pattern && item.type === "週・月を指定"
                                ? item.enable_month_flag + 1 + "月"
                                : ""}
                            </td>
                              <td>{item.name_kana}</td>
                          </tr>
                        </>
                      );
                      }
                    } else {
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e, index, item)}>
                            <td className="table-number text-right">{index + 1}</td>
                            <td className="table-sort-number">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, null)}                              
                                name="check"
                                value={item.is_enabled}
                                isDisabled={true}
                              />
                            </td>
                            <td className="tl name">{item.name}</td>
                            <td className="tl comment">
                              {item.is_comment_requiered === 1 ? "必須" : ""}
                            </td>
                            <td className="tl kind">
                              {item.is_pattern === 0
                                ? "パターン管理方式"
                                : "手動"}
                            </td>
                            <td className="tl implement-name">
                              {item.is_pattern ? item.type : ""}
                            </td>
                            <td className="tl day">
                              {item.is_pattern && item.type === "週・月を指定"
                                ? "月日火水木金土".split("")[item.weekday]
                                : ""}
                            </td>
                            <td className="tl count">
                              {item.is_pattern && item.type === "週・月を指定"
                                ? "第" +
                                  (item.monthly_enable_week_number + 1) +
                                  "週"
                                : ""}
                            </td>
                            <td className="tl month">
                              {item.is_pattern && item.type === "週・月を指定"
                                ? item.enable_month_flag + 1 + "月"
                                : ""}
                            </td>
                            <td>{item.name_kana}</td>
                          </tr>
                        </>
                      );
                    }
                    }
                  )}
              </tbody>
            </table>
          </div>
          <span className="right">
            <Checkbox
              label="非表示を隠す"
              getRadio={this.getRadio.bind(this, null)}
              value={this.state.allChecked}
              name="check"
            />
          </span>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
        </Wrapper>
        {/* <List>
          <div className="table_title">
            <div className="left">対象患者</div>            
          </div>

          <SearchBar
              placeholder=""
              search={this.search}
              enterPressed={this.enterPressed}
          />
          <div className="table_container">
            <table className="table-scroll table table-bordered">
              <thead>
                <tr>
                  <th className="patient_check">対象</th>
                  <th style={{width:"6.5rem"}}>患者ID</th>
                  <th className="patient_name">患者氏名</th>
                </tr>
              </thead>
              <tbody>
                {patient_list !== undefined &&
                  patient_list !== null &&
                  patient_list.length > 0 &&
                  patient_list.map(item => {
                    if (this.state.allChecked_patient){
                      if (item.is_enabled){
                        return (
                          <>
                            <tr>
                              <td className="patient_check">
                                <Checkbox
                                  label=""
                                  getRadio={this.getRadio.bind(this, item.system_patient_id)}
                                  value={this.state.checked_patient_status[item.system_patient_id]}
                                  name="select_patient"                                  
                                />
                              </td>
                              <td className="text-center" style={{width:"6.5rem"}}>{item.patient_number}</td>
                              <td className="tl">{item.patient_name}</td>
                            </tr>
                          </>
                        );
                      }
                    } else {
                      return (
                        <>
                          <tr>
                            <td className="patient_check">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, item.system_patient_id)}
                                value={this.state.checked_patient_status[item.system_patient_id]}
                                name="select_patient"                                
                              />
                            </td>
                            <td className="text-center" style={{width:"6.5rem"}}>{item.patient_number}</td>
                            <td className="tl">{item.patient_name}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
          <span className="right">
            <Checkbox
              label="非表示を隠す"
              getRadio={this.getRadio.bind(this, null)}
              value={this.state.allChecked_patient}
              name="patient_check"
            />
          </span>
        </List>
         */}
        
        <div className="footer">          
        </div>
        {this.state.isOpenModal && (
          <ManagefeeModal
            modal_data={this.state.modal_data}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
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
      </Card>
    );
  }
}
Managefee.contextType = Context;

export default Managefee;
