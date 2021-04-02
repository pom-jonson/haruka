export function getTimeZoneList(type) {
    let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status")).dial_timezone['timezone'];
    let time_zone_list = [];
    if(type === 'select'){
        time_zone_list[0] = {id: 0, value: ''};
    }
    if (dial_timezone != undefined ){
        Object.keys(dial_timezone).map((key) => {
            if(dial_timezone[key]['end'] !== ''){
                let time_zone = {id: parseInt(key), value: dial_timezone[key]['name'], start: dial_timezone[key]['start'], end: dial_timezone[key]['end']};
                time_zone_list[parseInt(key)]= time_zone;
            }
        });
    }
    return time_zone_list;
}

export function getTimeZoneIndex() {
    let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status")).dial_timezone['timezone'];
    let time_zone_list = [];
    if (dial_timezone != undefined ){
        Object.keys(dial_timezone).map((key) => {
            if(dial_timezone[key]['end'] !== ''){
                let time_zone = {id: parseInt(key), value: dial_timezone[key]['name'], start: dial_timezone[key]['start'], end: dial_timezone[key]['end']};
                time_zone_list.push(time_zone);
            }
        });
    }
    return time_zone_list;
}




