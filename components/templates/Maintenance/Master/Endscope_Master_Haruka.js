import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import EndscopeMasterModal from "./Modal/EndscopeMasterModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import auth from "~/api/auth";


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
  padding-top: 20px;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom:10px;
  }
  .selected{
      background:lightblue!important;
  }
  .clickable{
    cursor:pointer;
}
table {
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 190px);  
      overflow-y:auto;
      display:block;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
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
    width: 60px;
}
.td-no {
  width: 25px;
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
    margin-top: 21px;
    font-size: 17px;
    margin-bottom: 6px;
    span {
        color: blue;
    }
    
    .left-area {
        width: 45%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 53%;
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
    width: 45%;
    margin-right: 2%;
    height: calc( 100vh - 160px);
    float: left;    
    border: solid 1px lightgrey;
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
  width: 53%;
  height: calc( 100vh - 160px);
  float: left;  
  border: solid 1px lightgrey;  
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
  }
  .context-menu li {
    clear: both;
    width: 100px;
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
class Endscope_Master_Haruka extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_array:[],
            list_item:[],
            isOpenKindModal: false,            
            selected_first_kind_number:0, 
            modal_data:null,                   
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getInspectionFirstKind();
    }
    
    addFirstKind = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,            
            selected_first_kind_number:0,
            modal_data:null
        });
    };
    closeModal = () => {
        this.setState({
            isOpenKindModal: false,
            modal_data:null
        });
    };
    addSecondKind = () => {
        this.setState({
            kind:0,
            isOpenKindModal: true,
            modal_data:null,
            
        });
    };

    getInspectionFirstKind = async() => {
        let path = "/app/api/v2/master/inspection/searchInspectionType";
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    list_array:res,
                    selected_first_kind_number:this.state.selected_first_kind_number>0?this.state.selected_first_kind_number:res[0].number,
                }, () => {
                    this.getSecondKindFromFirst(this.state.selected_first_kind_number);
                })
            } else {
                this.setState({
                    list_array:[],
                    list_item:[],
                    selected_first_kind_number:0,
                })
            }
          })
          .catch(() => {

          });
    }
    getSecondKindFromFirst = async(first_kind_number) => {
        let path = "/app/api/v2/master/inspection/searchInspectionItem";
        let post_data = {   
            inspection_type_id:first_kind_number,            
        };
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {    
            this.setState({
                list_item:res,
                selected_first_kind_number:first_kind_number,
            });
          })
          .catch(() => {

          });
    }

    handleOk = () => {                
        this.getInspectionFirstKind();
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
        });
        }
    };
    
    contextMenuAction = (act, index, kind) => {
        if( act === "edit") {
            this.editData(index, kind);
        } else if (act === "delete") {            
            var number, name;            
            if (kind == 1) {
                number = this.state.list_array[index].number;
                name = this.state.list_array[index].name;
            } else {
                number = this.state.list_item[index].number;
                name = this.state.list_item[index].name;
            }
            this.setState({
                isDeleteConfirmModal : true,
                selected_number:number,
                kind:kind,
                confirm_message:'「' + name +'」　' + "この分類マスタを削除しますか?",
            })            
        }
    };

    editData = (index, kind) => {        
        if (kind ===1){            
            this.setState({
                kind,
                modal_data:this.state.list_array[index],                
                isOpenKindModal: true,
            });
        } else {            
            this.setState({
                kind,
                modal_data:this.state.list_item[index],
                isOpenKindModal: true, 
            });
        }
        
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
        if (this.state.kind ==1){
            path = "/app/api/v2/master/inspection/deleteInspectionType";
        } else {
            path = "/app/api/v2/master/inspection/deleteInspectionItem";
        }
        let post_data = {
            params: {number:this.state.selected_number},                                
        };
        await apiClient.post(path,  post_data);
        this.confirmCancel();
        this.setState({selected_first_kind_number:0}, () => {
            this.getInspectionFirstKind();
        })
        
      };

      selectPattern = (pattern_number) => {
        this.setState({selected_first_kind_number:pattern_number});
        this.getSecondKindFromFirst(pattern_number);
      }

    render() {
        let {list_array, list_item} = this.state;
        return (
            <Card>
                <div className="title">内視鏡検査マスタ</div>                
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">検査種別マスタ</div>
                        <div className="tr" onClick={this.addFirstKind}>
                            <Icon icon={faPlus} />検査種別マスタを追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">検査項目マスタ</div>
                        <div className="tr" onClick={this.addSecondKind}><Icon icon={faPlus} />検査項目マスタを追加</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className="td-no"/>
                            <th className="table-check">表示</th>
                            <th className="name">検査種別マスタ名称</th>
                        </tr>
                        </thead>
                        <tbody>

                        {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                            list_array.map((item, index) => {
                                return (
                                    <>
                                        <tr className={this.state.selected_first_kind_number === item.number?"selected clickable":"clickable"} onClick={this.selectPattern.bind(this,item.number)} onContextMenu={e => this.handleClick(e,index, 1)}>
                                            <td className="td-no">{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""                                                    
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
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
                            <th className="td-no"/>
                            <th className="table-check">表示</th>
                            <th className="name">検査項目マスタ名称</th>
                        </tr>
                        </thead>
                        <tbody>

                        {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                            list_item.map((item, index) => {
                                return (
                                    <>
                                        <tr onContextMenu={e => this.handleClick(e,index, 0)}>
                                            <td className="td-no">{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""                                                    
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
                                            <td className="tl">{item.name}</td>
                                        </tr>
                                    </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>                
                {this.state.isOpenKindModal && (
                    <EndscopeMasterModal
                        kind={this.state.kind}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
                        first_kind_number = {this.state.selected_first_kind_number}
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
                />
            </Card>
        )
    }
}

export default Endscope_Master_Haruka