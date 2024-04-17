import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import assert from 'assert';
import crypto from 'crypto';

import { Label } from '@/components/Label';
import { decrypt, encrypt } from '@/utils/encryption';

import navigationStyle from '../../components/navigationStyle';
import { useTheme } from '../../theme/themes';

import loc from '/loc';

export const DiagnosticsScreen = () => {
  const [diagnosticsMessage, setDiagnosticsMessage] = useState('');
  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      console.log('running diagnostics...');

      const data2encrypt = 'really long data string bla bla really long data string bla bla really long data string bla bla';
      const crypted = await encrypt(data2encrypt, 'password', '53B63311-D2D5-4C62-9F7F-28F25447B825');
      const decrypted = await decrypt(crypted, 'password', '53B63311-D2D5-4C62-9F7F-28F25447B825');

      assert.ok(crypted);
      assert.ok(decrypted);
      assert.strictEqual(decrypted, data2encrypt);
      assert.ok(crypted !== data2encrypt);

      assert.notEqual(crypto.randomBytes(64).toString('hex'), crypto.randomBytes(64).toString('hex'));

      const hashed = crypto.pbkdf2Sync('qwerty', 'qwerty', 1, 16, 'sha256');
      assert.equal(hashed.toString('hex'), '4fdb7f1095c5a4fb362e171aec8546a6');

      const url = new URL('https://developer.mozilla.org/en-US/docs/Web/API/URL/protocol');
      assert.equal(url.protocol, 'https:');
    })()
      .then(() => {
        console.log('running diagnostics... OK');
        setDiagnosticsMessage(loc._.ok);
      })
      .catch(error => {
        console.log('running diagnostics... Error:', error.message);
        setDiagnosticsMessage('Error: ' + error.message);
      });
  }, []);

  return (
    <>
      <View style={[styles.diagnosticsWrapper, { backgroundColor: colors.dark25 }]}>
        <Label>{loc.diagnostics.running}</Label>
        {!diagnosticsMessage ? <ActivityIndicator /> : null}
        {diagnosticsMessage === loc._.ok ? <Label testID="DiagnosticsMessageTextOk">{diagnosticsMessage}</Label> : null}
      </View>
      {diagnosticsMessage && diagnosticsMessage !== loc._.ok ? (
        <ScrollView style={styles.scroller}>
          <Text testID="DiagnosticsMessageTextError" style={{ color: 'white', textAlign: 'center' }}>
            {diagnosticsMessage}
          </Text>
        </ScrollView>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  diagnosticsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    paddingHorizontal: 34,
    paddingVertical: 21,
    borderRadius: 100,
    marginTop: 64,
  },
  scroller: {
    marginTop: 16,
  },
});

DiagnosticsScreen.navigationOptions = navigationStyle({});
