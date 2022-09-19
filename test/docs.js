/* eslint no-undef: 0 */
/* eslint no-async-promise-executor: 0 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

const database = require("../db/database.js");
const collectionName = "docs";

describe("App", () => {
    it("Test base URL", (done) => {
        chai.request(server)
            .get("/")
            .end((err, res) => {
                res.body.msg.should.equal("Editor");
                done();
            });
    });
});


describe('Docs API', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('GET /docs', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('POST /docs', () => {
        it('201 Create a new Document', (done) => {
            let document = {
                title: "Document title",
                content: "Document content"
            };

            chai.request(server)
                .post("/docs")
                .send(document)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("title");
                    res.body.data.should.have.property("content");
                    res.body.data.title.should.equal("Document title");
                    res.body.data.content.should.equal("Document content");

                    done();
                });
        });
    });

    describe('GET /docs after POST', () => {
        it('Result has (1) data object', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });

    describe('PUT', () => {
        it('204 HAPPY PATH, data has been updated', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    let document = {
                        _id: res.body.data[0]._id,
                        title: "New document title",
                        content: "New document content"
                    };

                    chai.request(server)
                        .put("/docs")
                        .send(document)
                        .end((err, res) => {
                            res.should.have.status(204);
                            chai.request(server)
                                .get("/docs")
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.an("object");
                                    res.body.data.should.be.an("array");
                                    res.body.data[0].title.should.equal("New document title");
                                    res.body.data[0].content.should.equal("New document content");
                                });
                        });
                    done();
                });
        });
    });

    describe("DELETE", () => {
        it("204 HAPPY PATH, data has been deleted", (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    let document = {
                        _id: res.body.data[0]._id
                    };

                    chai.request(server)
                        .delete("/docs")
                        .send(document)
                        .end((err, res) => {
                            res.should.have.status(204);
                            chai.request(server)
                                .get("/docs")
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.an("object");
                                    res.body.data.should.be.an("array");
                                    res.body.data.length.should.be.equal(0);
                                });
                        });
                    done();
                });
        });
    });
});
