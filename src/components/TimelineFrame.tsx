import * as React from 'react';
import './TimelineFrame.css';
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
        const events = this.props.frame.events.map((event, i) =>
            <TimelineEvent event={event} key={`event${i}`} />
        );

        return (
            <div className="Timeline-Frame">
                <div>{this.props.frame.run.flow.name}</div>
                <div>{events}</div>
            </div>
        );
    }
}