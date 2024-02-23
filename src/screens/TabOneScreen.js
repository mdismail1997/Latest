import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarTitle from "../components/navigationBarTitle";

export default class TabOneScreen extends React.Component {
  constructor(props) {
    super(props);
}
  // static navigationOptions = {
  //   title: 'Details',
  //   headerLeft: () => (
  //     <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.push('NotFound')}></Icon.Button>
  // )
  // };

  UNSAFE_componentWillMount() {
    //console.log(this.props.route.params);
      //  console.log(this.props.navigation);
      // this.props.navigation.setOptions({ title: 'Updated!' });
  }
  UNSAFE_componentWillReceiveProps(){
  }
  static screenOptions = {
    title:'Overview',
    // navigationBar: {
    //     visible: true,
    //     elevation: 0,
    //     renderBackground: () => {
    //         return <NavigationBarBackground />;
    //     },
    //     renderTitle: route => {
    //         return (
    //             <NavigationBarTitle
    //                 title={'morenav'}
    //                 language={"en-US"}
    //             />
    //         );
    //     }
    // }
};
abc = ()=>{
  console.log(2);
}
render(){
  return (
    <View style={styles.container}>
      <Text style={styles.title} onPress={() => {signOut()}}>kajkdjsa</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});


// import * as React from 'react';
// import { StyleSheet, View, Text } from 'react-native';

// export default function TabOneScreen(navigation) {
//   React.useLayoutEffect(() => {
//     navigation.setOptions({ Title: 'Update' });
//   });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab Two</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });
