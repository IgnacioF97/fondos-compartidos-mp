const Interactions = {
  init(screenName) {
    // Wire up back buttons globally
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => Router.back());
    });

    const handlers = {
      'home':                 () => this.initHome(),
      'fondos-lista':         () => this.initFondosLista(),
      'crear-paso1':          () => this.initCrearPaso1(),
      'crear-paso2':          () => this.initCrearPaso2(),
      'fondo-creado':         () => this.initFondoCreado(),
      'fondo-home':           () => this.initFondoHome(),
      'cargar-dinero':        () => this.initCargarDinero(),
      'cargar-confirmacion':  () => this.initCargarConfirmacion(),
      'pagar-qr':             () => this.initPagarQR(),
      'pago-confirmado':      () => this.initPagoConfirmado(),
      'gastos-historial':     () => this.initGastosHistorial(),
      'balances':             () => this.initBalances(),
      'liquidar':             () => this.initLiquidar(),
      'liquidado':            () => this.initLiquidado(),
    };

    if (handlers[screenName]) {
      handlers[screenName]();
    }
  },

  initHome() {
    // Update saldo
    const amountEl = document.getElementById('home-saldo');
    if (amountEl) amountEl.textContent = formatPeso(State.usuario.saldo);

    // Toggle eye
    let visible = true;
    const eyeBtn = document.getElementById('eye-btn');
    if (eyeBtn) {
      eyeBtn.addEventListener('click', () => {
        visible = !visible;
        const el = document.getElementById('home-saldo');
        if (el) el.textContent = visible ? formatPeso(State.usuario.saldo) : '••••••';
        eyeBtn.textContent = visible ? '👁️' : '🙈';
      });
    }

    // Fondos compartidos action
    const fondosBtn = document.getElementById('go-fondos');
    if (fondosBtn) {
      fondosBtn.addEventListener('click', () => Router.go('fondos-lista'));
    }
  },

  initFondosLista() {
    const crearBtn = document.getElementById('crear-fondo-btn');
    if (crearBtn) {
      crearBtn.addEventListener('click', () => Router.go('crear-paso1'));
    }
  },

  initCrearPaso1() {
    let selectedTipo = 'viaje';
    const nameInput = document.getElementById('fondo-nombre');
    const continueBtn = document.getElementById('continuar-btn');

    // Pre-select viaje and pre-fill name
    const viajeTipo = document.querySelector('.tipo-card[data-tipo="viaje"]');
    if (viajeTipo) viajeTipo.classList.add('selected');
    if (nameInput) nameInput.value = 'Viaje a Bariloche 🏔️';
    if (continueBtn) continueBtn.disabled = false;

    // Tipo selection
    document.querySelectorAll('.tipo-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.tipo-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedTipo = card.dataset.tipo;
        checkReady();
      });
    });

    function checkReady() {
      if (continueBtn) {
        continueBtn.disabled = !(selectedTipo && nameInput && nameInput.value.trim().length > 0);
      }
    }

    if (nameInput) {
      nameInput.addEventListener('input', checkReady);
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        State.fondoActivo.nombre = nameInput ? nameInput.value : 'Viaje a Bariloche 🏔️';
        Router.go('crear-paso2');
      });
    }
  },

  initCrearPaso2() {
    // Toggles
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const isOn = toggle.classList.contains('on') || toggle.classList.contains('on-yellow');
        const className = toggle.dataset.color === 'yellow' ? 'on-yellow' : 'on';
        toggle.classList.toggle(className, !isOn);
      });
    });

    const crearBtn = document.getElementById('crear-btn');
    if (crearBtn) {
      crearBtn.addEventListener('click', () => {
        crearBtn.innerHTML = '<div class="spinner"></div>';
        crearBtn.disabled = true;
        setTimeout(() => Router.go('fondo-creado', 'slide-up'), 1500);
      });
    }
  },

  initFondoCreado() {
    const confettiEl = document.querySelector('.confetti-container');
    if (confettiEl) Animations.confetti(confettiEl);

    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        Animations.showToast('✓ Link copiado al portapapeles');
      });
    }

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        Animations.showToast('✓ Link copiado al portapapeles');
      });
    }

    const irBtn = document.getElementById('ir-fondo-btn');
    if (irBtn) {
      irBtn.addEventListener('click', () => Router.go('fondo-home'));
    }
  },

  initFondoHome() {
    // Update saldo
    const saldoEl = document.getElementById('fondo-saldo');
    if (saldoEl) {
      animateNumber(saldoEl, 0, State.fondoActivo.saldoTotal, 800);
    }

    // Progress bar
    const progressFill = document.getElementById('fondo-progress');
    if (progressFill) {
      const target = State.fondoActivo.saldoTotal > 0 ? Math.min(State.fondoActivo.saldoTotal / 1000, 100) : 0;
      setTimeout(() => { progressFill.style.width = Math.min(target, 100) + '%'; }, 300);
    }

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        if (tab === 'gastos') Router.go('gastos-historial');
        if (tab === 'balances') Router.go('balances');
      });
    });

    // Action buttons
    const cargarBtn = document.getElementById('cargar-btn');
    if (cargarBtn) cargarBtn.addEventListener('click', () => Router.go('cargar-dinero'));

    const gastarBtn = document.getElementById('gastar-btn');
    if (gastarBtn) gastarBtn.addEventListener('click', () => Router.go('pagar-qr'));

    const historialBtn = document.getElementById('historial-btn');
    if (historialBtn) historialBtn.addEventListener('click', () => Router.go('gastos-historial'));

    // Render mini gastos
    const miniList = document.getElementById('mini-gastos');
    if (miniList && State.fondoActivo.gastos.length > 0) {
      const items = State.fondoActivo.gastos.slice(0, 3);
      miniList.innerHTML = items.map(g => `
        <div class="gasto-item stagger-item">
          <div class="gasto-icon" style="background:${g.color}22">${g.icono}</div>
          <div class="gasto-info">
            <strong>${g.descripcion}</strong>
            <span>Pagado por: ${g.pagadoPor}</span>
          </div>
          <div class="gasto-right">
            <span class="gasto-amount">${formatPeso(g.monto)}</span>
            <span class="gasto-date">${g.fechaLabel}</span>
          </div>
        </div>
      `).join('');
      Animations.staggerChildren('#mini-gastos .stagger-item');
    }
  },

  initCargarDinero() {
    let digits = '15000';
    const display = document.getElementById('numpad-display');

    function updateDisplay() {
      const n = parseInt(digits) || 0;
      if (display) display.textContent = formatPeso(n);
      const btn = document.getElementById('confirmar-carga');
      if (btn) btn.disabled = n === 0;
    }

    updateDisplay();

    // Numpad
    document.querySelectorAll('.numpad-key').forEach(key => {
      key.addEventListener('click', () => {
        const val = key.dataset.key;
        if (val === 'del') {
          digits = digits.slice(0, -1) || '0';
        } else if (val === '.') {
          // no decimals
        } else {
          if (digits === '0') digits = val;
          else digits = (digits + val).slice(0, 8);
        }
        updateDisplay();
        key.style.transform = 'scale(0.88)';
        setTimeout(() => key.style.transform = '', 120);
      });
    });

    // Radio options
    document.querySelectorAll('.desde-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.desde-option').forEach(o => {
          o.classList.remove('selected');
          o.querySelector('.desde-radio-dot')?.classList.remove('selected');
        });
        opt.classList.add('selected');
        opt.querySelector('.desde-radio-dot')?.classList.add('selected');
      });
    });

    const confirmarBtn = document.getElementById('confirmar-carga');
    if (confirmarBtn) {
      confirmarBtn.addEventListener('click', () => {
        const monto = parseInt(digits) || 0;
        if (monto === 0) return;
        confirmarBtn.innerHTML = '<div class="spinner"></div>';
        confirmarBtn.disabled = true;
        State.cargarDinero(monto);
        setTimeout(() => Router.go('cargar-confirmacion', 'slide-up'), 1200);
      });
    }
  },

  initCargarConfirmacion() {
    // Populate with state
    const montoEl = document.getElementById('carga-monto');
    if (montoEl) montoEl.textContent = formatPeso(State.ultimaCarga);

    const nuevoSaldoEl = document.getElementById('nuevo-saldo');
    if (nuevoSaldoEl) {
      animateNumber(nuevoSaldoEl, 0, State.fondoActivo.saldoTotal, 700);
    }

    const volverBtn = document.getElementById('volver-fondo');
    if (volverBtn) {
      volverBtn.addEventListener('click', () => {
        Router.history = [];
        Router.go('fondo-home', 'slide-right');
      });
    }
  },

  initPagarQR() {
    let scanned = false;

    const manualBtn = document.getElementById('manual-btn');
    if (manualBtn) {
      manualBtn.addEventListener('click', () => {
        if (scanned) return;
        scanned = true;
        this._showManualPayModal();
      });
    }

    // Auto scan
    setTimeout(() => {
      if (!scanned) {
        scanned = true;
        State.registrarGasto('Restaurante El Patagónico', 8400, 'Fondo');
        Router.go('pago-confirmado', 'slide-up');
      }
    }, 2500);
  },

  _showManualPayModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <h3 style="font-size:18px;font-weight:700;margin-bottom:20px;text-align:center">Ingresar monto</h3>
        <div style="text-align:center;font-size:36px;font-weight:800;margin-bottom:16px;color:var(--text-primary)">$8.400</div>
        <p style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:20px">Restaurante El Patagónico</p>
        <button class="btn-primary" id="confirm-manual-pay">Confirmar pago</button>
      </div>
    `;
    document.querySelector('.phone-screen').appendChild(overlay);
    document.getElementById('confirm-manual-pay').addEventListener('click', () => {
      State.registrarGasto('Restaurante El Patagónico', 8400, 'Fondo');
      Router.go('pago-confirmado', 'slide-up');
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  },

  initPagoConfirmado() {
    const porPersonaEl = document.getElementById('por-persona');
    if (porPersonaEl) {
      const n = State.fondoActivo.participantes.length;
      porPersonaEl.textContent = formatPeso(State.ultimoPago.monto / n);
    }

    const verDetalleBtn = document.getElementById('ver-detalle-btn');
    if (verDetalleBtn) {
      verDetalleBtn.addEventListener('click', () => Router.go('gastos-historial'));
    }

    const volverBtn = document.getElementById('volver-fondo-pago');
    if (volverBtn) {
      volverBtn.addEventListener('click', () => {
        Router.history = [];
        Router.go('fondo-home', 'slide-right');
      });
    }
  },

  initGastosHistorial() {
    const gastos = State.fondoActivo.gastos.length > 0
      ? State.fondoActivo.gastos
      : DEMO_DATA.gastos.map((g, i) => ({
          id: i,
          descripcion: g.desc,
          monto: g.monto,
          pagadoPor: g.pagador,
          icono: g.icono,
          color: g.color,
          fechaLabel: i === 0 ? 'hace 5 min' : i <= 2 ? 'ayer' : 'hace 2 días',
        }));

    const listEl = document.getElementById('gastos-list');
    if (listEl) {
      listEl.innerHTML = gastos.map((g, i) => `
        <div class="gasto-item stagger-item" data-id="${g.id}">
          <div class="gasto-icon" style="background:${g.color}22">${g.icono}</div>
          <div class="gasto-info">
            <strong>${g.descripcion}</strong>
            <span>Pagado por: ${g.pagadoPor}</span>
          </div>
          <div class="gasto-right">
            <span class="gasto-amount">${formatPeso(g.monto)}</span>
            <span class="gasto-date">${g.fechaLabel}</span>
          </div>
          <span style="color:var(--text-muted);font-size:16px;margin-left:4px">›</span>
        </div>
      `).join('');
      Animations.staggerChildren('#gastos-list .stagger-item', 70);

      listEl.querySelectorAll('.gasto-item').forEach((item, i) => {
        item.addEventListener('click', () => this._showGastoDetail(gastos[i]));
      });
    }

    const total = gastos.reduce((a, g) => a + g.monto, 0);
    const totalEl = document.getElementById('total-gastado');
    if (totalEl) totalEl.textContent = formatPeso(total);

    const countEl = document.getElementById('gastos-count');
    if (countEl) countEl.textContent = `${gastos.length} gastos`;
  },

  _showGastoDetail(gasto) {
    const n = State.fondoActivo.participantes.length;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:40px;margin-bottom:8px">${gasto.icono}</div>
          <div style="font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:4px">${gasto.descripcion}</div>
          <div style="font-size:28px;font-weight:800;color:var(--mp-blue)">${formatPeso(gasto.monto)}</div>
        </div>
        <div class="confirm-card card">
          <div class="confirm-row"><span class="confirm-row-label">Pagado por</span><span class="confirm-row-value">${gasto.pagadoPor}</span></div>
          <div class="confirm-row"><span class="confirm-row-label">Dividido entre</span><span class="confirm-row-value">${n} personas</span></div>
          <div class="confirm-row"><span class="confirm-row-label">Parte por persona</span><span class="confirm-row-value">${formatPeso(gasto.monto / n)}</span></div>
          <div class="confirm-row"><span class="confirm-row-label">Fecha</span><span class="confirm-row-value">${gasto.fechaLabel}</span></div>
        </div>
        <div style="padding:16px 0 0">
          <button class="btn-outline" id="close-detail">Cerrar</button>
        </div>
      </div>
    `;
    document.querySelector('.phone-screen').appendChild(overlay);
    document.getElementById('close-detail').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  },

  initBalances() {
    const contribs = State.getDemoContribuciones();
    const max = Math.max(...Object.values(contribs));
    const colors = { Ignacio: '#009EE3', María: '#9B59B6', Juan: '#E67E22', Ana: '#E74C3C' };

    const contribList = document.getElementById('contrib-list');
    if (contribList) {
      contribList.innerHTML = Object.entries(contribs)
        .sort((a, b) => b[1] - a[1])
        .map(([name, amount]) => `
          <div class="contrib-item stagger-item">
            <div class="contrib-header">
              <div class="contrib-person">
                <div class="avatar" style="background:${colors[name]}">${name.slice(0,2).toUpperCase()}</div>
                <span class="contrib-name">${name}</span>
              </div>
              <span class="contrib-amount">${formatPeso(amount)}</span>
            </div>
            <div class="contrib-bar-bg">
              <div class="contrib-bar-fill" data-width="${(amount / max * 100).toFixed(1)}%" style="background:${colors[name]}"></div>
            </div>
          </div>
        `).join('');
      Animations.staggerChildren('#contrib-list .stagger-item', 80);
    }

    const deudas = State.calcularBalances();
    const deudaList = document.getElementById('deuda-list');
    if (deudaList) {
      deudaList.innerHTML = deudas.map(d => `
        <div class="deuda-card stagger-item">
          <div class="avatar" style="background:${d.deudorColor}">${d.deudor.slice(0,2).toUpperCase()}</div>
          <span class="deuda-arrow">→</span>
          <div class="avatar" style="background:${d.acreedorColor}">${d.acreedor.slice(0,2).toUpperCase()}</div>
          <div class="deuda-names"><strong>${d.deudor}</strong> le debe a <strong>${d.acreedor}</strong></div>
          <span class="deuda-amount">${formatPeso(d.monto)}</span>
        </div>
      `).join('');
      Animations.staggerChildren('#deuda-list .stagger-item', 80);
    }

    const totalDeuda = deudas.reduce((a, d) => a + d.monto, 0);
    const totalEl = document.getElementById('total-deuda');
    if (totalEl) totalEl.textContent = formatPeso(totalDeuda);

    setTimeout(() => Animations.animateBalanceBars(), 200);

    const liquidarBtn = document.getElementById('liquidar-btn');
    if (liquidarBtn) {
      liquidarBtn.addEventListener('click', () => Router.go('liquidar', 'slide-up'));
    }
  },

  initLiquidar() {
    const deudas = State.calcularBalances();
    const list = document.getElementById('transfer-list');
    if (list) {
      list.innerHTML = deudas.map((d, i) => `
        <div class="transfer-item stagger-item">
          <div class="transfer-avatars">
            <div class="avatar avatar-lg" style="background:${d.deudorColor}">${d.deudor.slice(0,2).toUpperCase()}</div>
            <span class="transfer-arrow-icon">→</span>
            <div class="avatar avatar-lg" style="background:${d.acreedorColor}">${d.acreedor.slice(0,2).toUpperCase()}</div>
          </div>
          <div class="transfer-info">
            <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${d.deudor} → ${d.acreedor}</div>
            <div class="transfer-amount">${formatPeso(d.monto)}</div>
          </div>
          <div class="transfer-badge">✓ Aprobado</div>
        </div>
      `).join('');
      Animations.staggerChildren('#transfer-list .stagger-item', 80);
    }

    const recvEl = document.getElementById('recv-amount');
    const totalDeuda = deudas.reduce((a, d) => a + d.monto, 0);
    if (recvEl) recvEl.textContent = formatPeso(totalDeuda);

    const liquidarBtn = document.getElementById('liquidar-ahora-btn');
    if (liquidarBtn) {
      liquidarBtn.addEventListener('click', () => {
        liquidarBtn.innerHTML = '<div class="spinner"></div>';
        liquidarBtn.disabled = true;
        setTimeout(() => Router.go('liquidado', 'slide-up'), 1600);
      });
    }
  },

  initLiquidado() {
    const confettiEl = document.querySelector('.confetti-container');
    if (confettiEl) Animations.confetti(confettiEl);

    const totalEl = document.getElementById('total-gastado-final');
    if (totalEl) totalEl.textContent = formatPeso(State.totalGastado());

    const crearNuevoBtn = document.getElementById('crear-nuevo-btn');
    if (crearNuevoBtn) {
      crearNuevoBtn.addEventListener('click', () => {
        Router.history = [];
        Router.go('crear-paso1', 'slide-left');
      });
    }

    const historialBtn = document.getElementById('historial-final-btn');
    if (historialBtn) {
      historialBtn.addEventListener('click', () => Router.go('gastos-historial'));
    }
  },
};

// DEMO_DATA is defined in state.js (loaded before this file)
