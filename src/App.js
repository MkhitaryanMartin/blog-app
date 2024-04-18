import './App.css';
import Footer from './component/Footer/Footer';
import NavBar from './component/NavBar/NavBar';
import Blog from './pages/blog';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Blog/>
      <Footer />
    </div>
  );
}

export default App;
