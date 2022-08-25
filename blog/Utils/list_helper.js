const dummy = (blogs) => {
    return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
    if (!blogs) { return 0 }
    if (blogs.length === 0) { return 0 }

    return blogs.reduce((likes, item) => likes + item.likes, 0)
}

const favouriteBlog = (blogs) => {
    if (!blogs) { return null }
    if (blogs.length === 0) { return null }

    const result = blogs.reduce((blog, item) => !blog ? item : blog.likes < item.likes ? item : blog, undefined)

    return {
        title: result.title,
        author: result.author,
        likes: result.likes
    }
}

const mostBlog = (blogs) => {
    if (!blogs) { return null }
    if (blogs.length === 0) { return null }

    let blogs_author = []

    blogs.forEach(item => {
        let index = -1
        const find_result = blogs_author.find((val, i) => {
            if (val.author === item.author) {
                index = i
                return val
            }
        })
        if (find_result) {
            blogs_author[index] = {
                author: blogs_author[index].author,
                blogs: blogs_author[index].blogs + 1
            }
        } else {
            blogs_author = [
                ...blogs_author,
                {
                    author: item.author,
                    blogs: 1
                }
            ]
        }

    })

    return blogs_author.reduce((most_blog, item) => !most_blog?item: most_blog.blogs < item.blogs? item : most_blog ,undefined)
}

const mostLikes = (blogs) => {
    if (!blogs) { return null }
    if (blogs.length === 0) { return null }

    let blogs_author = []

    blogs.forEach(item => {
        let index = -1
        const find_result = blogs_author.find((val, i) => {
            if (val.author === item.author) {
                index = i
                return val
            }
        })
        if (find_result) {
            blogs_author[index] = {
                author: blogs_author[index].author,
                likes: blogs_author[index].likes + item.likes
            }
        } else {
            blogs_author = [
                ...blogs_author,
                {
                    author: item.author,
                    likes: item.likes
                }
            ]
        }
    })
    return blogs_author.reduce((most_blog, item) => !most_blog?item: most_blog.likes < item.likes? item : most_blog ,undefined)
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlog,
    mostLikes
}