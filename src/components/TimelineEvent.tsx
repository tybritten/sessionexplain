import * as React from 'react';
import './TimelineEvent.css';
import { ExplainEvent } from 'src/utils/Explain';

interface Props {
    event: ExplainEvent;
}

export class TimelineEvent extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const eventObj: any = this.props.event.event;
        var [emoji, summary] = this.renderType(this.props.event.type, eventObj);

        var body = JSON.stringify(this.props.event.event);
        return (
            <li>
                <div>
                    {emoji}
                    &nbsp;
                    <span className="Event-time">{this.props.event.time.toISOString()}</span>
                    &nbsp;
                    <span className="Event-summary">{summary}</span>
                </div>
                <div className="Event-body">{body}</div>
            </li>
        );
    }

    // helper to return an emoji and a summary for each different event type
    renderType(typeName: string, event: any): [string, string] {
        switch (typeName) {
            case "contact_field_changed":
                return ["✏️", `field '${event.field.key}' changed to '${event.value.text}'`];
            case "contact_groups_changed":
                var msgs: string[] = [];
                if (event.groups_added) {
                    msgs.push(`added to ${extractNames(event.groups_added)}`);
                }
                if (event.groups_removed) {
                    msgs.push(`removed from ${extractNames(event.groups_removed)}`);
                }
                return ["👪", msgs.join(", ")];
            case "contact_name_changed":
                return ["📛", `name changed to "${event.name}"`];
            case "contact_language_changed":
                return ["🌐", `language changed to '${event.language}'`];
            case "contact_timezone_changed":
                return ["🕑", `timezone changed to '${event.timezone}'`];
            case "contact_urns_changed":
                return ["☎️", `URNs changed to ${event.urns.join(", ")}`];
            case "error":
                return ["⚠️", event.text];
            case "flow_triggered":
                return ["↪️", `triggered flow '${event.flow.name}'`]
            case "input_labels_added":
                return ["🏷️", `labeled with ${extractNames(event.labels)}`]
            case "msg_created":
                return ["💬", `"${event.msg.text}"`];
            case "msg_received":
                return ["📥", `received message "${event.msg.text}"`];
            case "msg_wait":
                return ["⏳", "waiting for message..."];
            case "run_result_changed":
                return ["📈", `run result '${event.name}' changed to '${event.value}'`];
            case "session_triggered":
                return ["🌱", `triggered session ...`];
            case "webhook_called":
                return ["☁️", `called '${event.url}'`];
        }
        return ["❓", typeName];
    }
}

function extractNames(items: any[]): string {
    return items.map((i) => `'${i.name}'`).join(", ")
}