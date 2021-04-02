import React, { Component } from "react";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import HeartInputModal from "../modals/HeartInputModal";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code} from "~/helpers/dialConstants";
import $ from "jquery";

const Wrapper = styled.div`
  padding:1.25rem 0.625rem;  
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  
  .text-left{
    text-align:left;
  }
  .text-right{
    text-align:right;
  }
  .text-center{
    text-align:center;
  }
  .label-title{
    width:6.25rem;
    font-size:1.25rem;
    text-align:right;
    margin-right:0.625rem;      
  }
  .pullbox-select{
    width:12.5rem;
    font-size:1rem;
  }

  .content{        
    margin-top: 0.625rem;    
    // border:1px solid lightgrey;
    width: 100%;
    overflow-y: auto;
    float: left;
    margin-bottom: 1.25rem;
  }
  table {
    thead{
        display:table;
        width:100%;
    }
    tbody{
        display:block;
        overflow-y: auto;
        height: calc( 100vh - 20rem);
        width:100%;
    }
    tr{
        display: table;
        width: 100%;
    }
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
          width: 4.375rem;
      }
      .item-no {
        width: 3.125rem;
      }
      .code-number {
          width: 7.5rem;
      }
      .name{
          width:8rem;
      }
  }
  
  .footer {
      margin-top: 0.625rem;
      text-align: center;
      button {
        text-align: center;
        border-radius: 0.25rem;
        background: rgb(105, 200, 225); 
        border: none;
        margin-right: 1.875rem;
        padding-left: 2.5rem;
        padding-right: 2.5rem;   
      }
      
      span {
        color: white;
        font-size: 1.25rem;
        font-weight: 100;
      }
  }
  .selected {
       color: blue;
  }
  .flex {
    display: flex;
  }
 `;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 6.25rem;
  margin-left: 33vw;
  display: table-caption;
  position: absolute;
  top: 15rem;
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
    // padding: 0 1.25rem;
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

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType)}>編集</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class HeartIndividualBody extends Component {
    constructor(props) {
        super(props);
        let code_master = sessApi.getObjectValue("dial_common_master","code_master");
        var timingData = code_master['実施タイミング'];
        this.state={
            table_data:[],
            isOpenModal: false,
            patientInfo: '',
            system_patient_id: '',
            timing_codes:makeList_code(timingData),
        };
        this.double_click=false;
    }
    async componentDidMount() {
        this.setState({
            system_patient_id: (this.props.patientInfo != undefined && this.props.patientInfo != null) ?this.props.patientInfo.system_patient_id : '',
            patientInfo: (this.props.patientInfo != undefined && this.props.patientInfo != null) ? this.props.patientInfo : '',
        }, ()=>{
            this.getList().then(()=>{
                this.setState({
                    isLoaded: true,
                });
            });
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.patientInfo != undefined && nextProps.patientInfo != null){
            this.setState({
                system_patient_id: nextProps.patientInfo.system_patient_id,
                patientInfo: nextProps.patientInfo
            },()=>{
                this.getList();
            });
        }
    }

    async getList () {
        if(this.state.system_patient_id > 0){
            let path = "/app/api/v2/dial/medicine_information/heart/list";
            let post_data = {
                system_patient_id: this.state.system_patient_id
            };
            await apiClient.post(path, {params: post_data}).then((data)=>{
                this.setState({
                    table_data: data,
                });
            });
        }
    }

    handleInsert = () => {
        this.setState({
            isOpenModal: true
        });
    };

    handlePreview = () => {

    };

    inputValue = (index) => {
      if (this.props.type == 'modal') return;
        this.setState({
            isOpenModal: true,
            modal_data: this.state.table_data[index]
        });
    };
    closeModal = () => {
        this.setState({isOpenModal: false});
    };

    handleOk = (input_val) => {
        this.register(input_val).then(()=>{
            if(this.props.type === 'modal'){
                this.props.handleOk();
            }
            this.getList();
        });
        this.setState({isOpenModal: false});
    };

    async register(input_val)  {
        let path = "/app/api/v2/dial/medicine_information/heart/register";
        if (this.double_click == true) return;
        this.double_click = true;
        let params = [];
        input_val["update_flag"] = 1;
        params.push(input_val);
        await apiClient.post(path, {
            params,
        }).finally(()=>{
            this.double_click=false;
        });
    }

    handleClick = (e, index) => {
      if (this.props.type == 'modal') return;
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
            var x_offset = 190;
            var y_offset = 70;
            if (this.props.type == 'modal'){
              x_offset = $('#heart-body').offset().left;
              y_offset = $('#heart-body').offset().top;
            }            
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX - x_offset,
                    y:  e.clientY - y_offset
                },
                favouriteMenuType: index
            });
        }
    };

    contextMenuAction = (index) => {
        this.inputValue(index);
    };

    convertDecimal = (_val, _digits) => {
        if (isNaN(parseFloat(_val))) return "";
        return parseFloat(_val).toFixed(_digits);
    }

    render() {
        const { table_data} = this.state;
        const isLoaded = this.state.isLoaded;

        return (
          <>
            <Wrapper
              className={
                this.props.type != undefined &&
                this.props.type != null &&
                this.props.type === "modal" ? "modal-wrapper" : ""
              }
            >
              <div className="content">
                {isLoaded ? (
                  <table className="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th className="code-number">日付</th>
                        <th className="name">心臓</th>
                        <th className="name">胸郭</th>
                        <th className="name">心胸比</th>
                        <th className="name">透析前後</th>
                        <th className="name">体重</th>
                        <th>コメント</th>
                      </tr>
                    </thead>
                    <tbody id = 'code-table'>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 &&
                        table_data.map((item, index) => {
                          var before_or_after = "";
                          if (item.dial_status != undefined && item.dial_status != null) {
                            if (item.dial_status == 1) before_or_after = "後";
                            else before_or_after = "前";
                          } else {
                            if (this.state.timing_codes[item.timing_code] =="透析終了後" || this.state.timing_codes[item.timing_code] =="透析終了時") before_or_after = "後";
                            else before_or_after = "前";
                          }
                          return (
                            <>
                              <tr key={index} onContextMenu={(e) =>this.handleClick(e, index)}>
                                <td className="code-number">
                                  {item.schedule_date}
                                </td>
                                <td className="name" style={{textAlign:"right"}}>{item.heart}</td>
                                <td className="name" style={{textAlign:"right"}}>{item.thorax}</td>
                                <td className="name" style={{textAlign:"right"}}>{item.chest_ratio}</td>
                                <td className="name">{before_or_after}</td>
                                {/* <td className="text-center">{(item.dial_status !== undefined && item.dial_status === 1) ? "後" : ((item.dial_status !== undefined && item.dial_status === 0) ? '前' : '')}</td> */}
                                <td className="name" style={{textAlign:"right"}}>
                                  {item.dial_status !== undefined && item.dial_status === 1 ? this.convertDecimal(item.weight_after, 1)
                                    : this.convertDecimal(item.weight_before, 1)}
                                </td>
                                {/* <td className="text-center"t>{timing_codes[item.timing_code] == '透析終了後'?"後":'前'}</td>
                                            <td className="text-center">{timing_codes[item.timing_code] == '透析終了後'?item.weight_after:item.weight_before}</td> */}
                                <td>{item.comment}</td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center">
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                )}
              </div>
            </Wrapper>
            {this.state.isOpenModal && this.state.system_patient_id !== "" && (
              <HeartInputModal
                handleOk={this.handleOk}
                closeModal={this.closeModal}
                modal_data={this.state.modal_data}
                system_patient_id={this.state.system_patient_id}
              />
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
            />
          </>
        );
    }
}

HeartIndividualBody.contextType = Context;

HeartIndividualBody.propTypes = {
    patientInfo: PropTypes.array,
    type: PropTypes.string,
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
};

export default HeartIndividualBody