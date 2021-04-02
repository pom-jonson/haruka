export default function(medicine, mtime)  {

    let s_month_time = 0;
    let e_month_time = 0;
    let s_date_time = 0;
    let e_date_time = 0;
    let date_split;
    let day;

    if(medicine.start_month !== undefined && medicine.start_month != "") {
      s_month_time = new Date(medicine.start_month).getTime(); 
    }
    
    if(medicine.end_month !== undefined && medicine.end_month != "") {
      date_split = medicine.end_month.split("-");
      day = new Date(date_split[0], date_split[1], 0).getDate();
      e_month_time = new Date(date_split[0], date_split[1], day).getTime();
    }

    if(medicine.start_date !== undefined && medicine.start_date != "") {
      s_date_time = new Date(medicine.start_date).getTime(); 
    }
    
    if(medicine.end_date !== undefined && medicine.end_date != "") {
      e_date_time = new Date(medicine.end_date).getTime(); 
    }

    if(e_date_time>0 && e_date_time < mtime) return -1;
    if(s_date_time>0 && mtime<s_date_time) return -1;
    if(e_month_time>0 && e_month_time < mtime) return -1;
    if(s_month_time>0 && mtime<s_month_time) return -1;
    return 0;
}
