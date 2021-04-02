import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import { surface } from "~/components/_nano/colors";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import * as sessApi from "~/helpers/cacheSession-utils";
// import { CACHE_SESSIONNAMES} from "~/helpers/constants";
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
  width: 100%;
  margin: 0px;
  height: 100%;  
  float: left;
  background-color: ${surface};
  padding: 20px;
  padding-top: 0px;
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
      width: 100%;
      display: table;
      border-bottom: 1px solid #dee2e6;      
      tr{
        width:calc(100% - 17px);
      }
    }
    tbody{      
      min-height:67vh;
      height:67vh;
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
    width: 50px;
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
    margin-top: 5px;
    font-size: 17px;
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
    font-size: 14px;
    width: 20%;
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
  width: 56%;  
  float: left;    
  margin-bottom: 10px;
 `;
class MenuSettingModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {      
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
      alert_message: "",
      checked_menu_list:[],
      is_loaded_tab: true,
      is_loaded_category: true,
      is_loaded_menu: true,
    };
    this.change_flag = 0;
  }

  async componentDidMount(){    
    this.getTabs();
  }

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
      var path = "/app/api/v2/master/menu/authority/get";
      var post_data = {
          tab_id:this.state.selected_tab_id,
          category_id:this.state.selected_category_id,
          authority_id:this.props.authority_id,
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

  selectCategory = (item) => {
    this.setState({
        selected_category_id:item.category_id,
        selected_category_name:item.category_name,
        is_loaded_menu: true
    }, () => {
        this.getMenus();
    });
  }

  checkAuthority = (index, auth_id, name, value) => {    
    var menu_list = this.state.menu_list;
    var checked_menu_list = this.state.checked_menu_list;
    var temp = menu_list[index].menu_auth;
    if (name == 'check'){
      this.change_flag = 1;
      if (value){
        temp.push(auth_id);
      } else {
        var remove_index = temp.indexOf(auth_id);
        if (remove_index > -1){
          temp.splice(remove_index, 1);
        }
      }      
      menu_list[index].menu_auth = temp;
      if (checked_menu_list.filter(x => x.number == menu_list[index].number).length == 0) {
        checked_menu_list.push(menu_list[index]);
      } else {
        checked_menu_list = checked_menu_list.filter(function(x) {
          return x.number != menu_list[index].number;
        })
        checked_menu_list.push(menu_list[index]);
      }
    }    
    this.setState({menu_list, checked_menu_list});
  }

  checkChnagedItem = (item) => {
    var checked_menu_list = this.state.checked_menu_list;
    var check_result = checked_menu_list.filter(x => x.number == item.number);
    if (check_result.length == 0){
      return item;
    } else {
      return check_result[0];
    }
  }

  handleOk = () => {
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "登録しますか?",
    })
  }

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
    });
  }

  save = async() => {
    this.confirmCancel();
    var path = "/app/api/v2/master/menu/authority/save";
    var post_data = {
        menu_list:this.state.checked_menu_list,
        authority_id:this.props.authority_id
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages",  "登録完了##" + res.alert_message);
        this.props.closeModal();
      })
      .catch(() => {
        window.sessionStorage.setItem("alert_messages",  '失敗しました。');
      });
  }

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
      <Modal show={true} className="master-modal menu-setting-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>メニュー設定</Modal.Title>
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
                            <th className="code-number">メニューID</th>
                            <th className="">メニュー名</th>
                            <th className="table-check">閲覧</th>
                            <th className="table-check">登録</th>
                            <th className="table-check">変更</th>
                            <th className="table-check">削除</th>
                        </tr>
                        </thead>
                        <tbody>
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
                                    item = this.checkChnagedItem(item);                              
                                      return (
                                          <>
                                              <tr>
                                                  <td className="td-no">{index+1}</td>                                            
                                                  <td className="code-number">{item.id}</td>
                                                  <td className="tl">{item.name.trim()}</td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.menu_auth.includes(10)}                                                    
                                                          getRadio = {this.checkAuthority.bind(this,index, 10)}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""
                                                          value={item.menu_auth.includes(11)}                                                    
                                                          getRadio = {this.checkAuthority.bind(this,index, 11)}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.menu_auth.includes(21)}                                                    
                                                          getRadio = {this.checkAuthority.bind(this,index, 21)}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td className="table-check">
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.menu_auth.includes(41)}
                                                          getRadio = {this.checkAuthority.bind(this,index, 41)}
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
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button onClick={this.handleOk} className={this.change_flag == 1 ? "red-btn":"disable-btn"} isDisabled={this.change_flag == 0}>保存</Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.save.bind(this)}
            confirmTitle={this.state.confirm_message}
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
      </Modal>
    );
  }
}

MenuSettingModal.contextType = Context;

MenuSettingModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  authority_id: PropTypes.number,
};

export default MenuSettingModal;
