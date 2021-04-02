import React,{Component} from 'react';
import * as localApi from "~/helpers/cacheLocal-utils";
import PropTypes from "prop-types";
import {getServerTime} from "../../../../helpers/constants";
import {formatDateFull, formatJapanDate} from "../../../../helpers/date";

let runner;

class Clock extends Component{
  constructor(props) {
    super(props);
    this.state = {
      date_time:'',
      time : ''
    };
    this.reload_time = 30;
  }
  
  getCurrentServerTime=async()=>{
    let date_time = this.state.date_time;
    if(date_time == "" || this.reload_time == 0){
      date_time = await getServerTime();
      this.reload_time = 30;
    } else {
      let server_time_stamp = new Date(date_time);
      server_time_stamp.setSeconds(server_time_stamp.getSeconds() + 1);
      date_time = formatDateFull(server_time_stamp, "/");
      this.reload_time--;
    }
    return date_time;
  }
  
  getCurrentTime = () =>{
    const locale = [];
    const hour12 = false;
    let hour,minute,second;
    // if(this.props.format){
    //     switch (this.props.format.toLowerCase()) {
    //         case 'hh':
    //             hour = '2-digit';
    //             break;
    //         case 'hh-mm':
    //             hour = '2-digit';
    //             minute = '2-digit';
    //             break;
    //         case 'hh-mm-ss':
    //             hour='2-digit';
    //             minute='2-digit';
    //             second='2-digit';
    //             break;
    //         default:
    hour='2-digit';
    minute='2-digit';
    second='2-digit';
    // }
    // }

    let server_time = localApi.getValue("server_time");
    if(server_time != undefined && server_time != null){
        return server_time.split(" ")[1];
    } else {
      let time = new Date().toLocaleTimeString(locale,{'hour12':hour12,'hour':hour,'minute':minute,'second':second});
      return time;
    }
  }

  componentDidMount() {
    runner = setInterval(async() => {
      let date_time = await this.getCurrentServerTime();
      this.setState({
        date_time,
        time:date_time.split(' ')[1]
      });
    }, 1000);
  }
  
  componentWillUnmount() {
    if (runner) {
      clearInterval(runner);
    }
  }
  
  render(){
    return(
      <div className={'clock-area'}>
        <div className={'cur-date-time'}>{this.state.date_time == "" ? "" : formatJapanDate(new Date(this.state.date_time))}</div>
        <div className={'clock'}>{this.state.time}</div>
      </div>
    );
  }
}

Clock.propTypes = {
  date_time : PropTypes.string,
};
export default Clock;
