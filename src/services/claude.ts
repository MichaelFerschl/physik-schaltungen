import type { CircuitType, Difficulty, Exercise, UserAnswer, CheckResult, AnswerResult } from '@/types/circuit'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>
}

async function callClaude(apiKey: string, messages: ClaudeMessage[], systemPrompt: string): Promise<string> {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Fehler: ${response.status} - ${error}`)
  }

  const data: ClaudeResponse = await response.json()
  return data.content[0].text
}

export async function generateExercise(
  apiKey: string,
  circuitType: CircuitType,
  difficulty: Difficulty
): Promise<Exercise> {
  // Bei gemischten Schaltungen brauchen wir mindestens 3 Widerstände
  const isMinThreeRequired = circuitType === 'mixed'

  const difficultyDescription = {
    easy: isMinThreeRequired
      ? 'einfach (3 Widerstände, runde Werte, einfache Kombination aus Reihe und Parallel)'
      : 'einfach (2 Widerstände, runde Werte)',
    medium: 'mittel (3-5 Widerstände, verschiedene Kombinationen)',
    hard: 'schwer (6-8 Widerstände, komplexe Verschachtelungen, Einheitenumrechnung nötig)',
  }

  // Anzahl der Widerstände je nach Schwierigkeit
  // Bei gemischten Schaltungen mindestens 3 Widerstände (sonst keine echte Mischung möglich)
  const resistorCount = {
    easy: isMinThreeRequired ? 3 : 2,
    medium: [3, 4, 5][Math.floor(Math.random() * 3)],
    hard: [6, 7, 8][Math.floor(Math.random() * 3)],
  }[difficulty]

  // Zufällige Seed-Werte generieren für Variation
  const randomSeed = Math.floor(Math.random() * 10000)

  // Zufällige Einheiten-Kombinationen
  const unitVariants = [
    { voltage: 'V', voltageVal: [6, 9, 12, 15, 18, 24][Math.floor(Math.random() * 6)], resistance: 'Ω', resistanceRange: '20-200 Ω', current: 'A' },
    { voltage: 'V', voltageVal: [6, 9, 12][Math.floor(Math.random() * 3)], resistance: 'kΩ', resistanceRange: '1-10 kΩ', current: 'mA' },
    { voltage: 'mV', voltageVal: [100, 200, 500, 800][Math.floor(Math.random() * 4)], resistance: 'Ω', resistanceRange: '10-100 Ω', current: 'mA' },
    { voltage: 'V', voltageVal: [12, 24, 48][Math.floor(Math.random() * 3)], resistance: 'Ω', resistanceRange: '100-1000 Ω', current: 'mA' },
  ]
  const selectedUnits = unitVariants[Math.floor(Math.random() * (difficulty === 'easy' ? 1 : unitVariants.length))]

  // Zufällige Aufgaben-Kontexte
  const contexts = [
    'Eine Schaltung mit',
    'In einem Stromkreis sind',
    'Ein Schüler baut eine Schaltung mit',
    'In einer Taschenlampe befinden sich',
    'Eine LED-Schaltung enthält',
    'In einem Radio sind',
    'Eine Alarmanlage verwendet',
    'Ein Modellbau-Motor wird betrieben mit',
  ]
  const randomContext = contexts[Math.floor(Math.random() * contexts.length)]

  // Zufällige Fragetyp-Variante - VERSCHIEDENE physikalische Größen (ohne Leistung)
  const questionVariants = [
    // NUR Widerstände
    { type: 'WIDERSTAND', desc: 'Berechne den Gesamtwiderstand R_ges und den Ersatzwiderstand einer Teilschaltung', answers: 2, focus: 'Widerstand' },

    // NUR Spannungen
    { type: 'SPANNUNGEN', desc: `Berechne ${Math.min(resistorCount, 3)} Teilspannungen (U₁, U₂, U₃...)`, answers: Math.min(resistorCount, 3), focus: 'Spannung' },
    { type: 'ALLE_SPANNUNGEN', desc: 'Berechne ALLE Teilspannungen in der Schaltung', answers: Math.min(resistorCount, 4), focus: 'Spannung' },

    // NUR Ströme
    { type: 'STROEME', desc: `Berechne den Gesamtstrom und ${Math.min(resistorCount - 1, 2)} Teilströme`, answers: Math.min(resistorCount, 3), focus: 'Strom' },

    // Widerstand + Strom
    { type: 'R_UND_I', desc: 'Berechne Gesamtwiderstand R_ges UND Gesamtstrom I_ges', answers: 2, focus: 'Widerstand+Strom' },

    // Widerstand + Spannung
    { type: 'R_UND_U', desc: 'Berechne Gesamtwiderstand R_ges UND zwei Teilspannungen', answers: 3, focus: 'Widerstand+Spannung' },

    // Strom + Spannung
    { type: 'I_UND_U', desc: 'Berechne Gesamtstrom I_ges UND zwei Teilspannungen', answers: 3, focus: 'Strom+Spannung' },

    // Gemischt: R + I + U
    { type: 'KOMPLETT', desc: 'Berechne R_ges, I_ges, U₁ und U₂', answers: 4, focus: 'Alles' },
    { type: 'ALLES', desc: 'Berechne Gesamtwiderstand, Gesamtstrom, eine Teilspannung UND einen Teilstrom', answers: 4, focus: 'Alles' },

    // Spezial: Verhältnisse
    { type: 'SPANNUNGSTEILER', desc: 'Berechne das Spannungsverhältnis U₁/U₂ und beide Teilspannungen', answers: 3, focus: 'Spannung' },
  ]
  const randomVariant = questionVariants[Math.floor(Math.random() * questionVariants.length)]

  // Mindestanzahl Antworten je nach Schwierigkeit
  const minAnswers = { easy: 2, medium: 3, hard: 4 }[difficulty]

  // Zufällige Antwort-Einheiten (für Umrechnungsübungen)
  const answerUnitVariants = difficulty === 'hard' ? [
    { askIn: 'mA', factor: 1000, baseUnit: 'A' },
    { askIn: 'kΩ', factor: 0.001, baseUnit: 'Ω' },
    { askIn: 'mV', factor: 1000, baseUnit: 'V' },
    { askIn: 'A', factor: 1, baseUnit: 'A' },
    { askIn: 'Ω', factor: 1, baseUnit: 'Ω' },
    { askIn: 'V', factor: 1, baseUnit: 'V' },
  ] : [{ askIn: 'A', factor: 1, baseUnit: 'A' }, { askIn: 'Ω', factor: 1, baseUnit: 'Ω' }, { askIn: 'V', factor: 1, baseUnit: 'V' }]
  const randomAnswerUnit = answerUnitVariants[Math.floor(Math.random() * answerUnitVariants.length)]

  const systemPrompt = `Du bist ein kreativer Physiklehrer für die 8. Klasse in Deutschland. Du erstellst abwechslungsreiche Übungsaufgaben zu elektrischen Schaltungen.
Antworte IMMER in validem JSON-Format ohne zusätzlichen Text.
WICHTIG: Jede Aufgabe muss EINZIGARTIG sein - variiere Werte, Einheiten, Fragestellung und Kontext!`

  // Verschiedene Prompts je nach Schaltungstyp
  let layoutExplanation = ''
  let layoutExample = ''

  if (circuitType === 'series') {
    layoutExplanation = `Bei Reihenschaltung: Alle Widerstände nacheinander als einzelne Elemente.
Füge so viele Widerstände hinzu wie gefordert (${resistorCount} Stück).`
    layoutExample = `// Beispiel für ${resistorCount} Widerstände in Reihe:
"layout": [
  { "type": "resistor", "resistorId": "r1" },
  { "type": "resistor", "resistorId": "r2" }${resistorCount >= 3 ? `,
  { "type": "resistor", "resistorId": "r3" }` : ''}${resistorCount >= 4 ? `,
  { "type": "resistor", "resistorId": "r4" }` : ''}${resistorCount >= 5 ? `,
  { "type": "resistor", "resistorId": "r5" }` : ''}${resistorCount >= 6 ? `,
  { "type": "resistor", "resistorId": "r6" }` : ''}${resistorCount >= 7 ? `,
  { "type": "resistor", "resistorId": "r7" }` : ''}${resistorCount >= 8 ? `,
  { "type": "resistor", "resistorId": "r8" }` : ''}
]`
  } else if (circuitType === 'parallel') {
    // Je nach Schwierigkeit unterschiedliche Layouts
    if (difficulty === 'easy') {
      layoutExplanation = `Bei Parallelschaltung (leicht): Alle Widerstände in EINER Parallelgruppe.`
      layoutExample = `// Alle ${resistorCount} Widerstände parallel:
"layout": [
  { "type": "parallel", "resistorIds": ["r1", "r2"${resistorCount >= 3 ? ', "r3"' : ''}] }
]`
    } else if (difficulty === 'medium') {
      layoutExplanation = `Bei Parallelschaltung (mittel): Verwende ZWEI Parallelschaltungen IN REIHE!
Das macht die Aufgabe anspruchsvoller - der Schüler muss erst die Ersatzwiderstände berechnen und dann addieren.`
      layoutExample = `// ZWEI Parallelschaltungen in Reihe (PFLICHT bei mittel!):
"layout": [
  { "type": "parallel", "resistorIds": ["r1", "r2"] },
  { "type": "parallel", "resistorIds": ["r3"${resistorCount >= 4 ? ', "r4"' : ''}${resistorCount >= 5 ? ', "r5"' : ''}] }
]`
    } else {
      // hard
      layoutExplanation = `Bei Parallelschaltung (schwer): Verwende ZWEI oder DREI Parallelschaltungen IN REIHE!
PFLICHT: Mehrere Parallelschaltungen hintereinander - NICHT alle in einer großen Parallelschaltung!`
      layoutExample = `// PFLICHT: Mehrere Parallelschaltungen in Reihe!

// Variante A: ZWEI Parallelschaltungen in Reihe
"layout": [
  { "type": "parallel", "resistorIds": ["r1", "r2", "r3"] },
  { "type": "parallel", "resistorIds": ["r4", "r5"${resistorCount >= 6 ? ', "r6"' : ''}${resistorCount >= 7 ? ', "r7"' : ''}${resistorCount >= 8 ? ', "r8"' : ''}] }
]

// Variante B: DREI Parallelschaltungen in Reihe
"layout": [
  { "type": "parallel", "resistorIds": ["r1", "r2"] },
  { "type": "parallel", "resistorIds": ["r3", "r4"] },
  { "type": "parallel", "resistorIds": ["r5"${resistorCount >= 6 ? ', "r6"' : ''}${resistorCount >= 7 ? ', "r7"' : ''}${resistorCount >= 8 ? ', "r8"' : ''}] }
]

Wähle Variante A oder B - NIEMALS alle Widerstände in nur einer Parallelschaltung!`
    }
  } else {
    layoutExplanation = `Bei gemischter Schaltung: Kombiniere Reihen- und Parallelelemente.
WICHTIG: Verwende GENAU ${resistorCount} Widerstände (R₁ bis R₈)!
Das "layout" Array enthält Elemente die IN REIHE geschaltet sind.
Jedes Element ist entweder:
- { "type": "resistor", "resistorId": "r1" } für einen einzelnen Widerstand
- { "type": "parallel", "resistorIds": ["r2", "r3", "r4"] } für parallel geschaltete Widerstände (2 oder mehr)`
    layoutExample = `// Beispiel 1 (3 Widerstände): R1 in Reihe mit (R2 || R3)
"layout": [
  { "type": "resistor", "resistorId": "r1" },
  { "type": "parallel", "resistorIds": ["r2", "r3"] }
]

// Beispiel 2 (4 Widerstände): R1 in Reihe mit (R2 || R3) in Reihe mit R4
"layout": [
  { "type": "resistor", "resistorId": "r1" },
  { "type": "parallel", "resistorIds": ["r2", "r3"] },
  { "type": "resistor", "resistorId": "r4" }
]

// Beispiel 3 (5 Widerstände): R1 in Reihe mit (R2 || R3 || R4) in Reihe mit R5
"layout": [
  { "type": "resistor", "resistorId": "r1" },
  { "type": "parallel", "resistorIds": ["r2", "r3", "r4"] },
  { "type": "resistor", "resistorId": "r5" }
]

// Beispiel 4 (6 Widerstände): (R1 || R2) in Reihe mit R3 in Reihe mit (R4 || R5) in Reihe mit R6
"layout": [
  { "type": "parallel", "resistorIds": ["r1", "r2"] },
  { "type": "resistor", "resistorId": "r3" },
  { "type": "parallel", "resistorIds": ["r4", "r5"] },
  { "type": "resistor", "resistorId": "r6" }
]

// Beispiel 5 (7 Widerstände): R1 in Reihe mit (R2 || R3) in Reihe mit (R4 || R5 || R6) in Reihe mit R7
"layout": [
  { "type": "resistor", "resistorId": "r1" },
  { "type": "parallel", "resistorIds": ["r2", "r3"] },
  { "type": "parallel", "resistorIds": ["r4", "r5", "r6"] },
  { "type": "resistor", "resistorId": "r7" }
]

// Beispiel 6 (8 Widerstände): (R1 || R2) in Reihe mit (R3 || R4) in Reihe mit (R5 || R6) in Reihe mit (R7 || R8)
"layout": [
  { "type": "parallel", "resistorIds": ["r1", "r2"] },
  { "type": "parallel", "resistorIds": ["r3", "r4"] },
  { "type": "parallel", "resistorIds": ["r5", "r6"] },
  { "type": "parallel", "resistorIds": ["r7", "r8"] }
]`
  }

  const userMessage = `Erstelle eine NEUE ${circuitType === 'series' ? 'Reihenschaltung' : circuitType === 'parallel' ? 'Parallelschaltung' : 'Gemischte Schaltung'} Aufgabe.
Schwierigkeit: ${difficultyDescription[difficulty]}

=== PFLICHT-VORGABEN (Zufalls-ID: ${randomSeed}) ===

1. ANZAHL WIDERSTÄNDE: GENAU ${resistorCount} Widerstände (R₁ bis R₈ verwenden)!
   Das ist PFLICHT - nicht mehr und nicht weniger!

2. EINHEITEN für diese Aufgabe:
   - Spannung: ${selectedUnits.voltageVal} ${selectedUnits.voltage}
   - Widerstände im Bereich: ${selectedUnits.resistanceRange}
   - Strom typischerweise in: ${selectedUnits.current}

3. KONTEXT für die Aufgabenstellung:
   "${randomContext}"

4. AUFGABENTYP (PFLICHT - genau diesen verwenden!):
   ${randomVariant.type}: ${randomVariant.desc}
   FOKUS: ${randomVariant.focus}

5. ANZAHL ANTWORTEN: Mindestens ${Math.max(randomVariant.answers, minAnswers)} verschiedene Werte müssen berechnet werden!

   WICHTIG - Wähle die richtigen physikalischen Größen je nach Fokus:
   ${randomVariant.focus === 'Widerstand' ? '→ Frage nach: R_ges, R_ersatz (Ersatzwiderstand von Teilschaltungen) in Ω oder kΩ' : ''}
   ${randomVariant.focus === 'Spannung' ? '→ Frage nach: U₁, U₂, U₃... (Teilspannungen) in V oder mV' : ''}
   ${randomVariant.focus === 'Strom' ? '→ Frage nach: I_ges, I₁, I₂... (Ströme) in A oder mA' : ''}
   ${randomVariant.focus === 'Widerstand+Strom' ? '→ Frage nach: R_ges (Ω) UND I_ges (A oder mA)' : ''}
   ${randomVariant.focus === 'Widerstand+Spannung' ? '→ Frage nach: R_ges (Ω) UND Teilspannungen (V)' : ''}
   ${randomVariant.focus === 'Strom+Spannung' ? '→ Frage nach: I_ges (A) UND Teilspannungen (V)' : ''}
   ${randomVariant.focus === 'Alles' ? '→ Frage nach: R_ges, I_ges, Teilspannungen UND Teilströme - alles gemischt!' : ''}

6. ANTWORT-EINHEIT (Umrechnung bei schweren Aufgaben!):
   Variiere die Einheiten: ${randomAnswerUnit.askIn}
   Der Schüler muss ggf. umrechnen!

=== LAYOUT-FORMAT (für Visualisierung) ===
${layoutExplanation}

${layoutExample}

=== VARIANZ-ANFORDERUNGEN ===

Die Fragestellung MUSS variieren! Beispiele:
- "Berechne den Gesamtwiderstand und den Strom durch R₂"
- "Wie groß ist die Spannung an R₁? Gib das Ergebnis in mV an."
- "Der Gesamtstrom beträgt X mA. Berechne die Teilströme."
- "Bestimme alle Teilspannungen U₁, U₂ und U₃"
- "Wie verhalten sich die Ströme I₁ und I₂ zueinander?"

=== JSON-FORMAT ===
{
  "id": "${randomSeed}-${Date.now()}",
  "circuitType": "${circuitType}",
  "difficulty": "${difficulty}",
  "circuit": {
    "type": "${circuitType}",
    "voltage": { "value": <Spannung als Zahl in VOLT (intern immer V)> },
    "resistors": [
      { "id": "r1", "value": <Widerstand als Zahl in OHM (intern immer Ω)>, "label": "R₁" },
      { "id": "r2", "value": <Widerstand in Ohm>, "label": "R₂" },
      // ... weitere Widerstände bis r${resistorCount}
    ],
    "layout": <LAYOUT ARRAY>,
    "description": "<Lesbare Beschreibung>"
  },
  "question": "<KREATIVE Aufgabenstellung mit Kontext - ALLE zu berechnenden Werte nennen!>",
  "requiredAnswers": [
    // MINDESTENS ${Math.max(randomVariant.answers, minAnswers)} Antworten!
    // Wähle passend zum FOKUS "${randomVariant.focus}":

    // Beispiele für WIDERSTAND:
    // { "id": "r_ges", "label": "Gesamtwiderstand R_ges", "unit": "Ω", "correctValue": 150, "tolerance": 0.05 }
    // { "id": "r_ersatz", "label": "Ersatzwiderstand der Parallelschaltung", "unit": "kΩ", "correctValue": 2.5, "tolerance": 0.05 }

    // Beispiele für SPANNUNG:
    // { "id": "u1", "label": "Spannung U₁ an R₁", "unit": "V", "correctValue": 4.8, "tolerance": 0.05 }
    // { "id": "u2", "label": "Spannung U₂ an R₂", "unit": "mV", "correctValue": 720, "tolerance": 0.05 }

    // Beispiele für STROM:
    // { "id": "i_ges", "label": "Gesamtstrom I_ges", "unit": "mA", "correctValue": 80, "tolerance": 0.05 }
    // { "id": "i1", "label": "Strom I₁ durch R₁", "unit": "A", "correctValue": 0.08, "tolerance": 0.05 }
  ]
}

=== BERECHNUNGSREGELN ===
- Reihenschaltung: R_ges = R1 + R2, I überall gleich, U_n = I × R_n
- Parallelschaltung: 1/R_ges = 1/R1 + 1/R2, U überall gleich, I_n = U / R_n
- Einheiten: 1 kΩ = 1000 Ω, 1 mA = 0.001 A, 1 mV = 0.001 V

WICHTIG:
- correctValue muss in der unit des requiredAnswer sein! (z.B. wenn unit="mA", dann correctValue in Milliampere)
- Überprüfe deine Berechnungen DREIFACH!
- Gib NUR das JSON zurück, keinen anderen Text!`

  const response = await callClaude(apiKey, [{ role: 'user', content: userMessage }], systemPrompt)

  // Parse JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Keine gültige JSON-Antwort erhalten')
  }

  const exercise = JSON.parse(jsonMatch[0]) as Exercise
  return exercise
}

export async function checkAnswers(
  apiKey: string,
  exercise: Exercise,
  userAnswers: UserAnswer[]
): Promise<CheckResult> {
  // First, do a local check
  const results: AnswerResult[] = exercise.requiredAnswers.map((required) => {
    const userAnswer = userAnswers.find((a) => a.answerId === required.id)
    const userValue = userAnswer?.value ?? null

    let isCorrect = false
    if (userValue !== null) {
      const tolerance = required.correctValue * required.tolerance
      isCorrect = Math.abs(userValue - required.correctValue) <= tolerance
    }

    return {
      answerId: required.id,
      label: required.label,
      userValue,
      correctValue: required.correctValue,
      unit: required.unit,
      isCorrect,
    }
  })

  const allCorrect = results.every((r) => r.isCorrect)

  // If there are wrong answers, get explanation from Claude
  let explanation: string | undefined
  if (!allCorrect) {
    explanation = await getExplanation(apiKey, exercise, results)
  }

  return {
    isCorrect: allCorrect,
    answers: results,
    explanation,
  }
}

async function getExplanation(
  apiKey: string,
  exercise: Exercise,
  results: AnswerResult[]
): Promise<string> {
  const wrongAnswers = results.filter((r) => !r.isCorrect)

  const systemPrompt = `Du bist ein geduldiger Physiklehrer für die 8. Klasse.
Erkläre Schritt für Schritt, wie man die Aufgabe richtig löst.
Verwende einfache Sprache und zeige alle Rechenschritte.
Formatiere deine Antwort mit Markdown für bessere Lesbarkeit.`

  const circuitInfo = `
Schaltungstyp: ${exercise.circuit.type === 'series' ? 'Reihenschaltung' : exercise.circuit.type === 'parallel' ? 'Parallelschaltung' : 'Gemischte Schaltung'}
Spannung: ${exercise.circuit.voltage.value} V
Widerstände: ${exercise.circuit.resistors.map(r => `${r.label} = ${r.value} Ω`).join(', ')}
${exercise.circuit.description ? `Struktur: ${exercise.circuit.description}` : ''}
`

  const wrongInfo = wrongAnswers.map(w =>
    `- ${w.label}: Schüler hat ${w.userValue !== null ? `${w.userValue} ${w.unit}` : 'keine Antwort'} eingegeben, richtig wäre ${w.correctValue} ${w.unit}`
  ).join('\n')

  const userMessage = `Der Schüler hat folgende Aufgabe bearbeitet:

${exercise.question}

${circuitInfo}

Folgende Antworten waren falsch:
${wrongInfo}

Bitte erkläre Schritt für Schritt:
1. Welche Formeln werden benötigt?
2. Wie setzt man die Werte ein?
3. Wie berechnet man das Ergebnis?

Sei ermutigend und erkläre, wo der Denkfehler liegen könnte.`

  const response = await callClaude(apiKey, [{ role: 'user', content: userMessage }], systemPrompt)
  return response
}

export async function getSolutionSteps(
  apiKey: string,
  exercise: Exercise
): Promise<string> {
  const systemPrompt = `Du bist ein geduldiger und freundlicher Physiklehrer für die 8. Klasse in Deutschland.
Deine Aufgabe ist es, den KOMPLETTEN Lösungsweg einer Aufgabe Schritt für Schritt zu erklären.
Schreibe so, dass ein 13-14 jähriger Schüler es gut verstehen kann.
Verwende Markdown zur Formatierung.`

  const circuitInfo = `
**Schaltungstyp:** ${exercise.circuit.type === 'series' ? 'Reihenschaltung' : exercise.circuit.type === 'parallel' ? 'Parallelschaltung' : 'Gemischte Schaltung'}
**Gesamtspannung:** U = ${exercise.circuit.voltage.value} V
**Widerstände:** ${exercise.circuit.resistors.map(r => `${r.label} = ${r.value} Ω`).join(', ')}
${exercise.circuit.description ? `**Struktur:** ${exercise.circuit.description}` : ''}
`

  const answersInfo = exercise.requiredAnswers.map(a =>
    `- ${a.label}: ${a.correctValue} ${a.unit}`
  ).join('\n')

  const userMessage = `Erkläre den VOLLSTÄNDIGEN Lösungsweg für folgende Aufgabe:

## Aufgabenstellung
${exercise.question}

## Gegebene Werte
${circuitInfo}

## Gesuchte Werte
${answersInfo}

---

Bitte erkläre die Lösung in folgender Struktur:

### 📝 Schritt 1: Was ist gegeben?
Liste alle gegebenen Werte übersichtlich auf.

### 📝 Schritt 2: Was ist gesucht?
Liste alle gesuchten Werte auf.

### 📝 Schritt 3: Welche Formeln brauchen wir?
Erkläre kurz die relevanten Formeln:
- Für Reihenschaltung: R_ges = R₁ + R₂ + ...
- Für Parallelschaltung: 1/R_ges = 1/R₁ + 1/R₂ + ...
- Ohmsches Gesetz: U = R × I
- etc.

### 📝 Schritt 4: Berechnung (ausführlich!)
Zeige JEDEN Rechenschritt einzeln:
1. Schreibe die Formel hin
2. Setze die Zahlen ein
3. Rechne Schritt für Schritt aus
4. Schreibe das Ergebnis mit Einheit

### 📝 Schritt 5: Zusammenfassung
Fasse alle Ergebnisse übersichtlich zusammen.

### 💡 Tipp
Gib einen hilfreichen Merksatz oder Tipp für ähnliche Aufgaben.

WICHTIG:
- Erkläre JEDEN Zwischenschritt - überspringe nichts!
- Verwende einfache Sprache
- Zeige bei Brüchen/Divisionen den Rechenweg
- Runde sinnvoll und erkläre warum
- Achte auf die richtigen Einheiten (Ω, V, A, mA, kΩ, etc.)
- KEINE ASCII-Diagramme oder Schaltbilder zeichnen! Der Schüler sieht bereits das Schaltbild oben.
- Beschreibe die Schaltung nur mit Text, z.B. "R₁ und R₂ sind parallel, diese Kombination ist in Reihe mit R₃"`

  const response = await callClaude(apiKey, [{ role: 'user', content: userMessage }], systemPrompt)
  return response
}

export async function getHint(
  apiKey: string,
  exercise: Exercise
): Promise<string> {
  const systemPrompt = `Du bist ein freundlicher Physiklehrer für die 8. Klasse in Deutschland.
Deine Aufgabe ist es, dem Schüler HINWEISE zu geben, wie er die Aufgabe lösen kann - OHNE die Lösung zu verraten!
Du sollst den Schüler zum selbstständigen Denken anregen.`

  const circuitInfo = `
**Schaltungstyp:** ${exercise.circuit.type === 'series' ? 'Reihenschaltung' : exercise.circuit.type === 'parallel' ? 'Parallelschaltung' : 'Gemischte Schaltung'}
**Gesamtspannung:** U = ${exercise.circuit.voltage.value} V
**Widerstände:** ${exercise.circuit.resistors.map(r => `${r.label} = ${r.value} Ω`).join(', ')}
${exercise.circuit.description ? `**Struktur:** ${exercise.circuit.description}` : ''}
`

  const answersNeeded = exercise.requiredAnswers.map(a =>
    `- ${a.label} (${a.unit})`
  ).join('\n')

  const userMessage = `Der Schüler braucht Hilfe bei folgender Aufgabe:

## Aufgabenstellung
${exercise.question}

## Gegebene Werte
${circuitInfo}

## Gesuchte Werte
${answersNeeded}

---

Gib dem Schüler HINWEISE, wie er vorgehen soll. Struktur:

### 🤔 Überlege zuerst
- Was für eine Schaltung ist das?
- Was weißt du über diese Schaltungsart?

### 📚 Diese Formeln könnten helfen
- Nenne die relevanten Formeln (z.B. Ohmsches Gesetz, Kirchhoff)
- Erkläre KURZ, wann man welche Formel verwendet

### 🎯 So gehst du vor
- Gib eine Schritt-für-Schritt-Anleitung (OHNE konkrete Zahlen!)
- Z.B. "Berechne zuerst den Gesamtwiderstand, dann..."

### 💡 Tipp
- Ein hilfreicher Merksatz oder Denkanstoß

WICHTIG:
- Verrate NICHT die konkreten Ergebnisse!
- Setze KEINE Zahlen in Formeln ein!
- Gib nur die RICHTUNG vor, nicht die Lösung!
- Der Schüler soll selbst rechnen und denken!
- Halte dich kurz und prägnant (max. 200 Wörter)`

  const response = await callClaude(apiKey, [{ role: 'user', content: userMessage }], systemPrompt)
  return response
}

// Formel-Lerner Typen
export interface FormulaQuestion {
  id: string
  category: 'ohm' | 'series' | 'parallel' | 'kirchhoff'
  question: string
  correctFormula: string
  hint?: string
}

export interface FormulaCheckResult {
  isCorrect: boolean
  feedback: string
  encouragement: string
}

// Vordefinierte Formel-Fragen
export const formulaQuestions: FormulaQuestion[] = [
  // Ohmsches Gesetz
  { id: 'ohm1', category: 'ohm', question: 'Wie lautet das Ohmsche Gesetz für die Spannung U?', correctFormula: 'U = R × I', hint: 'Die Spannung hängt vom Widerstand und Strom ab.' },
  { id: 'ohm2', category: 'ohm', question: 'Wie berechnet man den Strom I nach dem Ohmschen Gesetz?', correctFormula: 'I = U / R', hint: 'Der Strom ergibt sich aus Spannung geteilt durch...' },
  { id: 'ohm3', category: 'ohm', question: 'Wie berechnet man den Widerstand R nach dem Ohmschen Gesetz?', correctFormula: 'R = U / I', hint: 'Der Widerstand ist das Verhältnis von Spannung zu...' },

  // Reihenschaltung
  { id: 'series1', category: 'series', question: 'Wie berechnet man den Gesamtwiderstand R_ges in einer Reihenschaltung?', correctFormula: 'R_ges = R₁ + R₂ + ...', hint: 'Die Widerstände werden einfach...' },
  { id: 'series2', category: 'series', question: 'Wie verhält sich der Strom I in einer Reihenschaltung?', correctFormula: 'I = I₁ = I₂ = ... (überall gleich)', hint: 'Es gibt nur einen Weg für den Strom.' },
  { id: 'series3', category: 'series', question: 'Wie berechnet man die Gesamtspannung U_ges in einer Reihenschaltung?', correctFormula: 'U_ges = U₁ + U₂ + ...', hint: 'Die Teilspannungen werden...' },
  { id: 'series4', category: 'series', question: 'Wie berechnet man eine Teilspannung U₁ in einer Reihenschaltung?', correctFormula: 'U₁ = R₁ × I', hint: 'Nutze das Ohmsche Gesetz mit dem Teilwiderstand.' },

  // Parallelschaltung
  { id: 'parallel1', category: 'parallel', question: 'Wie berechnet man den Gesamtwiderstand R_ges in einer Parallelschaltung?', correctFormula: '1/R_ges = 1/R₁ + 1/R₂ + ...', hint: 'Die Kehrwerte der Widerstände werden...' },
  { id: 'parallel2', category: 'parallel', question: 'Wie verhält sich die Spannung U in einer Parallelschaltung?', correctFormula: 'U = U₁ = U₂ = ... (überall gleich)', hint: 'Alle Zweige liegen an der gleichen...' },
  { id: 'parallel3', category: 'parallel', question: 'Wie berechnet man den Gesamtstrom I_ges in einer Parallelschaltung?', correctFormula: 'I_ges = I₁ + I₂ + ...', hint: 'Die Teilströme werden...' },
  { id: 'parallel4', category: 'parallel', question: 'Wie berechnet man einen Teilstrom I₁ in einer Parallelschaltung?', correctFormula: 'I₁ = U / R₁', hint: 'Nutze das Ohmsche Gesetz mit dem Teilwiderstand.' },

  // Kirchhoffsche Regeln
  { id: 'kirch1', category: 'kirchhoff', question: 'Was besagt die Knotenregel (1. Kirchhoffsches Gesetz)?', correctFormula: 'Summe aller Ströme = 0 (oder: I_zu = I_ab)', hint: 'An einem Knotenpunkt gilt für die Ströme...' },
  { id: 'kirch2', category: 'kirchhoff', question: 'Was besagt die Maschenregel (2. Kirchhoffsches Gesetz)?', correctFormula: 'Summe aller Spannungen in einer Masche = 0', hint: 'In einem geschlossenen Stromkreis gilt für die Spannungen...' },
]

export async function checkFormulaAnswer(
  apiKey: string,
  question: FormulaQuestion,
  userAnswer: string
): Promise<FormulaCheckResult> {
  const systemPrompt = `Du bist ein freundlicher Physiklehrer für die 8. Klasse in Deutschland.
Du prüfst, ob die Antwort eines Schülers auf eine Formelfrage korrekt ist.
Sei ermutigend und erkläre kurz, wenn etwas falsch ist.
Antworte IMMER in validem JSON-Format.`

  const userMessage = `Der Schüler wurde gefragt:
"${question.question}"

Die korrekte Antwort wäre: "${question.correctFormula}"

Der Schüler hat geantwortet: "${userAnswer}"

Prüfe, ob die Antwort des Schülers INHALTLICH korrekt ist.
Dabei gilt:
- Verschiedene Schreibweisen sind OK (z.B. "U=R*I" statt "U = R × I")
- Andere Variablennamen sind OK, wenn der Zusammenhang stimmt
- Die mathematische Aussage muss stimmen
- Bei Regeln (wie Kirchhoff) muss der Kern der Aussage stimmen

Antworte im JSON-Format:
{
  "isCorrect": true/false,
  "feedback": "<Kurze Erklärung, was richtig/falsch war - max 2 Sätze>",
  "encouragement": "<Aufmunternder Satz für den Schüler>"
}`

  try {
    const response = await callClaude(apiKey, [{ role: 'user', content: userMessage }], systemPrompt)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Keine gültige JSON-Antwort')
    }
    return JSON.parse(jsonMatch[0]) as FormulaCheckResult
  } catch {
    // Fallback bei Fehler
    const isCorrect = userAnswer.toLowerCase().includes(question.correctFormula.toLowerCase().split('=')[0])
    return {
      isCorrect,
      feedback: isCorrect ? 'Das sieht richtig aus!' : `Die korrekte Formel wäre: ${question.correctFormula}`,
      encouragement: isCorrect ? 'Weiter so!' : 'Nicht aufgeben, beim nächsten Mal klappt es!'
    }
  }
}

export async function generateVoiceResponse(
  apiKey: string,
  isCorrect: boolean,
  feedback: string,
  nextQuestion?: string
): Promise<string> {
  const systemPrompt = `Du bist ein freundlicher Physiklehrer.
Formuliere eine kurze, natürlich klingende Antwort für eine Sprachausgabe.
Halte dich SEHR kurz (max 30 Wörter). Sprich den Schüler direkt an.`

  const userMessage = `Der Schüler hat gerade eine Formelfrage ${isCorrect ? 'richtig' : 'falsch'} beantwortet.
Feedback: ${feedback}
${nextQuestion ? `Die nächste Frage wird sein: "${nextQuestion}"` : 'Das war die letzte Frage.'}

Formuliere eine kurze, gesprochene Antwort. Wenn es eine nächste Frage gibt, stelle sie am Ende.`

  try {
    const response = await callClaude(apiKey, [{ role: 'user', content: userMessage }], systemPrompt)
    return response
  } catch {
    return isCorrect ? 'Richtig! Sehr gut!' : `Leider nicht ganz. ${feedback}`
  }
}
