const request = require("supertest")
const app = require("./app")
const db = require("./db/connection")
const seed = require("./db/seeds/seed")
const { topicData, userData, articleData, commentData } = require("./db/data/test-data/index.js")
const fs = require('fs');
const path = require('path');

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData })
})

afterAll(() => db.end());

describe("GET /api/topics", () => {
    test("200: responds with an array of topic object", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body)).toBe(true);
                expect(body).toHaveLength(3);
                body.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                })
            })
    })

    test("404: responds with not found for invalid endpoint", () => {
        return request(app)
            .get("/api/invalid_endpoint")
            .expect(404)
            .then(({ body }) => {
                console.log(body.msg)
                expect(body.msg).toBe("not found");
            });
    });
})


describe("GET /api", () => {
    test("GET 200: returns json object listing all endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                const filePath = `${__dirname}/endpoints.json`;
                const endpointsJSON = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                expect(body.endpoints).toMatchObject(endpointsJSON);
            });
    });
});

describe("GET/api/articles/:article_id", () => {
    test('GET 200: returns article with id', () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                const {article} = body
                const expectedDate = new Date('2020-07-09 21:11:00')
                expect(article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expectedDate.toISOString(),
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",

                })
            })
    })
    test('404: article_id not found', () => {
        return request(app)
            .get("/api/articles/19999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('article of id 19999 is not found');
            });
    })

    test('400: article_id is not valid', () => {
        return request(app)
            .get("/api/articles/apple")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    })
})