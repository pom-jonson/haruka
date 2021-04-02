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
import ExamSetModal from "./Modal/ExamSetModal";
import SelectExaminationItemModal from "~/components/templates/Patient/Modals/Common/SelectExaminationItemModal";
import auth from "~/api/auth";

import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
.tr-head{
  width: calc(100% - 17px);
}
th{
  border-top: none !important;
  border-bottom: none !important;
}
table {
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 13rem);  
      overflow-y:scroll;
      display:block;
			tr:hover{background-color:#e2e2e2 !important;}
    }
		thead{
      display: table;
      border-bottom: 1px solid #dee2e6 !important;
      width:100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
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
.no-result {    
	height:calc(100% - 1px);
	width:100%;
	div{
		height:100%;
		width:100%;
		text-align: center;
		vertical-align:middle;
		display:flex;
		align-items:center;
		justify-content:center; 
	}
	
	span {
		padding: 10px;
		border: 2px solid #aaa;
	}
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
        width: 35%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 63%;
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
    width: 35%;
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
  width: 63%;  
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

class Exam_Set_Master extends Component {
    constructor(props) {
        super(props);       
        this.state = {
            list_array:[],
            list_item:[],
            isOpenKindModal: false,
            isOpenExamOrderModal: false,            
            selected_second_layer_number:0,            
            selected_set_id:null,
            modal_data:null,
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
            is_loaded_one: true,
            is_loaded_two: true,
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getSecondLayer();
    }
    
    addSecondLayer = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,
            modal_data:null,
            selected_second_layer_number:0,
            selected_set_id:null,
        });
    };

    addThirdLayer = () => {
        this.setState({
            kind:2,
            isOpenExamOrderModal: true,
        });
    };

    closeModal = () => {
        this.setState({
            isOpenKindModal: false,            
            modal_data:null,
            isOpenExamOrderModal:false,
        });
    };
    
    getSecondLayer = async() => {
        let path = '';
        let post_data;        
        path = "/app/api/v2/master/examination/searchExamSet";
        post_data = {order:'sort_number'};
        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length>0){
                this.setState({
                    list_array:res,
                    selected_second_layer_number: this.state.selected_second_layer_number>0?this.state.selected_second_layer_number:res[0].number,
                    selected_set_id:this.state.selected_set_id>0?this.state.selected_set_id:res[0].outsourcing_inspection_set_id,
                    is_loaded_one: false,
                    is_loaded_two: true
                }, () => {
                    this.getThirdLayer(this.state.selected_set_id);
                });
            } else {
                this.setState({
                    list_array:[],
                    list_item:[],
                    selected_second_layer_number:0,
                    selected_set_id:null,
                    is_loaded_one: false,
                    is_loaded_two: false,
                })
            }
            
          })
          .catch(() => {
            this.setState({
              is_loaded_one: false,
              is_loaded_two: false
            });
          });
    }

    getThirdLayer = async(set_id) => {
        var path = "/app/api/v2/master/examination/searchExamSetItem";
        var post_data = {               
            outsourcing_inspection_set_id:set_id,
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            this.setState({
                list_item:res,
                is_loaded_two: false
            });
          })
          .catch(() => {
            this.setState({
              is_loaded_two: false
            });
          });
    }

    handleOk = () => {   
        switch(this.state.kind){            
            case 1:
              this.setState({
                is_loaded_one: true
              },()=> {                
                this.getSecondLayer();
              });
                break;
            case 2:
              this.setState({
                is_loaded_two: true
              },()=> {                                
                this.getThirdLayer(this.state.selected_set_id);
              });
                break;
        }
        
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
                confirm_message:'「' + name.trim() +'」　' + "を削除しますか?",
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
            case 1:                    
                path = "/app/api/v2/master/examination/deleteExamSet";
                await apiClient.post(path,  post_data);
                this.setState({
                  selected_second_layer_number:0, 
                  selected_set_id:null,
                  is_loaded_one: true
                }, () => {
                    this.getSecondLayer();
                })
                break;
            case 2:
                path = "/app/api/v2/master/examination/deleteExamSetItem";
                await apiClient.post(path,  post_data);
                this.setState({
                  is_loaded_two: true
                },()=> {
                  this.getThirdLayer(this.state.selected_set_id);
                });
                break;
        }        
        this.confirmCancel();
      };

      getSetID = (number, set_id) => {
        this.setState({
            selected_second_layer_number:number,            
            selected_set_id: set_id,
            is_loaded_two: true
        }, () => {
            this.getThirdLayer(set_id);
        });
        
      }



    render() {
        let {list_array, list_item} = this.state;
        return (
            <Card>
                <div style={{display:'flex'}}>
                    <div className="title">検体検査セットマスタ</div>                    
                </div>
                
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">検査セット</div>
                        <div className="tr" onClick={this.addSecondLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">検査セット項目定義マスタ</div>
                        <div className="tr" onClick={this.addThirdLayer.bind(this)}><Icon icon={faPlus} />追加</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>                        
                            <tr className="tr-head">
                                <th className='td-no'/>
                                <th className='table-check'>表示</th>
                                <th style={{width:'100px'}}>検査セットID</th>
                                <th className="name">検査セット名</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.is_loaded_one == true ? (
                          <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        ):(
                          <>
                            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                                list_array.map((item, index) => {
                                    return (
                                        <>
                                            <tr className={this.state.selected_second_layer_number === item.number?"selected clickable":"clickable"}
                                             onClick={this.getSetID.bind(this,item.number, item.outsourcing_inspection_set_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                                                <td className='td-no'>{index+1}</td>
                                                <td className='table-check'>
                                                    <Checkbox
                                                        label=""                                                    
                                                        value={item.is_enabled}
                                                        isDisabled={true}
                                                        name="check"
                                                    />
                                                </td>
                                                <td style={{width:'100px'}}>{item.outsourcing_inspection_set_id}</td>
                                                <td className="tl">{item.name}</td>
                                            </tr>
                                        </>)
                                })
                            )}
														{list_array !== undefined &&
														list_array !== null &&
														list_array.length < 1 && (
															<div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
														)}
                          </>
                        )}
                        </tbody>
                    </table>
                </List>
                <Wrapper>
                    <table className="table-scroll table table-bordered">
                        <thead>
                        <tr className="tr-head">
                            <th className="td-no"/>
                            <th className="table-check">表示</th>
                            <th style={{width:'100px'}}>検査項目ID</th>
                            <th style={{width:'50%'}}>検査項目名</th>
                            <th className="">表示名</th>                            
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.is_loaded_two == true ? (
                          <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        ):(
                          <>
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
                                                <td style={{width:'100px'}}>{item.code}</td>
                                                <td style={{width:'50%'}} className="tl">{item.name.trim()}</td>
                                                <td className="tl">{item.label.trim()}</td>
                                            </tr>
                                        </>)
                                })
                            )}
														{list_item !== undefined &&
														list_item !== null &&
														list_item.length < 1 && (
															<div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
														)}
                          </>
                        )}
                        </tbody>
                    </table>
                </Wrapper>                
                {this.state.isOpenKindModal && (
                    <ExamSetModal
                        kind={this.state.kind}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                                     
                        modal_data = {this.state.modal_data}
                    />
                )}

                {this.state.isOpenExamOrderModal && (
                    <SelectExaminationItemModal
                        selectMaster={this.handleOk}
                        closeModal={this.closeModal}                                     
                        set_id = {this.state.selected_set_id}
                        MasterName= {'検査項目'}
                        type={'set'}
                        sel_exams={this.state.list_item}
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

export default Exam_Set_Master