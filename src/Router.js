import { createAppContainer  } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Login from './screens/Login'
import Main from './screens/Main'
import Maps from './screens/Maps'
import MapStore from './screens/MapsStore'
import Config from './screens/Config'
import InfoHome from './screens/InfoHome'
import MyHomes from './screens/MyHomes'
import Route from './screens/Route'

const Router = createStackNavigator({
    Login:{
        screen: Login, navigationOptions:{
            header: null
        }
    },
    Home:{
        screen: Main, navigationOptions:{
            header: null
        }
    },
    Maps:{
        screen:  Maps, navigationOptions:{
            header: null
        }
    },
    MapStore:{
        screen: MapStore, navigationOptions:{
            headerTransparent: true
        }
    },
    Config:{
        screen: Config, navigationOptions: {
            header: null
        }
    },
    InfoHome:{
        screen: InfoHome, navigationOptions:{
            header: null
        }
    },
    MyHomes:{
        screen: MyHomes, navigationOptions:{
            header: null
        }
    },
    Router:{
        screen: Route, navigationOptions:{
            headerTransparent: true
        }
    }
})
export default createAppContainer(Router)