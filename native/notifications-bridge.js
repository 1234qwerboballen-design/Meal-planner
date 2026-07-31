// native/notifications-bridge.js
// Schedules local notifications on the phone for daily encouraging verses,
// workout milestones, and streak achievements. No-op on web.

(function () {
  window.NotificationsBridge = {
    isNative: false,
    available: false,
    LocalNotifications: null,

    async init() {
      if (window.Capacitor && window.Capacitor.isNativePlatform) {
        this.isNative = true;
        try {
          this.LocalNotifications =
            window.Capacitor.Plugins.LocalNotifications ||
            await import('@capacitor/local-notifications').then(m => m.LocalNotifications);
          const perms = await this.LocalNotifications.requestPermissions();
          this.available = !!perms.display;
          console.log('[NotificationsBridge] Native mode, available:', this.available);
          return this.available;
        } catch (e) {
          console.warn('[NotificationsBridge] Plugin not available:', e && e.message);
          return false;
        }
      }
      console.log('[NotificationsBridge] Web mode — toasts only');
      return false;
    },

    // Schedule one daily notification at a specific hour
    async scheduleDaily(hour, minute, title, body) {
      if (!this.available) return;
      try {
        const fireAt = new Date();
        fireAt.setHours(hour, minute, 0, 0);
        if (fireAt < new Date()) fireAt.setDate(fireAt.getDate() + 1);

        await this.LocalNotifications.schedule({
          notifications: [{
            id: Math.floor(Math.random() * 100000),
            title: title,
            body: body,
            schedule: { at: fireAt, repeats: true, every: 'day' }
          }]
        });
      } catch (e) {
        console.error('[NotificationsBridge] scheduleDaily failed:', e);
      }
    },

    // Fire an immediate notification (e.g., goal hit, streak milestone)
    async fireNow(title, body) {
      if (!this.available) return;
      try {
        await this.LocalNotifications.schedule({
          notifications: [{
            id: Math.floor(Math.random() * 100000),
            title: title,
            body: body,
            schedule: { at: new Date(Date.now() + 1000) }
          }]
        });
      } catch (e) {
        console.error('[NotificationsBridge] fireNow failed:', e);
      }
    },

    // Cancel all pending notifications
    async cancelAll() {
      if (!this.available) return;
      try {
        const pending = await this.LocalNotifications.getPending();
        if (pending && pending.notifications && pending.notifications.length) {
          await this.LocalNotifications.cancel(pending);
        }
      } catch (e) { /* ignore */ }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NotificationsBridge.init());
  } else {
    NotificationsBridge.init();
  }
})();
