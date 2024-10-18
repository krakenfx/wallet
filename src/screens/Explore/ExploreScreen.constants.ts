import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const unit = 12;

export const Sizes = {
  Space: {
    sixth: unit / 6, 
    quarter: unit / 4, 
    third: unit / 3, 
    half: unit / 2, 
    s1: unit, 
    s2: unit * 2, 
    s3: unit * 3, 
    s4: unit * 4, 
    s5: unit * 5, 
    s6: unit * 6, 
    s7: unit * 7, 
    s8: unit * 8, 
  },
  Card: {
    fullBleed: windowWidth,
    width: windowWidth - unit * 4,
    small: 160,
    medium: 246,
    large: 409,
  },
  Hero: {
    card: 409,
    fullBleed: 557,
  },
  FloatingIcon: {
    width: 132,
    height: 164,
  },
  ListIcon: {
    width: 40,
    height: 40,
  },
};

export const TRANSITION_DURATION = 160;
