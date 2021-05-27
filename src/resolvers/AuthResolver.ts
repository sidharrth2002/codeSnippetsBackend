import bcrypt from 'bcrypt';
import { Users } from '../entity/User';
import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { sign } from "jsonwebtoken";

// @InputType()
// class LoginInput {
//     @Field()
//     email: string;

//     @Field()
//     password: string;
// }

@InputType()
class RegisterInput {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@Resolver()
export class AuthResolver {
    @Mutation(() => Users, { nullable: true })
    async login(@Arg("email") email: string, @Arg("password") password: string) {
        const user = await Users.findOne({
            where: {
                email: email
            }
        }) as Users || null;
        if(!user) {
            return null;
        }
        const valid = await bcrypt.compare(password, user?.password);
        if(!valid) {
            return null;
        }
        const accessToken = sign({
            userId: user.id
        }, '123456789', {
            expiresIn: "10000000d"
        });
        user['accessToken'] = accessToken;
        await user.save();
        return user;
    }

    @Mutation(() => Users || null)
    async register(@Arg("data") data: RegisterInput) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const newUser = await Users.create(data);
        await newUser.save();
        const accessToken = sign({
            userId: newUser.id
        }, '123456789', {
            expiresIn: "10000000d"
        })
        newUser['accessToken'] = accessToken;
        await newUser.save();
        console.log(newUser);
        return newUser;
    }
}