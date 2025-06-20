import { AbstractCalendarManager } from './AbstractCalendarManager.js';

export class IndexCalendarManager extends AbstractCalendarManager {
    async fetchData() {
        const res = await fetch('https://dummyjson.com/c/72b8-a565-4f66-ad3e');
        this.rawData = (await res.json()).data;
    }

    mapEvents(data) {
        return data.map(project => ({
            id: project.id,
            title: project.name,
            start: project.start_date,
            end: project.end_date,
            backgroundColor: project.color[0],
            textColor: '#ffffff',
            task: project.task
        }));
    }

    extractFilters(data) {
        const unique = new Map();
        data.forEach(event => {
            if (event.task && !unique.has(event.task)) {
                unique.set(event.task, { name: event.task, value: event.task });
            }
        });
        return Array.from(unique.values());
    }

    getFilterKey() {
        return 'task';
    }

    onEventClick(info) {
        info.jsEvent.preventDefault();
        alert(JSON.stringify(info.event));
    }
}
