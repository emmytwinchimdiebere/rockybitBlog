'use client'

import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import 'highlight.js/styles/github.css'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import ListItem from '@tiptap/extension-list-item'
import React, { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from "@/components/ui/button"
import OrderedList from '@tiptap/extension-ordered-list'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, UnderlineIcon, List, ListOrdered, ImageIcon, LinkIcon, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3, Code, Quote } from 'lucide-react'
import { all, createLowlight } from 'lowlight'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Postaction from './actions/Postaction'
import { CustomToastContainer, notify } from '@/lib/Notify'
import DOMPurify from 'dompurify'

const lowlighter = createLowlight(all)

const categories = [
  "Technology",
  "Travel",
  "Food",
  "Lifestyle",
  "Fashion",
  "Health",
  "Business",
  "Entertainment"
]

const initialTags = [
  "Web Development",
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "CSS",
  "HTML",
  "UI/UX",
  "Design",
  "Mobile",
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps",
  "AI",
  "Machine Learning",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity"
]

export default function CreatePostPage() {
  return (
    <div className="container mx-auto py-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Write Post</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              What's in Your mind 🤔
            </DialogTitle>
            <DialogDescription>Fill in the details to create your new blog post.</DialogDescription>
          </DialogHeader>
          <CreatePostForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}
const  showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
  notify(
    `${type.toUpperCase() }`,
    `${type === "success" ? "Post created Successfuly": "Error creating a  post Please try again"}`,
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
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const postFormSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters" }),
  slug: z.string(),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
  tags: z.array(z.string()).min(1, "Select at least one tag").max(5, "You can select only 5 tags"),
  content: z.string().min(50, { message: "Content must be at least 50 characters long" }),
  summary:z.string().min(30, {message:"Summary  must be atleast 30 characters"})
})

type PostFormValues = z.infer<typeof postFormSchema>

export function CreatePostForm() {
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState(initialTags)
  const [newTag, setNewTag] = useState('')
  const [fileLoader, setFileLoader] = useState(false)
  const [image, setImage] = useState<File[] | null>(null)
  const [openTagPopover, setOpenTagPopover] = useState(false)
  const  [loader, setLoader] = useState<boolean>(false)
  const { register, handleSubmit, formState: { errors }, getValues, setValue, trigger, watch } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      image: undefined,
      tags: [],
      content: "",
      summary:""
    },
    resolver: zodResolver(postFormSchema),
  })

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: false,
        heading: false,
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'custom-image',
          style: 'max-width: 100%; height: auto;',
        },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Blockquote,
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-6 list-decimal',
        },
      }),
      ListItem,
      OrderedList,
      CodeBlockLowlight.configure({
        languageClassPrefix: 'language-',
        HTMLAttributes: {
          class: 'bg-black text-white pl-3 py-6',
        },
        lowlight: lowlighter
      }),
    ],
    content: `Start writing...`,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML())
      trigger('content')
    },
  })

  useEffect(() => {
    register('content', { 
      required: "Content is required",
      validate: (value) => value.length >= 50 || "Content must be at least 50 characters long"
    })
  }, [register])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileLoader(true)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage([file])
      setValue('image', file)
      await trigger('image')
    }
    setFileLoader(false)
  }

  const handleAddTag = useCallback((tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag]
      setTags(newTags)
      setValue('tags', newTags)
      trigger('tags')
      if (!availableTags.includes(tag)) {
        setAvailableTags(prev => [...prev, tag])
      }
      setNewTag('')
    }
    setOpenTagPopover(false)
  }, [tags, availableTags, setValue, trigger])

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
    setValue('tags', newTags)
    trigger('tags')
  }

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)
  )

let formdata:FormData

  const onSubmit = async (values: PostFormValues) => {
    const cleanContent = DOMPurify.sanitize(values?.content)
    setLoader(!loader)
    if(values?.image ){
        const  blobFile  =  new Blob([values.image]);
        formdata = new FormData();
        formdata.append("file", blobFile, values?.image?.name);
     
    }
    if(values?.title){
      const {title} =  values;
    const slug  = slugify(title)
    {slug  &&  `${setValue("slug", slug.substring(0, 40) + "...")}`}
    }

    const  PostData = {
      ...values,
      image: formdata,
      slug:getValues("slug"),
      content:cleanContent
    }

  
    try {
      const  response  = await  Postaction(PostData)

      if(response){
        setLoader(false)
        console.log(response)
        return  showToast("success")
      }
     
    } catch (error:any) {
      console.log(error);
      setLoader(false)
      return  showToast("error")
     
    }
    console.log(values)
    // Here you would typically send the data to your backend
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const url = window.prompt('URL')
    if (url && editor) {
      if (!/^https?:\/\//i.test(url)) {
        alert('Please enter a valid URL starting with http:// or https://')
        return
      }
      editor.chain().focus().setLink({ href: url }).run()
    } else if (editor) {
      editor.chain().focus().unsetLink().run()
    }
  }, [editor])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full lg:w-full lg:mx-auto relative lg:top-10 top-2 bg-[#f5f4f4] px-5 py-4 rounded-md">
      <h1 className="text-center flex font-bold">Create & Publish your Post...</h1>
      <div className="space-y-2">
        <Label htmlFor="title">Post Title</Label>
        <Input
          id="title"
          placeholder="Enter your post title"
          {...register("title")}
          aria-invalid={errors.title ? "true" : "false"}
          className="w-full"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Summary</Label>
        <Input
          id="summary"
          placeholder="Enter your post Summary"
          {...register("summary")}
          aria-invalid={errors.summary ? "true" : "false"}
          className="w-full"
        />
        {errors.summary && (
          <p className="text-sm text-red-500">{errors.summary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          disabled
          id="slug"
          placeholder="enter-your-post-slug"
          {...register("slug")}
          aria-invalid={errors.slug ? "true" : "false"}
          className="w-full"
        />
        {errors.slug && (
          <p className="text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="image">Post Image</Label>
        <Input
          id="image"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleImageUpload}
          className="w-full"
        />
        <div className="flex flex-row gap-2 relative">
          {image && (
            <p className="text-sm text-gray-500">Selected image: {image.map((file)=>file.name)}</p>
          )}
          {fileLoader && <div className='border-2 border-black h-4 w-4 rounded-full animate-spin transition'></div>}
          {fileLoader ? <span>uploading...</span> : ""}
        </div>
        {errors.image && (
          <p className="text-sm text-red-500">{errors.image.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value) => {
          setCategory(value)
          setValue('category', value)
          trigger('category')
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            >
              <Badge className='bg-[#f5f4f4] text-black hover:text-white'>{tag}</Badge>
              <span className="ml-1">&times;</span>
            </Badge>
          ))}
        </div>
        <Popover open={openTagPopover} onOpenChange={setOpenTagPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {tags.length > 0 ? 'Add another tag' : 'Add tag'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tag..." value={newTag} onValueChange={setNewTag} />
              <CommandList>
                <CommandEmpty>No tags found</CommandEmpty>
                <CommandGroup>
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      onSelect={() => handleAddTag(tag)}
                    >
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {newTag && !filteredTags.includes(newTag) && (
              <Button 
                variant="ghost" 
                className="w-full justify-start px-2 py-1.5"
                onClick={() => handleAddTag(newTag)}
              >
                Add &quot;{newTag}&quot;
              </Button>
            )}
          </PopoverContent>
        </Popover>
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">
            {errors.tags.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Post Content</Label>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Card className="w-full border border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive('bold') ? 'bg-muted' : ''}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive('italic') ? 'bg-muted' : ''}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={editor?.isActive('underline') ? 'bg-muted' : ''}
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={editor?.isActive('blockquote') ? 'bg-muted' : ''}
                  >
                    <Quote className='h-2 w-2 bg-transparent' />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.commands.toggleBulletList()}
                    className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addImage}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={setLink}
                    className={editor?.isActive('link') ? 'bg-muted' : ''}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={editor?.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    className={editor?.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={editor?.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor?.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor?.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    className={editor?.isActive('codeBlock') ? 'bg-muted' : ''}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <EditorContent editor={editor} className="min-h-[200px]" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <Card className="w-full border border-gray-200 text-nowrap max-w-[100%] overflow-x-auto">
              <CardHeader>
                <CardTitle>{getValues("title") || 'Post Title'}</CardTitle>
                <CardDescription>
                  Category: {category || 'Uncategorized'} | 
                  Tags: {tags.length > 0 ? tags.join(', ') : 'No tags'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-none" 
                  dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loader} className="w-full active:scale-105 disabled:cursor-not-allowed disabled:bg-white">
       {loader ? <div className='border-2  border-black rounded-full animate-spin transition h-4 w-4' ></div>: "Create Post"}
      </Button>

      <CustomToastContainer />
    </form>
  )
}