import Menu from "./components/Menu/Menu";
import {Routes, Route} from "react-router-dom";
import Calendrier from "./components/Calendrier/Calendrier";

function App() {
  return (
      <div className="App">
           <header>
            <Menu/>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Calendrier/>}/>
            </Routes>
           
          </main>
          
      </div>
  );
}

export default App;
