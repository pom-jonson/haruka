import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import RadioButton from "~/components/molecules/RadioInlineButton";
import $ from "jquery";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .left-area {
        width: 230px;
        height: 100%;
        margin-right: 2%;
        overflow: auto;
        border: 1px solid #aaa;
        .image-area {
            width: 200px;
            height: 200px;
            border: 1px solid #aaa;
            margin: 0.625rem;
            text-align:center;
             img {
                max-width:198px;
                max-height:180px;
                padding: 5px;
             }
        }
    }
    .md-btn {
        line-height: 30px;
        width: 80px;
    }
    .right-area {
        // width: calc(98% - 230px);
        width:100%;
        .active-btn {
            background-color:white,
            color:
        }
        .view-screen{
            .label-title {
                width: 0;
            }
            .pullbox-label {
                margin: 0;
                select {
                    width:150px;
                }
            }
        }
        .image-area {
            width:100%;
            height:90%;
            text-align:center;
            overflow:auto;
             img {
                max-width:100%;
                max-height:94%;
                padding: 5px;
             }
        }
        .select-radio {
            label {
                margin: 0;
                line-height: 35px;
                width: 3.75rem;
                border: 1px solid;
                border-radius: 0px;
                margin-right: 3px;
                font-weight: 600;
            }
        }
        .control-btn{
            min-width: 22px;
            height: 22px;
            margin-left: 10px;
            font-size: 13px;
            margin-top: 0px;
            padding-top: 0;
            padding-bottom: 0;
            border:1px solid;
        }
    }
`;

const Footer = styled.div`
  display:flex;
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
`;

class DigitalImageVAModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_mode:1,
    };
  }
  
  async componentDidMount() {
  }
  
  imageZoomMinus = () => {
    $('.img').width(function(n, c){
      if (c >= 30) return c - 10;
      else return c;
    })
    $('.img')[0].style.maxWidth = 'none';
    $('.img')[0].style.maxHeight = 'none';
  }
  
  imageZoomPlus = () => {
    $('.img').width(function(n, c){
      if (c <= 1000) return c + 10;
      else return c;
    })
    $('.img')[0].style.maxWidth = 'none';
    $('.img')[0].style.maxHeight = 'none';
  }
  
  imageFit = () => {
    $('.img')[0].style.height = 'auto';
    $('.img')[0].style.width = 'auto';
    $('.img')[0].style.maxWidth = '100%';
    $('.img')[0].style.maxHeight = '94%';
  }
  
  imageOrigin = () => {
    $('.img')[0].style.height = 'auto';
    $('.img')[0].style.width = 'auto';
    $('.img')[0].style.maxWidth = 'none';
    $('.img')[0].style.maxHeight = 'none';
  }
  
  render() {
    return (
      <>
        <Modal
          show={true}
          className="master-modal digital-image-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>デジタル画像</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'} style={{height:"100%"}}>
                {/* <div className={'left-area'}>
                                    {Object.keys(this.image_list).map((index) => {
                                        return (
                                            <>
                                                <div className={'image-area'}>
                                                    <img src={this.image_list[index]['imgBase64']} alt="" />
                                                </div>
                                            </>
                                        )
                                    })}
                                </div> */}
                <div className={'right-area'}>
                  <div className={'flex'} style={{height: "calc(100% - 0px)", paddingTop:"10px"}}>
                    {this.state.view_mode === 1 && (
                      <>
                        <div style={{width:"100%", border:"1px solid #aaa"}}>
                          <div className={'image-area'}>
                            <div style={{lineHeight:'calc(80vh - 210px)', height:'100%'}}>
                              <img className='img' src={this.props.image['imgBase64']} alt="" />
                            </div>
                          </div>
                          <div className='text-center'>
                            <div>
                              <span>{this.props.image['image_title'] != null && this.props.image['image_title'] != ''? this.props.image['image_title'] : this.props.image['name']}</span>
                            </div>
                            <div className=''>
                              <button className='control-btn control-symbol' onClick={this.imageZoomPlus.bind(this)}><span>拡大</span></button>
                              <button className='control-btn control-symbol' onClick={this.imageZoomMinus.bind(this)}><span>縮小</span></button>
                              <button className='control-btn' onClick={this.imageFit.bind(this)}><span>１００％</span></button>
                              <button className='control-btn' onClick={this.imageOrigin.bind(this)}><span>原寸</span></button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            </Footer>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

DigitalImageVAModal.contextType = Context;
DigitalImageVAModal.propTypes = {
  closeModal: PropTypes.func,
  image:PropTypes.object,
};

export default DigitalImageVAModal;
