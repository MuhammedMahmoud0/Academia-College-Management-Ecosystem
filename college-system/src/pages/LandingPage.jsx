import Header from '../components/landingPage/Header.jsx';
import Hero from '../components/landingPage/hero/Hero.jsx';
import About from '../components/landingPage/about/About.jsx';
import Admission from '../components/landingPage/admissions/Admission.jsx'; 
import Campus from '../components/landingPage/campus-life/Campus.jsx';
export default function LandingPage() {
    return (
        <div className="landing-page flex-column" style={{height:"100vh", width:"100%"}}>
            <Header />
            <Hero />
            <About />
            <Admission />
            <Campus />
        </div>
    )
}