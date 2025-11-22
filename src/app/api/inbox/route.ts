import { NextResponse, type NextRequest } from 'next/server';
import MessageListeners from '@/lib/server/MessageListeners';
import { Activity, ApiResponse } from '@/common';
import NoteRepositry from '@/lib/server/repository/NoteRepository';

// このリスナーはどこか別の場所でインスタンス化され、エクスポートされるべきかもしれないが、
// 一旦元のロジックを維持する。
export const OnNewMessageListeners = new MessageListeners();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as Activity.Activity;

        if (body.type === 'Delete' && body.object.type === 'Tombstone') {
            NoteRepositry.delete(body.object.id);
            return NextResponse.json({ message: 'Delete processed' });
        }

        if (body.type === 'Create' && body.object.type === 'Note') {
            const note = body.object as Activity.Note;
            note.tag = note.tag.filter((e) => e.type === 'Emoji');

            const person = await fetch(body.actor, {
                headers: { Accept: 'application/activity+json' },
            }).then((res) => res.json() as Promise<Activity.Person>);

            if (person.discoverable) {
                const newNote: ApiResponse.Note = {
                    author: {
                        name: person.name,
                        url: person.url,
                        icon: person.icon.url,
                        tag: person.tag,
                        isCat: person.isCat ?? false,
                    },
                    id: note.id,
                    published: new Date(note.published),
                    content: note.content,
                    tag: note.tag,
                    attachment: note.attachment,
                    sensitive: note.sensitive,
                };
                NoteRepositry.add(newNote);
                OnNewMessageListeners.fire(newNote);
            }
            return NextResponse.json({ message: 'Create processed' });
        }

        // 一致する処理がない場合は Bad Request を返す
        return NextResponse.json({ error: 'Unsupported activity type' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}