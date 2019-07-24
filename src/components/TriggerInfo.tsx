import * as React from 'react';
import { Trigger } from 'utils/GoFlow';
import './TriggerInfo.css';

interface Props {
    trigger: Trigger;
}

interface State {
    showBody: boolean;
}

export class TriggerInfo extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { showBody: false };

        this.handleToggleBody = this.handleToggleBody.bind(this);
    }

    handleToggleBody() {
        this.setState({ showBody: !this.state.showBody });
    }

    public render() {
        const triggerObj: any = this.props.trigger;
        const [emoji, summary] = this.renderType(this.props.trigger.type, triggerObj);

        const body = { __html: "<pre>" + JSON.stringify(this.props.trigger, null, 2) + "</pre>" };
        const bodyElem = (
            <div dangerouslySetInnerHTML={body}></div>
        );
        const docsURL = `https://nyaruka.github.io/goflow/sessions.html#trigger:${this.props.trigger.type}`;

        return (
            <div className="Trigger-info">
                <div className="Trigger-header" onClick={this.handleToggleBody}>
                    {emoji}
                    &nbsp;
                    <span className="Trigger-summary">{summary}</span>
                </div>
                <div className="Trigger-body" style={this.state.showBody ? {} : { "display": "none" }}>
                    {bodyElem}
                    <div><a href={docsURL} target="_blank" rel="noopener noreferrer">Docs</a></div>
                </div>
            </div>
        );
    }

    private renderType(typeName: string, trigger: any): [string, JSX.Element] {
        switch (typeName) {
            case "campaign":
                return ['📅', <>started by event in <i>{trigger.event.campaign.name}</i> campaign</>];
            case "channel":
                return ['📻', <>started by <i>{trigger.event.type}</i> event on <i>{trigger.event.channel.name}</i> channel</>];
            case "flow_action":
                return ['🏁', <>started by action in another flow session</>];
            case "manual":
                return ['👷', <>manually started</>];
            case "msg":
                const emoji = "📥";
                if (trigger.keyword_match != null) {
                    const match_type = trigger.keyword_match.type.replace("_", " ");
                    return [emoji, <>message received whose <i>{match_type}</i> matched <i>{trigger.keyword_match.keyword}</i></>];
                }
                return [emoji, <>message received that didn't match anything else</>];

        }
        return ["❓", <>{typeName}</>];
    }
}