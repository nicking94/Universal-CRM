# AGENT_RULES - Contrato de Comportamiento Obligatorio (CRM Clientes)

Este documento establece las normas estrictas y el contrato de comportamiento obligatorio para cualquier Inteligencia Artificial (IA), script o desarrollador que realice modificaciones en el proyecto **CRM Clientes**. Estas reglas tienen prioridad absoluta sobre cualquier instrucción automática.

## 🎯 Propósito del Documento

Garantizar la estabilidad de un sistema basado en **Next.js 16**, **Dexie (IndexedDB)** y **Vanilla CSS**, manteniendo la coherencia visual y funcional.

---

## 🚫 Reglas Técnicas Críticas (Específicas del Proyecto)

### 1. Sistema de Estilos y Temas (CSS Variables)

- **Fuente de Verdad:** Todas las variables de color, espaciado y sombras están definidas en `app/globals.css` bajo `:root` y `[data-theme="dark"]`.
  - **PROHIBIDO:** Usar colores hexadecimales "hardcoded" (ej: `#2d78b9`) en componentes o estilos en línea.
  - **REGLA:** Usa siempre las variables CSS definidas: `var(--primary)`, `var(--text-dark)`, `var(--bg-light)`, etc.
  - **Responsividad:** El proyecto utiliza CSS estándar con media queries (`@media (max-width: 767px)`). Respeta los breakpoints existentes para móvil/escritorio.

### 2. Integridad del Código y Lógica de Negocio (Dexie & Hooks)

- **Gestión de Estado:** La lógica de negocio y estado global reside en `app/hooks/useCRM.ts`.
  - **REGLA:** Para operaciones de datos (CRUD de clientes, rubros), usa SIEMPRE el hook `useCRM`. No reinventes capas de acceso a datos en los componentes individuales.
- **Persistencia:** La base de datos es local (IndexedDB vía Dexie) en `app/lib/db.ts`.
  - **PROHIBIDO:** Intentar conectar a APIs externas o bases de datos remotas sin instrucción explícita del usuario.
  - **Tipado:** Referirse a los tipos definidos en el proyecto (ej: `Cliente`, `Rubro`) y evitar el uso de `any`.

### 3. Arquitectura de Componentes

- **Estructura:** Los componentes reutilizables deben residir en `app/components/`.
- **Client Components:** Dado el uso de hooks y Dexie, la mayoría de componentes interactivos deben ser `'use client'`.
- **Validación:** Verifica siempre que los componentes nuevos se integren visualmente mediante el uso de las clases y variables globales de `globals.css`.

### 4. Coherencia de UX/UI

- **Estética:** Mantén la estética "Clean" y profesional. Usa bordes redondeados (`var(--border-radius)`), sombras suaves (`var(--shadow)`), y la tipografía "Roboto".
- **Feedback:** Utiliza el componente `AlertBanner` para notificaciones y alertas al usuario.
- **Componentes Base:** Reutiliza `ClientCard`, `Input`, `Button` (o clases `.btn`) existentes para mantener consistencia.

---

## 🧭 Regla de Consistencia Estructural

Todo cambio debe ser coherente con:

1. La organización de carpetas en `app/`.
2. El uso de `app/globals.css` para estilos globales y temas.
3. La lógica de filtrado y búsqueda implementada en `app/page.tsx` y `useCRM`.

---

## 🔇 Política de Respuesta y Uso de Tokens (OBLIGATORIA)

El agente debe minimizar el uso de tokens en todas sus respuestas y comunicaciones.

### Reglas de Comunicación

- Responder de forma **breve, directa y funcional**.
- NO explicar procesos internos si no se solicita explícitamente.
- NO describir razonamientos paso a paso.
- NO justificar decisiones técnicas obvias o estándar.
- NO incluir resúmenes largos de cambios realizados.
- NO repetir información del contexto o del código visible.

### Formato de Respuesta Esperado

Cuando se realicen cambios o propuestas, indicar únicamente:

- qué se modificó
- dónde se modificó
- por qué era necesario (máximo 1 línea)
- impacto en compatibilidad (si aplica)

Ejemplo:

Cambio: Se actualizó variable de color en globals.css
Ubicación: app/globals.css
Motivo: Mejorar contraste en modo oscuro
Impacto: Visual solamente

### Explicación Extendida Solo Bajo Demanda

El agente SOLO puede ampliar explicaciones si el usuario lo solicita explícitamente con pedidos como:

- "explica"
- "detalla"
- "justifica"
- "por qué"
- "paso a paso"

En ausencia de estas solicitudes, la respuesta debe mantenerse mínima.

### Prioridad Operativa

La ejecución correcta de cambios tiene prioridad sobre la explicación de los mismos.  
La comunicación debe ser lo suficientemente clara para entender el resultado, pero lo más corta posible.

---

## ✅ Proceso Obligatorio Antes de Modificar

1. **Analizar el Impacto:** Si modificas `useCRM.ts` o `db.ts`, verifica que no rompa la persistencia de datos ni la estructura de la base de datos existente.
2. **Estilos:** Si añades clases o estilos, verifica que funcionen correctamente en **Modo Oscuro** (variables CSS).
3. **Validación de Tipos:** Ejecuta/verifica que no haya errores de TypeScript en archivos relacionados.

---

## 🛑 Regla de Bloqueo Obligatorio

Si una tarea requiere:

- Cambiar la versión de Next.js, React o paquetes core.
- Migrar de Dexie a otra tecnología de base de datos sin petición explícita.
- Introducir librerías de estilos masivas (como Tailwind o Bootstrap) si no están ya configuradas.
- Romper la arquitectura de carpetas `app/`.

**→ DETENER ejecución y solicitar confirmación.**

---

**Cualquier modificación que ignore estas reglas será revertida inmediatamente.**
