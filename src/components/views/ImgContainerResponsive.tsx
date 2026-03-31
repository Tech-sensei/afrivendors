// Tailwind‑only version
import Image from "next/image";

export default function ImgContainerResponsive() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 aspect-[16/4.5] min-h-[200px] max-h-[420px]">
      {/* Desktop & Tablet */}
      <div className="hidden sm:flex items-center justify-center h-full w-full gap-[0.5%] overflow-hidden">
        {/* Image 1 */}
        <div className="flex-1 h-full overflow-hidden relative group cursor-pointer rounded-tl-[clamp(60px,15vw,183px)] rounded-br-[clamp(60px,15vw,183px)] -mr-[10%] z-1 transition-all duration-500 ease-out hover:z-10 hover:scale-105">
          <Image
            alt="Happy family"
            src="/assets/images/homeHeroImg1.png"
            width={500}
            height={500}
            className="w-full h-full object-cover brightness-[0.95] transition-all duration-500 ease-out group-hover:brightness-110 group-hover:scale-110"
             preload={true}
            loading="eager"
          />
        </div>

        {/* Image 2 (Flipped) */}
        <div className="flex-1 h-full overflow-hidden relative group cursor-pointer rounded-tl-[clamp(60px,15vw,183px)] rounded-br-[clamp(60px,15vw,183px)] -mr-[10%] z-2 transition-all duration-500 ease-out hover:z-10 hover:scale-105 transform scale-y-[1]">
          <Image
            alt="Beauty services"
            src="/assets/images/homeHeroImg2.png"
            width={500}
            height={500}
            className="w-full h-full object-cover brightness-[0.95] transition-all duration-500 ease-out group-hover:brightness-110 group-hover:scale-110"
             preload={true}
            loading="eager"
          />
        </div>

        {/* Image 3 */}
        <div className="flex-1 h-full overflow-hidden relative group cursor-pointer rounded-tl-[clamp(60px,15vw,183px)] rounded-br-[clamp(60px,15vw,183px)] -mr-[10%] z-3 transition-all duration-500 ease-out hover:z-10 hover:scale-105">
          <Image
            alt="Catering services"
            src="/assets/images/homeHeroImg3.png"
            width={500}
            height={500}
            className="w-full h-full object-cover brightness-[0.95] transition-all duration-500 ease-out group-hover:brightness-110 group-hover:scale-110"
             preload={true}
            loading="eager"
          />
        </div>

        {/* Image 4 */}
        <div className="flex-1 h-full overflow-hidden relative group cursor-pointer rounded-tl-[clamp(60px,15vw,183px)] rounded-br-[clamp(60px,15vw,183px)] z-4 transition-all duration-500 ease-out hover:z-10 hover:scale-105">
          <Image
            alt="Wedding and events"
            src="/assets/images/homeHeroImg4.png"
            width={500}
            height={500}
            className="w-full h-full object-cover brightness-[0.95] transition-all duration-500 ease-out group-hover:brightness-110 group-hover:scale-110"
             preload={true}
            loading="eager"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden flex-col h-full w-full gap-2">
        {/* Row 1 */}
        <div className="flex h-1/2 w-full gap-2">
          <div className="flex-1 h-full overflow-hidden cursor-pointer rounded-tl-[60px] rounded-br-[60px] group transition-all duration-300 ease-out hover:scale-[1.03]">
            <Image
              alt="Happy family"
              src="/assets/images/homeHeroImg1.png"
              width={500}
              height={500}
              className="w-full h-full object-cover brightness-[0.95] transition-all duration-300 ease-out group-hover:brightness-110"
               preload={true}
              loading="eager"
            />
          </div>

          <div className="flex-1 h-full overflow-hidden cursor-pointer rounded-tl-[60px] rounded-br-[60px] transform scale-y-[1] group transition-all duration-300 ease-out hover:scale-[1.03]">
            <Image
              alt="Beauty services"
              src="/assets/images/homeHeroImg2.png"
              width={500}
              height={500}
              className="w-full h-full object-cover brightness-[0.95] transition-all duration-300 ease-out group-hover:brightness-110"
               preload={true}
              loading="eager"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex h-1/2 w-full gap-2">
          <div className="flex-1 h-full overflow-hidden cursor-pointer rounded-tl-[60px] rounded-br-[60px] group transition-all duration-300 ease-out hover:scale-[1.03]">
            <Image
              alt="Catering services"
              src="/assets/images/homeHeroImg3.png"
              width={500}
              height={500}
              className="w-full h-full object-cover brightness-[0.95] transition-all duration-300 ease-out group-hover:brightness-110"
               preload={true}
              loading="eager"
            />
          </div>

          <div className="flex-1 h-full overflow-hidden cursor-pointer rounded-tl-[60px] rounded-br-[60px] group transition-all duration-300 ease-out hover:scale-[1.03]">
            <Image
              alt="Wedding and events"
              src="/assets/images/homeHeroImg4.png"
              width={500}
              height={500}
              className="w-full h-full object-cover brightness-[0.95] transition-all duration-300 ease-out group-hover:brightness-110"
               preload={true}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
