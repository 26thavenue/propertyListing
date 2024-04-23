import { ErrorMiddleware } from './../middlewares/errorMiddleware';
import { expect, test ,  describe} from "bun:test";
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { ZodObject } from 'zod';
import { userValidator } from "../utils/schema";
import { ZodMiddleware } from './../middlewares/errorMiddleware';

enum ROLE {
    ADMIN = "ADMIN",
    USER = "USER",
}

const testUser = {
    id:'ggrgrg',
    name:"Oni Oluwatomiwa",
    role: ROLE.USER,
    email: 'tomiwa',
    refreshToken: "hdhhdhdh",
    hashedPassword: "jdjdjdjdj", 
    password: "jdjdjdjdj",
    verified: false

}

const validUser = {
    id:'ggrgrg',
    name:"Oni Oluwatomiwa",
    role: ROLE.USER,
    email: 'tomiwa@gmail.com',
    refreshToken: "hdhhdhdh",
    password: "jdjdjdjdj", 
    verified: false

}



describe("generateAccessToken", () => {
  test('should return a string', () => {
    const token = generateAccessToken(testUser);
    expect(typeof token).toBe('string');
  });

  test('should contain the user ID in the payload', () => {
    const token = generateAccessToken(testUser);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    expect(decoded).toHaveProperty('id', testUser.id);
  });

  test('should have the correct expiration time', () => {
    const token = generateAccessToken(testUser);
    const decoded = jwt.decode(token) as { exp: number };
    const expirationTime = decoded.exp;
    const expectedExpirationTime = Math.floor(Date.now() / 1000) + (15 * 60); // 15 minutes from now
    expect(expirationTime).toBeCloseTo(expectedExpirationTime, -1);
  });

  
});



describe('userValidation', () => {

     test('should throw an error for testUser', () => {
        // Call the validation function with testUser and expect it to return false
        // const message = userValidator.validate(testUser).status;
        // console.log(message)
        expect(userValidator.validate(testUser).status).toBe(400);
    });

    test('should return true for validUser', () => {
        // console.log(userValidator.schema)
        // Call the validation function with validUser and expect it to return true
        console.log(userValidator.validate(validUser))
        expect(userValidator.validate(validUser).status).toBeUndefined()
    });
})
    