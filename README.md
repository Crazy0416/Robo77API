# Robo77 API 서버

## 설명

Robo77 API 서버

json 통신



## API 설명

### 1. 방 생성

클라이언트(딜러가 됌)가 방을 생성하도록 서버에 요청

- **요청(Request)**

**route**: /room

**method**: POST

**Header**:

- content-type: applicatoin/json

**body**: X



- **응답(Response)**

**Header**: X

**body**:

| 이름    | 설명          | 타입    | 비고                                 |
| ------- | ------------- | ------- | ------------------------------------ |
| roomId  | 방 아이디     | Number  | 클라이언트에 저장 필수(실패 시 없음) |
| success | 성공 여부     | Boolean |                                      |
| message | 서버의 메세지 | String  |                                      |



### 2. 방 입장하기

유저가 방에 입장하기

- **요청(Request)**

**Route**: /room/:roomId

**method**: POST

**Header**:

content-type: applicatoin/json

**Body**: X

※ 방 번호는 1번으로 픽스(임시)



- **응답(Response)**

**Header**: X

**Body**:

| 이름    | 설명              | 타입    | 비고                                      |
| ------- | ----------------- | ------- | ----------------------------------------- |
| success | 방 입장 성공 여부 | Boolean | 성공하면 클라이언트가 소켓 연결 바로 요청 |
| roomId  | 방 아이디         | String  | 실패시 없음                               |

success가 false면 방이 없다는 소리