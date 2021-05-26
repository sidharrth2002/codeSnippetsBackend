import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Snippet } from "./Snippet";
import { User } from './User';

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  @ManyToOne(() => User, user => user.id)
  user: number;

  @Field(() => ID)
  @Column()
  @ManyToOne(() => Snippet, snippet => snippet.id)
  snippet: number;

  @Field(() => String)
  @Column()
  body: string;
}