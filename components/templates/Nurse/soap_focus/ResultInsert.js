import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat,
  formatDateFull
} from "~/helpers/date";
registerLocale("ja", ja);
import {setDateColorClassName} from '~/helpers/dialConstants'
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  font-size:1rem;
  padding: 1%;
  .selected {
    background: lightblue;
  }
  .left-area, .right-area {
    .title {
      background: lightgray;
    }
    height: 100%;
    overflow-y: auto;
    border: solid 1px gray;
  }
  .left-area {
    width: 36%;
    .left-title {
      width: 100%;
      background: lightgray;
      padding: 0.3rem 0;
    }
    .left-content {
      overflow-y: auto;
    }
    .select {
      background: lightblue;
    }
  }
  .right-area {
    margin-left: 4%;
    width: 60%;
    
    table{
      margin-bottom:0px;
      thead{
        display:table;
        width:100%;
      }
      tbody{
        display:block;
        overflow-y: auto;
        height: 18rem;
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      td {
        word-break: break-all;
        padding: 0.25rem;
        font-size:1rem;
        vertical-align: middle;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
          font-size:1rem;
          background: lightgray;
      }
      .td-check {
          width: 3rem;
          text-align: center;
          label {
              margin:0;
          }
      }
      .td-name{
          width: 11rem;
      }
      .td-result{
        width: 13rem;
        .label-title {
          width: 0 !important;
        }
        .pullbox-label, .pullbox-select {
          width: 100%;
          height: 2.375rem;
        }
        .pullbox-label {
          margin-bottom: 0;
        }
        input {
          width: 100%;
        }
      }
    }
  }
  .select-date {
    button {
      height:2.3rem;
      margin-right:0.5rem;
    }
    input {
      height: 2.3rem;
    }
    .react-datepicker{
      width: 130% !important;
      font-size: 1.25rem;
      .react-datepicker__month-container{
        width:79% !important;
        height:20rem;
      }
      .react-datepicker__time-list {
        height: 17rem;
      }
      .react-datepicker__navigation--next--with-time{
        right: 6rem;
      }
      .react-datepicker__time-container{
        width:21% !important;
      }
      .react-datepicker__time-box{
        width:auto !important;
      }
      .react-datepicker__current-month{
        font-size: 1.25rem;
      }
      .react-datepicker__day-names, .react-datepicker__week{
        display: flex;
        justify-content: space-between;
      }
      .react-datepicker__month{
        .react-datepicker__week{
          margin-bottom:0.25rem;
        }
      }
    }
  }
`;

class ResultInsert extends Component {
    constructor(props) {
      super(props);
      this.state = {
        input_date: new Date(props.cur_datetime),
        title_array: [],
        check_array:[],
        comment_check: false,
      };
    }

    async UNSAFE_componentWillMount () {
      let {tier_master_3rd, selected_tier, elapsed_result, unit_master, elapsed_select_item_master} = this.props;
      let {title_array, check_array} = this.state;
      if (tier_master_3rd != null && selected_tier != null) {
        tier_master_3rd.map(item=> {
          if (item.tier_2nd_id == selected_tier.tier_2nd_id) {
            let find_elapsed_result = elapsed_result.find(x=>x.tier_3rd_id == item.number);
            if (find_elapsed_result != undefined) {
              item.selected = true;
              let find_elapsed_select_items = [{id: 0, value: '', unit: ''}];
              if (elapsed_select_item_master.length > 0) {
                elapsed_select_item_master.map((select_item)=>{
                  if (select_item.tier_1st_id == item.tier_1st_id && select_item.tier_2nd_id == item.tier_2nd_id && select_item.tier_3rd_id == item.number) {
                    let find_unit = unit_master.find(x=>x.number == select_item.unit_id);
                    find_elapsed_select_items.push({id:select_item.number, value:select_item.name, unit: find_unit != undefined ? find_unit.name : ""});
                  }
                })  
              }
              let check_item = {
                tier_1st_id: item.tier_1st_id, 
                tier_2nd_id: item.tier_2nd_id, 
                tier_3rd_id: item.number, 
                name: item.name, 
                comment: find_elapsed_result.tier_3rd_free_comment,
                select_options: find_elapsed_select_items, 
                result: 0, 
                unit:'',
                result_check: false,
                comment_check: false,
              };
              
              check_array.push(check_item);
            }
            title_array.push(item);
          }
        })
      }
      this.setState({
        title_array,
        check_array
      })

    }
    onHide = () => {};
    getCheck = (index, sub_index, name, value) => {
      if (name == 'check') {
        let {check_array} = this.state;
        check_array[index][sub_index] = value;
        this.setState({check_array});
      }
    };
    moveDay = (type) => {
      let now_day = this.state.input_date;
      if(now_day === ''){
        now_day = new Date();
      }
      let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);

      this.setState({
        input_date: cur_day,
      });
    };
    selectToday=()=>{
      this.setState({
        input_date: new Date(),
      });
    };
    getDate = (key,value) => {
      this.setState({[key]: value});
    };
    getResultStatus = (index, e) => {
      let {check_array} = this.state;
      if (check_array[index] == undefined || check_array[index] == null) return;
      check_array[index].result = e.target.id;
      let unit = '';
      let select_options = check_array[index].select_options; 
      if(select_options != undefined && select_options.length > 0) {
        unit = select_options.find(x=>x.id == e.target.id).unit != undefined ? select_options.find(x=>x.id == e.target.id).unit : "";
      } 
      check_array[index].unit = unit;
      this.setState({check_array});
    }
    handleOk = () => {
      let post_data = [];
      this.state.check_array.map(item=>{
        if (item.result_check == true || item.comment_check == true) {
          let insert_item = {
            tier_1st_id: item.tier_1st_id,
              tier_2nd_id: item.tier_2nd_id,
              tier_3rd_id: item.tier_3rd_id,
              tier_3rd_name: item.name,
              comment: item.comment,
              result: item.result,
              input_datetime: formatDateFull(this.state.input_date, "-"),
          };
          post_data.push(insert_item);
        }
      });
      if (post_data.length > 0) {
        this.props.handleOk(post_data);
      } 
    }
    getComment = (index, e) => {
      let {check_array} = this.state;
      if (!check_array[index].comment_check) return;
      check_array[index].comment = e.target.value;
      this.change_flag = 1;
      this.setState({check_array});
    };
    render() {
      let {title_array, check_array} = this.state;
      return (
        <>
          <Modal show={true} className="chart-title-modal" onHide={this.onHide}>
            <Modal.Header><Modal.Title>結果入力</Modal.Title></Modal.Header>
            <Modal.Body>
              <DatePickerBox style={{width:"100%", height:"100%"}}>
                <Wrapper>
                  <div>状態</div>
                  <div className={'select-date flex'} style={{marginBottom:"0.5rem"}}>
                    <button onClick={this.moveDay.bind(this, 'prev')}>{'<'}</button>
                    <DatePicker
                        locale="ja"
                        id='end_date_id'
                        selected={this.state.input_date}
                        onChange={this.getDate.bind(this,"input_date")}
                        dateFormat="yyyy/MM/dd HH:mm"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                    />
                    <button onClick={this.moveDay.bind(this, 'next')} style={{marginLeft:"0.5rem"}}>{'>'}</button>
                    <button className="ml-3" onClick={this.selectToday}>現在時刻</button>
                  </div>
                  <div className="w-100 d-flex">
                    <div className="left-area">
                    <div className="text-center left-title">タイトル名称</div>
                    <div className="left-content p-2">
                      {title_array.length > 0 && title_array.map((item,index)=>{
                        return (
                          <div key={index} className={item.selected ? "select" : ""}>{item.name}</div>
                        )
                      })}
                    </div>
                    </div>
                    <div className="right-area table-area">
                      <table className="table-scroll table table-bordered" id="code-table">
                        <thead>
                          <tr>
                            <th className='td-check'>表示</th>
                            <th className='td-name'>測定名称</th>
                            <th className='td-result'>結果</th>
                            <th className='td-unit'>単位</th>
                          </tr>
                        </thead>
                        <tbody>
                          {check_array != undefined && check_array.length > 0 && check_array.map((item,index)=>{
                            return (
                              <>
                              <tr key={index}>
                                <td className='td-check'>
                                  <Checkbox
                                    label=''
                                    id={`result_check_${index}`}
                                    getRadio={this.getCheck.bind(this,index, 'result_check')}
                                    value={item.result_check}
                                    name="check"
                                  />
                                </td>
                                <td className='td-name'>{item.name}</td>
                                <td className='td-result'>
                                  <SelectorWithLabel
                                    title=""
                                    options={item.select_options}
                                    getSelect={this.getResultStatus.bind(this, index)}
                                    departmentEditCode={item.result}
                                    disabled={!item.result_check}
                                  />
                                </td>
                                <td className='td-unit'>{item.unit}</td>
                              </tr>
                              <tr key={index}>
                                <td className='td-check'>
                                  <Checkbox
                                    label=''
                                    id={`comment_check_${index}`}
                                    getRadio={this.getCheck.bind(this,index, 'comment_check')}
                                    value={item.comment_check}
                                    name="check"
                                  />
                                </td>
                                <td className='td-name'>コメント</td>
                                <td className='td-result'>
                                  <input type="text" value={item.comment} onChange={this.getComment.bind(this, index)} disabled={!item.comment_check}/>
                                </td>
                                <td className='td-unit'></td>
                              </tr>
                              </>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Wrapper>
              </DatePickerBox>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
              <Button className="red-btn" onClick={this.handleOk}>確定</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
}

ResultInsert.contextType = Context;
ResultInsert.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  tier_master_3rd: PropTypes.array,
  elapsed_select_item_master: PropTypes.array,
  unit_master: PropTypes.array,
  elapsed_result: PropTypes.array,
  selected_tier: PropTypes.object,
  cur_datetime: PropTypes.string
};

export default ResultInsert;