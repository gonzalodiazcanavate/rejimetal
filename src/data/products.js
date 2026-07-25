export const PRODUCTS = [
  {
    id: 'rejilla-electrosoldada-cuadradillo-entregirado',
    name: 'Rejilla electrosoldada con cuadradillo entregirado',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-twisted',
    summary: 'Rejilla electrosoldada con pletina portante y cuadradillo transversal entregirado, fabricada a medida para paso, ventilación o mantenimiento.',
    use: 'Pasarelas, registros, plataformas, zonas técnicas y reposición de rejillas existentes.',
    adapts: 'Medida, paso de malla, altura de pletina, marco, recortes, apoyo y acabado.',
    budgetData: ['Largo y ancho', 'Paso de malla si se conoce', 'Uso previsto', 'Tipo de apoyo', 'Unidades', 'Foto o plano'],
    config: { modelType: 'grating', width: 2.15, depth: 1.05, barHeight: 0.04, barThickness: 0.028, crossThickness: 0.014, bars: 18, crosses: 28, frameThickness: 0.045, defaultMaterial: 'galvanized', twistedSquare: true },
    specs: [['Pieza', 'Rejilla electrosoldada con cuadradillo entregirado'], ['Uso habitual', 'Paso, ventilación, registro o mantenimiento'], ['Se define', 'Medida, malla, pletina portante, apoyo y acabado'], ['Datos necesarios', 'Medidas, unidades, uso, entorno y foto del hueco']]
  },
  {
    id: 'rejilla-electrosoldada-varilla-lisa',
    name: 'Rejilla electrosoldada con varilla lisa',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-rod',
    summary: 'Rejilla electrosoldada con varilla transversal lisa para aplicaciones donde se busca una superficie limpia y resistente.',
    use: 'Huecos técnicos, cubriciones, ventilación, reposición y zonas de paso ligero o medio.',
    adapts: 'Dimensiones, paso de varilla, marco perimetral, recortes y acabado.',
    budgetData: ['Medidas', 'Unidades', 'Uso', 'Entorno', 'Apoyo disponible'],
    config: { modelType: 'grating', width: 2.05, depth: 1, barHeight: 0.035, barThickness: 0.026, crossThickness: 0.012, bars: 18, crosses: 30, frameThickness: 0.04, defaultMaterial: 'steel', roundCross: true },
    specs: [['Pieza', 'Rejilla electrosoldada con varilla lisa'], ['Uso habitual', 'Cubrición, ventilación y paso técnico'], ['Se define', 'Medidas, malla, marco, recortes y acabado'], ['Datos necesarios', 'Foto o croquis del hueco y uso previsto']]
  },
  {
    id: 'rejilla-electrosoldada-perfil-proteccion',
    name: 'Rejilla electrosoldada con perfil de protección',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-profile',
    summary: 'Rejilla electrosoldada con perfil perimetral o frontal de protección para rematar cantos y mejorar el apoyo.',
    use: 'Reposiciones, huecos con borde visto, pasos de mantenimiento y zonas donde conviene proteger el canto.',
    adapts: 'Perfil, marco, medida, apoyo, recortes, malla y acabado.',
    budgetData: ['Medidas exteriores', 'Tipo de perfil', 'Foto del apoyo', 'Uso', 'Unidades'],
    config: { modelType: 'grating', width: 2.15, depth: 1.05, barHeight: 0.04, barThickness: 0.028, crossThickness: 0.014, bars: 18, crosses: 28, frameThickness: 0.052, defaultMaterial: 'galvanized', profileProtection: true, twistedSquare: true },
    specs: [['Pieza', 'Electrosoldada con perfil de protección'], ['Uso habitual', 'Apoyos vistos, remates y reposiciones'], ['Se define', 'Tipo de perfil, malla, recortes y acabado'], ['Datos necesarios', 'Medidas del hueco, apoyo y foto']]
  },
  {
    id: 'rejilla-electrosoldada-dentado-ondulado',
    name: 'Rejilla electrosoldada con dentado ondulado',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-serrated',
    summary: 'Rejilla electrosoldada con dentado ondulado para mejorar agarre en zonas húmedas, exteriores o de tránsito técnico.',
    use: 'Rampas suaves, mantenimiento, zonas exteriores, humedad, polvo o necesidad de mayor adherencia.',
    adapts: 'Dentado, malla, medida, marco, recortes y acabado.',
    budgetData: ['Medidas', 'Entorno', 'Tipo de tránsito', 'Unidades', 'Foto o plano'],
    config: { modelType: 'grating', width: 2.05, depth: 1.0, barHeight: 0.04, barThickness: 0.03, crossThickness: 0.014, bars: 17, crosses: 26, frameThickness: 0.045, defaultMaterial: 'galvanized', dentado: true, twistedSquare: true },
    specs: [['Pieza', 'Electrosoldada con dentado ondulado'], ['Uso habitual', 'Zonas con necesidad de agarre'], ['Se define', 'Dentado, malla, medida, apoyo y acabado'], ['Datos necesarios', 'Uso, entorno y tipo de paso']]
  },
  {
    id: 'rejilla-electrosoldada-dentado-ondulado-perfil',
    name: 'Rejilla electrosoldada con dentado ondulado y perfil de protección',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-serrated-profile',
    summary: 'Rejilla electrosoldada dentada con perfil de protección para zonas donde importan agarre, remate y apoyo.',
    use: 'Accesos técnicos, exteriores, zonas húmedas y reposiciones con borde protegido.',
    adapts: 'Dentado, perfil, marco, medida, recortes, apoyo y acabado.',
    budgetData: ['Medidas', 'Foto del apoyo', 'Uso', 'Entorno', 'Unidades'],
    config: { modelType: 'grating', width: 2.1, depth: 1.0, barHeight: 0.042, barThickness: 0.03, crossThickness: 0.014, bars: 17, crosses: 26, frameThickness: 0.052, defaultMaterial: 'galvanized', dentado: true, profileProtection: true, twistedSquare: true },
    specs: [['Pieza', 'Dentada con perfil de protección'], ['Uso habitual', 'Agarre y remate en una misma pieza'], ['Se define', 'Perfil, dentado, malla y acabado'], ['Datos necesarios', 'Medidas, apoyo, entorno y foto']]
  },
  {
    id: 'rejilla-electrosoldada-dentado-sierra-discontinuo',
    name: 'Rejilla electrosoldada con dentado de sierra discontinuo',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-saw',
    summary: 'Rejilla electrosoldada con dentado de sierra discontinuo para mejorar el agarre sin cerrar la superficie de paso.',
    use: 'Pasos de mantenimiento, plataformas, exteriores y zonas con riesgo de deslizamiento.',
    adapts: 'Dentado, malla, medida, apoyo, marco y acabado.',
    budgetData: ['Medidas', 'Tipo de tránsito', 'Entorno', 'Unidades', 'Foto o plano'],
    config: { modelType: 'grating', width: 2.05, depth: 1.0, barHeight: 0.045, barThickness: 0.03, crossThickness: 0.014, bars: 16, crosses: 26, frameThickness: 0.045, defaultMaterial: 'galvanized', dentado: true, twistedSquare: true },
    specs: [['Pieza', 'Electrosoldada con dentado de sierra discontinuo'], ['Uso habitual', 'Agarre en paso técnico'], ['Se define', 'Medida, dentado, malla, apoyo y acabado'], ['Datos necesarios', 'Uso real y entorno de trabajo']]
  },
  {
    id: 'rejilla-electrosoldada-dentado-sierra-discontinuo-perfil',
    name: 'Rejilla electrosoldada con dentado de sierra discontinuo y perfil de protección',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'electrowelded-saw-profile',
    summary: 'Rejilla electrosoldada dentada con perfil de protección para piezas de paso con remate reforzado.',
    use: 'Reposiciones, accesos técnicos y zonas exteriores con necesidad de agarre y borde protegido.',
    adapts: 'Dentado, perfil, medida, marco, recortes, apoyo y acabado.',
    budgetData: ['Medidas', 'Foto del apoyo', 'Uso', 'Entorno', 'Unidades'],
    config: { modelType: 'grating', width: 2.15, depth: 1.0, barHeight: 0.045, barThickness: 0.03, crossThickness: 0.014, bars: 16, crosses: 26, frameThickness: 0.055, defaultMaterial: 'galvanized', dentado: true, profileProtection: true, twistedSquare: true },
    specs: [['Pieza', 'Dentado de sierra con perfil'], ['Uso habitual', 'Paso con agarre y remate protegido'], ['Se define', 'Perfil, dentado, apoyo y acabado'], ['Datos necesarios', 'Medida del hueco y foto del borde']]
  },
  {
    id: 'rejilla-electrosoldada-tipo-offshore',
    name: 'Rejilla electrosoldada tipo Offshore',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'offshore',
    summary: 'Rejilla electrosoldada tipo offshore con trama más cerrada para zonas donde se busca mayor seguridad de paso.',
    use: 'Plataformas, mantenimiento, pasos elevados y zonas donde interesa reducir huecos libres.',
    adapts: 'Medidas, malla, apoyo, marco, recortes y acabado.',
    budgetData: ['Medidas', 'Uso', 'Tipo de tránsito', 'Entorno', 'Foto o plano'],
    config: { modelType: 'grating', width: 2.2, depth: 1.05, barHeight: 0.04, barThickness: 0.03, crossThickness: 0.012, bars: 20, crosses: 32, frameThickness: 0.045, defaultMaterial: 'galvanized', offshore: true, twistedSquare: true },
    specs: [['Pieza', 'Electrosoldada tipo Offshore'], ['Uso habitual', 'Paso técnico con hueco reducido'], ['Se define', 'Malla, medida, apoyo y acabado'], ['Datos necesarios', 'Uso, entorno y dimensiones']]
  },
  {
    id: 'rejilla-electrosoldada-tipo-offshore-seguridad',
    name: 'Rejilla electrosoldada tipo Offshore de seguridad',
    category: 'Electrosoldada',
    modelType: 'grating',
    visualType: 'offshore-safety',
    summary: 'Variante tipo offshore orientada a seguridad de paso, con configuración a revisar según uso y entorno.',
    use: 'Mantenimiento industrial, zonas elevadas, pasos técnicos y entornos donde preocupa el apoyo del pie.',
    adapts: 'Malla, medida, apoyo, recortes, borde, marco y acabado.',
    budgetData: ['Medidas', 'Uso previsto', 'Entorno', 'Carga aproximada', 'Unidades'],
    config: { modelType: 'grating', width: 2.15, depth: 1.05, barHeight: 0.045, barThickness: 0.03, crossThickness: 0.012, bars: 21, crosses: 34, frameThickness: 0.052, defaultMaterial: 'galvanized', offshore: true, dentado: true, profileProtection: true, twistedSquare: true },
    specs: [['Pieza', 'Offshore de seguridad'], ['Uso habitual', 'Paso técnico con mayor seguridad'], ['Se define', 'Malla, dentado, apoyo y acabado'], ['Datos necesarios', 'Medidas, uso y entorno']]
  },
  {
    id: 'rejilla-prensada-flejes-diferentes',
    name: 'Rejilla prensada de flejes diferentes',
    category: 'Prensada',
    modelType: 'grating',
    visualType: 'pressed-different',
    summary: 'Rejilla prensada con pletinas portantes y separadoras de diferente sección, fabricada según medida y uso.',
    use: 'Registros, ventilación, cerramientos técnicos, cubriciones y piezas donde importa el encaje.',
    adapts: 'Fleje portante, fleje separador, malla, medida, marco, recortes y acabado.',
    budgetData: ['Medidas', 'Uso', 'Marco si existe', 'Unidades', 'Foto o croquis'],
    config: { modelType: 'grating', width: 2.0, depth: 1.0, barHeight: 0.034, barThickness: 0.024, crossThickness: 0.02, bars: 15, crosses: 22, frameThickness: 0.042, defaultMaterial: 'steel', pressed: true },
    specs: [['Pieza', 'Prensada de flejes diferentes'], ['Uso habitual', 'Registro, ventilación o cubrición'], ['Se define', 'Flejes, malla, medida y acabado'], ['Datos necesarios', 'Medida, uso y foto si hay hueco existente']]
  },
  {
    id: 'rejilla-prensada-flejes-diferentes-dentado-sierra',
    name: 'Rejilla prensada de flejes diferentes con dentado de sierra continuo',
    category: 'Prensada',
    modelType: 'grating',
    visualType: 'pressed-saw',
    summary: 'Rejilla prensada con flejes diferentes y dentado de sierra continuo para aplicaciones con necesidad de agarre.',
    use: 'Paso técnico, zonas exteriores, mantenimiento y piezas que requieren mayor adherencia.',
    adapts: 'Dentado, flejes, malla, medida, recortes, apoyo y acabado.',
    budgetData: ['Medidas', 'Uso', 'Entorno', 'Unidades', 'Foto o plano'],
    config: { modelType: 'grating', width: 2.0, depth: 1.0, barHeight: 0.038, barThickness: 0.025, crossThickness: 0.02, bars: 15, crosses: 22, frameThickness: 0.042, defaultMaterial: 'galvanized', pressed: true, dentado: true },
    specs: [['Pieza', 'Prensada con dentado de sierra continuo'], ['Uso habitual', 'Paso con mayor agarre'], ['Se define', 'Flejes, dentado, apoyo y acabado'], ['Datos necesarios', 'Medida, uso y entorno']]
  },
  {
    id: 'rejilla-prensada-flejes-diferentes-dentado-ondulado',
    name: 'Rejilla prensada de flejes diferentes con dentado ondulado',
    category: 'Prensada',
    modelType: 'grating',
    visualType: 'pressed-wave',
    summary: 'Rejilla prensada con dentado ondulado, adecuada cuando se busca agarre y una geometría ordenada.',
    use: 'Cubriciones, pasos técnicos, registros y zonas donde se necesita adherencia adicional.',
    adapts: 'Dentado, flejes, malla, medida, marco, recorte y acabado.',
    budgetData: ['Medidas', 'Uso previsto', 'Entorno', 'Unidades', 'Foto o croquis'],
    config: { modelType: 'grating', width: 1.95, depth: 0.95, barHeight: 0.036, barThickness: 0.025, crossThickness: 0.02, bars: 15, crosses: 20, frameThickness: 0.04, defaultMaterial: 'galvanized', pressed: true, dentado: true },
    specs: [['Pieza', 'Prensada con dentado ondulado'], ['Uso habitual', 'Agarre y acabado ordenado'], ['Se define', 'Malla, flejes, dentado y acabado'], ['Datos necesarios', 'Medidas y uso real']]
  },
  {
    id: 'rejilla-prensada-flejes-iguales',
    name: 'Rejilla prensada de flejes iguales',
    category: 'Prensada',
    modelType: 'grating',
    visualType: 'pressed-equal',
    summary: 'Rejilla prensada con flejes de sección igual para soluciones de ventilación, protección o cubrición técnica.',
    use: 'Rejillas de registro, protecciones, ventilación, cerramientos y huecos con geometría definida.',
    adapts: 'Malla, medida, fleje, marco, recortes y acabado.',
    budgetData: ['Medidas', 'Uso', 'Hueco o marco', 'Unidades', 'Acabado'],
    config: { modelType: 'grating', width: 1.9, depth: 0.95, barHeight: 0.032, barThickness: 0.022, crossThickness: 0.022, bars: 14, crosses: 20, frameThickness: 0.04, defaultMaterial: 'steel', pressed: true },
    specs: [['Pieza', 'Prensada de flejes iguales'], ['Uso habitual', 'Ventilación, protección o registro'], ['Se define', 'Fleje, malla, medida y acabado'], ['Datos necesarios', 'Medidas, uso y unidades']]
  },
  {
    id: 'rejilla-prensada-flejes-iguales-dentado-sierra',
    name: 'Rejilla prensada de flejes iguales con dentado de sierra continuo',
    category: 'Prensada',
    modelType: 'grating',
    visualType: 'pressed-equal-saw',
    summary: 'Rejilla prensada de flejes iguales con dentado continuo para mejorar agarre en superficies de paso.',
    use: 'Pasos técnicos, mantenimiento y zonas donde interesa agarre sin perder regularidad de malla.',
    adapts: 'Dentado, fleje, paso de malla, medida, apoyo y acabado.',
    budgetData: ['Medidas', 'Uso', 'Entorno', 'Unidades', 'Foto del hueco'],
    config: { modelType: 'grating', width: 1.9, depth: 0.95, barHeight: 0.036, barThickness: 0.023, crossThickness: 0.023, bars: 14, crosses: 20, frameThickness: 0.04, defaultMaterial: 'galvanized', pressed: true, dentado: true },
    specs: [['Pieza', 'Prensada de flejes iguales con dentado de sierra'], ['Uso habitual', 'Paso con agarre'], ['Se define', 'Dentado, malla, medida y acabado'], ['Datos necesarios', 'Uso, entorno y dimensiones']]
  },
  {
    id: 'rejilla-prensada-flejes-iguales-dentado-ondulado',
    name: 'Rejilla prensada de flejes iguales con dentado ondulado',
    category: 'Prensada',
    modelType: 'grating',
    visualType: 'pressed-equal-wave',
    summary: 'Rejilla prensada de flejes iguales con dentado ondulado para piezas de paso, protección o ventilación.',
    use: 'Zonas técnicas, registros, cubriciones y pasos donde se necesita una superficie con más agarre.',
    adapts: 'Dentado, malla, fleje, medida, marco y acabado.',
    budgetData: ['Medidas', 'Uso previsto', 'Entorno', 'Unidades', 'Foto o croquis'],
    config: { modelType: 'grating', width: 1.9, depth: 0.95, barHeight: 0.035, barThickness: 0.023, crossThickness: 0.023, bars: 14, crosses: 20, frameThickness: 0.04, defaultMaterial: 'galvanized', pressed: true, dentado: true },
    specs: [['Pieza', 'Prensada de flejes iguales con dentado ondulado'], ['Uso habitual', 'Paso, registro o ventilación'], ['Se define', 'Malla, dentado, medida y acabado'], ['Datos necesarios', 'Medidas y uso real']]
  },
  {
    id: 'rejilla-metalica-manual',
    name: 'Rejilla metálica manual',
    category: 'Manual',
    modelType: 'grating',
    visualType: 'manual',
    summary: 'Rejilla metálica fabricada manualmente para trabajos especiales, medidas concretas o soluciones fuera de configuración estándar.',
    use: 'Piezas singulares, reposiciones, huecos irregulares, pequeñas series y trabajos con ajuste específico.',
    adapts: 'Medida, forma, marco, recortes, paso de malla, apoyo y acabado.',
    budgetData: ['Medidas', 'Croquis o foto', 'Uso', 'Unidades', 'Acabado'],
    config: { modelType: 'grating', width: 1.8, depth: 0.95, barHeight: 0.042, barThickness: 0.032, crossThickness: 0.018, bars: 12, crosses: 18, frameThickness: 0.05, defaultMaterial: 'steel', profileProtection: true },
    specs: [['Pieza', 'Rejilla metálica manual'], ['Uso habitual', 'Trabajos especiales o fuera de serie'], ['Se define', 'Forma, medida, recortes, marco y acabado'], ['Datos necesarios', 'Foto, croquis o muestra antigua']]
  },
  {
    id: 'peldano-rejilla-para-apoyar',
    name: 'Peldaño de rejilla para apoyar',
    category: 'Peldaños',
    modelType: 'stair',
    visualType: 'stair-support',
    summary: 'Peldaño de rejilla metálica preparado para apoyar sobre estructura existente, definido según ancho, fondo y uso.',
    use: 'Escaleras industriales, accesos técnicos, mantenimiento y sustitución de peldaños deteriorados.',
    adapts: 'Ancho, fondo, laterales, nariz, apoyo, fijación y acabado.',
    budgetData: ['Ancho y fondo', 'Foto de escalera', 'Unidades', 'Tipo de apoyo', 'Entorno'],
    config: { modelType: 'stair', width: 1.55, depth: 0.55, barHeight: 0.038, barThickness: 0.028, crossThickness: 0.014, bars: 13, crosses: 15, frameThickness: 0.045, defaultMaterial: 'galvanized', dentado: true, profileProtection: true },
    specs: [['Pieza', 'Peldaño de rejilla para apoyar'], ['Uso habitual', 'Escalera industrial o acceso técnico'], ['Se define', 'Ancho, fondo, apoyo, laterales y acabado'], ['Datos necesarios', 'Foto de escalera y unidades']]
  },
  {
    id: 'peldano-rejilla-para-soldar',
    name: 'Peldaño de rejilla para soldar',
    category: 'Peldaños',
    modelType: 'stair',
    visualType: 'stair-weld',
    summary: 'Peldaño de rejilla pensado para fijación soldada, fabricado según estructura, ancho útil y entorno de trabajo.',
    use: 'Escaleras metálicas, plataformas, accesos de mantenimiento y reposiciones.',
    adapts: 'Ancho, fondo, pletinas laterales, nariz, apoyo y acabado.',
    budgetData: ['Ancho', 'Fondo', 'Estructura de apoyo', 'Unidades', 'Foto'],
    config: { modelType: 'stair', width: 1.5, depth: 0.5, barHeight: 0.038, barThickness: 0.028, crossThickness: 0.014, bars: 12, crosses: 14, frameThickness: 0.045, defaultMaterial: 'steel', dentado: true },
    specs: [['Pieza', 'Peldaño de rejilla para soldar'], ['Uso habitual', 'Fijación soldada a estructura metálica'], ['Se define', 'Medida, laterales, apoyo y acabado'], ['Datos necesarios', 'Foto de apoyo y medidas']]
  },
  {
    id: 'peldano-rejilla-para-atornillar',
    name: 'Peldaño de rejilla para atornillar',
    category: 'Peldaños',
    modelType: 'stair',
    visualType: 'stair-bolt',
    summary: 'Peldaño de rejilla con laterales para atornillar, definido según estructura, taladros, ancho y fondo.',
    use: 'Escaleras desmontables, reposición de peldaños y accesos donde se requiere fijación mecánica.',
    adapts: 'Laterales, taladros, ancho, fondo, nariz, apoyo y acabado.',
    budgetData: ['Ancho y fondo', 'Separación de taladros', 'Foto de escalera', 'Unidades', 'Entorno'],
    config: { modelType: 'stair', width: 1.55, depth: 0.55, barHeight: 0.038, barThickness: 0.028, crossThickness: 0.014, bars: 13, crosses: 15, frameThickness: 0.05, defaultMaterial: 'galvanized', dentado: true, profileProtection: true },
    specs: [['Pieza', 'Peldaño de rejilla para atornillar'], ['Uso habitual', 'Escalera metálica con fijación mecánica'], ['Se define', 'Laterales, taladros, medida y acabado'], ['Datos necesarios', 'Foto, medidas y unidades']]
  },
  {
    id: 'alcorque-metalico-rejilla',
    name: 'Alcorque metálico de rejilla',
    category: 'Alcorque',
    modelType: 'tree',
    visualType: 'tree',
    summary: 'Alcorque metálico de rejilla para proteger el hueco del árbol y permitir paso, drenaje y ventilación.',
    use: 'Urbanización, patios, zonas exteriores, reposición de alcorques y huecos existentes.',
    adapts: 'Medida exterior, hueco central, marco, división en piezas, apoyo y acabado.',
    budgetData: ['Medida exterior', 'Hueco central', 'Foto del hueco', 'Unidades', 'Acabado'],
    config: { modelType: 'tree', width: 1.55, depth: 1.55, barHeight: 0.034, barThickness: 0.024, crossThickness: 0.014, bars: 16, crosses: 16, frameThickness: 0.045, centerHole: 0.48, defaultMaterial: 'galvanized' },
    specs: [['Pieza', 'Alcorque metálico de rejilla'], ['Uso habitual', 'Protección y drenaje en hueco de árbol'], ['Se define', 'Medida exterior, hueco central, marco y acabado'], ['Datos necesarios', 'Foto del hueco y medidas']]
  },
  {
    id: 'canaleta-drenaje-rejilla-metalica',
    name: 'Canaleta de drenaje con rejilla metálica',
    category: 'Canaleta',
    modelType: 'drain',
    visualType: 'drain',
    summary: 'Canaleta de drenaje con rejilla metálica fabricada según ancho, apoyo, longitud y entorno.',
    use: 'Drenaje en patios, pasos, zonas exteriores, naves, talleres y huecos técnicos.',
    adapts: 'Ancho de canal, largo, marco, apoyo, tramos, recortes y acabado.',
    budgetData: ['Ancho de canal', 'Largo total', 'Tramos o unidades', 'Foto del hueco', 'Entorno'],
    config: { modelType: 'drain', width: 2.0, depth: 0.65, barHeight: 0.036, barThickness: 0.028, crossThickness: 0.014, bars: 18, crosses: 18, frameThickness: 0.05, channelDepth: 0.22, defaultMaterial: 'galvanized', profileProtection: true },
    specs: [['Pieza', 'Canaleta de drenaje con rejilla metálica'], ['Uso habitual', 'Evacuación de agua y cubrición de canal'], ['Se define', 'Ancho, largo, apoyo, tramos y acabado'], ['Datos necesarios', 'Medidas del canal y foto']]
  }
];

const STEEL_DENSITY_KG_M3 = 7850;
const DEFAULT_NOTE = 'Peso orientativo para preparar presupuesto. Se ajusta al confirmar malla, pletina, marco, recortes y acabado.';

const mm = (value) => Number(value || 0) / 1000;
const roundOneDecimal = (value) => Math.round(value * 10) / 10;

const crossAreaM2 = (profile) => {
  const size = mm(profile.crossSizeMm);
  if (profile.crossType === 'round') return Math.PI * (size / 2) ** 2;
  if (profile.crossType === 'flat') return mm(profile.crossHeightMm) * mm(profile.crossThicknessMm);
  return size * size;
};

const profileWeightKgM2 = (profile) => {
  const bearing = STEEL_DENSITY_KG_M3 * ((mm(profile.bearingHeightMm) * mm(profile.bearingThicknessMm)) / mm(profile.bearingPitchMm));
  const cross = STEEL_DENSITY_KG_M3 * (crossAreaM2(profile) / mm(profile.crossPitchMm));
  const extras = Number(profile.extraKgM2 || 0) + Number(profile.serratedExtraKgM2 || 0);
  return roundOneDecimal(bearing + cross + extras);
};

const basisText = (profile) => {
  const crossLabel = profile.crossType === 'round'
    ? 'varilla Ø' + profile.crossSizeMm + ' mm'
    : profile.crossType === 'flat'
      ? 'fleje ' + profile.crossHeightMm + 'x' + profile.crossThicknessMm + ' mm'
      : 'cuadradillo ' + profile.crossSizeMm + ' mm';
  return 'Referencia: pletina ' + profile.bearingHeightMm + 'x' + profile.bearingThicknessMm + ' mm cada ' + profile.bearingPitchMm + ' mm, ' + crossLabel + ' cada ' + profile.crossPitchMm + ' mm.';
};

const profileDefs = {
  'rejilla-electrosoldada-cuadradillo-entregirado': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 34, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 4.0 },
  'rejilla-electrosoldada-varilla-lisa': { bearingHeightMm: 30, bearingThicknessMm: 2, bearingPitchMm: 34, crossType: 'round', crossSizeMm: 5, crossPitchMm: 100, extraKgM2: 3.0 },
  'rejilla-electrosoldada-perfil-proteccion': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 34, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 6.5 },
  'rejilla-electrosoldada-dentado-ondulado': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 34, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 4.5, serratedExtraKgM2: 0.8 },
  'rejilla-electrosoldada-dentado-ondulado-perfil': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 34, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 7.0, serratedExtraKgM2: 0.8 },
  'rejilla-electrosoldada-dentado-sierra-discontinuo': { bearingHeightMm: 35, bearingThicknessMm: 3, bearingPitchMm: 34, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 4.5, serratedExtraKgM2: 0.8 },
  'rejilla-electrosoldada-dentado-sierra-discontinuo-perfil': { bearingHeightMm: 35, bearingThicknessMm: 3, bearingPitchMm: 34, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 7.0, serratedExtraKgM2: 0.8 },
  'rejilla-electrosoldada-tipo-offshore': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 5, crossPitchMm: 50, extraKgM2: 5.0 },
  'rejilla-electrosoldada-tipo-offshore-seguridad': { bearingHeightMm: 35, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 5, crossPitchMm: 50, extraKgM2: 6.5, serratedExtraKgM2: 0.9 },
  'rejilla-prensada-flejes-diferentes': { bearingHeightMm: 25, bearingThicknessMm: 2, bearingPitchMm: 30, crossType: 'flat', crossHeightMm: 20, crossThicknessMm: 2, crossPitchMm: 100, extraKgM2: 3.0 },
  'rejilla-prensada-flejes-diferentes-dentado-sierra': { bearingHeightMm: 30, bearingThicknessMm: 2, bearingPitchMm: 30, crossType: 'flat', crossHeightMm: 20, crossThicknessMm: 2, crossPitchMm: 100, extraKgM2: 3.5, serratedExtraKgM2: 0.8 },
  'rejilla-prensada-flejes-diferentes-dentado-ondulado': { bearingHeightMm: 30, bearingThicknessMm: 2, bearingPitchMm: 30, crossType: 'flat', crossHeightMm: 20, crossThicknessMm: 2, crossPitchMm: 100, extraKgM2: 3.2, serratedExtraKgM2: 0.6 },
  'rejilla-prensada-flejes-iguales': { bearingHeightMm: 25, bearingThicknessMm: 2, bearingPitchMm: 30, crossType: 'flat', crossHeightMm: 25, crossThicknessMm: 2, crossPitchMm: 50, extraKgM2: 3.0 },
  'rejilla-prensada-flejes-iguales-dentado-sierra': { bearingHeightMm: 30, bearingThicknessMm: 2, bearingPitchMm: 30, crossType: 'flat', crossHeightMm: 30, crossThicknessMm: 2, crossPitchMm: 50, extraKgM2: 3.2, serratedExtraKgM2: 0.8 },
  'rejilla-prensada-flejes-iguales-dentado-ondulado': { bearingHeightMm: 30, bearingThicknessMm: 2, bearingPitchMm: 30, crossType: 'flat', crossHeightMm: 30, crossThicknessMm: 2, crossPitchMm: 50, extraKgM2: 3.0, serratedExtraKgM2: 0.6 },
  'rejilla-metalica-manual': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 6, crossPitchMm: 80, extraKgM2: 6.0 },
  'peldano-rejilla-para-apoyar': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 6, crossPitchMm: 80, extraKgM2: 12.0, serratedExtraKgM2: 0.8 },
  'peldano-rejilla-para-soldar': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 6, crossPitchMm: 90, extraKgM2: 10.0, serratedExtraKgM2: 0.8 },
  'peldano-rejilla-para-atornillar': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 6, crossPitchMm: 80, extraKgM2: 13.0, serratedExtraKgM2: 0.8 },
  'alcorque-metalico-rejilla': { bearingHeightMm: 25, bearingThicknessMm: 3, bearingPitchMm: 40, crossType: 'square', crossSizeMm: 6, crossPitchMm: 80, extraKgM2: 7.0 },
  'canaleta-drenaje-rejilla-metalica': { bearingHeightMm: 30, bearingThicknessMm: 3, bearingPitchMm: 30, crossType: 'square', crossSizeMm: 6, crossPitchMm: 100, extraKgM2: 10.0 }
};

export const WEIGHT_PROFILES = Object.fromEntries(
  Object.entries(profileDefs).map(([id, profile]) => [
    id,
    { ...profile, kgM2: profileWeightKgM2(profile), basis: basisText(profile), note: DEFAULT_NOTE }
  ])
);

export const DEFAULT_WEIGHT_PROFILE = {
  kgM2: 32,
  basis: 'Referencia media para rejilla metálica a medida con marco sencillo.',
  note: DEFAULT_NOTE
};

export function getWeightProfile(product) {
  if (!product || !product.id) return DEFAULT_WEIGHT_PROFILE;
  return WEIGHT_PROFILES[product.id] || DEFAULT_WEIGHT_PROFILE;
}
