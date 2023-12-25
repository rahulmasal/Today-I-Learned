import React, { useState, useEffect } from 'react';
import supabase from './supabase';
import './style.css';


const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source:
      'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const appTitle = 'Today I Learned';
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrntCategory] = useState('all');

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from('facts').select('*');
        if (currentCategory !== 'all')
          query = query.eq('category', currentCategory);

        const { data: facts, error } = await query
          .order('votesInteresting', { ascending: false })
          .limit(25);
        console.log(error);
        if (!error) setFacts(facts);
        else alert('There was a problem getting data');
        // setFacts(facts);
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      {/* HEADER */}
      <Header title={appTitle} setShowForm={setShowForm} showForm={showForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrntCategory={setCurrntCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ title, setShowForm, showForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img
          src="https://i.imgur.com/KWy9TtL.png"
          title="source: imgur.com"
          height="68"
          width="68"
          alt="Today I learned Logo"
        />
        <h1>{title}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? 'close' : 'Share a fact'}
      </button>
    </header>
  );
}
const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

function isValidURL(url) {
  // Regular expression to check URL validity
  const urlRegex = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return urlRegex.test(url);
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState('');
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, category);

    if (text && isValidURL(source) && category && textLength <= 200) {
      // const newFact = {
      //   id: Math.round(Math.random() * 100000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);
      if (!error) {
        setFacts((facts) => [newFact[0], ...facts]);
      }
      setText('');
      setSource('');
      setCategory('');
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        value={source}
        placeholder="Source of Information like . https://example.com"
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        name=""
        id=""
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        POST
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrntCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrntCategory('all')}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrntCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length == 0) {
    return (
      <p className="message">
        No facts for this category yet! create the first one 🧑‍💻
      </p>
    );
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database.</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select();
    setIsUpdating(false);
    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
  }
  // console.log(props);

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ DISPUTED]</span> : null}
        {fact.text};
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>

      <div className="vote-buttons">
        <button
          onClick={() => handleVote('votesInteresting')}
          disabled={isUpdating}
        >
          👍<strong>{fact.votesInteresting}</strong>
        </button>
        <button
          onClick={() => handleVote('votesMindblowing')}
          disabled={isUpdating}
        >
          🤯 <strong>{fact.votesMindblowing}</strong>
        </button>
        <button onClick={() => handleVote('votesFalse')} disabled={isUpdating}>
          ⛔️ <strong>{fact.votesFalse}</strong>
        </button>
      </div>
    </li>
  );
}
