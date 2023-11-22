const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index.js")
require("jest-sorted");

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData })
})

afterAll(() => db.end());


describe("POST /api/articles/:article_id/comments", () => {
    test("201: responds with the posted comment", () => {
        const newComment = { username: 'butter_bridge', comment: "test" };
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
        const newComment = { username: "butter_bridge", comment: "test" };
        return request(app)
          .post("/api/articles/983247823/comments")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("article of id 983247823 is not found");
          });
      });
      test("500: valid input data but username does not exist", () => {
        const newComment = { username: "ABC", comment: "test" };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(500)
          .then(({ body }) => {
            expect(body.msg).toBe("internal server error");
          });
        })
    

})
