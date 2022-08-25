const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('verify if the id is ok', async () => {
    const response = await api.get('/api/blogs')

    response.body.map(
        item => expect(item.id).toBeDefined()
    )
}, 100000)

test('check if a blog is posted in the database', async () => {

    const before_post = await api.get('/api/blogs')

    await api
        .post('/api/blogs')
        .send({
            title: 'Blog 1 with first user',
            author: 'Blog 1 with first user',
            url: 'https://Blog1withfirstuser/',
            likes: 2,
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const after_post = await api.get('/api/blogs')

    expect(after_post.body).toHaveLength(before_post.body.length + 1)
}, 100000)

test('verifies that if the likes property is missing from the request, it will default to the value 0', async () => {
    await api
        .post('/api/blogs')
        .send(
            {
                title: 'Likes Not Provided',
                author: 'Likes Not Provided',
                url: 'Likes Not Provided',
            }
        )
        .expect(201)
        .expect((response) => expect(response._body.likes).toBe(0))
}, 100000)

test('if the title and url properties are missing from the request data, the backend responds to the request with the status code 400', async () => {
    await api
        .post('/api/blogs')
        .send(
            {
                author: 'Michael Chan',
                likes: 7,
            }
        )
        .expect(400)
})

test('Delete single blog', async () => {
    const get_result = await api.get('/api/blogs')

    if (get_result.body.length > 0) {
        const blog = get_result.body[get_result.body.length - 1]
        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(204)
    }
})

test('update a single post like by one', async () => {
    const get_result = await api.get('/api/blogs')

    if (get_result.body.length > 0) {
        const blog = get_result.body[get_result.body.length - 1]

        await api
            .put(`/api/blogs/${blog.id}`)
            .send({
                ...blog,
                likes: blog.likes + 1
            })
            .expect(201)
            .expect((response) => expect(response._body.likes).toBe(blog.likes + 1))
    }
})

describe('user api test', () => {

    test('creation succeeds with a fresh username', async () => {
        const users_be4 = await api.get('/api/users')

        const newUser = {
            username: 'mluukkai 1',
            name: 'Matti Luukkainen',
            password: 'salainen1',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const users_after = await api.get('/api/users')
        expect(users_after.body).toHaveLength(users_be4.body.length + 1)

        const usernames = users_after.body.map(u => u.username)
        expect(usernames).toContain(newUser.username)

        if (users_after.body.length > 0) {
            await api
                .delete(`/api/users/${users_after.body[users_after.body.length-1].id}`)
                .expect(204)
        }
    })

    test('creation user fail, too short username', async () => {

        const newUser = {
            username: 'ml',
            name: 'usernametooshort',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

    })

    test('creation user fail, too short password', async () => {

        const newUser = {
            username: 'Username1',
            name: 'namepswtooshort',
            password: 's',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

    })

    test('creation same username fail, Username must be unique', async () => {

        const newUser = {
            username: 'same username',
            name: 'same username',
            password: 'same username',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const users_after = await api.get('/api/users')
        if (users_after.body.length > 0) {
            await api
                .delete(`/api/users/${users_after.body[users_after.body.length-1].id}`)
                .expect(204)
        }
    })

    test('Get all users return data as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll(() => {
    mongoose.connection.close()
})