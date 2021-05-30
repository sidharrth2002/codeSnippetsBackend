import { Snippet } from '../entity/Snippet';
import { Resolver, Query, Mutation, Arg, InputType, Field } from "type-graphql";
import { Users } from '../entity/User';
import { ID } from "type-graphql";
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

    @Query(() => ([Snippet]), { nullable: true })
    async snippetsByKeyword(@Arg("keyword") keyword: string) {
        let snippets = await Snippet.find({
            relations: ["user", "comments"]
        });
        let output = []
        if(keyword.length === 0) {
            return null;
        }
        //do a search
        console.log('Post search');
        console.log(snippets);
        for (let snippet of snippets) {
            console.log(snippet)
            if (    
                snippet.title.toLowerCase().includes(keyword.toLowerCase()) 
                || snippet.description.toLowerCase().includes(keyword.toLowerCase()) 
                || snippet.snippet.toLowerCase().includes(keyword.toLowerCase())
            ) {
                output.push(snippet);
            }
        }
        console.log(output);
        return output;
    }

    //get snippets for a particular user
    @Query(() => [Snippet])
    snippetsForUser(@Arg("userId", () => ID) userId: string) {
        console.log(userId);
        console.log('Getting all');
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
    async createSnippet(@Arg("title") title: string, @Arg("description") description: string, @Arg("snippet") snippet: string, @Arg("userId", () => ID) userId: string) {
        const newSnippet = new Snippet();
        newSnippet.title = title;
        newSnippet.description = description;
        newSnippet.snippet = snippet;
        newSnippet.comments = [];
        let relatedUser = await Users.findOne({
            where: {
                id: userId
            }
        })
        if(!relatedUser) {
            throw Error('Foreign Key Violation');
        } else {
            newSnippet.user = relatedUser;
        }
        await newSnippet.save();
        return newSnippet;    
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
    async deleteSnippet(@Arg("id", () => ID) id: Number) {
        console.log('Id to delete ' + id);
        const snippet = await Snippet.findOne({ where: { id } });
        if(!snippet) return false;
        await snippet.remove();
        return true;
    }
}