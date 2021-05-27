import { Snippet } from '../entity/Snippet';
import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";
import { Users } from '../entity/User';

@InputType()
class CreateSnippetInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    snippet: string;

    @Field()
    userId: number;
}

@InputType()
class UpdateSnippetInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    snippet: string
}

@Resolver()
export class SnippetResolver {
    //get all snippets
    @Query(() => [Snippet])
    snippets() {
        return Snippet.find({
           relations: ["user", "comments"] 
        })
    }

    @Query(() => [Snippet])
    async snippetsByKeyword(@Arg("keyword") keyword: string) {
        let snippets = await Snippet.find({
            relations: ["user", "comments"]
        });
        let output = []
        //do a search
        for (let snippet of snippets) {
            console.log(snippet)
            if(snippet.title.includes(keyword) || snippet.description.includes(keyword) || snippet.description.includes(keyword)) {
                output.push(snippet);
            }
        }
        return output;
    }

    //get snippets for a particular user
    @Query(() => [Snippet])
    snippetsForUser(@Arg("userId") userId: Number) {
        console.log(userId);
        return Snippet.find({
            where: {
                userId: userId
            },
            relations: ["user", "comments"]
        })
    }

    //get snippet by id
    @Query(() => Snippet)
    snippet(@Arg("id") id: Number) {
        return Snippet.findOne({
            where: { id },
            relations: ["user", "comments"]
        })
    }

    //create a snippet
    @Mutation(() => Snippet, {nullable: true})
    async createSnippet(@Arg("data") data: CreateSnippetInput) {
        // const snippet = Snippet.create(data);
        // let relatedUser = await Users.findOne({
        //     where: {
        //         id: data['userId']
        //     }
        // });
        // if(!relatedUser) {
        //     return null;
        // } else {
        //     await snippet.save();
        //     relatedUser.snippets.push(snippet);
        //     await relatedUser.save();
        // }
        // return snippet;
        const snippet = new Snippet();
        snippet.title = data.title;
        snippet.description = data.description;
        snippet.snippet = data.snippet;
        // await snippet.save();
        let relatedUser = await Users.findOne({
            where: {
                id: data.userId
            }
        })
        if(!relatedUser) {
            throw Error('Foreign Key Violation');
        } else {
            snippet.user = relatedUser;
        }
        await snippet.save();
        return snippet;
    }

    //update snippet
    @Mutation(() => Snippet)
    async updateSnippet(@Arg("id") id: Number, @Arg("data") data: UpdateSnippetInput) {
        const snippet = await Snippet.findOne({ where: { id } });
        if(!snippet) throw new Error("Snippet not found!");
        Object.assign(snippet, data);
        await snippet.save();
        return snippet;
    }

    //delete snippet
    @Mutation(() => Boolean)
    async deleteSnippet(@Arg("id") id: Number) {
        const snippet = await Snippet.findOne({ where: { id } });
        if(!snippet) throw new Error("Book not found!")
        await snippet.remove();
        return true;
    }
}