const blogsRouter = require('express').Router()
const Blog = require('../Models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const user = request.user

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() !== request.user.id.toString()){
        return response.status(401).json({ error: 'This is not your blog, you can not delete it' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })

    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter



