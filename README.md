# React Native Radio Trimmer


## Installation
```
yarn add react-native-radio-trimmer
```
or
```
npm install react-native-radio-trimmer
```

## Usage

```
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import RadioTrimmer from 'react-native-radio-trimmer';

export default class ExampleComponent extends Component {
  render() {
    return (
      <SafeAreaView>
        <Header />
        <RadioTrimmer
          accuracy={10}
          backgroundColor={'transparent'}
          boxSize={200}
          dotColor={'gray'}
          dotSize={24}
          innerDotColor={'white'}
          dotIsShadow={false}
          pathIsShadow={true}
          innerDotSize={10}
          marginTop={50}
          maxValue={108}
          minValue={87.5}
          paddingCircle={10}
          pathColor={'lightgray'}
          pathWidth={10}
          step={0.1}
          textAfterNumber={'MHz'}
          textBackgroundColor={'transparent'}
          tickMargin={0}
          ticksActiveColor={'black'}
          ticksColor={'gray'}
          ticksCount={25}
          ticksCountHover={5}
          ticksLength={15}
          ticksWidth={2}
          onChangeValue={''}
        />
      </SafeAreaView>
    );
  }
}
```

### Configuration
##### props:
| Property | Type | Default | Description |
|---------------|----------|-------------|----------------------------------------------------------------|
| accuracy | number | 10 | accuracy of result. 10 will result with 0.1, 0.5, etc |
| backgroundColor | string | transparent | background color of box with Radio Trimmer |
| boxSize | number | 200 | size of box containing the Radio Trimmer |
| dotColor | string | gray | color of radio dot |
| dotIsShadow | boolean | false | makes the dot background blurred|
| dotSize | number | 24 | width and height of the dot |
| innerDotColor | string | white | color of another dot inside the radio dot |
| innerDotSize | number | 10 | default inner dot size  |
| marginTop | number | 0 | margin that allows us to position the box fro top |
| maxValue | number | 108 | maximum scope value |
| minValue | number | 87.5 | minimal scope value |
| onChangeValue | function | null | function that is invoked on every radio text change. it return value of current text. Look at example |
| pathColor | string | lightgray | color of the path under the radio dot |
| pathIsShadow | boolean | false | makes the background of radio trimmer blurred |
| pathWidth | number | 10 | width of the path under the radio dot |
| step | number | 0.1 | value that will be added to each iteriationof calculating text value |
| textAfterNumber | string | MHz | the text that will be added to calculated text value |
| textBackgroundColor | string | transparent | the color under the inside calculated text |
| tickMargin | number | 0 | the distance between radio path and ticks |
| ticksActiveColor | string | black | color of active (hovered) tick  |
| ticksColor | string | gray | color of inactive (unhovered) tick |
| ticksCount | number | 25 | how many ticks will be generated |
| ticksCountHover | number | 5 | how many ticks will be hovered when the radio dot is near |
| ticksLength | number | 15 | the height of single tick |
| ticksWidth | number | 2 | the width of single tick  |

##### onChangeValue:
```
handleChange = (value) =>{
    console.log(value)
}

<RadioTrimmer onChangeValue={this.handleChange}>
```



