import AboutUs from "../common_Page/HeroSection/aboutUs";
import ContactUs from "../common_Page/HeroSection/ContactUs";
import HowItWorks from "../common_Page/HeroSection/HowItWorks";
import LandingHome from "../common_Page/HeroSection/LandingHome";
import PricingPlans from "../common_Page/HeroSection/PricingPlans";
import WhyImportant from "../common_Page/HeroSection/whyImportant";

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
