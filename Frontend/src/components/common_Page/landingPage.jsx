import AboutUs from "../common_Page/HeroSection/aboutUs";
import ContactUs from "../common_Page/HeroSection/ContactUs";
import HowItWorks from "../common_Page/HeroSection/HowItWorks";
import PricingPlans from "../common_Page/HeroSection/PricingPlans";
import WhyImportant from "../common_Page/HeroSection/whyImportant";
import LandingHome from "./HeroSection/landingHome";

function Landing_Page() {
    return (
        <>
            <LandingHome />
            <HowItWorks />
            <WhyImportant />
            <PricingPlans />
            <AboutUs />
            <ContactUs />
        </>
    );
}

export default Landing_Page;
