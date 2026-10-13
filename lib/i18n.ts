export type Lang = "sv" | "en";

export type Pizza = {
  id: string;
  name: string;
  price: number;
  kind: "rossa" | "bianca" | "vegan";
  img: string;
  desc: { sv: string; en: string };
  tag?: { sv: string; en: string };
};

export const pizzas: Pizza[] = [
  {
    id: "margherita", name: "Margherita", price: 139, kind: "rossa", img: "/img/p-margherita.webp",
    desc: { sv: "San Marzano DOP, fior di latte, basilika, olivolja från Puglia.", en: "San Marzano DOP, fior di latte, basil, Apulian olive oil." },
    tag: { sv: "Själens pizza", en: "The soul's pizza" },
  },
  {
    id: "diavola", name: "Diavola", price: 159, kind: "rossa", img: "/img/p-diavola.webp",
    desc: { sv: "Salame piccante, fior di latte, chiliolja och en tråd hot honey.", en: "Salame piccante, fior di latte, chili oil and a drizzle of hot honey." },
    tag: { sv: "Het", en: "Hot" },
  },
  {
    id: "pomodorini", name: "Bufala & Pomodorini", price: 169, kind: "rossa", img: "/img/p-pomodorini.webp",
    desc: { sv: "Mozzarella di bufala, söta körsbärstomater, basilika, flingsalt.", en: "Mozzarella di bufala, sweet cherry tomatoes, basil, flaky salt." },
  },
  {
    id: "stracciatella", name: "Stracciatella", price: 179, kind: "bianca", img: "/img/p-stracciatella.webp",
    desc: { sv: "Krämig stracciatella, rucola, citronzest och rostade pinjenötter – läggs på efter ugnen.", en: "Creamy stracciatella, rocket, lemon zest and toasted pine nuts – added after the oven." },
    tag: { sv: "Signatur", en: "Signature" },
  },
  {
    id: "bianca", name: "Bianca al Fuoco", price: 165, kind: "bianca", img: "/img/p-bianca.webp",
    desc: { sv: "Fior di latte, rökt provola, rosmarin och vitlöksolja. Ingen tomat, bara eld.", en: "Fior di latte, smoked provola, rosemary and garlic oil. No tomato, just fire." },
  },
  {
    id: "salsiccia", name: "Salsiccia e Friarielli", price: 175, kind: "rossa", img: "/img/p-salsiccia.webp",
    desc: { sv: "Fänkålssalsiccia, friarielli, chili och pecorino. Neapels gatuklassiker.", en: "Fennel salsiccia, friarielli, chili and pecorino. A Naples street classic." },
  },
  {
    id: "ortolana", name: "Ortolana", price: 155, kind: "vegan", img: "/img/p-ortolana.webp",
    desc: { sv: "Grillad zucchini och aubergine, paprika, vegansk ost och basilikaolja.", en: "Grilled courgette and aubergine, peppers, vegan cheese and basil oil." },
  },
];

export const dict = {
  sv: {
    nav: { menu: "Meny", craft: "Hantverket", story: "Om oss", visit: "Hitta hit", book: "Boka bord" },
    open: "Öppet nu", closed: "Stängt just nu", opensAt: "öppnar",
    hero: {
      kicker: "Napoletana · Göteborg · Sedan 2024",
      title1: "Pizza", title2: "av själen.",
      lead: "Fyra steg. Fyrtioåtta timmar. Nittio sekunder i elden. Scrolla och se hur en pizza får sin själ.",
      cta1: "Se menyn", cta2: "Boka bord", scroll: "Scrolla",
    },
    chapters: [
      { n: "01", name: "Impasto", h: "48 timmar av tålamod.", p: "Tipo 00-mjöl, vatten, salt och tid. Degen vilar tills den andas." },
      { n: "02", name: "Pomodoro", h: "San Marzano, solmoget.", p: "Tomater från Vesuvius sluttningar, krossade för hand. Fior di latte som smälter som smör." },
      { n: "03", name: "Fuoco", h: "485 grader. 90 sekunder.", p: "Vedeldad stenugn. Kanten reser sig, får sina leopardfläckar och blir luftig som ett andetag." },
      { n: "04", name: "Anima", h: "Det här är själen.", p: "Färsk basilika och en tråd olivolja. Serverad på sekunden." },
    ],
    manifesto: "Vi gör bara en sak. Napolitansk pizza – med deg som får ta sin tid, råvaror som inte kompromissar och en eld som aldrig slocknar. Resten är själ.",
    menu: {
      kicker: "La carta", title: "Menyn", lead: "Allt bakas till beställning. Glutenfri deg finns – fråga oss.",
      kr: "kr", all: "Alla", rossa: "Rossa", bianca: "Bianca", vegan: "Vegansk", note: "Alla pizzor kan bakas på glutenfri deg (+25 kr). Fråga oss om allergier – vi lagar gärna om.",
    },
    craft: {
      kicker: "Le materie prime", title: "Sex råvaror. Inga genvägar.",
      items: [
        { name: "Deg", note: "Tipo 00 · 48 h kalljäsning" },
        { name: "Tomat", note: "San Marzano DOP" },
        { name: "Mozzarella", note: "Fior di latte, färsk varje morgon" },
        { name: "Basilika", note: "Plockad samma dag" },
        { name: "Olivolja", note: "Extra vergine från Puglia" },
        { name: "Eld", note: "Bokved · 485°" },
      ],
    },
    story: {
      kicker: "Chi siamo", title: "En ugn. En eld. En själ.",
      p1: "Vår ugn är murad för hand av ugnsbyggare från Neapel och väger tre ton. Den eldas med bokved från tidig morgon, och när golvet når 430 grader är den redo.",
      p2: "Vi tror att pizza är det ärligaste en kock kan göra: några få ingredienser och ingenstans att gömma sig. Därför låter vi degen ta den tid den behöver – och lägger själen i resten.",
      stats: [[48, "h", "jäsning"], [485, "°", "i ugnen"], [90, "s", "baktid"], [3, " ton", "sten"]] as [number, string, string][],
    },
    visit: {
      kicker: "Vieni a trovarci", title: "Hitta hit", hours: "Öppettider", today: "Idag",
      days: ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"],
      closedDay: "Stängt", address: "Adress", addressText: "Storgatan 1, 411 01 Göteborg", phone: "Telefon",
      takeaway: "Avhämtning", takeawayText: "Ring och beställ – klart på 15 minuter.",
    },
    book: {
      kicker: "Prenota", title: "Ett bord nära elden?", lead: "Vi håller några bord vid ugnen varje kväll. Boka i förväg, eller kom förbi – det finns alltid plats vid baren.",
      name: "Namn", guests: "Antal gäster", date: "Datum", time: "Tid", submit: "Skicka förfrågan",
      thanks: "Grazie! Vi bekräftar din bokning via sms inom kort.", demo: "Demo – inga uppgifter skickas.",
    },
    footer: { made: "Gjord med själ i Göteborg.", by: "Webb av SweGBG", photos: "Foton: Unsplash" },
  },
  en: {
    nav: { menu: "Menu", craft: "The craft", story: "About", visit: "Find us", book: "Book a table" },
    open: "Open now", closed: "Closed right now", opensAt: "opens",
    hero: {
      kicker: "Napoletana · Gothenburg · Since 2024",
      title1: "Pizza", title2: "of the soul.",
      lead: "Four steps. Forty-eight hours. Ninety seconds in the fire. Scroll and watch a pizza find its soul.",
      cta1: "See the menu", cta2: "Book a table", scroll: "Scroll",
    },
    chapters: [
      { n: "01", name: "Impasto", h: "48 hours of patience.", p: "Tipo 00 flour, water, salt and time. The dough rests until it breathes." },
      { n: "02", name: "Pomodoro", h: "San Marzano, sun-ripened.", p: "Tomatoes from the slopes of Vesuvius, crushed by hand. Fior di latte that melts like butter." },
      { n: "03", name: "Fuoco", h: "485 degrees. 90 seconds.", p: "A wood-fired stone oven. The crust rises, earns its leopard spots and turns light as a breath." },
      { n: "04", name: "Anima", h: "This is the soul.", p: "Fresh basil and a thread of olive oil. Served within seconds." },
    ],
    manifesto: "We do one thing. Neapolitan pizza – with dough that takes its time, ingredients that never compromise and a fire that never goes out. The rest is soul.",
    menu: {
      kicker: "La carta", title: "The menu", lead: "Everything is baked to order. Gluten-free dough available – just ask.",
      kr: "SEK", all: "All", rossa: "Rossa", bianca: "Bianca", vegan: "Vegan", note: "Every pizza can be baked on gluten-free dough (+25 SEK). Ask us about allergies – we are happy to adapt.",
    },
    craft: {
      kicker: "Le materie prime", title: "Six ingredients. No shortcuts.",
      items: [
        { name: "Dough", note: "Tipo 00 · 48 h cold proof" },
        { name: "Tomato", note: "San Marzano DOP" },
        { name: "Mozzarella", note: "Fior di latte, fresh every morning" },
        { name: "Basil", note: "Picked the same day" },
        { name: "Olive oil", note: "Extra virgin from Apulia" },
        { name: "Fire", note: "Beech wood · 485°" },
      ],
    },
    story: {
      kicker: "Chi siamo", title: "One oven. One fire. One soul.",
      p1: "Our oven was built by hand by oven makers from Naples and weighs three tonnes. It is fired with beech wood from early morning, and when the floor reaches 430 degrees it is ready.",
      p2: "We believe pizza is the most honest thing a cook can make: a few ingredients and nowhere to hide. So we give the dough the time it needs – and put our soul into the rest.",
      stats: [[48, "h", "proofing"], [485, "°", "in the oven"], [90, "s", "bake time"], [3, " t", "of stone"]] as [number, string, string][],
    },
    visit: {
      kicker: "Vieni a trovarci", title: "Find us", hours: "Opening hours", today: "Today",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      closedDay: "Closed", address: "Address", addressText: "Storgatan 1, 411 01 Gothenburg", phone: "Phone",
      takeaway: "Takeaway", takeawayText: "Call to order – ready in 15 minutes.",
    },
    book: {
      kicker: "Prenota", title: "A table by the fire?", lead: "We keep a few tables by the oven every night. Book ahead, or just drop by – there is always room at the bar.",
      name: "Name", guests: "Guests", date: "Date", time: "Time", submit: "Send request",
      thanks: "Grazie! We will confirm your booking by text shortly.", demo: "Demo – no data is sent.",
    },
    footer: { made: "Made with soul in Gothenburg.", by: "Web by SweGBG", photos: "Photos: Unsplash" },
  },
};

export type Dict = (typeof dict)["sv"];

/** Opening hours, Mon=0 … Sun=6, [open, close] in minutes, null = closed */
export const hours: ([number, number] | null)[] = [
  null,
  [16 * 60, 22 * 60],
  [16 * 60, 22 * 60],
  [16 * 60, 22 * 60],
  [16 * 60, 23 * 60],
  [12 * 60, 23 * 60],
  [12 * 60, 21 * 60],
];

export const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
