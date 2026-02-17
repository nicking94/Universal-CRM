# CRM WhatsApp Leads - Offline First

## Arquitectura

Esta aplicación es un CRM Offline-First construido con **Next.js (App Router)** y **TypeScript**.

### Tecnologías Clave

- **Persistencia Local**: Utilizamos **Dexie.js** (IndexedDB wrapper) para almacenar todos los datos localmente en el navegador del usuario. No hay backend ni base de datos externa.
- **Estado Reactivo**: `dexie-react-hooks` (`useLiveQuery`) permite que la UI reaccione automáticamente a los cambios en la base de datos local.
- **Estilos**: CSS nativo con variables CSS para mantener un diseño consistente y ligero, siguiendo una metodología Mobile First.

### Estructura del Proyecto

- `/app`: Rutas de la aplicación (Home, Cliente Detalle, Nuevo Cliente).
- `/hooks`: Lógica de negocio encapsulada (`useCRM` para estado global, `useClient` para detalle).
- `/components`: Componentes de UI reutilizables (Cards, Headers, Modals).
- `/lib`: Configuración de la base de datos (Dexie setup).
- `/utils`: Utilidades puras (Manejo de fechas, Exportación Excel).
- `/types`: Definiciones de tipos TypeScript compartidos.

### Flujo de Datos

1.  La aplicación inicia y conecta a IndexedDB.
2.  `useLiveQuery` suscribe los componentes a las tablas `clientes` y `notas`.
3.  Calculamos prioridades dinámicamente (`hoy`, `atrasado`) basadas en `proximoSeguimiento` al leer los datos.
4.  Las acciones (Agregar nota, Cambiar etapa) impactan directamente en IndexedDB, actualizando la UI instantáneamente.

### Importación/Exportación

El sistema permite respaldar todos los datos en un archivo Excel (.xlsx) estructurado, facilitando la migración o el resguardo de la información fuera del navegador.
