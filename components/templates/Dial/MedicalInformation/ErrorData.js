import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorData extends Component {
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
                {item.error_type == "データ不備" ? item.body : ""}
              </div>
            )
          })}
        </div>     
      </>
    )
  }
}
ErrorData.propTypes = {
    log_data:PropTypes.array
};

export default ErrorData