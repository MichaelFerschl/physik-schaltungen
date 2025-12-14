import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  Loader2,
  MessageCircle,
  AlertCircle,
  ClipboardList,
  CheckCircle,
  XCircle,
  BookOpen,
  Trash2,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface VoiceTutorProps {
  openaiKey: string
  onNeedApiKey: () => void
}

type Topic = 'all' | 'basics' | 'fractions' | 'ohm' | 'series' | 'parallel' | 'formulas' | 'exam'

const topicLabels: Record<Topic, string> = {
  all: 'Alle Themen',
  basics: 'Allgemeinwissen Strom',
  fractions: 'Bruchrechnung',
  ohm: 'Ohmsches Gesetz',
  series: 'Reihenschaltung',
  parallel: 'Parallelschaltung',
  formulas: 'Formeln üben',
  exam: '📋 Wissenstest',
}

const topicInstructions: Record<Topic, string> = {
  all: `Du hilfst bei allen Themen zu elektrischen Schaltungen.
Frage Simon aktiv nach seinen Schwächen oder starte mit einfachen Fragen zu:
- Ohmsches Gesetz (U = R × I, I = U/R, R = U/I)
- Reihenschaltung (Rges = R₁ + R₂, I überall gleich, Uges = U₁ + U₂)
- Parallelschaltung (1/Rges = 1/R₁ + 1/R₂, U überall gleich, Iges = I₁ + I₂)
- Kirchhoffsche Regeln (Knotenregel, Maschenregel)
- Gemischte Schaltungen`,

  fractions: `THEMA: Bruchrechnung - Alle wichtigen Grundlagen

WICHTIGE THEMEN zum Abfragen (für 8. Klasse):

1. GRUNDLAGEN - WAS IST EIN BRUCH?
- Was ist ein Bruch? (Teil von einem Ganzen, z.B. 1/2 ist die Hälfte)
- Was bedeutet der Zähler? (obere Zahl - wie viele Teile man hat)
- Was bedeutet der Nenner? (untere Zahl - in wie viele Teile das Ganze geteilt ist)
- Beispiel: 3/4 bedeutet "3 von 4 Teilen"
- Was passiert wenn Zähler und Nenner gleich sind? (= 1, das Ganze)
- Was passiert wenn der Zähler größer als der Nenner ist? (unechter Bruch, größer als 1)

2. BRÜCHE ERWEITERN UND KÜRZEN
- Was bedeutet Erweitern? (Zähler UND Nenner mit der gleichen Zahl multiplizieren)
- Beispiel Erweitern: 1/2 = 2/4 = 3/6 = 4/8 (mit 2, 3, 4 erweitert)
- Warum kann man erweitern? (Der Wert bleibt gleich! 1/2 = 2/4)
- Was bedeutet Kürzen? (Zähler UND Nenner durch die gleiche Zahl teilen)
- Beispiel Kürzen: 6/8 = 3/4 (durch 2 gekürzt)
- Was ist ein vollständig gekürzter Bruch? (wenn man nicht mehr kürzen kann)
- Wie findet man den größten gemeinsamen Teiler (ggT)? (zum Kürzen)

3. BRÜCHE VERGLEICHEN
- Wie vergleicht man Brüche mit gleichem Nenner? (größerer Zähler = größerer Bruch)
- Beispiel: 3/5 > 2/5 (gleicher Nenner, 3 > 2)
- Wie vergleicht man Brüche mit verschiedenen Nennern? (erweitern auf gemeinsamen Nenner)
- Beispiel: 1/2 vs 2/5 → 5/10 vs 4/10 → 5/10 ist größer
- Was ist ein Hauptnenner? (gemeinsames Vielfaches der Nenner)

4. BRÜCHE ADDIEREN UND SUBTRAHIEREN
- Regel: Man kann nur Brüche mit GLEICHEM Nenner addieren/subtrahieren!
- Bei gleichem Nenner: Zähler addieren/subtrahieren, Nenner bleibt gleich
- Beispiel Addition: 2/7 + 3/7 = 5/7
- Beispiel Subtraktion: 5/8 - 2/8 = 3/8
- Bei verschiedenen Nennern: ERST auf Hauptnenner erweitern, DANN rechnen
- Beispiel: 1/2 + 1/3 → 3/6 + 2/6 = 5/6
- Nach dem Rechnen: Ergebnis kürzen wenn möglich!

5. BRÜCHE MULTIPLIZIEREN
- Regel: Zähler mal Zähler, Nenner mal Nenner
- Beispiel: 2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2 (gekürzt)
- Tipp: VOR dem Multiplizieren kürzen (kreuzweise), dann wird's einfacher!
- Beispiel kreuzweise kürzen: 2/3 × 3/4 → 2 und 4 durch 2, 3 und 3 kürzen → 1/2
- Mit ganzen Zahlen: Ganze Zahl als Bruch schreiben (5 = 5/1)
- Beispiel: 3/4 × 2 = 3/4 × 2/1 = 6/4 = 3/2 = 1½

6. BRÜCHE DIVIDIEREN (GETEILT)
- Regel: "Durch einen Bruch teilen = mit dem Kehrwert multiplizieren"
- Was ist der Kehrwert? (Zähler und Nenner vertauschen)
- Beispiel Kehrwert: Kehrwert von 2/3 ist 3/2
- Beispiel Division: 2/3 : 4/5 = 2/3 × 5/4 = 10/12 = 5/6
- Merksatz: "Geteilt durch einen Bruch? Kipp ihn um und mal ihn drauf!"
- Mit ganzen Zahlen: 6 : 2/3 = 6/1 × 3/2 = 18/2 = 9

7. DEZIMALZAHLEN UND BRÜCHE
- Wie macht man aus einem Bruch eine Dezimalzahl? (Zähler durch Nenner teilen)
- Beispiele: 1/2 = 0,5  |  1/4 = 0,25  |  3/4 = 0,75  |  1/10 = 0,1
- Wie macht man aus einer Dezimalzahl einen Bruch?
- Beispiel: 0,5 = 5/10 = 1/2  |  0,25 = 25/100 = 1/4
- Wichtige Brüche kennen: 1/2 = 0,5  |  1/3 = 0,333...  |  1/4 = 0,25

8. ANWENDUNGEN IN DER PHYSIK
- Warum braucht man Bruchrechnung in Physik? (für Formeln, Berechnungen)
- Parallelschaltung: 1/R_ges = 1/R₁ + 1/R₂ (Brüche addieren!)
- Beispiel: 1/20 + 1/30 = 3/60 + 2/60 = 5/60 = 1/12 → R_ges = 12Ω
- Verhältnisse: U₁/U₂ = R₁/R₂ (Spannungsteiler)
- Umrechnen: 2/5 von 100Ω = (2×100)/5 = 200/5 = 40Ω

ERKLÄRSTRATEGIE bei falschen Antworten:
- Verwende Pizza, Kuchen oder Schokolade als Beispiele (visualisierbar für 13-14 Jährige)
- Zeichne mit Worten: "Stell dir vor, du teilst eine Pizza in 4 Stücke..."
- Zeige JEDEN Rechenschritt einzeln, nicht überspringen
- Gib Eselsbrücken: "KV" = Kehrwert bei Division
- Sei sehr geduldig - Bruchrechnung ist für viele schwierig!
- Bei Fehlern: Erst loben was richtig war, dann korrigieren

RECHENBEISPIELE stellen (abwechselnd):
- Erweitern: "Erweitere 2/3 mit 4"
- Kürzen: "Kürze 12/18 vollständig"
- Vergleichen: "Was ist größer: 2/5 oder 3/8?"
- Addition: "Rechne: 1/4 + 1/6"
- Multiplikation: "Rechne: 2/3 × 3/4"
- Division: "Rechne: 3/4 : 2/5"
- Textaufgabe: "Simon hat 3/4 einer Pizza. Er isst 1/2 davon. Wie viel bleibt übrig?"

Stelle Fragen abwechselnd zu allen Themenbereichen!
Bei richtiger Antwort: Lobe und stelle nächste Frage.
Bei falscher Antwort: Erkläre Schritt für Schritt mit Beispiel, dann Kontrollfrage stellen.`,

  basics: `THEMA: Allgemeinwissen Strom - Grundlagen der Elektrizität

WICHTIGE THEMEN zum Abfragen (für 8. Klasse):

1. ELEKTRISCHER STROM - WAS IST DAS?
- Was ist elektrischer Strom? (Bewegung von elektrischen Ladungen/Elektronen)
- In welche Richtung fließt der Strom technisch? (von + nach -)
- In welche Richtung bewegen sich die Elektronen? (von - nach +)
- Was braucht man für einen Stromkreis? (Stromquelle, Verbraucher, Leitungen, geschlossener Kreis)

2. LEITER UND ISOLATOREN
- Was sind Leiter? (Materialien die Strom leiten)
- Nenne Beispiele für gute Leiter! (Kupfer, Silber, Gold, Aluminium, Eisen, Graphit, Wasser mit Salz)
- Was sind Isolatoren/Nichtleiter? (Materialien die KEINEN Strom leiten)
- Nenne Beispiele für Isolatoren! (Gummi, Plastik, Holz trocken, Glas, Porzellan, Luft, destilliertes Wasser)
- Warum leiten Metalle Strom? (freie Elektronen)
- Warum werden Kabel mit Plastik ummantelt? (Isolation zum Schutz)

3. STROMKREIS-KOMPONENTEN
- Was ist eine Stromquelle? (Batterie, Netzteil, Generator - erzeugt Spannung)
- Was ist ein Verbraucher? (Lampe, Motor, Widerstand - nutzt den Strom)
- Was ist ein Schalter? (unterbricht/schließt den Stromkreis)
- Was ist eine Sicherung? (schützt vor zu großem Strom)

4. SPANNUNG UND STROMSTÄRKE (Grundverständnis)
- Was ist Spannung? (elektrischer Druck/Antrieb, wie Wasserdruck)
- Was ist Stromstärke? (wie viel Strom fließt, wie viel Wasser pro Zeit)
- Welche Spannung haben Batterien? (z.B. AA-Batterie: 1,5V, 9V-Block: 9V)
- Welche Spannung kommt aus der Steckdose? (230V in Deutschland - GEFÄHRLICH!)

5. SICHERHEIT
- Warum ist Strom gefährlich? (kann zu Verletzungen/Tod führen)
- Ab welcher Spannung wird es gefährlich? (ab ca. 50V kann es kritisch werden)
- Warum darf man nicht mit Wasser an elektrische Geräte? (Wasser leitet Strom)
- Was macht eine Sicherung/FI-Schalter? (schaltet bei Fehler ab, schützt Menschen)

6. STROMARTEN
- Was ist Gleichstrom (DC)? (Strom fließt immer in eine Richtung, z.B. Batterie)
- Was ist Wechselstrom (AC)? (Strom wechselt die Richtung, z.B. Steckdose)
- Wo verwendet man Gleichstrom? (Batterien, USB, Handy, Auto)
- Wo verwendet man Wechselstrom? (Steckdose, Stromnetz)

7. ALLTAGSBEISPIELE
- Warum leuchtet eine Glühbirne? (Strom fließt durch dünnen Draht, der heiß wird und leuchtet)
- Wie funktioniert ein Schalter? (öffnet/schließt den Stromkreis)
- Warum haben Vögel auf Stromleitungen keinen Stromschlag? (kein geschlossener Stromkreis, keine Spannungsdifferenz)
- Was passiert bei einem Kurzschluss? (Strom fließt ohne Widerstand - SEHR GEFÄHRLICH!)

ERKLÄRSTRATEGIE bei falschen Antworten:
- Verwende einfache Vergleiche (z.B. Wasser-Analogie: Spannung = Druck, Strom = Wassermenge)
- Gib Alltagsbeispiele die ein 13-14 Jähriger kennt
- Erkläre das WARUM, nicht nur das WAS
- Sei ermutigend: "Fast richtig! Lass mich das erklären..."
- Baue Eselsbrücken ein

Stelle Fragen abwechselnd zu allen Themenbereichen!
Bei richtiger Antwort: Kurzes Lob und nächste Frage.
Bei falscher Antwort: Gute, verständliche Erklärung mit Beispiel, dann weitermachen.`,

  ohm: `THEMA: Ohmsches Gesetz - Frage alles Relevante ab!

FORMELN die Simon kennen muss:
- U = R × I (Spannung = Widerstand mal Strom)
- I = U / R (Strom = Spannung durch Widerstand)
- R = U / I (Widerstand = Spannung durch Strom)

WICHTIGE KONZEPTE zum Abfragen:
- Welche drei Größen verknüpft das Ohmsche Gesetz?
- Was passiert mit dem Strom, wenn man den Widerstand verdoppelt?
- Was passiert mit dem Strom, wenn man die Spannung verdoppelt?
- Für welche Bauteile gilt das Ohmsche Gesetz? (Ohmsche Widerstände)
- Einheiten: Volt, Ampere, Ohm

RECHENBEISPIELE stellen:
- "Wenn U = 12V und R = 4Ω, wie groß ist I?"
- "Wenn I = 2A und R = 10Ω, wie groß ist U?"
- "Wenn U = 24V und I = 3A, wie groß ist R?"

Stelle abwechselnd Formel-Fragen, Verständnisfragen und Rechenaufgaben!`,

  series: `THEMA: Reihenschaltung - Frage alles Relevante ab!

FORMELN die Simon kennen muss:
- Rges = R₁ + R₂ + R₃ + ... (Widerstände addieren)
- I = I₁ = I₂ = I₃ (Strom ist ÜBERALL GLEICH)
- Uges = U₁ + U₂ + U₃ (Teilspannungen addieren sich)
- U₁ = R₁ × I (Teilspannung mit Ohm berechnen)
- Spannungsteiler: U₁ = Uges × (R₁/Rges)

WICHTIGE KONZEPTE zum Abfragen:
- Warum ist der Strom in der Reihenschaltung überall gleich? (nur ein Stromweg)
- An welchem Widerstand fällt die größte Spannung ab? (am größten)
- Was passiert, wenn ein Widerstand hinzugefügt wird? (Rges wird größer)
- Was passiert, wenn ein Widerstand unterbricht? (kein Strom mehr)
- Maschenregel: Summe aller Spannungen = 0
- Alltagsbeispiel: Lichterkette

RECHENBEISPIELE stellen:
- "Drei Widerstände 10Ω, 20Ω, 30Ω in Reihe - wie groß ist Rges?"
- "Uges = 12V, Rges = 4Ω - wie groß ist der Strom?"
- "Uges = 9V, U₁ = 3V - wie groß ist U₂?"
- "R₁ = 100Ω, R₂ = 100Ω in Reihe - wie groß ist Rges?"

Stelle abwechselnd Formel-Fragen, Verständnisfragen und Rechenaufgaben!`,

  parallel: `THEMA: Parallelschaltung - Frage alles Relevante ab!

FORMELN die Simon kennen muss:
- 1/Rges = 1/R₁ + 1/R₂ + 1/R₃ (Kehrwerte addieren)
- Kurzformel für 2 Widerstände: Rges = (R₁ × R₂) / (R₁ + R₂)
- U = U₁ = U₂ = U₃ (Spannung ist ÜBERALL GLEICH)
- Iges = I₁ + I₂ + I₃ (Teilströme addieren sich)
- I₁ = U / R₁ (Teilstrom mit Ohm berechnen)

WICHTIGE KONZEPTE zum Abfragen:
- Warum ist die Spannung in der Parallelschaltung überall gleich? (gleiche Anschlusspunkte)
- Durch welchen Widerstand fließt der größte Strom? (den kleinsten)
- Was passiert, wenn ein Widerstand hinzugefügt wird? (Rges wird KLEINER!)
- Was passiert, wenn ein Widerstand ausfällt? (andere funktionieren weiter)
- Ist Rges größer oder kleiner als der kleinste Widerstand? (IMMER kleiner!)
- Knotenregel: Summe aller Ströme an einem Knoten = 0
- Alltagsbeispiel: Steckdosen im Haushalt (alle 230V)

RECHENBEISPIELE stellen:
- "Zwei Widerstände je 10Ω parallel - wie groß ist Rges?" (5Ω)
- "R₁ = 20Ω, R₂ = 30Ω parallel - berechne 1/Rges"
- "I₁ = 2A, I₂ = 3A - wie groß ist Iges?" (5A)
- "Drei gleiche Widerstände je 30Ω parallel?" (10Ω)

Stelle abwechselnd Formel-Fragen, Verständnisfragen und Rechenaufgaben!`,

  formulas: `FORMEL-TRAINING - Frage alle wichtigen Formeln ab!

OHMSCHES GESETZ:
- U = R × I
- I = U / R
- R = U / I

REIHENSCHALTUNG:
- Rges = R₁ + R₂ + R₃
- I = I₁ = I₂ = I₃ (Strom überall gleich)
- Uges = U₁ + U₂ + U₃
- U₁ = R₁ × I
- Spannungsteiler: U₁ = Uges × (R₁/Rges)

PARALLELSCHALTUNG:
- 1/Rges = 1/R₁ + 1/R₂
- Kurzformel: Rges = (R₁ × R₂) / (R₁ + R₂)
- U = U₁ = U₂ (Spannung überall gleich)
- Iges = I₁ + I₂
- I₁ = U / R₁

KIRCHHOFFSCHE REGELN:
- Knotenregel: ΣI = 0 (Summe der Ströme an einem Knoten = 0)
- Maschenregel: ΣU = 0 (Summe der Spannungen in einer Masche = 0)

LEISTUNG:
- P = U × I
- P = I² × R
- P = U² / R

Frage die Formeln in ZUFÄLLIGER Reihenfolge ab!
Bei falscher Antwort: Gib die richtige Formel und erkläre sie kurz.
Bei richtiger Antwort: Lobe und stelle die nächste Frage.`,

  exam: 'PRÜFUNGSMODUS - siehe spezielle Anweisungen unten.',
}

// Prüfungsfragen-Katalog für den Wissenstest
interface ExamQuestion {
  id: string
  category: 'formel' | 'logik' | 'allgemein' | 'berechnung'
  question: string
  answer: string
  hint: string
}

const examQuestions: ExamQuestion[] = [
  // Ohmsches Gesetz
  { id: 'ohm1', category: 'formel', question: 'Wie lautet das Ohmsche Gesetz für die Spannung U?', answer: 'U = R mal I', hint: 'Ohmsches Gesetz: U = R × I (Spannung = Widerstand × Strom)' },
  { id: 'ohm2', category: 'formel', question: 'Wie berechnet man den Strom I nach dem Ohmschen Gesetz?', answer: 'I = U durch R', hint: 'Ohmsches Gesetz umgestellt: I = U / R' },
  { id: 'ohm3', category: 'formel', question: 'Wie berechnet man den Widerstand R nach dem Ohmschen Gesetz?', answer: 'R = U durch I', hint: 'Ohmsches Gesetz umgestellt: R = U / I' },
  { id: 'ohm4', category: 'logik', question: 'Was passiert mit dem Strom, wenn man bei gleicher Spannung den Widerstand verdoppelt?', answer: 'Der Strom halbiert sich', hint: 'I = U/R: Doppelter Widerstand → halber Strom' },
  { id: 'ohm5', category: 'logik', question: 'Was passiert mit dem Strom, wenn man bei gleichem Widerstand die Spannung verdoppelt?', answer: 'Der Strom verdoppelt sich', hint: 'I = U/R: Doppelte Spannung → doppelter Strom' },

  // Reihenschaltung
  { id: 'reihe1', category: 'formel', question: 'Wie berechnet man den Gesamtwiderstand in einer Reihenschaltung?', answer: 'R gesamt = R1 + R2 + R3', hint: 'Reihenschaltung: Rges = R₁ + R₂ + ... (Widerstände addieren)' },
  { id: 'reihe2', category: 'formel', question: 'Wie verhält sich der Strom in einer Reihenschaltung?', answer: 'Der Strom ist überall gleich', hint: 'Reihenschaltung: I = I₁ = I₂ = I₃ (nur ein Stromweg)' },
  { id: 'reihe3', category: 'formel', question: 'Wie berechnet man die Gesamtspannung in einer Reihenschaltung?', answer: 'U gesamt = U1 + U2 + U3', hint: 'Reihenschaltung: Uges = U₁ + U₂ + ... (Teilspannungen addieren)' },
  { id: 'reihe4', category: 'logik', question: 'Was passiert mit dem Gesamtwiderstand, wenn man in einer Reihenschaltung einen Widerstand hinzufügt?', answer: 'Der Gesamtwiderstand wird größer', hint: 'Reihenschaltung: Mehr Widerstände = höherer Gesamtwiderstand' },
  { id: 'reihe5', category: 'logik', question: 'An welchem Widerstand fällt in einer Reihenschaltung die größte Spannung ab?', answer: 'Am größten Widerstand', hint: 'U = R × I: Größerer Widerstand → größere Teilspannung' },

  // Parallelschaltung
  { id: 'para1', category: 'formel', question: 'Wie berechnet man den Gesamtwiderstand in einer Parallelschaltung?', answer: '1 durch R gesamt = 1 durch R1 + 1 durch R2', hint: 'Parallelschaltung: 1/Rges = 1/R₁ + 1/R₂ + ...' },
  { id: 'para2', category: 'formel', question: 'Wie verhält sich die Spannung in einer Parallelschaltung?', answer: 'Die Spannung ist überall gleich', hint: 'Parallelschaltung: U = U₁ = U₂ (alle Zweige an gleicher Spannung)' },
  { id: 'para3', category: 'formel', question: 'Wie berechnet man den Gesamtstrom in einer Parallelschaltung?', answer: 'I gesamt = I1 + I2 + I3', hint: 'Parallelschaltung: Iges = I₁ + I₂ + ... (Teilströme addieren)' },
  { id: 'para4', category: 'logik', question: 'Was passiert mit dem Gesamtwiderstand, wenn man in einer Parallelschaltung einen Widerstand hinzufügt?', answer: 'Der Gesamtwiderstand wird kleiner', hint: 'Parallelschaltung: Mehr Zweige = kleinerer Gesamtwiderstand' },
  { id: 'para5', category: 'logik', question: 'Durch welchen Widerstand fließt in einer Parallelschaltung der größte Strom?', answer: 'Durch den kleinsten Widerstand', hint: 'I = U/R: Kleinerer Widerstand → größerer Teilstrom' },
  { id: 'para6', category: 'formel', question: 'Wie lautet die Kurzformel für zwei parallele Widerstände R1 und R2?', answer: 'R gesamt = R1 mal R2 durch R1 + R2', hint: 'Produktformel: Rges = (R₁ × R₂) / (R₁ + R₂)' },

  // Allgemein
  { id: 'allg1', category: 'allgemein', question: 'In welcher Einheit wird der Widerstand gemessen?', answer: 'Ohm', hint: 'Widerstand wird in Ohm (Ω) gemessen' },
  { id: 'allg2', category: 'allgemein', question: 'In welcher Einheit wird die Spannung gemessen?', answer: 'Volt', hint: 'Spannung wird in Volt (V) gemessen' },
  { id: 'allg3', category: 'allgemein', question: 'In welcher Einheit wird der Strom gemessen?', answer: 'Ampere', hint: 'Strom wird in Ampere (A) gemessen' },
  { id: 'allg4', category: 'allgemein', question: 'Wie wird ein Voltmeter in den Stromkreis geschaltet?', answer: 'Parallel zum Verbraucher', hint: 'Voltmeter: Parallelschaltung zum Bauteil' },
  { id: 'allg5', category: 'allgemein', question: 'Wie wird ein Amperemeter in den Stromkreis geschaltet?', answer: 'In Reihe', hint: 'Amperemeter: Reihenschaltung (der gesamte Strom fließt durch)' },

  // Berechnungen
  { id: 'berech1', category: 'berechnung', question: 'Wenn U = 12 Volt und R = 4 Ohm ist, wie groß ist der Strom I?', answer: '3 Ampere', hint: 'I = U / R = 12V / 4Ω = 3A' },
  { id: 'berech2', category: 'berechnung', question: 'Drei Widerstände mit 10, 20 und 30 Ohm sind in Reihe geschaltet. Wie groß ist der Gesamtwiderstand?', answer: '60 Ohm', hint: 'Rges = 10Ω + 20Ω + 30Ω = 60Ω' },
  { id: 'berech3', category: 'berechnung', question: 'Zwei Widerstände mit je 10 Ohm sind parallel geschaltet. Wie groß ist der Gesamtwiderstand?', answer: '5 Ohm', hint: '1/Rges = 1/10 + 1/10 = 2/10, also Rges = 5Ω' },
  { id: 'berech4', category: 'berechnung', question: 'Wenn I = 2 Ampere und R = 5 Ohm ist, wie groß ist die Spannung U?', answer: '10 Volt', hint: 'U = R × I = 5Ω × 2A = 10V' },
  { id: 'berech5', category: 'berechnung', question: 'In einer Parallelschaltung fließen I1 = 2A und I2 = 3A. Wie groß ist der Gesamtstrom?', answer: '5 Ampere', hint: 'Iges = I₁ + I₂ = 2A + 3A = 5A' },
]

// Interface für Lernzettel-Eintrag
interface LearningNote {
  questionId: string
  question: string
  hint: string
  category: string
  timestamp: Date
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function VoiceTutor({ openaiKey, onNeedApiKey }: VoiceTutorProps) {
  const [topic, setTopic] = useState<Topic>('all')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')

  // Prüfungsmodus State
  const [learningNotes, setLearningNotes] = useState<LearningNote[]>([])
  const [examProgress, setExamProgress] = useState({ answered: 0, correct: 0, total: examQuestions.length })
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set())

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const learningNotesRef = useRef<HTMLDivElement>(null)

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Erstelle die Prüfungsfragen als String für die Instruktionen
  const getExamQuestionsString = useCallback(() => {
    const remainingQuestions = examQuestions.filter(q => !completedQuestions.has(q.id))
    return remainingQuestions.map((q, i) => `${i + 1}. [ID:${q.id}] ${q.question}`).join('\n')
  }, [completedQuestions])

  const getSystemInstructions = useCallback(() => {
    // Basis-Instruktionen
    const baseInstructions = `Du bist ein freundlicher Physiklehrer für die 8. Klasse in Deutschland.
Du hilfst dem Schüler Simon beim Lernen von elektrischen Schaltungen.

WICHTIGE REGELN:
- Sprich den Schüler IMMER mit "Simon" an
- Sprich IMMER auf Deutsch
- Halte dich KURZ (maximal 2-3 Sätze pro Antwort)
- Sei ermutigend und geduldig
- Erkläre Dinge einfach und verständlich
- Gib bei falschen Antworten hilfreiche Hinweise

AUSSPRACHE VON FORMELN - SEHR WICHTIG:
Wenn du Formeln aussprichst, sage sie so wie ein Lehrer sie vorlesen würde:
- "U = R × I" sprich als "U gleich R mal I"
- "U = R * I" sprich als "U gleich R mal I" (Sternchen bedeutet "mal", NICHT "Quadrat"!)
- "I = U / R" sprich als "I gleich U geteilt durch R" oder "I gleich U durch R"
- "R²" oder "R^2" sprich als "R Quadrat"
- "1/R" sprich als "eins durch R"
- "R_ges" oder "R₁" sprich als "R gesamt" bzw. "R eins"
- Verwende NIEMALS das Wort "Quadrat" für Multiplikation!
- Das Zeichen "*" bedeutet IMMER "mal" (Multiplikation), nicht Quadrat!`

    // Prüfungsmodus spezielle Instruktionen
    if (topic === 'exam') {
      const remainingCount = examQuestions.length - completedQuestions.size
      return `${baseInstructions}

KRITISCH WICHTIG - NIEMALS VERABSCHIEDEN:
- Sage NIEMALS "Auf Wiedersehen", "Tschüss", "Bye", "See you" oder ähnliche Abschiedsformeln!
- Du bist IMMER bereit für den Wissenstest
- Wenn du Hintergrundgeräusche oder unklare Audio hörst, IGNORIERE sie und fahre mit dem Test fort
- Beginne IMMER mit einer Begrüßung und der ersten Frage, egal was du vorher gehört hast

PRÜFUNGSMODUS - WISSENSTEST:
Du führst einen umfassenden Wissenstest durch. Es gibt ${examQuestions.length} Fragen insgesamt.
Noch ${remainingCount} Fragen offen.

DEINE ERSTE NACHRICHT MUSS SO AUSSEHEN:
"Hallo Simon! Wir machen jetzt einen Wissenstest zu elektrischen Schaltungen. Ich stelle dir ${remainingCount} Fragen. Los geht's mit der ersten Frage: [FRAGE HIER]"

ABLAUF:
1. Warte auf Simons Antwort (er braucht Zeit zum Nachdenken!)
2. Bewerte die Antwort:
   - Bei RICHTIGER Antwort: Lobe Simon kurz
   - Bei FALSCHER Antwort: Gib einen kurzen Hinweis und nenne die richtige Antwort
3. Füge am Ende deiner Bewertung einen UNSICHTBAREN MARKER ein (siehe unten)
4. Stelle dann die nächste Frage

SEHR WICHTIG - MARKER FÜR TRACKING:
Nach jeder Bewertung musst du einen speziellen Marker einfügen, damit das System den Fortschritt tracken kann.
ABER: Sprich diesen Marker NICHT aus! Er soll nur im Text erscheinen, nicht in deiner gesprochenen Antwort.

Format:
- Bei richtiger Antwort: Füge ":::CORRECT:xxx:::" ein (xxx = Fragen-ID)
- Bei falscher Antwort: Füge ":::WRONG:xxx:::" ein (xxx = Fragen-ID)

Beispiel bei richtiger Antwort für Frage ohm1:
"Super Simon, das ist richtig! :::CORRECT:ohm1::: Nächste Frage..."

Beispiel bei falscher Antwort für Frage reihe2:
"Das war leider nicht ganz richtig. Die Antwort ist... :::WRONG:reihe2::: Weiter zur nächsten Frage..."

Denk daran: Die Marker :::CORRECT:xxx::: und :::WRONG:xxx::: werden NICHT gesprochen, nur im Transkript angezeigt.

KATEGORIEN-ABWECHSLUNG:
Stelle Fragen aus verschiedenen Kategorien abwechselnd: Formeln, Logik, Allgemeinwissen, Berechnungen.
Wenn alle Fragen beantwortet sind, gratuliere Simon zum Abschluss des Tests.

NOCH OFFENE FRAGEN:
${getExamQuestionsString()}`
    }

    // Standard-Modus
    return `${baseInstructions}

THEMA FÜR DIESE SITZUNG:
${topicInstructions[topic]}

WICHTIGE FORMELN (sprich sie korrekt aus!):
- Ohmsches Gesetz: U gleich R mal I (Spannung gleich Widerstand mal Strom)
- Reihenschaltung: R gesamt gleich R eins plus R zwei, Strom überall gleich
- Parallelschaltung: eins durch R gesamt gleich eins durch R eins plus eins durch R zwei

Beginne mit einer freundlichen Begrüßung an Simon und frage ihn, wobei du ihm helfen kannst oder stelle direkt eine einfache Frage zum gewählten Thema.`
  }, [topic, completedQuestions, getExamQuestionsString])

  const connect = useCallback(async () => {
    if (!openaiKey) {
      onNeedApiKey()
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Get ephemeral token from OpenAI
      const tokenResponse = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          voice: 'alloy',
          instructions: getSystemInstructions(),
          input_audio_transcription: {
            model: 'whisper-1',
          },
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API Fehler: ${tokenResponse.status}`)
      }

      const data = await tokenResponse.json()
      const ephemeralKey = data.client_secret.value

      // Create WebRTC peer connection
      const pc = new RTCPeerConnection()
      peerConnectionRef.current = pc

      // Set up audio element for AI voice
      const audioEl = document.createElement('audio')
      audioEl.autoplay = true
      audioElementRef.current = audioEl

      // Flag um zu tracken ob Audio bereit ist
      let audioReady = false
      let dataChannelReady = false

      // Funktion um Begrüßung zu starten wenn alles bereit ist
      let greetingStarted = false
      const tryStartGreeting = () => {
        if (greetingStarted) return // Verhindere doppelten Start
        if (audioReady && dataChannelReady && dataChannelRef.current?.readyState === 'open') {
          greetingStarted = true
          // Längere Verzögerung für Stabilität - verhindert "bye bye" Probleme
          setTimeout(() => {
            if (dataChannelRef.current?.readyState === 'open') {
              dataChannelRef.current.send(JSON.stringify({
                type: 'response.create',
                response: {
                  modalities: ['audio', 'text'],
                },
              }))
            }
          }, 800) // Erhöht von 300ms auf 800ms
        }
      }

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0]
        // Warte bis Audio tatsächlich abspielbereit ist
        audioEl.oncanplay = () => {
          audioReady = true
          tryStartGreeting()
        }
        // Fallback falls oncanplay nicht feuert
        setTimeout(() => {
          if (!audioReady) {
            audioReady = true
            tryStartGreeting()
          }
        }, 1000)
      }

      // Get microphone access
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = localStream
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream))

      // Set up data channel for events
      const dc = pc.createDataChannel('oai-events')
      dataChannelRef.current = dc

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data)
        handleRealtimeEvent(event)
      }

      dc.onopen = () => {
        // Send session update with instructions and turn detection settings
        dc.send(JSON.stringify({
          type: 'session.update',
          session: {
            instructions: getSystemInstructions(),
            voice: 'alloy',
            input_audio_transcription: {
              model: 'whisper-1',
            },
            // Längere Wartezeit bevor die KI antwortet - gibt dem Schüler Zeit zum Überlegen
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,  // Empfindlichkeit der Spracherkennung (0-1)
              prefix_padding_ms: 500,  // Audio vor erkannter Sprache
              silence_duration_ms: 1500,  // 1.5 Sekunden Stille bevor KI antwortet (Standard: 500ms)
            },
          },
        }))

        dataChannelReady = true
        tryStartGreeting()
      }

      // Create and set local offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // Send offer to OpenAI
      const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      })

      if (!sdpResponse.ok) {
        throw new Error(`SDP Fehler: ${sdpResponse.status}`)
      }

      const answerSdp = await sdpResponse.text()
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

      setIsConnected(true)
      setMessages([])

    } catch (err) {
      console.error('Connection error:', err)
      setError(err instanceof Error ? err.message : 'Verbindungsfehler')
      disconnect()
    } finally {
      setIsConnecting(false)
    }
  }, [openaiKey, onNeedApiKey, getSystemInstructions])

  // Funktion zum Parsen der Marker aus dem Transkript
  const parseExamResult = useCallback((text: string) => {
    // Primäres Format: :::CORRECT:xxx::: oder :::WRONG:xxx:::
    const correctMatch = text.match(/:::CORRECT:(\w+):::/i)
    const wrongMatch = text.match(/:::WRONG:(\w+):::/i)

    if (correctMatch) {
      return { isCorrect: true, questionId: correctMatch[1] }
    }
    if (wrongMatch) {
      return { isCorrect: false, questionId: wrongMatch[1] }
    }

    // Fallback: Altes Format RICHTIG [ID:xxx] oder FALSCH [ID:xxx] (falls Agent es noch benutzt)
    const oldCorrectMatch = text.match(/RICHTIG\s*\[ID:(\w+)\]/i)
    const oldWrongMatch = text.match(/FALSCH\s*\[ID:(\w+)\]/i)

    if (oldCorrectMatch) {
      return { isCorrect: true, questionId: oldCorrectMatch[1] }
    }
    if (oldWrongMatch) {
      return { isCorrect: false, questionId: oldWrongMatch[1] }
    }

    // Zusätzlicher Fallback: Variationen wie "Richtig, ID f1" oder "Falsch ID:f1"
    const flexCorrectMatch = text.match(/\b(?:richtig|korrekt|genau|super).*?(?:ID[:\s]*|Frage\s*)(\w+)/i)
    const flexWrongMatch = text.match(/\b(?:falsch|leider nicht|nicht richtig|nicht ganz).*?(?:ID[:\s]*|Frage\s*)(\w+)/i)

    if (flexCorrectMatch) {
      return { isCorrect: true, questionId: flexCorrectMatch[1] }
    }
    if (flexWrongMatch) {
      return { isCorrect: false, questionId: flexWrongMatch[1] }
    }

    return null
  }, [])

  // Verarbeite Prüfungsergebnis
  const processExamResult = useCallback((isCorrect: boolean, questionId: string) => {
    // Prüfe ob Frage existiert und noch nicht beantwortet
    const question = examQuestions.find(q => q.id === questionId)
    if (!question || completedQuestions.has(questionId)) return

    // Markiere Frage als beantwortet
    setCompletedQuestions(prev => new Set([...prev, questionId]))

    // Update Fortschritt
    setExamProgress(prev => ({
      ...prev,
      answered: prev.answered + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
    }))

    // Bei falscher Antwort: Zum Lernzettel hinzufügen
    if (!isCorrect) {
      const categoryLabels: Record<string, string> = {
        formel: 'Formel',
        logik: 'Logik',
        allgemein: 'Allgemeinwissen',
        berechnung: 'Berechnung',
      }

      setLearningNotes(prev => [...prev, {
        questionId: question.id,
        question: question.question,
        hint: question.hint,
        category: categoryLabels[question.category] || question.category,
        timestamp: new Date(),
      }])

      // Scroll zum Lernzettel
      setTimeout(() => {
        learningNotesRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [completedQuestions])

  const handleRealtimeEvent = useCallback((event: { type: string; [key: string]: unknown }) => {
    switch (event.type) {
      case 'response.audio_transcript.delta':
        // AI is speaking - accumulate transcript
        setTranscript(prev => prev + ((event.delta as string) || ''))
        setIsAiSpeaking(true)
        break

      case 'response.audio_transcript.done':
        // AI finished speaking
        if (event.transcript) {
          const transcriptText = event.transcript as string

          // Im Prüfungsmodus: Prüfe auf Marker und verarbeite sie
          if (topic === 'exam') {
            const result = parseExamResult(transcriptText)
            if (result) {
              processExamResult(result.isCorrect, result.questionId)
            }
          }

          // Entferne technische Marker aus der angezeigten Nachricht
          const cleanedText = transcriptText
            .replace(/:::CORRECT:\w+:::/gi, '')
            .replace(/:::WRONG:\w+:::/gi, '')
            .replace(/RICHTIG\s*\[ID:\w+\]/gi, '')
            .replace(/FALSCH\s*\[ID:\w+\]/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim()

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: cleanedText,
            timestamp: new Date(),
          }])
        }
        setTranscript('')
        setIsAiSpeaking(false)
        break

      case 'conversation.item.input_audio_transcription.completed':
        // User speech transcribed
        if (event.transcript) {
          setMessages(prev => [...prev, {
            role: 'user',
            content: event.transcript as string,
            timestamp: new Date(),
          }])
        }
        break

      case 'error':
        console.error('Realtime error:', event)
        setError((event.error as { message?: string })?.message || 'Ein Fehler ist aufgetreten')
        break
    }
  }, [topic, parseExamResult, processExamResult])

  const disconnect = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null
      audioElementRef.current = null
    }

    dataChannelRef.current = null
    setIsConnected(false)
    setIsAiSpeaking(false)
    setTranscript('')
  }, [])

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }, [])

  // Reset exam progress when topic changes or new connection
  const resetExamProgress = useCallback(() => {
    setCompletedQuestions(new Set())
    setExamProgress({ answered: 0, correct: 0, total: examQuestions.length })
    setLearningNotes([])
  }, [])

  // Reset when topic changes
  useEffect(() => {
    if (topic === 'exam') {
      resetExamProgress()
    }
  }, [topic, resetExamProgress])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            Sprach-Tutor
          </CardTitle>
          <CardDescription>
            Sprich direkt mit deinem KI-Physiklehrer! Stelle Fragen, übe Formeln oder lass dir Konzepte erklären.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Thema</label>
              <Select
                value={topic}
                onValueChange={(v) => setTopic(v as Topic)}
                disabled={isConnected}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(topicLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isConnected ? (
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verbinde...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Gespräch starten
                  </>
                )}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  title={isMuted ? 'Mikrofon aktivieren' : 'Mikrofon stummschalten'}
                >
                  {isMuted ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-500" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={disconnect}
                >
                  <PhoneOff className="mr-2 h-4 w-4" />
                  Beenden
                </Button>
              </div>
            )}
          </div>

          {!openaiKey && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>OpenAI API-Key fehlt</AlertTitle>
              <AlertDescription>
                Für den Sprach-Tutor brauchst du einen OpenAI API-Key.
                <Button variant="link" className="px-1" onClick={onNeedApiKey}>
                  Einstellungen öffnen
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Chat Display */}
      {isConnected && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {isAiSpeaking && (
                <Volume2 className="h-5 w-5 text-green-500 animate-pulse" />
              )}
              Gespräch
              {isAiSpeaking && (
                <span className="text-sm font-normal text-green-600">
                  KI spricht...
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
              {messages.length === 0 && !isAiSpeaking && (
                <p className="text-center text-gray-500 py-8">
                  Warte auf Begrüßung...
                </p>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Live transcript while AI is speaking */}
              {isAiSpeaking && transcript && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-white border shadow-sm border-green-200">
                    <p className="text-sm text-gray-700">{transcript}</p>
                    <p className="text-xs mt-1 text-green-500">spricht...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Status bar */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-gray-600">
                  {isConnected ? 'Verbunden' : 'Nicht verbunden'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                {isMuted ? (
                  <>
                    <MicOff className="h-4 w-4 text-red-500" />
                    <span>Mikrofon aus</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 text-green-500" />
                    <span>Mikrofon an - sprich einfach los!</span>
                  </>
                )}
              </div>
            </div>

            {/* Prüfungsmodus Fortschritt */}
            {topic === 'exam' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Wissenstest Fortschritt</span>
                  </div>
                  <span className="text-sm text-blue-600">
                    {examProgress.answered} / {examProgress.total} Fragen
                  </span>
                </div>
                <Progress value={(examProgress.answered / examProgress.total) * 100} className="h-2" />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {examProgress.correct} richtig
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <XCircle className="h-4 w-4" />
                    {examProgress.answered - examProgress.correct} falsch
                  </span>
                </div>
                {examProgress.answered === examProgress.total && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-center font-medium">
                    🎉 Test abgeschlossen! Ergebnis: {examProgress.correct}/{examProgress.total} ({Math.round((examProgress.correct / examProgress.total) * 100)}%)
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lernzettel - nur im Prüfungsmodus und wenn es Notizen gibt */}
      {topic === 'exam' && learningNotes.length > 0 && (
        <Card ref={learningNotesRef} className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Lernzettel - Das solltest du noch üben
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLearningNotes([])}
                className="text-amber-600 hover:text-amber-800"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Leeren
              </Button>
            </div>
            <CardDescription className="text-amber-700">
              Hier findest du alle Fragen, die noch nicht richtig beantwortet wurden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningNotes.map((note, index) => (
                <div key={note.questionId} className="p-3 bg-white rounded-lg border border-amber-200 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          {note.category}
                        </span>
                        <span className="text-xs text-gray-400">#{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-2">{note.question}</p>
                      <div className="flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-green-800">{note.hint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      {!isConnected && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">So funktioniert's</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-green-900">
            <div className="flex items-start gap-3">
              <div className="bg-green-200 rounded-full p-2">
                <span className="font-bold">1</span>
              </div>
              <p>Wähle ein Thema aus und klicke auf "Gespräch starten"</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-200 rounded-full p-2">
                <span className="font-bold">2</span>
              </div>
              <p>Die KI begrüßt dich und stellt dir Fragen zum Thema</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-200 rounded-full p-2">
                <span className="font-bold">3</span>
              </div>
              <p>Sprich einfach in dein Mikrofon - die KI hört zu und antwortet</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-200 rounded-full p-2">
                <span className="font-bold">4</span>
              </div>
              <p>Du kannst jederzeit Nachfragen stellen oder um Erklärungen bitten</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
