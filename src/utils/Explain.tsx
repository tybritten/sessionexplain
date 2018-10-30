import { Session, Event, Run } from './GoFlow';

export class ExplainFrame {
    public run: Run;
    public initial: boolean;
    public events: Event[];

    constructor(run: Run) {
        this.run = run;
        this.events = [];
    }
}

export class Explain {
    public frames: ExplainFrame[];

    constructor(session: Session) {

        // get all events from all runs
        let eventAndRuns: EventAndRun[] = [];

        for (var r = 0; r < session.runs.length; r++) {
            var run = session.runs[r];
            var runEvents = run.events || [];
            for (var e = 0; e < runEvents.length; e++) {
                var event = run.events[e]
                eventAndRuns.push(new EventAndRun(event, run))
            }
        }

        // sort chronologically
        eventAndRuns.sort(function (a: EventAndRun, b: EventAndRun) { return a.time - b.time; })

        this.frames = []

        // organize into frames
        let currentFrame: ExplainFrame | null = null;

        for (var e = 0; e < eventAndRuns.length; e++) {
            const er = eventAndRuns[e];
            if (currentFrame == null || er.run != currentFrame.run) {
                currentFrame = new ExplainFrame(er.run);
                this.frames.push(currentFrame);
            }
            currentFrame.events.push(er.event);
        }
    }
}


class EventAndRun {
    public event: Event;
    public run: Run;

    constructor(event: Event, run: Run) {
        this.event = event;
        this.run = run;
    }

    get time(): number {
        return (new Date(this.event.created_on)).getTime();
    }
}
