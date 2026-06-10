const state = {
    lang: localStorage.getItem('bookCatalogLang') || 'ru',
    authors: [],
    genres: [],
    books: [],
    db: null
};

const MIN_BOOK_YEAR = 1400;
const MAX_BOOK_YEAR = new Date().getFullYear();

const BASE_COUNTRIES = [
    'Россия', 'Беларусь', 'Украина', 'Казахстан', 'Армения', 'Грузия', 'Азербайджан',
    'Великобритания', 'США', 'Франция', 'Германия', 'Италия', 'Испания', 'Швеция',
    'Норвегия', 'Дания', 'Финляндия', 'Польша', 'Чехия', 'Япония', 'Китай',
    'Южная Корея', 'Индия', 'Бразилия', 'Аргентина', 'Канада', 'Австралия'
];

const i18n = {
    ru: {
        lab: 'Лабораторная работа №3',
        title: 'Панель управления книжной базой данных',
        subtitle: 'Здесь можно просматривать таблицы и менять данные в базе через CRUD-операции.',
        language: 'Язык',
        openSwagger: 'Открыть Swagger',
        whatIsHere: 'Что можно делать на этой странице',
        viewTablesTitle: 'Просмотр таблиц',
        viewTablesText: 'Можно посмотреть таблицы «Авторы», «Книги», «Жанры» и «Связи книга-жанр» прямо в браузере.',
        changeDbTitle: 'Изменение БД',
        changeDbText: 'Можно добавлять, редактировать и удалять авторов, книги и жанры.',
        relationsTitle: 'Связи',
        relationsText: 'Видно связь один-ко-многим «Автор → Книги» и многие-ко-многим «Книги ↔ Жанры».',
        crudBlock: 'CRUD-блок',
        editData: 'Внесение изменений в базу данных',
        refresh: 'Обновить данные',
        authors: 'Авторы',
        genres: 'Жанры',
        books: 'Книги',
        relations: 'Связи книга-жанр',
        allTables: 'Все таблицы',
        authorFormTitle: 'Добавить / изменить автора',
        authorName: 'ФИО автора',
        authorNamePlaceholder: 'Например: Лев Толстой',
        country: 'Страна',
        countryPlaceholder: 'Например: Россия',
        saveAuthor: 'Сохранить автора',
        clear: 'Очистить',
        authorHint: 'Если нажать «Изменить» в таблице, данные попадут в эту форму.',
        authorsTable: 'Таблица «Авторы»',
        genreFormTitle: 'Добавить / изменить жанр',
        genreName: 'Название жанра',
        genreNamePlaceholder: 'Например: Роман',
        saveGenre: 'Сохранить жанр',
        genresTable: 'Таблица «Жанры»',
        genreHint: 'Если нажать «Изменить» в таблице, данные попадут в эту форму.',
        bookFormTitle: 'Добавить / изменить книгу',
        bookTitle: 'Название книги',
        bookTitlePlaceholder: 'Например: Война и мир',
        year: 'Год',
        yearPlaceholder: 'Например: 1869',
        bookAuthor: 'Автор',
        bookGenres: 'Жанры',
        saveBook: 'Сохранить книгу',
        bookHint: 'Сначала создайте автора и жанры, потом добавляйте книгу.',
        booksTable: 'Таблица «Книги» с автором и жанрами',
        relationFormTitle: 'Изменить связь «Книга — жанр»',
        selectBook: 'Книга',
        selectGenre: 'Жанр',
        addRelation: 'Добавить связь',
        removeRelation: 'Удалить связь',
        relationHint: 'Одна строка в таблице связей означает: выбранная книга относится к выбранному жанру.',
        bookGenresTable: 'Таблица «Связи книга-жанр»',
        allTablesTitle: 'Просмотр всех таблиц базы данных',
        allTablesHint: 'В этом разделе показана структура базы: основные таблицы и промежуточная таблица, через которую реализована связь «Книги ↔ Жанры».',
        id: 'ID',
        fullName: 'ФИО',
        actions: 'Действия',
        edit: 'Изменить',
        delete: 'Удалить',
        name: 'Название',
        author: 'Автор',
        book: 'Книга',
        genre: 'Жанр',
        noData: 'Данных пока нет.',
        notSelected: 'Не выбрано',
        selectAuthorFirst: 'Сначала добавьте автора.',
        selectGenreFirst: 'Сначала добавьте жанр.',
        saved: 'Данные сохранены.',
        deleted: 'Запись удалена.',
        relationAdded: 'Связь добавлена.',
        relationRemoved: 'Связь удалена.',
        loaded: 'Данные обновлены.',
        error: 'Ошибка',
        confirmDelete: 'Удалить запись?',
        confirmDeleteAuthor: 'Удалить автора? Его книги тоже удалятся из-за каскадного удаления.',
        confirmDeleteGenre: 'Удалить жанр?',
        confirmDeleteBook: 'Удалить книгу?',
        authorCount: 'Авторов',
        bookCount: 'Книг',
        genreCount: 'Жанров',
        relationCount: 'Связей книга-жанр',
        rawAuthorsTitle: 'Авторы',
        rawBooksTitle: 'Книги',
        rawGenresTitle: 'Жанры',
        rawBookGenresTitle: 'Связи книга-жанр',
        bookId: 'ID книги',
        genreId: 'ID жанра',
        authorId: 'ID автора',
        authorName: 'Автор',
        genreName: 'Жанр',
        titleColumn: 'Название',
        yearMustBePositiveInteger: `Год должен быть целым числом. Значения меньше ${MIN_BOOK_YEAR} автоматически заменяются на ${MIN_BOOK_YEAR}, а значения больше ${MAX_BOOK_YEAR} — на ${MAX_BOOK_YEAR}.`
    },
    en: {
        lab: 'Laboratory work #3',
        title: 'Book database control panel',
        subtitle: 'Use this page to view tables and change database records through CRUD operations.',
        language: 'Language',
        openSwagger: 'Open Swagger',
        whatIsHere: 'What you can do here',
        viewTablesTitle: 'View tables',
        viewTablesText: 'You can view Authors, Books, Genres and BookGenres directly in the browser.',
        changeDbTitle: 'Change the database',
        changeDbText: 'You can create, edit and delete authors, books and genres.',
        relationsTitle: 'Relations',
        relationsText: 'The page shows one-to-many Author → Books and many-to-many Books ↔ Genres relations.',
        crudBlock: 'CRUD section',
        editData: 'Changing database records',
        refresh: 'Refresh data',
        authors: 'Authors',
        genres: 'Genres',
        books: 'Books',
        relations: 'Book-genre relations',
        allTables: 'All tables',
        authorFormTitle: 'Add / edit author',
        authorName: 'Author full name',
        authorNamePlaceholder: 'Example: Leo Tolstoy',
        country: 'Country',
        countryPlaceholder: 'Example: Russia',
        saveAuthor: 'Save author',
        clear: 'Clear',
        authorHint: 'Click “Edit” in the table to load data into this form.',
        authorsTable: 'Authors table',
        genreFormTitle: 'Add / edit genre',
        genreName: 'Genre name',
        genreNamePlaceholder: 'Example: Novel',
        saveGenre: 'Save genre',
        genresTable: 'Genres table',
        genreHint: 'Click “Edit” in the table to load data into this form.',
        bookFormTitle: 'Add / edit book',
        bookTitle: 'Book title',
        bookTitlePlaceholder: 'Example: War and Peace',
        year: 'Year',
        yearPlaceholder: 'Example: 1869',
        bookAuthor: 'Author',
        bookGenres: 'Genres',
        saveBook: 'Save book',
        bookHint: 'Create authors and genres first, then add a book.',
        booksTable: 'Books table with author and genres',
        relationFormTitle: 'Edit BookGenres relation',
        selectBook: 'Book',
        selectGenre: 'Genre',
        addRelation: 'Add relation',
        removeRelation: 'Remove relation',
        relationHint: 'One BookGenres row means: the selected book belongs to the selected genre.',
        bookGenresTable: 'BookGenres table',
        allTablesTitle: 'View all database tables',
        allTablesHint: 'This section shows the database structure: the main tables and the junction table that implements the Books ↔ Genres relation.',
        id: 'ID',
        fullName: 'Full name',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        name: 'Name',
        author: 'Author',
        book: 'Book',
        genre: 'Genre',
        noData: 'No data yet.',
        notSelected: 'Not selected',
        selectAuthorFirst: 'Add an author first.',
        selectGenreFirst: 'Add a genre first.',
        saved: 'Data saved.',
        deleted: 'Record deleted.',
        relationAdded: 'Relation added.',
        relationRemoved: 'Relation removed.',
        loaded: 'Data refreshed.',
        error: 'Error',
        confirmDelete: 'Delete this record?',
        confirmDeleteAuthor: 'Delete this author? The author books will also be deleted because of cascade delete.',
        confirmDeleteGenre: 'Delete this genre?',
        confirmDeleteBook: 'Delete this book?',
        authorCount: 'Authors',
        bookCount: 'Books',
        genreCount: 'Genres',
        relationCount: 'BookGenres relations',
        rawAuthorsTitle: 'Authors',
        rawBooksTitle: 'Books',
        rawGenresTitle: 'Genres',
        rawBookGenresTitle: 'BookGenres',
        bookId: 'Book ID',
        genreId: 'Genre ID',
        authorId: 'Author ID',
        authorName: 'Author',
        genreName: 'Genre',
        titleColumn: 'Title',
        yearMustBePositiveInteger: `The year must be an integer. Values lower than ${MIN_BOOK_YEAR} are changed to ${MIN_BOOK_YEAR}; values higher than ${MAX_BOOK_YEAR} are changed to ${MAX_BOOK_YEAR}.`
    }
};

function t(key) {
    return i18n[state.lang][key] || i18n.ru[key] || key;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizeBookYear(value) {
    const normalizedText = String(value ?? '').trim().replace(',', '.');
    const parsed = Number.parseInt(normalizedText, 10);

    if (!Number.isFinite(parsed)) {
        return MIN_BOOK_YEAR;
    }

    return Math.min(Math.max(parsed, MIN_BOOK_YEAR), MAX_BOOK_YEAR);
}

function renderScrollText(value, extraClass = '') {
    const text = escapeHtml(value || '-');
    return `<div class="cell-scroll scroll-x-on-wheel ${extraClass}" title="${text}">${text}</div>`;
}

function renderScrollList(items, getText) {
    if (!items || !items.length) return '-';

    return `
        <div class="cell-list-scroll">
            ${items.map(item => {
                const text = escapeHtml(getText(item) || '-');
                return `<div class="cell-list-item scroll-x-on-wheel" title="${text}">${text}</div>`;
            }).join('')}
        </div>
    `;
}

function renderGenreBadges(genres) {
    if (!genres || !genres.length) return '-';

    return `
        <div class="genre-badges-scroll scroll-x-on-wheel">
            ${genres.map(genre => {
                const text = escapeHtml(genre.name || '-');
                return `<span class="genre-badge" title="${text}">${text}</span>`;
            }).join('')}
        </div>
    `;
}

function updateCountrySuggestions() {
    const datalist = document.getElementById('countrySuggestions');
    if (!datalist) return;

    const countriesFromDb = state.authors
        .map(author => author.country)
        .filter(Boolean);

    const countries = Array.from(new Set([...BASE_COUNTRIES, ...countriesFromDb]))
        .sort((a, b) => a.localeCompare(b, state.lang === 'ru' ? 'ru' : 'en'));

    datalist.innerHTML = countries
        .map(country => `<option value="${escapeHtml(country)}"></option>`)
        .join('');
}

function showStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status visible ${type}`;
    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(() => {
        status.className = 'status';
        status.textContent = '';
    }, 3500);
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const text = await response.text();
    let body = null;

    if (text) {
        try {
            body = JSON.parse(text);
        } catch {
            body = text;
        }
    }

    if (!response.ok) {
        const message = typeof body === 'string' ? body : JSON.stringify(body);
        throw new Error(message || `${response.status} ${response.statusText}`);
    }

    return body;
}

async function loadData(showMessage = false) {
    try {
        const [authors, genres, books, db] = await Promise.all([
            request('/api/authors'),
            request('/api/genres'),
            request('/api/books'),
            request('/api/database/tables')
        ]);

        state.authors = authors || [];
        state.genres = genres || [];
        state.books = books || [];
        state.db = db || null;

        renderAll();
        if (showMessage) showStatus(t('loaded'));
    } catch (error) {
        showStatus(`${t('error')}: ${error.message}`, 'error');
    }
}

function applyLanguage() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.getElementById('languageSelect').value = state.lang;
    renderAll();
}

function renderAll() {
    renderStats();
    renderSelects();
    updateCountrySuggestions();
    renderAuthorsTable();
    renderGenresTable();
    renderBooksTable();
    renderRelationsTable();
    renderRawTables();
}

function renderStats() {
    const stats = state.db?.stats || {
        authors: state.authors.length,
        books: state.books.length,
        genres: state.genres.length,
        bookGenres: 0
    };

    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card"><span class="stat-value">${stats.authors ?? 0}</span><span class="stat-label">${t('authorCount')}</span></div>
        <div class="stat-card"><span class="stat-value">${stats.books ?? 0}</span><span class="stat-label">${t('bookCount')}</span></div>
        <div class="stat-card"><span class="stat-value">${stats.genres ?? 0}</span><span class="stat-label">${t('genreCount')}</span></div>
        <div class="stat-card"><span class="stat-value">${stats.bookGenres ?? 0}</span><span class="stat-label">${t('relationCount')}</span></div>
    `;
}

function renderSelects() {
    const authorOptions = state.authors.length
        ? state.authors.map(a => `<option value="${a.id}">${escapeHtml(a.fullName)}${a.country ? ` (${escapeHtml(a.country)})` : ''}</option>`).join('')
        : `<option value="">${t('selectAuthorFirst')}</option>`;

    document.getElementById('bookAuthor').innerHTML = authorOptions;

    const genreCheckboxes = state.genres.length
        ? state.genres.map(g => `
            <label class="checkbox-item">
                <input type="checkbox" name="bookGenre" value="${g.id}" />
                <span>${escapeHtml(g.name)}</span>
            </label>
        `).join('')
        : `<span class="hint">${t('selectGenreFirst')}</span>`;

    document.getElementById('bookGenresCheckboxes').innerHTML = genreCheckboxes;

    document.getElementById('relationBook').innerHTML = state.books.length
        ? state.books.map(b => `<option value="${b.id}">${escapeHtml(b.title)}</option>`).join('')
        : `<option value="">${t('noData')}</option>`;

    document.getElementById('relationGenre').innerHTML = state.genres.length
        ? state.genres.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')
        : `<option value="">${t('noData')}</option>`;
}

function tableOrEmpty(rows, tableHtml) {
    return rows.length ? tableHtml : `<div class="empty-state">${t('noData')}</div>`;
}

function renderAuthorsTable() {
    const rows = state.authors;
    document.getElementById('authorsTable').innerHTML = tableOrEmpty(rows, `
        <table class="data-table authors-data-table">
            <thead><tr><th>${t('id')}</th><th>${t('fullName')}</th><th>${t('country')}</th><th>${t('books')}</th><th>${t('actions')}</th></tr></thead>
            <tbody>
                ${rows.map(a => `
                    <tr>
                        <td>${a.id}</td>
                        <td>${renderScrollText(a.fullName)}</td>
                        <td>${renderScrollText(a.country || '-')}</td>
                        <td>${renderScrollList(a.books || [], b => b.title)}</td>
                        <td class="actions-cell">
                            <div class="actions-buttons">
                                <button class="small-btn" onclick="editAuthor(${a.id})">${t('edit')}</button>
                                <button class="small-btn danger" onclick="deleteAuthor(${a.id})">${t('delete')}</button>
                            </div>
                        </td>
                    </tr>`).join('')}
            </tbody>
        </table>
    `);
}

function renderGenresTable() {
    const rows = state.genres;
    document.getElementById('genresTable').innerHTML = tableOrEmpty(rows, `
        <table class="data-table genres-data-table">
            <thead><tr><th>${t('id')}</th><th>${t('name')}</th><th>${t('books')}</th><th>${t('actions')}</th></tr></thead>
            <tbody>
                ${rows.map(g => `
                    <tr>
                        <td>${g.id}</td>
                        <td>${renderScrollText(g.name)}</td>
                        <td>${renderScrollList(g.books || [], b => b.title)}</td>
                        <td class="actions-cell">
                            <div class="actions-buttons">
                                <button class="small-btn" onclick="editGenre(${g.id})">${t('edit')}</button>
                                <button class="small-btn danger" onclick="deleteGenre(${g.id})">${t('delete')}</button>
                            </div>
                        </td>
                    </tr>`).join('')}
            </tbody>
        </table>
    `);
}

function renderBooksTable() {
    const rows = state.books;
    document.getElementById('booksTable').innerHTML = tableOrEmpty(rows, `
        <table class="data-table books-data-table">
            <thead><tr><th>${t('id')}</th><th>${t('bookTitle')}</th><th>${t('year')}</th><th>${t('author')}</th><th>${t('genres')}</th><th>${t('actions')}</th></tr></thead>
            <tbody>
                ${rows.map(b => `
                    <tr>
                        <td>${b.id}</td>
                        <td>${renderScrollText(b.title)}</td>
                        <td>${b.year}</td>
                        <td>${renderScrollText(b.author?.fullName || '-')}</td>
                        <td>${renderGenreBadges(b.genres || [])}</td>
                        <td class="actions-cell">
                            <div class="actions-buttons">
                                <button class="small-btn" onclick="editBook(${b.id})">${t('edit')}</button>
                                <button class="small-btn danger" onclick="deleteBook(${b.id})">${t('delete')}</button>
                            </div>
                        </td>
                    </tr>`).join('')}
            </tbody>
        </table>
    `);
}

function renderRelationsTable() {
    const rows = state.db?.bookGenres || [];
    document.getElementById('bookGenresTable').innerHTML = tableOrEmpty(rows, `
        <table>
            <thead><tr><th>${t('bookId')}</th><th>${t('book')}</th><th>${t('genreId')}</th><th>${t('genre')}</th></tr></thead>
            <tbody>
                ${rows.map(r => `
                    <tr>
                        <td>${r.bookId}</td>
                        <td>${renderScrollText(r.bookTitle || '-')}</td>
                        <td>${r.genreId}</td>
                        <td>${renderScrollText(r.genreName || '-')}</td>
                    </tr>`).join('')}
            </tbody>
        </table>
    `);
}

function simpleTable(rows, columns) {
    return tableOrEmpty(rows, `
        <table>
            <thead><tr>${columns.map(c => `<th>${escapeHtml(c.header)}</th>`).join('')}</tr></thead>
            <tbody>
                ${rows.map(row => `
                    <tr>${columns.map(c => `<td>${renderScrollText(row[c.key] ?? '-')}</td>`).join('')}</tr>
                `).join('')}
            </tbody>
        </table>
    `);
}

function renderRawTables() {
    const db = state.db || { authors: [], books: [], genres: [], bookGenres: [] };

    document.getElementById('rawAuthorsTable').innerHTML = simpleTable(db.authors || [], [
        { key: 'id', header: t('id') },
        { key: 'fullName', header: t('fullName') },
        { key: 'country', header: t('country') }
    ]);

    document.getElementById('rawBooksTable').innerHTML = simpleTable(db.books || [], [
        { key: 'id', header: t('id') },
        { key: 'title', header: t('titleColumn') },
        { key: 'year', header: t('year') },
        { key: 'authorId', header: t('authorId') },
        { key: 'authorName', header: t('authorName') }
    ]);

    document.getElementById('rawGenresTable').innerHTML = simpleTable(db.genres || [], [
        { key: 'id', header: t('id') },
        { key: 'name', header: t('name') }
    ]);

    document.getElementById('rawBookGenresTable').innerHTML = simpleTable(db.bookGenres || [], [
        { key: 'bookId', header: t('bookId') },
        { key: 'bookTitle', header: t('book') },
        { key: 'genreId', header: t('genreId') },
        { key: 'genreName', header: t('genreName') }
    ]);
}

function clearAuthorForm() {
    document.getElementById('authorId').value = '';
    document.getElementById('authorFullName').value = '';
    document.getElementById('authorCountry').value = '';
}

function clearGenreForm() {
    document.getElementById('genreId').value = '';
    document.getElementById('genreName').value = '';
}

function clearBookForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookYear').value = '';
    if (state.authors[0]) document.getElementById('bookAuthor').value = state.authors[0].id;
    document.querySelectorAll('input[name="bookGenre"]').forEach(input => input.checked = false);
}

window.editAuthor = function (id) {
    const author = state.authors.find(a => a.id === id);
    if (!author) return;
    document.getElementById('authorId').value = author.id;
    document.getElementById('authorFullName').value = author.fullName || '';
    document.getElementById('authorCountry').value = author.country || '';
    document.querySelector('[data-tab="authors"]').click();
};

window.deleteAuthor = async function (id) {
    if (!confirm(t('confirmDeleteAuthor'))) return;
    try {
        await request(`/api/authors/${id}`, { method: 'DELETE' });
        clearAuthorForm();
        await loadData();
        showStatus(t('deleted'));
    } catch (error) {
        showStatus(`${t('error')}: ${error.message}`, 'error');
    }
};

window.editGenre = function (id) {
    const genre = state.genres.find(g => g.id === id);
    if (!genre) return;
    document.getElementById('genreId').value = genre.id;
    document.getElementById('genreName').value = genre.name || '';
    document.querySelector('[data-tab="genres"]').click();
};

window.deleteGenre = async function (id) {
    if (!confirm(t('confirmDeleteGenre'))) return;
    try {
        await request(`/api/genres/${id}`, { method: 'DELETE' });
        clearGenreForm();
        await loadData();
        showStatus(t('deleted'));
    } catch (error) {
        showStatus(`${t('error')}: ${error.message}`, 'error');
    }
};

window.editBook = function (id) {
    const book = state.books.find(b => b.id === id);
    if (!book) return;
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title || '';
    document.getElementById('bookYear').value = book.year || '';
    document.getElementById('bookAuthor').value = book.author?.authorId || '';

    const selectedGenreIds = (book.genres || []).map(g => String(g.genreId));
    document.querySelectorAll('input[name="bookGenre"]').forEach(input => {
        input.checked = selectedGenreIds.includes(input.value);
    });

    document.querySelector('[data-tab="books"]').click();
};

window.deleteBook = async function (id) {
    if (!confirm(t('confirmDeleteBook'))) return;
    try {
        await request(`/api/books/${id}`, { method: 'DELETE' });
        clearBookForm();
        await loadData();
        showStatus(t('deleted'));
    } catch (error) {
        showStatus(`${t('error')}: ${error.message}`, 'error');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('languageSelect').addEventListener('change', event => {
        state.lang = event.target.value;
        localStorage.setItem('bookCatalogLang', state.lang);
        applyLanguage();
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
        });
    });

    document.getElementById('refreshBtn').addEventListener('click', () => loadData(true));
    document.getElementById('clearAuthorBtn').addEventListener('click', clearAuthorForm);
    document.getElementById('clearGenreBtn').addEventListener('click', clearGenreForm);
    document.getElementById('clearBookBtn').addEventListener('click', clearBookForm);

    const bookYearInput = document.getElementById('bookYear');
    bookYearInput.min = MIN_BOOK_YEAR;
    bookYearInput.max = MAX_BOOK_YEAR;
    bookYearInput.addEventListener('blur', () => {
        bookYearInput.value = normalizeBookYear(bookYearInput.value);
    });

    document.addEventListener('wheel', event => {
        const scroller = event.target.closest('.scroll-x-on-wheel');
        if (!scroller) return;

        const canScrollX = scroller.scrollWidth > scroller.clientWidth;
        const canScrollY = scroller.scrollHeight > scroller.clientHeight;

        if (canScrollX && !canScrollY && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            scroller.scrollLeft += event.deltaY;
            event.preventDefault();
        }
    }, { passive: false });

    document.getElementById('authorForm').addEventListener('submit', async event => {
        event.preventDefault();
        const id = document.getElementById('authorId').value;
        const body = {
            fullName: document.getElementById('authorFullName').value.trim(),
            country: document.getElementById('authorCountry').value.trim() || null
        };

        try {
            await request(id ? `/api/authors/${id}` : '/api/authors', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(body)
            });
            clearAuthorForm();
            await loadData();
            showStatus(t('saved'));
        } catch (error) {
            showStatus(`${t('error')}: ${error.message}`, 'error');
        }
    });

    document.getElementById('genreForm').addEventListener('submit', async event => {
        event.preventDefault();
        const id = document.getElementById('genreId').value;
        const body = {
            name: document.getElementById('genreName').value.trim()
        };

        try {
            await request(id ? `/api/genres/${id}` : '/api/genres', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(body)
            });
            clearGenreForm();
            await loadData();
            showStatus(t('saved'));
        } catch (error) {
            showStatus(`${t('error')}: ${error.message}`, 'error');
        }
    });

    document.getElementById('bookForm').addEventListener('submit', async event => {
        event.preventDefault();
        const id = document.getElementById('bookId').value;
        const genreIds = Array.from(document.querySelectorAll('input[name="bookGenre"]:checked'))
            .map(input => Number(input.value));

        const yearInput = document.getElementById('bookYear');
        const normalizedYear = normalizeBookYear(yearInput.value);
        if (String(yearInput.value).trim() !== String(normalizedYear)) {
            yearInput.value = normalizedYear;
            showStatus(t('yearMustBePositiveInteger'), 'error');
        }

        const body = {
            title: document.getElementById('bookTitle').value.trim(),
            year: normalizedYear,
            authorId: Number(document.getElementById('bookAuthor').value),
            genreIds
        };

        try {
            await request(id ? `/api/books/${id}` : '/api/books', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(body)
            });
            clearBookForm();
            await loadData();
            showStatus(t('saved'));
        } catch (error) {
            showStatus(`${t('error')}: ${error.message}`, 'error');
        }
    });

    document.getElementById('addRelationBtn').addEventListener('click', async () => {
        const bookId = document.getElementById('relationBook').value;
        const genreId = document.getElementById('relationGenre').value;
        if (!bookId || !genreId) return;

        try {
            await request(`/api/books/${bookId}/genres/${genreId}`, { method: 'POST' });
            await loadData();
            showStatus(t('relationAdded'));
        } catch (error) {
            showStatus(`${t('error')}: ${error.message}`, 'error');
        }
    });

    document.getElementById('removeRelationBtn').addEventListener('click', async () => {
        const bookId = document.getElementById('relationBook').value;
        const genreId = document.getElementById('relationGenre').value;
        if (!bookId || !genreId) return;

        try {
            await request(`/api/books/${bookId}/genres/${genreId}`, { method: 'DELETE' });
            await loadData();
            showStatus(t('relationRemoved'));
        } catch (error) {
            showStatus(`${t('error')}: ${error.message}`, 'error');
        }
    });

    applyLanguage();
    loadData();
});
