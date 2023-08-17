import { Box, Button, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useDiary from '../../hooks/useDiary';
import '../../types/index';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { toast } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import UserSelector from '../../components/modal/UserSelector';
import { authState } from '../../stores/auth/atom';
import { globalState } from '../../stores/global/atom';
import { friendListState } from '../../stores/lists/friends';
import CreateNew from '../../components/diary/CreateNew';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const Diary = () => {
  /* stores */
  const theme = useTheme();
  const [auth, setAuth] = useRecoilState(authState);
  const [global, setGlobal] = useRecoilState(globalState);
  const [contact, setContact] = useRecoilState(friendListState);

  /* states */
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date(Date.now() + 9 * 60 * 60 * 1000));
  const [parsed, setParsed] = useState({
    preventEffect: true,
    year: -1,
    month: -1,
    date: -1,
    day: '',
    elements: Array.from({ length: 7 }, () => [[], [], [], [], [], []]),
  });

  const [chosen, setChosen] = useState(auth.userData?.id);
  const [chosenName, setChosenName] = useState(auth.userData?.name);

  /**@type {[{[key:string]: Diary}, React.Dispatch<React.SetStateAction<{[key:string]: Diary}>]} */
  const [diaries, setDiaries] = useState({});
  const [selected, setSelected] = useState('');
  const [askDelete, setAskDelete] = useState(false);
  const [createNew, setCreateNew] = useState(false);

  /* hooks */
  const { getDiary, deleteDiaryById } = useDiary();

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
    const currentDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const inputDate = new Date(dateString);

    return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth() &&
      currentDate.getUTCDate() === inputDate.getDate()
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
    document.body.style.backgroundColor = '#fafafa';

    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  useEffect(() => {
    console.log('오늘 날짜:', date.toISOString(), date);

    let res = { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate(), day: date.getDay() };
    let elements = [[], [], [], [], [], [], []];
    const firstDay = getFirstDayOfWeek(res.year, res.month) - 1;
    const lastDate = getDaysInMonth(res.year, res.month);
    let week = 0;

    // ... 공백 먼저 채우고
    // console.log('첫번쨰 요일', DAYS[firstDay + 1]);
    for (let i = 0; i < firstDay + 1; i++) {
      elements[i].push(null);
    }

    // ... 달력 아이템 넣기
    for (let i = 1; i <= lastDate; i++) {
      const dayCurrent = (i + firstDay) % 7;
      elements[dayCurrent].push({ date: i, asString: formatDate(res.year, res.month, i) });
    }
    // console.log(elements);
    res.elements = elements;
    res.preventEffect = false;

    setParsed(res);
    // console.log(res);
  }, [date]);

  useEffect(() => {
    setChosen(auth.userData?.id);
    setChosenName(auth.userData?.name);
  }, [auth]);

  const refreshDiary = async () => {
    const { year, month, day } = parsed;
    const res = await getDiary(
      chosen,
      `${String(year)}-${String(month).padStart(2, '0')}-01`,
      fixMonth(`${String(year)}-${String(month).padStart(2, '0')}-01`)
    );
    if (res.status >= 400) {
      toast(res.data.message ? res.data.message : `${res.status} : 알 수 없는 오류가 발생했어요.`);
    } else if (String(res.status)[0] === '2') {
      // ... 응답을 받으면 가공 시작
      let data = res.data.diaryList;
      let newstate = {};
      data.forEach((item, index) => {
        newstate[item.date] = item;
      });
      console.log('다이어리 상태에 들어가는 데이터:', newstate);
      setDiaries({ ...newstate });
    }

    setParsed((v) => ({ ...v, preventEffect: true }));
  };

  useEffect(() => {
    if (parsed.year === -1 || !chosen || parsed.preventEffect === true) return;

    refreshDiary();
  }, [parsed, chosen]);

  /* renders */
  const renderDiarySelected = () => {
    const handleRemove = async () => {
      try {
        setGlobal((v) => ({ ...v, loading: true }));
        const res = await deleteDiaryById(diaries[selected].id);
        if (res.status >= 400) {
          toast.error(res.data.message);
        } else if (String(res.status)[0] === '2') {
          toast('삭제되었어요.');
          setDate(new Date(Date.now() + 9 * 60 * 60 * 1000));
        }
      } catch (err) {
        toast.error('나중에 다시 시도하세요.');
      } finally {
        setGlobal((v) => ({ ...v, loading: false }));
        setAskDelete(false);
      }
    };

    const renderElements = () => {
      const constants = {
        ingestedFoods: '섭취한 음식',
        occuredSymptoms: '발현된 증상',
        takenMedicines: '복용한 약품',
      };
      if (!diaries[selected]) {
        return (
          <>
            <Typography textAlign="center">작성된 일기가 없어요.</Typography>
            <Divider sx={{ my: 2 }} />
          </>
        );
      }

      // console.log('선택된 날짜의 일기', diaries[selected]);
      const target = diaries[selected];
      return Object.keys(constants).map((key) => {
        const pointed = target[key];
        if (!pointed) return null;

        return (
          <Box key={key}>
            <Typography variant="body2">{constants[key]}</Typography>
            {pointed.length === 0 && (
              <Typography textAlign="center" color="#999">
                항목이 없어요.
              </Typography>
            )}
            {pointed.map((item, index) => {
              const { datetime, id, food, symptom, medicine, imageUrl } = item;
              return (
                <React.Fragment key={id}>
                  <Typography variant="body2" sx={{ textAlign: 'right', color: '#999' }}>
                    {datetime.replace('T', ' ')}
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: '#f4f4f4', borderRadius: 2 }}>
                    {(function () {
                      if (key === 'ingestedFoods') {
                        return (
                          <>
                            <Typography>{food?.name ? food.name : '-'}</Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }}>
                              <QrCode2Icon sx={{ fontSize: 12 }} />{' '}
                              <i>{food?.barcode ? food.barcode : '수동 등록된 항목'}</i>
                            </Typography>
                          </>
                        );
                      }

                      if (key === 'occuredSymptoms') {
                        return (
                          <>
                            <Typography>{symptom?.name ? symptom.name : '-'}</Typography>
                            {/* <Typography variant="body2" sx={{ color: '#ccc' }}>
                              <QrCode2Icon sx={{ fontSize: 12 }} />{' '}
                              <i>{symptom?.barcode ? symptom.barcode : '수동 등록된 항목'}</i>
                            </Typography> */}
                            <Box>{imageUrl && <img src={imageUrl} width="100%" />}</Box>
                          </>
                        );
                      }

                      return (
                        <>
                          <Typography>{medicine?.name ? medicine.name : '-'}</Typography>
                          {/* <Typography variant="body2" sx={{ color: '#ccc' }}>
                              <QrCode2Icon sx={{ fontSize: 12 }} />{' '}
                              <i>{food?.barcode ? food.barcode : '수동 등록된 항목'}</i>
                            </Typography> */}
                        </>
                      );
                    })()}
                  </Box>
                </React.Fragment>
              );
            })}
            <Divider sx={{ my: 2 }} />
          </Box>
        );
      });
    };

    if (!selected) {
      return <Typography textAlign="center">날짜를 선택하세요.</Typography>;
    }

    return (
      <React.Fragment>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{selected}</Typography>
          <Tooltip title="삭제">
            <IconButton disabled={!diaries[selected]} onClick={() => setAskDelete((v) => !v)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{ borderRadius: 100, overflow: 'hidden', transition: 'height .2s ease', height: 40 * Number(askDelete) }}
        >
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            fullWidth
            sx={{ height: 40 }}
            onClick={handleRemove}
          >
            이 과정을 되돌릴 수 없어요.
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />
        {renderElements()}
      </React.Fragment>
    );
  };

  const renderCreateNew = () => {
    if (!createNew) {
      return (
        <Button
          fullWidth
          size="large"
          startIcon={<CreateIcon />}
          variant="contained"
          onClick={() => setCreateNew(true)}
        >
          새로 작성하기
        </Button>
      );
    }

    return (
      <Box>
        <CreateNew
          profileId={chosen}
          refreshSuper={() => {
            setCreateNew(false);
            refreshDiary();
          }}
          dateSelected={selected}
        />
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            <b>{chosenName ? chosenName : '-'}</b>님의 일기장
          </Typography>
          <Button endIcon={<AssignmentIndIcon />} onClick={() => setOpen(true)}>
            프로필 바꾸기
          </Button>
        </Box>
        <Box sx={{ bgcolor: 'white', mx: 2, mt: 3, borderRadius: 5, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.16)' }}>
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
            <Box sx={{ display: 'flex', overflowX: 'hidden', minHeight: '528px' }}>
              {parsed.elements.map((row, index) => {
                return (
                  <Box key={index} sx={{ width: '100%', position: 'relative' }}>
                    {row.map((jtem, jndex) => {
                      const renderEmoji = () => {
                        if (!diaries[jtem.asString] || diaries[jtem.asString].occuredSymptoms.length === 0) return null;

                        return (
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: `50%`,
                              left: '50%',
                              transform: 'translate(-50%,-50%)',
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            fontSize={24}
                          >
                            🤒
                          </Typography>
                        );
                      };

                      if (!jtem) {
                        return <Box sx={{ height: 88 }} key={jndex}></Box>;
                      }

                      return (
                        <Button
                          sx={{
                            height: 88,
                            border: isCurrentDate(jtem.asString)
                              ? `1px solid ${theme.palette.primary.main}`
                              : diaries[jtem.asString] && `1px dashed green`,
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
                          onClick={() => {
                            window.document.documentElement.scrollTop = window.document.documentElement.scrollHeight;
                            setSelected(jtem.asString);
                          }}
                        >
                          {jtem.date}
                          {renderEmoji()}
                        </Button>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box
          name="view+selected"
          sx={{
            bgcolor: 'white',
            mx: 2,
            mt: 3,
            mb: 8,
            borderRadius: 5,
            p: 3,
            pt: 5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.16)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              p: 1,
              background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          ></Box>

          {renderDiarySelected()}
          {selected && renderCreateNew()}
        </Box>
      </Box>

      <UserSelector
        open={open}
        close={() => setOpen(false)}
        categories={['family']}
        selectedState={[chosen, setChosen]}
        selectedNameState={[chosenName, setChosenName]}
        checkBoxProps={{
          onClick: () => {
            setParsed((v) => ({ ...v, preventEffect: false }));
          },
        }}
      />
      {/* <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>프로필 선택</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: `calc(100vh - 14rem)`, overflowY: 'scroll' }}>
            {['family'].map((key) => {
              return (
                <React.Fragment key={key}>
                  <Typography variant="body2">{key}</Typography>
                  {contact[key].map((item, index) => {
                    const { id, imageUrl, name } = item;
                    return (
                      <Box
                        key={id}
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={imageUrl} />
                          <Typography variant="body2" ml={2}>
                            {name}
                          </Typography>
                        </Box>
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<RadioButtonCheckedIcon />}
                          defaultChecked={chosen === id}
                          onClick={() => {
                            setChosen(() => {
                              setParsed((v) => ({ ...v, preventEffect: false }));
                              setChosenName(name);
                              return id;
                            });
                            setOpen(false);
                          }}
                          disabled={chosen === id}
                        />
                      </Box>
                    );
                  })}
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default Diary;
