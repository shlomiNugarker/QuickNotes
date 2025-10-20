import React, { useState, useEffect } from "react";
import { notesService, Note } from "../services/notes.service";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchTags.trim()) {
      const tags = searchTags.toLowerCase().split(',').map(t => t.trim());
      const filtered = notes.filter(note =>
        note.tags.some(tag => tags.some(searchTag => tag.toLowerCase().includes(searchTag)))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchTags, notes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getNotes();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      toast.error("Failed to fetch notes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notesService.createNote({
        title: formData.title,
        content: formData.content,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      });
      toast.success("Note created successfully");
      setIsCreateDialogOpen(false);
      setFormData({ title: "", content: "", tags: "" });
      fetchNotes();
    } catch (error) {
      toast.error("Failed to create note");
      console.error(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote) return;

    try {
      await notesService.updateNote(currentNote.id, {
        title: formData.title,
        content: formData.content,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      });
      toast.success("Note updated successfully");
      setIsEditDialogOpen(false);
      setCurrentNote(null);
      setFormData({ title: "", content: "", tags: "" });
      fetchNotes();
    } catch (error) {
      toast.error("Failed to update note");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await notesService.deleteNote(id);
      toast.success("Note deleted successfully");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to delete note");
      console.error(error);
    }
  };

  const openEditDialog = (note: Note) => {
    setCurrentNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                className="w-full min-h-[150px] p-2 border rounded-md"
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              <Input
                placeholder="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Filter by tags (comma-separated)..."
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTags ? "No notes found with these tags" : "No notes yet. Create your first note!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                <CardDescription className="text-xs">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-3">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(note)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              className="w-full min-h-[150px] p-2 border rounded-md"
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <Button type="submit" className="w-full">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
