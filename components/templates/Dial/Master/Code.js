import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import CodeModal from "../modals/CodeModal";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialMasterPrintPreview from "~/components/templates/Dial/Master/DialMasterPrintPreview";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;  
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        margin-top: 0.625rem;
        text-align: center;
        button {
          text-align: center;
          border-radius: 0.5rem;
          background: rgb(105, 200, 225); 
          border: none;
          margin-right: 1.875rem;
        }
        
        span {
          color: white;
          font-size: 1.25rem;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.125rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  .list-title {
    margin-top: 1.25rem;
    font-size: 1.125rem;
    width: 20%;
  }
  .search-box {
      width: 80%;
      display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
    .pullbox-title{font-size:1.125rem;}
  .pullbox-select {
      font-size: 1.125rem;
      width: 12.5rem;
  }
 `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.125rem;
  width: 18%;
  margin-right: 2%;
  height: calc( 100vh - 15.625rem);  
  padding: 2px;
  float: left;
  overflow-y: scroll;
  border: solid 1px lightgrey;
  .table-row {
    font-size: 1.125rem;
    margin 0.3rem 0;    
    cursor:pointer;
  }
  .focused{
    background:lightblue;
  }

 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.125rem;
  width: 80%;  
  overflow-y: hidden;  
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  label {
      text-align: right;
  }
  table {
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: calc( 100vh - 16rem);
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .table-check {
        width: 3.75rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
        width: 7.5rem;
    }
    .name{
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
    border-radius: 0.5rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;
const sort_order = [    
    { id: 0, value: "表示順", field_name:"sort_number"},
    { id: 1, value: "コード順", field_name:"code"},
    { id: 2, value: "カナ順", field_name:"name_kana"},
    { id: 3, value: "名称順", field_name:"name"},
];
  const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ"},
    { id: 2, value: "非表示のみ"},
];

const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  {$canDoAction(FEATURES.DIAL_CODE_MASTER,AUTHS.EDIT,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                  )}
                  {$canDoAction(FEATURES.DIAL_CODE_MASTER,AUTHS.DELETE,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                  )}
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};


class Code extends Component {
    constructor(props) {
        super(props);
        let list_category = [];
        let list_item =[];
        this.state = {
            schVal: "",
            list_category,
            list_item,
            category:'',
            search_order: 2,        //表示順
            search_class: 1,        //表示区分
            isOpenCodeModal: false, 
            isLoaded: false, 
            modal_data:null,

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isOpenPreviewModal: false,
            confirm_message:"",
        };
        this.table_head={};
        this.table_head['code'] = "コード番号";
        this.table_head['name'] = "名称";
        this.table_head['name_short'] = "略称";
        this.table_head['name_kana'] = "カナ名称";
        this.table_head_style={};
        this.table_head_style['code'] = "right";
        this.table_head_style['name'] = "left";
        this.table_head_style['name_short'] = "left";
        this.table_head_style['name_kana'] = "left";
    }

    async UNSAFE_componentWillMount(){
      this.getAllCategory();      
    }

    getAllCategory = async () => {
      let path = "/app/api/v2/dial/master/get_code_category";
      let post_data = {          
      };
      let { data } = await axios.post(path, {params: post_data});
      this.setState({list_category: data});
      this.setState({category:data[0].category}, () =>{
        this.getCodeFromCategory(data[0].category);
      });
      
  };
  getCodeFromCategory = async(category) => {
    let path = "/app/api/v2/dial/master/get_code_from_category";
    let post_data = {   
      category:category,
      is_enabled: this.state.search_class,
      order: sort_order[this.state.search_order].field_name,  
      keyword:this.state.schVal,
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      list_item:data,
      category:category,
      isLoaded: true
    })
  }
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.setState({
            isLoaded: false
          },()=>{
            this.getCodeFromCategory(this.state.category);
          });
        }
    };

    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    getOrderSelect = e => {                 //表示順
      this.setState({ 
        search_order: parseInt(e.target.id),
        isLoaded: false
      }, () => {
          this.getCodeFromCategory(this.state.category);
      });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ 
          search_class: parseInt(e.target.id),
          isLoaded: false
        }, () => {
            this.getCodeFromCategory(this.state.category);
        });
    };

    createCode = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_CODE_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
      }
        this.setState({
          isOpenCodeModal: true,
          modal_data:null,
        });
    }
    closeModal = () => {
        this.setState({isOpenCodeModal: false})
    }

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };
   
    handleClick = (e, index) => {
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
            row_index: index
          });
        }
      }
    
      contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editData(index);
        }
        if (type === "delete"){
          this.setState({selected_number:this.state.list_item[index].number}, () => {
            this.delete(this.state.list_item[index].name);
          })
        }
      };
  
      confirmCancel=()=> {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isOpenPreviewModal: false,
            confirm_message: "",
        });
      }
  
      delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
        });
      }      
  
      deleteData = async () => {
        let path = "/app/api/v2/dial/master/code_delete";
        let post_data = {
            params: this.state.selected_number,                    
        };
        await axios.post(path,  post_data);
        this.confirmCancel();
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.setState({
          isLoaded: false
        },()=>{
          this.getCodeFromCategory(this.state.category);
        });
      };

      editData = (index) => {
        let modal_data = this.state.list_item[index];        
        this.setState({
            modal_data,
            // row_index: index,
            isOpenCodeModal: true
        });
      };

      handleOk = () => {
        this.setState({
          isLoaded: false
        },()=>{          
          this.getCodeFromCategory(this.state.category).then(() => {
              this.setState({
                isOpenCodeModal: false
              });
          });
        });
      };

    openPreviewModal=()=>{
        this.setState({isOpenPreviewModal:true});
    };

    handleCodeFromCategory = (_category) => {
      this.setState({
        isLoaded: false
      },()=>{
        this.getCodeFromCategory(_category);
      });
    }

    render() {
        let {list_category, list_item} = this.state;
        return (
            <Card>
                <div className="title">コード設定</div>
                <SearchPart>
                    <div className="list-title">コード一覧</div>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <SelectorWithLabel
                        options={sort_order}
                        title="表示順"
                        getSelect={this.getOrderSelect}
                        departmentEditCode={sort_order[this.state.search_order].id}
                    />
                    <SelectorWithLabel
                        options={display_class}
                        title="表示区分"
                        getSelect={this.getClassSelect}
                        departmentEditCode={display_class[this.state.search_class].id}
                    />
                    </div>
                </SearchPart>
                <List>
                {list_category !== undefined && list_category !== null && list_category.length > 0 && (
                  list_category.map(item => {
                    if (item.category != '定期検査'){
                      return (
                        <>
                        <div className={this.state.category===item.category?"focused table-row":"table-row"} onClick = {this.handleCodeFromCategory.bind(this, item.category)}>{item.category}</div>
                        </>
                      )
                    }                    
                  })
                )}
                </List>
                <Wrapper>
                    <table className="table-scroll table table-bordered">
                        <thead>
                          <tr>
                            <th className="item-no text-right"/>
                            <th className="table-check">表示</th>
                            <th className="code-number">コード番号</th>
                            <th className="name">名称</th>
                            <th className="name">略称</th>
                            <th>カナ名称</th>
                          </tr>
                        </thead>                        
                        <tbody id="code-table">
                        {this.state.isLoaded == false ? (
                          <div className='spinner-disease-loading center'>
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
                                        <td className="name">{item.name}</td>
                                        <td className="name">{item.name_short}</td>
                                        <td>{item.name_kana}</td>
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
                    <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button> 
                    <Button className="red-btn" onClick={this.createCode}>新規作成</Button>
                </div>
                {this.state.isOpenCodeModal && (
                    <CodeModal
                        handleOk={this.handleOk}
                        category = {this.state.category}
                        closeModal={this.closeModal}
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
                row_index={this.state.row_index}
                />
                {this.state.isOpenPreviewModal && (
                    <DialMasterPrintPreview
                        closeModal={this.confirmCancel.bind(this)}
                        modal_title={this.state.category}
                        modal_type={"code"}
                        table_head={this.table_head}
                        table_head_style={this.table_head_style}
                        table_body={this.state.list_item}
                        sort_order = {sort_order[this.state.search_order].value}
                        search_class = {display_class[this.state.search_class].value}
                        keyword = {this.state.schVal}
                    />
                )}
            </Card>
        )
    }
}
Code.contextType = Context;

export default Code