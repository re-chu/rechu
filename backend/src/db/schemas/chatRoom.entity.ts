import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { ChatDataTable } from "./chatData.entity";
import { Connect } from "./connect.entity";
import { User } from "./user.entity";

@Entity()
export class ChatRoomTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  menteeId: number;

  @Column({ unique: true })
  mentoId: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column()
  lastText: string;

  @Column()
  roomName: string;

  @ManyToOne((type) => Connect, (connect) => connect.hasOwnRooms)
  fromConnect: Connect;

  @OneToMany((type) => ChatDataTable, (data) => data.fromRoom)
  ownDatas: ChatDataTable[];
}
