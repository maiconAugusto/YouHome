import React from 'react'
import { createAppContainer  } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Option from './Options'
import Main from './Main'
import { Icon } from 'react-native-elements'

const Nav = createBottomTabNavigator({
    Search:{
        screen: Option, navigationOptions:{
            tabBarIcon(){
                return(
                    <Icon color='#7966FF' name='search'/>
                )
            }
        }
    },
    Main:{
        screen: Main, navigationOptions:{
            tabBarIcon(){
                return(
                    <Icon color ='#7966FF' name='home'/>
                )
            }
        }
    }
},{
    tabBarOptions:{
        showIcon: true,
        labelStyle:{
            fontSize: 0
        },

        
    }
})
export default createAppContainer(Nav)