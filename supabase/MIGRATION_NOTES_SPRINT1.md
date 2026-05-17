# CivilPowerEc — Notas de migración Sprint 1

## Antes de ejecutar las migraciones

Sprint 1 crea tablas con el esquema correcto definido en el Prompt Maestro v3 Final.

Si existen tablas creadas manualmente en sesiones anteriores, **deben eliminarse antes**
de correr estas migraciones. Las migraciones usan `CREATE TABLE` limpio, no `IF NOT EXISTS`.

## Tablas que pueden existir de sesiones anteriores y deben eliminarse

Eliminar desde Supabase Dashboard → Table Editor → (tabla) → Delete Table:

```
proyectos          ← existe con esquema incorrecto
actividades        ← no existe en el nuevo esquema, reemplazada por diario
rubros             ← existe pero con esquema diferente — se recreará en Sprint 3
registros_avance   ← existe pero con esquema diferente — se recreará en Sprint 4
trabajadores       ← existe pero con esquema diferente — se recreará en Sprint 6
asistencia         ← existe pero con esquema diferente — se recreará en Sprint 6
fotos              ← existe pero con esquema diferente — se recreará en Sprint 8
```

## Orden de ejecución

Ejecutar en este orden desde Supabase Dashboard → SQL Editor:

1. `001_core_tables.sql`
2. `002_core_rls_functions.sql`
3. `003_core_rls_policies.sql`

## Tablas que crea Sprint 1

- empresas
- miembros
- suscripciones
- clientes
- contactos_cliente
- proyectos
- proyecto_miembros
- audit_logs

## Tablas que se crearán en sprints futuros

- Sprint 3: categorias_presupuesto, subcategorias_presupuesto, rubros, items_aprobados, propuestas_items
- Sprint 4: registros_avance
- Sprint 5: pedidos, pedido_items
- Sprint 5: purchase_orders, po_items
- Sprint 6: facturas, factura_distribuciones, gastos_sin_clasificar
- Sprint 6: trabajadores, asistencia
- Sprint 7: audit_logs avanzado, solicitudes_aprobacion
- Sprint 8: fotos (con Storage policies)
