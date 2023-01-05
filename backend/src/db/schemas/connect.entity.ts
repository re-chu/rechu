import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { ChatRoomTable } from "./chatRoom.entity";
// import { Company } from "./company.entity";
import { User } from "./user.entity";
export enum stepEnum {
  receipt = "요청중",
  interview = "진행중",
  reward = "완료",
}
@Entity()
export class Connect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: stepEnum.receipt })
  step: stepEnum;

  @Column({ default: 0 })
  menteeId: number;

  @Column({ default: 0 })
  mentoComplate: number;

  @Column({ default: 0 })
  menteeComplate: number;

  @OneToMany((type) => ChatRoomTable, (room) => room.fromConnect)
  hasOwnRooms: ChatRoomTable[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @ManyToOne((type) => User, (user) => user.asMento)
  mento: User;
}

// 고인물에게 요청을하려면
// 1.
//
