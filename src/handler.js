const { nanoid } = require('nanoid');

const books = require('./books');

const addBook = (request, h) => {
  // menangkap request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // error jika menambahkan buku tanpa nama
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  // error jika readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  // membuat atribut tambahan
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // menyatukan ke newBook
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // menambahkan buku
  books.push(newBook);

  // memastikan buku sudah ditambahkan
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // respon berhasil
  if (isSuccess) {
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
  }
  // respon gagal
  return h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
};

const getAllBooks = (request, h) => {
  // menangkap request query
  const { finished, reading, name } = request.query;

  // variable yang akan dijadikan output
  let result = books;

  // handler query name
  if (name !== undefined) {
    result = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
  }

  // handler query finished
  if (finished !== undefined) {
    const bool = finished === '1';
    result = books
      .filter((b) => b.reading === bool)
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
  }

  // handler query reading
  if (reading !== undefined) {
    const bool = reading === '1';
    result = books
      .filter((b) => b.reading === bool)
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
  }

  // response output
  return h.response({
    status: 'success',
    data: {
      books: result.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
};

const getBookById = (request, h) => {
  // menangkap id
  const { id } = request.params;

  // memastikan book ada
  const book = books.filter((b) => b.id === id)[0];

  // respon berhasil
  if (book) {
    return h
      .response({
        status: 'success',
        data: {
          book: books.filter((b) => b.id === id)[0],
        },
      })
      .code(200);
  }
  // respon gagal
  return h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
};

const editBookById = (request, h) => {
  // menangkap parameter id
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // error jika mengubah buku tanpa nama
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  // error jika readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }
  // mengubah atribut tambahan
  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount;

  // melacak letak buku dengan indexing
  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    // respon berhasil
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  }

  // apabila id tidak ditemukan
  return h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
};

const deleteBookById = (request, h) => {
  // menangkap params id
  const { id } = request.params;

  // menemukan letak buku berdasarkan index
  const index = books.findIndex((b) => b.id === id);

  // respon jika id ditemukan
  if (index !== -1) {
    books.splice(index, 1);
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  }

  // respon gagal
  return h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
