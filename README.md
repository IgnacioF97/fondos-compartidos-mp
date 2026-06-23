# Fondos Compartidos 💰 — Mercado Pago

**Demo interactiva** de una nueva funcionalidad para Mercado Pago que permite organizar gastos grupales de forma simple: viajes, asados, casas compartidas, eventos, y más.

![Demo preview](https://img.shields.io/badge/demo-navegable-009EE3?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==) ![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-FFE600?style=for-the-badge) ![Mobile](https://img.shields.io/badge/mobile--first-iPhone%2014%20Pro-1A1A2E?style=for-the-badge)

---

## ¿De qué se trata?

Fondos Compartidos resuelve un problema cotidiano: **¿cómo organizás los gastos cuando salís con amigos?**

Con esta feature, un grupo puede:
- 🏦 **Crear un fondo compartido** (viaje, asado, casa, evento...)
- 💸 **Cargar dinero** desde su saldo de Mercado Pago
- 📱 **Pagar directamente** escaneando un QR desde el fondo
- 📊 **Ver quién gastó qué** y cómo se divide todo
- ⚖️ **Liquidar automáticamente** con el mínimo de transferencias posibles

---

## Flujo de la demo

La demo cubre el flujo completo de principio a fin:

```
Home MP → Lista de fondos → Crear fondo (2 pasos) → Compartir con el grupo
    → Cargar dinero → Pagar con QR → Ver historial de gastos
    → Ver balances → Liquidar → ¡Fondo liquidado! 🎉
```

| Pantalla | Descripción |
|----------|-------------|
| 🏠 Home | Home de Mercado Pago con acceso directo |
| 📋 Lista de fondos | Estado vacío con CTA para crear |
| ✏️ Crear fondo | Elegí tipo (viaje, asado, casa...) + nombre |
| ⚙️ Configuración | Toggles de permisos y restricciones |
| ✅ Fondo creado | Compartir por WhatsApp / copiar link |
| 💰 Cargar dinero | Teclado numérico custom, elegí desde dónde |
| 📷 Pagar con QR | Simulación de escaneo con animación |
| 📊 Historial | Lista de gastos con detalle por item |
| ⚖️ Balances | Contribuciones y quién le debe a quién |
| 💸 Liquidar | Plan con mínimas transferencias |
| 🎉 Liquidado | Estadísticas finales del grupo |

---

## Cómo correrlo

No tiene build, no tiene dependencias. Solo necesitás un servidor HTTP local (el browser bloquea `fetch()` desde `file://`).

**Opción 1 — Python (recomendado, viene instalado en Mac):**
```bash
cd app
python3 -m http.server 3000
# Abrí http://localhost:3000
```

**Opción 2 — VS Code Live Server:**
```
Instalar extensión "Live Server" → click derecho en app/index.html → "Open with Live Server"
```

**Opción 3 — npx:**
```bash
npx serve app
```

---

## Estructura del proyecto

```
app/
├── index.html              ← Entry point (shell del iPhone)
├── styles/
│   ├── reset.css           ← CSS reset
│   ├── phone.css           ← Marco del iPhone mockup
│   ├── design-system.css   ← Tokens, colores y componentes MP
│   └── screens.css         ← Estilos por pantalla
├── js/
│   ├── state.js            ← Estado global + datos demo
│   ├── animations.js       ← Transiciones y efectos
│   ├── router.js           ← Navegación entre pantallas
│   └── interactions.js     ← Lógica de cada pantalla
└── screens/                ← 14 pantallas en HTML
    ├── home.html
    ├── fondos-lista.html
    ├── crear-paso1.html
    ├── crear-paso2.html
    ├── fondo-creado.html
    ├── fondo-home.html
    ├── cargar-dinero.html
    ├── cargar-confirmacion.html
    ├── pagar-qr.html
    ├── pago-confirmado.html
    ├── gastos-historial.html
    ├── balances.html
    ├── liquidar.html
    └── liquidado.html

docs/
├── Analisis_Fondos_Compartidos.docx   ← Análisis del producto
├── Fondos_Compartidos_-_Mockups.pptx  ← Mockups de diseño
└── FondosCompartidos_LinkedIn.pdf     ← Presentación
```

---

## Stack técnico

- **HTML5 + CSS3 + JavaScript vanilla** — sin frameworks, sin build step
- **Mobile-first** — diseñado como iPhone 14 Pro (393×852px) centrado en el browser
- **Design System de Mercado Pago** — colores, tipografía y componentes originales
- **Router propio** — navegación entre pantallas via `fetch()` con transiciones CSS
- **Estado global simulado** — sin backend, datos hardcodeados para el demo

---

## Documentación incluida

📄 **[Análisis del producto](docs/Analisis_Fondos_Compartidos.docx)** — Investigación, casos de uso y propuesta de valor de la feature

🎨 **[Mockups de diseño](docs/Fondos_Compartidos_-_Mockups.pptx)** — Wireframes y diseño visual de todas las pantallas

📊 **[Presentación](docs/FondosCompartidos_LinkedIn.pdf)** — Deck de presentación del proyecto

---

## Datos del demo

Para que el video sea consistente, los datos están hardcodeados:

| Dato | Valor |
|------|-------|
| Usuario | Ignacio |
| Saldo inicial MP | $47.320 |
| Fondo | Viaje a Bariloche 🏔️ |
| Participantes | Ignacio, María, Juan, Ana |
| Carga de dinero | $15.000 (pre-cargado) |
| Pago QR | $8.400 — Restaurante El Patagónico |
| Total gastado | $72.400 |
| A liquidar | $15.700 |

---

*Proyecto de demo — no hay backend. Todo es simulado con JavaScript.*
