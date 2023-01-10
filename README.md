# 리츄 :: 이력서 첨삭 커뮤니티

<br />

<img src="https://user-images.githubusercontent.com/102174146/210300986-b734680d-2ada-4778-957b-bb30be7fa103.png" width="1048" />

## 0. 버전

### 1.0.0 : 최초 배포 22.12.30

### 1.1.0 : 채팅 및 알람기능 + UI 개선 22.01.10

## 1. 프로젝트 소개

[프로젝트 소개 페이지 바로가기](https://glamorous-vase-fb5.notion.site/SW-3-d182bc1b7e5647c399b44b21c2b159d5)

### 개발자 이력서 토론 플랫폼을 제공합니다.

1. 커뮤니티에 이력서를 첨부하여 다른 사람들과 토론할 수 있습니다.
2. 활동량에 따라 포인트를 지급하는 등 게이미피케이션적인 요소를 가미합니다.
3. 원하는 유저에게 이력서 첨삭을 요청 후 채팅을 통해 피드백을 받을 수 있습니다.

<br />

### 1-1. 데모

### [리츄 바로가기](https://rechu.jinytree.shop/)

</br>

#### 관리자 계정 테스트

| Type   | Email                | 비밀번호    |
| ------ | -------------------- | ----------- |
| 일반   | test-user1@rechu.com | testaccount |
| 일반   | test-user2@rechu.com | testaccount |
| 관리자 | admin@admin.com      | testaccount |

<br />

### 1-2. API 문서

### https://url.kr/t5emvn

<br>

### 1-3. 와이어프레임

### [와이어프레임 바로가기](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/47244fa2-a107-462e-b89e-331a05b13d16/%E1%84%85%E1%85%B5%E1%84%8E%E1%85%B2_%E1%84%8B%E1%85%AA%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A5%E1%84%91%E1%85%B3%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%B7.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230110%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230110T164935Z&X-Amz-Expires=86400&X-Amz-Signature=b8557ed3f855813289e272ca0a84509bd16611a330d08051223d4f0602739f7a&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22%25E1%2584%2585%25E1%2585%25B5%25E1%2584%258E%25E1%2585%25B2%2520%25E1%2584%258B%25E1%2585%25AA%25E1%2584%258B%25E1%2585%25B5%25E1%2584%258B%25E1%2585%25A5%25E1%2584%2591%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25A6%25E1%2584%258B%25E1%2585%25B5%25E1%2586%25B7.pdf%22&x-id=GetObject)

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

![image](https://user-images.githubusercontent.com/102174146/211615913-a92ce647-5a57-42be-86d0-a93823307aea.gif)

</details>
<details><summary>커뮤니티 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/211615894-0cd17812-5bc6-46f6-9b22-927a8b0e2fff.gif)

</details>

<details><summary>게시물 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/211616093-2dc991b5-7789-45a6-a260-f32982d50f59.gif)

</details>

<details><summary>이력서 관련 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/211615887-29a3b0d6-b5ef-482f-abe5-6aa0bcf52b21.gif)

</details>

<details><summary>알림 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/211615327-cd5371b1-43b1-477b-9874-53513adf46bf.gif)

</details>

<details><summary>마이 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/211615904-9bcab5e3-29cb-4b1c-a3b6-1f1bbe625c2f.gif)

</details>

<details><summary>관리자 페이지</summary>

![image](https://user-images.githubusercontent.com/102174146/211615176-08b34e77-9148-4af7-8b31-056f345b96c9.gif)

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
         └ store
         |     |
         |     |  config.ts
         |     └  slices
         |            authSlice.ts
         |            chatRoomSlice.ts
         |            chatSlice.ts
         |            formSlice.ts
         |            userSlice.ts
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

| 이름         | 포지션 | 담당 업무                                                                                                                                                                                                    |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 이진희(팀장) | BE     | 1. 회원,게시글,댓글,매칭,알림 CRUD</br> 2. 게시글/댓글 좋아요 API</br>3. 이미지파일 핸들링 API</br>4. MySQL 테이블 설계</br>5. 실시간 알림, 채팅 기능 구현                                                   |
| 김현아       | BE     | 1. 이력서 관련 API</br>(기본정보, 업무경험, 프로젝트, 스택)</br>2. 관리자 관련 API</br>3. MySQL 테이블 설계                                                                                                  |
| 이다노       | FE     | 1. 이력서 작성페이지, 헤더 반응형(웹, 태블릿) 퍼블리싱</br>2. 이력서 작성페이지 CRUD 구현</br>3. 정보 입력 폼 컴포넌트화 하여 props로 데이터 전달</br>4. Redux-toolkit 사용하여 컴포넌트 별로 내부 상태 관리 |
| 양성수       | FE     | 1. 마이페이지 구현</br>2. 이력서 작성 리스트 페이지 구현                                                                                                                                                     |
| 허지윤       | FE     | 1. 로그인 , 회원가입 , 비밀번호찾기, 소셜 로그인 기능 개발</br>2. 이력서 상세페이지 구현</br>3. 관리자 페이지 구현</br>4. 이력서 첨삭 매칭 페이지 구현                                                       |
| 김진영       | FE     | 1. 게시물 생성 및 조회 페이지 구현</br>2. 메인 페이지, 커뮤니티 페이지 구현</br>3. axios interceptor 및 redux 초기 설정</br>4. 실시간 알림, 채팅 기능 구현                                                   |

<br />
