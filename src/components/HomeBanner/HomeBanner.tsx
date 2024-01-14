"use client";

import Image from "next/image";
import { FC, Key } from "react";
import Slider from "react-slick";
import dayjs from "dayjs";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { FaListUl } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

type Props = {
  items: {
    id: number;
    poster_path: string;
    release_date?: string;
    first_air_date?: string;
    title?: string;
    name?: string;
  }[];
  type: "Films" | "Séries TV";
  filter: "plus populaires" | "mieux notés" | "mieux notées";
};

const HomeBanner: FC<Props> = ({ items, type, filter }) => {
  const settings = {
    dots: true,
    arrows: true,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  if (!items) return <div>Chargement...</div>;

  const handleClick = (item: Key) => {
    console.log(item);
  };

  return (
    <div className="w-full h-full md:w-4/5 mx-auto mb-20 pb-16">
      <h1 className="text-xl sm:text-2xl md:text-3xl pl-5 tracking-wide">
        Les 20 {type} les {filter}
      </h1>
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id} className="sm:px-1 md:pl-4 mx-auto pt-10 pb-5">
            <div className="relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_TMDB_API_IMAGE_URL}/w342${item.poster_path}`}
                alt={`${item?.title || item?.name} poster`}
                width={0}
                height={0}
                style={{
                  width: 342,
                  minHeight: "auto",
                  height: 513,
                  borderRadius: 5,
                }}
                className="mx-auto"
                sizes="100vw"
              />
              <div className="absolute top-4 right-16 md:top-2 sm:right-2 z-10">
                <Dropdown classNames={{ content: "bg-primary border-primary" }}>
                  <DropdownTrigger>
                    <button>
                      <HiDotsCircleHorizontal className="text-2xl cursor-pointer hover:text-secondary" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu
                    variant="faded"
                    aria-label="Dropdown menu with icons"
                    onAction={(item) => handleClick(item)}
                  >
                    <DropdownItem
                      key={`addToList-${item.id}`}
                      startContent={<FaListUl />}
                    >
                      Ajouter à une liste
                    </DropdownItem>
                    <DropdownItem key="favorite" startContent={<FaHeart />}>
                      Favoris
                    </DropdownItem>
                    <DropdownItem key="followed" startContent={<FaBookmark />}>
                      Liste de suivi
                    </DropdownItem>
                    <DropdownItem key="note" startContent={<FaStar />}>
                      Votre note
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className="pl-14 sm:pl-0">
              <p className="mt-4 font-bold">{item?.title || item?.name}</p>
              <p className="text-gray-400 mt-2">
                {dayjs(item?.release_date).format("DD MMM. YYYY") ||
                  dayjs(item?.first_air_date).format("DD MMM. YYYY")}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;
