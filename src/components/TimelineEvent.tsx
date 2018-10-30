import * as React from 'react';
import { Event } from 'src/utils/GoFlow';
import './TimelineEvent.css';

interface Props {
    event: Event;
}

interface State {
    showBody: boolean;
}

export class TimelineEvent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { showBody: false };

        this.handleToggleBody = this.handleToggleBody.bind(this);
    }

    handleToggleBody() {
        this.setState({ showBody: !this.state.showBody });
    }

    render() {
        const eventObj: any = this.props.event;
        const [emoji, summary] = this.renderType(this.props.event.type, eventObj);

        var body = JSON.stringify(this.props.event);
        return (
            <div className="Event">
                <div className="Event-header" onClick={this.handleToggleBody}>
                    {emoji}
                    &nbsp;
                    <span className="Event-time">{this.props.event.created_on}</span>
                    &nbsp;
                    <span className="Event-summary">{summary}</span>
                </div>
                <div className="Event-body" style={this.state.showBody ? {} : { "display": "none" }}>{body}</div>
            </div>
        );
    }

    // helper to return an emoji and a summary for each different event type
    renderType(typeName: string, event: any): [string, JSX.Element] {
        switch (typeName) {
            case "broadcast_created":
                const text: string = event.translations[event.base_language].text;
                return ["🔉", <span>broadcasted <i>{text}</i> to ...</span>]
            case "contact_field_changed":
                return ["✏️", <span>field <i>{event.field.key}</i> changed to <i>{event.value.text}</i></span>];
            case "contact_groups_changed":
                var msgs: string[] = [];
                if (event.groups_added) {
                    msgs.push(`added to ${extractNames(event.groups_added)}`);
                }
                if (event.groups_removed) {
                    msgs.push(`removed from ${extractNames(event.groups_removed)}`);
                }
                return ["👪", <span>{msgs.join(", ")}</span>];
            case "contact_name_changed":
                return ["📛", <span>name changed to <i>{event.name}</i></span>];
            case "contact_language_changed":
                return ["🌐", <span>language changed to <i>{event.language}</i></span>];
            case "contact_timezone_changed":
                return ["🕑", <span>timezone changed to <i>{event.timezone}</i></span>];
            case "contact_urns_changed":
                return ["☎️", <span>URNs changed to {event.urns.join(", ")}</span>];
            case "email_created":
                return ["✉️", <span>email sent to {event.addresses.join(", ")}</span>];
            case "error":
                return ["⚠️", <span>{event.text}</span>];
            case "flow_triggered":
                return ["↪️", <span>triggered flow <i>{event.flow.name}</i></span>];
            case "input_labels_added":
                return ["🏷️", <span>labeled with {extractNames(event.labels)}</span>];
            case "msg_created":
                return ["💬", <span>"{event.msg.text}"</span>];
            case "msg_received":
                return ["📥", <span>received message <i>{event.msg.text}</i></span>];
            case "msg_wait":
                return ["⏳", <span>waiting for message...</span>];
            case "run_result_changed":
                return ["📈", <span>run result <i>{event.name}</i> changed to <i>{event.value}</i></span>];
            case "session_triggered":
                return ["🌱", <span>triggered session ...</span>];
            case "webhook_called":
                return ["☁️", <span>called <i>{event.url}</i></span>];
        }
        return ["❓", <span>{typeName}</span>];
    }
}

function extractNames(items: any[]): string {
    return items.map((i) => `'${i.name}'`).join(", ");
}