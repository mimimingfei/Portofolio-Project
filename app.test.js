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
                expect(body.msg).toBe("path not found");
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