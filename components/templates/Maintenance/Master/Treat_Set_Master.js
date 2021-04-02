import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import axios from "axios";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import TreatSetModal from "~/components/templates/Patient/Modals/Common/TreatSetModal";
import auth from "~/api/auth";

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
    border-left: solid 5px #69c8e1;
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
  float: left;
  .list-title {
    margin-top: 20px;
    font-size: 1rem;
    width: 20%;
  }
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
    line-height: 2.375rem;
  }
  input{
    font-size: 1rem;
    height: 2.375rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 150px;
      height: 2.375rem;
  }
 `;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
      text-align: right;
  }
  table {
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 18rem);
      overflow-y:scroll;
      display:block;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        font-size: 1rem;
        padding: 0.25rem;
    }
    th {
        font-size:1rem;
        text-align: center;
        padding: 0.3rem;
    }
    .table-check {
        width: 47px;
        label {
            margin-right:0;
        }
    }
    .item-no {
      width: 30px;
      text-align: right;
    }
}
 `;

const ContextMenuUl = styled.ul`
 margin-bottom: 0;
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

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;

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
          <li onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}><div>編集</div></li>
          <li onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}><div>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class Treat_Set_Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schVal: "",
      search_class: 1,        //表示区分
      table_data: null,
      isOpenModal: false,
      modal_data: null,
      type: "",
      category:'',
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message:"",
    }
  }
  
  async componentDidMount(){
    auth.refreshAuth(location.pathname+location.hash);
    this.getSearchResult();
  }
  // 検索
  getSearchResult = async () => {
    let path = "/app/api/v2/master/treat/searchTreatSet";
    let post_data = {
      keyword: this.state.schVal,
      is_enabled: this.state.search_class,
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({table_data: data});
  };
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getSearchResult();
    }
  };
  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };
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
    let path = "/app/api/v2/master/treat/deleteDepartmentDefine";
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
          <div className="title">処置セットマスタ</div>
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
            <>
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="item-no"/>
                  <th className="table-check">表示</th>
                  <th style={{width:'10rem'}} className="code-number">セットID</th>
                  <th className="name">セット名</th>
                </tr>
                </thead>
                {table_data == null ? (
                  <tbody>
                    <div className='w-100 h-100'>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  </tbody>
                ) : (
                  <tbody>
                  {table_data.length > 0 && (
                    table_data.map((item, index) => {
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e, index)}>
                            <td className="item-no">{index+1}</td>
                            <td className="table-check text-center">
                              <Checkbox
                                label=""
                                // getRadio={this.getRadio.bind(this)}
                                isDisabled={true}
                                value={item.is_enabled}
                                name="check"
                              />
                            </td>
                            <td style={{width:'10rem', textAlign: "right"}}>{item.treat_set_detail_id}</td>
                            <td>{item.treat_set_name}</td>
                          </tr>
                        </>)
                    })
                  )}
                  </tbody>
                )}
              </table>
            </>
            
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
            />
          </Wrapper>
          
          <div className="footer-buttons">
            <Button className="red-btn" onClick={this.openModal}>新規作成</Button>
          </div>
          {this.state.isOpenModal && (
            <TreatSetModal
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

export default Treat_Set_Master