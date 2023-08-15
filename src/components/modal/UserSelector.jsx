import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { friendListState } from '../../stores/lists/friends';

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

/**
 *
 * @param {{
 *  categories: string[],
 *  checkBoxProps: CheckboxProps
 *  open: boolean,
 *  close: () => void,
 *  selectedState: [any, React.Dispatch<React.SetStateAction<any>>]
 *  selectedNameState: [string, React.Dispatch<React.SetStateAction<string>>]
 * }} props
 * @returns
 */
const UserSelector = (props) => {
  const { categories, checkBoxProps, open, close, selectedState, selectedNameState } = props;

  /* constants */
  const KOREAN_NAMES = {
    family: '가족',
    friend: '친구',
  };

  /* stores */
  const contact = useRecoilValue(friendListState);

  /* prop states */
  const [selected, setSelected] = selectedState;
  const [selectedName, setSelectedName] = selectedNameState;

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>프로필 선택</DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: `calc(100vh - 14rem)`, overflowY: 'scroll' }}>
          {categories.map((key) => {
            return (
              <React.Fragment key={key}>
                <Typography variant="body2">{KOREAN_NAMES[key] ? KOREAN_NAMES[key] : key}</Typography>
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
                        defaultChecked={selected === id}
                        disabled={selected === id}
                        {...checkBoxProps}
                        onClick={() => {
                          setSelected(id);
                          setSelectedName(name);
                          close();

                          checkBoxProps?.onClick && checkBoxProps.onClick();
                        }}
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
        <Button onClick={close}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelector;
