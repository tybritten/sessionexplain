import * as React from 'react';
import './TimelineEvent.css';
import { ExplainEvent } from 'src/utils/Explain';

interface Props {
    event: ExplainEvent;
    index: number;
}

export class TimelineEvent extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        var typeName = this.props.event.type;
        var emoji: string;
        var summary: string;
        switch (typeName) {
            case "msg_created":
                emoji = "💬"
                summary = "....."
                break
            default:
                emoji = "❓"
                summary = this.props.event.type
        }

        var body = JSON.stringify(this.props.event.event);
        return (
            <li key={this.props.index}>
                {emoji}
                <span className="Event-time">{this.props.event.time.toISOString()}</span>
                &nbsp;
                <span className="Event-summary">{summary}</span>
                <div className="Event-body">{body}</div>
            </li>
        )
    }
}