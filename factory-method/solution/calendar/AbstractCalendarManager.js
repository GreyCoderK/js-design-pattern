export class AbstractCalendarManager {
    constructor({ calendarEl, filterEl, filterClass }) {
        this.calendarEl = calendarEl;
        this.filterEl = filterEl;
        this.filterClass = filterClass;
        this.events = [];
        this.rawData = [];
        this.filters = [];
        this.calendar = null;
    }

    async init() {
        await this.fetchData();
        this.events = this.mapEvents(this.rawData);
        this.filters = this.extractFilters(this.rawData);
        this.renderCalendar();
        this.setupFilters();
    }

    async fetchData() {
        throw new Error('fetchData() must be implemented by subclass');
    }

    mapEvents(data) {
        throw new Error('mapEvents() must be implemented by subclass');
    }

    extractFilters(data) {
        throw new Error('extractFilters() must be implemented by subclass');
    }

    onEventClick(info) {
        // Optionnel
    }

    renderCalendar() {
        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridMonth',
            events: this.events,
            locale: 'fr',
            headerToolbar: {
                start: 'prev,next, title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            buttonText: {
                listMonth: 'planning (Mois)',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                next: 'Suivant',
                prev: 'Précédent'
            },
            eventClick: this.onEventClick.bind(this)
        });
        this.calendar.render();
    }

    setupFilters() {
        if (!(this.filterEl instanceof HTMLElement)) return;
        this.filterEl.innerHTML = this.filters.map(this.generateCheckboxHtml.bind(this)).join('');

        const checkboxes = this.filterEl.querySelectorAll(`.${this.filterClass}`);
        checkboxes.forEach(cb => {
            cb.addEventListener('change', this.handleFilterChange.bind(this));
        });
    }

    generateCheckboxHtml(filter) {
        const name = filter.name || 'Unknown';
        const id = `select-${name.toLowerCase().replace(/\s/g, '-')}`;
        return `<div class="form-check mb-5 ms-2">
            <input class="form-check-input ${this.filterClass}" type="checkbox" id="${id}" data-value="${name}" checked />
            <label class="form-check-label" for="${id}">${name}</label>
        </div>`;
    }

    handleFilterChange() {
        const selected = Array.from(document.querySelectorAll(`.${this.filterClass}:checked`))
                              .map(cb => cb.dataset.value);
        const filtered = this.events.filter(event =>
            selected.includes(event[this.getFilterKey()])
        );
        this.calendar.setOption('events', filtered);
    }

    getFilterKey() {
        throw new Error('getFilterKey() must be implemented by subclass');
    }
}
