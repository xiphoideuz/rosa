# 📿 Rosa — Doa Rosario Interaktif (Indonesia)

<p align="center">
  <a href="https://xiphoideuz.github.io/rosa"><img src="https://img.shields.io/badge/🌐_Buka_Aplikasi-rosario_online-amber?style=for-the-badge" alt="Buka aplikasi"></a>
</p>

<p align="center">
  <a href="https://xiphoideuz.github.io/rosa"><b>👉 https://xiphoideuz.github.io/rosa 👈</b></a><br>
  <i>Klik untuk langsung berdoa — tanpa install, tanpa daftar.</i>
</p>

Statis, gratis, cocok untuk doa sendiri maupun share-screen kelompok via Zoom / Google Meet.

- Kiri: visual rosario (klik manik untuk pindah). Kanan: teks doa besar.
- Navigasi tetap: `← Kembali` / `Lanjut →`, keyboard `Spasi/Enter/→`, `←`, swipe di HP.
- Mode kelompok (2–50 umat, default `Umat 1..N`): badge `Giliran: …` hanya di 50× Salam Maria, bergiliran kontinu antar-peristiwa. Bagian lain dipimpin Pemimpin.
- Autodetect peristiwa: hari + masa liturgi (Adven/Natal → Gembira, Pra-Paskah → Sedih, Paskah → Mulia, Biasa → ikut hari: Sen/Sab Gembira, Sel/Jum Sedih, Rab/Min Mulia, Kam Terang). Bisa diganti manual.

## Hosting

1. **Pakai langsung (milik saya):**
   `https://xiphoideuz.github.io/rosa`

2. **Jalankan lokal (run locally):**

   ```bash
   python3 -m http.server 8000
   # buka http://localhost:8000
   ```

3. **Mirror ke GitHub Pages:**

   Webapp ini bersifat pasif (HTML/CSS/JS statis, tanpa server) sehingga **GitHub Pages saja cukup, gratis permanen**. Tidak perlu Cloudflare Worker.

   1. **Push repository ini ke branch `main` milik Anda.**
   2. Di GitHub → *Settings → Pages* → *Build and deployment* → *Source*: pilih `Deploy from branch` → `main` / `(root)`.
   3. Selesai. Situs mirror Anda akan tersedia di:
      `https://<username>.github.io/rosa/`

   Atau bisa diaktifkan otomatis melalui GitHub Actions (workflow `.github/workflows/static.yml` sudah disertakan).

   Cloudflare hanya opsional: jika ingin custom domain / cache / analytics → tambahkan domain sebagai Pages project atau proxy DNS ke GitHub Pages. Worker tidak dibutuhkan (Worker untuk komputasi server-side; app ini 100% client-side).
