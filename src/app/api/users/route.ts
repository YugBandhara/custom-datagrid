import { NextResponse } from 'next/server';
import userData from '../../../mocks/data/users.json';

export async function GET() {
  return NextResponse.json(userData);
}
