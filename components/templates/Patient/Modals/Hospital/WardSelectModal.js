import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as apiClient from "~/api/apiClient";
import {formatDateFull} from "~/helpers/date";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";

const Wrapper = styled.div`  
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  .radio-btn{
    label{
      font-size:18px;
    }
  }
  .label-title{
      font-size:18px;
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
  }  
  p{
      cursor:pointer;
  }
  .area-1 {
    width: 32%;
    border:1px solid black;
    margin-right: 10px;
    height: 100%;
    p {
        margin: 0;
        padding-left: 5px; 
    }
    p:hover {
        background-color: rgb(246, 252, 253);
    }
    height: 100%;
    overflow-y:auto;
    .title{
      text-align: center;
      font-size: 1rem;
      font-weight: bold;
      background-color: #a0ebff;
      margin-bottom: 0.5rem;
    }
    .no-beds {
      color: red;
    }
    .no-result {
      padding-top: 40%;
      padding-left:0.5rem;
      padding-right:0.5rem;
      text-align: center;
      p {
        padding: 0.5rem;;
        border: 2px solid #aaa;
      }
    }
  }
    .selected, .selected:hover{
        background:lightblue!important;      
    }
    .discharge-bed{
      color: green;
    }
 `;

class WardSelectModal extends Component {
  constructor(props) {
    super(props);
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.hospital_decision_bed = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.hospital_decision_bed !== undefined){
      this.hospital_decision_bed = initState.conf_data.hospital_decision_bed;
    }
    this.state = {
      selected_ward_number: 0,
      selected_room_number: "",
      selected_staff_number: "",
      selected_ward_name: "",
      selected_room_name: "",
      selected_bed_name: "",
      alert_messages:'',
      ward_data: [],
      room_data: [],
      bed_data: [],
      using_beds: [],
      discharge_beds: [],
      check_message: ''
    }
  }
  async UNSAFE_componentWillMount () {
    await this.getUsableBeds();
  }

  async componentDidMount() {
    this.getWardData();
    this.getRoomFromWard();
  }

  getWardData = () => {
    let data = this.props.ward_master;
    if (data != undefined && data != null && data.length>0){
      this.setState({
        ward_data:data,
        // selected_ward_name:data[0].name
      })
    }

  }
  getUsableBeds = async () => {
    if (this.props.hospital_date == null || this.props.hospital_date == undefined || this.props.hospital_date == '') return;
    let path = "/app/api/v2/master/hospitalization/getUsableBeds";
    let post_data = {hospital_date: formatDateFull(this.props.hospital_date, "-")};
    await apiClient._post(path,{params:post_data}).then((res) => {
        this.setState({
          using_beds: res.using_beds,
          discharge_beds: res.discharge_beds
        });
      })
    .catch(() => {
    });
  }
  confirmCancel() {
    this.setState({alert_messages: ""});
    var base_modal = document.getElementsByClassName("add-contact-modal")[0];
    if(base_modal !== undefined && base_modal != null)
      base_modal.style['z-index'] = 1050;
  }

  selectWard = (item) => {
    this.setState({
      selected_ward_number:item.number,
      selected_ward_name:item.name,
      selected_ward:item,
      selected_room_name:"",
      selected_bed_name:"",
    });
    this.getRoomFromWard(item.number);
  };

  getRoomFromWard = (number = undefined) => {
    let room_data = [...this.props.room_master];
    if (room_data != null && room_data.length >0){
      room_data = room_data.filter(x=>x.ward_id== number);
      if (room_data != undefined && room_data != null && room_data.length > 0) {
        room_data = this.getUsableRoom(room_data);
      }
      this.setState({room_data});
    }
  };
  
  getUsableRoom = (room_data) => {
    let bed_data = [...this.props.hospital_bed_master];
    let {using_beds} = this.state;
    let {use_beds} = this.props;
    if(use_beds === undefined || use_beds == null){use_beds = [];}
    room_data.map(item=>{
      if (bed_data != null && bed_data.length > 0) {
        let findIndex = bed_data.findIndex(x=>(x.hospital_room_id == item.number && !using_beds.includes(x.number) && !use_beds.includes(x.number)));
        if (findIndex == -1) {
          item.no_beds = 1;
        }
      }
    });
    return room_data;
  }
  
  getBedFromRoom = (number = undefined) => {
    let bed_data = [...this.props.hospital_bed_master];
    let {using_beds} = this.state;
    let {use_beds} = this.props;
    if(use_beds === undefined || use_beds == null){use_beds = [];}
    if (bed_data != null && bed_data.length > 0) {
      bed_data = bed_data.filter(x=>(x.hospital_room_id== number && !using_beds.includes(x.number) && !use_beds.includes(x.number)));
      this.setState({bed_data});
    }
  };

  selectRoom = (item) => {
    this.setState({
      selected_room_number:item.number,
      selected_room_name:item.name,
      selected_room:item,
      selected_bed_name:""
    });
    this.getBedFromRoom(item.number);
  };
  selectBed = (item) => {
    this.setState({
      selected_bed_number:item.number,
      selected_bed_name:item.name,
      selected_bed:item
    });
  };

  saveBody = () => {
    var base_modal = document.getElementsByClassName("add-contact-modal")[0];
    if (this.state.selected_ward_name == ""){
      if(base_modal !== undefined && base_modal != null)
        base_modal.style['z-index'] = 1040;
      this.setState({alert_messages:"病棟を選択してください。"});
      return;
    }
    if (this.state.selected_room_name == ""){
      if(base_modal !== undefined && base_modal != null)
        base_modal.style['z-index'] = 1040;
      this.setState({alert_messages:"病室を選択してください。"});
      return;
    }
    let bed_check_flag = false;
    if(this.props.from_modal == "karte_do_hospital" || this.props.from_modal == "hospitalized_setting"){
      bed_check_flag = true;
    }
    if(this.props.from_modal == "hospital_application" && this.hospital_decision_bed == 1){
      bed_check_flag = true;
    }
    if (bed_check_flag && this.state.selected_bed_name == ""){
      if(base_modal !== undefined && base_modal != null)
        base_modal.style['z-index'] = 1040;
      this.setState({alert_messages:"病床を選択してください。"});
      return;
    }
    this.props.handleOk(this.state.selected_ward, this.state.selected_room, this.state.selected_bed_name == "" ? null : this.state.selected_bed);
  };

  getOrderSelect = e => {                 //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getWardData();
    });
  };
  closeValidateAlertModal= () => {
    this.setState({check_message: ''});
  }
  modalBlack(){
    var base_modal = document.getElementsByClassName("add-contact-modal")[0];
    if(base_modal !== undefined && base_modal != null)
        base_modal.style['z-index'] = 1040;
  }
  modalBlackBack(){
    var base_modal = document.getElementsByClassName("add-contact-modal")[0];
    if(base_modal !== undefined && base_modal != null)
        base_modal.style['z-index'] = 1050;
  }

  onHide=()=>{}

  render() {
    const { closeModal } = this.props;
    let {ward_data, room_data,bed_data, discharge_beds } = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="add-contact-modal">
        <Modal.Header>
          <Modal.Title>{this.props.MasterName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
              <div className="area-1">
                <div className={`title w-100`}>病棟</div>
                {ward_data != undefined && ward_data.length>0 && (
                  ward_data.map((item) => {
                    return (
                      <>
                        <p className={item.number==this.state.selected_ward_number?"selected":""}
                           onClick = {this.selectWard.bind(this, item)}>{item.name}</p>
                      </>
                    )
                  })
                )}
              </div>
              <div className="area-1">
                <div className={'w-100 title'}>病室</div>
                {room_data != undefined && room_data.length>0 && (
                  room_data.map(item => {
                    return (
                      <p className={`${item.number==this.state.selected_room_number?"selected":""} ${item.no_beds == 1 ? 'no-beds' : ''}`}
                         key = {item.number} onClick = {this.selectRoom.bind(this, item)}>{item.name}</p>
                    )
                  })
                )}
              </div>
              <div className="area-1">
                <div className={'w-100 title'}>病床</div>
                {bed_data != undefined && bed_data.length>0 ? (
                  bed_data.map(item => {
                    return (
                      <p className={`${item.number==this.state.selected_bed_number?"selected":""} ${discharge_beds.includes(item.number) ? "discharge-bed" : ""}`}
                         key = {item.number} onClick = {this.selectBed.bind(this, item)}>{item.name}</p>
                    )
                  })
                ):(
                  <div className="no-result" style={{cursor:"auto"}}><p>選択できる病床がありません。</p></div>
                )}
              </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.saveBody.bind(this)}>登録</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

WardSelectModal.contextType = Context;

WardSelectModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  MasterName:PropTypes.string,
  hospital_date:PropTypes.string,
  ward_master:PropTypes.array,
  room_master:PropTypes.array,
  hospital_bed_master:PropTypes.array,
  from_modal:PropTypes.string,
  use_beds:PropTypes.string,
};

export default WardSelectModal;
