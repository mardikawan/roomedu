/* =========================================================================
   MESIN PENALARAN KISI-KISI KURIKULUM (N.L.P ENGINE - ULTIMATE DEWA VERSION)
   Terlatih Penuh dengan Bank Soal Biologi Kelas X, XI, XII (C1-C6) & Eksakta
   ========================================================================= */

// =========================================================================
// BLOK 1: SUPER DATABASE KURIKULUM (GRANULAR SUB-TOPIK KELAS X, XI, XII)
// =========================================================================
window.BASIS_PENGETAHUAN_KURIKULUM = {
    "Biologi": [
        /* ================= KELAS X (FASE E) : RUANG LINGKUP & METODE ILMIAH ================= */
        { pola: /\bbios\b|\blogos\b|arti kata biologi|istilah biologi berasal|kata yunani/i, kompetensi: "Menjelaskan arti etimologi dan hakikat ilmu biologi sebagai ilmu tentang kehidupan", topik: "etimologi dan hakikat ilmu biologi" },
        { pola: /objek material biologi|objek formal biologi|sifat empiris|sifat tentatif|aspek sains|produk sains|fakta,\s*konsep|teori ilmiah|hukum ilmiah|model dalam biologi/i, kompetensi: "Menganalisis karakteristik sains, objek kajian material dan formal, serta aspek produk, proses, dan sikap ilmiah dalam biologi", topik: "karakteristik sains serta objek material dan formal biologi" },
        { pola: /entomologi|mikologi|iktiologi|ornitologi|herpetologi|mamalogi|sitologi|histologi|anatomi|fisiologi|paleontologi|taksonomi|parasitologi|biologi molekuler|patologi|embriologi|mikrobiologi|bakteriologi|virologi|protistologi|biokimia|bioinformatika|biostatistika|cabang biologi yang mempelajari/i, kompetensi: "Mengidentifikasi berbagai cabang ilmu biologi berdasarkan objek kajian spesifiknya", topik: "cabang-cabang ilmu biologi dan objek kajiannya" },
        { pola: /unit struktural dan fungsional terkecil|kumpulan individu sejenis|kumpulan sel yang memiliki|kesatuan antara komunitas|keseluruhan ekosistem di permukaan bumi|kumpulan organ yang saling|kumpulan populasi berbagai jenis|tingkat organisasi kehidupan/i, kompetensi: "Menganalisis urutan tingkat organisasi kehidupan dari molekul, sel, jaringan, organ, sistem organ, organisme, populasi, komunitas, ekosistem, hingga biosfer", topik: "hierarki tingkat organisasi kehidupan" },
        { pola: /pengeluaran sisa metabolisme|menjaga kestabilan kondisi internal|homeostasis|merespons rangsang|iritabilitas|memperoleh energi dari bahan organik|ciri makhluk hidup|kedudukan virus dalam klasifikasi/i, kompetensi: "Menganalisis ciri-ciri fisiologis makhluk hidup (ekskresi, respirasi, homeostasis, iritabilitas, reproduksi, dan adaptasi)", topik: "ciri-ciri fisiologis makhluk hidup" },
        { pola: /sikap ilmiah|peer review|fabrikasi data|plagiarisme|komunikasi ilmiah|kesejahteraan hewan|etika penelitian|etika ilmiah/i, kompetensi: "Menerapkan sikap ilmiah, kejujuran akademik, prosedur peer review, dan etika penelitian biologi", topik: "sikap ilmiah, publikasi, dan etika penelitian biologi" },
        { pola: /variabel bebas|variabel independen|variabel terikat|variabel dependen|variabel kontrol|variabel pengganggu|definisi operasional variabel/i, kompetensi: "Menentukan variabel bebas, variabel terikat, dan variabel kontrol dalam suatu rancangan penelitian ilmiah", topik: "penentuan variabel penelitian ilmiah" },
        { pola: /kelompok kontrol|kontrol negatif|kontrol positif|randomisasi|pengulangan dalam penelitian|penelitian observasional|eksperimen yang baik|korelasi antara dua variabel/i, kompetensi: "Menganalisis desain eksperimen ilmiah, fungsi kelompok kontrol, randomisasi, dan pengulangan untuk menjaga validitas data", topik: "rancangan eksperimen ilmiah dan fungsi kelompok kontrol" },
        { pola: /hipotesis nol|hipotesis nihil|hipotesis alternatif|dugaan sementara yang diajukan|observasi merupakan kegiatan/i, kompetensi: "Merumuskan masalah hasil observasi serta menyusun hipotesis penelitian (hipotesis kerja dan hipotesis nol)", topik: "perumusan observasi dan hipotesis penelitian" },
        { pola: /data kualitatif|data kuantitatif|data primer|data sekunder|akurasi pengukuran|presisi pengukuran|grafik garis|diagram lingkaran|grafik batang|penyajian data|bagian hasil dalam laporan|bagian pembahasan|kesimpulan penelitian|daftar pustaka|prosedur penelitian/i, kompetensi: "Menganalisis jenis data penelitian (kualitatif/kuantitatif, primer/sekunder), teknik visualisasi grafik, dan struktur laporan ilmiah", topik: "jenis data, penyajian grafik, dan struktur laporan penelitian" },
        { pola: /keselamatan kerja|jas laboratorium|jas lab|simbol bahaya|korosif|toksik|mudah terbakar|mikroskop|lensa okuler|lensa objektif|makrometer|mikrometer|preparat/i, kompetensi: "Menerapkan prosedur keselamatan kerja laboratorium, pengenalan alat pelindung diri, dan penggunaan mikroskop", topik: "keselamatan kerja dan penggunaan alat laboratorium" },

        /* ================= KELAS X (FASE E) : KEANEKARAGAMAN HAYATI & KLASIFIKASI ================= */
        { pola: /keanekaragaman hayati|biodiversitas|megabiodiversitas|tingkatan utama keanekaragaman|keanekaragaman tingkat gen|varietas mangga|warna rambut pada kucing|hibridisasi dan domestikasi|keanekaragaman spesies|famili felidae|keturunan viabel|keanekaragaman ekosistem|47 macam ekosistem|22 tipe ekosistem/i, kompetensi: "Menganalisis konsep megabiodiversitas serta berbagai tingkat keanekaragaman hayati (gen, spesies, dan ekosistem) di Indonesia", topik: "tingkat keanekaragaman hayati (gen, spesies, dan ekosistem)" },
        { pola: /garis wallace|garis weber|garis lydekker|wallacea|fauna asiatis|fauna peralihan|fauna australis|bekantan|nasalis larvatus|babirusa|anoa|komodo|varanus komodoensis|cenderawasih|kasuari|badak bercula satu|jalak bali|leucopsar rothschildi|rafflesia arnoldii|diospyros celebica|eboni|cendana|jati|meranti|endemik|endemisitas/i, kompetensi: "Menganalisis pola persebaran flora dan fauna Indonesia berdasarkan Garis Wallace, Weber, dan Lydekker beserta spesies endemiknya", topik: "persebaran biogeografi flora-fauna Indonesia dan spesies endemik" },
        { pola: /jasa ekosistem|ketahanan pangan|indeks daftar merah|red list index|deforestasi|alih fungsi lahan|eksploitasi berlebihan|overfishing|perburuan liar|spesies asing invasif|ancaman terhadap keanekaragaman/i, kompetensi: "Mengevaluasi manfaat jasa ekosistem serta berbagai faktor ancaman terhadap kelestarian keanekaragaman hayati", topik: "manfaat jasa ekosistem dan ancaman biodiversitas" },
        { pola: /konservasi in situ|konservasi ex situ|kawasan suaka alam|cagar alam|suaka margasatwa|taman nasional|taman hutan raya|taman laut|kebun raya|kebun binatang|taman safari|bank gen|gunung leuser|ujung kulon|lorentz/i, kompetensi: "Mengevaluasi strategi pelestarian keanekaragaman hayati secara in situ dan ex situ beserta jenis kawasan konservasinya", topik: "pelestarian keanekaragaman hayati secara in situ dan ex situ" },
        { pola: /binomial nomenclature|tata nama ganda|carolus linnaeus|urutan tingkatan takson|kunci determinasi|kunci dikotomi|filogeni|kladogram|pohon filogenetik/i, kompetensi: "Menerapkan prinsip klasifikasi makhluk hidup, tata nama binomial nomenklatur, kunci determinasi, dan kladogram filogenetik", topik: "prinsip klasifikasi, kunci determinasi, dan kladogram" },

        /* ================= KELAS X (FASE E) : VIRUS & MONERA (ARCHAEA DAN EUBACTERIA) ================= */
        { pola: /kapsid|kapsomer|bakteriofag|parasit obligat intraseluler|daur litik|daur lisogenik|adsorpsi|penetrasi|eklifase|perakitan|lisis|profag|replikasi virus/i, kompetensi: "Menganalisis struktur tubuh virus serta membandingkan tahapan replikasi virus pada daur litik dan daur lisogenik", topik: "struktur dan replikasi virus (daur litik dan lisogenik)" },
        { pola: /carl woese|archaebacteria|archaea|pseudopeptidoglikan|ikatan eter pada lipid|metanogen|halofil ekstrem|laut mati|termoasidofil|kawah vulkanik/i, kompetensi: "Menganalisis karakteristik biokimiawi dinding sel dan membran lipid Archaebacteria serta adaptasinya di lingkungan ekstrem (metanogen, halofil ekstrem, termoasidofil)", topik: "karakteristik dan pengelompokan Archaebacteria" },
        { pola: /peptidoglikan|murein|kapsul bakteri|lisis osmotik|mesosom|nukleoid|plasmid|ribosom 70s|fimbriae|pili|pilus seks|endospora/i, kompetensi: "Menganalisis struktur anatomi sel Eubacteria (dinding peptidoglikan, kapsul, mesosom, nukleoid, plasmid, pili, dan endospora) beserta fungsinya", topik: "struktur anatomi dan fungsi komponen sel bakteri" },
        { pola: /kokus|diplokokus|streptokokus|stafilokokus|tetrakokus|sarsina|basil|diplobasil|streptobasil|vibrio|spirilum|spirokaeta|atrik|monotrik|lofotrik|amfitrik|peritrik/i, kompetensi: "Mengklasifikasikan bakteri berdasarkan bentuk morfologi sel, susunan koloni, dan tipe persebaran alat gerak flagela", topik: "morfologi sel dan tipe flagela bakteri" },
        { pola: /pewarnaan gram|gram-positif|gram positif|gram-negatif|gram negatif|kristal violet|safranin|lipopolisakarida|\blps\b|dekolorisasi alkohol/i, kompetensi: "Membedakan karakteristik dinding sel dan hasil pengamatan mikroskopis bakteri Gram-positif dan Gram-negatif pada pewarnaan Gram", topik: "mekanisme pewarnaan Gram serta struktur dinding bakteri Gram-positif dan Gram-negatif" },
        { pola: /pembelahan biner|amitotik|reproduksi paraseksual|rekombinasi genetik bakteri|transformasi.*bakteri|transduksi|konjugasi.*pilus|jembatan sitoplasma/i, kompetensi: "Menganalisis mekanisme reproduksi aseksual pembelahan biner dan rekombinasi genetik paraseksual (transformasi, transduksi, konjugasi) pada bakteri", topik: "reproduksi pembelahan biner dan rekombinasi genetik bakteri" },
        { pola: /fotoautotrof|kemoautotrof|saprofit|saproba|aerob obligat|anaerob obligat|anaerob fakultatif|mikroaerofil/i, kompetensi: "Mengklasifikasikan bakteri berdasarkan cara memperoleh nutrisi (autotrof/heterotrof) dan kebutuhan oksigen respirasinya", topik: "cara pemerolehan nutrisi dan sifat respirasi bakteri" },
        { pola: /cyanobacteria|fikosianin|membran tilakoid|klorofil a.*cyanobacteria|heterokista|heterosista|akinet|baeosit|beosit/i, kompetensi: "Menganalisis karakteristik Cyanobacteria, pigmen fikosianin, serta fungsi sel khusus heterokista, akinet, dan baeosit", topik: "struktur dan diferensiasi sel khusus Cyanobacteria" },
        { pola: /rhizobium leguminosarum|azotobacter|lactobacillus bulgaricus|streptococcus thermophilus|acetobacter xylinum|nata de coco|streptomyces|hidrokarbonoklastik|bioremediasi tumpahan minyak|mycobacterium tuberculosis|salmonella typhi|clostridium tetani|clostridium botulinum|botulinin|treponema pallidum|xanthomonas campestris/i, kompetensi: "Mengevaluasi peranan Eubacteria yang menguntungkan dalam bioteknologi/pertanian serta mekanisme patogenitas bakteri penyebab penyakit", topik: "peranan bakteri menguntungkan dan patogen dalam kehidupan" },

        /* ================= KELAS X (FASE E) : PROTISTA & FUNGI ================= */
        { pola: /polifiletik|protista mirip jamur|myxomycota|jamur lendir|acrasiomycota|pseudoplasmodium|myxoflagel|myxamoeba|amebozigot|oomycota|jamur air|hifa senositik|hifa koenositik|zoospora.*flagel|phytophthora infestans|saprolegnia|plasmopara viticola|pythium debaryanum|albugo candida/i, kompetensi: "Menganalisis karakteristik, siklus hidup, dan peranan Protista mirip jamur (Myxomycota, Acrasiomycota, dan Oomycota)", topik: "karakteristik dan siklus hidup Protista mirip jamur (Myxomycota dan Oomycota)" },
        { pola: /talus|pelikel|pirenoid|granula penyimpanan|isogami|anisogami|oogami|euglenophyta|euglena viridis|miksotrof|paramilum|stigma|fototaksis positif|chlorophyta|chlorella|protein sel tunggal|volvox|spirogyra|ulva|rhodophyta|fikoeritrin|tepung fluorid|karpospora|spermatangium|karpogonium|eucheuma spinosum|gracilaria|gelidium|agar-agar|karageenan/i, kompetensi: "Menganalisis klasifikasi, pigmen fotosintetik, cadangan makanan, dan peranan alga Euglenophyta, Chlorophyta, dan Rhodophyta", topik: "karakteristik dan peranan alga (Euglenophyta, Chlorophyta, dan Rhodophyta)" },
        { pola: /pyrrophyta|dinoflagellata|red tide|pasang merah|bioluminesensi|gymnodinium|gonyaulax|gambierdiscus toxicus|ciguatoksin|phaeophyta|fukosantin|laminarin|asam alginat|gelembung udara.*alga|sargassum|macrocystis|fucus|laminaria digitalis|chrysophyta|bacillariophyta|diatom|leukosin|epiteka|hipoteka|rafe|auksospora|pennalean|centralean|tanah diatom|fitoplankton/i, kompetensi: "Menganalisis karakteristik, struktur dinding sel, cadangan makanan, dan peranan ekologis/industri Pyrrophyta, Phaeophyta, Chrysophyta, dan Bacillariophyta (Diatom)", topik: "karakteristik dan peranan Pyrrophyta, Phaeophyta, Chrysophyta, dan Diatom" },
        { pola: /protozoa|rhizopoda|sarcodina|pseudopodia|kaki semu|fase sol.*fase gel|ektoplasma dan endoplasma|amoeba proteus|entamoeba histolytica|disentri amuba|foraminifera|tanah globigerina|indikator.*minyak bumi|radiolaria|flagellata|mastigophora|zooflagellata|trypanosoma|lalat tsetse|penyakit tidur|penyakit surra|leishmania|kala azar|trichomonas|giardia/i, kompetensi: "Menganalisis alat gerak, struktur cangkang, cara hidup, dan peranan Protozoa kelompok Rhizopoda dan Flagellata", topik: "karakteristik, klasifikasi, dan peranan Rhizopoda serta Flagellata" },
        { pola: /ciliata|ciliophora|paramecium|silia|trikokis|oral groove|sitostoma|vakuola kontraktil|osmoregulasi.*air suling|makronukleus|mikronukleus|konjugasi paramecium|balantidium coli|balantidiosis|sporozoa|apicomplexa|kompleks apikal|skizogoni|sporogoni|plasmodium|sporozoit|merozoit|tropozoit|gametosit|ookinet|ookista|nyamuk anopheles|malaria tropika|malaria tertiana|malaria kuartana|toxoplasma gondii/i, kompetensi: "Menganalisis struktur sel, mekanisme osmoregulasi, siklus reproduksi (konjugasi dan metagenesis Plasmodium), serta patogenitas Ciliata dan Sporozoa", topik: "struktur dan siklus hidup Ciliata serta Sporozoa (Plasmodium)" },
        { pola: /dinding sel.*kitin|glikogen dan lipid|khamir|kapang|cendawan|hifa septat|hifa aseptat|miselium vegetatif|miselium generatif|haustorium|pencernaan ekstraseluler.*jamur|enzim hidrolitik.*jamur|plasmogami|tahap dikariotik|kariogami/i, kompetensi: "Menganalisis karakteristik umum Kingdom Fungi, struktur hifa/miselium, mekanisme pencernaan ekstraseluler, dan tahapan reproduksi seksual (plasmogami, dikariotik, kariogami)", topik: "struktur tubuh, fisiologi nutrisi, dan siklus reproduksi Kingdom Fungi" },
        { pola: /zygomycota|sporangium|sporangiofor|sporangiospora|zigospora|rhizopus oryzae|rhizopus stolonifer|mucor mucedo|ascomycota|konidiospora|konidia|konidiofor|askus|askospora|askokarp|saccharomyces cerevisiae|penicillium chrysogenum|penicillium notatum|neurospora crassa|aspergillus wentii|aspergillus flavus|aflatoksin/i, kompetensi: "Membandingkan struktur spora aseksual-seksual serta menganalisis peranan jamur divisi Zygomycota dan Ascomycota", topik: "klasifikasi, reproduksi, dan peranan Zygomycota serta Ascomycota" },
        { pola: /basidiomycota|basidiokarp|basidium|basidiospora|stipe|pileus|lamela|fairy ring|volvariella volvacea|auricularia polytricha|amanita muscaria|puccinia graminis|deuteromycota|fungi imperfecti|malassezia furfur|pityrosporum ovale|microsporum|trichophyton|lichenes|lumut kerak|mikobion|fikobion|soredium|bioindikator.*so2|usnea|mikoriza|ektomikoriza|endomikoriza/i, kompetensi: "Menganalisis karakteristik Basidiomycota, Deuteromycota, serta hubungan simbiosis mutualisme Lichenes (lumut kerak) dan Mikoriza", topik: "karakteristik Basidiomycota, Deuteromycota, Lichenes, dan Mikoriza" },

        /* ================= KELAS XI (FASE F) : BIOLOGI SEL & TRANSPOR MEMBRAN ================= */
        { pola: /kompartementalisasi|mikroskop elektron|sitosol|model mosaik fluida|fosfolipid bilayer|kepala fosfolipid|ekor fosfolipid|hidrofilik|hidrofobik|protein integral|protein perifer|kolesterol.*fluiditas|glikoprotein|glikolipid|membran.*asimetris|selektif permeabel/i, kompetensi: "Menganalisis organisasi sel eukariotik serta struktur dan sifat selektif permeabel membran plasma berdasarkan model mosaik fluida", topik: "organisasi sel eukariotik dan struktur membran plasma (mosaik fluida)" },
        { pola: /pori nukleus|nukleoplasma|nukleolus|perakitan subunit ribosom|ribosom 80s|sistem endomembran|retikulum endoplasma kasar|retikulum endoplasma halus|detoksifikasi.*hati|lumen retikulum|badan golgi|sisterna|sisi cis|sisi trans|lisosom|enzim hidrolitik.*asam|peroksisom|enzim katalase|hidrogen peroksida|krista.*mitokondria|matriks mitokondria|teori endosimbiosis|tilakoid|grana|stroma kloroplas|tonoplas|vakuola sentral|tekanan turgor|sitoskeleton|mikrofilamen.*aktin|mikrotubulus.*tubulin|filamen intermediet|sentriol/i, kompetensi: "Menganalisis struktur dan keterkaitan fungsi organel sistem endomembran, organel semiotonom (mitokondria dan kloroplas), peroksisom, serta sitoskeleton", topik: "struktur dan fungsi organel sel serta sistem endomembran" },
        { pola: /difusi sederhana|difusi terfasilitasi|saturasi.*protein transpor|aquaporin|osmosis|larutan hipertonik|larutan hipotonik|larutan isotonik|krenasi|plasmolisis|turgid|pompa natrium-kalium|pompa na\+|simport|antiport|endositosis|eksositosis|luas membran plasma/i, kompetensi: "Menganalisis mekanisme transpor pasif (difusi, difusi terfasilitasi, osmosis) dan transpor aktif (pompa Na+-K+, kotranspor, endositosis, eksositosis) melintasi membran plasma", topik: "mekanisme transpor pasif dan transpor aktif melintasi membran sel" },

        /* ================= KELAS XI (FASE F) : SISTEM PEREDARAN DARAH & LIMFATIK ================= */
        { pola: /plasma darah|albumin.*tekanan osmotik|globulin|imunoglobulin|fibrinogen|serum darah|cakram bikonkaf|eritrosit matang.*mitokondria|glikolisis anaerobik.*eritrosit|oksihemoglobin|karbaminohemoglobin|ion bikarbonat.*plasma|bilirubin|diapedesis|gerak ameboid|granulosit|agranulosit|neutrofil|eosinofil|basofil|histamin|heparin|limfosit b|limfosit t|monosit|makrofag|megakariosit|trombosit|hemostasis|trombokinase|protrombin|trombin|benang fibrin|vitamin k.*pembekuan/i, kompetensi: "Menganalisis komponen penyusun darah (plasma, eritrosit, leukosit, trombosit), fungsi spesifiknya, serta mekanisme kaskade pembekuan darah (hemostasis)", topik: "komponen darah, fungsi sel darah, dan mekanisme hemostasis" },
        { pola: /golongan darah abo|aglutinogen|aglutinin|resipien universal|donor universal|aglutinasi|sistem rhesus|antigen d|eritroblastosis fetalis|perikardium|miokardium|atrium|ventrikel kiri.*tebal|katup trikuspidalis|katup bikuspidalis|katup mitral|katup semilunaris|nodus sinoatrial|nodus sa|pacemaker|nodus atrioventrikular|sistol|diastol|sfigmomanometer|120\/80|denyut nadi|arteri pulmonalis|vena pulmonalis|katup satu arah.*vena|kapiler.*endotelium|peredaran darah tertutup|peredaran ganda|sirkulasi sistemik|sirkulasi pulmonal|sirkulasi koroner|vasodilatasi|vasokonstriksi|anemia|leukemia|hemofilia|hipertensi|aterosklerosis|plak ateroma|arteriosklerosis|jantung koroner|infark miokard|varises|hemoroid|wasir|stroke iskemik|stroke hemoragik|trombus|embolus/i, kompetensi: "Menganalisis sistem penggolongan darah (ABO dan Rhesus), anatomi-fisiologi jantung dan pembuluh darah, mekanisme sirkulasi ganda, serta kelainan sistem kardiovaskular", topik: "golongan darah, fisiologi jantung-pembuluh darah, dan gangguan kardiovaskular" },
        { pola: /sistem limfatik|cairan limfa|getah bening|cairan interstisial|cairan kil|pembuluh lakteal|pembuluh kil|ujung buntu.*kapiler limfa|duktus limfatikus dekstra|duktus toraksikus|vena subklavia|organ limfatik primer|sumsum tulang merah|kelenjar timus|imunokompeten|organ limfatik sekunder|nodus limfa|kelenjar getah bening|nodus servikal|nodus aksilar|nodus inguinal|biofilter|proliferasi.*limfosit|limpa|\blien\b|tonsil|amandel|edema|limfedema|filariasis|kaki gajah|wuchereria bancrofti|tonsilitis|limfoma/i, kompetensi: "Menganalisis struktur, mekanisme aliran, organ limfatik primer dan sekunder, serta kelainan klinis pada sistem limfatik manusia", topik: "struktur, fungsi organ, mekanisme aliran, dan gangguan sistem limfatik" },

        /* ================= KELAS XI (FASE F) : SISTEM PENCERNAAN & SISTEM PERNAPASAN ================= */
        { pola: /makronutrien|mikronutrien|4,1 kkal|9,3 kkal|monosakarida|disakarida|polisakarida|asam amino esensial|trigliserida|asam lemak dan gliserol|basal metabolic rate|\bbmr\b|koenzim.*vitamin|vitamin larut lemak|vitamin larut air|provitamin d|uv-b|mineral makro|mineral mikro|kalsium dan fosfor|zat besi.*heme|yodium.*tiroksin|uji lugol|uji benedict|gula pereduksi|endapan merah bata|uji biuret|kertas buram/i, kompetensi: "Menganalisis kandungan makronutrien dan mikronutrien, perhitungan nilai kalori pangan, kebutuhan BMR, serta pengujian kandungan zat makanan di laboratorium", topik: "zat makanan, perhitungan kalori, vitamin-mineral, dan uji zat makanan" },
        { pola: /pencernaan mekanis|pencernaan kimiawi|gigi seri|gigi taring|gigi geraham|bolus|enzim ptialin|amilase saliva|maltosa|faring.*epiglotis|esofagus|gerak peristaltik|sfingter kardiak|sfingter pilorus|kimus|asam klorida|\bhcl\b.*lambung|pepsinogen|pepsin|pepton|enzim renin|kasein|mukus.*lambung|cairan empedu|kantong empedu|emulsifikasi lemak|getah pankreas|ion bikarbonat.*pankreas|lipase|tripsinogen|enterokinase|tripsin|duodenum|jejunum|ileum|maltase|sukrase|laktase|intoleransi laktosa|erepsin|vili|mikrovili|vena porta hepatika|kilomikron|reabsorpsi air.*kolon|escherichia coli.*vitamin k|rektum|defekasi|sfingter anal|karies gigi|gerd|apendisitis|konstipasi|sembelit|diare|kwashiorkor|marasmus/i, kompetensi: "Menganalisis anatomi saluran dan kelenjar pencernaan, mekanisme pencernaan mekanis-kimiawi beserta enzimnya, jalur absorpsi nutrisi, dan gangguan sistem pencernaan", topik: "organ pencernaan, bioproses enzimatis, absorpsi nutrisi, dan gangguan pencernaan" },
        { pola: /pernapasan eksternal|pernapasan internal|zona konduksi|zona respirasi|konka hidung|nasofaring|orofaring|laringofaring|plika vokalis|pita suara|cincin tulang rawan.*bentuk c|sel goblet|eskalator mukosiliar|bronkus kanan.*lebih pendek|bronkus lobaris|bronkiolus terminalis|bronkiolus respiratorius|sel tipe i|sel tipe ii|surfaktan|makrofag alveolar|pleura visceral|pleura parietal|tekanan intrapleural|saraf frenikus|otot interkostal|hukum boyle|tekanan intrapulmonal|compliance paru|resistensi saluran napas|ruang mati anatomis|volume tidal|volume residu|kapasitas vital|kapasitas total paru|kapasitas residu fungsional|spirometri|ventilasi menit|ventilasi alveolar/i, kompetensi: "Menganalisis anatomi zona konduksi dan respirasi, mekanisme ventilasi paru berdasarkan Hukum Boyle, compliance dan resistensi saluran napas, serta pengukuran volume/kapasitas paru (spirometri)", topik: "anatomi saluran pernapasan, mekanisme ventilasi, dan volume/kapasitas paru-paru" },
        { pola: /tekanan parsial oksigen|tekanan parsial karbon dioksida|rasio ventilasi-perfusi|kurva disosiasi oksihemoglobin|sigmoid|efek bohr|afinitas hemoglobin|karbon monoksida.*hemoglobin|karbonat anhidrase|asam karbonat|medula oblongata.*pernapasan|pons.*pernapasan|kemoreseptor sentral|kemoreseptor perifer|badan karotis|badan aorta|hiperventilasi|alkalosis respiratorik|hipoventilasi|asidosis respiratorik|asma.*bronkiolus|emfisema|pneumonia|edema paru|pneumotoraks|hipoksia|pulse oximeter|saturasi oksigen|ventilator mekanik/i, kompetensi: "Menganalisis mekanisme difusi dan transpor gas (O2 dan CO2), kurva disosiasi oksihemoglobin (Efek Bohr), regulasi saraf-kemoreseptor pernapasan, serta patofisiologi gangguan respirasi", topik: "difusi dan transpor gas pernapasan, regulasi respirasi, serta gangguan sistem pernapasan" },

        /* ================= KELAS XII (FASE F) : METABOLISME, ENZIM, RESPIRASI, & FOTOSINTESIS ================= */
        { pola: /adenosin trifosfat|gugus fosfat terminal|eksergonik|endergonik|biokatalisator|energi aktivasi|apoenzim|termolabil|kofaktor|koenzim|holoenzim|sisi aktif|sisi alosterik|teori gembok dan anak kunci|lock and key|teori kecocokan induksi|induced fit|denaturasi.*enzim|inhibitor kompetitif|inhibitor non-kompetitif|polifenol oksidase|sianida.*sitokrom oksidase/i, kompetensi: "Menganalisis konsep bioenergetika (ATP), struktur komponen holoenzim, cara kerja penurunan energi aktivasi, serta faktor dan inhibitor yang memengaruhi laju reaksi enzimatik", topik: "struktur, cara kerja, dan faktor yang memengaruhi aktivitas enzim" },
        { pola: /respirasi aerob|glikolisis|asam piruvat|dekarboksilasi oksidatif|asetil koenzim a|asetil koa|siklus krebs|siklus asam sitrat|asam oksaloasetat|asam sitrat|rantai transpor elektron|fosforilasi oksidatif|akseptor elektron.*oksigen|atp sintase|36 atau 38 atp|fermentasi asam laktat|fermentasi alkohol|asetaldehida|etanol|beta-oksidasi|deaminasi.*amonia.*urea/i, kompetensi: "Menganalisis tahapan reaksi katabolisme karbohidrat (glikolisis, dekarboksilasi oksidatif, siklus Krebs, transpor elektron), fermentasi anaerob, serta keterkaitan katabolisme lemak dan protein", topik: "tahapan respirasi aerob, fermentasi anaerob, serta katabolisme lemak dan protein" },
        { pola: /reaksi terang|membran tilakoid|fotosistem i|fotosistem ii|fotolisis air|aliran elektron siklik|aliran elektron non-siklik|nadph|reaksi gelap|siklus calvin|fiksasi karbon|rubp|ribulosa bifosfat|enzim rubisco|\bpga\b|\bpgal\b|fosfogliseraldehida|regenerasi rubp|kemosintesis|bakteri kemoautotrof|nitrosomonas|nitrobacter|thiobacillus/i, kompetensi: "Menganalisis tahapan reaksi terang dan reaksi gelap (Siklus Calvin) pada fotosintesis serta membandingkannya dengan proses kemosintesis pada bakteri kemoautotrof", topik: "mekanisme reaksi terang dan Siklus Calvin pada fotosintesis serta kemosintesis" },

        /* ================= KELAS XII (FASE F) : PEMBELAHAN SEL, MATERI GENETIK, & HEREDITAS ================= */
        { pola: /siklus sel|fase g1|fase s.*replikasi|fase g2|fase g0|checkpoint|siklin|cdk|apoptosis|proto-onkogen|onkogen|gen penekan tumor|supresor tumor|\bp53\b|metastasis|kariokinesis|sitokinesis|piring sel|lempeng sel|alur pembelahan|cleavage furrow|profase|metafase|piring metafase|anafase|telofase|kinetokor|benang spindel|meiosis i|meiosis ii|pembelahan reduksi|pembelahan ekuasi|sinapsis|tetrad|bivalen|pindah silang|crossing over|kiasma|kromatid saudara|kromatid bukan saudari|nondisjunction|gagal berpisah|aneuploidi|trisomi 21|spermatogenesis|spermatogonium|spermatosit|spermatid|spermatozoa|oogenesis|oogonium|oosit|badan polar/i, kompetensi: "Menganalisis regulasi siklus sel, tahapan pembelahan mitosis dan meiosis, mekanisme gametogenesis (spermatogenesis dan oogenesis), serta dampak nondisjunction", topik: "regulasi siklus sel, pembelahan mitosis dan meiosis, serta gametogenesis" },
        { pola: /protein histon|nukleosom|kromatin|metasentrik|submetasentrik|akrosentrik|telosentrik|autosom|gonosom|kariotipe|44 aa \+ xy|44 aa \+ xx|polinukleotida|deoksiribosa|gula ribosa|gugus 2'-oh|nukleosida|nukleotida|basa purin|basa pirimidin|adenin|guanin|timin|sitosin|urasil|aturan chargaff|suhu leleh|\btm\b.*dna|ikatan fosfodiester|ikatan hidrogen.*basa|watson dan crick|heliks ganda|replikasi semikonservatif|enzim helikase|dna polimerase|leading strand|lagging strand|fragmen okazaki|dna ligase|primer rna|kode genetik|degeneratif|universal.*kodon|kodon awal|kodon aug|metionin|kodon stop|\buaa\b|\buag\b|\buga\b|transkripsi|rna polimerase|untai templat|antisense|untai sense|coding strand|promoter|terminator|translasi|antikodon|ikatan peptida.*ribosom|hidrolisis gtp|ekspresi gen yang selektif|mutasi titik|anemia sel sabit|valin.*glutamat|insersi.*kerangka baca|frameshift|profil dna forensik/i, kompetensi: "Menganalisis struktur kromosom, perbedaan biokimiawi DNA dan RNA, mekanisme replikasi DNA semikonservatif, tahapan sintesis protein (transkripsi dan translasi), serta dampak mutasi gen", topik: "struktur kromosom, DNA, RNA, replikasi DNA, dan sintesis protein" },
        { pola: /hukum mendel i|segregasi|hukum mendel ii|asortasi bebas|persilangan monohibrid|persilangan dihibrid|dominansi penuh|dominansi tidak sempurna|intermediet|kodominan|galur murni|rumus 2\^n|macam gamet|testcross|uji silang|backcross|silang balik|persilangan resiprok|penyimpangan semu|atavisme|pial ayam|walnut|kriptomeri|linaria maroccana|polimeri|epistasis dominan|epistasis resesif|hipostasis|gen komplementer|lathyrus odoratus|tautan gen|nilai pindah silang|\bnps\b|gamet rekombinan|gen letal|ayam redep|tikus.*kuning|jagung albino|determinasi seks|sistem xy|sistem zw|sistem x0|partenogenesis|alel ganda|sistem mn|brakidaktili|polidaktili|thalassemia|albinisme|carrier|tertaut kromosom x|buta warna|hipertrichosis|holandrik|peta silsilah|pedigree/i, kompetensi: "Menerapkan prinsip pewarisan sifat Hukum Mendel, penyimpangan semu Hukum Mendel, tautan dan pindah silang, gen letal, determinasi seks, serta analisis peta silsilah (pedigree) hereditas manusia", topik: "prinsip hereditas Mendel, penyimpangan semu, tautan gen, dan hereditas manusia" }
    ],
    "Fisika": [
        { pola: /besaran|satuan|dimensi|angka penting|jangka sorong|mikrometer|ketidakpastian|pengukuran/i, kompetensi: "Menerapkan prinsip pengukuran besaran fisis, aturan angka penting, dan analisis dimensi", topik: "pengukuran besaran fisis dan analisis dimensi" },
        { pola: /vektor|resultan|skalar|poligon|komponen|sudut apit|perkalian titik|perkalian silang/i, kompetensi: "Menerapkan prinsip penjumlahan, penguraian, dan operasi vektor sebidang", topik: "operasi vektor sebidang" },
        { pola: /kecepatan|percepatan|kelajuan|glbb|gerak lurus|jatuh bebas|gerak vertikal/i, kompetensi: "Menganalisis besaran fisis pada gerak lurus dengan kecepatan konstan dan percepatan konstan", topik: "kinematika gerak lurus (GLB dan GLBB)" },
        { pola: /gerak parabola|peluru|sudut elevasi|titik tertinggi|jarak terjauh/i, kompetensi: "Menganalisis fenomena gerak parabola menggunakan perpaduan gerak lurus", topik: "gerak parabola" },
        { pola: /gerak melingkar|sentripetal|kecepatan sudut|percepatan sudut|periode|frekuensi|roda-roda/i, kompetensi: "Menganalisis besaran fisis pada gerak melingkar beraturan dan hubungan roda-roda", topik: "gerak melingkar dan hubungan roda-roda" },
        { pola: /hukum newton|gaya gesek|gaya normal|tegangan tali|katrol|bidang miring|dinamika partikel/i, kompetensi: "Menganalisis hukum Newton tentang gerak dan penerapannya pada sistem mekanika", topik: "dinamika gerak dan Hukum Newton" },
        { pola: /gravitasi|hukum kepler|medan gravitasi|kecepatan orbit|satelit/i, kompetensi: "Menganalisis hukum gravitasi universal Newton dan hukum Kepler pada gerak planet/satelit", topik: "gravitasi Newton dan Hukum Kepler" },
        { pola: /usaha|energi kinetik|energi potensial|kekekalan energi|daya|kerja mekanik/i, kompetensi: "Menganalisis konsep usaha, perubahan energi, dan hukum kekekalan energi mekanik", topik: "usaha dan kekekalan energi mekanik" },
        { pola: /momentum|impuls|tumbukan|lenting|koefisien restitusi/i, kompetensi: "Menerapkan konsep momentum, impuls, dan hukum kekekalan momentum pada peristiwa tumbukan", topik: "impuls, momentum, dan tumbukan" },
        { pola: /gerak harmonis|getaran|pegas|ayunan bandul|amplitudo/i, kompetensi: "Menganalisis gaya pemulih dan persamaan simpangan pada gerak harmonis sederhana", topik: "gerak harmonis sederhana" },
        { pola: /momen gaya|momen inersia|momentum sudut|dinamika rotasi|titik berat|kesetimbangan benda tegar/i, kompetensi: "Menerapkan konsep dinamika rotasi, momen inersia, titik berat, dan kesetimbangan benda tegar", topik: "dinamika rotasi dan kesetimbangan benda tegar" },
        { pola: /elastisitas|hukum hooke|modulus young|tegangan|regangan|konstanta pegas/i, kompetensi: "Menganalisis sifat elastisitas bahan dan penerapan hukum Hooke pada susunan pegas", topik: "elastisitas bahan dan Hukum Hooke" },
        { pola: /fluida statis|hukum pascal|archimedes|tekanan hidrostatis|kapilaritas|tegangan permukaan|fluida dinamis|bernoulli|debit|kontinuitas|venturimeter/i, kompetensi: "Menerapkan hukum-hukum fluida statis dan asas Bernoulli pada fluida dinamis", topik: "mekanika fluida statis dan dinamis" },
        { pola: /suhu|kalor|pemuaian|asas black|konduksi|konveksi|radiasi|gas ideal|termodinamika|mesin carnot|isotermik|adiabatik|isobarik|isokhorik/i, kompetensi: "Menganalisis perpindahan kalor, persamaan keadaan gas ideal, dan hukum-hukum termodinamika", topik: "kalor, teori kinetik gas, dan termodinamika" },
        { pola: /gelombang berjalan|gelombang stasioner|gelombang bunyi|efek doppler|taraf intensitas|pipa organa|dawai|interferensi|difraksi|polarisasi|cermin|lensa|alat optik/i, kompetensi: "Menganalisis karakteristik gelombang mekanik, gelombang bunyi, gelombang cahaya, dan alat optik", topik: "gelombang mekanik, bunyi, dan optika" },
        { pola: /listrik searah|hukum ohm|kirchhoff|listrik statis|coulomb|kapasitor|medan magnet|gaya lorentz|induksi elektromagnetik|faraday|transformator|arus bolak-balik|rangkaian rlc|relativitas|efek fotolistrik|radioaktivitas|inti atom|energi terbarukan/i, kompetensi: "Menganalisis rangkaian listrik, kemagnetan, induksi elektromagnetik, serta konsep fisika modern dan energi alternatif", topik: "kelistrikan, kemagnetan, dan fisika modern" }
    ],
    "Kimia": [
        { pola: /model atom|konfigurasi elektron|bilangan kuantum|sistem periodik|ikatan ion|ikatan kovalen|bentuk molekul|vsepr|hibridisasi|gaya antarmolekul|larutan elektrolit|bilangan oksidasi|tata nama senyawa|hukum dasar kimia|konsep mol|stoikiometri|pereaksi pembatas/i, kompetensi: "Menganalisis struktur atom, sifat keperiodikan unsur, ikatan kimia, serta perhitungan stoikiometri reaksi kimia", topik: "struktur atom, ikatan kimia, dan stoikiometri" },
        { pola: /hidrokarbon|alkana|alkena|alkuna|minyak bumi|bilangan oktan|termokimia|entalpi|hukum hess|laju reaksi|orde reaksi|kesetimbangan kimia|le chatelier|asam basa|ph larutan|titrasi|hidrolisis garam|larutan penyangga|buffer|kelarutan|\bksp\b|koloid/i, kompetensi: "Menganalisis senyawa hidrokarbon, termokimia, kinetika laju reaksi, kesetimbangan kimia, serta kesetimbangan ion dalam larutan asam-basa, buffer, hidrolisis, dan Ksp", topik: "termokimia, laju reaksi, kesetimbangan, dan larutan asam-basa" },
        { pola: /sifat koligatif|tekanan osmotik|penyetaraan redoks|sel volta|potensial sel|korosi|sel elektrolisis|hukum faraday|kimia unsur|gugus fungsi|alkanol|alkanal|alkanon|asam karboksilat|ester|benzena|polimer|makromolekul/i, kompetensi: "Menganalisis sifat koligatif larutan, elektrokimia (sel Volta dan elektrolisis), serta struktur dan reaksi senyawa karbon turunan alkana, benzena, dan makromolekul", topik: "sifat koligatif, elektrokimia, dan kimia organik" }
    ],
    "Matematika": [
        { pola: /nilai mutlak|spltv|fungsi kuadrat|fungsi komposisi|fungsi invers|trigonometri|aturan sinus|aturan kosinus|induksi matematika|program linear|matriks|determinan|invers matriks|transformasi geometri|translasi|refleksi|rotasi|dilatasi|barisan|deret|aritmetika|geometri/i, kompetensi: "Menyelesaikan masalah aljabar, fungsi komposisi-invers, trigonometri, matriks, transformasi geometri, serta barisan dan deret", topik: "aljabar, fungsi, matriks, transformasi, dan deret" },
        { pola: /limit fungsi|turunan|diferensial|garis singgung|nilai stasioner|integral|luas daerah|volume benda putar|dimensi tiga|statistika|mean|median|modus|kuartil|simpangan baku|pencacahan|permutasi|kombinasi|peluang|eksponen|logaritma|lingkaran|polinomial|suku banyak|distribusi binomial|distribusi normal/i, kompetensi: "Menganalisis konsep kalkulus (limit, turunan, integral), geometri dimensi tiga, statistika, peluang, serta fungsi eksponensial dan polinomial", topik: "kalkulus, dimensi tiga, statistika, dan peluang" }
    ]
};

// =========================================================================
// BLOK 2: NLP LOKAL (NATURAL LANGUAGE PROCESSING) - EKSTRAKTOR 25+ POLA SOAL
// =========================================================================
window.ekstrakFiturSoal = function(teksMentah, tipeSoal) {
    let teks = (teksMentah || "").replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    let lower = teks.toLowerCase();

    // 1. DETEKSI STIMULUS VISUAL, WACANA, & TABEL
    let adaGrafikTabel = /berdasarkan (tabel|data tabel|grafik|histogram|kurva)|perhatikan (tabel|grafik|histogram|kurva)|data hasil pengamatan/i.test(lower);
    let adaDiagram = /perhatikan (gambar|skema|bagan|diagram|ilustrasi)|(gambar|ilustrasi) di (samping|bawah|atas)|pedigree|kladogram|peta silsilah/i.test(lower);
    let adaPernyataanGanda = /\(1\).*\n*.*\(2\).*\n*.*\(3\)/i.test(lower) || /pernyataan yang benar adalah|perhatikan (pernyataan|data|daftar) berikut|ciri-ciri berikut/i.test(lower);
    let jumlahKata = teks.split(" ").length;
    let teksSangatPanjang = jumlahKata > 32;

    // 2. DETEKSI ARCHETYPE SPESIFIK DARI BANK SOAL BIOLOGI (KELAS X, XI, XII)
    let isEtimologi = /\bbios\b|\blogos\b|berasal dari kata|dalam istilah.*berarti|secara etimologi/i.test(lower);
    let isCabangIlmu = /cabang (ilmu )?biologi yang mempelajari|ilmu yang mempelajari/i.test(lower);
    let isMetodologiIlmiah = /variabel (bebas|terikat|kontrol|pengganggu|independen|dependen)|hipotesis (nol|nihil|alternatif)|kelompok kontrol|kontrol negatif|randomisasi|peer review|fabrikasi data|data (kualitatif|kuantitatif|primer|sekunder)|definisi operasional/i.test(lower);
    let isKlasifikasiOrganisme = /organisme p\b.*organisme q\b|diklasifikasikan sebagai|dikelompokkan ke dalam|termasuk kelompok|termasuk filum|termasuk divisi|termasuk kingdom/i.test(lower);
    let isUrutanSekuensGenetik = /[35]'\s*-\s*[atgcu\s-]+-\s*[35]'|kodon.*mrna|antikodon.*trna|untai.*templat.*urutan|urutan basa/i.test(lower);
    let isHitunganChargaff = /(\d+\s*nukleotida|\d+%\s*(adenin|guanin|timin|sitosin|pasangan basa)|jumlah ikatan hidrogen total)/i.test(lower);
    let isPersilanganGenetika = /disilangkan dengan|menikah dengan|rasio fenotipe|rasio genotipe|peluang (anak|keturunan|munculnya)|persentase keturunan|macam gamet|nilai pindah silang|\bnps\b|testcross|backcross|resiprok|carrier (hemofilia|albinisme|buta warna)|peta silsilah/i.test(lower);
    let isHitunganKaloriAtauSpirometri = /(mengandung \d+\s*g\s*(lemak|karbohidrat|protein)|ventilasi menit|ventilasi alveolar|kapasitas vital|kapasitas total paru|kapasitas residu fungsional|\d+\s*ml\/menit|jumlah.*atp|menghasilkan.*atp)/i.test(lower);
    let isUjiLaboratorium = /uji (lugol|benedict|biuret|fehling|kertas buram|sachs|makanan)|pewarnaan gram|kristal violet|safranin|dekolorisasi|spirometri|pulse oximeter|sfigmomanometer|kultur \d+/i.test(lower);
    let isKasusKlinisFisiologis = /pasien|penderita|mengalami (gejala|kelainan|demam|anemia|pembengkakan|edema|kembung|diare|sesak napas|keracunan|lisis|krenasi|plasmolisis)|penyakit|infeksi|patogen|mutasi|sindrom|kanker|stroke|aterosklerosis|hipertensi|hemofilia|varises|filariasis|asidosis|alkalosis|hipoksia|intoleransi laktosa|kwashiorkor|marasmus|kerusakan.*enzim|tidak berfungsi/i.test(lower);
    let isSebabAkibatAlasan = /\bkarena\b|\bmengapa\b|penjelasan yang paling tepat|alasan yang paling tepat|konsekuensi|dampak langsung|akibat langsung|menyebabkan|bertujuan untuk/i.test(lower);
    let isPerbandingan = /perbedaan (utama|mendasar|prinsip)?\s*antara|membedakan.*dari|dibandingkan dengan|perbandingan tersebut|persamaan antara/i.test(lower);
    let isNegasi = /\b(kecuali|bukan|tidak benar|yang salah|bukan merupakan|tidak termasuk|tidak dimiliki|tidak terdapat|tidak mungkin)\b/i.test(lower);

    // 3. GABUNGAN DETEKSI KUANTITATIF & EKSPERIMEN
    let adaHitungan = isHitunganChargaff || isUrutanSekuensGenetik || isPersilanganGenetika || isHitunganKaloriAtauSpirometri || /(\d+\s*(m\/s|joule|watt|kg|cm|mm|gram|mol|liter|derajat|°|kkal|kalori|%|mmhg|ml))|hitunglah|berapakah|rasio|peluang|persentase/i.test(lower);
    let adaEksperimen = isUjiLaboratorium || isMetodologiIlmiah || /percobaan|praktikum|peneliti|seorang siswa (mengamati|memelihara|membandingkan)|tabung reaksi|mikroskop|larutan (hipotonik|hipertonik|isotonik)|air suling/i.test(lower);

    // 4. ISOLASI KONTEKS KASUS AWAL KALIMAT
    let konteksKasus = "";
    let matchKonteks = teks.match(/^(seorang\s+(?:siswa|peneliti|pasien|anak|pendaki|petani|geolog|perawat|dokter|pria|wanita|ayah)[^.,?]+|pada\s+(?:pasien|korban|percobaan|proses|kondisi|kasus|siklus|sistem|organ|tanaman|individu|kolam)[^.,?]+|ketika\s+[^.,?]+|apabila\s+[^.,?]+|jika\s+[^.,?]+|saat\s+[^.,?]+)/i);
    if (matchKonteks) {
        konteksKasus = matchKonteks[1]
            .replace(/^(pada|ketika|apabila|jika|saat)\s+/i, '')
            .trim();
        let kataKonteks = konteksKasus.split(/\s+/);
        if (kataKonteks.length > 9) konteksKasus = kataKonteks.slice(0, 9).join(' ');
    }

    // 5. EKSTRAKSI INTI OBJEK TARGET YANG BERSIH DARI KATA TANYA & TITIK-TITIK
    let kalimatAkhir = teks;
    if (teks.includes('?')) {
        let pecahKalimat = teks.split(/[\.\!]\s+/);
        kalimatAkhir = pecahKalimat[pecahKalimat.length - 1];
    } else if (teks.split(/[\.\!]\s+/).length > 1) {
        let pecahKalimat = teks.split(/[\.\!]\s+/).filter(function(s) { return s.trim().length > 3; });
        kalimatAkhir = pecahKalimat[pecahKalimat.length - 1];
    }

    let objekTarget = kalimatAkhir
        .replace(/\.{2,}/g, ' ')
        .replace(/^(perhatikan (gambar|tabel|grafik|diagram|data|pernyataan)[^!.,]*[\!.,]\s*)/i, '')
        .replace(/^(berdasarkan (informasi|perbandingan|fakta|karakteristik|ciri|mekanisme|prinsip|data|gambar|tabel|grafik|peta silsilah|uraian)\s+(tersebut|di atas|berikut)[,\s]*)/i, '')
        .replace(/\b(pernyataan|penjelasan|kesimpulan|interpretasi|alasan|hubungan|perbedaan|konsekuensi|dampak|langkah|tindakan|kondisi|proses|struktur|organel|bagian|enzim|hormon|senyawa|molekul|zat|kelompok|organisme|spesies|penyakit|kelainan|tahap|fase|mekanisme)\s+(manakah\s+)?(yang\s+)?(paling\s+)?(tepat|benar|sesuai|mungkin(\s+terjadi)?|langsung|utama|berkaitan)\s*(mengenai|untuk|pada|terhadap|dari|dalam|adalah|ialah|yaitu)?\b/gi, '$1 ')
        .replace(/\b(disebut(\s+dengan\s+istilah|\s+sebagai)?|dinamakan|diistilahkan\s+sebagai|dikenal\s+(dengan\s+nama|sebagai|dengan\s+istilah)|diklasifikasikan\s+sebagai|digolongkan\s+ke\s+dalam|merupakan\s+contoh\s+dari|adalah|merupakan|ialah|yaitu|yakni|berfungsi\s+untuk|berperan\s+dalam|bertujuan\s+untuk)\b/gi, ' ')
        .replace(/\b(apa|apakah|manakah|bagaimana|mengapa|dimana|di mana|siapa|kapan|berapakah|tentukan|sebutkan|jelaskan|hitunglah|carilah|selesaikan)\b/gi, ' ')
        .replace(/\b(kecuali|bukan\s+merupakan|tidak\s+termasuk)\b/gi, ' ')
        .replace(/^[?.!,:;\-\s]+/g, '')
        .replace(/[?.!,:;\-\s]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    let kataObjek = objekTarget.split(' ').filter(function(k) { return k.length > 1; });
    if (kataObjek.length > 11) {
        objekTarget = kataObjek.slice(0, 11).join(' ');
    } else {
        objekTarget = kataObjek.join(' ');
    }

    if (!objekTarget || objekTarget.length < 4) {
        objekTarget = konteksKasus || "konsep materi biologi yang disajikan";
    }

    return {
        teksAsli: teks,
        lower: lower,
        tipeSoal: tipeSoal || "PG",
        jumlahKata: jumlahKata,
        teksSangatPanjang: teksSangatPanjang,
        adaGrafikTabel: adaGrafikTabel,
        adaDiagram: adaDiagram,
        adaPernyataanGanda: adaPernyataanGanda,
        isEtimologi: isEtimologi,
        isCabangIlmu: isCabangIlmu,
        isMetodologiIlmiah: isMetodologiIlmiah,
        isKlasifikasiOrganisme: isKlasifikasiOrganisme,
        isUrutanSekuensGenetik: isUrutanSekuensGenetik,
        isHitunganChargaff: isHitunganChargaff,
        isPersilanganGenetika: isPersilanganGenetika,
        isHitunganKaloriAtauSpirometri: isHitunganKaloriAtauSpirometri,
        isUjiLaboratorium: isUjiLaboratorium,
        isKasusKlinisFisiologis: isKasusKlinisFisiologis,
        isSebabAkibatAlasan: isSebabAkibatAlasan,
        isPerbandingan: isPerbandingan,
        isNegasi: isNegasi,
        adaHitungan: adaHitungan,
        adaEksperimen: adaEksperimen,
        konteksKasus: konteksKasus.toLowerCase(),
        objekTarget: objekTarget.toLowerCase()
    };
};

// =========================================================================
// BLOK 3: MESIN PENALARAN TAKSONOMI BLOOM (C1 - C6) PRESISI TINGGI
// =========================================================================
window.inferensiLevelKognitif = function(fitur) {
    let t = fitur.lower;

    // 1. LEVEL C6 (MENCIPTA / MERANCANG)
    if (/\b(rancanglah|susunlah\s+skema|buatlah\s+model|merancang\s+percobaan|berikan\s+solusi\s+inovatif|rumuskan\s+hipotesis\s+baru)\b/i.test(t)) {
        return "C6";
    }

    // 2. LEVEL C5 (MENGEVALUASI / MENILAI VALIDITAS & MISKONSEPSI)
    if (/\b(evaluasi\s+kelayakan|solusi\s+terbaik|kritiklah|berikan\s+tanggapan|miskonsepsi|pandangan\s+bahwa.*merupakan|menilai\s+kebenaran|tindakan\s+paling\s+tepat\s+adalah)\b/i.test(t)) {
        return "C5";
    }

    // 3. LEVEL C4 (MENGANALISIS: STUDI KASUS EKSPERIMEN MULTI-KONDISI, PEDIGREE, MUTASI, & SEBAB-AKIBAT KOMPLEKS)
    if (
        fitur.adaPernyataanGanda ||
        fitur.adaGrafikTabel ||
        /\b(kultur\s+1.*kultur\s+2|organisme\s+p\b.*organisme\s+q\b|sampel\s+p\b.*sampel\s+q\b|molekul\s+x\b.*molekul\s+y\b|makanan\s+x\b.*makanan\s+y\b|jika\s+enzim.*tidak\s+berfungsi|apabila.*mengalami\s+kerusakan|dampak\s+langsung\s+yang\s+paling\s+mungkin|konsekuensi\s+fisiologis|kompensasi\s+fisiologis|berdasarkan\s+peta\s+silsilah|kerangka\s+baca\s+bergeser|frameshift|mutasi\s+insersi|mutasi\s+delesi)\b/i.test(t) ||
        (fitur.teksSangatPanjang && (fitur.isSebabAkibatAlasan || fitur.isKasusKlinisFisiologis))
    ) {
        return "C4";
    }

    // 4. LEVEL C3 (MENGAPLIKASIKAN: PERHITUNGAN GENETIKA, CHARGAFF, KALORI, SPIROMETRI, TRANSKRIPSI/TRANSLASI, & UJI LAB)
    if (
        fitur.isUrutanSekuensGenetik ||
        fitur.isHitunganChargaff ||
        fitur.isPersilanganGenetika ||
        fitur.isHitunganKaloriAtauSpirometri ||
        fitur.isUjiLaboratorium ||
        /\b(hitunglah|berapakah|rasio\s+fenotipe|rasio\s+genotipe|persentase\s+keturunan|peluang\s+kelahiran|peluang\s+anak|macam\s+gamet|urutan\s+basa\s+pada\s+mrna|antikodon\s+pada\s+trna|jumlah\s+asam\s+amino\s+yang\s+menyusun)\b/i.test(t)
    ) {
        return "C3";
    }

    // 5. LEVEL C2 (MEMAHAMI: MENJELASKAN ALASAN "KARENA/MENGAPA", MEMBANDINGKAN, MENGINTERPRETASIKAN FUNGSI)
    if (
        fitur.isPerbandingan ||
        fitur.isSebabAkibatAlasan ||
        fitur.isKlasifikasiOrganisme ||
        fitur.isKasusKlinisFisiologis ||
        /\b(fungsi\s+utama|peran\s+utama|bertujuan\s+untuk|pernyataan\s+yang\s+paling\s+tepat|penjelasan\s+yang\s+paling\s+tepat|interpretasi\s+yang\s+tepat|makna\s+fisiologis|hubungan\s+antara|keuntungan\s+utama|ciri\s+utama\s+yang\s+membedakan)\b/i.test(t)
    ) {
        return "C2";
    }

    // 6. LEVEL C1 (MENGINGAT: DEFINISI LANGSUNG, NAMA CABANG ILMU, ETIMOLOGI, NAMA ORGANEL/ENZIM/SPESIES)
    return "C1";
};

// =========================================================================
// BLOK 4: PERAKITAN KOMPETENSI & INDIKATOR SOAL STANDAR GURU INTI
// =========================================================================
window.rakitKompetensiDanIndikator = function(fitur, levelKog, namaMapel) {
    let itemCocok = null;
    let targetMapel = Object.keys(window.BASIS_PENGETAHUAN_KURIKULUM).find(function(k) {
        return new RegExp(k, 'i').test(namaMapel);
    });
    let kamusKurikulum = targetMapel ? window.BASIS_PENGETAHUAN_KURIKULUM[targetMapel] : [];

    if (kamusKurikulum.length === 0) {
        Object.values(window.BASIS_PENGETAHUAN_KURIKULUM).forEach(function(arr) {
            kamusKurikulum = kamusKurikulum.concat(arr);
        });
    }

    // Cari kecocokan dengan skor kata kunci tertinggi agar materi paling spesifik terpilih
    let skorTertinggi = 0;
    for (let i = 0; i < kamusKurikulum.length; i++) {
        let itemBasis = kamusKurikulum[i];
        if (itemBasis && itemBasis.pola && typeof itemBasis.pola.test === 'function') {
            let matches = fitur.lower.match(new RegExp(itemBasis.pola.source, 'gi'));
            if (matches && matches.length > skorTertinggi) {
                skorTertinggi = matches.length;
                itemCocok = itemBasis;
            }
        }
    }

    let kompetensiMentah = itemCocok ? itemCocok.kompetensi : "";
    let topikSpesifik = (itemCocok && itemCocok.topik) ? itemCocok.topik : "";

    if (!topikSpesifik) {
        if (kompetensiMentah) {
            topikSpesifik = kompetensiMentah.replace(/^(Menganalisis|Memahami( dan menerapkan)?|Mengidentifikasi|Menerapkan|Menjelaskan|Mengevaluasi|Merancang|Menentukan|Membandingkan|Membedakan|Mengklasifikasikan|Menyelesaikan)\s+/i, '');
        } else {
            topikSpesifik = "konsep " + (fitur.konteksKasus || fitur.objekTarget);
        }
    }

    // 1. Penentuan KKO Kompetensi & KKO Indikator Berdasarkan Level Kognitif & Pola Soal
    let kkoKompetensi = "Memahami ";
    let kkoIndikator = "menentukan";

    switch (levelKog) {
        case "C1":
            kkoKompetensi = "Mengidentifikasi dan memahami ";
            if (fitur.isEtimologi) kkoIndikator = "menyebutkan arti istilah etimologi pada";
            else if (fitur.isCabangIlmu) kkoIndikator = "mengidentifikasi cabang ilmu biologi yang mengkaji";
            else if (/letak|tempat|lokasi|berlangsung di/.test(fitur.lower)) kkoIndikator = "menunjukkan lokasi/tempat berlangsungnya";
            else if (/disebut|dinamakan|istilah|nama ilmiah/.test(fitur.lower)) kkoIndikator = "menyebutkan istilah ilmiah untuk";
            else kkoIndikator = "mengidentifikasi";
            break;
        case "C2":
            kkoKompetensi = "Memahami dan menjelaskan ";
            if (fitur.isPerbandingan) kkoIndikator = "membedakan karakteristik antara";
            else if (fitur.isSebabAkibatAlasan) kkoIndikator = "menjelaskan alasan ilmiah mengenai";
            else if (fitur.isKlasifikasiOrganisme) kkoIndikator = "mengklasifikasikan organisme berdasarkan ciri";
            else kkoIndikator = "menjelaskan konsep dan fungsi";
            break;
        case "C3":
            kkoKompetensi = "Menerapkan konsep dan prinsip ";
            if (fitur.isUrutanSekuensGenetik) kkoIndikator = "menentukan urutan basa nitrogen hasil replikasi/transkripsi/translasi pada";
            else if (fitur.isHitunganChargaff) kkoIndikator = "menghitung komposisi jumlah atau persentase basa nitrogen pada";
            else if (fitur.isPersilanganGenetika) kkoIndikator = "menghitung rasio atau peluang genotipe/fenotipe keturunan pada";
            else if (fitur.isHitunganKaloriAtauSpirometri) kkoIndikator = "menghitung nilai kuantitatif pada";
            else if (fitur.isUjiLaboratorium) kkoIndikator = "menginterpretasikan hasil pengujian laboratorium pada";
            else kkoIndikator = "menerapkan prinsip";
            break;
        case "C4":
            kkoKompetensi = "Menganalisis keterkaitan konsep ";
            if (fitur.isKasusKlinisFisiologis) kkoIndikator = "menganalisis mekanisme patofisiologi atau dampak gangguan pada";
            else if (fitur.adaEksperimen) kkoIndikator = "menganalisis hasil pengamatan eksperimen mengenai";
            else kkoIndikator = "menganalisis hubungan sebab-akibat pada";
            break;
        case "C5":
            kkoKompetensi = "Mengevaluasi permasalahan ";
            kkoIndikator = "mengevaluasi kebenaran konsep atau tindakan tepat terkait";
            break;
        case "C6":
            kkoKompetensi = "Merancang penyelesaian masalah ";
            kkoIndikator = "merumuskan gagasan atau rancangan terkait";
            break;
    }

    if (fitur.isNegasi) {
        kkoIndikator = "mengidentifikasi pernyataan atau karakteristik yang TIDAK tepat mengenai";
    }

    // 2. Perakitan Kalimat Stimulus Indikator yang Kontekstual & Spesifik
    let stimulus = "Disajikan deskripsi konsep mengenai " + topikSpesifik + ", peserta didik dapat ";

    if (fitur.isUrutanSekuensGenetik) {
        stimulus = "Disajikan urutan basa nitrogen pada rantai DNA atau mRNA, peserta didik dapat ";
    } else if (fitur.isHitunganChargaff) {
        stimulus = "Disajikan data jumlah nukleotida atau persentase basa nitrogen pada molekul DNA, peserta didik dapat ";
    } else if (fitur.isPersilanganGenetika) {
        stimulus = "Disajikan kasus persilangan genetik atau peta silsilah (pedigree) pewarisan sifat, peserta didik dapat ";
    } else if (fitur.isHitunganKaloriAtauSpirometri) {
        stimulus = "Disajikan data kuantitatif fisiologis/nutrisi, peserta didik dapat ";
    } else if (fitur.isUjiLaboratorium) {
        stimulus = "Disajikan prosedur atau data hasil pengujian laboratorium, peserta didik dapat ";
    } else if (fitur.adaGrafikTabel) {
        stimulus = "Disajikan data pengamatan dalam bentuk tabel/grafik mengenai " + topikSpesifik + ", peserta didik dapat ";
    } else if (fitur.adaDiagram) {
        stimulus = "Disajikan skema/ilustrasi visual mengenai " + topikSpesifik + ", peserta didik dapat ";
    } else if (fitur.adaPernyataanGanda) {
        stimulus = "Disajikan beberapa pernyataan terkait " + topikSpesifik + ", peserta didik dapat ";
    } else if (fitur.isKasusKlinisFisiologis) {
        stimulus = "Disajikan studi kasus klinis/fisiologis mengenai " + topikSpesifik + ", peserta didik dapat ";
    } else if (fitur.adaEksperimen) {
        stimulus = "Disajikan deskripsi kasus pengamatan/eksperimen mengenai " + topikSpesifik + ", peserta didik dapat ";
    } else if (fitur.isPerbandingan) {
        stimulus = "Disajikan perbandingan karakteristik pada " + topikSpesifik + ", peserta didik dapat ";
    }

    let kompetensiFinal = kompetensiMentah || (kkoKompetensi + topikSpesifik);
    let targetBersih = fitur.objekTarget;
    if (targetBersih.length < 6 || targetBersih === "konsep materi biologi yang disajikan") {
        targetBersih = topikSpesifik;
    }

    let indikatorFinal = stimulus + kkoIndikator + " " + targetBersih + " dengan tepat.";
    indikatorFinal = indikatorFinal.charAt(0).toUpperCase() + indikatorFinal.slice(1).replace(/\s+/g, ' ');

    return {
        kompetensi: kompetensiFinal,
        indikator: indikatorFinal
    };
};

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

        let teksSoalLengkap = (q.question || "").replace(/\n/g, '<br>');
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

    // Otomasi Rowspan untuk Kompetensi yang sama agar tabel rapi
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
        let tdCapaian = (idx === 0) ? `<td rowspan="${totalSoal}" contenteditable="true" style="text-align:justify; vertical-align:top;">${cp.replace(/\n/g, '<br>')}</td>` : "";
        let tdKompetensi = (item.kompRowspan > 0) ? `<td rowspan="${item.kompRowspan}" contenteditable="true" style="vertical-align:top; text-align:left;">${item.kompetensi}</td>` : "";

        barisTabel += `
            <tr>
                ${tdCapaian}
                ${tdKompetensi}
                <td contenteditable="true" style="vertical-align:top; text-align:left;">${item.indikator}</td>
                <td contenteditable="true" style="text-align:center; vertical-align:top;">${item.bentukSoal}</td>
                <td style="text-align:center; vertical-align:top;">${item.nomor}</td>
                <td contenteditable="true" style="text-align:left; vertical-align:top;">${item.teksSoalLengkap}</td>
                <td contenteditable="true" style="text-align:center; font-weight:bold; vertical-align:top;">${item.kunci}</td>
                <td contenteditable="true" style="text-align:center; font-weight:bold; vertical-align:top;">${item.levelKog}</td>
            </tr>
        `;
    });

    let stringRincianSoal = `${jmlPG} soal Pilihan Ganda dan ${jmlUraian} soal Uraian`;
    if(jmlUraian === 0) stringRincianSoal = `${jmlPG} soal Pilihan Ganda`;
    if(jmlPG === 0) stringRincianSoal = `${jmlUraian} soal Uraian`;

    // Injeksi CSS Khusus Cetak (Kop terikat tabel, halaman memecah secara natural)
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
            body { padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { size: landscape; margin: 12mm 15mm; }
            
            h2, h3, .kop-info { page-break-after: avoid !important; page-break-inside: avoid !important; }
            
            table.kisi-table { page-break-before: avoid !important; page-break-inside: auto !important; }
            thead { display: table-header-group !important; }
            
            tr { page-break-inside: avoid; page-break-after: auto; }
            td { page-break-inside: auto; }
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