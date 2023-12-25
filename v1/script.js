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

// LINK TO APP SAMPLE DATA: https://docs.google.com/spreadsheets/d/1eeldcA_OwP4DHYEvjG0kDe0cRys-cDPhc_E9P9G1e3I/edit#gid=0

// 👍 🤯 ⛔️

const btn = document.querySelector('.btn-open');
const form = document.querySelector('.fact-form');
const factsList = document.querySelector('.facts-list');

// factsList.innerHTML = '';
// factsList.insertAdjacentElement('afterbegin', '<li>Loading...</li>');

btn.addEventListener('click', () => {
  if (form.classList.contains('hidden')) {
    form.classList.remove('hidden');
    btn.textContent = 'Close';
  } else {
    form.classList.add('hidden');
    btn.textContent = 'Share a Fact';
  }
});

async function loadFacts() {
  const res = await fetch(
    'https://qrkvwcyagaedvnoakzpv.supabase.co/rest/v1/facts',
    {
      headers: {
        apikey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3Z3Y3lhZ2FlZHZub2FrenB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxMjIxMTMsImV4cCI6MjAxODY5ODExM30.HS3Tgj11RriL_D3MrqaXzuonmQR5ZDXM9hMocb7JKEM',
        authorization:
          'BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3Z3Y3lhZ2FlZHZub2FrenB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxMjIxMTMsImV4cCI6MjAxODY5ODExM30.HS3Tgj11RriL_D3MrqaXzuonmQR5ZDXM9hMocb7JKEM',
      },
    }
  );
  const data = await res.json();
  // console.log(data);
  updateFactsToHtml(data);
}
loadFacts();

function getCategoryColor(name) {
  // Find the category object by name and return its color
  const category = CATEGORIES.find((cat) => cat.name === name);
  return category ? category.color : '#000'; // Default to black if not found
}

function updateFactsToHtml(facts) {
  const factsList = document.getElementById('facts-list');
  // Clear existing list items
  factsList.innerHTML = '';

  // Loop through each fact and create list items
  facts.forEach((fact) => {
    const listItem = document.createElement('li');
    listItem.className = 'fact';

    const paragraph = document.createElement('p');
    paragraph.innerHTML = `${fact.text} <a class="source" href="${fact.source}" target="_blank">(Source)</a>`;

    const span = document.createElement('span');
    span.className = 'tag';
    span.style.backgroundColor = getCategoryColor(fact.category);
    span.textContent = fact.category;

    const voteButtons = document.createElement('div');
    voteButtons.className = 'vote-buttons';

    // Create buttons for each type of vote
    const voteTypes = ['Interesting', 'Mindblowing', 'False'];
    voteTypes.forEach((type) => {
      const button = document.createElement('button');
      const voteCount = fact[`votes${type}`];
      button.innerHTML = `${
        type === 'Interesting' ? '👍' : type === 'Mindblowing' ? '🤯' : '⛔️'
      } <strong>${voteCount}</strong>`;
      voteButtons.appendChild(button);
    });

    // Append elements to list item
    listItem.appendChild(paragraph);
    listItem.appendChild(span);
    listItem.appendChild(voteButtons);

    // Append list item to the list
    factsList.appendChild(listItem);
  });
}

// Call the function with the initialFacts data
// updateFactsToHtml(initialFacts);

function updateCategoriesToHtml() {
  const categoriesList = document.querySelector('aside ul');

  // Start by only clearing the categories after the first 'All' button
  while (categoriesList.children.length > 1) {
    categoriesList.removeChild(categoriesList.lastChild);
  }

  // Dynamically create category buttons from the CATEGORIES array
  CATEGORIES.forEach((category) => {
    const listItem = document.createElement('li');
    listItem.className = 'category';

    const button = document.createElement('button');
    button.className = 'btn btn-category';
    button.textContent =
      category.name.charAt(0).toUpperCase() + category.name.slice(1); // Capitalize the first letter
    button.style.backgroundColor = category.color;

    // Append button to list item and list item to the list
    listItem.appendChild(button);
    categoriesList.appendChild(listItem);
  });
}

// Call the function to update the categories in the HTML
updateCategoriesToHtml();
