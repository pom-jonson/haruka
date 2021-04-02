import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../../atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .react-datepicker-wrapper {
    width: 100%;
    .react-datepicker__input-container {
        width: 100%;
        input {
            font-size: 1rem;
            width: 100%;
            height: 38px;
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(206, 212, 218);
            border-image: initial;
            padding: 0px 8px;
        }
    } 
  }
  
  .radio-btn {
      margin-right: 0.3rem;
    label{
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin-right: 5px;
    padding: 0.25rem 0.6rem;
    font-size: 1rem;
  }
  }
  .search-box {
      width: 100%;
      height: 2.8rem;
      display: flex;
      .cur_date {
        padding-top: 8px;
        text-align: center;
        width: 100px;
      }
      .gender {
        display: flex;
        font-size: 1rem;
      }
      .period {
        display: flex;
        label {
            width: 0;
        }
        .pd-15 {
            padding: 8px 0 0 7px;
        }
        .w55 {
            width: 55px;
        }
      }
      .period div:first-child {
        .label-title {
            width: 70px;
            font-size: 1rem;
            text-align: right;
        }
      }
      .pullbox {
        .label-title {
            width: 70px;
            margin-right: 10px;
            text-align: right;
        }
        label {
            width: 100px;
            select {
                width: 100%;
            }
        }
      }
  }
  .table-area {
    height: calc(100% - 3rem);
    .date-area{
       overflow-y: auto;
       display: block;
    }
    .json-area{
        overflow-y: auto;
        display: block;
    }
    .selected{
        background:lightblue;
    }
    .date {
        cursor:pointer;
        margin: 0.5rem;
    }
    .item-no{
        width: 5%;
        text-align:right;
        padding-right: 0.3rem;
    }
    .item-content{
        text-align:left;
        padding-left: 0.3rem;
    }
    .item-amount{
        text-align:right;
        padding-right: 0.3rem;
    }

  }
  .check-out-btn {
    width: 80%;
    button {
        margin-top: 10px;
        height: 30px;
    }
  }
  .entry-name {
    width: 20%;
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 25vw;
  display: table-caption;
  position: absolute;
  top: 230px;
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
    font-size: 18px;
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
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent,  rp_index}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(rp_index, "rp_copy")}>Do処方[Rp単位]</div></li>
                    <li><div onClick={() => parent.contextMenuAction(rp_index, "set_copy")}>Do処方[処方箋]</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

const periodics = ["臨時","定期1", "定期2", "定期3"];

class MakePrescriptByHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            schVal: "",
            isOpenCodeModal: false,
            medicine_type: 2,
            time_limit_from:"",
            time_limit_to:"",
            entry_name: "",
            regular_prescription_number: 1,
            select_data:null,
            selected_date:"",
            isOpenRegisterConfirm: false,
            confirm_message:"",
            is_loaded: false,
            date_data: []
        }
    }

    async UNSAFE_componentWillMount(){
        let path = "/app/api/v2/dial/schedule/prescription_search";
        let post_data = {
            patient_id:this.props.system_patient_id,
            end_date:this.props.schedule_date
        };
        await apiClient.post(path, {params: post_data}).then((res)=>{
            let date_data = [];
            if(res != null && res.length >0){
                res.map(item=>{
                    if(date_data[item.regular_prescription_number] === undefined){
                        date_data[item.regular_prescription_number] = [];
                    }
                    if (date_data[item.regular_prescription_number].indexOf(item.schedule_date)==-1){
                        date_data[item.regular_prescription_number].push(item.schedule_date);
                    }
                });
            }
            this.setState({
                table_data:res,
                date_data,
                is_loaded: true
            });
        });
    }

    getPrescriptionSelect = e => {
        this.setState({ display_order: parseInt(e.target.id) });
    };
    createCode = () => {
        this.setState({isOpenCodeModal: true});
    }
    closeModal = () => {
        this.setState({isOpenCodeModal: false})
    }

    selectMedicineType = (e) => {
        this.setState({ medicine_type: parseInt(e.target.value)});
    };

    getStartdate = value => {
        this.setState({time_limit_from: value})
    };

    getEnddate = value => {
        this.setState({time_limit_to: value})
    };
    getInputMan = e => {
        this.setState({entry_name: e.target.value})
    };
    changePeriodic = (value) => {
        this.setState({
            regular_prescription_number: value,
            selected_date:"",
            data_json: null    
        });
    };
    showHistory = (item) =>{
        let {table_data}=this.state;
        let filtered_item = table_data.find(x=>(x.regular_prescription_number == this.state.regular_prescription_number && x.schedule_date == item));
        
        this.setState({
            selected_date:item,
            data_json:filtered_item != undefined && filtered_item != null ? filtered_item.data_json : null
        });
    };
    selectRp = (item,index) => {
        this.props.handleOk(item,1);
        this.setState({
            selectedRp:item,
            sel_rp_index:index,
        });
    }
    openRegisterConfirmModal = () =>{
        var base_modal = document.getElementsByClassName("make-prescript-history-modal")[0];
        if(base_modal !== undefined && base_modal != null)
            base_modal.style['z-index'] = 1040;
        if (this.state.selectedRp == undefined || this.state.selectedRp == null){
            this.setState({
                alert_messages:"Rpを選択してください。"
            });
            return;
        }
        this.setState({
            isOpenRegisterConfirm: true,
            confirm_message:"登録しますか？"
        })
    }
    closeAlertModal= () => {
        this.setState({
            alert_messages:""
        });
        var base_modal = document.getElementsByClassName("make-prescript-history-modal")[0];
        if(base_modal !== undefined && base_modal != null)
            base_modal.style['z-index'] = 1050;
    }

    confirmCancel = () => {
        this.setState({
            isOpenRegisterConfirm: false,
            confirm_message:""
        });
        var base_modal = document.getElementsByClassName("make-prescript-history-modal")[0];
        if(base_modal !== undefined && base_modal != null)
            base_modal.style['z-index'] = 1050;
    };

    registerRp = () => {
        this.confirmCancel();
        this.props.handleOk(this.state.selectedRp);
    };

    handleClick = (e, rp_index) => {
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
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX - document.getElementById("make-prescript-history-modal").offsetLeft,
                    y: e.clientY + window.pageYOffset - document.getElementById("make-prescript-history-modal").offsetTop - 50,
                },
                rp_index: rp_index,
            });
        }
    };

    contextMenuAction = (rp_index, type) => {
        if (type === "rp_copy"){
            this.props.handleOk(this.state.data_json[rp_index],1)
        } else if (type === "set_copy"){
            this.props.handleOk(this.state.data_json,0);
        }
    };

    render() {
        const { closeModal } = this.props;
        let {data_json, selected_date, date_data, regular_prescription_number, is_loaded}=this.state;
        return  (
            <Modal show={true} className="wordPattern-modal master-modal make-prescript-history-modal" id="make-prescript-history-modal">
                <Modal.Header>
                    <Modal.Title>履歴から処方作成</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                      {is_loaded ? (
                       <>
                        <div className="search-box">
                            <div className="gender">
                                {periodics.map((item, key)=>{
                                    return (
                                        <>
                                            <RadioButton
                                                id={`history_periodic_${key}`}
                                                value={key}
                                                label={item}
                                                name="history_periodic"
                                                getUsage={this.changePeriodic.bind(this, key)}
                                                checked={this.state.regular_prescription_number === key}
                                            />
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={'table-area d-flex w-100'}>
                            <div className="date-area w-25 h-100 border">
                              {date_data.length == 0 ? (
                                <div className="text-center">登録された履歴がありません。</div>
                              ):(
                                <>
                                  {date_data != undefined && date_data != null && date_data[regular_prescription_number] != null &&
                                      date_data[regular_prescription_number].length >0 && date_data[regular_prescription_number].map((item,index)=>{
                                      return (
                                          <div key={index} onClick={this.showHistory.bind(this, item)} className={selected_date == item ? "selected date" : "date"}>
                                              {item}
                                          </div>
                                      )
                                  })}
                                </>
                              )}
                            </div>
                            <div className="json-area w-75 h-100 ml-2 border">
                                <div className="w-100 d-flex title border-bottom">
                                    <div className="item-no text-center border-right" style={{width:"5%"}}>No</div>
                                    <div className="item-content text-center border-right" style={{width:"70%"}}>処方内容</div>
                                    <div className="item-amount text-center" style={{width:"15%"}}>数量</div>
                                </div>
                                {selected_date != "" ? (
                                  <>
                                    {data_json != null && data_json.length > 0 && data_json.map((item, rp_index)=>{
                                        return (<div key={item} onDoubleClick={this.selectRp.bind(this,item, rp_index)} onContextMenu={e => this.handleClick(e,rp_index)}
                                        className={this.state.sel_rp_index==rp_index?"selected":""} style={{cursor:"pointer"}}>
                                        {item.medicines.length > 0 && item.medicines.map((medi_item, medi_index)=>{
                                            return (
                                                <>
                                                <div key={medi_item} className="w-100 d-flex border-bottom">
                                                    <div className="item-no border-right" style={{width:"5%"}}>{medi_index==0?rp_index+1 + ")":""}</div>
                                                    <div className="item-content border-right pl-1" style={{width:"70%"}}>{medi_item.item_name}</div>
                                                    <div className="item-amount text-right pl-1">{medi_item.amount}{medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}</div>
                                                </div>
                                                </>
                                            )
                                        })}
                                        <div className="w-100 d-flex border-bottom">
                                            <div className="item-no border-right" style={{width:"5%"}}>{' '}</div>
                                            <div className="item-content border-right" style={{width:"70%"}}>
                                                {item.usage_name}
                                                {item.days !== undefined && item.days !== null && item.disable_days_dosing == 0? 
                                                    "("+item.days+(item.prescription_category === "頓服"? "回分)" : "日分)") : ""}
                                            </div>
                                            <div className="item-amount" ></div>
                                        </div>
                                        </div>)
                                    })}
                                  </>  
                                ) : (
                                  <div className="w-100 text-center" style={{padding: "7rem"}}>日付を選択してください。</div>
                                )}
                            </div>
                        </div>
                       </> 
                      ): (
                        <div className='text-center'>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                        </div>
                      )}
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
                </Modal.Footer>
                {this.state.isOpenRegisterConfirm !== false && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.registerRp.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
                {this.state.alert_messages != undefined && this.state.alert_messages != null && this.state.alert_messages !== "" && (
                    <SystemAlertModal
                        hideModal= {this.closeAlertModal.bind(this)}
                        handleOk= {this.closeAlertModal.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                    />
                )}
                <ContextMenu
                    {...this.state.contextMenu}
                    parent={this}
                    rp_index={this.state.rp_index}
                    medi_index={this.state.medi_index}
                />
            </Modal>
        );
    }
}

MakePrescriptByHistory.contextType = Context;

MakePrescriptByHistory.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    system_patient_id:PropTypes.number,
    schedule_date:PropTypes.string,
};

export default MakePrescriptByHistory;
