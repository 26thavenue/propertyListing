import multer from 'multer';

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename uploaded files to avoid overwriting
  }
});

export const upload = multer({ storage: storage });
