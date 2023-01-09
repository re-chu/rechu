import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BoardLikeMaping } from "./boardLikeMaping.entity";
import { Comment } from "./comment.entity";
import { PointFromBoard } from "./point-board.schema";
import { Resume } from "./resume.entity";
import { User } from "./user.entity";

export type BoardInfo = {
  id: number;
  title: string;
  content: string;
  hashTags: string;
  boardCreated: Date;
  hasResumeId: number;
  fixed: boolean;
  ownUserId: number;
  email: string;
  avatarUrl: string;
  likeCnt: number;
  commentCnt: number;
  active: number;
  username: string;
};
export type CreateBoardInFo = {
  fieldCount: null | number;
  affectedRows: null | number;
  insertId: null | number;
  info: null | string;
  serverStatus: null | number;
  warningStatus: null | number;
};
@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "varchar", length: 10000, default: "빈값방지" })
  content: string;

  @Column({ default: false })
  fixed: boolean;

  @Column({ default: 0 })
  likeCnt: number;

  @Column({ default: 0 })
  commentCnt: number;

  @Column({ default: null, nullable: true })
  complate: boolean;

  @Column({ default: 1 })
  active: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;
  @Column({ type: "datetime", default: null, nullable: true })
  updated: Date;

  @OneToMany((type) => PointFromBoard, (point) => point.board)
  getPoint: PointFromBoard[];

  @OneToMany((type) => BoardLikeMaping, (board) => board.board) // 좋아하고있는 유저들
  likesBoard: BoardLikeMaping[];

  @OneToMany((type) => Comment, (comment) => comment.board) // 좋아하고있는 유저들
  ownComments: Comment[];

  @ManyToOne((type) => User, (user) => user.notices) // 누구의 게시물
  fromUser: User[];

  @ManyToOne((type) => Resume, (resume) => resume.usedBoards, { nullable: true }) // 좋아하고있는 유저들
  hasResume: Resume | null;
}
