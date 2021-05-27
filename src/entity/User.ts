import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Comment } from "./Comment";
import { Snippet } from "./Snippet";

@Entity()
@ObjectType()
export class Users extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => [Comment])
  @OneToMany(() => Comment, comment => comment.id)
  comments: Comment[];

  @Field(() => [Snippet])
  @OneToMany(() => Snippet, snippet => snippet.user, {cascade: true})
  snippets: Snippet[];

  @Field(() => String)
  accessToken: string;
}