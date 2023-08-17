import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { autocompleteState } from '../../stores/lists/autocompletes';
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import useDiary from '../../hooks/useDiary';
import { toast } from 'react-hot-toast';
import { globalState } from '../../stores/global/atom';
import ImageIcon from '@mui/icons-material/Image';

/**
 *
 * @param {{profileId:number, refreshSuper:() => void, dateSelected: string}} props
 */
const CreateNew = (props) => {
  const { profileId, refreshSuper, dateSelected } = props;

  const options = useRecoilValue(autocompleteState);
  const [global, setGlobal] = useRecoilState(globalState);

  const [isMedicine, setIsMedicine] = useState(false);
  const [food, setFood] = useState({});
  const [medicine, setMedicine] = useState({});
  const [symptom, setSymptom] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [date, setDate] = useState({
    hour: 0,
    min: 0,
  });

  const { writeNewDiary } = useDiary();

  const handleSubmit = async () => {
    if (!food.id && !medicine.id && !symptom.id) {
      toast('하나 이상은 정보를 제공하세요.');
      return;
    }

    let proms = [];
    const requestDate = `${dateSelected}T${String(date.hour).padStart(2, '0')}:${String(date.min).padStart(
      2,
      '0'
    )}:00.000Z`;

    if (food.id) {
      proms.push(writeNewDiary(profileId, 'food', food.id, requestDate));
    }

    if (medicine.id) {
      proms.push(writeNewDiary(profileId, 'medicine', medicine.id, requestDate));
    }

    if (symptom.id) {
      proms.push(writeNewDiary(profileId, 'symptom', symptom.id, requestDate, uploadedImage ? uploadedImage : null));
    }

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await Promise.all(proms);
      if (res.some((item) => String(item.status)[0] === '2')) {
        toast('등록되었어요.');
        refreshSuper();
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }

    // if (!selected?.item?.id) {
    //   toast(`${isMedicine ? '의약품' : '식품'}을 선택하세요.`);
    //   return;
    // }
    // console.log({ profileId, itemId: selected.id });
    // try {
    //   setGlobal((v) => ({ ...v, loading: true }));
    //   const res = await writeNewDiary(
    //     profileId,
    //     isMedicine ? 'medicine' : 'food',
    //     selected.item.id,
    //     `${dateSelected}T${String(date.hour).padStart(2, '0')}:${String(date.min).padStart(2, '0')}:00.000Z`
    //   );
    //   if (res.status >= 400) {
    //     toast.error(res.data.message);
    //   } else if (String(res.status)[0] === '2') {
    //     toast('등록되었어요.');
    //     refreshSuper();
    //   }
    // } catch (err) {
    //   toast.error('나중에 다시 시도하세요.');
    // } finally {
    //   setGlobal((v) => ({ ...v, loading: false }));
    // }
  };

  // useEffect(() => {
  //   setSelected({ item: {} });
  // }, [isMedicine]);

  const renderSelector = () => {
    // if (isMedicine) {
    //   return (

    //   );
    // }

    return (
      <>
        <Autocomplete
          disablePortal
          options={options.foods}
          getOptionDisabled={(option) => food.id === option.id}
          fullWidth
          renderInput={(params) => <TextField {...params} label="식품" size="small" />}
          onChange={(e, newValue) => setFood({ ...newValue })}
          value={food.label}
        />
        <Autocomplete
          disablePortal
          options={options.symptoms}
          getOptionDisabled={(option) => symptom.id === option.id}
          fullWidth
          renderInput={(params) => <TextField {...params} label="증상" size="small" />}
          onChange={(e, newValue) => setFood({ ...newValue })}
          value={symptom.label}
        />
        <Button
          startIcon={<ImageIcon />}
          component="label"
          onClick={() => setUploadedImage(null)}
          onChange={(e) => {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = async (e) => {
              const imageData = e.target.result;
              setUploadedImage(imageData);
            };
          }}
        >
          이미지 업로드
          <input type="file" hidden accept="image/png, image/jpeg" />
        </Button>
        <Autocomplete
          disablePortal
          options={options.medicines}
          getOptionDisabled={(option) => medicine.id === option.id}
          fullWidth
          renderInput={(params) => <TextField {...params} label="의약품" size="small" />}
          onChange={(e, newValue) => setFood({ ...newValue })}
          value={medicine.label}
        />
      </>
    );
  };

  return (
    <Box sx={{ '& > *': { mb: 2 } }}>
      {renderSelector()}
      <Typography>섭취(복용) 시간</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="시"
            fullWidth
            size="small"
            value={date.hour}
            onChange={(e) => {
              const newvalue = Number(e.target.value);
              if (newvalue < date.hour) {
                setDate((v) => ({ ...v, hour: Math.max(0, newvalue) }));
              } else if (newvalue > date.hour) {
                setDate((v) => ({ ...v, hour: Math.min(23, newvalue) }));
              }
            }}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="분"
            fullWidth
            size="small"
            value={date.min}
            onChange={(e) => {
              const newvalue = Number(e.target.value);
              if (newvalue < date.min) {
                setDate((v) => ({ ...v, min: Math.max(0, newvalue) }));
              } else if (newvalue > date.min) {
                setDate((v) => ({ ...v, min: Math.min(59, newvalue) }));
              }
            }}
          ></TextField>
        </Grid>
      </Grid>
      <Button fullWidth size="large" variant="contained" onClick={handleSubmit}>
        작성 완료
      </Button>
    </Box>
  );
};

export default CreateNew;
