import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { formatJapanDate} from "~/helpers/date";
import Clock from 'react-digital-clock';
import {formatDateLine} from "~/helpers/date";
import AttentionHistoryModal from "~/components/templates/Dial/modals/AttentionHistoryModal";
import Checkbox from "~/components/molecules/Checkbox";
import axios from "axios";
import {textareaBreakStr} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  display: block;
  overflow: hidden;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 30px;
  width: 100%;
  max-height: 750px;
  overflow-y: auto;
  float: left;  
  label {
      text-align: right;
      width: 250px;
  }
  input {
    width: 300px;
    font-size: 12px;
  }
  .pattern_code {
    display: flex;
    margin-left: 20px;
    flex-wrap: wrap;
    .info-label {
      text-align: left;
      width: 150px;
    }
    .info-data {
        // width: 300px;
        width: calc(100% - 170px);
        font-size: 30px;
        padding: 0px 8px;
        color: blue;
    }
  }
  .date-show{
    .info-data {
        width: auto;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .wheelchair-today{
    text-align: right;
    margin-top: 5px;
    margin-right: 3.5rem;
    margin-bottom: 0px;
    margin-left: 20px;
    label{
      font-size: 24px;
    }
  }
  .foot {
    display: block;    
    margin-top: 20px;        
    // margin-bottom: 20px;
    text-align: center;
    button {
      text-align: center;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 15px;
    }

    button:hover {
      background: rgb(38, 159, 191);
    }

    .disable-btn {
      background: lightgray;
      span {
        color: rgb(84, 84, 84);
      }
    }
    .disable-btn:hover {
      background: lightgray !important;
    }
    
    span {
      color: white;
      font-size: 3rem;
      font-weight: 100;
    }
}
.unit-button {
  margin: 7px 0 0 5px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  button {
    background-color: rgb(208, 213, 214);
  }
}
.content {
    font-size: 35px;
    margin: 30px;
    text-align: center;
    // margin-left: 10%;
    // margin-bottom: 13%;
    // margin-top: 10%;
}
.digital-clock{
    span {
        color: black;
        font-size: 40px;
    }
}
.red-text {
    color: red !important;
    // font-weight: bold;
}

.black-text{
  color: black !important;
}

.attention{
  min-height: 8.5rem;
  .info-data{
    width: calc(100% - 170px);
    // width: calc(100% - 10rem);
    // overflow-x: auto;
    // word-break: keep-all;
    white-space: pre;
    // white-space: break-spaces;
    word-break: break-all;
    // height: 150px;
    // overflow-y: auto;
    // padding: 5px;
    font-size: 24px;
  }
}

.add-button{
  button{
    margin-right: 0px;
  }
  button:first-child{
    margin-right: 5rem;
  }
}

 `;

class PatientPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_diff: this.isChange(),
            isOpenAttentionHistoryModal: false,
            wheelchair_today: props.patientInfo !== undefined && props.patientInfo != null && props.patientInfo.wheelchair_today == 1 ? 1 : 0
        };
    }

    async componentDidMount() {
      // this.setState({
      //   wheel_chair: this.props.wheel_status
      // });
      // this.props.initWheeChair();
      let { data } = await axios.post(
      "/app/api/v2/dial/patient/getAttentionList",
        {
          params: {
            patient_number: this.props.patientInfo.id
          }
        }
      );
      this.setState({
          attentionList: data
      });

      let patient_wheelchair_today = await axios.post(
      "/app/api/v2/dial/schedule/patient/getWheelchairToday",
        {
          params: {
            schedule_number: this.props.patientInfo.schedule_number
          }
        }
      );      
      this.setState({
          wheelchair_today: patient_wheelchair_today.data
      });

    }   

    setWheelchairToday = async () => {
      // 本日車椅子無しフラグ反映
        await axios.post(
        "/app/api/v2/dial/schedule/patient/setWheelchairToday",
          {
            params: {
              schedule_number: this.props.patientInfo.schedule_number,
              wheelchair_today: this.state.wheelchair_today
            }
          }
        );
    } 

    calculateInfo = (strType) => {
        // strType: "weight" => 前体重 || 後体重
        // strType: "wheelchair" => 車椅子計測
        if (this.state.wheelchair_today == 1 && strType == "wheelchair_only") {
          // window.sessionStorage.setItem("alert_messages", "本日車椅子計測ができません。");
          return;
        }

        // 本日車椅子無しフラグ反映
        this.setWheelchairToday();
        this.props.calculateInfo(strType);
    };
    saveInfo = () => {
        // 本日車椅子無しフラグ反映
        this.setWheelchairToday();
        this.props.handleOk(this.state);
    };
    cancelInfo = () => {
        this.props.closeModal();
    };
    isChange () {
        if (formatDateLine(this.props.schedule_date) !== formatDateLine(new Date())){
            return true;
        }
        const today = new Date();
        const reserve_time = parseInt(this.props.patientInfo.time.substring(0,2))*60+parseInt(this.props.patientInfo.time.substring(3,5));
        return Math.abs(today.getHours() * 60 + today.getMinutes() - reserve_time) > 60;
    }

    openAttentionHistory = () => {
      this.setState({
        isOpenAttentionHistoryModal: true
      });
    }

    closeModal = () => {
      this.setState({
          isOpenAttentionHistoryModal: false,
      });
    };

    getWheelchairToday = async (name, value) => {
        if (name === "wheelchair_today")
            this.setState({wheelchair_today: value});        
    };

    onHide=()=>{}

    render() {
        let wheelchair_tooltip = ""
        if(this.state.wheelchair_today == 1){
            wheelchair_tooltip = "本日車椅子計測ができません。";
        }
        const { patientInfo} = this.props;
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal patient-popup-modal first-view-modal">
                <Modal.Body>
                    <Wrapper>
                        <div className="pattern_code date-show">
                            <div className="info-label">日付</div>
                            <div className={this.state.is_diff ? "info-data black-text" : "info-data black-text"}>{formatJapanDate(this.props.schedule_date)}</div>                            
                        </div>
                        <div className={`digital-clock`}>
                            <Clock />
                        </div>                        
                        <div className="pattern_code">
                            <div className="info-label">患者 ID :</div>
                            <div className="info-data">{patientInfo.id}</div>
                        </div>
                        <div className="pattern_code">
                            <div className="info-label">患者名 :</div>
                            <div className="info-data">{patientInfo.name}</div>
                        </div>
                          <div className="pattern_code attention">
                            {this.state.attentionList != null && this.state.attentionList != undefined && this.state.attentionList.length > 0 && (            
                              <>  
                                <div className="info-label">注意点 :</div>
                                <div className="info-data red-text" onClick={this.openAttentionHistory.bind(this)}>
                                  {textareaBreakStr(this.state.attentionList[0].attention)}
                                </div>
                              </>
                            )}
                          </div>
                        <div className="content">
                            この患者様の体重測定を行いますか？
                        </div>                        
                        <div className="foot">
                            <div className="add-button">
                                <Button onClick={()=>this.calculateInfo("weight")}>体重測定をする</Button>
                                <Button className={this.state.wheelchair_today == 1 ? "disable-btn" : ""} tooltip={wheelchair_tooltip} onClick={()=>this.calculateInfo("wheelchair_only")}>車椅子計測</Button>                                                                
                            </div>
                            {patientInfo.wheel_chair == 1 && (
                              <div className="wheelchair-today">
                                <Checkbox
                                  label="本日車椅子無し"
                                  getRadio={this.getWheelchairToday.bind(this)}
                                  value={this.state.wheelchair_today}
                                  name="wheelchair_today"
                                />
                              </div>
                            )}
                        </div>
                        {this.state.isOpenAttentionHistoryModal && (
                            <AttentionHistoryModal
                                modal_data={this.state.attentionList}
                                handleOk={this.handleAddAttention}
                                closeModal={this.closeModal}
                            />
                        )}
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.cancelInfo}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.saveInfo}>手入力</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

PatientPopup.contextType = Context;

PatientPopup.propTypes = {
    closeModal: PropTypes.func,
    calculateInfo: PropTypes.func,
    handleOk: PropTypes.func,
    patientInfo: PropTypes.object,
    schedule_date: PropTypes.string,
};

export default PatientPopup;
