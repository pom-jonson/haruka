import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {displayLineBreak} from "~/helpers/dialConstants";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import axios from "axios";

const imageButtonStyle = {
  textAlign: "center",
  color: "blue",
  cursor: "pointer",
  float: "right"
};

class CytologyExamOrderData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endoscope_image:"",
      isOpenInspectionImageModal: false,
    };
    this.radio_option1=["無し","使用中", "使用後"];
    this.radio_option2=["無し","治療中", "治療後"];
  }

  openInspectionImageModal = async (number) => {
    if (this.props.from_source == "right-box") {
      this.openInspectionImageModalFromData(number);
      return;
    }
    let path = "/app/api/v2/order/examination/getImage";    

    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  // open shema(内視鏡)
  openInspectionImageModalFromData = (data) => {
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpenInspectionImageModal: false
    });
  }

  render() {
    let {cache_data, from_source} = this.props;
    if (cache_data === undefined || (cache_data != undefined && Object.keys(cache_data).length === 0)) {
      return (<></>)
    } else
      return (
        <>
          {from_source == "detail-modal" && (
            <>
              {cache_data.menstruation_date !== undefined && cache_data.menstruation_date !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">最終月経</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.menstruation_date.split("-").join("/")}  {cache_data.menstruation_period !== undefined && cache_data.menstruation_period !== '' ? ("　日数：" + cache_data.menstruation_period + "日") : ""}</div>
                  </div>
                </div>
              )}
              {cache_data.menopause !== undefined && cache_data.menopause !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">閉経</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.menopause}歳</div>
                  </div>
                </div>
              )}
              {((cache_data.pregnancy !== undefined && cache_data.pregnancy !== '') || (cache_data.production !== undefined && cache_data.production !== '')) && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item"></div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {cache_data.pregnancy != undefined && cache_data.pregnancy != '' ? (cache_data.pregnancy + " 妊 ") : "" }
                      {cache_data.production != undefined && cache_data.production != '' ? (cache_data.production + " 産 ") : "" }
                    </div>
                  </div>
                </div>
              )}
              {cache_data.clinical_diagnosis !== undefined && cache_data.clinical_diagnosis !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">臨床診断</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{displayLineBreak(cache_data.clinical_diagnosis)}</div>
                  </div>
                </div>
              )}
              {cache_data.image_path != null && cache_data.image_path != undefined && cache_data.image_path != "" && cache_data.number > 0 && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item"></div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      <a
                        className="modal_data-image-title"
                        onClick={() => this.openInspectionImageModal(cache_data.number)}
                        style={imageButtonStyle}
                      >
                        画像を見る
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {cache_data.previous_histology !== undefined && cache_data.previous_histology !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">既往組織診結果</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.previous_histology}</div>
                  </div>
                </div>
              )}
              {cache_data.done_instruction !== undefined && cache_data.done_instruction !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">実施機関</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.done_instruction}</div>
                  </div>
                </div>
              )}
              {cache_data.recheck !== undefined && cache_data.recheck !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item"></div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">細胞診再検</div>
                  </div>
                </div>
              )}
              {cache_data.before_class !== undefined && cache_data.before_class !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">前回クラス</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.before_class}</div>
                  </div>
                </div>
              )}
              {cache_data.recheck_array !== undefined &&
              (cache_data.recheck_array.find(x=>x.date != '') !== undefined || cache_data.recheck_array.find(x=>x.number != '')  !== undefined) && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item"></div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">
                      {cache_data.recheck_array.map(item=>{
                        if(item.date != "" || item.number != "")
                          return (
                            <div key={item}>
                              {item.date != '' ? ("再検日付：" + item.date.split("-").join("/")) : ""}
                              {item.number != '' ? ("　No：" + item.number) : ""}
                            </div>
                          )
                      })}
                    </div>
                  </div>
                </div>
              )}
              {cache_data.before_class !== undefined && cache_data.before_class !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">前回クラス</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.before_class}</div>
                  </div>
                </div>
              )}
              {cache_data.anticancer_use !== undefined && cache_data.anticancer_use !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">抗がん剤</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{this.radio_option1[cache_data.anticancer_use]}</div>
                  </div>
                </div>
              )}
              {cache_data.radiation_treat !== undefined && cache_data.radiation_treat !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">放射線治療</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{this.radio_option2[cache_data.radiation_treat]}</div>
                  </div>
                </div>
              )}
              {cache_data.hormon_use !== undefined && cache_data.hormon_use !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">ホルモン剤使用</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{this.radio_option1[cache_data.hormon_use]}</div>
                  </div>
                </div>
              )}
              {cache_data.hormon_use !== undefined && cache_data.hormon_use !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">種類</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.hormon_use}</div>
                  </div>
                </div>
              )}
              {cache_data.anticancer_amount !== undefined && cache_data.anticancer_amount !== '' && (
                <div className="flex between drug-item table-row">
                  <div className="text-left">
                    <div className="table-item">量</div>
                  </div>
                  <div className="text-right">
                    <div className="table-item remarks-comment">{cache_data.anticancer_amount}</div>
                  </div>
                </div>
              )}
              </>
          )}
          {this.state.isOpenInspectionImageModal == true && (
            <EndoscopeImageModal
              closeModal={this.closeModal}
              imgBase64={this.state.endoscope_image}
            />
          )}
        </>
      )
  }
}

CytologyExamOrderData.contextType = Context;

CytologyExamOrderData.propTypes = {
  cache_data: PropTypes.object,
  from_source: PropTypes.string,
};

export default CytologyExamOrderData;