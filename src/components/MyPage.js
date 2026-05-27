import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Avatar, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({}); // 유저 정보 (팔로워, 소개 등)
  const [feeds, setFeeds] = useState([]); // 가져온 userid의 feed를 화면에 뿌리기

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      const decoded = jwtDecode(token);
      fetch("http://localhost:3010/myPage/" + decoded.userId, { 
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("data ==> ", data);
        setUserInfo(data.info[0]);  // 유저 정보
        setFeeds(data.list);     // 피드 목록
      })
      .catch(err => {
        alert("서버 오류 발생.");
      });
    } else {
      alert("로그인 후 이용하세요.");
      navigate("/");
    }
  }, []);

  
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        sx={{ padding: '20px' }}
      >
        <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px', width: '100%' }}>
          {/* 프로필 정보 상단 배치 */}
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" // 프로필 이미지 경로
              sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <Typography variant="h5">{userInfo?.USERNAME}</Typography>
            <Typography variant="body2" color="text.secondary">
              @{userInfo?.USERID}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">팔로워</Typography>
              <Typography variant="body1">{userInfo?.FOLLOWER}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">팔로잉</Typography>
              <Typography variant="body1">{userInfo?.FOLLOWING}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">게시물</Typography>
              <Typography variant="body1">{userInfo?.FEED_COUNT}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6">내 소개</Typography>
            <Typography variant="body1">
              {userInfo?.INTRO}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default MyPage;