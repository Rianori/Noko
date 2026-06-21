// portfolio-store.js — état partagé du portefeuille NoKo (démo)
// Persisté en localStorage pour rester cohérent au sein de demo/index.html (page unique).
// ATTENTION : ceci est une simulation pédagogique, aucune donnée ne sort du navigateur.

window.NokoStore = (function(){
  const KEY = 'noko_demo_portfolio_v1';
  const MARKET_KEY = 'noko_demo_market_v1';

  // Fallback mémoire si localStorage est inaccessible (navigation privée stricte, etc.)
  let memoryFallback = [];
  let storageAvailable = true;
  try{
    const testKey = '__noko_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
  }catch(e){
    storageAvailable = false;
    console.warn('NokoStore: localStorage indisponible, le portefeuille ne persistera pas entre les pages dans cette session.', e);
  }

  function load(){
    if(!storageAvailable) return memoryFallback;
    try{
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.warn('NokoStore: lecture portefeuille impossible', e);
      return memoryFallback;
    }
  }

  function save(items){
    if(!storageAvailable){
      memoryFallback = items;
      return;
    }
    try{
      localStorage.setItem(KEY, JSON.stringify(items));
    }catch(e){
      console.warn('NokoStore: écriture portefeuille impossible, bascule en mémoire pour cette session', e);
      storageAvailable = false;
      memoryFallback = items;
    }
  }

  function genId(){
    return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  return {
    /** Renvoie la liste complète des titres détenus (actifs + en vente) */
    getHoldings(){ return load(); },

    /** Ajoute un nouveau titre suite à un investissement (page Projets ou achat sur le marché) */
    addHolding(holding){
      const items = load();
      items.push(Object.assign({
        id: genId(),
        status: 'actif', // 'actif' | 'en_vente'
        askPrice: null,
        acquiredAt: Date.now()
      }, holding));
      save(items);
      return items;
    },

    /** Met un titre en vente à un prix fixé par l'utilisateur */
    listForSale(holdingId, askPrice){
      const items = load();
      const item = items.find(h => h.id === holdingId);
      if(item){
        item.status = 'en_vente';
        item.askPrice = askPrice;
      }
      save(items);
      return items;
    },

    /** Retire un titre de la vente, le repasse actif */
    cancelSale(holdingId){
      const items = load();
      const item = items.find(h => h.id === holdingId);
      if(item){
        item.status = 'actif';
        item.askPrice = null;
      }
      save(items);
      return items;
    },

    /** Retire définitivement un titre du portefeuille (vendu) */
    removeHolding(holdingId){
      const items = load().filter(h => h.id !== holdingId);
      save(items);
      return items;
    },

    /** Vide tout le portefeuille (utilisé par le bouton de réinitialisation démo) */
    reset(){
      save([]);
    }
  };
})();
