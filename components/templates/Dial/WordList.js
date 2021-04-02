import React, { Component, useContext } from "react";
import Context from "~/helpers/configureStore";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import WordPatternModal from "./Board/molecules/WordPatternModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
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
  .title-header{
      .label-title{
          text-align:right;
          margin-right:10px;
          font-size: 17px;
          margin-left:150px;
      }
      .pullbox-label, .pullbox-select{
          width:150px;
      }
      .pullbox{
          padding-top:10px;
      }
  }
  padding: 20px;
    .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
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
      height: calc(100vh - 250px);
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
        word-break: break-all;
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
  text-align:center;
  width: 60px;
  label {
    margin: 0;
  }
}
.td-no {
  width: 25px;
}
.code-number{
    width:100px;
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
    font-size: 1rem;
    width: 100%;
    height: 25px;
    float: left;
    margin-top: 21px;
    margin-bottom: 6px;
    span {
        color: blue;
    }
    
    .left-area {
        width: 42%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        position:relative;
        .label-title{
            text-align:right;
            margin-right:10px;
            font-size: 15px;
            width:70px;
            line-height: 30px;
        }
        .pullbox-label, .pullbox-select{
            width:9rem;
            height:30px;
        }
        .pullbox{
            margin-top:-4px;
        }
        font-size:1rem;
    }
    .right-area {
        width: 56%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        position:relative;
        .label-title{
            text-align:right;
            margin-right:10px;
            font-size: 1rem;
            width:70px;
            line-height: 30px;
        }
        .pullbox-label, .pullbox-select{
            width:9rem;
            height:30px;
        }
        .pullbox{
            margin-top:-4px;
        }
        font-size:1rem;
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
        cursor: pointer;
        padding: 0;
        position:absolute;
        right:0px;
    }
`;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 0.9rem;
    width: 43%;
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
  font-size: 0.9rem;
  width: 55%;
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
        border-radius: 0.25rem;
        box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
        list-style-type: none;
        margin: 0;
        outline: none;
        padding: 0;
        position: absolute;
        text-align: left;
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
        padding: 0 0rem;
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

const display_order = [
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "カナ順", field_name:"name_kana"},
  { id: 2, value: "名称順", field_name:"name"},
];
const display_word_order = [
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "カナ順", field_name:"word_kana"},
  { id: 2, value: "名称順", field_name:"word"},
];
const display_class = [
  { id: 0, value: "全て" },
  { id: 1, value: "表示のみ" },
  { id: 2, value: "非表示のみ" },
];
const ContextMenu = ({visible,x,y,parent,index, kind}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {$canDoAction(FEATURES.DIAL_WORD_MASTER,AUTHS.EDIT,0) != false && (
            <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>変更</div></li>
          )}
          {$canDoAction(FEATURES.DIAL_WORD_MASTER,AUTHS.DELETE,0) != false && (
            <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>削除</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
class WordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_array:[],
      list_item:[],
      isOpenPatternModal: false,
      isWordModal:false,
      selected_pattern_number:0,
      modal_data:null,
      hide_uncheck:1,
      search_order: 1,        //表示順
      search_order_word:1,    //表示順
      search_class: 1,        //表示区分
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      is_loaded_pattern:false,
      is_loaded_word:true,
    }
  }
  
  async UNSAFE_componentWillMount(){
    await this.getWordPattern();
  }
  
  createPattern = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_WORD_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
      window.sessionStorage.setItem("alert_messages","登録権限がありません。");
      return;
    }
    this.setState({
      isOpenPatternModal: true,
      selected_pattern_number:0,
      modal_data:null
    });
  };
  closeModal = () => {
    this.setState({
      isOpenPatternModal: false,
      isWordModal: false,
      modal_data:null
    });
  };
  addWord = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_WORD_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
      window.sessionStorage.setItem("alert_messages","登録権限がありません。");
      return;
    }
    this.setState({
      isWordModal: true,
      modal_data:null,
    });
  };
  
  getWordPattern = async() => {
    if(this.state.is_loaded_pattern){
      this.setState({is_loaded_pattern:false});
    }
    let path = "/app/api/v2/dial/board/searchWordPattern";
    await apiClient
      ._post(path, {
        params: {is_enabled:this.state.hide_uncheck, order:display_order[this.state.search_order].field_name}
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            list_array:res,
            selected_pattern_number:this.state.selected_pattern_number>0?this.state.selected_pattern_number:res[0].number,
            is_loaded_pattern:true,
            is_loaded_word:false,
          }, () => {
            this.getWordsFromPattern(this.state.selected_pattern_number);
          })
        } else {
          this.setState({
            list_array:[],
            list_item:[],
            selected_pattern_number:0,
            is_loaded_pattern:true,
          })
        }
      })
      .catch(() => {
      
      });
  }
  
  getWordsFromPattern = async(pattern_number) => {
    if(this.state.is_loaded_word){
      this.setState({
        is_loaded_word:false,
      })
    }
    let path = "/app/api/v2/dial/board/searchWords";
    let post_data = {
      pattern_number:pattern_number,
      is_enabled:this.state.search_class,
      order : display_word_order[this.state.search_order_word].field_name,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          list_item:res,
          selected_pattern_number:pattern_number,
          is_loaded_word:true,
        });
      })
      .catch(() => {
      
      });
  }
  
  handleOk = () => {
    this.getWordPattern();
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
      document
        .getElementById("word-table-2")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("word-table-2")
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
  
  getRadio = (name, value) => {
    if (name =='check') {
      this.setState({
        hide_uncheck:value,
      }, () => {
        this.getWordPattern();
      })
    }
  }
  
  getOrderSelect = e => {                 //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getWordPattern();
    });
  };
  
  getOrderWordSelect = e => {                 //表示順
    this.setState({ search_order_word: parseInt(e.target.id) }, () => {
      this.getWordsFromPattern(this.state.selected_pattern_number);
    });
  };
  
  getClassSelect = e => {                 //表示区分
    this.setState({ search_class: parseInt(e.target.id) }, () => {
      this.getWordsFromPattern(this.state.selected_pattern_number);
    });
  };
  
  contextMenuAction = (act, index, kind) => {
    if( act === "edit") {
      this.editData(index, kind);
    } else if (act === "delete") {
      let number;
      if (kind == 1){
        number = this.state.list_array[index].number;
      } else {
        number = this.state.list_item[index].number;
      }
      this.setState({
        isDeleteConfirmModal : true,
        confirm_message: "単語を削除しますか?",
        selected_number:number,
        kind:kind,
      });
    }
  };
  
  editData = (index, kind) => {
    if (kind ===1){
      this.setState({
        modal_data:this.state.list_array[index],
        isOpenPatternModal: true,
        isWordModal : false,
      });
    } else {
      this.setState({
        modal_data:this.state.list_item[index],
        isOpenPatternModal: false,
        isWordModal : true,
      });
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
    let path = "/app/api/v2/dial/board/word_delete";
    let post_data = {
      params: {number:this.state.selected_number, kind:this.state.kind},
    };
    await apiClient.post(path,  post_data);
    window.sessionStorage.setItem("alert_messages", '削除完了##削除しました。');
    this.confirmCancel();
    this.getWordPattern();
  };
  
  selectPattern = (pattern_number) => {
    this.setState({selected_pattern_number:pattern_number});
    this.getWordsFromPattern(pattern_number);
  }
  
  render() {
    let {list_array, list_item} = this.state;
    return (
      <Card>
        <div className="title-header" style={{display:'flex'}}>
          <div className="title">単語設定</div>
        </div>
        <ListTitle>
          <div className="left-area">
            <div className="tl" style = {{marginRight:"20px"}}>単語パターン</div>
            <SelectorWithLabel
              options={display_order}
              title="表示順"
              getSelect={this.getOrderSelect}
              departmentEditCode={this.state.search_order}
            />
            <div className="tr" onClick={this.createPattern}>
              <Icon icon={faPlus} />単語パターンを追加
            </div>
          </div>
          <div className="right-area">
            <div className="tl" style = {{marginRight:"20px"}}>単語一覧</div>
            <SelectorWithLabel
              options={display_class}
              title="表示区分"
              getSelect={this.getClassSelect}
              departmentEditCode={display_class[this.state.search_class].id}
            />
            <SelectorWithLabel
              options={display_word_order}
              title="表示順"
              getSelect={this.getOrderWordSelect}
              departmentEditCode={this.state.search_order_word}
            />
            <div className="tr" onClick={this.addWord}><Icon icon={faPlus} />単語を追加</div>
          </div>
        </ListTitle>
        <List>
          <table className="table-scroll table table-bordered">
            <thead>
            <tr>
              <th className='td-no'/>
              <th className="table-check">表示</th>
              <th className="name" style={{width:'10rem'}}>パターン名称</th>
              <th className="name_kana">カナ名称</th>
            </tr>
            </thead>
            <tbody id="wordList-table">
            {this.state.is_loaded_pattern !== true ? (
              <>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </>
            ):(
              <>
                {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                  list_array.map((item, index) => {
                    return (
                      <>
                        <tr className={this.state.selected_pattern_number === item.number?"selected clickable":"clickable"} onClick={this.selectPattern.bind(this,item.number)} onContextMenu={e => this.handleClick(e,index, 1)}>
                          <td className='td-no text-right'>{index+1}</td>
                          <td className='table-check'>
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="tl" style={{width:'10rem'}}>{item.name}</td>
                          <td className="tl">{item.name_kana}</td>
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
            <tr>
              <th className="td-no text-right"/>
              <th className="table-check">表示</th>
              <th className="name text-left" style={{width:'20rem'}}>単語</th>
              <th className={`text-left`}>カナ名称</th>
            </tr>
            </thead>
            <tbody id = 'word-table-2'>
            {this.state.is_loaded_word !== true ? (
              <>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </>
            ):(
              <>
                {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                  list_item.map((item, index) => {
                    return (
                      <>
                        <tr onContextMenu={e => this.handleClick(e,index, 0)}>
                          <td className='td-no'>{index+1}</td>
                          <td className='table-check'>
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="tl" style={{width:'20rem'}}>{item.word}</td>
                          <td className="tl">{item.name_kana}</td>
                        </tr>
                      </>)
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </Wrapper>
        <div className="footer text-left">
          <Checkbox
            label="非表示を隠す"
            getRadio={this.getRadio.bind(this)}
            value={this.state.hide_uncheck}
            name="check"
          />
        </div>
        {this.state.isOpenPatternModal && (
          <WordPatternModal
            isPatternModal={this.state.isOpenPatternModal}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            pattern_number = {this.state.selected_pattern_number}
            modal_data = {this.state.modal_data}
          />
        )}
        {this.state.isWordModal && (
          <WordPatternModal
            isPatternModal={this.state.isOpenPatternModal}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            pattern_number = {this.state.selected_pattern_number}
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
WordList.contextType = Context;

export default WordList