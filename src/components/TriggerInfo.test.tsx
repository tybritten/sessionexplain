import * as React from 'react';
import { TriggerInfo } from './TriggerInfo';
import { mount, configure } from 'enzyme';
import * as ReactSixteenAdapter from 'enzyme-adapter-react-16';

configure({ adapter: new ReactSixteenAdapter() });

it('renders appropriate summary for different trigger types', () => {
    const tests: { trigger: any, summary: string }[] = [
        {
            trigger: {
                type: "campaign",
                event: {
                    uuid: "34d16dbd-476d-4b77-bac3-9f3d597848cc",
                    campaign: { "uuid": "58e9b092-fe42-4173-876c-ff45a14a24fe", "name": "New Mothers" }
                }
            },
            summary: "📅 started by event in New Mothers campaign"
        },
        {
            trigger: {
                type: "channel",
                event: {
                    type: "new_conversation",
                    channel: { uuid: "58e9b092-fe42-4173-876c-ff45a14a24fe", name: "Facebook" }
                }
            },
            summary: "📻 started by new_conversation event on Facebook channel"
        },
        {
            trigger: {
                type: "flow_action"
            },
            summary: "🏁 started by action in another flow session"
        },
        {
            trigger: {
                type: "manual"
            },
            summary: "👷 manually started"
        },
        {
            trigger: {
                type: "msg"
            },
            summary: "📥 message received that didn't match anything else"
        },
        {
            trigger: {
                type: "msg",
                keyword_match: {
                    type: "first_word",
                    keyword: "start"
                }
            },
            summary: "📥 message received whose first word matched start"
        },
        {
            trigger: {
                type: "msg",
                keyword_match: {
                    type: "only_word",
                    keyword: "start"
                }
            },
            summary: "📥 message received whose only word matched start"
        }
    ];

    for (let t = 0; t < tests.length; t++) {
        const wrapper = mount(<TriggerInfo trigger={tests[t].trigger} />);
        const info = wrapper.find('.Trigger-info');
        expect(info.render().find(".Trigger-summary").text()).toBe(tests[t].summary);
    }
});
