const results = document.querySelector('#results');
const search = document.querySelector('#search');
const count = document.querySelector('#count');
let professionals = [];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function phoneDigits(phone) {
  return String(phone || '').replace(/[^\d+]/g, '');
}

function whatsappNumber(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `972${digits.slice(1)}`;
  return digits;
}

function externalUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed || trimmed.startsWith('@') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function card(person, index) {
  const initial = Array.from(person.name.trim())[0] || 'ק';
  const phone = phoneDigits(person.phone);
  const whatsapp = whatsappNumber(person.phone);
  const website = externalUrl(person.website);
  const social = externalUrl(person.social);
  const links = [
    website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">↗ אתר</a>` : person.website ? `<span>${escapeHtml(person.website)}</span>` : '',
    social ? `<a href="${escapeHtml(social)}" target="_blank" rel="noopener noreferrer">↗ רשת חברתית</a>` : person.social ? `<span>${escapeHtml(person.social)}</span>` : '',
  ].filter(Boolean).join('');
  const preferred = ({ whatsapp: 'whatsapp', phone: 'phone', call: 'phone', email: 'email' })[
    String(person.preferredContact || '').trim().toLowerCase()
  ];
  const actionItems = [
    phone ? { key: 'phone', html: `<a class="action action-call" href="tel:${escapeHtml(phone)}">☎ <span>התקשרות</span></a>` } : null,
    whatsapp ? { key: 'whatsapp', html: `<a class="action action-whatsapp" href="https://wa.me/${escapeHtml(whatsapp)}" target="_blank" rel="noopener noreferrer">◉ <span>WhatsApp</span></a>` } : null,
    person.email ? { key: 'email', html: `<a class="action action-email" href="mailto:${escapeHtml(person.email)}">✉ <span>שליחת מייל</span></a>` } : null,
  ].filter(Boolean);
  if (preferred) actionItems.sort((a, b) => Number(b.key === preferred) - Number(a.key === preferred));
  const actions = actionItems.map(({ key, html }) => preferred === key
    ? html.replace('class="action ', 'class="action preferred ').replace('</a>', ' <small>מועדף</small></a>')
    : html).join('');

  return `<article class="card" style="animation-delay:${Math.min(index, 8) * 35}ms">
    <div class="card-top">
      <div class="avatar" aria-hidden="true">${escapeHtml(initial)}</div>
      <div><h3>${escapeHtml(person.name)}</h3><div class="profession">${escapeHtml(person.profession)}</div></div>
      ${person.group ? `<span class="group">${escapeHtml(person.group)}</span>` : ''}
    </div>
    ${person.details ? `<p class="details">${escapeHtml(person.details)}</p>` : ''}
    ${links ? `<div class="links">${links}</div>` : ''}
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </article>`;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase('he');
  const filtered = professionals.filter((person) => person.profession.toLocaleLowerCase('he').includes(query));
  count.textContent = `${filtered.length} ${filtered.length === 1 ? 'בעל.ת מקצוע' : 'בעלי ובעלות מקצוע'}`;
  results.innerHTML = filtered.length
    ? filtered.map(card).join('')
    : '<div class="empty"><strong>לא מצאנו התאמה</strong>נסו לחפש תחום עיסוק אחר.</div>';
  results.setAttribute('aria-busy', 'false');
}

async function loadProfessionals() {
  try {
    const response = await fetch('/api/professionals');
    if (!response.ok) throw new Error('Could not load directory');
    professionals = await response.json();
    render();
  } catch {
    count.textContent = '';
    results.innerHTML = '<div class="empty"><strong>לא הצלחנו לטעון את הרשימה</strong>כדאי לרענן את העמוד בעוד רגע.</div>';
    results.setAttribute('aria-busy', 'false');
  }
}

search.addEventListener('input', render);
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    search.focus();
  }
});
loadProfessionals();
