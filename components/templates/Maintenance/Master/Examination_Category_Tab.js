import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import { number } from "prop-types";
import CategoryTabModal from "./Modal/CategoryTabModal";
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
  font-size: 1rem;
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
          font-size:1rem;
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
      border-bottom: 1px solid #dee2e6;
    }
    tbody{
      height: calc(100vh - 14rem);  
      overflow-y:scroll;
      display:block;
      tr:hover{background-color:#e2e2e2 !important;}
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
    label{
      margin-right: 0px;
      input{
        margin-right: 0px;
      }
    }
}
.td-no {
  width: 25px;
}
.code-number{
    width:100px;
}
.label-title{
    font-size:1rem;
}
.footer {
    label {
        text-size: 16px;
        font-size:1rem;
    }
    text-align: center;    
  }
`;
const ListTitle = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    height: 25px;
    float: left;
    margin-top: 21px;
    font-size: 1rem;
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
    font-size: 1rem;
    width: 25%;
    margin-right: 2%;    
    float: left;        
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
  font-size: 1rem;
  width: 46%;  
  float: left;    
  margin-bottom: 10px;
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
    font-size: 1rem;
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

class Examination_Category_Tab extends Component {
    constructor(props) {
        super(props);       
        this.state = {
            list_array:[],
            list_item:[],
            isOpenKindModal: false,
            isOpenExamOrderModal: false,
            selected_first_layer_number:0, 
            selected_second_layer_number:0,
            selected_category_id:null,
            selected_tab_id:null,
            modal_data:null,
            
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
            is_loaded_one: true,
            is_loaded_two: true,
            is_loaded_three: true,
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getFirstLayer();
        this.getSecondLayer();
        setTimeout(()=>{
            this.getThirdLayer(this.state.selected_category_id, this.state.selected_tab_id);
        }, 500);
    }
    
    addFirstLayer = () => {
        this.setState({
            kind:0,
            isOpenKindModal: true,
            modal_data:null,
            selected_first_layer_number:0,
            selected_category_id:null,
        });
    };

    addSecondLayer = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,
            modal_data:null,
            selected_second_layer_number:0,
            selected_tab_id:null,
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

    getFirstLayer = async() => {
        let path = '';        
        path = "/app/api/v2/master/examination/searchExamCategory";
        
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    main_master_list:res,
                    selected_first_layer_number:this.state.selected_first_layer_number>0?this.state.selected_first_layer_number:res[0].number,
                    selected_category_id:this.state.selected_category_id>0?this.state.selected_category_id:res[0].outsourcing_inspection_category_id,
                    is_loaded_one: false
                })
            } else {
                this.setState({
                    main_master_list:[],
                    list_array:[],
                    list_item:[],
                    selected_first_layer_number:0,
                    selected_category_id:null,
                    is_loaded_one: false
                })
            }
          })
          .catch(() => {
            this.setState({
              is_loaded_one: false
            });
          });
    }
    getSecondLayer = async() => {
        let path = '';
        let post_data;        
        path = "/app/api/v2/master/examination/searchExamTab";
        post_data = {};
        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length>0){
                this.setState({
                    list_array:res,
                    selected_second_layer_number: this.state.selected_second_layer_number>0?this.state.selected_second_layer_number:res[0].number,
                    selected_tab_id:this.state.selected_tab_id>0?this.state.selected_tab_id:res[0].outsourcing_inspection_tab_id,
                    is_loaded_two: false
                });
            } else {
                this.setState({
                    list_array:[],
                    list_item:[],
                    selected_second_layer_number:0,
                    selected_tab_id:null,
                    is_loaded_two: false
                })
            }
            
          })
          .catch(() => {
            this.setState({
              is_loaded_two: false
            });
          });
    }

    getThirdLayer = async(category_id, tab_id) => {
        var path = "/app/api/v2/master/examination/searchExamItem";
        var post_data = {   
            outsourcing_inspection_category_id:category_id,
            outsourcing_inspection_tab_id:tab_id,
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            this.setState({
                list_item:res,
                is_loaded_three: false
            });
          })
          .catch(() => {
            this.setState({
              is_loaded_three: false
            });
          });
    }

    handleOk = () => {   
        switch(this.state.kind){
            case 0:
              this.setState({
                is_loaded_one: true
              }, ()=> {                
                this.getFirstLayer();
              });
                break;
            case 1:
              this.setState({
                is_loaded_two: true
              }, ()=> {                                
                this.getSecondLayer();
              });
                break;
            case 2:
              this.setState({
                is_loaded_three: true
              }, ()=> {                                                
                this.getThirdLayer(this.state.selected_category_id, this.state.selected_tab_id);
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
                path = "/app/api/v2/master//deleteExamCategory";
                await apiClient.post(path,  post_data);
                this.setState({
                  selected_first_layer_number:0, 
                  selected_category_id:null,
                  is_loaded_one: true
                }, () => {
                    this.getFirstLayer();
                })
                break;
            case 1:                    
                path = "/app/api/v2/master/examination/deleteExamTab";
                await apiClient.post(path,  post_data);
                this.setState({
                  selected_second_layer_number:0, 
                  selected_tab_id:null,
                  is_loaded_two: true
                }, () => {
                    this.getSecondLayer();
                })
                break;
            case 2:
                path = "/app/api/v2/master/examination/deleteExamItem";
                await apiClient.post(path,  post_data);
                this.setState({
                  is_loaded_three: true
                }, ()=> {
                  this.getThirdLayer(this.state.selected_category_id, this.state.selected_tab_id);
                });
                break;
        }        
        this.confirmCancel();
      };

      getTabID = (number, tab_id) => {
        this.setState({
            selected_second_layer_number:number,            
            selected_tab_id: tab_id,
            is_loaded_three: true
        }, () => {
            this.getThirdLayer(this.state.selected_category_id, tab_id);
        });
        
      }

      getCategoryID = (number,category_id) => {
          this.setState({              
              selected_first_layer_number:number,
              selected_category_id:category_id,
              is_loaded_three: true
            }, () => {
                this.getThirdLayer(category_id, this.state.selected_tab_id);
            });
      }


    render() {
        let {list_array, list_item, main_master_list} = this.state;
        return (
            <Card>
                <div style={{display:'flex'}}>
                    <div className="title">検体検査カテゴリ設定</div>
                </div>
                
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">カテゴリ</div>
                        <div className="tr" onClick={this.addFirstLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="left-area">
                        <div className="tl">タブ</div>
                        <div className="tr" onClick={this.addSecondLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">タブ内容</div>
                        <div className="tr" onClick={this.addThirdLayer.bind(this)}><Icon icon={faPlus} />追加</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr className="tr-head">
                            <th className='td-no'/>
                            <th className="table-check">表示</th>
                            <th style={{width:'100px'}}>カテゴリID</th>
                            <th className="name">カテゴリ名</th>
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
                              {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
                                  main_master_list.map((item, index) => {
                                      return(
                                          <>
                                              <tr className={this.state.selected_first_layer_number === item.number?"selected clickable":"clickable"} 
                                              onClick={this.getCategoryID.bind(this, item.number, item.outsourcing_inspection_category_id)} onContextMenu={e => this.handleClick(e,index, 0)}>
                                                  <td className='td-no'>{index+1}</td>
                                                  <td className='table-check'>
                                                      <Checkbox
                                                          label=""                                                    
                                                          value={item.is_enabled}
                                                          isDisabled={true}
                                                          name="check"
                                                      />
                                                  </td>
                                                  <td style={{width:'100px',textAlign:"right"}}>{item.outsourcing_inspection_category_id}</td>
                                                  <td style={{textAlign:'left'}}>{item.name}</td>
                                              </tr>
                                          </>
                                      )
                                  })
                              )}
                            </>
                          )}
                        </tbody>
                    </table>
                </List>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr className="tr-head">
                            <th className='td-no'/>
                            <th className="table-check">表示</th>
                            <th style={{width:'70px'}}>タブID</th>
                            <th className="name">タブ名</th>
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
                            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                                list_array.map((item, index) => {
                                    return (
                                        <>
                                            <tr className={this.state.selected_second_layer_number === item.number?"selected clickable":"clickable"}
                                             onClick={this.getTabID.bind(this,item.number, item.outsourcing_inspection_tab_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                                                <td className='td-no'>{index+1}</td>
                                                <td className='table-check'>
                                                    <Checkbox
                                                        label=""                                                    
                                                        value={item.is_enabled}
                                                        isDisabled={true}
                                                        name="check"
                                                    />
                                                </td>
                                                <td style={{width:'70px', textAlign:"right"}}>{item.outsourcing_inspection_tab_id}</td>
                                                <td className="tl">{item.name}</td>
                                            </tr>
                                        </>)
                                })
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
                        {this.state.is_loaded_three == true ? (
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
                                                <td style={{width:'100px', textAlign:"right"}}>{item.code}</td>
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
                    <CategoryTabModal
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
                        MasterName= {'検査項目'}
                        category_id = {this.state.selected_category_id}
                        tab_id = {this.state.selected_tab_id}
                        type={'category'}
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

export default Examination_Category_Tab