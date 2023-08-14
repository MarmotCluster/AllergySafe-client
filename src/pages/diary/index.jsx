import '../../types/index';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useDiary from '../../hooks/useDiary';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useRecoilState } from 'recoil';
import { authState } from '../../stores/auth/atom';
import { toast } from 'react-hot-toast';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const Diary = () => {
  /* stores */
  const theme = useTheme();
  const [auth, setAuth] = useRecoilState(authState);

  /* states */
  const [date, setDate] = useState(new Date());
  const [parsed, setParsed] = useState({
    preventEffect: true,
    year: -1,
    month: -1,
    date: -1,
    day: '',
    elements: Array.from({ length: 7 }, () => [[], [], [], [], [], []]),
  });

  const [chosen, setChosen] = useState(auth.userData?.id);
  /**@type {[Diary[], React.Dispatch<React.SetStateAction<Diary[]>]} */
  const [diaries, setDiaries] = useState([]);

  /* hooks */
  const { getDiary } = useDiary();

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

  /** 전달 다음달 고쳐진 값 반환 */
  function fixMonth(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);

    let newYear = year;
    let newMonth = month + 1;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    const newDateString = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return newDateString;
  }

  /** 미래여부 반환 */
  function isFutureDate(yearMonthValue) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const inputYear = Math.floor(yearMonthValue / 12);
    const inputMonth = yearMonthValue % 12;

    if (inputYear > currentYear) {
      return true;
    } else if (inputYear === currentYear && inputMonth > currentMonth) {
      return true;
    }

    return false;
  }

  /** 더 미래의 날짜 반환 */
  function getLaterDate(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (date1 > date2) {
      return dateString1;
    } else {
      return dateString2;
    }
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
    res.preventEffect = false;

    setParsed(res);
    console.log(res);
  }, [date]);

  useEffect(() => {
    setChosen(auth.userData?.id);
  }, [auth]);

  useEffect(() => {
    const init = async () => {
      const { year, month, day } = parsed;
      const res = await getDiary(
        chosen,
        `${String(year)}-${String(month).padStart(2, '0')}-01`,
        fixMonth(`${String(year)}-${String(month).padStart(2, '0')}-01`)
        // new Date().toISOString().split('T')[0]
      );
      if (res.status >= 400) {
        toast(res.data.message ? res.data.message : `${res.status} : 알 수 없는 오류가 발생했어요.`);
      } else if (String(res.status)[0] === '2') {
        setDiaries([...res.data.diaryList]);
      }

      setParsed((v) => ({ ...v, preventEffect: true }));
    };

    if (parsed.year === -1 || !chosen || parsed.preventEffect === true) return;

    init();
  }, [parsed, chosen]);

  /* renders */

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
        <Button endIcon={<AssignmentIndIcon />}>프로필 바꾸기</Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
        <Button sx={{ height: 100 }} onClick={() => setDate(new Date(getLastMonth(parsed.year, parsed.month - 1)))}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </Button>
        <Box>
          <Typography variant="h3">{parsed.month}</Typography>
          <Typography>{parsed.year}</Typography>
        </Box>
        <Button
          sx={{ height: 100 }}
          onClick={() => setDate(new Date(getNextMonth(parsed.year, parsed.month)))}
          disabled={isFutureDate(parsed.year * 12 + parsed.month + 1)}
        >
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
        <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
          {parsed.elements.map((row, index) => {
            return (
              <Box key={index} sx={{ width: '100%' }}>
                {row.map((jtem, jndex) => {
                  if (!jtem) {
                    return <Box sx={{ height: 88 }} key={jndex}></Box>;
                  }

                  return (
                    <Button
                      sx={{
                        height: 88,
                        border: isCurrentDate(jtem.asString) && `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 2,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        minWidth: 0,
                      }}
                      color="inherit"
                      key={jndex}
                      fullWidth
                      disabled={(function () {
                        const t = new Date().toISOString().split('T')[0];
                        return jtem.asString !== t && getLaterDate(jtem.asString, t) === jtem.asString;
                      })()}
                    >
                      {jtem.date}
                    </Button>
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
