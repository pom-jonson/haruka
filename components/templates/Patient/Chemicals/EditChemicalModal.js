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
import Checkbox from "~/components/molecules/Checkbox";

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
        width:15rem;
        margin-right: 1rem;
      }
    }
    .check-area {
      .label-title {
        width: 6rem;
        margin-right:0.5rem;
        line-height:2.3rem;
      }
      label {
        font-size: 1rem;
      }
      .check-box-area {
        width:16rem;
        line-height: 2.3rem;
      }
    }
    .medicine-info {
      align-items: flex-start;
      justify-content: space-between;
      margin-top: 0.5rem;
      margin-right: 1rem;
      height: calc(100% - 11rem);
      .input-text{
        width:32%;
        height: 100%;
        .text-area {
          width:100%;
          height: calc(100% - 2rem);
          textarea {
            width:100%;
            height:100%;
          }
        }
      }
    }
`;

class EditChemicalModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          medicine_code:'',
          medicine_name:'',
          short_medicine_name:'',
          general_medicine_name:'',
          display_name:'',
          unit:'',
          table_data:[],
          search_type:0,

          is_enabled:1,
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

    closeModal=()=>{
      this.setState({
        openNutritionGuidanceSchedule:false,
      });
    };

    setMedicineType = (name, value) => {
      this.setState({ [name]: value });
    };

    render() {
        return (
            <>
                <Modal
                  show={true}      
                  id='nutrition-guidance-slip-total'              
                  className="custom-modal-sm edit-chemical-modal first-view-modal"
                >
                    <Modal.Header><Modal.Title>薬品編集</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                          <div className={'flex search-value'}>
                            <InputWithLabel
                              label="薬剤コード"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'medicine_code')}
                              diseaseEditData={this.state.medicine_code}
                            />
                            <InputWithLabel
                              label="正式名称"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'medicine_name')}
                              diseaseEditData={this.state.medicine_name}
                            />
                          </div>
                          <div className={'flex search-value'} style={{marginTop:"0.5rem"}}>
                            <InputWithLabel
                              label="表示名称"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'display_name')}
                              diseaseEditData={this.state.display_name}
                            />
                            <InputWithLabel
                              label="カナ名"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'medicine_kana_name')}
                              diseaseEditData={this.state.medicine_kana_name}
                            />
                            <InputWithLabel
                              label="略称"
                              type="text"
                              getInputText={this.setSearchValue.bind(this, 'short_medicine_name')}
                              diseaseEditData={this.state.short_medicine_name}
                            />
                          </div>
                          <div className={'flex'} style={{marginTop:"0.5rem"}}>
                            <div className={'check-area flex'}>
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
                            </div>
                            <div className={'flex search-value'}>
                              <InputWithLabel
                                label="単位"
                                type="text"
                                getInputText={this.setSearchValue.bind(this, 'unit')}
                                diseaseEditData={this.state.unit}
                              />
                              <InputWithLabel
                                label="一般名"
                                type="text"
                                getInputText={this.setSearchValue.bind(this, 'general_medicine_name')}
                                diseaseEditData={this.state.general_medicine_name}
                              />
                            </div>
                          </div>
                          <div style={{marginTop:"0.5rem"}}>
                            <Checkbox
                              label="有効"
                              getRadio={this.setMedicineType.bind(this)}
                              value={this.state.is_enabled === 1}
                              name="is_enabled"
                            />
                          </div>
                          <div className={'flex medicine-info'}>
                            <div className={'input-text'}>
                              <div>薬品の作用</div>
                              <div className={'text-area'}>
                                <textarea
                                />
                              </div>
                            </div>
                            <div className={'input-text'}>
                              <div>副作用、注意事項等</div>
                              <div className={'text-area'}>
                                <textarea
                                />
                              </div>
                            </div>
                            <div className={'input-text'}>
                              <div>フリーコメント</div>
                              <div className={'text-area'}>
                                <textarea
                                />
                              </div>
                            </div>
                          </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      <Button className="red-btn">登録</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

EditChemicalModal.contextType = Context;
EditChemicalModal.propTypes = {
    closeModal: PropTypes.func,
};

export default EditChemicalModal;
