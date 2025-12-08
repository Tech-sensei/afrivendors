import FAQ from '@/components/views/FAQSection'
import ContactHeroSection from './views/ContactHeroSection'
import NeedAssistanceSection from './views/NeedAssistanceSection'
import YourVoiceMattersSection from './views/YourVoiceMattersSection'
import ContactFormSection from './views/ContactFormSection'

const ContactUsPage = () => {
    return (
        <>
            <ContactHeroSection />
            <NeedAssistanceSection />
            <YourVoiceMattersSection />
            <ContactFormSection />
            <FAQ />
        </>
    )
}

export default ContactUsPage