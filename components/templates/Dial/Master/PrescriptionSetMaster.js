import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import PrescriptionSetModal from "./Modals/PrescriptionSetModal"
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "../DialMethods";
import PropTypes from "prop-types";
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
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
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
      width: 9.375rem;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 3.75rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        font-size: 1rem;  
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
          width: 6rem;
          label{
            margin-right: 0;
          }
      }
      .item-no {
        width: 4rem;
      }
      .code-number {
          width: 12rem;
      }
      .name{
        width:20rem;
      }
      .name-kana {
        width: 30%;
      }
  }

 `;
 
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ"},
    { id: 2, value: "非表示のみ"},
];
const sort_order = [    
  { id: 0, value: "表示順", field_name:"sort_number"},  
  { id: 1, value: "カナ順", field_name:"name_kana"},  
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  {$canDoAction(FEATURES.DIAL_PRES_SET_MASTER,AUTHS.EDIT,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                  )}
                  {$canDoAction(FEATURES.DIAL_PRES_SET_MASTER,AUTHS.DELETE,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                  )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};


class PrescriptionSetMaster extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
       let table_data = [];
        this.state = {
            schVal: "",
            table_data,
            isOpenModal: false,            
            modal_data:{},
            search_order: 1,        //表示順
            search_class: 1,        //表示区分

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
        };
        this.double_click = false;
    }
    
    async componentDidMount(){
      this.searchPresetList();
    }

    // 検索
    searchPresetList = async () => {
        let path = "/app/api/v2/dial/master/prescriptionSet_search";
        let post_data = {
            keyword: this.state.schVal,            
            is_enabled: this.state.search_class,
            order:sort_order[this.state.search_order].field_name
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({table_data: data});
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.searchPresetList();
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    handleOk = () => {
      this.setState({
        isOpenModal: false
      }, () => {
          this.searchPresetList();
      });
    };
    createPrescriptionSet = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_PRES_SET_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
          window.sessionStorage.setItem("alert_messages","登録権限がありません。");
          return;
      }
        this.setState({
          isOpenModal: true,
          modal_data:null
        });
    };
    closeModal = () => {
        this.setState({isOpenModal: false})
    };    
    
    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id) }, () => {
            this.searchPresetList();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id) }, () => {
            this.searchPresetList();
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
    };

    editData = (index) => {
      let modal_data = this.state.table_data[index];
      this.setState({
          modal_data,
          // row_index: index,
          isOpenModal: true
      });
    };

    deleteData = async () => {
      let path = "/app/api/v2/dial/master/prescriptionSet_delete";
      let post_data = {
          params: this.state.selected_number,                    
      };
        if (this.double_click == true) return;
        this.double_click = true;
        await axios.post(path,  post_data).finally(()=>{
            this.double_click=false;
            let title = "削除完了##";
            window.sessionStorage.setItem("alert_messages", title + '処方セットを削除しました');
        });
      this.confirmCancel();
      this.searchPresetList();
    };

    getRadio = (number,name,value) => {
        if (name === "check") {
            this.checkStateMaster("dial_prescription_set_master",number,value).then(()=>{
                this.searchPresetList();
            });
        }
    };

    openMedicine = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_MEDICINE_MASTER,this.context.AUTHS.READ, 0) === false) {
          window.sessionStorage.setItem("alert_messages","権限がありません。");
          return;
      }
        this.props.history.replace("/dial/master/medicine");
    };

    render() {
        let {table_data} = this.state;
        return (
          <Card>
            <div className="title">処方セットマスタ</div>
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
                <SelectorWithLabel
                    options={sort_order}
                    title="表示順"
                    getSelect={this.getOrderSelect}
                    departmentEditCode={this.state.search_order}
                />
              </div>
            </SearchPart>
            <Wrapper>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="item-no text-left" />
                    <th className="table-check">表示</th>
                    <th className="">セット名</th>
                    <th className="name-kana">カナ名</th>
                    <th className="code-number">セットID</th>
                    <th className="table-check">表示順</th>
                  </tr>
                </thead>
                <tbody id="code-table">
                  {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length > 0 &&
                    table_data.map((item, index) => {
                      return (
                        <>
                          <tr onContextMenu={(e) => this.handleClick(e, index)}>
                            <td className="text-right item-no">{index + 1}</td>
                            <td className="text-center table-check">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, item.number)}
                                value={item.is_enabled}
                                name="check"
                              />
                            </td>
                            <td className="text-left">{item.name}</td>
                            <td className="text-left name-kana">{item.name_kana != undefined && item.name_kana != null ? item.name_kana : ""}</td>
                            <td className="text-right code-number">
                              {item.set_id}
                            </td>
                            <td className="text-right table-check">
                              {item.sort_order}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </Wrapper>
            <div className="footer-buttons">
                <Button className="red-btn" onClick={this.openMedicine}>薬剤マスタ</Button>
                <Button className="red-btn" onClick={this.createPrescriptionSet}>新規作成</Button>
            </div>
            {this.state.isOpenModal && (
              <PrescriptionSetModal
                handleOk={this.handleOk}
                closeModal={this.closeModal}
                modal_data={this.state.modal_data}
              />
            )}

            {this.state.isDeleteConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.deleteData.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              row_index={this.state.row_index}
            />
          </Card>
        );
    }
}
PrescriptionSetMaster.contextType = Context;

PrescriptionSetMaster.propTypes = {
    history: PropTypes.object,
}

export default PrescriptionSetMaster