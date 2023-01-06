import { CreateCommentDto } from "../routes/dto";
import * as boardRepo from "../db/board.repo";
import { Board, CreateBoardInFo } from "../db/schemas";
import { jsonParse } from "../db/utils/parseToJSON";

export const getCommunityNotices = async (firstRequest: number, type: string, count: number, mark: string) => {
  try {
    // 첫조회
    if (firstRequest > 0) {
      const notices = await boardRepo.firstGetCommunityNoticesQ(type, count);
      return notices;
    }
    // 페이지네이션 요청일때
    const notices = await boardRepo.moreGetCommunityNoticesQ(type, count, mark);
    return notices;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버오류`);
  }
};

export const getResumeNotices = async (firstRequest: number, type: string, count: number, mark: string) => {
  try {
    console.log(count);
    // 첫조회
    if (firstRequest > 0) {
      console.log("이력서 게시글 첫 조회,", type);
      const notices = await boardRepo.firstGetResumeNoticesQ(type, count);
      return notices;
    }
    // 페이지네이션
    const notices = await boardRepo.moreGetResumeNoticesQ(type, count, mark);
    return notices;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};

export const getNoticeForMain = async (filter: string, perPage: number): Promise<Board[]> => {
  try {
    const notices = await boardRepo.findAllBoardForMainpage(filter, perPage);
    const result = jsonParse(notices);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(`500, 서버오륲`);
  }
};

// 하나의 게시물 정보를 가져옴
export const findOneBoard = async (id: number, userId: null | number) => {
  let ownThisNotice = false;
  console.log(userId);
  try {
    // 게시글이 존재하는지 확인후 없다면 에러
    const isNotice = await boardRepo.boardStatus(id, userId);
    // new Error 하니깐
    if (!isNotice) throw Error("404, 게시글을 찾을 수 없습니다.");

    // 게시글에 대한 정보 가공하는 로직 실행
    let notice = await boardRepo.findOneBoardQ(id, userId);
    // 자신이 게시글의 주인인 경우
    if (notice.boardInfo.ownUserId === userId && userId !== null) {
      ownThisNotice = true;
    }

    const result = { ownThisNotice, ...notice };
    return result;
  } catch (err) {
    if (err.message === "404, 게시글을 찾을 수 없습니다.") throw new Error(`404, 게시글을 찾을 수 없습니다.`);
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};

// 게시글 생성 서비스
export const postNotice = async (data: Record<string, string | boolean | number>): Promise<CreateBoardInFo> => {
  try {
    const newNotice = await boardRepo.create(data);
    return newNotice;
  } catch (err) {
    console.log(err);
    throw Error(`500, 서버 오류`);
  }
};

// 게시글 수정 서비스
export const updateNotice = async (boardId: number, userId: number, data: Record<string, string | number>) => {
  try {
    const isNotice = await boardRepo.boardStatus(boardId, userId);
    // new Error 하니깐
    if (!isNotice) throw new Error("404, 게시글을 찾을 수 없습니다.");
    const ownCheck = await boardRepo.findOneBoardQ(boardId);
    if (ownCheck.boardInfo.ownUserId !== userId) throw new Error(`400, 이건 당신의 게시물이 아니잖아!`);
    console.log("어디서");
    const update = await boardRepo.updateBoard(boardId, data);
    console.log("업데이트 내역 ", update);
    return;
  } catch (err) {
    console.log(err.message);
    throw new Error(err);
  }
};

// 게시글 삭제 서비스
export const deleteNotice = async (userId: number, boardId: number): Promise<boolean> => {
  try {
    // 게시물이 요청한 본인이 작성한 것인지 검증
    const boardData = await boardRepo.findBoardData(boardId);
    console.log(boardData);
    if (boardData.fromUserId !== userId) throw new Error(`400, 이 게시물에 대한 권한이 없습니다.`);

    // 게시글 삭제
    await boardRepo.deleteBoard(userId, boardId);
    return true;
  } catch (err) {
    console.log(err);
    throw new Error(`500, 서버오류`);
  }
};

// 게시글에 좋아요 누르기
export const addLikes = async (userId: number, boardId: number, likesStatus: boolean): Promise<boolean> => {
  const data = {
    userId,
    boardId,
  };
  try {
    const alreadyLikes = await boardRepo.alreadyLikesBoard(boardId, userId);
    console.log("alreadyLikes : ", alreadyLikes);
    // if (alreadyLikes && alreadyLikes.userId === userId) throw new Error(`400, 이미 좋아요를 누른 게시글 입니다.`);

    // 좋아요 상태와 DB에 저장된 값이 없다면 좋아요
    if (!likesStatus && !alreadyLikes) {
      console.log("좋아요상태 : false , 좋아요 로직");
      await boardRepo.likeBoardFromUser(data);

      const alreadySavePoint = await boardRepo.findSavedPointByBoard(userId, boardId);
      // 첫번째 좋아요라 포인트적립이 되지 않았을 경우 적립

      // 어뷰징 막기
      const boardInfo = await boardRepo.findOneBoardQ(boardId);
      if (!alreadySavePoint && boardInfo.boardInfo.ownUserId !== userId) {
        console.log("첫번째 좋아요! 포인트 적립!");
        await boardRepo.savePointByBoard(data);
      }
      return true; // 좋아요
    } else {
      console.log("좋아요상태 : ture , 좋아요 취소 로직");
      await boardRepo.unlikeBoardFromUser(userId, boardId);
      return false; // 취소
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const randomBoards = async (userId: number) => {
  try {
    const canShowBoard = await boardRepo.randomBoardsQ(userId);
    console.log(canShowBoard);
    return canShowBoard;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};

export const postComment = async (data: CreateCommentDto) => {};
