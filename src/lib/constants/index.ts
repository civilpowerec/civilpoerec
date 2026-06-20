// CivilPowerEc — Constantes globales

export const TRIAL_DAYS = 21

export const ALERT_THRESHOLDS = {
  INFO: 25,
  WARNING: 75,
  CRITICAL: 100,
} as const

export const PROVINCIAS_ECUADOR = [
  'Azuay',
  'Bolívar',
  'Cañar',
  'Carchi',
  'Chimborazo',
  'Cotopaxi',
  'El Oro',
  'Esmeraldas',
  'Galápagos',
  'Guayas',
  'Imbabura',
  'Loja',
  'Los Ríos',
  'Manabí',
  'Morona Santiago',
  'Napo',
  'Orellana',
  'Pastaza',
  'Pichincha',
  'Santa Elena',
  'Santo Domingo de los Tsáchilas',
  'Sucumbíos',
  'Tungurahua',
  'Zamora Chinchipe',
] as const

export const TIPO_PROYECTO_LABELS = {
  residencial_unifamiliar: 'Residencial unifamiliar',
  residencial_multifamiliar: 'Residencial multifamiliar',
  comercial: 'Comercial',
  institucional: 'Institucional',
  industrial: 'Industrial',
  infraestructura: 'Infraestructura',
  remodelacion: 'Remodelación',
  otro: 'Otro',
} as const

export const TIPO_PERSONA_LABELS = {
  natural: 'Persona natural',
  juridica: 'Persona jurídica',
} as const

export const TIPO_IDENTIFICACION_LABELS = {
  ruc: 'RUC',
  cedula: 'Cédula',
  pasaporte: 'Pasaporte',
} as const