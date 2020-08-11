import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import PostDetailsScreen  from '../screens/PostDetailsScreen';
import ViewPosts from '../screens/PostsViewScreen'



export const AppStackNavigator = createStackNavigator({
  PostList : {
    screen : ViewPosts,
    navigationOptions:{
      headerShown : false
    }
  },
  PostDetails : {
    screen : PostDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'PostList'
  }
);
