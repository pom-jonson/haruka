import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import InjectionModal from "../modals/InjectionModal";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import InjectionSetCategoryModal from "./Modals/InjectionSetCategoryModal";
import DialMasterPrintPreview from "~/components/templates/Dial/Master/DialMasterPrintPreview";
import Context from "~/helpers/configureStore";

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
        margin-top: 1.25rem;
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
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  margin-bottom:8px;
  .search-box {
      width: 100%;
      display: flex;
      input{
          width:11.25rem;
      }
  }
  .label-title {
    width: 5rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select, .pullbox-label {
      font-size: 1rem;
      width: 7.5rem;
  }
  .gender {
    width:34rem;
    .radio-btn label{
        width: 3.75rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
    }
    .radio-group-btn label{
      font-size: 0.875rem;
      width: 4.375rem;
      padding: 0.25rem 0.25rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin-left: 0.3rem;
    }
  }
  .medicine_type {    
    margin-left: 1rem;
    padding-top: 0.5rem;
    label{
        font-size:0.875rem;
    }
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;  
  label {
      text-align: right;
  }
  table {
    margin-bottom:0px;;
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
          font-size:0.9rem;
          word-break: break-all;
      }
      th {
          font-size: 0.9rem;
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
          width: 6rem;
      }
      .name{
          width: 12rem;
      }
      .name-short{
          width: 9rem;
      }
  }

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
    top: 84px;
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

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER,AUTHS.EDIT,0) != false && (
                        <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_INJECTION_SET_MASTER,AUTHS.DELETE,0) != false && (
                        <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};
const sort_order = [    
    { id: 0, value: "コード順", field_name:"code"},
    { id: 1, value: "カナ順", field_name:"name_kana"},
    { id: 2, value: "名称順", field_name:"name"},
];
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ"},
    { id: 2, value: "非表示のみ"},
];
const medicine_type_name = ["すべて", "インスリン" ];
const injection_type_names = ['静注', '筋注', '点滴', '処置薬剤', '麻酔', '処置行為'];

class DialInjection extends Component {
    constructor(props) {
        super(props);
        let table_data = [];
        this.state = {
            schVal: "",
            table_data,
            isOpenCodeModal: false,
            category: 0,
            modal_data:{},
            search_order: 1,        //表示順
            search_class: 1,        //表示区分

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isSetCategoryModal: false,
            confirm_message:"",
            injection_category:"",
            isOpenPreviewModal:false,
        };
        this.table_head = {};
        this.table_head['code'] = "コード番号";
        this.table_head['name_view'] = "表示名称";
        this.table_head['name'] = "正式名称";
        this.table_head['name_short'] = "略称";
        this.table_head['name_kana'] = "カナ名称";
        this.table_head['generic_name'] = "一般名称";
        this.table_head['unit'] = "単位";
        this.table_head['one_unit_value'] = "単位数量";
        this.table_head['injection_category'] = "注射区分";
        this.table_head['is_insulin'] = "インスリン区分";
        this.table_head_style = {};
        this.table_head_style['code'] = "right";
        this.table_head_style['name_view'] = "left";
        this.table_head_style['name'] = "left";
        this.table_head_style['name_short'] = "left";
        this.table_head_style['name_kana'] = "left";
        this.table_head_style['generic_name'] = "left";
        this.table_head_style['unit'] = "left";
        this.table_head_style['one_unit_value'] = "right";
        this.table_head_style['injection_category'] = "left";
        this.table_head_style['is_insulin'] = "left";
    }
    async UNSAFE_componentWillMount(){
        this.getSearchResult();
    }

    // 検索
    getSearchResult = async () => {
        let path = "/app/api/v2/dial/master/material_search";
        let post_data = {
            keyword: this.state.schVal,
            injection_category:this.state.injection_category,
            is_insulin: this.state.category,
            order: sort_order[this.state.search_order].field_name,
            is_enabled: this.state.search_class,
            table_kind: 6,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({table_data: data});
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.getSearchResult();
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    handleOk = () => {
        this.setState({
            isOpenCodeModal: false
        });
        this.getSearchResult();
    };
    createCode = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_INJECTION_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
            window.sessionStorage.setItem("alert_messages","登録権限がありません。");
            return;
        }
        this.setState({
            isOpenCodeModal: true,
            modal_data:null
        });
    };
    closeModal = () => {
        this.setState({
            isOpenCodeModal: false,
            isSetCategoryModal: false,
            isOpenPreviewModal: false,
        })
    };

    selectMedicineType = (e) => {
        this.setState({ category: parseInt(e.target.value)}, () => {
            this.getSearchResult();
        });
    };
    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id) }, () => {
            this.getSearchResult();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id) }, () => {
            this.getSearchResult();
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
                favouriteMenuType: index
            });
        }
    };

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editData(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.state.table_data[index].number}, () => {
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
            confirm_message: name + "注射マスタ情報を削除しますか?",
        });
      }      

    editData = (index) => {
        let modal_data = this.state.table_data[index];
        this.setState({
            modal_data,
            isOpenCodeModal: true
        });
    };
    deleteData = async () => {
        let path = "/app/api/v2/dial/master/dial_method_register";
        let post_data = {
            params: this.state.selected_number,
            table_kind: 6,
            type: "delete"
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.confirmCancel();
        this.getSearchResult();
    };

    getInjectionCategory = e=>{
      this.setState({injection_category:e.target.value}, ()=>{
          this.getSearchResult();
      })
    }

    getRadio = (name, value) => {
        if (name == 'insulin'){
            this.setState({category:value}, () => {
                this.getSearchResult();
            })
        }
    };
    openSetCategoryModal = () => {
        this.setState({isSetCategoryModal: true});
    };

    openPreviewModal=()=>{
        this.setState({isOpenPreviewModal:true});
    };

    render() {
        let {table_data} = this.state;
        return (
            <Card>
                <div className="title">注射マスタ</div>
                <SearchPart>
                    <div className="search-box">
                        <SearchBar
                            placeholder=""
                            search={this.search}
                            enterPressed={this.enterPressed}
                        />
                        <div className="gender">
                            {injection_type_names.map((item, index)=>{
                                return (
                                    <>
                                        <RadioGroupButton
                                            id={`injection_${index}`}
                                            value={item}
                                            label={item}
                                            name="gender"
                                            getUsage={this.getInjectionCategory}
                                            checked={this.state.injection_category==item}
                                        />
                                    </>
                                );
                            })
                            }
                            <RadioGroupButton
                                id={`injection_all`}
                                value=""
                                label="全て"
                                name="gender"
                                getUsage={this.getInjectionCategory}
                                checked={this.state.injection_category==""}
                            />
                        </div>                        
                        <SelectorWithLabel
                            options={sort_order}
                            title="表示順"
                            getSelect={this.getOrderSelect}
                            departmentEditCode={this.state.search_order}
                        />
                        <SelectorWithLabel
                            options={display_class}
                            title="表示区分"
                            getSelect={this.getClassSelect}
                            departmentEditCode={display_class[this.state.search_class].id}
                        />
                        <div className="medicine_type">                            
                            <Checkbox
                                label="インスリンのみ"
                                getRadio={this.getRadio.bind(this)}                                
                                value={this.state.category}
                                checked={this.state.category == 1}
                                name="insulin"
                            />
                        </div>
                    </div>
                </SearchPart>
                <Wrapper>
                    <table className="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th className="item-no"/>
                            <th className="table-check">表示</th>
                            <th className="code-number">コード番号</th>
                            <th className="name">表示名称</th>
                            <th className="name">正式名称</th>
                            <th className="name-short">略称</th>
                            <th className="name-short">カナ名称</th>
                            <th className="code-number">一般名称</th>
                            <th style={{width:'3rem'}}>単位</th>
                            <th className="code-number">単位数量</th>
                            <th className="code-number">注射区分</th>
                            <th>インスリン区分</th>
                        </tr>
                        </thead>
                        <tbody id="code-table">
                        {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                            table_data.map((item, index) => {
                                return (
                                <>
                                <tr onContextMenu={e => this.handleClick(e, index)}>
                                    <td className="item-no text-right">{index+1}</td>
                                    <td className="text-center table-check">
                                        <Checkbox
                                            label=""
                                            // getRadio={this.getRadio.bind(this)}
                                            isDisabled={true}
                                            value={item.is_enabled}
                                            name="check"
                                        />
                                    </td>
                                    <td className='code-number text-right'>{item.code}</td>
                                    <td className="name">{item.name_view}</td>
                                    <td className="name">{item.name}</td>
                                    <td className="name-short">{item.name_short}</td>
                                    <td className="name-short">{item.name_kana}</td>
                                    <td className="code-number">{item.generic_name}</td>
                                    <td style={{width:'3rem'}}>{item.unit}</td>
                                    <td className="code-number text-right">{item.one_unit_value}</td>
                                    <td className="code-number">{item.injection_category != null && item.injection_category !== "" ? item.injection_category : "区分無し"}</td>
                                    <td>{item.is_insulin==1?'インスリン':''}</td>
                                </tr>
                                </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                    <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
                    <Button className="red-btn" onClick={this.createCode}>新規作成</Button>
                    {/* <Button className={this.state.curFocus === 1?"focus": ""}>注射分別</Button> */}
                    {/*<Button className={this.state.curFocus === 1?"focus": ""} onClick={this.openSetCategoryModal}>注射セット</Button>*/}
                </div>
                {this.state.isOpenCodeModal && (
                    <InjectionModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        medicine_type_name = {medicine_type_name}
                        modal_data = {this.state.modal_data}
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
                {this.state.isSetCategoryModal && (
                    <InjectionSetCategoryModal
                        closeModal={this.closeModal}
                    />
                )}
                <ContextMenu
                {...this.state.contextMenu}
                parent={this}
                favouriteMenuType={this.state.favouriteMenuType}
                />
                {this.state.isOpenPreviewModal && (
                    <DialMasterPrintPreview
                        closeModal={this.closeModal}
                        modal_title={'注射マスタ'}
                        modal_type={'injection'}
                        table_head={this.table_head}
                        table_head_style={this.table_head_style}
                        table_body={this.state.table_data}
                        category = {this.state.injection_category}
                        sort_order = {sort_order[this.state.search_order].value}
                        search_class = {display_class[this.state.search_class].value}
                        keyword = {this.state.schVal}
                    />
                )}
            </Card>
        )
    }
}
DialInjection.contextType = Context;

export default DialInjection