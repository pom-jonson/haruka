import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import BedModal from "../modals/BedModal";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "../DialMethods";
import Context from "~/helpers/configureStore";
import {makeList_code, makeList_codeName} from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;  
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        margin-top: 0.625rem;
        text-align: center;
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
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.125rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;  
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-title{font-size:1.125rem;}
  .pullbox-select {
      font-size: 1.125rem;
      width: 9.375rem;
  }
  .medicine_type {
    font-size: 1.125rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 3.75rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        font-size: 1.125rem;  
    }
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.125rem;
  width: 100%;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;  
  label {
      text-align: right;
  }
  table {    
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: calc( 100vh - 18rem);
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .table-check {
        width: 3.75rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
        width: 7.5rem;
    }
    .name{
      width:10rem;
    }
  }

 `;
 
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ"},
    { id: 2, value: "非表示のみ"},
];

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
    padding: 0px;
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                {$canDoAction(FEATURES.DIAL_BED_MASTER,AUTHS.EDIT,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                )}
                {$canDoAction(FEATURES.DIAL_BED_MASTER,AUTHS.DELETE,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};


class Bed extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
       let table_data = [];
        this.state = {
            schVal: "",
            table_data,
            isOpenBedModal: false,            
            isLoaded: false,            
            modal_data:{},
            search_order: 0,        //表示順
            search_class: 1,        //表示区分

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
        }
    }
    
    async componentDidMount(){
      this.searchBedList();
      let console_data = await this.getAllConsole();
      let consoles_list = makeList_code(console_data, 1);
      var console_option_list = makeList_codeName(console_data,1);
      this.setState({
          console_data,
          consoles_list, 
          console_option_list,
      })
    }

    // 検索
    searchBedList = async () => {
        let path = "/app/api/v2/dial/master/bed_search";
        let post_data = {
            keyword: this.state.schVal,            
            is_enabled: this.state.search_class,            
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({
          table_data: data,
          isLoaded: true
        });
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.setState({
            isLoaded: false
          },()=>{
            this.searchBedList();
          });
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    handleOk = () => {
        this.setState({
            isOpenBedModal: false,
            isLoaded: false
        });
        this.searchBedList();
    };    
    createBed = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_BED_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
      }
      this.setState({
        isOpenBedModal: true,
        modal_data:null
      });
    };
    closeModal = () => {
        this.setState({isOpenBedModal: false})
    };    
    
    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id) }, () => {
            this.searchBedList();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ 
          search_class: parseInt(e.target.id),
          isLoaded: false
        }, () => {
            this.searchBedList();
        });
    };

    handleClick = (e, index) => {
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
            row_index: index
          });
        }
    }
          
    contextMenuAction = (index, type) => {
      if (type === "edit"){
          this.editData(index);
      }
      if (type === "delete"){
        this.setState({selected_number:this.state.table_data[index].number}, ()=> {
          this.delete(this.state.table_data[index].name);
        })
      }
    };

    confirmCancel() {
      this.setState({
          isUpdateConfirmModal: false,
          isDeleteConfirmModal: false,
          confirm_message: "",
      });
    }

    delete = (name) => {
      this.setState({
          isDeleteConfirmModal : true,
          confirm_message: "「" + name + "」" + " これを削除して良いですか？",
      });
    }

    editData = (index) => {
      let modal_data = this.state.table_data[index];
      this.setState({
          modal_data,
          // row_index: index,
          isOpenBedModal: true
      });
    };

    deleteData = async () => {
      let path = "/app/api/v2/dial/master/bed_delete";
      let post_data = {
          params: this.state.selected_number,                    
      };
      await axios.post(path,  post_data);
      window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
      this.confirmCancel();
      this.setState({         
        isLoaded: false
      }, () => {          
          this.searchBedList();
      });
    };

    render() {
        let {table_data} = this.state;
        return (
            <Card>
                <div className="title">ベッドマスタ</div>
                <SearchPart>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <SelectorWithLabel
                        options={display_class}
                        title="表示区分"
                        getSelect={this.getClassSelect}
                        departmentEditCode={display_class[this.state.search_class].id}
                    />
                    </div>
                </SearchPart>
                <Wrapper>
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th className="item-no"/>
                          <th className="table-check">表示</th>
                          <th className="code-number">ベッド番号</th>
                          <th className="name">グループ1</th>
                          <th className="name">グループ２</th>                            
                          <th className="">デフォルトコンソール</th>
                        </tr>
                      </thead>
                      <tbody id="code-table">
                      {this.state.isLoaded == false ? (
                        <div className='spinner-disease-loading center'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </div>
                      ):(
                        <>                        
                          {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                              table_data.map((item, index) => {
                                  return (
                                  <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td className="item-no text-right">{index+1}</td>
                                      <td className="table-check text-center">
                                        <Checkbox
                                            label=""
                                            // getRadio={this.getRadio.bind(this)}
                                            isDisabled={true}
                                            value={item.is_enabled}                                        
                                            name="check"
                                        /> 
                                      </td>
                                      <td className="code-number">{item.name}</td>
                                      <td className="name">{item.group_1}</td>
                                      <td className="name">{item.group_2}</td>                                    
                                      <td>{this.state.consoles_list !== undefined && item.default_console_code != null && this.state.consoles_list[item.default_console_code] != null && this.state.consoles_list[item.default_console_code] }</td>
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
                  {/* <Button className={this.state.curFocus === 1?"focus": ""}>帳票プレビュー</Button> */}
                    <Button className="red-btn" onClick={this.createBed}>新規作成</Button>
                  {/* <Button onClick={this.createBed} className={this.state.curFocus === 1?"focus": ""}>処方セット</Button> */}
                </div>
                {this.state.isOpenBedModal && (
                    <BedModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
                        modal_data = {this.state.modal_data}
                        consoles_list = {this.state.console_option_list}
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
                row_index={this.state.row_index}
                />
            </Card>
        )
    }
}
Bed.contextType = Context;

export default Bed