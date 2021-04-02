import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import VisitGroupModal from "./modal/VisitGroupModal";
import SelectMultiPatientModal from "~/components/templates/Patient/components/SelectMultiPatientModal";
import SystemConfirmWithBtnModal from "~/components/molecules/SystemConfirmWithBtnModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import GroupMoveModal from "./GroupMoveModal";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import PropTypes from "prop-types";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import auth from "~/api/auth";
import * as localApi from "~/helpers/cacheLocal-utils";
import Spinner from "react-bootstrap/Spinner";
import VisitTreatmentPatientDeleteConfirm
  from "~/components/templates/Patient/Modals/Visit/VisitTreatmentPatientDeleteConfirm";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 13rem);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: relative;  
  width: 100%;
  margin: 0px;
  height: 100vh;
  padding: 20px 5px;
  background-color: ${surface};
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom:1rem
    ;
  }
  .main-area {
    width:100%;
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .selected{
    background:lightblue!important;
  }
  .clickable{
    cursor:pointer;
}
.table-check {
  width: 3rem;
  text-align: center;
  input {
    margin: 0;
  }
}
.td-no {
  width: 2.5rem;
  text-align:right;
}
.place-name {
  width: 7rem;
}
.group-name {
  width: 16rem;
}
.code-number{
    width:100px;
}
table {
  width:100%;
  margin:0;
  tbody{
    display:block;
    overflow-y: scroll;
    height: calc(100vh - 12rem); 
    width:100%;
    tr{cursor:pointer;}
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2;}
  }
  tr{
    display: table;
    width: 100%;
  }
  thead{
    display:table;
    width:100%;    
    border-bottom: 1px solid #dee2e6;    
    tr{width: calc(100% - 17px);}
  }
  th {
    position: sticky;
    text-align: center;
    padding: 0.3rem;
    white-space:nowrap;
    border:1px solid #dee2e6;
    border-bottom:none;
    border-top:none;
    vertical-align: middle;
    font-size:1rem;
  }
  td {
    padding: 0.25rem;
    word-break: break-all;
    font-size:1rem;
  }
}
.button{
  background-color: ${colors.surface};
  min-width: auto;
  margin-left: 0.5rem;
  padding: 0.5rem;
  span{
    word-break: keep-all;
  }
}
.tab-btn{
  background: rgb(208, 208, 208);
  span{
    font-weight: normal;
    color: black;
    font-size: 0.9rem;
  }
}
.active-btn{
  background: lightblue;
}
.disabled{
  background: rgb(208, 208, 208);
  span{
    font-weight: normal;
    color: grey !important;
    font-size: 0.9rem;
  }
}
.move-btn-area {
  margin-left:auto;
  margin-right:-5px;
}
`;

const ListTitle = styled.div`
    width:100%;
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
    span {
        color: blue;
    }
    .left-area {
        width: 31%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 37%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
        cursor: pointer;
        padding: 0;
    }
    .justify-content {
      align-items: flex-start;
      justify-content: space-between;
    }
`;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 31%;
    border: solid 1px lightgrey;
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
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 37%;
  border: solid 1px lightgrey;
 `;
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
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
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
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const SearchPart = styled.div`
  display: flex;
  font-size: 1rem;
  margin-right: 0;
  margin-left: auto;
  padding-top: 1rem;
  .search-box-area {
    display: flex;
    height:38px;
    .search-box{
      width:240px;
      input{
        width:210px;
      }
    }
  }
  .label-title {
    text-align: right;
    margin-right: 10px;
    width: 5rem;
    line-height: 38px;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 8rem;
  }
  .pullbox-label {
    margin:0;
  }
`;

const display_order = [
  { id: 0, value: "患者ID順", field_name:"patient_number"},
  { id: 1, value: "カナ氏名順", field_name:"patient_name_kana"},
];

const display_class = [
  { id: 0, value: "全て" },
  { id: 1, value: "表示のみ" },
  { id: 2, value: "非表示のみ" },
];

const ContextMenu = ({visible,x,y,parent,index, kind}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {kind != 2 && (<li><div onClick={()=>parent.contextMenuAction("edit", index, kind)}>変更</div></li>)}
          <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>削除</div></li>
          {kind == 2 && (<li><div onClick={()=>parent.contextMenuAction("move_group", index, kind)}>グループ移動</div></li>)}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class VisitGroupMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_array:[],
      list_item:[],
      main_master_list:[],
      search_order: 0,        //表示順
      search_class: 1,        //表示区分
      isOpenKindModal: false,
      isOpenSelectItemModal: false,
      isMoveConfirmModal: false,
      selected_first_layer_number:0,
      selected_second_layer_number:0,
      selected_classific_id:null,
      selected_classific_detail_id:null,
      modal_data:null,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isScheduleStopConfirmModal:false,
      confirm_message: "",
      selected_group_id:"",
      alert_messages:'',
      isGroupMoveModal:false,
      load1_flag:false,
      load2_flag:true,
      load3_flag:true,
      isOpenVisitTreatmentPatientDeleteConfirm:false,
    }
  }

  async componentDidMount(){
    await this.getPlaceLayer();
    auth.refreshAuth(location.pathname+location.hash);
  }

  addSecondLayer = () => {
    if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages: '登録権限がありません。'});
      return;
    }
    this.setState({
      kind:0,
      isOpenKindModal: true,
      modal_data:null,
    });
  };

  addFirstLayer = () => {
    if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages: '登録権限がありません。'});
      return;
    }
    this.setState({
      kind:1,
      isOpenKindModal: true,
      modal_data:null,
    });
  };

  addThirdLayer = () => {
    if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages: '登録権限がありません。'});
      return;
    }
    if(this.state.main_master_list.length === 0){
      this.setState({alert_messages: '訪問診療グループを追加してください。'});
      return;
    }
    if(this.state.selected_group_id === ''){
      this.setState({alert_messages: '訪問診療グループを選択してください。'});
      return;
    }
    this.setState({
      isOpenSelectItemModal: true,
      kind:null,
    });
  };

  closeModal = () => {
    this.setState({
      isOpenKindModal: false,
      modal_data:null,
      isOpenSelectItemModal:false,
      isGroupMoveModal:false,
      isOpenVisitTreatmentPatientDeleteConfirm:false,
    });
  };

  getOrderSelect = e => {                 //表示順
    this.setState({
      search_order: parseInt(e.target.id),
      load3_flag:false,
    }, () => {
      this.getPatientLayer();
    });
  };

  getGroupLayer = async(groupId = 0) => {
    let path =  "/app/api/v2/visit/get/visit_group";
    let params =  {};
    params.visit_place_id = this.state.selected_place_id;
    if(this.state.search_class != 0){
      params.is_enabled = this.state.search_class == 1 ? 1: 0;
    }
    if(this.state.load2_flag){
      this.setState({load2_flag:false});
    }
    await apiClient
      ._post(path, {params})
      .then((res) => {
        if (res.length > 0){
          let sel_number = res[0].number;
          if (groupId > 0) {
            res.map(item=>{
              if (item.visit_group_id == groupId) {
                sel_number = item.number;
              }
            });
          }
          this.setState({
            main_master_list:res,
            selected_first_layer_number:sel_number,
            selected_group_id:groupId > 0 ? groupId : res[0].visit_group_id,
            load2_flag:true,
            list_item:[],
            load3_flag:false,
          }, () => {
            this.getPatientLayer();
          })
        } else {
          this.setState({
            main_master_list:[],
            list_item:[],
            selected_group_id:'',
            load2_flag:true,
            load3_flag:false,
          }, () => {
            this.getPatientLayer();
          })
        }
      })
      .catch(() => {

      });
  }
  
  getPlaceLayer = async(placeId = 0) => {
    let path = '';
    let post_data;
    path = "/app/api/v2/visit/get/visit_place";
    post_data = {is_enabled:this.state.search_class};

    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        let groupId = 0;
        if (this.state.selected_place_id == placeId){groupId = this.state.selected_group_id;}
        if (res.length > 0){
          this.setState({
            list_array:res,
            selected_place_id: placeId > 0 ? placeId : res[0].visit_place_id,
            selected_place_name: placeId > 0 ? placeId : res[0].name,
            load1_flag:true,
            load2_flag:false,
          }, () => {
            this.getGroupLayer(groupId);
          });
        } else {
          this.setState({
            list_array:[],
            selected_place_id:'',
            selected_place_name:'',
            main_master_list:[],
            selected_group_id:'',
            load1_flag:true,
          });
        }
      })
  }

  getPatientLayer = async() => {
    if(this.state.selected_group_id != ""){
      if(this.state.load3_flag){
        this.setState({load3_flag:false});
      }
      var path = "/app/api/v2/visit/get/visit_patient";
      var post_data = {
        keyword: this.state.schVal,
        order:display_order[this.state.search_order].field_name,
        is_visit:1,
        visit_group_id:this.state.selected_group_id,
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then((res) => {
          this.setState({
            list_item:res,
            load3_flag:true,
          });
        })
        .catch(() => {
        });
    } else {
      this.setState({
        list_item:[],
        load3_flag:true,
      });
    }
  }

  handleOk = (edit_id = 0) => {
    switch(this.state.kind){
      case 0:
        this.getGroupLayer(edit_id);
        break;
      case 1:
        this.getPlaceLayer(edit_id);
        break;
    }
    this.closeModal();
  };

  handleClick = (e, index, kind) => {
    if (e.type === "contextmenu"){
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
        .getElementById("wordList-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("wordList-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          index: index,
          kind:kind,
        },
        contextMenu_define:{visible:false}
      });
    }
  };

  contextMenuAction = (act, index, kind) => {
    if( act === "edit") {
      if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.EDIT, 0)){
        this.setState({alert_messages: '変更権限がありません。'});
      } else {
        this.editData(index, kind);
      }
    } else if (act === "delete") {
      if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.DELETE, 0)){
        this.setState({alert_messages: '変更権限がありません。'});
      } else {
        let number = null, name = null;
        switch(kind){
          case 0:
            number = this.state.main_master_list[index].number;
            name = this.state.main_master_list[index].name;
            break;
          case 1:
            number = this.state.list_array[index].number;
            name = this.state.list_array[index].name;
            break;
        }
        if(kind == 2){
          this.setState({
            isOpenVisitTreatmentPatientDeleteConfirm:true,
            modal_data:this.state.list_item[index],
          });
        } else {
          this.setState({
            isDeleteConfirmModal : true,
            selected_number:number,
            kind:kind,
            confirm_message:'「' + name.trim() +'」　' + "このデータを削除しますか？",
          });
        }
      }
    } else if(act === "move_group"){
      if(!this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.EDIT, 0) && !this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.DELETE, 0)){
        this.setState({alert_messages: '変更権限がありません。'});
      } else {
        let number = this.state.list_item[index].system_patient_id;
        this.setState({
          isGroupMoveModal : true,
          selected_number:number,
        });
      }
    }
  };

  editData = (index, kind) => {
    var modal_data;
    switch(kind){
      case 0:
        modal_data = this.state.main_master_list[index];
        break;
      case 1:
        modal_data = this.state.list_array[index];
        break;
      case 2:
        modal_data = this.state.list_item[index];
        break;
    }
    this.setState({
      kind,
      modal_data,
      isOpenKindModal: true,
    });
  };

  confirmCancel=()=> {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isMoveConfirmModal:false,
      isScheduleStopConfirmModal:false,
      confirm_message: "",
      alert_messages: "",
    });
  }

  deleteData = async () => {
    var path;
    let post_data = {
      params: {number:this.state.selected_number},
    };
    switch(this.state.kind){
      case 0:
        path = "/app/api/v2/visit/delete_group";
        await apiClient.post(path,  post_data);
        this.getGroupLayer();
        this.confirmCancel();
        break;
      case 1:
        path = "/app/api/v2/visit/delete_place";
        await apiClient.post(path,  post_data);
        this.getPlaceLayer();
        this.confirmCancel();
        break;
    }
  };

  selectGroup = (number,group_id) => {
    this.setState({
      selected_first_layer_number:number,
      selected_group_id:group_id,
      list_item:[],
      load3_flag:false,
    }, ()=>{
      this.getPatientLayer();
    });
  }

  selectPlace = (place_item) => {
    if (this.state.selected_place_id == place_item.visit_place_id) return;
    this.setState({
      selected_place_id:place_item.visit_place_id,
      selected_place_name:place_item.name,
      main_master_list:[],
      list_item:[],
      load2_flag:false,
    }, () => {
      this.getGroupLayer();
    })
  }

  addPatients = async() => {
    let path = "/app/api/v2/visit/add_patient";
    let post_data = {
      params:{
        patient_data:this.state.add_patients,
        visit_group_id:this.state.selected_group_id,
      }
    }
    await apiClient.post(path, post_data);
    this.setState({
      add_patients:undefined,
      load3_flag:false,
      isScheduleStopConfirmModal:false,
      isOpenSelectItemModal:false,
      confirm_message:"",
    }, ()=>{
      this.getPatientLayer();
    });
  }

  deleteDuplicate = () => {
    this.setState({
      isScheduleStopConfirmModal:true, confirm_message:"未実施のスケジュールを中止しますか？"
    });
  }

  checkMoveFromOther = (patients, duplicated_patients = []) => {
    if (duplicated_patients.length > 0 ){
      this.setState({
        isMoveConfirmModal:true,
        confirm_message:'ほかのグループに所属している患者が含まれています。元のグループのスケジュールを削除して追加しますか？',
        duplicated_patients,
        add_patients:patients,
      });
    } else {
      this.setState({add_patients:patients}, () => {
        this.addPatients();
      });
    }
  }

  stopDelete = async(action = null) => {
    for (var i = 0; i < this.state.duplicated_patients.length; i++){
      await this.deletePatientFromGroup(this.state.duplicated_patients[i].systemPatientId, action);
    }
    await this.addPatients();
    this.confirmCancel();
  }

  deletePatientFromGroup = async(system_patient_id, action = null)=>{
    let path = "/app/api/v2/visit/add/group_patient";
    let post_data = {
      number:system_patient_id,
      visit_group_id:parseInt(this.state.selected_group_id),
    };
    if(action != null){
      post_data.action = action;
      post_data.visit_group_id = null;
    }
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
        // window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {

      });
    path = "/app/api/v2/visit/delete/group_patient";
    post_data = {
      params: {number:system_patient_id},
    };
    await apiClient.post(path,  post_data);
  }

  addGroupToPatient =async(system_patient_id, action=null)=>{
    this.setState({
      confirm_message:"",
      isOpenVisitTreatmentPatientDeleteConfirm:false,
      load3_flag:false,
    });
    let path = "/app/api/v2/visit/add/group_patient";
    let post_data = {
      number:system_patient_id,
      visit_group_id:parseInt(this.state.selected_group_id),
    };
    if(action != null){
      post_data.action = action;
      post_data.visit_group_id = null;
    }
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
      })
      .catch(() => {
      });
    path = "/app/api/v2/visit/delete/group_patient";
    post_data = {
      params: {number:system_patient_id},
    };
    await apiClient.post(path,  post_data);
    this.getPatientLayer();
  }

  getClassSelect = e => {                 //表示区分
    this.setState({ search_class: parseInt(e.target.id) }, () => {
      this.getPlaceLayer();
    });
  };

  gotoSoap = () => {
    let patient_info = karteApi.getLatestVisitPatientInfo();    
    if (patient_info == undefined || patient_info == null) {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        this.props.history.replace(`/patients/${current_system_patient_id}/soap`);
      }
    } else {
      this.props.history.replace(`/patients/${patient_info.patient_id}/soap`);
    }
  }
  goToPage = (url) => {
    this.props.history.replace(url);
  }
  getUsableMenuItem = (menu_id) => {
    let menu_info = sessApi.getObjectValue("init_status", "navigation_menu");
    if (menu_info == undefined || menu_info == null) return false;
    let find_menu = menu_info.find(x=>x.id == menu_id);
    if (find_menu == undefined || find_menu == null) return true;
    return find_menu.is_enabled && find_menu.is_visible;
  }

  render() {
    let list_names = ["訪問診療予定", "訪問診療施設管理", "訪問診療スケジュール"];
    var list_urls = ["/visit_schedule_list", "/visit/group_master", "/visit/schedule"];
    const menu_list_ids = ["1005", "4008", "4007"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    let {list_array, list_item, main_master_list} = this.state;
    return (
      <Card>
        <div style={{display:'flex'}}>
          <div className="title">訪問診療施設管理</div>
          <SearchPart>
            <div className="search-box-area">
              <SelectorWithLabel
                options={display_class}
                title="表示区分"
                getSelect={this.getClassSelect}
                departmentEditCode={this.state.search_class}
              />
              <SelectorWithLabel
                options={display_order}
                title=""
                getSelect={this.getOrderSelect}
                departmentEditCode={display_order[this.state.search_order].id}
              />
            </div>
          </SearchPart>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10) && this.getUsableMenuItem(menu_list_ids[index])){
                  return(
                    <>
                      {item == "訪問診療施設管理" ? (
                        <Button className="tab-btn button active-btn">{item}</Button>
                      ):(
                        <Button className="tab-btn button" onClick={()=>this.goToPage(list_urls[index])}>{item}</Button>
                      )}
                    </>
                  )
                }
              }
            })}
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
            )}
          </div>
        </div>

        <ListTitle>
          <div className="left-area justify-content">
            <div className="tl">訪問診療先</div>
            <div className="tr" onClick={this.addFirstLayer.bind(this)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="left-area justify-content">
            <div className="tl">訪問診療グループ</div>
            <div className="tr" onClick={this.addSecondLayer.bind(this)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="right-area justify-content">
            <div className="tl">診療患者</div>
            <div className="tr" onClick={this.addThirdLayer.bind(this)}><Icon icon={faPlus} />追加</div>
          </div>
        </ListTitle>
        <div className={'main-area'}>
          <List>
            <table className="table-scroll table table-bordered" id="wordList-table">
              <thead>
              <tr>
                <th className='td-no'/>
                <th className="table-check">表示</th>
                <th className="group-name">訪問診療先名称</th>
                <th>カナ名称</th>
              </tr>
              </thead>
              <tbody>
              {this.state.load1_flag ? (
                <>
                  {list_array.length > 0 && (
                    list_array.map((item, index) => {
                      return(
                        <>
                          <tr
                            onMouseDown={this.selectPlace.bind(this, item)}
                            className={this.state.selected_place_id === item.visit_place_id?"selected":""}
                            onContextMenu={e => this.handleClick(e,index, 1)}
                            style={{cursor:"pointer"}}
                          >
                            <td className='td-no tr'>{index+1}</td>
                            <td className='table-check'>
                              <Checkbox
                                label=""
                                value={item.is_enabled}
                                isDisabled={true}
                                name="check"
                              />
                            </td>
                            <td className="tl group-name">{item.name}</td>
                            <td className="tl">{item.name_kana != null && item.name_kana != undefined && item.name_kana != "" ? item.name_kana : ""}</td>
                          </tr>
                        </>)
                    })
                  )}
                </>
              ):(
                <tr>
                  <td colSpan={'4'}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </List>
          <List>
            <table className="table-scroll table table-bordered" id="wordList-table">
              <thead>
              <tr>
                <th className="table-check">表示</th>
                <th className="group_name" style={{width:'16rem'}}>グループ名称</th>
                <th className="group_name_kana">カナ名称</th>
              </tr>
              </thead>
              <tbody>
              {this.state.load2_flag ? (
                <>
                  {main_master_list.length > 0 && (
                    main_master_list.map((item, index) => {
                      return (
                        <>
                          <tr
                            className={this.state.selected_first_layer_number === item.number?"selected clickable":"clickable"}
                            onMouseDown={this.selectGroup.bind(this, item.number,item.visit_group_id)}
                            onContextMenu={e => this.handleClick(e,index, 0)}
                            style={{cursor:"pointer"}}
                          >
                            <td className="table-check">
                              <Checkbox
                                label=""
                                value={item.is_enabled}
                                isDisabled={true}
                                name="check"
                              />
                            </td>
                            <td className="tl group_name" style={{width:'16rem'}}>{item.name}</td>
                            <td className="tl group_name_kana">{item.name_kana != null && item.name_kana != undefined && item.name_kana != "" ? item.name_kana : ""}</td>
                          </tr>
                        </>
                      )
                    })
                  )}
                </>
              ):(
                <tr>
                  <td colSpan={'3'}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </List>
          <Wrapper>
            <table className="table-scroll table table-bordered">
              <thead>
              <tr>
                <th className="td-no"/>
                {/* <th className="table-check">対象</th> */}
                <th style={{width:'6rem'}}>患者ID</th>
                <th style={{width:"16rem"}}>患者氏名</th>
                <th>カナ氏名</th>
                <th style={{width:"3rem"}}>性別</th>
              </tr>
              </thead>
              <tbody>
              {this.state.load3_flag ? (
                <>
                  {list_item.length > 0 && (
                    list_item.map((item, index) => {
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e,index, 2)}>
                            <td className="td-no">{index+1}</td>
                            <td style={{width:'6rem', textAlign:"right"}}>{item.patient_number}</td>
                            <td className="tl"style={{width:"16rem"}}>{item.patient_name}</td>
                            <td className="tl">{item.patient_name_kana}</td>
                            <td className="tl" style={{width:"3rem"}}>{item.gender == 1 ? "男" : "女"}性</td>
                          </tr>
                        </>
                      )
                    })
                  )}
                </>
              ):(
                <tr>
                  <td colSpan={'5'}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </Wrapper>
        </div>
        {this.state.isOpenKindModal && (
          <VisitGroupModal
            kind={this.state.kind}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            modal_data = {this.state.modal_data}
            visit_place_id = {this.state.selected_place_id}
          />
        )}
        {this.state.isOpenSelectItemModal && (
          <SelectMultiPatientModal
            handleOk={this.checkMoveFromOther}
            closeModal={this.closeModal}
            group_id = {this.state.selected_group_id}
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
        {this.state.isMoveConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteDuplicate.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isScheduleStopConfirmModal && (
          <SystemConfirmWithBtnModal
            firstMethod= {this.stopDelete.bind(this, 'cancel')}
            secondMethod= {this.stopDelete.bind(this)}
            confirmTitle= {this.state.confirm_message}
            first_btn_name={'中止する'}
            second_btn_name={'スケジュールは残す'}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.isGroupMoveModal && (
          <GroupMoveModal
            handleOk= {this.selectGroup.bind(this)}
            closeModal= {this.closeModal}
            selected_place_name= {this.state.selected_place_name}
            selected_group_id= {this.state.selected_group_id}
            visit_group_data= {this.state.main_master_list}
            system_patient_id= {this.state.selected_number}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isOpenVisitTreatmentPatientDeleteConfirm && (
          <VisitTreatmentPatientDeleteConfirm
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
            handleOk={this.addGroupToPatient}
          />
        )}
      </Card>
    )
  }
}

VisitGroupMaster.contextType = Context;
VisitGroupMaster.propTypes = {
  history: PropTypes.object,
}
export default VisitGroupMaster
