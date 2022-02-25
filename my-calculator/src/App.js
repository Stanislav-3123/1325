import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import PercentButton from "./PercentButton"
import "./styles.css"

export const ACTIONS = {
	ADD_DIGIT: 'add-digit',
	CHOOSE_OPERATION: 'choose-operation',
	CLEAR: 'clear',
	DELETE_DIGIT: 'delete-digit',
	EVALUATE: 'evaluate',
	PERCENT: 'percent'
}

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.PERCENT:
			if (
				state.operation == null ||
				state.currentOperand == null ||
				state.previosOperand == null
			) {
				return state
			}
			return {
				...state,
				owerwrite: true,
				previosOperand: null,
				operation: null,
				currentOperand: interestSubtraction(state)
			}
		case ACTIONS.ADD_DIGIT:
			if (state.owerwrite) {
				return {
					...state,
					currentOperand: payload.digit,
					owerwrite: false
				}
			}
			if (payload.digit === "0" && state.currentOperand === "0") return state
			if (payload.digit === "." && state.currentOperand === undefined) {
				// Condition for starting a set of numbers less than one
				return {
					...state,
					currentOperand: "0."
				}
			}
			if (payload.digit === "." && state.currentOperand.includes(".")) return state
			return {
				...state,
				currentOperand: `${state.currentOperand || ""}${payload.digit}`,
			}
		case ACTIONS.CLEAR:
			return {}
		case ACTIONS.DELETE_DIGIT:
			if (state.owerwrite) {
				return {
					...state,
					owerwrite: false,
					currentOperand: null
				}
			}
			if (state.currentOperand == null) return state
			if (state.currentOperand.lenght === 1) {
				return {
					...state,
					currentOperand: null
				}
			}
			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1)
			}
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currentOperand == null ||
				state.previosOperand == null
			) {
				return state
			}
			return {
				...state,
				owerwrite: true,
				previosOperand: null,
				operation: null,
				currentOperand: evaluate(state)
			}
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperand == null && state.previosOperand == null) {
				return state
			}
			if (state.currentOperand == null) {
				return {
					...state,
					operation: payload.operation
				}
			}
			if (state.previosOperand == null) {
				return {
					...state,
					operation: payload.operation,
					previosOperand: state.currentOperand,
					currentOperand: null,
				}
			}
			return {
				...state,
				previosOperand: evaluate(state),
				operation: payload.operation,
				currentOperand: null
			}
		default: {
			return state;
		}
	}
}
function interestSubtraction ({currentOperand, previosOperand, operation}) {
	const prev = parseFloat(previosOperand)
	const current = parseFloat(currentOperand)
	if (isNaN(prev) || isNaN(current)) return ""
	let compuation = ""
	switch (operation) {
		case "+":
			compuation = prev + prev / 100 * current 
			break
		case "-":
			compuation = prev - prev / 100 * current
			break
		case "*":
			compuation = prev * (current / 100)
			break
		case "÷":
			compuation = prev / (current / 100)
			break
		default:
	}
	return compuation.toString()
}
function evaluate({ currentOperand, previosOperand, operation }) {
	const prev = parseFloat(previosOperand)
	const current = parseFloat(currentOperand)
	if (isNaN(prev) || isNaN(current)) return ""
	let compuation = ""
	switch (operation) {
		case "+":
			compuation = prev + current
			break
		case "-":
			compuation = prev - current
			break
		case "*":
			compuation = prev * current
			break
		case "÷":
			compuation = prev / current
			break
		default:
	}
	return compuation.toString()
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", {
	maximumFractionDigits: 0,
})

function formateOperand(operand) {
	if (operand == null) return
	const [interger, decimal] = operand.split('.')
	if (decimal == null) return INTERGER_FORMATTER.format(interger)
	return `${INTERGER_FORMATTER.format(interger)}.${decimal}`
}

function App() {
	const [{ currentOperand, previosOperand, operation }, dispatch] = useReducer(
		reducer,
		{}
	)
	return (
		<div className="calculator-grid">
			<div className="output" >
				<div className="previous-operand">
					{formateOperand(previosOperand)} {operation}
				</div>
				<div className="current-operand">{formateOperand(currentOperand)}</div>
			</div>
			<button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
			<button
				onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
			>DEL</button>
			<PercentButton operation="%" dispatch={dispatch} />
			<OperationButton operation="÷" dispatch={dispatch} />
			<DigitButton digit="1" dispatch={dispatch} />
			<DigitButton digit="2" dispatch={dispatch} />
			<DigitButton digit="3" dispatch={dispatch} />
			<OperationButton operation="*" dispatch={dispatch} />
			<DigitButton digit="4" dispatch={dispatch} />
			<DigitButton digit="5" dispatch={dispatch} />
			<DigitButton digit="6" dispatch={dispatch} />
			<OperationButton operation="+" dispatch={dispatch} />
			<DigitButton digit="7" dispatch={dispatch} />
			<DigitButton digit="8" dispatch={dispatch} />
			<DigitButton digit="9" dispatch={dispatch} />
			<OperationButton operation="-" dispatch={dispatch} />
			<DigitButton digit="." dispatch={dispatch} />
			<DigitButton digit="0" dispatch={dispatch} />
			<button className="span-two"
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
			>=</button>
		</div>
	)
}

export default App
