// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import { filterableData } from "../../data/data";

const Button = ({ className, children, ...rest }) => {
  return (
    <button {...rest} className={className}>
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Image = ({ className, image, alt, objectCover }) => {
  return (
    <div className={`${className} overflow-hidden`}>
      <img
        src={image}
        alt={alt}
        className={`w-full h-full ${objectCover} transition-transform duration-300 transform hover:scale-105`}
      />
    </div>
  );
};

Image.propTypes = {
  className: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  objectCover: PropTypes.string,
};

const Text = ({ as: Component = "div", children, className }) => {
  return <Component className={className}>{children}</Component>;
};

Text.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const ImageFilter = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const buttonCaptions = ["all", "recipe", "book", "ebook"];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <section className="min-h-screen bg-gray-900 w-full flex flex-col py-5">
      <div className="section-center flex w-full items-start md:justify-center md:gap-6 gap-3 flex-wrap items-start">
        {buttonCaptions.map((filter) => (
          <Button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`focus:outline-none border-2 border-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 text-white py-2.5 mb-2 capitalize ${
              activeFilter === filter ? "bg-orange-600" : ""
            }`}
          >
            {filter === "all" ? "Show all" : filter}
          </Button>
        ))}
        <main className="w-full grid lg:grid-cols-4 md:grid-cols-2 gap-x-5 gap-y-8 md:mt-8">
          {filterableData.map((item, index) => (
            <div
              key={index}
              className={`w-full cursor-pointer transition-all duration-200 rounded-lg shadow bg-gray-800 border border-gray-600 ${
                activeFilter === "all" || activeFilter === item.name
                  ? "block"
                  : "hidden"
              }`}
            >
              <Image
                className="rounded-t-lg w-full h-[200px]"
                image={item.src}
                alt={item.name}
                objectCover="object-cover"
              />
              <div className="p-3">
                <Text
                  as="h5"
                  className="mb-2 text-2xl font-bold tracking-tight text-white"
                >
                  {item.title}
                </Text>
                <Text as="p" className="mb-3 font-normal text-gray-400">
                  {item.text}
                </Text>
              </div>
            </div>
          ))}
        </main>
      </div>
    </section>
  );
};

export default ImageFilter;
