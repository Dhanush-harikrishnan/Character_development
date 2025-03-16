import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import Streaks from './components/streaks/Streaks';
import StreakForm from './components/streaks/StreakForm';
import StreakCheckIn from './components/streaks/StreakCheckIn';
import StreakDetails from './components/streaks/StreakDetails';
import Reading from './components/reading/Reading';
import ReadingForm from './components/reading/ReadingForm';
import ReadingProgress from './components/reading/ReadingProgress';
import Character from './components/character/Character';
import CharacterForm from './components/character/CharacterForm';
import EditCharacter from './components/character/EditCharacter';

// CSS
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/create-profile" element={<PrivateRoute component={CreateProfile} />} />
            <Route path="/edit-profile" element={<PrivateRoute component={EditProfile} />} />
            <Route path="/streaks" element={<PrivateRoute component={Streaks} />} />
            <Route path="/add-streak" element={<PrivateRoute component={StreakForm} />} />
            <Route path="/streak/:id" element={<PrivateRoute component={StreakCheckIn} />} />
            <Route path="/streak-details/:id" element={<PrivateRoute component={StreakDetails} />} />
            <Route path="/reading" element={<PrivateRoute component={Reading} />} />
            <Route path="/add-reading" element={<PrivateRoute component={ReadingForm} />} />
            <Route path="/reading/:id" element={<PrivateRoute component={ReadingProgress} />} />
            <Route path="/character" element={<PrivateRoute component={Character} />} />
            <Route path="/add-character" element={<PrivateRoute component={CharacterForm} />} />
            <Route path="/edit-character/:id" element={<PrivateRoute component={EditCharacter} />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;