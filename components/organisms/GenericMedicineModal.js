import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface, secondary, secondary200, disable } from "../_nano/colors";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";

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
  .tr-group{
    td{
      border-bottom-color: black;
    }
  } 
  .td-color{
    border-bottom-color: black;
  }
  .tr-group td:first-child{
    border-top-color: black;
  }
  .thCell1{
     width: 45px;
     background-color: #a0ebff;
     text-align: center;
     color: black;
     font-size: 16px;
  }
  .thCell2{
    width: calc(100% - 45px);;  
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

class GenericMedicineModal extends Component {

  constructor(props) {
    super(props);    
  }

  componentDidMount() {
  }       

  render() {    
    const { genericNameList } = this.props; 
    // const genericNameListInfo = Object.keys(genericNameList).map((idx)=>{     
    //   return (
    //     <div className="div-medicine-detail" key={idx}>        
    //       {genericNameList[idx] != undefined && 
    //         genericNameList[idx] != null && (
    //         <Table>
    //           <tr>
    //             <th className="thCell1" style={{borderBottomColor:"black",borderTopColor:"black",borderLeftColor:"black"}}>連番</th>
    //             <th className="thCell2" style={{borderBottomColor:"black",borderTopColor:"black"}}>一般名</th>                
    //           </tr>   
    //           {interaction_array.map(ele=>{
    //             console.log("ele", ele);
    //             console.log("genericNameList[ele.key]", genericNameList[ele.key]);
    //             return(
    //               <>                  
    //                 {genericNameList[ele.key] != undefined && 
    //                   genericNameList[ele.key] != null ? (
    //                   <>
    //                     {genericNameList[ele.key].map((item, index)=>{
    //                         return (   
    //                           <>  
    //                             {index == 0 && (
    //                               <tr>
    //                                 <td colSpan="2">{ele.label}</td>
    //                               </tr>
    //                             )}             
    //                             <tr key={index}>                                  
    //                               <td>{index + 1}</td>
    //                               <td>{item}</td>
    //                             </tr>    
    //                           </>
    //                         );
    //                       })                                
    //                     }
    //                   </>
    //                 ):(
    //                   <>
    //                     <tr>
    //                       <td colSpan="2" style={{borderColor:"black"}}>{ele.label}</td>
    //                     </tr>
    //                     <tr>
    //                       <td>1</td>
    //                       <td style={{borderColor:"black"}} colSpan="2">（掲載無し）</td>
    //                     </tr>    
    //                   </>
    //                 )}
    //               </>
    //             );
    //           })}
    //         </Table>                  
    //       )}             
    //     </div>
    //   )          
    // }); 
    return (
      <Modal
        show={true}
        id="generic_name_list_modal"
        centered
        size="lg"   
        className="genericNameList-modal"        
      >
        <Modal.Header>
          <Modal.Title>併用禁忌・一般名一覧</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="div-generic-name">        
            {genericNameList != undefined && 
              genericNameList != null && (
              <Table>
                <tr>
                  <th className="thCell1" style={{borderBottomColor:"black",borderTopColor:"black",borderLeftColor:"black"}}>連番</th>
                  <th className="thCell2" style={{borderBottomColor:"black",borderTopColor:"black",borderRightColor:"black"}}>一般名</th>                
                </tr>   
                {interaction_array.map(ele=>{
                  return(
                    <>                  
                      {genericNameList[ele.key] != undefined && 
                        genericNameList[ele.key] != null ? (
                        <>
                          {genericNameList[ele.key].map((item, index)=>{
                              return (   
                                <>  
                                  {index == 0 && (
                                    <tr>
                                      <td className="td-text" colSpan="2" style={{borderColor:"black",textAlign:"center"}}>{ele.label}</td>
                                    </tr>
                                  )}             
                                  <tr key={index} className={index == genericNameList[ele.key].length - 1 && "tr-group"}>                                  
                                    <td style={{textAlign:"right",borderLeftColor:"black"}}>{index + 1}</td>
                                    <td style={{borderRightColor:"black"}}>{item}</td>
                                  </tr>    
                                </>
                              );
                            })                                
                          }
                        </>
                      ):(
                        <>
                          <tr>
                            <td className="td-text" colSpan="2" style={{borderColor:"black",textAlign:"center"}}>{ele.label}</td>
                          </tr>
                          <tr>
                            <td style={{textAlign:"right",borderLeftColor:"black",borderBottomColor:"black"}}>1</td>
                            <td style={{borderColor:"black"}} colSpan="2">（掲載無し）</td>
                          </tr>    
                        </>
                      )}
                    </>
                  );
                })}
              </Table>                  
            )}             
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" id="btnClose" onClick={this.props.handleCancel}>閉じる</Button>          
        </Modal.Footer>
      </Modal>
    );
  }
}

GenericMedicineModal.propTypes = {
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  genericNameList: PropTypes.object,
};

export default GenericMedicineModal;
