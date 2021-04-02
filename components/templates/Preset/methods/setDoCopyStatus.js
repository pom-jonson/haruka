export default function(order_number, status, allReset = false) {
    if (allReset) {
        return this.state.medicineHistory.map(item => {
            item.order_data.order_data = item.order_data.order_data.map(medicine => {
                medicine.isDoing = false;
                return medicine;
            })
            return item;
        })
    }

    return this.state.medicineHistory.map(item => {
        item.order_data.order_data = item.order_data.order_data.map(medicine => {
            if (medicine.order_number === order_number) {
                medicine.isDoing = status;
            }
            return medicine;
        })
        return item;
    })    
}
  