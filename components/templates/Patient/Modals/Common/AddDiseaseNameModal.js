import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithErrorLabel from "~/components/molecules/InputWithErrorLabel";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import DiseaseNameListPopup from "../../../../organisms/DiseaseNameListPopup";
// import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`  
    .flex{
        display:flex;
    }
    .radio-area{
        width:45%;        
        margin-right: 10px;
        margin-top: 5px;
        border:1px solid darkgray;
        padding: 5px;    
        legend{
        font-size: 16px;
        width: auto;
        margin-bottom: 0;
        padding-left: 10px;
        margin-left: 10px;
        padding-right: 10px;
        }
        margin-bottom:10px;
        .radio-groups{
            label{
                margin-right:20px;
                margin-bottom:5px;
            }
        }
    }
    .medicine-list{
        border:1px solid lightgray;
    }
    .footer{
        margin-top:5px;
        text-align:right;
        button{
            margin-right:10px;
        }
    }
    
  .label-title {
    float: left;
    text-align: right;
    width: 70px;
    line-height: 38px;
    &.pullbox-title {
        padding-right: 8px;
    }
  }

  select,
  input {
    width: 200px;
  }
 `;

class AddDiseaseNameModal extends Component {
  constructor(props) {
    super(props);
      let init_errors = {
          system_patient_id: "",
          start_date: "",
          disease_name: "",
          department_code: ""
      };
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      this.state = {
          departmentCode: "1",
          diseaseName: "",
          diseaseDate: "",
          diseaseEditDate: "",
          diseaseEndDate: "",
          diseaseEditEndDate: "",
          errors: init_errors,
          authInfo: authInfo,
          confirm_type:'',
          confirm_message:'',
          dieaseNameShow: false,
          diseaseNameList: [],
      }
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }

  initState =()=>{
      let init_errors = {
          system_patient_id: "",
          start_date: "",
          disease_name: "",
          department_code: ""
      };
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      this.setState({
          departmentCode: "1",
          diseaseName: "",
          diseaseDate: "",
          diseaseEditDate: "",
          diseaseEndDate: "",
          diseaseEditEndDate: "",
          errors: init_errors,
          authInfo: authInfo,
          confirm_type:'',
          confirm_message:'',
          dieaseNameShow: false,
          diseaseNameList: [],
      });
  }

    register = async () => {
        let canEdit = 0;
        if (
            this.context.$canDoAction(
                this.context.FEATURES.DISEASE,
                this.context.AUTHS.REGISTER
            ) ||
            this.context.$canDoAction(
                this.context.FEATURES.DISEASE,
                this.context.AUTHS.REGISTER_OLD
            )
        ) {
            canEdit = 1;
        }
        if (
            this.context.$canDoAction(
                this.context.FEATURES.DISEASE,
                this.context.AUTHS.REGISTER_PROXY
            ) ||
            this.context.$canDoAction(
                this.context.FEATURES.DISEASE,
                this.context.AUTHS.REGISTER_PROXY_OLD
            )
        ) {
            canEdit = 2;
        }
        if (canEdit === 0) {
            window.sessionStorage.setItem("alert_messages", "権限がありません。");
            return;
        }

        if (canEdit === 2) {
            if (this.context.selectedDoctor.code === 0) {
                this.context.$selectDoctor(true);
                return;
            }
        }
        this.setState({
            confirm_message: "登録しますか？",
            confirm_type: "add",
        });
    };

    getDateString = value => {
        if (value == null) return "";
        if (value.constructor.name === "Date")
            return (
                value.getFullYear() +
                "-" +
                (value.getMonth() + 1) +
                "-" +
                value.getDate()
            );
        return value;
    };

    checkDiseaseName = async () => {
        let init_errors = {
            system_patient_id: "",
            start_date: "",
            disease_name: "",
            department_code: ""
        };

       let path = "/app/api/v2/master/disease/search/disease_name";
       let post_data = {
            word:this.state.diseaseName,
        };
        let data = null;
        await axios.post(path, {params: post_data}).
        then((res) => {
                data = res.data;
        })
        .catch(() => {
        });

        // const url =
        //     "/app/api/v2/master/disease/search/index" +
        //     "?word=" +
        //     this.state.diseaseName;
        // const { data } = await axios.get(url);

        let hasMatchedName = false;
        if(data != null && data.length > 0){
          data.map(item => {
            if (item.name === this.state.diseaseName) {
              hasMatchedName = true;
            }
          });
        }

        if (hasMatchedName === false) {
            this.setState({
                errors: {
                    system_patient_id: "",
                    start_date: "",
                    disease_name: "上記病名では登録できません",
                    department_code: ""
                }
            });
            return false;
        } else {
            this.setState({
                errors: init_errors
            });
        }
        return true;
    };

    registerOfDiseaseData = async diseaseData => {
        const { data } = await axios.post(
            "/app/api/v2/disease_name/register",
            diseaseData
        );
        if (data.status == "ok") {
            this.props.handleOk();
        } else {
            this.upDateErrors(data.errors);
        }
    };

    upDateErrors = errors => {
        let init_errors = {
            system_patient_id: "",
            start_date: "",
            disease_name: "",
            department_code: ""
        };
        if (errors == [] || errors == "") {
            return;
        } else {
            const update_errors = Object.assign({}, init_errors);
            for (const key in this.state.errors) {
                const error_key = "disease." + key;
                if (errors.hasOwnProperty(error_key)) {
                    if (key == "disease_name") {
                        this.cancelDiseaseSelect();
                    }
                    const obj = {};
                    obj[key] = errors[error_key][0];
                    Object.assign(update_errors, obj);
                }
            }
            this.setState({ errors: update_errors });
        }
    };

    cancelDiseaseSelect = () => {
        this.setState({
            diseaseName: ""
        });
    };

    getDiseaseName = e => {
        this.setState({
            diseaseName: e.target.value
        });
    };

    getDiseaseDate = value => {
        this.setState({ diseaseDate: value, diseaseEditDate: value });
    };

    getDiseaseEndDate = value => {
        this.setState({ diseaseEndDate: value, diseaseEditEndDate: value });
    };

    getSelect = e => {
        this.setState({
            departmentCode: e.target.id
        });
    };

    confirmCancel = () => {
        this.setState({
            confirm_message: "",
            confirm_type: "",
        });
    }

    confirmOk = async() => {
        var diseaseData = {};
        var diseaseDateStr = this.getDateString(this.state.diseaseDate);
        var diseaseEndDateStr = this.getDateString(this.state.diseaseEndDate);
        diseaseData = {
            disease: {
                system_patient_id: this.props.system_patient_id,
                disease_name: this.state.diseaseName,
                department_code: this.state.departmentCode,
                start_date: diseaseDateStr,
                end_date: diseaseEndDateStr,
                is_doctor_consented: this.context.staff_category === 1 ? 2 : 0,
                created_by: this.state.authInfo.user_number,
                doctor_code:
                    this.context.staff_category === 1
                        ? parseInt(this.state.authInfo.doctor_code)
                        : parseInt(this.context.selectedDoctor.code)
            }
        };
        let status = await this.checkDiseaseName();
        if (status) this.registerOfDiseaseData(diseaseData);
        this.confirmCancel();
    }

    handleKeyPress = e => {
        const keyCode = e.keyCode ? e.keyCode : e.which;
        if (keyCode === 13) {
            this.setState({
                dieaseNameShow: true,
                isLoadData: false
            });
            this.search();

        }
    };

    insertMed = medicine => {
        this.setState({
            diseaseName: medicine.name,
            dieaseNameShow: false,
            isLoadData: false
        });
    };

    dieaseNameClose = () => {
        this.setState({
            dieaseNameShow: false,
            isLoadData: false,
        });
    };

    search = async () => {

       let path = "/app/api/v2/master/disease/search/disease_name";
       let post_data = {
            word:this.state.diseaseName,
        };
        await axios.post(path, {params: post_data}).
        then((res) => {
          this.setState({ 
            diseaseNameList: res.data, 
            dieaseNameShow: true,
            isLoadData: true
           });
        })
        .catch(() => {
            
        });

        // const url =
        //     "/app/api/v2/master/disease/search/index" +
        //     "?word=" +
        //     this.state.diseaseName;
        // axios
        //     .get(url)
        //     .then(res => {
        //         this.setState({
        //             diseaseNameList: res.data,
        //             dieaseNameShow: true,
        //             isLoadData: true
        //         });
        //     })
        //     .catch(() => {
        //         this.setState({

        //         });
        //     });

    };

  render() {
    let department = this.departmentOptions.filter(item => {
      return item.id === parseInt(this.state.departmentCode);
    });    
    return  (
        <Modal show={true} id=""  className="add-disease-name-modal">
          <Modal.Header>
            <Modal.Title>病名登録</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
                <div className="left-content">
                    <SelectorWithLabel
                        title="診療科"
                        options={this.departmentOptions}
                        getSelect={this.getSelect.bind(this)}
                        departmentEditCode={this.state.departmentCode}
                        value={department[0].name}
                    />
                    <InputWithErrorLabel
                        label="病名開始日"
                        type="date"
                        getInputText={this.getDiseaseDate.bind(this)}
                        diseaseEditData={this.state.diseaseEditDate == "" ? "" : new Date(this.state.diseaseEditDate)}
                        error={this.state.errors.start_date}
                        handleKeyPress={() => {}}
                    />
                    <InputWithErrorLabel
                        label="病名終了日"
                        type="date"
                        getInputText={this.getDiseaseEndDate.bind(this)}
                        diseaseEditData={this.state.diseaseEditEndDate == "" ? "" : new Date(this.state.diseaseEditEndDate)}
                        error={this.state.errors.end_date}
                        handleKeyPress={() => {}}
                    />
                    <InputWithErrorLabel
                        label="病名"
                        type="text"
                        placeholder="病名"
                        getInputText={this.getDiseaseName.bind(this)}
                        diseaseEditData={this.state.diseaseName}
                        error={this.state.errors.disease_name}
                        handleKeyPress={this.handleKeyPress}
                    />
                </div>
                <div className="footer">
                    <Button onClick={this.register.bind(this)}>追加</Button>
                    <Button onClick={this.props.closeModal}>閉じる</Button>
                </div>
            </Wrapper>
              {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                  <SystemConfirmModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.confirmOk.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
              )}
              {this.state.dieaseNameShow && (
                  <DiseaseNameListPopup
                      isLoadData={this.state.isLoadData}
                      dieaseNameShow={this.state.dieaseNameShow}
                      diseaseList={this.state.diseaseNameList}
                      insertMed={this.insertMed}
                      dieaseNameClose={this.dieaseNameClose}
                  />
              )}
          </Modal.Body>
        </Modal>
    );
  }
}

AddDiseaseNameModal.contextType = Context;
AddDiseaseNameModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  system_patient_id: PropTypes.number,
};

export default AddDiseaseNameModal;
