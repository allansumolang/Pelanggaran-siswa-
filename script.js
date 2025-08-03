
let dataPelanggaran = JSON.parse(localStorage.getItem("dataPelanggaran")) || [];
let siswaList = [];
let pelanggaranList = [];

document.getElementById("violationForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const tanggal = document.getElementById("tanggal").value;
    const jenis = document.getElementById("jenisPelanggaran").value;
    const pelanggaran = pelanggaranList.find(p => p.jenis === jenis) || {};
    const tindakan = document.getElementById("tindakan").value;

    const siswa = siswaList.find(s => s.nama === nama) || {};
    const poin = parseInt(pelanggaran.poin || 0);
    const kategori = pelanggaran.kategori || "";

    dataPelanggaran.push({ nama, kelas: siswa.kelas || "", tanggal, jenis, kategori, poin, tindakan });
    localStorage.setItem("dataPelanggaran", JSON.stringify(dataPelanggaran));
    renderTable();
    this.reset();
});

function renderTable() {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";
    dataPelanggaran.forEach((d, i) => {
        const row = document.createElement("tr");
        row.innerHTML = \`
            <td>\${d.nama}</td>
            <td>\${d.kelas}</td>
            <td>\${d.tanggal}</td>
            <td>\${d.jenis}</td>
            <td>\${d.kategori}</td>
            <td>\${d.poin}</td>
            <td>\${d.tindakan}</td>
            <td><button onclick="cetakSurat(\${i})">Cetak</button></td>
        \`;
        tbody.appendChild(row);
    });
}

function cetakSurat(index) {
    const d = dataPelanggaran[index];
    const win = window.open("", "Surat", "width=800,height=600");
    win.document.write(\`
        <h2>Surat Pemberitahuan Pelanggaran</h2>
        <p>Nama: \${d.nama}</p>
        <p>Kelas: \${d.kelas}</p>
        <p>Tanggal Pelanggaran: \${d.tanggal}</p>
        <p>Jenis Pelanggaran: \${d.jenis}</p>
        <p>Kategori: \${d.kategori}</p>
        <p>Poin: \${d.poin}</p>
        <p>Tindakan: \${d.tindakan}</p>
        <p>Demikian surat ini dibuat untuk ditindaklanjuti oleh orang tua/wali siswa.</p>
    \`);
    win.print();
    win.close();
}

document.getElementById("search").addEventListener("input", function() {
    const keyword = this.value.toLowerCase();
    const rows = document.querySelectorAll("#dataTable tbody tr");
    rows.forEach(row => {
        const nama = row.children[0].textContent.toLowerCase();
        row.style.display = nama.includes(keyword) ? "" : "none";
    });
});

document.getElementById("importSiswa").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        const lines = reader.result.split("\n").slice(1);
        siswaList = lines.map(line => {
            const [nama, kelas] = line.split(",");
            return { nama: nama.trim(), kelas: kelas.trim() };
        });
        const namaSelect = document.getElementById("nama");
        namaSelect.innerHTML = '<option value="">Pilih Nama Siswa</option>';
        siswaList.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.nama;
            opt.textContent = s.nama;
            namaSelect.appendChild(opt);
        });
    };
    reader.readAsText(e.target.files[0]);
});

document.getElementById("importPelanggaran").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        const lines = reader.result.split("\n").slice(1);
        pelanggaranList = lines.map(line => {
            const [jenis, kategori, poin] = line.split(",");
            return { jenis: jenis.trim(), kategori: kategori.trim(), poin: poin.trim() };
        });
        const pelanggaranSelect = document.getElementById("jenisPelanggaran");
        pelanggaranSelect.innerHTML = '<option value="">Pilih Jenis Pelanggaran</option>';
        pelanggaranList.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.jenis;
            opt.textContent = p.jenis;
            pelanggaranSelect.appendChild(opt);
        });
    };
    reader.readAsText(e.target.files[0]);
});

renderTable();
