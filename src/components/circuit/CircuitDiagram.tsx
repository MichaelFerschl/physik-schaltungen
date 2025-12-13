import type { CircuitData, CircuitElement, Resistor } from '@/types/circuit'

interface CircuitDiagramProps {
  circuit: CircuitData
  width?: number
  height?: number
}

export default function CircuitDiagram({ circuit, width = 500, height = 250 }: CircuitDiagramProps) {
  const { layout, resistors, voltage } = circuit

  // Wenn kein Layout vorhanden, Fallback
  if (!layout || layout.length === 0) {
    return <FallbackDiagram circuit={circuit} width={width} height={height} />
  }

  return (
    <LayoutBasedDiagram
      layout={layout}
      resistors={resistors}
      voltage={voltage.value}
      width={width}
      height={height}
      description={circuit.description}
    />
  )
}

interface LayoutBasedDiagramProps {
  layout: CircuitElement[]
  resistors: Resistor[]
  voltage: number
  width: number
  height: number
  description?: string
}

function LayoutBasedDiagram({ layout, resistors, voltage, width, height, description }: LayoutBasedDiagramProps) {
  const padding = 25
  const centerY = height / 2
  const resistorWidth = 50
  const resistorHeight = 18
  const parallelSpacing = 55 // Vertikaler Abstand zwischen parallelen Widerständen (erhöht für bessere Lesbarkeit)

  // Berechne die Breite für jedes Element
  const getElementWidth = (element: CircuitElement): number => {
    if (element.type === 'resistor') {
      return resistorWidth + 30 // Widerstand + Drähte
    } else {
      return resistorWidth + 50 // Parallele Widerstände + Drähte
    }
  }

  // Gesamtbreite der Layout-Elemente berechnen
  const totalLayoutWidth = layout.reduce((sum, el) => sum + getElementWidth(el), 0)
  const availableWidth = width - 2 * padding - 80 // Platz für Spannungsquelle und Rückleitung
  const scale = Math.min(1, availableWidth / totalLayoutWidth)

  // Startposition nach der Spannungsquelle
  let currentX = padding + 50

  // Finde einen Widerstand nach ID
  const getResistor = (id: string): Resistor | undefined => {
    return resistors.find(r => r.id === id)
  }

  // Rendere die Elemente
  const elements: JSX.Element[] = []
  const wireY = centerY - 30 // Y-Position der Hauptleitung

  layout.forEach((element, index) => {
    const elementWidth = getElementWidth(element) * scale

    if (element.type === 'resistor') {
      const resistor = getResistor(element.resistorId)
      if (resistor) {
        // Draht zum Widerstand
        elements.push(
          <line
            key={`wire-before-${index}`}
            x1={currentX}
            y1={wireY}
            x2={currentX + 10 * scale}
            y2={wireY}
            stroke="#333"
            strokeWidth="2"
          />
        )

        // Widerstand
        elements.push(
          <ResistorSymbol
            key={`resistor-${index}`}
            x={currentX + 10 * scale}
            y={wireY - resistorHeight / 2}
            width={resistorWidth * scale}
            height={resistorHeight}
            label={resistor.label}
            value={resistor.value}
          />
        )

        // Draht nach dem Widerstand
        elements.push(
          <line
            key={`wire-after-${index}`}
            x1={currentX + 10 * scale + resistorWidth * scale}
            y1={wireY}
            x2={currentX + elementWidth}
            y2={wireY}
            stroke="#333"
            strokeWidth="2"
          />
        )
      }
    } else if (element.type === 'parallel') {
      const parallelResistors = element.resistorIds.map(id => getResistor(id)).filter(Boolean) as Resistor[]
      const numParallel = parallelResistors.length

      if (numParallel > 0) {
        const branchStartX = currentX
        const branchEndX = currentX + elementWidth
        const parallelMidX = (branchStartX + branchEndX) / 2

        // Vertikale Positionen für die parallelen Zweige
        const totalHeight = (numParallel - 1) * parallelSpacing
        const startY = wireY - totalHeight / 2

        // Linke vertikale Verbindung
        elements.push(
          <line
            key={`parallel-left-${index}`}
            x1={branchStartX + 10 * scale}
            y1={startY}
            x2={branchStartX + 10 * scale}
            y2={startY + totalHeight}
            stroke="#333"
            strokeWidth="2"
          />
        )

        // Rechte vertikale Verbindung
        elements.push(
          <line
            key={`parallel-right-${index}`}
            x1={branchEndX - 10 * scale}
            y1={startY}
            x2={branchEndX - 10 * scale}
            y2={startY + totalHeight}
            stroke="#333"
            strokeWidth="2"
          />
        )

        // Draht zur Parallelschaltung
        elements.push(
          <line
            key={`wire-to-parallel-${index}`}
            x1={currentX}
            y1={wireY}
            x2={branchStartX + 10 * scale}
            y2={wireY}
            stroke="#333"
            strokeWidth="2"
          />
        )

        // Draht nach der Parallelschaltung
        elements.push(
          <line
            key={`wire-from-parallel-${index}`}
            x1={branchEndX - 10 * scale}
            y1={wireY}
            x2={branchEndX}
            y2={wireY}
            stroke="#333"
            strokeWidth="2"
          />
        )

        // Jeden parallelen Zweig zeichnen
        parallelResistors.forEach((resistor, pIndex) => {
          const branchY = startY + pIndex * parallelSpacing

          // Horizontale Drähte zu den Widerständen
          elements.push(
            <line
              key={`parallel-wire-left-${index}-${pIndex}`}
              x1={branchStartX + 10 * scale}
              y1={branchY}
              x2={parallelMidX - (resistorWidth * scale) / 2}
              y2={branchY}
              stroke="#333"
              strokeWidth="2"
            />
          )

          elements.push(
            <ResistorSymbol
              key={`parallel-resistor-${index}-${pIndex}`}
              x={parallelMidX - (resistorWidth * scale) / 2}
              y={branchY - resistorHeight / 2}
              width={resistorWidth * scale}
              height={resistorHeight}
              label={resistor.label}
              value={resistor.value}
            />
          )

          elements.push(
            <line
              key={`parallel-wire-right-${index}-${pIndex}`}
              x1={parallelMidX + (resistorWidth * scale) / 2}
              y1={branchY}
              x2={branchEndX - 10 * scale}
              y2={branchY}
              stroke="#333"
              strokeWidth="2"
            />
          )
        })
      }
    }

    currentX += elementWidth
  })

  const endX = currentX

  return (
    <svg width={width} height={height} className="bg-white rounded-lg border">
      {/* Spannungsquelle */}
      <VoltageSource x={padding} y={centerY} voltage={voltage} />

      {/* Draht von Spannungsquelle zum ersten Element */}
      <line x1={padding + 15} y1={centerY - 30} x2={padding + 50} y2={centerY - 30} stroke="#333" strokeWidth="2" />

      {/* Layout-Elemente */}
      {elements}

      {/* Draht zum rechten Rand */}
      <line x1={endX} y1={wireY} x2={width - padding} y2={wireY} stroke="#333" strokeWidth="2" />

      {/* Rechte vertikale Verbindung */}
      <line x1={width - padding} y1={wireY} x2={width - padding} y2={centerY + 30} stroke="#333" strokeWidth="2" />

      {/* Unterer Rückleiter */}
      <line x1={width - padding} y1={centerY + 30} x2={padding + 15} y2={centerY + 30} stroke="#333" strokeWidth="2" />

      {/* Verbindung zurück zur Spannungsquelle */}
      <line x1={padding + 15} y1={centerY + 30} x2={padding + 15} y2={centerY + 20} stroke="#333" strokeWidth="2" />

      {/* Beschreibung */}
      {description && (
        <text x={width / 2} y={height - 8} textAnchor="middle" className="text-xs fill-gray-500">
          {description}
        </text>
      )}
    </svg>
  )
}

interface ResistorSymbolProps {
  x: number
  y: number
  width: number
  height: number
  label: string
  value: number
}

function ResistorSymbol({ x, y, width, height, label, value }: ResistorSymbolProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="white"
        stroke="#333"
        strokeWidth="2"
      />
      <text
        x={x + width / 2}
        y={y - 4}
        textAnchor="middle"
        className="text-xs font-semibold fill-gray-700"
        style={{ fontSize: '10px' }}
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + height + 11}
        textAnchor="middle"
        className="text-xs fill-gray-500"
        style={{ fontSize: '9px' }}
      >
        {value} Ω
      </text>
    </g>
  )
}

interface VoltageSourceProps {
  x: number
  y: number
  voltage: number
}

function VoltageSource({ x, y, voltage }: VoltageSourceProps) {
  const radius = 18

  return (
    <g>
      <circle
        cx={x + 15}
        cy={y}
        r={radius}
        fill="white"
        stroke="#333"
        strokeWidth="2"
      />
      {/* Plus */}
      <line x1={x + 15} y1={y - 12} x2={x + 15} y2={y - 4} stroke="#333" strokeWidth="2" />
      <line x1={x + 11} y1={y - 8} x2={x + 19} y2={y - 8} stroke="#333" strokeWidth="2" />
      {/* Minus */}
      <line x1={x + 11} y1={y + 8} x2={x + 19} y2={y + 8} stroke="#333" strokeWidth="2" />
      {/* Label */}
      <text
        x={x + 15}
        y={y + 38}
        textAnchor="middle"
        className="text-xs font-semibold fill-gray-700"
        style={{ fontSize: '10px' }}
      >
        U = {voltage} V
      </text>
      {/* Anschlüsse */}
      <line x1={x + 15} y1={y - radius} x2={x + 15} y2={y - 30} stroke="#333" strokeWidth="2" />
      <line x1={x + 15} y1={y + radius} x2={x + 15} y2={y + 30} stroke="#333" strokeWidth="2" />
    </g>
  )
}

interface FallbackDiagramProps {
  circuit: CircuitData
  width: number
  height: number
}

function FallbackDiagram({ circuit, width, height }: FallbackDiagramProps) {
  const { resistors, voltage, description } = circuit
  const padding = 30
  const centerY = height / 2

  return (
    <svg width={width} height={height} className="bg-white rounded-lg border">
      <VoltageSource x={padding} y={centerY} voltage={voltage.value} />

      <text x={width / 2 + 40} y={centerY - 30} textAnchor="middle" className="text-sm font-medium fill-gray-700">
        Schaltung
      </text>

      {resistors.map((r, i) => (
        <text key={r.id} x={width / 2 + 40} y={centerY - 5 + i * 18} textAnchor="middle" className="text-xs fill-gray-600">
          {r.label} = {r.value} Ω
        </text>
      ))}

      {description && (
        <text x={width / 2} y={height - 10} textAnchor="middle" className="text-xs fill-gray-500">
          {description}
        </text>
      )}
    </svg>
  )
}
