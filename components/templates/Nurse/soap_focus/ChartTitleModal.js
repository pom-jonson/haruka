import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
  width:100%;
  height: 100%;
  font-size:1rem;
  .flex {
    display:flex;
    flex-wrap: wrap;
  }
  .search-word {
    .div-title {
      line-height: 2rem;
      width: 8rem;
    }
    input {
      font-size: 1rem;
      height:2rem;
      margin:0;
      width:20rem;
    }
    button {
      width:4rem;
      height:2rem;
      margin-left:0.5rem;
    }
  }
  .comment-area {
    width: 40%;
    label {
     width: 0 ;
     margin: 0;
    }
    input {
        font-size: 1rem;
        height:2rem;
        margin:0;
    }
  }
  .comment-area {
    width: 100%;
    div {
      width:calc(100% - 4rem);
      div {display:none;}
    }
    input {
      width: 100%;
    }
    button {
      margin-left:0.5rem;
      width:4rem;
    }
  }
  .list-area {
    width: 30%;
    .title{
      margin-top: 0.5rem;
    }
    .content{
      height: 20rem;
      overflow-y: auto;
      border: solid 1px gray;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding: 0.2rem;
      div{
        cursor: pointer;
      }
    }
    .selected {
      background: lightblue;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class ChartTitleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_word:'',
      tier_master_1st:[],
      tier_master_2nd:[],
      tier_master_3rd:[],
      tier_1st:[],
      tier_2nd:[],
      tier_3rd:[],
      first_number: '',
      second_number: '',
      third_number: '',
      third_name:"",
      comment: '',
      alert_messages: '',
    };
  }

  async UNSAFE_componentWillMount () {
    this.getMasterData();
  }

  getMasterData = async() => {
    let path = "/app/api/v2/nurse/get_elapsed_master";
    let post_data = {name:this.state.search_word};
    if (this.state.is_loaded) this.setState({is_loaded: false});
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          tier_master_1st:res.tier_master_1st,
          tier_1st:res.tier_master_1st,
          tier_master_2nd:res.tier_master_2nd,
          tier_2nd:res.tier_master_2nd,
          tier_master_3rd:res.tier_master_3rd,
          tier_3rd:[],
          first_number: '',
          second_number: '',
          third_number: '',
          third_name: '',
          is_loaded: true,
        })
      });
  }

  getInputWord = e => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    this.setState({search_word: e.target.value, cur_caret_pos:cur_caret_pos});
  };

  onClickInputWord = () => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    this.setState({cur_caret_pos});
  };
  onInputKeyPressed = (e) => {
    if(e.keyCode === 13){
      this.getMasterData();
    }
  };
  getComment = e => {
    this.setState({comment: e.target.value});
  };
  selectFirstMaster = (item) =>{
    let tier_2nd = [];
    let tier_3rd = [];
    this.state.tier_master_2nd.map(second_item=>{
      if (second_item.tier_1st_id == item.number)
        tier_2nd.push(second_item);
    });
    this.setState({
      first_number: item.number,
      tier_2nd,
      tier_3rd,
      second_number:"",
      third_number:"",
      third_name:"",
    });
  };
  selectSecondMaster = (item) =>{
    let tier_3rd = [];
    this.state.tier_master_3rd.map(second_item=>{
      if (second_item.tier_2nd_id == item.number)
        tier_3rd.push(second_item);
    });
    this.setState({
      second_number: item.number,
      tier_3rd,
      third_number:"",
      third_name:"",
    });
  };
  selectThirdMaster = (item) =>{
    this.setState({
      third_number: item.number,
      third_name:item.name
    });
  };

  confirmOk=()=>{
    if(this.state.third_number == ""){
      this.setState({alert_messages: '第三階層を選択してください。'})
    } else {
      let post_data = [{
        tier_1st_id: this.state.first_number,
        tier_2nd_id: this.state.second_number,
        tier_3rd_id: this.state.third_number,
        tier_3rd_name: this.state.third_name,
        tier_3rd_free_comment: this.state.comment,
      }];
      this.props.setElapsedTitle(post_data);
    }
  }

  closeModal=()=>{
    this.setState({
      alert_messages: '',
    })
  }

  getInputdate = (name, value) => {
    this.setState({[name]:value});
    this.change_flag = true;
  }

  render() {
    let {tier_1st, tier_2nd, tier_3rd} = this.state;
    return (
      <>
        <Modal show={true} className="chart-title-modal first-view-modal">
          <Modal.Header><Modal.Title>観察項目選択</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'search-word flex'}>
                <div className={'div-title'}>検索キーワード</div>
                <InputKeyWord
                  id={'search_input'}
                  type="text"
                  label=""
                  onChange={this.getInputWord.bind(this)}
                  onKeyPressed={this.onInputKeyPressed}
                  onClick={this.onClickInputWord}
                  value={this.state.search_word}
                />
                <button onClick={this.getMasterData.bind(this)}>検索</button>
              </div>
              {this.state.Load === false ? (
                <>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </>
              ) : (
                <div className="w-100 flex">
                  <div className="list-area">
                    <div className="title">第一階層</div>
                    <div className="content">
                      {tier_1st != undefined && tier_1st.length > 0 && tier_1st.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectFirstMaster.bind(this, item)} className={this.state.first_number == item.number ? "selected" : ''}>
                            {item.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="list-area" style={{marginLeft:"5%"}}>
                    <div className="title">第二階層</div>
                    <div className="content">
                      {tier_2nd != undefined && tier_2nd.length > 0 && tier_2nd.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectSecondMaster.bind(this, item)} className={this.state.second_number == item.number ? "selected" : ''}>
                            {item.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="list-area" style={{marginLeft:"5%"}}>
                    <div className="title">第三階層</div>
                    <div className="content">
                      {tier_3rd != undefined && tier_3rd.length > 0 && tier_3rd.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectThirdMaster.bind(this, item)} className={this.state.third_number == item.number ? "selected" : ''}>
                            {item.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div>フリーコメント</div>
              <div className='comment-area flex'>
                <InputKeyWord
                  id={'comment_input'}
                  type="text"
                  label=""
                  onChange={this.getComment.bind(this)}
                  value={this.state.comment}
                />
                <button onClick={this.confirmOk}>反映</button>
              </div>              
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

ChartTitleModal.contextType = Context;
ChartTitleModal.propTypes = {
  closeModal: PropTypes.func,
  setElapsedTitle: PropTypes.func,
};

export default ChartTitleModal;