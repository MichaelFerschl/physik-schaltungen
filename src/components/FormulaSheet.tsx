import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function FormulaSheet() {
  return (
    <div className="space-y-6">
      {/* Ohmsches Gesetz */}
      <Card>
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="text-blue-800">Ohmsches Gesetz</CardTitle>
          <CardDescription>Die grundlegende Beziehung zwischen Spannung, Stromstärke und Widerstand</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <FormulaBox
              formula="U = R × I"
              description="Spannung berechnen"
              variables={[
                { symbol: 'U', name: 'Spannung', unit: 'Volt (V)' },
                { symbol: 'R', name: 'Widerstand', unit: 'Ohm (Ω)' },
                { symbol: 'I', name: 'Stromstärke', unit: 'Ampere (A)' },
              ]}
            />
            <FormulaBox
              formula="I = U / R"
              description="Stromstärke berechnen"
              variables={[
                { symbol: 'I', name: 'Stromstärke', unit: 'Ampere (A)' },
                { symbol: 'U', name: 'Spannung', unit: 'Volt (V)' },
                { symbol: 'R', name: 'Widerstand', unit: 'Ohm (Ω)' },
              ]}
            />
            <FormulaBox
              formula="R = U / I"
              description="Widerstand berechnen"
              variables={[
                { symbol: 'R', name: 'Widerstand', unit: 'Ohm (Ω)' },
                { symbol: 'U', name: 'Spannung', unit: 'Volt (V)' },
                { symbol: 'I', name: 'Stromstärke', unit: 'Ampere (A)' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reihenschaltung */}
      <Card>
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-green-800">Reihenschaltung</CardTitle>
          <CardDescription>Widerstände hintereinander geschaltet - der Strom fließt durch alle Widerstände</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormulaBox
                formula="R_ges = R₁ + R₂ + R₃ + ..."
                description="Gesamtwiderstand"
                highlight
                explanation="Die Widerstände werden einfach addiert"
              />
              <FormulaBox
                formula="I_ges = I₁ = I₂ = I₃ = ..."
                description="Stromstärke"
                highlight
                explanation="Der Strom ist überall gleich groß"
              />
            </div>
            <div className="space-y-4">
              <FormulaBox
                formula="U_ges = U₁ + U₂ + U₃ + ..."
                description="Gesamtspannung"
                highlight
                explanation="Die Teilspannungen ergeben zusammen die Gesamtspannung"
              />
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Merke:</h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• Der Strom ist überall gleich</li>
                  <li>• Die Spannung teilt sich auf</li>
                  <li>• Der Gesamtwiderstand ist größer als jeder einzelne Widerstand</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Beispielrechnung Reihenschaltung */}
          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border-2 border-green-300">
            <h4 className="font-semibold text-green-800 mb-3 text-lg">📝 Beispielrechnung</h4>

            {/* Schaltskizze */}
            <div className="bg-white p-4 rounded-lg mb-4 border border-green-200">
              <p className="text-sm text-green-700 mb-3 font-medium">Schaltung:</p>
              <div className="font-mono text-sm bg-green-100 p-3 rounded border border-green-300">
                <pre className="text-green-900">
{`    ┌─────[R₁ 30Ω]─────[R₂ 60Ω]─────┐
    │                                │
   ─┴─                              │
   12V                              │
   ─┬─                              │
    │                                │
    └────────────────────────────────┘`}
                </pre>
              </div>
            </div>

            {/* Gegeben */}
            <div className="bg-white p-3 rounded-lg mb-3 border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1">Gegeben:</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• U = 12V (Gesamtspannung)</li>
                <li>• R₁ = 30Ω</li>
                <li>• R₂ = 60Ω</li>
              </ul>
            </div>

            {/* Gesucht */}
            <div className="bg-white p-3 rounded-lg mb-3 border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1">Gesucht:</p>
              <p className="text-sm text-green-700">R_ges, I_ges, U₁, U₂</p>
            </div>

            {/* Lösung */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-2">Lösung:</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-green-800">1️⃣ Gesamtwiderstand berechnen:</p>
                  <p className="font-mono bg-green-50 p-2 rounded mt-1 text-green-900">
                    R_ges = R₁ + R₂ = 30Ω + 60Ω = <strong>90Ω</strong>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-green-800">2️⃣ Gesamtstrom berechnen (Ohmsches Gesetz):</p>
                  <p className="font-mono bg-green-50 p-2 rounded mt-1 text-green-900">
                    I_ges = U / R_ges = 12V / 90Ω = <strong>0,133A</strong> (≈ 133mA)
                  </p>
                </div>
                <div>
                  <p className="font-medium text-green-800">3️⃣ Teilspannungen berechnen:</p>
                  <p className="font-mono bg-green-50 p-2 rounded mt-1 text-green-900">
                    U₁ = R₁ × I = 30Ω × 0,133A = <strong>4V</strong><br/>
                    U₂ = R₂ × I = 60Ω × 0,133A = <strong>8V</strong>
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded border border-green-300">
                  <p className="font-medium text-green-800">✓ Kontrolle:</p>
                  <p className="text-green-700">U₁ + U₂ = 4V + 8V = 12V ✓</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parallelschaltung */}
      <Card>
        <CardHeader className="bg-orange-50 rounded-t-lg">
          <CardTitle className="text-orange-800">Parallelschaltung</CardTitle>
          <CardDescription>Widerstände nebeneinander geschaltet - der Strom teilt sich auf</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormulaBox
                formula="1/R_ges = 1/R₁ + 1/R₂ + 1/R₃ + ..."
                description="Gesamtwiderstand (Kehrwert)"
                highlight
                explanation="Die Kehrwerte der Widerstände werden addiert"
              />
              <FormulaBox
                formula="R_ges = (R₁ × R₂) / (R₁ + R₂)"
                description="Für 2 Widerstände"
                explanation="Vereinfachte Formel für zwei parallele Widerstände"
              />
            </div>
            <div className="space-y-4">
              <FormulaBox
                formula="U_ges = U₁ = U₂ = U₃ = ..."
                description="Spannung"
                highlight
                explanation="Die Spannung ist an allen Widerständen gleich"
              />
              <FormulaBox
                formula="I_ges = I₁ + I₂ + I₃ + ..."
                description="Gesamtstrom"
                highlight
                explanation="Die Teilströme ergeben zusammen den Gesamtstrom"
              />
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Merke:</h4>
                <ul className="text-sm space-y-1 text-orange-700">
                  <li>• Die Spannung ist überall gleich</li>
                  <li>• Der Strom teilt sich auf</li>
                  <li>• Der Gesamtwiderstand ist kleiner als der kleinste Einzelwiderstand</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Beispielrechnung Parallelschaltung */}
          <div className="mt-6 bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-lg border-2 border-orange-300">
            <h4 className="font-semibold text-orange-800 mb-3 text-lg">📝 Beispielrechnung</h4>

            {/* Schaltskizze */}
            <div className="bg-white p-4 rounded-lg mb-4 border border-orange-200">
              <p className="text-sm text-orange-700 mb-3 font-medium">Schaltung:</p>
              <div className="font-mono text-sm bg-orange-100 p-3 rounded border border-orange-300">
                <pre className="text-orange-900">
{`    ┌────────────┬────────────┐
    │            │            │
   ─┴─        [R₁ 60Ω]   [R₂ 30Ω]
   12V           │            │
   ─┬─           │            │
    │            │            │
    └────────────┴────────────┘`}
                </pre>
              </div>
            </div>

            {/* Gegeben */}
            <div className="bg-white p-3 rounded-lg mb-3 border border-orange-200">
              <p className="text-sm font-semibold text-orange-800 mb-1">Gegeben:</p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• U = 12V (Gesamtspannung)</li>
                <li>• R₁ = 60Ω</li>
                <li>• R₂ = 30Ω</li>
              </ul>
            </div>

            {/* Gesucht */}
            <div className="bg-white p-3 rounded-lg mb-3 border border-orange-200">
              <p className="text-sm font-semibold text-orange-800 mb-1">Gesucht:</p>
              <p className="text-sm text-orange-700">R_ges, I_ges, I₁, I₂</p>
            </div>

            {/* Lösung */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <p className="text-sm font-semibold text-orange-800 mb-2">Lösung:</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-orange-800">1️⃣ Gesamtwiderstand berechnen (Kehrwert-Formel):</p>
                  <p className="font-mono bg-orange-50 p-2 rounded mt-1 text-orange-900">
                    1/R_ges = 1/R₁ + 1/R₂ = 1/60 + 1/30<br/>
                    1/R_ges = 1/60 + 2/60 = 3/60 = 1/20<br/>
                    R_ges = <strong>20Ω</strong>
                  </p>
                  <p className="text-xs text-orange-600 mt-1 italic">
                    💡 Alternative: R_ges = (R₁ × R₂)/(R₁ + R₂) = (60 × 30)/(60 + 30) = 1800/90 = 20Ω
                  </p>
                </div>
                <div>
                  <p className="font-medium text-orange-800">2️⃣ Gesamtstrom berechnen (Ohmsches Gesetz):</p>
                  <p className="font-mono bg-orange-50 p-2 rounded mt-1 text-orange-900">
                    I_ges = U / R_ges = 12V / 20Ω = <strong>0,6A</strong> (= 600mA)
                  </p>
                </div>
                <div>
                  <p className="font-medium text-orange-800">3️⃣ Teilströme berechnen (U ist überall gleich!):</p>
                  <p className="font-mono bg-orange-50 p-2 rounded mt-1 text-orange-900">
                    I₁ = U / R₁ = 12V / 60Ω = <strong>0,2A</strong> (= 200mA)<br/>
                    I₂ = U / R₂ = 12V / 30Ω = <strong>0,4A</strong> (= 400mA)
                  </p>
                </div>
                <div className="bg-orange-100 p-2 rounded border border-orange-300">
                  <p className="font-medium text-orange-800">✓ Kontrolle:</p>
                  <p className="text-orange-700">I₁ + I₂ = 0,2A + 0,4A = 0,6A = I_ges ✓</p>
                </div>
              </div>
            </div>

            {/* Wichtiger Hinweis */}
            <div className="mt-3 bg-amber-100 p-3 rounded-lg border border-amber-300">
              <p className="text-xs font-semibold text-amber-800 mb-1">💡 Wichtig bei Parallelschaltung:</p>
              <p className="text-xs text-amber-700">
                Durch den kleineren Widerstand (R₂ = 30Ω) fließt der größere Strom (I₂ = 0,4A)!<br/>
                Der Gesamtwiderstand (20Ω) ist kleiner als der kleinste Einzelwiderstand (30Ω)!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gemischte Schaltung */}
      <Card>
        <CardHeader className="bg-purple-50 rounded-t-lg">
          <CardTitle className="text-purple-800">Gemischte Schaltung</CardTitle>
          <CardDescription>Kombination aus Reihen- und Parallelschaltung</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">Vorgehensweise:</h4>
            <ol className="text-sm space-y-2 text-purple-700 list-decimal list-inside">
              <li><strong>Schritt 1:</strong> Erkenne welche Widerstände in Reihe und welche parallel geschaltet sind</li>
              <li><strong>Schritt 2:</strong> Fasse zuerst die parallelen Widerstände zu einem Ersatzwiderstand zusammen</li>
              <li><strong>Schritt 3:</strong> Berechne dann die Reihenschaltung mit dem Ersatzwiderstand</li>
              <li><strong>Schritt 4:</strong> Berechne Ströme und Spannungen von außen nach innen</li>
            </ol>
          </div>

          {/* Beispiel 1: Reihen-Parallel */}
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-lg border-2 border-purple-300">
            <h4 className="font-semibold text-purple-800 mb-3 text-lg">📝 Beispiel 1: Reihen-Parallelschaltung</h4>

            <div className="bg-white p-4 rounded-lg border border-purple-200 font-mono text-xs mb-4 overflow-x-auto">
              <pre className="text-purple-900">{`
    ┌────[R₁=40Ω]────┬─────────┐
    │                │         │
   ┌┴┐             [R₂=60Ω] [R₃=30Ω]
   │ │ U=12V         │         │
   │ │               │         │
   └┬┘               │         │
    └────────────────┴─────────┘

  R₁ in Reihe mit (R₂ parallel zu R₃)
              `}</pre>
            </div>

            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-sm font-semibold text-purple-800 mb-2">📊 Gegeben:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• R₁ = 40 Ω (in Reihe)</li>
                <li>• R₂ = 60 Ω (parallel zu R₃)</li>
                <li>• R₃ = 30 Ω (parallel zu R₂)</li>
                <li>• U = 12 V (Gesamtspannung)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-sm font-semibold text-purple-800 mb-2">❓ Gesucht:</p>
              <p className="text-sm ml-4">R<sub>ges</sub>, I<sub>ges</sub>, U₁, U<sub>parallel</sub>, I₂, I₃</p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-semibold text-purple-800 mb-3">✏️ Lösung:</p>

              <div className="space-y-4">
                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">1️⃣ Parallelteil berechnen (R₂ || R₃):</p>
                  <p className="text-sm mt-1 font-mono">R<sub>parallel</sub> = (R₂ × R₃) / (R₂ + R₃)</p>
                  <p className="text-sm mt-1 font-mono">R<sub>parallel</sub> = (60Ω × 30Ω) / (60Ω + 30Ω) = 1800 / 90 = 20 Ω</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">2️⃣ Gesamtwiderstand berechnen:</p>
                  <p className="text-sm mt-1 font-mono">R<sub>ges</sub> = R₁ + R<sub>parallel</sub></p>
                  <p className="text-sm mt-1 font-mono">R<sub>ges</sub> = 40Ω + 20Ω = 60 Ω</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">3️⃣ Gesamtstrom berechnen:</p>
                  <p className="text-sm mt-1 font-mono">I<sub>ges</sub> = U / R<sub>ges</sub> = 12V / 60Ω = 0,2 A</p>
                  <p className="text-sm mt-1 text-purple-600">💡 Dieser Strom fließt durch R₁ und teilt sich dann auf R₂ und R₃ auf</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">4️⃣ Spannungen berechnen:</p>
                  <p className="text-sm mt-1 font-mono">U₁ = R₁ × I<sub>ges</sub> = 40Ω × 0,2A = 8 V</p>
                  <p className="text-sm mt-1 font-mono">U<sub>parallel</sub> = R<sub>parallel</sub> × I<sub>ges</sub> = 20Ω × 0,2A = 4 V</p>
                  <p className="text-sm mt-1 text-purple-600">💡 U₂ = U₃ = 4V (parallel = gleiche Spannung!)</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">5️⃣ Ströme im Parallelteil:</p>
                  <p className="text-sm mt-1 font-mono">I₂ = U<sub>parallel</sub> / R₂ = 4V / 60Ω ≈ 0,07 A</p>
                  <p className="text-sm mt-1 font-mono">I₃ = U<sub>parallel</sub> / R₃ = 4V / 30Ω ≈ 0,13 A</p>
                </div>

                <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-1">✓ Kontrolle:</p>
                  <p className="text-sm text-green-700">U₁ + U<sub>parallel</sub> = 8V + 4V = 12V ✓</p>
                  <p className="text-sm text-green-700">I₂ + I₃ = 0,07A + 0,13A = 0,2A = I<sub>ges</sub> ✓</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beispiel 2: Reihe mit zwei Parallelteilen */}
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-lg border-2 border-purple-300">
            <h4 className="font-semibold text-purple-800 mb-3 text-lg">📝 Beispiel 2: Zwei hintereinandergeschaltete Parallelschaltungen</h4>

            <div className="bg-white p-4 rounded-lg border border-purple-200 font-mono text-xs mb-4 overflow-x-auto">
              <pre className="text-purple-900">{`
    ┌──┬─────────┬──┬─────────┬──┐
    │  │         │  │         │  │
   ┌┴┐[R₁=60Ω][R₂=30Ω][R₃=40Ω][R₄=60Ω]
   │ │  │         │  │         │  │
   │ │  │         │  │         │  │
   └┬┘  │         │  │         │  │
    └───┴─────────┴──┴─────────┴──┘
       U=18V

  Parallelteil 1: R₁ || R₂  in Reihe mit  Parallelteil 2: R₃ || R₄
              `}</pre>
            </div>

            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-sm font-semibold text-purple-800 mb-2">📊 Gegeben:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• R₁ = 60 Ω (parallel zu R₂)</li>
                <li>• R₂ = 30 Ω (parallel zu R₁)</li>
                <li>• R₃ = 40 Ω (parallel zu R₄)</li>
                <li>• R₄ = 60 Ω (parallel zu R₃)</li>
                <li>• U = 18 V (Gesamtspannung)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg mb-3">
              <p className="text-sm font-semibold text-purple-800 mb-2">❓ Gesucht:</p>
              <p className="text-sm ml-4">R<sub>ges</sub>, I<sub>ges</sub>, U<sub>parallel1</sub>, U<sub>parallel2</sub></p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-semibold text-purple-800 mb-3">✏️ Lösung:</p>

              <div className="space-y-4">
                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">1️⃣ Ersten Parallelteil berechnen (R₁ || R₂):</p>
                  <p className="text-sm mt-1 font-mono">R<sub>p1</sub> = (R₁ × R₂) / (R₁ + R₂)</p>
                  <p className="text-sm mt-1 font-mono">R<sub>p1</sub> = (60Ω × 30Ω) / (60Ω + 30Ω) = 1800 / 90 = 20 Ω</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">2️⃣ Zweiten Parallelteil berechnen (R₃ || R₄):</p>
                  <p className="text-sm mt-1 font-mono">R<sub>p2</sub> = (R₃ × R₄) / (R₃ + R₄)</p>
                  <p className="text-sm mt-1 font-mono">R<sub>p2</sub> = (40Ω × 60Ω) / (40Ω + 60Ω) = 2400 / 100 = 24 Ω</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">3️⃣ Gesamtwiderstand berechnen (Reihenschaltung):</p>
                  <p className="text-sm mt-1 font-mono">R<sub>ges</sub> = R<sub>p1</sub> + R<sub>p2</sub></p>
                  <p className="text-sm mt-1 font-mono">R<sub>ges</sub> = 20Ω + 24Ω = 44 Ω</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">4️⃣ Gesamtstrom berechnen:</p>
                  <p className="text-sm mt-1 font-mono">I<sub>ges</sub> = U / R<sub>ges</sub> = 18V / 44Ω ≈ 0,41 A</p>
                  <p className="text-sm mt-1 text-purple-600">💡 Dieser Strom fließt durch beide Parallelteile</p>
                </div>

                <div className="border-l-4 border-purple-400 pl-3">
                  <p className="text-sm font-semibold text-purple-700">5️⃣ Spannungen an den Parallelteilen:</p>
                  <p className="text-sm mt-1 font-mono">U<sub>p1</sub> = R<sub>p1</sub> × I<sub>ges</sub> = 20Ω × 0,41A ≈ 8,2 V</p>
                  <p className="text-sm mt-1 font-mono">U<sub>p2</sub> = R<sub>p2</sub> × I<sub>ges</sub> = 24Ω × 0,41A ≈ 9,84 V</p>
                  <p className="text-sm mt-1 text-purple-600">💡 An R₁ und R₂ liegen je 8,2V, an R₃ und R₄ liegen je 9,84V</p>
                </div>

                <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-1">✓ Kontrolle:</p>
                  <p className="text-sm text-green-700">U<sub>p1</sub> + U<sub>p2</sub> = 8,2V + 9,84V ≈ 18V ✓</p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-purple-100 p-3 rounded-lg border border-purple-300">
              <p className="text-xs text-purple-800">
                <strong>💡 Wichtiger Hinweis:</strong> Bei hintereinandergeschalteten Parallelteilen fließt durch beide Teile der gleiche Strom (I<sub>ges</sub>), aber die Spannungen können unterschiedlich sein. Der Parallelteil mit dem größeren Widerstand bekommt die größere Spannung!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kirchhoffsche Regeln */}
      <Card>
        <CardHeader className="bg-gray-100 rounded-t-lg">
          <CardTitle className="text-gray-800">Kirchhoffsche Regeln</CardTitle>
          <CardDescription>Grundlegende Gesetze für elektrische Netzwerke</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">1. Knotenregel (Stromregel)</h4>
              <p className="font-mono text-lg mb-2">ΣI = 0</p>
              <p className="text-sm text-blue-700">
                Die Summe aller Ströme in einem Knoten ist null.
                Anders gesagt: Was hineinfließt, muss auch herausfließen.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">2. Maschenregel (Spannungsregel)</h4>
              <p className="font-mono text-lg mb-2">ΣU = 0</p>
              <p className="text-sm text-green-700">
                Die Summe aller Spannungen in einer geschlossenen Masche ist null.
                Die Quellspannung entspricht der Summe aller Spannungsabfälle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bruchrechnung */}
      <Card>
        <CardHeader className="bg-amber-50 rounded-t-lg">
          <CardTitle className="text-amber-800">Bruchrechnung</CardTitle>
          <CardDescription>Wichtige Grundlagen für Parallelschaltungen und Berechnungen</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Grundlagen */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-800 border-b border-amber-200 pb-1">Erweitern & Kürzen</h4>
              <FormulaBox
                formula="a/b = (a×n)/(b×n)"
                description="Erweitern (mit n multiplizieren)"
                highlight
                explanation="Beispiel: 1/2 = 2/4 = 3/6 (mit 2 bzw. 3 erweitert)"
              />
              <FormulaBox
                formula="a/b = (a÷n)/(b÷n)"
                description="Kürzen (durch n teilen)"
                highlight
                explanation="Beispiel: 6/8 = 3/4 (durch 2 gekürzt)"
              />
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700">
                  <strong>Wichtig:</strong> Beim Erweitern/Kürzen immer Zähler UND Nenner mit der gleichen Zahl!
                </p>
              </div>
            </div>

            {/* Addition/Subtraktion */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-800 border-b border-amber-200 pb-1">Addition & Subtraktion</h4>
              <FormulaBox
                formula="a/c + b/c = (a+b)/c"
                description="Addition (gleicher Nenner)"
                highlight
                explanation="Beispiel: 2/7 + 3/7 = 5/7"
              />
              <FormulaBox
                formula="a/c - b/c = (a-b)/c"
                description="Subtraktion (gleicher Nenner)"
                highlight
                explanation="Beispiel: 5/8 - 2/8 = 3/8"
              />
              <FormulaBox
                formula="a/b + c/d = (a×d + b×c)/(b×d)"
                description="Addition (verschiedene Nenner)"
                explanation="Erst auf Hauptnenner bringen!"
              />
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700">
                  <strong>Beispiel:</strong> 1/2 + 1/3 = 3/6 + 2/6 = 5/6
                </p>
              </div>
            </div>

            {/* Multiplikation/Division */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-800 border-b border-amber-200 pb-1">Multiplikation & Division</h4>
              <FormulaBox
                formula="a/b × c/d = (a×c)/(b×d)"
                description="Multiplikation"
                highlight
                explanation="Zähler mal Zähler, Nenner mal Nenner"
              />
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-2">
                <p className="text-xs text-amber-700">
                  <strong>Beispiel:</strong> 2/3 × 3/4 = 6/12 = 1/2 (gekürzt)
                </p>
              </div>
              <FormulaBox
                formula="a/b : c/d = a/b × d/c"
                description="Division (mit Kehrwert)"
                highlight
                explanation="Mit dem Kehrwert multiplizieren!"
              />
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700">
                  <strong>Beispiel:</strong> 2/3 : 4/5 = 2/3 × 5/4 = 10/12 = 5/6
                </p>
              </div>
            </div>

            {/* Kehrwert & Anwendungen */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-800 border-b border-amber-200 pb-1">Kehrwert & Anwendungen</h4>
              <FormulaBox
                formula="Kehrwert von a/b ist b/a"
                description="Kehrwert (Bruch umdrehen)"
                highlight
                explanation="Zähler und Nenner vertauschen"
              />
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-2">
                <p className="text-xs text-amber-700">
                  <strong>Beispiele:</strong><br/>
                  Kehrwert von 2/3 ist 3/2<br/>
                  Kehrwert von 5 (=5/1) ist 1/5
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Anwendung in Physik:</h5>
                <p className="text-xs text-green-700 mb-2">
                  <strong>Parallelschaltung:</strong>
                </p>
                <p className="font-mono text-sm mb-1">1/R_ges = 1/R₁ + 1/R₂</p>
                <p className="text-xs text-green-600 italic">
                  Beispiel: 1/20 + 1/30 = 3/60 + 2/60 = 5/60 = 1/12<br/>
                  → R_ges = 12Ω
                </p>
              </div>
            </div>
          </div>

          {/* Rechenregeln Zusammenfassung */}
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-300">
            <h4 className="font-semibold text-amber-800 mb-3">📌 Wichtige Rechenregeln auf einen Blick</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-amber-800">Addition/Subtraktion:</p>
                <p className="text-amber-700">→ Gleicher Nenner nötig!</p>
                <p className="text-amber-700">→ Zähler rechnen, Nenner gleich</p>
              </div>
              <div>
                <p className="font-medium text-amber-800">Multiplikation:</p>
                <p className="text-amber-700">→ Zähler × Zähler</p>
                <p className="text-amber-700">→ Nenner × Nenner</p>
              </div>
              <div>
                <p className="font-medium text-amber-800">Division:</p>
                <p className="text-amber-700">→ Mit Kehrwert multiplizieren</p>
                <p className="text-amber-700">→ "Umdrehen und mal nehmen"</p>
              </div>
            </div>
          </div>

          {/* Dezimalbrüche */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Wichtige Dezimalbrüche</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-2 rounded">
                <p className="font-mono">1/2 = 0,5</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">1/4 = 0,25</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">3/4 = 0,75</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">1/3 ≈ 0,333</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">1/5 = 0,2</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">1/10 = 0,1</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">2/3 ≈ 0,667</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-mono">1/8 = 0,125</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Einheiten-Übersicht */}
      <Card>
        <CardHeader className="bg-teal-50 rounded-t-lg">
          <CardTitle className="text-teal-800">Einheiten-Übersicht</CardTitle>
          <CardDescription>Physikalische Größen und ihre Einheiten</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Grundeinheiten */}
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-800 border-b border-teal-200 pb-1">Grundeinheiten</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-teal-50 p-2 rounded">
                  <span className="font-medium">Spannung U</span>
                  <span className="font-mono text-teal-700">Volt (V)</span>
                </div>
                <div className="flex justify-between items-center bg-teal-50 p-2 rounded">
                  <span className="font-medium">Stromstärke I</span>
                  <span className="font-mono text-teal-700">Ampere (A)</span>
                </div>
                <div className="flex justify-between items-center bg-teal-50 p-2 rounded">
                  <span className="font-medium">Widerstand R</span>
                  <span className="font-mono text-teal-700">Ohm (Ω)</span>
                </div>
              </div>
            </div>

            {/* Vorsilben - Größer */}
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-800 border-b border-teal-200 pb-1">Vorsilben (größer)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span>Kilo (k)</span>
                  <span className="font-mono">× 1.000</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span>Mega (M)</span>
                  <span className="font-mono">× 1.000.000</span>
                </div>
              </div>
              <div className="bg-teal-100 p-2 rounded text-xs">
                <p className="font-medium mb-1">Beispiele:</p>
                <p>1 kΩ = 1.000 Ω</p>
                <p>1 kV = 1.000 V</p>
                <p>1 MΩ = 1.000.000 Ω</p>
              </div>
            </div>

            {/* Vorsilben - Kleiner */}
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-800 border-b border-teal-200 pb-1">Vorsilben (kleiner)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span>Milli (m)</span>
                  <span className="font-mono">÷ 1.000</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span>Mikro (μ)</span>
                  <span className="font-mono">÷ 1.000.000</span>
                </div>
              </div>
              <div className="bg-teal-100 p-2 rounded text-xs">
                <p className="font-medium mb-1">Beispiele:</p>
                <p>1 mA = 0,001 A</p>
                <p>1 mV = 0,001 V</p>
                <p>500 mA = 0,5 A</p>
              </div>
            </div>
          </div>

          {/* Umrechnungstipps */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Umrechnungstipps</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <p className="font-medium">Von klein zu groß:</p>
                <p className="font-mono bg-white p-1 rounded mt-1">500 mA → 0,5 A (÷ 1000)</p>
                <p className="font-mono bg-white p-1 rounded mt-1">2200 Ω → 2,2 kΩ (÷ 1000)</p>
              </div>
              <div>
                <p className="font-medium">Von groß zu klein:</p>
                <p className="font-mono bg-white p-1 rounded mt-1">1,5 A → 1500 mA (× 1000)</p>
                <p className="font-mono bg-white p-1 rounded mt-1">4,7 kΩ → 4700 Ω (× 1000)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface FormulaBoxProps {
  formula: string
  description: string
  variables?: { symbol: string; name: string; unit: string }[]
  highlight?: boolean
  explanation?: string
}

function FormulaBox({ formula, description, variables, highlight, explanation }: FormulaBoxProps) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-white border-gray-300 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
      <p className="text-xs text-gray-500 mb-1">{description}</p>
      <p className="font-mono text-lg font-semibold text-gray-900">{formula}</p>
      {explanation && (
        <p className="text-xs text-gray-600 mt-2 italic">{explanation}</p>
      )}
      {variables && (
        <div className="mt-3 space-y-1">
          {variables.map((v) => (
            <p key={v.symbol} className="text-xs text-gray-600">
              <span className="font-semibold">{v.symbol}</span> = {v.name} [{v.unit}]
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
