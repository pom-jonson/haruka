import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InspectionBookModal from "./Modal/InspectionBookModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
// import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
// import auth from "~/api/auth";


const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
      height: calc(100vh - 16rem);  
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
.table-check {
    width: 60px;
}
.code-number{
    width: 120px;
}
.week{
    width:7rem;
    input{
        width:100%;
    }
}
.label-title{
    font-size:1rem;
}
.footer {
    label {
        text-size: 16px;
        font-size:1rem;
    }
    button {
        text-align: center;
        border-radius: 4px;
        background: rgb(105, 200, 225); 
        border: none;
        margin-right: 30px;
      }
      
      span {
        color: white;
        font-size: 1rem;
        font-weight: 100;
      }
    text-align: center;    
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
`;
const ListTitle = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    height: 2rem;
    float: left;
    // margin-top: 21px;
    font-size: 1rem;
    margin-bottom: 6px;
    span {
        color: blue;
    }
    
    .left-area {
        width: 30%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 68%;
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
    width: 30%;
    margin-right: 2%;    
    float: left;    
    // border: solid 1px lightgrey;
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
  width: 68%;  
  float: left;  
  // border: solid 1px lightgrey;  
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

const ContextMenu = ({visible,x,y,parent,index}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() =>parent.contextMenuAction("edit", index)}>予約枠編集</div></li>
                    {/* <li><div onClick={() => parent.contextMenuAction("delete",index)}>削除</div></li> */}
                </ul>
            </ContextMenuUl>
        );
    } else { return null; }
};
class Exam_Book_Master extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_array:[],
            list_item:[],
            book_table_list:[],
            isOpenBookModal: false,            
            selected_first_kind_number:0, 
            selected_inspection_id:null,
            modal_data:null,                   
            complete_message: "",
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
            is_loading_one:true,
            is_loading_two:true,
        }
    }

    async componentDidMount(){
        // auth.refreshAuth(location.pathname+location.hash);
        this.getInspectionInfo();
    }

    closeModal = () => {
        this.setState({
            isOpenBookModal: false,
            modal_data:null
        });
    };    

    getInspectionInfo = async() => {
        let path = "/app/api/v2/master/inspection/searchBook";
        await apiClient
          ._post(path, {
              params: {}
          })
          .then((res) => {
            if (res.length > 0){
                this.setState({
                    list_array:res,
                    selected_first_kind_number:this.state.selected_first_kind_number>0?this.state.selected_first_kind_number:res[0].number,
                    selected_inspection_id : this.state.selected_inspection_id != null && this.state.selected_inspection_id != ''?this.state.selected_inspection_id:res[0].id,
										is_loading_one: false,
										is_loading_two: true
                }, () => {
                    this.getBookInfo(this.state.selected_inspection_id);
                })
            } else {
                this.setState({
                    list_array:[],
                    list_item:[],
                    selected_first_kind_number:0,
                    selected_inspection_id:null,
										is_loading_one: false,
										is_loading_two: false
                })
            }
          })
          .catch(() => {
						this.setState({
							is_loading_one: false,
							is_loading_two: false
						});
          });
    }
    getBookInfo = async(inspection_id) => {
        let path = "/app/api/v2/master/inspection/getBookTable";
        let post_data = {   
            inspection_id:inspection_id,
        };
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            this.setState({
                list_item:res.by_time,
                book_table_list:res.by_number,
								is_loading_two: false
            });
          })
          .catch(() => {
						this.setState({
							is_loading_two: false
						});
          });
    }

    handleOk = () => {                
        this.getInspectionInfo();
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
    
    contextMenuAction = (act, index) => {
        if( act === "edit") {
            this.editData(index);
        } else if (act === "delete") {            
            var number, name;
            number = this.state.list_array[index].number;
            name = this.state.list_array[index].name;            
            this.setState({
                isDeleteConfirmModal : true,
                selected_number:number,                
                confirm_message:'「' + name +'」　' + "この分類マスタを削除しますか?",
            })
        }
    };

    editData = (index) => {
        this.setState({           
            modal_data:this.state.list_array[index],                
            isOpenBookModal: true,
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
        if (this.state.kind ==1){
            path = "/app/api/v2/master/inspection/deleteInspectionType";
        } else {
            path = "/app/api/v2/master/treat/deletePosition";
        }
        let post_data = {
            params: {number:this.state.selected_number},                                
        };
        await apiClient.post(path,  post_data);
        this.confirmCancel();
        this.setState({selected_first_kind_number:0, selected_inspection_id:null}, () => {
            this.getInspectionInfo();
        })
        
      };

    selectPattern = (pattern_number, selected_inspection_id) => {
        this.setState({selected_first_kind_number:pattern_number, selected_inspection_id:selected_inspection_id, is_loading_two: true},()=>{
					this.getBookInfo(selected_inspection_id);
				});
    }

    edit_max_persons = (number, e) => {        
        var temp = this.state.book_table_list;
        temp[number] = e.target.value;        
        this.setState({book_table_list:temp});
    }

    saveBookTable = async() => {
        let path = "/app/api/v2/master/inspection/updateBookTable";
        const post_data = {
            params: this.state.book_table_list
        };        
        await apiClient.post(path, post_data).then(()=>{            
					this.setState({
						complete_message: ""
					});
					window.sessionStorage.setItem("alert_messages", "予約枠時間帯マスタを変更しました。");
        });
    }

		handleSaveBookTable = () => {
			this.setState({
					isUpdateConfirmModal : true,
					confirm_message: "予約枠時間帯マスタを変更しますか?",
			});
		}
		
		handleRegister = () => {
			this.setState({
				isUpdateConfirmModal:false,
				complete_message: "処理中"
			},()=>{
				this.saveBookTable();
			});
		}

    render() {
        let {list_array, list_item} = this.state;
        return (
            <Card>
                <div className="title">検査予約マスタ</div>                
                <ListTitle>
                    <div className="left-area">
                        <div className="tl">検査種類</div>                        
                    </div>
                    <div className="right-area">
                        <div className="tl">予約枠時間帯マスタ</div>                        
                    </div>
                </ListTitle>
                <List>
                    <table className="table-scroll table table-bordered" id="wordList-table">
                        <thead>
                        <tr className="tr-head">
                            <th className="td-no"/>                            
                            <th className="code-number">検査種類ID</th>
                            <th className="name">検査名称</th>
                        </tr>
                        </thead>
                        <tbody>
												{this.state.is_loading_one == true ? (
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
																						<tr className={this.state.selected_inspection_id === item.id?"selected clickable":"clickable"} 
																						onClick={this.selectPattern.bind(this,item.number, item.id)} onContextMenu={e => this.handleClick(e,index)}>
																								<td className="td-no">{index+1}</td>                                            
																								<td className="code-number" style={{textAlign:"right"}}>{item.id}</td>
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
                            <th className=""/>
                            <th className="week">日</th>
                            <th className="week">月</th>
                            <th className="week">火</th>
                            <th className="week">水</th>
                            <th className="week">木</th>
                            <th className="week">金</th>
                            <th className="week">土</th>
                        </tr>
                        </thead>
                        <tbody>
												{this.state.is_loading_two == true ? (
                          <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        ):(
                          <>
														{list_item !== undefined && list_item !== null && Object.keys(list_item).length > 0 && (
																Object.keys(list_item).map((key) => {
																		return (
																				<>
																						<tr>
																								<td>{key.split(':')[0]+':'+key.split(':')[1]}</td>
																								{list_item[key].map(item => {
																										return(
																												<>
																														<td className="week"><input type="number" value={this.state.book_table_list[item.number]} onChange={this.edit_max_persons.bind(this,item.number)} /></td>
																												</>
																										)
																								})}
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
								<div className="footer-buttons">
									<div onClick={this.handleSaveBookTable} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>予約枠時間帯変更</span></div>                    
								</div>                
                {this.state.isOpenBookModal && (
                    <InspectionBookModal                        
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
                        first_kind_number = {this.state.selected_first_kind_number}
                        inspection_id = {this.state.selected_inspection_id}
                        modal_data = {this.state.modal_data}
                    />
                )}
								{this.state.isUpdateConfirmModal !== false && (
										<SystemConfirmJapanModal
												hideConfirm= {this.confirmCancel.bind(this)}
												confirmCancel= {this.confirmCancel.bind(this)}
												confirmOk= {this.handleRegister}
												confirmTitle= {this.state.confirm_message}
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
								{this.state.complete_message !== '' && (
									<CompleteStatusModal
										message = {this.state.complete_message}
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

export default Exam_Book_Master