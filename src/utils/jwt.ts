import express from 'express';
import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client';
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.TOKEN_SECRET as string;



// Generate access token
export const generateAccessToken = (user: User): string => {
  const payload = { id: user.id };
  const options = { expiresIn: '15m' }; // Expires in 15 minutes
  return jwt.sign(payload, secret, options);
};

// Generate refresh token
export const generateRefreshToken = (user: User): string => {
  const payload = { id: user.id };
  const options = { expiresIn: '7d' }; // Expires in 7 days
  return jwt.sign(payload, secret, options);
};


