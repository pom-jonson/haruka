import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import InspectionKindModal from "./Modal/InspectionKindModal";
import EditDefineModal from "./Modal/EditDefineModal";
import EditInspectionMasterModal from "./Modal/EditInspectionMasterModal";
import EndscopeMasterModal from "./Modal/EndscopeMasterModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import auth from "~/api/auth";
import axios from "axios/index";
import {getServerTime} from "~/helpers/constants";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
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
  font-size: 1rem;
  margin-right: 5px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  height: 100vh;
  padding-top: 20px;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom:10px;
  }
  .header-area{
    .pullbox-title{
      margin-top: 0.1rem;
      line-height: 2rem;
    }
  }
  .radio-area{      
      height: 2rem;    
      line-height: 2rem;  
      margin-top: 0.1rem;
      label{
          font-size:1rem;
      }
      input{
        background: white;
      }
  }
  .pullbox-select{
    height: 2rem;
  }
  
  .pullbox-title{
    height: 2rem;
  }
  .selected{
      background:lightblue!important;
  }
  .clickable{
    cursor:pointer;
  }
  table {
    margin-bottom:0;
    height: 100%;
    thead{
      width: 100%;
      display: table;
      border-bottom: 1px solid #dee2e6;
      tr{
        width:calc(100% - 17px);
      }
    }
    tbody{
      height: calc(100vh - 17rem);
      overflow-y:scroll;
      display:block;
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: center;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        height: 2rem;
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
      width: 3rem;
      text-align: center;
      label{
        margin-right: 0px;
        input{
          margin-right: 0px;
          height: 15px;
        }
      }
  }
  .td-no {
    width: 25px;
  }
  .label-title{
      width:100px;
      font-size:1rem;
      margin-left:30px;
  }
  .pullbox-select, .pullbox-label{
      width:200px;
  }  
.footer {
    label {
        text-size: 16px;
        font-size:1rem;
    }
    text-align: center;
  }
`;

const ListTitle = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    height: 25px;
    float: left;
    margin-top: 0.5rem;
    font-size: 1rem;
    margin-bottom: 6px;
    span {
        color: blue;
    }
    
    .left-area {
        width: 29%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        font-size: 1rem;
    }
    .right-area {
        width: 38%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        font-size: 1rem;
    }
    .tl {
        width: 50%;
        text-align: left;
    }
    .tr {
        width: 50%;
        text-align: right;
        cursor: pointer;
        padding: 0;
    }
`;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 29%;
    margin-right: 2%;
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

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 38%;
  float: left;  
  margin-bottom: 10px;
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
    font-size: 1rem;
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
          <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>変更</div></li>
          <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const ContextMenu_define = ({visible,x,y,parent,inspection_id, inspection_name}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.edit_define(0, inspection_id, inspection_name)}>検査目的定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_define(1, inspection_id, inspection_name)}>現症定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_define(2, inspection_id, inspection_name)}>依頼区分定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_define(3, inspection_id, inspection_name)}>患者移動形態定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_define(4, inspection_id, inspection_name)}>冠危険因子定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_define(5, inspection_id, inspection_name)}>現病歴定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_inspection_master(inspection_id, inspection_name)}>検査マスタ編集</div></li>
          <li><div onClick={() =>parent.printInspectionMaster(inspection_id, inspection_name)}>印刷</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class Inspection_Kind_Haruka extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_array:[],
      list_item:[],
      isOpenKindModal: false,
      selected_first_kind_number:0,
      selected_classification1_id:null,
      selected_inspection_type_id:null,
      modal_data:null,
      inspection_master_id:0,
      physiological_names:[],
      endscope_name:[],
      isOpenDefineModal:false,
      isOpenEditInspectionMasterModal:false,
      status:0,
      search_class: 1,        //表示区分
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      complete_message:"",
      is_loaded_first: true,
      is_loaded_two: false,
      is_loaded_three: false,
    }
  }
  
  async componentDidMount(){
    await this.getInspectionInfo();
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  getInspectionInfo=async()=>{
    let path = "/app/api/v2/master/addition/searchFunctionsByCategory";
    let post_data = {
      params:{is_enabled:2, function_category_id:4}
    };
    await apiClient.post(path, post_data).then((res)=>{
      let physiological_names = [];
      let endscope_name = [];
      if(res.length > 0){
        res.map(item => {
          if(item.id == 17){
            endscope_name.push(item);
          } else if(item.id != 18) {
            physiological_names.push(item);
          }
        });
        this.setState({
          physiological_names,
          endscope_name,
          is_loaded_first: false
        })
      } else {
        this.setState({
          is_loaded_first: false
        });
      }
    })
    .catch(() => {
      this.setState({
        is_loaded_first: false,
      });
    });
  }
  
  addFirstKind = () => {
    this.setState({
      kind:1,
      isOpenKindModal: true,
      selected_first_kind_number:0,
      selected_classification1_id:null,
      selected_inspection_type_id:null,
      modal_data:null
    });
  };
  
  closeModal = () => {
    this.setState({
      isOpenKindModal: false,
      isOpenDefineModal: false,
      isOpenEditInspectionMasterModal:false,
      modal_data:null
    });
  };
  
  addSecondKind = () => {
    this.setState({
      kind:0,
      isOpenKindModal: true,
      modal_data:null,
      
    });
  };
  
  getInspectionFirstKind = async() => {
    if(this.state.inspection_master_id === 0){return;}
    let path = '';
    if (this.state.status === 0){
      path = "/app/api/v2/master/inspection/searchFirstKind";
    }  else {
      path = "/app/api/v2/master/inspection/searchInspectionType";
    }
    await apiClient
      ._post(path, {
        params: {inspection_id:this.state.inspection_master_id, is_enabled:this.state.search_class}
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            list_array:res,
            selected_first_kind_number:this.state.selected_first_kind_number>0?this.state.selected_first_kind_number:res[0].number,
            selected_classification1_id:this.state.selected_classification1_id>0?this.state.selected_classification1_id:res[0].classification1_id,
            selected_inspection_type_id:this.state.selected_inspection_type_id>0?this.state.selected_inspection_type_id:res[0].inspection_type_id,
            is_loaded_two: false,
            is_loaded_three: true,
          }, () => {
            if (this.state.status ==0){
              this.getSecondKindFromFirst(this.state.selected_classification1_id);
            } else {
              this.getSecondKindFromFirst(this.state.selected_inspection_type_id);
            }
            
          })
        } else {
          this.setState({
            list_array:[],
            list_item:[],
            selected_first_kind_number:0,
            selected_classification1_id:null,
            is_loaded_two: false,
          })
        }
      })
      .catch(() => {
        this.setState({
          is_loaded_two: false,
        });
      });
  }
  
  getSecondKindFromFirst = async(selected_id) => {
    if(this.state.inspection_master_id === 0){return;}
    let path = '';
    let post_data;
    if (this.state.status ==0) {
      path = "/app/api/v2/master/inspection/searchSecondKind";
      post_data = {
        classification1_id:selected_id,
        inspection_id:this.state.inspection_master_id,
        is_enabled:this.state.search_class
      };
    } else {
      path = "/app/api/v2/master/inspection/searchInspectionItem";
      post_data = {
        inspection_type_id:selected_id,
        is_enabled:this.state.search_class
      };
    }
    
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          list_item:res,
          is_loaded_three: false
          // selected_classification1_id:selected_classification1_id,
        });
      })
      .catch(() => {
        this.setState({
          is_loaded_three: false
        });
      });
  }
  
  handleOk = () => {
    this.setState({
      is_loaded_two: true
    }, ()=> {      
      this.getInspectionFirstKind();
      this.closeModal();
    });
  };
  
  handleClick_define = (e, inspection_id, inspection_name) => {
    if (e.type === "contextmenu"){
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_define: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_define: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("wordList-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_define: { visible: false }
          });
          document
            .getElementById("wordList-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let clientY = e.clientY;
      let clientX = e.clientX;
      let state_data = {};
      state_data['contextMenu'] = {visible:false};
      state_data['contextMenu_define'] = {
        visible: true,
        x: clientX,
        y: clientY,
        inspection_id,
        inspection_name
      };
      this.setState(state_data, ()=>{
        let window_height = window.innerHeight;
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        if(window_height < (menu_height + clientY)){
          state_data['contextMenu_define']['y'] = window_height - menu_height;
          this.setState(state_data);
        }
      });
    }
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
      let clientY = e.clientY;
      let clientX = e.clientX;
      let state_data = {};
      state_data['contextMenu_define'] = {visible:false};
      state_data['contextMenu'] = {
        visible: true,
        x: clientX,
        y: clientY,
        index,
        kind
      };
      this.setState(state_data, ()=>{
        let window_height = window.innerHeight;
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        if(window_height < (menu_height + clientY)){
          state_data['contextMenu_define']['y'] = window_height - menu_height;
          this.setState(state_data);
        }
      });
    }
  };
  
  edit_define = (type, inspection_id, inspection_name) => {
    this.setState({
      isOpenDefineModal:true,
      define_type: type,
      inspection_id: inspection_id,
      inspection_name:inspection_name
    })
  }
  
  contextMenuAction = (act, index, kind) => {
    if( act === "edit") {
      this.editData(index, kind);
    } else if (act === "delete") {
      var number, name;
      if (kind == 1) {
        number = this.state.list_array[index].number;
        name = this.state.list_array[index].name;
      } else {
        number = this.state.list_item[index].number;
        name = this.state.list_item[index].name;
      }
      this.setState({
        isDeleteConfirmModal : true,
        selected_number:number,
        kind:kind,
        confirm_message:'「' + name +'」　' + "このマスタを削除しますか?",
      })
    }
  };
  
  editData = (index, kind) => {
    if (kind ===1){
      this.setState({
        kind,
        modal_data:this.state.list_array[index],
        isOpenKindModal: true,
      });
    } else {
      this.setState({
        kind,
        modal_data:this.state.list_item[index],
        isOpenKindModal: true,
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
  
  deleteData = async () => {
    var path;
    if (this.state.status == 0){
      if (this.state.kind ==1){
        path = "/app/api/v2/master/inspection/deleteFirstKind";
      } else {
        path = "/app/api/v2/master/inspection/deleteSecondKind";
      }
    } else {
      if (this.state.kind ==1){
        path = "/app/api/v2/master/inspection/deleteInspectionType";
      } else {
        path = "/app/api/v2/master/inspection/deleteInspectionItem";
      }
    }
    
    let post_data = {
      params: {number:this.state.selected_number},
    };
    await apiClient.post(path,  post_data);
    this.confirmCancel();
    this.setState({
      selected_first_kind_number:0, 
      selected_classification1_id:null, 
      selected_inspection_type_id:null,
      is_loaded_two: true
    }, () => {
      this.getInspectionFirstKind();
    })
  };
  
  selectPattern = (pattern_number, selected_classification1_id, selected_inspection_type_id) => {
    this.setState({
      selected_first_kind_number:pattern_number, 
      selected_classification1_id, 
      selected_inspection_type_id,
      is_loaded_three: true
    }, ()=> {      
      if (this.state.status ==0){
        this.getSecondKindFromFirst(selected_classification1_id);
      } else {
        this.getSecondKindFromFirst(selected_inspection_type_id);
      }
    });
  }
  
  getInspectionMaster = id => {
    this.setState({
      inspection_master_id:id,
      selected_first_kind_number:0,
      selected_classification1_id:null,
      selected_inspection_type_id:null,
      is_loaded_two: true,      
    }, () => {
      this.getInspectionFirstKind();
    });
  }
  
  changeStatus = e => {
    this.setState({
      status:parseInt(e.target.value),
      inspection_master_id:e.target.value == 0 ? 1 : 17,
      selected_first_kind_number:0,
      is_loaded_two: true
    }, () => {
      this.getInspectionFirstKind();
    })
  }
  
  getClassSelect = e => {                 //表示区分
    this.setState({ 
      search_class: parseInt(e.target.id),
      is_loaded_two: true
    }, () => {
      this.getInspectionFirstKind();
    });
  };
  
  edit_inspection_master = (inspection_id, inspection_name) => {
    this.setState({
      isOpenEditInspectionMasterModal:true,
      inspection_id: inspection_id,
      inspection_name:inspection_name
    });
  }
  
  addInspection=()=>{
    this.setState({
      isOpenEditInspectionMasterModal:true,
      inspection_id:null,
      inspection_name:null,
    });
  }
  
  handleEditInspectionMaster=async()=>{
    this.setState({
      isOpenEditInspectionMasterModal: false
    });
    await this.getInspectionInfo();
    // this.handleOk();
  }
  
  get_title_pdf = async (inspection_name) => {
    let title = inspection_name+"_";
    let server_time = await getServerTime();
    title += (server_time.split(' ')[0]).split('/').join('');
    return title+".pdf";
  }
  
  printInspectionMaster=async(inspection_id, inspection_name)=>{
    this.setState({complete_message:"印刷中"});
    let path = "/app/api/v2/master/inspection/print/definition_master";
    let pdf_file_name = await this.get_title_pdf(inspection_name);
    let print_data = {};
    print_data.inspection_id = inspection_id;
    print_data.inspection_name = inspection_name;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
        this.setState({complete_message:""});
      })
  }
  
  render() {
    let {list_array, list_item, physiological_names, endscope_name} = this.state;
    let main_master_list = this.state.status == 0 ? physiological_names : endscope_name;
    return (
      <Card>
        <div style={{display:'flex'}}>
          <div className="title">検査マスタの管理</div>          
        </div>
        <div className="flex header-area">
          <div className='radio-area'>
            <Radiobox
              label={'生理検査'}
              value={0}
              getUsage={this.changeStatus.bind(this)}
              checked={this.state.status === 0 ? true : false}
              name={`status`}
            />
            <Radiobox
              label={'内視鏡検査'}
              value={1}
              getUsage={this.changeStatus.bind(this)}
              checked={this.state.status === 1 ? true : false}
              name={`status`}
            />
          </div>
          <SelectorWithLabel
            options={display_class}
            title="表示区分"
            getSelect={this.getClassSelect}
            departmentEditCode={display_class[this.state.search_class].id}
          />
        </div>
        <ListTitle>
          <div className="left-area">
            <div className="tl">検査マスタ</div>
            {this.state.status ===0 && (
              <div className="tr" onClick={this.addInspection.bind(this)}><Icon icon={faPlus} />追加</div>
            )}
          </div>
          <div className="left-area">
            <div className="tl">{this.state.status === 0 ?'検査分類1マスタ':'検査種別マスタ'}</div>
            <div className="tr" onClick={this.addFirstKind.bind(this,this.state.status)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="right-area">
            <div className="tl">{this.state.status ===0 ?'検査分類2マスタ':'検査項目マスタ'}</div>
            <div className="tr" onClick={this.addSecondKind.bind(this, this.state.status)}><Icon icon={faPlus} />追加</div>
          </div>
        </ListTitle>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table" style={{tableLayout:'fixed'}}>
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th className="name">検査マスタ名称</th>
            </tr>
            </thead>
            <tbody>
            {this.state.is_loaded_first == true ? (
              <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ):(
              <>
                {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
                  main_master_list.map((item, index) => {
                    return(
                      <>
                        <tr
                          className={this.state.inspection_master_id === item.id ? "selected clickable" : "clickable"}
                          onClick={this.getInspectionMaster.bind(this, item.id)}
                          onContextMenu={e => this.handleClick_define(e,item.id, item.name)}
                        >
                          <td className="td-no">{index+1}</td>
                          <td className="table-check">
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td style={{textAlign:'left'}}>{item.name}</td>
                        </tr>
                      </>
                    )
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </List>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th style={{width:'7rem'}}>{this.state.status == 0?'検査分類1ID':'検査種別ID'}</th>
              <th>{this.state.status == 0?'検査分類1マスタ名称':'検査種別マスタ名称'}</th>
            </tr>
            </thead>
            <tbody>
            {this.state.is_loaded_two == true ? (
              <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ):(
              <>
                {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                  list_array.map((item, index) => {
                    return (
                      <>
                        <tr className={this.state.selected_first_kind_number === item.number?"selected clickable":"clickable"} onClick={this.selectPattern.bind(this,item.number, item.classification1_id, item.inspection_type_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                          <td className="td-no">{index+1}</td>
                          <td className="table-check">
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td style={{width:'7rem',textAlign:"right"}}>{this.state.status == 0?item.classification1_id:item.inspection_type_id}</td>
                          <td className="tl">{item.name}</td>
                        </tr>
                      </>)
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </List>
        <Wrapper>
          <table className="table-scroll table table-bordered">
            <thead>
              <tr>
                <th className="td-no"/>
                <th className="table-check">表示</th>
                <th style={{width:'7rem'}}>{this.state.status == 0?'検査分類2ID':'検査項目ID'}</th>
                <th className="">{this.state.status == 0?'検査分類2マスタ名称':'検査項目マスタ名称'}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.is_loaded_three == true ? (
                <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              ):(
                <>
                  {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                    list_item.map((item, index) => {
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e,index, 0)}>
                            <td className="td-no">{index+1}</td>
                            <td className="table-check">
                              <Checkbox
                                label=""
                                value={item.is_enabled}
                                isDisabled={true}
                                name="check"
                              />
                            </td>
                            <td style={{width:'7rem',textAlign:"right"}}>{this.state.status == 0?item.classification2_id:item.inspection_item_id}</td>
                            <td className="tl">{item.name}</td>
                          </tr>
                        </>
                      )
                    })
                  )}
                </>
              )}
            </tbody>
          </table>
        </Wrapper>
        {this.state.isOpenKindModal && this.state.status ==0 && (
          <InspectionKindModal
            kind={this.state.kind}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            inspection_id = {this.state.inspection_master_id}
            first_kind_number = {this.state.selected_first_kind_number}
            classification1_id = {this.state.selected_classification1_id}
            modal_data = {this.state.modal_data}
          />
        )}
        {this.state.isOpenKindModal && this.state.status ==1 && (
          <EndscopeMasterModal
            kind={this.state.kind}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            first_kind_number = {this.state.selected_first_kind_number}
            inspection_type_id = {this.state.selected_inspection_type_id}
            modal_data = {this.state.modal_data}
          />
        )}
        {this.state.isOpenDefineModal && (
          <EditDefineModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            inspection_id = {this.state.inspection_id}
            inspection_name = {this.state.inspection_name}
            define_type = {this.state.define_type}
          />
        )}
        
        {this.state.isOpenEditInspectionMasterModal && (
          <EditInspectionMasterModal
            handleOk={this.handleEditInspectionMaster}
            closeModal={this.closeModal}
            inspection_id = {this.state.inspection_id}
            inspection_name = {this.state.inspection_name}
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
        />
        <ContextMenu_define
          {...this.state.contextMenu_define}
          parent={this}
        />
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </Card>
    )
  }
}

export default Inspection_Kind_Haruka