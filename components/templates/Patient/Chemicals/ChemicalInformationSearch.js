import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
// import * as apiClient from "~/api/apiClient";
// import {formatDateLine} from "~/helpers/date";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import EditChemicalModal from "./EditChemicalModal";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
      display: flex;
    }
    .search-value {
      div {margin:0;}
      .label-title {
        font-size:1rem;
        line-height:2.3rem;
        margin:0;
        margin-right:0.5rem;
        width: 6rem;
      }
      input {
        height:2.3rem;
        width:13rem;
        margin-right: 1rem;
      }
    }
    .radio-area {
      margin-left: 6.5rem;
      label {font-size: 1rem;}
    }
    .check-area {
      .label-title {
        width: 6rem;
        margin-right:0.5rem;
      }
      label {
        font-size: 1rem;
      }
      .check-box-area {
        width:10rem;
      }
      .btn-area {
        width:calc(100% - 15.5rem);
        text-align:right;
      }
    }
    .table-area {
      table {
        margin:0px;
        tbody{
          display:block;
          overflow-y: scroll;
          height: calc( 80vh - 24rem);
          width:100%;
          tr:nth-child(even) {background-color: #f2f2f2;}
          tr:hover{background-color:#e2e2e2 !important;}
        }
        tr{
          display: table;
          width: 100%;
        }
        thead{
          display:table;
          width:100%;        
          border-bottom: 1px solid #dee2e6;
          tr{width: calc(100% - 17px);}
        }
        td {
            padding: 0.25rem;
            word-break: break-all;
            button{float:right;}
        }
        th {
            position: sticky;
            text-align: center;
            padding: 0.3rem;
            white-space:nowrap;
            border:none;
            border-right:1px solid #dee2e6;
        }
        .medicine-code {
          width: 10rem;
        }
        .medicine-name {
          width: 6rem;
        }
        .medicine-value {
          width: 7rem;
        }
      } 
    }
`;

class ChemicalInformationSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
          medicine_code:'',
          medicine_name:'',
          short_medicine_name:'',
          general_medicine_name:'',
          unit:'',
          table_data:[],
          search_type:0,
          openEditChemicalModal:false,
        };
    }

    async componentDidMount() {
      await this.getOrderSlipTotalData();
    }

    getOrderSlipTotalData=async()=>{
      // let path = "/app/api/v2/nutrition_guidance/get_slip_total_data";
      // let post_data = {
      //   start_date:formatDateLine(this.state.start_date),
      //   end_date:formatDateLine(this.state.end_date),
      // };
      // await apiClient
      //   .post(path, {
      //     params: post_data
      //   })
      //   .then((res) => {
      //     this.setState({
      //       table_data:res,
      //     });
      //   })
      //   .catch(() => {
  
      //   });
    }

    setSearchValue=(key,e)=>{
      this.setState({[key]:e.target.value});
    };

    setSearchType = (e) => {
        this.setState({search_type:parseInt(e.target.value)});
    };

    closeModal=()=>{
      this.setState({
        openEditChemicalModal:false,
      });
    };

    setMedicineType = (name, value) => {
      this.setState({[name]: value });
    };

    openEditChemicalModal=()=>{
      this.setState({
        openEditChemicalModal:true,
      });
    }

    render() {
        return (
            <>
                <Modal
                    show={true}      
                    id='nutrition-guidance-slip-total'              
                    className="custom-modal-sm chemical-information-search first-view-modal"
                >
                    <Modal.Header><Modal.Title>薬品情報検索</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                          <div className={'flex search-value'}>
                            <InputWithLabel
                              label="薬剤コード"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'medicine_code')}
                              diseaseEditData={this.state.medicine_code}
                            />
                          </div>
                          <div className={'flex search-value'} style={{marginTop:"0.5rem"}}>
                            <InputWithLabel
                              label="薬剤名"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'medicine_name')}
                              diseaseEditData={this.state.medicine_name}
                            />
                            <InputWithLabel
                              label="略称"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'short_medicine_name')}
                              diseaseEditData={this.state.short_medicine_name}
                            />
                            <InputWithLabel
                              label="一般名"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'general_medicine_name')}
                              diseaseEditData={this.state.general_medicine_name}
                            />
                            <InputWithLabel
                              label="単位"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'unit')}
                              diseaseEditData={this.state.unit}
                            />
                          </div>
                          <div className={'flex radio-area'} style={{marginTop:"0.5rem"}}>
                            <Radiobox
                                label={'前方一致'}
                                value={0}
                                checked={(this.state.search_type === 0)}
                                getUsage={this.setSearchType.bind(this)}
                                disabled={true}
                                name={`search_type`}
                            />
                            <Radiobox
                                label={'部分一致'}
                                value={1}
                                checked={(this.state.search_type === 1)}
                                getUsage={this.setSearchType.bind(this)}
                                disabled={true}
                                name={`search_type`}
                            />
                          </div>
                          <div className={'check-area flex'} style={{marginTop:"0.5rem"}}>
                            <div className={'label-title'}>投与経路</div>
                            <div className={'check-box-area'}>
                              <Checkbox
                                label="内服"
                                getRadio={this.setMedicineType.bind(this)}
                                value={this.state.internal_medicine === 1}
                                name="internal_medicine"
                              />
                              <Checkbox
                                label="外用"
                                getRadio={this.setMedicineType.bind(this)}
                                value={this.state.external_medicine === 1}
                                name="external_medicine"
                              />
                            </div>
                            <div className={'btn-area'}>
                              <button onClick={this.getOrderSlipTotalData}>検索</button>
                            </div>
                          </div>
                          <div className="table-area" style={{marginTop:"0.5rem"}}>
                            <table className="table table-bordered table-hover" id="code-table">
                              <thead>
                                  <tr>                
                                    <th className="medicine-code">薬剤コード</th>
                                    <th>薬剤名称</th>
                                    <th className="medicine-name">略称</th>
                                    <th className="medicine-name">一般名</th>                                                        
                                    <th className="medicine-value">経路</th>
                                    <th className="medicine-value">単位</th>
                                    <th className="medicine-value">詳細</th>
                                  </tr>
                              </thead>
                              <tbody>
                                <tr>                            
                                  <td className="medicine-code">1234567890</td>
                                  <td style={{cursor:"pointer"}} onClick={this.openEditChemicalModal}>テスト薬剤</td>
                                  <td className="medicine-name">テス薬</td>
                                  <td className="medicine-name">テスト薬</td>                                                        
                                  <td className="medicine-value">内服</td>
                                  <td className="medicine-value">錠</td>
                                  <td className="medicine-value">あり</td>
                                </tr>
                                {/* {this.state.table_data.length > 0 && (
                                  this.state.table_data.map(item=>{
                                    return (
                                      <>
                                        <tr>                            
                                          <td className="medicine-code">1234567890</td>
                                          <td style={{cursor:"pointer"}} onClick={this.openEditChemicalModal}>テスト薬剤</td>
                                          <td className="medicine-name">テス薬</td>
                                          <td className="medicine-name">テスト薬</td>                                                        
                                          <td className="medicine-value">内服</td>
                                          <td className="medicine-value">錠</td>
                                          <td className="medicine-value">あり</td>
                                        </tr>
                                      </>
                                    )
                                  })
                                )} */}
                              </tbody>
                            </table>  
                          </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      <Button className="red-btn">詳細</Button>
                    </Modal.Footer>
                    {this.state.openEditChemicalModal && (
                      <EditChemicalModal
                        closeModal={this.closeModal}
                      />
                    )}
                </Modal>
            </>
        );
    }
}

ChemicalInformationSearch.contextType = Context;
ChemicalInformationSearch.propTypes = {
    closeModal: PropTypes.func,
};

export default ChemicalInformationSearch;
