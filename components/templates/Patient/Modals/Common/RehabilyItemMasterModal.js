import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {checkSMPByUnicode} from "~/helpers/constants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`
    display: block;
    height: 100%;
.selected, .selected:hover{
  background:lightblue!important;      
}
    .area-1 {
      height: 100%;
      margin-right: 3px;
      .title{
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        background-color: #a0ebff;
      }
      .content{
        height: 300px;
        border:1px solid black;
        p {
          margin: 0;
          cursor: pointer;
          padding-left: 5px; 
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
        overflow-y:auto;
      }
    }
    .button-area{
        button {
            min-width: 25px;
        }
    }
    button {
        span {
            font-size: 16px;
            font-weight: 100;
        }
    }
 `;

class RehabilyItemMasterModal extends Component {
    constructor(props) {
        super(props);
        let selected_items = this.props.modal_data;

        this.state = {
            modal_title:this.props.modal_title,
            classific_master: [],
            item_master:[],
            free_input: "",
            selected_items:selected_items != null && selected_items != undefined && selected_items.length > 0 ? selected_items : [],
            alert_messages:'',
            confirm_message: '',
            confirm_action: "",
            confirm_alert_title: ""
        }
        this.change_flag = 0;
    }

    componentDidMount() {
        let master_data = this.props.master_data;
        let classfic_master_data = master_data.classific_master;
        let category_id= "";
        if (this.props.modal_title === "算定区分") {
            category_id = 1;
            let filterArray = master_data.item_master.filter(x=>{
                if (x.classific_category===category_id) return x;
            });
            this.setState({
                item_master: filterArray,
                category_id
            });
        } else if (this.props.modal_title === "基本方針") {
            category_id = 2;
        } else if (this.props.modal_title === "社会的ゴール") {
            category_id = 3;
        } else if (this.props.modal_title === "障害名") {
            category_id = 4;
        }
        let filterArray = classfic_master_data.filter(x=>{
            if (x.classific_category===category_id) return x;
        });
        this.setState({
            classific_master:filterArray,
            category_id
        })
    }

    selectClassfic = (id, name) => {
        let master_data = this.props.master_data;
        let item_master_data = master_data.item_master;
        let filterArray = item_master_data.filter(x=>{
            if (x.classific_id===id && x.classific_category===this.state.category_id) return x;
        });
        this.setState({
            classific_id:id,
            classific_name: name,
            item_master: filterArray,
            item_id: 0,
            item_name: ""
        });
    };

    selectItem = (item) => {
        this.setState({
            item_id: item.item_id,
            item_name:item.item_name,
        })
    };

    freeComment = (e) => {
        this.setState({
            free_input: e.target.value,
        })
    };

    enterPressed = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            let input_val = this.state.free_input;
            this.setState({free_input: ""});
            this.addItem(input_val);
        }
    };

    addItem = (input_value) => {
        if (input_value === undefined || input_value == null || input_value === "") return;
        let selected_items = this.state.selected_items;
        let index = selected_items.indexOf(input_value);
        if (index > -1) return;
        selected_items.push(input_value);
        this.change_flag = 1;
        this.setState({selected_items,})
    };

    selectListItem = (item) => {
        this.setState({selected_item: item});
    };

    deleteItem = () => {
        if (this.state.selected_item === undefined || this.state.selected_item === "") return;
        let delete_item = this.state.selected_item;
        if (this.state.selected_items === undefined || this.state.selected_items == null || this.state.selected_items.length === 0) return;
        let selected_items = this.state.selected_items;
        let index = selected_items.indexOf(delete_item);
        if (index > -1)
            selected_items.splice(index,1);
        this.change_flag = 1;
        this.setState({
            selected_items,
            selected_item: "",
        })
    };

    handleOk = () => {
        if (this.props.modal_title === "算定区分"){
            if (this.state.item_name === undefined || this.state.item_name == null || this.state.item_name === ""){
                this.setState({alert_messages:"項目を選択してください。"})                
                return;
            }
            this.props.handleOk(this.state.item_name);
        } else {
            if (this.state.selected_items === undefined || this.state.selected_items == null || this.state.selected_items.length === 0){
                this.setState({alert_messages:"項目を追加してください。"})                
                return;
            }
            this.props.handleOk(this.state.selected_items);
        }
    };

    addFree = () => {
        if (checkSMPByUnicode(this.state.free_input)){
            this.setState({alert_messages:"印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください"})            
            return;
        }
        this.addItem(this.state.free_input);
        this.setState({free_input: ""});
    };

    confirmCancel = () => {
      this.setState({
        alert_messages:'',
        confirm_message: '',
        confirm_action: "",
        confirm_alert_title: ""
      })
    }

    closeModal = () => {
        if (this.change_flag == 0) {
            this.props.closeModal();
        }
        this.setState({
            confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
            confirm_action:"close",
            confirm_alert_title:'入力中',
        });
    }

    confirmOk = () => {
        if (this.state.confirm_action == "close") {
            this.props.closeModal();
        }
    }

    render() {
        let {classific_master, item_master, selected_items} = this.state;        
        return  (
            <Modal show={true} id=""  className="set-detail-view-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{this.state.modal_title}選択</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        {this.props.modal_title === "算定区分" ? (
                            <>
                                <div className="content" style={{cursor:"pointer"}}>
                                    {item_master !== undefined && item_master.length>0 && (
                                        item_master.map(item => {
                                            return (
                                                <p className={item.item_id===this.state.item_id?"selected":""}
                                                   onClick = {this.selectItem.bind(this, item)} key = {item.number}
                                                >{item.item_name}</p>
                                            )
                                        })
                                    )}
                                </div>
                            </>
                            ) : (
                            <>
                                <div className="w-100 text-right">
                                    <Button onClick={this.deleteItem} className="mr-1 mb-1">選択削除</Button>
                                </div>
                                <div className="content-area d-flex">
                                    <div className="area-1" style={{width:"30%"}}>
                                        <div className="title">分類</div>
                                        <div className="content">
                                            {classific_master !== undefined && classific_master.length>0 && (
                                                classific_master.map(item => {
                                                    return (
                                                        <p className={item.classific_id ===this.state.classific_id ?"selected":""}
                                                           onClick = {this.selectClassfic.bind(this, item.classific_id ,item.classific_name )}
                                                           key = {item.number}>{item.classific_name }</p>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                    <div className="area-1" style={{width:"30%"}}>
                                        <div className="title">項目名</div>
                                        <div className="content">
                                            {item_master !== undefined && item_master.length>0 && (
                                                item_master.map(item => {
                                                    return (
                                                        <p className={item.item_id===this.state.item_id?"selected":""}
                                                           onClick = {this.selectItem.bind(this, item)} key = {item.number}
                                                        >{item.item_name}</p>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                    <div className="button-area" style={{width:100}}>
                                        <Button onClick={this.addItem.bind(this,this.state.item_name)} className="mr-4 ml-4 mt-5">→追加</Button>
                                    </div>
                                    <div className="area-1" style={{width:"30%"}}>
                                        <div className="title">選択項目</div>
                                        <div className="content">
                                            {selected_items !== undefined && selected_items.length>0 && (
                                                selected_items.map(item => {
                                                    return (
                                                        <p className={item===this.state.selected_item?"selected":""}
                                                           onClick={this.selectListItem.bind(this, item)} key = {item}
                                                        >{item}</p>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="comment-area w-75 mt-4">
                                    <div>※手入力で入力された値は、選択項目に追加されます。</div>
                                    <div className="border border-dark p-2">
                                        <div>フリー入力</div>
                                        <div className="mt-1 d-flex">
                                            <input
                                                type="text"
                                                className="w-100"
                                                onChange={this.freeComment.bind(this)}
                                                value={this.state.free_input}
                                                onKeyDown={this.enterPressed.bind(this)}
                                            />
                                        <Button onClick={this.addFree} className="ml-1">追加</Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                            )}
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.closeModal} className="cancel-btn">キャンセル</Button>
                    <Button onClick={this.handleOk} className="red-btn">確定</Button>
                </Modal.Footer>
                {this.state.alert_messages !== "" && (
                  <SystemAlertModal
                      hideModal= {this.confirmCancel.bind(this)}
                      handleOk= {this.confirmCancel.bind(this)}
                      showMedicineContent= {this.state.alert_messages}            
                  />
                )}
                {this.state.confirm_message !== "" && (
                  <ConfirmNoFocusModal
                    hideConfirm= {this.confirmCancel.bind(this)}
                    confirmCancel= {this.confirmCancel.bind(this)}
                    confirmOk= {this.confirmOk.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                    title={this.state.confirm_alert_title}
                  />
                )}
            </Modal>
        );
    }
}

RehabilyItemMasterModal.contextType = Context;

RehabilyItemMasterModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    modal_title: PropTypes.string,
    master_data: PropTypes.Object,
    modal_data: PropTypes.array,
};

export default RehabilyItemMasterModal;
