import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './views/MainLayout';
import Calendar from './views/Calendar';
import Resume from './views/Resume';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Calendar />} />
          <Route path="/resume" element={<Resume />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
