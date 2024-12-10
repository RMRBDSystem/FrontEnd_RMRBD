import React from 'react';
import { placesToGo } from '../../data/data';
import { useParams } from 'react-router-dom';

const SinglePlacePage = () => {
  const { id } = useParams();
  const place = placesToGo.find(p => {
    return p.name === id;
  });
  const { name, imageSrc, places } = place;

  return (
    <section className="section">
      <div className="section-center">
        <div className="relative -mx-4 top-0 pt-[17%] overflow-hidden">
          <img
            className="absolute inset-0 object-cover object-top w-full h-full filter blur"
            src={imageSrc}
            alt="page background"
          />
        </div>

        <div className="mt-[-10%] w-1/2 mx-auto">
          <div className="relative pt-[56.25%] overflow-hidden rounded-2xl">
            <img
              className="w-full h-full absolute inset-0 object-cover"
              src={imageSrc}
              alt="page cover"
            />
          </div>
        </div>
        <article className="article-container">
          <h2 className="text-center text-3xl sm:text-4xl italic font-bold">
            {name}
          </h2>
          <h3 className="text-center text-xl sm:text-2xl mt-2">
            Những món ăn ngon với {name}
          </h3>
          {places.map((pl, index) => {
            const { id, name, description, images } = pl;
            return (
              <div className="tip-container" key={id}>
                <h3 className="tip-title">
                  {index + 1}- {name}
                </h3>
                {description?.map((desc, index) => (
                  <p key={index}>{desc}</p>
                ))}
                {images.map(img => (
                  <img key={img.id} src={img.imageSrc} alt={name}></img>
                ))}
              </div>
            );
          })}
        </article>
      </div>
    </section>
  );
};

export default SinglePlacePage;
