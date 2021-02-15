import { getWeatherData } from "../js/app.js";

describe("getWeatherData() is declared?", () => {
  it("True is the expected value", () => {
    expect(getWeatherData).toBeDefined();
  });
});
describe("getWeatherData() is a function?", () => {
  it("True is the expected value", () => {
    expect(typeof getWeatherData).toBe("function");
  });
});