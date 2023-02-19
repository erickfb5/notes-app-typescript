import "./App.css";
import { useState, useEffect } from "react";

type Note = { id: number; text: string };

type NoteProps = {
  note: Note;
  updateNoteText: (id: number, text: string) => void;
  deleteNote: (id: number) => void;
};

const App = (): JSX.Element => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const storedNotes = JSON.parse(
      localStorage.getItem("notes") || "[]"
    ) as Note[];
    if (storedNotes) setNotes(storedNotes);
    addNewNote(); // add new note when app starts
  }, []);

  const addNewNote = (text: string = ""): void => {
    const newNote: Note = { id: Date.now(), text };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const updateNoteText = (id: number, text: string): void => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) return { ...note, text };
        return note;
      })
    );
  };

  const deleteNote = (id: number): void =>
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <div>
      <button className="add" onClick={() => addNewNote()}>
        <i className="fas fa-plus"></i> Add note
      </button>
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          updateNoteText={updateNoteText}
          deleteNote={deleteNote}
        />
      ))}
    </div>
  );
};
function Note({
  note: { id, text },
  updateNoteText,
  deleteNote,
}: NoteProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>(text);

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleNoteTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNoteText(event.target.value);
  };

  const handleNoteTextBlur = () => {
    updateNoteText(id, noteText);
  };

  return (
    <div className="note">
      <div className="tools">
        <button className="edit" onClick={toggleEditing}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="delete" onClick={() => deleteNote(id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <textarea
        value={noteText}
        onChange={handleNoteTextChange}
        onBlur={handleNoteTextBlur}
        style={{ display: isEditing ? "block" : "none" }}
      />
      <div
        className={`main ${isEditing ? "hidden" : ""}`}
        onClick={toggleEditing}
      >
        {text}
      </div>
    </div>
  );
}



export default App;
