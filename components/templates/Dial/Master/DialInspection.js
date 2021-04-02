import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import InspctionModal from "../modals/InspctionModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Context from "~/helpers/configureStore";

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
          font-size: 20px;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 70px;
  padding: 20px;
  float: left;
  .search-box {
      width: 100%;
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
      width: 130px;
  }
  .pullbox-title{
    font-size: 18px;
  }
  .gender {
    font-size: 18px;
    margin-left: 15px;
    .radio-btn label{
        font-size: 18px;
        width: 100px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
    }
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.125rem;
  width: 100%;
  border: solid 1px lightgrey;
  margin-bottom: 5px;  
  label {
      text-align: right;
  }
  table {
    thead{
      display:table;
      width:100%;
    }
    tbody{
        display:block;
        overflow-y: auto;
        height: calc( 100vh - 18rem);
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
          font-size:1rem;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 4rem;
      }
      .item-no {
        width: 3rem;
      }
      .code-number {
          width: 7.5rem;
      }
      .name{
        width:11rem;
      }
      .item-code{
        width: 9rem;
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
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;
const display_order = [    
    { id: 0, value: "コード順", field_name:"code"},
    { id: 1, value: "カナ順", field_name:"name_kana"},
    { id: 2, value: "名称順", field_name:"name"},
];
const display_class = [
  { id: 0, value: "全て" },
  { id: 1, value: "表示のみ" },
  { id: 2, value: "非表示のみ" },    
];

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  {$canDoAction(FEATURES.DIAL_INSPECTION_ITEM_MASTER,AUTHS.EDIT,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                  )}
                  {$canDoAction(FEATURES.DIAL_INSPECTION_ITEM_MASTER,AUTHS.DELETE,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                  )}
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};

const data_type_name = ["数値", "文字"];
class DialInspection extends Component {
    constructor(props) {
        super(props);

       let list_item = [];
        this.state = {
            schVal: "",
            list_item,
            isOpenCodeModal: false,
            exit_result: 0, //「実績あり」の場合、検査結果テーブルにレコードがある検査項目のみ
            modal_data:{},
            sort_order:1,
            display_item:0,

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
        }
    }

    async UNSAFE_componentWillMount(){
      this.searchInspectionItems();
    }

    // 検索
    searchInspectionItems = async () => {
        let path = "/app/api/v2/dial/master/inspection_search";
        let post_data = {
            keyword: this.state.schVal,
            is_enabled: this.state.display_item!=0?this.state.display_item:'',
            order:display_order[this.state.sort_order].field_name,
            exit_result:this.state.exit_result,
            
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({list_item: data});
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.searchInspectionItems();
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };    
    createCode = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_INSPECTION_ITEM_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
          window.sessionStorage.setItem("alert_messages","登録権限がありません。");
          return;
      }
        this.setState({
          isOpenCodeModal: true,
          modal_data:null
        });
    }
    closeModal = () => {
        this.setState({isOpenCodeModal: false})
    }
    
  getSortOrder = e => {
    this.setState({ sort_order: parseInt(e.target.id)}, () => {
      this.searchInspectionItems();
    });
  }

  getDisplayClass = e => {
    this.setState({ display_item: parseInt(e.target.id)}, () => {
      this.searchInspectionItems();
    });
  }
  
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

      confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        });
      }
  
      delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
        });
      }      
  
      editData = (index) => {
        let modal_data = this.state.list_item[index];
        this.setState({
            modal_data,
            // row_index: index,
            isOpenCodeModal: true
        });
      };
  
      deleteData = async () => {
        let path = "/app/api/v2/dial/master/inspection_delete";
        let post_data = {
            params: this.state.selected_number,                    
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.confirmCancel();
        this.searchInspectionItems();
      };
    handleOk = () => {
        this.setState({
            isOpenCodeModal: false
        });
        this.searchInspectionItems();
    };

    setExitResult = (e) => {
        this.setState({ exit_result: parseInt(e.target.value)}, ()=>{
            this.searchInspectionItems();
        })
    };

    render() {
        let {list_item} = this.state;
        return (
            <Card>
                <div className="title">検査項目マスタ</div>
                <SearchPart>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <div className="gender">
                      <RadioButton
                          id="sub"
                          value={1}
                          label="実績あり"
                          name="display_filter"
                          getUsage={this.setExitResult}
                          checked={this.state.exit_result === 1}
                      />
                      <RadioButton
                          id="all"
                          value={0}
                          label="すべて"
                          name="display_filter"
                          getUsage={this.setExitResult}
                          checked={this.state.exit_result === 0}
                      />
                    </div>
                    <SelectorWithLabel
                    options={display_order}
                    title="表示順"
                    getSelect={this.getSortOrder}
                    departmentEditCode={this.state.sort_order}
                    />
                    <SelectorWithLabel
                    options={display_class}
                    title="表示区分"
                    getSelect={this.getDisplayClass}
                    departmentEditCode={this.state.display_item}
                    />
                    </div>
                </SearchPart>
                <Wrapper>
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                            <th className="item-no"></th>
                            <th className="table-check">表示</th>
                            <th className="item-code">検査項目コード</th>
                            <th className="name">検査会社コード</th>
                            <th className="name">検査名称</th>
                            <th className="name">カナ名称</th>
                            <th className="name">略称</th>
                            <th className="code-number">単位</th>
                            <th className="name">正常値範囲(男)</th>
                            <th >正常値範囲(女)</th>
                        </tr>
                        </thead>
                        <tbody id="code-table">
                        {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                            list_item.map((item, index) => {
                                return (
                                <>
                                <tr onContextMenu={e => this.handleClick(e, index)}>
                                    <td className="item-no text-right">{index+1}</td>
                                    <td className=" table-check">
                                    <Checkbox
                                        label=""
                                        // getRadio={this.getRadio.bind(this)}
                                        isDisabled={true}
                                        value={item.is_enabled ===1}
                                        name="check"
                                    /> 
                                    </td>
                                    <td className="text-right item-code">{item.code}</td>
                                    <td className="text-right name">{item.company_examination_code}</td>
                                    <td className="text-left name">{item.name}</td>
                                    <td className="text-left name">{item.name_kana}</td>
                                    <td className="text-left name">{item.name_short}</td>
                                    <td className="text-left code-number">{item.unit}</td>
                                    <td className="text-right name">{item.reference_value_male_min} ~ {item.reference_value_male_max}</td>
                                    <td className="text-right">{item.reference_value_female_min} ~ {item.reference_value_female_max}</td>
                                </tr>
                                </>)
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                    {/* <Button className={this.state.curFocus === 1?"focus": ""}>帳票プレビュー</Button> */}
                    <Button className="red-btn" onClick={this.createCode}>新規作成</Button>
                </div>
                {this.state.isOpenCodeModal && (
                    <InspctionModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        data_type_name = {data_type_name}
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
DialInspection.contextType = Context;

export default DialInspection