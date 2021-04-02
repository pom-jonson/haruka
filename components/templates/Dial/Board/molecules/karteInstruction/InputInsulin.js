import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {disable} from "../../../../../_nano/colors";
import InputWithLabel from "../../../../../molecules/InputWithLabel";
import InsulinManageModal from "~/components/templates/Dial/Board/InsulinManageModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  .flex{
      display:flex;
  }
  .work-area{
    .selected p{
        background-color: rgb(38, 159, 191);
        border-color: rgb(38, 159, 191); 
    }
  }
  .date_area{
      width:100%;
    .label-title{
        font-size: 18px;
        margin-top: 0px;
        width: 100px;
    }
    span{
        padding-top:10px;
    }
    .start_date{
        width:50%;
    }
  }
`;

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: table;

  th{
    position: sticky;
    top: 0px;
  }
  th, td {
    border: 1px solid ${disable};
    padding: 4px;
    button{width: 100%;}
  }
  td {
    .label-title, .label-unit{
        width: 0;
    }
  }
  .med-area {
    input{
        width: 200px;
    }
  }
  .usage-area {
    input{
        width: 150px;
    }
  }
  .changed-area{
    background: lightcoral;
  }
`;

class InputInsulin extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );        
        this.state = {                                    
            is_edit: false,
            isOpenInsulinModal:false,
            selected_item:null,
            exist_insuline_data:this.props.karte_data.insulin.prev,
            edited_insulin_data:this.props.karte_data.insulin.after,
            isDeleteConfirmModal:false,
            confirm_message:'',
        }
    }

    componentDidMount () {
        this.getInsulins();
        this.initialize();
        // this.getInsulinInfoData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {        
        if (nextProps.karte_data.insulin.prev === this.state.exist_insuline_data) return;        
        this.initialize();
    }

    initialize() {
        if (this.props.karte_data.insulin.prev != ''){
            this.setState({exist_insuline_data:this.props.karte_data.insulin.prev})
        }

        if (this.props.karte_data.insulin.after != ''){
            this.setState({edited_insulin_data:this.props.karte_data.insulin.after})
        }

        if (this.props.karte_data.insulin.after == ''){
            var edited_insulin_data = [];
            if (this.props.karte_data.insulin.prev.length > 0){
                this.props.karte_data.insulin.prev.map(item => {
                    edited_insulin_data.push(item);
                })
            }
            this.setState({edited_insulin_data});
        }
    }    

    closeModal = () => {
        this.setState({            
            isOpenInsulinModal: false,
        });
    };

    OpenInsulineModal = (selected_item = null, selected_index = null) => {
        this.setState({
            isOpenInsulinModal:true,
            selected_item,
            selected_index,
            is_edit:selected_item==null?false:true,
        });
    }
    handleOk = (saved_insulin, is_edit) => {
        var edited_insulin_data = this.state.edited_insulin_data;
        if (is_edit){
            var selected_index = this.state.selected_index;
            edited_insulin_data[selected_index] = saved_insulin;
            this.setState({edited_insulin_data})
        } else {
            edited_insulin_data.push(saved_insulin);
            this.setState(edited_insulin_data);
        }
        var karte_data = this.props.karte_data;        
        karte_data.insulin.after = edited_insulin_data;
        karte_data.insulin.insulin_injection_list = this.state.insulin_injection_list;
        this.props.handleOk(karte_data);
        this.closeModal();
    }

    getDate = value => {
        this.setState({
            start_date: value,
        });
    };

    delete = (index) => {
      var waring_message = '';
      var edited_insulin_data = this.state.edited_insulin_data;
      var insulin_injection_list = this.state.insulin_injection_list;
      if(edited_insulin_data[index].insulin_data.length > 0){
        edited_insulin_data[index].insulin_data.map(item => {
          item.map(sub_item => {
            if (sub_item.insulin > 0) waring_message += insulin_injection_list[sub_item.insulin] + '\n';
          })
        })
      }
        this.setState({            
            isDeleteConfirmModal : true,
            confirm_message: "インスリン情報を削除しますか?",
            selected_index:index,
            waring_message,
        });
    }

    deleteInsulin = () => {
        var edited_insulin_data = this.state.edited_insulin_data;
        var selected_index = this.state.selected_index;
        edited_insulin_data[selected_index] = undefined;
        this.setState({
            isDeleteConfirmModal:false, 
            selected_index:null,
            edited_insulin_data
        });
        var karte_data = this.props.karte_data;        
        karte_data.insulin.after = edited_insulin_data;
        karte_data.insulin.insulin_injection_list = this.state.insulin_injection_list;
        this.props.handleOk(karte_data);
    }

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
            waring_message:'',
        });
    }

    render() {
      let {exist_insuline_data, insulin_injection_list, edited_insulin_data} = this.state;      
      return  (
        <Wrapper>
          <div className={`w-100`}><p className='border selected text-center' style={{cursor: "pointer",width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}} onClick={this.OpenInsulineModal.bind(this, null, null)}>インスリン</p></div>
          <div className={`w-100 flex`}>
            <div className={`w-100 flex`}>
              {edited_insulin_data != undefined && edited_insulin_data != null && edited_insulin_data.length>0 && insulin_injection_list != undefined && insulin_injection_list != null && (
                edited_insulin_data.map((item, index) => {
                  var rows_num = 3;
                  // if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0) {
                  //   rows_num = exist_insuline_data[index].insulin_data.length;
                  // }
                  // if (item != undefined && item.insulin_data != undefined && item.insulin_data.length>0) {
                  //   rows_num = item.insulin_data.length.length;
                  // }
                  return(
                    <>
                    <div className="flex date_area">
                      <div className="flex start_date">
                      {exist_insuline_data[index] != undefined && (
                        <>
                        <InputWithLabel
                          label="指示開始日"
                          type="date"
                          getInputText={this.getDate.bind(this)}
                          isDisabled = {true}
                          diseaseEditData={new Date(exist_insuline_data[index].start_date)}
                        />
                        <span> ～</span>
                        </>
                      )}
                      </div>
                      {item!= undefined && (
                        <>
                        <div className="flex start_date" style={{cursor:'pointer'}} onClick={this.OpenInsulineModal.bind(this, item, index)}>
                          <InputWithLabel
                            label="指示開始日"
                            type="date"
                            getInputText={this.getDate.bind(this)}
                            isDisabled = {true}
                            diseaseEditData={new Date(item.start_date)}
                          />
                          <span> ～</span>
                        </div>
                        </>
                      )}
                    </div>
                    <Table>
                      <tr style={{width:'100%'}}>
                        <th style={{width: "20%"}}>薬剤名</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '10%'}}>&nbsp;</th>
                        <th style={{width: "20%"}}>薬剤名</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '5%'}}>単位</th>
                        <th style={{width: '5%'}}>単位</th>       
                        <th style={{width: '10%'}}>&nbsp;</th>
                      </tr>
                      {((item != undefined && item.insulin_data != undefined && item.insulin_data.length>0 && item.insulin_data[0] != undefined && item.insulin_data[0] != null && item.insulin_data[0].length > 0)
                        || (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 
                        && exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length > 0)) && (
                        <>
                        <tr>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0 && (
                            exist_insuline_data[index].insulin_data[0].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{insulin_injection_list[sub_item.insulin]}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0 && (
                            exist_insuline_data[index].insulin_data[0].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_1>0?sub_item.amount_1:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0 && (
                            exist_insuline_data[index].insulin_data[0].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_2>0?sub_item.amount_2:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0 && (
                            exist_insuline_data[index].insulin_data[0].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_3>0?sub_item.amount_3:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0 && (
                            exist_insuline_data[index].insulin_data[0].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_4>0?sub_item.amount_4:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>から</td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                          {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                          item.insulin_data[0] != undefined && item.insulin_data[0] != null && item.insulin_data[0].length >0 && (
                              item.insulin_data[0].map((sub_item, sub_index) => {
                                var same_flag = true;
                                if(sub_item.insulin>0){
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0) {
                                    if (exist_insuline_data[index].insulin_data[0][sub_index] == undefined || exist_insuline_data[index].insulin_data[0][sub_index].insulin != sub_item.insulin){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{insulin_injection_list[sub_item.insulin]}</div>
                                    </>
                                  )
                                }
                              })
                          )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[0] != undefined && item.insulin_data[0] != null && item.insulin_data[0].length >0 && (
                              item.insulin_data[0].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0) {
                                    if (exist_insuline_data[index].insulin_data[0][sub_index] == undefined || exist_insuline_data[index].insulin_data[0][sub_index].amount_1 != sub_item.amount_1){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_1>0?sub_item.amount_1:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[0] != undefined && item.insulin_data[0] != null && item.insulin_data[0].length >0 && (
                              item.insulin_data[0].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0) {
                                    if (exist_insuline_data[index].insulin_data[0][sub_index] == undefined || exist_insuline_data[index].insulin_data[0][sub_index].amount_2 != sub_item.amount_2){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_2>0?sub_item.amount_2:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[0] != undefined && item.insulin_data[0] != null && item.insulin_data[0].length >0 && (
                              item.insulin_data[0].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0) {
                                    if (exist_insuline_data[index].insulin_data[0][sub_index] == undefined || exist_insuline_data[index].insulin_data[0][sub_index].amount_3 != sub_item.amount_3){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_3>0?sub_item.amount_3:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[0] != undefined && item.insulin_data[0] != null && item.insulin_data[0].length >0 && (
                              item.insulin_data[0].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[0] != undefined && exist_insuline_data[index].insulin_data[0] != null && exist_insuline_data[index].insulin_data[0].length >0) {
                                    if (exist_insuline_data[index].insulin_data[0][sub_index] == undefined || exist_insuline_data[index].insulin_data[0][sub_index].amount_4 != sub_item.amount_4){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_4>0?sub_item.amount_4:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} rowSpan={rows_num}>
                            {item != undefined && (
                              <button style={{cursor:'pointer'}} onClick={this.delete.bind(this, index)}>削除</button>
                            )}
                          </td>
                        </tr>
                        </>
                      )}

                      {((item != undefined && item.insulin_data != undefined && item.insulin_data.length>0 && item.insulin_data[1] != undefined && item.insulin_data[1] != null && item.insulin_data[1].length > 0)
                        || (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 
                        && exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length > 0)) && (
                        <>
                        <tr>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0 && (
                            exist_insuline_data[index].insulin_data[1].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{insulin_injection_list[sub_item.insulin]}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0 && (
                            exist_insuline_data[index].insulin_data[1].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_1>0?sub_item.amount_1:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0 && (
                            exist_insuline_data[index].insulin_data[1].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_2>0?sub_item.amount_2:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0 && (
                            exist_insuline_data[index].insulin_data[1].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_3>0?sub_item.amount_3:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0 && (
                            exist_insuline_data[index].insulin_data[1].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_4>0?sub_item.amount_4:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>から</td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                          {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                          item.insulin_data[1] != undefined && item.insulin_data[1] != null && item.insulin_data[1].length >0 && (
                            item.insulin_data[1].map((sub_item, sub_index) => {
                              if(sub_item.insulin>0){
                                var same_flag = true;
                                if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                  exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0) {
                                  if (exist_insuline_data[index].insulin_data[1][sub_index] == undefined || exist_insuline_data[index].insulin_data[1][sub_index].insulin != sub_item.insulin){
                                    same_flag = false;
                                  }
                                }
                                return(
                                  <>
                                  <div className = {same_flag != true?'changed-area':''}>{insulin_injection_list[sub_item.insulin]}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[1] != undefined && item.insulin_data[1] != null && item.insulin_data[1].length >0 && (
                              item.insulin_data[1].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0) {
                                    if (exist_insuline_data[index].insulin_data[1][sub_index] == undefined || exist_insuline_data[index].insulin_data[1][sub_index].amount_1 != sub_item.amount_1){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_1>0?sub_item.amount_1:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[1] != undefined && item.insulin_data[1] != null && item.insulin_data[1].length >0 && (
                              item.insulin_data[1].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0) {
                                    if (exist_insuline_data[index].insulin_data[1][sub_index] == undefined || exist_insuline_data[index].insulin_data[1][sub_index].amount_2 != sub_item.amount_2){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_2>0?sub_item.amount_2:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[1] != undefined && item.insulin_data[1] != null && item.insulin_data[1].length >0 && (
                              item.insulin_data[1].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0) {
                                    if (exist_insuline_data[index].insulin_data[1][sub_index] == undefined || exist_insuline_data[index].insulin_data[1][sub_index].amount_3 != sub_item.amount_3){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_3>0?sub_item.amount_3:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[1] != undefined && item.insulin_data[1] != null && item.insulin_data[1].length >0 && (
                              item.insulin_data[1].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[1] != undefined && exist_insuline_data[index].insulin_data[1] != null && exist_insuline_data[index].insulin_data[1].length >0) {
                                    if (exist_insuline_data[index].insulin_data[1][sub_index] == undefined || exist_insuline_data[index].insulin_data[1][sub_index].amount_4 != sub_item.amount_4){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_4>0?sub_item.amount_4:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                        </tr>
                        </>
                      )}

                      {((item != undefined && item.insulin_data != undefined && item.insulin_data.length>0 && item.insulin_data[2] != undefined && item.insulin_data[2] != null && item.insulin_data[2].length > 0)
                        || (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 
                        && exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length > 0)) && (
                        <>
                        <tr>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0 && (
                            exist_insuline_data[index].insulin_data[2].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{insulin_injection_list[sub_item.insulin]}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0 && (
                            exist_insuline_data[index].insulin_data[2].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_1>0?sub_item.amount_1:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0 && (
                            exist_insuline_data[index].insulin_data[2].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_2>0?sub_item.amount_2:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0 && (
                            exist_insuline_data[index].insulin_data[2].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_3>0?sub_item.amount_3:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>
                          {exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                            exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0 && (
                            exist_insuline_data[index].insulin_data[2].map(sub_item => {
                              if(sub_item.insulin>0){
                                return(
                                  <>
                                  <div>{sub_item.amount_4>0?sub_item.amount_4:0}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td>から</td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                          {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                          item.insulin_data[2] != undefined && item.insulin_data[2] != null && item.insulin_data[2].length >0 && (
                            item.insulin_data[2].map((sub_item, sub_index) => {
                              if(sub_item.insulin>0){
                                var same_flag = true;
                                if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                  exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0) {
                                  if (exist_insuline_data[index].insulin_data[2][sub_index] == undefined || exist_insuline_data[index].insulin_data[2][sub_index].insulin != sub_item.insulin){
                                    same_flag = false;
                                  }
                                }
                                return(
                                  <>
                                  <div className = {same_flag != true?'changed-area':''}>{insulin_injection_list[sub_item.insulin]}</div>
                                  </>
                                )
                              }
                            })
                          )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[2] != undefined && item.insulin_data[2] != null && item.insulin_data[2].length >0 && (
                              item.insulin_data[2].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0) {
                                    if (exist_insuline_data[index].insulin_data[2][sub_index] == undefined || exist_insuline_data[index].insulin_data[2][sub_index].amount_1 != sub_item.amount_1){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_1>0?sub_item.amount_1:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[2] != undefined && item.insulin_data[2] != null && item.insulin_data[2].length >0 && (
                              item.insulin_data[2].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0) {
                                    if (exist_insuline_data[index].insulin_data[2][sub_index] == undefined || exist_insuline_data[index].insulin_data[2][sub_index].amount_2 != sub_item.amount_2){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_2>0?sub_item.amount_2:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[2] != undefined && item.insulin_data[2] != null && item.insulin_data[2].length >0 && (
                              item.insulin_data[2].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0) {
                                    if (exist_insuline_data[index].insulin_data[2][sub_index] == undefined || exist_insuline_data[index].insulin_data[2][sub_index].amount_3 != sub_item.amount_3){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_3>0?sub_item.amount_3:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                          <td className={item == undefined?'changed-area':''} onClick={this.OpenInsulineModal.bind(this, item, index)} style={{cursor:'pointer'}}>
                            {item !=undefined && item.insulin_data != undefined && item.insulin_data.length>0 &&
                            item.insulin_data[2] != undefined && item.insulin_data[2] != null && item.insulin_data[2].length >0 && (
                              item.insulin_data[2].map((sub_item, sub_index) => {
                                if(sub_item.insulin>0){
                                  var same_flag = true;
                                  if (exist_insuline_data[index] != undefined && exist_insuline_data[index].insulin_data != undefined && exist_insuline_data[index].insulin_data.length > 0 &&
                                    exist_insuline_data[index].insulin_data[2] != undefined && exist_insuline_data[index].insulin_data[2] != null && exist_insuline_data[index].insulin_data[2].length >0) {
                                    if (exist_insuline_data[index].insulin_data[2][sub_index] == undefined || exist_insuline_data[index].insulin_data[2][sub_index].amount_4 != sub_item.amount_4){
                                      same_flag = false;
                                    }
                                  }
                                  return(
                                    <>
                                    <div className = {same_flag != true?'changed-area':''}>{sub_item.amount_4>0?sub_item.amount_4:0}</div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </td>
                        </tr>
                        </>
                      )}
                    </Table>
                    </>
                  )
                })
              )}
            </div>
          </div>
          {this.state.isOpenInsulinModal && (
            <InsulinManageModal
              patientInfo = {this.props.patientInfo}
              closeModal={this.closeModal}
              handleOk = {this.handleOk}
              selected_item = {this.state.selected_item}
              is_edit = {this.state.is_edit}
              from_source = "dr_karte"
              special = {true}
            />
          )}
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteInsulin.bind(this)}
              confirmTitle= {this.state.confirm_message}
              waring_message = {this.state.waring_message}
            />
          )}
        </Wrapper>          
      )}
}

InputInsulin.contextType = Context;

InputInsulin.propTypes = {        
    patientInfo:PropTypes.object,    
    handleOk:PropTypes.func,
    karte_data:PropTypes.object,
};

export default InputInsulin;