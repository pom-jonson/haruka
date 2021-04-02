import React, { Component, useContext } from "react";

import * as methods from "../DialMethods";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import InjectionSetCategoryInputModal from "../modals/InjectionSetCategoryInputModal";
import InjectionSetModal from "../modals/InjectionSetModal";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import checkStateMaster from "../DialMethods/checkStateMaster";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
`;

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        text-align: center;
        button {
          text-align: center;
          border-radius: 0.25rem;
          background: rgb(105, 200, 225); 
          border: none;
        }
        
        span {
          color: white;
          font-size: 1.25rem;
          font-weight: 100;
        }
    }

    table {
        thead{
            display:table;
            width:100%;
          }
        tbody{
            display:block;
            overflow-y: auto;
            height: calc( 100vh - 16rem);
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: center;
            word-break: break-all;
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .code-number {
            width: 7.5rem;
        }
        .table-check{
            width:4rem;
        }
        .name {
          width: 15rem;
  
        }
        .tl {
            text-align: left;
        }
        .tr {
            text-align: right;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem 0 1.25rem 0;
  float: left;
  .search-box {
      width: 80%;
      display: flex;
  }
  .label-title {
    font-size: 1rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .display_order .label-title {
    width: 3.75rem;
  }
  .display-class .label-title {
    width: 3.75rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      width: 12.5rem;
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
    span {
        color: blue;
    }
    .left-area {
        width: 40%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 58%;
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
    width: 40%;
    margin-right: 2%;
    float: left;
    border: solid 1px lightgrey;
    label {
        margin: 0;
    }
      .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
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
  width: 58%;  
  float:left;  
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
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
    .blue-text {
    color: blue;
    }
`;
const display_order = [
    { id: 0, value: "表示順", field_name:"sort_number"},
    { id: 1, value: "コード番号", field_name:"code"},
    { id: 2, value: "表示名称", field_name:"name"},
    { id: 3, value: "カナ順", field_name:"name_kana"}
];
const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER,AUTHS.EDIT,0) != false && (
                <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                )}
                {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER,AUTHS.DELETE,0) != false && (
                <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};
const ContextItemMenu = ({ visible, x,  y,  parent,  row_index,}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER,AUTHS.EDIT,0) != false && (
                <li><div onClick={() => parent.contextMenuAction(row_index,"edit_item")}>編集</div></li>
                )}
                {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER,AUTHS.DELETE,0) != false && (
                <li><div onClick={() => parent.contextMenuAction(row_index, "delete_item")}>削除</div></li>
                )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class InjectionSet extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            schVal: "",
            set_category_list:[],
            set_data:[],
            isOpenInputModal: false,
            isOpenInjectionSet: false,
            sort_order:3,
            search_class:0,
            curCategoryCode: 0,
            isDeleteConfirmModal: false,
            confirm_message:"",
        }
    }
    
  async componentDidMount() {   
    this.getSetCategoryList();    
  }

  getSetCategoryList = async() => {    
    const { data } = await axios.post(
      "/app/api/v2/dial/master/material_search",
      {
        params: {
            table_kind: 11,
            order:display_order[this.state.sort_order].field_name,
        }
      }
    );
    this.setState({
        set_category_list:data,
        curCategoryCode:this.state.curCategoryCode == 0?data[0].code:this.state.curCategoryCode,
    }, () => {
        this.getSetList(this.state.curCategoryCode);
    });
  };

  getSetList = async(category_code)=> {
    let set_data = await apiClient.post("/app/api/v2/dial/pattern/searchInjectionSet", 
        {params: {
                category_code: category_code,
                order:display_order[this.state.sort_order].field_name,
            }});
    let set_category = this.state.set_category_list.find(x=>x.code==category_code);
      this.setState({
          set_data: set_data,
          set_category
      });
  }
      
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };    
    getPrescriptionSelect = e => {
        this.setState({ display_order: parseInt(e.target.id) });
    };

    createPattern = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_INJECTION_SET_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
          window.sessionStorage.setItem("alert_messages","登録権限がありません。");
          return;
      }
        this.setState({
            isOpenInputModal: true,
            modal_data: null
        });
    };
    editPattern = (index) => {
        this.setState({
            isOpenInputModal: true,
            modal_data: this.state.set_category_list[index]
        });
    };
    deletePattern = async (index) => {
        let path = "/app/api/v2/dial/master/dial_method_register";
        let post_data = {
            params: index,
            table_kind:11,
            type: "delete"
        };
        await axios.post(path,  post_data).then (()=>{
            window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
            this.getSetCategoryList();
        });
    };
    deletePatternItem = async (index) => {
        let path = "/app/api/v2/dial/pattern/deleteInjectionSet";
        let post_data = {
            params: index,
        };
        await axios.post(path,  post_data).then (()=>{
            window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
            this.getSetList(this.state.curCategoryCode);
        });
    };

    createPatternItem = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_INJECTION_SET_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
            window.sessionStorage.setItem("alert_messages","登録権限がありません。");
            return;
      }
        this.setState({isOpenInjectionSet: true});
    }

    closeModal = () => {
        this.setState({
          isOpenInputModal: false,
          isOpenInjectionSet: false,
          injectionSetData: null
        });
    }

    getRadio = (number,name,value) => {
        if (name === "check") {
            checkStateMaster("dial_injection_set_category",number,value).then(()=>{
                this.searchList();
            });
        }
    };

    registerExaminationPattern = (postData) => {
      this.registerExamPatternItem(postData, "pattern").then(()=>{
          this.getSetCategoryList();
      });
    };

    registerExaminationPatternItem = (postData) => {
      this.registerExamPatternItem(postData, "item");
    };

    handlePattern = (category_code) => {
      this.getSetList(category_code);
      this.setState({
        curCategoryCode: category_code
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
                .getElementById("inspection-pattern-table")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextMenu: { visible: false }
                    });
                    document
                        .getElementById("inspection-pattern-table")
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

    handleItemClick = (e, index) => {
        if (e.type === "contextmenu") {
            e.preventDefault();
            // eslint-disable-next-line consistent-this
            const that = this;
            document.addEventListener(`click`, function onClickOutside() {
                that.setState({ contextItemMenu: { visible: false } });
                document.removeEventListener(`click`, onClickOutside);
            });
            window.addEventListener("scroll", function onScrollOutside() {
                that.setState({
                    contextItemMenu: { visible: false }
                });
                window.removeEventListener(`scroll`, onScrollOutside);
            });
            document
                .getElementById("inspection-pattern-item-table")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextItemMenu: { visible: false }
                    });
                    document
                        .getElementById("inspection-pattern-item-table")
                        .removeEventListener(`scroll`, onScrollOutside);
                });
            this.setState({
                contextItemMenu: {
                    visible: true,
                    x: e.clientX,
                    y: e.clientY + window.pageYOffset
                },
                item_index: index
            });
        }
    }

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editPattern(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.state.set_category_list[index].number}, ()=> {
                this.delete(this.state.set_category_list[index].name);
            })
        }
        if (type === "delete_item"){
            this.setState({selected_item_number:this.state.set_data[index].number}, ()=> {
                this.delete(this.state.set_data[index].name);
            })
        }
        if (type === "edit_item"){
            let set_category = this.state.set_category_list.find(x=>x.code==this.state.curCategoryCode);
            this.setState({
                isOpenInjectionSet: true,
                injectionSetData: this.state.set_data[index],
                set_category
            });
        }
    };
    delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除しますか？",
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
        if (this.state.selected_number != undefined && this.state.selected_number > 0){
            this.deletePattern(this.state.selected_number).then(()=>{
                this.confirmCancel();
                this.setState({selected_number:0})
            });
        }
        else if (this.state.selected_item_number != undefined && this.state.selected_item_number > 0){
            this.deletePatternItem(this.state.selected_item_number).then(()=>{
                this.confirmCancel();
                this.setState({selected_item_number:0})
            });
        }
    };

    getSortOrder = e => {
        this.setState({ sort_order: parseInt(e.target.id)}, () => {
          this.getSetCategoryList();
        });
    }

    getDisplayClass = e => {
        this.setState({ search_class: parseInt(e.target.id)}, () => {
          this.getSetCategoryList();
        });
    };

    handleOk = () => {
        this.getSetCategoryList();
        this.closeModal();
    };

    saveSetData = async () => {
        this.setState({
            isOpenInjectionSet: false,
            injectionSetData:null
        },()=>{
            this.getSetList(this.state.curCategoryCode);
        });
    };

    render() {
        let {set_category_list, set_data} = this.state;
        return (
            <Card>
                <div className="title">注射セットマスタ</div>
                <SearchPart>
                    <div className="search-box">
                       <div className="display_order">
                        <SelectorWithLabel
                        options={display_order}
                        title="表示順"
                        getSelect={this.getSortOrder}
                        departmentEditCode={this.state.sort_order}
                        />
                    </div>
                    </div>
                </SearchPart>
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">注射セット分類</div>
                        <Col className="tr" onClick={this.createPattern}>
                            <Icon icon={faPlus} />セット分類を追加
                        </Col>
                    </div>
                    <div className="right-area">
                        <div className="tl">注射セット</div>
                        <div className="tr" onClick={this.createPatternItem}>
                            <Icon icon={faPlus} />セットを追加
                        </div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered">
                        <thead>
                        <tr>
                            <th style={{width:'3rem'}}></th>
                            <th className="table-check">表示</th>
                            <th className="code-number">コード番号</th>
                            <th className="code-number">分類名称</th>
                            <th>カナ名称</th>
                        </tr>
                        </thead>
                        <tbody id={`inspection-pattern-table`}>
                        
                        {set_category_list !== undefined && set_category_list !== null && set_category_list.length > 0 && (
                            set_category_list.map((item, index) => {
                                return (
                                <>
                                <tr style={{cursor:"pointer"}}
                                    className={item.code === this.state.curCategoryCode ? "selected" : ""}
                                    onClick={()=>this.handlePattern(item.code)}
                                    onContextMenu={e => this.handleClick(e, index)}>
                                    <td className={`text-right`} style={{width:'3rem'}}>{index+1}</td>
                                    <td className="table-check">
                                        <Checkbox
                                            label=""
                                            isDisabled={true}
                                            value={item.is_enabled}
                                            name="check"
                                        />
                                    </td>
                                    <td className="text-left code-number">{item.code}</td>
                                    <td className="text-left code-number">{item.name}</td>
                                    <td className="tl text-left">{item.name_kana}</td>
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
                            <th style={{width:30}}></th>
                            <th className="name">セット名称</th>
                            <th className="">カナ名称</th>
                        </tr>
                        </thead>
                        <tbody id={`inspection-pattern-item-table`}>
                        {set_data !== undefined && set_data !== null && set_data.length > 0 && (
                            set_data.map((item, index) => {
                                return (
                                <>
                                <tr onContextMenu={e => this.handleItemClick(e, index)}>
                                    <td className={`text-right`} style={{width:30}}>{index+1}</td>
                                    <td className="tl name">{item.name}</td>
                                    <td className="tl">{item.name_kana}</td>
                                </tr>
                                </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>
                <div className="footer">
                    {/*<Button type="mono" className={this.state.curFocus === 1?"focus": ""}>帳票プレビュー</Button>*/}
                </div>
                {this.state.isOpenInputModal && (
                    <InjectionSetCategoryInputModal
                        handleOk={this.handleOk}
                        registerExaminationPattern={this.registerExaminationPattern}
                        closeModal={this.closeModal}
                        modal_data={this.state.modal_data}
                    />
                )}
                {this.state.isOpenInjectionSet && (
                    <InjectionSetModal
                        closeModal={this.closeModal}
                        handleOk={this.saveSetData}
                        injectionSetData={this.state.injectionSetData}
                        category={this.state.set_category}
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
                <ContextItemMenu
                    {...this.state.contextItemMenu}
                    parent={this}
                    row_index={this.state.item_index}
                />
            </Card>
        )
    }
}
InjectionSet.contextType = Context;

export default InjectionSet