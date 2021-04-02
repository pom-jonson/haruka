export default function(original, newData) {
  let flg = false;
  Object.keys(newData).map(key => {
    if (key !== "order_data" && key !== "number" && key !== "substitute_name") {
      if (key === "free_comment") {
        if (
          original[key] !== undefined &&
          newData[key].join() !== original[key].join()
        ) {
          flg = true;
          return flg;
        }
      } else {
        if (original[key] !== undefined && newData[key] !== original[key]) {
          flg = true;
          return flg;
        }
      }
    }
  });
  if (newData.order_data.length !== original.order_data.length) {
    flg = true;
    return flg;
  }
  newData.order_data.map((order_data, index) => {
    Object.keys(order_data).map(key => {
      if (original.order_data[index] === undefined) {
        flg = true;
        return flg;
      } else {
        if (key !== "update_mode" && key !== "med") {
          if (
            key === "usage_remarks_comment" ||
            key === "usage_replace_number"
          ) {
            if (
              original.order_data[index][key] !== undefined &&
              order_data[key].join() !== original.order_data[index][key].join()
            ) {
              flg = true;
              return flg;
            }
          } else {
            if (
              original.order_data[index][key] !== undefined &&
              order_data[key] !== original.order_data[index][key]
            ) {
              flg = true;
              return flg;
            }
          }
        }
        if (key === "med") {
          if (
            order_data["med"].length !==
            original.order_data[index]["med"].length
          ) {
            flg = true;
            return flg;
          }

          order_data["med"].map((med, medIndex) => {
            Object.keys(med).map(medKey => {
              if (original.order_data[index]["med"][medIndex] === undefined) {
                flg = true;
                return flg;
              }

              if (medKey !== "units_list") {
                if (medKey === "free_comment" || medKey === "uneven_values") {
                  if (
                    original.order_data[index]["med"][medIndex][medKey] !==
                      undefined &&
                    med[medKey].join() !==
                      original.order_data[index]["med"][medIndex][medKey].join()
                  ) {
                    flg = true;
                    return flg;
                  }
                } else {
                  if (
                    original.order_data[index]["med"][medIndex][medKey] !==
                      undefined &&
                    med[medKey] !==
                      original.order_data[index]["med"][medIndex][medKey]
                  ) {
                    flg = true;
                    return flg;
                  }
                }
              }
            });
          });
        }
        if (key === "usage_remarks_comment") {
          if (order_data[key].length != 0) {
            flg = true;
            return flg;
          }
        }
      }
    });
  });
  return flg;
}
