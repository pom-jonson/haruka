import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import MedicinesModal from "../modals/MedicinesModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
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
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 100px;
  }
  .gender {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 5rem;
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
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
    margin-bottom:0px;
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
        word-break: break-all;
        font-size:0.9rem;
        padding: 0.25rem;
      }
      th {
        font-size:0.9rem;
        position: sticky;
        text-align: center;
        padding: 0.3rem;
      }
      .table-check {
          width: 4.375rem;
      }
      .item-no {
        width: 3.125rem;
      }
      .code-number {
          width: 7.5rem;
      }
      .name{
        width:16rem;
      }
  }

`;

const display_class = [
    { id: 0, value: "全表示"},
    { id: 1, value: "選択のみ"},
    { id: 2, value: "非選択のみ"},
];

const display_order = [    
    { id: 0, value: "コード順", field_name:"code"},
    { id: 1, value: "カナ順", field_name:"name_kana"},
    { id: 2, value: "名称順", field_name:"name"},
];

const medicine_type_name = ["内服","外用","注射"];

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


const ContextMenu = ({
  visible,
  x,
  y,
  parent,
  favouriteMenuType,
}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {$canDoAction(FEATURES.DIAL_MEDICINES_MASTER,AUTHS.EDIT,0) != false && (
          <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
          )}
          {$canDoAction(FEATURES.DIAL_MEDICINES_MASTER,AUTHS.DELETE,0) != false && (
          <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};


class Medicines extends Component {
    constructor(props) {
        super(props);
        let list_item = [];
        this.state = {
            schVal: "",
            list_item,
            isOpenCodeModal: false,
            medicine_type: "",
            search_class: 1,        //表示区分
            modal_data: {},
            sort_order:1,

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
        }
    }
    async UNSAFE_componentWillMount(){
        this.searchMedicineList();
    }

    // 検索
    searchMedicineList = async () => {
        let path = "/app/api/v2/dial/master/medicines_search";
        let post_data = {
            keyword: this.state.schVal,
            is_enabled: this.state.search_class,
            category: this.state.medicine_type,
            order:display_order[this.state.sort_order].field_name,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({list_item: data});
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.searchMedicineList();
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    getPrescriptionSelect = e => {
        this.setState({ sort_order: parseInt(e.target.id)}, () => {
            this.searchMedicineList();
        });
    };
    createCode = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_MEDICINES_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
          window.sessionStorage.setItem("alert_messages","登録権限がありません。");
          return;
      }
        this.setState({
            isOpenCodeModal: true,
            modal_data:null
        });
    }
    closeModal = () => {
        this.setState({isOpenCodeModal: false})
    }
    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };
    selectMedicineType = (e) => {
      this.setState({ medicine_type: parseInt(e.target.value)}, () => {
          this.searchMedicineList();
      });
  };

    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id) }, () => {
            this.searchMedicineList();
        });
    };

    handleClick = (e, type) => {
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
            favouriteMenuType: type
          });
        }
      }

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editData(index);
        }
        if (type === "delete"){
          this.setState({selected_number:this.state.list_item[index].number}, () => {
            this.delete(this.state.list_item[index].name);
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
        let modal_data = this.state.list_item[index];
        this.setState({
            modal_data,
            // row_index: index,
            isOpenCodeModal: true
        });
    };

    deleteData = async () => {
        let path = "/app/api/v2/dial/master/medicines_delete";
        let post_data = {
            params: this.state.selected_number,
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.confirmCancel();
        this.searchMedicineList();
    };
    handleOk = () => {
        this.setState({
            isOpenCodeModal: false
        });
        this.searchMedicineList();
    };

    render() {
        let {list_item} = this.state;
        return (
            <Card>
                <div className="title">医薬品マスタ</div>
                <SearchPart>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <div className="gender">
                      <RadioButton
                          id="male"
                          value={0}
                          label="内服"
                          name="gender"
                          getUsage={this.selectMedicineType}
                          checked={this.state.medicine_type == 0 ? true : false}
                      />
                      <RadioButton
                          id="femaie"
                          value={1}
                          label="外用"
                          name="gender"
                          getUsage={this.selectMedicineType}
                          checked={this.state.medicine_type == 1 ? true : false}
                      /><RadioButton
                          id="femaie1"
                          value={2}
                          label="注射"
                          name="gender"
                          getUsage={this.selectMedicineType}
                          checked={this.state.medicine_type == 2 ? true : false}
                      />
                    </div>
                    <SelectorWithLabel
                    options={display_order}
                    title="表示順"
                    getSelect={this.getPrescriptionSelect}
                    departmentEditCode={this.state.sort_order}
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
                            <th className="item-no"></th>
                            <th className="table-check">表示</th>
                            <th className="code-number">コード番号</th>
                            <th className="name">医薬品名</th>
                            <th className="name">医薬品カナ名</th>
                            <th className="code-number">種別</th>
                            <th className="code-number">経過措置日</th>
                            <th className="code-number">単位</th>
                            <th>厚生省コード</th>
                        </tr>
                      </thead>
                      <tbody id="code-table">
                        {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                            list_item.map((item, index) => {
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
                                    <td className="code-number text-right">{item.code}</td>
                                    <td className="name">{item.name}</td>
                                    <td className="name">{item.name_kana}</td>
                                    <td className="code-number">{item.category}</td>
                                    <td className="code-number">{item.transitional_measures_end_date}</td>
                                    <td className="code-number">{item.unit}</td>
                                    <td className = 'text-right'>{item.mhlw_code}</td>
                                </tr>
                                </>)
                            })
                        )}
                      </tbody>
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                    {/* <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>最新マスタに更新</Button> */}
                      <Button onClick={this.createCode} className={this.state.curFocus === 1?"red-btn focus": "red-btn"}>新規作成</Button>
                </div>
                {this.state.isOpenCodeModal && (
                    <MedicinesModal
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
                <ContextMenu
                {...this.state.contextMenu}
                parent={this}
                favouriteMenuType={this.state.favouriteMenuType}
                />
            </Card>
        )
    }
}
Medicines.contextType = Context;

export default Medicines