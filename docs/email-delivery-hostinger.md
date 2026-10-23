# Email Kontak arywibowo.id — Hostinger SMTP

Form kontak pada `/api/contact` menggunakan Nodemailer dengan SMTP milik Hostinger.
**Jangan menyimpan password SMTP di repository, GitHub Actions, log, atau percakapan.**

## Vercel environment variables (Preview dan Production)

| Variable | Nilai |
|---|---|
| SMTP_HOST | smtp.hostinger.com |
| SMTP_PORT | 465 |
| SMTP_USER | no-reply@arywibowo.id |
| SMTP_FROM | no-reply@arywibowo.id |
| CONTACT_TO | aku@arywibowo.id |
| SMTP_PASSWORD | **Tambahkan sebagai Sensitive secret menggunakan password mailbox no-reply di Hostinger** |

Konfigurasi lain sudah diterapkan secara aman di Vercel. Periksa bahwa `SMTP_PASSWORD` ditambahkan untuk **Production** dan **Preview** sebelum men-deploy.

## Validasi dan cutover

1. Tambahkan `SMTP_PASSWORD` di Vercel Settings → Environment Variables; jangan berikan melalui chat.
2. Lakukan deployment Preview setelah secret tersedia (secret baru tidak otomatis berlaku untuk deployment yang sudah dibuat).
3. Submit satu pesan uji dari form ke `aku@arywibowo.id`, konfirmasi diterima dan dapat reply ke alamat pengunjung.
4. Pastikan error di Vercel tidak mencatat password maupun isi pesan.
5. Setelah uji sukses, merge dan tunggu production deployment READY.
6. Lakukan satu pemeriksaan pengiriman ulang dari domain production.

`SMTP_PASSWORD` yang tidak tersedia menyebabkan HTTP 503 `NOT_CONFIGURED`; UI menawarkan fallback ke aplikasi email, bukan sukses palsu.

Resend tidak diperlukan untuk aplikasi kontak setelah SMTP aktif. **Jangan menghapus credential Resend lama sebelum cutover selesai dan pengujian production sukses.**

Hostinger SMTP umumnya memakai `smtp.hostinger.com`, SSL pada port 465; 587 STARTTLS dapat digunakan bila dibutuhkan.
