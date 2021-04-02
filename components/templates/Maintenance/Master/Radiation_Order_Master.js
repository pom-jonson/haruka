import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import EditRadiationMasterModal from "./Modal/EditRadiationMasterModal";
import EditRadiationMainMasterModal from "./Modal/EditRadiationMainMasterModal";
import EditDefineModal from "./Modal/EditDefineModal";
import EditInspectionMasterModal from "./Modal/EditInspectionMasterModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import auth from "~/api/auth";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  height: 100vh;
  padding-top: 1.25remx;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 5px #69c8e1;
    margin-bottom:10px;
  }
  .radio-area{
      margin-left:12.5rem;
      padding-top:1rem;
      label{
          font-size:1rem;
      }
  }
  .selected{
      background:lightblue!important;
  }
  .clickable{
    cursor:pointer;
}
table {
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 14rem);
      overflow-y:auto;
      display:block;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
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
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
 }
.table-check {
    width: 3.75rem;
}
.td-no {
  width: 1.5rem;
}
.label-title{
    font-size:1.3rem;
}
.footer {
    label {
        text-size: 1rem;
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
    height: 1.5rem;
    float: left;
    margin-top: 1.25rem;
    font-size: 1rem;
    margin-bottom: 0.4rem;
    span {
        color: blue;
    }
    .pullbox-select{
        font-size:0.9rem;
    }
    
    .left-area {
        width: 27%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        .label-title{
            font-size:1rem;
            width:4.5rem;
        }
        .pullbox-select, .pullbox-label{
            width:6.25rem;
        }
        .pullbox{
            margin-right:2px;
        }
    }
    .right-area {
        width: 42%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        .label-title{
            font-size:1rem;
            width:4.5rem;
        }
        .pullbox-select, .pullbox-label{
            width:6.25rem;
        }
        .pullbox{
            margin-right:3rem;
        }
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
    width: 27%;
    margin-right: 2%;
    float: left;
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
  width: 42%;
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
 `;
const ContextMenuUl = styled.ul`
    margin-bottom:0;
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
    width:11rem;
  }
  .context-menu li {
    clear: both;
    width: 11rem;
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

const main_order = [
  // { id: 0, value: "" },
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "名称", field_name:"name"},
];
const classific_order = [
  // { id: 0, value: "" },
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "名称", field_name:"radiation_shooting_classific_name"},
];
const part_order = [
  // { id: 0, value: "" },
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "名称", field_name:"radiation_part_name"},
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
          <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>変更</div></li>
          <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextMenu_define = ({visible,x,y,parent,radiation_order_id, name}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {/* <li><div onClick={() =>parent.edit_define(0, radiation_order_id, name)}>検査目的定義マスタ</div></li> */}
          {/* <li><div onClick={() =>parent.edit_define(1, radiation_order_id, name)}>現症定義マスタ</div></li> */}
          <li><div onClick={() =>parent.edit_define(2, radiation_order_id, name)}>依頼区分定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_define(3, radiation_order_id, name)}>患者移動形態定義マスタ</div></li>
          <li><div onClick={() =>parent.edit_radiation_order_master(radiation_order_id, name)}>検査マスタ編集</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
class Radiation_Order_Master extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      list_array:[],
      list_item:[],
      isOpenKindModal: false,
      openRaditionMainModal:false,
      selected_radiation_id:0,
      selected_classfic_id:null,
      modal_data:null,
      
      search_main_order: 0,
      search_main_class: 1,
      search_classific_order: 0,
      search_classific_class: 1,
      search_part_order: 0,
      search_part_class: 1,
      
      openDefineModal:false,
      openEditInspectionMasterModal:false,
      
      
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    }
  }
  
  async componentDidMount(){
    auth.refreshAuth(location.pathname+location.hash);
    this.getRadiationOrder();
  }
  
  getRadiationOrder = async() => {
    let path = "/app/api/v2/master/radiation/searchRadiationMaster";
    await apiClient
      ._post(path, {
        params: {
          is_enabled: this.state.search_main_class,
          order:main_order[this.state.search_main_order].field_name,
        }
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            main_master_list:res,
            selected_radiation_id:this.state.selected_radiation_id>0?this.state.selected_radiation_id:res[0].radiation_order_id,
          }, () => {
            this.getRadiationClassific(this.state.selected_radiation_id);
          })
        } else {
          this.setState({
            main_master_list:[],
            list_array:[],
            list_item:[],
            selected_radiation_id:null,
            selected_classfic_id:null,
            selected_part_id: null,
          })
        }
      })
      .catch(() => {
      
      });
  }
  
  getMainOrderSelect = e => {                 //表示順
    this.setState({ search_main_order: parseInt(e.target.id)}, () => {
      this.getRadiationOrder();
    });
  };
  getClassficOrderSelect = e => {                 //表示順
    this.setState({ search_classific_order: parseInt(e.target.id)}, () => {
      this.getRadiationClassific(this.state.selected_radiation_id);
    });
  };
  getPartOrderSelect = e => {                 //表示順
    this.setState({ search_part_order: parseInt(e.target.id)}, () => {
      this.getRadiationPart();
    });
  };
  getMainClassSelect = e => {                 //表示区分
    this.setState({ search_main_class: parseInt(e.target.id)}, ()=> {
      this.getRadiationOrder();
    });
  };
  getClassificClassSelect = e => {                 //表示区分
    this.setState({ search_classific_class: parseInt(e.target.id)}, () => {
      this.getRadiationClassific(this.state.selected_radiation_id);
    });
  };
  
  getPartClassSelect = e => {                 //表示区分
    this.setState({ search_part_class: parseInt(e.target.id) }, () => {
      this.getRadiationPart();
    });
  };
  
  addClassific = () => {
    this.setState({
      kind:1,
      isOpenKindModal: true,
      selected_classfic_id:null,
      modal_data:null
    });
  };
  closeModal = () => {
    this.setState({
      isOpenKindModal: false,
      openDefineModal: false,
      openEditInspectionMasterModal:false,
      openRaditionMainModal:false,
      modal_data:null
    });
  };
  addPart = () => {
    this.setState({
      kind:0,
      isOpenKindModal: true,
      modal_data:null,
      
    });
  };
  
  getRadiationClassific = async(selected_id) => {
    let path = '';
    let post_data;
    
    path = "/app/api/v2/master/radiation/searchClassificMaster";
    post_data = {
      radiation_order_id:this.state.selected_radiation_id,
      radiation_shooting_classific_id:selected_id,
      is_enabled: this.state.search_classific_class,
      order:classific_order[this.state.search_classific_order].field_name,
    };
    
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            list_array:res,
            selected_classfic_id:this.state.selected_classfic_id>0?this.state.selected_classfic_id:res[0].radiation_shooting_classific_id,
          }, () => {
            this.getRadiationPart(this.state.selected_classfic_id);
          })
        } else {
          this.setState({
            list_array:[],
            list_item:[],
            selected_classfic_id:null,
            selected_part_id:null
          })
        }
      })
      .catch(() => {
      
      });
  }
  
  getRadiationPart = async() => {
    let path = '';
    path = "/app/api/v2/master/radiation/searchPartMaster";
    
    await apiClient
      ._post(path, {
        params: {
          radiation_shooting_classific_id:this.state.selected_classfic_id,
          is_enabled: this.state.search_part_class,
          order:part_order[this.state.search_part_order].field_name,
        }
      })
      .then((res) => {
        this.setState({
          list_item:res,
        });
      })
      .catch(() => {
      
      });
  }
  
  handleOk = () => {
    this.getRadiationClassific(this.state.selected_radiation_id);
    this.closeModal();
  };
  
  
  
  handleClick_define = (e, radiation_order_id, name) => {
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
      this.setState({
        contextMenu_define: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          radiation_order_id: radiation_order_id,
          name: name
        },
        contextMenu:{visible:false}
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
  
  edit_define = (type, radiation_order_id, name) => {
    this.setState({
      openDefineModal:true,
      define_type: type,
      radiation_order_id: radiation_order_id,
      name:name
    })
  }
  
  edit_radiation_order_master = (radiation_order_id, name) => {
    this.setState({
      openEditInspectionMasterModal:true,
      radiation_order_id: radiation_order_id,
      name:name
    })
  }
  
  contextMenuAction = (act, index, kind) => {
    if( act === "edit") {
      this.editData(index, kind);
    } else if (act === "delete") {
      var number, name;
      if (kind == 1) {
        number = this.state.list_array[index].number;
        name = this.state.list_array[index].radiation_shooting_classific_name;
      }
      if (kind ==0) {
        number = this.state.list_item[index].number;
        name = this.state.list_item[index].radiation_part_name;
      }
      if (kind ==2) {
        number = this.state.main_master_list[index].number;
        name = this.state.main_master_list[index].name;
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
    }
    if (kind === 0 ) {
      this.setState({
        kind,
        modal_data:this.state.list_item[index],
        isOpenKindModal: true,
      });
    }
    if(kind ===2){
      this.setState({
        kind,
        modal_data:this.state.main_master_list[index],
        openRaditionMainModal: true,
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
    if (this.state.kind ==1){
      path = "/app/api/v2/master/radiation/deleteClassific";
    }
    if (this.state.kind == 0){
      path = "/app/api/v2/master/radiation/deletePart";
    }
    if (this.state.kind == 2){
      path = "/app/api/v2/master/radiation/deleteMainMaster";
    }
    let post_data = {
      params: {number:this.state.selected_number},
    };
    await apiClient.post(path,  post_data);
    this.confirmCancel();
    this.setState({selected_classfic_id:null, selected_part_id:null}, () => {
      if (this.state.kind == 2){
        this.getRadiationOrder();
      } else {
        this.getRadiationClassific(this.state.selected_radiation_id);
      }
    })
  };
  
  selectClassific = (number, selected_classfic_id) => {
    this.setState({selected_classific_number:number, selected_classfic_id});
    this.getRadiationClassific(selected_classfic_id);
  }
  
  getRadiationMaster = id => {
    this.setState({
      selected_radiation_id:id,
      selected_classfic_id:null,
    }, () => {
      this.getRadiationClassific(this.state.selected_radiation_id);
    });
  }
  
  render() {
    let {list_array, list_item, main_master_list} = this.state;
    return (
      <Card>
        <div style={{display:'flex'}}>
          <div className="title">放射線オーダーマスタ</div>
        </div>
        <ListTitle>
          <div className="left-area">
            <SelectorWithLabel
              options={main_order}
              title="表示順"
              getSelect={this.getMainOrderSelect}
              departmentEditCode={main_order[this.state.search_main_order].id}
            />
            <SelectorWithLabel
              options={display_class}
              title="表示区分"
              getSelect={this.getMainClassSelect}
              departmentEditCode={display_class[this.state.search_main_class].id}
            />
          </div>
          <div className="left-area">
            <SelectorWithLabel
              options={classific_order}
              title="表示順"
              getSelect={this.getClassficOrderSelect}
              departmentEditCode={classific_order[this.state.search_classific_order].id}
            />
            <SelectorWithLabel
              options={display_class}
              title="表示区分"
              getSelect={this.getClassificClassSelect}
              departmentEditCode={display_class[this.state.search_classific_class].id}
            />
          </div>
          <div className="right-area">
            <SelectorWithLabel
              options={part_order}
              title="表示順"
              getSelect={this.getPartOrderSelect}
              departmentEditCode={part_order[this.state.search_part_order].id}
            />
            <SelectorWithLabel
              options={display_class}
              title="表示区分"
              getSelect={this.getPartClassSelect}
              departmentEditCode={display_class[this.state.search_part_class].id}
            />
          </div>
        </ListTitle>
        
        <ListTitle>
          <div className="left-area">
            <div style={{textAlign:'center'}}>放射線オーダーマスタ</div>
          </div>
          <div className="left-area">
            <div className="tl">放射撮影区分マスタ</div>
            <div className="tr" onClick={this.addClassific.bind(this)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="right-area">
            <div className="tl">放射線部位マスタ</div>
            <div className="tr" onClick={this.addPart.bind(this)}><Icon icon={faPlus} />追加</div>
          </div>
        </ListTitle>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th className="name">放射線オーダー名</th>
            </tr>
            </thead>
            <tbody>
            {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
              main_master_list.map((item, index) => {
                return(
                  <>
                    <tr className={this.state.selected_radiation_id === item.radiation_order_id?"selected clickable":"clickable"}
                        onClick={this.getRadiationMaster.bind(this, item.radiation_order_id)}
                        onContextMenu={e => this.handleClick(e,index,2)}
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
            </tbody>
          </table>
        </List>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th style={{width:'100px'}}>撮影区分ID</th>
              <th className="name">撮影区分名</th>
            </tr>
            </thead>
            <tbody>
            
            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
              list_array.map((item, index) => {
                return (
                  <>
                    <tr className={this.state.selected_classfic_id === item.radiation_shooting_classific_id?"selected clickable":"clickable"} onClick={this.selectClassific.bind(this,item.number, item.radiation_shooting_classific_id)} onContextMenu={e => this.handleClick(e,index,1)}>
                      <td className="td-no">{index+1}</td>
                      <td className="table-check">
                        <Checkbox
                          label=""
                          value={item.is_enabled}
                          isDisabled={true}
                          name="check"
                        />
                      </td>
                      <td style={{width:'100px'}}>{item.radiation_shooting_classific_id}</td>
                      <td className="tl">{item.radiation_shooting_classific_name}</td>
                    </tr>
                  </>)
              })
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
              <th style={{width:'80px'}}>部位ID</th>
              <th className="">部位名</th>
            </tr>
            </thead>
            <tbody>
            
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
                      <td style={{width:'80px'}}>{item.radiation_part_id}</td>
                      <td className="tl">{item.radiation_part_name}</td>
                    </tr>
                  </>)
              })
            )}
            </tbody>
          </table>
        </Wrapper>
        {this.state.openRaditionMainModal && (
          <EditRadiationMainMasterModal
            kind={this.state.kind}
            handleOk={this.getRadiationOrder}
            closeModal={this.closeModal}
            modal_data = {this.state.modal_data}
          />
        )}
        {this.state.isOpenKindModal && (
          <EditRadiationMasterModal
            kind={this.state.kind}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            radiation_order_id = {this.state.selected_radiation_id}
            classific_id = {this.state.selected_classfic_id}
            modal_data = {this.state.modal_data}
          />
        )}
        {this.state.openDefineModal && (
          <EditDefineModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            radiation_order_id = {this.state.radiation_order_id}
            define_type = {this.state.define_type}
          />
        )}
        {this.state.openEditInspectionMasterModal && (
          <EditInspectionMasterModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            radiation_order_id = {this.state.radiation_order_id}
            name = {this.state.name}
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
      </Card>
    )
  }
}

export default Radiation_Order_Master