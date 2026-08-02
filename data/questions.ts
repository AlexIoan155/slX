import type { AnswerOption, DomainScoreKey, Question, RiskKey } from "@/types/domain";

/**
 * Helper for the very common "Da / Nu" question shape.
 * `badAnswer` marks which of the two options is the risky one; that option
 * receives the full `effects`, while the safer option receives a mirrored,
 * smaller protective effect. This keeps every question file free of
 * duplicated boilerplate while still allowing different weights per risk.
 */
function yn(
  id: string,
  categoryId: string,
  text: string,
  badAnswer: "da" | "nu",
  effects: Partial<Record<RiskKey, number>>,
  opts: {
    helpText?: string;
    domainEffects?: Partial<Record<DomainScoreKey, number>>;
    triggers?: string[];
  } = {}
): Question {
  const protective: Partial<Record<RiskKey, number>> = {};
  (Object.keys(effects) as RiskKey[]).forEach((k) => {
    protective[k] = -Math.round((effects[k] ?? 0) * 0.4);
  });

  const domainBad = opts.domainEffects ?? {};
  const domainGood: Partial<Record<DomainScoreKey, number>> = {};
  (Object.keys(domainBad) as DomainScoreKey[]).forEach((k) => {
    domainGood[k] = Math.round(Math.abs(domainBad[k] ?? 0) * 0.5);
  });

  const da: AnswerOption =
    badAnswer === "da"
      ? { value: "da", label: "Da", effects, domainEffects: domainBad, triggers: opts.triggers }
      : { value: "da", label: "Da", effects: protective, domainEffects: domainGood };
  const nu: AnswerOption =
    badAnswer === "nu"
      ? { value: "nu", label: "Nu", effects, domainEffects: domainBad, triggers: opts.triggers }
      : { value: "nu", label: "Nu", effects: protective, domainEffects: domainGood };

  return { id, categoryId, text, helpText: opts.helpText, options: [da, nu] };
}

export const QUESTIONS: Question[] = [
  // ---------- Incendiu & Coș de fum ----------
  yn("fire-01", "incendiu", "Ai cel puțin un detector de fum funcțional instalat?", "nu",
    { fire: 32 }, { domainEffects: { safety: -18 }, triggers: ["detector-fum"] }),
  yn("fire-02", "incendiu", "Ai un stingător de incendiu accesibil în locuință?", "nu",
    { fire: 14 }, { domainEffects: { safety: -8 }, triggers: ["stingator"] }),
  yn("fire-03", "incendiu", "Coșul de fum a fost curățat în ultimele 12 luni?", "nu",
    { fire: 20 }, { domainEffects: { maintenance: -10 }, triggers: ["curatare-cos"],
    helpText: "Relevant dacă locuința are șemineu, sobă sau centrală pe combustibil solid." }),
  {
    id: "fire-04",
    categoryId: "incendiu",
    text: "Cât de des lași aragazul sau plita nesupravegheate în timpul gătitului?",
    options: [
      { value: "niciodata", label: "Niciodată", effects: { fire: -4 } },
      { value: "rar", label: "Rar", effects: { fire: 4 } },
      { value: "uneori", label: "Uneori", effects: { fire: 14 }, domainEffects: { safety: -6 } },
      { value: "des", label: "Des", effects: { fire: 26 }, domainEffects: { safety: -12 }, triggers: ["detector-fum"] },
    ],
  },

  // ---------- Electricitate ----------
  {
    id: "electric-01",
    categoryId: "electricitate",
    text: "Ce vechime are instalația electrică a locuinței?",
    options: [
      { value: "sub-10", label: "Sub 10 ani", effects: { electrical: 2 } },
      { value: "10-20", label: "10-20 ani", effects: { electrical: 14 } },
      { value: "peste-20", label: "Peste 20 de ani", effects: { electrical: 30, fire: 10 }, domainEffects: { maintenance: -10 }, triggers: ["schimbare-cablaj"] },
      { value: "necunoscut", label: "Nu știu", effects: { electrical: 18 } },
    ],
  },
  yn("electric-02", "electricitate", "Ai siguranțe automate și disjunctor diferențial (protecție la electrocutare)?", "nu",
    { electrical: 28 }, { domainEffects: { safety: -15 }, triggers: ["siguranta-diferentiala"] }),
  yn("electric-03", "electricitate", "Folosești frecvent prize multiple sau prelungitoare suprasolicitate?", "da",
    { electrical: 20, fire: 8 }, { triggers: ["verificare-electrica"] }),
  yn("electric-04", "electricitate", "Ai observat fire electrice deteriorate, prize afumate sau miros de ars?", "da",
    { electrical: 26, fire: 12 }, { domainEffects: { safety: -10 }, triggers: ["schimbare-cablaj"] }),

  // ---------- Gaz ----------
  yn("gaz-01", "gaz", "Ai detector de gaz instalat în bucătărie sau lângă centrală?", "nu",
    { fire: 30 }, { domainEffects: { safety: -15 }, triggers: ["detector-gaz"] }),
  yn("gaz-02", "gaz", "Ai simțit vreodată miros de gaz în locuință?", "da",
    { fire: 24 }, { triggers: ["verificare-gaz"] }),
  yn("gaz-03", "gaz", "Instalația de gaz a fost verificată de un autorizat ISCIR/distribuitor în ultimul an?", "nu",
    { fire: 16 }, { domainEffects: { maintenance: -10 }, triggers: ["revizie-gaz"] }),

  // ---------- Apă & Instalații ----------
  yn("apa-01", "apa-instalatii", "Conductele de apă sunt vechi (metalice, peste 20 de ani)?", "da",
    { plumbing: 26 }, { domainEffects: { maintenance: -10 }, triggers: ["schimbare-conducte"] }),
  yn("apa-02", "apa-instalatii", "Ai senzori de detectare a scurgerilor de apă (leak sensors)?", "nu",
    { plumbing: 20 }, { domainEffects: { safety: -8, smartHome: -8 }, triggers: ["senzori-apa"] }),
  yn("apa-03", "apa-instalatii", "Ai observat urme de coroziune sau scurgeri la robinete/țevi?", "da",
    { plumbing: 18 }, { triggers: ["verificare-robinete"] }),
  yn("apa-04", "apa-instalatii", "Robinetul general de apă este ușor accesibil în caz de urgență?", "nu",
    { plumbing: 12 }, { domainEffects: { safety: -6 } }),

  // ---------- Inundații ----------
  {
    id: "flood-01",
    categoryId: "inundatii",
    text: "Locuința se află într-o zonă cunoscută cu risc de inundații?",
    options: [
      { value: "nu", label: "Nu", effects: { flood: -6 } },
      { value: "nu-stiu", label: "Nu știu", effects: { flood: 10 } },
      { value: "da", label: "Da", effects: { flood: 32 }, domainEffects: { safety: -10 }, triggers: ["pompa-drenaj"] },
    ],
  },
  yn("flood-02", "inundatii", "Locuința are subsol sau parterul este situat sub nivelul străzii?", "da",
    { flood: 22 }, {}),
  yn("flood-03", "inundatii", "Ai sistem de drenaj sau pompă de sentină pentru subsol?", "nu",
    { flood: 16 }, { triggers: ["pompa-drenaj"] }),

  // ---------- Umiditate & Mucegai ----------
  yn("mold-01", "umiditate-mucegai", "Ai observat pete de igrasie pe pereți sau tavan?", "da",
    { mold: 30 }, { domainEffects: { maintenance: -10 }, triggers: ["tratament-igrasie"] }),
  yn("mold-02", "umiditate-mucegai", "Baia și bucătăria au ventilație funcțională (naturală sau mecanică)?", "nu",
    { mold: 22 }, { domainEffects: { maintenance: -8 }, triggers: ["ventilatie"] }),
  yn("mold-03", "umiditate-mucegai", "Ai simțit vreodată miros persistent de mucegai?", "da",
    { mold: 24 }, {}),
  yn("mold-04", "umiditate-mucegai", "Geamurile fac condens frecvent, mai ales iarna?", "da",
    { mold: 16 }, { triggers: ["dezumidificator"] }),

  // ---------- Structură & Acoperiș ----------
  yn("struct-01", "structura-acoperis", "Ai observat fisuri vizibile în pereții structurali sau fundație?", "da",
    { accidents: 20 }, { domainEffects: { safety: -12 }, triggers: ["expertiza-structura"] }),
  {
    id: "struct-02",
    categoryId: "structura-acoperis",
    text: "Ce vechime are acoperișul locuinței?",
    options: [
      { value: "sub-10", label: "Sub 10 ani", effects: { flood: 0, mold: 0 } },
      { value: "10-20", label: "10-20 ani", effects: { flood: 6, mold: 4 } },
      { value: "20-30", label: "20-30 ani", effects: { flood: 14, mold: 10 }, domainEffects: { maintenance: -6 } },
      { value: "peste-30", label: "Peste 30 de ani", effects: { flood: 24, mold: 16 }, domainEffects: { maintenance: -12 }, triggers: ["reparatie-acoperis"] },
    ],
  },
  yn("struct-03", "structura-acoperis", "Există infiltrații de apă vizibile provenind de la acoperiș?", "da",
    { mold: 20, flood: 10 }, { triggers: ["reparatie-acoperis"] }),
  {
    id: "struct-04",
    categoryId: "structura-acoperis",
    text: "Când a fost făcută ultima expertiză structurală a clădirii?",
    options: [
      { value: "sub-5", label: "Acum mai puțin de 5 ani", effects: { accidents: -4 } },
      { value: "5-10", label: "Acum 5-10 ani", effects: { accidents: 6 } },
      { value: "peste-10", label: "Acum peste 10 ani", effects: { accidents: 14 } },
      { value: "niciodata", label: "Niciodată", effects: { accidents: 22 }, triggers: ["expertiza-structura"] },
    ],
  },

  // ---------- Încălzire & Centrală ----------
  {
    id: "heat-01",
    categoryId: "incalzire-centrala",
    text: "Ce vechime are centrala termică sau sistemul de încălzire?",
    options: [
      { value: "sub-5", label: "Sub 5 ani", effects: { fire: 2 } },
      { value: "5-10", label: "5-10 ani", effects: { fire: 8 } },
      { value: "10-15", label: "10-15 ani", effects: { fire: 16 }, domainEffects: { maintenance: -6 } },
      { value: "peste-15", label: "Peste 15 ani", effects: { fire: 26 }, domainEffects: { maintenance: -12 }, triggers: ["revizie-centrala"] },
    ],
  },
  yn("heat-02", "incalzire-centrala", "Centrala/sistemul de încălzire a avut revizie tehnică anuală?", "nu",
    { fire: 20 }, { domainEffects: { maintenance: -15 }, triggers: ["revizie-centrala"] }),
  yn("heat-03", "incalzire-centrala", "Ai detector de monoxid de carbon instalat?", "nu",
    { accidents: 32 }, { domainEffects: { safety: -20 }, triggers: ["detector-co"] }),
  yn("heat-04", "incalzire-centrala", "Radiatoarele sau țevile de încălzire prezintă scurgeri sau coroziune?", "da",
    { plumbing: 10, fire: 6 }, {}),

  // ---------- Securitate, Camere & Alarmă ----------
  yn("sec-01", "securitate-alarma", "Ai un sistem de alarmă instalat și activ?", "nu",
    { theft: 30 }, { domainEffects: { safety: -15 }, triggers: ["sistem-alarma"] }),
  yn("sec-02", "securitate-alarma", "Ai camere de supraveghere la exterior sau intrare?", "nu",
    { theft: 20 }, { domainEffects: { smartHome: -8 }, triggers: ["camere-supraveghere"] }),
  yn("sec-03", "securitate-alarma", "Ușa de acces principală este blindată sau securizată?", "nu",
    { theft: 18 }, {}),
  yn("sec-04", "securitate-alarma", "Ai iluminat exterior automat pe timp de noapte?", "nu",
    { theft: 12 }, { triggers: ["iluminat-exterior"] }),

  // ---------- Ferestre & Uși ----------
  yn("win-01", "ferestre-usi", "Ferestrele locuinței sunt termopan, în stare bună?", "nu",
    { mold: 10, theft: 8 }, { domainEffects: { maintenance: -6 } }),
  yn("win-02", "ferestre-usi", "Ferestrele și ușile au sisteme de închidere multipunct?", "nu",
    { theft: 16 }, {}),
  yn("win-03", "ferestre-usi", "Garniturile ferestrelor sunt uzate sau lasă curent de aer?", "da",
    { mold: 10 }, { domainEffects: { maintenance: -6 } }),

  // ---------- Smart Home & Internet ----------
  yn("smart-01", "smart-home-internet", "Ai senzori smart de fum, gaz sau apă conectați la telefon?", "nu",
    { fire: 6, plumbing: 6 }, { domainEffects: { smartHome: -22, safety: -6 } }),
  yn("smart-02", "smart-home-internet", "Rețeaua Wi-Fi este securizată cu parolă puternică și criptare actualizată?", "nu",
    { theft: 6 }, { domainEffects: { smartHome: -18 } }),
  yn("smart-03", "smart-home-internet", "Primești notificări/alerte automate pentru evenimente neobișnuite din locuință?", "nu",
    {}, { domainEffects: { smartHome: -18 } }),

  // ---------- Copii, Persoane vârstnice & Animale ----------
  {
    id: "loc-01",
    categoryId: "locatari",
    text: "Locuiesc în casă copii sub 10 ani?",
    options: [
      { value: "nu", label: "Nu", effects: {} },
      { value: "da", label: "Da", effects: { accidents: 14 } },
    ],
  },
  {
    id: "loc-02",
    categoryId: "locatari",
    text: "Locuiesc în casă persoane de peste 65 de ani?",
    options: [
      { value: "nu", label: "Nu", effects: {} },
      { value: "da", label: "Da", effects: { accidents: 12 } },
    ],
  },
  {
    id: "loc-03",
    categoryId: "locatari",
    text: "Ai animale de companie în locuință?",
    options: [
      { value: "nu", label: "Nu", effects: {} },
      { value: "da", label: "Da", effects: { fire: 3, accidents: 3 } },
    ],
  },
  yn("loc-04", "locatari", "Prizele și colțurile mobilierului sunt protejate pentru copii mici?", "nu",
    { accidents: 16 }, { triggers: ["protectii-copii"] }),

  // ---------- Mediu & Vecinătate ----------
  {
    id: "env-01",
    categoryId: "mediu-vecinatate",
    text: "Cum ai descrie riscul seismic al zonei în care se află locuința?",
    options: [
      { value: "scazut", label: "Scăzut", effects: { accidents: 2 } },
      { value: "moderat", label: "Moderat", effects: { accidents: 10 } },
      { value: "ridicat", label: "Ridicat", effects: { accidents: 22 }, triggers: ["expertiza-structura"] },
      { value: "nu-stiu", label: "Nu știu", effects: { accidents: 10 } },
    ],
  },
  yn("env-02", "mediu-vecinatate", "Au existat incidente de furt raportate recent în vecinătate?", "da",
    { theft: 20 }, { triggers: ["sistem-alarma"] }),
  yn("env-03", "mediu-vecinatate", "Locuința este aproape de vegetație uscată sau zone împădurite predispuse la incendii?", "da",
    { fire: 15 }, {}),

  // ---------- Asigurare ----------
  yn("ins-01", "asigurare", "Locuința este asigurată printr-o poliță în vigoare?", "nu",
    {}, { domainEffects: { safety: -10 }, triggers: ["asigurare-locuinta"] }),
  yn("ins-02", "asigurare", "Polița acoperă și riscurile naturale (cutremur, inundație, alunecări de teren)?", "nu",
    {}, { domainEffects: { safety: -6 }, triggers: ["asigurare-completa"] }),
  {
    id: "ins-03",
    categoryId: "asigurare",
    text: "Când a fost reevaluată ultima dată polița de asigurare?",
    options: [
      { value: "sub-1", label: "Acum mai puțin de 1 an", effects: {} },
      { value: "1-3", label: "Acum 1-3 ani", effects: {}, domainEffects: { maintenance: -4 } },
      { value: "peste-3", label: "Acum peste 3 ani", effects: {}, domainEffects: { maintenance: -8 } },
      { value: "niciodata", label: "Niciodată", effects: {}, domainEffects: { maintenance: -12 }, triggers: ["asigurare-completa"] },
    ],
  },

  // ---------- Întreținere generală ----------
  yn("maint-01", "intretinere", "Faci o revizie generală anuală a locuinței (electrică, sanitară, structurală)?", "nu",
    {}, { domainEffects: { maintenance: -20 }, triggers: ["revizie-anuala"] }),
  yn("maint-02", "intretinere", "Ai în prezent reparații cunoscute, dar amânate?", "da",
    {}, { domainEffects: { maintenance: -16 }, triggers: ["plan-reparatii"] }),
  yn("maint-03", "intretinere", "Jgheaburile și burlanele sunt curățate periodic?", "nu",
    { flood: 10 }, { domainEffects: { maintenance: -10 }, triggers: ["curatare-jgheaburi"] }),
  yn("maint-04", "intretinere", "Ai un buget anual alocat pentru mentenanța locuinței?", "nu",
    {}, { domainEffects: { maintenance: -10 } }),
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
