import * as React from 'react';
import './Timeline.css';

import { ExplainFrame } from 'src/utils/Explain';
import { TimelineFrame } from './TimelineFrame';

interface Props {
    frames: ExplainFrame[];
}

export class Timeline extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const items = this.props.frames.map((frame, i) =>
            <TimelineFrame frame={frame} index={i} key={`frame${i}`} />
        );

        return (
            <div className="Timeline">{items}</div>
        );
    }
}

