import { getGeoData } from "../js/app.js";

describe("getGeoData() is declared?", () => {
  it("True is the expected value", () => {
    expect(getGeoData).toBeDefined();
  });
});
describe("getGeoData() is a function?", () => {
  it("True is the expected value", () => {
    expect(typeof getGeoData).toBe("function");
  });
});