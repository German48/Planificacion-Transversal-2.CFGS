/**
 * NOTIFICATION MANAGER
 * Sistema de notificaciones locales para el seguimiento de entregas (DoD)
 */

class NotificationManager {
    constructor() {
        this.permissionRequested = false;
        this.checkInterval = 1000 * 60 * 60; // 1 hora de intervalo para chequeos si la app está abierta
    }

    /**
     * Inicializar el sistema
     */
    async init() {
        const settings = this.getNotifSettings();
        if (settings && settings.enabled) {
            await this.requestPermission();
            this.runScheduledCheck();
        }
        console.log('🔔 NotificationManager inicializado');
    }

    /**
     * Obtener configuración de notificaciones (prioriza student.notifications)
     */
    getNotifSettings() {
        if (!window.SettingsManager) return null;
        return window.SettingsManager.settings.student?.notifications ||
            window.SettingsManager.settings.notifications;
    }

    /**
     * Solicitar permiso para notificaciones
     */
    async requestPermission() {
        if (!("Notification" in window)) {
            return false;
        }

        if (Notification.permission === "granted") return true;

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    }

    /**
     * Ejecutar chequeo programado
     */
    runScheduledCheck() {
        this.checkDeadlines();
        // Repetir periódicamente
        setInterval(() => this.checkDeadlines(), this.checkInterval);
    }

    /**
     * Verificar si hay entregas próximas o retrasadas
     */
    checkDeadlines() {
        const settings = this.getNotifSettings();
        if (!settings || !settings.enabled || Notification.permission !== "granted") return;

        // Comprobar si ya hemos avisado hoy
        const todayStr = new Date().toISOString().split('T')[0];
        const lastCheck = localStorage.getItem('last_notification_check');
        if (lastCheck === todayStr) {
            console.log('🔔 Ya se realizaron las notificaciones hoy');
            return;
        }

        const masterPlan = window.MASTER_PLAN;
        if (!masterPlan || !masterPlan.weeks) return;

        const now = new Date();
        const overdueTasks = [];
        const upcomingTasks = [];

        masterPlan.weeks.forEach(week => {
            if (!week.date_to) return;

            const dateTo = new Date(week.date_to);
            const diffTime = dateTo - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Verificar si la semana está completada (estimación basada en ProgressTracker)
            const isCompleted = this.isWeekCompleted(week.week_id);

            if (!isCompleted) {
                if (diffDays < 0 && (settings.overdueTasks || settings.pendingTasks)) {
                    overdueTasks.push(week);
                } else if (diffDays >= 0 && diffDays <= (settings.daysBefore || settings.daysBeforeDeadline) && settings.upcomingDeadlines) {
                    upcomingTasks.push(week);
                }
            }
        });

        if (overdueTasks.length > 0) {
            this.notify('⚠️ Tareas Retrasadas', `Tienes ${overdueTasks.length} entregas pendientes que han vencido. ¡Revísalas!`);
        } else if (upcomingTasks.length > 0) {
            this.notify('📅 Entregas Próximas', `Tienes entregas que vencen en menos de ${settings.daysBefore || settings.daysBeforeDeadline} días.`);
        }

        // Registrar último chequeo exitoso
        localStorage.setItem('last_notification_check', todayStr);
    }

    /**
     * Comprobar si una semana tiene sus hitos (Gates) completados
     */
    isWeekCompleted(weekId) {
        if (!window.ProgressTracker) return false;

        // 1. Comprobar Gates (Hitos)
        const gateKey = `gate_${weekId}`;
        const gates = window.ProgressTracker.state.gates || {};
        if (gates[gateKey] && gates[gateKey].completed) return true;

        // 2. Comprobar DoDs semanales
        const weeklyDods = window.ProgressTracker.getWeeklyDodsForWeek(weekId);
        const keys = Object.keys(weeklyDods);
        if (keys.length > 0) {
            const allDone = keys.every(k => weeklyDods[k].completed);
            if (allDone) return true;
        }

        return false;
    }

    /**
     * Enviar notificación nativa
     */
    notify(title, body) {
        try {
            const options = {
                body: body,
                icon: 'favicon.png', // Ajustar si hay uno específico de alerta
                badge: 'favicon.png',
                tag: 'edutrack-deadline',
                requireInteraction: true // Mantiene la notificación hasta que el usuario interactúe
            };

            const notification = new Notification(title, options);

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Error al enviar notificación:', error);
        }
    }
}

// Singleton para acceso global
const notificationManager = new NotificationManager();
window.NotificationManager = notificationManager;

// Inicialización automática al cargar el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => notificationManager.init());
} else {
    notificationManager.init();
}
