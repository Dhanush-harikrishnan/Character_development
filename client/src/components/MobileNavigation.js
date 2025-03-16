import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaFire, FaBook, FaUser } from 'react-icons/fa';
import '../../App.css';

export default function MobileNavigation() {
  return (
    <nav className="mobile-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <FaHome className="nav-icon" />
        <span className="nav-label">Home</span>
      </NavLink>
      <NavLink to="/streaks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <FaFire className="nav-icon" />
        <span className="nav-label">Streaks</span>
      </NavLink>
      <NavLink to="/readings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <FaBook className="nav-icon" />
        <span className="nav-label">Readings</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <FaUser className="nav-icon" />
        <span className="nav-label">Profile</span>
      </NavLink>
    </nav>
  );
}