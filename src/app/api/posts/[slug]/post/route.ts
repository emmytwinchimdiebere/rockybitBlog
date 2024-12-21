import { NextRequest, NextResponse } from 'next/server'


export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug

  try {
    const post = await prisma?.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            email: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
              },
            },
          },
        },
        category: true,
        engagements: true,
        comments: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Calculate engagement metrics
    const likes = post.engagements.filter(e => e.type === 'LIKE').length
    const dislikes = post.engagements.filter(e => e.type === 'DISLIKE').length
    const shares = post.engagements.filter(e => e.type === 'SHARE').length
    const bookmarks = post.engagements.filter(e => e.type === 'BOOKMARK').length
    const commentCount = post.comments.length

    const otherPosts = await prisma?.post.findMany({
        where: {
          authorId: post.author.id,
          id: { not: post.id }, // Exclude the current post
        },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          imageUrl: true,
          summary: true,
          engagements: true,
          comments: {
            select: { id: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3, // Limit to 3 other posts
      })
  
      // Calculate engagement metrics for other posts
      const otherPostsWithMetrics = otherPosts!.map(otherPost => {
        const otherLikes = otherPost.engagements.filter(e => e.type === 'LIKE').length
        const otherDislikes = otherPost.engagements.filter(e => e.type === 'DISLIKE').length
        const otherShares = otherPost.engagements.filter(e => e.type === 'SHARE').length
        const otherBookmarks = otherPost.engagements.filter(e => e.type === 'BOOKMARK').length
        const otherCommentCount = otherPost.comments.length
  
        return {
          ...otherPost,
          likes: otherLikes,
          dislikes: otherDislikes,
          shares: otherShares,
          bookmarks: otherBookmarks,
          commentCount: otherCommentCount,
        }
      })
  
      const postWithMetrics = {
        ...post,
        likes,
        dislikes,
        shares,
        bookmarks,
        commentCount,
      }
  
      return NextResponse.json({ 
        post: postWithMetrics,
        otherPostsByAuthor: otherPostsWithMetrics
      })

 
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
