import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { ChatDataTable } from "./chatData.entity";
import { Connect } from "./connect.entity";
import { User } from "./user.entity";

@Entity()
export class ChatRoomTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  menteeId: number;

  @Column()
  mentoId: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ default: "매칭이 성사되었습니다! 채팅을 시작하세요." })
  lastText: string;

  @ManyToOne((type) => Connect, (connect) => connect.hasOwnRooms)
  fromConnect: Connect;

  @OneToMany((type) => ChatDataTable, (data) => data.fromRoom)
  ownDatas: ChatDataTable[];
}
