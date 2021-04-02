import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import { number } from "prop-types";
import SpiritClassificModal from "./Modal/SpiritClassificModal";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
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
        width: 25%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 46%;
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
    width: 25%;
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
  width: 46%;  
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

const ContextMenu = ({visible,x,y,parent,index, kind}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {kind != 2 && (<li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>変更</div></li>)}
                    <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>削除</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else { return null; }
};

class Spirit_Master extends Component {
    constructor(props) {
        super(props);       
        this.state = {
            list_array:[],
            list_item:[],
            isOpenKindModal: false,
            isOpenSelectItemModal: false,
            selected_first_layer_number:0, 
            selected_second_layer_number:0,
            selected_classific_id:null,
            selected_classific_detail_id:null,
            modal_data:null,
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getFirstLayer();
        this.getSecondLayer();        
    }
    
    addFirstLayer = () => {
        this.setState({
            kind:0,
            isOpenKindModal: true,
            modal_data:null,            
        });
    };

    addSecondLayer = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,
            modal_data:null,            
        });
    };

    addThirdLayer = () => {
        if (this.state.selected_classific_detail_id > 0){
            this.setState({
                kind:2,
                isOpenSelectItemModal: true,
            });
        } else {
            window.sessionStorage.setItem("alert_messages", "分類詳細項目を選択ください");
        }        
    };

    closeModal = () => {
        this.setState({
            isOpenKindModal: false,            
            modal_data:null,
            isOpenSelectItemModal:false,
        }, () => {
            switch(this.state.kind){
                case 0:
                    this.getFirstLayer();
                    break;
                case 1:
                    this.getSecondLayer();
                    break;                
            }
        });
    };

    getFirstLayer = async() => {
        let path = '';        
        path = "/app/api/v2/master/spirit/searchClassific";
        
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    main_master_list:res,
                    selected_first_layer_number:this.state.selected_first_layer_number>0?this.state.selected_first_layer_number:res[0].number,
                    selected_classific_id:this.state.selected_classific_id>0?this.state.selected_classific_id:res[0].classific_id,
                }, () => {
                    this.getSecondLayer();
                })
            } else {
                this.setState({
                    main_master_list:[],
                    list_array:[],
                    list_item:[],
                    selected_first_layer_number:0,
                    selected_classific_id:null,
                })
            }
          })
          .catch(() => {

          });
    }
    getSecondLayer = async() => {
        let path = '';
        let post_data;        
        path = "/app/api/v2/master/spirit/searchClassificDetail";
        post_data = {classific_id:this.state.selected_classific_id};
        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length>0){
                this.setState({
                    list_array:res,
                    selected_second_layer_number: res[0].number,
                    selected_classific_detail_id:res[0].classific_detail_id,
                }, () => {
                    this.getThirdLayer();
                });
            } else {
                this.setState({
                    list_array:[],
                    list_item:[],
                    selected_second_layer_number:0,
                    selected_classific_detail_id:null,
                })
            }
            
          })
          .catch(() => {

          });
    }

    getThirdLayer = async() => {
        var path = "/app/api/v2/master/spirit/searchAddition";
        var post_data = {
            classific_detail_id:this.state.selected_classific_detail_id,
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            this.setState({
                list_item:res,
            });
          })
          .catch(() => {
          });
    }

    handleOk = () => {   
        switch(this.state.kind){
            case 0:
                this.getFirstLayer();
                break;
            case 1:
                this.getSecondLayer();
                break;            
        }
        this.closeModal();
    };
    addAddition = async(item) => {        
        let path = "/app/api/v2/master/spirit/registerClassficAdd";
        let post_data = {
            params:{
                classific_detail_id:this.state.selected_classific_detail_id,
                item_id:item.item_id,
                receipt_key:item.receipt_key,
            }
        }
        await apiClient.post(path, post_data).then((res)=>{
            if (res)
                    window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
        this.getThirdLayer();
        this.closeModal();
    }

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
            contextMenu_define:{visible:false}
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
                    number = this.state.main_master_list[index].number;
                    name = this.state.main_master_list[index].name;
                    break;
                case 1:                    
                    number = this.state.list_array[index].number;
                    name = this.state.list_array[index].name;
                    break;
                case 2:
                    number = this.state.list_item[index].number;
                    name = this.state.list_item[index].name;
                    break;
            }
            
            this.setState({
                isDeleteConfirmModal : true,
                selected_number:number,
                kind:kind,
                confirm_message:'「' + name.trim() +'」　' + "このマスタを削除しますか?",
            })            
        }
    };

    editData = (index, kind) => {
        var modal_data;
        switch(kind){
            case 0:
                modal_data = this.state.main_master_list[index];
                break;
            case 1:
                modal_data = this.state.list_array[index];
                break;
            case 2:
                modal_data = this.state.list_item[index];
                break;
        }        
        this.setState({
            kind,
            modal_data,
            isOpenKindModal: true,
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
        var path;
        let post_data = {
            params: {number:this.state.selected_number},
        };
        switch(this.state.kind){
            case 0:
                path = "/app/api/v2/master/spirit/deleteClassific";
                await apiClient.post(path,  post_data);
                this.setState({selected_first_layer_number:0, selected_classific_id:null}, () => {
                    this.getFirstLayer();
                })
                break;
            case 1:                    
                path = "/app/api/v2/master/spirit/deleteClassificDetail";
                await apiClient.post(path,  post_data);
                this.setState({selected_second_layer_number:0, selected_classific_detail_id:null}, () => {
                    this.getSecondLayer();
                })
                break;
            case 2:
                path = "/app/api/v2/master/spirit/deleteClassificAdd";
                await apiClient.post(path,  post_data);
                this.getThirdLayer();
                break;
        }        
        this.confirmCancel();
      };

      getAdditions = (number, classific_detail_id) => {
        this.setState({
            selected_second_layer_number:number,            
            selected_classific_detail_id: classific_detail_id
        }, () => {
            this.getThirdLayer();
        });
      }

      getDetails = (number,classific_id) => {
        this.setState({              
            selected_first_layer_number:number,
            selected_classific_id:classific_id,
            selected_classific_detail_id:null,
        }, () => {
            this.getSecondLayer();
        });
      }

    render() {
        let {list_array, list_item, main_master_list} = this.state;
        return (
            <Card>
                <div style={{display:'flex'}}>
                    <div className="title">精神療法マスタ設定</div>                    
                </div>
                
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">精神療法分類</div>
                        <div className="tr" onClick={this.addFirstLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="left-area">
                        <div className="tl">精神療法分類詳細</div>
                        <div className="tr" onClick={this.addSecondLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">精神療法分類加算</div>
                        <div className="tr" onClick={this.addThirdLayer.bind(this)}><Icon icon={faPlus} />追加</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className="td-no"/>
                            <th style={{width:'100px'}}>分類ID</th>
                            <th className="name">分類名</th>
                        </tr>
                        </thead>
                        <tbody>
                            {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
                                main_master_list.map((item, index) => {
                                    return(
                                        <>
                                            <tr className={this.state.selected_first_layer_number === item.number?"selected clickable":"clickable"} 
                                            onClick={this.getDetails.bind(this, item.number, item.classific_id)} onContextMenu={e => this.handleClick(e,index, 0)}>
                                                <td className="td-no">{index+1}</td>
                                                <td style={{width:'100px'}}>{item.classific_id}</td>
                                                <td style={{textAlign:'left'}}>{item.name}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </List>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className="td-no"/>
                            <th className="table-check">表示</th>
                            <th style={{width:'100px'}}>分類詳細ID</th>
                            <th className="name">分類詳細名</th>
                        </tr>
                        </thead>
                        <tbody>

                        {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                            list_array.map((item, index) => {
                                return (
                                    <>
                                        <tr className={this.state.selected_second_layer_number === item.number?"selected clickable":"clickable"}
                                         onClick={this.getAdditions.bind(this,item.number, item.classific_detail_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                                            <td className="td-no">{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""                                                    
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
                                            <td style={{width:'100px'}}>{item.classific_detail_id}</td>
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
                            <th style={{width:'120px'}}>分類加算品名ID</th>
                            <th className="">品名</th>                                                       
                        </tr>
                        </thead>
                        <tbody>

                        {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                            list_item.map((item, index) => {
                                return (
                                    <>
                                        <tr onContextMenu={e => this.handleClick(e,index, 2)}>
                                            <td className="td-no">{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""                                                    
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
                                            <td style={{width:'120px'}}>{item.item_id}</td>
                                            <td className="tl">{item.name.trim()}</td>                                            
                                        </tr>
                                    </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>                
                {this.state.isOpenKindModal && (
                    <SpiritClassificModal
                        kind={this.state.kind}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                                     
                        modal_data = {this.state.modal_data}
                        classific_id = {this.state.kind ==1? this.state.selected_classific_id:null}
                    />
                )}

                {this.state.isOpenSelectItemModal && (
                    <SelectPannelHarukaModal
                        selectMaster={this.addAddition}
                        closeModal={this.closeModal}
                        MasterName= {'品名'}
                        function_id= {4}
                        item_category_id = {0}
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

export default Spirit_Master