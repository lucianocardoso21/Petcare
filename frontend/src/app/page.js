'use client';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from '@/pages/dashboard/Dashboard';

export default function Home() {
  
  return(
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to='/dashboard' />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  )
  
}
