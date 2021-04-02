import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import TabCategoryModal from "./Modal/TabCategoryModal";
import EditMenuModal from "./Modal/EditMenuModal";
import auth from "~/api/auth";
import Button from "~/components/atoms/Button";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: relative;  
  width: 88vw;
  margin: 0px;
  height: 70vh;
  float: left;
  background-color: ${surface};
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
  .show-disable{
    color: lightgray;
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
      height: calc(100% - 2rem);
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
    width: 100px;
    text-align: center;
    label{
      margin-right: 0px;
      input{
        margin-right: 0px;
      }
    }
}
.table-check-display {    
    text-align: center;
    label{
      margin-right: 0px;
      input{
        margin-right: 0px;
      }
    }
}
.td-no {
  width: 25px;
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
    font-size: 1rem;
    span {
        color: blue;
    }
    
    .left-area {
        width: 20%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 56%;
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
    width: 20%;
    overflow:hidden;
    height: 67vh;
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
  font-size: 14px;
  height: 67vh;
  overflow-y: hidden;
  width: 56%;  
  float: left;  
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

class MenuSettingModal extends Component {
    constructor(props) {
        super(props);       
        this.state = {
            category_list:[],
            menu_list:[],
            isOpenKindModal: false,
            isEditMenuModal: false,
            selected_tab_id:0, 
            selected_category_id:0,            
            selected_tab_name:'', 
            selected_category_name:'',
            modal_data:null,
            isOpenTabCategoryModal:false,
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isBackConfirmModal: false,
            confirm_message: "",
            is_loaded_tab: true,
            is_loaded_category: true,
            is_loaded_menu: true,
        }
        this.props_menu_item = null;
        this.menu_list = null;
        if ( this.props.menu_id !== undefined && this.props.menu_id > 0) {
            let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
            this.menu_list = initState.navigation_menu;
            this.props_menu_item = this.menu_list.find(x=>x.id==this.props.menu_id);
        }
        this.change_flag = 0;
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        await this.getTabs();
    }

    addMenu = () => {
        if (!(this.state.selected_category_id>0) || !(this.state.selected_tab_id>0)){
            window.sessionStorage.setItem("alert_messages", 'カテゴリーを選択してください。');
            return;
        }
        
        this.setState({
            isEditMenuModal:true,
            kind:2,
        })
    };

    closeModal = () => {
        this.setState({
            isOpenKindModal: false,            
            modal_data:null,
            isEditMenuModal:false,
            isOpenTabCategoryModal:false,
        });
    };

    getTabs = async() => {
        let path = '';        
        path = "/app/api/v2/master/menu/searchTabs";
        
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                if (this.props_menu_item !== undefined && this.props_menu_item != null) {
                  let selected_tab_id = res.find(x=>x.tab_name == this.props_menu_item.tab).tab_id;
                    this.setState({
                        tab_list:res,
                        selected_tab_id,
                        selected_tab_name:this.props_menu_item.tab,
                        is_loaded_tab: false,
                        is_loaded_category: true
                    },()=>{
                        this.getCategory(selected_tab_id);
                    });
                } else {
                  let selected_tab_id = this.state.selected_tab_id >0?this.state.selected_tab_id:res[0].tab_id;
                    this.setState({
                        tab_list:res,
                        selected_tab_id,
                        selected_tab_name:this.state.selected_tab_name !=''?this.state.selected_tab_name:res[0].tab_name,
                        is_loaded_tab: false,
                        is_loaded_category: true
                    },()=>{
                        this.getCategory(selected_tab_id);
                    });
                }
            } else {
                this.setState({
                    tab_list:[],
                    category_list:[],
                    menu_list:[],
                    selected_tab_id:0,
                    selected_tab_name:'',
                    is_loaded_tab: false,
                    is_loaded_category: false,
                    is_loaded_menu: false,
                })
            }
          })
          .catch(() => {
            this.setState({
              is_loaded_category: false,
              is_loaded_menu: false,
              is_loaded_tab: false,
            });
          });
    }
    getCategory = async(tab_id) => {
        let path = '';
        let post_data;        
        path = "/app/api/v2/master/menu/searchCategory";
        post_data = {tab_id:tab_id};
        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length>0){
                if (this.props_menu_item !== undefined && this.props_menu_item != null) {
                  let selected_category_id = res.find(x=>x.category_id==this.props_menu_item.category_id).category_id;

                    this.setState({
                        category_list:res,
                        selected_category_id,
                        selected_category_name : res[0].category_name,
                        is_loaded_category: false,
                        is_loaded_menu: true,
                    },()=>{
                        this.getMenus(this.state.selected_tab_id, selected_category_id);
                    });
                } else {
                  let selected_category_id = res[0].category_id;
                    this.setState({
                        category_list:res,
                        selected_category_id,
                        selected_category_name : res[0].category_name,
                        is_loaded_category: false,
                        is_loaded_menu: true,
                    },()=>{
                        this.getMenus(this.state.selected_tab_id, selected_category_id);
                    });
                }
            } else {
                this.setState({
                    category_list:[],
                    menu_list:[],
                    selected_category_id:0,
                    selected_category_name:'',
                    is_loaded_category: false,
                    is_loaded_menu: false,
                })
            }
            
          })
          .catch(() => {
            this.setState({
              is_loaded_category: false,
              is_loaded_menu: false,
            });
          });
    }

    getMenus = async(tab_id, category_id) => {
        var path = "/app/api/v2/master/menu/searchMenu";
        var post_data = {
            tab_id:tab_id,
            category_id:category_id
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
              if (this.props_menu_item !== undefined && this.props_menu_item != null) {
                  this.setState({
                      menu_list:res,
                      selected_menu_index:res.findIndex(x=>x.id==this.props_menu_item.id),
                      is_loaded_menu: false
                  });
              } else {
                    this.setState({
                        menu_list:res,
                        is_loaded_menu: false
                    });
              }
          })
          .catch(() => {
            this.setState({
              is_loaded_menu: false
            });
          });
    }

    handleOk = () => {        
        switch(this.state.kind){
            case 0:
                this.setState({
                  is_loaded_tab: true,
                  is_loaded_category: true,
                  is_loaded_menu: true,
                }, ()=> {
                  this.getTabs();
                });
                break;
            case 1:
                this.setState({                  
                  is_loaded_category: true,
                  is_loaded_menu: true,
                }, ()=> {                  
                  this.getCategory(this.state.selected_category_id);
                });
                break;
            case 2:
                this.setState({                  
                  is_loaded_menu: true,
                }, ()=> {                  
                  this.getMenus(this.state.selected_tab_id, this.state.selected_category_id);
                });
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
                    number = this.state.tab_list[index].number;
                    name = this.state.tab_list[index].tab_name;
                    break;
                case 1:                    
                    number = this.state.category_list[index].number;
                    name = this.state.category_list[index].category_name;
                    break;
                case 2:
                    number = this.state.menu_list[index].number;
                    name = this.state.menu_list[index].name;
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
        switch(kind){
            case 0:
                modal_data = this.state.tab_list[index];
                break;
            case 1:
                modal_data = this.state.category_list[index];
                break;
            case 2:
                modal_data = this.state.menu_list[index];
                break;
        }        
        this.setState({
            kind,
            modal_data,
            isEditMenuModal : kind ==2 ? true : false,
            isOpenTabCategoryModal : kind!=2 ? true : false,
        });
      };

      confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isBackConfirmModal: false,
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
                path = "/app/api/v2/master/menu/deleteTab";
                await apiClient.post(path,  post_data);
                this.setState({
                  selected_tab_id:0, selected_tab_name:'',
                  is_loaded_tab: true, 
                  is_loaded_category: true, 
                  is_loaded_menu: true, 
                }, () => {
                    this.getTabs();
                })
                break;
            case 1:                    
                path = "/app/api/v2/master/menu/deleteCategory";
                await apiClient.post(path,  post_data);
                this.setState({
                  selected_category_id:0, selected_category_name:'',
                  is_loaded_category: true, 
                  is_loaded_menu: true, 
                }, () => {
                  this.getCategory(0);
                });
                break;
            case 2:
                path = "/app/api/v2/master/menu/deleteMenu";
                await apiClient.post(path,  post_data);
                this.setState({
                  is_loaded_menu: true,
                }, ()=> {
                  this.getMenus(this.state.selected_tab_id, this.state.selected_category_id);
                });
                break;
        }        
        this.confirmCancel();
      };

      selectCategory = (item) => {
        this.setState({
            selected_category_id:item.category_id,
            selected_category_name:item.category_name,
        });
        this.getMenus(this.state.selected_tab_id, item.category_id);
      }

      selectTab = (item) => {
        this.setState({              
            selected_tab_id:item.tab_id,
            selected_tab_name:item.tab_name,
            selected_category_id:0,
            selected_category_name:'',
        });
        this.props_menu_item = null;
        this.getCategory(item.tab_id);
      }

      addTabCategory = (kind) => {
        if (kind ==1 && !(this.state.selected_tab_id > 0)){
            window.sessionStorage.setItem("alert_messages", 'タブを選択してください。');
            return;
        }
        this.setState({
            kind,
            modal_data:null,
            isOpenTabCategoryModal:true,
        })   
      };

      registerMenuItem = () =>{
          let {menu_list} = this.state;
          if (this.state.selected_menu_index === undefined && this.state.selected_menu_index == null) {
              window.sessionStorage.setItem("alert_messages", 'メニューを選択してください。');
              return;
          }
          let selected_menu = menu_list[this.state.selected_menu_index];
          this.props.handleOk(selected_menu);
      };

    selectMenuItem = (index, enabled_in_default_page) => {
        // ■YJ781 ログイン時画面・ホームボタン関連の修正
        if (enabled_in_default_page != undefined && enabled_in_default_page == 1) {            
            let menu_item = this.state.menu_list[index];
            if (menu_item.is_visible == 0 || menu_item.is_enabled == 0) return;
            this.change_flag = 1;
            this.setState({selected_menu_index:index});
        }
    };

    handleCloseModal = () => {
      if (this.change_flag == 1) {
        this.setState({
          isBackConfirmModal: true,
          confirm_message:
            "登録していない内容があります。変更内容を破棄して移動しますか？",
        });
      } else {
        this.props.closeModal();
      }      
    }

    render() {
        let {category_list, menu_list, tab_list} = this.state;
        return (
            <Modal
                show={true}
                className="auto-width-modal prescript-pattern-modal first-view-modal"
            >
                <Modal.Header>
                    <Modal.Title>ホーム画面設定</Modal.Title>
                </Modal.Header>
                <Modal.Body>
            <Card>
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">タブ</div>
                        
                    </div>
                    <div className="left-area">
                        <div className="tl">カテゴリ</div>
                        
                    </div>
                    <div className="right-area">
                        <div className="tl">メニュー</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className='td-no'/>
                            <th style={{width:'50px'}}>ID</th>
                            <th className="name">タブ名</th>
                        </tr>
                        </thead>
                        <tbody>
                          {this.state.is_loaded_tab == true ? (
                            <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                              <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                              </SpinnerWrapper>
                            </div>
                          ):(
                            <>
                              {tab_list != undefined && tab_list != null && tab_list.length>0 && (
                                  tab_list.map((item, index) => {
                                      return(
                                          <>
                                              <tr className={this.state.selected_tab_id == item.tab_id?"selected clickable":"clickable"}
                                              onClick={this.selectTab.bind(this, item)}>
                                                  <td className='td-no'>{index+1}</td>
                                                  <td style={{width:'50px'}}>{item.tab_id}</td>
                                                  <td style={{textAlign:'left'}}>{item.tab_name}</td>
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
                            <th className='td-no'/>                            
                            <th style={{width:'50px'}}>ID</th>
                            <th className="name">カテゴリ名</th>
                        </tr>
                        </thead>
                        <tbody style={{height:"63vh"}}>
                        {this.state.is_loaded_category == true ? (
                            <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                              <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                              </SpinnerWrapper>
                            </div>
                          ):(
                            <>
                              {category_list !== undefined && category_list !== null && category_list.length > 0 && (
                                  category_list.map((item, index) => {
                                      return (
                                          <>
                                              <tr className={this.state.selected_category_id === item.category_id?"selected clickable":"clickable"}
                                               onClick={this.selectCategory.bind(this,item)}>
                                                  <td className='td-no'>{index+1}</td>
                                                  <td style={{width:'50px'}}>{item.category_id}</td>
                                                  <td className="tl">{item.category_name}</td>
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
                            <th className="table-check">有効/無効</th>
                            <th className="table-check-display" style={{width:"50px"}}>表示</th>
                            <th className="table-check">メニューID</th>
                            <th className="">メニュー名</th>
                            <th className="table-check">カルテの記載を行う</th>
                            <th className="table-check">患者ページで使用</th>
                            <th className="table-check">その他のページで使用</th>                            
                        </tr>
                        </thead>
                        <tbody style={{height:"calc(65vh - 3rem)",maxHeight:"64vh"}}>
                        {this.state.is_loaded_menu == true ? (
                            <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                              <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                              </SpinnerWrapper>
                            </div>
                          ):(
                            <>
                              {menu_list !== undefined && menu_list !== null && menu_list.length > 0 && (
                                  menu_list.map((item, index) => {
                                      return (
                                          <>
                                              <tr onClick={this.selectMenuItem.bind(this,index, item.enabled_in_default_page)}
                                                  className={`${item.enabled_in_default_page != undefined && item.enabled_in_default_page == 1 && item.is_enabled == 1 && item.is_visible == 1 ? this.state.selected_menu_index === index ? "selected clickable":"clickable" : "show-disable" }`}>
                                                  <td className="td-no">{index+1}</td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.is_enabled}
                                                          isDisabled={true}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check-display" style={{width:"50px"}}>
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.is_visible}
                                                          isDisabled={true}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check">{item.id}</td>
                                                  <td className="tl">{item.name.trim()}</td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.enabled_karte}
                                                          isDisabled={true}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""
                                                          value={item.enabled_in_patient_page}
                                                          isDisabled={true}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.enabled_in_default_page}
                                                          isDisabled={true}
                                                          name="check"
                                                      />
                                                  </td>
                                              </tr>
                                          </>)
                                  })
                              )}
                            </>
                          )}
                        </tbody>
                    </table>
                </Wrapper>                
                {this.state.isOpenTabCategoryModal && (
                    <TabCategoryModal
                        kind={this.state.kind}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                                     
                        modal_data = {this.state.modal_data}
                        tab_id = {this.state.kind ==1? this.state.selected_tab_id:null}
                    />
                )}

                {this.state.isEditMenuModal && (
                    <EditMenuModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        modal_data = {this.state.modal_data}
                        tab_id = {this.state.selected_tab_id}
                        category_id = {this.state.selected_category_id}
                        tab = {this.state.selected_tab_name}
                        category = {this.state.selected_category_name}
                        tab_list = {this.state.tab_list}
                        category_list = {this.state.category_list}
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
                {this.state.isBackConfirmModal !== false && (
                  <SystemConfirmJapanModal
                    hideConfirm={this.confirmCancel.bind(this)}
                    confirmCancel={this.confirmCancel.bind(this)}
                    confirmOk={this.props.closeModal}
                    confirmTitle={this.state.confirm_message}
                  />
                )}
                <ContextMenu
                    {...this.state.contextMenu}
                    parent={this}
                />                
            </Card>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
                  <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} isDisabled={this.change_flag == 0} onClick={this.registerMenuItem}>{this.props.menu_id != null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
MenuSettingModal.propTypes = {
    menu_id: PropTypes.object,
    closeModal: PropTypes.func,
    handleOk: PropTypes.func
};
export default MenuSettingModal