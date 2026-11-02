# Pustaka Online - UTS Pemrograman Web 1

Aplikasi web front-end sederhana untuk pemesanan buku pada toko online.

- **Nama:** Jauzan Lifen
- **NIM:** 321510259
- **Teknologi:** HTML5, CSS3, JavaScript (tanpa framework, tanpa server)

## Cara menjalankan

1. Ekstrak folder `tugas-uts-web1`.
2. Buka `index.html` di browser (Chrome/Edge/Firefox). Tidak perlu server atau instalasi.
3. Login dengan akun demo:

| Email | Password |
|---|---|
| jauzan@mail.com | 123456 |
| admin@mail.com | admin123 |

Akun baru bisa dibuat lewat tombol **Daftar** (disimpan di `localStorage`).

## Struktur folder

```
tugas-uts-web1/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- checkout.html
|-- tracking.html
|-- css/style.css
|-- js/script.js      (logika semua halaman)
|-- js/data.js        (data dummy: dataKatalogBuku, dataPengguna, dataTracking)
|-- assets/logo.svg
|-- img/buku0..8.svg  (sampul buku)
`-- README.md
```

## Fitur per halaman

| Halaman | Fitur |
|---|---|
| **Login** (`index.html`) | Validasi email/password, alert "email/password yang anda masukkan salah" jika salah. **Lupa Password** dan **Daftar** tampil sebagai modal box. |
| **Dashboard** | Greeting otomatis sesuai jam lokal (pagi/siang/sore/malam), menu ke Stok, Tracking, serta **Laporan Pemesanan** dan **History Transaksi** (modal berisi tabel dari pesanan yang dibuat). |
| **Stok/Katalog** | Tabel dirender dinamis dari `dataKatalogBuku`, tambah baris stok baru lewat DOM, hapus baris, pencarian, stok < 5 ditandai merah. |
| **Pemesanan** | Tambah/ubah jumlah/hapus item, ongkir per ekspedisi, total otomatis, form pemesan & pembayaran dengan validasi, menghasilkan nomor DO dan mengurangi stok. |
| **Tracking** | Cari nomor DO, tampil nama pemesan, status (progress bar + langkah berwarna), ekspedisi, tanggal kirim, jenis paket, total, dan riwayat. Nomor demo: `DO20260001`, `DO20260002`, `DO20260003`, serta nomor dari pesanan yang Anda buat. |

## Kesesuaian dengan kriteria penilaian

- **HTML semantik:** `header`, `nav`, `main`, `section`, `footer`, `form`, `label`, `table` dengan `caption`/`th scope`, atribut ARIA pada modal dan progress bar.
- **CSS:** satu file eksternal `css/style.css` dengan CSS variables, grid/flexbox, responsif, dan `prefers-reduced-motion`.
- **JavaScript DOM:** `createElement`, `insertRow`, `replaceChildren`, event listener, `localStorage`/`sessionStorage`.
- **Validasi & alert:** pesan error inline pada input yang salah, `alert()` dan `confirm()`, serta modal box.
- **Modularitas:** `data.js` terpisah dari `script.js`; kode per halaman dipisah dalam objek `init`.
- **Kreativitas:** tema toko buku (biru tinta + kuning penanda buku), progress bar tracking beranimasi, pencarian katalog, pengurangan stok otomatis.

## Catatan

- Halaman login memakai nama `index.html` sesuai struktur folder pada soal, dan halaman pemesanan memakai `checkout.html`.
- Sampul buku saat ini berupa SVG placeholder. Untuk memakai gambar dari file aset soal, salin ke folder `img/` lalu ubah properti `gambar` pada `js/data.js`.
- Data hasil input (stok baru, pesanan, akun) tersimpan di `localStorage`. Untuk mengembalikan ke data awal, hapus data situs dari browser.

## Panduan alur video penjelasan (maks. 15 menit)

1. Gambaran aplikasi dan struktur folder (1 menit).
2. HTML: alasan memakai tag semantik dan form yang berlabel (3 menit).
3. CSS: variabel warna, layout grid/flex, modal, progress bar (3 menit).
4. JavaScript: `data.js`, render tabel dengan DOM, validasi form, alur pesanan ke tracking (6 menit).
5. Demo: login, dashboard, tambah stok, buat pesanan, cari nomor DO (2 menit).
