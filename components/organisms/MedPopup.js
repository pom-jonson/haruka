import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import SmallMedList from "../molecules/SmallMedList";
import styled from "styled-components";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import LoadingModal from "~/components/molecules/LoadingModal";

const Ul = styled.ul`
  padding: 0;
  li {
    margin: 4px 0;
    padding: 4px;
  }
  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 60px);

    .no-result {
      padding: 200px;
      text-align: center;
      padding-top: 30vh;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


class MedPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isEnter: false
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.LoadingModalRef = React.createRef();
  }

  componentDidMount() {
    document.getElementById("medicine_dlg").focus();
  }

  onKeyPressed(e) {
    const { selectedIndex } = this.state;
    const { medicineData } = this.props;

    if (e.keyCode === 38) {
      this.setState(
        {
          selectedIndex:
            selectedIndex == 0 ? medicineData.length - 1 : selectedIndex - 1
        },
        () => {
          this.scrollToelement();
        }
      );
    } else if (e.keyCode === 40) {
      this.setState(
        {
          selectedIndex:
            selectedIndex == medicineData.length - 1 ? 0 : selectedIndex + 1
        },
        () => {
          this.scrollToelement();
        }
      );
    } else if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      /*
      let code = medicineData[this.state.selectedIndex].code;
      let disabled = false;
      this.props.presData.map(function(order) {
        order.medicines.map(function(item) {
          if (item.medicineId === code) {
            disabled = true;
          }
        });
      });
      if (disabled === false) {
        // this.setState({ isEnter: true });
        this.props.insertMed(
          medicineData[this.state.selectedIndex],
          this.props.indexOfInsertPres,
          this.props.indexOfInsertMed
        );
        this.props.medClose();
      }
      */
      this.LoadingModalRef.current.callVisible(true);
      if(medicineData[this.state.selectedIndex] != null && medicineData[this.state.selectedIndex].code != undefined){
        this.props.insertMed(
          medicineData[this.state.selectedIndex],
          this.props.indexOfInsertPres,
          this.props.indexOfInsertMed
        );
      } else {
        this.LoadingModalRef.current.callVisible(false);
      }
    // this.props.medClose();
    }
  }

  getClassName = (code, index) => {
    let className = "";
    if (this.state.selectedIndex === index) {
      className = "focused";
    }
    
    let disabled = "";
    this.props.presData.map(function(order) {
      order.medicines.map(function(item) {
        if (item.medicineId === code) {
          disabled = " disabled";
        }
      });
    });

    className = className + disabled;

    let con_alert = "";
    this.props.presData.map(function(order) {
      order.medicines.map(function(item) {
        if(item.contraindication_alert){
          if(item.contraindication_alert.includes(code.toString())){
            con_alert = " duplicate-alert";
          }
        }        
      });
    });

    className = className + con_alert;


    if(con_alert == " duplicate-alert") return className;
    let con_reject = "";
    this.props.presData.map(function(order) {
      order.medicines.map(function(item) {
        if(item.contraindication_reject){
          if(item.contraindication_reject.includes(code.toString())){
            con_reject = " duplicate-reject";
          }
        }        
      });
    });

    className = className + con_reject;

    return className;
  };

  onMouseOver = index => {
    this.setState({
      selectedIndex: index
    });
  };

  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .modal-body");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = $(els[0]).position().top;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  insertMed = (medicine, indexOfInsertPres, indexOfInsertMed) => {
    this.LoadingModalRef.current.callVisible(true);
    this.props.insertMed(medicine, indexOfInsertPres, indexOfInsertMed);
  };

  render() {
    const { isEnter } = this.state;
    const { medicineData } = this.props;
    let rate="";
    if(this.props.isLoaded) {
      if(medicineData.length == 0){
        rate = <div className="table-scroll"><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></div>;
      } else {
        rate = medicineData.map((medicine, i) => (
          <SmallMedList
            key={medicine.code}
            medicine={medicine}
            insertMed={this.insertMed}
            className={this.getClassName(medicine.code, i)}
            isEnter={isEnter}
            indexOfInsertPres={this.props.indexOfInsertPres}
            indexOfInsertMed={this.props.indexOfInsertMed}
            onMouseOver={this.onMouseOver}
            itemIndex={i}
            scroll={this.scrollToElement}
            onHideDlg = {this.props.medClose}
            isExistPrefixMedicine = {this.props.isExistPrefixMedicine}
            normalNameSearch = {this.props.normalNameSearch}
          />
        ))
      }
    } else {
      rate = <SpinnerWrapper><Spinner animation="border" variant="secondary" /></SpinnerWrapper>;
    }
    return (
      <Modal
        show={this.props.medShow}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="medicine_dlg"
        className="custom-modal-sm med-modal med-shadow-modal first-view-modal "
        size="lg"
        onHideDlg = {this.props.medClose}
      >
        <Modal.Header>
          <Modal.Title>薬品の選択</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflowY:'auto'}}>
          <Ul>
            {rate}
            
          </Ul>
        </Modal.Body>
        <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.medClose}>キャンセル</Button>            
        </Modal.Footer>
        <LoadingModal 
          ref={this.LoadingModalRef}
          message={'処理中...'}           
        />
      </Modal>
    );
  }
}

MedPopup.propTypes = {
  isLoaded: PropTypes.bool,
  normalNameSearch: PropTypes.bool,
  medClose: PropTypes.func,
  medOpen: PropTypes.func,
  medicineData: PropTypes.array,
  medShow: PropTypes.bool,
  isExistPrefixMedicine: PropTypes.bool,
  insertMed: PropTypes.func,
  indexOfInsertPres: PropTypes.number,
  indexOfInsertMed: PropTypes.number,
  presData: PropTypes.array
};

export default MedPopup;
