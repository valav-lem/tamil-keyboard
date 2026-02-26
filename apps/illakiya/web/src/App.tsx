import { useEffect, useMemo, useRef, useState } from 'react';

type AppView = 'editor' | 'tutor';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

type Lesson = {
  id: string;
  title: string;
  goal: string;
  keys: string[];
};

const STORAGE_KEY = 'illakiya.v2.notes';

const lessons: Lesson[] = [
  {
    id: 'vowels',
    title: 'உயிரெழுத்து பயிற்சி',
    goal: 'குறில் உயிர்களை ஒழுங்காகப் பயிற்சி செய்யுங்கள்: அ இ உ எ ஒ',
    keys: ['அ', 'இ', 'உ', 'எ', 'ஒ'],
  },
  {
    id: 'consonants',
    title: 'மெய்யெழுத்து வலிமை',
    goal: 'வல்லின வரிசையை மீண்டும் மீண்டும் தட்டச்சு செய்யுங்கள்: க் ச் ட் த் ப் ற்',
    keys: ['க்', 'ச்', 'ட்', 'த்', 'ப்', 'ற்'],
  },
  {
    id: 'uyirmei',
    title: 'உயிர்மெய் சேர்க்கை',
    goal: 'இணைப்பைப் பயிற்சி செய்யுங்கள்: க் + அ, த் + இ, ம் + உ',
    keys: ['க்', 'அ', 'த்', 'இ', 'ம்', 'உ'],
  },
];

const keyboardRows: string[][] = [
  ['க்', 'ச்', 'ட்', 'த்', 'ப்', 'ற்'],
  ['ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்'],
  ['ங்', 'ஞ்', 'ண்', 'ந்', 'ம்', 'ன்'],
  ['அ', 'இ', 'உ', 'எ', 'ஒ'],
];

const meiToUyirBase: Record<string, string> = {
  'க்': 'க',
  'ச்': 'ச',
  'ட்': 'ட',
  'த்': 'த',
  'ப்': 'ப',
  'ற்': 'ற',
  'ய்': 'ய',
  'ர்': 'ர',
  'ல்': 'ல',
  'வ்': 'வ',
  'ழ்': 'ழ',
  'ள்': 'ள',
  'ங்': 'ங',
  'ஞ்': 'ஞ',
  'ண்': 'ண',
  'ந்': 'ந',
  'ம்': 'ம',
  'ன்': 'ன',
};

const vowelSigns: Record<string, string> = {
  அ: '',
  இ: 'ி',
  உ: 'ு',
  எ: 'ெ',
  ஒ: 'ொ',
};

const shortVowels = new Set(Object.keys(vowelSigns));

function createNote(partial?: Partial<Note>): Note {
  const now = Date.now();
  return {
    id: partial?.id ?? String(now),
    title: partial?.title ?? 'தலைப்பில்லா குறிப்பு',
    content: partial?.content ?? '# புதிய குறிப்பு\n\nஇங்கே எழுதத் தொடங்குங்கள்...',
    updatedAt: partial?.updatedAt ?? now,
  };
}

function parseNotes(raw: string | null): Note[] {
  if (!raw) {
    return [createNote({ title: 'வரவேற்பு குறிப்பு' })];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [createNote({ title: 'வரவேற்பு குறிப்பு' })];
    }

    const clean = parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const value = item as Partial<Note>;
        return createNote({
          id: typeof value.id === 'string' ? value.id : undefined,
          title: typeof value.title === 'string' ? value.title : undefined,
          content: typeof value.content === 'string' ? value.content : undefined,
          updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : undefined,
        });
      });

    return clean.length ? clean : [createNote({ title: 'வரவேற்பு குறிப்பு' })];
  } catch {
    return [createNote({ title: 'வரவேற்பு குறிப்பு' })];
  }
}

function extractTags(text: string): string[] {
  const matches = text.match(/#[A-Za-z0-9_\u0B80-\u0BFF-]+/g) ?? [];
  return Array.from(new Set(matches));
}

export default function App() {
  const [view, setView] = useState<AppView>('editor');
  const [notes, setNotes] = useState<Note[]>(() => parseNotes(localStorage.getItem(STORAGE_KEY)));
  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    const loaded = parseNotes(localStorage.getItem(STORAGE_KEY));
    return loaded[0]?.id ?? createNote().id;
  });

  const activeNote = useMemo(() => {
    return notes.find((note) => note.id === activeNoteId) ?? notes[0];
  }, [notes, activeNoteId]);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes]
  );

  const activeTags = useMemo(() => extractTags(activeNote?.content ?? ''), [activeNote]);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const note = createNote();
    setNotes((prev) => [note, ...prev]);
    setActiveNoteId(note.id);
  };

  const updateActiveNote = (nextContent: string) => {
    if (!activeNote) {
      return;
    }

    setNotes((prev) =>
      prev.map((note) => {
        if (note.id !== activeNote.id) {
          return note;
        }

        const firstLine = nextContent
          .split('\n')
          .find((line) => line.trim().length > 0)
          ?.replace(/^#+\s*/, '')
          .trim();

        return {
          ...note,
          content: nextContent,
          title: firstLine || 'தலைப்பில்லா குறிப்பு',
          updatedAt: Date.now(),
        };
      })
    );
  };

  const updateActiveAndSelection = (nextContent: string, nextSelection: number) => {
    updateActiveNote(nextContent);
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) {
        return;
      }
      editor.focus();
      editor.setSelectionRange(nextSelection, nextSelection);
    });
  };

  const composePm0100 = (before: string, key: string): { before: string; inserted: string } => {
    if (!shortVowels.has(key)) {
      return { before, inserted: key };
    }

    const meiMatch = Object.keys(meiToUyirBase).find((mei) => before.endsWith(mei));
    if (!meiMatch) {
      return { before, inserted: key };
    }

    const replacedBefore = before.slice(0, -meiMatch.length);
    const uyirBase = meiToUyirBase[meiMatch];
    const sign = vowelSigns[key] ?? '';
    return { before: replacedBefore, inserted: `${uyirBase}${sign}` };
  };

  const insertTextAtCursor = (value: string) => {
    const editor = editorRef.current;
    if (!activeNote || !editor) {
      return;
    }

    const start = editor.selectionStart ?? activeNote.content.length;
    const end = editor.selectionEnd ?? activeNote.content.length;
    const before = activeNote.content.slice(0, start);
    const after = activeNote.content.slice(end);

    const composed = composePm0100(before, value);
    const next = `${composed.before}${composed.inserted}${after}`;
    const caret = composed.before.length + composed.inserted.length;
    updateActiveAndSelection(next, caret);
  };

  const backspaceAtCursor = () => {
    const editor = editorRef.current;
    if (!activeNote || !editor) {
      return;
    }

    const start = editor.selectionStart ?? activeNote.content.length;
    const end = editor.selectionEnd ?? activeNote.content.length;

    if (start !== end) {
      const next = `${activeNote.content.slice(0, start)}${activeNote.content.slice(end)}`;
      updateActiveAndSelection(next, start);
      return;
    }

    if (start <= 0) {
      return;
    }

    const before = activeNote.content.slice(0, start);
    const after = activeNote.content.slice(start);

    for (const [mei, base] of Object.entries(meiToUyirBase)) {
      for (const sign of Object.values(vowelSigns)) {
        const composed = `${base}${sign}`;
        if (composed.length > 0 && before.endsWith(composed)) {
          const reverted = `${before.slice(0, -composed.length)}${mei}`;
          const next = `${reverted}${after}`;
          updateActiveAndSelection(next, reverted.length);
          return;
        }
      }
    }

    const next = `${activeNote.content.slice(0, start - 1)}${activeNote.content.slice(start)}`;
    updateActiveAndSelection(next, start - 1);
  };

  const exportText = () => {
    if (!activeNote) {
      return;
    }

    const blob = new Blob([activeNote.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${activeNote.title || 'illakiya-note'}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const shareToWhatsapp = () => {
    if (!activeNote) {
      return;
    }
    const message = encodeURIComponent(activeNote.content.slice(0, 1500));
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const shareToSignal = () => {
    if (!activeNote) {
      return;
    }
    const message = encodeURIComponent(activeNote.content.slice(0, 1500));
    window.open(`https://signal.me/#p?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="appShell">
      <header className="topBar">
        <h1>🎵 இலக்கியா V2</h1>
        <div className="viewSwitch">
          <button className={view === 'editor' ? 'active' : ''} onClick={() => setView('editor')}>
            PM0100 திருத்தி
          </button>
          <button className={view === 'tutor' ? 'active' : ''} onClick={() => setView('tutor')}>
            தட்டச்சு பயிற்சி
          </button>
        </div>
      </header>

      {view === 'tutor' ? (
        <section className="tutorPane">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="lessonCard">
              <h2>{lesson.title}</h2>
              <p>{lesson.goal}</p>
              <div className="ghostKeys" aria-label="குறியீட்டு விசை மேலமைப்பு">
                {lesson.keys.map((key, index) => (
                  <span key={`${lesson.id}-${index}`} className="ghostKey">
                    {key}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="editorLayout withKeyboard">
          <aside className="sidebar">
            <div className="sidebarHead">
              <h2>குறிப்புகள்</h2>
              <button onClick={createNewNote}>+ புதியது</button>
            </div>
            <div className="noteList">
              {sortedNotes.map((note) => (
                <button
                  key={note.id}
                  className={note.id === activeNote?.id ? 'noteItem active' : 'noteItem'}
                  onClick={() => setActiveNoteId(note.id)}
                >
                  <strong>{note.title}</strong>
                  <span>{new Date(note.updatedAt).toLocaleString('ta-IN')}</span>
                </button>
              ))}
            </div>
          </aside>

          <article className="editorPane">
            <div className="editorToolbar">
              <div className="tagsWrap">
                {activeTags.length ? activeTags.map((tag) => <span key={tag}>{tag}</span>) : <span>#குறிச்சொல்_இல்லை</span>}
              </div>
              <div className="actions">
                <button onClick={exportText}>உரை ஏற்றுமதி</button>
                <button onClick={shareToWhatsapp}>வாட்ச்அப்</button>
                <button onClick={shareToSignal}>சிக்னல்</button>
              </div>
            </div>

            <div className="editorStack">
              <div className="editorTextWrap">
                <textarea
                  ref={editorRef}
                  className="markdownEditor"
                  value={activeNote?.content ?? ''}
                  onChange={(event) => updateActiveNote(event.target.value)}
                  placeholder="PM0100 ஆதரவு கொண்ட தமிழ் குறிப்பேடு..."
                />
                <p className="saveHint">உள்ளூரில் தானாகச் சேமிக்கப்பட்டது</p>
              </div>
            </div>
          </article>

          <aside className="keyboardDock">
            <div className="keyboardPanel attached big" aria-label="PM0100 விசைப்பலகை">
              {keyboardRows.map((row, rowIndex) => (
                <div className="keyboardRow" key={`attach-row-${rowIndex}`}>
                  {row.map((key) => (
                    <button key={`${rowIndex}-${key}`} onClick={() => insertTextAtCursor(key)}>
                      {key}
                    </button>
                  ))}
                  {rowIndex === keyboardRows.length - 1 ? (
                    <>
                      <button onClick={() => insertTextAtCursor(' ')}>⎵</button>
                      <button onClick={backspaceAtCursor}>⌫</button>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
