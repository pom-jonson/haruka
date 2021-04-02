import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import DepartmentOccupationModal from "./DepartmentOccupationModal";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import auth from "~/api/auth";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
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
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
    .footer {
        margin-top: 10px;
        text-align: center;
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
    }
    table {
        margin-bottom:0;
        tr{
            display: table;
            width: 100%;
            box-sizing: border-box;
        }
        thead{
          display: table;
          width:100%;
          border-bottom: 1px solid #dee2e6;
          tr{
            width:calc(100% - 18px);
          }
        }
        tbody{
          height: calc(100vh - 18rem);  
          overflow-y:scroll;
          display:block;
          tr:hover{background-color:#e2e2e2 !important;}        
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        td {
            padding: 0.25rem;
            text-align: center;
        }
        th {
            text-align: center;
            padding: 0.3rem;
            border-bottom: none;
            border-top: none;
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
        text-align: center;
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
    .name{
        width:20rem;
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 70px;
  padding: 20px;
  padding-left: 0px;
  padding-bottom: 0.5rem;
  float: left;
  .search-box {
      width: 100%;
      display: flex;
      div{
        height: 2rem;
        line-height: 2rem;
      }
      .pullbox-select{
        height: 2rem;
      }
      input{
        width: 20rem;
        height: 2rem;
        font-size: 1rem;
        padding: 0.3rem;
        padding-left: 3rem;        
      }
      svg{
        font-size: 1rem;
        top: 0.5rem;
        left: 0.5rem;
      }
      .pullbox-title{
        margin-top: 0.1rem;
      }
  }
  .label-title {
    width: 95px;
    font-size:1rem;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-select {
      font-size: 1rem;
      width: 150px;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 15px;
    .radio-btn label{
        width: 100px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
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
  float: left;
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
  margin-bottom: 10px;
  label {
      text-align: right;
  }
  .text-center .gHLxSm {
    margin: 0;
  }

 `;

const display_class = [
    { id: 0, value: "全て"},
    { id: 1, value: "表示のみ"},
    { id: 2, value: "非表示のみ"},
];

const display_order = [
    { id: 0, value: "カナ順", field_name:'name_kana'},
    { id: 1, value: "登録順", field_name:'id'},
];

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
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0 0px;
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

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType, selected_is_enabled}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    {selected_is_enabled == 1 && (<li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>)}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

const medicine_type_name = ["すべて", "インスリン" ];

class DepartmentOccupation extends Component {
    constructor(props) {
        super(props);
        let table_data = [];
        this.state = {
            schVal: "",
            table_data,
            isOpenCodeModal: false,
            category: "",
            modal_data:null,
            search_order: 0,        //表示順
            search_class: 1,        //表示区分

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
            is_loaded: true
        }
        
    }

    componentDidMount() {
        if(!this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.READ)) {
            this.props.history.replace("/");
        }
        auth.refreshAuth(location.pathname+location.hash);
        this.getSearchResult();
    }

    // 検索
    getSearchResult = async () => {
        let path = "/app/api/v2/dial/department_occupation/search";
        let post_data = {
            keyword: this.state.schVal,
            category: this.state.category,
            is_enabled: this.state.search_class,            
            table_kind: 7,
            order:display_order[this.state.search_order].field_name
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({
          table_data: data,
          is_loaded: false
        });
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.setState({
            is_loaded: true
          }, ()=> {            
            this.getSearchResult();
          });
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    handleOk = (result) => {
        let str_msg = result == "update"? "変更完了##変更しました。": result == "register" ? "登録完了##登録しました。":"";
        window.sessionStorage.setItem("alert_messages", str_msg);
        this.setState({
          is_loaded: true,
          isOpenCodeModal: false
        }, ()=> {            
          this.getSearchResult();
        });         
    };
    createCode = () => {
        this.setState({
            isOpenCodeModal: true,
            modal_data:null
        });
    };
    closeModal = () => {
        this.setState({isOpenCodeModal: false})
    };
    getOrderSelect = e => {                 //表示順
        this.setState({ 
          search_order: parseInt(e.target.id),
          is_loaded: true
        }, () => {
            this.getSearchResult();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ 
          search_class: parseInt(e.target.id),
          is_loaded: true
        }, () => {
            this.getSearchResult();
        });
    };

    handleClick = (e, index, is_enabled) => {
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
                    y: e.clientY + window.pageYOffset, 
                    selected_is_enabled:is_enabled,
                },
                favouriteMenuType: index
            });
        }
    };

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editData(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.state.table_data[index].id}, () => {
                this.delete();
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

    delete = () => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "部門・職種情報を削除しますか?",
        });
    }

    editData = (index) => {
        let modal_data = this.state.table_data[index];
        this.setState({
            modal_data,
            isOpenCodeModal: true
        });
    };
    deleteData = async () => {
        let path = "/app/api/v2/dial/department_occupation/delete";
        let post_data = {
            number: this.state.selected_number,
        };
        await axios.post(path,  post_data).then(() => {
            window.sessionStorage.setItem("alert_messages", '削除完了##削除しました。');
        });

        this.setState({
          is_loaded: true
        }, ()=> {
          this.confirmCancel();
          this.getSearchResult();
        });
    };

    render() {
        let {table_data} = this.state;
        return (
            <Card>
                <div className="title">部門・職種</div>
                <SearchPart>
                    <div className="search-box">
                        <SearchBar
                            placeholder=""
                            search={this.search}
                            enterPressed={this.enterPressed}
                        />
                        <SelectorWithLabel
                            options={display_order}
                            title="表示順"
                            getSelect={this.getOrderSelect}
                            departmentEditCode={display_order[this.state.search_order].id}
                        />
                        <SelectorWithLabel
                            options={display_class}
                            title="表示区分"
                            getSelect={this.getClassSelect}
                            departmentEditCode={display_class[this.state.search_class].id}
                        />
                    </div>
                </SearchPart>
                <Wrapper>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="td-no"/>
                                <th className="table-check">表示</th>
                                <th className="name">名称</th>
                                <th className="name_kana">カナ名称</th>
                            </tr>
                        </thead>
                        <tbody id="code-table">
                        {this.state.is_loaded == true ? (
                          <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        ):(
                          <>
                            {table_data !== undefined &&
                            table_data !== null &&
                            table_data.length < 1 && (
                              <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                            )}
                            {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                                table_data.map((item, index) => {
                                    return (
                                        <>
                                            <tr onContextMenu={e => this.handleClick(e, index, item.is_enabled)}>
                                                <td className="td-no text-right">{index+1}</td>
                                                <td className="table-check text-center">
                                                    <Checkbox
                                                        label=""
                                                        // getRadio={this.getRadio.bind(this)}
                                                        isDisabled={true}
                                                        value={item.is_enabled}
                                                        name="check"
                                                    />
                                                </td>
                                                <td className='name text-left'>{item.name}</td>
                                                <td className='text-left'>{item.name_kana}</td>
                                            </tr>
                                        </>)
                                })
                            )}
                          </>
                        )}
                        </tbody>
                        
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                    <div onClick={this.createCode} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>新規作成</span></div>                    
                </div>
                {this.state.isOpenCodeModal && (
                    <DepartmentOccupationModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        medicine_type_name = {medicine_type_name}
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
                    favouriteMenuType={this.state.favouriteMenuType}
                />
            </Card>
        )
    }
}

DepartmentOccupation.contextType = Context;

DepartmentOccupation.propTypes = {
    history: PropTypes.object
};

export default DepartmentOccupation