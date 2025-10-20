import React, { useState, useEffect, useMemo } from "react";
import { notesService, Note } from "../services/notes.service";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import AnimatedBackground from "../components/AnimatedBackground";

const gradients = [
  "bg-gradient-1",
  "bg-gradient-2",
  "bg-gradient-3",
  "bg-gradient-4",
  "bg-gradient-5",
  "bg-gradient-6",
];

const getGradientForNote = (id: string) => {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
};

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    if (!searchTags.trim()) return notes;
    const tags = searchTags.toLowerCase().split(',').map(t => t.trim());
    return notes.filter(note =>
      note.tags.some(tag => tags.some(searchTag => tag.toLowerCase().includes(searchTag)))
    );
  }, [searchTags, notes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getNotes();
      setNotes(data);
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
    setIsDeleting(id);
    try {
      await notesService.deleteNote(id);
      toast.success("Note deleted successfully");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to delete note");
      console.error(error);
    } finally {
      setIsDeleting(null);
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

  const resetForm = () => {
    setFormData({ title: "", content: "", tags: "" });
    setCurrentNote(null);
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="minimal" />

      <div className="container relative mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-heading font-bold gradient-text mb-2">My Notes</h1>
          <p className="text-muted-foreground">Organize your thoughts beautifully</p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center animate-slideUp">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by tags (comma-separated)..."
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className="pl-10 glass"
            />
            {searchTags && (
              <button
                onClick={() => setSearchTags("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Create Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-1 hover:shadow-glow group">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                Create Note
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-dark">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading gradient-text">Create New Note</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="text-lg font-semibold"
                />
                <textarea
                  className="w-full min-h-[150px] p-3 border rounded-lg bg-background/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write your thoughts..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <Input
                  placeholder="Tags (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <Button type="submit" className="w-full bg-gradient-3">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 animate-scaleIn">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-1 flex items-center justify-center">
              <Plus className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-2">
              {searchTags ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTags
                ? "Try different tags or create a new note"
                : "Create your first note to get started!"}
            </p>
            {!searchTags && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-2">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className="animate-scaleIn hover-lift"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all group">
                  {/* Gradient Header */}
                  <div className={`h-2 ${getGradientForNote(note.id)}`} />

                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-xl font-heading group-hover:gradient-text transition-all">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {note.content}
                    </p>

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant={`gradient${(idx % 4) + 1}` as any}
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(note)}
                        className="flex-1 group/btn"
                      >
                        <Edit className="w-3 h-3 mr-1 group-hover/btn:rotate-12 transition-transform" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(note.id)}
                        disabled={isDeleting === note.id}
                        className="flex-1 group/btn"
                      >
                        <Trash2 className="w-3 h-3 mr-1 group-hover/btn:scale-110 transition-transform" />
                        {isDeleting === note.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="glass-dark">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading gradient-text">Edit Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-lg font-semibold"
              />
              <textarea
                className="w-full min-h-[150px] p-3 border rounded-lg bg-background/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
              <Button type="submit" className="w-full bg-gradient-4">Update</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
