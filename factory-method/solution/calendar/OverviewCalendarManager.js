import { AbstractCalendarManager } from './AbstractCalendarManager.js';

export class OverviewCalendarManager extends AbstractCalendarManager {
    async fetchData() {
        const res = await fetch('https://dummyjson.com/c/a1b6-52bb-4311-917a');
        this.rawData = (await res.json()).data;
    }

    mapEvents(data) {
        return data.map(project => ({
            id: project.id,
            title: project.name,
            start: project.start,
            end: project.end,
            priority: project.priority.name
        }));
    }

    extractFilters(data) {
        const unique = new Map();
        data.forEach(event => {
            if (event.priority?.name && !unique.has(event.priority.name)) {
                unique.set(event.priority.name, {
                    name: event.priority.name,
                    value: event.priority.value
                });
            }
        });
        return Array.from(unique.values());
    }

    getFilterKey() {
        return 'priority';
    }

    onEventClick(info) {
        info.jsEvent.preventDefault();
        window.location.reload();
    }
}
