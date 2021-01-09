// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {getOutgoingHooks} from 'mattermost-redux/selectors/entities/integrations';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {getAllChannels} from 'mattermost-redux/selectors/entities/channels';
import {getUsers} from 'mattermost-redux/selectors/entities/users';
import {haveITeamPermission} from 'mattermost-redux/selectors/entities/roles';
import {Permissions} from 'mattermost-redux/constants';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {removeOutgoingHook, regenOutgoingHookToken} from 'mattermost-redux/actions/integrations';

import {loadOutgoingHooksAndProfilesForTeam} from 'actions/integration_actions';

import {GlobalState} from 'mattermost-redux/types/store';
import {ActionResult, GenericAction} from 'mattermost-redux/types/actions';


import InstalledOutgoingWebhook from './installed_outgoing_webhooks';

type Actions = {
    removeOutgoingHook: (hookId: string) => Promise<ActionResult>;
    regenOutgoingHookToken: (hookId: string) => Promise<ActionResult>;
    loadOutgoingHooksAndProfilesForTeam: (teamId: string, startPageNumber: number,
                                          pageSize: string) => Promise<ActionResult>;
}

function mapStateToProps(state: GlobalState) {
    const config = getConfig(state);
    const teamId = getCurrentTeamId(state);
    const canManageOthersWebhooks = haveITeamPermission(state, {team: teamId, permission: Permissions.MANAGE_OTHERS_OUTGOING_WEBHOOKS});
    const outgoingHooks = getOutgoingHooks(state);
    const outgoingWebhooks = Object.keys(outgoingHooks).
        map((key) => outgoingHooks[key]).
        filter((outgoingWebhook) => outgoingWebhook.team_id === teamId);
    const enableOutgoingWebhooks = config.EnableOutgoingWebhooks === 'true';

    return {
        outgoingWebhooks,
        channels: getAllChannels(state),
        users: getUsers(state),
        canManageOthersWebhooks,
        enableOutgoingWebhooks,
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<any>, Actions>({
            loadOutgoingHooksAndProfilesForTeam,
            removeOutgoingHook,
            regenOutgoingHookToken,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstalledOutgoingWebhook);
