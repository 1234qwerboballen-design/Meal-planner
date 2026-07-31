// native/health-bridge.js
// Bridges between your meal planner web app and HealthKit (iPhone) /
// Health Connect (Samsung/Android). On a phone, pulls steps automatically.
// On a browser/web, does nothing — manual entry in the app still works.

(function () {
  window.HealthBridge = {
    isNative: false,
    available: false,
    Health: null,

    async init() {
      if (window.Capacitor && window.Capacitor.isNativePlatform) {
        this.isNative = true;
        try {
          // @capgo/capacitor-health (modern fork of @capacitor-community/health)
          const cap = window.Capacitor.Plugins;
          this.Health = (cap && (cap.Health || cap.CapgoHealth)) ||
                        await import(/* @vite-ignore */ '@capgo/capacitor-health').then(m => m.Health);

          if (!this.Health) {
            console.warn('[HealthBridge] Plugin not loaded (still works via manual entry)');
            return { native: true, available: false };
          }

          // Check whether the underlying platform supports health data
          const avail = await this.Health.isAvailable().catch(() => ({ available: false }));
          this.available = !!avail.available;
          if (!this.available) {
            console.warn('[HealthBridge] Health data not available on this device');
            return { native: true, available: false };
          }

          // Ask the user for permission to read steps
          await this.Health.requestAuthorization({
            read: ['steps'],
            write: []
          });
          console.log('[HealthBridge] Native mode, available:', this.available);
          return { native: true, available: true };
        } catch (e) {
          console.warn('[HealthBridge] Plugin error (still works via manual entry):', e && e.message);
          this.available = false;
          return { native: true, available: false };
        }
      }
      console.log('[HealthBridge] Web mode — manual step entry only');
      return { native: false, available: false };
    },

    // Returns today's step count, or null if unavailable
    async getTodaySteps() {
      if (!this.available) return null;
      try {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const end = new Date();
        const samples = await this.Health.readSamples({
          dataType: 'steps',
          startDate: start.toISOString(),
          endDate: end.toISOString()
        });
        if (!Array.isArray(samples)) return 0;
        return samples.reduce((s, x) => s + (x.value || 0), 0);
      } catch (e) {
        console.error('[HealthBridge] getTodaySteps failed:', e);
        return null;
      }
    },

    // Returns array of { date (YYYY-MM-DD), count } for the last N days
    async getRecentSteps(days = 7) {
      if (!this.available) return null;
      try {
        const end = new Date();
        const start = new Date(); start.setDate(start.getDate() - days);
        const samples = await this.Health.readSamples({
          dataType: 'steps',
          startDate: start.toISOString(),
          endDate: end.toISOString()
        });
        if (!Array.isArray(samples)) return [];
        const byDay = {};
        samples.forEach(s => {
          const d = new Date(s.startDate);
          if (isNaN(d.getTime())) return;
          const ds = d.toISOString().slice(0, 10);
          byDay[ds] = (byDay[ds] || 0) + (s.value || 0);
        });
        return Object.entries(byDay).map(([date, count]) => ({ date, count }));
      } catch (e) {
        console.error('[HealthBridge] getRecentSteps failed:', e);
        return null;
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HealthBridge.init());
  } else {
    HealthBridge.init();
  }
})();
