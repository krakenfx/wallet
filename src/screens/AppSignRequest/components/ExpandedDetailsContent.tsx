import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AddressDisplay } from '@/components/AddressDisplay';
import { Label } from '@/components/Label';

import loc from '/loc';
import type { DefinitionList } from '/modules/wallet-connect/types';

type Props = {
  content: DefinitionList;
};

export const ExpandedDetailsContent = ({ content }: Props) => {
  return (
    <View style={styles.contentContainer}>
      {Array.isArray(content) &&
        content.map(({ title, description }, i) => {
          return description !== ''  ? (
            <View style={styles.listItem} key={title + '_' + i}>
              <Label type="regularCaption1" color="light50" style={styles.titleText}>
                {title}
              </Label>
              {isAddress(title) ? (
                <AddressDisplay address={description} />
              ) : (
                <Label type="boldBody" color="light100" style={styles.bodyText}>
                  {description}
                </Label>
              )}
            </View>
          ) : null;
        })}
    </View>
  );
};



const isAddress = (title: string) => {
  return title === loc.appSignRequest.contractAddress;
};

const styles = StyleSheet.create({
  titleText: {
    marginBottom: 4,
  },
  bodyText: {
    lineHeight: 19.5,
    fontSize: 15,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  listItem: {
    marginBottom: 16,
  },
});
