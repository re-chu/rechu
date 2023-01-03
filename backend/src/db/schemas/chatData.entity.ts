import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { ChatRoomTable } from "./chatRoom.entity";
import { User } from "./user.entity";

@Entity()
export class ChatDataTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sendFrom: number;

  @Column({ unique: true })
  mentoId: number;

  @Column()
  msg: string;

  @Column({ type: "bigint" })
  created: number;

  @ManyToOne((type) => ChatRoomTable, (room) => room.ownDatas)
  fromRoom: ChatRoomTable;
}
