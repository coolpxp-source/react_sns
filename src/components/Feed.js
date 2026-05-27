import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import {
  Grid2,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';


function Feed() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [feeds, setFeeds] = useState([]); // 가져온 userid의 feed를 화면에 뿌리기

  const handleClickOpen = (feed) => {
    setSelectedFeed(feed);
    setOpen(true);
    setComments([
      { id: 'user1', text: '멋진 사진이에요!' },
      { id: 'user2', text: '이 장소에 가보고 싶네요!' },
      { id: 'user3', text: '아름다운 풍경이네요!' },
    ]); // 샘플 댓글 추가
    setNewComment(''); // 댓글 입력 초기화
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]); // 모달 닫을 때 댓글 초기화
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: 'currentUser', text: newComment }]); // 댓글 작성자 아이디 추가
      setNewComment('');
    }
  };

  function handleGetFeed(){
    // 현재 로그인한 사용자의 피드목록 가져오기
    const token = localStorage.getItem("token"); // 로그인한 사용자의 정보가 localstorage 안 token안에 담겨있다.
    if(token){
      const decoded = jwtDecode(token);
      console.log(decoded.userId);
      fetch("http://localhost:3010/feed/" + decoded.userId, {  // ← ) 를 맨 뒤로
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("data ==> ", data);
        console.log(data.list[0]);
        setFeeds(data.list);
      })
      .catch(err => {
        alert("서버 오류 발생.");
      });
    }else{
      alert("로그인 후 이용하세요.");
      navigate("/");
    }
  }
  useEffect(()=>{ // 화면에 들어오자마자 실행되도록 : mounted랑 같다.
    handleGetFeed();
  },[])

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">SNS</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <Grid2 container spacing={3}>
          {feeds.map((feed) => (
            <Grid2 key={feed.ID} size={{ xs: 12, sm: 6, md: 4 }}>  {/* ← size로 변경 */}
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={feed.IMGPATH}
                  alt='이미지 없음'
                  onClick={() => handleClickOpen(feed)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {feed.TITLE}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg"> {/* 모달 크기 조정 */}
        <DialogTitle>
          {selectedFeed?.CONTENT} 
          {/* 삼항연산자 */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{selectedFeed?.CONTENT}</Typography>
            {selectedFeed?.IMGPATH && (
              <img
                src={selectedFeed.IMGPATH}
                alt={selectedFeed.TITLE}
                style={{ width: '100%', marginTop: '10px' }}
              />
            )}
          </Box>

          <Box sx={{ width: '300px', marginLeft: '20px' }}>
            <Typography variant="h6">댓글</Typography>
            <List>
              {comments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{comment.id.charAt(0).toUpperCase()}</Avatar> {/* 아이디의 첫 글자를 아바타로 표시 */}
                  </ListItemAvatar>
                  <ListItemText primary={comment.text} secondary={comment.id} /> {/* 아이디 표시 */}
                </ListItem>
              ))}
            </List>
            <TextField
              label="댓글을 입력하세요"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}           
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ marginTop: 1 }}
            >
              댓글 추가
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={()=>{
            fetch("http://localhost:3010/feed/" + selectedFeed.ID,{
              method : "DELETE", // default로 GET
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => {
              alert(data.message);
              console.log(data);
              handleClose();
              handleGetFeed();
            })
            .catch(err =>{
              console.log("서버 에러");
            })
          }} color="error">
            삭제
          </Button>
        </DialogActions>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;