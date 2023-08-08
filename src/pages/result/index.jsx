import React from 'react';
import useScan from '../../hooks/useScan';
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import { getTextColorForBackground } from '../../utils';

const ScanResult = () => {
  /* hooks */
  const { scanResult } = useScan();

  /* renders */
  const renderFriends = () => {
    return scanResult.friendList.map(({ category, items }, index) => {
      return (
        <React.Fragment key={index}>
          <Typography variant="body2">{category}</Typography>
          {items.map((jtem, jndex) => {
            const { id, profileImage, name, allergics } = jtem;
            return (
              <Card key={id}>
                <CardContent>
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Avatar />
                      <Typography sx={{ ml: 2 }}>{name}</Typography>
                    </Box>
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
                        {allergics ? (
                          allergics.map((item, index) => {
                            const [r, g, b] = [
                              Math.round(Math.random() * 255),
                              // .toString(16)
                              // .padStart(2, '0'),
                              Math.round(Math.random() * 255),
                              // .toString(16)
                              // .padStart(2, '0'),
                              Math.round(Math.random() * 255),
                              // .toString(16)
                              // .padStart(2, '0'),
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
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ m: 2, mb: 12 }}>
      <Typography variant="h5">식품(의약품) 정보</Typography>
      <Typography variant="body2" color="#666">
        검색된 식품 결과에요.
      </Typography>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography display="flex" alignItems="center" justifyContent="center">
          <QrCode2Icon fontSize="small" />
          <Typography component="span">코드: {scanResult.serial}</Typography>
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 32 }}>{scanResult.name}</Typography>
        <Typography variant="body2">원재료명</Typography>
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
        <Typography variant="body2" sx={{ mt: 2 }}>
          알레르기 항원
        </Typography>
        <Card>
          <CardContent>
            {scanResult.antigens?.length > 0 ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {scanResult.antigens.map((item, index) => {
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
        <Box sx={{ textAlign: 'left', bgcolor: '#f4f4f4', borderRadius: 2, p: 2, '& > *:not(:last-child)': { mb: 2 } }}>
          {renderFriends()}
        </Box>
      </Box>

      <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }}>
        일기장에 등록하기
      </Button>
    </Box>
  );
};

export default ScanResult;
