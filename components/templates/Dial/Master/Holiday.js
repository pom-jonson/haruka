import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import HolidayModal from "../modals/HolidayModal";
import axios from "axios";
import { formatDateSlash } from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "../DialMethods";
import Context from "~/helpers/configureStore";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

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
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        margin-top: 0.625rem;
        text-align: center;
        button {
          text-align: center;
          border-radius: 0.25rem;
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
  font-size: 1rem;
  width: 100%;  
  padding: 1.25rem;
  padding-bottom: 0.5rem;
  padding-left: 0px;
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
        height: 2rem;
        line-height: 2rem;
      }
  }
  .label-title {
    width: 6rem;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 9.375rem;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 6.25rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
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
  margin-bottom: 0.625rem;  
  label {
    text-align: right;
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
  table {
    tr{
      display: table;
    }
    thead{
      display:table;
      width:100%;
      tr{
        width:calc(100% - 18px);
      }
      border-bottom: 1px solid #dee2e6;
    }
    tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 18rem);
        width:100%;
        tr{          
          width: 100%;
        }
        tr:hover{background-color:#e2e2e2 !important;}
    }    
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr.orange-background td {
      background-color: #ffc266 !important;
    }
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
      border-bottom: none;
      border-top: none;
    }
    .table-check {
      width: 3.75rem;
      text-align: center;
      label{
        margin-right: 0px;
        input{
          margin-right: 0px;
        }
      }
    }
    .item-no {
      width: 3rem;
    }
    .week-number{
      width:5rem;
    }
    .name{
      width:12rem;
    }
  }
`;

const display_class = [
  { id: 0, value: "全て" },
  { id: 1, value: "表示のみ" },
  { id: 2, value: "非表示のみ" }
];

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

const ContextMenu = ({ visible, x, y, parent, row_index }) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {$canDoAction(FEATURES.DIAL_HOLIDAY_MASTER,AUTHS.EDIT,0) != false && (
            <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
          )}
          {$canDoAction(FEATURES.DIAL_HOLIDAY_MASTER,AUTHS.DELETE,0) != false && (
            <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class Holiday extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let table_data = [];
    this.state = {
      schVal: "",
      table_data,
      isOpenModal: false,
      modal_data: {},
      search_order: 0, //表示順
      search_class: 1, //表示区分
      isDeleteConfirmModal: false,
      confirm_message:"",
      is_loaded: true
    };
  }

  async UNSAFE_componentWillMount() {
    this.searchList();
  }

  // 検索
  searchList = async () => {
    let path = "/app/api/v2/dial/master/holiday_search";
    let post_data = {
      keyword: this.state.schVal,
      is_enabled: this.state.search_class
    };
    let { data } = await axios.post(path, { params: post_data });
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
      },()=>{
        this.searchList();
      });
    }
  };
  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };

  handleOk = () => {
      this.setState({
          isOpenModal: false,
          is_loaded: true
      },()=>{
        this.searchList();
      });
  };
  createHoliday = () => {
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_HOLIDAY_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        window.sessionStorage.setItem("alert_messages","登録権限がありません。");
        return;
    }
    this.setState({
      isOpenModal: true,
      modal_data: null
    });
  };
  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  getOrderSelect = e => {
    //表示順
    this.setState({ 
      search_order: parseInt(e.target.id),
      is_loaded: true
    }, () => {
      this.searchList();
    });
  };
  getClassSelect = e => {
    //表示区分
    this.setState({ 
      search_class: parseInt(e.target.id),
      is_loaded: true
    }, () => {
      this.searchList();
    });
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
        .getElementById("holiday-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("holiday-table")
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
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.editData(index);
    }
    if (type === "delete") {
      this.setState({selected_number:this.state.table_data[index].number}, ()=> {
        this.delete(this.state.table_data[index].name);
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
  editData = index => {
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      // row_index: index,
      isOpenModal: true
    });
  };
  delete = (name) => {
    this.setState({
      isDeleteConfirmModal : true,
        confirm_message: "「" + name + "」" + " これを削除して良いですか？",
    });
  };

  deleteData = async () => {
    let path = "/app/api/v2/dial/master/holiday_delete";
    let post_data = {
      params: this.state.selected_number,
    };
    await axios.post(path, post_data);
    window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
    this.confirmCancel();
    this.setState({
      is_loaded: true
    },()=>{
      this.searchList();
    });
  };

  getRadio = (number,name,value) => {
    if (name === "check") {
      this.checkStateMaster("dial_holiday_master",number,value).then(()=>{
        this.searchList();
      });
    }
  };

  render() {
    let { table_data } = this.state;
    return (
      <Card>
        <div className="title">祝日マスタ</div>
        <SearchPart>
          <div className="search-box">
            <SearchBar
              placeholder=""
              search={this.search}
              enterPressed={this.enterPressed}
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
              <th className="item-no" />
              <th className="table-check">表示</th>
              <th className="name">祝日名</th>
              <th className="item-no">月</th>
              <th className="item-no">日</th>
              <th className="week-number">第何週</th>
              <th className="week-number">曜日</th>
              <th className="name">施行日</th>
              <th className="">廃止日</th>
            </tr>
            </thead>
            <tbody id="holiday-table">
            {this.state.is_loaded == true ? (
              <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ):(
              <>
              {table_data !== undefined &&
                table_data !== null &&
                table_data.length > 0 &&
                table_data.map((item, index) => {
                  let isNotCompleted =
                    item.month === null ||
                    (item.day === null && item.week === null); // 日付が未確定のものを仮で登録して
                  return (
                    <>
                      <tr
                        onContextMenu={e => this.handleClick(e, index)}
                        className={`${isNotCompleted ? "orange-background" : ""}`}
                      >
                        <td className="item-no text-right">{index + 1}</td>
                        <td className="table-check">
                          <Checkbox
                            label=""
                            getRadio={this.getRadio.bind(this,item.number)}
                            // isDisabled={true}
                            value={item.is_enabled}
                            name="check"
                          />
                        </td>
                        <td className="text-left name">{item.name}</td>
                        <td className="text-left item-no text-right">{item.month}</td>
                        <td className="text-left item-no text-right">{item.day}</td>
                        <td className="text-left week-number text-right">{item.week}</td>
                        <td className="text-left week-number">{item.day_of_week}</td>
                        <td className='name'>{item.start_date == null ? '未設定' : formatDateSlash(item.start_date)}</td>
                        <td className=''>
                          {item.end_date === null
                            ? "無期限"
                            : formatDateSlash(item.end_date)}
                        </td>
                      </tr>
                    </>
                  );
                })}
                {table_data !== undefined &&
                table_data !== null &&
                table_data.length < 1 && (
                  <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                )}
              </>
            )}
            </tbody>
          </table>
        </Wrapper>
        <div className="footer-buttons">
            {this.context.$canDoAction(this.context.FEATURES.DIAL_HOLIDAY_MASTER, this.context.AUTHS.REGISTER) == true || this.context.$canDoAction(this.context.FEATURES.DIAL_HOLIDAY_MASTER, this.context.AUTHS.REGISTER_PROXY) == true ? (
              <>
                <div onClick={this.createHoliday} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>新規作成</span></div>
              </>
            ) : (
              <>
                <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                  <div className={"custom-modal-btn disable-btn"}><span>新規作成</span></div>
                </OverlayTrigger>
              </>
            )}
        </div>
        {this.state.isOpenModal && (
          <HolidayModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
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
      </Card>
    );
  }
}
Holiday.contextType = Context;

export default Holiday;
