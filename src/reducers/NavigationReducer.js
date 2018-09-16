import { MainStack } from '../router';
import { NavigationActions } from 'react-navigation';


const initialAction = { type: NavigationActions.Init }
const initialState = MainStack.router.getStateForAction(initialAction)

export default (state = initialState, action) => {
  return MainStack.router.getStateForAction(action, state)
}
