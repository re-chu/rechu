import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Resume } from "./resume.entity";
import { Skill } from "./skill.entity";
import { Stack } from "./stacks.entity";
import { User } from "./user.entity";
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  projectName: string;

  @Column({ nullable: false })
  year: string;

  @Column({ nullable: true })
  information: string;

  @Column({ nullable: true })
  link1: string;

  @Column({ nullable: true })
  link2: string;

  @OneToMany((type) => Stack, (stack) => stack.project)
  skills: Stack[];

  @ManyToOne((type) => Resume, (resume) => resume.projects)
  usedResume: Resume;
}

export type TypeProject = {
  id: number;
  projectName: string;
  year: string;
  information: string;
  link1?: string;
  link2?: string;
  usedResumeId: number;
};
