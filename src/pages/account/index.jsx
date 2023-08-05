import { Avatar, Box, Card, CardContent, Container, Typography } from '@mui/material';
import React from 'react';

const Account = () => {
  return (
    <Box sx={{ m: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar />
            <Box sx={{ ml: 2 }}>
              <Typography fontWeight="bold">내 이름</Typography>
              <Typography variant="body2">프로필 수정</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Account;
