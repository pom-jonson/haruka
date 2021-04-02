import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
// import Checkbox from "~/components/molecules/Checkbox";
import EditAdditionMaster from "./Modal/EditAdditionMaster";
import EditDefineAddition from "./Modal/EditDefineAddition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import { number } from "prop-types";
import Checkbox from "~/components/molecules/Checkbox";
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
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 200px);  
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
    margin-top: 21px;
    font-size: 17px;
    margin-bottom: 6px;
    span {
        color: blue;
    }
    
    .left-area {
        width: 58%;
        // margin-right:2%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 39%;
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
    width: 58%;
    margin-right: 2%;    
    float: left;    
    border: solid 1px lightgrey;
    label {
        margin: 0;
    }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 38%;  
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
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
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
const sending_categories = [
    {id:0, value:''},
    {id:1, value:'送信する'},
    {id:2, value:'送信しない'},
    {id:3, value:'ユーザ選択'},
]

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
class Addition_Master extends Component {
    constructor(props) {
        super(props);        
        
        this.state = {            
            define_list:[],
            additions_list:[],
            isOpenKindModal: false,            
            selected_addtion_id:0,             
            modal_data:null,
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getAdditionMaster();
    }

    getAdditionMaster = async() => {
        let path = "/app/api/v2/master/addition/searchAdditionMaster";
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    additions_list:res,
                    selected_addtion_id:this.state.selected_addtion_id>0?this.state.selected_addtion_id:res[0].addition_id,                    
                }, () => {
                    this.getDefineAddition(this.state.selected_addtion_id);
                })
            } else {
                this.setState({
                    additions_list:[],
                    define_list:[],                    
                    selected_addtion_id:null,                    
                })
            }
          })
          .catch(() => {

          });
    }
    
    addAdditionMaster = () => {
        this.setState({
            kind:0,
            isOpenKindModal: true,            
            modal_data:null
        });
    };
    
    addDefineAddition = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,
            modal_data:null,            
        });
    };

    closeModal = () => {
        this.setState({
            isOpenKindModal: false,
            modal_data:null
        });
    };

    getDefineAddition = async(selected_id) => {
        let path = "/app/api/v2/master/addition/searchDefineAddition";

        let post_data = {
            addition_id:selected_id,            
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    define_list:res,                    
                })
            } else {
                this.setState({
                    define_list:[],                    
                })
            }
          })
          .catch(() => {
          });
    }
    

    handleOk = () => {                
        // this.getDefineAddition(this.state.selected_addtion_id);
        this.getAdditionMaster();
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
            switch(kind){
                case 0:
                    number = this.state.additions_list[index].number;
                    name = this.state.additions_list[index].name;
                    break;
                case 1:
                    number = this.state.define_list[index].number;
                    name = this.state.define_list[index].name;
                    break;                
            }
            
            this.setState({
                isDeleteConfirmModal : true,
                selected_number:number,
                kind:kind,
                confirm_message:'「' + name +'」　' + "このマスタを削除しますか?",
            })            
        }
    };

    editData = (index, kind) => {
        switch(kind){
            case 0:
                this.setState({
                    kind,
                    modal_data:this.state.additions_list[index],
                    isOpenKindModal: true,
                });
                break;            
            case 1:
                this.setState({
                    kind,
                    modal_data:this.state.define_list[index],                
                    isOpenKindModal: true,
                });
                break;
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
        switch(this.state.kind){
            case 0:
                path = "/app/api/v2/master/addition/deleteAdditionMaster";
                break;
            case 1:
                path = "/app/api/v2/master/addition/deleteDefineAddition";
                break;            
        }
        let post_data = {
            params: {number:this.state.selected_number},
        };
        
        await apiClient.post(path,  post_data);
        this.confirmCancel();
        if (this.state.kind == 0){
            this.getAdditionMaster();
        } else {
            this.getDefineAddition(this.state.selected_addtion_id);
        }
        

      };

      selectAddition = id => {
          this.setState({
              selected_addtion_id:id,
            }, () => {
              this.getDefineAddition(this.state.selected_addtion_id);
          });
      }

    render() {
        let { additions_list, define_list} = this.state;
        return (
            <Card>
                <div style={{display:'flex'}}>
                    <div className="title">追加項目制御・定義</div>                    
                </div>
                
                <ListTitle>                    
                    <div className="left-area">
                        <div className="tl">追加項目制御</div>
                        <div className="tr" onClick={this.addAdditionMaster.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">追加項目制御定義</div>
                        <div className="tr" onClick={this.addDefineAddition.bind(this)}><Icon icon={faPlus} />追加</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className="td-no"/>
                            <th className="table-check">表示</th>
                            <th style={{width:'200px'}}>追加項目制御ID</th>
                            <th className="">品名</th>
                        </tr>
                        </thead>
                        <tbody>
                            {additions_list != undefined && additions_list != null && additions_list.length>0 && (
                                additions_list.map((item, index) => {
                                    return(
                                        <>
                                            <tr className={this.state.selected_addtion_id === item.addition_id?"selected clickable":"clickable"} 
                                            onClick={this.selectAddition.bind(this, item.addition_id)} onContextMenu={e => this.handleClick(e,index, 0)}>
                                                <td className="td-no">{index+1}</td>
                                                <td className="table-check">
                                                    <Checkbox
                                                        label=""
                                                        value={item.is_enabled}
                                                        isDisabled={true}
                                                        name="check"
                                                    />
                                                </td>
                                                <td style={{textAlign:'center', width:'200px'}}>{item.addition_id}</td>
                                                <td style={{textAlign:'left'}}>{item.name}</td>
                                            </tr>
                                        </>
                                    )
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
                            <th style={{width:'200px'}}>追加項目制御定義ID</th>
                            <th>機能名</th>
                            <th style={{width:'120px'}}>送信制御区分</th>
                        </tr>
                        </thead>
                        <tbody>

                        {define_list !== undefined && define_list !== null && define_list.length > 0 && (
                            define_list.map((item, index) => {
                                return (
                                    <>
                                        <tr onContextMenu={e => this.handleClick(e,index, 1)}>
                                            <td className="td-no">{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
                                            <td style = {{textAlign:'center', width:'200px'}}>{item.addition_define_id}</td>
                                            <td>{item.name}</td>
                                            <td style={{width:'120px'}} className="tl">{item.sending_category>0?sending_categories[item.sending_category].value:''}</td>
                                        </tr>
                                    </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>                
                {this.state.isOpenKindModal && this.state.kind ==0 && (
                    <EditAdditionMaster
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
                        modal_data = {this.state.modal_data}
                    />
                )}

                {this.state.isOpenKindModal && this.state.kind ==1 && (
                    <EditDefineAddition
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
                        modal_data = {this.state.modal_data}
                        addition_id = {this.state.selected_addtion_id}
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

export default Addition_Master