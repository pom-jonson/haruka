import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface, secondary, secondary200, disable } from "../_nano/colors";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";
import GenericMedicineModal from "~/components/organisms/GenericMedicineModal";
// import $ from "jquery";

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  height: auto;  
  display: table; 
  margin-bottom: 10px;
  width: 99%;

  a.timeCode:hover{
    cursor: pointer !important;
    color: blue !important;
  }

  .code-label{
    text-align: left;    
    width: 52%;
  }

  .code-value{
    text-align: right;
    width: 16%; 
  }

  tr {
    &:nth-child(2n + 1) {
      background-color: ${secondary200};
    }
  }

  th{
    // position: sticky;
    top: 0px;
    font-weight: normal;
  }

  th,
  td {
    border: 1px solid ${disable};
    padding: 4px;
  }

  th {
    background-color: ${secondary};
    color: ${surface};
  }
  .td_cell1{
    width: 30%;
  }
  .td_title{
    text-align: center;
  }
  .thCell{
     width: 100%;
     text-align: center;
     color: black;
     font-size: 16px;
     background-color: #a0ebff;
  }
  .td-text{
     width: 100%;
     text-align: center;
     background-color: #ddf8ff;
  }
  .td-20{
    width: 20%;
  }
  .tr-group td:last-child{
    border-bottom-color: black;
  }
  .td-color{
    border-bottom-color: black;
  }
  .tr-group td:first-child{
    border-top-color: black;
  }
  .thCell1{
     width: 30%;
     background-color: #a0ebff;
     text-align: center;
     color: black;
     font-size: 16px;
  }
  .thCell2{
    width: 50%;  
    background-color: #a0ebff;
    text-align: center;
    color: black;
    font-size: 16px;
  }
  .thCell3{
    width: 20%;
    background-color: #a0ebff;
    text-align: center;
    color: black;
    font-size: 16px;
  }
`;

const interaction_array = [
  {
    key: "1",
    label: "併用禁忌"
  },
  {
    key: "2",
    label: "原則併用禁忌"
  },
  {
    key: "3",
    label: "併用注意"
  },
  {
    key: "4",
    label: "接触注意"
  }
];

class MedicineDetailModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenGenericNameModal: false,
      genericNameList: {}
    }
    this.medicineDetailRef = React.createRef() 
  }

  componentDidMount() {
  }    

  handlePdfDownload() {
    
    let pdfNo = "";
    Object.keys(this.props.medicineDetailList).map((idx)=>{
      pdfNo = this.props.medicineDetailList[idx].detail.T02_TENPU_ID
    });

    if(pdfNo == "") {
      alert("pdfファイルがありません。");
      return;
    }
    const url = "/reference/medicine/pdf/"+pdfNo+".pdf";
    let params = [
        'height='+screen.height,
        'width='+screen.width,
        'fullscreen=yes' // only works in IE, but here for completeness
    ].join(',');
    var popup = window.open(url, "_blank", params);
    popup.moveTo(0,0);
    return;
  }

  onScrollPosition = (nPos) => {    
    let nId = "div-"+nPos;
    document.getElementById("medicine-detail").scrollTop = document.getElementById(nId).offsetTop - document.getElementById("medicine-detail").offsetTop;    
  }

  openGenericNameModal = (array_value) => {

    if (array_value == undefined || array_value == null) return;

    var base_modal = document.getElementsByClassName("inspectionDetail-modal")[0];
    if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
    }
    
    this.setState({
      isOpenGenericNameModal: true,
      genericNameList: array_value
    });

  }

  closeModal = () => {
    var base_modal = document.getElementsByClassName("inspectionDetail-modal")[0];
    if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1050;
    }

    this.setState({
      isOpenGenericNameModal: false,
    });
  }

  render() {    
    const { medicineDetailList } = this.props; 
    const medicineDetailUsageInfo = Object.keys(medicineDetailList).map((idx)=>{     
      return (
        <div className="div-medicine-detail" key={idx}>
        <div className="div-name" style={{background: "#ddd",padding:"4px"}}>
          <div className="name">{medicineDetailList[idx].detail.T02_SYOHIN} ({medicineDetailList[idx].detail.T02_KIKAKU})</div>
          <div className="gene-name">{medicineDetailList[idx].rece_detail.gene_name}</div>
        </div>  
        <div style={{paddingTop: "3px"}}>
          {medicineDetailList[idx].interaction != undefined && 
          medicineDetailList[idx].interaction != null && (
            <div className="title-1" onClick={()=>this.onScrollPosition(1)}>併用禁忌</div>
          )}
          {medicineDetailList[idx].honbun != undefined && 
          medicineDetailList[idx].honbun != null && 
          medicineDetailList[idx].honbun.length > 0 && (
            <div className="title-2" onClick={()=>this.onScrollPosition(2)}>病名禁忌・警告情報</div>
          )}
          {medicineDetailList[idx].usages != undefined && 
          medicineDetailList[idx].usages != null && (
            <div className="title-3" onClick={()=>this.onScrollPosition(3)}>用法</div>
          )}
        </div>      
        <div ref={this.medicineDetailRef} id="medicine-detail" className="mediicine_detail">

       {/*-------- 併用禁忌 ---------*/}
        <div style={{paddingLeft:"5px",fontWeight:"bold"}} id="div-1">併用禁忌</div>
        {medicineDetailList[idx].interaction != undefined && 
          medicineDetailList[idx].interaction != null ? (
          <>
          <Table>
            <tr>
              <th className="thCell1" style={{borderBottomColor:"black",borderTopColor:"black",borderLeftColor:"black"}}>掲載区分</th>
              <th className="thCell2" style={{borderBottomColor:"black",borderTopColor:"black"}}>薬剤等グループ</th>
              <th className="thCell3" style={{borderBottomColor:"black",borderTopColor:"black",borderRightColor:"black"}}>薬剤等名称</th>
            </tr>   
            {interaction_array.map(ele=>{
              return(
                <>                  
                  {medicineDetailList[idx].interaction[ele.key] != undefined && 
                    medicineDetailList[idx].interaction[ele.key] != null ? (
                    <>
                      {medicineDetailList[idx].interaction[ele.key].map((item, index)=>{
                          return (   
                            <>               
                              <tr key={index} className={index == medicineDetailList[idx].interaction[ele.key].length - 1 && "tr-group"}>
                                {index == 0 && (
                                  <td style={{borderColor:"black"}} rowSpan={medicineDetailList[idx].interaction[ele.key].length}>{ele.label}</td>
                                )}
                                <td className={index == medicineDetailList[idx].interaction[ele.key].length - 1 && "td-color"}>{item.grouped_medicine}</td>
                                <td style={{borderRightColor:"black"}}>{item.medicine_name}</td>
                              </tr>    
                            </>
                          );    
                        })                                
                      }
                    </>
                  ):(
                    <>
                      <tr>
                        <td style={{borderColor:"black"}}>{ele.label}</td>
                        <td style={{borderColor:"black"}} colSpan="2">（掲載無し）</td>
                      </tr>    
                    </>
                  )}
                </>
              );
            })}
          </Table>
          <div style={{marginBottom:"10px"}}>
            <span className="generic-name" onClick={()=>this.openGenericNameModal(medicineDetailList[idx].generic)}>一般名一覧</span>
          </div>          
          </>
        ):(
          <div>（登録なし）</div>
        )}

      {/*-------- 病名禁忌 ---------*/}
        <div style={{paddingLeft:"5px",fontWeight:"bold"}} id="div-2">病名禁忌・警告情報</div>
        {medicineDetailList[idx].honbun != undefined && 
          medicineDetailList[idx].honbun != null && 
          medicineDetailList[idx].honbun.length > 0 ? (
          <>
            {            
              medicineDetailList[idx].honbun.map((item, key)=>{
                  return (
                    <>
                      <Table>
                        <tr>
                          <th colSpan="2" className="thCell" style={{borderColor:"black"}}>病名禁忌情報({key+1}/{medicineDetailList[idx].honbun.length})</th>
                        </tr>
                        <tr>
                          <td className="td-20" style={{borderLeftColor:"black", borderRightColor:"black"}}>警告区分</td>
                          <td style={{borderRightColor:"black"}}>{item.warning_level == 1 ? "警告" : item.warning_level == 2 ? "禁忌" : item.warning_level == 3 ? "原則禁忌" : ""}</td>
                        </tr>                      
                        <tr>                      
                          <td className="td-20" style={{borderLeftColor:"black",borderRightColor:"black",borderBottomColor:"black"}}>禁忌分類</td>
                          <td style={{borderRightColor:"black",borderBottomColor:"black"}}>{item.contraindication_category}</td>
                        </tr>
                        <tr>
                          <td className="td-text" colSpan="2" style={{borderColor:"black"}}>本文</td>
                        </tr>
                        <tr>
                          <td colSpan="2" style={{borderColor:"black"}}>{item.information}</td>
                        </tr>
                      </Table>          
                    </>
                  );                
              })        
            }
          </>
        ) : (
          <div>（登録なし）</div>
        )} 

      {/*-------- 用法 ---------*/}
        <div style={{paddingLeft:"5px",fontWeight:"bold"}} id="div-3">用法</div>
        <div className="div-usage">
        {medicineDetailList[idx].usages.length > 0 ? (
          <>
            {medicineDetailList[idx].usages.map((item, key)=>{
              return (
                <Table key={key}>
                <tr>
                  <th className="thCell1" style={{borderLeftColor:"black",borderTopColor:"black",borderBottomColor:"black"}}>用法 ({key+1}/{medicineDetailList[idx].usages.length})</th>
                  <th className="thCell2" style={{borderTopColor:"black",borderBottomColor:"black"}}></th>
                  <th className="thCell3" style={{borderTopColor:"black",borderBottomColor:"black",borderRightColor:"black"}}></th>
                </tr>
                {item.component_name !== "" && (
                  <tr>
                    <td className="td_cell1">成分名</td>
                    <td>{item.component_name}</td>
                    <td></td>
                  </tr>
                )}  
                {item.target !== "" && (          
                <tr>
                  <td>適応</td>
                  <td>{item.target}</td>
                  <td></td>
                </tr>
                )}
                {item.age_category !== "" && (
                <tr>
                  <td>年齢区分</td>
                  <td>{item.age_category}</td>
                  <td></td>
                </tr>
                )} 
                <tr>
                  <td className="td_title" colSpan="3">通常量・維持量</td>
                </tr>             
                {item.c015 !== "" && (      
                <tr>
                  <td>1 回用量（含量）</td>
                  <td>{item.c015} {item.c017}</td>
                  <td></td>
                </tr>
                )}
                {item.c016 !== "" && (
                <tr>
                  <td>1 日用量（含量）</td>
                  <td>{item.c016} {item.c017}</td>
                  <td></td>
                </tr>
                )}
                {item.c018 !== "" && (
                <tr>
                  <td>1 回用量（剤形）</td>
                  <td>{item.c018} {item.c020}</td>
                  <td></td>
                </tr>
                )}
                {item.c019 !== "" && (
                <tr>
                  <td>1 日用量（剤形）</td>
                  <td>{item.c019} {item.c020}</td>
                  <td></td>
                </tr>
                )}
                {item.c021 !== "" && (
                <tr>
                  <td> 1 日投与回数</td>
                  <td>{item.c021}</td>
                  <td></td>
                </tr>
                )}
                {item.c022 !== "" && (
                <tr>
                  <td>1 日分割回数</td>
                  <td>{item.c022}</td>
                  <td></td>
                </tr>
                )}
                {item.c023 !== "" && (
                <tr>
                  <td>1 日投与回数の上限</td>
                  <td>{item.c023}</td>
                  <td></td>
                </tr>
                )}
                {item.c024 !== "" && (
                <tr>
                  <td>1 回最大量（含量）</td>
                  <td>{item.c024} {item.c026}</td>
                  <td></td>
                </tr>
                )}
                {item.c025 !== "" && (
                <tr>
                  <td>1 日最大量（含量）</td>
                  <td>{item.c025} {item.c026}</td>
                  <td></td>
                </tr>
                )}
                {item.c027 !== "" && (
                <tr>
                  <td>1 回最大量（剤形）</td>
                  <td>{item.c027} {item.c029}</td>
                  <td></td>
                </tr>
                )}
                {item.c028 !== "" && (
                <tr>
                  <td>1 日最大量（剤形）</td>
                  <td>{item.c028} {item.c029}</td>
                  <td></td>
                </tr>
                )}
                {item.c030 !== "" && (
                <tr>
                  <td>最大量の 1 日投与回数</td>
                  <td>{item.c030}</td>
                  <td></td>
                </tr>
                )}
                {item.c031 !== "" && (
                <tr>
                  <td>最大量の 1 日分割回数</td>
                  <td>{item.c031}</td>
                  <td></td>
                </tr>
                )}
                {item.c032 !== "" && (
                <tr>
                  <td>最大量の 1 日投与回数の上限 </td>
                  <td>{item.c032}</td>
                  <td></td>
                </tr>
                )}
                {item.c033 !== "" && (
                <tr>
                  <td>投与時期</td>
                  <td>{item.c033}</td>
                  <td></td>
                </tr>
                )}
                {item.c034 !== "" && (
                <tr>
                  <td>終了時期</td>
                  <td>{item.c034}</td>
                  <td></td>
                </tr>
                )}
                {item.c035 !== "" && (
                <tr>
                  <td>投与パターン 1</td>
                  <td>{item.c035}</td>
                  <td></td>
                </tr>
                )}
                {item.c036 !== "" && (
                <tr>
                  <td>投与パターン 2</td>
                  <td>{item.c036}</td>
                  <td></td>
                </tr>
                )}
                {item.c037 !== "" && (
                <tr>
                  <td>投与経路</td>
                  <td>{item.c037}</td>
                  <td></td>
                </tr>
                )}
                {item.c038 !== "" && (
                <tr>
                  <td>投与に伴う条件等</td>
                  <td>{item.c038}</td>
                  <td></td>
                </tr>
                )}
                {item.c039 !== "" && (
                <tr>
                  <td>投与期間</td>
                  <td>{item.c039}</td>
                  <td></td>
                </tr>
                )}
                {item.c040 !== "" && (
                <tr>
                  <td>最大投与期間</td>
                  <td>{item.c040}</td>
                  <td></td>
                </tr>
                )}
                {item.c041 !== "" && (
                <tr>
                  <td>総投与量（含量）</td>
                  <td>{item.c041}</td>
                  <td></td>
                </tr>
                )}
                {item.c042 !== "" && (
                <tr>
                  <td>総投与量（剤形）</td>
                  <td>{item.c042}</td>
                  <td></td>
                </tr>
                )}
                <tr>
                  <td className="td_title" colSpan="3">初期量</td>
                </tr>            
                {item.c044 !== "" && (
                <tr>
                  <td>1 回用量（含量）</td>
                  <td>{item.c044} {item.c046}</td>
                  <td></td>
                </tr>
                )}
                {item.c045 !== "" && (
                <tr>
                  <td>1 日用量（含量）</td>
                  <td>{item.c045} {item.c046}</td>
                  <td></td>
                </tr>
                )}
                {item.c047 !== "" && (
                <tr>
                  <td>1 回用量（剤形）</td>
                  <td>{item.c047} {item.c049}</td>
                  <td></td>
                </tr>
                )}
                {item.c048 !== "" && (
                <tr>
                  <td> 初期量 1 日用量（剤形）</td>
                  <td>{item.c048} {item.c049}</td>
                  <td></td>
                </tr>
                )}
                {item.c050 !== "" && (
                <tr>
                  <td>1 日投与回数</td>
                  <td>{item.c050}</td>
                  <td></td>
                </tr>
                )}
                {item.c051 !== "" && (
                <tr>
                  <td>1 日分割回数</td>
                  <td>{item.c051}</td>
                  <td></td>
                </tr>
                )}
                {item.c052 !== "" && (
                <tr>
                  <td>1 日投与回数の上限</td>
                  <td>{item.c052}</td>
                  <td></td>
                </tr>
                )}
                {item.c053 !== "" && (
                <tr>
                  <td>1 回最大量（含量）</td>
                  <td>{item.c053} {item.c055}</td>
                  <td></td>
                </tr>
                )}
                {item.c054 !== "" && (
                <tr>
                  <td> 1 日最大量（含量）</td>
                  <td>{item.c054} {item.c055}</td>
                  <td></td>
                </tr>
                )}
                {item.c056 !== "" && (
                <tr>
                  <td>1 回最大量（剤形）</td>
                  <td>{item.c056} {item.c058}</td>
                  <td></td>
                </tr>
                )}
                {item.c057 !== "" && (
                <tr>
                  <td> 1 日最大量（剤形）</td>
                  <td>{item.c057} {item.c058}</td>
                  <td></td>
                </tr>
                )}
                {item.c059 !== "" && (
                <tr>
                  <td>最大量の 1 日投与回数</td>
                  <td>{item.c059}</td>
                  <td></td>
                </tr>
                )}
                {item.c060 !== "" && (
                <tr>
                  <td>最大量の 1 日分割回数</td>
                  <td>{item.c060}</td>
                  <td></td>
                </tr>
                )}
                {item.c061 !== "" && (
                <tr>
                  <td>最大量の 1日投与回数の上限</td>
                  <td>{item.c061}</td>
                  <td></td>
                </tr>
                )}
                {item.c062 !== "" && (
                <tr>
                  <td>投与時期</td>
                  <td>{item.c062}</td>
                  <td></td>
                </tr>
                )}
                {item.c063 !== "" && (
                <tr>
                  <td>終了時期</td>
                  <td>{item.c063}</td>
                  <td></td>
                </tr>
                )}
                {item.c064 !== "" && (
                <tr>
                  <td>投与パターン 1</td>
                  <td>{item.c064}</td>
                  <td></td>
                </tr>
                )}
                {item.c065 !== "" && (
                <tr>
                  <td>投与パターン 2</td>
                  <td>{item.c065}</td>
                  <td></td>
                </tr>
                )}
                {item.c066 !== "" && (
                <tr>
                  <td>投与経路</td>
                  <td>{item.c066}</td>
                  <td></td>
                </tr>
                )}
                {item.c067 !== "" && (
                <tr>
                  <td>投与に伴う条件等</td>
                  <td>{item.c067}</td>
                  <td></td>
                </tr>
                )}
                {item.c068 !== "" && (
                <tr>
                  <td>投与期間</td>
                  <td>{item.c068}</td>
                  <td></td>
                </tr>
                )}
                {item.c069 !== "" && (
                <tr>
                  <td>最大投与期間</td>
                  <td>{item.c069}</td>
                  <td></td>
                </tr>
                )}
                {item.c070 !== "" && (
                <tr>
                  <td>総投与量（含量）</td>
                  <td>{item.c070}</td>
                  <td></td>
                </tr>
                )}
                {item.c071 !== "" && (
                <tr>
                  <td>初期量 総投与量（剤形）</td>
                  <td>{item.c071}</td>
                  <td></td>
                </tr>
                )}
                <tr>
                  <td className="td_title" colSpan="3"> 追加量</td>          
                </tr>
                {item.c073 !== "" && (
                <tr>
                  <td>1 回用量（含量）</td>
                  <td>{item.c073} {item.c075}</td>
                  <td></td>
                </tr>
                )}
                {item.c074 !== "" && (
                <tr>
                  <td>1 日用量（含量）</td>
                  <td>{item.c074} {item.c075}</td>
                  <td></td>
                </tr>
                )}
                {item.c076 !== "" && (
                <tr>
                  <td>1 回用量（剤形）</td>
                  <td>{item.c076} {item.c078}</td>
                  <td></td>
                </tr>
                )}
                {item.c077 !== "" && (
                <tr>
                  <td> 初期量 1 日用量（剤形）</td>
                  <td>{item.c077} {item.c078}</td>
                  <td></td>
                </tr>
                )}
                {item.c079 !== "" && (
                <tr>
                  <td>1 日投与回数</td>
                  <td>{item.c079}</td>
                  <td></td>
                </tr>
                )}
                {item.c080 !== "" && (
                <tr>
                  <td>1 日分割回数</td>
                  <td>{item.c080}</td>
                  <td></td>
                </tr>
                )}
                {item.c081 !== "" && (
                <tr>
                  <td>1 日投与回数の上限</td>
                  <td>{item.c081}</td>
                  <td></td>
                </tr>
                )}
                {item.c082 !== "" && (
                <tr>
                  <td>1 回最大量（含量）</td>
                  <td>{item.c082} {item.c084}</td>
                  <td></td>
                </tr>
                )}
                {item.c083 !== "" && (
                <tr>
                  <td> 1 日最大量（含量）</td>
                  <td>{item.c083} {item.c084}</td>
                  <td></td>
                </tr>
                )}
                {item.c085 !== "" && (
                <tr>
                  <td>1 回最大量（剤形）</td>
                  <td>{item.c085} {item.c087}</td>
                  <td></td>
                </tr>
                )}
                {item.c086 !== "" && (
                <tr>
                  <td> 1 日最大量（剤形）</td>
                  <td>{item.c086} {item.c087}</td>
                  <td></td>
                </tr>
                )}
                {item.c088 !== "" && (
                <tr>
                  <td>最大量の 1 日投与回数</td>
                  <td>{item.c088}</td>
                  <td></td>
                </tr>
                )}
                {item.c089 !== "" && (
                <tr>
                  <td>最大量の 1 日分割回数</td>
                  <td>{item.c089}</td>
                  <td></td>
                </tr>
                )}
                {item.c090 !== "" && (
                <tr>
                  <td>最大量の 1日投与回数の上限</td>
                  <td>{item.c090}</td>
                  <td></td>
                </tr>
                )}
                {item.c091 !== "" && (
                <tr>
                  <td>投与時期</td>
                  <td>{item.c091}</td>
                  <td></td>
                </tr>
                )}
                {item.c092 !== "" && (
                <tr>
                  <td>終了時期</td>
                  <td>{item.c092}</td>
                  <td></td>
                </tr>
                )}
                {item.c093 !== "" && (
                <tr>
                  <td>投与パターン 1</td>
                  <td>{item.c093}</td>
                  <td></td>
                </tr>
                )}
                {item.c094 !== "" && (
                <tr>
                  <td>投与パターン 2</td>
                  <td>{item.c094}</td>
                  <td></td>
                </tr>
                )}
                {item.c095 !== "" && (
                <tr>
                  <td>投与経路</td>
                  <td>{item.c095}</td>
                  <td></td>
                </tr>
                )}
                {item.c096 !== "" && (
                <tr>
                  <td>投与に伴う条件等</td>
                  <td>{item.c096}</td>
                  <td></td>
                </tr>
                )}
                {item.c097 !== "" && (
                <tr>
                  <td>投与期間</td>
                  <td>{item.c097}</td>
                  <td></td>
                </tr>
                )}
                {item.c098 !== "" && (
                <tr>
                  <td>最大投与期間</td>
                  <td>{item.c098}</td>
                  <td></td>
                </tr>
                )}
                {item.c099 !== "" && (
                <tr>
                  <td>総投与量（含量）</td>
                  <td>{item.c099}</td>
                  <td></td>
                </tr>
                )}
                {item.c100 !== "" && (
                <tr>
                  <td>初期量 総投与量（剤形）</td>
                  <td>{item.c100}</td>
                  <td></td>
                </tr>
                )}
                </Table>
              );
            })}
          </>
        ) : (
          <div>（登録なし）</div>
        )}        
        </div>
        </div>
        </div>
      )          
    }); 
    return (
      <Modal
        show={true}
        // onHide={hideModal}
        id="inspectionWithPast_dlg"
        centered
        size="lg"   
        className="inspectionDetail-modal"        
      >
        <Modal.Header>
          <Modal.Title>薬剤の詳細情報</Modal.Title>
        </Modal.Header>
        <Modal.Body>                                   
          {medicineDetailUsageInfo}                      
        </Modal.Body>        
        <Modal.Footer>
          <Button className="cancel-btn" id="btnClose" onClick={this.props.handleCancel}>詳細を閉じる</Button>          
          <Button className="red-btn" id="btnPdfDownload" onClick={this.handlePdfDownload.bind(this)}>PDFダウンロード</Button>
        </Modal.Footer>
        {this.state.isOpenGenericNameModal == true && (
          <GenericMedicineModal
            hideModal={this.closeModal}
            handleCancel={this.closeModal}
            genericNameList={this.state.genericNameList}
          />
        )}
      </Modal>
    );
  }
}

MedicineDetailModal.propTypes = {
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  medicineDetailList: PropTypes.object,
  geneName: PropTypes.string
};

export default MedicineDetailModal;
