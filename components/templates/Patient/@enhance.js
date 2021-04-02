/**
 * Decorator let us to overrides class/functions behavior.
 * basic of Decorator(with legacy syntax): https://itnext.io/55b70338215e
 * legacy syntax: https://babeljs.io/docs/en/babel-plugin-proposal-decorators
 * new syntax: https://babeljs.io/blog/2018/09/17/decorators
 **************************************************************************/

import React from "react";
import PropTypes from "prop-types";

import {
  enhancer,
  defineMember,
  retrieveOriginalFunc
} from "~/helpers/decorator-utils";
import { IS_DEVELOP } from "~/helpers/constants";

import axios from "axios";

import PatientNav from "../../organisms/PatientNav";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default ClassObj =>
  enhancer(ClassObj, [
    defineMember(
      [
        "state",
        function() {
          const original = retrieveOriginalFunc({
            from: ClassObj,
            funcName: "state",
            bindTo: this,
            funcPath: "initializer"
          });
          return {
            ...original(),
            patientInfo: {},
            detailedPatientInfo: {}
          };
        }
      ],
      {
        placement: "own",
        kind: "field"
      }
    ),

    defineMember(
      [
        "propTypes",
        function() {
          const original = retrieveOriginalFunc({
            from: ClassObj,
            funcName: "propTypes",
            bindTo: this,
            funcPath: "initializer"
          });
          return {
            ...original(),
            match: PropTypes.object
          };
        }
      ],
      {
        placement: "static",
        kind: "field"
      }
    ),

    defineMember(
      [
        "getDetailedPatientInfo",
        async function(params) {
          // ▼パラメータが不適切なのを一時的な対応---------------
          if (
            params.systemPatientId === "" ||
            params.systemPatientId === null ||
            params.systemPatientId === undefined
          ) {
            if (
              !(
                params.id.id === "" ||
                params.id.id === null ||
                params.id.id === undefined
              )
            ) {
              params.systemPatientId = params.id.id; // 本来の場所に代入
            }
          }
          // ▲パラメータが不適切なのを一時的な対応---------------
          if(params.systemPatientId >0){
              let data = karteApi.getVal(params.systemPatientId,"patient_detail");
              if (data != null) {
                  this.setState(data);
              } else {
                  const patientInfoResponse = {
                    data: await axios.get("/app/api/v2/karte/patient_datailed", {
                      // パラメータ
                      params: {
                        systemPatientId: params.systemPatientId
                      }
                    })
                  };
                  const setData = {
                    detailedPatientInfo: patientInfoResponse.data.data
                  };
                  karteApi.setVal(parseInt(params.systemPatientId), "patient_detail", JSON.stringify(setData));
                  this.setState(setData);
              }
        }
          }
      ],
      {
        placement: "own"
      }
    ),

    defineMember(
      [
        "getPatientInfo",
        async function(params) {
          if (
            params.systemPatientId === "" ||
            params.systemPatientId === null ||
            params.systemPatientId === undefined
          ) {
            if (
              params.id.id === "" ||
              params.id.id === null ||
              params.id.id === undefined
            ) {
              /* eslint-disable no-console */
              if (IS_DEVELOP) console.error("患者ID不正対応不可");
            } else {
              params.systemPatientId = params.id.id; // 本来の場所に代入
            }
          }
          if(params.patientId > 0) {
              try {
                const patientInfoResponse = {
                  data: await axios.get("/app/api/v2/karte/initial_patient", {
                    params: {
                      patientId: params.systemPatientId
                    }
                  })
                };
                const setData = { patientInfo: patientInfoResponse.data.data };
                this.setState(setData);
              } catch (err) {
                alert(
                  "通信に失敗しました。インターネット接続を確認した後、ページを再読込してください。"
                );
                if (IS_DEVELOP)
                  console.error(err); /* eslint-disable-line no-console */
              }
            }
        }
      ],
      {
        placement: "own"
      }
    ),

    defineMember([
      "componentDidMount",
      async function() {
        const original = retrieveOriginalFunc({
          from: ClassObj,
          funcName: "componentDidMount",
          bindTo: this
        });
        original();

        this.getPatientInfo({
          id: this.props.match.params
        });
        this.getDetailedPatientInfo({
          id: this.props.match.params
        });
      }
    ]),

    defineMember([
      "render",
      function Render() {
        const Original = retrieveOriginalFunc({
          from: ClassObj,
          funcName: "render",
          bindTo: this
        });

        return (
          <>
            <PatientNav
              currentSystem={this.context.currentSystem}
              patientId={this.props.match.params.id}
              patientInfo={this.state.patientInfo}
              detailedPatientInfo={this.state.detailedPatientInfo}
              openModal={this.openModal}
              patientsList={this.context.patientsList}
            />

            <Original />
          </>
        );
      }
    ])
  ]);
