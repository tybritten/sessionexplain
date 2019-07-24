
export interface FlowReference {
    uuid: string;
    name: string;
}

export interface Step {
    uuid: string;
    node_uuid: string;
}

export interface Event {
    type: string;
    step_uuid: string;
    created_on: string;
}

export interface Run {
    uuid: string;
    flow: FlowReference;
    status: string;
    events: Event[];
    path: Step[];
    parent_uuid: string | null;
}

export interface Trigger {
    type: string;
    flow: FlowReference;
    contact: any;
    environment: any;
}

export interface Metadata {
    site: string;
}

export interface Session {
    trigger: Trigger;
    status: string;
    runs: Run[];
    _metadata: Metadata | null;
}

export function ReadSession(src: string): Session {
    try {
        var obj = JSON.parse(src);
    } catch (e) {
        throw new Error(`invalid JSON: ${e}`);
    }

    // could be an output from simulator which has nested session
    if (typeof obj.session === "object") {
        obj = obj.session
    }

    if (!isSession(obj)) {
        throw new Error("not a valid session object")
    }

    return obj
}

function isSession(o: any): o is Session {
    // TODO
    const s: Session = o
    return typeof s.status === "string";
}