import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'


export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {

    const  supabase  = await  createClient();
    const  {data:user ,  error} = await  supabase.auth.getUser()

  if (!user || error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const commentId = parseInt(params.commentId)

  try {
    const comment = await prisma?.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (comment.author.id !== user?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

     // First, delete all related engagements
     await prisma?.engagement.deleteMany({
        where: { commentId: commentId },
      })
  


    await prisma?.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}

