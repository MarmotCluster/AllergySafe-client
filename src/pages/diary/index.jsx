import { Box } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

const Diary = () => {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar shouldDisableDate={Math.random() > 0.7} />
      </LocalizationProvider>
    </Box>
  );
};

export default Diary;
