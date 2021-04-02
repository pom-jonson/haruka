import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import SearchBar from "~/components/molecules/SearchBar"
// import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import RadioGroupButton from "~/components/molecules/RadioGroup";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
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
      .pullbox-title{
        margin-top: 0.1rem;
        height: 2rem;
        line-height: 2rem;
      }
  }  
  input {
    width: 400px;
    font-size: 1rem;
  }
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
      height: 400px;
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
  
  .label-title{
    font-size: 1rem;
    width: 170px;
    text-align:right!important;
    margin-right:10px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 15px;
    label{
        font-size: 1rem;
        width: 260px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .cursor{
    cursor:pointer;
  }
  .menu-list{
    margin-top: 10px;
    max-height: 450px;
    overflow-y: auto;
  }
  
  .footer {
    display: flex;    
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
      font-size: 1rem;
      font-weight: 100;
    }
}
 `;

class MenuListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schVal:'',
            is_loaded:true,
            isBackConfirmModal:false,
            confirm_message:"",
        }
        this.change_flag = 0;
    }

    componentDidMount = () => {
        this.getMenus();        
    }

    getMenus = async() => {
        var path = "/app/api/v2/master/menu/searchMenu";
        var post_data = {
            schVal:this.state.schVal,
        };        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            this.setState({
                menu_list:res,
                is_loaded:false,
            });
          })
          .catch(() => {
          });
    }

    handleOk = () => {
        if (this.state.selected_item == undefined || this.state.selected_item == null){
            window.sessionStorage.setItem("alert_messages", 'メニューを選択してください。');
        }
        this.props.selectMenu(this.state.selected_item);
    };

    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.setState({is_loaded:true}, () => {
                this.getMenus();
            })
        }
    };
    selectItem = item => {
      this.change_flag = 1;
      this.setState({selected_item:item});
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

    confirmCancel() {
        this.setState({            
            isBackConfirmModal: false,
            confirm_message: "",
        });
    }

    render() {           
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>メニュー</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <SearchBar
                            placeholder=""
                            search={this.search}
                            enterPressed={this.enterPressed}
                        />
                        <div className="menu-list">
                            <table className="table-scroll table table-bordered" id="wordList-table">
                                <thead>
                                    <tr>
                                        <th style={{width:"3rem"}}>ID</th>
                                        <th style={{width:"8rem"}}>タブ</th>
                                        <th style={{width:"10rem"}}>カテゴリ</th>
                                        <th>メニュー名</th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {this.state.is_loaded == true ? (
                                    <div style={{height:'calc(100% - 1px))',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                                      <SpinnerWrapper>
                                        <Spinner animation="border" variant="secondary" />
                                      </SpinnerWrapper>
                                    </div>
                                  ):(
                                    <>
                                      {this.state.menu_list != undefined && this.state.menu_list != null && this.state.menu_list.length> 0 && (
                                          this.state.menu_list.map(item => {
                                              return(
                                                  <>
                                                  <tr onClick={this.selectItem.bind(this, item)} className={this.state.selected_item == item ? "selected cursor" : "cursor"}>
                                                      <td style={{width:"3rem",textAlign:"right"}}>{item.id}</td>
                                                      <td style={{width:"8rem",textAlign:"left"}}>{item.tab}</td>
                                                      <td style={{width:"10rem",textAlign:"left"}}>{item.category}</td>
                                                      <td style={{textAlign:"left"}}>{item.name}</td>
                                                  </tr>
                                                  </>
                                              )
                                          })
                                      )}
                                      {(this.state.menu_list == undefined || this.state.menu_list == null || this.state.menu_list.length ==0) && (
                                        <>
                                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                                        </>
                                      )}
                                    </>
                                  )}
                                </tbody>                                
                            </table>
                        </div>                                                
                    </Wrapper>                    
                    {this.state.isBackConfirmModal !== false && (
                      <SystemConfirmJapanModal
                        hideConfirm={this.confirmCancel.bind(this)}
                        confirmCancel={this.confirmCancel.bind(this)}
                        confirmOk={this.props.closeModal}
                        confirmTitle={this.state.confirm_message}
                      />
                    )}
                </Modal.Body>
                <Modal.Footer>                                        
                    <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
                    <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{"選択"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

MenuListModal.contextType = Context;

MenuListModal.propTypes = {
    closeModal: PropTypes.func,
    selectMenu: PropTypes.func,
};

export default MenuListModal;
