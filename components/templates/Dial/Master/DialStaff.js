import React, { Component, useContext } from "react";
import Checkbox from "~/components/molecules/Checkbox";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import RadioButton from "~/components/molecules/RadioInlineButton";
import StaffAddModal from "../Board/molecules/StaffAddModal"
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .no-result {    
    height:calc(100% - 1px);
    width:100%;
    div{
      height:100%;
      width:100%;
      text-align: center;
      vertical-align:middle;
      display:flex;
      align-items:center;
      justify-content:center; 
    }
    
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    table {
        margin-bottom:0;
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        thead{
          display: table;
          width:100%;
          border-bottom: 1px solid #dee2e6;
          tr{
            width:calc(100% - 18px);
          }
        }
        tbody{
          height: calc(100vh - 17rem);
          overflow-y:scroll;
          display:block;
          tr:nth-child(even) {background-color: #f2f2f2;}
          tr:hover{background-color:#e2e2e2 !important;}
        }        
        td {
            word-break: break-all;
            padding: 0.25rem;
            text-align: center;
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
        width: 6.25rem;
        text-align: center;
        label{
          margin-right: 0px;
          input{
            margin-right: 0px;
          }
        }
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
        width: 7.5rem;
    }
    .name{
        width:15.625rem;
    }
    .print-td {
      width:3rem;
      text-align:center;
      label {margin:0;}
      input {margin:0;}
    }
    
  .print-btn{
      margin-right: calc(100% - 18.5rem);
    }
`;

const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  padding: 1rem;
  padding-left: 0px;
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
      .pullbox-title{
        margin-top: 0.1rem;
      }
  }
  .label-title {
    width: 6rem;
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
    margin-left: 1rem;
    display:flex;
    .radio-btn label{
        width: 6.25rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        line-height: 2rem;
        height: 2rem;
        font-size: 1rem;
    }
    .pullbox-label {margin:0;}
    .delete-checkbox-area{
      label{
        height: 2rem;
        line-height: 2rem;
        padding-top: 0px;
      }
      input{
        height: 15px;
      }
    }
  }
  .ixnvCM{
    font-size: 1rem;
    margin-left: 1rem;
    padding-top: 0.5rem;
  }
 `;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;  
  margin-bottom: 0.625rem;
  label {
      text-align: right;
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
`;

const sort_order = [
  { id: 0, value: "ID順", field_name:"signin_id"},
  { id: 1, value: "登録順", field_name:"number"},
  { id: 2, value: "カナ順", field_name:"name_kana"},
];
const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {$canDoAction(FEATURES.DIAL_STAFF_MASTER,AUTHS.EDIT,0) != false && (
            <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
          )}
          {$canDoAction(FEATURES.DIAL_STAFF_MASTER,AUTHS.DELETE,0) != false && (
            <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class DialStaff extends Component {
  constructor(props) {
    super(props);
    let initState = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    this.cur_system = this.enableHaruka(initState);
    let table_data = [];
    this.state = {
      schVal: "",
      table_data,
      openStaffSettingModal: false,
      category: "",
      modal_data:{},
      search_order: 2,        //表示順
      search_class: 0, //表示区分
      category_list:[],
      display_delete:0,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      print_numbers:[],
      complete_message:"",
      alert_messages:"",
      alert_title:"",
      is_loaded: true,
    }
    this.use_varcode_print = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.staff_use_varcode_print !== undefined){
      this.use_varcode_print = initState.conf_data.staff_use_varcode_print;
    }
  }
  async UNSAFE_componentWillMount(){
    await this.getAuthCategory();
    await this.getAuthDepartment();
    await this.getStaffs();
  }
  
  enableHaruka = (initState) => {
    if (initState == null || initState == undefined) {
      return "haruka";
    }
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
  }
  
  async getStaffs () {
    let post_data = {
      name: this.state.schVal,
      category:this.state.category,
      display_delete:this.state.display_delete,
      order:sort_order[this.state.search_order].field_name,
    };
    await apiClient.post("/app/api/v2/dial/master/staff/search",{params: post_data})
      .then((res) => {
        let staff_list_by_number = {};
        if (res != undefined){
          Object.keys(res).map((key) => {
            staff_list_by_number[res[key].number] = res[key].name;
          });
        }
        this.setState({
          table_data: res,
          staff_list_by_number,
          print_numbers:[],
          is_loaded: false
        })
      .catch(() => {
          this.setState({
            is_loaded: false
          });
        });
        return res;
      });
  }
  
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.setState({
        is_loaded: true
      }, ()=> {
        this.getStaffs();
      });
    }
  };
  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };
  
  handleOk = () => {
    this.setState({
      is_loaded: true
    }, ()=> {
      this.getStaffs();
      this.closeModal();
    });    
  };
  createCode = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_STAFF_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
      this.setState({alert_messages:"登録権限がありません。"});
      return;
    }
    this.setState({
      openStaffSettingModal: true,
      modal_data:null
    });
  };
  
  closeModal = () => {
    this.setState({
      openStaffSettingModal: false,
      alert_title:"",
      alert_messages:"",
    });
  };
  
  selectMedicineType = (e) => {
    this.setState({ 
      category: parseInt(e.target.value),
      is_loaded: true
    }, () => {
      this.getStaffs();
    });
  };
  getOrderSelect = e => {                 //表示順
    this.setState({ 
      search_order: parseInt(e.target.id),
      is_loaded: true
    }, () => {
      this.getStaffs();
    });
  };
  getClassSelect = e => {                 //表示区分
    this.setState({ 
      search_class: parseInt(e.target.id),
      is_loaded: true
    }, () => {
      this.getStaffs();
    });
  };
  
  handleClick = (e, index) => {
    // if(e.type === "contextmenu") return;
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
        favouriteMenuType: index
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    if (type === "edit"){
      this.editData(index);
    }
    if (type === "delete"){
      this.setState({
        isDeleteConfirmModal : true,
        selected_number:this.state.table_data[index].number,
        confirm_message:'削除しますか？'
      })
    }
  };
  
  editData = (index) => {
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      openStaffSettingModal: true
    });
  };
  deleteData = async () => {
    let path = "/app/api/v2/dial/master/staff/delete";
    let post_data = {
      params: {number:this.state.selected_number},
    };
    apiClient.post(path, post_data).then((res) => {
      window.sessionStorage.setItem("alert_messages", res.alert_message);
    });
    this.setState({
      is_loaded: true
    }, ()=> {
      this.getStaffs();      
      this.confirmCancel();
    });    
    window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
  };
  
  getAuthCategory = async () => {
    let path = "/app/api/v2/dial/master/staff/getAuthCategory";
    await apiClient.post(path, {
      params:{
        type: "category"
      }
    }).then((res) => {
      let category_list = [];
      if (res != undefined){
        Object.keys(res).map((key) => {
          category_list[res[key].id] = res[key].name;
        });
      }
      this.setState({
        category_list
      });
    });
  };
  getAuthDepartment = async () => {
    let path = "/app/api/v2/dial/master/staff/getAuthCategory";
    await apiClient.post(path, {
      params:{
        type: "department"
      }
    }).then((res) => {
      let department_list = {};
      if (res != undefined){
        Object.keys(res).map((key) => {
          department_list[res[key].id] = res[key].name;
        });
      }
      this.setState({
        department_list
      });
    });
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  getRadio = (name, value) => {
    if(name == "check"){
      this.setState({
        display_delete:value,
        is_loaded: true
      }, () => {
        this.getStaffs();
      });
    }
  }
  getOrderSelect = e => {                 //表示順
    this.setState({ 
      search_order: parseInt(e.target.id),
      is_loaded: true
    }, () => {
      this.getStaffs();
    });
  };
  
  setPrintNumber =(name, number)=>{
    if(name == "print_number"){
      let print_numbers = this.state.print_numbers;
      let index = print_numbers.indexOf(number);
      if(index === -1){
        print_numbers.push(number);
      } else {
        print_numbers.splice(index, 1);
      }
      this.setState({print_numbers});
    }
  };
  
  printBarcode=async()=>{
    this.setState({
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/secure/staff/barcode/print";
    let post_data = {
      staff_numbers:this.state.print_numbers,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          complete_message:"",
          alert_title:"印刷確認",
          alert_messages:res.alert_message,
          staff_numbers:[],
        });
      })
      .catch(() => {
      
      });
  }
  
  render() {
    let {table_data} = this.state;
    return (
      <Card>
        <div className="title">スタッフ設定</div>
        <SearchPart>
          <div className="search-box">
            <SearchBar
              placeholder=""
              search={this.search}
              enterPressed={this.enterPressed}
            />
            <div className="medicine_type">
              <RadioButton
                id="inside"
                value={1}
                label="基本"
                name="medicine_type"
                getUsage={this.selectMedicineType}
                checked={this.state.category === 1}
              />
              <RadioButton
                id="outside"
                value={2}
                label="閲覧のみ"
                name="medicine_type"
                getUsage={this.selectMedicineType}
                checked={this.state.category === 2}
              />
              <RadioButton
                id="outside_master"
                value={3}
                label="管理者"
                name="medicine_type"
                getUsage={this.selectMedicineType}
                checked={this.state.category === 3}
              />
              <div className="delete-checkbox-area">
                <Checkbox
                  label="削除済みも表示"
                  value={this.state.display_delete == 1}
                  getRadio = {this.getRadio.bind(this)}
                  name="check"
                />
              </div>
              <SelectorWithLabel
                options={sort_order}
                title="表示順"
                getSelect={this.getOrderSelect}
                departmentEditCode={sort_order[this.state.search_order].id}
              />
              {this.use_varcode_print == 1 && (
                <button style={{marginLeft:"2rem", height:"2rem"}} disabled={this.state.print_numbers.length === 0} onClick={this.printBarcode}>スタッフバーコード印刷</button>
              )}
            </div>
            {/*<SelectorWithLabel*/}
            {/*options={display_class}*/}
            {/*title="表示区分"*/}
            {/*getSelect={this.getClassSelect}*/}
            {/*departmentEditCode={display_class[this.state.search_class].id}*/}
            {/*/>*/}
          </div>
        </SearchPart>
        <Wrapper>
          <table className="table table-bordered table-hover">
            <thead>
            <tr>
              <th className="item-no"/>
              {this.use_varcode_print == 1 && (
                <th className="print-td">印刷</th>
              )}
              <th style={{width:'6.25rem'}}>利用可能</th>
              <th className="name">ログインID</th>
              <th className="name">氏名</th>
              <th className="name">カナ氏名</th>
              <th className="name">部門・職種</th>
              <th>権限</th>
            </tr>
            </thead>
            <tbody id="code-table">
            {this.state.is_loaded == true ? (
              <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ):(
              <>
                {table_data !== undefined &&
                table_data !== null &&
                table_data.length < 1 && (
                  <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                )}
                {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                  table_data.map((item, index) => {
                    return (
                      <>
                        <tr onContextMenu={e => this.handleClick(e, index)}>
                          <td className="item-no text-right">{index+1}</td>
                          {this.use_varcode_print == 1 && (
                            <td className="print-td">
                              <Checkbox
                                getRadio={this.setPrintNumber.bind(this)}
                                value={(this.state.print_numbers.includes(item.number))}
                                number={item.number}
                                name="print_number"
                              />
                            </td>
                          )}
                          <td className="table-check text-center" style={{width:'6.25rem'}}>
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="name text-left">{item.signin_id}</td>
                          <td className="name text-left">{item.name}</td>
                          <td className="name text-left">{item.name_kana}</td>
                          <td className="name text-left">{item.department!=null && this.state.department_list != null?this.state.department_list[parseInt(item.department)]:''}</td>
                          <td className={`text-left`}>{item.category != null && this.state.category_list != null && this.state.category_list.length>0 &&
                          this.state.category_list[parseInt(item.category)] != null && this.state.category_list[parseInt(item.category)]}</td>
                        </tr>
                      </>)
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </Wrapper>
        <div className="footer-buttons">
          {this.context.$canDoAction(this.context.FEATURES.DIAL_STAFF_MASTER, this.context.AUTHS.REGISTER) == true || this.context.$canDoAction(this.context.FEATURES.DIAL_STAFF_MASTER, this.context.AUTHS.REGISTER_PROXY) == true ? (
            <>
              <div onClick={this.createCode} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>新規作成</span></div>
            </>
          ) : (
            <>
              <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                <div className={"custom-modal-btn disable-btn"}><span>新規作成</span></div>
              </OverlayTrigger>
            </>
          )}                            
        </div>
        {this.state.openStaffSettingModal && (
          <StaffAddModal
            staff_list={this.state.staff_list}
            closeModal={this.closeModal}
            handleOk={this.handleOk}
            modal_data={this.state.modal_data}
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
          favouriteMenuType={this.state.favouriteMenuType}
        />
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title= {this.state.alert_title}
          />
        )}
      </Card>
    )
  }
}
DialStaff.contextType = Context;

export default DialStaff