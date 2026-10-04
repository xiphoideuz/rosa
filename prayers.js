/* Rosario data — Indonesian texts (cleaned lightly from user draft) */
const FULL = {
  tandaSalib: ["Dalam nama Bapa, dan Putra, dan Roh Kudus.", "Amin."],
  akuPercaya: [
    "Aku percaya akan Allah, Bapa Yang Mahakuasa, pencipta langit dan bumi;",
    "dan akan Yesus Kristus, Putra-Nya yang tunggal, Tuhan kita; yang dikandung dari Roh Kudus, dilahirkan oleh Perawan Maria;",
    "yang menderita sengsara dalam pemerintahan Pontius Pilatus; disalibkan, wafat dan dimakamkan;",
    "yang turun ke tempat penantian, pada hari ketiga bangkit dari antara orang mati;",
    "yang naik ke surga, duduk di sebelah kanan Allah Bapa Yang Mahakuasa; dari situ Ia akan datang mengadili orang yang hidup dan mati.",
    "Aku percaya akan Roh Kudus, Gereja Katolik yang kudus, persekutuan para kudus, pengampunan dosa, kebangkitan badan, kehidupan kekal.",
    "Amin."
  ],
  bapaKami: [
    "Bapa kami yang ada di surga, dimuliakanlah nama-Mu.",
    "Datanglah kerajaan-Mu. Jadilah kehendak-Mu di atas bumi seperti di dalam surga.",
    "Berilah kami rezeki pada hari ini, dan ampunilah kesalahan kami, seperti kami pun mengampuni yang bersalah kepada kami.",
    "Dan janganlah masukkan kami ke dalam pencobaan, tetapi bebaskanlah kami dari yang jahat.",
    "Sebab Engkaulah Raja yang mulia dan berkuasa untuk selama-lamanya. Amin."
  ],
  salamMaria: [
    "Salam Maria, penuh rahmat, Tuhan sertamu, terpujilah engkau di antara wanita, dan terpujilah buah tubuhmu, Yesus.",
    "Santa Maria, Bunda Allah, doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin."
  ],
  kemuliaan: [
    "Kemuliaan kepada Bapa dan Putra dan Roh Kudus, seperti pada permulaan, sekarang, selalu, dan sepanjang segala abad. Amin."
  ],
  terpujilah: [
    "Terpujilah nama Yesus, Maria dan Yusuf, sekarang dan selama-lamanya. Amin."
  ],
  fatima: [
    "Ya Yesus yang baik, ampunilah dosa-dosa kami. Selamatkanlah kami dari api neraka, dan hantarlah jiwa-jiwa ke surga, terlebih jiwa-jiwa yang sangat membutuhkan kerahiman-Mu. Amin."
  ],
  doaPembuka: [
    "Bunda Maria, Ratu Rosario, Engkau sudi datang ke Fatima memberitakan kepada ketiga anak gembala harta rahmat yang terkandung dalam doa Rosario.",
    "Sudilah membangkitkan dalam hatiku devosi ini, agar dengan merenungkan misteri-misteri penebusan Putera-Mu aku diperkaya dengan hasil buahnya, membawa perdamaian bagi dunia dan pertobatan bagi para pendosa, serta memperoleh anugerah khusus yang kumohon dalam doa Rosario ini, yaitu … (sebutkan permohonanmu).",
    "Aku mohon semuanya itu demi kemuliaan Allah, untuk menghormat Engkau, dan untuk mendapatkan keselamatan jiwa bagiku dan bagi sekalian orang. Amin.",
    "Catatan: kata ganti “aku” dapat diganti “kami/kita” sesuai intensi doa bersama."
  ],
  salamYaRatu: [
    "Salam, ya Ratu, Bunda yang berbelas kasih, hidup, hiburan dan harapan kami. Kami semua memanjatkan permohonan, kami amat susah, mengeluh, mengesah dalam lembah duka ini.",
    "Ya Ibunda, ya pelindung kami, limpahkanlah kasih sayang-Mu yang besar kepada kami. Dan Yesus, Putera-Mu yang terpuji itu, semoga Kau tunjukkan kepada kami.",
    "O Ratu, o Ibu, o Maria, Bunda Kristus."
  ],
  doakanlah: ["Doakanlah kami, ya Santa Bunda Allah.", "Supaya kami dapat menikmati janji Kristus."],
  marilahBerdoa: [
    "Marilah berdoa: Ya Allah, Putera-Mu telah memperoleh bagi kami ganjaran kehidupan kekal melalui hidup, wafat dan kebangkitan-Nya.",
    "Kami mohon, agar dengan merenungkan misteri Rosario Suci Santa Perawan Maria, kami dapat menghayati maknanya dan memperoleh apa yang dijanjikan. Demi Kristus, Tuhan kami. Amin."
  ]
};

const MYSTERIES = {
  gembira: {
    id: "gembira", nama: "Peristiwa Gembira",
    hari: "Senin, Sabtu, masa Adven, dan masa Natal",
    peristiwa: [
      { judul: "Maria menerima kabar dari Malaikat Gabriel",
        ayat: "“Salam, hai engkau yang dikaruniai, Tuhan menyertai engkau; jangan takut, hai Maria, sebab engkau beroleh kasih karunia di hadapan Allah. Sesungguhnya engkau akan mengandung dan melahirkan seorang anak laki-laki dan hendaklah engkau menamai Dia Yesus.”",
        ref: "Lukas 1:28b, 30b–31",
        renungan: "Bapa, jika Engkau bersabda maka semuanya terjadi. Bersabdalah, ya Bapa — aku ini adalah hamba-Mu, terjadilah padaku menurut kehendak-Mu." },
      { judul: "Maria mengunjungi Elisabet",
        ayat: "“Diberkatilah engkau di antara semua perempuan dan diberkatilah buah rahimmu. Siapakah aku ini sampai ibu Tuhanku datang mengunjungi aku?”",
        ref: "Lukas 1:42–43",
        renungan: "Bapa, hatiku memuliakan Dikau dan jiwaku bersorak-sorai, karena Engkau Allah penuh kasih. Engkau menciptakan dan memelihara kami, anak-anak-Mu." },
      { judul: "Yesus dilahirkan di Betlehem",
        ayat: "Maria “melahirkan seorang anak laki-laki … lalu dibungkus-Nya dengan kain lampin dan dibaringkan-Nya di dalam palungan, karena tidak ada tempat bagi mereka di rumah penginapan.”",
        ref: "Lukas 2:7",
        renungan: "Bapa, kami bersyukur karena Engkau telah merelakan Putera-Mu menjadi manusia demi menebus dan mengampuni dosa-dosa kami. Jadikanlah kami layak menjadi anak-anak-Mu." },
      { judul: "Yesus dipersembahkan dalam Bait Allah",
        ayat: "Simeon berkata kepada Maria: “Sesungguhnya Anak ini ditentukan untuk menjatuhkan atau membangkitkan banyak orang di Israel dan untuk menjadi suatu tanda yang menimbulkan perbantahan. Kelak suatu pedang akan menembus jiwamu sendiri.”",
        ref: "Lukas 2:34–35",
        renungan: "Bapa, kami mempersembahkan segenap diri kami kepada-Mu. Terimalah kami sebagai persembahan yang layak, demi jasa Putera-Mu, Juruselamat kami." },
      { judul: "Yesus diketemukan dalam Bait Allah",
        ayat: "“Mengapa kamu mencari Aku? Tidakkah kamu tahu, bahwa Aku harus berada di dalam rumah Bapa-Ku?” Tetapi mereka tidak mengerti apa yang dikatakan-Nya kepada mereka.",
        ref: "Lukas 2:49–50",
        renungan: "Bapa, Putera-Mu sepenuhnya hidup demi kemuliaan-Mu dan keselamatan kami. Bentuklah kami menjadi serupa dengan Putera-Mu." }
    ]
  },
  sedih: {
    id: "sedih", nama: "Peristiwa Sedih",
    hari: "Selasa, Jumat, dan waktu masa Pra-Paskah",
    peristiwa: [
      { judul: "Yesus berdoa kepada Bapa-Nya di surga dalam sakratul maut",
        ayat: "“Ya Bapa-Ku, jikalau Engkau berkenan, ambillah cawan ini dari hadapan-Ku, tetapi janganlah menurut kehendak-Ku, melainkan kehendak-Mu yang terjadi.”",
        ref: "Matius 26:39",
        renungan: "Bapa, ajarilah kami selalu mengikuti kehendak-Mu. Pada saat kami dicobai, Engkau pasti menyertai kami sebagai Bapa, karena Engkau sangat menyayangi kami." },
      { judul: "Yesus didera",
        ayat: "“Mereka memukul kepala-Nya dengan buluh, dan meludahi-Nya dan berlutut menyembah-Nya. Sesudah mengolok-olok Dia, mereka menanggalkan jubah ungu yang dipakai-Nya dan mengenakan lagi pakaian-Nya kepada-Nya.”",
        ref: "Markus 15:19–20a",
        renungan: "Bapa, berilah kami rahmat untuk selalu mengingat sengsara Putera-Mu, agar kami dapat berdiri teguh dan memikul salib dengan kasih." },
      { judul: "Yesus dimahkotai duri",
        ayat: "“Mereka menganyam sebuah mahkota duri dan menaruhnya di atas kepala-Nya. Kemudian mereka mulai memberi hormat kepada-Nya, katanya: ‘Salam, hai Raja orang Yahudi!’”",
        ref: "Markus 15:17–18",
        renungan: "Bapa, Putera-Mu dimahkotai duri, tetapi Ia tidak pernah membenci algojo-Nya. Ajarilah kami mengampuni dan memberkati sesama kami." },
      { judul: "Yesus memanggul salib-Nya ke gunung Kalvari",
        ayat: "“Sambil memikul salib-Nya, Ia pergi keluar ke tempat yang bernama Tempat Tengkorak, yang dalam bahasa Ibrani disebut Golgota.”",
        ref: "Yohanes 19:17",
        renungan: "Bapa, ajarilah kami memikul salib kehidupan ini tanpa mengeluh dan dengan penuh iman, supaya kami sungguh serupa dengan Yesus Putera-Mu sendiri." },
      { judul: "Yesus wafat di salib",
        ayat: "“Yesus berseru dengan suara nyaring: ‘Ya Bapa, ke dalam tangan-Mu Kuserahkan nyawa-Ku.’ Sesudah berkata demikian Ia menyerahkan nyawa-Nya.”",
        ref: "Lukas 23:46",
        renungan: "Bapa, hadirlah dekat kami bersama Putera dan Roh-Mu pada saat kami menghadapi kematian, dan terimalah kami dalam Kerajaan kasih-Mu yang kekal." }
    ]
  },
  mulia: {
    id: "mulia", nama: "Peristiwa Mulia",
    hari: "Rabu, Minggu, dan masa Paskah",
    peristiwa: [
      { judul: "Yesus bangkit dari antara orang mati",
        ayat: "“Malaikat itu berkata: Janganlah kamu takut, sebab aku tahu kamu mencari Yesus yang disalibkan itu. Ia tidak ada di sini, sebab Ia telah bangkit, sama seperti yang dikatakan-Nya.”",
        ref: "Matius 28:5–6",
        renungan: "Bapa, mampukanlah kami melanjutkan misi Putera-Mu, yaitu memberitakan Injil kepada semua orang agar Kerajaan-Mu menjadi nyata di bumi ini." },
      { judul: "Yesus naik ke surga",
        ayat: "“Sesudah Ia mengatakan demikian, Ia diangkat ke surga disaksikan oleh mereka, dan awan menutupi-Nya dari pandangan mereka … Yesus ini yang diangkat ke surga meninggalkan kamu, akan kembali dengan cara yang sama seperti kamu lihat Dia naik ke surga.”",
        ref: "Kisah Para Rasul 1:9–11",
        renungan: "Bapa, Engkau tumpuan hidup dan harapan kami. Tanamkanlah dalam diri kami keyakinan bahwa Engkau menyertai kami selalu hingga akhir zaman." },
      { judul: "Roh Kudus turun atas para rasul",
        ayat: "“Tiba-tiba terdengarlah bunyi dari langit seperti tiupan angin keras yang memenuhi seluruh rumah di mana mereka duduk … lalu mereka semua dipenuhi Roh Kudus, dan mulai berbicara dalam bahasa lain, seperti yang diberikan oleh Roh itu kepada mereka untuk dikatakan.”",
        ref: "Kisah Para Rasul 2:2–4",
        renungan: "Bapa, semoga Roh Kudus-Mu membimbing hidup kami dalam kasih dan kebenaran-Mu, serta menjadikan kami layak di hadapan-Mu." },
      { judul: "Maria diangkat ke surga",
        ayat: "“Jikalau kita percaya bahwa Yesus telah mati dan telah bangkit, maka kita percaya juga bahwa dengan perantaraan Yesus, Allah akan mengumpulkan bersama-sama dengan Dia mereka yang telah meninggal … Demikianlah kita akan selama-lamanya bersama-sama dengan Tuhan.”",
        ref: "1 Tesalonika 4:14, 17",
        renungan: "Bapa, berilah kami iman yang hidup, dan jadikanlah kami saksi-Mu di hadapan sesama kami." },
      { judul: "Maria dimahkotai di surga",
        ayat: "“Tampaklah suatu tanda besar di langit: seorang perempuan berselubungkan matahari dengan bulan di bawah kakinya dan sebuah mahkota dari dua belas bintang di atas kepalanya.”",
        ref: "Wahyu 12:1",
        renungan: "Bapa, satu-satunya sumber kasih sejati, kobarkanlah dalam diri kami semangat kasih-Mu kepada Bunda Putera-Mu, sebab kami memandangnya sebagai teladan pengikut Yesus." }
    ]
  },
  terang: {
    id: "terang", nama: "Peristiwa Terang",
    hari: "Kamis",
    peristiwa: [
      { judul: "Yesus dibaptis di sungai Yordan",
        ayat: "“Sesudah dibaptis, Yesus segera keluar dari air dan pada waktu itu juga langit terbuka dan Ia melihat Roh Allah seperti burung merpati turun ke atas-Nya, lalu terdengarlah suara dari surga yang mengatakan: ‘Inilah Anak-Ku yang terkasih, kepada-Nyalah Aku berkenan.’”",
        ref: "Matius 3:16–17",
        renungan: "Bapa, kami pun Engkau beri misi sebagai anak-Mu dan pengikut Yesus. Buatlah kami menerima tugas itu dengan hati terbuka dan penuh sukacita." },
      { judul: "Yesus menyatakan diri-Nya dalam pesta pernikahan di Kana",
        ayat: "“Hal itu dilakukan Yesus … sebagai yang pertama dari tanda-tanda-Nya dan dengan itu Ia telah menyatakan kemuliaan-Nya, dan murid-murid-Nya percaya kepada-Nya.”",
        ref: "Yohanes 2:11",
        renungan: "Bapa, tolonglah kami mampu menghadapi setiap masalah hidup ini dengan tenang sambil mengandalkan kasih-Mu kepada kami." },
      { judul: "Yesus memberitakan Kerajaan Allah dan menyerukan pertobatan",
        ayat: "“Bertobatlah, sebab Kerajaan Surga sudah dekat! Yesus pun berkeliling di seluruh Galilea; Ia mengajar dalam rumah-rumah ibadat dan memberitakan Injil Kerajaan Surga serta menyembuhkan orang-orang di antara bangsa itu.”",
        ref: "Matius 4:17, 23",
        renungan: "Bapa, pertobatkanlah kami. Ampunilah dosa kami. Jadikanlah kami mampu mengampuni orang yang telah menyakiti kami." },
      { judul: "Yesus menampakkan kemuliaan-Nya",
        ayat: "Yesus berubah rupa di sebuah gunung yang tinggi. Wajah-Nya bercahaya seperti matahari. Allah bersabda kepada tiga rasul Yesus: “Inilah Anak-Ku yang terkasih, kepada-Nyalah Aku berkenan, dengarkanlah Dia.”",
        ref: "Matius 17:2–5",
        renungan: "Bapa, ajarlah kami mendengarkan Yesus dan sepenuhnya menerima ajaran-Nya. Izinkanlah kami semakin mengenal Dia, terutama dalam sengsara-Nya." },
      { judul: "Yesus menetapkan Ekaristi",
        ayat: "Yesus mengambil roti, mengucap syukur, memecah-mecahkannya lalu memberikannya kepada mereka dan berkata: “Ambillah, inilah tubuh-Ku.” Sesudah itu Ia mengambil cawan, mengucap syukur lalu memberikannya kepada mereka. Ia berkata: “Inilah darah-Ku yang ditumpahkan bagi banyak orang.”",
        ref: "Markus 14:22–24",
        renungan: "Bapa, sucikan dan kuduskanlah kami pada saat kami menerima Tubuh dan Darah Putera-Mu yang terkasih; pakailah kami sekehendak-Mu." }
    ]
  }
};

const INTENTIONS_3 = ["Salam Putri Allah Bapa", "Salam Bunda Allah Putra", "Salam Mempelai Allah Roh Kudus"];

/* Build ordered steps for a mystery. salamKe 0..49 continuous across decades. */
function buildSteps(mysteryId) {
  const m = MYSTERIES[mysteryId] || MYSTERIES.gembira;
  const steps = [];
  const push = (s) => steps.push(Object.assign({ salamKe: null }, s));
  push({ kind: "pembuka", title: "Doa Pembuka", kicker: "Pembuka", text: FULL.doaPembuka });
  push({ kind: "tanda", title: "Tanda Salib", kicker: "Pembuka", text: FULL.tandaSalib });
  push({ kind: "percaya", title: "Aku Percaya", sub: "Syahadat Para Rasul", kicker: "Pembuka", text: FULL.akuPercaya });
  push({ kind: "bapa", title: "Bapa Kami", kicker: "Doa awal", text: FULL.bapaKami, leader: true });
  INTENTIONS_3.forEach((inten, i) => {
    push({ kind: "salam3", title: "Salam Maria", sub: inten + ` (${i + 1}/3)`, kicker: "Doa awal", text: FULL.salamMaria });
  });
  push({ kind: "kemuliaan", title: "Kemuliaan", kicker: "Doa awal", text: FULL.kemuliaan });
  push({ kind: "terpujilah", title: "Terpujilah", kicker: "Doa awal", text: FULL.terpujilah });
  let salamKe = 0;
  m.peristiwa.forEach((p, pi) => {
    push({ kind: "umum", title: `${m.nama} ${pi + 1}/5`, sub: p.judul, kicker: "Peristiwa", ayat: p.ayat, ref: p.ref, text: [p.renungan] });
    push({ kind: "bapa", title: "Bapa Kami", sub: `${m.nama} ${pi + 1}/5`, kicker: "Peristiwa " + (pi + 1), text: FULL.bapaKami, leader: true });
    for (let j = 0; j < 10; j++) {
      push({ kind: "salam", title: "Salam Maria", sub: `${m.nama} ${pi + 1}/5 — butir ${j + 1}/10`, kicker: "Peristiwa " + (pi + 1), text: FULL.salamMaria, salamKe: salamKe++ });
    }
    push({ kind: "kemuliaan", title: "Kemuliaan", sub: `${m.nama} ${pi + 1}/5`, kicker: "Peristiwa " + (pi + 1), text: FULL.kemuliaan });
    push({ kind: "terpujilah", title: "Terpujilah", sub: `${m.nama} ${pi + 1}/5`, kicker: "Peristiwa " + (pi + 1), text: FULL.terpujilah });
    push({ kind: "fatima", title: "Doa Fatima", sub: `${m.nama} ${pi + 1}/5`, kicker: "Peristiwa " + (pi + 1), text: FULL.fatima, leader: true });
  });
  push({ kind: "ratu", title: "Salam, Ya Ratu", kicker: "Penutup", text: FULL.salamYaRatu });
  push({ kind: "doakanlah", title: "Doakanlah Kami", kicker: "Penutup", text: FULL.doakanlah });
  push({ kind: "marilah", title: "Marilah Berdoa", kicker: "Penutup", text: FULL.marilahBerdoa });
  push({ kind: "tanda", title: "Tanda Salib (Penutup)", kicker: "Penutup", text: FULL.tandaSalib });
  steps.forEach((s, i) => (s.index = i));
  return steps;
}
