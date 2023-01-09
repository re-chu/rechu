import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { ChatRoomTable } from "./chatRoom.entity";
import { User } from "./user.entity";

@Entity()
export class ChatDataTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sendFrom: number;

  // @Column({ unique: true })
  // mentoId: number;

  @Column({ type: "varchar", length: 1000 })
  text: string;

  @Column({ default: 0 })
  checkout: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @ManyToOne((type) => ChatRoomTable, (room) => room.ownDatas)
  fromRoom: ChatRoomTable;
}
