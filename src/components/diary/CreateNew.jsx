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

/**
 *
 * @param {{profileId:number, refreshSuper:() => void, dateSelected: string}} props
 */
const CreateNew = (props) => {
  const { profileId, refreshSuper, dateSelected } = props;

  const options = useRecoilValue(autocompleteState);
  const [global, setGlobal] = useRecoilState(globalState);

  const [isMedicine, setIsMedicine] = useState(false);
  const [selected, setSelected] = useState({
    item: { id: null, label: '' },
  });
  const [date, setDate] = useState({
    hour: 0,
    min: 0,
  });

  const { writeNewDiary } = useDiary();

  const handleSubmit = async () => {
    if (!selected?.item?.id) {
      toast(`${isMedicine ? '의약품' : '식품'}을 선택하세요.`);
      return;
    }
    // console.log({ profileId, itemId: selected.id });

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await writeNewDiary(
        profileId,
        isMedicine ? 'medicine' : 'food',
        selected.item.id,
        `${dateSelected}T${String(date.hour).padStart(2, '0')}:${String(date.min).padStart(2, '0')}:00.000Z`
      );
      if (res.status >= 400) {
        toast.error(res.data.message);
      } else if (String(res.status)[0] === '2') {
        toast('등록되었어요.');
        refreshSuper();
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  useEffect(() => {
    setSelected({ item: {} });
  }, [isMedicine]);

  const renderSelector = () => {
    if (isMedicine) {
      return (
        <Autocomplete
          disablePortal
          options={options.medicines}
          getOptionDisabled={(option) => selected.item.id === option.id}
          fullWidth
          renderInput={(params) => <TextField {...params} label="의약품" size="small" />}
          onChange={(e, newValue) => setSelected((v) => ({ ...v, item: { ...newValue } }))}
          value={selected.item.label}
        />
      );
    }

    return (
      <Autocomplete
        disablePortal
        options={options.foods}
        getOptionDisabled={(option) => selected.item.id === option.id}
        fullWidth
        renderInput={(params) => <TextField {...params} label="식품" size="small" />}
        onChange={(e, newValue) => setSelected((v) => ({ ...v, item: { ...newValue } }))}
        value={selected.item.label}
      />
    );
  };

  return (
    <Box sx={{ '& > *': { mb: 2 } }}>
      <FormControlLabel
        control={<Switch value={isMedicine} onChange={(e) => setIsMedicine(e.target.checked)} />}
        label={`종류 : ${isMedicine ? '의약품' : '식품'}`}
      />
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
