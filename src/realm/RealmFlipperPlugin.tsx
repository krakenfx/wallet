import React from 'react';

import { useRealm } from './RealmContext';

const RealmPlugin = require('realm-flipper-plugin-device').default;

export const RealmFlipperPlugin = () => <RealmPlugin realms={[useRealm()]} />;
