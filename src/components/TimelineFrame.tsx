import * as React from 'react';
import { TimelineStep } from './TimelineStep';
import { ExplainFrame } from 'src/utils/Explain';

interface Props {
    frame: ExplainFrame;
    index: number;
}

export class TimelineFrame extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const frame = this.props.frame;
        const steps = frame.steps.map((step, i) =>
            <TimelineStep step={step} index={i} key={`frame${this.props.index}-step${i}`} />
        );

        const message = `${frame.isResume ? "↩️ Resuming" : "⬇️ Starting"} run #${frame.runIndex + 1}`;

        return (
            <div className="Timeline-frame">
                <div className="Frame-run-info">{message} in <i>{frame.run.flow.name}</i></div>
                <div className="Frame-steps">
                    {steps}
                </div>
            </div>
        );
    }
}