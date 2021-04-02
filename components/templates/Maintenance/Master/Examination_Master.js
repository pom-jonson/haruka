import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import ExamOrderModal from "./Modal/ExamOrderModal";
import axios from "axios";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import auth from "~/api/auth";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 70px;
  padding: 20px;
  float: left;
  .list-title {
    margin-top: 20px;
    font-size: 18px;
    width: 20%;
  }
  .search-box {
      width: 80%;
      display: flex;
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-title{font-size:18px;}
  .pullbox-select {
      font-size: 18px;
      width: 150px;
  }
 `;

 const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  float: left;
  border: solid 1px lightgrey;
  height: calc(100vh - 15rem);
  margin-bottom: 10px;  
  width:100%;
  .notice{
    margin-left: 15px;
    margin-top: 15px;
    font-size: 20px;
  }
  label {
      text-align: right;
  }
  table {  
    margin-bottom:0;        
      thead{
        margin-bottom: 0;
        display:table;
        width:100%;        
        tr{
          width: calc(100% - 18px);
        }
      }
      tbody{
        height: calc(100vh - 18rem);
        overflow-y:auto;
        display:block;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2;}
      }
      tr{
        display: table;
        width: 100%;
        box-sizing: border-box;
      }
      td {
        font-size:1rem;
        padding: 0.25rem;
      }
      th {
        font-size:1.25rem;          
        text-align: center;
        padding: 0.3rem;
      }
      .table-check {
          width: 4rem;
          label {
            margin:0;
            input {margin: 0;}
          }
      }
      .item-no {
        width: 4rem;
      }
      .code-number{
          width:10rem;
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
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0 20px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

// const display_order = [
//     { id: 0, value: "" },
//      { id: 1, value: "コード番号", field_name:"code"},
//      { id: 2, value: "名称", field_name:"name"},
//  ];
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ" },
    { id: 2, value: "非表示のみ" },
  ];

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class Examination_Master extends Component {
    constructor(props) {
        super(props);              
        this.state = {
            schVal: "",
            table_data: [],
            isOpenModal: false,            
            modal_data: {},
            search_order: 0,        //表示順
            search_class: 1,        //表示区分
            type: "",
            is_loaded: true,

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,            
            confirm_message:"",
            init_status:true,
        }
    }

    componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
    }
    // 検索
    getSearchResult = async () => {        
        let path = "/app/api/v2/master/examination/searchExamOrder";
        let post_data = {
            keyword: this.state.schVal,
            is_enabled: this.state.search_class,            
            // order:display_order[this.state.search_order].field_name,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({init_status:false, table_data: data, is_loaded:true});
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.setState({is_loaded:false}, () => {
                this.getSearchResult();
            })
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    // getOrderSelect = e => {                 //表示順
    //     this.setState({ search_order: parseInt(e.target.id) }, () => {
    //         this.getSearchResult();
    //     });
    // };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id) }, () => {
            this.getSearchResult();
        });
    };

    // モーダル
    openModal = () => {
        this.setState({
            modal_data: null,            
            isOpenModal: true,
        });
    };
    closeModal = () => {
        this.setState({isOpenModal: false});        
    };
    handleOk = () => {
        this.getSearchResult().then(() => {
            this.setState({
                isOpenModal: false
            });
        });
    };
    updateData = (index) => {
        let modal_data = this.state.table_data[index];
        this.setState({
            modal_data,            
            isOpenModal: true
        });
    };
    

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.updateData(index);
        }
        if (type === "delete"){
            this.setState({
                selected_number:this.state.table_data[index].number,
                isDeleteConfirmModal : true,
                confirm_message: "「" + this.state.table_data[index].name + "」" + " これを削除して良いですか？",
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
    
    deleteData = async () => {
        let path = "/app/api/v2/master/examination/deleteExamOrder";
        let post_data = {
            params:{
                number: this.state.selected_number,                
            }
        };
        await axios.post(path,  post_data);
        this.confirmCancel();
        this.getSearchResult();
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
    };

    render() {
        let {table_data} = this.state;        
        return (
            <>
            <Card>
                <div className="title">検体検査マスタ</div>
                <SearchPart>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    {/* <SelectorWithLabel
                    options={display_order}
                    title="表示順"
                    getSelect={this.getOrderSelect}
                    departmentEditCode={display_order[this.state.search_order].id}
                    /> */}
                    <SelectorWithLabel
                    options={display_class}
                    title="表示区分"
                    getSelect={this.getClassSelect}
                    departmentEditCode={display_class[this.state.search_class].id}
                    />
                    </div>
                </SearchPart>                
                <Wrapper>
                    {this.state.init_status && (
                        <div className="notice">検索条件を指定してください</div>
                    )}
                    {this.state.init_status === false  && (
                        <>
                        <table className="table table-bordered table-hover" id="code-table">
                            <thead>
                                <tr>
                                    <th className="item-no"/>
                                    <th className="table-check">表示</th>
                                    <th className="code-number">外注検査項目ID</th>
                                    <th >外注検査項目名</th>
                                    <th style={{width:'20rem'}}>ボタンでの表示名</th>                            
                                </tr>
                            </thead>
                            <tbody>
                            {table_data !== undefined && table_data !== null && table_data.length > 0 && this.state.is_loaded && (
                                    table_data.map((item, index) => {
                                        return (
                                        <>
                                        <tr onContextMenu={e => this.handleClick(e, index)}>
                                            <td className="item-no text-right">{index+1}</td>
                                            <td className="table-check text-center">
                                            <Checkbox
                                                label=""
                                                // getRadio={this.getRadio.bind(this)}
                                                isDisabled={true}
                                                value={item.is_enabled}                                        
                                                name="check"
                                            /> 
                                            </td>
                                            <td className="code-number text-right">{item.code}</td>
                                            <td>{item.name}</td>
                                            <td style={{width:'20rem'}}>{item.label}</td>                                    
                                        </tr>
                                        </>)
                                    })
                                )}
                            </tbody>                                
                            </table>
                        </>
                    )}
                    <ContextMenu
                        {...this.state.contextMenu}
                        parent={this}
                        favouriteMenuType={this.state.favouriteMenuType}
                    />
                    {this.state.is_loaded !==true && (
                        <>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                        </>
                    )}
                </Wrapper>

                <div className="footer-buttons">
                  <Button onClick={this.openModal} className={"red-btn"}>新規作成</Button>
                </div>
                
                {this.state.isOpenModal && (
                    <ExamOrderModal
                        modal_data={this.state.modal_data}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
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
            </Card>
            </>
        )
    }
}

export default Examination_Master