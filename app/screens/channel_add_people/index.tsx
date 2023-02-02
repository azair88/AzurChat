// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {Tutorial} from '@constants';
import {observeTutorialWatched} from '@queries/app/global';
import {observeCurrentChannel} from '@queries/servers/channel';
import {observeCurrentTeamId} from '@queries/servers/system';
import {observeTeammateNameDisplay} from '@queries/servers/user';

import ChannelAddPeople from './channel_add_people';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const channel = observeCurrentChannel(database);
    const isGroupConstrained = channel.pipe(switchMap((c) => of$(Boolean(c?.isGroupConstrained))));
    const channelId = channel.pipe(switchMap((c) => of$(c?.id)));

    return {
        channelId,
        currentTeamId: observeCurrentTeamId(database),
        isGroupConstrained,
        teammateNameDisplay: observeTeammateNameDisplay(database),
        tutorialWatched: observeTutorialWatched(Tutorial.PROFILE_LONG_PRESS),
    };
});

export default withDatabase(enhanced(ChannelAddPeople));