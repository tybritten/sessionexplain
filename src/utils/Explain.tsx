import { Session, Event, Run, Step } from './GoFlow';

// a step and the events that occurred at that step
export class ExplainStep {
    public step: Step;
    public events: Event[];

    constructor(step: Step) {
        this.step = step;
        this.events = [];
    }
}

export class ExplainFrame {
    public run: Run;
    public runIndex: number;
    public isResume: boolean;
    public steps: ExplainStep[];

    private helper: RunHelper;

    constructor(helper: RunHelper, isResume: boolean) {
        this.run = helper.run;
        this.runIndex = helper.index;
        this.isResume = isResume;
        this.steps = [];

        this.helper = helper;
    }

    public addEvent(event: Event) {
        const eventStep = this.helper.stepsByUUID[event.step_uuid];
        let currentStep: ExplainStep | null = null;

        if (this.steps.length == 0 || this.steps[this.steps.length - 1].step.uuid != eventStep.uuid) {
            currentStep = new ExplainStep(eventStep);
            this.steps.push(currentStep)
        } else {
            currentStep = this.steps[this.steps.length - 1];
        }

        // console.log(`Adding event ${event.type} to step ${currentStep.step.uuid}`)

        currentStep.events.push(event);
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

        console.log("Run helpers built");

        this.frames = []

        // helper to create a new current frame
        const newFrame = (run: RunHelper, isResume: boolean) => {
            const f: ExplainFrame = new ExplainFrame(run, isResume);
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
                currentFrame.addEvent(currentEvent);

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

        console.log("Explain calculated!");
    }
}

class RunHelper {
    public run: Run;
    public index: number;
    public events: Event[];
    public parent: RunHelper;
    public children: RunHelper[];

    // step UUID -> step
    public stepsByUUID: { [key: string]: Step; };

    constructor(run: Run, index: number) {
        this.run = run;
        this.index = index;
        this.events = run.events ? run.events.slice() : [];
        this.children = [];

        this.stepsByUUID = {};
        for (let s = 0; s < run.path.length; s++) {
            const step = run.path[s];
            this.stepsByUUID[step.uuid] = step;
        }
    }
}
