// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

import {observeIsCustomStatusExpirySupported} from '@queries/servers/system';

import CustomLabel from './custom_label';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    return {
        isCustomStatusExpirySupported: observeIsCustomStatusExpirySupported(database),
    };
});

export default withDatabase(enhanced(CustomLabel));
