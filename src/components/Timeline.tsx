import * as React from 'react';
import './Timeline.css';

import { ExplainFrame, URLResolver } from 'utils/Explain';
import { TimelineFrame } from './TimelineFrame';

interface Props {
    frames: ExplainFrame[];
    flowResolver: URLResolver | null;
}

// Timeline of session frames
export class Timeline extends React.Component<Props> {

    public render() {
        const items = this.props.frames.map((frame, i) =>
            <TimelineFrame frame={frame} index={i} key={`frame${i}`} flowResolver={this.props.flowResolver} />
        );

        return (
            <div className="Timeline">{items}</div>
        );
    }
}

