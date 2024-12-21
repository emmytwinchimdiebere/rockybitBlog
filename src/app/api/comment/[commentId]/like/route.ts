import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {

   const  supabase = await  createClient();
   const  {data:user, error} = await  supabase.auth.getUser()

  if (!user || error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const commentId = parseInt(params.commentId)
  const { action , postId} = await request.json() // 'like' or 'dislike'

  try {
    const existingEngagement = await prisma?.engagement.findFirst({
      where: {
        commentId: commentId,
        userId: user?.user?.id,
        type: { in: ['LIKE', 'DISLIKE'] }
      }
    })

    let updatedComment

    if (existingEngagement) {
      if (
        (existingEngagement.type === 'LIKE' && action === 'like') ||
        (existingEngagement.type === 'DISLIKE' && action === 'dislike')
      ) {
        // Remove the engagement if the user clicks the same action again
        await prisma?.engagement.delete({
          where: { id: existingEngagement.id }
        })
        updatedComment = await prisma?.comment.update({
          where: { id: commentId },
          data: {
            [action === 'like' ? 'likes' : 'dislikes']: { decrement: 1 }
          }
        })
      } else {
        // Change the engagement type
        await prisma?.engagement.update({
          where: { id: existingEngagement.id },
          data: { type: action === 'like' ? 'LIKE' : 'DISLIKE' }
        })
        updatedComment = await prisma?.comment.update({
          where: { id: commentId },
          data: {
            likes: { [action === 'like' ? 'increment' : 'decrement']: 1 },
            dislikes: { [action === 'like' ? 'decrement' : 'increment']: 1 }
          }
        })
      }
    } else {
      // Create a new engagement
      await prisma?.engagement.create({
        data: {
          type: action === 'like' ? 'LIKE' : 'DISLIKE',
          commentId: commentId,
          userId: user?.user?.id,
       
        }
      })
      updatedComment = await prisma?.comment.update({
        where: { id: commentId },
        data: {
          [action === 'like' ? 'likes' : 'dislikes']: { increment: 1 }
        }
      })
    }

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error('Error updating comment like/dislike:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

