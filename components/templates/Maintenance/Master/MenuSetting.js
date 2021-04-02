import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import { number } from "prop-types";
import TabCategoryModal from "./Modal/TabCategoryModal";
import EditMenuModal from "./Modal/EditMenuModal";
import auth from "~/api/auth";
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
  font-size: 15px;
  margin-right: 5px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  height: 100vh;
  padding-top: 1.25rem;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom:10px;
  }
  .radio-area{
      margin-left:200px;
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
.tr-head{
  width: calc(100% - 17px);
}
th{
  border-top: none !important;
  border-bottom: none !important;
}
table {
    font-size:1rem;
    margin-bottom:0;
    thead{
      display: table;
      border-bottom: 1px solid #dee2e6 !important;
      width:100%;
    }
    tbody{
      height: calc(100vh - 200px);
      overflow-y:scroll;
      display:block;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
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
    width: 6rem;
    label{
      margin-right: 0px;
      input{
        margin-right: 0px;
      }
    }
}
.td-no {
  width: 2rem;
}
.code-number{
    width:6rem;
}
.label-title{
    font-size:1.25rem;
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
    font-size: 15px;
    width: 100%;
    height: 25px;
    float: left;
    margin-top: 21px;
    font-size: 1rem;
    margin-bottom: 6px;
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
    font-size: 1rem;
    width: 20%;
    margin-right: 2%;
    float: left;
    // border: solid 1px lightgrey;
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
  width: 56%;
  float: left;
  // border: solid 1px lightgrey;
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
    width:5rem;
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

class MenuSetting extends Component {
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
      confirm_message: "",
      is_loaded_tab: true,
      is_loaded_category: true,
      is_loaded_menu: true,
    }
  }
  
  async componentDidMount(){
    auth.refreshAuth(location.pathname+location.hash);
    this.getTabs();
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
          this.setState({
            tab_list:res,
            selected_tab_id:this.state.selected_tab_id >0?this.state.selected_tab_id:res[0].tab_id,
            selected_tab_name:this.state.selected_tab_name !=''?this.state.selected_tab_name:res[0].tab_name,
            is_loaded_tab: false,
            is_loaded_category: true
          }, () => {
            this.getCategory();
          })
        } else {
          this.setState({
            tab_list:[],
            category_list:[],
            menu_list:[],
            selected_tab_id:0,
            selected_tab_name:'',
            is_loaded_tab: false,
            is_loaded_category: false
          })
        }
      })
      .catch(() => {
        this.setState({
          is_loaded_tab: false,
          is_loaded_category: false,
          is_loaded_menu: false
        });
      });
  }
  getCategory = async() => {
    let path = '';
    let post_data;
    path = "/app/api/v2/master/menu/searchCategory";
    post_data = {tab_id:this.state.selected_tab_id};
    
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res.length>0){
          this.setState({
            category_list:res,
            selected_category_id: res[0].category_id,
            selected_category_name : res[0].category_name,
            is_loaded_category: false,
            is_loaded_menu: true,
          }, () => {
            this.getMenus();
          });
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
  
  getMenus = async() => {
    var path = "/app/api/v2/master/menu/searchMenu";
    var post_data = {
      tab_id:this.state.selected_tab_id,
      category_id:this.state.selected_category_id
    };
    
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          menu_list:res,
          is_loaded_menu: false
        });
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
          is_loaded_tab: false
        }, () => {
          this.getTabs();
        });
        break;
      case 1:
        this.setState({
          is_loaded_category: false
        }, () => {          
          this.getCategory();
        });
        break;
      case 2:
        this.setState({
          is_loaded_menu: false
        }, () => {                    
          this.getMenus();
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
          is_loaded_tab: true
        }, () => {
          this.getTabs();
        })
        break;
      case 1:
        path = "/app/api/v2/master/menu/deleteCategory";
        await apiClient.post(path,  post_data);
        this.setState({
          selected_category_id:0, selected_category_name:'',
          is_loaded_category: true
        }, () => {
          this.getCategory();
        })
        break;
      case 2:
        path = "/app/api/v2/master/menu/deleteMenu";
        await apiClient.post(path,  post_data);
        this.setState({
          is_loaded_menu: true
        }, () => {
          this.getMenus();
        });
        break;
    }
    this.confirmCancel();
  };
  
  selectCategory = (item) => {
    this.setState({
      selected_category_id:item.category_id,
      selected_category_name:item.category_name,
      is_loaded_menu: true
    }, () => {
      this.getMenus();
    });
  }
  
  selectTab = (item) => {
    this.setState({
      selected_tab_id:item.tab_id,
      selected_tab_name:item.tab_name,
      selected_category_id:0,
      selected_category_name:'',
      is_loaded_category: true,
    }, () => {
      this.getCategory();
    });
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
  }
  
  render() {
    let {category_list, menu_list, tab_list} = this.state;
    return (
      <Card>
        <div style={{display:'flex'}}>
          <div className="title">メニュー設定</div>
        </div>
        
        <ListTitle>
          <div className="left-area">
            <div className="tl">タブ</div>
            <div className="tr" onClick= {this.addTabCategory.bind(this, 0)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="left-area">
            <div className="tl">カテゴリ</div>
            <div className="tr" onClick= {this.addTabCategory.bind(this, 1)}>
              <Icon icon={faPlus} />追加
            </div>
          </div>
          <div className="right-area">
            <div className="tl">メニュー</div>
            <div className="tr" onClick={this.addMenu.bind(this)}><Icon icon={faPlus} />追加</div>
          </div>
        </ListTitle>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr className="tr-head">
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
                            onClick={this.selectTab.bind(this, item)} onContextMenu={e => this.handleClick(e,index, 0)}>
                          <td className='td-no'>{index+1}</td>
                          <td style={{width:'50px', textAlign:"right"}}>{item.tab_id}</td>
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
            <tr className="tr-head">
              <th className='td-no'/>
              <th style={{width:'50px'}}>ID</th>
              <th className="name">カテゴリ名</th>
            </tr>
            </thead>
            <tbody>
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
                            onClick={this.selectCategory.bind(this,item)} onContextMenu={e => this.handleClick(e,index, 1)}>
                          <td className='td-no'>{index+1}</td>
                          {/* <td className='table-check'>
                                                    <Checkbox
                                                        label=""
                                                        value={item.is_enabled}
                                                        isDisabled={true}
                                                        name="check"
                                                    />
                                                </td> */}
                          <td style={{width:'50px', textAlign:"right"}}>{item.category_id}</td>
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
            <tr className="tr-head">
              <th className="td-no"/>
              <th className="table-check" style={{width:"5.5rem"}}>有効/無効</th>
              <th className="table-check" style={{width:"5.5rem"}}>表示</th>
              <th className="table-check">メニューID</th>
              <th className="">メニュー名</th>
              <th className="table-check">カルテの記載を行う</th>
              <th className="table-check">患者ページで使用</th>
              <th className="table-check" style={{width:"7rem"}}>その他のページで使用</th>
            </tr>
            </thead>
            <tbody style={{height:"calc(100vh - 200px - 1.5rem)"}}>
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
                        <tr onContextMenu={e => this.handleClick(e,index, 2)}>
                          <td className="td-no">{index+1}</td>
                          <td className="table-check" style={{width:"5.5rem"}}>
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="table-check" style={{width:"5.5rem"}}>
                            <Checkbox
                              label=""
                              value={item.is_visible}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="table-check" style={{textAlign:"right"}}>{item.id}</td>
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
                          <td className="table-check" style={{width:"7rem"}}>
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
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      </Card>
    )
  }
}

export default MenuSetting