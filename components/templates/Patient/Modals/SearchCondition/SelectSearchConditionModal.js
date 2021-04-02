import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios";

const Wrapper = styled.div`
.selected, .selected:hover{
  background:lightblue!important;      
}
.area-1 {
  height: 100%;
  margin-right: 3px;
  .title{
    text-align: left;
    font-size: 14px;
    font-weight: bold;
   padding: 10px;
   border:1px solid black;
  }
  .content{
    height: 300px;
    border:1px solid black;
    p {
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
    padding:5px;
    span {
        font-size: 14px;
        font-weight: 100;
    }
}
.three-column{
    float: left;
    width: 31%;
    text-align: center;
    border: solid 1px gray;
    border-radius: 4px;
    margin: 1%;
}
 `;

class SelectSearchConditionModal extends Component {
    constructor(props) {
        super(props);
        let selected_items = this.props.modal_data;
        this.state = {
            modal_title:this.props.modal_title,
            selected_items:selected_items != null && selected_items != undefined && selected_items.length > 0 ? selected_items : [],
            master_data:[]
        }
    }

    async UNSAFE_componentWillMount(){
        let master_data = [];
        if (this.props.modal_type=="department"){
            master_data = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        } else {
            const resp = await axios.get("/app/api/v2/search_condition/search_master_data",{
                params: {
                    type: this.props.modal_type,
                }
            });
            master_data = resp.data;
        }
        this.setState({master_data:master_data});
    }

    selectItem = (item) => {
        let selected_items = this.state.selected_items;
        let index = selected_items.findIndex(x=>x.id==item.id);
        if (index > -1) selected_items.splice(index,1);
        else selected_items.push(item);
        this.setState({selected_items});
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
        this.setState({
            selected_items,
            selected_item: "",
        })
    };

    register = () => {
        if (this.state.selected_items == null || this.state.selected_items.length == 0) {
            // window.sessionStorage.setItem("alert_messages", "項目を選択してください。");
            return;
        }
        this.props.handleOk(this.state.selected_items);
    };

    deleteAllItem = () => {
        this.setState({
            selected_items:[],
            selected_item: "",
        })
    };

    render() {
        let {selected_items, modal_title, master_data} = this.state;
        return  (
            <Modal show={true} id=""  className="set-detail-view-modal">
                <Modal.Header>
                    <Modal.Title>{modal_title}選択</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="content-area d-flex">
                            <div className="area-1" style={{width:"70%"}}>
                                <div className="title">選択可能な{modal_title}</div>
                                <div className="content" style={{height:359}}>
                                    {master_data !== undefined && master_data.length>0 && (
                                        master_data.map(item => {
                                            return (
                                                <p className={selected_items.findIndex(x=>x.id==item.id)>-1 ?"selected three-column":"three-column"}
                                                   onClick = {this.selectItem.bind(this, item)}
                                                   key = {item.id}>{item.value}</p>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                            <div className="area-1 ml-3" style={{width:"30%"}}>
                                <div>選択中の{modal_title}数 {selected_items!=null ? selected_items.length: 0}件</div>
                                <div className="w-100">
                                    <Button onClick={this.deleteItem} className="mr-1 mb-1">選択削除</Button>
                                    <Button onClick={this.deleteAllItem} className="mr-1 mb-1">全削除</Button>
                                </div>
                                <div className="title">{modal_title}名</div>
                                <div className="content">
                                    {selected_items !== undefined && selected_items.length>0 ? (
                                        selected_items.map(item => {
                                            return (
                                                <p className={item===this.state.selected_item?"selected":""}
                                                   onClick={this.selectListItem.bind(this, item)} key={item}
                                                style={{margin:0}}>{item.value}</p>
                                            )
                                        })
                                    ) : (<></>)}
                                </div>
                            </div>
                        </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.closeModal} className="cancel-btn">キャンセル</Button>
                    <Button onClick={this.register.bind(this)} className="red-btn">確定</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

SelectSearchConditionModal.contextType = Context;

SelectSearchConditionModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    modal_title: PropTypes.string,
    modal_type: PropTypes.string,
    modal_data: PropTypes.array,
};

export default SelectSearchConditionModal;