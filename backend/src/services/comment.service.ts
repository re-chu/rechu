import * as commentRepo from "../db/comment.repo";
import * as userRepo from "../db/user.repo";

// 확인
export const commentLikes = async (userId: number, commentId: number, likesStatus: boolean): Promise<boolean> => {
  const data = {
    userId,
    commentId,
  };
  try {
    // 댓글에 좋아요 여부
    const alreadyLikes = await commentRepo.alreadyLikesComment(commentId, userId);
    console.log("alreadyLikeszzz : ", alreadyLikes);

    // 좋아요 하지 않은 댓글이라면 좋아요 및 포인트 습득
    if (!likesStatus && !alreadyLikes) {
      await commentRepo.likeCommentFromUser(data);
      // 아래 변수명에 포인트 적립여부가 담겨있음
      const alreadySavePoint = await commentRepo.findSavedPointByComment(userId, commentId);
      console.log("포인트받음?", alreadySavePoint);

      //어뷰징 막기위해
      const commentInfo = await commentRepo.findComment(data.commentId);
      // 첫번째 좋아요라 포인트적립이 되지 않았을 경우 적립
      if (!alreadySavePoint && userId !== commentInfo.userId) {
        console.log("첫번째 좋아요! 포인트 적립!");
        await commentRepo.savePointByComment(data);
      }
      return true; // 좋아요
    } else {
      console.log("좋아요 취소 끝.");
      await commentRepo.unlikeCommentFromUser(userId, commentId);
      return false; // 취소
    }
  } catch (err) {
    throw Error(err);
  }
};

export const addComment = async (data: { userId: number; boardId: number; text: string }) => {
  try {
    const result = await commentRepo.addCommentQ(data);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(`500, 서버오류`);
  }
};

export const deleteComment = async (userId: number, boardId: number, commentId: number) => {
  try {
    const isComment = await commentRepo.findComment(commentId);
    // if (isComment === false) throw new Error(`404`);

    const result = await commentRepo.deleteCommentQ(userId, boardId, commentId);
    return result;
  } catch (err) {
    if (err.message === `404`) throw new Error(`404, 댓글을 찾을 수 없습니다.`);
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};

export const updateComment = async (userId: number, commentId: number, data: { text: string }) => {
  // 해당 댓글이 토큰주인의 것인지 판단
  try {
    const user = await userRepo.findOneUser(userId);
    const update = await commentRepo.updateCommentQ(commentId, data);
    return update;
  } catch (err) {
    throw new Error(`500, 서버 오류`);
  }
};

export const moreCommentsPagenation = async (
  firstRequest: number,
  boardId: number,
  userId: number,
  count: number,
  mark: string
) => {
  try {
    if (firstRequest === 1) {
      const comments = await commentRepo.firstGetComments(boardId, userId, count);
      return comments;
    }
    const comments = await commentRepo.moreCommentsPagenationQ(boardId, userId, count, mark);
    return comments;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};
