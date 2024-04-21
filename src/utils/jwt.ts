import express from 'express';
import * as jwt from 'jsonwebtoken'

import dotenv from 'dotenv'

dotenv.config()

interface JWTPayload {
  userId: string;
}

// Generate access token
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId } as JWTPayload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId } as JWTPayload, process.env.REFRESH_TOKEN_SECRET!);
};



