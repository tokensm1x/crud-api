import { workerServer } from "../src/app/app";
import supertest from "supertest";

const apiUrl = "api/users";

describe("Scenario 1: api execution", () => {
    it("GET EMPTY ARRAY USERS", async () => {
        const expected = [];
        const response = await supertest(workerServer).get(apiUrl);
        console.log(response);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expected);
    });
    it("test 2", () => {});
    it("test 3", () => {});
    it("test 4", () => {});
    it("test 5", () => {});
    it("test 6", () => {});
});

describe("Scenario 2", () => {
    it("test 1", () => {});
    it("test 2", () => {});
    it("test 3", () => {});
    it("test 4", () => {});
    it("test 5", () => {});
    it("test 6", () => {});
});

describe("Scenario 3", () => {
    it("test 1", () => {});
    it("test 2", () => {});
    it("test 3", () => {});
    it("test 4", () => {});
    it("test 5", () => {});
    it("test 6", () => {});
});
