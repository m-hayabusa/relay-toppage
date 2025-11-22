import { NextResponse } from 'next/server';
import { getResult } from '@/lib/server/GenerateServerList';

export async function GET() {
    try {
        return NextResponse.json(await getResult());
    } catch (error) {
        console.error('Failed to get servers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}