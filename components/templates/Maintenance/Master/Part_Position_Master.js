import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import PositionMasterModal from "./Modal/PositionMasterModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import auth from "~/api/auth";
import TreatModal from "./Modal/TreatModal";
import Spinner from "react-bootstrap/Spinner";
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;
const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
  margin-top:7px;
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
  .menu-div {
    line-height: 2.375rem;
    .pullbox, .pullbox-select, .pullbox-label{
      line-height: 2.375rem;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
table {
    margin-bottom:0;
    thead{
      display: table;
      width: calc(100% - 17px);
    }
    tbody{
      height: calc(100vh - 190px);
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
}
.td-no {
  width: 25px;
}
.label-title{
    font-size:1rem;
}
`;
const ListTitle = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    height: 2.375rem;
    float: left;
    font-size: 1rem;
    line-height: 2.375rem;
    span {
        color: blue;
    }
    
    .left-area {
        width: 45%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 53%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }

    .label-title{
        font-size: 1rem;
        text-align: right;
        margin-right: 10px;
        width: 80px;
        margin-top:0;
        line-height: 2.375rem;
    }

    .pullbox-label, .pullbox-select{
        width:140px;
        height: 2.375rem;
        margin-right:20px;
        font-size: 1rem;
    }

    .tl {
        width: 25%;
        text-align: left;
    }
    .tr {
        width: 75%;
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
    width: 45%;
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
  input[type="checkbox"] {
    margin-right: 0;
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 53%;
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  input[type="checkbox"] {
    margin-right: 0;
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
    width: 100px;
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

const display_order = [
  // { id: 0, value: "" },
  { id: 0, value: "表示順", field_name:"order"},
  { id: 1, value: "コード順", field_name:"code"},
];

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
class Part_Position_Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_array:[],
      list_item:[],
      isOpenPositionModal: false,
      isOpenModal : false,
      selected_first_kind_number:0,
      selected_part_id:null,
      modal_data:null,
      search_part_order:0,
      search_position_order:0,
      is_first_loaded: false,
      is_second_loaded: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    }
  }
  
  async componentDidMount(){
    auth.refreshAuth(location.pathname+location.hash);
    this.getPartInfo();
  }
  
  closeModal = () => {
    this.setState({
      isOpenPositionModal: false,
      isOpenModal:false,
      modal_data:null
    });
  };
  addSecondKind = () => {
    this.setState({
      isOpenPositionModal: true,
      modal_data:null,
    });
  };
  addFirstKind = () => {
    this.setState({
      isOpenModal:true,
      selected_part_item:null,
    })
  }
  getPartInfo = async() => {
    let path = "/app/api/v2/master/treat/search";
    this.setState({is_first_loaded: false});
    await apiClient
      ._post(path, {
        params: {
          table_kind:1,
          order:display_order[this.state.search_part_order].field_name,
        }
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            list_array:res,
            selected_first_kind_number:this.state.selected_first_kind_number>0?this.state.selected_first_kind_number:res[0].number,
            selected_part_id : this.state.selected_part_id != null && this.state.selected_part_id != ''?this.state.selected_part_id:res[0].part_id,
          }, () => {
            this.getPositionFromPart(this.state.selected_part_id);
          })
        } else {
          this.setState({
            list_array:[],
            list_item:[],
            selected_first_kind_number:0,
            selected_part_id:null,
          })
        }
      })
      .catch(() => {
      
      }).finally(()=>{
        this.setState({is_first_loaded: true});
      });
  }
  getPositionFromPart = async(first_kind_number) => {
    let path = "/app/api/v2/master/treat/searchPosition";
    let post_data = {
      part_id:first_kind_number,
      order:display_order[this.state.search_position_order].field_name,
    };
    this.setState({is_second_loaded: false});
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
        this.setState({is_second_loaded: true});
      });
  }
  
  handleOk = () => {
    this.getPartInfo();
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
  
  contextMenuAction = (act, index, kind) => {
    if( act === "edit") {
      this.editData(index, kind);
    } else if (act === "delete") {
      var number, name;
      if (kind == 1) {
        number = this.state.list_array[index].number;
        name = this.state.list_array[index].name;
      } else {
        number = this.state.list_item[index].number;
        name = this.state.list_item[index].name;
      }
      this.setState({
        isDeleteConfirmModal : true,
        selected_number:number,
        kind:kind,
        confirm_message:'「' + name +'」　' + "この分類マスタを削除しますか?",
      })
    }
  };
  
  editData = (index, kind) => {
    if (kind ===1){
      this.setState({
        kind,
        selected_part_item:this.state.list_array[index],
        isOpenModal: true,
      });
    } else {
      this.setState({
        kind,
        modal_data:this.state.list_item[index],
        isOpenPositionModal: true,
      });
    }
    
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  deleteData = async () => {
    var path;
    if (this.state.kind ==1){
      path = "/app/api/v2/master/treat/delete";
    } else {
      path = "/app/api/v2/master/treat/deletePosition";
    }
    let post_data = {
      params: {number:this.state.selected_number, table_kind:1},
    };
    await apiClient.post(path,  post_data);
    this.confirmCancel();
    if (this.state.kind == 1){
      this.getPartInfo();
    } else {
      this.getPositionFromPart(this.state.selected_first_kind_number);
    }
  };
  
  selectPattern = (pattern_number, selected_part_id) => {
    this.setState({selected_first_kind_number:pattern_number, selected_part_id:selected_part_id});
    this.getPositionFromPart(selected_part_id);
  }
  
  getPartOrderSelect = e => {                 //表示順
    this.setState({ search_part_order: parseInt(e.target.id) }, () => {
      this.getPartInfo();
    });
  };
  
  getPositionOrderSelect = e => {                 //表示順
    this.setState({ search_position_order: parseInt(e.target.id) }, () => {
      this.getPositionFromPart(this.state.selected_part_id);
    });
  };
  
  render() {
    let {list_array, list_item} = this.state;
    return (
      <Card>
        <div className="title">部位・位置マスタ</div>
        <ListTitle>
          <div className="left-area">
            <div className="text-left menu-div" style={{width:'20%'}}>部位マスタ</div>
            <div className="text-right menu-div" style={{width:'50%', display:'flex'}}>
              <SelectorWithLabel
                options={display_order}
                title="表示順"
                getSelect={this.getPartOrderSelect}
                departmentEditCode={display_order[this.state.search_part_order].id}
              />
            </div>
            <div className="text-right menu-div" style={{width:"30%"}}>
              <label style={{cursor:"pointer"}} onClick={this.addFirstKind}><Icon icon={faPlus} />部位マスタを追加</label>
            </div>
          </div>
          
          <div className="right-area">
            <div className="text-left menu-div" style={{width:"20%"}}>位置マスタ</div>
            <div style={{display:'flex', width:"50%"}} className="text-right menu-div">
              <SelectorWithLabel
                options={display_order}
                title="表示順"
                getSelect={this.getPositionOrderSelect}
                departmentEditCode={display_order[this.state.search_position_order].id}
              />
            </div>
            <div className="text-right menu-div" style={{width:"30%"}}>
              <label style={{cursor:"pointer"}} onClick={this.addSecondKind}><Icon icon={faPlus} />位置マスタを追加</label>
            </div>
          </div>
        </ListTitle>
        <List>
          <table className="table-scroll table table-bordered" id="wordList-table">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th style={{width:'8rem'}}>部位マスタID</th>
              <th className="name">部位マスタ名称</th>
            </tr>
            </thead>
            <tbody>
            {this.state.is_first_loaded ? (
              <>
                {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                  list_array.map((item, index) => {
                    return (
                      <>
                        <tr className={this.state.selected_first_kind_number === item.number?"selected clickable":"clickable"}
                            onClick={this.selectPattern.bind(this,item.number, item.part_id)} onContextMenu={e => this.handleClick(e,index, 1)}>
                          <td className="td-no">{index+1}</td>
                          <td className="table-check">
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="text-right" style={{width:'8rem'}}>{item.part_id}</td>
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
        <Wrapper>
          <table className="table-scroll table table-bordered">
            <thead>
            <tr>
              <th className="td-no"/>
              <th className="table-check">表示</th>
              <th style={{width:'8rem'}}>位置マスタID</th>
              <th className="">位置マスタ名称</th>
            </tr>
            </thead>
            <tbody>
            {this.state.is_second_loaded ? (
              <>
                {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                  list_item.map((item, index) => {
                    return (
                      <>
                        <tr onContextMenu={e => this.handleClick(e,index, 0)}>
                          <td className="td-no">{index+1}</td>
                          <td className="table-check">
                            <Checkbox
                              label=""
                              value={item.is_enabled}
                              isDisabled={true}
                              name="check"
                            />
                          </td>
                          <td className="text-right" style={{width:'8rem'}}>{item.position_id}</td>
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
        {this.state.isOpenModal && (
          <TreatModal
            modal_data={this.state.selected_part_item}
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            modal_type={1}
          />
        )}
        {this.state.isOpenPositionModal && (
          <PositionMasterModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            first_kind_number = {this.state.selected_first_kind_number}
            part_id = {this.state.selected_part_id}
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

export default Part_Position_Master