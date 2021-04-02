
export default function(origin_data, date_condition, dt_start_label, dt_end_label) {
    let data_list = [];    
    data_list = origin_data.filter(item=>{

        let dt_start = new Date(item[dt_start_label]);
        let dt_end =  new Date(item[dt_end_label]);
        let dt_condition = new Date(date_condition);
        if (item[dt_end_label] == null || item[dt_end_label] == undefined) {
            dt_end = new Date(dt_condition.setMonth(dt_condition.getMonth() + 6));            
        }
        if (dt_start.getTime() <= dt_condition.getTime() && dt_condition.getTime() <= dt_end.getTime()) {
            return item;
        }

    });

    return data_list    
}
