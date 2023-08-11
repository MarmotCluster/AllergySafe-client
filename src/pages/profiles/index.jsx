import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import useList from '../../hooks/useList';
import { useRecoilState, useRecoilValue } from 'recoil';
import { friendListState } from '../../stores/lists/friends';
import { authState } from '../../stores/auth/atom';
import { globalState } from '../../stores/global/atom';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-hot-toast';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { autocompleteState } from '../../stores/lists/autocompletes';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AllergyProfiles = () => {
  /* stores */
  const contacts = useRecoilValue(friendListState);

  const options = useRecoilValue(autocompleteState);

  const auth = useRecoilValue(authState);

  const [global, setGlobal] = useRecoilState(globalState);

  /* states */
  const [selected, setSelected] = useState(-1);

  /**@type {[Person, React.Dispatch<React.SetStateAction<Person>>]} */
  const [data, setData] = useState({});

  const [askDelete, setAskDelete] = useState(false);

  const [adding, setAdding] = useState({
    family: false,
    friend: false,
    materials: false,
    allergies: false,
    ingredients: false,
  });

  const [newName, setNewname] = useState({
    family: '',
    friend: '',
    materials: '',
    allergies: '',
    ingredients: '',
  });

  const [disabled, setDisabled] = useState(false);

  /* hooks */
  const { getContacts, addFamily, deleteFromFamily, addFriend, deleteFromFriend } = useList();

  /* functions */
  const closeSelected = () => {
    setSelected(-1);
    setAskDelete(false);
  };

  /* effects */
  useEffect(() => {
    getContacts();
    document.body.style.backgroundColor = '#f4f4f4';

    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  /* renders */
  const renderContacts = () => {
    const koreanTitle = {
      family: '가족',
      friend: '친구',
    };

    return Object.keys(contacts).map((key, index) => {
      return (
        <React.Fragment key={key}>
          <Typography sx={{ mt: 2, color: '#999' }} variant="body2">
            {koreanTitle[key] ? koreanTitle[key] : key}
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {adding[key] ? (
              <Box
                sx={{
                  m: 1,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: '#ccc',
                  minHeight: 56,
                }}
              >
                <TextField
                  size="small"
                  label={key === 'family' ? '이름' : '아이디'}
                  type={key === 'family' ? 'text' : 'number'}
                  variant="outlined"
                  fullWidth
                  value={newName[key]}
                  onChange={(e) => setNewname((v) => ({ ...v, [key]: e.target.value }))}
                />
                <Button
                  sx={{ height: 40 }}
                  onClick={async () => {
                    if (newName[key].length === 0) {
                      toast('입력란이 비었어요.');
                      return;
                    }

                    try {
                      setGlobal((v) => ({ ...v, loading: true }));
                      const res = key === 'family' ? await addFamily(newName[key]) : await addFriend(newName[key]);
                      if (res.status >= 400) {
                        toast.error(res.data.message);
                      } else if (String(res.status)[0] === '2') {
                        toast('추가되었어요.');
                        getContacts();
                        setAdding((v) => ({ ...v, [key]: false }));
                      }
                    } catch (err) {
                      toast.error('나중에 다시 시도하세요.');
                    } finally {
                      setGlobal((v) => ({ ...v, loading: false }));
                    }
                  }}
                >
                  <CheckIcon />
                </Button>
                <Button sx={{ height: 40, mr: 2 }} onClick={() => setAdding((v) => ({ ...v, [key]: false }))}>
                  <ClearIcon />
                </Button>
              </Box>
            ) : (
              <Button
                color="inherit"
                fullWidth
                onClick={() => {
                  setAdding((v) => ({ ...v, [key]: true }));
                  setNewname((v) => ({ ...v, [key]: '' }));
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    color: '#ccc',
                    minHeight: 56,
                  }}
                >
                  <AddCircleIcon sx={{ color: 'inherit' }} />
                  <Typography sx={{ ml: 1.6 }} variant="body2">{`여기에 새 항목 추가하기`}</Typography>
                </Box>
              </Button>
            )}
            {contacts[key].map((item, i) => {
              const { name } = item;

              const handleClick = () => {
                const target = item.id;

                setSelected(() => {
                  /**@type {Person | undefined} */
                  let found;
                  /**@type {'family' | 'friend'} */
                  let foundAt;
                  const categories = Object.keys(contacts);
                  for (let i = 0; i < categories.length; i++) {
                    foundAt = categories[i];
                    found = contacts[foundAt].find((ii) => ii.id === target);
                    if (found) {
                      console.log({ category: foundAt, ...found });
                      setData({ category: foundAt, ...found });
                      break;
                    }
                  }
                  return target;
                });
              };

              return (
                <React.Fragment key={item.id}>
                  <Divider />
                  <Button color="inherit" fullWidth onClick={handleClick}>
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar />
                      <Typography sx={{ ml: 1.6 }}>{name}</Typography>
                    </Box>
                  </Button>
                </React.Fragment>
              );
            })}
          </Box>
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Box>
          <Typography>알레르기 세이프 주소록</Typography>
        </Box>

        <Box sx={{ pb: 12 }}>{renderContacts()}</Box>
      </Box>
      <Dialog fullScreen open={selected !== -1} TransitionComponent={Transition}>
        <Box sx={{ bgcolor: '#f4f4f4', width: '100%', height: '100%', p: 2 }}>
          <Box name="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={closeSelected}>
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
            <Box display="flex">
              <IconButton>
                <ShareRoundedIcon />
              </IconButton>
              <IconButton>
                <EditRoundedIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => setAskDelete(true)}
                disalbed={auth.userData?.name === data?.name}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ borderRadius: 5, overflow: 'hidden', height: askDelete ? 40 : 0, transition: 'height .2s ease' }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ height: '100%' }}
              onClick={async () => {
                setGlobal((v) => ({ ...v, loading: true }));
                try {
                  const res =
                    data?.category === 'family' ? await deleteFromFamily(data.id) : await deleteFromFriend(data.id);
                  if (res.status >= 400) {
                    toast.error(res.data.message);
                  } else if (String(res.status)[0] === '2') {
                    toast('삭제되었어요.');
                    getContacts();
                    closeSelected();
                  }
                } catch (err) {
                  toast.error('나중에 다시 시도하세요.');
                } finally {
                  setGlobal((v) => ({ ...v, loading: false }));
                }
              }}
            >
              이 과정은 되돌릴 수 없어요.
            </Button>
          </Box>

          <Box
            sx={{
              mt: 8,
              bgcolor: 'white',
              borderRadius: 5,
              minHeight: 90,
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <Typography sx={{ fontWeight: 900 }}>{data.name ? data.name : 'Unknown'}</Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 8 }}>
            식품 원재료
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {data?.materials?.length === 0 && <Typography sx={{ p: 2, color: '#999' }}>항목이 없어요.</Typography>}
            {data?.materials?.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <Typography sx={{ p: 2 }}>{item.name}</Typography>
                  <Divider />
                </React.Fragment>
              );
            })}
            {data?.category === 'family' && !adding.materials ? (
              <Button color="inherit" fullWidth onClick={() => setAdding((v) => ({ ...v, materials: true }))}>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    color: '#ccc',
                    minHeight: 44,
                  }}
                >
                  <AddCircleIcon sx={{ color: 'inherit' }} />
                  <Typography sx={{ ml: 1.6 }} variant="body2">{`추가 또는 제거`}</Typography>
                </Box>
              </Button>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Autocomplete
                  disablePortal
                  options={options.materials}
                  getOptionDisabled={(option) => Boolean(data.materials.find((item) => item.id === option.id))}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="식품 원재료" size="small" />}
                  sx={{ p: 2, pr: 0 }}
                  onChange={(e, newValue) => setNewname((v) => ({ ...v, materials: newValue.label }))}
                />
                <Button sx={{ height: 40 }}>
                  <CheckIcon />
                </Button>
                <Button sx={{ height: 40, mr: 2 }} onClick={() => setAdding((v) => ({ ...v, materials: false }))}>
                  <ClearIcon />
                </Button>
              </Box>
            )}
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            알레르기 항원
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {data?.allergies?.length === 0 && <Typography sx={{ p: 2, color: '#999' }}>항목이 없어요.</Typography>}
            {data?.allergies?.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <Typography sx={{ p: 2 }}>{item.name}</Typography>
                  <Divider />
                </React.Fragment>
              );
            })}
            {data?.category === 'family' && (
              <Button color="inherit" fullWidth>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    color: '#ccc',
                    minHeight: 44,
                  }}
                >
                  <AddCircleIcon sx={{ color: 'inherit' }} />
                  <Typography sx={{ ml: 1.6 }} variant="body2">{`추가 또는 제거`}</Typography>
                </Box>
              </Button>
            )}
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            의약품 성분
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {data?.ingredients?.length === 0 && <Typography sx={{ p: 2, color: '#999' }}>항목이 없어요.</Typography>}
            {data?.ingredients?.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <Typography sx={{ p: 2 }}>{item.name}</Typography>
                  {data.ingredients.length > 1 && <Divider />}
                </React.Fragment>
              );
            })}
            {data?.category === 'family' && (
              <Button color="inherit" fullWidth>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    color: '#ccc',
                    minHeight: 44,
                  }}
                >
                  <AddCircleIcon sx={{ color: 'inherit' }} />
                  <Typography sx={{ ml: 1.6 }} variant="body2">{`추가 또는 제거`}</Typography>
                </Box>
              </Button>
            )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AllergyProfiles;
