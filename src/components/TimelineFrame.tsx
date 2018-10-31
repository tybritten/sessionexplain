import * as React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { ExplainFrame } from 'src/utils/Explain';

interface Props {
    frame: ExplainFrame;
}

export class TimelineFrame extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const frame = this.props.frame;
        const events = frame.events.map((event, i) =>
            <TimelineEvent event={event} key={`event${i}`} />
        );

        const message = `${frame.isResume ? "↩️ Resuming" : "⬇️ Starting"} run #${frame.runIndex + 1}`;

        return (
            <div className="Timeline-Frame">
                <div className="Frame-RunInfo">{message} in <i>{frame.run.flow.name}</i></div>
                <div className="Frame-Events">{events}</div>
            </div>
        );
    }
}