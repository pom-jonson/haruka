import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import axios from "axios/index";
import {formatJapanDateSlash} from "~/helpers/date"
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
    display: block;
    font-size: 1.125rem;
    width: 100%;
    height: 100%;
    .inline-flex {
        display: inline-flex;
        border-bottom: 1px solid gray;
     }
     .fl {
        float: left;
     }
    .flex {
        display: flex;
     }
    .calendar-area {
      margin: auto;
      width: 100%;
      height: 100%;
      .wrapper {
        position: relative;
        overflow: auto;
        border: 1px solid #aaa;
        white-space: nowrap;
        width: 100%;
      }
      table {
        width: auto;
        margin-bottom:0;
        font-size: 1rem;
        td {
          padding:0;
          vertical-align: middle;
          min-width: 7rem;
        }
      }
      .sticky-col {
        position: sticky;
        position: -webkit-sticky;
        background-color: white;
        padding: 0;
        background-color: gainsboro;
        div {
          padding:0 0.2rem;
        }
      }
      .tr-title {
        width: 11rem;
        min-width: 11rem;
        max-width: 11rem;
        left: 0px;
        line-height: 1.5rem;
        div{
          width: 11rem;
          min-width: 11rem;
          max-width: 11rem;
          text-align: center;
        }
      }
      .td-div-border {
        border-right:1px solid #dee2e6;
        height:1.5rem;
        width:100%;
        padding:0 0.2rem;
      }
    }
`;

const dilution_timings = ["前補液", "後補液"];

class DewaterHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          history_data:[],
        };
        this.data_names = {
          diagonosis_time: '透析時間',
          drainage_time: '除水時間',
          blood_flow: '血液流量',
          dialysate_amount: '透析液流量',
          degree: '透析液温度',
          dilution_timing: '前補液/後補液の選択',
          fluid_amount: '補液量',
          fluid_speed: '補液速度',
          fluid_time: '補液時間',
          fluid_temperature: '補液温度',
          hdf_init_time: 'I-HDF 補液開始時間',
          hdf_init_amount: 'I-HDF 1回補液量',
          hdf_step: 'I-HDF 補液間隔',
          hdf_speed: 'I-HDF 1回補液速度',
          target_weight: '本日目標体重',
          fluid: '補液',
          supplementary_food: '補食',
          target_water_removal_amount: '総除水量設定',
          drainage_speed: '除水速度',
          max_drainage_amount: '最大除水量',
          max_drainage_speed: '最大除水速度',
        };
        this.data_align = {
          diagonosis_time: 'left',
          drainage_time: 'left',
          blood_flow: 'right',
          dialysate_amount: 'right',
          degree: 'right',
          dilution_timing: 'left',
          fluid_amount: 'right',
          fluid_speed: 'right',
          fluid_time: 'left',
          fluid_temperature: 'right',
          hdf_init_time: 'right',
          hdf_init_amount: 'right',
          hdf_step: 'right',
          hdf_speed: 'right',
          target_weight: 'right',
          fluid: 'right',
          supplementary_food: 'right',
          target_water_removal_amount: 'right',
          drainage_speed: 'right',
          max_drainage_amount: 'right',
          max_drainage_speed: 'right',
        };
        let dial_common_config = JSON.parse(
          window.sessionStorage.getItem("init_status")
        ).dial_common_config; 
        this.pattern_fixed = {};
        if (
          dial_common_config !== undefined &&
          dial_common_config != null &&
          dial_common_config["小数点以下桁数：除水設定画面"] !== undefined
        ) {
          this.pattern_fixed = dial_common_config["小数点以下桁数：除水設定画面"];
        }
        this.pattern_fixed['prevTimeWeight'] =this.pattern_fixed != null && this.pattern_fixed['prevTimeWeight'] != undefined ? this.pattern_fixed['prevTimeWeight']['value'] : 1;
        this.pattern_fixed['dw'] =this.pattern_fixed != null &&  this.pattern_fixed['dw'] != undefined ? this.pattern_fixed['dw']['value'] : 1;
        this.pattern_fixed['weight_before'] =this.pattern_fixed != null &&  this.pattern_fixed['weight_before'] != undefined ? this.pattern_fixed['weight_before']['value'] : 1;
        this.pattern_fixed['increase_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['increase_amount'] != undefined ? this.pattern_fixed['increase_amount']['value'] : 1;
        this.pattern_fixed['weight_after'] =this.pattern_fixed != null &&  this.pattern_fixed['weight_after'] != undefined ? this.pattern_fixed['weight_after']['value'] : 1;
        this.pattern_fixed['target_weight'] =this.pattern_fixed != null &&  this.pattern_fixed['target_weight'] != undefined ? this.pattern_fixed['target_weight']['value'] : 1;
        this.pattern_fixed['fluid'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid'] != undefined ? this.pattern_fixed['fluid']['value'] : 1;
        this.pattern_fixed['fluid_speed'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid_speed'] != undefined ? this.pattern_fixed['fluid_speed']['value'] : 2;
        this.pattern_fixed['fluid_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['fluid_amount'] != undefined ? this.pattern_fixed['fluid_amount']['value'] : 2;
        this.pattern_fixed['max_drainage_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['max_drainage_amount'] != undefined ? this.pattern_fixed['max_drainage_amount']['value'] : 2;
        this.pattern_fixed['max_drainage_speed'] =this.pattern_fixed != null &&  this.pattern_fixed['max_drainage_speed'] != undefined ? this.pattern_fixed['max_drainage_speed']['value'] : 2;
        this.pattern_fixed['supplementary_food'] =this.pattern_fixed != null &&  this.pattern_fixed['supplementary_food'] != undefined ? this.pattern_fixed['supplementary_food']['value'] : 2;
        this.pattern_fixed['actualDrainage'] =this.pattern_fixed != null &&  this.pattern_fixed['actualDrainage'] != undefined ? this.pattern_fixed['actualDrainage']['value'] : 2;
        this.pattern_fixed['today_water_removal_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['today_water_removal_amount'] != undefined ? this.pattern_fixed['today_water_removal_amount']['value'] : 2;
        this.pattern_fixed['target_water_removal_amount'] =this.pattern_fixed != null &&  this.pattern_fixed['target_water_removal_amount'] != undefined ? this.pattern_fixed['target_water_removal_amount']['value'] : 2;
        this.pattern_fixed['drainage_speed'] =this.pattern_fixed != null &&  this.pattern_fixed['drainage_speed'] != undefined ? this.pattern_fixed['drainage_speed']['value'] : 2;
    }

    componentDidMount() {
        this.getHistoryData();
    }

    getHistoryData = async () => {
        if(this.state.patientInfo !== ''){
            let path = "/app/api/v2/dial/schedule/getDewaterHistory";
            let post_data = {
                system_patient_id: this.props.system_patient_id,
                schedule_number: this.props.schedule_number
            };
            const { data } = await axios.post(path, {params: post_data});
            this.setState({
                history_data: data,
            });
        }
    };

    render() {
        const { closeModal } = this.props;
        return  (
            <Modal
                show={true}                
                id="add_contact_dlg"
                className="master-modal dewater-history-modal"
            >
                <Modal.Header>
                    <Modal.Title>{'履歴'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                      <div className={'calendar-area flex'}>
                        <div className="wrapper">
                          <table className="table-scroll table table-bordered" id="code-table">
                            <tbody>
                              {this.state.history_data !== undefined && this.state.history_data !== null && Object.keys(this.state.history_data).length > 0 && (
                                <>
                                  <tr>  
                                    <td className="sticky-col tr-title">
                                      <div className="td-div-border">変更日</div>
                                    </td>
                                    {Object.keys(this.state.history_data).map(date=>{
                                      return (
                                      <>
                                        <td colSpan={Object.keys(this.state.history_data[date]).length}>
                                          <div className="td-div-border">{formatJapanDateSlash(date)}</div>
                                        </td>
                                      </>
                                      )
                                    })}
                                  </tr>
                                  <tr>  
                                    <td className="sticky-col tr-title">
                                      <div className="td-div-border">変更時刻</div>
                                    </td>
                                    {Object.keys(this.state.history_data).map(date=>{
                                      return (
                                      <>
                                        {Object.keys(this.state.history_data[date]).map(time=>{
                                          return (
                                            <>
                                              <td>
                                                <div className="td-div-border">{time}</div>
                                              </td>
                                            </>
                                          )
                                        })}
                                      </>
                                      )
                                    })}
                                  </tr>
                                  {Object.keys(this.data_names).map(key=>{
                                    return (
                                      <>
                                        <tr>  
                                          <td className="sticky-col tr-title">
                                            <div className="td-div-border">{this.data_names[key]}</div>
                                          </td>
                                          {Object.keys(this.state.history_data).map(date=>{
                                            return (
                                            <>
                                              {Object.keys(this.state.history_data[date]).map(time=>{
                                                return (
                                                  <>
                                                    <td style={{textAlign:this.data_align[key]}}>
                                                      <div className="td-div-border">{key === 'dilution_timing' ? dilution_timings[this.state.history_data[date][time][key]] : 
                                                      (this.state.history_data[date][time][key] != null && this.state.history_data[date][time][key] != "" && this.pattern_fixed[key] != undefined ?
                                                        (!isNaN(parseFloat(this.state.history_data[date][time][key])) ?
                                                      parseFloat(this.state.history_data[date][time][key]).toFixed(this.pattern_fixed[key]): ''): this.state.history_data[date][time][key])}</div>
                                                    </td>
                                                  </>
                                                )
                                              })}
                                            </>
                                            )
                                          })}
                                        </tr>
                                      </>
                                    )
                                  })}
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

DewaterHistoryModal.contextType = Context;

DewaterHistoryModal.propTypes = {
    closeModal:PropTypes.func,
    system_patient_id:PropTypes.number,
    schedule_number:PropTypes.number,
};

export default DewaterHistoryModal;
