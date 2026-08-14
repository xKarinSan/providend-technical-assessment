import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getNote, type NoteDetail } from '../api';
import { Modal } from './Modal';

interface ViewNoteModalProps {
  noteId: string;
  userId: string;
  onClose: () => void;
}

export function ViewNoteModal({ noteId, userId, onClose }: ViewNoteModalProps) {
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setNote(null);
    setError(null);

    getNote(noteId, userId)
      .then((data) => {
        if (active) setNote(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const status = axios.isAxiosError(err) ? err.response?.status : null;
        setError(
          status === 403
            ? 'You are not assigned to this client, so this note is not available to you.'
            : status === 401
              ? 'Your session is not recognised. Pick a user and try again.'
              : 'Could not load this note.',
        );
      });

    return () => {
      active = false;
    };
  }, [noteId, userId]);

  const meta = note
    ? `${note.clientName} · ${note.clientId} · written by ${note.authorName}`
    : noteId;

  return (
    <Modal
      title={note ? `Note ${note.id}` : `Note ${noteId}`}
      meta={meta}
      onClose={onClose}
      footer={
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      }
    >
      {error ? (
        <p className="state state--error" style={{ border: 0 }}>
          {error}
        </p>
      ) : !note ? (
        <p className="state" style={{ border: 0 }}>
          Loading…
        </p>
      ) : note.content.trim() === '' ? (
        <p className="markdown markdown--empty">This note has no content.</p>
      ) : (
        <div className="markdown">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      )}
    </Modal>
  );
}
