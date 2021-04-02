import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import EditPartSubMaster from "./Modal/EditPartSubMaster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import {makeList_code} from "~/helpers/dialConstants";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
// import { number } from "prop-types";

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
  .pullbox{
      padding-top:10px;
  }
  .label-title{
    width:115px;
    font-size:15px;
    margin-left:30px;
  }
  .pullbox-select, .pullbox-label{
    width:300px;
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
// .label-title{
//     font-size:22px;
// }
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
        width: 21%;
        margin-right:2%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 31%;
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
    width: 21%;
    margin-right: 2%;    
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
  width: 31%;  
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
                    <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>変更</div></li>
                    <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>削除</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else { return null; }
};
class Radiation_Part_Master extends Component {
    constructor(props) {
        super(props);        
        
        this.state = {
            list_directions:[],
            list_methods:[],
            list_comments:[],
            main_master_list:[],
            isOpenKindModal: false,            
            selected_radiation_part_id:0, 
            selected_direction_id:null,
            modal_data:null,
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        }
    }

    async componentDidMount(){
        this.getRadiationMaster();
        // this.getRadiationPart();
    }

    getRadiationMaster = async() => {
        let path = "/app/api/v2/master/radiation/searchRadiationMaster";
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    radiation_master_data:res,
                    radiation_list:this.makelist_master(res),
                }, () => {
                    this.getRadiationClassific();
                })
            }
          })
          .catch(() => {

          });
    }

    makelist_master(data, enabled = 1){        
        let master_list = {};
        if (data != undefined && data.length>0 ){                
            Object.keys(data).map((key) => {
                if(enabled === 1){
                    if(data[key].is_enabled === 1){
                        master_list[data[key].radiation_order_id] = data[key].name;
                    }
                } else {
                    master_list[data[key].radiation_order_id] = data[key].name;
                }
            });
        }
        return master_list;
    }

    makelist_classific(data, enabled = 1){        
        let master_list = {};
        if (data != undefined && data.length>0 ){                
            Object.keys(data).map((key) => {
                if(enabled === 1){
                    if(data[key].is_enabled === 1){
                        master_list[data[key].radiation_shooting_classific_id] = data[key].radiation_shooting_classific_name;
                    }
                } else {
                    master_list[data[key].radiation_shooting_classific_id] = data[key].radiation_shooting_classific_name;
                }
            });
        }
        return master_list;
    }

    getRadiationClassific = async() => {
        let path = "/app/api/v2/master/radiation/searchClassificMaster";
        let post_data = {radiation_order_id:this.state.selected_radiation_id};

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    classific_data:res, 
                    classific_list:this.makelist_classific(res),
                    main_master_list:[],
                    list_directions:[],
                    list_methods:[],
                    selected_radiation_part_id:null,
                    selected_direction_id:null,
                    selected_method_id: null,
                    selected_comment_id: null,
                })
            } else {
                this.setState({
                    classific_data:[], 
                    classific_list:{},
                    main_master_list:[],
                    list_directions:[],
                    list_methods:[],
                    selected_radiation_part_id:null,
                    selected_direction_id:null,
                    selected_method_id: null,
                    selected_comment_id: null,
                });                
            }
          })
          .catch(() => {
          });
    }

    getRadiationPart = async() => {
        let path = "/app/api/v2/master/radiation/searchPartMaster";
        await apiClient
          ._post(path, {
              params: {radiation_shooting_classific_id:this.state.selected_classfic_id}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    main_master_list:res,
                    selected_radiation_part_id:this.state.selected_radiation_part_id>0?this.state.selected_radiation_part_id:res[0].radiation_part_id,                    
                }, () => {
                    this.getSubMasters(this.state.selected_radiation_part_id);
                })
            } else {
                this.setState({
                    main_master_list:[],
                    list_directions:[],
                    list_methods:[],
                    selected_radiation_part_id:null,
                    selected_direction_id:null,
                    selected_method_id: null,
                    selected_comment_id: null,
                })
            }
          })
          .catch(() => {

          });
    }
    
    addDirection = () => {
        this.setState({
            kind:0,
            isOpenKindModal: true,
            // selected_direction_id:null,
            modal_data:null
        });
    };

    addMethod = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,
            modal_data:null,
            
        });
    };

    addComment = () => {
        this.setState({
            kind:2,
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

    getDirection = async(selected_id) => {
        let path = "/app/api/v2/master/radiation/searchDirectionMaster";

        let post_data = {
            radiation_part_id:selected_id,            
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    list_directions:res,                    
                    selected_direction_id:this.state.selected_direction_id>0?this.state.selected_direction_id:res[0].radiation_direction_id,
                })
            } else {
                this.setState({
                    list_directions:[],                    
                    selected_direction_id:null,                    
                })
            }
          })
          .catch(() => {
          });
    }

    getMethod = async(selected_id) => {
        let path = "/app/api/v2/master/radiation/searchMethodMaster";

        let post_data = {
            radiation_part_id:selected_id,            
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    list_methods:res,                    
                    selected_method_id:this.state.selected_method_id>0?this.state.selected_method_id:res[0].radiation_direction_id,
                })
            } else {
                this.setState({
                    list_methods:[],                    
                    selected_method_id:null,                    
                })
            }
          })
          .catch(() => {
          });
    }

    getComment = async(selected_id) => {
        let path = "/app/api/v2/master/radiation/searchCommentMaster";

        let post_data = {
            radiation_part_id:selected_id,            
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    list_comments:res,
                    selected_comment_id:this.state.selected_comment_id>0?this.state.selected_comment_id:res[0].radiation_direction_id,
                })
            } else {
                this.setState({
                    list_comments:[],
                    selected_comment_id:null,                    
                })
            }
          })
          .catch(() => {
          });
    }

    getSubMasters = async(selected_id) => {
        this.getDirection(selected_id);
        this.getMethod(selected_id);
        this.getComment(selected_id);
    }

    handleOk = () => {                
        this.getSubMasters(this.state.selected_radiation_part_id);
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
                    number = this.state.list_directions[index].number;
                    name = this.state.list_directions[index].radiation_direction_name;
                    break;
                case 1:
                    number = this.state.list_methods[index].number;
                    name = this.state.list_methods[index].radiation_method_name;
                    break;
                case 2:
                    number = this.state.list_comments[index].number;
                    name = this.state.list_comments[index].radiation_shooting_comment_name;
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
                    modal_data:this.state.list_directions[index],
                    isOpenKindModal: true,
                });
                break;
            case 1:
                this.setState({
                    kind,
                    modal_data:this.state.list_methods[index],                
                    isOpenKindModal: true,
                });
                break;
            case 2:
                this.setState({
                    kind,
                    modal_data:this.state.list_comments[index],                
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
                path = "/app/api/v2/master/radiation/deleteDirection";
                break;
            case 1:
                path = "/app/api/v2/master/radiation/deleteMethod";
                break;
            case 2:
                path = "/app/api/v2/master/radiation/deleteComment";
                break;
        }
        let post_data = {
            params: {number:this.state.selected_number},
        };
        
        await apiClient.post(path,  post_data);
        this.confirmCancel();
        this.setState({selected_direction_id:null, selected_method_id:null, selected_comment_id:null}, () => {
            this.getSubMasters(this.state.selected_radiation_part_id);
        })
      };

      selectPart = id => {
          this.setState({
              selected_radiation_part_id:id,
              selected_direction_id:null,
              selected_method_id:null,
              selected_comment_id:null
            }, () => {
              this.getSubMasters(this.state.selected_radiation_part_id);
          });
      }

    getClassific = (e) => {
        this.setState({selected_classfic_id:e.target.id}, () => {
            if (this.state.selected_classfic_id > 0){
                this.getRadiationPart();
            } else {
                this.setState({
                    main_master_list:[],
                    list_directions:[],
                    list_methods:[],
                    selected_radiation_part_id:null,
                    selected_direction_id:null,
                    selected_method_id: null,
                    selected_comment_id: null,
                })
            }
            
        })
    }

    getRadaition = (e) => {
        this.setState({selected_radiation_id:e.target.id, selected_classfic_id:0}, () => {
            this.getRadiationClassific();
        })
    }    

    render() {
        let {list_directions, list_methods, main_master_list, list_comments} = this.state;
        return (
            <Card>
                <div style={{display:'flex'}}>
                    <div className="title">放射線部位マスタ</div>
                    <SelectorWithLabelIndex
                        options={this.state.radiation_list}
                        title="オーダーマスタ"
                        getSelect={this.getRadaition.bind(this)}
                        departmentEditCode={this.state.selected_radiation_id}                                            
                    />
                    <SelectorWithLabelIndex
                        options={this.state.classific_list}
                        title="撮影区分"
                        getSelect={this.getClassific.bind(this)}
                        departmentEditCode={this.state.selected_classfic_id}                                            
                    />
                </div>
                
                <ListTitle>
                    <div className="left-area">
                        <div style={{textAlign:'center'}}>放射線部位マスタ</div>                        
                    </div>
                    <div className="left-area">
                        <div className="tl">体位・方向マスタ</div>
                        <div className="tr" onClick={this.addDirection.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="left-area">
                        <div className="tl">方法マスタ</div>
                        <div className="tr" onClick={this.addMethod.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">撮影コメントマスタ</div>
                        <div className="tr" onClick={this.addComment.bind(this)}><Icon icon={faPlus} />追加</div>
                    </div>
                </ListTitle>
                <List>                    
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className='td-no'/>
                            <th className="name">部位名</th>
                        </tr>
                        </thead>
                        <tbody>
                            {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
                                main_master_list.map((item, index) => {
                                    return(
                                        <>
                                            <tr className={this.state.selected_radiation_part_id === item.radiation_part_id?"selected clickable":"clickable"} 
                                            onClick={this.selectPart.bind(this, item.radiation_part_id)}>
                                                <td className='td-no'>{index+1}</td>
                                                <td style={{textAlign:'left'}}>{item.radiation_part_name}</td>
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
                            <th className='td-no'/>
                            <th className="table-check">表示</th>
                            <th style={{width:'100px'}}>体位・方向ID</th>
                            <th className="name">体位・方向名</th>
                        </tr>
                        </thead>
                        <tbody>

                        {list_directions !== undefined && list_directions !== null && list_directions.length > 0 && (
                            list_directions.map((item, index) => {
                                return (
                                    <>
                                        <tr className={this.state.selected_direction_id === item.radiation_direction_id?"selected clickable":"clickable"} onContextMenu={e => this.handleClick(e,index,0)}>
                                            <td className='td-no'>{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""                                                    
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
                                            <td style={{width:'100px'}}>{item.radiation_direction_id}</td>
                                            <td className="tl">{item.radiation_direction_name}</td>
                                        </tr>
                                    </>)
                            })
                        )}
                        </tbody>
                    </table>
                </List>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className='td-no'/>
                            <th className="table-check">表示</th>
                            <th style={{width:'70px'}}>方法ID</th>
                            <th className="name">方法名</th>
                        </tr>
                        </thead>
                        <tbody>

                        {list_methods !== undefined && list_methods !== null && list_methods.length > 0 && (
                            list_methods.map((item, index) => {
                                return (
                                    <>
                                        <tr className={this.state.selected_method_id === item.radiation_method_id?"selected clickable":"clickable"} onContextMenu={e => this.handleClick(e,index,1)}>
                                            <td className='td-no'>{index+1}</td>
                                            <td className="table-check">
                                                <Checkbox
                                                    label=""                                                    
                                                    value={item.is_enabled}
                                                    isDisabled={true}
                                                    name="check"
                                                />
                                            </td>
                                            <td style={{width:'70px'}}>{item.radiation_method_id}</td>
                                            <td className="tl">{item.radiation_method_name}</td>
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
                            <th style={{width:'110px'}}>撮影コメントID</th>
                            <th className="">撮影コメント名</th>
                        </tr>
                        </thead>
                        <tbody>

                        {list_comments !== undefined && list_comments !== null && list_comments.length > 0 && (
                            list_comments.map((item, index) => {
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
                                            <td style={{width:'110px'}}>{item.radiation_shooting_comment_id}</td>
                                            <td className="tl">{item.radiation_shooting_comment_name}</td>
                                        </tr>
                                    </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>                
                {this.state.isOpenKindModal && (
                    <EditPartSubMaster
                        kind={this.state.kind}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        radiation_part_id = {this.state.selected_radiation_part_id}
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

export default Radiation_Part_Master