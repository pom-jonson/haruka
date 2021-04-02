import React, { Component } from "react";
import styled from "styled-components";
import med from "~/components/_demo/VA3.jpg";

const Card = styled.div`
  .med-descript{
    border: 1px solid #aaa;
  }
  .med-label{
    padding: 10px;
  }
`;

class MedNavi extends Component {
  constructor(props) {
      super(props);
      
  }
      
  render() {        
    return (
      <>
				<Card>
          <div className="med-label">
            <span>商品名</span>
          </div>
          <div className="med-label">
            <span>商品名</span>
          </div>
          <div className="med-image">
            <img src={med} />
          </div>
          <div className="med-label">
            薬剤説明
          </div>
          <div className="med-descript">
            薬剤説明
          </div>
        </Card>
      </>
    )
  }
}

export default MedNavi