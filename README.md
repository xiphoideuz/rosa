# Rosa — Doa Rosario Interaktif (Indonesia)

Statis, gratis, cocok untuk doa sendiri maupun share-screen kelompok via Zoom / Google Meet.

- Kiri: visual rosario (klik manik untuk pindah). Kanan: teks doa besar.
- Navigasi tetap: `← Kembali` / `Lanjut →`, keyboard `Spasi/Enter/→`, `←`, swipe di HP.
- Mode kelompok (2–50 umat, default `Umat 1..N`): badge `Giliran: …` hanya di 50× Salam Maria, bergiliran kontinu antar-peristiwa. Bagian lain dipimpin Pemimpin.
- Autodetect peristiwa: hari + masa liturgi (Adven/Natal → Gembira, Pra-Paskah → Sedih, Paskah → Mulia, Biasa → ikut hari: Sen/Sab Gembira, Sel/Jum Sedih, Rab/Min Mulia, Kam Terang). Bisa diganti manual.

## Jalankan lokal

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Hosting: GitHub Pages saja cukup

Ini webapp pasif (HTML/CSS/JS statis, tanpa server) → **GitHub Pages saja cukup, gratis permanen.** Tidak perlu Cloudflare Worker.

- Push ke `main`, aktifkan `Settings → Pages → Deploy from branch → main / (root)`.
- Atau otomatis via Actions (sudah disertakan `.github/workflows/static.yml`).
- URL: `https://xiphoideuz.github.io/rosa/`

Cloudflare hanya opsional: jika ingin custom domain / cache / analytics → tambahkan domain sebagai Pages project atau proxy DNS ke GitHub Pages. Worker tidak dibutuhkan (Worker untuk komputasi server-side; app ini 100% client-side).
