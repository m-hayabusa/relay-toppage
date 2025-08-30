import { NextResponse } from 'next/server';
import { result } from '@/lib/server/GenerateServerList';

export async function GET() {
    try {
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to get servers:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}