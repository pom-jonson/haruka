import { checkSMPByUnicode} from "~/helpers/constants";
export default function () {
    let detail_array = this.state.detail_json_array;
    if (this.state.classification_name == undefined || this.state.classification_name == "") {
      this.setState({alert_messages: '分類を選択してください。'});
      return;
    }
    
    if (this.state.practice_name == undefined || this.state.practice_name == "") {
      this.setState({alert_messages: '行為名を選択してください。'});
      return;
    }
    if (this.state.comment !== undefined && this.state.comment !== "") {
        if (checkSMPByUnicode(this.state.comment)) {
            this.setState({alert_messages: '処置フリーコメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください'})
            return;
        }
    }
    let treat_detail_item = [];
    let error_str = '';
    Object.keys(this.state.set_detail).map((index) => {
        if (this.state.set_detail[index]['check'] === 1) {
            if(this.state.set_detail[index]['count'] != null && this.state.set_detail[index]['count'] !== "" && (this.state.set_detail[index]['count'] < 0)){
                error_str = '個別指示項目の数量を正確に入力してください。';
                return;
            }
            if(this.state.set_detail[index]['lot'] != null && this.state.set_detail[index]['lot'] !== ""){
                if(!this.state.set_detail[index]['lot'].match(/^[A-Za-z0-9]*$/)){
                    error_str = '個別指示項目のロットを半角英数で入力してください。';
                    return;
                }
            }
            if(this.state.set_detail[index]['item_name'] != null && this.state.set_detail[index]['item_name'] !== ""){
                if(this.state.set_detail[index]['count'] == null || this.state.set_detail[index]['count'] == ""){
                    error_str = '数量を0より大きい値で入力してください。';
                    return;
                }
            }
            if(this.state.set_detail[index]['item_name'] != null && this.state.set_detail[index]['item_name'] !== ""){
                if(checkSMPByUnicode(this.state.set_detail[index]['lot'])){
                    error_str = 'ロットに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください';
                    return;
                }
            }
            if(this.state.set_detail[index]['item_name'] != null && this.state.set_detail[index]['item_name'] !== ""){
                if(checkSMPByUnicode(this.state.set_detail[index]['comment'])){
                    error_str = 'コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください';
                    return;
                }
            }
            let set_detail_info = {};
            Object.keys(this.state.set_detail[index]).map(idx=>{
                set_detail_info[idx] = this.state.set_detail[index][idx];
            });
            set_detail_info['set_name'] = this.state.set_name;
            treat_detail_item.push(set_detail_info);
        }
    });
    if(error_str != ''){
        this.setState({alert_messages: error_str});
        return;
    }
    let detail_json = {
        number: 0,
        treat_detail_id: detail_array.length + 1,
        department_id:this.state.department_id != undefined && this.state.department_id != null ? this.state.department_id : 0,
        department_name:this.state.department_name != undefined && this.state.department_name != null ? this.state.department_name : 0,
        classification_id:this.state.classification_id,
        classification_name:this.state.classification_name,
        practice_id:this.state.practice_id,
        practice_name:this.state.practice_name,
        enable_body_part: this.state.enable_body_part,
        request_id:this.state.request_id,
        request_name:this.state.request_name,
        part_id:this.state.part_id,
        part_name:this.state.part_name,
        position_id:this.state.position_id,
        position_name:this.state.position_name,
        side_id:this.state.side_id,
        side_name:this.state.side_name,
        comment:this.state.comment,
        barcode:this.state.barcode,
        treat_user_id:this.state.treat_user_id,
        treat_user_name:this.state.treat_user_name,
        set_id:this.state.set_id,
        set_name:this.state.set_name,
        treat_detail_item,
        quantity: this.state.quantity,
        quantity_is_enabled: this.state.quantity_is_enabled,
        unit: this.state.unit,
    };
    if (this.state.total_surface !== undefined) {
        detail_json.total_surface = this.state.total_surface;
        detail_json.surface_data = this.state.surface_data;
    }
    if (this.state.total_amount !== undefined) {
        detail_json.total_amount = this.state.total_amount;
    }
    detail_array.push(detail_json);
    this.setState({
      detail_json_array:detail_array
    });
    this.initEditSetData();
}
