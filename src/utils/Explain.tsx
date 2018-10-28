import { Session, Event, Run } from './GoFlow';

export class ExplainEvent {
    public run: Run;
    public event: Event;

    constructor(run: Run, event: Event) {
        this.event = event;
    }

    get type(): string {
        return this.event.type;
    }

    get time(): Date {
        return new Date(this.event.created_on)
    }
}

export class Explain {
    public events: ExplainEvent[];

    constructor(session: Session) {

        this.events = [];

        // TODO walk thru session properly?

        for (var r = 0; r < session.runs.length; r++) {
            var run = session.runs[r];
            var runEvents = run.events || [];
            for (var e = 0; e < runEvents.length; e++) {
                var event = run.events[e]
                this.events.push(new ExplainEvent(run, event))
            }
        }

        this.events.sort(function (a: ExplainEvent, b: ExplainEvent) {
            return a.time.getTime() - b.time.getTime();
        })
    }
}
