import bcrypt from 'bcrypt';
import { User } from "../entity/User";
import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";

@InputType()
class CreateUserInput {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users() {
        return User.find()
    }

    //get snippet by id
    @Query(() => User)
    user(@Arg("id") id: Number) {
        return User.findOne({
            where: { id }
        });
    }

    //create a snippet
    @Mutation(() => User)
    async createUser(@Arg("data") data: CreateUserInput) {
        data.password = bcrypt.hashSync(data.password, 10);
        const snippet = User.create(data);
        await snippet.save();
        return snippet;
    }
}