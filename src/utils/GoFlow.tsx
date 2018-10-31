export interface FlowReference {
    uuid: string;
    name: string;
}

export interface Event {
    type: string;
    created_on: string;
}

export interface Run {
    uuid: string;
    flow: FlowReference;
    status: string;
    events: Event[];
    parent_uuid: string | null;
}

export interface Session {
    status: string;
    runs: Run[];
}

export function ReadSession(src: string): Session {
    try {
        var obj = JSON.parse(src);
    } catch (e) {
        throw `invalid JSON: ${e}`;
    }

    if (!isSession(obj)) {
        throw "not a valid session object"
    }

    return obj
}

function isSession(o: any): o is Session {
    // TODO
    const s: Session = o
    return typeof s.status === "string";
}