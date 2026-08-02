import type { RecommendationTemplate } from "@/types/domain";

// Every `triggers` id referenced in data/questions.ts must have a matching
// entry here. The engine looks these up and turns them into
// ActiveRecommendation objects with contextual `reasons`.
export const RECOMMENDATIONS: Record<string, RecommendationTemplate> = {
  "detector-fum": {
    id: "detector-fum",
    title: "Instalează detectoare de fum în fiecare cameră cheie",
    category: "fire",
    priority: "critica",
    estimatedCostRON: [80, 250],
    scoreImpact: 9,
    estimatedAnnualSavingsRON: 1800,
    explanation:
      "Un detector de fum funcțional reduce drastic timpul de reacție în caz de incendiu și este cea mai ieftină măsură de protecție disponibilă.",
  },
  stingator: {
    id: "stingator",
    title: "Montează un stingător de incendiu accesibil",
    category: "fire",
    priority: "medie",
    estimatedCostRON: [60, 180],
    scoreImpact: 4,
    estimatedAnnualSavingsRON: 900,
    explanation:
      "Un stingător la îndemână poate opri un incendiu incipient înainte să se extindă, limitând pagubele materiale.",
  },
  "curatare-cos": {
    id: "curatare-cos",
    title: "Programează curățarea profesională a coșului de fum",
    category: "fire",
    priority: "ridicata",
    estimatedCostRON: [150, 400],
    scoreImpact: 6,
    estimatedAnnualSavingsRON: 1200,
    explanation:
      "Depunerile de funingine dintr-un coș necurățat sunt una dintre cele mai frecvente cauze de incendiu la casele cu șemineu sau sobă.",
  },
  "siguranta-diferentiala": {
    id: "siguranta-diferentiala",
    title: "Montează disjunctor diferențial și siguranțe automate",
    category: "electrical",
    priority: "critica",
    estimatedCostRON: [300, 900],
    scoreImpact: 8,
    estimatedAnnualSavingsRON: 2200,
    explanation:
      "Protecția diferențială întrerupe automat curentul la scurgeri periculoase, prevenind electrocutări și incendii de natură electrică.",
  },
  "verificare-electrica": {
    id: "verificare-electrica",
    title: "Solicită o verificare electrică profesională",
    category: "electrical",
    priority: "ridicata",
    estimatedCostRON: [200, 600],
    scoreImpact: 6,
    estimatedAnnualSavingsRON: 1500,
    explanation:
      "Suprasolicitarea prizelor multiple este un semnal timpuriu de instalație electrică depășită de consumul actual al locuinței.",
  },
  "schimbare-cablaj": {
    id: "schimbare-cablaj",
    title: "Planifică înlocuirea cablajului electric uzat",
    category: "electrical",
    priority: "critica",
    estimatedCostRON: [3000, 9000],
    scoreImpact: 12,
    estimatedAnnualSavingsRON: 4000,
    explanation:
      "Cablajul îmbătrânit sau vizibil deteriorat crește semnificativ riscul de scurtcircuit și incendiu electric.",
  },
  "detector-gaz": {
    id: "detector-gaz",
    title: "Instalează un detector de gaz cu alarmă sonoră",
    category: "fire",
    priority: "critica",
    estimatedCostRON: [120, 350],
    scoreImpact: 9,
    estimatedAnnualSavingsRON: 2000,
    explanation:
      "Un detector de gaz semnalează scurgerile înainte de a deveni periculoase, esențial în bucătării și lângă centrale.",
  },
  "verificare-gaz": {
    id: "verificare-gaz",
    title: "Cere o verificare urgentă a instalației de gaz",
    category: "fire",
    priority: "critica",
    estimatedCostRON: [150, 450],
    scoreImpact: 10,
    estimatedAnnualSavingsRON: 2500,
    explanation:
      "Mirosul de gaz sesizat anterior indică o posibilă scurgere activă și trebuie verificat imediat de un autorizat.",
  },
  "revizie-gaz": {
    id: "revizie-gaz",
    title: "Programează revizia anuală a instalației de gaz",
    category: "fire",
    priority: "ridicata",
    estimatedCostRON: [150, 350],
    scoreImpact: 5,
    estimatedAnnualSavingsRON: 1100,
    explanation:
      "Revizia periodică depistează micro-fisuri și uzura garniturilor înainte să devină un pericol real.",
  },
  "schimbare-conducte": {
    id: "schimbare-conducte",
    title: "Planifică înlocuirea conductelor de apă vechi",
    category: "plumbing",
    priority: "ridicata",
    estimatedCostRON: [2500, 8000],
    scoreImpact: 10,
    estimatedAnnualSavingsRON: 3200,
    explanation:
      "Conductele metalice îmbătrânite corodează din interior și cresc riscul de spargere bruscă și inundare a locuinței.",
  },
  "senzori-apa": {
    id: "senzori-apa",
    title: "Instalează senzori smart de detectare a scurgerilor",
    category: "plumbing",
    priority: "medie",
    estimatedCostRON: [150, 500],
    scoreImpact: 5,
    estimatedAnnualSavingsRON: 1400,
    explanation:
      "Senzorii de apă trimit o alertă instant la telefon, oprind pagubele înainte să se extindă la vecini sau mobilier.",
  },
  "verificare-robinete": {
    id: "verificare-robinete",
    title: "Repară robinetele și țevile cu urme de coroziune",
    category: "plumbing",
    priority: "medie",
    estimatedCostRON: [150, 600],
    scoreImpact: 4,
    estimatedAnnualSavingsRON: 800,
    explanation:
      "Coroziunea vizibilă precede de regulă o spargere; o reparație timpurie e mult mai ieftină decât o inundație.",
  },
  "pompa-drenaj": {
    id: "pompa-drenaj",
    title: "Instalează o pompă de drenaj pentru subsol",
    category: "flood",
    priority: "ridicata",
    estimatedCostRON: [800, 2500],
    scoreImpact: 8,
    estimatedAnnualSavingsRON: 3500,
    explanation:
      "Într-o zonă expusă la inundații, o pompă de sentină automată limitează drastic pagubele produse de ape mari.",
  },
  "tratament-igrasie": {
    id: "tratament-igrasie",
    title: "Tratează urgent zonele cu igrasie",
    category: "mold",
    priority: "ridicata",
    estimatedCostRON: [500, 2000],
    scoreImpact: 7,
    estimatedAnnualSavingsRON: 1600,
    explanation:
      "Igrasia netratată se extinde și poate afecta structura pereților, dar și calitatea aerului din locuință.",
  },
  ventilatie: {
    id: "ventilatie",
    title: "Îmbunătățește ventilația din baie și bucătărie",
    category: "mold",
    priority: "medie",
    estimatedCostRON: [300, 1200],
    scoreImpact: 5,
    estimatedAnnualSavingsRON: 900,
    explanation:
      "O ventilație corectă elimină umezeala acumulată, principala cauză a apariției mucegaiului.",
  },
  dezumidificator: {
    id: "dezumidificator",
    title: "Folosește un dezumidificator în camerele cu condens",
    category: "mold",
    priority: "scazuta",
    estimatedCostRON: [400, 1000],
    scoreImpact: 3,
    estimatedAnnualSavingsRON: 500,
    explanation:
      "Condensul frecvent pe geamuri indică umiditate ridicată, ușor de controlat cu un dezumidificator.",
  },
  "expertiza-structura": {
    id: "expertiza-structura",
    title: "Comandă o expertiză structurală de specialitate",
    category: "accidents",
    priority: "critica",
    estimatedCostRON: [1200, 4000],
    scoreImpact: 11,
    estimatedAnnualSavingsRON: 3000,
    explanation:
      "Fisurile structurale sau lipsa unei expertize recente pot ascunde probleme grave de rezistență a clădirii.",
  },
  "reparatie-acoperis": {
    id: "reparatie-acoperis",
    title: "Repară infiltrațiile și zonele uzate ale acoperișului",
    category: "flood",
    priority: "ridicata",
    estimatedCostRON: [1500, 6000],
    scoreImpact: 8,
    estimatedAnnualSavingsRON: 2400,
    explanation:
      "Un acoperiș vechi sau cu infiltrații active este poarta principală pentru apă și mucegai în structura casei.",
  },
  "revizie-centrala": {
    id: "revizie-centrala",
    title: "Programează revizia tehnică a centralei termice",
    category: "fire",
    priority: "ridicata",
    estimatedCostRON: [200, 500],
    scoreImpact: 6,
    estimatedAnnualSavingsRON: 1300,
    explanation:
      "O centrală neverificată poate dezvolta scurgeri de gaz sau supraîncălziri care cresc riscul de incendiu.",
  },
  "detector-co": {
    id: "detector-co",
    title: "Instalează un detector de monoxid de carbon",
    category: "accidents",
    priority: "critica",
    estimatedCostRON: [100, 300],
    scoreImpact: 10,
    estimatedAnnualSavingsRON: 2600,
    explanation:
      "Monoxidul de carbon este incolor și inodor; un detector dedicat este singura protecție eficientă împotriva intoxicării.",
  },
  "sistem-alarma": {
    id: "sistem-alarma",
    title: "Instalează un sistem de alarmă monitorizat",
    category: "theft",
    priority: "ridicata",
    estimatedCostRON: [500, 2000],
    scoreImpact: 7,
    estimatedAnnualSavingsRON: 1800,
    explanation:
      "Un sistem de alarmă activ descurajează efracțiile și reduce timpul de reacție în caz de intruziune.",
  },
  "camere-supraveghere": {
    id: "camere-supraveghere",
    title: "Montează camere de supraveghere la intrări",
    category: "theft",
    priority: "medie",
    estimatedCostRON: [300, 1500],
    scoreImpact: 5,
    estimatedAnnualSavingsRON: 1000,
    explanation:
      "Camerele vizibile la intrare reduc semnificativ riscul de efracție și ajută la identificarea eventualilor intruși.",
  },
  "iluminat-exterior": {
    id: "iluminat-exterior",
    title: "Adaugă iluminat exterior cu senzor de mișcare",
    category: "theft",
    priority: "scazuta",
    estimatedCostRON: [150, 500],
    scoreImpact: 3,
    estimatedAnnualSavingsRON: 500,
    explanation:
      "Iluminatul automat pe timp de noapte este una dintre cele mai ieftine metode de descurajare a hoților.",
  },
  "protectii-copii": {
    id: "protectii-copii",
    title: "Montează protecții pentru prize și colțuri ascuțite",
    category: "accidents",
    priority: "medie",
    estimatedCostRON: [80, 250],
    scoreImpact: 4,
    estimatedAnnualSavingsRON: 600,
    explanation:
      "Protecțiile simple la prize și colțuri de mobilier previn cele mai frecvente accidente casnice ale copiilor mici.",
  },
  "asigurare-locuinta": {
    id: "asigurare-locuinta",
    title: "Încheie o poliță de asigurare pentru locuință",
    category: "general",
    priority: "ridicata",
    estimatedCostRON: [300, 900],
    scoreImpact: 6,
    estimatedAnnualSavingsRON: 5000,
    explanation:
      "Fără asigurare, orice eveniment neprevăzut (incendiu, inundație, efracție) rămâne integral în sarcina ta financiară.",
  },
  "asigurare-completa": {
    id: "asigurare-completa",
    title: "Extinde polița cu acoperire pentru riscuri naturale",
    category: "general",
    priority: "medie",
    estimatedCostRON: [150, 500],
    scoreImpact: 4,
    estimatedAnnualSavingsRON: 2500,
    explanation:
      "Multe polițe de bază exclud cutremurul sau inundația; o extensie dedicată acoperă exact riscurile locuinței tale.",
  },
  "revizie-anuala": {
    id: "revizie-anuala",
    title: "Programează o revizie generală anuală a locuinței",
    category: "general",
    priority: "medie",
    estimatedCostRON: [200, 700],
    scoreImpact: 5,
    estimatedAnnualSavingsRON: 1200,
    explanation:
      "O revizie completă anuală depistează din timp problemele mici, înainte să devină reparații costisitoare.",
  },
  "plan-reparatii": {
    id: "plan-reparatii",
    title: "Creează un plan de rezolvare pentru reparațiile amânate",
    category: "general",
    priority: "ridicata",
    estimatedCostRON: [0, 0],
    scoreImpact: 5,
    estimatedAnnualSavingsRON: 900,
    explanation:
      "Reparațiile amânate se agravează de regulă în timp; prioritizarea lor previne costuri suplimentare majore.",
  },
  "curatare-jgheaburi": {
    id: "curatare-jgheaburi",
    title: "Curăță periodic jgheaburile și burlanele",
    category: "flood",
    priority: "scazuta",
    estimatedCostRON: [100, 350],
    scoreImpact: 3,
    estimatedAnnualSavingsRON: 700,
    explanation:
      "Jgheaburile înfundate direcționează apa spre fundație, crescând riscul de infiltrații și igrasie.",
  },
};

export const getRecommendationTemplate = (id: string): RecommendationTemplate | undefined =>
  RECOMMENDATIONS[id];
