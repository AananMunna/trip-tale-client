import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

const PremiumGallery = ({ images }) => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="mb-10">
      {/* Swiper Gallery */}
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {images?.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`Image ${i + 1}`}
              className="w-full h-80 object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300 rounded-xl"
              onClick={() => setSelectedImg(img)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Zoom Modal like iPhone preview */}
      <Dialog open={!!selectedImg} onClose={() => setSelectedImg(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-4xl w-full">
            <img
              src={selectedImg}
              alt="Zoomed"
              className="rounded-xl max-h-[80vh] mx-auto"
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PremiumGallery;
