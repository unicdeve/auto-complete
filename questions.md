## Questions and Answers

### 01 What is the difference between Component and PureComponent? Give an example where it might break my app.

Class-based components using the standard Components class will re-render by
default regardless of whether the props and state has actually changed

PureComponent is similar to the Component in class-based components. The main
difference difference is that PureComponent implements shouldComponentUpdate
lifecycle method by doing a shallowing comparison of props and state, and then
skipping updating and re-rendering for the same props and state.

When your props and states are primitive, your class-based components using the
PureComponent will work as expected. It can break your app when any of your
props and states are Object types, this is because of the way Javascript works,
React will try to compare these two different addresses in memory (even though
they are literally the same objects), these will return false and your component
will update and re-render.

```javascript
const user1 = { firstName: 'John' };
const user2 = { firstName: 'John' };

console.log(user1 === user2); // This will return false

class Parent extends React.Component {
	state = {
		person: { name: 'John' },
	};

	render() {
		return (
			<>
				<Child person={this.state.person} />

				<button
					onClick={() => {
						// Child component will render even thou we are passing the same props
						this.setState({ person: { name: 'John' } });
					}}
				>
					Press me
				</button>
			</>
		);
	}
}

class Child extends PureComponent {
	render() {
		return <div>{this.props.person.name}</div>;
	}
}
```

Using class-based components are not a good practice anymore, you should use
Functional components, we can also achieve the same results and with better
performance. To keep this short, we can simply convert both classes to
functional component and wrap the Child component with a `memo` hook.
