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
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Beispiel:</h4>
            <p className="text-sm text-gray-600">
              R₁ in Reihe mit (R₂ parallel R₃):
            </p>
            <p className="text-sm mt-2 font-mono bg-white p-2 rounded border">
              R_ges = R₁ + (R₂ × R₃) / (R₂ + R₃)
            </p>
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
