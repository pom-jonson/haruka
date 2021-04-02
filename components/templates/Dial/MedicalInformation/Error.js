import React, { Component } from "react";
import PropTypes from "prop-types";

class Error extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    let {log_data} = this.props;        
    return (
      <>
        <div style={{height:"29rem",overflowY:"auto"}}>
          {log_data != undefined && log_data != null && log_data.length>0 && 
          log_data.map(item=>{
            return (
              <div key={item} className="mt-1">
                {item.error_type == "エラー" ? item.body : ""}
              </div>
            )
          })}
        </div>     
      </>
    )
  }
}
Error.propTypes = {
    log_data:PropTypes.array
};

export default Error