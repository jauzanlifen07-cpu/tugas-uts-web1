/* =====================================================
   script.js - logika semua halaman (Pustaka Online)
   Data dummy dibaca dari data.js; perubahan disimpan di
   localStorage agar tetap ada saat pindah halaman.
   ===================================================== */

// ---------- Helper umum ----------
const $ = (s, p = document) => p.querySelector(s);
const rupiah = n => "Rp " + Number(n).toLocaleString("id-ID");
const baca = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const emailValid = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const bukaModal = id => $("#" + id).classList.add("show");
const tutupModal = id => $("#" + id).classList.remove("show");
const semuaUser = () => [...dataPengguna, ...baca("pengguna", [])];
const semuaPesanan = () => baca("pesanan", []);
const katalogAktif = () => baca("katalog", null) || dataKatalogBuku.map(b => ({ ...b }));
const tglIndo = s => new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// Tampilkan pesan error di bawah form + tandai input yang salah
function galat(el, pesan, ...inputs) {
  el.textContent = pesan;
  document.querySelectorAll(".salah").forEach(i => i.classList.remove("salah"));
  inputs.forEach(i => i && i.classList.add("salah"));
  if (inputs[0]) inputs[0].focus();
}
const bersih = el => { el.textContent = ""; document.querySelectorAll(".salah").forEach(i => i.classList.remove("salah")); };

// Membuat tabel lewat DOM (tanpa innerHTML supaya aman)
function buatTabel(kepala, baris) {
  const t = document.createElement("table");
  const h = t.createTHead().insertRow();
  kepala.forEach(k => { const th = document.createElement("th"); th.scope = "col"; th.textContent = k; h.appendChild(th); });
  const b = t.createTBody();
  baris.forEach(r => { const tr = b.insertRow(); r.forEach(v => { tr.insertCell().textContent = v; }); });
  return t;
}

// Tutup modal lewat tombol [data-tutup] atau klik area gelap
document.addEventListener("click", e => {
  if (e.target.matches("[data-tutup]")) e.target.closest(".modal").classList.remove("show");
  else if (e.target.classList.contains("modal")) e.target.classList.remove("show");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"));
});

// ---------- Sesi & proteksi halaman ----------
const user = JSON.parse(sessionStorage.getItem("user") || "null");
const halaman = document.body.dataset.page;
if (halaman !== "login" && !user) location.href = "index.html";
if (user && $("#namaUser")) $("#namaUser").textContent = user.nama;
if ($("#btnLogout")) $("#btnLogout").addEventListener("click", () => {
  if (confirm("Yakin ingin keluar?")) { sessionStorage.removeItem("user"); location.href = "index.html"; }
});

// ---------- Inisialisasi per halaman ----------
const init = {

  /* ===== LOGIN ===== */
  login() {
    if (user) location.href = "dashboard.html";
    $("#formLogin").addEventListener("submit", e => {
      e.preventDefault();
      const email = $("#email").value.trim().toLowerCase(), pw = $("#password").value;
      if (!email || !pw) return galat($("#errLogin"), "Email dan password wajib diisi.", !email ? $("#email") : $("#password"));
      if (!emailValid(email)) return galat($("#errLogin"), "Format email tidak valid.", $("#email"));
      const u = semuaUser().find(x => x.email === email && x.password === pw);
      if (!u) { alert("Email/password yang anda masukkan salah"); return; }
      sessionStorage.setItem("user", JSON.stringify(u));
      location.href = "dashboard.html";
    });
    $("#btnLupa").addEventListener("click", () => { bersih($("#errLupa")); bukaModal("m-lupa"); });
    $("#btnDaftar").addEventListener("click", () => { bersih($("#errDaftar")); bukaModal("m-daftar"); });

    $("#formLupa").addEventListener("submit", e => {
      e.preventDefault();
      const em = $("#emailLupa").value.trim().toLowerCase();
      if (!emailValid(em)) return galat($("#errLupa"), "Masukkan email yang valid.", $("#emailLupa"));
      if (!semuaUser().some(x => x.email === em)) return galat($("#errLupa"), "Email belum terdaftar.", $("#emailLupa"));
      alert("Tautan reset password telah dikirim ke " + em + " (simulasi).");
      tutupModal("m-lupa"); e.target.reset();
    });

    $("#formDaftar").addEventListener("submit", e => {
      e.preventDefault();
      const nama = $("#dNama").value.trim(), em = $("#dEmail").value.trim().toLowerCase(), p1 = $("#dPass").value, p2 = $("#dPass2").value;
      const er = $("#errDaftar");
      if (nama.length < 3) return galat(er, "Nama minimal 3 karakter.", $("#dNama"));
      if (!emailValid(em)) return galat(er, "Format email tidak valid.", $("#dEmail"));
      if (semuaUser().some(x => x.email === em)) return galat(er, "Email sudah terdaftar.", $("#dEmail"));
      if (p1.length < 6) return galat(er, "Password minimal 6 karakter.", $("#dPass"));
      if (p1 !== p2) return galat(er, "Konfirmasi password tidak sama.", $("#dPass2"));
      const baru = baca("pengguna", []); baru.push({ nama, email: em, password: p1 }); simpan("pengguna", baru);
      alert("Pendaftaran berhasil! Silakan login.");
      $("#email").value = em; tutupModal("m-daftar"); e.target.reset();
    });
  },

  /* ===== DASHBOARD ===== */
  dashboard() {
    const tampil = () => {
      const now = new Date(), j = now.getHours();
      const sapa = j < 11 ? "Selamat pagi" : j < 15 ? "Selamat siang" : j < 18 ? "Selamat sore" : "Selamat malam";
      $("#greeting").textContent = `${sapa}, ${user.nama}!`;
      $("#tanggalJam").textContent = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) +
        ", pukul " + now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    };
    tampil(); setInterval(tampil, 30000);

    const modalInfo = (judul, node) => {
      $("#tInfo").textContent = judul; $("#isiInfo").replaceChildren(node); bukaModal("m-info");
    };
    $("#btnLaporan").addEventListener("click", () => {
      const p = semuaPesanan(), kosong = document.createElement("p");
      if (!p.length) { kosong.textContent = "Belum ada pesanan. Buat pesanan pertama di halaman Pemesanan."; return modalInfo("Laporan Pemesanan", kosong); }
      const totalNilai = p.reduce((a, x) => a + x.total, 0);
      const totalItem = p.reduce((a, x) => a + x.items.reduce((b, i) => b + i.qty, 0), 0);
      const perBayar = {}; p.forEach(x => perBayar[x.pembayaran] = (perBayar[x.pembayaran] || 0) + 1);
      const rows = [["Jumlah pesanan", p.length], ["Total buku terjual", totalItem], ["Total nilai pesanan", rupiah(totalNilai)],
        ...Object.entries(perBayar).map(([k, v]) => ["Pembayaran " + k, v + " pesanan"])];
      modalInfo("Laporan Pemesanan", buatTabel(["Ringkasan", "Nilai"], rows));
    });
    $("#btnHistory").addEventListener("click", () => {
      const p = semuaPesanan();
      if (!p.length) { const k = document.createElement("p"); k.textContent = "Belum ada transaksi."; return modalInfo("History Transaksi", k); }
      const rows = p.slice().reverse().map(x => [x.do, tglIndo(x.tanggal), x.items.map(i => `${i.judul} (${i.qty})`).join(", "), rupiah(x.total), tahapPengiriman[x.status]]);
      const w = document.createElement("div"); w.className = "gulir";
      w.appendChild(buatTabel(["No. DO", "Tanggal", "Buku", "Total", "Status"], rows));
      modalInfo("History Transaksi", w);
    });
  },

  /* ===== STOK / KATALOG ===== */
  stok() {
    let data = katalogAktif();
    const tbody = $("#tbodyStok");

    // Membuat satu baris tabel dengan DOM API
    function baris(b, baru = false) {
      const tr = tbody.insertRow(); if (baru) tr.className = "baru";
      const sel = isi => { const td = tr.insertCell(); isi instanceof Node ? td.appendChild(isi) : (td.textContent = isi); return td; };
      const img = new Image(); img.src = b.gambar; img.alt = "Sampul " + b.judul; img.width = 40;
      sel(img); sel(b.kode); sel(b.judul); sel(b.penulis); sel(b.kategori); sel(rupiah(b.harga));
      const s = sel(b.stok); if (b.stok < 5) s.className = "stok-rendah";
      const hapus = document.createElement("button");
      hapus.type = "button"; hapus.className = "btn kecil bahaya"; hapus.textContent = "Hapus";
      hapus.addEventListener("click", () => {
        if (!confirm(`Hapus "${b.judul}" dari katalog?`)) return;
        data = data.filter(x => x.kode !== b.kode); simpan("katalog", data); render();
      });
      sel(hapus);
    }
    function render() {
      const q = $("#cari").value.toLowerCase();
      tbody.replaceChildren();
      const hasil = data.filter(b => (b.judul + b.penulis + b.kategori + b.kode).toLowerCase().includes(q));
      hasil.forEach(b => baris(b));
      if (!hasil.length) { const td = tbody.insertRow().insertCell(); td.colSpan = 8; td.textContent = "Buku tidak ditemukan."; }
      $("#jumlahJudul").textContent = `(${hasil.length} judul)`;
    }
    render();
    $("#cari").addEventListener("input", render);

    $("#formStok").addEventListener("submit", e => {
      e.preventDefault();
      const f = { kode: $("#sKode"), judul: $("#sJudul"), penulis: $("#sPenulis"), harga: $("#sHarga"), stok: $("#sStok") };
      const er = $("#errStok");
      const kode = f.kode.value.trim().toUpperCase(), judul = f.judul.value.trim(), penulis = f.penulis.value.trim();
      const harga = Number(f.harga.value), stok = Number(f.stok.value);
      if (!/^[A-Z]{2}\d{3,}$/.test(kode)) return galat(er, "Kode harus berformat 2 huruf + angka, misalnya BK009.", f.kode);
      if (data.some(b => b.kode === kode)) return galat(er, "Kode sudah dipakai buku lain.", f.kode);
      if (!judul) return galat(er, "Judul wajib diisi.", f.judul);
      if (!penulis) return galat(er, "Penulis wajib diisi.", f.penulis);
      if (!(harga >= 1000)) return galat(er, "Harga minimal Rp 1.000.", f.harga);
      if (f.stok.value === "" || !Number.isInteger(stok) || stok < 0) return galat(er, "Stok harus bilangan bulat 0 atau lebih.", f.stok);
      const b = { kode, judul, penulis, kategori: $("#sKategori").value, harga, stok, gambar: "img/buku0.svg" };
      data.push(b); simpan("katalog", data);
      bersih(er); e.target.reset();
      if ($("#cari").value) $("#cari").value = "";
      render();
      tbody.lastElementChild.classList.add("baru");   // sorot baris yang baru ditambahkan
      alert(`Buku "${judul}" berhasil ditambahkan ke stok.`);
    });
  },

  /* ===== CHECKOUT ===== */
  checkout() {
    const katalog = katalogAktif();
    let keranjang = [];
    const pilih = $("#pilihBuku");
    katalog.forEach(b => {
      const o = document.createElement("option");
      o.value = b.kode; o.textContent = `${b.judul} - ${rupiah(b.harga)} (stok ${b.stok})`; pilih.appendChild(o);
    });
    $("#pNama").value = user.nama; $("#pEmail").value = user.email;
    const ongkir = () => Number($("#pEkspedisi").value.split("|")[1]);

    function hitung() {
      const sub = keranjang.reduce((a, i) => a + i.harga * i.qty, 0);
      const ong = keranjang.length ? ongkir() : 0;
      $("#rSub").textContent = rupiah(sub); $("#rOngkir").textContent = rupiah(ong); $("#rTotal").textContent = rupiah(sub + ong);
      return sub + ong;
    }
    function render() {
      const tb = $("#tbodyKeranjang"); tb.replaceChildren();
      if (!keranjang.length) { const td = tb.insertRow().insertCell(); td.colSpan = 5; td.textContent = "Belum ada buku dalam pesanan."; }
      keranjang.forEach(item => {
        const tr = tb.insertRow();
        tr.insertCell().textContent = item.judul;
        tr.insertCell().textContent = rupiah(item.harga);
        const q = document.createElement("input");
        q.type = "number"; q.min = 1; q.value = item.qty; q.setAttribute("aria-label", "Jumlah " + item.judul);
        const sub = tr.insertCell(); sub.textContent = rupiah(item.harga * item.qty);
        q.addEventListener("change", () => {            // ubah jumlah
          const stok = katalog.find(b => b.kode === item.kode).stok, v = parseInt(q.value);
          if (!v || v < 1) { q.value = item.qty; return galat($("#errItem"), "Jumlah minimal 1."); }
          if (v > stok) { q.value = item.qty; return galat($("#errItem"), `Stok "${item.judul}" hanya ${stok}.`); }
          bersih($("#errItem")); item.qty = v; sub.textContent = rupiah(item.harga * v); hitung();
        });
        const cq = tr.insertCell(); cq.appendChild(q); tr.insertBefore(cq, sub);
        const hapus = document.createElement("button");
        hapus.type = "button"; hapus.className = "btn kecil bahaya"; hapus.textContent = "Hapus";
        hapus.addEventListener("click", () => { keranjang = keranjang.filter(k => k !== item); render(); });
        tr.insertCell().appendChild(hapus);
      });
      hitung();
    }
    render();
    $("#pEkspedisi").addEventListener("change", hitung);

    $("#btnTambah").addEventListener("click", () => {
      const b = katalog.find(x => x.kode === pilih.value), qty = parseInt($("#jumlah").value);
      if (!qty || qty < 1) return galat($("#errItem"), "Jumlah minimal 1.", $("#jumlah"));
      const ada = keranjang.find(k => k.kode === b.kode), total = qty + (ada ? ada.qty : 0);
      if (total > b.stok) return galat($("#errItem"), `Stok "${b.judul}" hanya ${b.stok}.`, $("#jumlah"));
      bersih($("#errItem"));
      if (ada) ada.qty = total; else keranjang.push({ kode: b.kode, judul: b.judul, harga: b.harga, qty });
      render();
    });

    $("#formPesan").addEventListener("submit", e => {
      e.preventDefault();
      const er = $("#errPesan"), nama = $("#pNama").value.trim(), email = $("#pEmail").value.trim();
      const telp = $("#pTelp").value.trim(), alamat = $("#pAlamat").value.trim();
      if (!keranjang.length) return galat(er, "Tambahkan minimal satu buku ke pesanan.");
      if (nama.length < 3) return galat(er, "Nama pemesan minimal 3 karakter.", $("#pNama"));
      if (!emailValid(email)) return galat(er, "Format email tidak valid.", $("#pEmail"));
      if (!/^(08|\+628)\d{8,11}$/.test(telp)) return galat(er, "Nomor telepon harus diawali 08 atau +628 (10-13 digit).", $("#pTelp"));
      if (alamat.length < 10) return galat(er, "Alamat terlalu singkat (minimal 10 karakter).", $("#pAlamat"));
      if (!$("#pBayar").value) return galat(er, "Pilih metode pembayaran.", $("#pBayar"));
      bersih(er);

      const [ekspedisi] = $("#pEkspedisi").value.split("|");
      const total = hitung(), now = new Date(), semua = semuaPesanan();
      const noDO = "DO" + now.getFullYear() + String(semua.length + 4).padStart(4, "0");
      const iso = now.toISOString().slice(0, 10);
      semua.push({ do: noDO, nama, ekspedisi, tanggal: iso, tanggalKirim: iso, jenisPaket: "Reguler", total,
        pembayaran: $("#pBayar").value, alamat, items: keranjang.map(k => ({ ...k })), status: 0,
        riwayat: [[iso, "Pesanan diterima"]] });
      simpan("pesanan", semua);
      keranjang.forEach(k => { katalog.find(b => b.kode === k.kode).stok -= k.qty; });   // kurangi stok
      simpan("katalog", katalog);

      $("#noDO").textContent = noDO; bukaModal("m-sukses");
      keranjang = []; render(); e.target.reset(); $("#pNama").value = user.nama; $("#pEmail").value = user.email;
      pilih.querySelectorAll("option").forEach(o => { const b = katalog.find(x => x.kode === o.value); o.textContent = `${b.judul} - ${rupiah(b.harga)} (stok ${b.stok})`; });
    });
  },

  /* ===== TRACKING ===== */
  tracking() {
    const hasil = $("#hasil");
    $("#formTrack").addEventListener("submit", e => {
      e.preventDefault();
      const no = $("#noDO").value.trim().toUpperCase(), er = $("#errTrack");
      hasil.hidden = true;
      if (!no) return galat(er, "Nomor Delivery Order wajib diisi.", $("#noDO"));
      if (!/^DO\d{6,}$/.test(no)) return galat(er, "Format nomor tidak valid. Contoh: DO20260001.", $("#noDO"));
      const p = [...dataTracking, ...semuaPesanan()].find(x => x.do === no);
      if (!p) { galat(er, "", $("#noDO")); alert(`Nomor ${no} tidak ditemukan.`); return; }
      bersih(er); tampilkan(p);
    });

    function tampilkan(p) {
      const persen = (p.status / (tahapPengiriman.length - 1)) * 100;
      const warna = p.status === 4 ? "var(--hijau)" : p.status >= 2 ? "#1f5f8b" : "#8a6d1c";
      hasil.replaceChildren();
      const kepala = document.createElement("div"); kepala.className = "status-judul";
      const h = document.createElement("h2"); h.textContent = "Pesanan atas nama " + p.nama;
      const lb = document.createElement("span"); lb.className = "lencana s" + p.status; lb.textContent = tahapPengiriman[p.status];
      kepala.append(h, lb);

      const bar = document.createElement("div"); bar.className = "bar";
      bar.setAttribute("role", "progressbar"); bar.setAttribute("aria-valuenow", persen); bar.setAttribute("aria-valuemin", 0); bar.setAttribute("aria-valuemax", 100);
      const isi = document.createElement("span"); isi.style.background = warna; isi.style.width = "0"; bar.appendChild(isi);
      const ol = document.createElement("ol"); ol.className = "langkah";
      tahapPengiriman.forEach((t, i) => {
        const li = document.createElement("li"); li.textContent = t;
        if (i < p.status) li.className = "selesai"; else if (i === p.status) li.className = "aktif";
        ol.appendChild(li);
      });

      const dl = document.createElement("dl"); dl.className = "detail";
      [["Nama pemesan", p.nama], ["Ekspedisi", p.ekspedisi], ["Tanggal kirim", tglIndo(p.tanggalKirim)], ["Jenis paket", p.jenisPaket], ["Total pembayaran", rupiah(p.total)], ["No. Delivery Order", p.do]]
        .forEach(([k, v]) => { const d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = k; dd.textContent = v; d.append(dt, dd); dl.appendChild(d); });

      const rh = document.createElement("h3"); rh.textContent = "Riwayat perjalanan";
      const ul = document.createElement("ul"); ul.className = "linimasa";
      (p.riwayat || []).slice().reverse().forEach(([tgl, ket]) => { const li = document.createElement("li"); li.textContent = `${tglIndo(tgl)} - ${ket}`; ul.appendChild(li); });

      hasil.append(kepala, bar, ol, dl, rh, ul); hasil.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => { isi.style.width = persen + "%"; }));   // animasi progress
    }
  }
};
if (init[halaman]) init[halaman]();
