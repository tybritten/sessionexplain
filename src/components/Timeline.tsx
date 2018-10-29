import * as React from 'react';
import './Timeline.css';

import { ExplainEvent } from 'src/utils/Explain';
import { TimelineEvent } from './TimelineEvent';

interface Props {
    events: ExplainEvent[];
}

export class Timeline extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const items = this.props.events.map((event, i) =>
            <TimelineEvent event={event} key={i} />
        );

        return (
            <ul className="Timeline">{items}</ul>
        );
    }
}