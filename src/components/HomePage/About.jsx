import React from 'react';
import logoA from '/images/LogoA.png';

const About = () => {
    return (
        <section className="section bg-amber-50" id="about">
            <div className="section-title">
                <h2 className="text-gray-600 font-expletus">Về Chúng Tôi</h2>
                <div className={`underline bg-gray-800`}></div>
            </div>
            <div className="section-center rounded-3xl">
                <div className=" grid sm:grid-cols-2 gap-4 rounded-3xl">
                    <article className="p-4">
                        <img
                            src={logoA}
                            alt="company logo"
                            className="object-fit rounded-full"
                        />
                    </article>
                    <article className="p-4 sm:flex-col self-center">
                        <h3 className="capitalize tracking-widest font-bold text-3xl sm:text-3xl">
                        Chào mừng đến với Hệ Thống Công Thức Nấu Ăn!
                        </h3>
                        <p className="my-3 text-lg">Tại Hệ Thống Công Thức Nấu Ăn, chúng tôi mang đến thế giới ẩm thực ngay tại đầu ngón tay của bạn.
                        </p>
                        <p>
                        Cung cấp đa dạng các cuốn sách nấu ăn chất lượng cao, từ các công thức Việt Nam truyền thống đến các món ăn quốc tế. Mỗi cuốn sách được tuyển chọn kỹ lưỡng, nhằm truyền cảm hứng cho các đầu bếp ở mọi trình độ. Khám phá ngay và nâng cao kỹ năng nấu nướng của bạn!
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default About;
