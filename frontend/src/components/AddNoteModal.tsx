import axios from 'axios';
import { useEffect, useState } from 'react';
import { createNote, listClients, type Client } from '../api';
import { Modal } from './Modal';

interface AddNoteModalProps {
  userId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function AddNoteModal({
  userId,
  onClose,
  onCreated,
}: AddNoteModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listClients(userId)
      .then((data) => {
        if (!active) return;
        setClients(data);
        setClientId(data[0]?.id ?? '');
      })
      .catch(() => {
        if (active) setError('Could not load your clients.');
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const submit = async () => {
    if (!clientId) return;
    setSubmitting(true);
    setError(null);

    try {
      await createNote({ authorId: userId, clientId, content });
      onCreated();
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : null;
      setError(
        status === 403
          ? 'You are not assigned to that client.'
          : status === 404
            ? 'That user or client no longer exists.'
            : 'Could not save the note.',
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="New note"
      meta="Markdown is supported"
      onClose={onClose}
      footer={
        <>
          {error ? <span className="modal__error">{error}</span> : null}
          <button
            type="button"
            className="btn"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => void submit()}
            disabled={submitting || !clientId}
          >
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </>
      }
    >
      <div className="form-row">
        <label className="field-label" htmlFor="client">
          Client
        </label>
        <select
          id="client"
          className="select"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          disabled={clients.length === 0}
        >
          {clients.length === 0 ? (
            <option value="">No clients assigned to you</option>
          ) : (
            clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.id}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="form-row">
        <label className="field-label" htmlFor="content">
          Note
        </label>
        <textarea
          id="content"
          className="textarea"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={'## Meeting summary\n\n- Point one\n- Point two'}
        />
        <p className="form-hint">
          Content may be left empty — the note will still be recorded.
        </p>
      </div>
    </Modal>
  );
}
