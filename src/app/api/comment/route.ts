"use server"
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'



export async function POST(request: NextRequest) {
  // Check if the user is authenticated
  const  supabase =  await createClient()
  const  {data,  error}  = await  supabase.auth.getUser()


  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Parse the request body
    const body = await request.json()
    const { content, postId, parentId } = body

    // Validate the input
    if (!content || !postId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create the new comment
    const newComment = await prisma?.comment?.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: data?.user?.id,
        parentId:parentId  ?  parseInt(parentId) : null
      },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            email: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    })

    // Return the newly created comment
    return NextResponse.json({
      message: 'Comment created successfully',
      comment: {
        newComment,
        likes: 0,
        dislikes: 0,
        children: [],
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }finally{
    await  prisma?.$disconnect()
  }
}
