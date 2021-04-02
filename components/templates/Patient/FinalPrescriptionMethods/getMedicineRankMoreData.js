import axios from "axios";

export default async function(params) {
  try {
    const { data } = await axios.get(
      "/app/api/v2/patients/history/frequently_used_medicine",
      {
        params: { 
          patient_id: params.id          
        }
      }
      );
    if (this.state.medicineRankData.length > 0 && data.length > 0) {
      this.state.medicineRankData.map((item, idx)=>{
        if (item.class_name == "open" && data[idx] != undefined && data[idx] != null && item.code == data[idx].code) {
          data[idx].class_name = "open";
        }
      });
    }
    this.setState({
      medicineRankData: data ,
      isLoaded: true,
      isLoaded_rank: false,
      stop_prescribe_table_load:false
    });
    return data;
  } catch ({ err }) {
    alert(
      "通信に失敗しました。インターネット接続を確認した後、ページを再読込してください。"
    );

    return [
      {
        code: 2188151,
        name: "ロキソマリン錠６０ｍｇ",
        gene_name: "【般】ロキソプロフェンＮａ錠６０ｍｇ",
        main_unit: "錠",
        drug_division: 0,
        generic_flag: 1,
        psy_drug_flag: 0,
        count: "4",
        first_use_date: "2019-04-24",
        latest_use_date: "2019-04-24",
        usages: [
          {
            name: "１日３回  毎食後",
            code: 9801122,
            category: "",
            count: 4,
            first_use_date: "2019-04-24",
            latest_use_date: "2019-04-24"
          }
        ]
      },
      {
        code: 2188019,
        name: "ロキソニン錠６０ｍｇ",
        gene_name: "【般】ロキソプロフェンＮａ錠６０ｍｇ",
        main_unit: "錠",
        drug_division: 0,
        generic_flag: 0,
        psy_drug_flag: 0,
        count: "2",
        first_use_date: "2019-04-19",
        latest_use_date: "2019-04-23",
        usages: [
          {
            name: "１日３回  毎食後",
            code: 9801122,
            category: "",
            count: 1,
            first_use_date: "2019-04-19",
            latest_use_date: "2019-04-19"
          },
          {
            name: "１日１回  昼食後",
            code: 9801131,
            category: "",
            count: 1,
            first_use_date: "2019-04-23",
            latest_use_date: "2019-04-23"
          }
        ]
      }
    ];
  }
}
