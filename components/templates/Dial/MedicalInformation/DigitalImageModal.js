import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import {formatDateSlash, formatDateTimeIE} from "~/helpers/date";
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
                max-height:175px;
                padding: 5px;
             }
        }
    }
    .md-btn {
        line-height: 30px;
        width: 80px;
        border:1px solid;
        height:33px;
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
    .right-area {
        width: calc(98% - 230px);
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
            div{
              height:100%;
            }
            .modified-size {
              max-width:100%;
              max-height:94%;
              padding: 5px;
            }
            .origin-size{
              width:auto;
              height:auto;
              padding:5px;
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

class DigitalImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_screen_mode:0,
            view_mode:2,
            image_index:0,
        };
        this.view_screen = [
          {id:0, value:"画面にフィット"},
          {id:1, value:"原寸表示"},
        ];
        this.image_list = {};
        let index = 0;
        props.image_list.map(image=>{
            if(image.imgBase64 !== ''){
                this.image_list[index] = image;
                index++;
            }
        });
    }

    async componentDidMount() {
    }

    setViewScreen = (e) => {
        this.setState({view_screen_mode:parseInt(e.target.id)});
    };

    setViewMode = (e) => {
        this.setState({view_mode:parseInt(e.target.value)});
    };

    moveImage=(act)=>{
      let image_index = this.state.image_index;
      if(act === "prev"){
        image_index --;
      } else {
        image_index ++;
      }
      if(this.image_list[image_index] !== undefined){
        this.setState({
          image_index,
          view_screen_mode:this.state.view_screen_mode + 1,
        }, () => {
          this.setState({view_screen_mode:this.state.view_screen_mode - 1})
        });
      }
    };

    imageZoomPlus = (image_index) => {
      if (this.state.view_screen_mode == 0){
        $('.modified-size_' + image_index).width(function(n, c){          
          if (c <= 1000) return c + 10;
          else return c;
        })
        $('.modified-size_' + image_index)[0].style.maxWidth = 'none';
        $('.modified-size_' + image_index)[0].style.maxHeight = 'none';
        
      } else {
        $('.origin-size_' + image_index).width(function(n, c){          
          if (c <= 1000) return c + 10;
          else return c;
        })
        $('.origin-size_' + image_index)[0].style.maxWidth = 'none';
        $('.origin-size_' + image_index)[0].style.maxHeight = 'none';
      }
    }

    imageZoomMinus = (image_index) => {
      if (this.state.view_screen_mode == 0){
          $('.modified-size_' + image_index).width(function(n, c){
            if (c >= 30) return c - 10;
            else return c;
          })
          $('.modified-size_' + image_index)[0].style.maxWidth = 'none';
          $('.modified-size_' + image_index)[0].style.maxHeight = 'none';
      } else {
        $('.origin-size_' + image_index).width(function(n, c){
          if (c >= 30) return c - 10;
          else return c;
        })
        $('.origin-size_' + image_index)[0].style.maxWidth = 'none';
        $('.origin-size_' + image_index)[0].style.maxHeight = 'none';
      }
    }

    imageFit = (image_index) => {
      if (this.state.view_screen_mode == 0){
        $('.modified-size_' + image_index)[0].style.height = 'auto';
        $('.modified-size_' + image_index)[0].style.width = 'auto';
        $('.modified-size_' + image_index)[0].style.maxWidth = '100%';
        $('.modified-size_' + image_index)[0].style.maxHeight = '94%';
      } else {
        $('.origin-size_' + image_index)[0].style.height = 'auto';
        $('.origin-size_' + image_index)[0].style.width = 'auto';
        $('.origin-size_' + image_index)[0].style.maxWidth = '100%';
        $('.origin-size_' + image_index)[0].style.maxHeight = '94%';
      }
    }

    imageOrigin = (image_index) => {
      if (this.state.view_screen_mode == 0){
        $('.modified-size_' + image_index)[0].style.height = 'auto';
        $('.modified-size_' + image_index)[0].style.width = 'auto';
        $('.modified-size_' + image_index)[0].style.maxWidth = 'none';
        $('.modified-size_' + image_index)[0].style.maxHeight = 'none';
      } else {
        $('.origin-size_' + image_index)[0].style.height = 'auto';
        $('.origin-size_' + image_index)[0].style.width = 'auto';
        $('.origin-size_' + image_index)[0].style.maxWidth = 'none';
        $('.origin-size_' + image_index)[0].style.maxHeight = 'none';
      }
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
                                <div className={'left-area'}>
                                    {Object.keys(this.image_list).map((index) => {
                                        var item = this.image_list[index];
                                        return (
                                            <>
                                                <div className={'image-area'}>
                                                  <div style={{lineHeight:'175px'}}>
                                                    <img src={this.image_list[index]['imgBase64']} alt="" />
                                                  </div>
                                                  <div className='text-center'>
                                                    <span>{formatDateSlash(formatDateTimeIE(item.updated_at))}</span>&nbsp;&nbsp;
                                                    <span>{item.image_title != null && item.image_title != ''? item.image_title : 'タイトルなし'}</span>
                                                  </div>
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>
                                <div className={'right-area'}>
                                    <div className={'flex'}>
                                        <div className={'flex'} style={{width:"49%", marginRight:"2%"}}>
                                            <div style={{width: "calc(100% - 80px)"}} className={'select-radio'}>
                                                <RadioButton
                                                    id="view_mode_1"
                                                    value={1}
                                                    label="1枚"
                                                    name="view_mode"
                                                    getUsage={this.setViewMode}
                                                    checked={this.state.view_mode === 1}
                                                />
                                                <RadioButton
                                                    id="view_mode_2"
                                                    value={2}
                                                    label="2枚"
                                                    name="view_mode"
                                                    getUsage={this.setViewMode}
                                                    checked={this.state.view_mode === 2}
                                                />
                                            </div>
                                            <button className={'md-btn'} onClick={this.moveImage.bind(this, 'prev')}>＜</button>
                                        </div>
                                        <div className={'flex'} style={{width:"49%"}}>
                                            <div style={{width: "calc(100% - 150px)"}}><button className={'md-btn'} onClick={this.moveImage.bind(this, 'next')}>＞</button></div>
                                            <div className={'view-screen'}>
                                                <SelectorWithLabel
                                                    options={this.view_screen}
                                                    getSelect={this.setViewScreen}
                                                    departmentEditCode={this.state.view_screen_mode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'flex'} style={{height: "calc(100% - 38px)", paddingTop:"10px"}}>
                                        {this.state.view_mode === 2 && (
                                            <>
                                                <div style={{width:"49%", marginRight:"2%", border:"1px solid #aaa"}}>
                                                    <div className={'image-area'}>
                                                      {this.state.view_screen_mode == 0 && (
                                                        <>
                                                        <div style={{lineHeight:'calc(80vh - 250px)'}}>
                                                          <img className={'modified-size modified-size_' + this.state.image_index} src={this.image_list[this.state.image_index]['imgBase64']} alt="" />
                                                        </div>
                                                        </>
                                                      )}
                                                      {this.state.view_screen_mode == 1 && (
                                                        <img className={'origin-size origin-size_' + this.state.image_index} src={this.image_list[this.state.image_index]['imgBase64']} alt="" />
                                                      )}                                                      
                                                    </div>
                                                    <div className='text-center'>
                                                      <span>{formatDateSlash(formatDateTimeIE(this.image_list[this.state.image_index].updated_at))}</span>&nbsp;&nbsp;
                                                      <span>{this.image_list[this.state.image_index].image_title != null && this.image_list[this.state.image_index].image_title != ''? this.image_list[this.state.image_index].image_title : 'タイトルなし'}</span>                                                      
                                                      <div className=''>
                                                        <button className='control-btn control-symbol' onClick={this.imageZoomPlus.bind(this, this.state.image_index)}><span>拡大</span></button>
                                                        <button className='control-btn control-symbol' onClick={this.imageZoomMinus.bind(this, this.state.image_index)}><span>縮小</span></button>
                                                        <button className='control-btn' onClick={this.imageFit.bind(this, this.state.image_index)}><span>１００％</span></button>
                                                        <button className='control-btn' onClick={this.imageOrigin.bind(this, this.state.image_index)}><span>原寸</span></button>
                                                      </div>
                                                    </div>
                                                </div>
                                                <div style={{width:"49%", border:"1px solid #aaa"}}>
                                                  {this.image_list[this.state.image_index + 1] !== undefined && (
                                                    <>
                                                    <div className={'image-area'}>
                                                      {this.state.view_screen_mode == 0 && (
                                                        <div style={{lineHeight:'calc(80vh - 250px)'}}>
                                                          <img className={'modified-size modified-size_' + (this.state.image_index+1)} src={this.image_list[this.state.image_index+1]['imgBase64']} alt="" />
                                                        </div>
                                                      )}
                                                      {this.state.view_screen_mode == 1 && (
                                                        <img className={'origin-size origin-size_' + (this.state.image_index+1)} src={this.image_list[this.state.image_index+1]['imgBase64']} alt="" />
                                                      )}                                                      
                                                    </div>
                                                    <div className='text-center'>
                                                      <span>{formatDateSlash(formatDateTimeIE(this.image_list[this.state.image_index + 1].updated_at))}</span>&nbsp;&nbsp;
                                                      <span>{this.image_list[this.state.image_index+1].image_title != null && this.image_list[this.state.image_index+1].image_title != ''? this.image_list[this.state.image_index+1].image_title : 'タイトルなし'}</span>                                                      
                                                      <div className=''>
                                                        <button className='control-btn control-symbol' onClick={this.imageZoomPlus.bind(this, this.state.image_index + 1)}><span>拡大</span></button>
                                                        <button className='control-btn control-symbol' onClick={this.imageZoomMinus.bind(this, this.state.image_index + 1)}><span>縮小</span></button>
                                                        <button className='control-btn' onClick={this.imageFit.bind(this, this.state.image_index + 1)}><span>１００％</span></button>
                                                        <button className='control-btn' onClick={this.imageOrigin.bind(this, this.state.image_index + 1)}><span>原寸</span></button>
                                                      </div>
                                                    </div>
                                                    </>
                                                  )}
                                                </div>
                                            </>
                                        )}
                                        {this.state.view_mode === 1 && (
                                            <>
                                                <div style={{width:"100%", border:"1px solid #aaa"}}>
                                                  <div className={'image-area'}>
                                                    {this.state.view_screen_mode == 0 && (
                                                      <>
                                                      <div style={{lineHeight:'calc(80vh - 250px)'}}>
                                                        <img className={'modified-size modified-size_' + this.state.image_index} src={this.image_list[this.state.image_index]['imgBase64']} alt="" />
                                                      </div>
                                                      </>
                                                    )}
                                                    {this.state.view_screen_mode == 1 && (
                                                      <>
                                                      <img className={'origin-size origin-size_' + this.state.image_index} src={this.image_list[this.state.image_index]['imgBase64']} alt="" />
                                                      </>
                                                    )}
                                                      
                                                  </div>
                                                    <div className='text-center'>
                                                      <span>{formatDateSlash(formatDateTimeIE(this.image_list[this.state.image_index].updated_at))}</span>&nbsp;&nbsp;
                                                      <span>{this.image_list[this.state.image_index].image_title != null && this.image_list[this.state.image_index].image_title != ''? this.image_list[this.state.image_index].image_title : 'タイトルなし'}</span>
                                                      <div className=''>
                                                        <button className='control-btn control-symbol' onClick={this.imageZoomPlus.bind(this, this.state.image_index)}><span>拡大</span></button>
                                                        <button className='control-btn control-symbol' onClick={this.imageZoomMinus.bind(this, this.state.image_index)}><span>縮小</span></button>
                                                        <button className='control-btn' onClick={this.imageFit.bind(this, this.state.image_index)}><span>１００％</span></button>
                                                        <button className='control-btn' onClick={this.imageOrigin.bind(this, this.state.image_index)}><span>原寸</span></button>
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

DigitalImageModal.contextType = Context;
DigitalImageModal.propTypes = {
    closeModal: PropTypes.func,
    image_list:PropTypes.array,
};

export default DigitalImageModal;
