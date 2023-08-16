import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Radio,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import ShareIcon from '@mui/icons-material/Share';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { orange, red } from '@mui/material/colors';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import EggAltIcon from '@mui/icons-material/EggAlt';
import MedicationIcon from '@mui/icons-material/Medication';

import IMAGE_WHEAT from '../../assets/images/wheat.jpg';
import UserSelector from '../../components/modal/UserSelector';
import { useRecoilValue } from 'recoil';
import { friendListState } from '../../stores/lists/friends';
import { authState } from '../../stores/auth/atom';
import useGuess from '../../hooks/useGuess';
import { guessState } from '../../stores/lists/guess';

import HideImageIcon from '@mui/icons-material/HideImage';
import { DateHandler } from '../../utils';

const Home = () => {
  /* refs */
  /**@type {React.MutableRefObject<HTMLDivElement>} */
  const cardref = useRef(null);

  /* stores */
  const auth = useRecoilValue(authState);
  const contact = useRecoilValue(friendListState);
  const guess = useRecoilValue(guessState);

  /* hooks */
  const theme = useTheme();
  const { getFood, getMedicine } = useGuess();

  /* states */
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(auth.userData?.id);
  const [selectedName, setSelectedName] = useState(auth.userData?.name);
  const [isMedicine, setIsMedicine] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [itemSelected, setItemSelected] = useState('0');

  const [daterange, setDaterange] = useState({
    from: '2023-08-01',
    to: DateHandler.getYYYYMMDD(DateHandler.getDate().toISOString()),
  });

  /* constants */
  const STATUS = {
    0: {
      title: '유력',
      color: theme.palette.secondary.main,
    },
    1: {
      title: '의심',
      color: red[400],
    },
    2: {
      title: '관심',
      color: orange[400],
    },
  };

  /* functions */
  /**
   *
   * @param {number} val
   */
  const getStatus = (val) => {
    // console.log({ val });
    if (80 < val && val <= 100) {
      return 0;
    }

    if (30 <= val && val < 80) {
      return 1;
    }

    return 2;
  };

  /* effects */
  useEffect(() => {
    document.body.style.backgroundColor = '#fafafa';

    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const { from, to } = daterange;

    const init = () => {
      getFood(selected, from, to);
      getMedicine(selected, from, to);
    };

    init();
  }, [daterange, selected]);

  useEffect(() => {
    console.log(cardref.current.clientHeight);
  }, [cardref]);

  useEffect(() => {
    setSelected(auth.userData?.id);
    setSelectedName(auth.userData?.name);
  }, [auth]);

  useEffect(() => {
    console.log({ guess });
  }, [guess]);

  /* render */
  /**
   *
   * @param {'food' | 'medicine'} key
   * @returns
   */
  const renderCardInner = (key) => {
    const THEME_COLOR = {
      food: theme.palette.primary.main,
      medicine: theme.palette.secondary.main,
    };

    const ORDINAL = {
      food: 'primary',
      medicine: 'secondary',
    };

    return (
      <>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            p: 1,
            background: `linear-gradient(315deg, ${theme.palette[key === 'food' ? 'primary' : 'secondary'].main} 0%, ${
              theme.palette[key === 'food' ? 'secondary' : 'primary'].main
            } 100%)`,
          }}
        ></Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {key === 'food' ? <EggAltIcon color="secondary" /> : <MedicationIcon color="primary" />}
          <Button endIcon={<FlipCameraAndroidIcon />} onClick={() => setIsMedicine(key === 'food')}>
            {key === 'food' ? '의약품으로..' : '식품으로..'}
          </Button>
        </Box>

        <Grid container alignItems="center">
          <Grid item xs={5}>
            <Typography>{guess[key].name}</Typography>
          </Grid>

          <Grid item xs={7}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Typography variant="caption">추론 대상 일자</Typography>
                  <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 900 }}>
                    {guess[key].startDate?.replace(/-/g, '.')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Typography variant="caption">검사 일자</Typography>
                  <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 900 }}>
                    {guess[key]?.endDate?.replace(/-/g, '.')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            my: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette[key === 'food' ? 'primary' : 'secondary'].main,
            color: 'white',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '& > *:not(:first-child)': { ml: 1 },
              }}
            >
              <DateRangeRoundedIcon />
              <MobileDatePicker
                defaultValue={dayjs(daterange.from)}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: { borderBottom: '1px solid white' },
                    inputProps: { style: { textAlign: 'center', color: 'white' } },
                  },
                }}
                onChange={(newValue) =>
                  setDaterange((v) => ({
                    ...v,
                    from: DateHandler.getYYYYMMDD(newValue.add(1, 'day').toDate().toISOString()),
                  }))
                }
              />
              <Typography>-</Typography>
              <MobileDatePicker
                defaultValue={dayjs(daterange.to)}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: { borderBottom: '1px solid white' },
                    inputProps: { style: { textAlign: 'center', color: 'white' } },
                  },
                }}
                onChange={(newValue) =>
                  setDaterange((v) => ({
                    ...v,
                    to: DateHandler.getYYYYMMDD(newValue.add(1, 'day').toDate().toISOString()),
                  }))
                }
              />
            </Box>
          </LocalizationProvider>
        </Box>

        <Divider />
        <Grid container sx={{ textAlign: 'center', my: 2 }}>
          {Array.from({ length: 4 }).map((_, index) => {
            return (
              <Grid key={index} item xs={3}>
                <Typography
                  variant="body2"
                  color={
                    guess[key].guessedData?.length > 0
                      ? STATUS[getStatus(guess[key].guessedData[index].percentage)].color
                      : 'inherit'
                  }
                >
                  {guess[key].guessedData?.length > 0
                    ? STATUS[getStatus(guess[key].guessedData[index].percentage)].title
                    : '-'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 900,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {guess[key].guessedData?.length > 0 ? guess[key].guessedData[index].name : '-'}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
        <Divider />

        {Array.from({ length: 4 }).map((_, index) => {
          return (
            <Box key={index} sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>{guess[key].guessedData?.length > 0 ? guess[key].guessedData[index].name : '-'}</Typography>
                <Box display="flex">
                  {/* <Typography>3회</Typography> */}
                  <Box
                    bgcolor={theme.palette[key === 'food' ? 'primary' : 'secondary'].main}
                    color="white"
                    sx={{ borderRadius: 2, px: 1, ml: 1 }}
                  >
                    <Typography>
                      {guess[key].guessedData?.length > 0
                        ? `${guess[key].guessedData[index].totalSymptomOccuredCount}/${guess[key].guessedData[index].totalCount}`
                        : '-/-'}{' '}
                      회 증상 발현
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
                <Box
                  sx={{
                    transition: 'width .2s ease',
                    width: `${guess[key].guessedData?.length > 0 ? guess[key].guessedData[index].percentage : 0}%`,
                    borderRadius: 2,
                    height: '100%',
                    bgcolor:
                      guess[key].guessedData?.length > 0
                        ? STATUS[getStatus(guess[key].guessedData[index].percentage)].color
                        : 'black',
                  }}
                ></Box>
              </Box>
            </Box>
          );
        })}

        <Divider />

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography fontSize={18}>
            {guess[key]?.name ? guess[key].name : '-'}님 (은)는 유력한
            <br />
            <Typography component="span" color={red['900']} fontWeight="bold" fontSize={'inherit'}>{`'${
              guess[key].guessedData?.length > 0 ? guess[key].guessedData[0].name : '-'
            }' 알레르기`}</Typography>{' '}
            보유자에요.
          </Typography>
        </Box>
      </>
    );
  };

  return (
    <>
      <Box sx={{ m: 2, pb: 10 }}>
        <Box name="topbar" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>알레르기 항원 추론</Typography>
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="내 프로필 공유">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="프로필 바꾸기">
              <IconButton onClick={() => setOpen(true)}>
                <AssignmentIndIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* FULL CARD FROM HERE */}
        <Box
          name="CARD"
          sx={{
            position: 'relative',
            transition: '.4s',
            transformStyle: 'preserve-3d',
            width: '100%',
            height: 676,
            transform: isMedicine ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT CARD */}
          <Box
            ref={cardref}
            name="card+front"
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'white',
              borderRadius: 5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.16)',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {renderCardInner('food')}
          </Box>

          {/* BACK CARD */}
          <Box
            ref={cardref}
            name="card+front"
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'white',
              borderRadius: 5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.16)',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {renderCardInner('medicine')}
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2 }}>
          <Typography>
            <Typography component="span" sx={{ fontWeight: 900 }}>
              {selectedName}
            </Typography>
            님의 식단 분석
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Button
                sx={{ height: '100%' }}
                onClick={() =>
                  guess[isMedicine ? 'medicine' : 'food'].guessedData &&
                  setItemSelected((v) => {
                    const next = Number(v) - 1;
                    const maximum = guess[isMedicine ? 'medicine' : 'food'].guessedData.length;
                    return next >= 0 ? String(next) : String(maximum - 1);
                  })
                }
              >
                <ArrowBackIosNewRoundedIcon />
              </Button>
            </Box>

            <Box
              sx={{
                bgcolor: 'white',
                width: 200,
                height: 200,
                borderRadius: 1000,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bgcolor: 'white',
                  width: 200,
                  height: 200,
                  background: `conic-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main} ${
                    guess[isMedicine ? 'medicine' : 'food'].guessedData?.length > 0
                      ? guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].percentage
                      : 0
                  }%, transparent ${
                    guess[isMedicine ? 'medicine' : 'food'].guessedData?.length > 0
                      ? guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].percentage
                      : 0
                  }%, transparent)`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              ></Box>
              <Box
                sx={{
                  borderRadius: 1000,
                  bgcolor: '#fafafa',
                  width: 160,
                  height: 160,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Tooltip
                  title={
                    guess[isMedicine ? 'medicine' : 'food'].guessedData?.length > 0
                      ? guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].name
                      : ''
                  }
                  placement="top"
                >
                  {guess[isMedicine ? 'medicine' : 'food'].guessedData?.length > 0 &&
                  guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].imageUrl ? (
                    <Avatar
                      src={guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].imageUrl}
                      sx={{ width: 72, height: 72 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 72, height: 72 }}>
                      <HideImageIcon />
                    </Avatar>
                  )}
                </Tooltip>
                <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>
                  {guess[isMedicine ? 'medicine' : 'food'].guessedData?.length > 0
                    ? guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].percentage
                    : '-'}
                  점
                </Typography>
              </Box>
            </Box>

            <Box>
              <Button
                sx={{ height: '100%' }}
                onClick={() =>
                  guess[isMedicine ? 'medicine' : 'food'].guessedData &&
                  setItemSelected((v) => {
                    const next = Number(v) + 1;
                    const maximum = guess[isMedicine ? 'medicine' : 'food'].guessedData.length;
                    return next < maximum ? String(next) : '0';
                  })
                }
              >
                <ArrowForwardIosRoundedIcon />
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {guess[isMedicine ? 'medicine' : 'food'].guessedData &&
              guess[isMedicine ? 'medicine' : 'food'].guessedData.map((item, index) => {
                return (
                  <Radio
                    key={index}
                    checked={itemSelected === String(index)}
                    onChange={(e) => setItemSelected(e.target.value)}
                    value={String(index)}
                    size="small"
                  />
                );
              })}
          </Box>

          <Typography
            variant="h5"
            display="inline-block"
            sx={{
              fontWeight: 900,
              background: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            알레르기 추론
          </Typography>

          {guess[isMedicine ? 'medicine' : 'food'].guessedData?.length > 0 &&
            guess[isMedicine ? 'medicine' : 'food'].guessedData[Number(itemSelected)].cards.map((item, index) => {
              const { type, elementId, name, symptoms, dateTime } = item;

              return (
                <Box
                  sx={{
                    mt: 3,
                    bgcolor: '#e0e0e0',
                    p: 3,
                    borderRadius: 5,
                  }}
                  key={index}
                >
                  <Typography variant="body2">일시</Typography>
                  <Typography variant="h6" textAlign="center">
                    {dateTime?.replace(/-/g, '.').replace('T', ' ')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    음식
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    알레르기 종류
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {String(symptoms.map((item) => item.name))}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Box>

      <UserSelector
        open={open}
        close={() => setOpen(false)}
        categories={Object.keys(contact)}
        selectedState={[selected, setSelected]}
        selectedNameState={[selectedName, setSelectedName]}
      />
    </>
  );
};

export default Home;
