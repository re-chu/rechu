# 리츄 :: 이력서 첨삭 커뮤니티

<br />

<img src="https://user-images.githubusercontent.com/102174146/210300986-b734680d-2ada-4778-957b-bb30be7fa103.png" width="1048" />
## 0. 버전

### 1.0.0 : 최초 배포 22.12.30

## 1. 프로젝트 소개

#### 이력서 작성 후 공유하여 토론하거나 첨삭 받을 수 있는 커뮤니티

1. 이력서 작성 포맷을 제공합니다.
2. 커뮤니티에 이력서를 공유하여 토론할 수 있습니다.
3. 포인트 소모하여 원하는 유저에게 첨삭 요청을 할 수 있습니다.

<br />

### 1-1. 데모

### [리츄 바로가기](https://rechu.jinytree.shop/)

</br>

#### 관리자 계정 테스트

| 이메일   | admin@admin.com |
| -------- | --------------- |
| 비밀번호 | 123123          |

<br />

### 1-2. API 문서

### https://url.kr/t5emvn

<br>

### 1-3. 와이어프레임

### https://

<br>

## 2. 기술 스택

### 2-1 Backend

<img src="https://user-images.githubusercontent.com/102174146/210304653-97f6eaac-d017-4e13-ba2f-3b46632c134b.png" width="640" />

### 2-2 Frontend

<img src="https://user-images.githubusercontent.com/102174146/210304650-3c59236d-1d0e-4cd6-a66b-1bacdae01544.png" width="640" />

### 2-3 Infra Structure

<img src="https://user-images.githubusercontent.com/102174146/210772522-a4525b0e-751a-4935-8dfa-b7740f4ffd1a.png" width="640">
<br>

| 포지션   | 스택                             |
| -------- | -------------------------------- |
| language | TypeScript                       |
| FE       | React, Redux                     |
| BE       | Node, TypeScript, Express, mySQL |
| Deploy   | PM2, NGINX                       |

### BE

<img src="https://user-images.githubusercontent.com/102174146/210304653-97f6eaac-d017-4e13-ba2f-3b46632c134b.png" width="640" />

### FE

<img src="https://user-images.githubusercontent.com/102174146/210304650-3c59236d-1d0e-4cd6-a66b-1bacdae01544.png" width="640" />

<br>

| 포지션   | 스택                             |
| -------- | -------------------------------- |
| language | TypeScript                       |
| FE       | React, Redux                     |
| BE       | Node, TypeScript, Express, mySQL |
| Deploy   | PM2, NGINX                       |

<br>

## 3. 페이지별 UI 및 기능 설명

<details><summary>로그인 / 회원가입 페이지</summary>

|                                                                                                                  |
| :--------------------------------------------------------------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/102174146/210304895-fc9e2a8a-fc20-435f-a783-a12c13e4e61c.png) |
|                                                      로그인                                                      |
| ![image](https://user-images.githubusercontent.com/102174146/210304899-385a64ff-62b7-4d2d-ab69-10844d64dc7d.png) |
|                                                     회원가입                                                     |

</details>

<details><summary>메인 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/210304981-69ecdb4b-da81-4157-8054-8a45b7ef06a5.png)

</details>
<details><summary>커뮤니티 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/210304984-0dffa937-3052-42ce-891d-c92535545549.png)

</details>
<details><summary>사진 2개 이상</summary>

|                    |
| :----------------: |
| ![image](https://) |
|     홈페이지 ⓵     |
| ![image](https://) |
|     홈페이지 ⓶     |

</details>

<br />

## 4. 디렉토리 구조

```bash
 |    .gitignore
 |    README.md
 |
 └ backend
 |   |   .env
 |   |   nodemon.json
 |   |   package.json
 |   |   tsconfig.json
 |   |
 |   └ src
 |       |    config
 |       |    db
 |       |    middlewares
 |       |    routes
 |       |    services
 |       |    index.ts
 |       └    server.ts
 |
 └ frontend
     |   .env
     |   package.json
     |   tsconfig.json
     |
     └ src
         |       App.tsx
         |       index.tsx
         |       Router.tsx
         |       package.json
         |       tsconfig.json
         |
         └ assets/images
         └ components
         |       Admin
         |       Layout
         |       Resume
         |       User
         |
         └ context
         |       FormSlice.tsx
         |       store.tsx
         |
         └ models
         |       resume-model.tsx
         |       resumeEdit-model.tsx
         └ pages
         |       Admin
         |       Comunity
         |       ...
         |       ResumeEdit
         |       ResumeList
         |
         └ styles
         |       GlobalStyle.tsx
         |       theme.tsx
         |       theme.d.tsx
         └ utils
                 api.ts
                 format.ts
```

<br />

## 5. 제작자

| 이름         | 포지션 | 담당 업무                                                                                                                                |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 이진희(팀장) | BE     | -API 제작 [게시물, 회원, 댓글] </br> - 배포                                                                                              |
| 김현아       | BE     | SQL 가이드, API 제작 [이력서, 프로젝트, 커리어, 관리자]                                                                                  |
| 이다노       | FE     | - 이력서 작성 및 수정 페이지 구현 </br> - 디자인 관련 전역 세팅 </br> 헤더 유저 role에 따른 업데이트 구현                                                                           |
| 양성수       | FE     | 마이페이지,이력서 작성 리스트 페이지 구현                                                                                                |
| 허지윤       | FE     | - 로그인 , 회원가입 , 비밀번호찾기, 소셜 로그인 </br> - 이력서 상세페이지 </br> - 관리자 페이지 구현</br> - 이력서 첨삭 매칭 페이지 구현 |
| 김진영       | FE     | 게시물 작성 및 상세 페이지, 게시물 리스트 페이지 구현                                                                                    |

<br />
