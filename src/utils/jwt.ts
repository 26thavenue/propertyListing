import express from 'express';
import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client';
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.TOKEN_SECRET as string;

export const generateAccessToken = (user: User): string => {
  const payload = { id: user.id };
  return jwt.sign(payload, secret);
};

export const generateRefreshToken = (user: User): string => {
  const payload = { id: user.id };
  const options = { expiresIn: '7d' }; // Expires in 7 days
  return jwt.sign(payload, secret, options);
};


