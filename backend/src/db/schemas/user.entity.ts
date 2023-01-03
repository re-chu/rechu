import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm";
import { Connect } from "./connect.entity";
import { Resume } from "./resume.entity";
import { Board } from "./board.entity";
import { Comment } from "./comment.entity";
import { CommentLikeMaping } from "./commentLikeMaping.entity";
import { BoardLikeMaping } from "./boardLikeMaping.entity";
import { PointFromComment } from "./point-comment.schema";
import { PointFromBoard } from "./point-board.schema";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  created: Date;
  avatarUrl: string;
  point: number;
  role?: string;
  password?: string;
  ban?: number;
  howToLogin?: string;
  active: number;
  matching: number;
  chance: number;
};

export enum sosialEnum {
  local = "local",
  sosial = "sosial",
}
enum roleEnum {
  user = "user",
  admin = "admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: false })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, default: null })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    default: "https://url.kr/7h42va",
  })
  avatarUrl: string;

  @Column({ type: "enum", enum: sosialEnum, default: sosialEnum.local })
  howToLogin: string;

  @Column({ type: "enum", enum: roleEnum, default: roleEnum.user })
  role: roleEnum;

  @Column({ nullable: true, default: null })
  RT: string;

  @Column({ nullable: true, default: null })
  gitHubUrl: string;

  @Column({ default: 0 })
  point: number;

  @Column({ default: 0 })
  clickedLikes: number;

  @Column({ default: 0 })
  reported: number;

  @Column({ default: 0 })
  corrections: number;

  @Column({ default: 3 })
  chance: number;

  @Column({ default: false })
  working: boolean;

  @Column({ default: false })
  matching: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: "datetime", default: null, nullable: true })
  updated: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  news: boolean;

  @Column({ type: "bigint", default: 0, nullable: true })
  ban: number;

  @OneToMany((type) => Resume, (resume) => resume.usedUser, { nullable: true })
  resumes: Resume[];

  @OneToMany((type) => PointFromBoard, (point) => point.user)
  getPointFromBoard: PointFromBoard[];

  @OneToMany((type) => PointFromComment, (point) => point.user)
  getPointFromComment: PointFromComment[];

  @OneToMany((type) => Board, (board) => board.fromUser, { nullable: true })
  notices: Board[]; // 작성한 게시글

  @OneToMany((type) => BoardLikeMaping, (board) => board.user, {
    nullable: true,
  })
  likesBoard: BoardLikeMaping[]; // 좋아하는 게시글 맵핑

  @OneToMany((type) => CommentLikeMaping, (comment) => comment.user)
  likesResume: CommentLikeMaping[]; //  좋아하는 이력서 맵핑

  @OneToMany((type) => Comment, (comment) => comment.user, { nullable: true })
  writeComments: Comment[];

  @OneToMany((type) => Connect, (connect) => connect.mento, { nullable: true })
  asMento: Connect[];

  // @OneToMany((type) => Connect, (connect) => connect.mentee, { nullable: true })
  // asMentee: Connect[];
}
