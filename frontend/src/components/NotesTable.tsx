import type { NoteSummary } from '../api';

interface NotesTableProps {
  notes: NoteSummary[];
  onView: (noteId: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat('en-SG', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function NotesTable({ notes, onView }: NotesTableProps) {
  return (
    <table className="ledger">
      <thead>
        <tr>
          <th className="col-id" scope="col">
            ID
          </th>
          <th scope="col">Client Name</th>
          <th className="col-date" scope="col">
            Created At
          </th>
          <th className="col-actions" scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {notes.map((note) => (
          <tr key={note.id}>
            <td className="cell-id">{note.id}</td>
            <td className="cell-client">
              {note.clientName}
              <small>{note.clientId}</small>
            </td>
            <td className="cell-date">
              {dateFormatter.format(new Date(note.createdAt))}
            </td>
            <td className="col-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onView(note.id)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
