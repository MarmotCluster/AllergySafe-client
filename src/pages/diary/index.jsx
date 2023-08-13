import { Box, Button, Typography, useTheme } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect, useState } from 'react';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const Diary = () => {
  /* stores */
  const theme = useTheme();

  /* states */
  const [date, setDate] = useState(new Date());
  const [parsed, setParsed] = useState({
    year: -1,
    month: -1,
    date: -1,
    day: '',
    elements: Array.from({ length: 7 }, () => [[], [], [], [], [], []]),
  });

  /* hooks */

  /* functions */
  /** 그 月의 1일날 요일 반환 */
  function getFirstDayOfWeek(year, month) {
    return new Date(year, month - 1, 1).getDay();
  }

  /** 그 月의 날 수 반환 (28~31(일)) */
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  /** 지난 달 반환 'yyyy-mm' */
  function getLastMonth(year, month) {
    if (month === 0) {
      year--;
      month = 12;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  /** 다음 달 반환 'yyyy-mm' */
  function getNextMonth(year, month) {
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  /** 입력받은 날짜 문자열로 반환 'yyyy-mm-dd' */
  function formatDate(year, month, day) {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  /** 오늘인지 반환 */
  function isCurrentDate(dateString) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth() &&
      currentDate.getDate() === inputDate.getDate()
    );
  }

  /* effects */
  useEffect(() => {
    let res = { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate(), day: date.getDay() };
    let elements = [[], [], [], [], [], [], []];
    const firstDay = getFirstDayOfWeek(res.year, res.month) - 1;
    const lastDate = getDaysInMonth(res.year, res.month);
    let week = 0;

    // ... 공백 먼저 채우고
    console.log('첫번쨰 요일', DAYS[firstDay + 1]);
    for (let i = 0; i < firstDay + 1; i++) {
      elements[i].push(null);
    }

    // ... 달력 아이템 넣기
    for (let i = 1; i <= lastDate; i++) {
      const dayCurrent = (i + firstDay) % 7;
      elements[dayCurrent].push({ date: i, asString: formatDate(res.year, res.month, i) });
    }
    console.log(elements);
    res.elements = elements;

    setParsed(res);
    console.log(res);
  }, [date]);

  /* renders */

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
        <Button sx={{ height: 100 }} onClick={() => setDate(new Date(getLastMonth(parsed.year, parsed.month - 1)))}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </Button>
        <Box>
          <Typography variant="h3">{parsed.month}</Typography>
          <Typography>{parsed.year}</Typography>
        </Box>
        <Button sx={{ height: 100 }} onClick={() => setDate(new Date(getNextMonth(parsed.year, parsed.month)))}>
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </Button>
      </Box>

      <Box name="calendar" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex' }}>
          {Array.from({ length: DAYS.length }).map((item, index) => {
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  height: 32,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ccc',
                }}
              >
                {DAYS[index]}
              </Typography>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex' }}>
          {parsed.elements.map((row, index) => {
            return (
              <Box key={index} sx={{ width: '100%' }}>
                {row.map((jtem, jndex) => {
                  if (!jtem) {
                    return <Box sx={{ height: 88 }} key={jndex}></Box>;
                  }

                  return (
                    <Box
                      sx={{
                        height: 88,
                        border: isCurrentDate(jtem.asString) && `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 2,
                        p: 0.5,
                      }}
                      key={jndex}
                    >
                      {jtem.date}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Diary;
