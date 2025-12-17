import { Target, Users } from 'lucide-react';

const AboutMission = () => {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-24 bg-[#F7F4F2]">
            <div className="max-w-[1440px] mx-auto">
                <div className="py-16 md:py-20 px-6 bg-accent-10/40 rounded-2xl">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Mission Section */}
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="font-unbounded text-[clamp(32px,3.5vw,40px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                                    Our Mission
                                </h2>
                                <p className="font-unageo text-lg leading-8 text-accent-80 mb-4">
                                    To empower local African vendors and service providers by giving them the tools to reach more
                                    customers, grow their businesses, and build lasting relationships within their communities.
                                </p>
                                <p className="font-unageo text-lg leading-8 text-accent-80">
                                    We envision a future where every customer can easily discover and book trusted local services,
                                    and every vendor has the opportunity to showcase their talents and grow their business.
                                </p>
                            </div>

                            {/* Story Section */}
                            <div className="bg-white rounded-2xl p-8 border border-accent-30 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(35,19,5,0.08)] hover:border-primary-100">
                                <div className="w-16 h-16 rounded-2xl bg-accent-10 flex items-center justify-center mb-6">
                                    <Users className="w-8 h-8 text-primary-100" />
                                </div>
                                <h3 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-000 mb-4">
                                    Our Story
                                </h3>
                                <p className="font-unageo text-base leading-7 text-accent-80">
                                    Founded in 2024, Afrivendor was born from a simple observation: talented local vendors were
                                    struggling to reach customers, while customers were finding it difficult to discover trusted
                                    local services. We set out to bridge this gap by creating a platform that benefits both parties.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutMission
