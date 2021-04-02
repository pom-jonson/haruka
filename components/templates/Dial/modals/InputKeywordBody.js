import React, { Component } from "react";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .panel-menu {
    width: 100%;
    font-weight: bold;
    height: 2.5rem;
    .menu-btn {
        width:6.25rem;
        text-align: center;
        border-bottom: 1px solid #aaa;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 0.3rem 0;
        cursor: pointer;
    }
    .active-menu {
        width:6.25rem;
        text-align: center;
        border-top: 1px solid #aaa;
        border-right: 1px solid #aaa;
        border-left: 1px solid #aaa;
        padding: 0.3rem 0;
    }
    .no-menu {
        width: calc(100% - 6.25rem);
        border-bottom: 1px solid #aaa;
    }
  }
  .word-select-area {
    width: 100%;
    height: calc(100% - 2.5rem);
    border-bottom: 1px solid #aaa;
    border-left: 1px solid #aaa;
    border-right: 1px solid #aaa;
    .word-btn-area {
        width: 100%;
        padding-top: 0.625rem; 
        .word-btn {
            display: flex;
            margin-left: 1%;   
             button {
                margin-left: 1%;
                margin-right: 1%;
                width: 31%;
                margin-bottom: 0.625rem;
            }
        }
        .word-type-head {
            text-align: left;
            margin-left: 2%;
        }
        .select-word-type {
            margin-left: 2%;
            font-size: 1rem;
            padding-top: 0.3rem;
            .radio-btn label{
                width: 20%;
                border: solid 1px rgb(206, 212, 218);
                border-radius: 0.25rem;
                margin-right: 0.3rem;
                padding: 0.25rem 0.3rem;
                font-size: 1rem;  
            }
        }
        .search-word-type {
            .radio-btn label{
                width: 25%;
            }
        }
    }
  }
 `;

const ContextMenuUl = styled.ul`
  margin-bottom:0!important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
    display:flex;
    border: 1px solid #aaa;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
    border-right: 1px solid #aaa;
  }
  .context-menu li:last-child {
    border:none;
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>

                    <>
                        {favouriteMenuType.map((item)=>{
                            return (
                                <>
                                    <li onClick={() => parent.contextMenuAction(item)}><div>{item}</div></li>
                                </>
                            );
                        })}
                    </>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

const word_type = ["アイウ", "123", "ABC"];

class InputKeywordBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id:0,
            word_type:0,
            search_type:1,
        }
    }

    setTab = ( e, val ) => {
        this.setState({ tab_id:val });
    };

    selectWordType = (e) => {
        this.setState({ word_type: parseInt(e.target.value)});
    };

    selectSearchType = (e) => {
        let value = parseInt(e.target.value);
        this.setState({ search_type: value },()=>{
            this.props.selectSearchType(value);
        });
    };

    setInputWord = (value) => {
        this.props.inputWord(value);
    };

    removeWord = () => {
        this.props.removeWord();
    };

    setMoveCaret = (type) => {
        this.props.moveCaret(type);
    };

    convertKana = (type) => {
        this.props.convertKana(type);
    };

    murkyKana = () => {
        this.props.murkyKana();
    };

    semivarousKana = () => {
        this.props.semivarousKana();
    };

    handleClick = (e, string_arr, cur_id) => {
        e.preventDefault();
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside(e) {
            var obj = e.target;
            do {
                if( obj.id === cur_id) return;
                obj = obj.parentElement;
            } while(obj.tagName.toLowerCase() !== "body");
            that.setState({ contextMenu: { visible: false } });
            document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
                contextMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
            .getElementById(cur_id)
            .addEventListener("scroll", function onScrollOutside() {
                that.setState({
                    contextMenu: { visible: false }
                });
                document
                    .getElementById(cur_id)
                    .removeEventListener(`scroll`, onScrollOutside);
            });
        let type = cur_id.split('_')[1];
        // let x_length = e.clientX - document.getElementById("select_pannel_modal").offsetLeft;
        // let y_length = e.clientY - document.getElementById("select_pannel_modal").offsetTop - 150;            
        let x_length = e.clientX - document.getElementById("select_pannel_modal").offsetLeft;
        let y_length = e.clientY - document.getElementsByClassName("prescript-medicine-select-modal")[0].offsetTop - 75 ;
        if(type === 'abc'){
            x_length -= 70;
        } else {
            x_length -= 120;
        }
        this.setState({
            contextMenu: {
                visible: true,
                x: x_length,
                y: y_length,
            },
            favouriteMenuType: string_arr.split("")
        }, ()=>{
            let window_width = document.getElementById("select_pannel_modal").offsetWidth;            
            let menu_width = 0;
            if(type === 'abc'){
                menu_width = 146 + 40;
            } else {
                menu_width = 206 + 40;
            }
            if ((x_length + menu_width) > window_width) {
                if(type === 'abc'){
                    x_length -= 80;
                } else {
                    x_length -= 90;
                }
                this.setState({
                    contextMenu: {
                        visible: true,
                        x: x_length,
                        y: y_length,
                    },
                    favouriteMenuType: string_arr.split("")
                })
            }
        });
    };

    contextMenuAction = (word) => {
        this.props.inputWord(word);
    };

    render() {
        return (
            <>
                <Wrapper id= "keybody-area">
                    <div className="panel-menu flex">
                        { this.state.tab_id === 0 ? (
                            <>
                                <div className="active-menu">文字検索</div>
                            </>
                        ) : (
                            <>
                                <div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>文字検索</div>
                            </>
                        )}
                        <div className="no-menu"></div>
                    </div>
                    <div className={'word-select-area'}>
                        <div className="word-btn-area">
                            { this.state.word_type === 0 && (
                                <>
                                    <div className={'word-btn'} id={'word_aiu_1'}>
                                        <button onClick={e => this.handleClick(e, 'アイウエオ', 'word_aiu_1')}>ア</button>
                                        <button onClick={e => this.handleClick(e, 'カキクケコ', 'word_aiu_1')}>カ</button>
                                        <button onClick={e => this.handleClick(e, 'サシスセソ', 'word_aiu_1')}>サ</button>
                                    </div>
                                    <div className={'word-btn'} id={'word_aiu_2'}>
                                        <button onClick={e => this.handleClick(e, 'タチツテト', 'word_aiu_2')}>タ</button>
                                        <button onClick={e => this.handleClick(e, 'ナニヌネノ', 'word_aiu_2')}>ナ</button>
                                        <button onClick={e => this.handleClick(e, 'ハヒフヘホ', 'word_aiu_2')}>ハ</button>
                                    </div>
                                    <div className={'word-btn'} id={'word_aiu_3'}>
                                        <button onClick={e => this.handleClick(e, 'マミムメモ', 'word_aiu_3')}>マ</button>
                                        <button onClick={e => this.handleClick(e, 'ヤユヨ', 'word_aiu_3')}>ヤ</button>
                                        <button onClick={e => this.handleClick(e, 'ラリルレロ', 'word_aiu_3')}>ラ</button>
                                    </div>
                                    <div className={'word-btn'} id={'word_aiu_4'}>
                                        <button onClick={e => this.handleClick(e, 'ワヲン', 'word_aiu_4')}>ワ</button>
                                        <button></button>
                                        <button></button>
                                    </div>
                                    <div className={'word-btn'}>
                                        <button onClick={this.convertKana.bind(this, 'japan')}>大小</button>
                                        <button onClick={this.murkyKana.bind(this)}>〝</button>
                                        <button onClick={this.semivarousKana.bind(this)}>°</button>
                                    </div>
                                    <div className={'word-btn'}>
                                        <button onClick={this.removeWord.bind(this)}>{'<×]'}</button>
                                        <button onClick={this.setMoveCaret.bind(this,'prev')}>←</button>
                                        <button onClick={this.setMoveCaret.bind(this,'next')}>→</button>
                                    </div>
                                </>
                            )}
                            { this.state.word_type === 1 && (
                                <>
                                        <div className={'word-btn'}>
                                            <button onClick={this.setInputWord.bind(this, '1')}>1</button>
                                            <button onClick={this.setInputWord.bind(this, '2')}>2</button>
                                            <button onClick={this.setInputWord.bind(this, '3')}>3</button>
                                        </div>
                                        <div className={'word-btn'}>
                                            <button onClick={this.setInputWord.bind(this, '4')}>4</button>
                                            <button onClick={this.setInputWord.bind(this, '5')}>5</button>
                                            <button onClick={this.setInputWord.bind(this, '6')}>6</button>
                                        </div>
                                        <div className={'word-btn'}>
                                            <button onClick={this.setInputWord.bind(this, '7')}>7</button>
                                            <button onClick={this.setInputWord.bind(this, '8')}>8</button>
                                            <button onClick={this.setInputWord.bind(this, '9')}>9</button>
                                        </div>
                                        <div className={'word-btn'}>
                                            <button></button>
                                            <button onClick={this.setInputWord.bind(this, '0')}>0</button>
                                            <button onClick={this.setInputWord.bind(this, '.')}>.</button>
                                        </div>
                                        <div className={'word-btn'}>
                                            <button onClick={this.removeWord.bind(this)}>{'<×]'}</button>
                                            <button onClick={this.setMoveCaret.bind(this,'prev')}>←</button>
                                            <button onClick={this.setMoveCaret.bind(this,'next')}>→</button>
                                        </div>
                                </>
                            )}
                            { this.state.word_type === 2 && (
                                <>
                                    <div className={'word-btn'} id={'word_abc_1'}>
                                        <button onClick={this.setInputWord.bind(this, '.')}>.</button>
                                        <button onClick={e => this.handleClick(e, 'ABC', 'word_abc_1')}>ABC</button>
                                        <button onClick={e => this.handleClick(e, 'DEF', 'word_abc_1')}>DEF</button>
                                    </div>
                                    <div className={'word-btn'} id={'word_abc_2'}>
                                        <button onClick={e => this.handleClick(e, 'GHI', 'word_abc_2')}>GHI</button>
                                        <button onClick={e => this.handleClick(e, 'JKL', 'word_abc_2')}>JKL</button>
                                        <button onClick={e => this.handleClick(e, 'MNO', 'word_abc_2')}>MNO</button>
                                    </div>
                                    <div className={'word-btn'} id={'word_abc_3'}>
                                        <button onClick={e => this.handleClick(e, 'PQRS', 'word_abc_3')}>PQRS</button>
                                        <button onClick={e => this.handleClick(e, 'TUV', 'word_abc_3')}>TUV</button>
                                        <button onClick={e => this.handleClick(e, 'WXYZ', 'word_abc_3')}>WXYZ</button>
                                    </div>
                                    <div className={'word-btn'}>
                                        <button onClick={this.convertKana.bind(this, 'english')}>A/a</button>
                                        <button></button>
                                        <button></button>
                                    </div>
                                    <div className={'word-btn'}>
                                        <button onClick={this.removeWord.bind(this)}>{'<×]'}</button>
                                        <button onClick={this.setMoveCaret.bind(this,'prev')}>←</button>
                                        <button onClick={this.setMoveCaret.bind(this,'next')}>→</button>
                                    </div>
                                </>
                            )}
                            <div className={'word-type-head'}>文字タイプ</div>
                            <div className={'select-word-type'}>
                                <>
                                    {word_type.map((item, index)=>{
                                        return (
                                            <>
                                                <RadioButton
                                                    id={`word_type_${index}`}
                                                    value={index}
                                                    label={item}
                                                    name="word_type"
                                                    getUsage={this.selectWordType}
                                                    checked={this.state.word_type === index ? true : false}
                                                />
                                            </>
                                        );
                                    })
                                    }
                                </>
                            </div>
                            <div className={'word-type-head'}>検索条件</div>
                            <div className={'select-word-type search-word-type'}>
                                <RadioButton
                                    id={"search_type_0"}
                                    value={0}
                                    label={'前方一致'}
                                    name="search_types"
                                    getUsage={this.selectSearchType.bind(this)}
                                    checked={this.state.search_type === 0 ? true : false}
                                />
                                <RadioButton
                                    id={"search_type_1"}
                                    value={1}
                                    label={'部分一致'}
                                    name="search_types"
                                    getUsage={this.selectSearchType.bind(this)}
                                    checked={this.state.search_type === 1 ? true : false}
                                />
                            </div>
                        </div>
                    </div>
                </Wrapper>
                <ContextMenu
                    {...this.state.contextMenu}
                    parent={this}
                    favouriteMenuType={this.state.favouriteMenuType}
                />
            </>
        )
    }
}
InputKeywordBody.contextType = Context;

InputKeywordBody.propTypes = {
    selectSearchType:PropTypes.func,
    inputWord: PropTypes.func,
    removeWord: PropTypes.func,
    moveCaret: PropTypes.func,
    convertKana: PropTypes.func,
    murkyKana: PropTypes.func,
    semivarousKana: PropTypes.func,
};

export default InputKeywordBody