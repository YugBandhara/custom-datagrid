import { NextRequest, NextResponse } from 'next/server';
import userData from '../../../mocks/data/users.json';

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = userData.slice(start, end);
  return NextResponse.json(paginated);
}
