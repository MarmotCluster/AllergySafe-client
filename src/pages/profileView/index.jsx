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
  Tooltip,
  Typography,
  alpha,
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

import PersonAddIcon from '@mui/icons-material/PersonAdd';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { autocompleteState } from '../../stores/lists/autocompletes';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ProfileView = () => {
  /* built-in hooks */
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

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
    materials: { label: null, id: null },
    allergies: { label: null, id: null },
    ingredients: { label: null, id: null },
  });

  const [disabled, setDisabled] = useState(false);

  /* hooks */
  const {
    getContacts,
    addFamily,
    deleteFromFamily,
    addFriend,
    deleteFromFriend,
    postElement,
    removeElement,
    getProfileShared,
  } = useList();

  const { changeProfileImage } = useAuth();

  /* functions */
  const closeSelected = () => {
    setSelected(-1);
    setAskDelete(false);
    setAdding({
      family: false,
      friend: false,
      materials: false,
      allergies: false,
      ingredients: false,
    });
    setNewname({
      family: '',
      friend: '',
      materials: { label: null, id: null },
      allergies: { label: null, id: null },
      ingredients: { label: null, id: null },
    });
    navigate(auth.isSignedIn ? '/profile' : '/login');
  };

  /**
   *
   * @param {number} id
   */
  const refreshList = async (id) => {
    console.log('리프레시 리스트 콜드.');
    try {
      const res = await getContacts();
      if (String(res.status)[0] === '2') {
        console.log('받은 res', res);
        let found;
        found = res.data.family.find((item) => item.id === id);
        if (found !== null) {
          setData({ category: 'family', ...found });
          return;
        }

        found = res.data.friend.find((item) => item.id === id);
        setData({ category: 'friend', ...found });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* effects */
  useEffect(() => {
    const init = async () => {
      const [share, profileId, token] = [
        Boolean(searchParams.get('share')),
        searchParams.get('profileId'),
        searchParams.get('token'),
      ];

      if (share && profileId && token) {
        try {
          setGlobal((v) => ({ ...v, loading: true }));
          const singleData = await getProfileShared(profileId, token);

          if (singleData.status >= 400) {
            toast.error(singleData.data.message);
            navigate(auth.isSignedIn ? '/' : '/login', { replace: true });
          } else if (String(singleData.status)[0] === '2') {
            setSelected(profileId);
            setData({ ...singleData.data, category: 'friend' });
          }
        } catch (err) {
          toast.error('나중에 다시 시도하세요.');
        } finally {
          setGlobal((v) => ({ ...v, loading: false }));
        }
      } else {
        getContacts();
      }
    };

    init();
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

    const renderAddElement = (key) => {
      if (key !== 'family') {
        if (contacts[key].length === 0) {
          return <Typography sx={{ textAlign: 'center', p: 3, color: '#ccc' }}>목록이 비었어요.</Typography>;
        }
      }

      if (adding[key]) {
        return (
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
        );
      }

      return (
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
            <Typography sx={{ ml: 1.6 }} variant="body2">{` 추가하기`}</Typography>
          </Box>
        </Button>
      );
    };

    return Object.keys(contacts).map((key, index) => {
      return (
        <React.Fragment key={key}>
          <Typography sx={{ mt: 2, color: '#999' }} variant="body2">
            {koreanTitle[key] ? koreanTitle[key] : key}
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {renderAddElement(key)}
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
                      <Avatar src={item.imageUrl} />
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
      {/* <Box sx={{ m: 2 }}>
        <Box>
          <Typography>알레르기 세이프 주소록</Typography>
        </Box>

        <Box sx={{ pb: 12 }}>{renderContacts()}</Box>
      </Box> */}
      <Dialog fullScreen open={selected !== -1} TransitionComponent={Transition}>
        <Box sx={{ bgcolor: '#f4f4f4', width: '100%', height: '100%', p: 2, maxHeight: '100vh', overflowY: 'scroll' }}>
          <Box name="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={closeSelected}>
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
            <Box display="flex">
              {/* <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://allergysafe.life/profileView?profileId=${data.id}&token=${auth.userData?.emailToken}&share=true`
                  );
                  toast('클립보드에 복사되었어요.');
                }}
              >
                <ShareRoundedIcon />
              </IconButton> */}
              {/* <IconButton>
                  <EditRoundedIcon />
                </IconButton> */}
              {/* {auth.userData?.id !== data?.id && (
                <IconButton color="error" onClick={() => setAskDelete((v) => !v)}>
                  <DeleteIcon />
                </IconButton>
              )} */}
            </Box>
          </Box>

          <Box sx={{ borderRadius: 5, overflow: 'hidden', height: 40, transition: 'height .2s ease' }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              sx={{ height: '100%' }}
              onClick={async () => {
                if (!auth.isSignedIn) {
                  toast('로그인 후에 이용하세요.');
                  navigate('/login');
                  return;
                }

                setGlobal((v) => ({ ...v, loading: true }));
                try {
                  const res = await addFriend(searchParams.get('profileId'));
                  if (res.status >= 400) {
                    toast.error(res.data.message);
                  } else if (String(res.status)[0] === '2') {
                    toast('친구로 추가되었어요.');
                    navigate(auth.isSignedIn ? '/profile' : '/login');
                  }
                } catch (err) {
                  toast.error('나중에 다시 시도하세요.');
                } finally {
                  setGlobal((v) => ({ ...v, loading: false }));
                }
              }}
            >
              친구로 추가하기
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
            <Tooltip title="이미지 바꾸기">
              <IconButton
                sx={{
                  width: 100,
                  height: 100,
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  overflow: 'hidden',
                }}
                disabled={data?.category !== 'family'}
                component="label"
                onClick={(e) => (e.target.value = null)}
                onChange={async (e) => {
                  try {
                    setGlobal((v) => ({ ...v, loading: true }));
                    const res = await changeProfileImage(data.id, e.target.files[0]);
                    if (res.status >= 400) {
                      toast.error(
                        res.data.message ? res.data.message : `${res.status} : 알 수 없는 오류가 발생했어요.`
                      );
                    } else if (String(res.status)[0] === '2') {
                      toast('변경되었어요.');
                      refreshList(data.id);
                    }
                  } catch (err) {
                    toast.error('나중에 다시 시도하세요.');
                  } finally {
                    setGlobal((v) => ({ ...v, loading: false }));
                  }
                }}
              >
                <Avatar src={data?.imageUrl} sx={{ width: '100%', height: '100%' }} />
                <input type="file" accept="image/png, image/gif, image/jpeg" hidden />
              </IconButton>
            </Tooltip>

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
                  <Box sx={{ px: 2, py: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{item.name}</Typography>
                    {data.category === 'family' && (
                      <IconButton
                        color="default"
                        onClick={async () => {
                          try {
                            setGlobal((v) => ({ ...v, loading: true }));
                            const res = await removeElement(data.id, 'material', {
                              profileElementType: 'material',
                              id: item.id,
                            });

                            if (res.status >= 400) {
                              toast.error(res.data.message);
                            } else if (String(res.status)[0] === '2') {
                              toast('삭제되었어요.');
                              refreshList(data.id);
                            }
                          } catch (err) {
                            toast.error('나중에 다시 시도하세요.');
                          } finally {
                            setGlobal((v) => ({ ...v, loading: false }));
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Divider />
                </React.Fragment>
              );
            })}
            {(function () {
              if (data.category === 'family') {
                if (adding.materials === false) {
                  return (
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
                        <Typography sx={{ ml: 1.6 }} variant="body2">{`추가하기`}</Typography>
                      </Box>
                    </Button>
                  );
                }

                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Autocomplete
                      disablePortal
                      options={options.materials}
                      getOptionDisabled={(option) => Boolean(data.materials.find((item) => item.id === option.id))}
                      fullWidth
                      renderInput={(params) => <TextField {...params} label="식품 원재료" size="small" />}
                      sx={{ p: 2, pr: 0 }}
                      onChange={(e, newValue) => setNewname((v) => ({ ...v, materials: newValue }))}
                      value={newName.materials.label}
                    />
                    <Button
                      sx={{ height: 40 }}
                      onClick={async () => {
                        if (!newName.materials.label) return;

                        try {
                          setGlobal((v) => ({ ...v, loading: true }));
                          const res = await postElement(data.id, 'material', {
                            profileElementType: 'material',
                            id: newName.materials.id,
                          });

                          if (res.status >= 400) {
                            toast.error(res.data.message);
                          } else if (String(res.status)[0] === '2') {
                            toast('추가되었어요.');
                            setNewname((v) => ({ ...v, materials: { label: null, id: null } }));
                            refreshList(data.id);
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
                    <Button sx={{ height: 40, mr: 2 }} onClick={() => setAdding((v) => ({ ...v, materials: false }))}>
                      <ClearIcon />
                    </Button>
                  </Box>
                );
              }
            })()}
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            알레르기 항원
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {data?.allergies?.length === 0 && <Typography sx={{ p: 2, color: '#999' }}>항목이 없어요.</Typography>}
            {data?.allergies?.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <Box sx={{ px: 2, py: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{item.name}</Typography>
                    {data.category === 'family' && (
                      <IconButton
                        color="default"
                        onClick={async () => {
                          try {
                            setGlobal((v) => ({ ...v, loading: true }));
                            const res = await removeElement(data.id, 'allergy', {
                              profileElementType: 'allergy',
                              id: item.id,
                            });

                            if (res.status >= 400) {
                              toast.error(res.data.message);
                            } else if (String(res.status)[0] === '2') {
                              toast('삭제되었어요.');
                              refreshList(data.id);
                            }
                          } catch (err) {
                            toast.error('나중에 다시 시도하세요.');
                          } finally {
                            setGlobal((v) => ({ ...v, loading: false }));
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Divider />
                </React.Fragment>
              );
            })}
            {(function () {
              if (data.category === 'family') {
                if (adding.allergies === false) {
                  return (
                    <Button color="inherit" fullWidth onClick={() => setAdding((v) => ({ ...v, allergies: true }))}>
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
                        <Typography sx={{ ml: 1.6 }} variant="body2">{`추가하기`}</Typography>
                      </Box>
                    </Button>
                  );
                }

                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Autocomplete
                      disablePortal
                      options={options.allergies}
                      getOptionDisabled={(option) => Boolean(data.allergies.find((item) => item.id === option.id))}
                      fullWidth
                      renderInput={(params) => <TextField {...params} label="식품 원재료" size="small" />}
                      sx={{ p: 2, pr: 0 }}
                      onChange={(e, newValue) => setNewname((v) => ({ ...v, allergies: newValue }))}
                      value={newName.allergies.label}
                    />
                    <Button
                      sx={{ height: 40 }}
                      onClick={async () => {
                        if (!newName.allergies.label) return;

                        try {
                          setGlobal((v) => ({ ...v, loading: true }));
                          const res = await postElement(data.id, 'allergy', {
                            profileElementType: 'allergy',
                            id: newName.allergies.id,
                          });

                          if (res.status >= 400) {
                            toast.error(res.data.message);
                          } else if (String(res.status)[0] === '2') {
                            toast('추가되었어요.');
                            setNewname((v) => ({ ...v, allergies: { label: null, id: null } }));
                            refreshList(data.id);
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
                    <Button sx={{ height: 40, mr: 2 }} onClick={() => setAdding((v) => ({ ...v, allergies: false }))}>
                      <ClearIcon />
                    </Button>
                  </Box>
                );
              }
            })()}
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            의약품 성분
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'white', borderRadius: 5, overflow: 'hidden' }}>
            {data?.ingredients?.length === 0 && <Typography sx={{ p: 2, color: '#999' }}>항목이 없어요.</Typography>}
            {data?.ingredients?.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <Box sx={{ px: 2, py: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{item.name}</Typography>
                    {data.category === 'family' && (
                      <IconButton
                        color="default"
                        onClick={async () => {
                          try {
                            setGlobal((v) => ({ ...v, loading: true }));
                            const res = await removeElement(data.id, 'ingredient', {
                              profileElementType: 'ingredient',
                              id: item.id,
                            });

                            if (res.status >= 400) {
                              toast.error(res.data.message);
                            } else if (String(res.status)[0] === '2') {
                              toast('삭제되었어요.');
                              refreshList(data.id);
                            }
                          } catch (err) {
                            toast.error('나중에 다시 시도하세요.');
                          } finally {
                            setGlobal((v) => ({ ...v, loading: false }));
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Divider />
                </React.Fragment>
              );
            })}
            {(function () {
              if (data.category === 'family') {
                if (adding.ingredients === false) {
                  return (
                    <Button color="inherit" fullWidth onClick={() => setAdding((v) => ({ ...v, ingredients: true }))}>
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
                        <Typography sx={{ ml: 1.6 }} variant="body2">{`추가하기`}</Typography>
                      </Box>
                    </Button>
                  );
                }

                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Autocomplete
                      disablePortal
                      options={options.ingredients}
                      getOptionDisabled={(option) => Boolean(data.ingredients.find((item) => item.id === option.id))}
                      fullWidth
                      renderInput={(params) => <TextField {...params} label="식품 원재료" size="small" />}
                      sx={{ p: 2, pr: 0 }}
                      onChange={(e, newValue) => setNewname((v) => ({ ...v, ingredients: newValue }))}
                      value={newName.ingredients.label}
                    />
                    <Button
                      sx={{ height: 40 }}
                      onClick={async () => {
                        if (!newName.ingredients.label) return;

                        try {
                          setGlobal((v) => ({ ...v, loading: true }));
                          const res = await postElement(data.id, 'ingredient', {
                            profileElementType: 'ingredient',
                            id: newName.ingredients.id,
                          });

                          if (res.status >= 400) {
                            toast.error(res.data.message);
                          } else if (String(res.status)[0] === '2') {
                            toast('추가되었어요.');
                            setNewname((v) => ({ ...v, ingredients: { label: null, id: null } }));
                            refreshList(data.id);
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
                    <Button sx={{ height: 40, mr: 2 }} onClick={() => setAdding((v) => ({ ...v, ingredients: false }))}>
                      <ClearIcon />
                    </Button>
                  </Box>
                );
              }
            })()}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ProfileView;
