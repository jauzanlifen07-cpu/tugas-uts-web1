// Data dummy (pengganti server/database)
const dataPengguna = [
  { nama: "Jauzan Lifen", email: "jauzan@mail.com", password: "123456" },
  { nama: "Admin Toko", email: "admin@mail.com", password: "admin123" }
];

const dataKatalogBuku = [
  { kode: "BK001", judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Novel", harga: 85000, stok: 25, gambar: "img/buku1.svg" },
  { kode: "BK002", judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Novel", harga: 98000, stok: 14, gambar: "img/buku2.svg" },
  { kode: "BK003", judul: "Filosofi Teras", penulis: "Henry Manampiring", kategori: "Pengembangan Diri", harga: 98000, stok: 4, gambar: "img/buku3.svg" },
  { kode: "BK004", judul: "Atomic Habits", penulis: "James Clear", kategori: "Pengembangan Diri", harga: 110000, stok: 30, gambar: "img/buku4.svg" },
  { kode: "BK005", judul: "Clean Code", penulis: "Robert C. Martin", kategori: "Teknologi", harga: 350000, stok: 8, gambar: "img/buku5.svg" },
  { kode: "BK006", judul: "Eloquent JavaScript", penulis: "Marijn Haverbeke", kategori: "Teknologi", harga: 275000, stok: 12, gambar: "img/buku6.svg" },
  { kode: "BK007", judul: "Sapiens", penulis: "Yuval Noah Harari", kategori: "Sejarah", harga: 135000, stok: 3, gambar: "img/buku7.svg" },
  { kode: "BK008", judul: "Cantik Itu Luka", penulis: "Eka Kurniawan", kategori: "Novel", harga: 105000, stok: 18, gambar: "img/buku8.svg" }
];

// Tahapan status pengiriman (indeks dipakai oleh field "status")
const tahapPengiriman = ["Pesanan diterima", "Dikemas", "Dikirim", "Dalam perjalanan", "Terkirim"];

const dataTracking = [
  { do: "DO20260001", nama: "Jauzan Lifen", ekspedisi: "JNE", tanggalKirim: "2026-10-28", jenisPaket: "Reguler", total: 193000, status: 3,
    riwayat: [["2026-10-27", "Pesanan diterima"], ["2026-10-27", "Pesanan dikemas"], ["2026-10-28", "Diserahkan ke JNE"], ["2026-10-30", "Tiba di hub Jakarta"]] },
  { do: "DO20260002", nama: "Siti Rahma", ekspedisi: "J&T Express", tanggalKirim: "2026-11-01", jenisPaket: "Ekspres", total: 385000, status: 1,
    riwayat: [["2026-11-01", "Pesanan diterima"], ["2026-11-02", "Pesanan sedang dikemas"]] },
  { do: "DO20260003", nama: "Budi Santoso", ekspedisi: "SiCepat", tanggalKirim: "2026-10-20", jenisPaket: "Reguler", total: 110000, status: 4,
    riwayat: [["2026-10-19", "Pesanan diterima"], ["2026-10-20", "Diserahkan ke SiCepat"], ["2026-10-23", "Paket diterima pemesan"]] }
];
