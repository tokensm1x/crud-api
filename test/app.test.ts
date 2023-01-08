import { workerServer } from "../src/app/app";
import supertest from "supertest";

const apiUrl = "/api/users";
describe("Scenario 1: api execution", () => {
    it("Test 1: should return empty users", async () => {
        const expected = [];
        const response = await supertest(workerServer).get(apiUrl);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expected);
    });
    it("Test 2: CREATE USER", () => {});
    it("Test 3: UPDATE USER", () => {});
    it("Test 4: GET USER BY ID", () => {});
    it("Test 5: DELETE USER", () => {});
    it("Test 6: GET DELETED USER", () => {});
});

describe("Scenario 2: test validation", () => {
    it("CREATE USER WITHOUT USERNAME", () => {});
    it("test 2", () => {});
    it("test 3", () => {});
    it("test 4", () => {});
    it("test 5", () => {});
    it("test 6", () => {});
});

describe("Scenario 3: test errors", () => {
    it("test 1", () => {});
    it("test 2", () => {});
    it("test 3", () => {});
    it("test 4", () => {});
    it("test 5", () => {});
    it("test 6", () => {});
});
