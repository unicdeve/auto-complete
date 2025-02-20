## Questions and Answers

### 01. What is the difference between Component and PureComponent? Give an example where it might break my app.

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

### 02. Context + shouldComponentUpdate might be dangerous. Why is that?

It's easy to introduce bugs when using shouldComponentUpdate with context. When
you introduce `shouldComponentUpdate` into components that consumes a context,
you add another layer of complexity because you would need to ensure that your
`shouldComponentUpdate` logic correctly handles changes in both props, states
and context values.

### 03. Describe 3 ways to pass information from a component to its Parent.

You can use the following methods to pass data from a child component to it's
parent component:

- callback functions
- Context API
- External State management libs like Redux, Mobx

### 04. Give 2 ways to prevent components from re-rendering.

Re-rendering most of the times are fine because React is fast and it was
designed to re-render by default. In fact, when you app doesn't re-render, it's
either it's buggy or it's not an interactive app like static webpage without any
CTA or interactions. You should not fall into pre-mature optimizations.

That being said, you can prevent your components from re-rendering by:

- memoize the components with `memo` hook
- memoize expensive calculations with `useMemo` and expensive functions with
  `useCallback`

You can optimize components that are performance sensitive, components that
renders large data sets, components with expensive computations, etc

### 05. What is a fragment and why do we need it? Give an example where it might break my app.

Fragment is a React syntax that allows you to group elements without adding
unnecessary extra nodes to the DOM. For example

```javascript
const MyComponent1 = () => {
	return (
		<React.Fragment>
			<header>some items</header>
			<button>Press me</button>
		</React.Fragment>
	);
};

// OR with the shorthand
const MyComponent2 = () => {
	return (
		<>
			<header>some items</header>
			<button>Press me</button>
		</>
	);
};
```

React fragment was actually added in version 16.2 and with the
`<Fragment></Fragment>` syntax, if you try using the shortcut `<></>`, it will
break your app.

Fragments can also cause unintended styling issue

```javascript
const MyComponent1 = () => {
	return (
		<React.Fragment>
			<p>some items1</p>
			<p>some items2</p>
			<p>some items3</p>
		</React.Fragment>
	);
};

// OR with the shorthand
const MyComponent2 = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
			}}
		>
			<header>some items</header>

			<MyComponent1 />
		</div>
	);
};
```

In the above example, you might have intended that `<MyComponent1 />` is grouped
as one, but because there was no wrapper, `space-between` will apply to all the
items.

### 06. Give 3 examples of the HOC pattern.

Higher Order Component (HOC) is a common design pattern in React used to enhance
components by adding additional functionalities. Examples includes:

1. withRouter from React Router:

```javascript
const Avatar = ({ history }) => {
	// Access router props
	return (
		<div onClick={() => history.push('/profile')}>
			<img />
		</div>
	);
};

export default withRouter(Avatar);
```

This will add router props to <MyComponent />

2. connect (from React redux): This is an HOC that injects redux states and
   actions into a component.
3. withStyles (from MUI)

### 07. What's the difference in handling exceptions in promises, callbacks and async...await?

- Promises: they have two main methods for handling success and failure: .then()
  for success and .catch() for failure.

```javascript
promiseFunction()
	.then((result) => {
		// success
	})
	.catch((error) => {
		// error
	});
```

- Error handling in callbacks often involves checking if the first argument of
  the callback contains an error object. If it does, the error is handled;
  otherwise, the operation is considered successful.

```javascript
callbackFunction((error, result) => {
	if (error) {
		// error
	} else {
		// success
	}
});
```

- async...await: is a modern Javascript syntax (Syntatic Sugar). Error handling
  is done using traditional try...catch blocks, providing a more natural and
  synchronous-like error handling mechanism.

```javascript
async function asyncFunction() {
	try {
		const result = await apromiseFunc();
		// success
	} catch (error) {
		// error
	}
}
```

### 08. How many arguments does setState take and why is it async.

The setState in class-based components takes two arguments

```javascript
this.setState({ count: this.state.count + 1 }, () => {
	console.log('State updated!');
});
```

First argument is the new state object and the second argument is an optional
callback function whic is call right after the state has been updated and the
component has also re-rendered.

Why the setState is async is because Javascript is single-threaded, React uses
the event loop to schedule updates and re-rendering, this means that the UI
doesn't have to freeze when the state is updating, instead React waits for the
current execution thread to finish because applying the updates.

### 09. List the steps needed to migrate a Class to Function Component.

I have had to do this previous in some legacy codebase, here are my steps:

- Break the component into smaller child functional components () if it's a
  large component;
- Convert state to useState hook;
- Convert lifecycle methods to useEffect hook;
- Remove constructor
- Convert class methods to functions
- Update props usage
- Wrap component in memo if it's using PureComponent
- Test and Debug

### 10. List a few ways styles can be used with components.

- Inline styles
- CSS class names: Pure CSS or Tailwind class names
- CSS Modules: this prevents global namespace conflicts
- CSS-in-JS: Styled-components, Emotion

### 11. How to render an HTML string coming from the server.

We can use the `dangerouslySetInnerHTML` prop.

```javascript
const htmlString = `<h1>Some html string<h1/>`;
return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
```
