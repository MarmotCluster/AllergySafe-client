import { Box, Button, Divider, Grid, Modal, Rating, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useRecoilValue } from 'recoil';
import { rateState } from '../../stores/lists/rates';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import useList from '../../hooks/useList';
import { globalState } from '../../stores/global/atom';

const dummy = [
  {
    date: '2023-08-08',
    star: 5,
    content: '정확도가 높아요',
  },
  {
    date: '2023-08-08',
    star: 1,
    content: '생각만큼 원하는 결과가 나오지 않아요.',
  },
];

/**
 *
 * @param {{
 * openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
 * rateState: [number, React.Dispatch<React.SetStateAction<number>>]
 * }} props
 * @returns
 */
const RateUs = (props) => {
  const { openState } = props;

  const theme = useTheme();

  const [global, setGlobal] = useState(globalState);
  const rates = useRecoilValue(rateState);

  const [open, setOpen] = openState;
  const [rate, setRate] = props.rateState;
  const [content, setContent] = useState('');

  const { postReview, getRate } = useList();

  const handleContent = (e) => {
    const newValue = e.target.value;
    if (newValue.length > 100) {
      return;
    }

    setContent(newValue);
  };

  const handleSubmit = async () => {
    if (content.length < 5) {
      toast('내용은 최소 5자 이상 작성하세요.');
      return;
    }

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await postReview(rate, content);
      if (res.status >= 400) {
        toast.error(res.data.message);
      } else if (String(res.status)[0] === '2') {
        toast('등록되었어요.');
        getRate();
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  const renderMyRate = () => {
    if (rates.star === -1) {
      return (
        <>
          <Typography>평가하기</Typography>
          <Rating
            size="large"
            sx={{ py: 1, fontSize: 48 }}
            value={rate}
            onChange={(e, newValue) => {
              if (newValue < rate) {
                setRate(newValue < 1 ? 1 : newValue);
              } else {
                setRate(newValue);
              }
            }}
            disabled={global.loading}
          />
          <TextField
            multiline
            fullWidth
            size="small"
            placeholder="내용을 자유롭게 기재해 주세요."
            rows={4}
            value={content}
            onChange={handleContent}
            error={content.length >= 100}
            disabled={global.loading}
          />
          <Typography variant="body2" sx={{ textAlign: 'left', fontSize: 12, pt: 1, color: '#ccc' }}>
            ({content.length} / 100)
          </Typography>
          <Button fullWidth variant="outlined" onClick={handleSubmit} disabled={global.loading}>
            등록하기
          </Button>
        </>
      );
    }

    return (
      <>
        <Typography>나의 평가</Typography>
        <Rating size="large" sx={{ py: 1, fontSize: 48 }} value={rates.star} readOnly />
        <Typography>{rates.content}</Typography>
      </>
    );
  };

  const renderRates = () => {
    if (rates.reviews.length === 0) {
      return (
        <Typography sx={{ textAlign: 'center', p: 1 }}>
          아직 평가한 사람이 없어요.<Typography variant="body2">나중에 다시 조회해 보아요.</Typography>
        </Typography>
      );
    }

    return rates.reviews.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            textAlign: 'center',
            borderRadius: 5,
            p: 2,
            boxShadow: '0 4px 4px rgba(0,0,0,0.08)',
            border: '1px solid #fafafa',
            bgcolor: 'white',
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '40px 40px 0 0',
              borderColor: `${theme.palette.primary.main} transparent transparent transparent`,
            }}
          />
          <Typography variant="body2" sx={{ textAlign: 'right', color: '#ccc' }}>
            사용자 | {item.date}
          </Typography>
          <Rating size="large" sx={{ py: 1 }} value={item.star} readOnly />
          <Typography>
            <i>{`" ${item.content} "`}</i>
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          m: 2,
          p: 2,
          width: '100%',
          height: rates.star !== -1 ? 'calc(100% - 2rem)' : 'auto',
          borderRadius: 2,
        }}
      >
        <Box sx={{ height: 'calc(100% - 3rem)', overflowY: 'scroll', textAlign: 'center' }}>
          <Box>{renderMyRate()}</Box>

          <Divider sx={{ my: 2 }} />

          {rates.star !== -1 ? (
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ mb: 1 }}>평가 목록 ({rates.totalCount})</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography component="span">
                    <StarHalfIcon color="warning" />
                  </Typography>
                  <b>평균 : {rates.average}</b>
                </Typography>
              </Box>
              <Box>{renderRates()}</Box>
            </Box>
          ) : (
            <Typography>평가를 작성하고 목록을 둘러보세요.</Typography>
          )}
        </Box>

        <Button fullWidth size="large" onClick={() => setOpen(false)}>
          그만보기
        </Button>
      </Box>
    </Modal>
  );
};

export default RateUs;
