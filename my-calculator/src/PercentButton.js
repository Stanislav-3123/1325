import { ACTIONS } from './App'

export default function PercentButton({dispatch, operation}) {
	return (
	<button 
	 onClick={() => 
		dispatch({ type: ACTIONS.PERCENT })
	 }
	>
		{operation}
	</button>
	)	
}
	
