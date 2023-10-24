import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'react-paginate/dist/react-paginate.css';



import Post from './pages/Post/post'

import Feed from './pages/Feed/feed'



function App() {
	
	return(
		<Router>
			<Switch>
				<Route exact path="/" component={Feed} />
				<Route path="/post" component={Post} />
			</Switch>
		</Router>
	)
	
}

export default App;
