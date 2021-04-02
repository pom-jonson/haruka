import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import RadioButton from "~/components/molecules/RadioInlineButton"
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`  
    .header{
        
    }
    .flex{
        display:flex;
    }
    .list{
        width:48%;
        border:1px solid lightgray;
        margin-right:3px;
        margin-bottom:10px;
    }    
    .table-area{
        margin-bottom:10px;
        height:100px;
        border:1px solid lightgray;
        overflow-y:scroll;
      }
    
      table{
        th{
          padding-top:1px;
          padding-bottom:1px;
          background:lightgray;
          border-right:1px solid;
        }
      }
    .footer{
        margin-top:5px;
        text-align:right;
        button{
            margin-right:10px;
        }
    }
 `;

class AddCommentModal extends Component {
  constructor(props) {
    super(props); 
    this.state = { 
    }
  }

  render() {    
    return  (
        <Modal show={true} id=""  className="">
          <Modal.Header>
            <Modal.Title>定型コメント</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>                
                <div className="comment-list flex" style ={{height:'200px', overflowY:'scroll'}}>
                    <div className="list category"></div>
                    <div className="list detail"></div>
                </div>
                <div className="table-area">
                    <table className='table-scroll table table-bordered'>
                        <thead>
                            <th style={{width:'30px'}}></th>
                            <th>コメント</th>
                        </thead>
                    </table>
                </div>
                <div className="footer">                    
                    <Button type="mono" className ="">確定</Button>
                    <Button className="" onClick={this.props.closeModal}>閉じる</Button>
                </div>
                
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

AddCommentModal.contextType = Context;

AddCommentModal.propTypes = {  
  closeModal: PropTypes.func,  
};

export default AddCommentModal;
