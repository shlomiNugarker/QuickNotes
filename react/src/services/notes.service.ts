import { httpService } from './http.service';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
}

export const notesService = {
  async getNotes(tags?: string): Promise<Note[]> {
    const endpoint = tags ? `/notes?tags=${tags}` : '/notes';
    return httpService.get(endpoint, true);
  },

  async getNote(id: string): Promise<Note> {
    return httpService.get(`/notes/${id}`, true);
  },

  async createNote(data: CreateNoteDto): Promise<Note> {
    return httpService.post('/notes', data, true);
  },

  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    return httpService.put(`/notes/${id}`, data, true);
  },

  async deleteNote(id: string): Promise<{ message: string }> {
    return httpService.del(`/notes/${id}`, true);
  },
};
