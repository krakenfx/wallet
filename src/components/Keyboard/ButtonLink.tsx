import React, { forwardRef } from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';

interface ButtonLinkProps extends TouchableOpacityProps {
  title: string;
}

export const ButtonLink = forwardRef(({ title, ...props }: ButtonLinkProps) => {
  return (
    <Touchable
      accessibilityRole="button"
      style={{
        minHeight: 60,
        marginEnd: 46,
        justifyContent: 'center',
      }}
      {...props}>
      <Label type="boldTitle2">{title}</Label>
    </Touchable>
  );
});
