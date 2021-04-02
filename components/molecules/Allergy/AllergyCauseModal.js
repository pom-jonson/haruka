import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
// import Checkbox from "~/components/molecules/Checkbox";
// import DatePicker, { registerLocale } from "react-datepicker";
// import ja from "date-fns/locale/ja";
// import AllergyCauseModal from "./AllergyCauseModal";

// registerLocale("ja", ja);

const Wrapper = styled.div`
  display:block;
  background:white;
  width:100%;
  height:100%;
  min-height:350px;
  padding-left:20px;
  
  .flex, .list{
      margin-top:5px;
      margin-bottom:5px;
  }
  .list{
      width:100%;
      overflow-y:auto;
      min-height:200px;
      border:1px solid;
  }
  label{
    font-size:1rem;
  }
  .label-title{
      width:5rem;
  }
  .disease-area{
      padding-left:5%;
      .label-title{
          display:none;
      }
      input{
          width:90%;
      }
  }

`;

const Footer = styled.div`
    display: flex;    
    span{
      color: white;
      font-size: 16px;
    }
    button{
      float: right;
      padding: 5px;
      font-size: 16px;
      margin-right: 16px;
    }
    .ixnvCM{
        font-size: 15px;
        padding-top: 8px;
    }
  `;

class AllergyCauseModal extends Component {    
  
    constructor(props) {
      super(props);
      this.modal_title = '';
      
      switch(this.props.allergy_kind){
          case 0:
            this.modal_title = 'アレルギー薬剤';
            break;
          case 1:
            this.modal_title = 'アレルギー食物';
            break;
          case 2:
            this.modal_title = 'アレルギー造影剤';
            break;
          case 3:
            this.modal_title = 'その他アレルギー';
            break;
          case 4:
            this.modal_title = '皮内テスト';
            break;
          case 5:
            this.modal_title = 'インプラント';
            break;
      }
      this.state = {
        
      }
    }
  
    componentDidMount() {}
  
    getSearchWord = e => {
        this.setState({search_word:e.target.value});
    }

    getKind (e){
        this.setState({search_kind:e.target.value})
    }

    render() {
        // var kind = this.props.allergy_kind;
        
      return (
        <Modal show={true} id="first-view-modal" className="custom-modal-sm first-view-modal">
        <Modal.Header>
            <Modal.Title>{this.modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
            <div className='search-area'>
                <InputWithLabel
                    label="検索条件"
                    type="text"
                    className="name-area"
                    getInputText={this.getSearchWord.bind(this)}
                    diseaseEditData={this.state.search_word}
                />
            </div>
            <div className='flex'>
                <Radiobox
                    id = {0}
                    label={'前方一致'}
                    value={0}
                    getUsage={this.getKind.bind(this)}
                    checked={this.state.search_kind == 0 ? true : false}
                    name={`kind`}
                />
                <Radiobox
                    id = {1}
                    label={'部分一致'}
                    value={1}
                    getUsage={this.getKind.bind(this)}
                    checked={this.state.search_kind == 1 ? true : false}
                    name={`kind`}
                />
            </div>
            <div className='list'>                
            </div>
            {this.props.modal_type == 'disease' && (
                <div className='disease-area'>
                    <InputWithLabel
                        label=""
                        type="text"
                        className="name-area"
                        getInputText={this.getSearchWord.bind(this)}
                        diseaseEditData={this.state.disease}
                    />
                </div>                
            )}
            </Wrapper>
        </Modal.Body>
        <Modal.Footer>  
            <Footer>                      
                <Button type="mono" onClick={this.props.closeModal}>確定</Button>
                <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
            </Footer>
        </Modal.Footer>
        </Modal>
        
      );
    }
  }
  
  AllergyCauseModal.propTypes = {
    allergy_kind:PropTypes.number,
    closeModal:PropTypes.func,
    modal_type: PropTypes.string,
  };
  
  export default AllergyCauseModal;