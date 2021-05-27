import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BaseEntity } from "typeorm";
import { Comment } from './Comment';
import { Users } from "./User";
@Entity()
@ObjectType()
export class Snippet extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    // @Field(() => ID)
    @ManyToOne(() => Users, users=>users.snippets)
    user: Users;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column()
    description: string;

    @Field(() => String)
    @Column()
    snippet: string;

    @Field(() => [Comment])
    @OneToMany(() => Comment, comment => comment.snippet, {cascade: true})
    comments: Comment[];
}
