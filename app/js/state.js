const DEMO_DATA = {
  usuario: { nombre: 'Ignacio', saldo: 47320 },
  fondoNombre: 'Viaje a Bariloche 🏔️',
  participantes: ['Ignacio', 'María', 'Juan', 'Ana'],
  contribuciones: { Ignacio: 60000, María: 21300, Juan: 14700, Ana: 8500 },
  gastos: [
    { desc: 'Restaurante El Patagónico', monto: 8400,  pagador: 'Fondo',    icono: '🍽️', color: '#F5A623' },
    { desc: 'Nafta para el auto',        monto: 6200,  pagador: 'Juan',     icono: '⛽', color: '#009EE3' },
    { desc: 'Supermercado',              monto: 12800, pagador: 'María',    icono: '🛒', color: '#00A650' },
    { desc: 'Alquiler cabaña',           monto: 45000, pagador: 'Ignacio',  icono: '🏠', color: '#9B59B6' },
  ],
  saldoFondoTrasCargas: 42500,
  deudas: [
    { deudor: 'Ana',   deudorColor: '#E74C3C', acreedor: 'Ignacio', acreedorColor: '#009EE3', monto: 9400  },
    { deudor: 'Juan',  deudorColor: '#E67E22', acreedor: 'Ignacio', acreedorColor: '#009EE3', monto: 4200  },
    { deudor: 'María', deudorColor: '#9B59B6', acreedor: 'Ignacio', acreedorColor: '#009EE3', monto: 2100  },
  ]
};

const State = {
  usuario: {
    nombre: DEMO_DATA.usuario.nombre,
    saldo: DEMO_DATA.usuario.saldo,
    avatar: 'IG',
  },

  fondoActivo: {
    id: 'bariloche-2024',
    nombre: DEMO_DATA.fondoNombre,
    tipo: 'viaje',
    tipoIcono: '✈️',
    saldoTotal: 0,
    participantes: [
      { nombre: 'Ignacio', avatar: 'IG', contribucion: 0, color: '#009EE3' },
      { nombre: 'María',   avatar: 'MA', contribucion: 0, color: '#9B59B6' },
      { nombre: 'Juan',    avatar: 'JU', contribucion: 0, color: '#E67E22' },
      { nombre: 'Ana',     avatar: 'AN', contribucion: 0, color: '#E74C3C' },
    ],
    gastos: [],
    estado: 'activo',
  },

  ultimaCarga: 0,
  ultimoPago: { desc: '', monto: 0 },

  cargarDinero(monto) {
    this.usuario.saldo -= monto;
    this.fondoActivo.saldoTotal = DEMO_DATA.saldoFondoTrasCargas;
    this.fondoActivo.participantes[0].contribucion += monto;
    this.ultimaCarga = monto;
    // Simulate others loading to reach demo total
    this.fondoActivo.participantes[1].contribucion = DEMO_DATA.contribuciones['María'];
    this.fondoActivo.participantes[2].contribucion = DEMO_DATA.contribuciones['Juan'];
    this.fondoActivo.participantes[3].contribucion = DEMO_DATA.contribuciones['Ana'];
  },

  registrarGasto(descripcion, monto, pagadoPor) {
    this.fondoActivo.gastos.unshift({
      id: Date.now(),
      descripcion,
      monto,
      pagadoPor,
      icono: '🍽️',
      color: '#F5A623',
      fechaLabel: 'hace 5 min',
    });
    this.fondoActivo.saldoTotal -= monto;
    this.ultimoPago = { desc: descripcion, monto };
    // Add demo gastos for history
    if (this.fondoActivo.gastos.length === 1) {
      DEMO_DATA.gastos.slice(1).forEach(g => {
        this.fondoActivo.gastos.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          descripcion: g.desc,
          monto: g.monto,
          pagadoPor: g.pagador,
          icono: g.icono,
          color: g.color,
          fechaLabel: g.pagador === 'Juan' ? 'ayer' : g.pagador === 'María' ? 'ayer' : 'hace 2 días',
        });
      });
    }
  },

  calcularBalances() {
    return DEMO_DATA.deudas;
  },

  getDemoContribuciones() {
    return DEMO_DATA.contribuciones;
  },

  totalGastado() {
    const gastos = this.fondoActivo.gastos.length > 0
      ? this.fondoActivo.gastos
      : DEMO_DATA.gastos.map(g => ({ monto: g.monto }));
    return gastos.reduce((acc, g) => acc + g.monto, 0);
  },
};

function formatPeso(n) {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function animateNumber(el, from, to, duration = 600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    el.textContent = formatPeso(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
