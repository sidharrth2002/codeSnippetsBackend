import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Snippet } from "./Snippet";
import { Users } from './User';

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  @ManyToOne(() => Users, user => user.id)
  user: number;

  @Field(() => ID)
  @ManyToOne(() => Snippet, snippet => snippet.comments)
  snippet: Snippet;

  @Field(() => String)
  @Column()
  body: string;
}