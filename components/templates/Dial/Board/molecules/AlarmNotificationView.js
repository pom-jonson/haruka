import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import {formatTimeIE} from "../../../../../helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import * as methods from "~/components/templates/Dial/DialMethods";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 400px;
  overflow-y: auto;
  flex-direction: column;
  display: flex;
  text-align: center;
  .footer {
    margin-top: 15px;
    text-align: center;
    width:100%;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      padding-left: 60px;
      padding-right: 60px;   
      margin-right:10px; 
    }
    .add-button {
      text-align: center;      
    }
    span {
      color: white;
      font-size: 16px;
      letter-spacing: 7px;
      margin-left:4px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}

.no-result {
      padding: 150px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
.table_area {
  height: 50vh;
      width: 100%;
    overflow-y: auto;
  }
      .sheet_button{
        margin-left: 20px;        
        opacity: 0.5;
    }
    .selected.sheet_button{
        opacity: 1;
        border: 2px dotted;
    }
table {
    overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          font-size: 16px;
          padding: 0.25rem;
      }
      th {
          font-size: 16px;
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 40px;
      }
      .item-no {
        width: 30px;
      }
      .code-number {
          width: 120px;
      }
      .alarm-type {
          text-align:left;
      }
  }
 `;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 33vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class AlarmNotificationView extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
        is_loaded: this.props.is_loaded,
        list_item:this.props.list_item,
    };
  }

  componentDidMount(){
    this.getStaffs();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
      if(this.state.is_loaded !== nextProps.is_loaded){
          this.setState({
              is_loaded: nextProps.is_loaded,
              list_item:nextProps.list_item,
          });
      }
  }

  getComment = (index, e) => {
    var temp = this.state.list_item;
    temp[index].comment = e.target.value;
    this.setState({list_item:temp});
    this.props.changeData();
  }

  getRadio = (index, name, value) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var temp = this.state.list_item;
    if (name == 'check'){
      temp[index].monitor_display = value;
      temp[index].monitor_staff = authInfo.user_number;
    }
    this.setState({list_item:temp});
    this.props.changeData();
  }

  render() {
    let {list_item, staff_list_by_number} = this.state;
    let message;
    if (list_item == null || list_item.length ==0) {
        message = <div className="no-result"><span>警報報知がありません</span></div>;
    }
    
    return  (
        <Wrapper>
          <table className="table-scroll table table-bordered">
            <thead>
              <tr>
                <th className={`item-no`}/>
                <th className={`code-number`}>警報発生日時</th>
                <th>警報状態</th>
                <th>メモ</th>
                <th>スタッフ</th>
                <th>モニタ表示</th>
              </tr>
            </thead>
              {this.state.is_loaded ? (
                  <>
                  <tbody>
                  {list_item !== undefined && list_item !== null && list_item.length > 0 && staff_list_by_number != undefined? (
                      list_item.map((item, index) => {
                          return (
                              <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td>{index+1}</td>
                                      <td>{formatTimeIE(item.al_create_time)}</td>
                                      <td className="text-left">
                                          <div>{item.al_dialysate_alert===1&&"・透析液濃度警報"}</div>
                                          <div>{item.al_venous_alert===1&&"・静脈圧警報"}</div>                                          
                                          <div>{item.al_dialysate_pressure_alert===1&&"・透析液圧警報(DD) 警報"}</div>
                                          <div>{item.al_tmp_alert===1&&"・TMP 警報"}</div>
                                          <div>{item.al_dializer_alert===1&&"・ダイアライザ血液入口圧警報"}</div>
                                          <div>{item.al_arterial_alert===1&&"・脱血圧（動脈圧）警報"}</div>
                                          <div>{item.al_bubble_alert===1&&"・気泡検知警報"}</div>
                                          <div>{item.al_leak_alert===1&&"・漏血警報"}</div>
                                          <div>{item.al_dialysate_temperature===1&&"・透析液温度警報"}</div>
                                          <div>{item.al_blood_pressure_alert===1&&"・血圧警報"}</div>
                                          <div>{item.al_other_alert===1&&"・その他警報"}</div>
                                          <div>{item.al_other_alert===1 && item.al_free_alert!=''?item.al_free_alert:''}</div>
                                          <div>{item.al_drainage_notification===1&&"・除水完了（報知）"}</div>
                                          <div>{item.al_fluid_notification===1&&"・補液完了（報知）"}</div>
                                          <div>{item.al_syringe_notification===1&&"・シリンジポンプ注入完了（報知）"}</div>
                                          <div>{item.al_other_notification===1&&"・その他の報知"}</div>
                                      </td>
                                      <td><input type="text" value={item.comment} onChange={this.getComment.bind(this,index)} style = {{width:'100%'}}/></td>
                                      <td>
                                        {item.monitor_display==1 && item.monitor_staff>0 ? staff_list_by_number[item.monitor_staff]:''}
                                      </td>
                                      <td>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getRadio.bind(this, index)}
                                          // isDisabled={item.monitor_display!=undefined && item.monitor_display!=null && item.monitor_display==1?true:false}
                                          value={item.monitor_display!=undefined && item.monitor_display!=null?item.monitor_display:false}
                                          name="check"
                                        /> 
                                      </td>                                      
                                  </tr>
                              </>)
                      })
                  ): (
                      <tr>
                          <td colSpan={6}>
                              {message}
                          </td>
                      </tr>
                  )}
                  </tbody>
                  </>
              ): (
                  <div className='text-center'>
                      <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                  </div>
              )}
            </table>
        </Wrapper>
    );
  }
}

AlarmNotificationView.contextType = Context;

AlarmNotificationView.propTypes = {
  is_loaded: PropTypes.bool,
  list_item: PropTypes.array,
  changeData: PropTypes.function,
};

export default AlarmNotificationView;
