import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import TreatPracticeMasterModal from "./Modal/TreatPracticeMasterModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import auth from "~/api/auth";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
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
    margin-bottom:0;
    thead{
      display: table;
      width:calc(100% - 17px);
    }
    tbody{
      height: calc(100vh - 200px);  
      overflow-y:scroll;
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
    label {margin-right:0;}
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
`;
const ListTitle = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
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
  font-size: 1rem;
  width: 46%;  
  float: left;  
  border: solid 1px lightgrey;  
  margin-bottom: 10px;
 `;
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
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

class Treat_Practice_Master extends Component {
    constructor(props) {
        super(props);
        this.treat_order_is_enable_request = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").treat_order_is_enable_request;
        this.state = {
            list_array:[],
            list_item:[],
            isOpenKindModal: false,            
            selected_first_layer_number:0, 
            selected_second_layer_number:0,
            selected_classification_id:null,
            selected_practice_id:null,
            modal_data:null,
            is_first_loaded: false,
            is_second_loaded: false,
            is_third_loaded: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getTreatFirstLayer();
    }
    
    addFirstLayer = () => {
        this.setState({
            kind:0,
            isOpenKindModal: true,
            modal_data:null,
            selected_first_layer_number:0,
            selected_classification_id:null,
        });
    };

    addSecondLayer = () => {
        this.setState({
            kind:1,
            isOpenKindModal: true,
            modal_data:null,
            selected_second_layer_number:0,
            selected_practice_id:null,
        });
    };

    addThirdLayer = () => {
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
        }, () => {
            switch(this.state.kind){
                case 0:
                    this.getTreatFirstLayer();
                    break;
                case 1:
                    this.getTreatSecondLayer(this.state.selected_classification_id);
                    break;                
            }
        });
    };

    getTreatFirstLayer = async() => {
        let path = '';        
        path = "/app/api/v2/master/treat/searchClassification";
        this.setState({is_first_loaded: false});
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    main_master_list:res,
                    selected_first_layer_number:this.state.selected_first_layer_number>0?this.state.selected_first_layer_number:res[0].number,
                    selected_classification_id:this.state.selected_classification_id>0?this.state.selected_classification_id:res[0].classification_id,
                }, () => {                    
                    this.getTreatSecondLayer(this.state.selected_classification_id);
                })
            } else {
                this.setState({
                    main_master_list:[],
                    list_array:[],
                    list_item:[],
                    selected_first_layer_number:0,
                    selected_classification_id:null,
                })
            }
          })
          .catch(() => {

          }).finally(()=>{
              this.setState({is_first_loaded: true});
          });
    }
    getTreatSecondLayer = async(selected_id) => {
        let path = '';
        let post_data;        
        path = "/app/api/v2/master/treat/searchPractice";
        post_data = {   
            classification_id:selected_id,
        };
        this.setState({is_second_loaded: false});
        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length>0){
                this.setState({
                    list_array:res,
                    selected_second_layer_number: this.state.selected_second_layer_number>0?this.state.selected_second_layer_number:res[0].number,
                    selected_practice_id:this.state.selected_practice_id>0?this.state.selected_practice_id:res[0].practice_id,
                }, () => {
                    this.getTreatThirdLayer(this.state.selected_classification_id, this.state.selected_practice_id);
                });
            } else {
                this.setState({
                    list_array:[],
                    list_item:[],
                    selected_second_layer_number:0,
                    selected_practice_id:null,
                })
            }
            
          })
          .catch(() => {

          }).finally(()=>{
              this.setState({is_second_loaded: true});
          });
    }

    getTreatThirdLayer = async(classification_id, practice_id) => {
        var path = "/app/api/v2/master/treat/searchRequest";
        var post_data = {   
            classification_id:classification_id,
            practice_id:practice_id,
        };
        this.setState({is_third_loaded: false});
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
          }).finally(()=>{
              this.setState({is_third_loaded: true});
          });
    }

    handleOk = () => {        
        this.getTreatFirstLayer();
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
                confirm_message:'「' + name +'」　' + "このマスタを削除しますか?",
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
                path = "/app/api/v2/master/treat/deleteClassification";
                await apiClient.post(path,  post_data);
                this.setState({selected_first_layer_number:0, selected_classification_id:null}, () => {
                    this.getTreatFirstLayer();
                })
                break;
            case 1:                    
                path = "/app/api/v2/master/treat/deletePractice";
                await apiClient.post(path,  post_data);
                this.setState({selected_second_layer_number:0, selected_practice_id:null}, () => {
                    this.getTreatSecondLayer(this.state.selected_classification_id);
                })
                break;
            case 2:
                path = "/app/api/v2/master/treat/deleteRequest";
                await apiClient.post(path,  post_data);                
                this.getTreatThirdLayer(this.state.selected_classification_id, this.state.selected_practice_id);
                break;
        }        
        this.confirmCancel();
      };

      getPracticeID = (number, classification_id, practice_id) => {
        this.setState({
            selected_second_layer_number:number,
            selected_classification_id:classification_id,
            selected_practice_id: practice_id
        });        
        this.getTreatThirdLayer(classification_id, practice_id);        
      }

      getClassficaitonID = (number,classification_id) => {
          this.setState({              
              selected_first_layer_number:number,
              selected_classification_id:classification_id,

              selected_second_layer_number:0,
              selected_practice_id:null,
            }, () => {
              this.getTreatSecondLayer(classification_id);
          });
      }


    render() {
        let {list_array, list_item, main_master_list} = this.state;
        return (
            <Card>
                <div style={{display:'flex'}}>
                    <div className="title">処置行為マスタ</div>                    
                </div>
                
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">処置分類</div>
                        <div className="tr" onClick={this.addFirstLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="left-area">
                        <div className="tl">行為</div>
                        <div className="tr" onClick={this.addSecondLayer.bind(this)}>
                            <Icon icon={faPlus} />追加
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="tl">請求情報</div>
                        <div className="tr" onClick={this.addThirdLayer.bind(this)}><Icon icon={faPlus} />追加</div>
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr>
                            <th className='td-no'/>
                            <th style={{width:'8rem'}}>分類マスタID</th>
                            <th className="name">処置分類名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.is_first_loaded ? (
                          <>
                            {main_master_list != undefined && main_master_list != null && main_master_list.length>0 && (
                                main_master_list.map((item, index) => {
                                    return(
                                        <>
                                            <tr className={this.state.selected_first_layer_number === item.number?"selected clickable":"clickable"}
                                            onClick={this.getClassficaitonID.bind(this, item.number, item.classification_id)} onContextMenu={e => this.handleClick(e,index, 0)}>
                                                <td className='td-no'>{index+1}</td>
                                                <td style={{width:'8rem'}} className="text-right">{item.classification_id}</td>
                                                <td style={{textAlign:'left'}}>{item.name}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            )}
                        </>
                        ):(
                            <div style={{width:"100%", height: "100%"}}>
                                <SpinnerWrapper>
                                    <Spinner animation="border" variant="secondary" />
                                </SpinnerWrapper>
                            </div>
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
                            <th style={{width:'4rem'}}>行為ID</th>
                            <th className="name">行為名称</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.is_second_loaded ? (
                          <>
                          {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                            list_array.map((item, index) => {
                                return (
                                  <>
                                      <tr className={this.state.selected_second_layer_number === item.number?"selected clickable":"clickable"}
                                          onClick={this.getPracticeID.bind(this,item.number, item.classification_id, item.practice_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                                          <td className='td-no'>{index+1}</td>
                                          <td className='table-check'>
                                              <Checkbox
                                                label=""
                                                value={item.is_enabled}
                                                isDisabled={true}
                                                name="check"
                                              />
                                          </td>
                                          <td style={{width:'4rem'}} className="text-right">{item.practice_id}</td>
                                          <td className="tl">{item.name}</td>
                                      </tr>
                                  </>)
                            })
                          )}
                          </>
                        ):(
                          <div style={{width:"100%", height: "100%"}}>
                              <SpinnerWrapper>
                                  <Spinner animation="border" variant="secondary" />
                              </SpinnerWrapper>
                          </div>
                        )}
                        </tbody>
                    </table>
                </List>
                {this.treat_order_is_enable_request == 0 ? (<></>):(
                    <Wrapper>
                        <table className="table-scroll table table-bordered">
                            <thead>
                            <tr>
                                <th className="td-no"/>
                                <th className="table-check">表示</th>
                                <th style={{width:'10rem'}}>請求情報マスタID</th>
                                <th className="">請求情報名</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.is_third_loaded ? (
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
                                              <td style={{width:'10rem'}} className="text-right">{item.request_id}</td>
                                              <td className="tl">{item.name}</td>
                                          </tr>
                                      </>)
                                })
                              )}
                              </>
                            ):(
                              <div style={{width:"100%", height: "100%"}}>
                                  <SpinnerWrapper>
                                      <Spinner animation="border" variant="secondary" />
                                  </SpinnerWrapper>
                              </div>
                            )}
                            </tbody>
                        </table>
                    </Wrapper>
                )}
                {this.state.isOpenKindModal && (
                    <TreatPracticeMasterModal
                        kind={this.state.kind}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        classification_id = {this.state.selected_classification_id}
                        practice_id ={this.state.selected_practice_id}                        
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

export default Treat_Practice_Master