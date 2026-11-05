// Türkçe dava dosyaları. Her dava, tanık ifadesi ile tek delil arasında
// bir çelişki kurar; bu çelişki suçlamayı doğrular ya da gerçeği ortaya çıkarır.
// Ceza kademeleri oyun içi yönergeleri izler:
//   fine   -> hafif, şiddet içermeyen, 500 doların altında, ilk suç
//   year1  -> önemli değerde hırsızlık/dolandırıcılık, 500 doları aşan hasar, adaleti engelleme
//   year10 -> şiddet, can güvenliğini tehlikeye atan kundakçılık, 50.000 doları aşan dolandırıcılık

export const SENTENCE_META = {
  "fine": {
    "label": "Para Cezası",
    "short": "Para",
    "detail": "Hafif, şiddet içermeyen suçlar. 500 doların altında kalan malvarlığı. İlk suç."
  },
  "year1": {
    "label": "1 Yıl",
    "short": "1 Yıl",
    "detail": "Önemli değerde hırsızlık veya dolandırıcılık. 500 doları aşan mal hasarı. Adaleti engelleme."
  },
  "year10": {
    "label": "10 Yıl",
    "short": "10 Yıl",
    "detail": "Şiddet. Can güvenliğini tehlikeye atan kundakçılık. 50.000 doları aşan dolandırıcılık veya kalpazanlık."
  }
};

export const CASES = [
  {
    "id": 1,
    "docket": "114-B",
    "title": "Çalınan Bisiklet",
    "charge": "Basit Hırsızlık",
    "summary": "El yapımı bir bisiklet pazarın önünden kayboldu. Ertesi sabah sanığın, onu iki sokak ötedeki bir rehinciye doğru sürdüğü görüldü.",
    "claim": "“Onu pazarın arkasındaki bir adamdan satın aldım. Çalıntı olduğunu bilmiyordum.”",
    "defendant": {
      "name": "Tobias Hale",
      "age": 19,
      "occupation": "Bisiklet Çırağı",
      "look": {
        "skin": "#c98e63",
        "shade": "#a46f4c",
        "hair": "#5b3520",
        "hairDark": "#3d2113",
        "outfit": "#4e6440",
        "outfitDark": "#35462c",
        "shirt": "#e4d6b8",
        "accent": "#b98b46",
        "hairStyle": "messy",
        "accessory": "none",
        "build": "slim"
      }
    },
    "witness": {
      "name": "Abe Coleman",
      "role": "Bisiklet Dükkânı Sahibi",
      "look": {
        "skin": "#b97f5c",
        "shade": "#946044",
        "hair": "#9b958d",
        "hairDark": "#6f6a64",
        "outfit": "#5a4636",
        "outfitDark": "#3f3025",
        "shirt": "#cfc2a5",
        "accent": "#6d7a58",
        "hairStyle": "cap",
        "accessory": "beard",
        "build": "broad"
      },
      "statement": "O bisikleti kendim yaptım; zilin ezik pirinç başlığı var. Toby dün onu dükkânıma kadar getirip ne kadar ödeyeceğimi sordu. Nereden aldığını sorunca kaçtı."
    },
    "evidence": {
      "title": "Rehinci Satış Senedi",
      "subtitle": "Bell & Sons Rehinci'den ele geçirildi",
      "icon": "receipt",
      "exhibit": "A",
      "detail": "Rehinciden ele geçirilen imzalı bir satış senedi. Bisikletin seri numarası çalınan bisikletin seri numarasıyla eşleşiyor; satıcının imzası “T. Hale” olarak okunuyor. Bisikletin kendisi dükkânın arka odasında bulundu."
    },
    "truth": "guilty",
    "sentence": "fine",
    "explanation": "Seri numarası, imza ve Bay Coleman’ın teşhisi, çalınan bisikletin Hale’in elinde olduğunu kanıtlıyor. Bisiklet bulundu, kimse zarar görmedi ve bu ilk suç; adil ceza para cezasıdır."
  },
  {
    "id": 2,
    "docket": "117-C",
    "title": "Kayıp Yardım Fonu",
    "charge": "Zimmet · 4.200 $",
    "summary": "Kış yardım fonunda 4.200 dolar eksik. Kasaya dokunulmamış; yalnızca defter değiştirilmiş, ardından ofisteki sobada kısmen yakılmış.",
    "claim": "“O defteri bizzat ben dengeledim. Kayıp para bir kayıt hatasıydı.”",
    "defendant": {
      "name": "Margaret Vale",
      "age": 47,
      "occupation": "Yardım Fonu Saymanı",
      "look": {
        "skin": "#d6a377",
        "shade": "#b07f58",
        "hair": "#704230",
        "hairDark": "#4b291d",
        "outfit": "#3c4a63",
        "outfitDark": "#283348",
        "shirt": "#e7ddc9",
        "accent": "#c8a55a",
        "hairStyle": "bun",
        "accessory": "glasses",
        "build": "regular"
      }
    },
    "witness": {
      "name": "Priya Nand",
      "role": "Yardım Fonu Asistanı",
      "look": {
        "skin": "#a96f4c",
        "shade": "#855437",
        "hair": "#211713",
        "hairDark": "#120c0a",
        "outfit": "#6c4d5d",
        "outfitDark": "#4c3441",
        "shirt": "#d8c7ae",
        "accent": "#b08a4f",
        "hairStyle": "bun",
        "accessory": "none",
        "build": "slim"
      },
      "statement": "Şemsiyemi almak için geri döndüm ve duman kokusu aldım. Margaret sobaya sayfa sayfa kâğıt atıyordu. Ne yaptığını sorduğumda bana kendi işime bakmamı söyledi."
    },
    "evidence": {
      "title": "Yanmış Defter Sayfası",
      "subtitle": "Ofisteki sobada bulundu",
      "icon": "ledger",
      "exhibit": "B",
      "detail": "Sobada bulunan yarı yanmış bir sayfa. “Vale Danışmanlık” hesabına yapılan ve toplamı 4.200 doları bulan dört transferi kaydediyor. Hesap, para kaybolmadan on bir gün önce sanığın adına açılmış."
    },
    "truth": "guilty",
    "sentence": "year1",
    "explanation": "Transferler ve defteri yok etme girişimi kayıt hatası değil. Yardım fonundan 4.200 dolar aldı ve kanıtı yakmaya çalıştı. Yönergelere göre bu büyüklükteki dolandırıcılığın cezası bir yıldır."
  },
  {
    "id": 3,
    "docket": "121-A",
    "title": "Tezgâhtaki Ekmek",
    "charge": "Hırsızlık · 200 $",
    "summary": "Bir fırının kasasında, bir müşteriyle yaşanan tartışmanın ardından 200 dolar eksik çıkar. Fırıncı, sanığın bir somun ekmekle parayı kapıp kaçtığını söylüyor.",
    "claim": "“Ekmeğimin parasını ödedim. Bozuklukları tezgâha koyup çıktım. Hepsi bu.”",
    "defendant": {
      "name": "Samuel Reed",
      "age": 38,
      "occupation": "Liman İşçisi",
      "look": {
        "skin": "#7a4b32",
        "shade": "#5d3724",
        "hair": "#1b1210",
        "hairDark": "#0e0908",
        "outfit": "#4a4f41",
        "outfitDark": "#33372d",
        "shirt": "#b8ab8e",
        "accent": "#8a5c36",
        "hairStyle": "beanie",
        "accessory": "beard",
        "build": "broad"
      }
    },
    "witness": {
      "name": "Hattie Boone",
      "role": "Fırın Sahibi",
      "look": {
        "skin": "#c8946f",
        "shade": "#a27050",
        "hair": "#b9b3a8",
        "hairDark": "#8a857c",
        "outfit": "#7c5b45",
        "outfitDark": "#59402f",
        "shirt": "#e3d9c4",
        "accent": "#9d4b42",
        "hairStyle": "bun",
        "accessory": "none",
        "build": "regular"
      },
      "statement": "Hiç parası yoktu; ceplerini karıştırdığını gördüm. Sonra bir somun kaptı ve fırlayıp gitti. Kasaya ulaştığımda çekmece açıktı ve para yoktu."
    },
    "evidence": {
      "title": "İyileştirilmiş Kamera Karesi",
      "subtitle": "Fırın güvenlik kamerası · 18.12",
      "icon": "photo",
      "exhibit": "C",
      "detail": "Fırın kamerasından saat damgalı bir kare. Sanığın banknotları ve bozuklukları tezgâha koyduğunu, kasa çekmecesinin ise kapalı kaldığını gösteriyor. Para eksikliği, sanık ayrıldıktan dokuz dakika sonra, 18.21’de kayda geçmiş."
    },
    "truth": "innocent",
    "sentence": null,
    "explanation": "Kamera, Reed’in ödeme yaptığını ve ayrıldığında çekmecenin hâlâ kapalı olduğunu kanıtlıyor. Kasa dokuz dakika sonra, başka müşteriler tezgâha yaklaştıktan sonra eksik çıkmış. Fırıncı kötü niyetli değil, sadece yanılmış. Sanık beraat eder."
  },
  {
    "id": 4,
    "docket": "126-D",
    "title": "Şapel Duvarı",
    "charge": "Vandalizm · 1.800 $",
    "summary": "Tarihî bir şapelin duvarı gece boyunca göz alıcı bir duvar resmiyle boyanmış. Restorasyon uzmanları hasarı 1.800 dolar olarak hesaplıyor; bu, basit bir temizliğin çok ötesinde.",
    "claim": "“Geçimimi duvar boyayarak kazanıyorum ama o şapele dokunmadım. Birileri imzamı taklit etmiş olmalı.”",
    "defendant": {
      "name": "Ines Marlow",
      "age": 22,
      "occupation": "Duvar Ressamı",
      "look": {
        "skin": "#b9845d",
        "shade": "#966344",
        "hair": "#2c2b33",
        "hairDark": "#18171d",
        "outfit": "#4b6470",
        "outfitDark": "#33464f",
        "shirt": "#d9c9a8",
        "accent": "#a34b3f",
        "hairStyle": "long",
        "accessory": "none",
        "build": "slim"
      }
    },
    "witness": {
      "name": "Father Michael Doyle",
      "role": "Şapel Bekçisi",
      "look": {
        "skin": "#c9a082",
        "shade": "#a17c60",
        "hair": "#d5cfc2",
        "hairDark": "#a49e92",
        "outfit": "#26232a",
        "outfitDark": "#19171c",
        "shirt": "#d9d3c5",
        "accent": "#b8a46c",
        "hairStyle": "bald",
        "accessory": "none",
        "build": "slim"
      },
      "statement": "Onu sabah altıda, elleri kırmızı boyayla kaplı ve ayaklarının dibinde bir sprey kutusu varken buldum. Duvardaki iz de aynı. Buna “kamusal sanat” dedi."
    },
    "evidence": {
      "title": "Sprey Kutusu ve Yeni İmza",
      "subtitle": "Olay yerinde bulundu",
      "icon": "spray",
      "exhibit": "D",
      "detail": "Olay yerinde bulunan kırmızı bir sprey kutusu. Memesi duvardaki boyayla uyuşuyor ve kutunun üzerinde sanığın atölyesine ait envanter etiketi var. İmza, Marlow’un imzasını taşıyan on bir önceki eserle eşleşiyor."
    },
    "truth": "guilty",
    "sentence": "year1",
    "explanation": "Atölye etiketi, uyuşan meme, imza ve şafak vakti orada bulunması tesadüf değil. Hasar 500 doları aşıyor ve hiç pişmanlık göstermedi. Adil ceza bir yıldır."
  },
  {
    "id": 5,
    "docket": "130-F",
    "title": "Depo Yangını",
    "charge": "Kundakçılık · Hayatı Tehlikeye Sokma",
    "summary": "Nehir kıyısındaki bir depo saat 02.00’de temellerine kadar yanıyor. Üstteki dairelerde yaşayan dört kişi canlarını kurtarıyor ama her şeylerini kaybediyor.",
    "claim": "“Doğu rıhtımında tur atıyordum ki dumanı gördüm. Haber vermek için koştum.”",
    "defendant": {
      "name": "Viktor Soren",
      "age": 34,
      "occupation": "Gece Bekçisi",
      "look": {
        "skin": "#c5a189",
        "shade": "#a17f68",
        "hair": "#6d6c66",
        "hairDark": "#484743",
        "outfit": "#33404f",
        "outfitDark": "#222c37",
        "shirt": "#9aa3a8",
        "accent": "#b49a52",
        "hairStyle": "buzz",
        "accessory": "mustache",
        "build": "broad"
      }
    },
    "witness": {
      "name": "Dora Finch",
      "role": "Komşu · Üçüncü Kat",
      "look": {
        "skin": "#d3ab8d",
        "shade": "#af876b",
        "hair": "#a06a42",
        "hairDark": "#74492c",
        "outfit": "#6d5364",
        "outfitDark": "#4d3947",
        "shirt": "#d8ccb6",
        "accent": "#a4824b",
        "hairStyle": "curly",
        "accessory": "glasses",
        "build": "regular"
      },
      "statement": "Uyuyamıyordum, pencerenin önündeydim. Viktor’un yükleme kapısı boyunca bir kutudan bir şey döktüğünü, sonra bir kibrit çaktığını gördüm. Yangın büyümeden kaçtı."
    },
    "evidence": {
      "title": "Yangın Müfettişi Raporu",
      "subtitle": "Olay yeri incelemesi · 02.40",
      "icon": "fire",
      "exhibit": "E",
      "detail": "Yükleme kapısında, endüstriyel çözücüyle hızlandırılmış iki ayrı tutuşma noktası. İkinci noktada sanığın erimiş güvenlik kartı bulundu. Sanık kartı iki gün önce kaybettiğini söylüyor."
    },
    "truth": "guilty",
    "sentence": "year10",
    "explanation": "İki ayrı tutuşma noktası kaza ihtimalini ortadan kaldırıyor. Bayan Finch hızlandırıcıyı döktüğünü gördü ve güvenlik kartı yangının tam merkezindeydi. Dört kişi yataklarında neredeyse hayatını kaybediyordu. Bu kadar canı tehlikeye atan bir suça ancak on yıl cevap verir."
  },
  {
    "id": 6,
    "docket": "134-B",
    "title": "Kayıp Kolye",
    "charge": "Büyük Hırsızlık · 12.000 $",
    "summary": "Bir otel süitinden elmas bir kolye kaybolur. Konuk, duş alırken odaya giren tek kişinin hizmetçi olduğunda ısrar eder.",
    "claim": "“Odayı temizleyip çıktım. Mücevher kutusunu hiç açmadım. Bir konuğun eşyasını asla çalmam.”",
    "defendant": {
      "name": "Lila Moreau",
      "age": 29,
      "occupation": "Otel Kat Görevlisi",
      "look": {
        "skin": "#8f5b3d",
        "shade": "#6f442d",
        "hair": "#231713",
        "hairDark": "#120c0a",
        "outfit": "#6c3d3f",
        "outfitDark": "#4d2b2d",
        "shirt": "#d5c9b2",
        "accent": "#b8914e",
        "hairStyle": "bun",
        "accessory": "earrings",
        "build": "regular"
      }
    },
    "witness": {
      "name": "Vivian Cross",
      "role": "Otel Konuğu",
      "look": {
        "skin": "#d9b193",
        "shade": "#b58d70",
        "hair": "#c9a15e",
        "hairDark": "#9c7944",
        "outfit": "#463f4e",
        "outfitDark": "#302b37",
        "shirt": "#ded4c4",
        "accent": "#b99c65",
        "hairStyle": "updo",
        "accessory": "earrings",
        "build": "slim"
      },
      "statement": "Duş alırken kolyeyi makyaj masasında bıraktım. Döndüğümde yoktu. Anahtarı olan tek kişi Lila’ydı. Başka kim olabilir ki?"
    },
    "evidence": {
      "title": "Sigorta Formu ve Kart Kaydı",
      "subtitle": "Otel kayıtları · 21.40",
      "icon": "key",
      "exhibit": "F",
      "detail": "Kolye, sözde hırsızlıktan üç gün önce sigortalanmış. Otelin kart kaydı, Bayan Cross’un hizmetçi işini bitirip çıktıktan sonra 21.40’ta kendi süitine yeniden girdiğini gösteriyor."
    },
    "truth": "innocent",
    "sentence": null,
    "explanation": "Konuk, hizmetçi çıktıktan sonra süite girmiş ve kolyeyi çalındığını iddia etmeden üç gün önce sigortalamış. Deliller hırsızlığa değil, sahte bir sigorta talebine işaret ediyor. Bayan Moreau beraat eder."
  },
  {
    "id": 7,
    "docket": "139-E",
    "title": "Klinikteki İnsülin",
    "charge": "İlaç Hırsızlığı",
    "summary": "Ücretsiz bir klinikten iki kutu insülin kaybolur. Bir depo görevlisi, sanığın deftere imza atmadan kutuları aldığını söyler.",
    "claim": "“İnsülini bir hasta ihtiyaç duyduğu için aldım. Evrak işlerinin sonra düzeltilebileceğini varsaydım. Kimsenin buna hırsızlık diyeceğini düşünmemiştim.”",
    "defendant": {
      "name": "Rosa Jimenez",
      "age": 41,
      "occupation": "Klinik Hemşiresi",
      "look": {
        "skin": "#b17c58",
        "shade": "#8e6042",
        "hair": "#33231c",
        "hairDark": "#1e1410",
        "outfit": "#3f6a64",
        "outfitDark": "#2b4a45",
        "shirt": "#d9d8cd",
        "accent": "#b68f4e",
        "hairStyle": "ponytail",
        "accessory": "glasses",
        "build": "regular"
      }
    },
    "witness": {
      "name": "Gerald Moss",
      "role": "Klinik Depo Görevlisi",
      "look": {
        "skin": "#cfa17e",
        "shade": "#a97c5c",
        "hair": "#8c8478",
        "hairDark": "#625c53",
        "outfit": "#55534a",
        "outfitDark": "#3b3933",
        "shirt": "#c9c0ab",
        "accent": "#71603f",
        "hairStyle": "sidepart",
        "accessory": "mustache",
        "build": "slim"
      },
      "statement": "Paltosunun altında iki kutuyla defterin yanından geçti. Katı bir teslim kuralımız var: imza yoksa ilaç yok. Aynı saat içinde bildirdim."
    },
    "evidence": {
      "title": "Acil Durum Yetkisi",
      "subtitle": "Dr. Amara Okafor imzalı",
      "icon": "vial",
      "exhibit": "G",
      "detail": "Klinik müdürü tarafından 19.15’te, eksikliğin tespit edildiği saatte imzalanmış el yazısı bir yetki belgesi. Diyabetik krizdeki bir hasta için sanığa iki kutu insülin verilmesini onaylıyor. Hastanın dosyası dozun uygulandığını doğruluyor."
    },
    "truth": "innocent",
    "sentence": null,
    "explanation": "Rosa evrak kuralını çiğnedi, kanunu değil. Klinik müdürünün kendisi ilacın verilmesine yetki vermiş ve kayıtlar krizdeki bir hastanın dozu aldığını gösteriyor. Sanık beraat eder."
  },
  {
    "id": 8,
    "docket": "143-C",
    "title": "Sahte Banknotlar",
    "charge": "Kalpazanlık · 80.000 $",
    "summary": "Şehirde sahte yüz dolarlık banknotlar ortaya çıkıyor. Alışılmadık derecede kaliteliler; yerel bir matbaacının yasal işleriyle aynı baskı makinesinde basılmışlar.",
    "claim": "“Düğün davetiyeleri ve kartvizitler basıyorum. Şehrin yarısı matbaa makinelerimi kiralıyor. Hayatımda bir dolar bile basmadım.”",
    "defendant": {
      "name": "Desmond Pike",
      "age": 52,
      "occupation": "Ticari Matbaacı",
      "look": {
        "skin": "#c99b7c",
        "shade": "#a67a5e",
        "hair": "#7b6756",
        "hairDark": "#544538",
        "outfit": "#5c4a37",
        "outfitDark": "#403226",
        "shirt": "#d6c7ac",
        "accent": "#91463f",
        "hairStyle": "sidepart",
        "accessory": "bowtie",
        "build": "broad"
      }
    },
    "witness": {
      "name": "June Park",
      "role": "Banka Gişe Memuru",
      "look": {
        "skin": "#d0a17d",
        "shade": "#aa7e5d",
        "hair": "#1f1915",
        "hairDark": "#100c0a",
        "outfit": "#384a5d",
        "outfitDark": "#263442",
        "shirt": "#ded4be",
        "accent": "#a98548",
        "hairStyle": "bun",
        "accessory": "glasses",
        "build": "slim"
      },
      "statement": "Üç banknotun seri numarası aynıydı. O mürekkebi daha önce görmüştüm; yeşil bir lekesi vardı. Matbaacı bizim müşterimiz ve durumu bildirdiğimde öfkelendi."
    },
    "evidence": {
      "title": "El Konulan Baskı Kalıpları",
      "subtitle": "Kilitli depo · doğrulandı",
      "icon": "plates",
      "exhibit": "H",
      "detail": "Kilitli bir depoda bulunan 100 dolarlık banknot kalıpları. Depo kirası sanığın şirket hesabından ödeniyor. Kalıplardaki mürekkep kalıntısı, atölyesindeki bir tamburla eşleşiyor. Kalıpların yanında 80.000 dolar değerinde basılmış banknot ele geçirildi."
    },
    "truth": "guilty",
    "sentence": "year10",
    "explanation": "Kalıplar, kira, mürekkep ve basılmış banknotlar Pike’ın atölyesini tüm operasyona bağlıyor. 80.000 dolar, para cezasının ya da tek yılın çok ötesinde. Yönergeler on yıl ceza gerektiriyor."
  },
  {
    "id": 9,
    "docket": "147-A",
    "title": "Kırık Cam",
    "charge": "Vandalizm · 600 $",
    "summary": "Saat 17.10’da bir beyzbol topu komşunun camını kırıyor. Emekli bir bekçi kırmızı ceketli birinin koşarak uzaklaştığını görmüş ve sanığı teşhis etmiş.",
    "claim": "“17.30’a kadar cezalıydım. Antrenöre karşılık verdiğimiz için bize tur attırdı. O sokağın yakınında bile değildim.”",
    "defendant": {
      "name": "Caleb Moss",
      "age": 16,
      "occupation": "Öğrenci",
      "look": {
        "skin": "#8b5a3c",
        "shade": "#6b422b",
        "hair": "#241916",
        "hairDark": "#120c0a",
        "outfit": "#8a3834",
        "outfitDark": "#662724",
        "shirt": "#d8ccb5",
        "accent": "#b38f4d",
        "hairStyle": "curly",
        "accessory": "none",
        "build": "slim"
      }
    },
    "witness": {
      "name": "Harold Finch",
      "role": "Emekli Bekçi",
      "look": {
        "skin": "#c7a084",
        "shade": "#a17d62",
        "hair": "#beb7a9",
        "hairDark": "#8d877c",
        "outfit": "#4e4a3d",
        "outfitDark": "#363328",
        "shirt": "#cfc6b2",
        "accent": "#6d6046",
        "hairStyle": "cap",
        "accessory": "glasses",
        "build": "slim"
      },
      "statement": "Kırmızı kapüşonlu bir çocuk tam lambamın altından koştu. Caleb’i tanırım; o ceketi her gün giyer. Bağırmaya fırsat bulamadan gözden kayboldu."
    },
    "evidence": {
      "title": "Beyzbol Topu ve Ceza Tutanağı",
      "subtitle": "Olay yerinden toplandı",
      "icon": "baseball",
      "exhibit": "I",
      "detail": "Kırılan odadan çıkarılan beyzbol topunun üzerinde keçeli kalemle “J. Park” yazıyor. Bir okul ceza tutanağı, sanığın cam kırıldıktan yirmi dakika sonrasına, 17.30’a kadar spor salonunda olduğunu doğruluyor."
    },
    "truth": "innocent",
    "sentence": null,
    "explanation": "Caleb’in cezalılık belgesi, cam kırıldığı sırada onu şehrin öbür ucunda gösteriyor; top ise başka bir öğrenciye ait. Kırmızı bir ceket yanlış çocuğu suçlamaya yetmiş. Sanık beraat eder."
  },
  {
    "id": 10,
    "docket": "151-S",
    "title": "Gala Zarfı",
    "charge": "Rüşvet Kabulü · 50.000 $",
    "summary": "Bir belediye meclis üyesi, bir yardım galasında müteahhitten 50.000 dolar nakit aldığı iddiasıyla suçlanıyor. Bir gazeteci, takası odanın öbür ucundan gördüğünü söylüyor.",
    "claim": "“Elime bir zarf sıkıştırdı. Bağış çeki olduğunu varsaydım. Tatlıdan önce kampanya saymanıma verdim.”",
    "defendant": {
      "name": "Ada Sterling",
      "age": 44,
      "occupation": "Belediye Meclis Üyesi",
      "look": {
        "skin": "#70452f",
        "shade": "#553322",
        "hair": "#29211e",
        "hairDark": "#161110",
        "outfit": "#393947",
        "outfitDark": "#252531",
        "shirt": "#e0d6c3",
        "accent": "#c5a052",
        "hairStyle": "updo",
        "accessory": "brooch",
        "build": "regular"
      }
    },
    "witness": {
      "name": "Nadia Voss",
      "role": "Araştırmacı Gazeteci",
      "look": {
        "skin": "#d3a987",
        "shade": "#ad8564",
        "hair": "#2b1d18",
        "hairDark": "#170f0c",
        "outfit": "#4f4b40",
        "outfitDark": "#35322a",
        "shirt": "#cec5b2",
        "accent": "#8c3f39",
        "hairStyle": "long",
        "accessory": "none",
        "build": "slim"
      },
      "statement": "Meclis üyesi Sterling’in Hollis Grey’den kalın bir zarf alıp çantasına kaydırdığını gördüm. Grey, komitesinin önünde görüşülecek bir imar değişikliği talebi olan müteahhit."
    },
    "evidence": {
      "title": "Denetim ve Ses Kaydı",
      "subtitle": "Seçim kuruluna sunuldu",
      "icon": "envelope",
      "exhibit": "J",
      "detail": "Zarfın içinde, her biri seçim kuruluna bildirilmiş beş kampanya bağış çeki vardı. Grey aslında gizli bir etik soruşturmacısıydı; kaydı, Sterling’in nakdi reddedip yerine yazılı bir bağış istediğini gösteriyor. “Rüşvet” hiç var olmamış."
    },
    "truth": "innocent",
    "sentence": null,
    "explanation": "Ses kaydı, denetim ve bildirilmiş çeklerin hepsi suçlamayla çelişiyor. Meclis üyesi Sterling nakdi reddetmiş ve kampanya finansmanı yasalarına uymuş. Sanık beraat eder."
  }
];
