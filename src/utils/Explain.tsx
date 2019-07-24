import { Session, Event, Run, Step } from './GoFlow';

// A step and the events that occurred at that step
export class ExplainStep {
    public step: Step;
    public events: Event[];
    public isResume: boolean; // whether we resumed into this step
    public isComplete: boolean; // whether we completed this step

    constructor(step: Step, isResume: boolean) {
        this.step = step;
        this.events = [];
        this.isResume = isResume;
        this.isComplete = false;
    }

    public markComplete() {
        this.isComplete = true;
    }
}

// A section of a session within the same run
export class ExplainFrame {
    public run: Run;
    public runIndex: number;
    public depth: number;
    public isResume: boolean;
    public steps: ExplainStep[];

    private helper: RunHelper;

    constructor(helper: RunHelper, depth: number, isResume: boolean) {
        this.run = helper.run;
        this.runIndex = helper.index;
        this.depth = depth;
        this.isResume = isResume;
        this.steps = [];

        this.helper = helper;
    }

    public addEvent(event: Event) {
        // get the current step if we have one
        let currentStep: ExplainStep | null = null;
        if (this.steps.length > 0) {
            currentStep = this.steps[this.steps.length - 1];
        }

        // lookup the step for this event
        const eventStep = this.helper.stepsByUUID[event.step_uuid];

        // do we need to add new step?
        if (currentStep == null || currentStep.step.uuid !== eventStep.uuid) {
            // mark previous step as completed
            if (currentStep != null) {
                currentStep.markComplete();
            }

            const stepIsResume = this.isResume && this.steps.length === 0;
            currentStep = new ExplainStep(eventStep, stepIsResume);
            this.steps.push(currentStep)
        }

        currentStep.events.push(event);
    }

    public markComplete() {
        // mark final step as complete
        if (this.steps.length > 0) {
            this.steps[this.steps.length - 1].markComplete();
        }
    }
}

export type URLResolver = (uuid: string) => string;

export class Explain {
    public session: Session;
    public frames: ExplainFrame[];
    public flowResolver: URLResolver | null;

    constructor(session: Session) {
        this.session = session;
        this.frames = []

        // convert all runs to helpers
        const helpers = this.buildRunHelpers(session.runs);

        // if we have a site URL, create a link resolver for flows
        if (session._metadata != null) {
            var siteURL = session._metadata.site;
            if (!siteURL.endsWith("/")) {
                siteURL += "/";
            }
            this.flowResolver = (uuid: string) => `${siteURL}flow/editor/${uuid}/`;
        }

        // helper to create a new current frame
        const newFrame = (run: RunHelper, depth: number, isResume: boolean) => {
            const f: ExplainFrame = new ExplainFrame(run, depth, isResume);
            this.frames.push(f);
            return f;
        }

        let currentRun: RunHelper | undefined = helpers[0];
        let currentFrame = newFrame(currentRun, 0, false);

        while (true) {
            if (currentRun == null) {
                break;
            }

            // read the next event from the current run
            let currentEvent = currentRun.events.shift();

            if (currentEvent == null) {
                currentFrame.markComplete();

                // out of events in this run, resume reading from the parent
                currentRun = currentRun.parent

                // if we don't have a parent to resume, we're done
                if (currentRun == null) {
                    break
                }
                currentFrame = newFrame(currentRun, currentFrame.depth - 1, true);
            } else {
                currentFrame.addEvent(currentEvent);

                if (currentEvent.type === "flow_entered") {
                    // switch to reading events from the next child that this event spawned
                    currentRun = currentRun.children.shift();
                    if (currentRun == null) {
                        throw new Error("Couldn't find child run for flow_entered event");
                    }
                    currentFrame = newFrame(currentRun, currentFrame.depth + 1, false);
                }
            }
        }

        console.log("Explain calculated!");
    }

    private buildRunHelpers(runs: Run[]): RunHelper[] {
        let helpers: RunHelper[] = []
        let helpersByUUID: { [key: string]: RunHelper; } = {};
        for (let r = 0; r < runs.length; r++) {
            const run = runs[r];
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
        return helpers;
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
