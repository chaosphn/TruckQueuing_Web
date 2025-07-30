import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function CustomDatePickerButton({ label, value, onChange }) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      renderInput={({ inputRef, inputProps, InputProps }) => (
        <Button
          ref={inputRef}
          {...inputProps}
          onClick={(e) => {
            e.stopPropagation();
            // Do nothing special here — MUI will handle showing the picker
          }}
          variant="outlined"
          size="small"
        >
          {value ? dayjs(value).format('YYYY-MM-DD') : label}
          {InputProps?.endAdornment}
        </Button>
      )}
    />
  );
}

