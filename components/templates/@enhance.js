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

import axios from "axios";

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
            patientInfo: {}
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
        "getPatientInfo",
        async function(params) {
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
            return;
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

        await this.getPatientInfo({
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
            <Original />
          </>
        );
      }
    ])
  ]);
