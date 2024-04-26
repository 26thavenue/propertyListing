interface DateRange {
    startDate: Date;
    endDate: Date;
}

export function isDateRangeAvailable(startDate: Date, endDate: Date, bookedDates: DateRange[]): boolean {
    for (const bookedDate of bookedDates) {
        
        const bookedStartDate = new Date(bookedDate.startDate);
        const bookedEndDate = new Date(bookedDate.endDate)

        if (
            startDate < bookedEndDate &&
            endDate > bookedStartDate
        ) {
            
            return false;
        }
    }

    return true;
}

// Example usage:
// const bookedDates: DateRange[] = [
//     { startDate: new Date('2024-04-05'), endDate: new Date('2024-04-10') },
//     { startDate: new Date('2024-04-15'), endDate: new Date('2024-04-20') }
// ];

// const startDate = new Date('2024-04-01');
// const endDate = new Date('2024-04-03');

// const isAvailable = isDateRangeAvailable(startDate, endDate, bookedDates);
// console.log(isAvailable); /