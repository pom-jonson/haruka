import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import {formatTimeIE} from "../../../../../helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import * as methods from "~/components/templates/Dial/DialMethods";
import {stand_units} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 400px;
  overflow-y: auto;
  flex-direction: column;
  display: flex;
  text-align: center;
  .footer {
    margin-top: 15px;
    text-align: center;
    width:100%;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      padding-left: 60px;
      padding-right: 60px;   
      margin-right:10px; 
    }
    .add-button {
      text-align: center;      
    }
    span {
      color: white;
      font-size: 16px;
      letter-spacing: 7px;
      margin-left:4px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}

.no-result {
      padding: 150px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
.table_area {
  height: 50vh;
      width: 100%;
    overflow-y: auto;
  }
      .sheet_button{
        margin-left: 20px;        
        opacity: 0.5;
    }
    .selected.sheet_button{
        opacity: 1;
        border: 2px dotted;
    }
table {
    overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          font-size: 16px;
          padding: 0.25rem;
      }
      th {
          font-size: 16px;
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 40px;
      }
      .item-no {
        width: 30px;
      }
      .code-number {
          width: 120px;
      }
      .alarm-type {
          width: 300px;
      }
  }
 `;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 33vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class OperationLogView extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
        is_loaded: this.props.is_loaded,
        list_item:this.props.list_item,
    };
  }

  componentDidMount(){
    this.getStaffs();
  }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if(this.state.is_loaded !== nextProps.is_loaded){
        this.setState({
            is_loaded: nextProps.is_loaded,
            list_item:nextProps.list_item,
        });
      }
    }

    getComment = (index, e) => {
      var temp = this.state.list_item;
      temp[index].comment = e.target.value;
      this.setState({list_item:temp});
      this.props.changeData();
    }
  
    getRadio = (index, name, value) => {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      var temp = this.state.list_item;
      if (name == 'check'){
        temp[index].monitor_display = value;
        temp[index].monitor_staff = authInfo.user_number;
      }
      this.setState({list_item:temp});
      this.props.changeData();
    }

  render() {
    let {list_item, staff_list_by_number} = this.state;
    let message;
    if (list_item == null || list_item.length ==0) {
        message = <div className="no-result"><span>操作履歴がありません</span></div>;
    }    

    return  (
      
        <Wrapper>
          <table className="table-scroll table table-bordered">
            <thead>
              <tr>
                  <th className={`item-no`}/>
                <th className={`code-number`}>操作日時</th>
                <th className={`alarm-type`}>操作項目</th>
                <th>操作内容</th>
                <th>メモ</th>
                <th>スタッフ</th>
                <th>モニタ表示</th>
              </tr>
            </thead>
              {this.state.is_loaded ? (
                  <>
                  <tbody>
                  {list_item !== undefined && list_item !== null && list_item.length > 0 && staff_list_by_number != undefined ? (
                      list_item.map((item, index) => {
                        var ol_content = item.ol_content;
                        var arr_ol_content = ol_content.split(' ');
                        var unit = '';                        
                        if (arr_ol_content.length > 1){
                          if (stand_units.includes(arr_ol_content[arr_ol_content.length - 1])) unit = arr_ol_content[arr_ol_content.length - 1];
                        }
                        var new_ol_content = '';
                        if (unit != ''){
                          for (var i = 0;i < arr_ol_content.length -1; i++)
                          new_ol_content += arr_ol_content[i] + ' ';
                        } else {
                          new_ol_content = ol_content;
                        }
                          return (
                              <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td>{index+1}</td>
                                      <td>{formatTimeIE(item.ol_time)}</td>
                                      <td>{item.ol_type + '　'+ unit}</td>
                                      <td>{new_ol_content}</td>
                                      <td><input type="text" value={item.comment} onChange={this.getComment.bind(this, index)} style = {{width:'100%'}}/></td>
                                      <td>
                                        <div>
                                        </div>
                                        <div>
                                        {/*{item.monitor_display==1? (item.monitor_staff>0 ? staff_list_by_number[item.monitor_staff]:''):(item.created_by>0 ? staff_list_by_number[item.created_by]:'')}*/}
                                            {item.monitor_display==1 && item.monitor_staff>0 ? staff_list_by_number[item.monitor_staff]:''}
                                        </div>
                                        
                                      </td>
                                      <td>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getRadio.bind(this, index)}
                                          // isDisabled={item.monitor_display!=undefined && item.monitor_display!=null && item.monitor_display==1?true:false}
                                          value={item.monitor_display!=undefined && item.monitor_display!=null?item.monitor_display:false}
                                          name="check"
                                        /> 
                                      </td>
                                  </tr>
                              </>)
                      })
                  ): (
                      <tr>
                          <td colSpan={7}>
                              {message}
                          </td>
                      </tr>
                  )}
                  </tbody>
                  </>
              ): (
                  <div className='text-center'>
                      <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                  </div>
              )}
            </table>
        </Wrapper>
    );
  }
}

OperationLogView.contextType = Context;

OperationLogView.propTypes = {
  is_loaded: PropTypes.bool,
  list_item: PropTypes.array,
  changeData: PropTypes.function,
};

export default OperationLogView;
