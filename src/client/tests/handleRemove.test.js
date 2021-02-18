import {handleRemove} from "../js/app.js";
import {describe, expect} from "@jest/globals";


describe('Testing handleRemove function', () => {
    test('It should return true because the function is defined', () => {
        expect(handleRemove).toBeDefined();
    });
    test('It should return true as handleRemove is a function', () => {
        expect(typeof handleRemove).toBe('function');
    });
});