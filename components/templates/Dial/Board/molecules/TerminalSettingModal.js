import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import Button from "../../../../atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

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
  .panel-menu {
    width: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    .menu-btn {
        width:100px;
        text-align: center;
        border: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 200px);
        border-bottom: 1px solid black;
    }
  }
  .footer {
    margin-left: 42%;
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
  .setting-area {
    width: 50%;    
    height: 410px;
  }
  
.box-border {
    border: 1px solid black;
    width: 370px;
    height: 250px;
    .select-area .radio-btn label {
        text-align: left;
        padding-left: 10px;
        border-radius: 4px;
    } 
}
.label-title {
    font-size: 14px;
    text-align: right;
    margin-right: 10px;
    width: 105px;
}
.bed_no-area {
    padding-bottom: 10px;
    input {
        width: 370px;
    }
}
.form-area {
    input {
        border: 1px solid rgb(206, 212, 218);
        border-radius: 4px;
        margin-right: 10px;
    }
    margin-bottom: 20px;
}
.save_times {
    input {
        width: calc(100% - 105px);
    }
}
.unit {
    padding: 20px 0 0 5px;
}
`;

const display_groups = ["透析室", "月水金　午前", "月水金　午後","月水金　夜間","火木土　午前","火木土　午後"];

const clinics = [
    {id:0, value:''},
    {id:1, value:'クリニック1'},
    {id:2, value:'クリニック2'},
    {id:3, value:'クリニック3'},
];
const consoles = [
    {id:0, value:''},
    {id:1, value:'CON-1'},
    {id:2, value:'CON-2'},
    {id:3, value:'CON-3'},
];

class InputPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id: 0,
            timing_code:0,
            console:0,
            bed_no:"",
            save_times:"",
            load_place:null,
            save_place:null,
        }
    }

    getTimingList = e => {
        this.setState({timing_code:e.target.id});
    };
    getConsole = e => {
        this.setState({console:e.target.id});
    };

    makeDeleteHistoryData = ( ) => {

    };
    getBedno = e => {
        this.setState({bed_no: e.target.value})
    };
    getSaveTimes = e => {
        this.setState({save_times: e.target.value})
    };
    setTab = ( e, val ) => {
        this.setState({ tab_id:val });
    };
    onChangeLoad(e) {
        this.setState({load_place:e.target.files[0]});
    }
    onChangeSave(e) {
        this.setState({save_place:e.target.files[0]});
    }

    onFormSubmit(e){
        e.preventDefault();
        // const formData = new FormData();
        // formData.append('bml_file',this.state.file);
        // const config = {
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }
        // };
        // axios.post("/app/api/v2/karte/inspection/results/upload/bml", formData, config)
        //     .then((response) => {
        //         if(response.data.alert_message) {
        //             alert(response.data.alert_message + "\n");
        //         }
        //     }).catch(() => {
        //     //  console.log(error);
        // });
    }

    onHide=()=>{}

    render() {
        const { closeModal } = this.props;
        return  (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal terminal-modal">
                <Modal.Header>
                    <Modal.Title>端末設定</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="panel-menu flex">
                            { this.state.tab_id == 0 ? (
                                <>
                                    <div className="active-menu">全般設定</div>
                                </>
                            ) : (
                                <>
                                    <div className="menu-btn" onClick={e => {this.setTab(e, "0");}}>全般設定</div>
                                </>
                            )}
                            { this.state.tab_id == 1 ? (
                                <>
                                    <div className="active-menu">検査設定</div>
                                </>
                            ) : (
                                <>
                                    <div className="menu-btn" onClick={e => {this.setTab(e, "1");}}>検査設定</div>
                                </>
                            )}
                            <div className="no-menu"></div>
                        </div>
                        { this.state.tab_id == 0 ? (
                            <>
                                <div className="setting-area">
                                    <div className="display-facility">
                                        <SelectorWithLabel
                                            options={clinics}
                                            title="表示施設"
                                            getSelect={this.getTimingList.bind(this)}
                                            departmentEditCode={this.state.timing_code}
                                        />
                                    </div>
                                    <div className="group-area flex">
                                        <div className="label-title">表示グループ</div>
                                        <div className="box-border">
                                            <div className="dummy_2 select-area">
                                                <>
                                                    {display_groups.map((item, key)=>{
                                                        return (
                                                            <>
                                                                <RadioButton
                                                                    id={`history_${key}`}
                                                                    value={key}
                                                                    label={item}
                                                                    name="display_groups"
                                                                    getUsage={this.makeDeleteHistoryData()}
                                                                />
                                                            </>
                                                        );
                                                    })}
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bed_no-area">
                                        <InputWithLabel
                                            label="ベッド番号"
                                            type="text"
                                            getInputText={this.getBedno.bind(this)}
                                            diseaseEditData={this.state.bed_no}
                                        />
                                    </div>
                                    <div className="console-no-area">
                                        <SelectorWithLabel
                                            options={consoles}
                                            title="コンソール番号"
                                            getSelect={this.getConsole.bind(this)}
                                            departmentEditCode={this.state.console}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="setting-area">
                                    <div className="form-area">
                                        <form onSubmit={this.onFormSubmit}>
                                            <label className="label-title">検査取込参照先</label>
                                            <input type="file" name="load_file" id="load_file" onChange= {this.onChangeLoad} accept="" />
                                            <button type="submit" id="btn">検索</button>
                                        </form>
                                    </div>
                                    <div className="form-area">
                                        <form onSubmit={this.onFormSubmit}>
                                            <label className="label-title">検査履歴保存先</label>
                                            <input type="file" name="save_file" id="save_file" onChange= {this.onChangeSave} accept="" />
                                            <button type="submit" id="btn">検索</button>
                                        </form>
                                    </div>
                                    <div className="save_times flex">
                                        <InputWithLabel
                                            label="履歴保存数"
                                            type="number"
                                            getInputText={this.getSaveTimes.bind(this)}
                                            diseaseEditData={this.state.save_times}
                                        />
                                        <div className="unit">件</div>
                                    </div>
                                </div>
                            </>
                        )}

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

InputPanel.contextType = Context;

InputPanel.propTypes = {
    closeModal: PropTypes.func,
};

export default InputPanel;
