const request = require("supertest")
const app = require("./app")
const db = require("./db/connection")
const seed = require("./db/seeds/seed")
const { topicData, userData, articleData, commentData } = require("./db/data/test-data/index.js")
const fs = require('fs');
const path = require('path');
require("jest-sorted");

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
                const { article } = body
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

describe("GET /api/articles", () => {
    test("200: responds with an array of articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles.length).toBe(13);
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title:expect.any(String),
                        article_id: expect.any(Number),
                        topic:expect.any(String),
                        created_at: expect.any(String),
                        votes:expect.any(Number),
                        comment_count:expect.any(Number)
                    });
                    expect(articles).toBeSortedBy("created_at", { descending: true });
            })
    })
})
})

describe('/api/articles/:article_id/comments', () => {
    test('200: return comments for selected article', () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments.length).toBe(11);
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        body: expect.any(String),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String)
                    });
                    expect(comments).toBeSortedBy("created_at", { descending: true });
                })
            });
    })

    test('200: responds with an empty array for a valid article_id with no comments', () => {
        return request(app)
            .get('/api/articles/4/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toEqual([]);
            });
    });
  
    test("404: article_id is valid but does not exist", () => {
        return request(app)
            .get("/api/articles/1000/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("article of id 1000 is not found");
            });
    });

    test('404: responds with an error for invalid article_id', () => {
        return request(app)
            .get('/api/articles/notanumber/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request');
            });
    });

})

describe("POST /api/articles/:article_id/comments", () => {
    test("201: responds with the posted comment", () => {
        const newComment = { username: 'butter_bridge', body: "test" };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { Comment } = body;
                expect(Comment.body).toBe('test')
                expect(Comment.article_id).toBe(1)
                expect(Comment.author).toBe('butter_bridge')
            })
    })
    test("400: invalid input comment data", () => {
        const newComment= { comment: "test" };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            });
    });
    test("404: valid input data but article does not exist", () => {
        const newComment = { username: "butter_bridge", body: "test" };
        return request(app)
          .post("/api/articles/983247823/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("article of id 983247823 is not found");
          });
      });
     
    test("404: valid input data but username does not exist", () => {
        const newComment = { username: "ABC", body: "test" };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("foreign key violation");
          });
      });
     

})
