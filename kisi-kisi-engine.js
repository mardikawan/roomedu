/* =========================================================================
   MESIN PENALARAN KISI-KISI KURIKULUM (LAZY LOADED MODULE)
   Master Database Jangka Panjang - Terintegrasi Biologi, Fisika, Kimia, Matematika
   ========================================================================= */

// 1. DATABASE KURIKULUM LENGKAP (Fase E & F / Kelas X, XI, XII)
window.BASIS_PENGETAHUAN_KURIKULUM = {
    "Biologi": [
        // Kelas X (Keanekaragaman, Klasifikasi, Ekologi)
        { pola: /ruang lingkup|cabang ilmu|zoologi|botani|genetika|sitologi|histologi/i, kompetensi: "Mengidentifikasi ruang lingkup biologi dan cabang-cabang ilmu biologi" },
        { pola: /metode ilmiah|masalah|hipotesis|variabel bebas|variabel terikat|variabel kontrol/i, kompetensi: "Menerapkan langkah-langkah metode ilmiah dalam pemecahan masalah biologi" },
        { pola: /keselamatan kerja|jas lab|simbol bahaya|korosif|toksik|mudah terbakar/i, kompetensi: "Menerapkan prosedur keselamatan kerja di laboratorium biologi" },
        { pola: /mikroskop|okuler|objektif|makrometer|mikrometer|preparat|kaca preparat/i, kompetensi: "Mengidentifikasi komponen, fungsi mikroskop, dan cara pembuatan preparat" },
        { pola: /tingkat organisasi|molekul|\bsel\b|jaringan|organ|sistem organ|individu|populasi/i, kompetensi: "Menganalisis tingkat organisasi kehidupan dari molekul hingga biosfer" },
        { pola: /keanekaragaman|biodiversitas|tingkat \bgen\b|tingkat jenis|tingkat ekosistem/i, kompetensi: "Menganalisis berbagai tingkat keanekaragaman hayati di Indonesia" },
        { pola: /plasma nutfah|varietas|hibrida|galur murni|persilangan/i, kompetensi: "Menjelaskan konsep plasma nutfah dan variasinya dalam satu spesies" },
        { pola: /fauna indonesia|tipe asiatis|tipe peralihan|tipe australis|garis wallace|garis weber/i, kompetensi: "Menganalisis persebaran fauna Indonesia berdasarkan garis Wallace dan Weber" },
        { pola: /endemik|hewan endemik|komodo|anoa|babi rusa|burung cenderawasih/i, kompetensi: "Mengidentifikasi hewan-hewan endemik khas kawasan Nusantara" },
        { pola: /flora malesiana|meranti|raflesia|anggrek|kantong semar/i, kompetensi: "Mengidentifikasi kekayaan flora Malesiana yang ada di Indonesia" },
        { pola: /pelestarian|konservasi|in situ|ex situ|taman nasional|cagar alam|kebun raya/i, kompetensi: "Mengevaluasi upaya pelestarian keanekaragaman hayati secara in situ dan ex situ" },
        { pola: /klasifikasi|taksonomi|tujuan klasifikasi|manfaat klasifikasi|tata nama ganda|binomial nomenclature/i, kompetensi: "Menjelaskan prinsip, tujuan, dan aturan tata nama klasifikasi makhluk hidup" },
        { pola: /sistem kingdom|dua kingdom|tiga kingdom|empat kingdom|lima kingdom|domain|filum|divisi|kelas|ordo|famili|genus|spesies/i, kompetensi: "Menganalisis perkembangan sistem klasifikasi dan tingkatan takson" },
        { pola: /kunci determinasi|kunci dikotomi|ciri morfologi|identifikasi/i, kompetensi: "Menggunakan kunci determinasi untuk mengidentifikasi makhluk hidup" },
        { pola: /filogeni|kladogram|pohon filogenetik|kekerabatan|nenek moyang/i, kompetensi: "Menganalisis hubungan kekerabatan makhluk hidup menggunakan kladogram" },
        { pola: /virus|virologi|ciri virus|parasit obligat|aseluler|kapsid|kapsomer|asam nukleat|bakteriofag/i, kompetensi: "Menganalisis ciri-ciri, struktur, dan replikasi virus" },
        { pola: /daur litik|daur lisogenik|adsorpsi|penetrasi|sintesis|perakitan|lisis/i, kompetensi: "Membandingkan mekanisme replikasi virus melalui daur litik dan lisogenik" },
        { pola: /bakteri|monera|prokariotik uniseluler|peptidoglikan|basil|kokus|spirilum|pewarnaan gram/i, kompetensi: "Menganalisis ciri-ciri, struktur, dan klasifikasi kelompok Monera (Bakteri)" },
        { pola: /reproduksi bakteri|pembelahan biner|konjugasi|transformasi|transduksi/i, kompetensi: "Menganalisis mekanisme reproduksi bakteri secara aseksual dan paraseksual" },
        { pola: /protista|protozoa|rhizopoda|ciliata|flagellata|sporozoa|alga|ganggang|jamur lendir/i, kompetensi: "Menganalisis ciri-ciri dan pengklasifikasian organisme kingdom Protista" },
        { pola: /fungi|jamur|eukariotik heterotrof|saprofit|parasit|dinding sel kitin|hifa|miselium|zygomycota|ascomycota|basidiomycota/i, kompetensi: "Menganalisis ciri, struktur, reproduksi, dan peranan kingdom Fungi" },
        { pola: /plantae|dunia tumbuhan|bryophyta|lumut|pteridophyta|paku|spermatophyta|tumbuhan berbiji/i, kompetensi: "Menganalisis ciri-ciri umum, siklus hidup, dan klasifikasi kingdom Plantae" },
        { pola: /animalia|dunia hewan|porifera|coelenterata|platyhelminthes|nemathelminthes|annelida|mollusca|arthropoda|echinodermata|chordata/i, kompetensi: "Menganalisis ciri-ciri umum dan klasifikasi kingdom Animalia" },
        { pola: /ekologi|ekosistem|komponen abiotik|biotik|rantai makanan|jaring-jaring|piramida ekologi|daur biogeokimia/i, kompetensi: "Menganalisis interaksi antar komponen ekosistem dan aliran energi" },
        { pola: /pencemaran|polusi|polutan|pemanasan global|efek rumah kaca|perubahan iklim|limbah/i, kompetensi: "Mengevaluasi penyebab dan dampak perubahan lingkungan serta upaya penanganannya" },
        
        // Kelas XI (Sel, Jaringan, dan Sistem Organ)
        { pola: /organel|mitokondria|ribosom|membran|nukleus|kloroplas|transpor|osmosis|difusi|endositosis|fagositosis|eksositosis/i, kompetensi: "Menganalisis struktur dan fungsi sel serta bioproses transpor zat yang terjadi di dalamnya" },
        { pola: /jaringan tumbuhan|meristem|xilem|floem|parenkim|kolenkim|sklerenkim|epidermis/i, kompetensi: "Menganalisis keterkaitan antara struktur sel pada jaringan tumbuhan dengan fungsinya" },
        { pola: /jaringan hewan|epitel|otot|tulang|saraf|darah|ikat padat|ikat longgar/i, kompetensi: "Menganalisis keterkaitan antara struktur sel pada jaringan hewan dengan fungsinya" },
        { pola: /gerak|tulang|sendi|otot|kontraksi|aktin|miosin|rangka|osteoporosis|artritis/i, kompetensi: "Menganalisis hubungan antara struktur jaringan pembentuk organ pada sistem gerak dan kelainannya" },
        { pola: /jantung|pembuluh darah|kapiler|limfatik|plasma|eritrosit|leukosit|trombosit|golongan darah|anemia|hipertensi/i, kompetensi: "Menganalisis sistem sirkulasi darah dan limfatik serta gangguan fungsi yang mungkin terjadi" },
        { pola: /pencernaan|lambung|\bhcl\b|pepsin|usus|hati|empedu|pankreas|nutrisi|vitamin|diare|maag/i, kompetensi: "Menganalisis sistem pencernaan makanan, kebutuhan nutrisi, bioproses, dan gangguannya" },
        { pola: /pernapasan|inspirasi|ekspirasi|alveolus|trakea|bronkus|paru|oksigen|karbon dioksida|kapasitas paru/i, kompetensi: "Menganalisis keterkaitan struktur organ pada sistem pernapasan dengan fungsinya serta gangguan yang terjadi" },
        { pola: /ekskresi|ginjal|nefron|urine|glomerulus|filtrasi|reabsorpsi|augmentasi|kulit|keringat/i, kompetensi: "Menganalisis sistem ekskresi pada manusia dan mekanisme pemeliharaan homeostasis" },
        { pola: /saraf|neuron|otak|medula spinalis|sinapsis|neurotransmiter|gerak sadar|gerak refleks/i, kompetensi: "Menganalisis sistem koordinasi (saraf) dan mekanisme penghantaran impuls" },
        { pola: /hormon|endokrin|hipofisis|tiroid|insulin|adrenalin|kelenjar buntu/i, kompetensi: "Menganalisis sistem endokrin (hormon) dalam pengaturan proses fisiologis tubuh" },
        { pola: /indra|mata|telinga|hidung|lidah|kulit peraba|retina|koklea/i, kompetensi: "Menganalisis struktur dan fungsi sistem indera manusia serta gangguannya" },
        { pola: /reproduksi manusia|ovarium|testis|menstruasi|fertilisasi|kehamilan|spermatogenesis|oogenesis|kb|pms/i, kompetensi: "Menganalisis sistem reproduksi pada manusia, proses fertilisasi, dan penerapan prinsip reproduksi sehat" },
        { pola: /imun|kekebalan|antigen|antibodi|vaksin|imunisasi|alergi|limfosit|makrofag|fagosit/i, kompetensi: "Menganalisis peran sistem imun, mekanisme pertahanan spesifik dan nonspesifik tubuh" },

        // Kelas XII (Pertumbuhan, Metabolisme, Genetika, Evolusi, Bioteknologi)
        { pola: /pertumbuhan|perkembangan tumbuhan|fitohormon|auksin|giberelin|perkecambahan|epigeal|hipogeal/i, kompetensi: "Menganalisis faktor internal dan eksternal yang memengaruhi pertumbuhan dan perkembangan makhluk hidup" },
        { pola: /enzim|biokatalisator|sisi aktif|inhibitor|katabolisme|anabolisme|respirasi aerob|fermentasi/i, kompetensi: "Menganalisis proses metabolisme, cara kerja enzim, dan transformasi energi (katabolisme & anabolisme)" },
        { pola: /fotosintesis|reaksi terang|reaksi gelap|siklus calvin|kemosintesis|klorofil/i, kompetensi: "Menganalisis tahapan reaksi fotosintesis dan kemosintesis pada tumbuhan" },
        { pola: /kromosom|dna|rna|sintesis protein|replikasi|transkripsi|translasi|kodon|antikodon/i, kompetensi: "Menganalisis hubungan struktur DNA, RNA, kromosom, dan tahapan sintesis protein" },
        { pola: /pembelahan \bsel\b|mitosis|meiosis|siklus sel|profase|metafase|anafase|telofase|crossing over/i, kompetensi: "Menganalisis proses pembelahan sel sebagai dasar penurunan sifat dan variasi genetik" },
        { pola: /mendel|hereditas|persilangan|monohibrid|dihibrid|genotip|fenotip|alel/i, kompetensi: "Menerapkan prinsip hereditas Mendel pada pewarisan sifat makhluk hidup" },
        { pola: /epistasis|hipostasis|kriptomeri|polimeri|atavisme|pautan gen|pindah silang/i, kompetensi: "Menganalisis pola-pola penyimpangan semu hukum Mendel dan pautan gen" },
        { pola: /hereditas manusia|golongan darah|buta warna|hemofilia|albino|peta silsilah|pedigree/i, kompetensi: "Menganalisis pola pewarisan sifat dan kelainan genetik pada manusia menggunakan peta silsilah" },
        { pola: /mutasi|delesi|insersi|poliploidi|sindrom down|sindrom turner|mutagen/i, kompetensi: "Menganalisis peristiwa mutasi pada kromosom dan gen serta dampaknya bagi kehidupan" },
        { pola: /evolusi|seleksi alam|hukum hardy weinberg|spesiasi|homologi|fosil|darwin|lamarck/i, kompetensi: "Menganalisis teori evolusi, mekanisme seleksi alam, dan petunjuk-petunjuk evolusi" },
        { pola: /bioteknologi|rekayasa genetika|kultur jaringan|kloning|plasmid|dna rekombinan|fermentasi|transgenik/i, kompetensi: "Menganalisis prinsip-prinsip bioteknologi modern dan konvensional serta penerapannya bagi kesejahteraan manusia" }
    ],
    "Fisika": [
        // Kelas X (Pengukuran, Kinematika, Dinamika Dasar)
        { pola: /besaran|satuan|dimensi|ampere|besaran pokok|besaran turunan|\bsi\b/i, kompetensi: "Menerapkan konsep besaran pokok, turunan, satuan, dan analisis dimensi" },
        { pola: /jangka sorong|mikrometer|neraca|alat ukur|skala nonius|angka penting|ketelitian|pengukuran/i, kompetensi: "Menerapkan prinsip pengukuran besaran fisis, ketepatan, ketelitian, dan aturan angka penting" },
        { pola: /vektor|resultan|skalar|poligon|komponen|sudut apit|searah sumbu|perkalian titik|perkalian silang/i, kompetensi: "Menerapkan prinsip penjumlahan, penguraian, dan operasi matematika vektor sebidang" },
        { pola: /kecepatan|percepatan|kelajuan|glbb|gerak lurus beraturan|jatuh bebas/i, kompetensi: "Menganalisis besaran fisis pada gerak lurus dengan kecepatan dan percepatan konstan" },
        { pola: /gerak parabola|peluru|sudut elevasi|titik tertinggi|jarak terjauh/i, kompetensi: "Menganalisis gerak parabola dengan menggunakan vektor" },
        { pola: /gerak melingkar|sentripetal|kecepatan sudut|percepatan sudut|periode|frekuensi/i, kompetensi: "Menganalisis besaran fisis pada gerak melingkar dengan kelajuan konstan" },
        { pola: /hukum newton|gaya gesek|gaya normal|tegangan tali|katrol|bidang miring|dinamika/i, kompetensi: "Menganalisis interaksi gaya dan hukum Newton tentang gerak pada berbagai kondisi" },
        { pola: /gravitasi|hukum kepler|medan gravitasi|kecepatan orbit|satelit/i, kompetensi: "Menganalisis hukum-hukum gravitasi universal Newton dan hukum Kepler" },
        { pola: /usaha|energi kinetik|energi potensial|hukum kekekalan energi|daya|kerja mekanik/i, kompetensi: "Menganalisis konsep usaha, hubungan usaha dan perubahan energi, serta kekekalan energi mekanik" },
        { pola: /momentum|impuls|tumbukan|lenting sempurna|koefisien restitusi|kekekalan momentum/i, kompetensi: "Menerapkan konsep momentum, impuls, dan hukum kekekalan momentum pada peristiwa tumbukan" },
        { pola: /gerak harmonis|getaran|pegas|ayunan bandul|amplitudo|periode pegas/i, kompetensi: "Menganalisis hubungan antara gaya dan getaran dalam gerak harmonis sederhana" },
        
        // Kelas XI (Elastisitas, Fluida, Kalor, Termodinamika, Gelombang Mekanik)
        { pola: /momen gaya|momen inersia|momentum sudut|dinamika rotasi|titik berat|kesetimbangan tegar/i, kompetensi: "Menerapkan konsep dinamika rotasi dan kesetimbangan benda tegar dalam kehidupan sehari-hari" },
        { pola: /elastisitas|hukum hooke|modulus young|tegangan|regangan|konstanta pegas/i, kompetensi: "Menganalisis sifat elastisitas bahan dan penerapan hukum Hooke pada susunan pegas" },
        { pola: /fluida statis|hukum pascal|archimedes|tekanan hidrostatis|kapilaritas|meniskus/i, kompetensi: "Menerapkan hukum-hukum fluida statis pada permasalahan mekanika fluida" },
        { pola: /fluida dinamis|hukum bernoulli|viskositas|debit aliran|persamaan kontinuitas|sayap pesawat/i, kompetensi: "Menerapkan prinsip fluida dinamis (asas Bernoulli dan kontinuitas) dalam teknologi" },
        { pola: /suhu|kalor|pemuaian|asas black|perpindahan panas|konduksi|konveksi|radiasi|kapasitas kalor/i, kompetensi: "Menganalisis pengaruh kalor terhadap suhu, wujud zat, dan perpindahan kalor" },
        { pola: /teori kinetik gas|hukum boyle|gas ideal|tekanan gas|kecepatan efektif/i, kompetensi: "Menganalisis persamaan keadaan gas ideal dan sifat-sifat teori kinetik gas" },
        { pola: /termodinamika|mesin carnot|isotermik|adiabatik|isobarik|isokhorik|entalpi|entropi/i, kompetensi: "Menganalisis hukum-hukum termodinamika dan penerapannya pada mesin kalor" },
        { pola: /gelombang mekanik|gelombang berjalan|gelombang stasioner|simpul|perut|amplitudo|fase/i, kompetensi: "Menganalisis besaran-besaran fisis gelombang berjalan dan gelombang stasioner" },
        { pola: /gelombang bunyi|efek doppler|intensitas bunyi|taraf intensitas|pipa organa|dawai/i, kompetensi: "Menerapkan konsep gelombang bunyi, resonansi, dan efek Doppler dalam kehidupan sehari-hari" },
        { pola: /gelombang cahaya|interferensi|difraksi|polarisasi|kisi|celah ganda/i, kompetensi: "Menganalisis fenomena interferensi, difraksi, dan polarisasi pada gelombang cahaya" },
        { pola: /cermin|lensa|alat optik|mikroskop|teropong|mata|miopi|hipermetropi|lup/i, kompetensi: "Menganalisis cara kerja alat optik menggunakan prinsip pemantulan dan pembiasan cahaya" },
        { pola: /pemanasan global|gas rumah kaca|perubahan iklim|dampak pemanasan global/i, kompetensi: "Menganalisis gejala pemanasan global dan dampaknya bagi kehidupan serta lingkungan" },

        // Kelas XII (Listrik, Magnet, Fisika Modern)
        { pola: /listrik searah|arus dc|hukum ohm|hukum kirchhoff|rangkaian seri|paralel|jembatan wheatstone/i, kompetensi: "Menganalisis prinsip kerja rangkaian listrik arus searah (DC) dalam kehidupan sehari-hari" },
        { pola: /listrik statis|hukum coulomb|medan listrik|potensial listrik|kapasitor|dielektrik/i, kompetensi: "Menganalisis muatan listrik, gaya Coulomb, medan listrik, dan kapasitansi keping sejajar" },
        { pola: /medan magnet|gaya lorentz|kawat lurus|solenoida|toroida/i, kompetensi: "Menganalisis timbulnya medan magnetik di sekitar kawat berarus dan gaya Lorentz" },
        { pola: /induksi elektromagnetik|fluks magnetik|hukum faraday|hukum lenz|transformator|generator/i, kompetensi: "Menganalisis fenomena induksi elektromagnetik dan prinsip kerja transformator/generator" },
        { pola: /listrik bolak-balik|arus ac|impedansi|reaktansi induktif|kapasitif|rangkaian rlc|resonansi/i, kompetensi: "Menganalisis besaran fisis pada rangkaian arus bolak-balik (AC) dan fenomena resonansi" },
        { pola: /gelombang elektromagnetik|spektrum gem|sinar gamma|sinar x|inframerah|ultraviolet|radar/i, kompetensi: "Mengklasifikasikan spektrum gelombang elektromagnetik beserta manfaat dan bahayanya" },
        { pola: /relativitas khusus|postulat einstein|waktu dilatasi|kontraksi panjang|massa relativistik/i, kompetensi: "Menganalisis fenomena teori relativitas khusus Einstein terhadap besaran ruang dan waktu" },
        { pola: /fisika kuantum|efek fotolistrik|hamburan compton|radiasi benda hitam|foton|panjang gelombang de broglie/i, kompetensi: "Menganalisis konsep radiasi benda hitam, efek fotolistrik, dan dualisme gelombang-partikel" },
        { pola: /teknologi digital|transmisi data|penyimpanan data|analog ke digital/i, kompetensi: "Menjelaskan konsep transmisi dan penyimpanan data dalam bentuk digital maupun analog" },
        { pola: /inti atom|radioaktivitas|waktu paruh|defek massa|energi ikat inti|reaksi fisi|fusi/i, kompetensi: "Menganalisis struktur inti atom, radioaktivitas, peluruhan, dan pemanfaatan radioisotop" },
        { pola: /sumber energi|energi terbarukan|energi alternatif|surya|geotermal|biomassa|pltu|nuklir/i, kompetensi: "Menganalisis keterbatasan sumber energi konvensional dan potensi energi alternatif (terbarukan)" }
    ],
    "Kimia": [
        // Kelas X
        { pola: /hakikat ilmu kimia|metode ilmiah|keselamatan kerja kimia/i, kompetensi: "Memahami hakikat ilmu kimia, metode ilmiah, dan keselamatan kerja di laboratorium" },
        { pola: /model atom|teori atom|proton|elektron|neutron|dalton|thomson|rutherford|bohr/i, kompetensi: "Menganalisis perkembangan model atom dari Dalton hingga Bohr" },
        { pola: /konfigurasi elektron|mekanika kuantum|bilangan kuantum|orbital|asas aufbau/i, kompetensi: "Menentukan konfigurasi elektron dan letak unsur dalam tabel periodik berdasarkan mekanika kuantum" },
        { pola: /sistem periodik|jari-jari atom|energi ionisasi|afinitas elektron|elektronegatifitas/i, kompetensi: "Menganalisis sifat keperiodikan unsur berdasarkan struktur atomnya" },
        { pola: /ikatan ion|ikatan kovalen|kovalen koordinasi|ikatan logam|struktur lewis/i, kompetensi: "Membandingkan proses pembentukan ikatan ion, kovalen, dan logam serta sifat senyawanya" },
        { pola: /bentuk molekul|vsepr|domain elektron|hibridisasi/i, kompetensi: "Meramalkan bentuk molekul berdasarkan teori VSEPR atau hibridisasi" },
        { pola: /gaya antarmolekul|ikatan hidrogen|gaya london|van der waals|titik didih/i, kompetensi: "Menganalisis hubungan gaya antarmolekul dengan sifat fisik senyawa" },
        { pola: /daya hantar listrik|larutan elektrolit|non elektrolit|ionisasi/i, kompetensi: "Membedakan daya hantar listrik berbagai larutan elektrolit dan nonelektrolit" },
        { pola: /bilangan oksidasi|reaksi redoks|reduksi oksidasi|reduktor|oksidator/i, kompetensi: "Menganalisis reaksi reduksi-oksidasi berdasarkan perubahan bilangan oksidasi" },
        { pola: /tata nama senyawa|rumus kimia|senyawa ionik|senyawa kovalen/i, kompetensi: "Menerapkan aturan IUPAC dalam penamaan senyawa kimia anorganik dan organik sederhana" },
        { pola: /hukum dasar kimia|lavoisier|proust|dalton|gay lussac|avogadro/i, kompetensi: "Menerapkan hukum-hukum dasar kimia dalam penyelesaian perhitungan kimia" },
        { pola: /konsep mol|massa molar|volume molar|pereaksi pembatas|stoikiometri/i, kompetensi: "Menerapkan konsep mol dan stoikiometri dalam menyelesaikan perhitungan persamaan kimia" },

        // Kelas XI
        { pola: /hidrokarbon|alkana|alkena|alkuna|isomer|atom karbon primer/i, kompetensi: "Menganalisis struktur, tata nama, sifat, dan isomer senyawa hidrokarbon" },
        { pola: /minyak bumi|fraksi minyak bumi|distilasi bertingkat|oktan|petrokimia/i, kompetensi: "Menganalisis proses pembentukan dan fraksi pemisahan minyak bumi serta dampaknya" },
        { pola: /termokimia|entalpi|eksoterm|endoterm|kalorimeter|energi ikatan|hukum hess/i, kompetensi: "Menganalisis perubahan entalpi reaksi berdasarkan termokimia dan Hukum Hess" },
        { pola: /laju reaksi|orde reaksi|waktu paruh|katalis|luas permukaan|suhu laju/i, kompetensi: "Menganalisis faktor-faktor yang memengaruhi laju reaksi dan menentukan persamaan lajunya" },
        { pola: /kesetimbangan kimia|pergeseran kesetimbangan|azas le chatelier|kc|kp/i, kompetensi: "Menganalisis faktor pergeseran kesetimbangan dan menentukan tetapan kesetimbangan kimia" },
        { pola: /asam basa|arrhenius|bronsted lowry|lewis|indikator|ph larutan|trayek ph/i, kompetensi: "Menganalisis sifat asam basa larutan menggunakan indikator dan menghitung pH-nya" },
        { pola: /hidrolisis garam|asam kuat basa lemah|ph garam|kation anion/i, kompetensi: "Menganalisis jenis garam yang mengalami hidrolisis dan menghitung pH larutannya" },
        { pola: /larutan penyangga|buffer|ph penyangga|asam konjugasi|basa konjugasi/i, kompetensi: "Menganalisis prinsip kerja, pembuatan, dan perhitungan pH larutan penyangga" },
        { Titrasi: /titrasi asam basa|titik ekuivalen|titik akhir|kurva titrasi/i, kompetensi: "Menganalisis data kurva titrasi asam basa untuk menentukan konsentrasi zat" },
        { pola: /kelarutan|ksp|tetapan hasil kali kelarutan|pengendapan|ion senama/i, kompetensi: "Menganalisis kesetimbangan kelarutan dan memprediksi terbentuknya endapan (Ksp)" },
        { pola: /koloid|suspensi|efek tyndall|gerak brown|koagulasi|dialisis|adsorpsi/i, kompetensi: "Menganalisis sifat-sifat koloid, pembuatannya, serta penerapannya dalam kehidupan" },

        // Kelas XII
        { pola: /sifat koligatif|penurunan tekanan uap|titik didih|titik beku|tekanan osmotik|faktor vant hoff/i, kompetensi: "Menganalisis fenomena sifat koligatif larutan elektrolit dan nonelektrolit" },
        { pola: /penyetaraan redoks|reaksi redoks setengah reaksi|biloks/i, kompetensi: "Menyetarakan persamaan reaksi redoks dengan metode setengah reaksi dan biloks" },
        { pola: /sel volta|potensial sel|deret volta|katoda|anoda|baterai|korosi/i, kompetensi: "Menganalisis proses pada sel Volta, menghitung potensial sel, dan pencegahan korosi" },
        { pola: /sel elektrolisis|hukum faraday|elektroplating|pemurnian logam|katoda anoda elektrolisis/i, kompetensi: "Menerapkan stoikiometri hukum Faraday untuk memprediksi massa zat hasil elektrolisis" },
        { pola: /kimia unsur|gas mulia|halogen|alkali|alkali tanah|unsur transisi|periode 3|golongan utama/i, kompetensi: "Menganalisis kelimpahan, sifat, dan kegunaan unsur-unsur golongan utama dan transisi" },
        { pola: /senyawa karbon|haloalkana|alkanol|alkoksialkana|alkanal|alkanon|alkanoat/i, kompetensi: "Menganalisis struktur, tata nama, sifat, dan kegunaan senyawa karbon turunan alkana" },
        { pola: /benzena|turunan benzena|orto meta para|toluena|fenol|anilin/i, kompetensi: "Menganalisis struktur, tata nama, sifat, dan kegunaan benzena beserta turunannya" },
        { pola: /makromolekul|polimer|karbohidrat|protein|lemak|lipid|monosakarida|asam amino|ikatan peptida/i, kompetensi: "Menganalisis struktur, tata nama, sifat, dan penggolongan makromolekul" }
    ],
    "Matematika": [
        // Kelas X
        { pola: /persamaan nilai mutlak|pertidaksamaan nilai mutlak/i, kompetensi: "Menyelesaikan persamaan dan pertidaksamaan linear satu variabel yang memuat nilai mutlak" },
        { pola: /sistem persamaan linear tiga variabel|spltv/i, kompetensi: "Menyusun dan menyelesaikan sistem persamaan linear tiga variabel dari masalah kontekstual" },
        { pola: /sistem pertidaksamaan dua variabel|linear kuadrat|kuadrat kuadrat/i, kompetensi: "Menyelesaikan sistem pertidaksamaan dua variabel (linear-kuadrat dan kuadrat-kuadrat)" },
        { pola: /fungsi linear|fungsi kuadrat|fungsi rasional|grafik fungsi/i, kompetensi: "Menganalisis karakteristik grafik fungsi (linear, kuadrat, rasional) berdasarkan aljabarnya" },
        { pola: /fungsi komposisi|fungsi invers|f bundaran g|f inverse/i, kompetensi: "Menganalisis operasi komposisi dan operasi invers pada fungsi" },
        { pola: /trigonometri|sinus|kosinus|tangen|segitiga siku-siku|sudut istimewa/i, kompetensi: "Menyelesaikan masalah menggunakan rasio trigonometri pada segitiga siku-siku" },
        { pola: /aturan sinus|aturan kosinus|luas segitiga trigonometri/i, kompetensi: "Menyelesaikan masalah kontekstual dengan aturan sinus dan kosinus" },
        { pola: /grafik fungsi trigonometri|amplitudo|periode trigonometri/i, kompetensi: "Menganalisis perubahan grafik fungsi trigonometri akibat perubahan konstanta" },

        // Kelas XI
        { pola: /induksi matematika|pembuktian induksi/i, kompetensi: "Menjelaskan metode pembuktian pernyataan matematis berupa barisan dan ketidaksamaan dengan induksi matematika" },
        { pola: /program linear|nilai maksimum|nilai minimum|daerah penyelesaian/i, kompetensi: "Menyelesaikan masalah kontekstual yang berkaitan dengan program linear dua variabel" },
        { pola: /matriks|determinan|invers matriks|kesamaan matriks|ordo matriks|transpose/i, kompetensi: "Menyelesaikan masalah kontekstual yang berkaitan dengan matriks dan operasinya" },
        { pola: /transformasi geometri|translasi|refleksi|rotasi|dilatasi|matriks transformasi/i, kompetensi: "Menganalisis komposisi transformasi geometri dengan menggunakan matriks" },
        { pola: /barisan|deret|aritmetika|geometri|suku ke n|jumlah suku/i, kompetensi: "Menganalisis pola barisan dan deret aritmetika maupun geometri" },
        { pola: /limit fungsi aljabar|limit tak hingga|pemfaktoran limit|akar sekawan/i, kompetensi: "Menganalisis sifat-sifat limit fungsi aljabar dan menyelesaikannya" },
        { pola: /turunan fungsi aljabar|diferensial|gradien garis singgung|nilai stasioner|maksimum minimum fungsi/i, kompetensi: "Menggunakan konsep turunan pertama untuk menganalisis sifat grafik fungsi aljabar" },
        { pola: /integral tak tentu|integral tentu|antiturunan|luas daerah integral/i, kompetensi: "Menyelesaikan masalah yang berkaitan dengan integral tak tentu dan tentu dari fungsi aljabar" },

        // Kelas XII
        { pola: /dimensi tiga|jarak titik ke titik|titik ke garis|titik ke bidang|sudut antar bidang/i, kompetensi: "Mendeskripsikan jarak dan sudut antar komponen dalam ruang dimensi tiga" },
        { pola: /statistika|mean|median|modus|kuartil|simpangan baku|varians|histogram/i, kompetensi: "Menyajikan dan menganalisis ukuran pemusatan dan penyebaran data berkelompok" },
        { pola: /aturan pencacahan|kaidah pencacahan|permutasi|kombinasi|faktorial/i, kompetensi: "Menganalisis aturan pencacahan (penjumlahan, perkalian, permutasi, kombinasi)" },
        { pola: /peluang kejadian|peluang bersyarat|kejadian saling lepas|kejadian saling bebas/i, kompetensi: "Menentukan peluang kejadian majemuk dari masalah kontekstual" },
        
        // Peminatan (Matematika Minat)
        { pola: /eksponen|logaritma|persamaan eksponensial|pertidaksamaan logaritma/i, kompetensi: "Menyelesaikan persamaan dan pertidaksamaan fungsi eksponensial dan logaritma" },
        { pola: /vektor matematika|panjang vektor|proyeksi ortogonal|perkalian skalar vektor/i, kompetensi: "Menyelesaikan masalah yang berkaitan dengan vektor, operasi vektor, dan proyeksi ortogonal" },
        { pola: /persamaan lingkaran|pusat lingkaran|jari-jari|garis singgung lingkaran/i, kompetensi: "Menganalisis persamaan lingkaran dan garis singgung pada lingkaran" },
        { pola: /suku banyak|polinomial|teorema sisa|teorema faktor|akar akar persamaan/i, kompetensi: "Menganalisis operasi aljabar pada polinomial dan menerapkan teorema sisa serta faktor" },
        { pola: /limit fungsi trigonometri|limit tak hingga trigonometri/i, kompetensi: "Menentukan nilai limit fungsi trigonometri dan limit di ketakhinggaan" },
        { pola: /turunan fungsi trigonometri|nilai stasioner trigonometri/i, kompetensi: "Menggunakan konsep turunan fungsi trigonometri untuk mencari nilai ekstrim" },
        { pola: /distribusi binomial|variabel acak diskrit|distribusi normal/i, kompetensi: "Menganalisis probabilitas menggunakan distribusi binomial dan distribusi normal" }
    ]
};

// 2. EKSTRAKTOR FITUR & STRUKTUR KALIMAT SOAL (FULL-SCALE ANALYZER)
window.ekstrakFiturSoal = function(teksMentah, tipeSoal) {
    let teks = (teksMentah || "").replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    let lower = teks.toLowerCase();

    // A. DETEKSI STIMULUS DATA & VISUAL
    let adaGrafikTabel = /berdasarkan tabel|perhatikan tabel|berdasarkan grafik|perhatikan grafik|histogram|kurva|data hasil pengamatan/i.test(lower);
    let adaDiagram = /perhatikan gambar|gambar di samping|gambar di bawah|skema|bagan|diagram silsilah|pedigree|kladogram|peta silsilah/i.test(lower);
    let adaPernyataanGanda = /\(1\).*\n*.*\(2\).*\n*.*\(3\)/i.test(lower) || /pernyataan yang benar adalah|perhatikan pernyataan berikut/i.test(lower);
    
    // B. DETEKSI KONTEKS (LABORATORIUM, KLINIS, SEHARI-HARI)
    let adaEksperimen = /percobaan|praktikum|ekstrak hati|enzim katalase|uji sachs|uji biuret|benedict|lugol|tabung reaksi|mikroskop|preparat|indikator|variabel bebas|variabel terikat|perlakuan|titrasi/i.test(lower);
    let adaKasusKlinis = /pada pasien|pada korban|seorang pasien|penderita|kasus|keracunan|perokok berat|mengalami gejala|kompensasi fisiologis|konsekuensi|infeksi|wabah|kelainan genetik|sindrom|mutasi|diagnosa/i.test(lower);
    let adaSebabAkibat = /akibat yang ditimbulkan|dampak dari|menyebabkan|karena|sebab|mengakibatkan/i.test(lower);
    let adaPerbandingan = /perbedaan utama|persamaan antara|bandingkan|dibandingkan dengan/i.test(lower);

    // C. DETEKSI KUANTITATIF / HITUNGAN
    let adaHitungan = /(\d+\s*(m\/s|n\b|joule|watt|kg|cm|mm|gram|mol|liter|derajat|°|atp|kalori|%|\bsatuan\b|newton|volt|ampere|ohm|hertz|hz|pascal|pa))|hitunglah|besar resultan|berapakah|persamaan|tentukan hasil|rasio fenotipe|persentase|peluang|nilai pindah silang|integral|turunan|limit|luas daerah|volume/i.test(lower);

    // D. ISOLASI KONTEKS & OBJEK TARGET
    let konteksKasus = "";
    let matchKonteks = teks.match(/^(pada\s+(?:pasien|korban|percobaan|ekosistem|persilangan|balok|kubus|segitiga|suatu\s+penelitian)[^,?]+|seorang\s+[^,?]+|ketika\s+[^,?]+|dalam\s+suatu\s+[^,?]+)/i);
    if (matchKonteks) konteksKasus = matchKonteks[1].replace(/^(pada|ketika|dalam|seorang)\s+/i, '').trim();

    let kalimatTanya = teks.includes('?') ? (teks.split(/[\.\!]\s+/).pop()) : teks;
    
    let objekTarget = kalimatTanya
        .replace(/^(perhatikan gambar[^!.,]*[\!.,]\s*)/i, '')
        .replace(/^(berdasarkan data[^!.,]*[\!.,]\s*)/i, '')
        .replace(/^(pada\s+(?:pasien|korban|percobaan)[^,]+,\s*)/i, '')
        .replace(/\b(pernyataan manakah yang paling tepat|manakah yang paling tepat|apakah yang sebaiknya digunakan|apa yang paling tepat|apa yang paling mungkin muncul|apa yang mungkin terjadi|apa yang terganggu|berada di mana|disebut langkah|disebut|adalah|merupakan|yaitu|yakni|kesimpulan yang dapat ditarik|pasangan yang tepat|fungsi bagian yang ditunjuk|proses bioproses yang terjadi)\b/gi, '')
        .replace(/\b(apa|apakah|manakah|bagaimana|mengapa|dimana|di mana|siapa|kapan|berapakah|tentukan|sebutkan|jelaskan|hitunglah|carilah|selesaikan)\b/gi, '')
        .replace(/^[?.!,:;\s]+/g, '').replace(/[?.!,:;]+$/g, '').trim();

    let kataObjek = objekTarget.split(' ').filter(k => k.length > 1);
    objekTarget = kataObjek.length > 10 ? kataObjek.slice(0, 10).join(' ') : kataObjek.join(' ');
    if (!objekTarget || objekTarget.length < 3) objekTarget = "konsep materi yang ditanyakan";

    return { 
        lower: lower, 
        adaGrafikTabel: adaGrafikTabel,
        adaDiagram: adaDiagram,
        adaPernyataanGanda: adaPernyataanGanda,
        adaKasusKlinis: adaKasusKlinis, 
        adaEksperimen: adaEksperimen,
        adaSebabAkibat: adaSebabAkibat,
        adaPerbandingan: adaPerbandingan,
        adaHitungan: adaHitungan, 
        konteksKasus: konteksKasus.toLowerCase(), 
        objekTarget: objekTarget.toLowerCase() 
    };
};

// 3. PENALARAN KOGNITIF (Presisi Filter C1 - C6 Berdasarkan Hierarki Taksonomi Bloom)
// Mesin akan menyaring dari tingkat tertinggi (C6) ke tingkat terendah (C1).
window.inferensiLevelKognitif = function(fitur) {
    let t = fitur.lower;
    
    // C6 (Mencipta): Mendesain, merakit, menyusun alternatif baru. (Sangat Jarang)
    if (/rancanglah|susunlah skema|buatlah model|modifikasi|merancang percobaan|berikan solusi inovatif/i.test(t)) return "C6";
    
    // C5 (Mengevaluasi): Menilai kebenaran, mengkritik, memvalidasi data. (Sangat Jarang)
    if (/kesimpulan yang dapat ditarik|evaluasi kelayakan|solusi terbaik|apakah tepat|kritiklah|berikan tanggapan/i.test(t)) return "C5";
    
    // C4 (Menganalisis): Multi-logika, memecah informasi, sebab-akibat panjang, baca grafik kompleks.
    // Syarat C4: Jika ada tabel/grafik/diagram silsilah ATAU ada pernyataan ganda 1,2,3,4 ATAU kata kunci analitis.
    if (fitur.adaPernyataanGanda || fitur.adaGrafikTabel || fitur.adaSebabAkibat || /konsekuensi|kompensasi fisiologis|menyimpulkan dari data|analisis hubungan|mutasi yang terjadi|alasan logis yang menjelaskan|diagnosa yang tepat/i.test(t)) return "C4";
    
    // C3 (Mengaplikasikan): Menggunakan rumus matematika/fisika/kimia, hitungan genetika, menerapkan konsep ke alat ukur/eksperimen.
    if (fitur.adaHitungan || fitur.adaEksperimen || /alat apakah yang sebaiknya|langkah.*menguji|melukis resultan|tentukan persamaan|hitung|berapakah rasio|frekuensi alel|peluang|cara penggunaan/i.test(t)) return "C3";
    
    // C2 (Memahami): Menjelaskan fungsi, perbedaan, memberikan contoh, mengartikan gejala/ciri-ciri.
    if (fitur.adaPerbandingan || fitur.adaKasusKlinis || /fungsi|peran|gejala|contoh penerapan|dimensi dari|syarat kondisi|jelaskan|alasan|mengapa|apa yang terjadi|tujuan utama|karakteristik utama|ciri-ciri yang tepat/i.test(t)) return "C2";
    
    // C1 (Mengingat): Soal hafalan polos, nama organ, letak, istilah, definisi.
    return "C1";
};

// 4. PERAKITAN KOMPETENSI & INDIKATOR SOAL BERDASARKAN LEVEL KOGNITIF
window.rakitKompetensiDanIndikator = function(fitur, levelKog, namaMapel) {
    let kompetensiMentah = "";
    
    let targetMapel = Object.keys(window.BASIS_PENGETAHUAN_KURIKULUM).find(k => new RegExp(k, 'i').test(namaMapel));
    let kamusKurikulum = targetMapel ? window.BASIS_PENGETAHUAN_KURIKULUM[targetMapel] : [];

    if (kamusKurikulum.length === 0) {
        Object.values(window.BASIS_PENGETAHUAN_KURIKULUM).forEach(arr => kamusKurikulum = kamusKurikulum.concat(arr));
    }
    
    for (let i = 0; i < kamusKurikulum.length; i++) {
        let itemBasis = kamusKurikulum[i];
        if (itemBasis && itemBasis.pola && typeof itemBasis.pola.test === 'function') {
            if (itemBasis.pola.test(fitur.lower)) {
                kompetensiMentah = itemBasis.kompetensi; 
                break;
            }
        }
    }
    
    let topikMateri = "";
    if (kompetensiMentah) {
        topikMateri = kompetensiMentah.replace(/^(Menganalisis|Memahami( dan menerapkan)?|Mengidentifikasi|Menerapkan|Menjelaskan|Mengevaluasi|Merancang|Menyelesaikan( masalah yang berkaitan dengan| masalah kontekstual yang berkaitan dengan)?|Menyajikan dan menganalisis|Menyusun dan menyelesaikan|Mendeskripsikan)\s+/i, '');
    } else {
        topikMateri = "konsep terkait " + (fitur.konteksKasus || fitur.objekTarget.split(' ').slice(0, 4).join(' '));
    }

    let kkoKompetensi = "";
    let kkoIndikator = "";

    // Pemilihan Kata Kerja Operasional Sesuai Standar Taksonomi Bloom (Revisi Anderson)
    switch (levelKog) {
        case "C1":
            kkoKompetensi = "Mengingat dan mengenali ";
            kkoIndikator = /di mana|letak|pusat|tunjuk/.test(fitur.lower) ? "menunjukkan letak" : (/disebut|istilah/.test(fitur.lower) ? "menyebutkan istilah" : "menyebutkan");
            break;
        case "C2":
            kkoKompetensi = "Memahami konsep ";
            kkoIndikator = fitur.adaPerbandingan ? "membedakan" : (/ciri|karakteristik/.test(fitur.lower) ? "mengidentifikasi ciri" : "menjelaskan");
            break;
        case "C3":
            kkoKompetensi = "Menerapkan prinsip ";
            kkoIndikator = fitur.adaHitungan ? "menghitung dan menentukan" : (fitur.adaEksperimen ? "menerapkan prosedur pada" : "mengaplikasikan konsep pada");
            break;
        case "C4":
            kkoKompetensi = "Menganalisis hubungan ";
            kkoIndikator = fitur.adaSebabAkibat ? "menganalisis sebab-akibat terkait" : "menganalisis data/fenomena terkait";
            break;
        case "C5":
            kkoKompetensi = "Mengevaluasi permasalahan ";
            kkoIndikator = "menilai dan menyimpulkan";
            break;
        case "C6":
            kkoKompetensi = "Merancang penyelesaian ";
            kkoIndikator = "merumuskan solusi/desain terkait";
            break;
        default:
            kkoKompetensi = "Memahami ";
            kkoIndikator = "menentukan";
    }

    let kompetensiFinal = kkoKompetensi + topikMateri;

    // Penyusunan Prefix Stimulus Kontekstual yang Bervariasi
    let stimulus = "Disajikan informasi/konsep materi, peserta didik dapat ";
    
    if (fitur.adaGrafikTabel) {
        stimulus = "Disajikan data dalam bentuk tabel/grafik, peserta didik dapat ";
    } else if (fitur.adaDiagram) {
        if (/silsilah|pedigree|kladogram/i.test(fitur.lower)) stimulus = "Disajikan diagram pewarisan sifat/kekerabatan, peserta didik dapat ";
        else stimulus = "Disajikan bagan/skema/ilustrasi, peserta didik dapat ";
    } else if (fitur.adaPernyataanGanda) {
        stimulus = "Disajikan beberapa pernyataan/data, peserta didik dapat ";
    } else if (fitur.adaEksperimen) {
        stimulus = "Disajikan prosedur atau deskripsi hasil eksperimen, peserta didik dapat ";
    } else if (fitur.adaKasusKlinis && fitur.konteksKasus) {
        stimulus = "Disajikan studi kasus fenomena/klinis (" + fitur.konteksKasus + "), peserta didik dapat ";
    } else if (fitur.adaHitungan) {
        stimulus = "Disajikan data kuantitatif berupa angka/variabel, peserta didik dapat ";
    } else if (fitur.adaKasusKlinis) {
        stimulus = "Disajikan deskripsi kasus nyata, peserta didik dapat ";
    }

    return { 
        kompetensi: kompetensiFinal, 
        indikator: stimulus + kkoIndikator + " " + fitur.objekTarget + " dengan tepat." 
    };
};

// 5. ENGINE GENERATE HTML (FORMAT PRESISI PDF A4 LANDSCAPE - SUPPORT ENTER PADA OPSI JAWABAN)
window.eksekusiGenerateKisiKisi = function(jenisUjian, tapel, mapel, kelasFase, cp) {
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#27ae60;'>⚡ Menyusun Kisi-kisi...</span>";

    let jmlPG = 0, jmlUraian = 0;
    window.tempSoalUjianParsed.forEach(q => { if(q.type === 'PG' || q.type === 'PGK') jmlPG++; else jmlUraian++; });

    let hasilAnalisis = window.tempSoalUjianParsed.map((q, idx) => {
        let fitur = window.ekstrakFiturSoal(q.question, q.type);
        let levelKog = window.inferensiLevelKognitif(fitur);
        
        let rumusan = window.rakitKompetensiDanIndikator(fitur, levelKog, mapel);
        let bentukSoal = q.type === "PG" ? "PG" : (q.type === "PGK" ? "PGK" : (q.type === "IS" ? "Isian" : "Uraian"));
        
        let kunci = (q.correct && q.correct.length > 0) ? q.correct.join(', ') : '-';
        if (bentukSoal === 'Uraian' || (bentukSoal === 'Isian' && kunci.length > 25)) kunci = (q.correct && q.correct[0]) ? q.correct[0] : "Terlampir";

        // MENG-ENTER OPSI JAWABAN (A, B, C, D) KE BAWAH AGAR RAPI DI TABEL
        let teksSoalLengkap = (q.question || "").replace(/\n/g, '<br>'); // Handle enter di dalam teks soal
        if (q.type === 'PG' || q.type === 'PGK') {
            teksSoalLengkap += "<br><br>";
            if(q.options && q.options.length > 0) {
                q.options.forEach(opt => {
                    teksSoalLengkap += `<b>${opt.label}.</b> ${opt.text}<br>`;
                });
            }
        }

        return {
            nomor: idx + 1, kompetensi: rumusan.kompetensi, indikator: rumusan.indikator,
            bentukSoal: bentukSoal, teksSoalLengkap: teksSoalLengkap, kunci: kunci, levelKog: levelKog
        };
    });

    // Rowspan Kompetensi Otomatis (Menggabungkan sel kompetensi yang sama berurutan)
    for (let i = 0; i < hasilAnalisis.length; i++) {
        if (i > 0 && hasilAnalisis[i].kompetensi === hasilAnalisis[i - 1].kompetensi) {
            hasilAnalisis[i].kompRowspan = 0; 
        } else {
            let spanCount = 1;
            for (let j = i + 1; j < hasilAnalisis.length; j++) {
                if (hasilAnalisis[j].kompetensi === hasilAnalisis[i].kompetensi) spanCount++; else break;
            }
            hasilAnalisis[i].kompRowspan = spanCount;
        }
    }

    let barisTabel = "";
    let totalSoal = hasilAnalisis.length;

    hasilAnalisis.forEach((item, idx) => {
        // Kolom Capaian Pembelajaran dijadikan 1 baris menyatu sepanjang tabel
        let tdCapaian = (idx === 0) ? `<td rowspan="${totalSoal}" contenteditable="true" style="text-align:justify; vertical-align:top;">${cp.replace(/\n/g, '<br>')}</td>` : "";
        let tdKompetensi = (item.kompRowspan > 0) ? `<td rowspan="${item.kompRowspan}" contenteditable="true" style="vertical-align:top;">${item.kompetensi}</td>` : "";

        barisTabel += `
            <tr>
                ${tdCapaian}
                ${tdKompetensi}
                <td contenteditable="true" style="vertical-align:top;">${item.indikator}</td>
                <td contenteditable="true" style="text-align:center; vertical-align:top;">${item.bentukSoal}</td>
                <td style="text-align:center; vertical-align:top;">${item.nomor}</td>
                <td contenteditable="true" style="text-align:left; vertical-align:top;">${item.teksSoalLengkap}</td>
                <td contenteditable="true" style="text-align:center; font-weight:bold; vertical-align:top;">${item.kunci}</td>
                <td contenteditable="true" style="text-align:center; vertical-align:top;">${item.levelKog}</td>
            </tr>
        `;
    });

    let stringRincianSoal = `${jmlPG} soal Pilihan Ganda dan ${jmlUraian} soal Uraian`;
    if(jmlUraian === 0) stringRincianSoal = `${jmlPG} soal Pilihan Ganda`;
    if(jmlPG === 0) stringRincianSoal = `${jmlUraian} soal Uraian`;

    // STRUKTUR HALAMAN HTML UNTUK CETAK PDF (IDENTIK DENGAN PDF SEKOLAH)
    let htmlDoc = `
    <html><head><title>Kisi-Kisi Ujian - ${mapel}</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; padding: 25px; line-height: 1.35; color: black; background: #fff; }
        .no-print-bar { background: #0b3954; color: white; padding: 12px 20px; font-family: sans-serif; font-size: 13px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .no-print-bar button { background: #27ae60; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; }
        h2 { text-align: center; margin-bottom: 4px; font-size: 13pt; font-weight: bold; text-transform: uppercase; }
        h3 { text-align: center; margin-top: 0; margin-bottom: 30px; font-size: 13pt; font-weight: bold; text-transform: uppercase; }
        .kop-info { width: 100%; margin-bottom: 20px; font-weight: bold; font-size: 11pt; border-collapse: collapse; }
        .kop-info td { padding: 3px 0; border: none !important; }
        table.kisi-table { width: 100%; border-collapse: collapse; font-size: 10.5pt; margin-top: 15px; }
        table.kisi-table th, table.kisi-table td { border: 1px solid black; padding: 7px 8px; vertical-align: top; }
        table.kisi-table th { background-color: #ffffff; text-align: center; font-weight: bold; padding: 10px 8px; }
        td[contenteditable="true"]:focus { outline: 2px solid #3498db; background: #f0f8ff; }
        @media print {
            .no-print-bar { display: none !important; }
            body { padding: 0; margin: 0; }
            @page { size: landscape; margin: 10mm 15mm; }
            table.kisi-table { page-break-before: avoid; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
        }
    </style>
    </head><body>
        <div class="no-print-bar">
            <span>💡 <b>Mode Validasi Guru:</b> Anda bebas mengedit teks (Kompetensi, Indikator, Soal) langsung di dalam tabel sebelum mencetak.</span>
            <button onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
        </div>
        <h2 contenteditable="true">KISI-KISI SOAL ${jenisUjian}</h2>
        <h3 contenteditable="true">SMAS BODHI DHARMA BATAM - TAHUN PELAJARAN ${tapel}</h3>
        <table class="kop-info">
            <tr><td width="130">Mata Pelajaran</td><td width="15">:</td><td contenteditable="true">${mapel}</td></tr>
            <tr><td>Kelas / Fase</td><td>:</td><td contenteditable="true">${kelasFase}</td></tr>
            <tr><td>Jumlah Soal</td><td>:</td><td contenteditable="true">${stringRincianSoal}</td></tr>
        </table>
        <table class="kisi-table">
            <thead>
                <tr>
                    <th width="14%">Capaian Pembelajaran</th>
                    <th width="13%">Kompetensi</th>
                    <th width="17%">Indikator Soal</th>
                    <th width="5%">Bentuk Soal</th>
                    <th width="5%">Nomor</th>
                    <th width="34%">Soal</th>
                    <th width="6%">Kunci</th>
                    <th width="6%">Level Kognitif</th>
                </tr>
            </thead>
            <tbody>
                ${barisTabel}
            </tbody>
        </table>
    </body></html>`;

    let win = window.open('', '_blank');
    if (win) { win.document.write(htmlDoc); win.document.close(); }
    
    window.tutupModal('modal-kisi-kisi');
    if(st) st.innerHTML = "Cloud Sync: Ready";
};