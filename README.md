# GT-Store
Pembangunan

Index.html.
<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#17102e">
  <title>GT Store</title>

  <style>
    :root {
      --bg: #17181d;
      --surface: #25262d;
      --navy: #17102e;
      --purple: #7557d5;
      --purple-light: #9b85ef;
      --text: #f6f6f8;
      --muted: #b1b1ba;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
    }

    header {
      padding: 28px 18px 22px;
      text-align: center;
      background: linear-gradient(135deg, var(--navy), #30255c);
    }

    h1 {
      margin: 0;
      font-size: 30px;
    }

    .tagline {
      margin: 8px 0 0;
      color: var(--muted);
    }

    main {
      max-width: 760px;
      margin: auto;
      padding: 16px;
    }

    .notice {
      padding: 13px;
      border: 1px solid #504471;
      border-radius: 12px;
      background: #332e45;
      font-size: 14px;
      line-height: 1.5;
    }

    h2 {
      margin: 24px 0 12px;
      font-size: 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .card {
      padding: 14px;
      border: 1px solid #3c3d46;
      border-radius: 14px;
      background: var(--surface);
    }

    .card h3 {
      margin: 0 0 12px;
      font-size: 17px;
    }

    input, select, button {
      width: 100%;
      min-height: 44px;
      border-radius: 9px;
      font: inherit;
      font-size: 15px;
    }

    input, select {
      margin-bottom: 9px;
      padding: 10px 11px;
      border: 1px solid #4c4d56;
      background: #17181d;
      color: var(--text);
    }

    button {
      border: 0;
      background: var(--purple);
      color: white;
      font-weight: 800;
      cursor: pointer;
    }

    button:active {
      background: var(--purple-light);
    }

    .full {
      grid-column: 1 / -1;
    }

    .funny {
      margin: 10px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    footer {
      padding: 28px 16px;
      text-align: center;
      color: var(--muted);
      font-size: 13px;
    }

    @media (max-width: 430px) {
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>

<body>
  <header>
    <h1>GT Store</h1>
    <p class="tagline">Pulsa Â· PLN Â· Google Play Â· Blockchain</p>
  </header>

  <main>
    <div class="notice">
      Pesanan dikonfirmasi manual melalui WhatsApp.
      Data salah bukan huruf ajaibâ€”mohon dicek sebelum dikirim.
    </div>

    <h2>Pilih Produk</h2>

    <div class="grid">
      <section class="card">
        <h3>Pulsa</h3>
        <input id="pulsaNomor" type="tel" inputmode="numeric"
          placeholder="Nomor ponsel tujuan">

        <select id="pulsaNominal">
          <option>Pulsa Rp10.000</option>
          <option>Pulsa Rp25.000</option>
          <option>Pulsa Rp50.000</option>
          <option>Pulsa Rp100.000</option>
        </select>

        <button type="button"
          onclick="pesanProduk('Pulsa', 'pulsaNomor', 'pulsaNominal')">
          Pesan Pulsa
        </button>
      </section>

      <section class="card">
        <h3>PLN Token</h3>
        <input id="plnNomor" type="tel" inputmode="numeric"
          placeholder="Nomor meter atau ID pelanggan">

        <select id="plnNominal">
          <option>Token Rp20.000</option>
          <option>Token Rp50.000</option>
          <option>Token Rp100.000</option>
          <option>Token Rp200.000</option>
        </select>

        <button type="button"
          onclick="pesanProduk('PLN Token', 'plnNomor', 'plnNominal')">
          Pesan PLN
        </button>
      </section>

      <section class="card">
        <h3>G-Play Voucher</h3>

        <select id="playNominal">
          <option>Voucher Rp50.000</option>
          <option>Voucher Rp100.000</option>
          <option>Voucher Rp150.000</option>
          <option>Voucher Rp300.000</option>
        </select>

        <button type="button"
          onclick="pesanProduk('G-Play Voucher', null, 'playNominal')">
          Pesan Voucher
        </button>
      </section>

      <section class="card">
        <h3>Blockchain</h3>
        <input id="blockchainProduk" type="text"
          placeholder="Nama layanan atau produk">
        <input id="blockchainKeterangan" type="text"
          placeholder="Keterangan singkat">

        <button type="button" onclick="pesanBlockchain()">
          Tanyakan Produk
        </button>
      </section>

      <section class="card full">
        <h3>Layanan dan Lokasi</h3>
        <p class="funny">
          Melayani pesanan dari Jawa, Indonesia. Pulsa tidak akan berlari
          mengejar Andaâ€”mohon nomor tujuannya diisi dengan benar.
        </p>
      </section>
    </div>
  </main>

  <footer>
    GT Store Â· Jawa, Indonesia Â· WhatsApp: 083894960906
  </footer>

  <script>
    const nomorWhatsApp = "6283894960906";

    function pesanProduk(produk, nomorId, nominalId) {
      const nominal = document.getElementById(nominalId).value;
      let tujuan = "";

      if (nomorId) {
        tujuan = document.getElementById(nomorId).value.trim();

        if (!tujuan) {
          alert("Silakan isi nomor atau ID tujuan.");
          return;
        }
      }

      const text = [
        "Halo GT Store",
        "Saya ingin memesan " + produk,
        "Produk: " + nominal,
        tujuan ? "Nomor atau ID tujuan: " + tujuan : ""
      ].join("\n");

      window.open(
        "https://wa.me/" + nomorWhatsApp +
          "?text=" + encodeURIComponent(text),
        "_blank"
      );
    }

    function pesanBlockchain() {
      const produk = document
        .getElementById("blockchainProduk")
        .value
        .trim();

      const keterangan = document
        .getElementById("blockchainKeterangan")
        .value
        .trim();

      if (!produk) {
        alert("Silakan isi nama layanan blockchain.");
        return;
      }

      const text =
        "Halo GT Store\n" +
        "Saya ingin bertanya tentang layanan blockchain\n" +
        "Produk: " + produk +
        (keterangan ? "\nKeterangan: " + keterangan : "");

      window.open(
        "https://wa.me/" + nomorWhatsApp +
          "?text=" + encodeURIComponent(text),
        "_blank"
      );
    }
  </script>
</body>
</html>
