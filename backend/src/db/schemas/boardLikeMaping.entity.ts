import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Board } from "./board.entity";
import { User } from "./user.entity";
@Entity()
export class BoardLikeMaping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  checkout: boolean;

  @ManyToOne((type) => User, (user) => user.likesResume)
  user: User;

  @ManyToOne((type) => Board, (board) => board.likesBoard)
  board: Board;
}
