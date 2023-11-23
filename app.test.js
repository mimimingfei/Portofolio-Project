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
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
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

    test('201:ignore any unnecessary properties on the request body', () => {
        const newComment = { username: 'butter_bridge', body: "test", votes: 100, color: 'red' };
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

        test("400: Bad request, missing part of input comment data ", () => {
            const newComment = { comment: "test" };
            return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("bad request")
                });
        });
        test("400: Bad request, invalid article_id ", () => {
            const newComment = { username: "butter_bridge", body: "test" };
            return request(app)
                .post("/api/articles/notanumber/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("bad request")
                });
        });
        test("404: valid input data but article_id does not exist", () => {
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


    describe("DELETE /api/comments/:comment_id", () => {
        test("204: deletion successful", () => {
            return request(app)
                .delete("/api/comments/1")
                .expect(204)
        })
        test("400: bad request, invalid comment_id", () => {
            return request(app)
                .delete("/api/comments/apple")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("bad request");
                });
        });

        test("404: not found, comment_id is valid but does not exist", () => {
            return request(app)
                .delete("/api/comments/10000")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("comment id 10000 not found");
                });
        });

    })

    describe("PATCH /api/articles/:article_id", () => {
        test("200: decrease votes and return updated article", () => {
            const testVotes = { inc_votes: -1 }
            const expectedArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T21:11:00.000Z",
                votes: 99,
                article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            };
            return request(app)
                .patch("/api/articles/1")
                .send(testVotes)
                .expect(200)
                .then(({ body }) => {
                    const { updatedArticle } = body;
                    expect(updatedArticle).toEqual(expectedArticle);
                })
        })
        test("200: increase votes and return updated article", () => {
            const testVotes = { inc_votes: 5 }
            const expectedArticle = {
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: "2020-10-16T06:03:00.000Z",
                votes: 5,
                article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
            return request(app)
                .patch("/api/articles/2")
                .send(testVotes)
                .expect(200)
                .then(({ body }) => {
                    const { updatedArticle } = body;
                    expect(updatedArticle).toEqual(expectedArticle);
                })
        })
        test("404: not found, article_id is valid but does not exist", () => {
            const testVotes = { inc_votes: 5 }
            return request(app)
                .patch("/api/articles/10000")
                .send(testVotes)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("article of id 10000 is not found");
                });
        });

        test("400: bad request, article_id is invalid", () => {
            const testVotes = { inc_votes: 5 }
            return request(app)
                .patch("/api/articles/aefegtaa")
                .send(testVotes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("bad request");
                });
        });

        test("400: bad request, invalid votes", () => {
            const testVotes = { inc_votes: "test" }
            return request(app)
                .patch("/api/articles/3")
                .send(testVotes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("bad request");
                });
        });
    })


    describe("GET /api/users", () => {
        test("200: responds with an array of user object", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body;
                    expect(users).toHaveLength(4);
                    users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String),
                        });
                    })
                })
        })

    })


    describe.only("GET /api/articles?topic", () => {
        test("200: return articles of the topic", () => {
            return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body
                    expect(articles).toHaveLength(1);
                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            title: expect.any(String),
                            topic: "cats",
                            author: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        }) })
                    })
                })
            })
})
