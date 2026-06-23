const Animations = {
  transition(type, el) {
    const screen = el || document.querySelector('.phone-screen');
    const classMap = {
      'slide-left':  'screen-enter-left',
      'slide-right': 'screen-enter-right',
      'slide-up':    'screen-enter-up',
      'fade':        'screen-enter-fade',
    };
    const cls = classMap[type] || 'screen-enter-left';
    const content = screen.firstElementChild;
    if (content) {
      content.classList.add(cls);
      content.addEventListener('animationend', () => {
        content.classList.remove(cls);
      }, { once: true });
    }
  },

  staggerChildren(selector, delay = 60) {
    const items = document.querySelectorAll(selector);
    items.forEach((item, i) => {
      item.style.animationDelay = `${i * delay}ms`;
    });
  },

  animateBalanceBars() {
    const fills = document.querySelectorAll('.contrib-bar-fill');
    requestAnimationFrame(() => {
      fills.forEach(fill => {
        const target = fill.dataset.width;
        setTimeout(() => { fill.style.width = target; }, 100);
      });
    });
  },

  confetti(container) {
    const colors = ['#009EE3', '#00A650', '#FFE600', '#F23D4F', '#9B59B6', '#F5A623'];
    for (let i = 0; i < 28; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${-10 - Math.random() * 20}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 1.5}s;
        animation-duration: ${2.5 + Math.random() * 1.5}s;
        transform: rotate(${Math.random() * 360}deg);
        width: ${6 + Math.random() * 6}px;
        height: ${6 + Math.random() * 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      container.appendChild(piece);
    }
  },

  showToast(message, duration = 2200) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.querySelector('.phone-screen').appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  },
};
