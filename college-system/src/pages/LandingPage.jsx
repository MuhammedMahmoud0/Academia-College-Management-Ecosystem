import Header from '../components/landingPage/Header.jsx';
import Hero from '../components/landingPage/hero/Hero.jsx';
import About from '../components/landingPage/about/About.jsx';
import Admission from '../components/landingPage/admissions/Admission.jsx'; 
import Campus from '../components/landingPage/campus-life/Campus.jsx';
import ResearchSection from '../components/landingPage/research/Research.jsx';
import Career from '../components/landingPage/careers/Career.jsx';
import News from '../components/landingPage/news/News.jsx';
import Doctors from '../components/landingPage/doctors/Doctors.jsx';
import StudentSay from '../components/landingPage/student-say/StudentSay.jsx';
import Events from '../components/landingPage/events/Events.jsx';
import Programs from '../components/landingPage/programs/Programs.jsx';
import Faq from '../components/landingPage/faq/Faq.jsx';
import Contact from '../components/landingPage/contact/Contact.jsx';
import Footer from '../components/landingPage/Footer.jsx';

export default function LandingPage() {
    return (
        <div className="landing-page flex-column" style={{height:"100vh", width:"100%"}}>
            <Header />
            <Hero />
            <About />
            <Admission />
            <Campus />
            <ResearchSection />   
            <Career />
            <News />
            <Doctors />
            <StudentSay />
            <Events />
            <Programs />
            <Faq />
            <Contact />
            <Footer />
        </div>
    );
}