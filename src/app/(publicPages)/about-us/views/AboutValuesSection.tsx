import { Heart, Shield, TrendingUp, Award } from 'lucide-react';

const values = [
    {
        icon: Heart,
        title: 'Community First',
        description: 'We believe in building strong communities by connecting people with trusted local vendors and service providers.'
    },
    {
        icon: Shield,
        title: 'Trust & Safety',
        description: 'All vendors are verified and reviewed to ensure you receive quality service every time.'
    },
    {
        icon: TrendingUp,
        title: 'Growth Together',
        description: 'We help local businesses grow while providing customers with convenient access to essential services.'
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We strive for excellence in everything we do, from our platform to our customer support.'
    }
];

const AboutValuesSection = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-24 bg-white">
            <div className="max-w-[1440px] mx-auto">
                <div className="py-16 md:py-20 px-6 bg-white border-t border-accent-30">
                    <div className="max-w-[1200px] mx-auto">
                        <h2 className="font-unbounded text-[clamp(32px,3.5vw,40px)] leading-[110%] font-semibold text-secondary-000 mb-12 text-center">
                            Our Values
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((value, index) => {
                                const IconComponent = value.icon;
                                return (
                                    <div
                                        key={index}
                                        className="p-8 bg-secondary-800 rounded-2xl border border-accent-30 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(35,19,5,0.08)] hover:border-primary-100"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-primary-100 mb-4">
                                            <IconComponent className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-unageo text-xl leading-6 font-bold text-secondary-000 mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="font-unageo text-base leading-6 text-accent-80">
                                            {value.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutValuesSection
