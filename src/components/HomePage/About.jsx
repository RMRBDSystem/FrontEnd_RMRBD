import React from 'react';
import logoA from '/images/LogoA.png';

const About = () => {
    return (
        <section className="section bg-amber-50" id="about">
            <div className="section-title">
                <h2 className="text-gray-600 font-expletus">About us</h2>
                <div className={`underline bg-gray-800`}></div>
            </div>
            <div className="section-center  rounded-3xl">
                <div className=" grid sm:grid-cols-2 gap-4 rounded-3xl">
                    <article className="p-4">
                        <img
                            src={logoA}
                            alt="company logo"
                            className="w-full h-full object-fit rounded-full"
                        />
                    </article>
                    <article className="p-4 sm:flex-col self-center">
                        <h3 className="capitalize tracking-widest font-bold  text-xl sm:text-2xl">
                            Welcome to Recipe Cook System
                        </h3>
                        <p className="my-6">At Recipe Cook System, we bring the world of cooking right to your fingertips. 
                        </p>
                        <p>
                        Offering a wide range of high-quality cookbooks, from authentic Vietnamese recipes to international cuisines. Each book is carefully curated to inspire chefs of all levels.
                        Discover now and elevate your cooking game!
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default About;
