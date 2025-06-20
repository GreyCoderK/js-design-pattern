import { IndexCalendarManager } from './IndexCalendarManager.js';
import { OverviewCalendarManager } from './OverviewCalendarManager.js';

export class CalendarManagerFactory {
    static create(configName) {
        switch (configName) {
            case 'index':
                return new IndexCalendarManager({
                    calendarEl: document.getElementById('calendar'),
                    filterEl: document.getElementById('filters'),
                    filterClass: 'input-filter'
                });
            case 'overview':
                return new OverviewCalendarManager({
                    calendarEl: document.getElementById('calendar-overview'),
                    filterEl: document.getElementById('calendar-filters'),
                    filterClass: 'filter-calendar'
                });
            default:
                throw new Error(`Unknown config: ${configName}`);
        }
    }
}
