import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InspectionModal from "./Modal/InspectionModal";
import axios from "axios";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
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
  padding: 20px;  
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
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
    .footer {
      display: flex;
      justify-content: flex-end;
      clear: both;        
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
      height: 100%;
      thead{
        width: 100%;
        display: table;
        border-bottom: 1px solid #dee2e6;
        tr{
          width:calc(100% - 17px);
        }
      }
      tbody{
        height: calc(100vh - 18.3rem);
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
          height: 2rem;
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
        width: 4rem;
        text-align: center;
        label{
          margin-right: 0px;
          input{
            margin-right: 0px;
          }
        }
    }
    .td-no {
      width: 2rem;
    }
    .code-number{
        width:10rem;
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 60px;
  padding: 20px;
  padding-left: 0px;
  float: left;
  .list-title {
    margin-top: 10px;
    font-size: 1rem;
    width: 20rem;
  }
  .search-box-area {
      width: calc(100% - 20rem);    
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
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 150px;
  }
 `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 19rem;
  margin-right: 1rem;
  height: calc( 100vh - 16rem);
  overflow-y:scroll;
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .table-row {
    cursor: pointer;
    font-size: 1rem;
    margin: 0;
    padding: 5px 15px;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
  }
 `;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: calc(100% - 20rem);
  float: left;  
  margin-bottom: 10px;
  label {
      text-align: right;
  }
 `;

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
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

const display_order = [
  // { id: 0, value: "" },
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "コード順", field_name:"code"},
];
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

class Inspection_Haruka extends Component {
  constructor(props) {
    super(props);
    let list_array = [
      {0 : "検査目的"},
      {1: "現症"},
      {2: "依頼区分"},
      {3: "患者移動形態"},
      {4: "冠危険因子"},
      {5: "現病歴"},
    ];
    this.state = {
      schVal: "",
      list_array,
      table_data: [],
      isOpenModal: false,
      selected_index: 0,
      list_index: 0,
      modal_data: {},
      search_order: 0,        //表示順
      search_class: 1,        //表示区分
      type: "",
      category:'',
      
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message:"",
      is_loaded: true,
    }
  }
  
  async componentDidMount(){
    auth.refreshAuth(location.pathname+location.hash);
    this.getSearchResult();
  }
  // 検索
  getSearchResult = async () => {
    let path = "/app/api/v2/master/inspection/search";
    let post_data = {
      keyword: this.state.schVal,
      is_enabled: this.state.search_class,
      table_kind: this.state.list_index,
      order:display_order[this.state.search_order].field_name,
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
      }, () => {
        this.getSearchResult();
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
    this.setState({
      is_loaded: true,
      isOpenModal: false
    }, () => {
      this.getSearchResult()  
    });    
  };
  updateData = (index) => {
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      isOpenModal: true
    });
  };
  
  // データ
  setList = (index) => {
    this.setState({
      list_index:index, selected_index: index,
      is_loaded: true
    }, () => {
      this.getSearchResult();
    })
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
    let path = "/app/api/v2/master/inspection/delete";
    let post_data = {
      params:{
        number: this.state.selected_number,
        table_kind: this.state.list_index,
      }
    };
    await axios.post(path,  post_data);
    this.setState({
      is_loaded: true
    }, ()=> {      
      this.confirmCancel();
      this.getSearchResult();
    });
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
    let {list_array, table_data} = this.state;
    // let selected_category = list_array[this.state.selected_index];
    // selected_category = selected_category[Object.keys(selected_category)[0]];
    return (
      <>
        <Card>
          <div className="title">生理検査関連マスタ</div>
          <SearchPart>
            <div className="list-title">マスター覧</div>
            <div className="search-box-area">
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
          <List>
            {list_array !== undefined && list_array !== null && list_array.length>0 && (
              list_array.map((item, index) => {
                let key = Object.keys(item)[0];
                return (
                  <div key={index} className={key == this.state.selected_index ? "selected table-row" : "table-row"} onClick={()=>this.setList(key)}>
                    {item[key]}
                  </div>)
              })
            )}
          
          </List>
          <Wrapper>
            {this.state.list_index == 0 && (        //検査目的
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-no"/>
                  <th className="table-check">表示</th>
                  <th className="code-number">検査目的ID</th>
                  <th className="name">検査目的名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded == true ? (
                  <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, index)}>
                              <td className="td-no" style={{textAlign:"right"}}>{index+1}</td>
                              <td className="text-center table-check">
                                <Checkbox
                                  label=""
                                  // getRadio={this.getRadio.bind(this)}
                                  isDisabled={true}
                                  value={item.is_enabled}
                                  name="check"
                                />
                              </td>
                              <td className="code-number" style={{textAlign:"right"}}>{item.purpose_id}</td>
                              <td style={{textAlign:"left", paddingLeft:"0.75rem"}}>{item.name}</td>
                            </tr>
                          </>)
                      })
                    )}
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length < 1 && (
                      <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                    )}
                  </>
                )}
                </tbody>
              </table>
            )}
            {this.state.list_index == 1 && (        //現症
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-no"/>
                  <th className="table-check">表示</th>
                  <th className="code-number">現症ID</th>
                  <th className="name">現症名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded == true ? (
                  <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, index)}>
                              <td className="td-no" style={{textAlign:"right"}}>{index+1}</td>
                              <td className="table-check text-center">
                                <Checkbox
                                  label=""
                                  // getRadio={this.getRadio.bind(this)}
                                  isDisabled={true}
                                  value={item.is_enabled}
                                  name="check"
                                />
                              </td>
                              <td className="code-number" style={{textAlign:"right"}}>{item.symptoms_id}</td>
                              <td style={{textAlign:"left", paddingLeft:"0.75rem"}}>{item.name}</td>
                            </tr>
                          </>)
                      })
                    )}
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length < 1 && (
                      <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                    )}
                  </>
                )}
                </tbody>
              
              </table>
            )}
            {this.state.list_index == 2 && (        //依頼区分
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-no"/>
                  <th className="table-check">表示</th>
                  <th className="code-number">依頼区分ID</th>
                  <th className="name">依頼区分名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded == true ? (
                  <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, index)}>
                              <td className="td-no" style={{textAlign:"right"}}>{index+1}</td>
                              <td className="text-center table-check">
                                <Checkbox
                                  label=""
                                  // getRadio={this.getRadio.bind(this)}
                                  isDisabled={true}
                                  value={item.is_enabled}
                                  name="check"
                                />
                              </td>
                              <td className="code-number" style={{textAlign:"right"}}>{item.request_id}</td>
                              <td style={{textAlign:"left", paddingLeft:"0.75rem"}}>{item.name}</td>
                            </tr>
                          </>)
                      })
                    )}
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length < 1 && (
                      <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                    )}
                  </>
                )}
                </tbody>
              </table>
            )}
            {this.state.list_index == 3 && (        //患者移動形態
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-no"/>
                  <th className="table-check">表示</th>
                  <th className="code-number">患者移動形態ID</th>
                  <th className="name">患者移動形態名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded == true ? (
                  <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, index)}>
                              <td className="td-no" style={{textAlign:"right"}}>{index+1}</td>
                              <td className="text-center table-check">
                                <Checkbox
                                  label=""
                                  // getRadio={this.getRadio.bind(this)}
                                  isDisabled={true}
                                  value={item.is_enabled}
                                  name="check"
                                />
                              </td>
                              <td className="code-number" style={{textAlign:"right"}}>{item.movement_id}</td>
                              <td style={{textAlign:"left", paddingLeft:"0.75rem"}}>{item.name}</td>
                            </tr>
                          </>)
                      })
                    )}
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length < 1 && (
                      <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                    )}
                  </>
                )}
                </tbody>
              </table>
            )}
            {this.state.list_index == 4 && (        //冠危険因子
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-no"/>
                  <th className="table-check">表示</th>
                  <th className="code-number">冠危険因子ID</th>
                  <th className="name">冠危険因子名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded == true ? (
                  <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, index)}>
                              <td className="td-no" style={{textAlign:"right"}}>{index+1}</td>
                              <td className="text-center table-check">
                                <Checkbox
                                  label=""
                                  // getRadio={this.getRadio.bind(this)}
                                  isDisabled={true}
                                  value={item.is_enabled}
                                  name="check"
                                />
                              </td>
                              <td className="code-number" style={{textAlign:"right"}}>{item.risk_factors_id}</td>
                              <td style={{textAlign:"left", paddingLeft:"0.75rem"}}>{item.name}</td>
                            </tr>
                          </>)
                      })
                    )}
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length < 1 && (
                      <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                    )}
                  </>
                )}
                </tbody>
              </table>
            )}
            {this.state.list_index == 5 && (        //現病歴
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-no"/>
                  <th className="table-check">表示</th>
                  <th className="code-number">現病歴ID</th>
                  <th className="name">現病歴名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded == true ? (
                  <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, index)}>
                              <td className="td-no" style={{textAlign:"right"}}>{index+1}</td>
                              <td className="text-center table-check">
                                <Checkbox
                                  label=""
                                  // getRadio={this.getRadio.bind(this)}
                                  isDisabled={true}
                                  value={item.is_enabled}
                                  name="check"
                                />
                              </td>
                              <td className="code-number" style={{textAlign:"right"}}>{item.sick_history_id}</td>
                              <td style={{textAlign:"left", paddingLeft:"0.75rem"}}>{item.name}</td>
                            </tr>
                          </>)
                      })
                    )}
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length < 1 && (
                      <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                    )}
                  </>
                )}
                </tbody>
              </table>
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
            />
          </Wrapper>
          
          <div className="footer-buttons">
            <div onClick={this.openModal} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>新規作成</span></div>            
          </div>
          {this.state.isOpenModal && (
            <InspectionModal
              modal_data={this.state.modal_data}
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              modal_type={this.state.list_index}
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

export default Inspection_Haruka