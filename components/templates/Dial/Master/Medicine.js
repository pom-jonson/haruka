import React, { Component, useContext } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import MedicineModal from "../modals/MedicineModal";
import PresetPrescription from "./PresetPrescription";
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialMasterPrintPreview from "~/components/templates/Dial/Master/DialMasterPrintPreview";
import PropTypes from "prop-types";
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
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  margin-bottom:8px;
  .search-box {
      width: 100%;
      display: flex;
      input{
        width:19rem
      }
  }
  .label-title {
    width: 5rem;
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
        width: 3rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        font-size: 1rem;  
    }
    .radio-btn:last-child {
        label {
            width: 6rem;
        }
    }
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
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
          text-align: center;
          padding: 0.3rem;

      }
      .table-check {
          width: 4rem;
      }
      .item-no {
        width: 2.5rem;
      }
      .code-number {
          width: 6rem;
      }
      .name{
          width:16rem;
      }
  }
 `;
 const sort_order = [     
     { id: 0, value: "コード順", field_name:"code"},
     { id: 1, value: "カナ順", field_name:"name_kana"},
     { id: 2, value: "名称順", field_name:"name"},
  ];
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ"},
    { id: 2, value: "非表示のみ"},
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_MEDICINE_MASTER,AUTHS.EDIT,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_MEDICINE_MASTER,AUTHS.DELETE,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

const medicine_type_name = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
class Medicine extends Component {
    constructor(props) {
        super(props);

       let table_data = [];
        this.state = {
            schVal: "",
            table_data,
            isOpenCodeModal: false,
            isLoaded: false,
            category: '',
            modal_data:{},
            search_order: 1,        //表示順
            search_class: 1,        //表示区分

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isOpenPreviewModal: false,
            confirm_message:"",
        };
        this.table_head={};
        this.table_head['code'] = "コード番号";
        this.table_head['name'] = "薬剤名称";
        this.table_head['name_short'] = "略称";
        this.table_head['name_kana'] = "カナ名称";
        this.table_head['generic_name'] = "一般名称";
        this.table_head['unit'] = "単位";
        this.table_head['medicinal_properties'] = "薬効";
        this.table_head_style={};
        this.table_head_style['code'] = "right";
        this.table_head_style['name'] = "left";
        this.table_head_style['name_short'] = "left";
        this.table_head_style['name_kana'] = "left";
        this.table_head_style['generic_name'] = "left";
        this.table_head_style['unit'] = "left";
        this.table_head_style['medicinal_properties'] = "left";
    }
    
    async UNSAFE_componentWillMount(){
      this.searchMedicineList();
    }

    // 検索
    searchMedicineList = async () => {
        let path = "/app/api/v2/dial/master/medicine_search";
        let post_data = {
            keyword: this.state.schVal,
            category:this.state.category,
            is_enabled: this.state.search_class,
            order: sort_order[this.state.search_order].field_name,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({
          table_data: data,
          isLoaded: true
        });
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.setState({
            isLoaded: false
          },()=>{                        
            this.searchMedicineList();
          });
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    handleOk = () => {
        this.setState({
            isOpenCodeModal: false,
            isLoaded: false
        },()=>{
          this.searchMedicineList();
        });
    };    
    createCode = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_MEDICINE_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
            window.sessionStorage.setItem("alert_messages","登録権限がありません。");
            return;
        }
        this.setState({
          isOpenCodeModal: true,
          modal_data:null
        });
    };

    getPrescriptionClassificList = async () => {
        let path = "/app/api/v2/dial/master/get_prescription_category";
        let post_data = {
            is_enabled: 1,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({modal_data: data});
    };
    openPrescription = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_PRES_SET_MASTER,this.context.AUTHS.READ, 0) === false) {
          window.sessionStorage.setItem("alert_messages","権限がありません。");
          return;
      }
        this.props.history.replace("/dial/master/prescription_set");
    };
    closeModal = () => {
        this.setState({
            isOpenCodeModal: false,
            isOpenPrescription: false,
        })
    };

    selectMedicineType = (e) => {
      this.setState({ category: e.target.value, isLoaded: false}, () => {
        this.searchMedicineList();
      });
    };
    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id), isLoaded: false }, () => {
            this.searchMedicineList();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id), isLoaded: false }, () => {
            this.searchMedicineList();
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
        this.setState({selected_number:this.state.table_data[index].number}, () => {
          this.delete(this.state.table_data[index].name);
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

    editData = (index) => {
      let modal_data = this.state.table_data[index];
      this.setState({
          modal_data,
          // row_index: index,
          isOpenCodeModal: true
      });
    };

    deleteData = async () => {
      let path = "/app/api/v2/dial/master/medicine_delete";
      let post_data = {
          params: this.state.selected_number,                    
      };
      await axios.post(path,  post_data);
      window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
      this.confirmCancel();
      this.setState({
        isLoaded: false
      },()=>{                    
        this.searchMedicineList();
      });
    };

    openPreviewModal=()=>{
        this.setState({isOpenPreviewModal:true});
    };

    render() {
        let {table_data} = this.state;
        return (
            <Card>
                <div className="title">薬剤マスタ</div>
                <SearchPart>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <div className="medicine_type">
                        <>
                            <RadioButton
                                id={`medicine_all`}
                                value=""
                                label="全て"
                                name="medicine_type"
                                getUsage={this.selectMedicineType}
                                checked={this.state.category==""}
                            />
                            {medicine_type_name.map((item, index)=>{
                                    return (
                                        <>
                                            <RadioButton
                                                id={`male_${index}`}
                                                value={item}
                                                label={item}
                                                name="medicine_type"
                                                getUsage={this.selectMedicineType}
                                                checked={this.state.category == item ? true : false}
                                            />
                                        </>
                                    );
                                })
                            }
                        </>
                    </div>
                    <SelectorWithLabel
                        options={sort_order}
                        title="表示順"
                        getSelect={this.getOrderSelect}
                        departmentEditCode={this.state.search_order}
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
                                <th className="item-no"/>
                                <th className="table-check">表示</th>
                                <th className="table-check">抗血栓</th>
                                <th className="code-number">コード番号</th>
                                <th className="name">薬剤名称</th>
                                <th className="name">略称</th>
                                <th className="name">カナ名称</th>
                                <th className="name">一般名称</th>
                                <th style={{width:'5rem'}}>単位</th>
                                {/* <th>厚生労働省コード</th> */}
                                <th>薬効</th>
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
                              {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                                  table_data.map((item, index) => {
                                      return (
                                      <>
                                      <tr onContextMenu={e => this.handleClick(e, index)}>
                                          <td className="item-no text-right">{index+1}</td>
                                          <td className="text-center table-check">
                                          <Checkbox
                                              label=""
                                              // getRadio={this.getRadio.bind(this)}
                                              isDisabled={true}
                                              value={item.is_enabled}                                        
                                              name="check"
                                          />
                                          </td>
                                          <td className="text-center table-check">
                                          <Checkbox
                                              label=""
                                              // getRadio={this.getRadio.bind(this)}
                                              isDisabled={true}
                                              value={item.is_antithrombotic}                                        
                                              name="check"
                                          />
                                          </td>
                                          <td className="text-right code-number">{item.code}</td>
                                          <td className="name">{item.name}</td>
                                          <td className="name">{item.name_short}</td>
                                          <td className="name">{item.name_kana}</td>
                                          <td className="name">{item.generic_name}</td>
                                          <td className="" style={{width:'5rem'}}>{item.unit}</td>
                                          {/* <td className="text-center">{item.mhlw_code}</td> */}
                                          <td>{item.medicinal_properties}</td>
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
                    <Button className="red-btn" onClick={this.openPrescription}>処方セット</Button>
                    <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
                    <Button className="red-btn" onClick={this.createCode}>新規作成</Button>
                </div>
                {this.state.isOpenCodeModal && (
                    <MedicineModal
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
                {this.state.isOpenPrescription && (
                    <PresetPrescription
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        medicine_type_name = {medicine_type_name}
                        modal_data = {this.state.modal_data}
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
                        modal_title={'薬剤マスタ'}
                        modal_type={"medicine"}
                        table_head={this.table_head}
                        table_head_style={this.table_head_style}
                        table_body={table_data}
                        category = {this.state.category}
                        sort_order = {sort_order[this.state.search_order].value}
                        search_class = {display_class[this.state.search_class].value}
                        keyword = {this.state.schVal}
                    />
                )}
            </Card>
        )
    }
}
Medicine.contextType = Context;

Medicine.propTypes = {
    history: PropTypes.object,
}
export default Medicine