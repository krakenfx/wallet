import React, { ComponentProps, useMemo, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

type SizeAwareSVGUriProps = Omit<ComponentProps<typeof SvgUri>, 'onLoad'> & {
  onLoad?: (size: { width: number; height: number }) => void;
  containerStyle?: StyleProp<ViewStyle>;
  fillContainer?: boolean; 
};

const getViewBox = (xmlString: string) => {
  const match = xmlString.match(/viewBox="([^"]*)"/);
  return match && match[1];
};

export const SizeAwareSVGUri: React.FC<SizeAwareSVGUriProps> = ({ uri, onLoad, fillContainer, containerStyle, ...props }) => {
  const [containerSize, setContainerSize] = useState<LayoutRectangle>();
  const [svgSize, setSvgSize] = useState<LayoutRectangle>();
  const [viewBox, setViewBox] = useState<string | null>();

  const onSvgLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (svgSize) {
      return;
    }
    const values = viewBox?.split(' ');
    const width = layout.width ?? Number(values?.[2] ?? '0');
    const height = layout.height ?? Number(values?.[3] ?? '0');
    setSvgSize({ width, height, x: 0, y: 0 });
    if (width && height && onLoad) {
      onLoad({ width, height });
    }
  };

  const onContainerLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => setContainerSize(layout);
  const onSvgLoad = (xml: string) => xml && setViewBox(getViewBox(xml));

  
  
  

  const sizeProps = useMemo(() => {
    
    if (!svgSize || !containerSize || viewBox === undefined) {
      return {};
    }
    
    if (svgSize.width >= containerSize.width) {
      return {
        width: props.width,
        height: props.height,
        viewBox: viewBox ?? `0 0 ${svgSize.width} ${svgSize.height}`,
      };
    }
    
    return fillContainer
      ? {
          viewBox: `0 0 ${svgSize.width} ${svgSize.height}`,
          width: containerSize.width,
          height: (svgSize.height / svgSize.width) * containerSize.width,
        }
      : {};
  }, [containerSize, fillContainer, props.height, props.width, svgSize, viewBox]);

  return (
    <View style={[styles.svgContainer, containerStyle]} onLayout={svgSize ? undefined : onContainerLayout}>
      <SvgUri
        uri={uri}
        onLoad={onSvgLoad}
        onLayout={svgSize ? undefined : onSvgLayout}
        {...props}
        {...sizeProps}
        
        style={[!svgSize && styles.svgHidden]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  svgHidden: {
    opacity: 0,
  },
});
