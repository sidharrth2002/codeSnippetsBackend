import { Snippet } from '../entity/Snippet';
import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";

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

    //get snippets for a particular user
    @Query(() => [Snippet])
    snippetsForUser(@Arg("userId") userId: Number) {
        console.log(userId);
        return Snippet.find({
            where: {
                userId: 100
            }
        })
    }

    //get snippet by id
    @Query(() => Snippet)
    snippet(@Arg("id") id: Number) {
        return Snippet.findOne({
            where: { id }
        });
    }

    //create a snippet
    @Mutation(() => Snippet)
    async createSnippet(@Arg("data") data: CreateSnippetInput) {
        const snippet = Snippet.create(data);
        await snippet.save();
        snippet.user = data['userId'];
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