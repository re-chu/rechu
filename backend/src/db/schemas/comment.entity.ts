import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Board } from "./board.entity";
import { CommentLikeMaping } from "./commentLikeMaping.entity";
import { PointFromComment } from "./point-comment.schema";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: false })
  fixed: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: "datetime", default: null, nullable: true })
  updated: Date;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  alreadyLikes: number;

  @Column({ default: 1 })
  active: number;

  @Column({ default: false })
  checkout: boolean;

  @OneToMany((type) => CommentLikeMaping, (table) => table.comment)
  ownLikes: CommentLikeMaping;

  @OneToMany((type) => PointFromComment, (point) => point.comment)
  getPoint: PointFromComment;

  @ManyToOne((type) => User, (user) => user.writeComments)
  user: User[];

  @ManyToOne((type) => Board, (board) => board.ownComments)
  board: Board[];
}

export type AlreadyLikesComments = {
  push(comment: AlreadyLikesComments): unknown;
  alreadyLikes: boolean;
  commentId: number;
  username: string;
  avatarUrl: string;
  text: string;
  commentCreated: Date;
  likes: number;
  fromUserId: number;
  fixed: boolean;
};
