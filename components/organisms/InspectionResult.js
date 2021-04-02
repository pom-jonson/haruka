import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface, secondary, secondary200, disable } from "../_nano/colors";
// import { Modal } from "react-bootstrap";
import InspectionTimeSeriesModal from "./InspectionTimeSeriesModal";
import InspectionWithPastResultModal from "./InspectionWithPastResultModal";
import MedicineDetailModal from "./MedicineDetailModal";
import * as apiClient from "../../api/apiClient";
import Button from "../atoms/Button";
import Checkbox from "../molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Div = styled.div`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  line-height: 1.7;
  margin-bottom: 16px;

  p {
    width: 32%;
    margin: 0;
  }

  .flex {
    display: flex;
  }

  dl {
    display: flex;
    margin: 0;
    width: 30%;
  }
  dt {
    font-weight: normal;
  }
  dd {
    margin: 0 16px 0 0;
  }
  .btn-area {
    width: 15%;
    dd {
      margin: 0;
    }
  }
`;

const NoDiv = styled.div`
  .no-data{
    text-align: center;
    padding: 50px;
    font-size: 20px;
  }
`;

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  max-height: 90%;
  overflow-y: auto;
  display: inline-block;

  a.timeCode:hover{
    cursor: pointer !important;
    color: blue !important;
  }

  tr {
    &:nth-child(2n + 1) {
      background-color: ${secondary200};
    }
  }

  tr:hover{
    cursor: pointer !important;
  }

  th{
    position: sticky;
    top: 0px;
  }

  th,
  td {
    border: 1px solid ${disable};
    padding: 4px;
  }

  th {
    background-color: ${secondary};
    color: ${surface};
    text-align: center;
  }

  .item-name {
    width: 40%;
  }
  .item-result {
    width: 20%;
  }
  .item-default {
    width: 30%;
  }
  .item-comment {
    width: 10%;
  }
  .item-check{
    z-index: 100;
  }

  .button-not-permission{
    background-color: gray;
  }
  s{
    color: #6c6c6c;
  }

`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
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

const ContextMenu = ({
  visible,
  x,
  y,
  index,
  parent,
  code,
}) => {

  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}> 
          <li>
            <div onClick={() => parent.contextMenuAction("showInspection", index, code)}>
              この検査を並べて表示
            </div>
          </li>                   
          <li>
            <div onClick={() => parent.contextMenuAction("timeSeries", index, code)}>
              この検査をグラフで表示
            </div>
          </li>              
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InspectionResult extends Component {

  constructor(props) {
    super(props);
    this.handleMedicineDetailClick = this.handleMedicineDetailClick.bind(this);
    this.clickTimeCode = this.clickTimeCode.bind(this);
    this.state = {
      showTimeSeries: false,
      timeSeriesContent: [],
      medicineDetail: [],
      showPastResult: false,
      showMedicineDetail: false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        index: 0
      },
      checkList: [],
      allCheck: 0,
      confirm_message:"",
    };
  }

  componentDidMount() {
    // $(".button-not-permission").children().wrap("<s></s>");
  }

  handleCancel = () => {
    this.setState({
      showPastResult: false,
      showMedicineDetail: false
    }); 
  }

  closeTimeSeriesModal = () => {
    this.setState({
      showTimeSeries: false
    });
  }

  getTimeSeries = async (params, type) => {    
    await apiClient.get("/app/api/v2/karte/inspection/history", {
      params: params
    }).then((res) => {
        if (type === "_past" ) {
          this.setState({
            showPastResult: true,
            timeSeriesContent: res
          });
        }else if(type === "_timeSeries"){
          this.setState({
            showTimeSeries: true,
            timeSeriesContent: res
          });
        }        
    });
  }

  clickTimeCode = (e, item) => { 
    e.preventDefault();
    let tagName = e.target.tagName;  
    if(tagName === "TD") {
      let params = {patient_id: this.props.patientId, code: item.code};    
      this.getTimeSeries(params, "_past");        
    }
  }

  handleClick(e, index, item) {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // e.target.click();
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
          .getElementById("inspection_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("inspection_dlg")
              .removeEventListener(`scroll`, onScrollOutside);
          });    
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("inspection_dlg").offsetLeft,
          y: e.clientY + window.pageYOffset - document.getElementById("inspection_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop,
          index: index,
          code: item.code
        }
      });   
    }
  }

  contextMenuAction = (act) => {   
    if (act === "timeSeries") {
        if (this.state.checkList.length === 0) {
            this.setState({
                confirm_message: "項目を選択ください。",
            });
        } else {
            let params = {patient_id: this.props.patientId, code: this.state.checkList};
            this.getTimeSeries(params, "_timeSeries");
        }
    }
    if (act === "showInspection") {
        if (this.state.checkList.length === 0) {
            this.setState({
                confirm_message: "項目を選択ください。",
            });
        } else {
            let params = {patient_id: this.props.patientId, code: this.state.checkList};
            this.getTimeSeries(params, "_past");
        }
    }
  };

    timeSeries =()=>{
        if (this.state.checkList.length === 0) {
            this.setState({
                confirm_message: "項目を選択ください。",
            });
        } else {
            let params = {patient_id: this.props.patientId, code: this.state.checkList};
            this.getTimeSeries(params, "_timeSeries");
        }
    }

    showInspection =()=>{
        if (this.state.checkList.length === 0) {
            this.setState({
                confirm_message: "項目を選択ください。",
            });
        } else {
            let params = {patient_id: this.props.patientId, code: this.state.checkList};
            this.getTimeSeries(params, "_past");
        }
    }

    confirmCancel() {
        this.setState({
            confirm_message: "",
        });
    }

  handleMedicineDetailClick = (e, code) => {
    e.preventDefault();
    let params = {type: "haruka", codes: parseInt(code)};
    this.getMedicineDetailList(params);
  }

  getMedicineDetailList = async (params) => {    
    await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    }).then((res) => {    
      this.setState({
        showMedicineDetail: true,
        medicineDetail: res
      });
    });
  }

  getRadio(name, value) {
    if (name == "all_check") {    
      if (value == 0) {
        this.setState({
          allCheck: value,
          checkList: [],
        });
      }else{   
        let chkList = []; 
        this.props.inspectionList.results.map(item=>{
          chkList.push(item.code);
        });    
        this.setState({
          allCheck: value,
          checkList: chkList
        });
      }
    } else {
      let chkList = [...this.state.checkList];
      if( value === 1) {
        chkList.push(name);
      }
      else {
        var index = chkList.indexOf(name)
        if (index !== -1) {
          chkList.splice(index, 1);
        }
      }
      if (this.props.inspectionList.results.length == chkList.length) {
        this.setState({
          checkList: chkList,
          allCheck: 1,
        });
      }else{
        this.setState({
          checkList: chkList,
          allCheck: 0,
        });
      }
    }

  }

  render() {
    const { inspectionList } = this.props;
    let nDetailCount = 0;
    let noExistData = false;
    if (inspectionList == null || inspectionList == undefined || inspectionList.length < 1) {
      noExistData = true;
    } else if (inspectionList.results == null || inspectionList.results == undefined || inspectionList.results.length < 1) {
      noExistData = true;
    }
    let inspectionResult = "";
    if (noExistData == true) {
      inspectionResult = <></>;
    } else {
      inspectionResult = inspectionList.results.map(
        (item, index) => {
        if (item.exists_detail_information === 1) {
          nDetailCount ++;
        }
        return (
          <tr key={index} onClick={e => this.clickTimeCode(e, item)} onContextMenu={e => this.handleClick(e, index, item)}>
            <td>
              <Checkbox
                label=""
                getRadio={this.getRadio.bind(this)}
                value={this.state.allCheck == 1 ? 1: this.state.checkList.indexOf(item.code) !== -1 ? 1 : 0}
                name={item.code}
              />
            </td>
            <td>{item.label !== undefined && item.label !== ""?item.label:""}</td>
            <td>{item.value_status == "L" && "↓"} {item.value !== undefined && item.value !== ""?item.value:""} {item.unit !== undefined && item.unit !== ""?item.unit:""} {item.status !== undefined && item.status !== ""?item.status:""}</td>                
            <td>{item.reference_value !== undefined && item.reference_value !== ""?item.reference_value:""}</td>
            <td>
            {item.boilerplate_1 !== undefined && item.boilerplate_1 !== ""?item.boilerplate_1:""}
            {item.boilerplate_1 !== undefined && item.boilerplate_1 !== "" && item.boilerplate_1 !== "" && (
              <br />
            )}
            {item.boilerplate_2 !== undefined && item.boilerplate_2 !== ""?item.boilerplate_2:""}
            {item.boilerplate_2 !== undefined && item.boilerplate_2 !== "" && (
              <br />
            )}
            {item.remarks !== undefined && item.remarks !== ""?item.remarks:""}</td>
            {item.exists_detail_information === 1 && (
              <td className="btnDetail">
                <Button id="btnDetail" onClick={e=> this.handleMedicineDetailClick(e, item.code)}>詳細</Button>
              </td>
            )}          
          </tr>
        );
      });   
    }
    return (
      <>

          {noExistData == true ? (
            <NoDiv>
              <div className="no-data">結果が登録されていません。</div>
            </NoDiv>
          ) : (
            <>          
              <Div>                                      
                  <div className="flex">            
                    <dl>
                      <dt>採取日：</dt>
                      <dd>            
                      {inspectionList.collected_date.substr(0, 4)}年
                      {inspectionList.collected_date.substr(5, 2)}月
                      {inspectionList.collected_date.substr(8, 2)}日
                      </dd>
                    </dl>                
                    <dl>
                      <dt>医師：</dt>
                      <dd>{inspectionList.doctor_name}</dd>
                    </dl>
                    <dl className={'btn-area'}>
                      <dt><Button onClick={this.showInspection}>並べて表示</Button></dt>
                      <dd></dd>
                    </dl>
                    <dl className={'btn-area'}>
                      <dt><Button onClick={this.timeSeries}>グラフで表示</Button></dt>
                      <dd></dd>
                    </dl>
                  </div>

              </Div>         
              <Table>
                <tr>
                  <th className="item-check">
                  <Checkbox
                    label=""
                    getRadio={this.getRadio.bind(this)}
                    value={this.state.allCheck}
                    name={'all_check'}
                  />
                  </th>
                  <th className="item-name">項目名</th>
                  <th className="item-result">結果</th>         
                  <th className="item-default">基準値</th>
                  <th className="item-comment">コメント</th>    
                  {nDetailCount > 0 && (
                    <th></th>
                  )}          
                </tr>  
                {inspectionResult}
              </Table>
            </>
          )}               
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      {this.state.showTimeSeries && (
        <InspectionTimeSeriesModal
          closeTimeSeriesModal={this.closeTimeSeriesModal}
          showData={this.state.timeSeriesContent}
        />
      )}  
      {this.state.showPastResult && (
        <InspectionWithPastResultModal
          hideModal={this.handleCancel}
          handleCancel={this.handleCancel}
          inspectionWithPastList={this.state.timeSeriesContent}
          selected_date={inspectionList.collected_date}
        />
      )}
      {this.state.showMedicineDetail && (
        <MedicineDetailModal
          hideModal={this.handleCancel}
          handleCancel={this.handleCancel}
          medicineDetailList={this.state.medicineDetail}
        />
      )}
      {this.state.confirm_message !== "" && (
          <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.confirm_message}
          />
      )}
      </>
    );
  }
}

InspectionResult.propTypes = {
  closeModal: PropTypes.func,
  inspectionList: PropTypes.object,
  patientId: PropTypes.number,
};

export default InspectionResult;
