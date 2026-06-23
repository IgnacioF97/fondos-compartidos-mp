const Router = {
  currentScreen: 'home',
  history: [],

  go(screenName, transition = 'slide-left') {
    this.history.push(this.currentScreen);
    this._loadScreen(screenName, transition);
    this.currentScreen = screenName;
  },

  back() {
    const prev = this.history.pop();
    if (prev) {
      this.currentScreen = prev;
      this._loadScreen(prev, 'slide-right');
    }
  },

  _loadScreen(name, transition) {
    fetch(`screens/${name}.html`)
      .then(r => {
        if (!r.ok) throw new Error(`Screen not found: ${name}`);
        return r.text();
      })
      .then(html => {
        const screenEl = document.querySelector('.phone-screen');
        screenEl.innerHTML = html;
        Interactions.init(name);
        Animations.transition(transition, screenEl);
      })
      .catch(err => {
        console.error(err);
      });
  },

  init() {
    this._loadScreen(this.currentScreen, 'fade');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Router.init();
});
