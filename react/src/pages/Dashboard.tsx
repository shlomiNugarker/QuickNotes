import React, { useState, useEffect, useMemo } from "react";
import { notesService, Note } from "../services/notes.service";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">{t("dashboard_title")}</h1>
          <p className="text-muted-foreground text-sm">{t("dashboard_subtitle")}</p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("filter_by_tags")}
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className="pl-10"
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
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t("create_note")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg">{t("create_new_note")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3">
                <Input
                  placeholder={t("title_placeholder")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="font-medium"
                />
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  placeholder={t("content_placeholder")}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <Input
                  placeholder={t("tags_placeholder")}
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <Button type="submit" className="w-full">{t("create_button")}</Button>
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
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTags ? t("no_notes_found") : t("no_notes_yet")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTags
                ? t("try_different_tags")
                : t("create_first_note_desc")}
            </p>
            {!searchTags && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                {t("create_first_note_button")}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg">
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
                          variant="secondary"
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
                      className="flex-1 gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      {t("edit_button")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(note.id)}
                      disabled={isDeleting === note.id}
                      className="flex-1 gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      {isDeleting === note.id ? t("deleting") : t("delete_button")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">{t("edit_note")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-3">
              <Input
                placeholder={t("title_placeholder")}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="font-medium"
              />
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder={t("content_label")}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              <Input
                placeholder={t("tags_placeholder")}
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <Button type="submit" className="w-full">{t("update_button")}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
