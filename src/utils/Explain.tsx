import { Session, Event, Run } from './GoFlow';

export class ExplainFrame {
    public run: Run;
    public runIndex: number;
    public isResume: boolean;
    public events: Event[];

    constructor(run: Run, runIndex: number, isResume: boolean) {
        this.run = run;
        this.runIndex = runIndex;
        this.isResume = isResume;
        this.events = [];
    }
}

export class Explain {
    public frames: ExplainFrame[];

    constructor(session: Session) {
        if (session.runs.length == 0) {
            throw "Session has no runs";
        }

        // convert all runs to helpers
        let helpers: RunHelper[] = []
        let helpersByUUID: { [key: string]: RunHelper; } = {};
        for (let r = 0; r < session.runs.length; r++) {
            const run = session.runs[r];
            const helper = new RunHelper(run, r);
            helpers.push(helper);
            helpersByUUID[run.uuid] = helper;
        }

        // go back through runs and set children and parents
        for (let r = 0; r < helpers.length; r++) {
            const helper = helpers[r];
            if (helper.run.parent_uuid) {
                helper.parent = helpersByUUID[helper.run.parent_uuid];
                helper.parent.children.push(helper);
            }
        }

        this.frames = []

        const newFrame = (run: RunHelper, isResume: boolean) => {
            const f: ExplainFrame = new ExplainFrame(run.run, run.index, isResume);
            this.frames.push(f);
            return f;
        }

        let currentRun: RunHelper | undefined = helpers[0];
        let currentFrame = newFrame(currentRun, false);

        while (true) {
            if (currentRun == null) {
                break;
            }

            // read the next event from the current run
            let currentEvent = currentRun.events.shift();

            if (currentEvent == null) {
                // out of events in this run, resume reading from the parent
                currentRun = currentRun.parent

                // if we don't have a parent to resume, we're done
                if (currentRun == null) {
                    break
                }
                currentFrame = newFrame(currentRun, true);
            } else {
                currentFrame.events.push(currentEvent);

                if (currentEvent.type == "flow_triggered") {
                    // switch to reading events from the next child that this event spawned
                    currentRun = currentRun.children.shift();
                    if (currentRun == null) {
                        throw "Couldn't find child run for flow_triggered event";
                    }
                    currentFrame = newFrame(currentRun, false);
                }
            }
        }
    }

}

class RunHelper {
    public run: Run;
    public index: number;
    public events: Event[];
    public parent: RunHelper;
    public children: RunHelper[];

    constructor(run: Run, index: number) {
        this.run = run;
        this.index = index;
        this.events = run.events ? run.events.slice() : [];
        this.children = [];
    }
}
