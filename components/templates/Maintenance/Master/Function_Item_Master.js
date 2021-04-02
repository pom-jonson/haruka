import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import FunctionItemClassificModal from "./Modal/FunctionItemClassificModal";
import FunctionItemModal from "./Modal/FunctionItemModal";
import auth from "~/api/auth";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
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
  .radio-area{
      margin-left:200px;
      padding-top:15px;
      label{
          font-size:18px;
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
      height: calc(100vh - 200px);
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
.table-check{
    width:60px;
}
.table-check-small {
    width: 3rem;
    label {
        margin-right:0;
    }
}
.item-id {
    width: 4rem;
}
.td-no {
  width: 2rem;
}
.code-number{
    width:100px;
}
.label-title{
    font-size:22px;
}
.footer {
    label {
        text-size: 16px;
        font-size:15px;
    }
    text-align: center;
  }
`;
const ListTitle = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 15px;
    width: 100%;
    height: 25px;
    float: left;
    margin-top: 21px;
    font-size: 17px;
    margin-bottom: 6px;
    span {
        color: blue;
    }
    
    .left-area {
        width: 15%;
        margin-right:1%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .middle-area {
        width: 20%;
        margin-right:1%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 63%;
        margin-right:1%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
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
    font-size: 14px;
    width: 15%;
    margin-right: 1%;
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
const Middle_List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;
    width: 20%;
    margin-right: 1%;
    float: left;
    border: solid 1px lightgrey;
    label {
        margin: 0;
    }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 63%;
  float: left;
  border: solid 1px lightgrey;
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

const attribute_list = [
  '',
  '文字列',
  '数字',
  '日付(カレンダ入力)',
  '和暦対応の日付',
  '定型入力',
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

class Function_Item_Master extends Component {
  constructor(props) {
    super(props);
    let main_master_list = [
      {function_id:1, function_name:'指導料'},
      {function_id:2, function_name:'在宅'},
      {function_id:3, function_name:'放射線'},
      {function_id:4, function_name:'精神'},
      {function_id:5, function_name:'リハビリ'},
      {function_id:6, function_name:'処置'},
      {function_id:7, function_name:'処方'},
      {function_id:8, function_name:'注射'},
      {function_id:9, function_name:'内視鏡'},
    ];
    this.state = {
      main_master_list,
      list_array:[],
      list_item:[],
      selected_function_id:1,
      selected_second_layer_number:0,
      selected_classific_id:null,
      selected_item_category_id:null,
      modal_data:null,
      
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    }
  }
  
  async componentDidMount(){
    auth.refreshAuth(location.pathname+location.hash);
    this.getSecondLayer();
  }
  
  addSecondLayer = () => {
    if (this.state.selected_function_id > 0){
      this.setState({
        kind:1,
        isOpenClassificModal: true,
        modal_data:null,
      });
    } else {
      window.sessionStorage.setItem("alert_messages", "機能を選択ください");
    }
    
  };
  
  addThirdLayer = () => {
    if (this.state.selected_item_category_id > 0){
      this.setState({
        kind:2,
        isOpenFunctionItemModal: true,
      });
    } else {
      window.sessionStorage.setItem("alert_messages", "機能毎品名分類を選択ください");
    }
  };
  
  closeModal = () => {
    this.setState({
      isOpenClassificModal: false,
      isOpenFunctionItemModal:false,
      modal_data:null,
    });
  };
  getSecondLayer = async() => {
    let path = '';
    let post_data;
    path = "/app/api/v2/master/item/searchItemClassific";
    post_data = {function_id:this.state.selected_function_id};
    
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res.length>0){
          this.setState({
            list_array:res,
            selected_second_layer_number: res[0].number,
            selected_item_category_id:res[0].item_category_id,
          }, () => {
            this.getThirdLayer();
          });
        } else {
          this.setState({
            list_array:[],
            list_item:[],
            selected_second_layer_number:0,
            selected_item_category_id:null,
          })
        }
        
      })
      .catch(() => {
      
      });
  }
  
  getThirdLayer = async() => {
    var path = "/app/api/v2/master/item/searchItems";
    var post_data = {
      function_id:this.state.selected_function_id,
      item_category_id:this.state.selected_item_category_id,
    };
    
    await apiClient
      ._post(path, {
        params: post_data
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
    switch(this.state.kind){
      case 0:
        break;
      case 1:
        this.getSecondLayer();
        break;
      case 2:
        this.getThirdLayer();
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
      this.editData(index, kind);
    } else if (act === "delete") {
      var number, name;
      switch(kind){
        case 0:
          number = this.state.main_master_list[index].number;
          name = this.state.main_master_list[index].name;
          break;
        case 1:
          number = this.state.list_array[index].number;
          name = this.state.list_array[index].name;
          break;
        case 2:
          number = this.state.list_item[index].number;
          name = this.state.list_item[index].name;
          break;
      }
      
      this.setState({
        isDeleteConfirmModal : true,
        selected_number:number,
        kind:kind,
        confirm_message:'「' + name.trim() +'」　' + "このマスタを削除しますか?",
      })
    }
  };
  
  editData = (index, kind) => {
    var modal_data;
    var isOpenClassificModal = false;
    var isOpenFunctionItemModal = false;
    switch(kind){
      case 0:
        modal_data = this.state.main_master_list[index];
        break;
      case 1:
        modal_data = this.state.list_array[index];
        isOpenClassificModal = true;
        break;
      case 2:
        modal_data = this.state.list_item[index];
        isOpenFunctionItemModal = true;
        break;
    }
    this.setState({
      kind,
      modal_data,
      isOpenClassificModal,
      isOpenFunctionItemModal,
    });
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
    let post_data = {
      params: {number:this.state.selected_number},
    };
    switch(this.state.kind){
      case 0:
        break;
      case 1:
        path = "/app/api/v2/master/item/deleteItemClassific";
        await apiClient.post(path,  post_data);
        this.setState({selected_second_layer_number:0, selected_item_category_id:null}, () => {
          this.getSecondLayer();
        })
        break;
      case 2:
        path = "/app/api/v2/master/item/deleteItem";
        await apiClient.post(path,  post_data);
        this.getThirdLayer();
        break;
    }
    this.confirmCancel();
  };
  
  getItems = (number, item_category_id) => {
    this.setState({
      selected_second_layer_number:number,
      selected_item_category_id: item_category_id
    }, () => {
      this.getThirdLayer();
    });
  }
  
  getItemClassific = (function_id) => {
    this.setState({
      selected_function_id:function_id,
      selected_second_layer_number:0,
    }, () => {
      this.getSecondLayer();
    });
  }
  
  render() {
    let {list_array, list_item, main_master_list} = this.state;
    return (
      <Card>
        <div style={{display:'flex'}}>
          <div className="title">追加品名管理</div>
        </div>
        
        <ListTitle>
          <div className="left-area">
            <div className="tl">機能</div>
            {/* <div className="tr" onClick={this.addFirstLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div> */}
          </div>
          <div className="middle-area">
            <div className="tl">機能毎品名分類</div>
            <div className="tr" onClick={this.addSecondLayer.bind(this)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="right-area">
            <div className="tl">機能毎品名</div>
            <div className="tr" onClick={this.addThirdLayer.bind(this)}><Icon icon={faPlus} />追加</div>
          </div>
        </ListTitle>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr>
              <th className="td-no"/>
              <th style={{width:'80px'}}>機能ID</th>
              <th className="name">機能名</th>
            </tr>
            </thead>
            <tbody>
            {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
              main_master_list.map((item, index) => {
                return(
                  <>
                    <tr className={this.state.selected_function_id === item.function_id?"selected clickable":"clickable"}
                        onClick={this.getItemClassific.bind(this, item.function_id)}>
                      <td className="td-no">{index+1}</td>
                      <td style={{width:'80px'}}>{item.function_id}</td>
                      <td style={{textAlign:'left'}}>{item.function_name}</td>
                    </tr>
                  </>
                )
              })
            )}
            </tbody>
          </table>
        </List>
        <Middle_List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th style={{width:'90px'}}>品名分類ID</th>
              <th className="name">品名分類名</th>
            </tr>
            </thead>
            <tbody>
            
            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
              list_array.map((item, index) => {
                return (
                  <>
                    <tr className={this.state.selected_second_layer_number === item.number?"selected clickable":"clickable"}
                        onClick={this.getItems.bind(this,item.number, item.item_category_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                      <td className="td-no">{index+1}</td>
                      <td className="table-check">
                        <Checkbox
                          label=""
                          value={item.is_enabled}
                          isDisabled={true}
                          name="check"
                        />
                      </td>
                      <td style={{width:'90px'}}>{item.item_category_id}</td>
                      <td className="tl">{item.name}</td>
                    </tr>
                  </>)
              })
            )}
            </tbody>
          </table>
        </Middle_List>
        <Wrapper>
          <table className="table-scroll table table-bordered">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check-small">表示</th>
              <th className="item-id">品名ID</th>
              <th style={{width:'15rem'}}>品名</th>
              <th style={{width: "5rem"}}>項目1表示</th>
              <th style={{width:'5rem'}}>項目1属性</th>
              <th style={{width:'5rem'}}>項目1単位</th>
              <th style={{width:'5rem'}}>項目2表示</th>
              <th style={{width:'5rem'}}>項目2属性</th>
              <th>項目2単位</th>
            </tr>
            </thead>
            <tbody style={{height:"calc(100vh - 200px)"}}>
            
            {list_item !== undefined && list_item !== null && list_item.length > 0 && (
              list_item.map((item, index) => {
                return (
                  <>
                    <tr onContextMenu={e => this.handleClick(e,index, 2)}>
                      <td className="td-no">{index+1}</td>
                      <td className="table-check-small">
                        <Checkbox
                          label=""
                          value={item.is_enabled}
                          isDisabled={true}
                          name="check"
                        />
                      </td>
                      <td className="item-id">{item.item_id}</td>
                      <td style={{width:'15rem'}} className="tl">{item.name.trim()}</td>
                      <td style={{width: "5rem"}}>
                        <Checkbox
                          label=""
                          value={item.input_item1_flag}
                          isDisabled={true}
                          name="check"
                        />
                      </td>
                      <td style={{width:'5rem'}}>{attribute_list[item.input_item1_attribute]}</td>
                      {/* <td style={{width:'75px'}}>{item.input_item1_format}</td> */}
                      <td style={{width:'5rem'}}>{item.input_item1_unit}</td>
                      {/* <td style={{width:'50px'}}>{item.input_item1_max_length}</td> */}
                      <td style={{width:'5rem'}}>
                        <Checkbox
                          label=""
                          value={item.input_item2_flag}
                          isDisabled={true}
                          name="check"
                        />
                      </td>
                      <td style={{width:'5rem'}}>{attribute_list[item.input_item2_attribute]}</td>
                      {/* <td style={{width:'75px'}}>{item.input_item2_format}</td> */}
                      <td>{item.input_item2_unit}</td>
                      {/* <td className="table-check-small">
                                                <Checkbox
                                                    label=""
                                                    value={item.number_full_angle_flag}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td> */}
                    </tr>
                  </>)
              })
            )}
            </tbody>
          </table>
        </Wrapper>
        {this.state.isOpenClassificModal && (
          <FunctionItemClassificModal
            kind={this.state.kind}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            modal_data = {this.state.modal_data}
            function_id = {this.state.selected_function_id}
          />
        )}
        
        {this.state.isOpenFunctionItemModal && (
          <FunctionItemModal
            kind={this.state.kind}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            modal_data = {this.state.modal_data}
            function_id = {this.state.selected_function_id}
            item_category_id = {this.state.selected_item_category_id}
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
      </Card>
    )
  }
}

export default Function_Item_Master