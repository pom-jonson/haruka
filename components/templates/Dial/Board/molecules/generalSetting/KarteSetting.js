import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'


const Wrapper = styled.div`
  width:95%;
  padding-top:20px;
  background-color: ${surface};
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .radio-title-label{
      margin-right:15px;
      width:65px;
      text-align:right;
  }
  .radio-btn{
      width:160px;
      background-color:black;
      label{
        margin-bottom: 0px;
        color: white;
      }
      input:checked + label {
          border-radius:0px;
          background:red;
      }
  }
  .time-title-label{
      width:40px;
  }
  .react-datepicker-wrapper{
      margin-right:10px;
  }
  .radio_area{
      margin-bottom:15px;
  }
  .time_set_area{
      margin-bottom:10px;
  }
  .input_area{
    .label-title{
      width:76px;
      text-align: right;
    }
    input{
      width:90px;
      margin-right:10px;
    }
    span{
      font-size:12px;
      width:40px;
      padding-top:15px;
      padding-left:5px;
    }
  }
  .alarm-set-title{
    margin-top: 50px;
    text-align: left;
    margin-bottom: 5px;
  }
  .selectbox-title{
      text-align:left;
  }
  .alarm_area{
      margin-left:30px;
  }

  .dial-body {
      width: 100%;
      padding: 10px;
      height:100%;
      
        table {
            tr:nth-child(even) {background-color: #f2f2f2;}
            tr:hover{background-color:#e2e2e2 !important;}
            td {
                padding: 0.25rem;
                text-align: center;
                position:relative;
                input {
                    margin: 0;
                }                
            }
            th {
                text-align: center;
                padding: 0.3rem;
            }
            .table-check {
                width: 60px;
            }
            .table-content {
                width: 65%;
            }
        }
        .tl {
            text-align: left;
        }
        .tr {
            text-align: right;
        }
        
      }
      .menu-td {
        line-height: 30px;
        padding: 0;
      }
      .color-value {
        padding: 3px 0 0 5px;
      }
  }
`;
const table_menu = ["日付", "血圧体重", "処置モニタ", "Drカルテ", "画像", "処方", "注射", "検査", "管理料"];

class KarteSetting extends Component {
    constructor(props) {
        super(props);
        let kalta_colors = new Array(9);
        for (var i = 0; i < kalta_colors.length; i++) {
            kalta_colors[i] = new Array(3);
        }
        for(i =0; i < 9; i++){
            for (var j = 0; j < 3; j++){
                kalta_colors[i][j] = {r: '241', g: '112', b: '19',a: '1'};
            }
        }
        this.state = {
            weight_set:0,
            water_set:0,
            time_set:0,
            display_water:0,
            alaram_set:0,

            displayColorPicker: false,
            kalta_colors,
            color: {r: '241',g: '112',b: '19',a: '1',},
            row_index:0,
            col_index:0,
        }
    }

    getWeightSet = (e) =>{
        this.setState({weight_set:parseInt(e.target.value)});
    }
    handleClick = (row_index, col_index) => {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker,
            row_index,
            col_index,
        })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        var tmp = this.state.kalta_colors;
        var row_index = this.state.row_index;
        var col_index = this.state.col_index;
        tmp[row_index][col_index] = color.rgb;
        this.setState({
            kalta_colors: tmp,
            color: color.rgb
        })
    };

    render() {

        let cur_kalta_colors = this.state.kalta_colors;
        return (
            <>
                <Wrapper>
                    <div className="flex radio_area">
                        <label className="radio-title-label">処方印字</label>
                        <RadioButton
                            id="male"
                            value={0}
                            label="毎回印字"
                            name="increse-weight"
                            getUsage={this.getWeightSet.bind(this)}
                            checked={this.state.weight_set == 0 ? true : false}
                        />
                        <RadioButton
                            id="femaie"
                            value={1}
                            label="前回と同じ場合はDoと印字"
                            name="increse-weight"
                            getUsage={this.getWeightSet}
                            checked={this.state.weight_set == 1 ? true : false}
                        />
                    </div>
                    <div className="dial-body">
                        <div className="table-area">                            
                            <table className="table-scroll table table-bordered" id="medical-record-table">
                                <thead>
                                    <tr>
                                        <th className="text-center"></th>
                                        <th className="text-center">文字色</th>
                                        <th className="text-center">背景色</th>
                                        <th className="text-center">帳票文字色</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {cur_kalta_colors !== undefined && cur_kalta_colors !== null && cur_kalta_colors.length > 0 && (
                                    cur_kalta_colors.map((items, row_index) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td className="menu-td">{table_menu[row_index]}</td>
                                                    {items.map((item, col_index) =>{
                                                        let styles = reactCSS({
                                                            'default': {
                                                                color: {
                                                                    width: '36px',
                                                                    height: '14px',
                                                                    borderRadius: '2px',
                                                                    background: `rgba(${ item.r }, ${ item.g }, ${ item.b }, ${ item.a })`,
                                                                },
                                                                swatch: {
                                                                    padding: '5px',
                                                                    background: '#fff',
                                                                    borderRadius: '1px',
                                                                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                                                                    display: 'inline-block',
                                                                    cursor: 'pointer',
                                                                },
                                                                popover: {
                                                                    position: 'absolute',
                                                                    zIndex: '2',
                                                                    top:'25px'
                                                                },
                                                                cover: {
                                                                    position: 'fixed',
                                                                    top: '0px',
                                                                    right: '0px',
                                                                    bottom: '0px',
                                                                    left: '0px',
                                                                },
                                                            },
                                                        });
                                                        return (
                                                            <>
                                                                <td>
                                                                { this.state.displayColorPicker && this.state.row_index ===row_index && this.state.col_index ===col_index ? <div style={ styles.popover }>
                                                                    <div style={ styles.cover } onClick={ this.handleClose }/>
                                                                    <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
                                                                </div> : null }
                                                                    <div className="flex">
                                                                        <div style={ styles.swatch } onClick={ this.handleClick.bind(this, row_index, col_index) }>
                                                                            <div style={ styles.color } />
                                                                        </div>
                                                                        <div className="color-value">{item.r}、{item.g}、{item.b}</div>
                                                                    </div>
                                                                </td>
                                                            </>)
                                                    })}
                                                </tr>

                                            </>
                                        )
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Wrapper>
            </>
        )
    }
}

export default KarteSetting