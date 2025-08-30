import { NextResponse } from 'next/server';
import NoteRepository from '@/lib/server/repository/NoteRepository';

// TODO: WebSocketのストリーム処理はNext.jsの標準機能ではサポートされていないため、
// この機能は別途カスタムサーバーなどで実装する必要があります。
// 元のコードはコメントアウトして残しておきます。
/*
import { OnNewMessageListeners } from "./inbox";
import { ApiResponse } from "@/common";
import { SocketStream } from "@fastify/websocket";
import { FastifyRequest } from 'fastify';

export const NotesStreamHandler = async (
    websocket: SocketStream,
    request: FastifyRequest
) => {
    const handler = (post: ApiResponse.Note) => {
        websocket.socket.send(JSON.stringify(post));
    };
    OnNewMessageListeners.add(handler);
    websocket.socket.on("close", () => {
        request.log.info("WebSocket disconnected");
        OnNewMessageListeners.delete(handler);
    });
};
*/

export async function GET() {
    try {
        const notes = NoteRepository.getNotes();
        return NextResponse.json(notes);
    } catch (error) {
        console.error('Failed to get notes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}