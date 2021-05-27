import bcrypt from 'bcrypt';
import { Users } from "../entity/User";
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
    @Query(() => [Users])
    users() {
        return Users.find()
    }

    //get snippet by id
    @Query(() => Users)
    user(@Arg("id") id: Number) {
        return Users.findOne({
            where: { id }
        });
    }

    //create a snippet
    @Mutation(() => Users)
    async createUser(@Arg("data") data: CreateUserInput) {
        data.password = bcrypt.hashSync(data.password, 10);
        const snippet = Users.create(data);
        await snippet.save();
        return snippet;
    }
}