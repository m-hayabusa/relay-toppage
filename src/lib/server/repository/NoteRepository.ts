import { ApiResponse } from "@/common";

class NoteRepository {
    notes: ApiResponse.Note[] = [];

    public getNotes = () => {
        return this.notes;
    };
    public add = (note: ApiResponse.Note) => {
        const isExists = this.notes.find(entry => entry.id == note.id);
        if (isExists) return;

        this.notes.push(note);
        this.notes = this.notes.sort((a, b) => {
            if (a.published < b.published) return 1;
            if (a.published > b.published) return -1;
            return 0;
        });

        this.notes = this.notes.slice(0, 20);
    };
    public delete = (id: string) => {
        this.notes = this.notes.filter(e => e.id != id);
    };
}

const noteRepository = new NoteRepository();
export default noteRepository;
