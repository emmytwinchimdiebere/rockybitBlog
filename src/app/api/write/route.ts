import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/PrimaClient";

export async function POST(request: NextRequest) {
  try {
    // Destructure the incoming request body
    const { imageUrl, content, slug, category, tags, title, authorId , summary} = await request.json();

    // Create the post using Prisma ORM
    const post = await prisma?.post.create({
      data: {
        imageUrl,
        content,
        title,
        slug,
        summary,
        author: {
          connect: { id: authorId }, // Connect the post to an existing author (User)
        },
        category: {
          connectOrCreate: {
            where: { name: category }, // Assuming category name is unique
            create: { name: category }, // Create category if it doesn't exist
          },
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    // Return a success response if post is created
    return NextResponse.json({
      msg: "You just made a post",
      status: "ok",
      post: post,
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    // Return an error response in case of failure
    return NextResponse.json(
      {
        msg: "Internal server error",
        status: "failed",
        error: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    // Corrected this line to ensure the function is invoked
    await prisma?.$disconnect();
  }
}
