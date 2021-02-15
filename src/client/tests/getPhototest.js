import { getPhoto } from "../js/app.js";

describe("getPhoto() is declared?", () => {
  it("True is the expected value", () => {
    expect(getPhoto).toBeDefined();
  });
});
describe("getPhoto() is a function?", () => {
  it("True is the expected value", () => {
    expect(typeof getPhoto).toBe("function");
  });
});