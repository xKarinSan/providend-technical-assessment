import { useCallback, useEffect, useState } from 'react';
import { listNotes, listUsers, type PaginatedNotes, type User } from './api';
import { AddNoteModal } from './components/AddNoteModal';
import { NotesTable } from './components/NotesTable';
import { Pagination } from './components/Pagination';
import { ViewNoteModal } from './components/ViewNoteModal';
import { useCurrentUser } from './useCurrentUser';

const PAGE_SIZE = 30;

export default function App() {
  const { userId, changeUser } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [pageNo, setPageNo] = useState(0);
  const [page, setPage] = useState<PaginatedNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewingNoteId, setViewingNoteId] = useState<string | null>(null);

  // Auth is out of scope: default to the first known user so the app is usable.
  useEffect(() => {
    listUsers()
      .then((data) => {
        setUsers(data);
        if (!userId && data[0]) changeUser(data[0].id);
      })
      .catch(() => setError('Could not reach the API.'));
  }, [userId, changeUser]);

  const loadNotes = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    listNotes(userId, pageNo, PAGE_SIZE)
      .then(setPage)
      .catch(() => setError('Could not load notes.'))
      .finally(() => setLoading(false));
  }, [userId, pageNo]);

  useEffect(loadNotes, [loadNotes]);

  const notes = page?.data ?? [];

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <p className="masthead__kicker">Advisory Desk</p>
          <h1 className="masthead__title">
            Client <em>Notes</em>
          </h1>
        </div>

        <div className="masthead__aside">
          <label className="field-label" htmlFor="acting-as">
            Acting as
          </label>
          <select
            id="acting-as"
            className="select select--inline"
            value={userId ?? ''}
            onChange={(event) => {
              changeUser(event.target.value);
              setPageNo(0);
            }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="toolbar">
        <span className="toolbar__count">
          {page
            ? `${page.total_records} note${page.total_records === 1 ? '' : 's'} · page ${page.page_no + 1} of ${Math.max(page.total_pages, 1)}`
            : '—'}
        </span>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setAddOpen(true)}
          disabled={!userId}
        >
          Add note
        </button>
      </div>

      {error ? (
        <div className="state state--error">
          <p className="state__title">Something went wrong</p>
          <p>{error}</p>
        </div>
      ) : loading && !page ? (
        <div className="state">
          <p>Loading notes…</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="state">
          <p className="state__title">No notes yet</p>
          <p>Notes for the clients you are assigned to will appear here.</p>
        </div>
      ) : (
        <>
          <NotesTable notes={notes} onView={setViewingNoteId} />
          <Pagination
            pageNo={page?.page_no ?? 0}
            totalPages={page?.total_pages ?? 0}
            onChange={setPageNo}
          />
        </>
      )}

      {addOpen && userId ? (
        <AddNoteModal
          userId={userId}
          onClose={() => setAddOpen(false)}
          onCreated={() => {
            setAddOpen(false);
            if (pageNo === 0) loadNotes();
            else setPageNo(0);
          }}
        />
      ) : null}

      {viewingNoteId && userId ? (
        <ViewNoteModal
          noteId={viewingNoteId}
          userId={userId}
          onClose={() => setViewingNoteId(null)}
        />
      ) : null}
    </div>
  );
}
