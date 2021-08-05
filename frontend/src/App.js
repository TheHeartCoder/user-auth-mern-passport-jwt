// import logo from './logo.svg';
import './App.css';

import { useState } from 'react';
import axios from 'axios';

import { Paper, Grid, TextField, Button } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { Face, Fingerprint } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	diiv: {
		margin: theme.spacing.unit * 2,
	},
	paper: {
		padding: theme.spacing.unit,
		width: '620px',
		margin: 'auto',
		marginTop: '50px',
		backgroundColor: '#e3f5f6',
	},
}));

function App() {
	const classes = useStyles();

	const [signUp, setSignUp] = useState(false);

	const [authForm, setAuthForm] = useState({
		name: '',
		email: '',
		password: '',
	});

	const [dashboard, setDashboard] = useState('');

	const handleSubmit = async () => {
		if (signUp) {
			// register
			const { name, email, password } = authForm;
			if (!name || !email || !password) {
				alert('Please enter all required fields');
				return false;
			}

			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			await axios.post(
				'http://localhost:8000/users/register',
				{ name, email, password },
				config
			);

			setSignUp((value) => !value);
		} else {
			// login
			const { email, password } = authForm;
			if (!email || !password) {
				alert('Please enter all required fields');
				return false;
			}

			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const { data } = await axios.post(
				'http://localhost:8000/users/login',
				{ email, password },
				config
			);

			localStorage.setItem('userInfo', JSON.stringify(data));
			var token = data.token;

			if (data.token) {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: token.token,
					},
				};

				const { data } = await axios.get(
					'http://localhost:8000/users/dashboard',
					config
				);

				setDashboard(data.msg);
			}
		}
	};

	return (
		<Paper className={classes.paper}>
			{!dashboard ? (
				<div className={classes.diiv}>
					{signUp && (
						<Grid container spacing={8} alignItems='flex-end'>
							<Grid item>
								<Face />
							</Grid>
							<Grid item md={true} sm={true} xs={true}>
								<TextField
									id='name'
									label='Name'
									type='text'
									fullWidth
									autoFocus
									onChange={(e) =>
										setAuthForm({ ...authForm, name: e.target.value })
									}
								/>
							</Grid>
						</Grid>
					)}

					<Grid container spacing={8} alignItems='flex-end'>
						<Grid item>
							<Face />
						</Grid>
						<Grid item md={true} sm={true} xs={true}>
							<TextField
								id='email'
								label='Email'
								type='email'
								fullWidth
								autoFocus
								onChange={(e) =>
									setAuthForm({ ...authForm, email: e.target.value })
								}
							/>
						</Grid>
					</Grid>

					<Grid container spacing={8} alignItems='flex-end'>
						<Grid item>
							<Fingerprint />
						</Grid>

						<Grid item md={true} sm={true} xs={true}>
							<TextField
								id='username'
								label='Password'
								type='password'
								fullWidth
								onChange={(e) =>
									setAuthForm({ ...authForm, password: e.target.value })
								}
							/>
						</Grid>
					</Grid>

					<Grid container alignItems='center' justify='space-between'>
						<Grid item></Grid>
						<Grid item>
							<Button
								disableFocusRipple
								disableRipple
								style={{ textTransform: 'none' }}
								variant='text'
								color='primary'
								onClick={() => setSignUp((value) => !value)}
							>
								{signUp
									? 'Already have an account ? '
									: 'Dont have an account ?'}
							</Button>
						</Grid>
					</Grid>
					<Grid container justify='center' style={{ marginTop: '10px' }}>
						<Button
							variant='outlined'
							color='primary'
							style={{ textTransform: 'none' }}
							onClick={handleSubmit}
						>
							{signUp ? 'Sign Up' : 'Sign in'}
						</Button>
					</Grid>
				</div>
			) : (
				<div>{dashboard}</div>
			)}
		</Paper>
	);
}

export default App;
