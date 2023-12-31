import React, { useEffect, useState } from 'react';
import useScan from '../../hooks/useScan';
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getTextColorForBackground, isSuccess } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useDiary from '../../hooks/useDiary';
import { useRecoilState, useRecoilValue } from 'recoil';

import { authState } from '../../stores/auth/atom';
import { globalState } from '../../stores/global/atom';

const ScanResult = () => {
  /* stores */
  const auth = useRecoilValue(authState);
  const [global, setGlobal] = useRecoilState(globalState);

  /* routers */
  const navigate = useNavigate();

  /* states */
  const [isWritten, setIsWritten] = useState(false);

  /* hooks */
  const { scanResult } = useScan();
  const { writeNewDiary } = useDiary();

  /* functions */
  const handleWrite = async () => {
    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await writeNewDiary(auth.userData?.id, scanResult.isMedicine ? 'medicine' : 'food', scanResult?.id);
      if (res.status >= 400) {
        toast.error(res.data.message);
      } else if (isSuccess(res.status)) {
        toast('일기장에 등록되었어요.');
        setIsWritten(true);
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  /* effects */
  useEffect(() => {
    let invalid = false;

    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    if (!scanResult.id || scanResult.id === -1) {
      invalid = true;
      toast.error('잘못된 접근이에요.');
      navigate('/', { replace: true });
      return;
    }

    window.addEventListener('beforeunload', handler);
    console.log(scanResult);

    return () => {
      !invalid && window.removeEventListener('beforeunload', handler);
    };
  }, []);

  /* renders */
  const renderFriends = () => {
    const koreanTitle = {
      family: '가족',
      friend: '친구',
    };

    return (
      scanResult?.alerts &&
      Object.keys(scanResult.alerts).map((key, index) => {
        const target = scanResult.alerts[key];

        if (!target || target.length === 0) {
          return null;
        }

        return (
          <React.Fragment key={index}>
            <Typography variant="body2">{koreanTitle[key] ? koreanTitle[key] : key}</Typography>
            {target.map((jtem, jndex) => {
              const { id, name } = jtem;
              const constants = ['materials', 'allergies', 'ingredients'];

              return (
                <Card key={id} sx={{ borderRadius: 5 }}>
                  <CardContent>
                    <Box>
                      <Box display="flex" alignItems="center">
                        <Avatar />
                        <Typography sx={{ ml: 2 }}>{name}</Typography>
                      </Box>
                      {constants.map((ktem, kndex) => {
                        return (
                          <Box
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 2,
                              mt: 2,
                              p: 2,
                              textAlign: 'center',
                            }}
                          >
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                              {jtem[ktem] && jtem[ktem].length > 0 ? (
                                jtem[ktem].map((item, index) => {
                                  const [r, g, b] = [
                                    Math.round(Math.random() * 255),
                                    Math.round(Math.random() * 255),
                                    Math.round(Math.random() * 255),
                                  ];
                                  return (
                                    <Chip
                                      key={index}
                                      label={item}
                                      sx={{
                                        color: getTextColorForBackground({ r, g, b }),
                                        bgcolor: `rgba(${r},${g},${b},0.8)`,
                                      }}
                                    />
                                  );
                                })
                              ) : (
                                <Typography>해당 항목이 없어요.</Typography>
                              )}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </React.Fragment>
        );
      })
    );
  };

  return (
    <Box sx={{ m: 2, pb: 12 }}>
      <Typography variant="h5">식품(의약품) 정보</Typography>
      <Typography variant="body2" color="#666">
        검색된 식품 결과에요.
      </Typography>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography display="flex" alignItems="center" justifyContent="center">
          <QrCode2Icon fontSize="small" />
          <Typography component="span">
            코드: {scanResult.barcode ? scanResult.barcode : '직접 등록한 항목이에요.'}
          </Typography>
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 32 }}>{scanResult.name}</Typography>
        <Typography variant="body2">원재료명</Typography>
        <Card sx={{ borderRadius: 5 }}>
          <CardContent>
            {scanResult.materials?.length > 0 ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {scanResult.materials.map((item, index) => {
                  const [r, g, b] = [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                  ];
                  return (
                    <Chip
                      key={index}
                      label={item}
                      sx={{ color: getTextColorForBackground({ r, g, b }), bgcolor: `rgba(${r},${g},${b},0.8)` }}
                    />
                  );
                })}
              </Stack>
            ) : (
              <Typography>해당 항목이 없어요.</Typography>
            )}
          </CardContent>
        </Card>
        <Typography variant="body2" sx={{ mt: 2 }}>
          알레르기 항원
        </Typography>
        <Card sx={{ borderRadius: 5 }}>
          <CardContent>
            {scanResult.allergies?.length > 0 ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {scanResult.allergies.map((item, index) => {
                  const [r, g, b] = [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                  ];
                  return (
                    <Chip
                      key={index}
                      label={item}
                      sx={{ color: getTextColorForBackground({ r, g, b }), bgcolor: `rgba(${r},${g},${b},0.8)` }}
                    />
                  );
                })}
              </Stack>
            ) : (
              <Typography>해당 항목이 없어요.</Typography>
            )}
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ mt: 2 }}>
          의약품 성분
        </Typography>
        <Card sx={{ borderRadius: 5 }}>
          <CardContent>
            {scanResult.ingredients?.length > 0 ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {scanResult.ingredients.map((item, index) => {
                  const [r, g, b] = [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                  ];
                  return (
                    <Chip
                      key={index}
                      label={item}
                      sx={{ color: getTextColorForBackground({ r, g, b }), bgcolor: `rgba(${r},${g},${b},0.8)` }}
                    />
                  );
                })}
              </Stack>
            ) : (
              <Typography>해당 항목이 없어요.</Typography>
            )}
          </CardContent>
        </Card>

        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 32,
            mt: 4,
            mb: 2,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 'inherit',
              fontSize: 'inherit',
              background: '#CF0000',
              background: `linear-gradient(to right, #EA4C46 0%, #A6110E 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            알레르기 경보!
          </Typography>
          🚨
        </Typography>
        <Box sx={{ textAlign: 'left', bgcolor: '#f4f4f4', borderRadius: 5, p: 2, '& > *:not(:last-child)': { mb: 2 } }}>
          {renderFriends()}
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
        startIcon={<NoteAltIcon />}
        onClick={handleWrite}
        disabled={isWritten}
      >
        일기장에 등록하기
      </Button>
    </Box>
  );
};

export default ScanResult;
