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

const Home = () => {
  /* refs */
  /**@type {React.MutableRefObject<HTMLDivElement>} */
  const cardref = useRef(null);

  /* hooks */
  const theme = useTheme();

  /* states */
  const [isMedicine, setIsMedicine] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [itemSelected, setItemSelected] = useState('0');

  useEffect(() => {
    document.body.style.backgroundColor = '#fafafa';

    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  useEffect(() => {
    console.log(cardref.current.clientHeight);
  }, [cardref]);

  return (
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
            <IconButton>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <EggAltIcon color="secondary" />
            <Button endIcon={<FlipCameraAndroidIcon />} onClick={() => setIsMedicine(true)}>
              의약품으로..
            </Button>
          </Box>

          <Grid container alignItems="center">
            <Grid item xs={5}>
              <Typography>이반 게오르기예비치</Typography>
            </Grid>

            <Grid item xs={7}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Typography variant="caption">추론 대상 일자</Typography>
                    <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 900 }}>09.09.2023</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Typography variant="caption">검사 일자</Typography>
                    <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 900 }}>09.12.2023</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* * */}

          <Box sx={{ my: 2, p: 2, borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
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
                  defaultValue={dayjs('2023-06-06')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      sx: { borderBottom: '1px solid white' },
                      inputProps: { style: { textAlign: 'center', color: 'white' } },
                    },
                  }}
                />
                <Typography>-</Typography>
                <MobileDatePicker
                  defaultValue={dayjs('2023-06-06')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      sx: { borderBottom: '1px solid white' },
                      inputProps: { style: { textAlign: 'center', color: 'white' } },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
          {/* * */}

          <Divider />
          <Grid container sx={{ textAlign: 'center', my: 2 }}>
            <Grid item xs={3}>
              <Typography variant="body2" color={theme.palette.secondary.main}>
                유력
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                땅콩
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color={red['400']}>
                의심
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                바닐라
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color={red['400']}>
                의심
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                마가린
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color={orange['400']}>
                조심
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                우엉
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          {/* * */}
          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>땅콩</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.primary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '65%', borderRadius: 2, height: '100%', bgcolor: theme.palette.secondary.main }}></Box>
            </Box>
          </Box>

          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>바닐라</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.primary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '85%', borderRadius: 2, height: '100%', bgcolor: red['500'] }}></Box>
            </Box>
          </Box>

          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>마가린</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.primary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '20%', borderRadius: 2, height: '100%', bgcolor: red['500'] }}></Box>
            </Box>
          </Box>

          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>우엉</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.primary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '45%', borderRadius: 2, height: '100%', bgcolor: orange['500'] }}></Box>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography fontSize={18}>
              이반 게오르기예비치님 (은)는 유력한
              <br />
              <Typography
                component="span"
                color={red['900']}
                fontWeight="bold"
                fontSize={'inherit'}
              >{`'땅콩' 알레르기`}</Typography>{' '}
              보유자에요.
            </Typography>
          </Box>
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
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              p: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          ></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <MedicationIcon color="primary" />
            <Button endIcon={<FlipCameraAndroidIcon />} color="secondary" onClick={() => setIsMedicine(false)}>
              식품으로..
            </Button>
          </Box>

          <Grid container alignItems="center">
            <Grid item xs={5}>
              <Typography>이반 게오르기예비치</Typography>
            </Grid>

            <Grid item xs={7}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Typography variant="caption">추론 대상 일자</Typography>
                    <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 900 }}>09.09.2023</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Typography variant="caption">검사 일자</Typography>
                    <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 900 }}>09.12.2023</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* * */}

          <Box sx={{ my: 2, p: 2, borderRadius: 2, bgcolor: theme.palette.secondary.main, color: 'white' }}>
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
                  defaultValue={dayjs('2023-06-06')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      sx: { borderBottom: '1px solid white' },
                      inputProps: { style: { textAlign: 'center', color: 'white' } },
                    },
                  }}
                />
                <Typography>-</Typography>
                <MobileDatePicker
                  defaultValue={dayjs('2023-06-06')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      sx: { borderBottom: '1px solid white' },
                      inputProps: { style: { textAlign: 'center', color: 'white' } },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
          {/* * */}

          <Divider />
          <Grid container sx={{ textAlign: 'center', my: 2 }}>
            <Grid item xs={3}>
              <Typography variant="body2" color={theme.palette.secondary.main}>
                유력
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                땅콩
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color={red['400']}>
                의심
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                바닐라
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color={red['400']}>
                의심
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                마가린
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color={orange['400']}>
                조심
              </Typography>
              <Typography fontSize={24} fontWeight={900}>
                우엉
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          {/* * */}
          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>땅콩</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.secondary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '65%', borderRadius: 2, height: '100%', bgcolor: theme.palette.secondary.main }}></Box>
            </Box>
          </Box>

          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>바닐라</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.secondary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '85%', borderRadius: 2, height: '100%', bgcolor: red['500'] }}></Box>
            </Box>
          </Box>

          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>마가린</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.secondary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '20%', borderRadius: 2, height: '100%', bgcolor: red['500'] }}></Box>
            </Box>
          </Box>

          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>우엉</Typography>
              <Box display="flex">
                <Typography>3회</Typography>
                <Box bgcolor={theme.palette.secondary.main} color="white" sx={{ borderRadius: 2, px: 1, ml: 1 }}>
                  <Typography>06.06.2023</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1, borderRadius: 2, height: 10, bgcolor: '#e0e0e0' }}>
              <Box sx={{ width: '45%', borderRadius: 2, height: '100%', bgcolor: orange['500'] }}></Box>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography fontSize={18}>
              이반 게오르기예비치님 (은)는 유력한
              <br />
              <Typography
                component="span"
                color={red['900']}
                fontWeight="bold"
                fontSize={'inherit'}
              >{`'땅콩' 알레르기`}</Typography>{' '}
              보유자에요.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3, p: 2 }}>
        <Typography>
          <Typography component="span" sx={{ fontWeight: 900 }}>
            아 귀찮아
          </Typography>
          님의 식단 분석
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Button sx={{ height: '100%' }}>
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
                background: `conic-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main} ${percentage}%, transparent ${percentage}%, transparent)`,
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
              <Avatar src={IMAGE_WHEAT} sx={{ width: 72, height: 72 }} />
              <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>
                50점
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button sx={{ height: '100%' }}>
              <ArrowForwardIosRoundedIcon />
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Radio
            checked={itemSelected === '0'}
            onChange={(e) => setItemSelected(e.target.value)}
            value={'0'}
            size="small"
          />
          <Radio
            checked={itemSelected === '1'}
            onChange={(e) => setItemSelected(e.target.value)}
            value={'1'}
            size="small"
          />
          <Radio
            checked={itemSelected === '2'}
            onChange={(e) => setItemSelected(e.target.value)}
            value={'2'}
            size="small"
          />
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

        <Box sx={{ mt: 3, bgcolor: '#e0e0e0', p: 3, borderRadius: 5 }}>
          <Typography>일시</Typography>
          <Typography variant="h4" textAlign="center">
            12.25.2023
          </Typography>
        </Box>

        <Box sx={{ mt: 3, bgcolor: '#e0e0e0', p: 3, borderRadius: 5 }}>
          <Typography>음식</Typography>
          <Typography variant="h4" textAlign="center">
            밀
          </Typography>
        </Box>

        <Box sx={{ mt: 3, bgcolor: '#e0e0e0', p: 3, borderRadius: 5 }}>
          <Typography>알레르기 종류</Typography>
          <Typography variant="h4" textAlign="center">
            WDEIA
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
