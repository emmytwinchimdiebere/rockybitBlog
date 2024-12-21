"use client"

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, ChevronDown, ChevronUp, ThumbsDown, Trash2, MoreHorizontal } from 'lucide-react'
import { CustomToastContainer, notify } from '@/lib/Notify'
import { useAuthstore } from '@/lib/Authstore'

interface CommentAuthor {
  id: string
  first_name: string
  email: string
  profile: {
    avatar: string | null
  } | null
}

interface CommentProps {
  id: number
  content: string
  createdAt: string
  author: CommentAuthor
  likes: number
  dislikes: number
  children: CommentProps[]
  userLiked?: boolean
  userDisliked?: boolean
}

interface CommentSectionProps {
  postId: number
}

const MAX_DISPLAY_DEPTH = 3
const COMMENTS_BEFORE_COLLAPSE = 3

const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  notify(
    `${type.toUpperCase()}`,
    message,
    type,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  )
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { checkAuth, isLoggedIn, user, fetchComments } = useAuthstore()
  const [comments, setComments] = useState<CommentProps[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [expandedThreads, setExpandedThreads] = useState<number[]>([])
  const [viewMoreReplies, setViewMoreReplies] = useState<number[]>([])

  useEffect(() => {
    checkAuth()
    fetchingComments()
  }, [checkAuth, postId])

  const fetchingComments = async () => {
    try {
      const result = await fetchComments(postId)
      if (result && Array.isArray(result.comments)) {
        setComments(result.comments)
      } else {
        console.error('Unexpected data structure from fetchComments:', result)
        showToast("error", "Failed to fetch comments. Unexpected data structure.")
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      showToast("error", "Failed to fetch comments. Please try again.")
    }
  }

  const handleSubmitComment = async (parentId: number | null = null) => {
    if (!isLoggedIn) {
      showToast("error", "You must be logged in to comment")
      return
    }

    const newCommentObj: CommentProps = {
      id: Date.now(),
      content: newComment,
      createdAt: new Date().toISOString(),
      author: {
        id: user?.user?.id || '',
        first_name: user?.user?.user_metadata?.full_name || 'Anonymous',
        email: user?.user?.email || '',
        profile: {
          avatar: user?.user?.user_metadata?.avatar_url || null
        }
      },
      likes: 0,
      dislikes: 0,
      children: [],
    }

    // Optimistic update
    setComments(prevComments => {
      const addReply = (comments: CommentProps[]): CommentProps[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return { ...comment, children: [...comment.children, newCommentObj] }
          } else if (comment.children.length > 0) {
            return { ...comment, children: addReply(comment.children) }
          }
          return comment
        })
      }

      if (parentId) {
        return addReply(prevComments)
      } else {
        return [newCommentObj, ...prevComments]
      }
    })

    setNewComment('')
    setReplyingTo(null)

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          postId,
          parentId,
        }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      // Fetch comments to sync with server
      fetchingComments()
    } catch (error) {
      console.error('Error posting comment:', error)
      showToast("error", "Failed to post comment. Please try again.")
      // Revert optimistic update on error
      fetchingComments()
    }
  }

  const handleEngagement = async (commentId: number,action: 'like' | 'dislike') => {
    if (!isLoggedIn) {
      showToast("error", `You must be logged in to ${action} a comment`)
      return
    }

    try {
      const response = await fetch(`/api/comment/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action ,  postId}),
      })

      if (!response.ok) throw new Error(`Failed to ${action} comment`)

      const updatedComment = await response.json()
      setComments(prevComments => {
        const updateComment = (comments: CommentProps[]): CommentProps[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, ...updatedComment }
            } else if (comment.children.length > 0) {
              return { ...comment, children: updateComment(comment.children) }
            }
            return comment
          })
        }
      
        return updateComment(prevComments)
      })
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error)
      showToast("error", `Failed to ${action} comment. Please try again.`)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!isLoggedIn) {
      showToast("error", "You must be logged in to delete a comment")
      return
    }

    // Optimistic update
    setComments(prevComments => {
      const deleteComment = (comments: CommentProps[]): CommentProps[] => {
        return comments.filter(comment => {
          if (comment.id === commentId) {
            return false
          } else if (comment.children.length > 0) {
            comment.children = deleteComment(comment.children)
          }
          return true
        })
      }
      return deleteComment(prevComments)
    })

    try {
      const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete comment')
      showToast("success", "Comment deleted successfully")
    } catch (error) {
      console.error('Error deleting comment:', error)
      showToast("error", "Failed to delete comment. Please try again.")
      // Revert optimistic update on error
      fetchingComments()
    }
  }

  const toggleReplies = (commentId: number) => {
    setExpandedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const toggleThread = (commentId: number) => {
    setExpandedThreads(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const toggleViewMoreReplies = (commentId: number) => {
    setViewMoreReplies(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const renderComment = (comment: CommentProps, depth = 0) => {
    if (!comment) return null;

    const isExpanded = expandedComments.includes(comment.id)
    const isThreadExpanded = expandedThreads.includes(comment.id)
    const showViewMoreReplies = viewMoreReplies.includes(comment.id)

    return (
      <div key={comment.id} className={`mb-4 ${depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : ''}`}>
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.profile?.avatar || undefined} alt={comment.author.first_name} />
            <AvatarFallback>{comment.author.first_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted p-4 rounded-lg">
              <div className="font-semibold mb-1">{comment.author.first_name}</div>
              <p className="text-sm mb-2">{comment.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button 
                  onClick={() => handleEngagement(comment.id, 'like')}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Heart className={`h-4 w-4 ${comment.userLiked ? 'fill-current text-blue-800' : ''}`} />
                  {comment.likes}
                </button>
                <button 
                  onClick={() => handleEngagement(comment.id, 'dislike')}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <ThumbsDown className={`h-4 w-4 ${comment.userDisliked ? 'fill-current text-red-700' : ''}`} />
                  {comment.dislikes}
                </button>
                <button 
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  Reply
                </button>
                <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                {user && user.user && user.user.id === comment.author.id && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-1 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
            {replyingTo === comment.id && (
              <div className="mt-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="mb-2"
                />
                <Button onClick={() => handleSubmitComment(comment.id)} size="sm">
                  Post Reply
                </Button>
              </div>
            )}
          </div>
        </div>
        {comment.children && comment.children.length > 0 && (
          <div className="mt-2">
            {depth < MAX_DISPLAY_DEPTH ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReplies(comment.id)}
                  className="text-xs text-muted-foreground"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Replies
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show {comment.children.length} Replies
                    </>
                  )}
                </Button>
                {isExpanded && (
                  <div className="mt-2">
                    {comment.children.slice(0, isThreadExpanded ? undefined : COMMENTS_BEFORE_COLLAPSE).map(childComment => renderComment(childComment, depth + 1))}
                    {comment.children.length > COMMENTS_BEFORE_COLLAPSE && !isThreadExpanded && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleThread(comment.id)}
                        className="text-xs text-muted-foreground mt-2"
                      >
                        <MoreHorizontal className="h-4 w-4 mr-1" />
                        View {comment.children.length - COMMENTS_BEFORE_COLLAPSE} more replies
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleViewMoreReplies(comment.id)}
                className="text-xs text-muted-foreground"
              >
                {showViewMoreReplies ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    View {comment.children.length} more replies
                  </>
                )}
              </Button>
            )}
            {depth >= MAX_DISPLAY_DEPTH && showViewMoreReplies && (
              <div className="mt-2">
                {comment.children.map(childComment => renderComment(childComment, depth + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="mb-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2"
        />
        <Button className='disabled:cursor-not-allowed' disabled ={!isLoggedIn} onClick={() => handleSubmitComment()}>{isLoggedIn ? "Post Comment": "Login To Comment"}</Button>
      </div>
      <div>
        {comments.map(comment => renderComment(comment))}
      </div>
      <CustomToastContainer />
    </div>
  )
}


