import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InputWithLabel from "../../../molecules/InputWithLabel";
import Button from "../../../atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .footer {    
    margin-left: 35%;
    margin-top: 20px;
  }
  .footer button {
    margin-right: 10px;
    background-color: rgb(38, 159, 191);
    border-color: rgb(38, 159, 191);
    span {
        color: white;
        font-size: 14px;
    }
  }
  .min-value-area {
    width: 30%;
    margin-left: 3%;
    label {
        width: 0;
    }
  }
  .max-value-area {
    width: 30%;
    label {
        width: 0;
    }
  }
  .display-range {
    width: 30%;    
    text-align: center;
    padding-top: 18px;
  }
`;

class RangeSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeMin1: "",
            rangeMin2: "",
            rangeMin3: "",
            rangeMin4: "",
            rangeMin5: "",
            rangeMax1: "",
            rangeMax2: "",
            rangeMax3: "",
            rangeMax4: "",
            rangeMax5: "",
        }
    }

    getRangeMin1 = e => {
        this.setState({rangeMin1: e.target.value})
    };
    getRangeMax1 = e => {
        this.setState({rangeMax1: e.target.value})
    };
    getRangeMin2 = e => {
        this.setState({rangeMin2: e.target.value})
    };
    getRangeMax2 = e => {
        this.setState({rangeMax2: e.target.value})
    };
    getRangeMin3 = e => {
        this.setState({rangeMin3: e.target.value})
    };
    getRangeMax3 = e => {
        this.setState({rangeMax3: e.target.value})
    };
    getRangeMin4 = e => {
        this.setState({rangeMin4: e.target.value})
    };
    getRangeMax4 = e => {
        this.setState({rangeMax4: e.target.value})
    };
    getRangeMin5 = e => {
        this.setState({rangeMin5: e.target.value})
    };
    getRangeMax5 = e => {
        this.setState({rangeMax5: e.target.value})
    };

    onHide=()=>{}

    render() {
        const { closeModal } = this.props;
        return  (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal range-setting-modal">
                <Modal.Header>
                    <Modal.Title>適正透析分析 表示範囲設定</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div>血色素量 (Hb)</div>
                        <div className={'flex'}>
                            <div className={'min-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMin1.bind(this)}
                                    diseaseEditData={this.state.rangeMin1}
                                />
                            </div>
                            <div className={'display-range'}>{" ≺ 表示範囲1 ≦ "}  </div>
                            <div className={'max-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMax1.bind(this)}
                                    diseaseEditData={this.state.rangeMax1}
                                />
                            </div>
                        </div>
                        <div className={'flex'}>
                            <div className={'min-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMin2.bind(this)}
                                    diseaseEditData={this.state.rangeMin2}
                                />
                            </div>
                            <div className={'display-range'}>{" ≺ 表示範囲2 ≦ "}  </div>
                            <div className={'max-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMax2.bind(this)}
                                    diseaseEditData={this.state.rangeMax2}
                                />
                            </div>
                        </div>
                        <div className={'flex'}>
                            <div className={'min-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMin3.bind(this)}
                                    diseaseEditData={this.state.rangeMin3}
                                />
                            </div>
                            <div className={'display-range'}>{" ≺ 表示範囲3 ≦ "}  </div>
                            <div className={'max-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMax3.bind(this)}
                                    diseaseEditData={this.state.rangeMax3}
                                />
                            </div>
                        </div>
                        <div className={'flex'}>
                            <div className={'min-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMin4.bind(this)}
                                    diseaseEditData={this.state.rangeMin4}
                                />
                            </div>
                            <div className={'display-range'}>{" ≺ 表示範囲4 ≦ "}  </div>
                            <div className={'max-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMax4.bind(this)}
                                    diseaseEditData={this.state.rangeMax4}
                                />
                            </div>
                        </div>
                        <div className={'flex'}>
                            <div className={'min-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMin5.bind(this)}
                                    diseaseEditData={this.state.rangeMin5}
                                />
                            </div>
                            <div className={'display-range'}>{" ≺ 表示範囲5 ≦ "}  </div>
                            <div className={'max-value-area'}>
                                <InputWithLabel
                                    label=""
                                    type="text"
                                    getInputText={this.getRangeMax5.bind(this)}
                                    diseaseEditData={this.state.rangeMax5}
                                />
                            </div>
                        </div>

                        <div className="footer footer-buttons">
                            <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
                            <Button className="red-btn">登録</Button>
                        </div>
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

RangeSetting.contextType = Context;

RangeSetting.propTypes = {
    closeModal: PropTypes.func,
    saveContact: PropTypes.func,
};

export default RangeSetting;
