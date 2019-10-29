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
import ProfileUser from './screens/ProfileUser'
import Photos from './screens/Photos'
import EditPost from './screens/EditPost'
import Nav from './screens/Nav'

const Router =  (userLogged = false)=> createAppContainer(
    createStackNavigator({
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
        },
        Search:{
            screen: Nav, navigationOptions:{
                header: null
            }
        },
        ProfileUser:{
            screen: ProfileUser, navigationOptions:{
                headerStyle:{
                    backgroundColor:'#7966FF'
                }
            }
        },
        Photos:{
            screen: Photos,navigationOptions:{
                headerStyle:{
                    backgroundColor:'#7966FF'
                }
            }
        },
        EditPost:{
            screen: EditPost, navigationOptions:{
                header: null
            }
        },

    },{
        initialRouteName : userLogged ? 'Search' : 'Login'
    })
)
export default Router