import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
  const requestUrl = new URL(request?.url)
  const postId = requestUrl?.searchParams.get("postId")

  const  supabase =  await createClient()
  const  {data:user,  error}  = await  supabase.auth.getUser()
  const  userId =  user?.user?.id;

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }



  try {
    const comments = await prisma?.comment.findMany({
      where: {
        postId: parseInt(postId),
        parentId: null, // Fetch only top-level comments
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
        children: {
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
            children: {
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
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!comments) {
      return NextResponse.json({ comments: [] })
    }

    // Fetch engagements for all comments (including replies)
    const allCommentIds = comments.flatMap(comment => [
      comment.id,
      ...(comment.children?.map(child => child.id) || []),
      ...(comment.children?.flatMap(child => child.children?.map(grandchild => grandchild.id) || []) || [])
    ])

    const engagements = await prisma?.engagement.findMany({
      where: {
        commentId: { in: allCommentIds },
      },
    })

    // Helper function to transform a comment and its replies
    const transformComment = (comment: any, depth = 0): any => {
      if (!comment) return null;

      const commentEngagements = engagements!.filter(e => e.commentId === comment.id)
      const likes = commentEngagements.filter(e => e.type === 'LIKE').length
      const dislikes = commentEngagements.filter(e => e.type === 'DISLIKE').length
      const userEngagement = userId ? commentEngagements.find(e => e.userId === userId) : null

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: comment.author?.id,
          first_name: comment.author?.first_name,
          email: comment.author?.email,
          profile: comment.author?.profile,
        },
        likes,
        dislikes,
        userLiked: userEngagement?.type === 'LIKE',
        userDisliked: userEngagement?.type === 'DISLIKE',
        children: comment.children?.map((child: any) => transformComment(child, depth + 1)).filter(Boolean) || [],
      }
    }

    // Transform all top-level comments
    const transformedComments = comments.map(comment => transformComment(comment)).filter(Boolean)

    return NextResponse.json({ comments: transformedComments })
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments', errMsg: error?.message }, { status: 500 })
  }
}

