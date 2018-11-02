import * as React from 'react';
import { Trigger } from 'src/utils/GoFlow';
import './TriggerInfo.css';

interface Props {
    trigger: Trigger;
}

export class TriggerInfo extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const triggerObj: any = this.props.trigger;
        const [emoji, summary] = this.renderType(this.props.trigger.type, triggerObj);

        return (
            <div className="Trigger-info">
                <div className="Trigger-summary">{emoji} {summary}</div>
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