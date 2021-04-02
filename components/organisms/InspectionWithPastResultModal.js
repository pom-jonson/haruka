import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface, secondary, disable } from "../_nano/colors";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";

const Wrapper = styled.div`
    height: 100%;
    .flex {
        display: flex;
    }
    .view-mode-area {
      display: inline-block;
      height: 100%; 
      width: 100%;
      overflow-x:auto;
      overflow-y: hidden;
        .table-menu {
            display: inline-flex;
            background-color: ${secondary};
            color: ${surface};
        } 
        .inline-flex {
            display: inline-flex;
            margin-top: -1px;
        }
        .date-box {
            border: 1px solid ${disable};
            width: 20rem;
            text-align:left;
            padding: 0 0.3rem;
        }
        .time-box {
          border: 1px solid ${disable};
          width: 10rem;
          padding: 0 0.3rem;
        }
        margin-bottom:0;
        .body-area {
          overflow-y:scroll;
          height: calc(80vh - 14rem);
          display: inline-block;
          border-left: 1px solid ${disable};
          border-bottom: 1px solid ${disable};
        }
    }
    .no-result {
      padding: 200px;
      text-align: center;
      span {
        padding: 10px;
        border: 2px solid ${disable};
      }
    }
    .selDateValue {
      background-color: #a0ebff;
    }
`;

class InspectionWithPastResultModal extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  getStyle=(type)=>{
    if(type === 'margin-bottom'){
      return '';
    }
    if(type === 'float'){
      return '';
    }
    if(type === 'display'){
      return 'flex';
    }
    // let base_modal = document.getElementsByClassName("view-mode-area")[0];
    // if(base_modal !== undefined && base_modal != null){
    //   let modal_width = base_modal.offsetWidth;
    //   let table_obj = document.getElementsByClassName("view-mode-area")[0];
    //   let table_width = table_obj.offsetWidth;
    //   if(modal_width > table_width){
    //     if(type === 'float'){
    //       return '';
    //     }
    //     if(type === 'display'){
    //       return 'flex';
    //     }
    //     if(type === 'margin-bottom'){
    //       return '-6px';
    //     }
    //   } else {
    //     if(type === 'float'){
    //       return 'left';
    //     }
    //     if(type === 'display'){
    //       return 'block';
    //     }
    //     if(type === 'margin-bottom'){
    //       return '-6px';
    //     }
    //   }
    // } else {
    //   return '';
    // }
  };

  createTableHead=()=>{
    let table_data = [];
    let item = this.props.inspectionWithPastList[0];
    item.date.map((date)=>{
      table_data.push(
        <div className={"time-box text-center "+ (date == this.props.selected_date ? 'selDate' : '')}>{date}</div>
      );
    });
    return table_data;
  };

  render() {
    const { inspectionWithPastList } = this.props;
    // const inspectionResult = inspectionWithPastList.map(
    //   (item, index) => {
    //   return (
    //     <tr key={index}>
    //       <td className={item.values.length > 1 ? 'code-label' : 'code-label1' }>{item.label}</td>
    //       {item.values.map((item, key)=>{
    //         return (
    //           <td key={key} className={item.x == this.props.selected_date ? 'selDateValue code-value' : 'code-value '}>
    //             {item.y}
    //           </td>
    //         )
    //       })}
    //       <td></td>
    //     </tr>
    //   );
    // });
    return (
      <Modal
        show={true}
        // onHide={hideModal}
        id="inspectionWithPast_dlg"
        centered
        size="xl"
        className="inspection-with-past-result-modal"
      >
        <Modal.Header><Modal.Title>検査結果比較</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'view-mode-area'}>
              {/* <div style={{float:this.getStyle('float'), display:this.getStyle('display'), marginBottom:this.getStyle('margin-bottom')}}> */}
              <div style={{display:"inline-block"}}>
                <div className={'table-menu'}>
                  <div className={'date-box'}> </div>
                  {this.createTableHead()}
                  <div className={'time-box text-center'}>備考</div>
                  <div className={'time-box'} style={{width:"17px"}}></div>
                </div>
              </div>
              <div className={'body-area'} style={{marginTop:"-4px"}}>
                {inspectionWithPastList.map((item)=>{
                  return (
                    <>
                      <div style={{float:this.getStyle('float'), display:this.getStyle('display')}}>
                        <div className={'inline-flex'}>
                          <div className={'date-box'}>{item.label}</div>
                          {item.date.map((date)=>{
                            return (
                              <>
                                <div className={"time-box text-right " + (date == this.props.selected_date ? 'selDateValue' : '')}>
                                  {item.values != undefined && item.values != null && item.values.length > 0 && item.values.map(sub_item=> {
                                    if (sub_item.x == date) {
                                      return (
                                        <div key={sub_item}>{sub_item.y}</div>
                                      )
                                    }
                                  })}
                                  {/* {(item.values.find((x) => x.x == date) != undefined) ? item.values.find((x) => x.x == date).y : ""} */}
                                </div>
                              </>
                            )
                          })}
                          <div className={'time-box'}> </div>
                        </div>
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </Wrapper>
          {/*<Table>*/}
              {/*{inspectionWithPastList.map((item, key) => {*/}
                {/*if(key === 0) {*/}
                {/*return(*/}
                {/*<thead>*/}
                  {/*<tr key={key}>*/}
                    {/*<th className="code-label"></th>*/}
                    {/*{item.values.map((item, key)=>{*/}
                      {/*return (*/}
                        {/*<th key={key} className={item.x == this.props.selected_date ? 'selDate text-center code-value' : 'text-center code-value' }>{item.x}</th>*/}
                      {/*)*/}
                    {/*})}*/}
                    {/*<th>備考</th>*/}
                  {/*</tr>*/}
                {/*</thead>*/}
                {/*)*/}
                {/*}*/}
              {/*})}*/}
              {/*<tbody>*/}
                {/*{inspectionResult}*/}
              {/*</tbody>*/}
          {/*</Table>*/}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" id="btnClose" onClick={this.props.handleCancel}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InspectionWithPastResultModal.propTypes = {
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  inspectionWithPastList: PropTypes.object,
  selected_date: PropTypes.string,
};

export default InspectionWithPastResultModal;
