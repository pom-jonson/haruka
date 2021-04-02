import React, { Component, useContext } from "react";
import * as methods from "../DialMethods";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import InspectionPatternModal from "../modals/InspectionPatternModal";
import EditPatternItemModal  from "../modals/EditPatternItemModal";
import InspectionPatternItemModal from "../modals/InspectionPatternItemModal";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialMasterPrintPreview from "~/components/templates/Dial/Master/DialMasterPrintPreview";
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
            padding: 0.25rem;
            text-align: center;
            word-break: break-all;
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .item-no{
          width: 3rem;
        }
        .code-number {
            width: 7.5rem;
        }
        .table-check{
            width:3.5rem;
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
        width: 28%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 70%;
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
    width: 28%;
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
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 70%;    
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
    { id: 0, value: "コード番号", field_name:"code"},
    { id: 1, value: "表示名称", field_name:"name"},
    { id: 2, value: "カナ順", field_name:"name_kana"}
];

//   const display_class = [
//     { id: 0, value: "全て" },
//     { id: 1, value: "表示のみ" },
//     { id: 2, value: "非表示のみ" },
//   ];

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_COMPLIATION_INSPECTION,AUTHS.EDIT,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_COMPLIATION_INSPECTION,AUTHS.DELETE,0) != false && (
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
                    {$canDoAction(FEATURES.DIAL_COMPLIATION_INSPECTION,AUTHS.EDIT,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_COMPLIATION_INSPECTION,AUTHS.DELETE,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class ComplicationInspectionPattern extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            schVal: "",
            examinationPatternList:[],
            examinationPatternItemList:[],
            isOpenPatternModal: false,
            isOpenPatternItemModal: false,
            sort_order:2,
            search_class:0,
            curPatterCode: 0,
            isDeleteConfirmModal: false,
            isOpenPreviewModal: false,
            confirm_message:"",
            isOpeneditPatternItemModal:false,
            modal_data:null,
        };
        this.table_head={};
        this.table_head['item_code'] = "コード番号";
        this.table_head['name'] = "名称";
        this.table_head['name_kana'] = "カナ名称";
        this.table_head['name_short'] = "略称";
        this.table_head_style={};
        this.table_head_style['item_code'] = "right";
        this.table_head_style['name'] = "left";
        this.table_head_style['name_kana'] = "left";
        this.table_head_style['name_short'] = "left";
    }
    
  async componentDidMount() {   
    this.getExamPatternList(null, 0);
  }

  getExamPatternList = async(pattern_code = null) => {
    const { data } = await axios.post(
      "/app/api/v2/dial/master/get_examination_pattern",
      {
        params: {
            is_enabled: this.state.search_class,
            order:display_order[this.state.sort_order].field_name,
            type:1,
        }
      }
    );
    if (data.length > 0){
        this.setState({
            examinationPatternList:data,
            select_pattern_name:pattern_code != null ? this.state.select_pattern_name : data[0].name,
            curPatterCode:pattern_code != null ? pattern_code:data[0].code,
        }, () => {
            this.getExamPatternItemList(this.state.curPatterCode);
        });
    } else {
        this.setState({
            examinationPatternList:[],
            select_pattern_name:'',
            curPatterCode:0
        })
    }
  }

  getExamPatternItemList = async(pattern_code)=> {
    const { data } = await axios.post(
        "/app/api/v2/dial/master/get_examination_pattern_item",
        {
          params: {
            pattern_code: pattern_code,
            is_enabled: this.state.search_class,
            order:display_order[this.state.sort_order].field_name,
          }
        }
      );
      this.setState({
        examinationPatternItemList: data
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
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_COMPLIATION_INSPECTION,this.context.AUTHS.REGISTER, 0) === false) {
            window.sessionStorage.setItem("alert_messages","登録権限がありません。");
            return;
        }
        this.setState({
            isOpenPatternModal: true,
            modal_data: null
        });
    };
    editPattern = (index) => {
        this.setState({
            isOpenPatternModal: true,
            modal_data: this.state.examinationPatternList[index]
        });
    };
    deletePattern = async (index) => {
        let path = "/app/api/v2/dial/master/dial_method_register";
        let post_data = {
            params: index,
            table_kind:9,
            type: "delete"
        };
        await axios.post(path,  post_data).then (()=>{
            window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
            this.getExamPatternList();
        });
    };
    deletePatternItem = async (index) => {
        let path = "/app/api/v2/dial/master/dial_method_register";
        let post_data = {
            params: index,
            table_kind:10,
            type: "delete"
        };
        await axios.post(path,  post_data).then (()=>{
            window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
            this.getExamPatternItemList(this.state.curPatterCode);
        });
    };

    createPatternItem = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_COMPLIATION_INSPECTION,this.context.AUTHS.REGISTER, 0) === false) {
            window.sessionStorage.setItem("alert_messages","登録権限がありません。");
            return;
        }
        this.setState({isOpenPatternItemModal: true});
    }

    closeModal = () => {
        this.setState({
          isOpenPatternModal: false,
          isOpenPatternItemModal: false,
          isOpeneditPatternItemModal: false,
        });
    }

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };

    registerExaminationPattern = (postData) => {
      // this.registerExamPatternItem(postData, "pattern");
      this.getExamPatternList(postData.patternCode);
    };

    handlePattern = (pattern_code, pattern_name) => {
      this.getExamPatternItemList(pattern_code);
      this.setState({
        curPatterCode: pattern_code,
        select_pattern_name:pattern_name,
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
            this.setState({selected_number:this.state.examinationPatternList[index].number}, ()=> {
                this.delete(this.state.examinationPatternList[index].name);
            })
        }
        if (type == 'edit_item'){
            this.editPatternItem(this.state.examinationPatternItemList[index]);
        }
        if (type === "delete_item"){
            this.setState({selected_item_number:this.state.examinationPatternItemList[index].number}, ()=> {
                this.delete(this.state.examinationPatternItemList[index].name);
            })
        }
    };
    editPatternItem =  (item) => {
        this.setState({isOpeneditPatternItemModal:true, selected_pattern_item : item})
    }
    delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
        });
    };
    confirmCancel=()=>{
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isOpenPreviewModal: false,
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
        let curPatterCode = this.state.curPatterCode;
        this.setState({ sort_order: parseInt(e.target.id)}, () => {
          this.getExamPatternList(curPatterCode);
        });
    }

    getDisplayClass = e => {
        let curPatterCode = this.state.curPatterCode;
        this.setState({ search_class: parseInt(e.target.id)}, () => {
            this.getExamPatternList(curPatterCode);
        });
    };

    openPreviewModal=()=>{
        this.setState({isOpenPreviewModal:true});
    };

    handlePatternItemOk = (pattern_code) => {
        this.getExamPatternItemList(pattern_code);
        this.closeModal();
    }

    render() {
        let {examinationPatternList, examinationPatternItemList} = this.state;
        return (
            <Card>
                <div className="title">合併症検査項目パターン</div>
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
                    {/* <div className="display_class">
                        <SelectorWithLabel
                        options={display_class}
                        title="表示区分"
                        getSelect={this.getDisplayClass}
                        departmentEditCode={this.state.search_class}
                        />
                    </div> */}
                    </div>
                </SearchPart>
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">検査パターン</div>
                        <Col className="tr" onClick={this.createPattern}>
                            <Icon icon={faPlus} />検査パターンを追加
                        </Col>
                    </div>
                    <div className="right-area">
                        <div className="tl">検査項目</div>
                        <div className="tr" onClick={this.createPatternItem}>
                            <Icon icon={faPlus} />検査項目を追加
                        </div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered">
                        <thead>
                        <tr>
                            <th className='item-no'></th>
                            <th className="table-check">表示</th>
                            <th className="code-number">コード番号</th>
                            <th className="">パターン名称</th>                            
                        </tr>
                        </thead>
                        <tbody id={`inspection-pattern-table`}>
                        
                        {examinationPatternList !== undefined && examinationPatternList !== null && examinationPatternList.length > 0 && (
                            examinationPatternList.map((item, index) => {
                                return (
                                <>
                                <tr style={{cursor:"pointer"}}
                                    className={item.code === this.state.curPatterCode ? "selected" : ""}
                                    onClick={()=>this.handlePattern(item.code, item.name)}
                                    onContextMenu={e => this.handleClick(e, index)}>
                                    <td className='item-no text-right'>{index+1}</td>
                                    <td className='table-check'>
                                        <Checkbox
                                            label=""
                                            isDisabled={true}
                                            value={item.is_enabled}
                                            name="check"
                                        />
                                    </td>
                                    <td className="tr code-number">{item.code}</td>
                                    <td className="tl">{item.name}</td>
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
                            <th className='item-no'></th>
                            <th className="code-number">コード番号</th>
                            <th className="name">名称</th>
                            <th className="name">カナ名称</th>
                            <th>略称</th>
                        </tr>
                        </thead>
                        <tbody id={`inspection-pattern-item-table`}>
                        
                        {examinationPatternItemList !== undefined && examinationPatternItemList !== null && examinationPatternItemList.length > 0 && (
                            examinationPatternItemList.map((item, index) => {
                                return (
                                <>
                                <tr onContextMenu={e => this.handleItemClick(e, index)}>
                                    <td className='item-no tr'>{index+1}</td>
                                    <td className="tr code-number">{item.item_code}</td>
                                    <td className="tl name">{item.name}</td>
                                    <td className="tl name">{item.name_kana}</td>
                                    <td className="tl">{item.name_short}</td>
                                </tr>
                                </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                      <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
                </div>
                {this.state.isOpenPatternModal && (
                    <InspectionPatternModal
                        handleOk={this.handleOk}
                        registerExaminationPattern={this.registerExaminationPattern}
                        closeModal={this.closeModal}
                        modal_data={this.state.modal_data}
                        type={1}
                    />
                )}
                {this.state.isOpenPatternItemModal && (
                    <InspectionPatternItemModal
                        handleOk={this.getExamPatternItemList}
                        closeModal={this.closeModal}
                        patternCode={this.state.curPatterCode}
                    />
                )}
                {this.state.isOpeneditPatternItemModal && (
                    <EditPatternItemModal
                        handleOk = {this.handlePatternItemOk}
                        closeModal = {this.closeModal}
                        modal_data = {this.state.selected_pattern_item}
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
                {this.state.isOpenPreviewModal && (
                    <DialMasterPrintPreview
                        closeModal={this.confirmCancel.bind(this)}
                        modal_title={this.state.select_pattern_name}
                        modal_type={"inspection_item_pattern"}
                        table_head={this.table_head}
                        table_head_style={this.table_head_style}
                        table_body={this.state.examinationPatternItemList}
                        sort_order = {display_order[this.state.sort_order].value}
                    />
                )}
            </Card>
        )
    }
}
ComplicationInspectionPattern.contextType = Context;

export default ComplicationInspectionPattern